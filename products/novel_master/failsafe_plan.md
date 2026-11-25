# Novel Studio — Failure Handling (Implementation Report)

Status: implemented 2026-11-25 after EGM review and revision. Verified with
`pytest -q` (53 passed, 1 deselected (slow)), `node --check` on the extracted
`<script>`, server HTTP smoke test, and a live Chrome walkthrough with no
console errors.

## Context and definitions

- **Roles**: two model roles, configured in `config.json`. The **Showrunner**
  (`showrunner_model`) writes scene prose and choices. The **Auditor**
  (`auditor_model`) extracts events and state from prose and also serves
  analysis requests. "Single model per role" means one model identifier per role, no
  fallback list.
- **Canon / author canon / author authority**: canon is the active project's
  established lore, characters, state, and events. Scene files are author canon:
  the author's edits win, so the app never silently rewrites them. This is why
  the 16 scenes containing model reasoning are left untouched and why AI prose is never
  post-edited.
- **Auditor failure**: a failure of the Auditor LLM call or its JSON parse. It
  is non-fatal — the scene is still saved, but state is not updated; the web
  flow surfaces it as an SSE stage event.
- **SSE events**: `stage` (progress message), `done` (scene, choices, state,
  checks), `error` (message), `end` (stream close). The client renders stage
  messages, renders `done` content, alerts on `error`, and stops reading on
  `end`, which always resets the button.
- **Dimensions**: the eight analysis axes are `prose_quality`, `dialogue`,
  `pacing`, `character_voice`, `continuity`, `immersion`, `motivation`, and
  `power_balance`. Each is an integer 1–10; `overall_rating` is their mean.
  `normalize_analysis` coerces invalid or out-of-range values rather than rejecting the analysis.
- **Fail-safe / failure gate**: a check at a trust boundary that stops bad data
  from being persisted or a broken UI state from surviving. The four boundaries
  are LLM output, file I/O, state mutation, and UI async actions.

- **Structured errors**: HTTP handlers return `{"error": "..."}` (or
  `{"ok": false}` when no cached analysis exists); SSE streams emit
  `{"type": "error", "error": "..."}`. Callers handle these shapes.
- **EGM**: Elephant-Goldfish Model, an adversarial document review with five
  stages: zoom out, comprehension, critic, intermediate zoom out, and
  implementation readiness. Stage reports are in this directory.
- **Baseline**: earlier state and rationale are in `README.md`, `AUDIT_FIXES.md`,
  `schemas.md`, `ux_plan.md`, `home_page_plan.md`, and
  `novel_studio_master_plan.md`. This report uses "kept", "reuse", "previously
  uncalled", and "already-correct" relative to those documents.

## Document type and standard mapping

This is a completion report, not a pre-implementation feature specification. The
feature-spec standard's required content is present retrospectively:
Problem Statement → Problem addressed; Goals & Non-Goals → Decisions locked
+ Deliberately not implemented; Proposed Architecture → Architecture and data flow;
Alternatives Considered → Deliberately not implemented; Risks & Mitigations →
Security and trust boundary + Known limits. No pre-implementation sections were
fabricated.

## Problem addressed

Users were losing work and getting misleading results: generation saved the
model's reasoning transcript as prose, analysis judged a standalone draft against
an unrelated project's canon, analysis output copied prompt placeholders, an
Auditor failure silently skipped state updates, a reconcile endpoint raised
`TypeError` on every call, and the Generate button stayed disabled after a
failed run. Left unfixed, these failures were silent — the UI reported success
while the saved scene or state was incorrect.

## Architecture and data flow

```
direction + brief
  → web_ui.generate_one_stream (GEN_LOCK)
  → studio.showrunner_prompt (lore/chars/state/canon + skills)
  → studio.llm_call (3 attempts, key rotation, backoff)
  → split_scene_and_choices (reasoning/template guard)
  → atomic_write scene + meta + snapshot
  → studio.auditor_prompt + llm_call (state events)
  → studio.append_event (EVENT_LOG_LOCK, fsync)
  → apply_state_updates → state.json
  → SSE done → analysisHtml / renderScene in index.html
```

