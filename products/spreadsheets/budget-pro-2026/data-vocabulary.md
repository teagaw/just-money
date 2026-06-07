# Data Vocabulary — Budget Pro 2026

**The single source of truth for every category name, account type, goal type, and transaction type used in the template.** All 12 CSVs and the listing copy must match this file exactly. No drift.

> If you add a new value here, you also need to add it to the relevant CSV(s) and the `data validation` lists in `sheet-architecture.md`. If you don't, dropdowns will silently fail and the buyer experience breaks.

---

## 1. Transaction Categories (25 total — applied to BOTH income and expense rows)

The 25 categories below are the only legal values for the `Category` column on the `Transactions` sheet. They are also the row labels on the `Budget vs Actual` and `Annual` sheets. Income transactions use `Business` (salary, freelance, side-gig) or `Other` (interest, gifts, refunds) as the category, with the specific source captured in the `Payee` column.

| # | Category | Use it for | Tax? | Default Monthly $ |
|---|----------|-----------|------|------------------:|
| 1 | Housing | Rent, mortgage, HOA | sometimes | 1,450 |
| 2 | Groceries | Whole Foods, Trader Joe's, Costco grocery, Safeway | no | 420 |
| 3 | Dining | Restaurants, takeout, coffee shops, food delivery | no | 150 |
| 4 | Transport | Gas, transit, Uber, Lyft, parking, car wash | no | 120 |
| 5 | Insurance | Renters, auto, life, umbrella premiums | sometimes | 180 |
| 6 | Healthcare | Doctor copays, dentist, vision, prescriptions, therapy | yes | 80 |
| 7 | Entertainment | Movies, concerts, bars, books, events | no | 80 |
| 8 | Subscriptions | Streaming, software, gym, memberships, news | no | 65 |
| 9 | Personal Care | Haircuts, toiletries, spa, beauty | no | 60 |
| 10 | Clothing | Apparel, shoes, accessories, dry cleaning | no | 100 |
| 11 | Education | Books, courses, conferences, student loan interest | yes | 50 |
| 12 | Kids | Childcare, school fees, activities, kid supplies | no | 0 |
| 13 | Pets | Food, vet, grooming, daycare, pet insurance | no | 80 |
| 14 | Gifts | Birthdays, holidays, weddings, charitable giving | no | 75 |
| 15 | Charity | Donations, tithing, fundraisers | yes | 50 |
| 16 | Travel | Flights, hotels, rental cars, vacation spend | no | 200 |
| 17 | Utilities | Electric, gas, water, trash, sewer (combined bill) | no | 280 |
| 18 | Phone | Mobile bill, landline | no | 55 |
| 19 | Internet | Home internet, wifi | no | 89 |
| 20 | Fitness | Gym, classes, race fees, equipment | no | 25 |
| 21 | Hobbies | Climbing, music, art, gaming, gear | no | 50 |
| 22 | Home | Repairs, cleaning, supplies, furniture, decor | no | 100 |
| 23 | Business | Salary, freelance, side-gig income; software, equipment, coworking | yes | 100 |
| 24 | Taxes | Quarterly estimated tax payments, tax prep fees | yes | 425 |
| 25 | Other | Cash, ATM, fees, anything that doesn't fit above | no | 50 |

> **Total default monthly outflow: $4,534.** Average sample user spends around $3,800–$4,500/mo, leaving room for the savings/debt sweep.

### Auto-categorize keywords (used by `Transactions!K` formula)

A substring match on the `Payee` column. Case-insensitive. The first match wins.

| Keyword (contains) | Category |
|--------------------|----------|
| `whole foods`, `trader joe`, `safeway`, `costco` | Groceries |
| `chipotle`, `starbucks`, `uber eats`, `olive garden`, `cafe`, `restaurant`, `bar tab` | Dining |
| `shell gas`, `shell`, `uber`, `lyft`, `parking` | Transport |
| `comcast`, `pg&e`, `gas company`, `water dept` | Utilities |
| `verizon`, `at&t`, `tmobile` | Phone |
| `netflix`, `spotify`, `disney`, `hulu`, `hbo` | Entertainment |
| `planet fitness`, `gym`, `yoga` | Fitness |
| `cvs`, `walgreens`, `pharmacy`, `dentist`, `doctor copay` | Healthcare |
| `amazon` | Shopping OR Business (split by amount: <$100 = Clothing/Home, $100+ = Hobbies/Business) |
| `target` | Home (when amount <$60) or Clothing (when amount >=$60) |
| `barber`, `salon` | Personal Care |
| `pet`, `vet` | Pets |
| `payroll`, `acme corp`, `salary` | Business (income) |
| `side gig`, `freelance`, `consulting` | Business (income) |
| `transfer` | Transfer (a separate non-budget category — see §4) |
| `rent`, `landlord` | Housing |
| `geico`, `progressive`, `state farm` | Insurance |
| `betterment`, `vanguard`, `fidelity` | Other (investment transfers) |

---

## 2. Goal Types (6 total — applied to `Goals!B`)

The only legal values for the `Type` column on the `Goals` sheet. Drives default templates and chart coloring.

