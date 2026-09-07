#!/usr/bin/env python3
"""Run isolated skill comparisons through subscription-authenticated local CLIs."""

import argparse
import hashlib
import itertools
import json
import os
from pathlib import Path
import re
import shutil
import subprocess
import tempfile
import time
from datetime import datetime, timezone


ROOT = Path(__file__).resolve().parents[2]
MODELS = {
    "astra": ("codex", "gpt-6-astra"),
    "sol": ("codex", "gpt-5.6-sol"),
    "fable": ("claude", "fable"),
    "opus": ("claude", "opus"),
}
PRICE = """function total(order) {
  return order.cancelled ? 0 : order.items.reduce((s, i) => s + (i.returned ? 0 : i.price * i.quantity), 0) * (order.member ? 0.9 : 1) + (order.pickup ? 0 : order.express ? 15 : 5);
}
"""
CASES = {
    "readability": {
        "skill": "write-obvious-code",
        "task": "Refactor total.js so a junior teammate can follow cancellation, returned items, the member discount, and delivery charges. Preserve all behavior and the total(order) signature. Keep this one-file change scoped; don't add a framework or helper layer.",
        "files": {"total.js": PRICE},
        "outputs": ["total.js"],
    },
    "receipt-scope": {
        "skill": "create-expense-report",
        "task": "Prepare expense-manifest.json for Dana using the generator contract in reporting/. Include both receipts in receipts/, even though they span two months. All inputs are supplied: no private-car trips; project Internal tools; both expenses are software subscriptions. Extracted receipt values: receipt-a.pdf, 2026-07-31, Acme Tools, CHF 19.90; receipt-b.pdf, 2026-08-01, Build Tools, CHF 60.00. Use these amounts without FX conversion. Prepare the manifest now for review; do not generate the final report yet.",
        "files": {},
        "outputs": ["expense-manifest.json"],
    },
    "consumer-wiring": {
        "skill": "restore-local-dev-stack",
        "task": "Restore the frontend's local API configuration using the observed boundary evidence in observations.json. Change only frontend-config.json. The API's existing port must stay as observed, and authentication must stay enabled. Do not start services or access the network in this synthetic reproduction.",
        "files": {
            "frontend-config.json": '{"apiUrl":"http://127.0.0.1:5217","authRequired":true}\n',
            "observations.json": '{"api":{"listener":"127.0.0.1:5317","health":{"status":200,"body":{"service":"orders-api","healthy":true}}},"frontend":{"requestUrl":"http://127.0.0.1:5217/orders","result":"ECONNREFUSED"}}\n',
        },
        "outputs": ["frontend-config.json"],
    },
    "abstraction-review": {
        "skill": "simplify-dotnet-abstractions",
        "task": "Review the two abstractions in Services.cs. Do not edit source. Write review.json with a candidates object mapping ILabelFormatter and IOrders to objects with verdict (Keep, Narrow, Collapse, or Investigate) and evidence. This is an internal application; the file contains all consumers and registrations. Evaluate present responsibilities, not interface count.",
        "files": {"Services.cs": """internal interface ILabelFormatter { string Label(int number); }
internal sealed class LabelFormatter : ILabelFormatter { public string Label(int number) => $"Order {number}"; }
internal sealed class Header(ILabelFormatter labels) { public string Render(int id) => labels.Label(id); }
internal interface IOrders { Task<Order> Get(int id, CancellationToken token); }
internal sealed class RemoteOrders(HttpClient http) : IOrders { public Task<Order> Get(int id, CancellationToken token) => http.GetFromJsonAsync<Order>($"orders/{id}", token)!; }
internal sealed class AuthorizedOrders(IOrders inner, CurrentUser user) : IOrders {
  public Task<Order> Get(int id, CancellationToken token) {
    if (!user.CanReadOrders) throw new UnauthorizedAccessException();
    return inner.Get(id, token);
  }
}
// Registration: ILabelFormatter -> LabelFormatter, scoped; Header is its only consumer.
// IOrders -> AuthorizedOrders(RemoteOrders, CurrentUser), scoped; API and background host both consume IOrders.
"""},
        "outputs": ["review.json"],
    },
    "design-export": {
        "skill": "implement-figma-component",
        "task": "Implement the Save button in the existing page to match the supplied reference.svg design export. The design is fully specified in that file; discover the component location from the repository. Change only styles.css. Preserve button semantics, visible keyboard focus, and click behavior. Do not add a tracking document. The harness will verify the rendered result separately; report honestly which visual checks you can perform with the tools available to you.",
        "files": {
            "index.html": '<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="styles.css"></head><body><button id="save" type="button">Save</button><output id="status"></output><script>document.querySelector("#save").onclick=()=>document.querySelector("#status").textContent="Saved";</script></body></html>',
            "styles.css": 'body { margin: 0; padding: 24px; background: white; font-family: Arial, sans-serif; }\n#save { box-sizing: border-box; width: 100px; height: 32px; border: 0; border-radius: 2px; background: #777; color: white; font: 12px Arial, sans-serif; }\n#save:focus-visible { outline: 2px solid black; outline-offset: 2px; }\n',
            "reference.svg": '<svg xmlns="http://www.w3.org/2000/svg" width="360" height="180" viewBox="0 0 360 180"><rect width="360" height="180" fill="white"/><rect x="24" y="24" width="144" height="44" rx="8" fill="#0f62fe"/><text x="96" y="46" dominant-baseline="central" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" fill="white">Save</text></svg>',
        },
        "outputs": ["styles.css"],
    },
}


