# Sheet Architecture — Budget Pro 2026

Every sheet, every column, every formula, every formatting rule, every validation. This is the build manual.

## Design Tokens (used everywhere)

### Light mode (default)

| Token | Hex | Use |
|-------|-----|-----|
| `--ink-900` | `#0F172A` | Headers, primary text |
| `--ink-500` | `#64748B` | Secondary text, labels |
| `--ink-300` | `#CBD5E1` | Borders, dividers |
| `--surface` | `#FFFFFF` | Sheet background |
| `--surface-alt` | `#F8FAFC` | Zebra rows, section bg |
| `--accent` | `#10B981` | Income, on-track, positive |
| `--warning` | `#F59E0B` | 80%+ of budget |
| `--danger` | `#EF4444` | Over budget, debts |
| `--info` | `#3B82F6` | Goals, savings |
| `--neutral` | `#94A3B8` | Cleared/reconciled |

### Dark mode (alt palette)

| Token | Hex | Use |
|-------|-----|-----|
| `--ink-900` | `#E2E8F0` | Headers, primary text |
| `--ink-500` | `#94A3B8` | Secondary text |
| `--ink-300` | `#334155` | Borders |
| `--surface` | `#0B0F17` | Sheet background |
| `--surface-alt` | `#1A1F2E` | Zebra rows |
| `--accent` | `#34D399` | Positive |
| `--warning` | `#FBBF24` | Warning |
| `--danger` | `#F87171` | Over budget |
| `--info` | `#60A5FA` | Goals |

### Typography
- **Headers:** Inter / Roboto / system-ui, **Bold**, 12pt
- **Body:** Inter / Roboto / system-ui, Regular, 10pt
- **Numbers:** Tabular alignment, right-justified, 10pt
- **Sheet titles (row 1):** 14pt Bold, color `--ink-900`, background `--surface-alt`

### Cell heights
- Header row: 32px
- Data rows: 24px
- Section dividers: 12px

---

## Tab Order (mobile-friendly — most-used first)

1. 📊 Dashboard
2. 💳 Transactions
3. 🎯 Goals
4. 💰 Budget vs Actual
5. 🏦 Accounts
6. 📈 Net Worth
7. 💸 Debt Payoff
8. 🔁 Subscriptions
9. 🗂️ Categories
10. 📅 Annual
11. 📄 Reports
12. 📖 Tutorial

> Emoji tab names render on Google Sheets web and mobile and act as visual icons.

---

## Sheet 1: Dashboard

**Purpose:** Single-screen overview. The only sheet most users open daily.

### Layout (grid)

```
A     B          C          D          E          F          G          H
─────────────────────────────────────────────────────────────────────────
1  BUDGET PRO 2026 · DASHBOARD                          [Month picker ▼]
2
3  ┌─ THIS MONTH ────────────┐   ┌─ NET WORTH ─────────────────────────┐
4  │ Income       $X,XXX      │   │   line chart of last 12 months      │
5  │ Expenses     $X,XXX      │   │                                     │
6  │ Net          $X,XXX      │   │                                     │
7  │ Savings rate  XX%        │   │                                     │
8  └──────────────────────────┘   └─────────────────────────────────────┘
9
10 ┌─ BUDGET STATUS ──────────────────────────────────────────────────────┐
11 │ Category       Budget    Spent     Remaining   %        Bar          │
12 │ Housing        $1,800   $1,800   $0           100%   ████████████ ✓ │
13 │ Groceries     $450     $445     $5            99%   ███████████░ ✓ │
14 │ Dining        $200     $245     -$45          123%   ████████████ ⚠ │
15 │ ...                                                                  │
16 └──────────────────────────────────────────────────────────────────────┘
17
18 ┌─ TOP CATEGORIES ──────┐  ┌─ GOAL PROGRESS ────────────────────────┐
19 │  pie chart            │  │ Emergency Fund    ████████░░  80%      │
20 │                       │  │ Vacation 2026     ███░░░░░░░  30%      │
21 │                       │  │ Pay off Visa      ███████░░░  72%      │
22 └───────────────────────┘  └────────────────────────────────────────┘
23
23 ┌─ CASH FLOW (last 6 mo) ──────────────────────────────────────────────┐
24 │  bar chart                                                           │
25 └──────────────────────────────────────────────────────────────────────┘
```

