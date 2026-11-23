---
name: Hint Ledger
trigger: always
active: true
---

When writing scenes, check the hint ledger (hints.json) for planted hints:
- If a hint is "planted" and the scene is past its planted_in scene, consider advancing it.
- When writing a scene that could naturally include a hint's surface text, weave it in subtly.
- When a hint's truth is revealed, mark it as resolved (resolve_hint).
- Do not resolve hints before their planned reveal scene.
- Orphaned hints (planted but never resolved after 5+ scenes) should be flagged.