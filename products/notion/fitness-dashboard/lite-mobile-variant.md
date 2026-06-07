# Premium Notion Fitness Dashboard — Lite Mobile Variant

> A stripped-down 4-database version for buyers who want the dashboard's core function without the cognitive load of 8 databases. Designed for one-handed phone logging, gym-floor quick entry, and people who bounce off the full system within the first 48 hours.

**Target buyer:** "I want a fitness log in Notion, not a second job." Anyone who bounced off the full 8-DB dashboard in the first week.
**Use case:** Gym-floor logging, weekend warriors, lifters who already track nutrition in MyFitnessPal and just want workouts + habits in Notion.
**Recommended price:** $9 (cheaper SKU) — or bundle as a free downgrade for full-product buyers.

---

## What's Different from the Full Dashboard

| | Full (8 DBs) | Lite (4 DBs) |
|---|---|---|
| Databases | 8 | **4** (Workouts, Nutrition, Habits, Goals) |
| Total properties | ~75 | ~30 |
| Mobile view density | High | **Low** — one screen per database, no nested relations |
| Time to first log | 20 min | **5 min** |
| Sample data rows | ~150 | **~40** |
| Best for | Power users, multi-domain trackers | Casual lifters, gym-floor loggers |
| Programs included | 3 (Beginner, Intermediate, Advanced) | **1** (Intermediate Upper/Lower — most common starting point) |
| Mobile sidebar | 12 items | **4 items** — fits on one screen |
| File size when duplicated | ~3 MB | **<500 KB** |

---

## The 4 Databases

### 1. 🏋️ Workouts (10 properties, down from 15)

| Property | Type | Notes |
|----------|------|-------|
| Session | Title | "Push Day A" |
| Date | Date | — |
| Program | Select | Intermediate Upper A / Lower A / Upper B / Lower B / Custom |
| Type | Multi-select | Strength, Hypertrophy, Cardio, Mobility, HIIT |
| Duration (min) | Number | — |
| Avg RPE | Number (1–10) | — |
| Energy After | Select | 1 Low, 2 Med-Low, 3 Medium, 4 Med-High, 5 High |
| **Streak Day** | Formula | `if(empty(prop("Date")), 0, if(dateBetween(now(), prop("Date"), "days") < 2, 1, 0))` — drives the home streak |
| Sets | Relation → Exercises (lite) | — |
| Notes | Text | — |

**Views:** Calendar (default), Table, Gallery.

**Formulas (1 of 4 — lite total):** Streak Day.

### 2. 💪 Exercises (Lite) (8 properties, down from 12)

| Property | Type | Notes |
|----------|------|-------|
| Exercise | Title | "Back Squat" |
| Muscle Group | Multi-select | Chest, Back, Shoulders, Biceps, Triceps, Quads, Hamstrings, Glutes, Calves, Core, Full Body |
| Equipment | Multi-select | Barbell, Dumbbell, Machine, Cable, Bodyweight, Kettlebell |
| Top Set Weight (kg) | Number | — |
| Top Set Reps | Number | — |
| **Estimated 1RM** | Formula | `if(or(prop("Top Set Weight") == 0, empty(prop("Top Set Reps"))), 0, round(prop("Top Set Weight") * (1 + prop("Top Set Reps") / 30)))` |
| Linked Workout | Relation → Workouts | Two-way |
| Coaching Cues | Text | — |

**Why top-set only:** the full version has 4 inline sets per exercise. The lite collapses to top-set for speed — a lifter who just hit 100 kg × 5 doesn't want to also log the 3 back-off sets. Top set + Estimated 1RM covers 80% of tracking value in 20% of the input cost.

**Views:** Gallery (default), Table.

**Formulas (1 of 4):** Estimated 1RM (lite version, top-set only).

### 3. 🍽️ Nutrition (Lite) (5 properties, down from 10)

| Property | Type | Notes |
|----------|------|-------|
| Meal | Title | "Lunch — Chicken + Rice" |
| Date | Date | — |
| Calories | Number | kcal — single field, not macros |
| Protein (g) | Number | — |
| Quality | Select | Whole Foods, Mixed, Processed, Treat |

**Why calories + protein only:** Most lifters under-log because the macro split feels like accounting. Two numbers (kcal + P) capture 90% of the value and take 5 seconds to enter.

**Views:** Table (default, grouped by date), Calendar.

**Formulas:** None (lite variant).

### 4. 🔁 Daily Habits (5 properties, down from 8)

Same as full version but trimmed:

| Property | Type | Notes |
|----------|------|-------|
| Habit | Title | "10k Steps" |
| Cadence | Select | Daily, Weekdays, Weekly |
| Target | Number | — |
| Unit | Select | Steps, Minutes, Pages, Glasses, Reps, Other |
| **Consistency %** | Formula | `round(100 * (count(prop("Date"))) / 30)` — simple 30-day completion rate |