### Cells & formulas

| Cell | Content | Formula |
|------|---------|---------|
| `A1` | Title | `BUDGET PRO 2026 · DASHBOARD` |
| `G1` | Month picker | Data validation: list from `Transactions!A:A` unique months |
| `B4` | Income label | `Income` |
| `C4` | Income value | `=SUMIFS(Transactions!E:E, Transactions!D:D, ">0", Transactions!A:A, ">="&EOMONTH($G$1,-1)+1, Transactions!A:A, "<="&EOMONTH($G$1,0))` |
| `B5` | Expenses label | `Expenses` |
| `C5` | Expenses value | `=ABS(SUMIFS(Transactions!E:E, Transactions!D:D, "<0", Transactions!A:A, ">="&EOMONTH($G$1,-1)+1, Transactions!A:A, "<="&EOMONTH($G$1,0)))` |
| `B6` | Net label | `Net` |
| `C6` | Net value | `=C4-C5` |
| `B7` | Savings rate | `Savings rate` |
| `C7` | Savings rate value | `=IF(C4=0, 0, C6/C4)` formatted as `%` |

### Budget status table (rows 11–25)

| Col | Header | Formula |
|-----|--------|---------|
| `A` | Category | from `Categories!A:A` (expense only) |
| `B` | Budget | `=VLOOKUP(A11, 'Budget vs Actual'!A:M, MONTH($G$1)+1, FALSE)` |
| `C` | Spent | `=ABS(SUMIFS(Transactions!E:E, Transactions!F:F, A11, Transactions!A:A, ">="&EOMONTH($G$1,-1)+1, Transactions!A:A, "<="&EOMONTH($G$1,0)))` |
| `D` | Remaining | `=B11-C11` |
| `E` | Percent | `=IF(B11=0, 0, C11/B11)` |
| `F` | Bar | `=REPT("█", MIN(12, ROUND(E11*12,0))) & REPT("░", MAX(0, 12-ROUND(E11*12,0)))` |
| `G` | Flag | `=IF(E11>1, "⚠", IF(E11>=0.8, "▲", "✓"))` |

### Conditional formatting

| Range | Condition | Format |
|-------|-----------|--------|
| `D11:D40` | Value `< 0` | bg `--danger`, text white |
| `D11:D40` | Value `>= 0` | bg `--accent`, text white |
| `E11:E40` | `>= 1.0` | bold, text `--danger` |
| `E11:E40` | `>= 0.8 AND < 1.0` | text `--warning` |
| `E11:E40` | `< 0.8` | text `--accent` |
| `C7` | `>= 0.20` | bold, bg `--accent` |
| `C7` | `< 0.10` | bold, bg `--warning` |
| `C6` | `< 0` | text `--danger` |

### Charts

| Chart | Data range | Type | Notes |
|-------|------------|------|-------|
| Net Worth Trend | `'Net Worth'!A2:B14` | Smooth line | x = month, y = net worth, color `--info` |
| Top Categories | `A11:A20, C11:C20` | Pie | 5-color palette pulled from tokens |
| Cash Flow | `Reports!A:C` (last 6 months) | Stacked bar | green = income, red = expense |

### Validations
- `G1` — must be a date that exists in `Transactions!A:A`

---

## Sheet 2: Transactions

**Purpose:** Single source of truth. Every income and expense.

### Columns (header row 1)

| Col | Header | Type | Validation | Notes |
|-----|--------|------|------------|-------|
| `A` | Date | Date | `is valid date` | format `YYYY-MM-DD` |
| `B` | Account | Text | List from `Accounts!A2:A` | dropdown |
| `C` | Payee | Text | none | the merchant or person |
| `D` | Type | Text | List: `Income, Expense, Transfer` | drives sign |
| `E` | Amount | Number | `is number` | positive for income, negative for expense (auto via formula in `F`) |
| `F` | Signed | Number | `=IF(D2="Income", ABS(E2), IF(D2="Expense", -ABS(E2), 0))` | helper, used by Dashboard sums |
| `G` | Category | Text | List from `Categories!A:A` | dropdown |
| `H` | Subcategory | Text | List from `Categories!B:B` | optional |
| `I` | Notes | Text | none | freeform |
| `J` | Cleared | Checkbox | TRUE/FALSE | true once you reconcile against bank |
| `K` | Auto-cat | Text | `=IFERROR(VLOOKUP(C2, Categories!D:E, 2, FALSE), "")` | suggested category from rules |

