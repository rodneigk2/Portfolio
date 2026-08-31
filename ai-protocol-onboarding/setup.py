#!/usr/bin/env python3
"""Apply consented project-local AI host instructions."""

from __future__ import annotations

import argparse
import json
import shutil
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
ONBOARDING = ROOT / "ai-protocol-onboarding"
STATE = ONBOARDING / "state.json"
FEEDBACK = ROOT / "ai-protocol-feedback" / "consent.json"
START = "<!-- AI_PROTOCOL_IDE_BEGIN -->"
END = "<!-- AI_PROTOCOL_IDE_END -->"
TARGETS = [
    "CLAUDE.md",
    "GEMINI.md",
    ".github/copilot-instructions.md",
    ".cursor/rules/ai-execution-protocol.mdc",
]
RESPONSES = {
    "aceito regras e testes": ("accept", "accept"),
    "aceito apenas regras": ("accept", "decline"),
    "aceito apenas testes": ("decline", "accept"),
    "nao aceito": ("decline", "decline"),
}
CONFLICT_PATTERNS = [
    "ignore AGENTS",
    "ignore the protocol",
    "ignore protocol",
    "do not classify risk",
    "never ask confirmation",
    "skip validation",
    "always use all tools",
    "load all skills",
]
RULES = """## AI Execution Protocol

O protocolo deste projeto e obrigatorio para tarefas tecnicas.

1. Leia `AGENTS.md`, `protocol/fast-path.yaml`, `protocol/router.yaml` e o pack
   compacto da rota antes de agir.
2. Classifique risco, use o menor contexto suficiente e nao amplie escopo.
3. Selecione apenas capacidades necessarias e confirme acoes sensiveis.
4. Preserve instrucoes existentes do projeto e nunca sobrescreva arquivos fora
   do escopo autorizado.
5. Valide proporcionalmente ao impacto e declare apenas testes executados.
6. Verifique `ai-protocol-onboarding/state.json` no primeiro contato.
7. Para testes reais, consulte somente `ai-protocol-feedback/consent.json`.

Regras de sistema do host e o pedido atual do usuario continuam superiores.
"""


def is_link(path: Path) -> bool:
    return path.is_symlink() or bool(getattr(path, "is_junction", lambda: False)())


def read_json(path: Path) -> dict:
    validate_target(path)
    return json.loads(path.read_text(encoding="utf-8"))


def write_json(path: Path, data: dict) -> None:
    validate_target(path)
    path.write_text(json.dumps(data, indent=2) + "\n", encoding="utf-8")


def validate_state(data: dict) -> None:
    allowed = {
        "status": {"pending", "completed"},
        "host_rules": {"pending", "accepted", "declined"},
        "real_tests": {"pending", "accepted", "declined"},
        "host_enforcement": {"best_effort"},
    }
    for field, values in allowed.items():
        if data.get(field) not in values:
            raise ValueError(f"invalid_state:{field}")
    configured = data.get("configured_files")
    if not isinstance(configured, list) or any(item not in TARGETS for item in configured):
        raise ValueError("invalid_state:configured_files")
    if data.get("host_rules") == "accepted" and sorted(configured) != sorted(TARGETS):
        raise ValueError("invalid_state:accepted_host_files")
    if data.get("host_rules") in {"pending", "declined"} and configured:
        raise ValueError("invalid_state:unexpected_host_files")
    completed = data.get("status") == "completed"
    choices_complete = (
        data.get("host_rules") in {"accepted", "declined"}
        and data.get("real_tests") in {"accepted", "declined"}
    )
    if completed != choices_complete:
        raise ValueError("invalid_state:completion_mismatch")


