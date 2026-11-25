# EGM Re-Review — Stage 6 Comprehension Test

**Target:** `failsafe_plan.md` (completion-report version)
**GoldfishContext:** none (companion documents not supplied)

## What this proposes

This is a completed implementation report for "Novel Studio", an AI-assisted
novel-writing web app, covering failure-handling changes made on 2026-11-25 and
verified with pytest, a JavaScript syntax check, an HTTP smoke test, and a Chrome
walkthrough. The stated intent is to stop failures from being silent: log them
with UTC timestamps, cap LLM calls at three attempts with exponential backoff
while rotating API keys, funnel all analysis through one normalizer so bad model
output cannot be cached, and make the client reliably reset loading state and
reuse a single analysis renderer. It also records what was deliberately *not*
done — fallback model lists, a `pending_review` workflow, a transaction manager,
new locks, hard dimension and language-script gates — with a one-line rationale
for each. In short, it proposes hardening the existing pipeline in place rather
than restructuring it.

## How the existing system works, per this document

The backend is described as `studio.py` (LLM calls, scene splitting, analysis
normalization, structure/state rebuild), `web_ui.py` (HTTP server on port 8765,
REST endpoints, an SSE stream), and `import_pipeline.py` (analysis and scene
improvement), fronted by a single `index.html` page. Scene files are treated as
"author canon"; generated scenes are accepted on success, and analysis is cached
in `meta["analysis"]` and drawn by one `analysisHtml()` function shared by the
Analyze panel and the Improve modal. At server startup, after the port binds,
`rebuild_state_from_events` reuses `apply_state_updates` to reconstruct state,
while event writes go through a locked, fsynced `append_event`. The client calls
endpoints such as `/api/analysis/<n>` and GET `/api/rebuild_state`, consumes SSE
events with a five-minute generation timeout and a `cancelGen` abort path, and
resets loading overlays in `finally` blocks. Analysis output is described as
ratings across "dimensions", strengths, severity-tagged weaknesses, and an
editable plan.

## Findings

1. **Major** — "Roles" are never identified: "single model per role" but no
   enumeration of roles. Add a one-line definition.
2. **Major** — "Canon" / "author canon" / "author authority" undefined. Add a
   one-line definition; it governs two decisions.
3. **Major** — "Auditor" introduced without introduction: what it audits, where
   it runs, how its failure differs from an ordinary LLM failure.
4. **Major** — SSE event vocabulary never enumerated: event types, payloads,
   client behavior. Needed to reconstruct the failure path.
5. **Major** — Analysis "dimensions" and the "8-key gate" undefined: list the
   keys and state what a dimension measures; link `schemas.md`.
6. **Major** — Delta report with no baseline: "kept", "reuse", "previously
   uncalled", "already-correct" cannot be resolved. Link or characterize the
   companion docs.
7. **Nit** — "Structured errors" has no stated contract; two shapes appear
   (`{"ok": false}`, `{"error": ...}`). Define one canonical shape.
8. **Nit** — "EGM" unexplained acronym and authority marker; five stages not
   named.

No section blocked paraphrasing; verification counts and key statements are
internally consistent. Skipped opening companion docs (not supplied); baseline
findings may already be resolved there.
