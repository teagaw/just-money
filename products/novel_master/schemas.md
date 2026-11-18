# Phase 1 Data Schemas

Canonical JSON shapes for the novel studio. These are the contracts Phase 1 (edit reconciliation) builds on. Keep them in sync with code; version them like code.

## 1. Event (event_log.jsonl, append-only)

One JSON object per line. Events are never deleted; retcons are appended.

```json
{
  "event_id": 104,
  "scene": 5,
  "ts": "2026-11-14T12:00:00Z",
  "type": "action",
  "actor": "c1",
  "target": "c2",
  "summary": "Maren hands the iron sword to Tovin",
  "uncertain": false,
  "nullifies_event_id": null
}
```

Fields:
- `event_id` (int, monotonic, unique) — assigned on append.
- `scene` (int) — source scene number.
- `ts` (ISO-8601 UTC).
- `type` (enum): `action | dialogue | discovery | injury | item_gain | item_loss | relationship_change | location_change | retcon`.
- `actor` (char_id or null) — who performed/owns the change.
- `target` (char_id or null) — affected character, if any.
- `summary` (string, short factual sentence).
- `uncertain` (bool) — auditor flagged ambiguity.
- `nullifies_event_id` (int or null) — only for `type: retcon`; points at the event being nullified.

A `retcon` event does not mutate the original; the projector skips nullified events when rebuilding state.

## 2. ReconciliationProposal (proposed change from an edit)

```json
{
  "proposal_id": "p-001",
  "scene": 5,
  "op": "nullify",
  "target_event_id": 104,
  "source_passage": "the paragraph where the protagonist picks up a key",
  "reason": "author_edit",
  "confidence": 0.9,
  "auto_safe": false,
  "description": "Remove 'Iron Sword' from Protagonist inventory; nullify Event #104"
}
```

Fields:
- `proposal_id` (string, unique).
- `scene` (int) — edited scene.
- `op` (enum): `add | modify | remove | nullify`.
- `target_event_id` (int or null) — event affected (null for `add`).
- `source_passage` (string) — quoted/paraphrased passage from the edited scene.
- `reason` (string) — `author_edit | wording | redundant`.
- `confidence` (0..1) — auditor's confidence.
- `auto_safe` (bool) — true only for clearly non-semantic changes (e.g. typo fix). Safe-auto-accept allowlist: spelling/grammar rewording with no entity/inventory/relationship/timeline change.
- `description` (string) — human-readable summary shown in the review UI.

## 3. character_state.json (derived, rebuildable)

```json
{
  "c1": {
    "location": "Salt Market, Duskport",
    "inventory": ["key"],
    "relationships": { "c2": "ally", "c3": "antagonistic" },
    "status": "alive"
  }
}
```

Rebuild rule: seed an empty state per character from `characters.json` (location "unknown", inventory [], relationships {}, status "alive"), then apply events in `event_id` order, skipping any event whose `event_id` is in the nullified set. State is derived; never hand-edit.

## 4. Scene meta (scene_NN_meta.json)

```json
{
  "scene": 1,
  "hash": "sha256...",
  "status": "accepted",
  "characters_present": ["c1", "c2", "c3"],
  "location": "Salt Market, Duskport",
  "events": [ { "...event fields..." } ],
  "choices": ["...", "..."]
}
```

Status enum (v1, 4 states): `draft | accepted | dirty | reconciled`. `dirty` = manually edited after acceptance, pending reconciliation. `reconciled` = a proposal was applied and accepted by the author (manual accept required; never auto-promote).

## 5. Edit detection

`detect_edit(scene_path)` compares the current sha256 of the file to `scene_meta.hash`. If they differ, set `status = dirty` and trigger reconciliation. Idempotent: safe to call repeatedly; if already dirty, do nothing.

## 6. Safe-auto-accept allowlist (v1)

Auto-accept only if ALL of:
- The diff is purely spelling/grammar rewording.
- No named entity, inventory item, relationship, location, or timeline reference changed.
- No event would be added, modified, removed, or nullified.

Everything else is proposed for manual review (Accept/Reject per change).

## 7. Retcon cascading (v1)

Flag-only. When a retcon nullifies event E, search later scenes' text and event summaries for references to E's entities. List them as "may be affected" in the proposal UI. Never auto-nullify downstream events; the author decides.

## 8. Retcon vs replay (resolution)

Append-only log is the source of structured truth. "Replay from that point" means: re-run the projector over the append-only log in order, skipping nullified events, optionally starting from a saved snapshot. The log is never mutated. Snapshots are an optimization, not a second source of truth.