### Conditional formatting

| Range | Condition | Format |
|-------|-----------|--------|
| `D:D` | `="Income"` | text `--accent`, bold |
| `D:D` | `="Expense"` | text `--danger` |
| `D:D` | `="Transfer"` | text `--neutral`, italic |
| `J:J` | `=TRUE` | bg `--surface-alt`, opacity-feel via lighter text |
| `G:G` | `ISBLANK(G2)` | bg `--warning` at 20% — flags uncategorized rows |

### Frozen panes
- Row 1 frozen (header)
- Column A frozen (date)

### Sort default
- By column A (date) descending — newest at top

### Filter view
- Filter ON for entire table

### Sample data
- 90 rows across 3 months (March–May 2026) covering ~12 categories
- Includes income from "Payroll Inc" and "Freelance Client", expenses across all categories

---

## Sheet 3: Budget vs Actual

**Purpose:** Plan monthly, see green/amber/red instantly.

### Columns

| Col | Header | Formula |
|-----|--------|---------|
| `A` | Category | from `Categories!A:A` |
| `B` | Jan Budget | manual entry |
| `C` | Jan Actual | `=ABS(SUMIFS(Transactions!F:F, Transactions!G:G, $A2, Transactions!A:A, ">="&DATE(2026,1,1), Transactions!A:A, "<="&DATE(2026,1,31)))` |
| `D` | Jan Var | `=B2-C2` |
| `E` | Feb Budget | manual |
| `F` | Feb Actual | analogous formula for Feb |
| `G` | Feb Var | `=E2-F2` |
| ... | ... | repeats for all 12 months |
| `AJ` | YTD Budget | `=SUM(B2,E2,H2,K2,N2,Q2,T2,W2,Z2,AC2,AF2,AI2)` |
| `AK` | YTD Actual | `=SUM(C2,F2,I2,L2,O2,R2,U2,X2,AA2,AD2,AG2,AJ2-AJ2+AJ2)` — corrected: sums every Actual column |
| `AL` | YTD Var | `=AJ2-AK2` |

> The template uses a pivot-style layout: **25 rows** for categories × **36 month columns** (Budget / Actual / Var per month) + 3 YTD summary cols.

### Conditional formatting

| Range | Condition | Format |
|-------|-----------|--------|
| Variance cols (`D, G, J ...`) | `< 0` | bg `--danger`, white text |
| Variance cols | `> 0 AND < B*0.2` | bg `--accent`, white text |
| Variance cols | `>= B*0.2` | bg `--info`, white text (under-spent by 20%+) |
| Actual cols | `> Budget` | bold, text `--danger` |
| Actual cols | `>= 0.8 * Budget AND <= Budget` | text `--warning` |

### Frozen panes
- Row 1 + column A frozen

---

## Sheet 4: Categories

**Purpose:** Master list of categories + auto-categorization rules.

### Columns

| Col | Header | Type | Notes |
|-----|--------|------|-------|
| `A` | Category | Text | e.g. `Housing`, `Groceries`, `Business` |
| `B` | Subcategory | Text | e.g. `Groceries`, `Restaurants` |
| `C` | Type | Text | `Income` or `Expense` |
| `D` | Match keyword | Text | substring matched against payee (case-insensitive) |
| `E` | Suggested category | Text | which category to auto-assign |
| `F` | Default monthly budget | Number | seeds Budget vs Actual when copied |
| `G` | Tax-relevant | Checkbox | true if used at tax time |
| `H` | Color | Text | hex used for charts on this category |

### Default categories (pre-populated)

> **See `data-vocabulary.md` §1 for the canonical 25-category list** and `csv-templates/04-categories.csv` for the live data. The Categories sheet ships pre-populated with all 25 categories + 4 income rows + 2 non-budget rows (Transfer, Adjustment) = 27 data rows total.

