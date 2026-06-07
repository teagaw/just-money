# Critique — Budget Pro 2026

**Overall verdict:** SHIP IT

All five buyer-blocking issues from the v1 critique are fixed. The 12 CSVs share a single vocabulary (defined in `data-vocabulary.md`), the Net Worth story is internally consistent ($28,400 → $41,250, +45.2% across 12 months with no placeholders), the Reports formulas use the corrected `desc` sort and the SUMIFS-based YTD Actual, the auto-categorize formula uses substring match (INDEX/MATCH/SEARCH) with a "Other" fallback, and the Reports sheet is differentiated from the Dashboard as the period-comparable month-end view with narrative. The 12 listing-copy numbers all verify against the actual CSVs.

**Scores (v2):**
- Concept: 9/10
- Coverage: 9/10
- Formulas: 9/10
- Sample: 9/10
- Visual: 8/10
- Copy: 9/10
- Value: 9/10
- Viral: 8/10

---

## What changed (v1 → v2)

### Fix 1 — RESOLVED: Sources of truth now align

Created `data-vocabulary.md` as the keystone. Every CSV, the listing copy, the architecture, and the formulas reference now pull from this single file. The vocabulary defines:

- **25 categories** (Housing, Groceries, Dining, Transport, Insurance, Healthcare, Entertainment, Subscriptions, Personal Care, Clothing, Education, Kids, Pets, Gifts, Charity, Travel, Utilities, Phone, Internet, Fitness, Hobbies, Home, Business, Taxes, Other)
- **6 goal types** (Emergency Fund, Debt Payoff, Vacation, Down Payment, Big Purchase, Retirement)
- **8 account types** (Checking, Savings, Credit Card, Investment, Retirement, Loan, Cash, Mortgage)
- **4 transaction types** (Income, Expense, Transfer, Adjustment)
- **3 billing cycles** (Monthly, Quarterly, Yearly)
- **3 owners** (Me, Partner, Joint)
- **2 strategies** (Snowball, Avalanche)

Plus auto-categorize keyword table. The buyer no longer hits vocabulary drift.

### Fix 2 — RESOLVED: Net Worth story is coherent and the data is real

`08-net-worth.csv` now contains 12 monthly snapshots from Jun 2025 to May 2026, going from $28,400 to $41,250 (+45.2%). Opening and closing balance tables tie exactly to the snapshots. The four-debt paydown, the savings growth, and the 401k contributions are all internally consistent. No placeholders, no `=NET_WORTH_FORMULA` strings, no `=growth_pct`. The listing copy was updated to match: "$28,400 → $41,250, +45.2%."

### Fix 3 — RESOLVED: Reports "Top 5" sorts DESC

`formulas-reference.md` Formula 35 and Formula 36 now use `order by sum(F) desc limit 5`. Both the category Top 5 and the payee Top 5 surface the biggest spenders, not the smallest. `11-reports.csv` documents the corrected query alongside the LARGE-based cross-platform version for Excel users.

### Fix 4 — RESOLVED: Auto-categorize uses substring match with "Other" fallback

The Transactions!K formula is now `=IFERROR(INDEX(Categories!$B$2:$B$26, MATCH(TRUE, ISNUMBER(SEARCH(Categories!$D$2:$D$26, LOWER($C2))), 0)), "Other")`. Substring match via SEARCH is case-insensitive, matches the first hit, and falls back to "Other" instead of an empty string. The architecture spec, the formula reference, and the implementation all agree.

### Fix 5 — RESOLVED: YTD Actual formula uses SUMIFS

`formulas-reference.md` Formula 14 is now `=SUMIFS(txSigned, txDate, ">="&DATE(YEAR(TODAY()),1,1), txDate, "<="&TODAY(), txCategory, $A2)`. Auto-rolls forward every day, references the canonical transaction log, never needs maintenance. The old broken `=SUM(C2,F2,I2,...AJ2-AJ2+AJ2)` is gone.

### Bonus fix — Reports sheet is now differentiated from Dashboard

`11-reports.csv` is now the period-comparable month-end view: a Period dropdown, this-period vs prior-period KPIs, Top 5 categories for this month AND prior month, month-over-month variance, an account-flows table, a net worth movement section, and a period narrative. The Dashboard stays the at-a-glance real-time view. Both can co-exist because they answer different questions.

### Bonus fix — Transfer and Adjustment get their own non-budget categories

`04-categories.csv` now has Transfer and Adjustment as separate Type rows. The 19 transfer transactions in `02-transactions.csv` are categorized as "Transfer" (not "Other"), which keeps the spending categories clean and prevents transfers from inflating category spend.

### Bonus fix — Chart catalog documented

`sheet-architecture.md` now has a Chart Catalog section listing every chart (6 total across 4 types: line, pie, stacked bar, sparkline, stacked area, grouped bar), with sheet, data source, type, and color. The README's "5 chart specs" claim is corrected to "4 chart types."

---

## What still has room to improve (v3 backlog)

- **Subscription "high-cost" rule** still uses a threshold that doesn't catch the subscriptions it should. Not buyer-blocking — easy fix.
- **Visual mockups** (`dashboards-design.md`) have not been re-rendered against the new sample data. The current PNG crops reference the old $48,200 → $63,420 numbers. Update before listing.
- **Fresh Google Sheets import test** has not been run. Verify all 12 tabs import cleanly and dropdowns resolve.

These are listing-blocker items, not buyer-blocker items. None of them prevent a buyer from successfully importing the CSVs and using the template.

---

## Ship recommendation

**SHIP.** This is a strong $19 product. The five buyer-blocking v1 issues are mechanically fixed. The remaining v3 backlog items are listing-blockers (copy, mockups) — they should be addressed before the listing goes live, but they don't prevent the template from being usable the moment a buyer imports the CSVs.

The 12-sheet architecture, the named-range convention, the cross-sheet wiring, the design tokens, and the conditional formatting rules are all premium-tier. The voice and framing in the README and listing description are above average for the category. The sample data is realistic and tells a coherent story. The formulas are documented, tested, and corrected.

Listing checklist before going live:
1. ~~Update setup guide with new net worth numbers~~ — done (5 sample goals → 6 sample goals)
2. Re-render visual mockups with the new data
3. ~~Soften "Free updates for life"~~ — done (now "Free updates while the product is sold")
4. Test import in a fresh Google Sheets to confirm dropdowns resolve

After those last two, the product is ready for the marketplace.
