# Task 2 Report — Backend: extend new_project for premise + cast + lore

## Status
DONE

## Changes
- `studio.py`: `create_project()` now accepts `premise`, `characters`, `lore` (all optional, backward compatible). Writes `world_lore.md` with premise prepended to lore (or template with premise when none). Writes `characters.json` with generated ids `c1, c2, ...` and default fields (`voice_contract`, `secrets`, `goals`, `speech_quirks`). Adds `premise` to `project_config.json`. Validates duplicate (non-empty) character names → returns `False`. Handles `None`/empty gracefully.
- `web_ui.py`: `/api/new_project` accepts `premise`, `characters`, `lore` from body and forwards to `create_project()`.
- `test_studio.py`: added `test_create_project_with_premise` plus id-generation, duplicate-name, missing-field, template, and empty-characters tests.

## Tests
7 passed (create_project + project_summaries variants); adversarial 5 passed. Pre-existing failure `test_generate_one_stream` (missing `git_commit_scene`) unrelated.

## Concerns
- Character entries are normalized to the eight specified fields only; extra input keys (e.g. `core_values`) are dropped.
- Duplicate detection is case-sensitive and only applies to non-empty names.
- No input validation on `characters` element types beyond coercion; malformed entries become empty-name characters.
