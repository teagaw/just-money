# JUST MONEY — Digital Product Empire

**Mission:** Flood marketplaces with self-promoting, premium digital products until the algorithm can't ignore us. **$4k in 30 days. Quality is the multiplier.**

## Stack

- **AI Brain:** Claude (build, design, copy)
- **Database:** Supabase
- **Hosting:** Vercel
- **Subagents:** Always. Multiple per product when it improves quality.

## The 5 Product Lines

| Line | Sample Product | Price | Why It Self-Promotes |
|------|----------------|-------|----------------------|
| Notion templates | Fitness Dashboard, Business OS | $9-29 | "Look at my setup" screenshots |
| Canva templates | Instagram Bundle, Resume Pack | $12-39 | Posts get shared by buyers |
| AI prompt packs | Midjourney, ChatGPT, DALL-E | $7-19 | Buyers share the AI outputs |
| Spreadsheet templates | Budget Pro, Business Tracker | $9-25 | Goal-hitting screenshots |
| Resume/CV templates | Modern Tech, Executive | $12-29 | "I got hired" posts |

## Revenue Math

- 100+ listings × $15 avg = $1,500 base
- Bundles ($27-97) lift AOV 2-3x
- 5% conversion on Etsy's organic traffic + 30 days of compounding reviews

## Production Pipeline

```
pipeline/
├── templates/         Reusable product-spec template + line blueprints
├── specs/             One spec per product (living document)
└── quality-bar.md     What "premium" means for every line
```

```
products/
├── notion/{name}/     Spec, files, assets, listing copy
├── canva/{name}/
├── prompts/{name}/
├── spreadsheets/{name}/
└── resume/{name}/
```

```
admin/                 Vercel + Supabase dashboard to track:
                        - Products (status, line, price)
                        - Sales by line
                        - Reviews/ratings
                        - Production queue
```

## Subagent Doctrine

**Always subagent-driven.** For every product, dispatch:

1. **Research subagent** — validate demand, find keywords, identify competitors
2. **Builder subagent** — create the actual product files using the research
3. **Critic subagent** — review for quality, push back on weak spots, demand improvements

Multiple subagents per product are encouraged when they improve quality.

## 30-Day Playbook

- **Days 1-7:** 25 products live. First sales. First reviews.
- **Days 8-14:** 50 products live. Optimize bestsellers. First bundle.
- **Days 15-21:** 75 products. Email capture. Cross-sell.
- **Days 22-30:** 100+ products. $4k+ revenue. Brand starts compounding.

## Bank Account Note

Set up direct deposit to your new account on:
- Etsy (payouts once account is verified, ~3-5 days)
- Gumroad (weekly payouts via Stripe)
- Stripe (own Vercel site, instant to bank)

Etsy new-seller holding period is 4-6 weeks for the first payment — **start listing on Day 1** so the first payout lands in Week 5+.

## Status

- [x] Repo initialized
- [x] Directory structure
- [x] Spec written
- [ ] Production pipeline (admin dashboard) — dispatched
- [ ] First 5 products — dispatched
- [ ] Quality bar baseline — established
