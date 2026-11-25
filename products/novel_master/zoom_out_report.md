# EGM Re-Review — Stage 5 Zoom Out

**Target:** `failsafe_plan.md` (revised version)
**Mode:** fresh reader, no prior findings supplied
**Reviewers:** egm-zoom-out, egm-inventive-catalyst
**Standard:** zoom-out-standard.md

## Blocker (both reviewers agree)

**The document cannot decide whether it is a plan or a completion report.**
- Header (lines 3–6): "revised… then implemented, 53/53 tests pass."
- Body: future tense ("Narrow `except Exception`…", "Add a client-side 5-minute
  timeout…", "Implementation order (priority)").
- Success criteria (line 123): "currently 51 passed, 1 deselected."
- Test plan (line 353): "expect 51+ passed."
- Two full Glossary sections (143–163, 373–392); duplicated Goals/Out-of-scope;
  "Decisions locked" ≈ "Resolved decisions"; "Success criteria" ≈ "Test plan."
- Stale phase references: resolved decisions say "Phase 4 (concurrency) runs
  before Phase 3 (data integrity)" but current Phase 4 is state/data integrity
  and Phase 5 is concurrency. Phase 7 is declared merged yet remains a full
  phase and step 7 in implementation order.
- Rationale: a fresh reader cannot tell what remains to do. The one pointer to
  actual remaining gaps (`AUDIT_FIXES.md`) is outside the document.

**Fix:** pick one identity. Since the work is landed, reduce this to a short
"what changed / what was verified" note plus a short authoritative delta list,
and delete future-tense phases, duplicate sections, and stale counts.

## Majors

1. **Already-landed behavior presented as new work.** Code search confirms:
   `analysis_prompt` language/self-contained rules, `llm_call` rotation +
   3 attempts + backoff, `get_structure` missing-scene repair, 5-minute client
   timeout, port probe, `atomic_write`, reasoning/template guards, placeholder
   stripping, structure repair, `knowledge_check` in both flows, secrets
   stripping, `rebuild_state_from_events`, `GEN_LOCK`/`EVENT_LOG_LOCK`. Mark
   done and keep only genuine gaps.
2. **`validate_scene` / `validate_analysis` wrappers are pure pass-through.**
   Neither exists; both would only delegate to `split_scene_and_choices` /
   `deterministic_scene_checks` and `normalize_analysis`. Delete them from the
   manifest; call existing helpers directly.
3. **`withLoading(fn)` wrapper is broad churn.** `showLoading`/`hideLoading`
   plus per-action `try/finally` already exist. Only a few actions miss it:
   `switchProject`, `switchBranch`, `applyProposals`, `saveLore`, `saveChars`,
   `startImprovement`. Fix those with `finally { hideLoading(); }`; do not add
   a universal wrapper.
4. **G4 "all 8 dimension keys in 1–10" conflicts with `normalize_analysis`,**
   which coerces bad values and computes rating from whatever exists; prompt
   example shows 6 keys, schema 8. A hard gate would reject usable output.
   Treat `normalize_analysis` as the gate; keep structured `llm_error`.
5. **Language 90% gate contradicts the risk table** ("keep prompt rule; log
   warning; no hard gate") and is meaningless for Latin-script languages.
   Keep the prompt directive; no detector, no retry.
6. **"Retry with stricter prompt" duplicates `llm_call`'s existing retry.**
   Multiplies calls on free models. Delete from all five places; reuse
   `llm_call` and its structured error.
7. **`status: failed` is speculative.** No reader, no writer, no status
   state machine in code. Reuse existing SSE `error` / returned `{"error": …}`
   / `log_failure`; leave filesystem alone.
8. **G7 "no `write_text` outside `atomic_write`" contradicts the stated
   scaffolding exception.** `create_project` writes fresh files into a fresh
   directory; no prior content to corrupt. Apply atomic writes only where an
   existing file is overwritten.
9. **G10 `EVENT_LOG_LOCK` for `structure.json` contradicts the no-new-lock
   decision.** No reproduced race; do nothing.

## Nits
- Backoff "1s, 2s, 4s" is stale (code uses `2**(attempt-1)`); constants belong
  in code/tests, not an architecture plan.
- Third stuck-button timeout duplicates client `setTimeout(..., 300000)` and
  server `GEN_TIMEOUT`; note the limit (client abort does not stop server
  generation under `GEN_LOCK`) instead of adding another detector.
- RTO/RPO ceremony duplicates `README.md:52`; arbitrary "~50 scenes" threshold.
- "Failure-injection harness" can be one monkeypatched pytest test.
- Rationale for shared helpers misstates the `analyze_novel`/`analyze_scene`
  split; both intentionally differ and already share `normalize_analysis`.

## Skipped / risk
No files edited by reviewer. Fresh-reader constraint meant prior reports and
`AUDIT_FIXES.md` were not opened; "already-done" claims were verified against
source, not against uncommitted working-tree state.

## Verdict
The plan document needs to be converted into a completion report with one
authoritative delta list. The only real code gaps surfaced are a handful of UI
actions missing `try/finally { hideLoading(); }`. Everything else is either
already landed or correctly rejected by the plan's own non-goals.
