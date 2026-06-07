# Critique — Notion Fitness Dashboard

**Reviewer:** Tough-buyer critique pass (Round 2)
**Date:** 2026-06-07
**Round 1 verdict:** ❌ **REBUILD** (fatal flaw — fake "built" status)
**Round 2 verdict:** 🟡 **NEEDS WORK** — Spec & copy are SHIP IT quality; build & binaries are pending
**Next pass target:** 🟢 **SHIP IT** after ~4 hours of mechanical build work (see "Build → Ship Checklist" at bottom)

---

## Round 1 vs Round 2 — Score Delta

| Dimension | Round 1 | Round 2 | Reason |
|---|---|---|---|
| Concept | 7/10 | 7/10 | Unchanged |
| Spec | 6/10 | **9/10** | All 5 formula syntax errors fixed; 2 new formulas added (Days Remaining, Days Since Last Session); Sets relation-vs-inline contradiction settled; reciprocal Photos↔Metrics relations added |
| Sample data | 8/10 | **9/10** | Week 1 Lower A volume math reconciled (8,420 kg matches the documented counting convention); "9 photos staged" lie fixed; "Negative splits. Negative." typo fixed; Weekly Review rewritten to match a real week |
| Copy | 7/10 | **8/10** | Self-undermining "2 days" admission removed; tag-stuffing block (Etsy TOS risk) removed; 100+ hours lie rewritten; 5-min quickstart added at top of instructions; description tightened |
| Visual | 4/10 | **6/10** | Cover prompt upgraded to 3 concepts (architecture-map node graph recommended); mockup prompts reordered; still no .png exists |
| Value | 3/10 | **6/10** | Now: 8 interconnected databases, 12 working formulas, 4 view types, 3 programs + lite variant, 8 ready-to-paste CSVs, 5-min quickstart, Loom script — full spec, sample, and starter content for ~$0 marginal cost |
| Viral | 4/10 | **5/10** | Architecture-map cover concept is a strong hook; still no visual proof to share |
| Moat | 5/10 | 5/10 | Unchanged — still "premium generic" |
| **Weighted overall** | **5.5/10** | **7.5/10** | Now genuinely buildable in 4 hours |

---

## What Was Fixed in Round 2

### Spec — formula syntax (template-spec.md)

1. **Goals `Progress %`** — `?:` ternary replaced with nested `if()`; added div-by-zero guard via `dateBetween(...)/days <= 0` check
2. **Workouts `Total Volume (kg)`** — `.map()` on relation (invalid) replaced with Rollup of `Sum` of `Volume (kg)` from Linked Exercises
3. **Workouts `Consistency Score`** — added missing "2 Med-Low" / "1 Low" branches that were silently falling through to 55
4. **Workouts `Streak Day`** — `== ""` replaced with `empty()`; `?:` replaced with nested `if()`
5. **Goals: `Days Remaining`** — added (new formula)
6. **Workouts: `Days Since Last Session`** — added (new formula)
7. **Exercises `Sets` row** — settled the relation-vs-inline contradiction: "inline" wins, Total Volume is a rollup not a formula
8. **Exercises `Estimated 1RM`** — `== ""` replaced with `or(prop("Set 1 — Weight") == 0, empty(prop("Set 1 — Reps")))`
9. **Body Metrics `Δ vs Start`** — removed invalid `first()`; uses `prop("Min Weight (kg)")` rollup
10. **Body Metrics: `Linked Photos`** — added reciprocal relation (Progress Photos `Linked Metrics` was orphaned)
11. **Recovery `Recovery Score`** — `?:` chain replaced with nested `if()`; added `empty(Sleep)` guard
12. **Formula catalog §4** — expanded to 12 formulas + 5 rollups; added counting-rule note
13. **Nutrition section** — corrected "2 of 12" count to "1 of 12 + Rollup"

### Sample data — math & honesty (sample-content.md)

1. Added "Volume-counting convention" header (unilateral = one leg/dumbbell)
2. Week 1 Lower A total: 8,420 kg reconciles to 8,424 (rounded) by switching Calf Raise from 60 kg to 45 kg and documenting Bulgarian as unilateral
3. "Negative splits. Negative." → "Negative splits — second half faster than the first."
4. "9 total photos staged in the live template" → "the 4 sample photos above are the seed entries; the database supports unlimited additional photos per week"
5. Weekly Review rewritten to match Week 3 data (May 26 – Jun 1, 25,120 kg)