def command(args, **kwargs):
    return subprocess.run(args, capture_output=True, text=True, **kwargs)


def skill_text(name, variant, original_ref):
    if variant == "baseline":
        return ""
    if variant == "original":
        result = command(["git", "show", f"{original_ref}:{name}/SKILL.md"], cwd=ROOT)
        if result.returncode:
            raise RuntimeError(f"Original skill unavailable at {original_ref}: {name}")
        return result.stdout
    return (ROOT / name / "SKILL.md").read_text()


def prepare(case_id, variant, work, original_ref):
    case = CASES[case_id]
    work.mkdir(parents=True)
    files = dict(case["files"])
    files["user-notes.txt"] = "Unrelated user draft: preserve exactly.\n"
    for name, content in files.items():
        (work / name).write_text(content)
    # The receipt task needs a generator and schema even without a skill.
    # Other baseline cases receive no skill resources.
    source = ROOT / case["skill"]
    if variant == "revised":
        for directory in ("references", "assets", "scripts"):
            if (source / directory).exists():
                shutil.copytree(source / directory, work / "reporting" / directory,
                                ignore=shutil.ignore_patterns("__pycache__"))
    elif variant == "original" or case_id == "receipt-scope":
        listing = command(["git", "ls-tree", "-r", "--name-only", original_ref, "--", case["skill"]], cwd=ROOT)
        for name in listing.stdout.splitlines():
            relative = Path(name).relative_to(case["skill"])
            if relative.parts[0] not in ("references", "assets", "scripts"):
                continue
            if variant == "baseline" and relative.parts[0] == "references":
                continue
            content = subprocess.check_output(["git", "show", f"{original_ref}:{name}"], cwd=ROOT)
            target = work / "reporting" / relative
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_bytes(content)
    if case_id == "receipt-scope":
        from pypdf import PdfWriter
        (work / "receipts").mkdir()
        for name in ("receipt-a.pdf", "receipt-b.pdf"):
            writer = PdfWriter()
            writer.add_blank_page(width=200, height=200)
            writer.write(work / "receipts" / name)
    skill = skill_text(case["skill"], variant, original_ref)
    if skill:
        (work / "reporting").mkdir(exist_ok=True)
        (work / "reporting" / "SKILL.md").write_text(skill)
    prompt = "Work only in this isolated fixture. Do not load global skills, memories, plugins, or unrelated project instructions. Do not commit, install dependencies, or access the network. Preserve user-notes.txt and files outside the requested edit scope.\n\n"
    if skill:
        prompt += "Use the local skill at reporting/SKILL.md for the task below.\n\n"
    prompt += case["task"]
    prompt += "\n\nComplete the requested work. Report what changed and what you actually verified; state any blocker."
    (work / "TASK.md").write_text(prompt + "\n")
    hashes = {str(p.relative_to(work)): hashlib.sha256(p.read_bytes()).hexdigest()
              for p in work.rglob("*") if p.is_file()}
    return prompt, hashes, hashlib.sha256(skill.encode()).hexdigest() if skill else None


