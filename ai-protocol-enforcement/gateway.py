#!/usr/bin/env python3
"""Local enforcement gateway for AI Execution Protocol tool calls."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parent
POLICY = ROOT / "policy.json"
SENSITIVE_OPERATIONS = {"write", "publish", "destructive"}


def load_json(path: str | None) -> dict:
    if path == "-":
        return json.loads(sys.stdin.read())
    if path:
        return json.loads(Path(path).read_text(encoding="utf-8-sig"))
    return {}


def load_policy() -> dict:
    return json.loads(POLICY.read_text(encoding="utf-8"))


def as_list(value: object) -> list:
    if value is None:
        return []
    return value if isinstance(value, list) else [value]


def result(status: str, reason: str, **extra: object) -> int:
    payload = {"status": status, "reason": reason, **extra}
    print(json.dumps(payload, indent=2, sort_keys=True))
    return 0 if status == "allowed" else 2


def plan_errors(plan: dict, policy: dict) -> list[str]:
    errors: list[str] = []
    risk = plan.get("risk_level")
    if risk not in [0, 1, 2, 3]:
        return ["invalid_risk_level"]
    level = policy["risk_levels"].get(str(risk), policy["default"])
    selected = as_list(plan.get("selected_capabilities"))
    allowed_ops = set(level.get("allowed_operations", []))
    caps = policy.get("capabilities", {})
    external = 0
    if not selected and risk >= 2:
        errors.append("missing_capability_plan")
    for capability in selected:
        if not isinstance(capability, str) or capability not in caps:
            errors.append(f"unknown_capability:{capability}")
            continue
        if caps[capability].get("external"):
            external += 1
        cap_ops = set(caps[capability].get("operations", []))
        if not cap_ops & allowed_ops:
            errors.append(f"capability_has_no_allowed_operation:{capability}")
    if external > int(level.get("max_external_capabilities", 0)):
        errors.append("external_capability_budget_exceeded")
    if level.get("require_explicit_scope"):
        scope = str(plan.get("operation_scope", "")).strip()
        if not scope or scope in {"*", "all", "entire_system", "global"}:
            errors.append("explicit_scope_required")
    return errors


def validate_plan(plan: dict) -> int:
    policy = load_policy()
    errors = plan_errors(plan, policy)
    if errors:
        return result("blocked", "plan_invalid", errors=errors)
    return result("allowed", "plan_valid")


def check_call(data: dict) -> int:
    policy = load_policy()
    plan = data.get("plan")
    call = data.get("call")
    if not isinstance(plan, dict) or not isinstance(call, dict):
        return result("blocked", "missing_plan_or_call")
    errors = plan_errors(plan, policy)
    if errors:
        return result("blocked", "plan_invalid", errors=errors)
    risk = plan["risk_level"]
    level = policy["risk_levels"].get(str(risk), policy["default"])
    capability = call.get("capability")
    operation = call.get("operation")
    selected = set(as_list(plan.get("selected_capabilities")))
    caps = policy.get("capabilities", {})
    if capability not in selected:
        return result("blocked", "capability_not_selected", capability=capability)
    if capability not in caps:
        return result("blocked", "unknown_capability", capability=capability)
    if operation not in caps[capability].get("operations", []):
        return result("blocked", "operation_not_supported", operation=operation)
    if operation not in level.get("allowed_operations", []):
        return result("blocked", "operation_not_allowed_for_risk", operation=operation)
    required = set(level.get("confirmation_required_for", []))
    required.update(caps[capability].get("confirmation_required_for", []))
    if operation in required and call.get("confirmed") is not True:
        return result("blocked", "confirmation_required", operation=operation)
    if operation in SENSITIVE_OPERATIONS:
        target = str(call.get("target", "")).strip()
        if not target or target in {"*", "all", "global", "entire_system"}:
            return result("blocked", "sensitive_operation_requires_target")
    return result("allowed", "call_allowed", capability=capability, operation=operation)


def main() -> int:
    parser = argparse.ArgumentParser()
    sub = parser.add_subparsers(dest="command", required=True)
    plan = sub.add_parser("validate-plan")
    plan.add_argument("--input", required=True)
    call = sub.add_parser("check-call")
    call.add_argument("--input", required=True)
    args = parser.parse_args()
    if args.command == "validate-plan":
        return validate_plan(load_json(args.input))
    return check_call(load_json(args.input))


if __name__ == "__main__":
    raise SystemExit(main())