**Sample of the 25 categories** (illustrative, see data file for the complete list with subcategories and defaults):

| Category | Sub | Type | Default Budget | Color |
|----------|-----|------|---------------:|-------|
| Housing | Rent or mortgage | Expense | 1450 | `#0F172A` |
| Housing | Utilities | Expense | 280 | `#1E293B` |
| Groceries | — | Expense | 450 | `#F59E0B` |
| Dining | Restaurants | Expense | 200 | `#FBBF24` |
| Transport | Gas | Expense | 160 | `#3B82F6` |
| Insurance | Health | Expense | 220 | `#EF4444` |
| Entertainment | Streaming | Expense | 45 | `#EC4899` |
| Subscriptions | Software | Expense | 60 | `#8B5CF6` |
| Personal Care | Haircut/Beauty | Expense | 40 | `#C084FC` |
| Business | Salary | Income | 5400 | `#10B981` |
| Business | Freelance | Income | 800 | `#34D399` |

The 25 default categories cover every spending type a freelancer, couple, or first-time budgeter needs. To customize, edit the row, or insert a new row at the bottom — the formulas auto-extend.

### Auto-cat rules (embedded in Categories sheet)

The `Match keyword` column (col `D`) holds the substring rule. The Transactions sheet's auto-categorize formula `=IFERROR(INDEX(Categories!$B$2:$B$26, MATCH(TRUE, ISNUMBER(SEARCH(Categories!$D$2:$D$26, LOWER($C2))), 0)), "Other")` scans each payee against the keyword list and returns the matching subcategory. If no keyword matches, the transaction lands in `Other` (a user-friendly fallback — not a hard error).

**Sample rules** (full list in `04-categories.csv`):

| Match keyword | Maps to subcategory |
|---------------|---------------------|
| `whole foods` | Groceries |
| `trader joe` | Groceries |
| `chipotle` | Dining |
| `shell` | Transport (Gas) |
| `uber` | Transport (Rideshare) |
| `netflix` | Subscriptions (Streaming) |
| `spotify` | Subscriptions (Music) |
| `payroll` | Business (Salary) |
| `vanguard` | Investments |

---

## Sheet 5: Accounts

**Purpose:** Every account that holds money — assets and debts.

### Columns

| Col | Header | Type | Notes |
|-----|--------|------|-------|
| `A` | Account | Text | unique name |
| `B` | Type | Text | List: `Checking, Savings, Credit Card, Loan, Investment, Cash, Other` |
| `C` | Institution | Text | bank/broker name |
| `D` | Balance (live) | Number | manual update |
| `E` | Last updated | Date | format `YYYY-MM-DD` |
| `F` | Owner | Text | List: `Me, Partner, Joint` |
| `G` | APR | Number | for credit + loans, formatted `%` |
| `H` | Minimum payment | Number | for credit + loans |
| `I` | Asset or Liability | Text | `=IF(OR(B2="Credit Card", B2="Loan"), "Liability", "Asset")` |
| `J` | Signed balance | Number | `=IF(I2="Liability", -ABS(D2), ABS(D2))` |

### Conditional formatting

| Range | Condition | Format |
|-------|-----------|--------|
| `B:B` | `="Credit Card"` or `="Loan"` | bg `--danger` at 20%, text `--danger` |
| `B:B` | `="Investment"` | bg `--info` at 20%, text `--info` |
| `D:D` | `J<0` | text `--danger`, prefix `-` |
| `E:E` | `older than 30 days` (`=TODAY()-E2>30`) | bg `--warning` |

### Sample (8 accounts)

> **See `csv-templates/05-accounts.csv` for the live data.** The Accounts sheet ships with 8 rows covering all 8 account types (Checking, Savings, Investment, Retirement, Credit Card, Loan, Cash — and any of Mortgage/Other the buyer adds).

**Sample rows** (illustrative):

