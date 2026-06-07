# Notion CSV Imports — Alex's Sample Data

> 8 ready-to-paste CSV files that populate the Notion template with Alex's 4-week journey. Use Notion's **"Merge with CSV"** feature to import each file into the matching database. Total time: ~5 minutes.

---

## How to Import

For each CSV file:

1. **Open the target database** in your Notion workspace (e.g. 🏋️ Workouts).
2. Click the **"•••"** menu in the top-right of the database view.
3. Select **"Merge with CSV"** (Notion 2.0+ feature — if you don't see it, your Notion app may need an update).
4. **Upload the matching CSV** from this folder.
5. Notion will show a **column mapping screen** — verify the CSV columns map to the right Notion properties. The CSV headers are designed to match the property names in `template-spec.md` exactly, so this should be automatic.
6. Click **"Merge"** — Alex's data will be added as new rows.

**Repeat for all 8 databases.**

---

## Files in This Folder

| File | Database | Rows | Notes |
|------|----------|------|-------|
| `workouts.csv` | 🏋️ Workouts | 16 | 4 weeks × 4 sessions/week (3 lifting + 1 cardio per week) |
| `exercises.csv` | 💪 Exercises | 80 | 5 exercises per session, all 16 sessions, with top sets and full 4-set data where logged |
| `body-metrics.csv` | 📏 Body Metrics | 5 | Weekly check-ins over 4 weeks (Weeks 0–4) |
| `nutrition.csv` | 🍽️ Nutrition Log | 28 | 4 meals/day × 7 days × 1 representative week (most consistent); plus 7 days from the messy Week 1 |
| `goals.csv` | 🎯 Goals | 6 | 6 sample goals (Weight Loss, Strength, Endurance, Performance, Habit, Mobility) |
| `recovery.csv` | 😴 Recovery | 28 | One entry per day across 4 weeks (28 days) |
| `progress-photos.csv` | 📸 Progress Photos | 4 | One per week (Weeks 0, 1, 2, 4) — same data as `sample-content.md` |
| `daily-habits.csv` | 🔁 Daily Habits | 5 | 5 sample habits (the habit *definitions*, not daily log entries) |

> **Total: ~170 rows** across 8 databases. Imports in under 5 minutes.

---

## What These CSVs Will and Won't Do

### Will:

- Populate every database with Alex's sample data so the template "feels alive" on day one.
- Set the right values for Select / Multi-select / Number / Date properties.
- Set the `Sample Tag` column to "🚧 SAMPLE" on every row — this lets you filter the sample data out with one click.
- Drive the formulas correctly once you import — e.g. the Workouts Total Volume will auto-calculate from the linked Exercises rows.

### Won't (and what to do):

- **Won't import relations automatically.** Notion's "Merge with CSV" does not create relations between rows. After importing Workouts and Exercises, you'll need to manually link the exercises to their parent workouts (Notion 2.0+ has improved this — it will suggest matches based on title, but verify each). Time: ~10 minutes.
- **Won't import file attachments.** The Progress Photos CSV references photos by URL placeholder; you'll need to upload the actual photo files separately (or skip — the photo entries can be empty).
- **Won't import rollups.** Rollups are computed automatically from the relations — once relations are linked, rollups populate on next refresh.

---

## Tips for Faster Import

1. **Import in this order** (so the relations have something to link to):
   1. Exercises (no inbound relations from this set)
   2. Workouts (no inbound relations)
   3. Goals (no inbound relations)
   4. Body Metrics (no inbound relations)
   5. Recovery (no inbound relations)
   6. Daily Habits (relations to Goals, but can be left unlinked initially)
   7. Nutrition Log (no relations in this lite set)
   8. Progress Photos (relations to Body Metrics, can be left unlinked initially)

2. **After all 8 imports**, go to the Workouts database and link each workout to its exercises. The CSV has a `Linked Exercises (Title)` column with the exact exercise titles — when you start typing in the Linked Exercises property, Notion will autocomplete.

3. **Verify formulas are computing.** Open Workouts, scroll to Total Volume (kg) — should be a number, not "NaN." If NaN, check that the rollup is configured to "Sum" and "Volume (kg)" not "Original."

4. **Hide sample data.** Turn the **🚧 Show Sample Data** toggle OFF on the Home page. All rows tagged 🚧 SAMPLE will disappear from Home rollups but remain in the database for reference.

---

## Deleting Sample Data

When you're ready to start with a clean slate (after 1-2 weeks of reference use):

1. Open any database
2. Filter to `Sample Tag contains 🚧`
3. Select all → delete

Or, the slower but safer way: open each of the 8 databases individually, filter, select-all, delete. Total time: ~5 minutes.

---

## Schema Reference

For buyers who want to extend the data or import their own CSVs, the column schema for each file is documented in `template-spec.md` §2 (one subsection per database). The CSV headers match the property names in the spec exactly, with one extra column: `Sample Tag` (a Select with the single value "🚧 SAMPLE" on every row in the import files).

---

**End of README**