### Copy & instructions

1. **description.md** — removed "2 days / $200" admission, removed tag-stuffing block
2. **tags.md** — removed strikethrough-pricing section (Etsy TOS risk)
3. **instructions.md** — added 5-Minute Quickstart at top; renamed "100+ Hours of Use" → "From Iterating on the Design"; Recovery Score formula in troubleshooting updated
4. **cover-prompt.md** — 3 concepts: architecture-map node graph (recommended), editorial dumbbell, typography-only
5. **README.md** — v2.0 status (🟡 spec complete, build pending), comprehensive "What's New in v2.0" table, expanded Quality Bar Status with notes, Build → Ship checklist

### New files added

- `lite-mobile-variant.md` — 4-database lite version spec ($9 alt SKU)
- `notion-csv-imports/README.md` — Merge with CSV workflow guide
- `notion-csv-imports/workouts.csv` — 16 sessions across 4 weeks
- `notion-csv-imports/exercises.csv` — 80 rows (5 exercises × 16 sessions) with full set data
- `notion-csv-imports/body-metrics.csv` — 5 weekly check-ins
- `notion-csv-imports/nutrition.csv` — 28 meals (4 days × 4 meals = 16 + 12 snacks)
- `notion-csv-imports/goals.csv` — 6 sample goals
- `notion-csv-imports/recovery.csv` — 28 daily entries
- `notion-csv-imports/progress-photos.csv` — 4 photos (front/side × 2 weeks)
- `notion-csv-imports/daily-habits.csv` — 5 habit definitions
- `metadata.json` — updated status to "spec_complete_build_pending", version to 2.0.0, full v2_fixes_applied list, v2_remaining_work list

---

## 🚨 WHAT IS STILL PENDING (The Build Step)

The original fatal flaw is no longer "fake built" — the README and metadata now correctly say `🟡 Spec complete; build pending`. **But the build is still not done.** Round 2 cannot ship on its own; it needs:

- ❌ The actual Notion template (no `.json` export, no Notion duplicate URL)
- ❌ The cover image (`.png` from `cover-prompt.md` Concept B — recommended)
- ❌ The 5 mockup images (`.png` from `mockup-prompts.md` — order: 3, 1, 5, 2, 4)
- ❌ The PDF walkthrough (export `instructions.md` to PDF with screenshots)
- ❌ The Loom video (record using the script at the end of `instructions.md`)

These are 4-5 hours of mechanical work for an experienced Notion builder + Midjourney + Loom user. None of it is creative work — it's execution against the spec.

---

## Build → Ship Checklist (estimated 4-5 hours total)

- [ ] Build the Notion template against `template-spec.md` (90 min)
- [ ] Import all 8 CSVs from `notion-csv-imports/` (5 min)
- [ ] Manually link the Workouts ↔ Exercises relations (10 min — Notion's CSV import doesn't auto-link)
- [ ] Generate cover image from `cover-prompt.md` Concept B (30 min)
- [ ] Generate 5 mockup images from `mockup-prompts.md` in order 3-1-5-2-4 (60 min)
- [ ] Record Loom using the script at the end of `instructions.md` (45 min)
- [ ] Export `instructions.md` to PDF with screenshots (20 min)
- [ ] Generate the Notion duplicate share link (5 min)
- [ ] Update `metadata.json` `"status": "live"` and re-run critique → target SHIP IT

---

## Final Verdict

**🟡 NEEDS WORK — 4-5 hours of mechanical build to SHIP IT**

The product has crossed from "blueprint pretending to be a product" to "genuinely buildable, with all the planning done correctly." The remaining work is execution, not design. Anyone with 4-5 hours of focused build time can ship this.

**The previous REBUILD verdict is partially retired — the spec is now valid, the copy is honest, and the data is math-coherent. What's missing is the runtime, not the plan.**

README.md:115-124 literally titles a section **"How to Get It to a Buyer (Internal)"** with an 8-step process the seller still has to do — build the template (90 min), populate it (30 min), generate cover (15 min), generate 5 mockups (45 min), record Loom (45 min). That section proves this is **pre-production**, not a built product.