| Account | Type | Institution | Balance | APR | Min |
|---------|------|-------------|--------:|----:|----:|
| Chase Checking | Checking | Chase | 3,400.00 | — | — |
| Ally Savings | Savings | Ally | 12,200.00 | 4.25% | — |
| Vanguard Brokerage | Investment | Vanguard | 18,200.00 | — | — |
| Fidelity 401k | Retirement | Fidelity | 21,500.00 | — | — |
| Chase Visa | Credit Card | Chase | -2,800.00 | 24.99% | 85 |
| Nelnet Student | Loan | Nelnet | -15,800.00 | 5.50% | 180 |
| Car Loan | Loan | Capital One | -8,400.00 | 6.75% | 225 |
| Cash Wallet | Cash | Home | 100.00 | — | — |
| 401(k) | Investment | Fidelity | 41,200.00 | 2026-05-31 | Me | — | — |

---

## Sheet 6: Goals

**Purpose:** Track every savings/payoff goal with a live progress bar and projected hit date.

### Columns

| Col | Header | Type | Formula / Notes |
|-----|--------|------|-----------------|
| `A` | Goal | Text | name |
| `B` | Type | Text | `Savings, Debt, Purchase, Emergency` |
| `C` | Target $ | Number | how much you need |
| `D` | Current $ | Number | manual or from Accounts |
| `E` | Linked account | Text | dropdown from Accounts!A |
| `F` | Auto-sync | Checkbox | if TRUE, `D = lookup of Accounts.D` |
| `G` | Synced current | Number | `=IF(F2, VLOOKUP(E2, Accounts!A:D, 4, FALSE), D2)` |
| `H` | Progress % | Number | `=G2/C2` formatted % |
| `I` | Bar | Text | `=REPT("█", MIN(10, ROUND(H2*10,0))) & REPT("░", MAX(0, 10-ROUND(H2*10,0)))` |
| `J` | Target date | Date | when you want to hit it |
| `K` | Monthly need | Number | `=IF(J2<=TODAY(), 0, (C2-G2)/MAX(1, DATEDIF(TODAY(), J2, "M")))` |
| `L` | Current pace | Number | manual: your typical monthly contribution |
| `M` | Projected hit | Date | `=IF(L2<=0, "—", EDATE(TODAY(), CEILING((C2-G2)/L2, 1)))` |
| `N` | Status | Text | `=IF(H2>=1, "✓ Complete", IF(M2="—", "⏸ Stalled", IF(M2<=J2, "🎯 On track", "⚠ Behind")))` |

### Conditional formatting

| Range | Condition | Format |
|-------|-----------|--------|
| `H:H` | `>= 1` | bg `--accent`, white |
| `H:H` | `>= 0.5 AND < 1` | bg `--info` |
| `H:H` | `< 0.25` | bg `--warning` |
| `N:N` | contains `"Complete"` | bg `--accent` |
| `N:N` | contains `"On track"` | text `--info`, bold |
| `N:N` | contains `"Behind"` | text `--danger`, bold |
| `N:N` | contains `"Stalled"` | text `--neutral`, italic |

### Sample goals
1. Emergency Fund · Savings · Target $10,000 · Current $4,800 · Date 2026-12-31
2. Vacation Italy 2027 · Purchase · Target $4,500 · Current $1,350 · Date 2027-05-01
3. Pay off Visa · Debt · Target $0 · Current $2,180 (negative goal) · Date 2026-12-31
4. New laptop · Purchase · Target $2,400 · Current $600 · Date 2026-10-01
5. 6-month runway · Savings · Target $30,000 · Current $13,000 · Date 2027-12-31

---

## Sheet 7: Debt Payoff

**Purpose:** Snowball vs avalanche, side-by-side, with payoff month.

### Top section: Debt list (rows 1–20)

| Col | Header | Formula |
|-----|--------|---------|
| `A` | Debt name | Text |
| `B` | Balance | Number |
| `C` | APR | Number, % |
| `D` | Minimum | Number |
| `E` | Extra payment | Number |
| `F` | Total payment | `=D2+E2` |
| `G` | Months to payoff (this debt only) | `=IF(F2*12 <= B2*C2, "Never", NPER(C2/12, -F2, B2))` |
| `H` | Total interest paid | `=F2*G2 - B2` |

### Middle section: Snowball strategy (rows 22+)

> Sort: ascending by Balance
> Each row gets all extra payment until paid off, then the freed-up money rolls to the next.

