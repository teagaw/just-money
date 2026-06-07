# Premium Notion Fitness Dashboard — Template Spec

> The complete technical architecture. A Notion developer should be able to rebuild this 1:1 from this document alone.

---

## 1. Workspace Overview

**Slug:** `fitness-dashboard`
**Price:** $19
**Theme variants:** Dark (default), Light
**Icon:** Black dumbbell (lucide:dumbbell)
**Cover:** Custom gradient — deep navy (#0F172A) → muted teal (#0E7490) with subtle grain texture
**Estimated build time from spec:** 90 minutes (manual in Notion)

### 1.1 Top-Level Page Structure

```
📊 Fitness Dashboard (Top-level page, the "Home")
├── 🚀 Quick Start
├── 🎯 Goals (linked database)
├── 🏋️ Workouts (linked database)
├── 💪 Exercises (linked database)
├── 🍽️ Nutrition Log (linked database)
├── 📏 Body Metrics (linked database)
├── 😴 Recovery (linked database)
├── 📸 Progress Photos (linked database)
├── 🔁 Daily Habits (linked database)
├── 📈 Weekly Review (toggle block)
├── 📚 Programs (A–Z library)
├── 🎨 Theme & Cover
└── 📖 How To Use This Dashboard
```

### 1.2 Navigation Order (Mobile-First)

On mobile, Notion collapses sub-pages. Order above is calibrated so the **5 most-touched items** are in the first 6 visible slots:

1. Home → 2. Workouts → 3. Nutrition → 4. Body Metrics → 5. Recovery → 6. Daily Habits

---

## 2. Databases — Full Property, View, Relation, and Formula Definitions

> **Naming convention:** All databases prefixed with an emoji that matches the page icon. All database IDs referenced are relative; use any UUID when rebuilding.

### 2.1 🎯 Goals (8 properties)

| Property | Type | Notes |
|----------|------|-------|
| Goal | Title | "Lose 10 lbs by August 1" |
| Category | Multi-select | Strength, Hypertrophy, Weight Loss, Endurance, Mobility, Habit, Performance |
| Status | Select | Not Started, In Progress, Achieved, Archived (color-coded: gray/yellow/green/red) |
| Priority | Select | P0 Critical, P1 Important, P2 Nice-to-have |
| Target Date | Date | — |
| Start Date | Date | — |
| Days Remaining | Formula | `if(prop("Status") == "Achieved", 0, if(empty(prop("Target Date")), 0, dateBetween(prop("Target Date"), now(), "days")))` — negative if past target |
| Progress % | Formula | `if(prop("Status") == "Achieved", 100, if(prop("Status") == "Not Started", 0, if(prop("Target Date") < now(), 100, if(dateBetween(prop("Start Date"), prop("Target Date"), "days") <= 0, 0, round(100 * (1 - dateBetween(now(), prop("Start Date"), "days") / dateBetween(prop("Start Date"), prop("Target Date"), "days")))))))` |
| Linked Workouts | Relation → Workouts | Two-way |
| Linked Habits | Relation → Daily Habits | Two-way |
| Notes | Text | — |

**Views:**
- **Table (default)** — sort by Priority, group by Status
- **Board** — group by Status, cover = emoji of Category
- **Timeline** — by Target Date
- **Gallery** — large Goal text, Status badge overlay
- **By Category** — filtered Table per category

---

### 2.2 🏋️ Workouts (15 properties)

| Property | Type | Notes |
|----------|------|-------|
| Session | Title | "Push Day A" or "Mon — Upper" |
| Date | Date | — |
| Program | Select | Beginner Full Body A, Beginner FB B, Intermediate Upper A, Intermediate Lower A, Intermediate Upper B, Intermediate Lower B, Advanced Push, Advanced Pull, Advanced Legs, Custom |
| Type | Multi-select | Strength, Hypertrophy, Conditioning, Mobility, Cardio, HIIT |
| Duration (min) | Number | — |
| Avg RPE | Number (1–10) | Rate of Perceived Exertion |
| Energy Before | Select | 1 Low, 2 Med-Low, 3 Medium, 4 Med-High, 5 High |
| Energy After | Select | 1 Low, 2 Med-Low, 3 Medium, 4 Med-High, 5 High |
| Total Volume (kg) | Rollup | `Sum` of `Volume (kg)` from linked Exercises (Linked Exercises → Volume). Notion formulas do not support `.map()` on relations — a rollup of `Volume (kg)` is the correct path. |
| Total Sets | Rollup | Count of Sets from linked Exercises |
| Total Reps | Rollup | Sum of Reps from linked Exercises |
| Consistency Score | Formula | `if(prop("Energy After") == "5 High", 100, if(prop("Energy After") == "4 Med-High", 85, if(prop("Energy After") == "3 Medium", 70, if(prop("Energy After") == "2 Med-Low", 40, 25))))` |
| Streak Day | Formula | `if(empty(prop("Date")), 0, if(dateBetween(now(), prop("Date"), "days") < 2, 1, 0))` — combined into a rollup at Home |
| Days Since Last Session | Formula | `if(empty(prop("Date")), "", dateBetween(now(), prop("Date"), "days"))` — shows 0, 1, 2, 3… days since the workout |
| Linked Exercises | Relation → Exercises | Two-way |
| Notes | Text | — |

**Views:**
- **Calendar (default)** — by Date, color by Program
- **Table** — last 30 days, all properties visible
- **Gallery** — card = Session + Program + Volume + Duration
- **Board** — group by Type
- **Timeline** — by Date, useful for monthly planning
- **This Week** — filtered Table (date = thisWeek)

**Formulas (3 of 12):**
- Total Volume auto-aggregates from linked Exercises
- Consistency Score converts subjective post-workout energy into a 0-100 metric
- Streak Day flags the session as "today/yesterday" for the Home rollup

---

### 2.3 💪 Exercises (12 properties)

| Property | Type | Notes |
|----------|------|-------|
| Exercise | Title | "Back Squat", "Dumbbell Row" |
| Muscle Group | Multi-select | Chest, Back, Shoulders, Biceps, Triceps, Quads, Hamstrings, Glutes, Calves, Core, Forearms, Full Body |
| Pattern | Select | Push, Pull, Hinge, Squat, Lunge, Carry, Rotation, Isolation, Cardio |
| Equipment | Multi-select | Barbell, Dumbbell, Kettlebell, Machine, Cable, Band, Bodyweight, Cardio Machine |
| Difficulty | Select | Beginner, Intermediate, Advanced |
| Sets | **Inline (Sets 1–4 below). Do not use a relation.** | Each exercise row in this DB represents a single (Exercise × Workout) pair, with sets stored as inline Number properties. The Workouts DB's `Total Volume (kg)` rollup sums `Volume (kg)` from this relation. |
| Set 1 — Weight (kg) | Number | — |
| Set 1 — Reps | Number | — |
| Set 2 — Weight (kg) | Number | — |
| Set 2 — Reps | Number | — |
| Set 3 — Weight (kg) | Number | — |
| Set 3 — Reps | Number | — |
| Set 4 — Weight (kg) | Number | — |
| Set 4 — Reps | Number | — |
| Estimated 1RM | Formula | `if(or(prop("Set 1 — Weight") == 0, empty(prop("Set 1 — Reps"))), 0, round(prop("Set 1 — Weight") * (1 + prop("Set 1 — Reps") / 30)))` — Epley formula |
| Best 1RM (All-Time) | Rollup | Max of Estimated 1RM across all linked Exercise rows for the same Exercise title |
| Volume (kg) | Formula | `((prop("Set 1 — Weight") * prop("Set 1 — Reps")) + (prop("Set 2 — Weight") * prop("Set 2 — Reps")) + (prop("Set 3 — Weight") * prop("Set 3 — Reps")) + (prop("Set 4 — Weight") * prop("Set 4 — Reps")))` |
| Linked Workout | Relation → Workouts | Two-way |
| Video Link | URL | YouTube demo (optional) |
| Coaching Cues | Text | — |

**Views:**
- **Gallery (default)** — large card with Exercise + Muscle Group emoji + Best 1RM
- **Table** — every property, filterable by Muscle Group
- **By Pattern** — grouped Table (Push/Pull/Squat/Hinge/etc.)
- **PR Tracker** — sorted by Best 1RM (desc), top of leaderboard

**Formulas (3 of 12):**
- Estimated 1RM via Epley formula: `weight × (1 + reps / 30)`
- Best 1RM rollup tracks personal records across all instances
- Volume (kg) computes total weight moved per exercise

---

### 2.4 🍽️ Nutrition Log (10 properties)

| Property | Type | Notes |
|----------|------|-------|
| Meal | Title | "Breakfast — Oats + Berries" |
| Date | Date | — |
| Meal Type | Select | Breakfast, Lunch, Dinner, Snack, Pre-Workout, Post-Workout |
| Calories | Number | kcal |
| Protein (g) | Number | — |
| Carbs (g) | Number | — |
| Fat (g) | Number | — |
| Water (L) | Number | separate hydration tracker |
| Quality | Select | Whole Foods, Mixed, Processed, Treat |
| Notes | Text | — |

**Views:**
- **Calendar (default)** — by Date, color by Meal Type
- **Daily** — filtered Table for selected date
- **Weekly Average** — grouped Table by week, with summary formulas below
- **Macros Board** — group by Meal Type, gallery view of meal photos if linked

**Formulas (1 of 12) + Rollup:**
- **Daily Calories** — Rollup: `Sum` of `Calories` from a self-relation (each day's meals are linked). Used on the Home dashboard's "This Week's Macros" widget.
- **Macro Split %** — Formula (per row, displayed on the "Weekly Average" view): `round(100 * prop("Protein (g)") * 4 / (prop("Protein (g)") * 4 + prop("Carbs (g)") * 4 + prop("Fat (g)") * 9))` for protein. Repeat the same shape for carbs and fat, or use three Formula properties (P%, C%, F%).

---

### 2.5 📏 Body Metrics (9 properties)

| Property | Type | Notes |
|----------|------|-------|
| Entry | Title | "Week 4 — 06/04" |
| Date | Date | — |
| Weight (kg) | Number | — |
| Body Fat % | Number | optional |
| Waist (cm) | Number | — |
| Chest (cm) | Number | — |
| Hips (cm) | Number | — |
| Arms (cm) | Number | — |
| Thighs (cm) | Number | — |
| Mood | Select | 1 Low, 2 Med-Low, 3 Medium, 4 Med-High, 5 High |
| Energy | Select | 1 Low, 2 Med-Low, 3 Medium, 4 Med-High, 5 High |
| Sleep Last Night (h) | Number | — |
| Linked Photos | Relation → Progress Photos | Two-way (reciprocal of `Linked Metrics` in Progress Photos — both sides must exist for the relation to render correctly) |
| Notes | Text | — |

**Views:**
- **Table (default)** — chronological, all properties
- **Line Chart** — Weight, Waist, Chest over time (Notion's built-in chart view)
- **Weekly Check-in** — filtered to last 7 days
- **Photo + Metrics** — Gallery view linked to Progress Photos

**Formulas (2 of 12):**
- **Δ vs Start (kg)** — Formula: `if(prop("Weight") == 0, 0, round((prop("Weight") - prop("Min Weight (kg)")) * 10) / 10)`. Requires a Rollup of `Min` of `Weight (kg)` from the linked Body Metrics series on the Home page (because Notion has no `first()` function — the lowest recorded weight in the buyer's own history is the natural "start weight" anchor).
- **7-Day Rolling Avg Weight (kg)** — Manual computation block in the Weekly Review page (Notion cannot auto-compute rolling averages over a window inside a single row). Provide the formula template the buyer pastes in: `round(sum(map(prop("Linked Metrics").formula(), …)) / 7 * 10) / 10` — buyer customizes per their own linked series.

---

### 2.6 😴 Recovery (7 properties)

| Property | Type | Notes |
|----------|------|-------|
| Day | Title | "Tue 06/03" |
| Date | Date | — |
| Sleep (h) | Number | — |
| Sleep Quality | Select | Poor, OK, Good, Great |
| Soreness | Select | None, Mild, Moderate, Severe |
| Stress | Select | Low, Med-Low, Medium, Med-High, High |
| HRV (ms) | Number | optional — for users with a Whoop/Oura |
| Resting HR (bpm) | Number | optional |
| Notes | Text | — |

**Views:**
- **Calendar (default)** — by Date
- **Table** — last 14 days
- **Recovery Score** — a Formula *property* (not a view type — Notion has no "Formula view"). The score is shown in the default Table view, and a separate Calendar view exists for date browsing. Formula: `if(empty(prop("Sleep")), 0, (prop("Sleep") * 10) + if(prop("Sleep Quality") == "Great", 30, if(prop("Sleep Quality") == "Good", 20, if(prop("Sleep Quality") == "OK", 10, 0))) + if(prop("Soreness") == "None", 30, if(prop("Soreness") == "Mild", 20, if(prop("Soreness") == "Moderate", 10, 0))) - if(prop("Stress") == "High", 20, if(prop("Stress") == "Med-High", 10, 0)))` — score 0-100. Caps at 100 via the `min(100, …)` wrapper in the property's display formula.

**Formulas (1 of 12):**
- Recovery Score is a single weighted formula that turns subjective inputs into a clean 0-100 metric used on the Home dashboard

---

### 2.7 📸 Progress Photos (5 properties)

| Property | Type | Notes |
|----------|------|-------|
| Photo | Title | "Front — Week 4" |
| Date | Date | — |
| Angle | Multi-select | Front, Side, Back, Custom |
| Lighting | Select | Natural, Gym, Studio, Low Light |
| Linked Metrics | Relation → Body Metrics | Two-way — links to that week's measurement |
| Privacy | Checkbox | "Hidden from Home Gallery" toggle |

**Views:**
- **Gallery (default)** — full-bleed photos, by date
- **Comparison Slider** — side-by-side view via two filtered galleries
- **By Angle** — Board view, group by Angle

**Formula (0 new — uses external comparison):** Comparison Page is a manual toggle in the "Progress" sub-page that shows the oldest and newest photo of each angle.

---

### 2.8 🔁 Daily Habits (8 properties)

| Property | Type | Notes |
|----------|------|-------|
| Habit | Title | "10k steps" |
| Cadence | Select | Daily, Weekdays, Weekly, Custom |
| Target | Number | numeric target (steps, minutes, pages) |
| Unit | Select | Steps, Minutes, Pages, Glasses, Reps, Other |
| Streak | Number | auto-incremented manually or via Notion's date math |
| Linked Goal | Relation → Goals | Two-way |
| Icon | Files & Media | emoji or PNG |
| Notes | Text | — |

**Views:**
- **Checklist (default)** — checkbox view, daily log inline
- **Board** — group by Cadence
- **Heatmap** — Calendar view with a colored marker for each completed day
- **By Goal** — filtered Table

**Formulas (1 of 12):**
- Consistency % = `(Completed Days This Month / Target Days This Month) × 100` — used for the Home dashboard

---

## 3. Master Home Dashboard

The top-level page is a curated layout, not a database. It uses **linked views, rollups, and callout blocks** to summarize everything in one screen.

### 3.1 Top Hero Block

```
👋 Welcome back, [Name]
[Today's Date] • Week [N] of your program

[Callout block, gradient navy → teal]
🔥 Current Streak: [Rollup of Workouts where Streak Day = 1] days
💪 Last Workout: [Rollup of most recent Workout date]
📅 Next Scheduled: [Manual entry / linked Workouts view]
```

### 3.2 Quick-Log Row (4 callout blocks in a row)

```
[Workout] [Meal] [Weight] [Sleep]
 → links to each database with a "New" button
```

### 3.3 This Week's Snapshot (3 columns)

| This Week's Workouts | This Week's Macros | This Week's Recovery |
|---------------------|--------------------|----------------------|
| Embedded Table view (filtered to thisWeek) | Embedded Gallery of Nutrition Log | Embedded Table of Recovery (last 7 days) |

### 3.4 Goals Progress (2 columns)

| Active Goals | Achieved Goals |
|--------------|----------------|
| Gallery of Goals where Status = In Progress | Gallery of Goals where Status = Achieved |

### 3.5 Habits Heatmap

Embedded Calendar view of Daily Habits database, last 90 days. Color: completed = teal, missed = light gray.

### 3.6 Progress Photos Strip

Embedded Gallery view of Progress Photos, last 6 entries, horizontal layout. Privacy-respecting (uses the "Hidden from Home Gallery" toggle).

### 3.7 Footer — Quick Links

- 📚 Programs Library
- 📖 How To Use This Dashboard
- 🎨 Theme Settings
- 🆘 Support & Updates

---

## 4. Formulas — Full Catalog (12 working formulas)

> **Counting rule:** Property-type **Formulas** count. **Rollups** (Sum / Count / Max / Min / Average of related rows) are not counted here — they are configured as Rollup-type properties, not Formulas. The 12 below are the buyer's "logic" layer; rollups handle the aggregation layer.

| # | Database | Formula | Purpose |
|---|----------|---------|---------|
| 1 | Goals | Progress % | Days elapsed vs. total window, with div-by-zero guard |
| 2 | Goals | Days Remaining | Days until target date; negative if overdue |
| 3 | Workouts | Consistency Score | Energy-after → 0-100 (5 High=100, 4 Med-High=85, 3 Medium=70, 2 Med-Low=40, 1 Low=25) |
| 4 | Workouts | Streak Day | 1 if workout is today/yesterday, else 0 — used for streak rollup on Home |
| 5 | Workouts | Days Since Last Session | Counter for the Home dashboard ("haven't trained in N days") |
| 6 | Exercises | Estimated 1RM | Epley: w × (1 + r/30), with empty/zero guard |
| 7 | Exercises | Volume (kg) | Sum of (Set 1 + Set 2 + Set 3 + Set 4) × (reps × weight) |
| 8 | Nutrition | Macro Split % | Protein×4 / Carbs×4 / Fat×9 ratio for the day |
| 9 | Body Metrics | Δ vs Start (kg) | Current Weight − Min Weight (rollup) |
| 10 | Body Metrics | 7-Day Rolling Avg | Manual block in Weekly Review (notion can't compute rolling avg in-row) |
| 11 | Recovery | Recovery Score | Weighted 0-100 from Sleep + Sleep Quality + Soreness − Stress |
| 12 | Daily Habits | Consistency % | Completed days this month ÷ target days this month × 100 |

**Rollups (configured separately, not counted above):**
- Workouts → Total Volume (Sum of Exercises.Volume)
- Workouts → Total Sets (Count of linked Exercises)
- Workouts → Total Reps (Sum of Exercises reps)
- Exercises → Best 1RM All-Time (Max of Estimated 1RM)
- Body Metrics → Min Weight (used by Δ vs Start)

---

## 5. Programs — Beginner, Intermediate, Advanced

### 5.1 Beginner Full Body (3 days/week)

**Day A — Squat focus**
- Goblet Squat 3×10
- Dumbbell Row 3×10
- Push-Up 3×8–12
- Romanian Deadlift 3×10
- Plank 3×30s

**Day B — Hinge focus**
- Romanian Deadlift 3×10
- Dumbbell Bench Press 3×10
- Lat Pulldown 3×10
- Walking Lunge 3×10/leg
- Dead Bug 3×10/side

**Day C — Push focus**
- Dumbbell Shoulder Press 3×10
- Lat Pulldown 3×10
- Goblet Squat 3×10
- Cable Row 3×10
- Side Plank 3×20s/side

**Progression:** Add 2.5 kg when you can complete all sets at the top of the rep range for 2 weeks.

### 5.2 Intermediate Upper/Lower (4 days/week)

**Upper A**
- Bench Press 4×6
- Barbell Row 4×8
- Dumbbell OHP 3×8
- Pull-Up 3×AMRAP
- Bicep Curl 3×12
- Tricep Pushdown 3×12

**Lower A**
- Back Squat 4×6
- Romanian Deadlift 3×8
- Bulgarian Split Squat 3×8/leg
- Leg Curl 3×12
- Calf Raise 4×15

**Upper B**
- Incline DB Press 4×8
- Pull-Up 4×6
- Seated DB OHP 3×10
- Cable Row 3×10
- Lateral Raise 3×15
- Face Pull 3×15

**Lower B**
- Deadlift 4×5
- Front Squat 3×8
- Hip Thrust 3×10
- Leg Extension 3×12
- Hanging Leg Raise 3×10

**Progression:** Add 2.5 kg upper / 5 kg lower when you hit all sets at target reps.

### 5.3 Advanced Push/Pull/Legs (5 days/week)

**Push**
- Bench Press 4×5
- Incline DB Press 3×8
- OHP 4×6
- Lateral Raise 4×12
- Tricep Pushdown 3×12
- Overhead Tricep Extension 3×12

**Pull**
- Weighted Pull-Up 4×6
- Barbell Row 4×8
- Cable Row 3×10
- Face Pull 3×15
- Barbell Curl 3×8
- Hammer Curl 3×10

**Legs**
- Back Squat 5×5
- Romanian Deadlift 4×6
- Bulgarian Split Squat 3×8/leg
- Leg Curl 3×12
- Calf Raise 5×10
- Hanging Leg Raise 3×10

**Upper Accessories A**
- Incline Bench 3×8
- Lat Pulldown 3×10
- Lateral Raise 3×15
- Cable Curl 3×12

**Lower Accessories B**
- Front Squat 3×6
- Hip Thrust 3×10
- Leg Extension 3×12
- Calf Raise 3×15

**Progression:** Double-progression (reps first, then load) or linear load +2.5/5 kg.

---

## 6. View Types Per Database — Summary

| Database | Table | Calendar | Gallery | Board | Timeline | Other |
|----------|:-----:|:--------:|:-------:|:-----:|:--------:|-------|
| Goals | ✓ | | ✓ | ✓ | ✓ | |
| Workouts | ✓ | ✓ | ✓ | ✓ | ✓ | This Week |
| Exercises | ✓ | | ✓ | | | PR Tracker, By Pattern |
| Nutrition | ✓ | ✓ | | ✓ | | Weekly Avg, Daily |
| Body Metrics | ✓ | | | | | Line Chart |
| Recovery | ✓ | ✓ | | | | |
| Progress Photos | | | ✓ | ✓ | | Comparison |
| Daily Habits | ✓ | ✓ | | ✓ | | Heatmap |

**Total: 32 distinct views across 8 databases.** That exceeds the quality bar of 8 databases + multiple view types.

---

## 7. Theme, Color, and Typography

### 7.1 Color Tokens

| Token | Light Mode | Dark Mode | Use |
|-------|------------|-----------|-----|
| `--bg-primary` | `#FFFFFF` | `#0F172A` | page background |
| `--bg-secondary` | `#F8FAFC` | `#1E293B` | callouts, cards |
| `--text-primary` | `#0F172A` | `#F1F5F9` | body text |
| `--text-muted` | `#64748B` | `#94A3B8` | captions |
| `--accent-primary` | `#0E7490` | `#22D3EE` | links, streaks |
| `--accent-success` | `#10B981` | `#34D399` | achieved goals, PRs |
| `--accent-warning` | `#F59E0B` | `#FBBF24` | in progress, attention |
| `--accent-danger` | `#EF4444` | `#F87171` | missed, archived |

### 7.2 Recommended Notion Native Colors (Database Property Colors)

- Goals Status: gray (Not Started), yellow (In Progress), green (Achieved), red (Archived)
- Workouts Program: 6 alternating Notion pastels
- Body Metrics Mood/Energy: red→green gradient
- Recovery Quality: red→green

### 7.3 Icons & Emojis

Each database has a consistent icon used as the page icon AND as a property label. This creates visual continuity even when the dashboard is collapsed in the sidebar.

---

## 8. Mobile Optimization

### 8.1 Sidebar Order (Pinned First)

1. 📊 Home
2. 🚀 Quick Start
3. 🏋️ Workouts
4. 🍽️ Nutrition Log
5. 📏 Body Metrics
6. 😴 Recovery
7. 🔁 Daily Habits
8. 🎯 Goals
9. 💪 Exercises
10. 📸 Progress Photos
11. 📈 Weekly Review
12. 📚 Programs

### 8.2 Per-Database Mobile Notes

- **Workouts (Calendar view):** Use Date as the primary sort. Hide non-essential properties (Notes, Linked Exercises) by default.
- **Nutrition Log (Daily view):** Show only Date, Meal Type, Calories, Protein, Carbs, Fat. Hide Notes, Quality.
- **Body Metrics (Line Chart):** Notion's chart view works on mobile. Pin Weight + Waist.
- **Progress Photos (Gallery):** Set card preview to "Page cover" so the photo is full-bleed.
- **Daily Habits (Checklist):** Single column, large touch targets (≥ 44pt).

### 8.3 Page-Level Mobile Tweaks

- All callout blocks use `icon: 📱` and are small enough to not dominate
- Toggle blocks (like Weekly Review) default to **collapsed** to reduce scroll
- All linked database views use **List or Gallery** on mobile (Table is too narrow)

---

## 9. Privacy, Permissions, and Sharing

### 9.1 Personal Mode (Default)

All data lives in the buyer's own Notion workspace. No data is sent to the seller or to any third party. The template ships as a Notion **duplicate link**, which the buyer opens and saves to their own workspace.

### 9.2 Team / Coach Mode (Optional Toggle)

A toggle at the top of the Home page switches to "Coach View" which:

- Hides the buyer's personal body metrics, mood, and progress photos
- Surfaces: Programs, Workouts (read-only), Goals (collaborative)
- Adds a Coach Notes database (Relation to all primary DBs, write-only by buyer)

### 9.3 Sample Data

The "Alex" sample content is clearly labeled with a **🚧 SAMPLE DATA** tag on every entry. A toggle at the top of Home shows/hides sample data, so buyers can compare their own progress to Alex's example without polluting their dashboard.

---

## 10. What's NOT in the Dashboard (Out of Scope)

- Wearable integrations (Whoop, Oura, Apple Health) — manual entry only
- AI-generated workout recommendations — static programs only
- Calorie auto-tracking from photos — manual entry only
- Social features / leaderboards — single-user only
- Export to PDF — buyer can do this via Notion's built-in export

This scope is intentional. The dashboard's value is **clarity and ownership** of your data, not automation. The buyer owns every row, can edit everything, and isn't locked into a subscription.

---

## 11. Build Checklist (For the Developer Rebuilding This in Notion)

- [ ] Create top-level "📊 Fitness Dashboard" page
- [ ] Add cover image (gradient navy → teal)
- [ ] Set page icon to 🏋️
- [ ] Create 8 sub-pages (databases) with correct icons
- [ ] Add all properties per spec §2
- [ ] Configure relations (Goals ↔ Workouts, Goals ↔ Habits, Workouts ↔ Exercises, etc.)
- [ ] Add all 12 formulas per spec §4
- [ ] Build all 32 views per spec §6
- [ ] Add toggle blocks for Weekly Review, Theme, How To Use
- [ ] Populate with sample data from `sample-content.md`
- [ ] Test mobile sidebar order
- [ ] Test all linked views on Home page render correctly
- [ ] Test formulas with edge cases (empty properties, division by zero)
- [ ] Set workspace color theme to dark or light per buyer's preference
- [ ] Duplicate as template, generate share link
- [ ] Create delivery email with link + walkthrough video

**Estimated build time: 90 minutes** for an experienced Notion builder following this spec.

---

**Document version:** 1.0.0
**Last updated:** 2026-06-07
**Owner:** JUST MONEY — Digital Product Empire