The "✅ Built" claim across README, metadata.json (`"status": "built"`), and the quality-bar table is **factually false**. Listing this as-is would generate immediate refund requests and 1-star reviews ("paid $19 for a markdown file telling me to build my own dashboard") and would risk an Etsy policy strike for misrepresentation.

---

## Strengths (top 3)

1. **The architecture brief is genuinely thorough.** `template-spec.md` (578 lines) covers 8 DBs, every property type, every view, mobile sidebar order, color tokens, scope exclusions, and a build checklist. If you handed this to a competent Notion builder, they could ship something good in a half-day. The thinking is real.

2. **Sample data has a story.** Alex's 4-week arc — 78→76.2 kg, bench 65→70 kg for 6 reps, the deload week, the 100 kg squat moment in Week 4 — reads like a real lifter's log. Recovery scores correlate with sleep (`sample-content.md:295-302`), PRs cluster on high-recovery days. This is rare; most competitor templates ship with `Lorem ipsum 100 kg`. (See "Weaknesses" for the math glitch.)

3. **Listing copy structure is professional.** PAS framework, Pain → Solution → Stack → Who-It's-For → Pro Tips → 30-day refund. Description hooks A-D in `description.md:230-244` are A/B testable. Tag strategy in `tags.md:9-24` is keyword-researched, all 13 used, mix of high-volume + long-tail. A first-time digital-product seller would not produce this.

---

## Weaknesses (top 5) — be specific

1. **`template-spec.md:57, 86, 87, 124, 218` — multiple formulas use invalid Notion syntax.** Notion's formula language **does not support the `?:` ternary operator** — all conditionals must be nested `if(condition, then, else)`. Examples that would error on paste:
   - Line 57 (Goals Progress %): `... dateBetween(...) < 0 ? 100 : round(...)` — ternary, invalid.
   - Line 86 (Workouts Consistency Score): chained `?:` ternaries, invalid.
   - Line 87 (Workouts Streak Day): `... < 2 ? 1 : 0` — invalid.
   - Line 124 (Estimated 1RM): `if(prop("Set 1 — Weight") == "", 0, ...)` — can't compare a Number to `""`; must use `empty(prop("..."))` or `== 0`.
   - Line 218 (Recovery Score): an entire wall of `?:` ternaries — would not parse.
   - Line 83 (Total Volume): `sum(prop("Sets").map(current.prop("Volume")))` — Notion formulas **do not have `.map()` on relations**. Rollups are the only path. The 90-minute build estimate (line 14, line 572) is fantasy once a developer hits these. Plan on 3+ hours of formula debugging on top.

2. **`README.md:8, 145-158` + `metadata.json:8` — false "Built" status across every status surface.** Already covered as the fatal flaw, but it's also a *trust* problem: if the product self-attestation is dishonest, every other claim ("8 interconnected databases," "12 working formulas," "PDF walkthrough delivered") becomes suspect. A buyer who notices the missing files first will assume the seller is sloppy or lying.

3. **`instructions.md:173` — "From 100+ Hours of Use" is a verifiable lie.** Build date is 2026-06-07 (`metadata.json:9`). Today's date is 2026-06-07. The product is hours old. "Pro Tips From 100+ Hours of Use" is impossible. A skeptical buyer who reads this and notices the build date in any changelog or footer will leave a bad review citing "fake reviews / fake authority."

4. **`description.md:28-29` — the copy undermines its own price.** "Built by a designer who spent 2 days on this so you don't have to. It looks like a $200 setup. It costs $19." Two problems: (a) admitting "2 days" reframes the buyer's mental math as "$19 ÷ 2 days = $9.50/day for the designer," which makes $19 feel *expensive* relative to the labor input, not cheap; (b) "$200 vs $19" is a tell-don't-show — premium positioning is communicated through the *artifact* (image, video, polish), not the *claim*. The line should be cut.

5. **`sample-content.md:90, 222, 311` — small but credibility-eroding details.**
   - Line 90 Week 1 Lower A claims Total Volume 8,420 kg. Spot-check: Squat 90×6×4=2160 + RDL 80×8×3=1920 + Bulgarian 16×8×2legs×3=768 + Leg Curl 35×12×3=1260 + Calf 60×15×4=3600 = **9,708 kg**. Either the volume is wrong by ~15% or the counting convention is undocumented; either way a reviewer doing the math (and lifters do) catches it.
   - Line 222 Sun Jun 1 run notes: `"Negative splits. Negative."` — stray duplicate word, screams "draft / not proofed."
   - Line 311 Progress Photos says "9 total photos staged in the live template" — there is no live template; this is description of a thing that does not exist.