| # | Goal Type | Default template | When to use |
|---|-----------|------------------|-------------|
| 1 | Emergency Fund | 3 months of expenses in a HYSA | Cash buffer before any other goal |
| 2 | Debt Payoff | Aggressive extra payment on smallest balance | Paying down credit cards, loans |
| 3 | Vacation | Discrete trip with a target date | Flights, hotels, activities, gear |
| 4 | Down Payment | % of home price in a savings account | House, condo, land |
| 5 | Big Purchase | Single high-cost item | Car, laptop, appliance, jewelry |
| 6 | Retirement | Long-horizon, contributions to IRA/401k | Tax-advantaged retirement accounts |

---

## 3. Account Types (8 total — applied to `Accounts!B`)

The only legal values for the `Type` column on the `Accounts` sheet. Drives the `Asset` vs `Liability` flag (`Accounts!I`) and the Net Worth aggregation.

| # | Account Type | Asset or Liability | Notes |
|---|--------------|--------------------|-------|
| 1 | Checking | Asset | Daily spending account |
| 2 | Savings | Asset | HYSA, emergency fund, goal sub-accounts |
| 3 | Credit Card | Liability | Always entered as positive balance, auto-negated for net worth |
| 4 | Investment | Asset | Brokerage, taxable investing |
| 5 | Retirement | Asset | 401k, IRA, Roth IRA, 403b |
| 6 | Loan | Liability | Student loan, personal loan, auto loan |
| 7 | Mortgage | Liability | Home mortgage (separate from Loan for separate reporting) |
| 8 | Cash | Asset | Physical cash, wallet, petty cash |

---

## 4. Transaction Types (4 total — applied to `Transactions!D`)

The only legal values for the `Type` column on the `Transactions` sheet. Drives the sign of `Signed` (`Transactions!F`).

| # | Type | Sign in `Signed` | Required `Category` | Notes |
|---|------|------------------|---------------------|-------|
| 1 | Income | `+ABS(Amount)` | `Business` (salary/freelance) or `Other` (interest/refund) | Payee captures the source |
| 2 | Expense | `-ABS(Amount)` | Any of the 25 categories | Anything you spend money on |
| 3 | Transfer | `0` | **`Transfer`** (separate non-budget category) | Money moving between your own accounts — excluded from income/expense totals |
| 4 | Adjustment | `+Amount` (signed) | **`Adjustment`** (separate non-budget category) | Reconciliation corrections, bank fees, FX — can be + or − |

> **Why Transfer and Adjustment get their own categories:** Keeps the 25 spending categories clean. Budget totals, pie charts, and Top 5 lists automatically exclude these. Without them, transfers would inflate category spend (e.g. a $1,000 savings transfer would show up as a "Personal Care" expense if the auto-cat guessed wrong).

---

## 5. Subscription Billing Cycles (3 total — applied to `Subscriptions!D`)

The only legal values for the `Billing Cycle` column on the `Subscriptions` sheet. Drives the monthly-equivalent math.

| # | Cycle | To monthly | To yearly |
|---|-------|-----------|-----------|
| 1 | Monthly | `Cost × 1` | `Cost × 12` |
| 2 | Quarterly | `Cost ÷ 3` | `Cost × 4` |
| 3 | Yearly | `Cost ÷ 12` | `Cost × 1` |

---

## 6. Account Owners (3 total — applied to `Accounts!F`)

The only legal values for the `Owner` column on the `Accounts` sheet.

| # | Owner | Use it for |
|---|-------|-----------|
| 1 | Me | Accounts in your name only |
| 2 | Partner | Accounts in your partner's name only |
| 3 | Joint | Shared accounts |

---

## 7. Debt Payoff Strategies (2 total — applied to `Debt Payoff!F`)

The only legal values for the `Strategy` column on the `Debt Payoff` sheet.

| # | Strategy | Rule |
|---|----------|------|
| 1 | Snowball | Pay minimums on all debts, throw all extra at the smallest balance first, then roll that payment forward |
| 2 | Avalanche | Pay minimums on all debts, throw all extra at the highest-APR debt first, then roll forward |

---

## 8. Validation rule (every sheet that accepts a vocabulary value)

In Google Sheets, apply a `Data → Data validation` rule of type **List of items** with the comma-separated exact names from this file. For long lists, prefer a `List from a range` pointing at a hidden `_vocab` sheet that mirrors the column from this file.

A value that doesn't match returns a hard red warning and blocks the entry. This is what makes the system work end-to-end.

---

## 9. What changed in v2 (vs. the original 12-CSV deliverable)

| Issue | Before | After |
|-------|--------|-------|
| Categories | 3 different vocabularies across CSVs (8 cols vs 5 cols, "Groceries" vs "Food", etc.) | Single 25-name list in this file, all CSVs use it |
| Goal types | 3 different vocabularies (Emergency Fund / Sinking Fund / Target Amount / Debt Payoff) | Single 6-name list above |
| Account types | 6 names, no Mortgage | Single 8-name list above |
| Transaction types | 3 names, no Adjustment | Single 4-name list above |
| Auto-categorize | VLOOKUP (exact match — fails on "WHOLE FOODS #2345") | `INDEX/MATCH/SEARCH` (substring) |
| Reports Top 5 | Sorted ASC (returned smallest 5) | Sorted DESC (biggest 5) |
| YTD Actual | `SUM(...,AJ2-AJ2+AJ2)` (typo, reduces to AJ2) | `SUM(...,AJ2)` clean |
| Net Worth placeholders | `=NET_WORTH_FORMULA`, `=growth_pct` literal strings | Real numbers, real formulas |

If you find a value in any CSV that is **not** in this file, that's a bug. File an issue and fix the CSV (not this file) so the system stays consistent.