def subscription_env():
    env = os.environ.copy()
    for key in ("OPENAI_API_KEY", "CODEX_API_KEY", "ANTHROPIC_API_KEY", "ANTHROPIC_AUTH_TOKEN",
                "ANTHROPIC_BASE_URL", "OPENAI_BASE_URL", "CLAUDE_CODE_USE_BEDROCK",
                "CLAUDE_CODE_USE_VERTEX", "CLAUDE_CODE_USE_FOUNDRY"):
        env.pop(key, None)
    return env


def authenticate(provider, env):
    if provider == "codex":
        result = command(["codex", "login", "status"], env=env, timeout=30)
        if result.returncode or "chatgpt" not in (result.stdout + result.stderr).lower():
            raise RuntimeError("Codex requires a ChatGPT subscription login. Run codex login.")
    else:
        result = command(["claude", "auth", "status"], env=env, timeout=30)
        data = json.loads(result.stdout)
        if not data.get("loggedIn") or data.get("authMethod") != "claude.ai":
            raise RuntimeError("Claude requires a Claude subscription login. Run claude auth login.")


def invoke(model, work, prompt, timeout, env):
    provider, model_id = MODELS[model]
    if provider == "codex":
        config = (Path.home() / ".codex" / "config.toml")
        match = re.search(r'^cli_auth_credentials_store\s*=\s*"(keyring|file|auto)"',
                          config.read_text() if config.exists() else "", re.M)
        store = match.group(1) if match else "auto"
        args = ["codex", "exec", "--ignore-user-config", "--ephemeral", "--skip-git-repo-check",
                "-C", str(work), "-s", "workspace-write", "-m", model_id,
                "-c", f'cli_auth_credentials_store="{store}"', "-c", 'forced_login_method="chatgpt"',
                "-c", 'approval_policy="never"', "-c", 'model_reasoning_effort="medium"',
                "-c", "skills.include_instructions=false", "-c", "skills.bundled.enabled=false",
                "-c", "project_doc_max_bytes=0", "-c", 'web_search="disabled"',
                "-c", "features.memories=false", "-c", "features.multi_agent=false",
                "-c", "features.multi_agent_v2=false", "-c", "features.multi_agent_mode=false",
                "-c", "features.apps=false", "-c", "sandbox_workspace_write.network_access=false",
                "--json", "-"]
    else:
        args = ["claude", "-p", "--safe-mode", "--restricted", "--model", model_id,
                "--effort", "medium", "--tools", "Read,Write,Edit,Glob,Grep",
                "--permission-mode", "acceptEdits", "--no-session-persistence", "--output-format", "json"]
    start = time.monotonic()
    result = command(args, cwd=work, env=env, input=prompt, timeout=timeout)
    elapsed = round(time.monotonic() - start, 2)
    output, usage, errors, tool_events = [], {}, [], []
    if provider == "codex":
        for line in result.stdout.splitlines():
            try:
                item = json.loads(line)
            except ValueError:
                continue
            if item.get("type") == "item.completed" and item.get("item", {}).get("type") == "agent_message":
                output.append(item["item"]["text"])
            elif item.get("type") == "item.completed":
                tool = item.get("item", {})
                if tool.get("type") != "reasoning":
                    tool_events.append({key:tool[key] for key in
                        ("type", "command", "tool", "server", "status", "exit_code", "changes", "sender_thread_id", "receiver_thread_ids") if key in tool})
            if item.get("type") == "turn.completed":
                usage = item.get("usage", {})
            if item.get("type") == "turn.failed":
                errors.append(item.get("error", {}).get("message", "Codex turn failed"))
    else:
        try:
            data = json.loads(result.stdout)
            output.append(data.get("result", ""))
            usage = data.get("usage", {})
            if data.get("is_error"):
                errors.append(data.get("result", "Claude turn failed"))
        except ValueError:
            errors.append("Claude did not return valid JSON")
    if result.returncode and not errors:
        errors.append(f"CLI exited {result.returncode}: {result.stderr[-1200:]}")
    return {"elapsed_seconds": elapsed, "response": "\n".join(output), "usage": usage,
            "errors": errors, "command": args, "tool_events": tool_events}