def audit_errors() -> list[str]:
    errors: list[str] = []
    try:
        state = read_json(STATE)
        validate_state(state)
    except (json.JSONDecodeError, OSError, ValueError) as exc:
        return [f"state_invalid:{exc}"]
    if state.get("status") != "completed":
        errors.append("onboarding_not_completed")
    if state.get("host_rules") == "accepted":
        for target in TARGETS:
            path = ROOT / target
            if not path.exists():
                errors.append(f"host_rule_missing:{target}")
                continue
            try:
                validate_target(path)
                text = path.read_text(encoding="utf-8", errors="ignore")
            except (OSError, ValueError) as exc:
                errors.append(f"host_rule_unreadable:{target}:{exc}")
                continue
            lowered = text.lower()
            if START not in text or END not in text:
                errors.append(f"host_rule_marker_missing:{target}")
            for pattern in CONFLICT_PATTERNS:
                if pattern.lower() in lowered:
                    errors.append(f"instruction_conflict:{target}:{pattern}")
    try:
        feedback = read_json(FEEDBACK)
        expected_tests = state.get("real_tests") == "accepted"
        if feedback.get("local_collection") is not expected_tests:
            errors.append("feedback_consent_mismatch")
        if feedback.get("remote_upload") is not False:
            errors.append("feedback_remote_upload_not_false")
    except (json.JSONDecodeError, OSError, ValueError) as exc:
        errors.append(f"feedback_state_invalid:{exc}")
    return errors


def marked_block(target: str) -> str:
    body = f"{START}\n{RULES.strip()}\n{END}\n"
    if target.endswith(".mdc"):
        return "---\ndescription: AI Execution Protocol mandatory project rules\nalwaysApply: true\n---\n\n" + body
    return body


def backup(path: Path, backup_root: Path) -> None:
    if not path.exists():
        return
    destination = backup_root / path.relative_to(ROOT)
    validate_target(destination)
    destination.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(path, destination)


def validate_target(path: Path) -> None:
    resolved_root = ROOT.resolve()
    resolved_parent = path.parent.resolve()
    if resolved_root != resolved_parent and resolved_root not in resolved_parent.parents:
        raise ValueError(f"target_outside_project:{path}")
    if is_link(path):
        raise ValueError(f"symlink_target_forbidden:{path.relative_to(ROOT)}")