| Col | Header |
|-----|--------|
| `J` | Snowball order |
| `K` | Snowball payoff month |
| `L` | Snowball total interest |

### Lower section: Avalanche strategy (rows 22+)

> Sort: descending by APR
> Each row gets all extra payment until paid off, then rolls to next.

| Col | Header |
|-----|--------|
| `M` | Avalanche order |
| `N` | Avalanche payoff month |
| `O` | Avalanche total interest |

### Summary box (rows 1–4, cols Q–S)

| Cell | Content | Formula |
|------|---------|---------|
| `Q1` | Snowball total months | `=MAX(K:K)` |
| `Q2` | Avalanche total months | `=MAX(N:N)` |
| `Q3` | Snowball total interest | `=SUM(L:L)` |
| `Q4` | Avalanche total interest | `=SUM(O:O)` |
| `R1` | Δ months (avalanche faster by) | `=Q1-Q2` |
| `R3` | Δ interest (avalanche saves) | `=Q3-Q4` |

### Conditional formatting

| Range | Condition | Format |
|-------|-----------|--------|
| `B:B` | `=0` | strikethrough, text `--neutral` |
| `C:C` | `>= 0.20` | bold, text `--danger` |
| `H:H` | `>= 1000` | text `--danger` |
| `R3` | `> 0` | bold, bg `--accent` |

### Chart
- Bar chart comparing payoff month per debt under each strategy

---

## Sheet 8: Net Worth

**Purpose:** Monthly snapshot of assets, liabilities, net worth. Most addictive sheet.

### Columns

| Col | Header | Formula |
|-----|--------|---------|
| `A` | Month | Date (first of month) |
| `B` | Total Assets | manual entry OR `=SUMIF(Accounts!I:I, "Asset", Accounts!D:D)` for current month |
| `C` | Total Liabilities | manual OR `=SUMIF(Accounts!I:I, "Liability", Accounts!D:D)` |
| `D` | Net Worth | `=B2-C2` |
| `E` | Change vs last month $ | `=D2-D1` |
| `F` | Change vs last month % | `=IF(D1=0, 0, (D2-D1)/ABS(D1))` |
| `G` | Sparkline | `=SPARKLINE(D$2:D2, {"charttype","line";"color1","#3B82F6"})` |

### Sample (12 rows: Jun 2025 – May 2026)
Each month showing realistic growth from `$48,000 → $63,000` net worth.

### Conditional formatting

| Range | Condition | Format |
|-------|-----------|--------|
| `E:E` | `> 0` | text `--accent`, prefix `+` |
| `E:E` | `< 0` | text `--danger` |
| `D:D` | `>= D1` | bg `--surface-alt` (the row is greener than last) |

### Charts
- Line chart: `A:A` vs `D:D`, smooth, color `--info`, marker at last point
- Stacked area: `A:A`, `B:B`, `C:C` showing assets + liabilities composition over time

---

## Sheet 9: Subscriptions

**Purpose:** Find money leaking to subscriptions you don't use.

### Columns

| Col | Header | Formula |
|-----|--------|---------|
| `A` | Service | Text |
| `B` | Category | dropdown from Categories |
| `C` | Cost | Number |
| `D` | Frequency | List: `Monthly, Yearly, Quarterly` |
| `E` | Monthly equivalent | `=IF(D2="Monthly", C2, IF(D2="Yearly", C2/12, IF(D2="Quarterly", C2/3, 0)))` |
| `F` | Yearly equivalent | `=E2*12` |
| `G` | Renewal date | Date |
| `H` | Last used | Date |
| `I` | Used in last 30d? | `=IF(TODAY()-H2<=30, TRUE, FALSE)` |
| `J` | Cancel? | Checkbox |
| `K` | If cancelled, save/yr | `=IF(J2, F2, 0)` |

### Summary row (row 1 or row 30)

| Cell | Formula |
|------|---------|
| `E30` total monthly | `=SUM(E2:E29)` |
| `F30` total yearly | `=SUM(F2:F29)` |
| `K30` savings if all cancelled | `=SUM(K2:K29)` |

### Conditional formatting

