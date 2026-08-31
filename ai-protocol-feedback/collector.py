#!/usr/bin/env python3
"""Local, visible and consent-based feedback collector for AI Protocol."""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import shutil
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path


ROOT = Path(__file__).resolve().parent
CONSENT_FILE = ROOT / "consent.json"
RUNS = ROOT / "runs"
OUTBOX = ROOT / "outbox"
RUN_ID_RE = re.compile(r"^run_\d{8}T\d{6}\d{6}Z_[a-z0-9_-]{1,80}$")
ALLOWED_FIELDS = [
    "user_request",
    "improved_prompt",
    "result_summary",
    "validation_summary",
    "error_category",
    "user_feedback",
]
REDACTIONS = [
    (re.compile(r"-----BEGIN .*?PRIVATE KEY.*?-----END .*?PRIVATE KEY-----", re.S), "[REDACTED_PRIVATE_KEY]"),
    (re.compile(r"(?i)\b(api[_-]?key|token|password|senha|client[_-]?secret)\s*[:=]\s*\S+"), r"\1=[REDACTED_SECRET]"),
    (re.compile(r"\b(?:AKIA|ASIA)[A-Z0-9]{16}\b"), "[REDACTED_AWS_KEY]"),
    (re.compile(r"\beyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\b"), "[REDACTED_JWT]"),
    (re.compile(r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b"), "[REDACTED_EMAIL]"),
    (re.compile(r"(?i)\b[A-Z]:\\Users\\[^\\\s]+"), "[REDACTED_USER_HOME]"),
]


def is_link(path: Path) -> bool:
    return path.is_symlink() or bool(getattr(path, "is_junction", lambda: False)())


def validate_storage() -> None:
    root = ROOT.resolve()
    for path in (CONSENT_FILE, RUNS, OUTBOX):
        current = root
        for part in path.relative_to(ROOT).parts:
            current = current / part
            if current.exists() and is_link(current):
                raise ValueError(f"symlink_storage_forbidden:{path.name}")
        parent = current.parent.resolve()
        if parent != root and root not in parent.parents:
            raise ValueError(f"storage_outside_feedback_root:{path.name}")


def now() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


def read_json(path: Path, default: dict | None = None) -> dict:
    if not path.exists():
        return default or {}
    return json.loads(path.read_text(encoding="utf-8"))


def write_json(path: Path, data: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, indent=2, ensure_ascii=True) + "\n", encoding="utf-8")


def consent_state() -> dict:
    return read_json(
        CONSENT_FILE,
        {
            "status": "pending",
            "local_collection": False,
            "prepare_return_packages": False,
            "remote_upload": False,
        },
    )


def set_consent(accepted: bool) -> bool:
    current = consent_state()
    framework_root = current.get("framework_root")
    importer = (
        Path(framework_root) / "scripts" / "import_feedback_batch.py"
        if framework_root
        else None
    )
    local_return = bool(accepted and importer and importer.exists())
    write_json(
        CONSENT_FILE,
        {
            "status": "accepted" if accepted else "declined",
            "local_collection": accepted,
            "local_framework_return": local_return,
            "framework_root": framework_root,
            "max_runs_per_protocol_version": current.get(
                "max_runs_per_protocol_version", 20
            ),
            "usage_by_protocol_version": current.get("usage_by_protocol_version", {}),
            "limit_notified_versions": current.get("limit_notified_versions", []),
            "prepare_return_packages": False,
            "remote_upload": False,
            "decided_at": now(),
            "revocable": True,
            "collected_fields": ALLOWED_FIELDS,
            "never_collected": [
                "source_files",
                "raw_diffs",
                "environment_files",
                "credentials",
                "customer_data",
                "full_logs",
            ],
        },
    )
    return True


def redact(value: str) -> tuple[str, int]:
    output = value[:12000]
    count = 0
    for pattern, replacement in REDACTIONS:
        output, applied = pattern.subn(replacement, output)
        count += applied
    return output, count


def safe_label(value: str) -> str:
    return re.sub(r"[^a-z0-9_-]+", "-", value.lower()).strip("-") or "task"


def usage_for(consent: dict, version: str) -> dict:
    usage = consent.setdefault("usage_by_protocol_version", {})
    return usage.setdefault(version, {"recorded": 0, "synced": 0})


def check_limit(consent: dict, version: str) -> bool:
    maximum = int(consent.get("max_runs_per_protocol_version", 20))
    usage = usage_for(consent, version)
    if int(usage.get("recorded", 0)) < maximum:
        return False
    notified = consent.setdefault("limit_notified_versions", [])
    if version not in notified:
        notified.append(version)
        write_json(CONSENT_FILE, consent)
        print(f"LIMIT_REACHED_NOTIFY_USER:{version}:{maximum}")
    else:
        print(f"LIMIT_REACHED:{version}:{maximum}")
    return True


def increment_usage(version: str, field: str) -> None:
    consent = consent_state()
    usage = usage_for(consent, version)
    usage[field] = int(usage.get(field, 0)) + 1
    write_json(CONSENT_FILE, consent)


def create_batch(runs: list[Path]) -> Path:
    stamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%S%fZ")
    target = OUTBOX / f"batch_{stamp}"
    target.mkdir(parents=True)
    for run in runs:
        shutil.copytree(run, target / run.name)
    write_json(
        target / "manifest.json",
        {
            "created_at": now(),
            "runs": [run.name for run in runs],
            "remote_upload": False,
            "local_return_consent": True,
            "external_share_consent": False,
            "automatic_local_return": True,
        },
    )
    return target


def sync_batch(batch: Path, version: str) -> int:
    consent = consent_state()
    if not consent.get("local_framework_return"):
        print("local_sync:disabled")
        return 0
    framework_root = consent.get("framework_root")
    if not framework_root:
        print("local_sync:unconfigured")
        return 0
    importer = Path(framework_root) / "scripts" / "import_feedback_batch.py"
    proc = subprocess.run(
        [
            sys.executable,
            str(importer),
            "--batch",
            str(batch),
            "--consent-to-local-return",
        ],
        text=True,
        capture_output=True,
    )
    if proc.returncode:
        print("sync_failed"); print(proc.stdout.strip() or proc.stderr.strip())
        return proc.returncode
    print("synced_to_framework")
    print(proc.stdout.strip())
    increment_usage(version, "synced")
    return 0


def record(input_name: str) -> int:
    consent = consent_state()
    if not consent.get("local_collection"):
        print("BLOCKED: local collection consent is not active")
        return 2
    if input_name != "-":
        print("FAIL: record input must use stdin")
        return 1
    raw = sys.stdin.read(65537)
    if len(raw) > 65536:
        print("FAIL: input exceeds 65536 bytes")
        return 1
    source = json.loads(raw)
    required = {"task_type", "risk_level", "outcome"}
    missing = sorted(required - source.keys())
    if missing:
        print(f"FAIL: missing fields {','.join(missing)}")
        return 1
    if source["risk_level"] not in [0, 1, 2, 3]:
        print("FAIL: invalid risk_level")
        return 1
    if source["outcome"] not in ["pass", "partial", "fail"]:
        print("FAIL: invalid outcome")
        return 1
    version = str(source.get("protocol_version", "unknown"))
    if check_limit(consent, version):
        return 0

    stamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%S%fZ")
    run_id = f"run_{stamp}_{safe_label(str(source['task_type']))}"
    target = RUNS / run_id
    target.mkdir(parents=True)
    redactions = 0
    stored_fields = []
    sanitized_content: dict[str, str] = {}
    for field in ALLOWED_FIELDS:
        value = source.get(field)
        if not isinstance(value, str) or not value.strip():
            continue
        clean, applied = redact(value)
        redactions += applied
        (target / f"{field}.txt").write_text(clean.strip() + "\n", encoding="utf-8")
        stored_fields.append(field)
        sanitized_content[field] = clean.strip()
    metadata = {
        "id": run_id,
        "type": "real_run_feedback",
        "created_at": now(),
        "protocol_version": version,
        "project_alias": safe_label(str(source.get("project_alias", "anonymous-project"))),
        "task_type": safe_label(str(source["task_type"])),
        "risk_level": source["risk_level"],
        "outcome": source["outcome"],
        "stored_fields": stored_fields,
        "redactions_applied": redactions,
        "source_content_hash": hashlib.sha256(
            json.dumps(sanitized_content, sort_keys=True).encode("utf-8")
        ).hexdigest(),
        "remote_upload": False,
    }
    write_json(target / "metadata.json", metadata)
    increment_usage(version, "recorded")
    print(f"stored:{target}")
    if not consent.get("local_framework_return"):
        print("local_sync:disabled")
        return 0
    batch = create_batch([target])
    return sync_batch(batch, version)


def prepare_return(framework_root: str | None = None) -> int:
    if not consent_state().get("local_collection"):
        print("BLOCKED: local collection consent is not active")
        return 2
    runs = sorted(path for path in RUNS.glob("run_*") if path.is_dir())
    if not runs:
        print("SKIP: no local runs")
        return 0
    target = create_batch(runs)
    print(f"prepared:{target}")
    print("NOT SENT: review this folder before any future submission")
    if framework_root:
        importer = Path(framework_root).resolve() / "scripts" / "import_feedback_batch.py"
        print(
            "preview_command:"
            f'python "{importer}" --batch "{target}"'
        )
        print(
            "share_command:"
            f'python "{importer}" --batch "{target}" --consent-to-local-return'
        )
    return 0


def revoke(run_id: str, yes: bool) -> int:
    if not RUN_ID_RE.fullmatch(run_id):
        print("FAIL: invalid run id"); return 1
    target = (RUNS / run_id).resolve()
    if target.parent != RUNS.resolve() or not target.exists():
        print("FAIL: run not found")
        return 1
    if not yes:
        print(f"PREVIEW: would revoke local copies of {run_id}")
        return 0
    shutil.rmtree(target)
    removed_copies = 0
    for copy in OUTBOX.glob(f"batch_*/{run_id}"):
        if copy.is_dir() and copy.parent.parent == OUTBOX:
            shutil.rmtree(copy)
            removed_copies += 1
    consent = consent_state()
    framework_root = consent.get("framework_root")
    if framework_root:
        importer = Path(framework_root).resolve() / "scripts" / "import_feedback_batch.py"
        proc = subprocess.run(
            [
                sys.executable,
                str(importer),
                "--revoke-run",
                run_id,
                "--consent-to-local-return",
            ],
            text=True,
            capture_output=True,
        )
        if proc.returncode:
            print("received_revocation_failed")
            print(proc.stdout.strip() or proc.stderr.strip())
            return proc.returncode
        match = re.search(r":(\d+)$", proc.stdout.strip())
        removed_copies += int(match.group(1)) if match else 0
    print(f"revoked:{run_id}")
    print(f"removed_copies:{removed_copies}")
    return 0


def main() -> int:
    try:
        validate_storage()
    except ValueError as exc:
        print(f"BLOCKED:{exc}")
        return 2
    parser = argparse.ArgumentParser()
    sub = parser.add_subparsers(dest="command", required=True)
    sub.add_parser("status")
    consent = sub.add_parser("consent")
    consent.add_argument("--accept", action="store_true")
    consent.add_argument("--decline", action="store_true")
    item = sub.add_parser("record")
    item.add_argument("--input", required=True)
    prepare = sub.add_parser("prepare-return")
    prepare.add_argument("--framework-root")
    limit = sub.add_parser("limit")
    limit.add_argument("--max", type=int, required=True)
    remove = sub.add_parser("revoke")
    remove.add_argument("run_id")
    remove.add_argument("--yes", action="store_true")
    args = parser.parse_args()
    if args.command == "status":
        print(json.dumps(consent_state(), indent=2))
        return 0
    if args.command == "consent":
        if args.accept == args.decline:
            print("FAIL: choose --accept or --decline")
            return 1
        if not set_consent(args.accept):
            return 2
        print("accepted" if args.accept else "declined")
        return 0
    if args.command == "record":
        return record(args.input)
    if args.command == "prepare-return":
        return prepare_return(args.framework_root)
    if args.command == "limit":
        if args.max < 1 or args.max > 1000:
            print("FAIL: max must be between 1 and 1000")
            return 1
        state = consent_state()
        state["max_runs_per_protocol_version"] = args.max
        write_json(CONSENT_FILE, state)
        print(f"limit:{args.max}")
        return 0
    return revoke(args.run_id, args.yes)


if __name__ == "__main__":
    raise SystemExit(main())
