# Novel Studio — Phase 0 (terminal walking skeleton)

A local-first, scene-by-scene AI novel co-writer. Phase 0 is a terminal loop only.
No UI, no vector DB, no Git branches until the core loop is proven.

## Run (web UI — recommended)

Double-click the **Novel Studio** icon on your desktop, or:

```powershell
cd "C:\Users\QQQ\Desktop\JUST MONEY\products\novel_master"
python web_ui.py
```
Then open http://127.0.0.1:8765 in your browser.

## Run (terminal)

```powershell
cd "C:\Users\QQQ\Desktop\JUST MONEY\products\novel_master"
python studio.py
```

## Loop

1. Type a director direction (or Enter to continue).
2. Showrunner writes `scenes/scene_NN.md`.
3. State Auditor extracts events into `events/event_log.jsonl`.
4. `character_state.json` is updated.
5. Choices print. Pick 1-5 or type your own for the next scene.
6. `q` quits. State is saved after every accepted scene.

## Files

- `world_lore.md` — static world rules (edit freely; author authority).
- `characters.json` — cast + voice contracts.
- `character_state.json` — derived, rebuildable state.
- `events/event_log.jsonl` — append-only event log with retcons.
- `scenes/scene_NN.md` + `_meta.json` — prose + hash + status.
- `usage_log.jsonl` — per-call cost/token log.
- `config.json` — model names (free-tier; rotate as needed).

## Phase 1 exit test (the gate)

Generate 10 scenes → edit scene 03 (delete the key paragraph) → run → verify the system
detects the change, proposes removing the key from inventory, and later scenes don't
reference the key, with a retcon entry (not a deletion) in the event log.

Reconciliation (hash detection + retcon) is NOT yet implemented — that's Phase 1.

## Notes

- Free models are flaky and rotate often. Swap model slugs in `config.json`.
- Author edits to `scene_*.md` are canon; the system must never silently overwrite them.