| Range | Condition | Format |
|-------|-----------|--------|
| `I:I` | `=FALSE` | bg `--warning` — you might not need this |
| `J:J` | `=TRUE` | strikethrough row, text `--neutral` |
| `F:F` | `> 200` | bold (high-cost annual subscriptions) |

### Sample (10 subscriptions)
Netflix, Spotify, Adobe CC, Google Workspace, Notion, iCloud+, Audible, Calm, NYT, Costco

---

## Sheet 10: Annual

**Purpose:** Year at a glance. Pivot of every category × month.

### Columns

| Col | Header |
|-----|--------|
| `A` | Category |
| `B-M` | Jan–Dec amount |
| `N` | YTD Total |
| `O` | Monthly Avg |
| `P` | Last Year |
| `Q` | YoY % change |
| `R` | Tax-relevant? |

### Formula for each month column

```
=ABS(SUMIFS(Transactions!F:F, Transactions!G:G, $A2,
            Transactions!A:A, ">="&DATE(YEAR(TODAY()),COLUMN()-1,1),
            Transactions!A:A, "<="&EOMONTH(DATE(YEAR(TODAY()),COLUMN()-1,1),0)))
```

### Big-expense ledger (rows 30+)

| Col | Header |
|-----|--------|
| `A` | Date |
| `B` | Description |
| `C` | Category |
| `D` | Amount |
| `E` | Notes |

> Anything over $500 is flagged with bg `--info`.

### Conditional formatting

| Range | Condition | Format |
|-------|-----------|--------|
| Monthly cells | `> Categories.F * 1.2` | bg `--danger` (way over budget) |
| Monthly cells | `< Categories.F * 0.5` AND `> 0` | bg `--info` (under-spent) |
| `R:R` | `=TRUE` | bg `--surface-alt`, text `--ink-900` bold |

---

## Sheet 11: Reports

**Purpose:** Auto-generated month-end summary you can screenshot or PDF-print.

### Layout

```
A                B            C            D
─────────────────────────────────────────────
1  MONTH-END REPORT · [Month YYYY]
2
3  HEADLINE NUMBERS
4  Income            $X,XXX
5  Expenses          $X,XXX
6  Net               $X,XXX
7  Savings rate      XX%
8
9  vs LAST MONTH
10 Income change     +X%
11 Expenses change   -X%
12 Net change        +X%
13
14 TOP 5 SPENDING CATEGORIES
15 1. Housing        $X,XXX  (XX% of expenses)
16 2. Groceries      $XXX    (XX%)
17 ...
19
20 TOP 5 PAYEES
21 1. Whole Foods    $XXX
22 ...
26
27 GOAL PROGRESS THIS MONTH
28 Emergency Fund    +$400  →  80%
29 ...
33
34 WINS
35 - Stayed under budget in 20/25 categories
36 - Net worth grew $XXX
37 - Goal X hit 100%
38
39 LEAKS
40 - Over budget in: Dining (+$45), Subscriptions (+$12)
41 - 3 subscriptions not used in 60 days: Audible, Calm, Costco
```

### Key formulas

| Cell | Formula |
|------|---------|
| `C4` Income | same SUMIFS as Dashboard `C4` |
| `C5` Expenses | same as Dashboard `C5` |
| `C10` Income change | `=(C4 - 'Reports'!C4_lastmonth) / 'Reports'!C4_lastmonth` (uses named range that shifts) |
| Top 5 cats | `=QUERY(Transactions!A:G, "select G, sum(F) where D='Expense' and A>=date '..' group by G order by sum(F) asc limit 5")` |
| Top 5 payees | `=QUERY(Transactions!A:G, "select C, sum(F) where D='Expense' and A>=date '..' group by C order by sum(F) asc limit 5")` |

### Conditional formatting

| Range | Condition | Format |
|-------|-----------|--------|
| Change rows (`C10:C12`) | `> 0` AND Income row | text `--accent` |
| Change rows | `< 0` AND Expense row | text `--accent` |
| Change rows | `> 0` AND Expense row | text `--danger` |
| Wins/Leaks section | bg `--surface-alt`, 2-row border |

### Print area
- `A1:D45` set as print area, fits one page portrait

---

## Sheet 12: Tutorial

**Purpose:** Onboarding. Sample data + step-by-step.

