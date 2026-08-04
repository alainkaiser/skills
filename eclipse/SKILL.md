---
name: eclipse
description: "Orchestrate repository work in Codex with GPT-5.6 Sol directing GPT-5.6 Luna workers at Max effort through the fewest necessary independent Codex threads. Use when the user invokes Eclipse or asks Codex to coordinate implementation, refactoring, investigation, debugging, or testing with this Sol/Luna division of responsibility, targeted thread context, controlled retries, cost-aware execution, and acceptance-criteria-driven final review. This is a Codex-only workflow; never substitute subagents."
---

# Eclipse

Use GPT-5.6 Sol to direct the work and GPT-5.6 Luna to execute it. Treat correctness and quality as hard constraints, then minimize total model and tool cost within those constraints.

## Enforce the Runtime

- Run the orchestrator with GPT-5.6 Sol.
- Use Codex thread-management tools for delegated work. Never use subagents or silently emulate a thread with another mechanism.
- Run every worker thread with GPT-5.6 Luna at Max effort.
- If the exact model, effort, or thread capability is unavailable or cannot be verified, state the limitation and ask for direction before substituting or downgrading it.

## Keep the Role Boundary

GPT-5.6 Sol must:

- understand the requested outcome, constraints, and repository scope;
- inspect only enough repository state to plan safely, including applicable instructions, Git state, relevant structure, target files, and repo-provided commands;
- turn the request into explicit, verifiable acceptance criteria;
- decide whether worker threads add value, decompose the work, and assign file ownership;
- route findings between dependent workstreams;
- integrate the returned results, inspect the actual final diff, and perform the final review.

Assign all task-level investigation beyond Sol's planning reconnaissance, implementation, refactoring, reproduction, debugging, conflict resolution that changes code, and testing to GPT-5.6 Luna. Sol must not take over worker work merely because doing it directly appears faster.

## Define the Work Before Dispatch

1. State the goal and in-scope repository or repositories in one concise outcome statement.
2. Resolve applicable repository instructions and preserve unrelated user changes.
3. Record each acceptance criterion as a binary or otherwise objectively checkable result, together with the proof required to accept it.
4. Identify dependencies between criteria, likely file ownership, and already-known findings.
5. Ask the user only when missing information would materially change the safe outcome. Otherwise proceed with an explicit assumption.

Keep a compact orchestration ledger in context:

| Workstream | Owned files or boundary | Deliverable | Prior findings | Status | Proof |
| --- | --- | --- | --- | --- | --- |

Use this ledger as the single source of truth for ownership, findings, retries, and verification. Do not create a repository artifact for it unless the user asks.

## Choose the Fewest Threads

- Create no worker thread for a request that needs no implementation, refactoring, investigation, debugging, or testing.
- Otherwise start with one Luna thread that can complete the whole delegated deliverable coherently.
- Keep planning, integration, and final review in the active Sol task; never create a second Sol thread for them.
- Add another thread only when its work is independently verifiable, has disjoint file or system ownership, does not depend on unfinished output from another thread, and materially improves correctness, quality, or completion time without duplicating context or exploration.
- Keep dependent work sequential. Reuse an existing thread for follow-up work in the same boundary.
- Never create separate threads merely for phases such as investigation, implementation, and tests when one worker can own the complete result.
- Never allow concurrent threads to edit the same files or investigate the same unknown. Reassign ownership explicitly before scope changes.

## Dispatch One Verifiable Deliverable

Set the thread model to GPT-5.6 Luna and reasoning effort to Max. Give each thread only:

- one outcome-oriented deliverable with a clear pass condition;
- the relevant repository and file paths or system boundary;
- its exclusive edit ownership;
- applicable constraints and acceptance criteria;
- prior findings it should trust or validate, including outputs from earlier workstreams;
- the smallest relevant commands, tests, and repository instructions;
- the required return evidence: files changed, findings, exact checks and results, and any blocker.

Do not paste broad conversation history, assign vague goals, or ask the worker to rediscover repository-wide context. Tell it to stay within ownership and report why an expansion is necessary before taking it.

## Coordinate Without Repeating Work

- Wait for existing threads and consume their latest result before opening more work.
- Send new findings to only the workstreams that depend on them.
- Prefer a follow-up in the same thread over a fresh thread so relevant context and failed evidence are retained.
- Do not repeat successful searches, reproductions, builds, or tests unless the final state changed in a way that invalidates their evidence.
- Treat a worker's summary as an index, then inspect the claimed files, diff, and proof needed for integration. Do not redo its full exploration.
- If results conflict, identify the authoritative repository evidence and send only the unresolved delta to the responsible Luna thread.

## Retry Once Before Escalating

Treat a Luna attempt as failed when its explicit deliverable is unmet or unproven. An external permission, unavailable dependency, or user decision is a blocker, not a model failure.

After the first failure:

1. Inspect the returned evidence and name the failed assumption, missing context, or overly broad scope.
2. Send one clearly refined retry to the same Luna thread when possible.
3. Change the hypothesis, constraints, file scope, or verification target concretely; never send only “try again.”

Escalate that specific step to Sol only if the refined Luna retry also fails. Record both failed attempts and keep the escalation limited to the blocked deliverable. All unaffected worker work remains with Luna.

## Integrate and Review

After the workers finish, Sol must:

1. Inspect the actual workspace status and complete diff against the starting state.
2. Confirm that edits are in scope, coherent across boundaries, and free of unrelated changes or unresolved overlap.
3. Map every acceptance criterion to concrete diff evidence and Luna's exact verification result.
4. Confirm that tests were run after the final relevant edit. If proof is missing, stale, or failing, reopen only the owning Luna workstream with that failed criterion.
5. Repeat the review only for changed or previously failed criteria; retain valid proof for unaffected workstreams.
6. Finish only when every criterion passes or an explicit external blocker remains.

Report the integrated outcome, affected files, verification evidence, any Luna retry or Sol escalation, and residual blockers. Do not claim success from thread completion alone.