def merge(path: Path, block: str, backup_root: Path) -> str:
    validate_target(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    if not path.exists():
        path.write_text(block, encoding="utf-8")
        return "created"
    backup(path, backup_root)
    text = path.read_text(encoding="utf-8")
    if START in text and END in text:
        before, rest = text.split(START, 1)
        _, after = rest.split(END, 1)
        content = before.rstrip() + "\n\n" + block[block.index(START):] + after
        path.write_text(content.strip() + "\n", encoding="utf-8")
        return "updated"
    path.write_text((block + "\n" + text).strip() + "\n", encoding="utf-8")
    return "prepended"


def set_feedback(accepted: bool) -> None:
    validate_target(FEEDBACK)
    collector = FEEDBACK.parent / "collector.py"
    validate_target(collector)
    flag = "--accept" if accepted else "--decline"
    proc = subprocess.run(
        [sys.executable, str(collector), "consent", flag],
        cwd=ROOT,
        text=True,
        capture_output=True,
    )
    if proc.returncode:
        raise RuntimeError(proc.stdout.strip() or proc.stderr.strip())


def organize_aep_files() -> None:
    organizer = ONBOARDING / "organize.py"
    validate_target(organizer)
    proc = subprocess.run(
        [sys.executable, str(organizer), "apply"],
        cwd=ROOT,
        text=True,
        capture_output=True,
    )
    output = (proc.stdout + proc.stderr).strip()
    if output:
        print(output)
    if proc.returncode:
        raise RuntimeError(output or "organization_failed")


def apply(host_rules: str, real_tests: str) -> int:
    state = read_json(STATE)
    validate_state(state)
    state["host_enforcement"] = "best_effort"
    configured: list[str] = []
    changed: list[tuple[Path, bytes | None]] = []
    validate_target(FEEDBACK)
    validate_target(FEEDBACK.parent / "collector.py")
    state_before = STATE.read_bytes()
    feedback_before = FEEDBACK.read_bytes()
    try:
        if host_rules == "accept":
            stamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
            backup_root = ROOT / ".ai-protocol-backup" / f"onboarding-{stamp}"
            organize_aep_files()
            for target in TARGETS:
                path = ROOT / target
                validate_target(path)
                changed.append((path, path.read_bytes() if path.exists() else None))
                result = merge(path, marked_block(target), backup_root)
                configured.append(target)
                print(f"{result}:{target}")
            state["host_rules"] = "accepted"
        else:
            state["host_rules"] = "declined"
        set_feedback(real_tests == "accept")
        state["real_tests"] = "accepted" if real_tests == "accept" else "declined"
        state["status"] = "completed"
        state["configured_files"] = configured
        state["completed_at"] = datetime.now(timezone.utc).isoformat(timespec="seconds")
        write_json(STATE, state)
        errors = audit_errors()
        if errors:
            raise ValueError("post_verify_failed:" + ",".join(errors))
    except (OSError, RuntimeError, ValueError) as exc:
        for path, previous in reversed(changed):
            if previous is None:
                path.unlink(missing_ok=True)
            else:
                path.parent.mkdir(parents=True, exist_ok=True)
                path.write_bytes(previous)
        FEEDBACK.write_bytes(feedback_before)
        STATE.write_bytes(state_before)
        print(f"FAIL:{exc}")
        return 2

    print("ONBOARDING_COMPLETED")
    print("ONBOARDING_VERIFY:PASS")
    return 0


def respond(answer: str) -> int:
    normalized = " ".join(answer.lower().strip().split())
    choice = RESPONSES.get(normalized)
    if not choice:
        print("FAIL: invalid onboarding response")
        return 1
    return apply(*choice)


def verify() -> int:
    errors = audit_errors()
    print("PASS" if not errors else "FAIL")
    for error in errors:
        print(error)
    return 1 if errors else 0


def compliance() -> int:
    try:
        state = read_json(STATE)
        validate_state(state)
    except (json.JSONDecodeError, OSError, ValueError) as exc:
        print(json.dumps({"status": "blocked", "reason": str(exc)}, indent=2))
        return 2
    errors = audit_errors()
    if errors:
        status = "weak" if state.get("status") == "completed" else "blocked"
    elif state.get("host_rules") == "accepted":
        status = "best_effort"
    else:
        status = "weak"
    print(
        json.dumps(
            {
                "status": status,
                "host_enforcement": state.get("host_enforcement", "best_effort"),
                "host_rules": state.get("host_rules"),
                "real_tests": state.get("real_tests"),
                "configured_files": state.get("configured_files", []),
                "errors": errors,
                "guarantee": "best_effort_not_physical_enforcement",
            },
            indent=2,
        )
    )
    return 1 if errors else 0


def repair(yes: bool) -> int:
    state = read_json(STATE)
    validate_state(state)
    if state.get("host_rules") != "accepted":
        print("SKIP: host rules were not accepted")
        return 0
    missing = [target for target in TARGETS if not (ROOT / target).exists()]
    if not yes:
        print("PREVIEW: would refresh AI host instruction blocks")
        for target in missing:
            print(f"missing:{target}")
        print("SKIP: rerun with --yes to write")
        return 0
    return apply("accept", "accept" if state.get("real_tests") == "accepted" else "decline")


def main() -> int:
    parser = argparse.ArgumentParser()
    sub = parser.add_subparsers(dest="command", required=True)
    apply_parser = sub.add_parser("apply")
    apply_parser.add_argument("--host-rules", choices=["accept", "decline"], required=True)
    apply_parser.add_argument("--real-tests", choices=["accept", "decline"], required=True)
    respond_parser = sub.add_parser("respond")
    respond_parser.add_argument("answer")
    repair_parser = sub.add_parser("repair")
    repair_parser.add_argument("--yes", action="store_true")
    sub.add_parser("status")
    sub.add_parser("verify")
    sub.add_parser("compliance")
    args = parser.parse_args()
    try:
        if args.command == "apply":
            return apply(args.host_rules, args.real_tests)
        if args.command == "respond":
            return respond(args.answer)
        if args.command == "verify":
            return verify()
        if args.command == "compliance":
            return compliance()
        if args.command == "repair":
            return repair(args.yes)
        state = read_json(STATE)
        validate_state(state)
        print(json.dumps(state, indent=2))
        return 0
    except (json.JSONDecodeError, OSError, ValueError) as exc:
        print(f"FAIL:{exc}")
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
