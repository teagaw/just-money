#!/usr/bin/env python3
"""One-time migration: assign event_id to legacy event_log.jsonl records.

Legacy records (pre-Phase-1) lack event_id, nullifies_event_id, and per-event
state_updates. This script assigns monotonic IDs and preserves existing fields.
Safe to run multiple times (idempotent: skips records that already have event_id).
"""
import json
import sys
from pathlib import Path

BASE = Path(__file__).parent
sys.path.insert(0, str(BASE))
import studio

LOG = studio.kb_path("events") / "event_log.jsonl"


def main():
    if not LOG.exists():
        print("No event log found.")
        return
    lines = LOG.read_text(encoding="utf-8").splitlines()
    records = []
    for line in lines:
        line = line.strip()
        if not line:
            continue
        try:
            records.append(json.loads(line))
        except json.JSONDecodeError:
            print(f"Skipping malformed line: {line[:60]}")
            continue

    # assign ids to records missing them
    next_id = studio.next_event_id()
    # if some already have ids, start after max
    existing = [r.get("event_id") for r in records if r.get("event_id") is not None]
    if existing:
        next_id = max(existing) + 1

    changed = 0
    for r in records:
        if r.get("event_id") is None:
            r["event_id"] = next_id
            next_id += 1
            changed += 1
        # ensure retcon fields exist
        r.setdefault("nullifies_event_id", None)
        # ensure state_updates exists (per-event; fall back to empty for legacy)
        r.setdefault("state_updates", r.get("state_updates", {}))

    # write back atomically
    studio.atomic_write(LOG, "\n".join(json.dumps(r) for r in records) + ("\n" if records else ""))
    print(f"Backfilled {changed} record(s). Total records: {len(records)}.")


if __name__ == "__main__":
    main()
