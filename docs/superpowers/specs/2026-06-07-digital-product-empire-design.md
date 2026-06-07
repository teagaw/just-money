# Digital Product Empire — Design Spec

**Date:** 2026-06-07
**Status:** Approved, in execution
**Owner:** You
**Builder:** Claude + subagents

## Problem

Need $4k in ~30 days. No luxury of time. Solo operator with a full modern stack (Claude, Supabase, Vercel). Need a self-reinforcing production system that:

1. Mass-produces digital products at high quality
2. Sells on existing marketplaces (no audience needed)
3. Self-promotes via buyers showing off the products
4. Compounds: more listings → more sales → more reviews → more sales
5. Requires zero human interaction post-listing

## Strategy

**Volume + Quality = Algorithm Compulsion.** A flood of premium products is unstoppable. Cheap products get shrugged off; premium products get shared. We aim for both — 100+ listings of $200-designer-quality by Day 30.

## Product Lines (5)

Each line was chosen for:
- **Demand:** evergreen or growing
- **Margin:** $7-97 range
- **Self-promotion:** buyers show off results
- **Speed:** buildable in 20-45 min each with subagent help
- **Tools match:** we can ship premium quality

### 1. Notion Templates
- **Products:** dashboards, planners, business systems, trackers
- **Price:** $9-29
- **Channels:** Gumroad, Notion Marketplace, own site
- **Quality bar:** 15+ interconnected databases, beautiful cover, screenshots, video walkthrough

### 2. Canva Templates
- **Products:** Instagram post/story packs, resumes, pitch decks, brand kits
- **Price:** $12-39
- **Channels:** Etsy, Creative Market, own site
- **Quality bar:** 25-50 unique designs per pack, cohesive brand, editable colors/fonts

### 3. AI Prompt Packs
- **Products:** Midjourney styles, ChatGPT systems, image gen workflows
- **Price:** $7-19
- **Channels:** Gumroad, Etsy, PromptBase
- **Quality bar:** 200+ curated prompts, organized by style/use, before/after examples

### 4. Spreadsheet Templates
- **Products:** budget, business tracker, content calendar, sales pipeline
- **Price:** $9-25
- **Channels:** Etsy, Gumroad, own site (Vercel web app version at premium)
- **Quality bar:** 10+ sheets, dynamic formulas, beautiful conditional formatting, instructions

### 5. Resume/CV Templates
- **Products:** modern tech, executive, creative, ATS-optimized
- **Price:** $12-29
- **Channels:** Etsy, Creative Market
- **Quality bar:** 1-page layout, multiple file formats (PDF/DOCX/PSD/AI), ATS-passing

## Subagent Doctrine

Every product goes through 3 subagent stages:

```
[Research] → [Build] → [Critique]
   |          |           |
   v          v           v
specs/    products/    products/
{line}/   {line}/      {line}/
{slug}/   {slug}/      {slug}/
spec.md   CONTENT      critique.md
```

If the critique finds weaknesses, the loop repeats with the same or a different subagent until quality clears the bar (defined in `pipeline/quality-bar.md`).

**Multiple subagents in parallel per stage** are encouraged when debate surfaces real conflicts (e.g., one subagent says "minimal," another says "feature-rich" — the tension is informative).

## Production Pipeline (Admin Dashboard)

A Vercel + Supabase web app at `/admin` tracks:

- **Products:** name, line, price, status (spec/build/critique/listed), listing URL
- **Sales:** by product, by line, by day
- **Reviews:** rating + comment
- **Production queue:** what to build next
- **Quality scores:** subagent critique results

**Not in scope for v1** (later):
- Auto-listing to Etsy/Gumroad via API
- AI cover image generation
- Auto-translation for international marketplaces

## Success Criteria

- **Day 7:** 25 products live, first sales
- **Day 14:** 50 products, $500+ revenue
- **Day 21:** 75 products, $1,500+ revenue
- **Day 30:** 100+ products, $4,000+ revenue
- **Quality:** Average review ≥ 4.7 stars
- **Brand:** Recognizable catalog on at least 2 marketplaces

## Out of Scope (for v1)

- Print-on-demand physical products
- Coaching / consulting (requires human interaction)
- Long-form content (blogs, YouTube) — too slow to monetize
- One massive SaaS — too slow to $4k
- Influencer / social-media marketing — user said they suck at advertising

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Etsy's new-seller payout delay | Start listing Day 1; payouts land Week 5+; also sell on Gumroad (faster) |
| Marketplace saturation | 5 parallel lines spread risk; 100+ listings create moat |
| Quality drops at volume | Mandatory critique stage + quality bar checklist |
| Platform account suspension | Diversify across Etsy + Gumroad + own Vercel site |
| User reviews low | Quality bar is non-negotiable; never list a 3-star product |

## Tech Stack

- **Database:** Supabase (Postgres + auth + realtime)
- **Frontend:** Vercel (Next.js)
- **Payments:** Stripe (own site), Etsy Payments, Gumroad
- **Design assets:** Figma (mockups), Canva, Midjourney/SD (AI art)
- **Production:** Claude subagents (3 per product)

## Decision Log

- **2026-06-07:** Strategy approved. 5 product lines. Etsy + Gumroad primary. Subagent-driven mandatory.