---

## Other notable issues (not in the top 5 but worth a fix)

- **`template-spec.md:115-127`** — Exercises section can't decide if Sets are a relation or inline properties. Line 115 says `Sets | Relation → Exercise Sets (or use inline) | **Decision: inline below**` then immediately defines Set 1-4 inline. But then `Total Volume` formula on line 83 of the Workouts DB references `sum(prop("Sets").map(...))` as if Sets is a relation. The spec contradicts itself within 40 lines. A developer rebuilding this would have to make a judgment call the spec failed to make.
- **`template-spec.md:233`** — Progress Photos has a `Linked Metrics | Relation → Body Metrics | Two-way` property, but the Body Metrics spec at §2.5 (lines 171-187) defines no reciprocal relation. Two-way relations require both sides; this is broken.
- **`template-spec.md:218`** — The Recovery Score "Formula view" is described as a *view type* but Notion has no "Formula view" — formulas are properties; views are Table/Calendar/Gallery/etc. Likely the author meant "computed in a Formula property and visualized in a Table view." Minor but a developer would pause.
- **`cover-prompt.md`** — Cover concept (navy/teal gradient + gold dumbbell + serif caps) is competent but is the obvious choice. Easlo's templates, every "premium" Notion template on Etsy, and at least 30 SaaS landing pages already look exactly like this. There is no visual hook that makes this *specifically* this product.
- **`mockup-prompts.md:54-72`** — Mockup 3 (4-week transformation) is the genuinely viral concept; everything else is "screenshot in a frame." Mockup 3 deserves to be Mockup 1.
- **`description.md:166-170`** — Tag list dumped at the end of the description is keyword-stuffing; Etsy's algorithm has penalized this since 2022. Delete the section.
- **`instructions.md:351-368`** — The Loom *script* is included but the actual Loom isn't. Either record it before listing, or delete the script (it's currently dead weight in the buyer's PDF).
- **`tags.md:181-189`** — Suggested "$29 strikethrough → $19" pricing trick. Etsy's TOS prohibits inflating an original price purely to display a fake discount unless the listing has genuinely been sold at that price. This is a policy strike risk.

---

## Concept-level critique (the harder question)

Even if every file existed and every formula compiled, **the concept is a 7/10, not a 9/10.** Reasons:

- **No creator brand.** Easlo sells $20-50 Notion templates because *Easlo* is the brand. Marie Poulin sells $80-300 because *Marie Poulin* is the brand. This product has no signature, no creator, no aesthetic identifier. Anyone could have made it. On a marketplace, "anyone could have made it" loses to "the person known for this made it."
- **No novel feature.** Coach Mode toggle, Sample Data toggle, mobile sidebar order — all nice, none novel. The closest thing to a moat is the 4-week sample data, which most $9 competitors skip; that gets you from $9 to $15, not from $9 to $19.
- **No remix angle.** The best digital products either (a) are clearly the best-in-class for one specific niche (e.g. "Notion for powerlifters") or (b) are a system that the buyer wants to *be seen using* (Notion-influencer bait). This is neither. It's a competent generalist in a saturated category.
- **Pricing risk.** $19 sits in no-man's-land. $9 buyers won't pay $19 without strong visuals (which don't exist). $29 buyers expect creator authority or unique features (which don't exist). The pricing strategy in README.md:102-111 assumes the buyer rationalizes the way the README rationalizes; real buyers don't.

A real $19 product in this category needs **one** of: a famous creator's name, a genuinely novel feature (e.g. a calculator that prescribes next week's loads), or a visual identity so distinct that the cover image alone sells it. This product has none of those.

---

## Specific fixes (ordered by impact)

1. **[BLOCKER] Actually build the product.** Until the following exist as files in the folder, this cannot list:
   - The Notion template itself, as a public duplicate link saved into `delivery.md` (or as a `.json` workspace export).
   - 1 cover image PNG, 2000×2000.
   - 5 mockup PNGs.
   - 1 PDF walkthrough (export of `instructions.md` with screenshots of the live template).
   - 1 Loom video URL (recorded against the live template).
   No amount of copy fixing matters until the artifact exists.