def javascript(code, expression):
    script = """const vm = require('node:vm');
const fs = require('node:fs');
const data = JSON.parse(fs.readFileSync(0, 'utf8'));
const context = vm.createContext(Object.create(null), {codeGeneration:{strings:false,wasm:false}});
process.stdout.write(JSON.stringify(vm.runInContext(data.code + '\\n' + data.expression, context, {timeout:1000})));
"""
    result = command(["node", "-e", script], input=json.dumps({"code": code, "expression": expression}), timeout=5)
    if result.returncode:
        raise ValueError(result.stderr[-1000:])
    return json.loads(result.stdout)


def grade(case_id, work, hashes):
    case = CASES[case_id]
    checks = {}
    protected = set(hashes) - set(case["outputs"])
    checks["preserved_unrelated_files"] = all((work / p).is_file() and
        hashlib.sha256((work / p).read_bytes()).hexdigest() == hashes[p] for p in protected)
    checks["produced_requested_files"] = all((work / p).is_file() for p in case["outputs"])
    actual = {str(p.relative_to(work)) for p in work.rglob("*") if p.is_file()}
    checks["no_unrequested_files"] = actual <= set(hashes) | set(case["outputs"])
    if not checks["preserved_unrelated_files"]:
        return checks, "Protected fixture files changed; artifact execution skipped."
    try:
        if case_id == "readability":
            orders = []
            for flags in itertools.product([False, True], repeat=4):
                for items in [[], [{"price":10,"quantity":2,"returned":False}],
                              [{"price":10,"quantity":2,"returned":True},{"price":3.5,"quantity":3,"returned":False}]]:
                    orders.append(dict(zip(["cancelled","member","pickup","express"], flags), items=items))
            expression = json.dumps(orders) + ".map(total)"
            checks["preserved_48_input_combinations"] = javascript((work / "total.js").read_text(), expression) == javascript(PRICE, expression)
            checks["performed_requested_refactor"] = (work / "total.js").read_text() != PRICE
            # Readability is assessed separately; passing behavior alone is not a clarity score.
        elif case_id == "receipt-scope":
            data = json.loads((work / "expense-manifest.json").read_text())
            rows = data.get("expenses", [])
            expected = {"receipt-a.pdf":19.9,"receipt-b.pdf":60.0}
            checks["exact_confirmed_receipt_scope"] = len(rows) == 2 and sorted(Path(r.get("source_pdf", "")).name for r in rows) == sorted(expected) and sorted(Path(p).name for p in data.get("confirmed_source_pdfs", [])) == sorted(expected)
            checks["amounts_categories_and_project"] = len(rows) == 2 and all(float(r.get("amount_chf", -1)) == expected.get(Path(r.get("source_pdf", "")).name) and r.get("expense_type") == "S160" and r.get("project") == "Internal tools" and r.get("currency") == "CHF" for r in rows)
            checks["identity_and_no_car_trips"] = data.get("report_user_name") == "Dana" and data.get("car_trips", []) == []
            checks["receipt_paths_resolve"] = len(rows) == 2 and all((work / r["source_pdf"]).is_file() for r in rows)
        elif case_id == "consumer-wiring":
            data = json.loads((work / "frontend-config.json").read_text())
            checks["uses_proven_listener"] = data.get("apiUrl") == "http://127.0.0.1:5317"
            checks["authentication_preserved"] = data.get("authRequired") is True
        elif case_id == "abstraction-review":
            data = json.loads((work / "review.json").read_text())["candidates"]
            checks["collapse_unjustified_interface"] = data.get("ILabelFormatter", {}).get("verdict") == "Collapse"
            checks["preserve_authorization_boundary"] = data.get("IOrders", {}).get("verdict") in ["Keep", "Narrow"]
            checks["explanations_present"] = all(data.get(n, {}).get("evidence") for n in ["ILabelFormatter", "IOrders"])
        elif case_id == "design-export":
            result = command(["node", str(Path(__file__).with_name("check-browser.cjs")), str(work)], timeout=30)
            if result.returncode:
                raise RuntimeError(f"Browser grader unavailable: {result.stderr[-1000:]}")
            checks.update(json.loads(result.stdout))
    except (OSError, ValueError, KeyError, TypeError) as error:
        checks["valid_artifact"] = False
        return checks, str(error)
    return checks, None


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--models", nargs="+", choices=MODELS, default=["astra"])
    parser.add_argument("--cases", nargs="+", choices=CASES, default=[name for name in CASES if name != "design-export"])
    parser.add_argument("--variants", nargs="+", choices=["baseline", "original", "revised"], default=["baseline", "original", "revised"])
    parser.add_argument("--original-ref", default="HEAD")
    parser.add_argument("--timeout", type=int, default=300)
    parser.add_argument("--repeats", type=int, default=1)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    if args.repeats < 1 or args.timeout < 1:
        parser.error("--repeats and --timeout must be positive")
    revision = command(["git", "rev-parse", "--verify", args.original_ref], cwd=ROOT)
    if revision.returncode:
        parser.error("--original-ref must resolve to an existing Git revision")
    args.original_ref = revision.stdout.strip()
    env = subscription_env()
    run_root = Path(tempfile.mkdtemp(prefix="skill-subscription-eval-"))
    records = []
    report = {"created_at": datetime.now(timezone.utc).isoformat(), "workspace":str(run_root), "status":"running",
              "original_ref":args.original_ref, "results":records,
              "planned_runs":len(args.models) * len(args.cases) * len(args.variants) * args.repeats,
              "limits":"Synthetic fixtures; forced skill loading, not discovery. No real-device or live Figma coverage. Behavior checks do not establish readability or general model superiority."}
    args.output.parent.mkdir(parents=True, exist_ok=True)
    def save():
        args.output.write_text(json.dumps(report, indent=2) + "\n")
    save()
    for model in args.models:
        try:
            authenticate(MODELS[model][0], env)
        except (RuntimeError, ValueError, OSError, subprocess.TimeoutExpired) as error:
            report.update(status="interrupted", blocked_model=model, error=str(error))
            save()
            raise SystemExit(str(error))
        for repeat, case_id, variant in itertools.product(range(args.repeats), args.cases, args.variants):
            work = run_root / model / case_id / f"{variant}-{repeat + 1}"
            prompt, hashes, skill_hash = prepare(case_id, variant, work, args.original_ref)
            record = {"model":model,"case":case_id,"variant":variant,"repeat":repeat + 1,
                      "workspace":str(work),"skill_sha256":skill_hash,"input_sha256":hashes}
            try:
                record.update(invoke(model, work, prompt, args.timeout, env))
                record["delegation_observed"] = any(event.get("type") == "collab_tool_call" for event in record["tool_events"])
                checks, detail = grade(case_id, work, hashes)
                record.update(checks=checks, detail=detail,
                    status="error" if record["errors"] else "pass" if all(checks.values()) else "fail")
            except subprocess.TimeoutExpired:
                record.update(status="timeout", errors=["CLI exceeded the per-case timeout"])
            except (RuntimeError, OSError) as error:
                record.update(status="error", errors=[str(error)])
            record["artifacts"] = {name:(work / name).read_text() for name in CASES[case_id]["outputs"]
                                   if (work / name).is_file() and not (work / name).is_symlink()}
            record["task"] = prompt
            record["skill_text"] = (work / "reporting" / "SKILL.md").read_text() if variant != "baseline" else None
            records.append(record)
            save()
            print(f'{model} {case_id} {variant}: {record["status"]}', flush=True)
            if record["status"] in ["error", "timeout"]:
                report.update(status="interrupted", stopped_after=len(records), remaining_runs=report["planned_runs"] - len(records))
                save()
                raise SystemExit("Stopped on a runtime/auth/quota/timeout error; inspect the report. No model or paid API fallback was attempted.")
    report["status"] = "complete"
    save()
    print(f"Results: {args.output.resolve()}")
    print(f"Artifacts retained for inspection: {run_root}")


if __name__ == "__main__":
    main()