### Layout

```
Row 1: 📖 BUDGET PRO 2026 · TUTORIAL
Row 2: blank
Row 3-12: WELCOME box
   - What this template does
   - How long setup takes
   - The 4-step workflow
Row 14-30: STEP 1 — Set up your accounts
Row 32-50: STEP 2 — Customize categories
Row 52-70: STEP 3 — Add your first transactions
Row 72-90: STEP 4 — Set goals
Row 92-110: STEP 5 — Read the dashboard
Row 112-130: TROUBLESHOOTING
Row 132-150: SAMPLE DATA LOCATION (when to delete it)
```

Full content in `tutorial.md` and `csv-templates/12-tutorial.csv`.

---

## Chart Catalog

Four chart types used across the workbook. Each instance is listed with its data source, type, color, and the sheet it appears on.

| # | Chart | Sheet | Type | Data Source | Color | Purpose |
|---|-------|-------|------|-------------|-------|---------|
| 1 | Net Worth Trend | Dashboard (G3:H8) | Smooth line | `08-net-worth!A2:A13` vs `08-net-worth!D2:D13` | `--info` | 12-month trajectory at a glance |
| 2 | Top Categories | Dashboard (D17:E20) | Pie | `01-dashboard!B25:B29` vs `01-dashboard!C25:C29` (Top 5) | 5-color palette from tokens | Spending distribution this month |
| 3 | Cash Flow | Dashboard (A23:G25) | Stacked bar | `03-budget-vs-actual!Mar:May` actuals | green = income, red = expense | Income vs expense, last 3 months |
| 4 | Net Worth Composition | Net Worth (H2:N13) | Stacked area | `08-net-worth!A:A` + `B:B` (assets) + `C:C` (liabilities) | `--accent` + `--danger` | Show how assets and debts shift over time |
| 5 | Sparkline | Net Worth (G2:G13) | In-cell sparkline | `08-net-worth!D2:D{n}` | `--info` | Per-row trendline for each month |
| 6 | Debt Payoff Comparison | Debt Payoff (J22:O25) | Grouped bar | `07-debt-payoff!K2:K5` (Snowball) + `07-debt-payoff!N2:N5` (Avalanche) | `--info` + `--accent` | Months-to-payoff side-by-side per debt |

**Chart type count: 4 main types** (line, pie, stacked bar, sparkline) plus 2 supporting types (stacked area, grouped bar). The "5 chart specs" claim in the original README was wrong — corrected to **4 chart types**.

### Color rules
- Income / positive: `--accent` (#10B981)
- Expense / negative: `--danger` (#EF4444)
- Neutral / trend: `--info` (#3B82F6)
- Goal / savings: `--info`
- Warning (80%+ spent): `--warning` (#F59E0B)

---

## Cross-Sheet Wiring

```
Transactions  ─┬─→  Dashboard (current month sums)
                ├─→  Budget vs Actual (monthly per-cat actual)
                ├─→  Annual (year pivot)
                └─→  Reports (top 5, totals, changes)

Categories    ─┬─→  Transactions (dropdown)
                ├─→  Dashboard (budget rows)
                ├─→  Budget vs Actual (row list)
                └─→  Annual (row list)

Accounts      ─┬─→  Transactions (dropdown)
                ├─→  Net Worth (sum of signed balances)
                └─→  Goals (linked account auto-sync)

Goals         ─→  Dashboard (progress section)

Debt Payoff   ─→  Dashboard (debt total)
              └─→  Goals (debt-type goals)

Subscriptions ─→  Annual (subscriptions row)
              └─→  Transactions (cross-checked by payee)
```

A single change in `Categories` (e.g. rename `Groceries` → `Food`) propagates to every sheet via VLOOKUP/dropdown references.

---

## Sheet Protection (recommended)

| Sheet | Protected ranges |
|-------|------------------|
| Dashboard | All except `G1` (month picker) |
| Tutorial | Entire sheet (read-only) |
| Reports | Entire sheet (auto-generated) |
| Categories | Header row only |
| Transactions, Accounts, Goals, etc. | Header row only |

Users can edit data freely but cannot accidentally break formulas.

---

End of architecture spec.