Guards sit at the LLM-output boundary (`split_scene_and_choices`,
`normalize_analysis`), the file-I/O boundary (`atomic_write` for novel data),
the state boundary (`apply_state_updates`, `rebuild_state_from_events`), and the
UI boundary (`finally { hideLoading(); }`). Startup rebuilds state before the
port binds, so readiness implies consistent state.

## Security and trust boundary

The server binds `127.0.0.1` only, with no authentication — local single-user
use is the design. State-mutating endpoints are reachable over HTTP from local
processes; `/api/rebuild_state` uses POST because it writes files (a GET with
write side effects could be triggered by a link or prefetch). Error strings are
returned to the client from local exceptions; they may include filesystem paths
or provider messages, which is acceptable for a localhost-only tool but would
need redaction if the server were ever exposed beyond localhost.

## Decisions locked

- No fallback model list; single model per role. Resilience comes from key
  rotation, bounded retry, and structured errors.
- The 16 historical scenes already containing model reasoning are left intact:
  scene files are author canon. The parser rejects new occurrences.
- No transaction manager, no cross-file atomic groups, no new locks without a
  reproduced race.
- No `pending_review` workflow; generation is accepted only when it succeeds.
- No universal `withLoading(fn)` wrapper; reuse `showLoading`/`hideLoading`
  with per-action `try/finally`.
- No `validate_scene`/`validate_analysis` wrappers; call the existing helpers
  directly.

## What changed (authoritative delta list)

### `studio.py`
- Added `log_failure(context, error)` with UTC timestamp. Silent failures are
  now printed to the server console.
- Narrowed silent `except Exception` handlers to specific types with logging:
  `genre_style_rules` (`json.JSONDecodeError`, `OSError`),
  `list_branches`/`current_branch`/`create_branch`/`switch_branch`
  (`subprocess.SubprocessError`, `OSError`).
- `llm_call`: capped at 3 attempts total with exponential backoff
  (`2 ** (attempt - 1)` seconds), kept multi-key rotation, and logs each failed
  attempt.
- `split_scene_and_choices` rejects reasoning preambles and echoed output-format
  templates; `import_pipeline.improve_scene` rejects empty improved text.
- `normalize_analysis` is the single analysis gate: strips placeholder text,
  converts top-level `issue`/`severity` into a weakness, and sets
  `overall_rating = None` with `llm_error` when neither dimensions nor an overall rating are returned.
- `analysis_prompt` judges drafts as self-contained when invoked with no canon and carries an explicit "do not mix languages" directive.
- `analyze_scene` caches `meta["analysis"]` only when `overall_rating` is not
  null.
- `analyze_novel` loads no active-project canon, so a rough draft is not judged
  against unrelated lore.
- `get_structure` repairs missing scenes from scene files; `delete_scene` keeps
  the structure index in sync.
- `add_scene` writes through `kb_path("scenes")` instead of a flat path.
- `apply_state_updates` is reused by `rebuild_state_from_events`.
- `rebuild_state_from_events` runs at web-server startup before the port binds,
  after a duplicate-launch probe.

### `web_ui.py`
- SSE stream emits an explicit `end` event with `Connection: close`; client
  always resets its button.
- Auditor failures emit a stage event instead of being silently ignored.
- `/api/analysis/<n>` returns `{"ok": false}` when no cached analysis exists.
- `main()` refuses to start if port 8765 is already in use.
- Event writes go through `append_event` (locked, fsync).

### `import_pipeline.py`
- `analyze_novel` uses the shared normalizer and no external canon.
- `improve_scene` logs Auditor failure and rejects reasoning/template output.
- Improve options come from one shared `studio.IMPROVE_OPTIONS` map.

### `index.html`
- One `analysisHtml()` renderer serves both the Analyze panel and the Improve
  modal, with ratings, dimension bars, strengths, severity-tagged weaknesses,
  and an editable plan.
