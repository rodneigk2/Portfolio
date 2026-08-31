#!/usr/bin/env python3
"""Organize AEP-controlled files after explicit host-rules consent."""

from __future__ import annotations

import argparse
import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
AEP_DIRS = [
    ".ai-protocol-run",
    "ai-protocol-feedback/runs",
    "ai-protocol-feedback/outbox",
    "candidate-memory",
    "decisions",
    "memory",
]
AIIGNORE_LINES = [
    "results/",
    "benchmarks/generated/",
    "model-runs/generated/",
    "real-runs/local/",
    "ai-protocol-feedback/runs/",
    "ai-protocol-feedback/outbox/",
    ".ai-protocol-run/",
    "dist/",
    "scripts/__pycache__/",
    "*.pyc",
]
GITIGNORE_LINES = [
    ".ai-protocol-backup/",
    ".ai-protocol-run/",
    "ai-protocol-feedback/runs/",
    "ai-protocol-feedback/outbox/",
]


def validate_target(path: Path) -> None:
    resolved_root = ROOT.resolve()
    resolved_parent = path.parent.resolve()
    if resolved_root != resolved_parent and resolved_root not in resolved_parent.parents:
        raise ValueError(f"target_outside_project:{path}")
    if path.is_symlink() or bool(getattr(path, "is_junction", lambda: False)()):
        raise ValueError(f"symlink_target_forbidden:{path.relative_to(ROOT)}")


def merge_lines(path: Path, lines: list[str]) -> str:
    validate_target(path)
    existing = path.read_text(encoding="utf-8").splitlines() if path.exists() else []
    merged = list(existing)
    for line in lines:
        if line not in merged:
            merged.append(line)
    if merged == existing:
        return f"unchanged:{path.name}"
    path.write_text("\n".join(merged).strip() + "\n", encoding="utf-8")
    return f"updated:{path.name}"


def report(actions: list[str]) -> None:
    target = ROOT / ".ai-protocol-run" / "organization-report.json"
    validate_target(target)
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(
        json.dumps(
            {
                "status": "applied",
                "scope": "aep_controlled_files_only",
                "actions": actions,
                "project_files_policy": "diagnose_only_without_extra_confirmation",
            },
            indent=2,
        )
        + "\n",
        encoding="utf-8",
    )


def apply() -> int:
    actions: list[str] = []
    for item in AEP_DIRS:
        path = ROOT / item
        validate_target(path)
        path.mkdir(parents=True, exist_ok=True)
        actions.append(f"ensure_dir:{item}")
    actions.append(merge_lines(ROOT / ".aiignore", AIIGNORE_LINES))
    actions.append(merge_lines(ROOT / ".gitignore", GITIGNORE_LINES))
    report(actions)
    for action in actions:
        print(f"organized:{action}")
    return 0


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("command", choices=["apply"])
    args = parser.parse_args()
    if args.command == "apply":
        return apply()
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