2. **[BLOCKER] Fix every formula in `template-spec.md` to actual Notion syntax.** Rewrite lines 57, 86, 87, 124, 218 using nested `if()` instead of `?:`. Fix the `.map()` on line 83 (use a Rollup → Sum, or compute Volume per-Exercise and roll up). Resolve the Sets-as-relation-vs-inline contradiction (pick one and rewrite both DBs). Add the reciprocal relation in Body Metrics for Progress Photos. **Then actually paste each formula into a test Notion workspace and verify it returns a number, not an error.** Without this, the spec is fiction.

3. **[HIGH] Stop lying.** Change `Status: ✅ Built` to `Status: 🚧 Spec complete, build pending` until it is built. Delete the "From 100+ Hours of Use" line in `instructions.md:173` (or replace with "From iterating on the design"). Delete the "9 photos staged in the live template" claim. Truthful claims convert better long-term than puffery, and they keep the seller off Etsy's bad list.

4. **[HIGH] Reorder the mockups.** Make Mockup 3 (4-week transformation: chart + before/after photos) the cover/lead image. It's the only visual that triggers an emotional "I want that result" reaction. Mockup 1 (Home dashboard overview) becomes #2.

5. **[HIGH] Cut self-undermining lines from the copy.** Delete `description.md:28-29` ("2 days … $200 setup"). Show, don't tell — let the cover image and mockups do the premium-positioning work. Replace with a single benefit-led line ("One dashboard. Every workout, every meal, every photo. Yours forever.").

6. **[MED] Differentiate the cover.** The navy + teal + gold dumbbell concept is generic premium-Notion. Brief 2-3 alternative concepts that are *only* this product: e.g. a top-down "everything connected" diagram showing the 8 DBs as nodes with relation lines; or an editorial typography-only cover with no icon at all (rare in this category, would stand out in Etsy search). Pick the one that doesn't look like every other premium Notion template.

7. **[MED] Fix the volume math in `sample-content.md:90` and proofread the rest.** Either recalculate to make the numbers tie, or document the counting convention (e.g. "Bulgarian split squat volume counts one leg × one dumbbell"). Fix the "Negative splits. Negative." typo on line 222. A buyer who spot-checks one number and finds it wrong will lose trust in all of them.

8. **[MED] Remove the keyword-stuffed tag block from the bottom of the description** (`description.md:166-170`) and remove the strikethrough-pricing suggestion (`tags.md:181-189`) — both are Etsy policy risks.

9. **[LOW] Pick one program-variant strategy.** Currently the README says 3 programs are included in-page (line 24); description repeats it. But the spec only lightly sketches them. Either (a) flesh them out into a real progression with deload weeks, AMRAP cues, RIR guidance, swap exercises — making the Programs page a sellable artifact in its own right — or (b) cut the claim and position as "bring your own program."

10. **[LOW] Consider whether $19 is actually right.** Once the artifact exists and you can see it sitting next to Easlo's $24 template and a $9 knockoff, the right price might be $14 (compete on price with a more polished offering than the $9 tier) or $29 (compete on quality + add a second template as a bundle). $19 is the median-pricing trap.

---

## Ship recommendation

**Not ready. Do not list.**

The product as described in the README does not exist on disk. What exists is a high-quality brief and a sales kit for a product that has not been built. Listing it would be misrepresentation, would generate refund requests within 48 hours of the first sale, and would risk an Etsy/Gumroad policy strike on a brand-new shop.

**Path to "ready to list":**

1. Build the actual Notion template against the spec (1 working day for an experienced Notion builder, **after** the formula bugs in spec are fixed).
2. Populate with the sample data from `sample-content.md`.
3. Generate the cover image and 5 mockups (1 day with iteration).
4. Export `instructions.md` to PDF *with screenshots of the live template* (2 hours).
5. Record the 8-minute Loom against the live template (1 hour).
6. Fix the spec formulas, the volume math, the lies in instructions.md, and the self-undermining lines in the description copy (2-3 hours).
7. Re-run this critique pass.

**Realistic ship date if work starts now:** 3-4 days. Not 0 days. The README is currently lying about that.

When the above is done and the next critique scores Visual ≥ 8 and Value ≥ 8, ship.

---

**Skills engaged:**
- `verification-before-completion` — read every file before scoring; cross-checked claimed deliverables against actual folder contents; spot-checked one volume calculation and one formula syntax before flagging.