**Views:** Checklist (default), Calendar heatmap.

**Formulas (1 of 4):** Consistency %.

### 5. 🎯 Goals (Lite) (6 properties, down from 8)

| Property | Type | Notes |
|----------|------|-------|
| Goal | Title | "Bench press 80 kg" |
| Category | Select | Strength, Weight Loss, Habit, Performance |
| Status | Select | Not Started, In Progress, Achieved, Archived |
| Target Date | Date | — |
| **Progress %** | Formula | `if(prop("Status") == "Achieved", 100, if(prop("Status") == "Not Started", 0, if(prop("Target Date") < now(), 100, 0)))` — binary for lite: 0%, 100%, or overdue |
| Notes | Text | — |

**Why binary progress:** the full version has a gradient progress %. For casual users, that's another number to maintain. Lite treats every goal as "not started, in progress (you'll know), or done." Simpler, less guilt.

**Views:** Table (default, grouped by Status), Board.

**Formulas (1 of 4):** Progress % (binary).

---

## Lite Total: 4 Formulas

1. **Workouts → Streak Day** — drives the Home dashboard streak
2. **Exercises → Estimated 1RM** — Epley formula on top set
3. **Daily Habits → Consistency %** — 30-day completion rate
4. **Goals → Progress %** — binary status mapping

---

## Lite Home Dashboard (4 widgets, fits one mobile screen)

```
📊 Home
├── 🔥 Current Streak (Rollup of Workouts where Streak Day = 1)
├── 🎯 Active Goals (Gallery, max 3 visible)
├── 🔁 Today's Habits (Checklist view, single column)
└── 📅 Last Workout (most recent Workouts entry)
```

**That's it.** No "This Week's Snapshot" — the lite buyer doesn't need weekly aggregations. They open the app, see their streak, glance at habits, log the workout, close the app.

---

## Mobile Sidebar Order (Lite — 4 items, fits one screen)

1. 📊 Home
2. 🏋️ Workouts
3. 🔁 Daily Habits
4. 🍽️ Nutrition
5. 🎯 Goals

(5 items total counting Goals; the 4-item "lite" framing refers to the data-tracking databases, not the Goals page which is more of a reference widget.)

---

## CSV Imports for Lite (smaller files)

In `notion-csv-imports/` (when lite is sold as a separate SKU), also provide:

- `lite-workouts.csv` — 12 sessions (3 weeks × 4 sessions/week)
- `lite-exercises.csv` — 8 exercises (just the compound lifts)
- `lite-nutrition.csv` — 14 days of meals (2 weeks)
- `lite-habits.csv` — 4 habits (steps, protein, sleep, water)
- `lite-goals.csv` — 3 goals (one strength, one weight, one habit)

The lite CSV set is roughly 25% the size of the full set — buyer gets enough to see the system in action without the visual density of the full dashboard.

---

## How to Upsell Lite → Full

When a lite buyer hits the wall of "I want to track body metrics / photos / recovery now," offer them a $14 upgrade to the full 8-DB version ($19 full price minus the $9 they paid for lite). Net revenue: $14 from someone who would never have bought the full version at $19.

This is the classic "funnel" structure. Lite is the entry point, not the destination.

---

## Lite Build Checklist

- [ ] Create top-level "📊 Fitness Dashboard (Lite)" page
- [ ] Add 4 sub-pages (databases) with the property schema above
- [ ] Configure 2 relations (Workouts ↔ Exercises)
- [ ] Add 4 formulas (Streak Day, Estimated 1RM, Consistency %, Progress %)
- [ ] Build 3-4 views per database (8-12 views total)
- [ ] Add Home dashboard with 4 widgets
- [ ] Populate with lite sample data (~40 entries)
- [ ] Test mobile sidebar order
- [ ] Duplicate as Notion template, generate share link
- [ ] List on Etsy as separate $9 SKU (or bundle as free add-on to full version)

**Estimated build time: 45 minutes** — half the time of the full version.

---

## When NOT to Offer Lite

The lite variant dilutes the full product's positioning. Skip the lite SKU if:
- You're listing on a marketplace with only 1 SKU per shop
- The full version is already selling well — don't cannibalize
- You can't maintain two sets of CSVs and copy

**When to offer lite:**
- You have a separate "starter" funnel (free PDF, cheap lite, expensive full)
- You're advertising on TikTok / Instagram where casual-lifter traffic is much larger than power-user traffic
- You want a 7-day email sequence that promotes the lite → full upgrade

---

**End of lite-mobile-variant.md**