- Fixed `obj` → `parsed` in the SSE loop; added `prevScene`; created the missing
  `recon` panel; fixed `infoEl`; `/api/rebuild_state` now also accepts POST
  because it writes state.
- Generation timeout is 300000 ms (5 min); client-side abort calls `cancelGen`.
- `applyAnalysisPlan` reuses the Accept/Reject banner from `runImproveScene`.
- Wired previously uncalled endpoints: resolve hint, hint audit, chapter
  summary, cached analysis.
- All async actions that show a loading overlay now reset it in `finally`
  (`applyProposals`, `switchProject`, `switchBranch`, `startImprovement`,
  `saveLore`, `saveChars`, and the already-correct ones).
- Home page, hints modal, structure tree, and status refresh verified in Chrome.

### Tests and docs
- New `test_analysis_context.py` (canon isolation, placeholder sanitization,
  language rule) and `test_fail_safes.py` (failure logging, bad-JSON degradation).
- `pytest.ini` auto-deselects slow tests; `requirements.txt` includes pytest.
- `README.md`, `ux_plan.md`, `home_page_plan.md`, `schemas.md`, and
  `novel_studio_master_plan.md` updated: `README.md` paths and reconciliation status, `ux_plan.md` HTML reload
  and keyboard shortcuts, `home_page_plan.md` input and request keys, `schemas.md`
  `detect_edit(scene_number)` and `passages_changed`, `novel_studio_master_plan.md`
  test count, scene count, branching, and startup rebuild.
- `AUDIT_FIXES.md` and the five EGM stage reports plus
  `consolidated_review_report.md` record the audits.

## Deliberately not implemented

- Fallback model list: free-model slugs rotate often and a second slug adds a
  config surface that goes stale; key rotation plus bounded retry and structured
  errors handle transient failures without a second model to track.
- `pending_review` workflow: the problem was corrupted data, not acceptance
  timing; changing status ripples through many endpoints and UI flows for no
  gain in correctness.
- `status: failed` durable marker: nothing reads it; reuse the SSE `error`
  event, returned `{"error": ...}`, and `log_failure` instead.
- 90% language-script detector: contradicts the "log a warning, no hard gate"
  decision and a script-based detector cannot distinguish language mixing within a single script. The prompt rule stays.
- "Retry with a stricter prompt": duplicates `llm_call`'s retry and multiplies
  calls on free models. Structured errors are returned on exhaustion.
- Hard 8-key dimension gate: `normalize_analysis` coerces invalid or out-of-range values and keeps
  usable output; a hard gate would reject analyses the user can still use.
- `EVENT_LOG_LOCK` for `structure.json`: no reproduced race; coupling unrelated
  files adds contention for nothing.
- Atomic writes for scaffolding: `create_project` writes new files into a fresh
  directory, so tmp+fsync+replace buys nothing.

## Verification

- `pytest -q`: 53 passed, 1 deselected.
- `node --check` on extracted `<script>`: clean.
- HTTP smoke: `/`, `/api/status`, `/api/structure`, `/api/hints`, and
  `/api/analysis/28` return 200; `/api/analysis/28` carries an `overall_rating`.
- Chrome walkthrough: home page, studio, prev/next with status update, hints
  modal with audit, chapter summary, no console errors.
- Duplicate launch prints "already running" and exits.

## Known limits

- `analysis_prompt` truncates input at 12,000 characters; longer drafts are
  partially analyzed. Mitigation: split long drafts into scenes before analysis;
  no automatic chunking is planned because it would add a new subsystem.
- A free model can still mix an occasional English word into Arabic output.
  Mitigation: the prompt directive plus a visible warning; no automatic prose
  edit, because post-editing AI text would violate author authority.
- Historical scenes containing model reasoning remain in `projects/default/scenes/`.
  Mitigation: regenerate those scenes under author control; the parser prevents
  new occurrences.
- Auditor failure leaves the scene saved but its state update unapplied, and no
  event is appended, so `rebuild_state_from_events` cannot recover that update.
  Mitigation: treat it as accepted drift and regenerate the affected scene under
  author control; the failure is surfaced in the SSE stream and the server log.
