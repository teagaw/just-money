# Build Spec — Budget Pro 2026 (Lean)

> **Version:** 2.0
> **Date:** 2026-06-08
> **Status:** Ready to build
> **Platform:** Google Sheets only
> **Price:** $14.99 (Etsy)
> **Total build time:** 21.5 hours

---

## 1. Product Overview

### What It Is

Budget Pro 2026 is a $19 Google Sheets budget template with 6 user-facing tabs and 1 hidden engine tab. The key differentiator is the **Scenario Engine** — a calculator that answers "when will I be financially free?" using NPER and EDATE formulas. No other budget spreadsheet at this price point does this.

### Who It's For

- Freelancers, side hustlers, couples, and first-time budgeters
- People with debt who want to know the exact payoff date
- People who want to compare "what if I pay an extra $200/month?" scenarios
- Anyone who tried Mint (dead), YNAB ($109/year), or Rocket Money and bounced

### Why It's Different

| Competitor | What They Do | What We Do |
|------------|-------------|------------|
| YNAB | App, $109/yr, manual entry, no payoff projections | Spreadsheet, $19 once, ownership forever, Scenario Engine |
| Generic budget templates | Static categories, no payoff math | NPER/EDATE formulas show exact freedom date |
| Debt payoff calculators | Single-purpose, no budget tracking | Budget + debt + goals + spending + scenario planning in one file |
| Other Etsy templates | 12+ sheets, overwhelming, features you never touch | 6 tabs, stripped to essentials, zero bloat |

### What Was Killed

| Feature | Reason |
|---------|--------|
| 12 CSV templates | Not needed — users paste data directly |
| Dark mode | Impossible in Google Sheets without hacks |
| Excel support | Google Sheets = 75-80% of market |
| Free preview web tool | Add later if needed |
| 8 extra sheets (Dashboard, Transactions, Categories, Accounts, Goals, Net Worth, Subscriptions, Annual, Reports, Tutorial) | Replaced by 6 focused tabs — Goals and Spendable were added back as focused, stripped-down versions |

---

## 2. Tab Architecture

### Tab Order (visible to user)

| # | Tab Name | Purpose | User Action |
|---|----------|---------|-------------|
| 1 | Scenario Engine | "When am I free?" calculator | Enter 6 numbers, read results |
| 2 | Goals | Savings goals with targets and deadlines | Set goals, track progress |
| 3 | Spendable | Daily/weekly spending budget | Set limits, track remaining |
| 4 | Budget Tracker | Monthly income vs expenses | Enter income and expenses monthly |
| 5 | Debt Payoff | Snowball vs avalanche comparison | Enter debts, compare strategies |
| 6 | Instructions | How to use each tab | Read only |

### Hidden Tab

| # | Tab Name | Purpose | User Action |
|---|----------|---------|-------------|
| 7 | Engine | Houses all NPER/EDATE formulas | Never touched — hidden + locked |

---

### Tab 1: Scenario Engine (THE DIFFERENTIATOR)

**Purpose:** Answer "When will I be financially free?" with one input session.

#### Layout

```
A                B                  C                  D
──────────────────────────────────────────────────────────────
1  SCENARIO ENGINE · "When am I free?"
2
3  ┌─ INPUT (edit these cells) ─────────────────────────────┐
4  │ Monthly income              [green cell]  $5,400       │
5  │ Monthly living expenses     [green cell]  $3,200       │
6  │ Current savings             [green cell]  $12,000      │
7  │ Weighted average APR (%)    [green cell]  8.50         │
8  │ Total debt balance          [green cell]  $24,200      │
9  │ Total monthly debt payment  [green cell]  $490         │
10 │ Inflation adjustment (%)    [green cell]  3.00         │
11 └─────────────────────────────────────────────────────────┘
12
13 ┌─ RESULTS (auto-calculated) ─────────────────────────────┐
14 │ Months to financial freedom     [result cell]  24      │
15 │ Freedom date                    [result cell]  Jun 2028│
16 │ Total interest saved            [result cell]  $3,847  │
17 └─────────────────────────────────────────────────────────┘
18
19 ┌─ CROSS-TAB CHECK ───────────────────────────────────────┐
20 │ Weighted APR from Debt Payoff tab:  [formula]  8.50%    │
21 │ Your entered APR:                   [B7]       8.50%    │
22 │ Match:                              [formula]  ✓        │
23 └─────────────────────────────────────────────────────────┘
24
25 ┌─ COMPARISON ────────────────────────────────────────────┐
26 │ Scenario              Months    Interest    Freedom     │
27 │ Minimum payments only   48      $8,420      Dec 2029   │
28 │ Extra $200/month        28      $5,213      Oct 2028   │
29 │ Extra $400/month        19      $3,190      Jan 2028   │
30 │ Match my scenario       24      $3,847      Jun 2028   │
31 │ Inflation-adjusted      24      $3,847      Jun 2028   │
32 └─────────────────────────────────────────────────────────┘
33
34 ┌─ SENSITIVITY: Freedom Date at Different Savings Rates ──┐
35 │ Extra $/month    Months    Freedom Date    Interest Saved│
36 │ $0/month         48        Dec 2029        $8,420       │
37 │ $100/month       36        Jun 2028        $6,214       │
38 │ $200/month       28        Oct 2028        $5,213       │
39 │ $300/month       23        May 2028        $4,310       │
40 │ $400/month       19        Jan 2028        $3,190       │
41 │ $500/month       16        Oct 2027        $2,580       │
42 │ $750/month       12        Jun 2027        $1,840       │
43 │ $1,000/month     9         Mar 2027        $1,290       │
44 └─────────────────────────────────────────────────────────┘
45
46  ── HOW TO READ THIS ─────────────────────────────────────
47  Financial freedom = when your savings exceed your debt
48   and your investments generate enough passive income
49   to cover expenses. This calculator shows the fastest
50   path to that point using your actual numbers.
```

#### Cell Specifications

| Cell | Content | Type | Format | Validation |
|------|---------|------|--------|------------|
| `A1` | Title text | Label | Bold, 14pt, #0F172A | — |
| `A4` | "Monthly income" | Label | Regular, 10pt | — |
| `B4` | Input: income | Number | Currency, $#,##0 | `> 0` |
| `A5` | "Monthly living expenses (excl. debt payments)" | Label | Regular, 10pt | — |
| `B5` | Input: expenses | Number | Currency, $#,##0 | `> 0` |
| `C5` | "← Do NOT include debt payments here (they're in B9)" | Label | Italic, 9pt, #64748B | — |
| `A6` | "Current savings" | Label | Regular, 10pt | — |
| `B6` | Input: savings | Number | Currency, $#,##0 | `>= 0` |
| `A7` | "Weighted average APR (%)" | Label | Regular, 10pt | — |
| `B7` | Input: rate | Number | Percentage, 0.00% | `>= 0` AND `<= 0.50` |
| `C7` | "← Weighted average: (Debt1 balance × APR1 + Debt2 × APR2 + ...) ÷ Total debt" | Label | Italic, 9pt, #64748B | — |
| `A8` | "Total debt balance" | Label | Regular, 10pt | — |
| `B8` | Input: debt | Number | Currency, $#,##0 | `>= 0` |
| `A9` | "Total monthly debt payment" | Label | Regular, 10pt | — |
| `B9` | Input: payment | Number | Currency, $#,##0 | `>= 0` |
| `C9` | "← Sum of ALL minimum payments from Debt Payoff tab" | Label | Italic, 9pt, #64748B | — |
| `A10` | "Inflation adjustment (%)" | Label | Regular, 10pt | — |
| `B10` | Input: inflation | Number | Percentage, 0.00% | `>= 0` AND `<= 0.15` |
| `C10` | "← Set to 0% for nominal dollars, 3% for real dollars" | Label | Italic, 9pt, #64748B | — |

#### Input Cell Formatting

- Background: `#DCFCE7` (light green, #10B981 at 10% opacity)
- Border: 1px solid `#10B981`
- Note in `C4`: "← Edit this cell" in italic, `#64748B`
- Repeat note in `C5:C9`
- Note in `C7`: "← Weighted average: (Debt1 balance × APR1 + Debt2 × APR2 + ...) ÷ Total debt" in italic, `#64748B`
- Note in `C9`: "← Sum of ALL minimum payments from Debt Payoff tab" in italic, `#64748B`
- Note in `C5`: "← Do NOT include debt payments here (they're in B9)" in italic, `#64748B`
- Note in `C10`: "← Set to 0% for nominal dollars, 3% for real dollars" in italic, `#64748B`
- B7 validation note: "Enter the weighted average APR across all debts. Example: if you have $5,000 at 20% and $10,000 at 6%, enter 10.67%"

#### Output Formulas

| Cell | Label | Formula | Format |
|------|-------|---------|--------|
| `B13` | Months to financial freedom | `=Engine!B2` | Number, 0 decimal |
| `B14` | Freedom date | `=Engine!B3` | Date, "MMM YYYY" |
| `B15` | Total interest saved | `=Engine!B4` | Currency, $#,##0 |

#### Comparison Table Formulas (rows 20-24)

| Cell | Content | Formula |
|------|---------|---------|
| `A20` | "Minimum payments only" | Static label |
| `B20` | Months | `=Engine!B6` |
| `C20` | Interest | `=Engine!B7` |
| `D20` | Freedom date | `=Engine!B8` |
| `A21` | "Extra $200/month" | Static label |
| `B21` | Months | `=Engine!B9` |
| `C21` | Interest | `=Engine!B10` |
| `D21` | Freedom date | `=Engine!B11` |
| `A22` | "Extra $400/month" | Static label |
| `B22` | Months | `=Engine!B12` |
| `C22` | Interest | `=Engine!B13` |
| `D22` | Freedom date | `=Engine!B14` |
| `A23` | "Match my scenario" | Static label |
| `B23` | Months | `=B13` |
| `C23` | Interest | `=B15` |
| `D23` | Freedom date | `=B14` |
| `A24` | "Inflation-adjusted" | Static label |
| `B24` | Months | `=Engine!B32` |
| `C24` | Interest | `=Engine!B33` |
| `D24` | Freedom date | `=Engine!B34` |

#### Sensitivity Table Formulas (rows 30-37 in Scenario Engine)

| Cell | Content | Formula |
|------|---------|---------|
| `A30` | "── SENSITIVITY: Freedom Date at Different Savings Rates ──" | Label |
| `A31` | "Extra $/month" | Header |
| `B31` | "Months" | Header |
| `C31` | "Freedom Date" | Header |
| `D31` | "Interest Saved" | Header |
| `A32` | "$0/month" | Label |
| `B32` | Months | `=Engine!B35` |
| `C32` | Freedom Date | `=Engine!B36` |
| `D32` | Interest Saved | `=Engine!B37` |
| `A33` | "$100/month" | Label |
| `B33` | Months | `=Engine!B38` |
| `C33` | Freedom Date | `=Engine!B39` |
| `D33` | Interest Saved | `=Engine!B40` |
| `A34` | "$200/month" | Label |
| `B34` | Months | `=Engine!B41` |
| `C34` | Freedom Date | `=Engine!B42` |
| `D34` | Interest Saved | `=Engine!B43` |
| `A35` | "$300/month" | Label |
| `B35` | Months | `=Engine!B44` |
| `C35` | Freedom Date | `=Engine!B45` |
| `D35` | Interest Saved | `=Engine!B46` |
| `A36` | "$400/month" | Label |
| `B36` | Months | `=Engine!B47` |
| `C36` | Freedom Date | `=Engine!B48` |
| `D36` | Interest Saved | `=Engine!B49` |
| `A37` | "$500/month" | Label |
| `B37` | Months | `=Engine!B50` |
| `C37` | Freedom Date | `=Engine!B51` |
| `D37` | Interest Saved | `=Engine!B52` |
| `A38` | "$750/month" | Label |
| `B38` | Months | `=Engine!B53` |
| `C38` | Freedom Date | `=Engine!B54` |
| `D38` | Interest Saved | `=Engine!B55` |
| `A39` | "$1,000/month" | Label |
| `B39` | Months | `=Engine!B56` |
| `C39` | Freedom Date | `=Engine!B57` |
| `D39` | Interest Saved | `=Engine!B58` |

#### Sensitivity Table Formulas (rows 35-58 in Engine)

| Cell | Content | Formula |
|------|---------|---------|
| `B35` | $0/month extra months | `=IFERROR(NPER(('Scenario Engine'!B7-'Scenario Engine'!B10)/12, -('Scenario Engine'!B4-'Scenario Engine'!B5-'Scenario Engine'!B9), -('Scenario Engine'!B6-'Scenario Engine'!B8)), "N/A")` |
| `B36` | $0/month extra interest | `=IFERROR(Engine!B35*'Scenario Engine'!B9 - 'Scenario Engine'!B8, "N/A")` |
| `B37` | $0/month extra freedom date | `=EDATE(TODAY(), ROUNDUP(B35, 0))` |
| `B38` | $100/month extra months | `=IFERROR(NPER(('Scenario Engine'!B7-'Scenario Engine'!B10)/12, -('Scenario Engine'!B4-'Scenario Engine'!B5-'Scenario Engine'!B9-100), -('Scenario Engine'!B6-'Scenario Engine'!B8)), "N/A")` |
| `B39` | $100/month extra interest | `=IFERROR(Engine!B38*('Scenario Engine'!B9+100) - 'Scenario Engine'!B8, "N/A")` |
| `B40` | $100/month extra freedom date | `=EDATE(TODAY(), ROUNDUP(B38, 0))` |
| `B41` | $200/month extra months | `=IFERROR(NPER(('Scenario Engine'!B7-'Scenario Engine'!B10)/12, -('Scenario Engine'!B4-'Scenario Engine'!B5-'Scenario Engine'!B9-200), -('Scenario Engine'!B6-'Scenario Engine'!B8)), "N/A")` |
| `B42` | $200/month extra interest | `=IFERROR(Engine!B41*('Scenario Engine'!B9+200) - 'Scenario Engine'!B8, "N/A")` |
| `B43` | $200/month extra freedom date | `=EDATE(TODAY(), ROUNDUP(B41, 0))` |
| `B44` | $300/month extra months | `=IFERROR(NPER(('Scenario Engine'!B7-'Scenario Engine'!B10)/12, -('Scenario Engine'!B4-'Scenario Engine'!B5-'Scenario Engine'!B9-300), -('Scenario Engine'!B6-'Scenario Engine'!B8)), "N/A")` |
| `B45` | $300/month extra interest | `=IFERROR(Engine!B44*('Scenario Engine'!B9+300) - 'Scenario Engine'!B8, "N/A")` |
| `B46` | $300/month extra freedom date | `=EDATE(TODAY(), ROUNDUP(B44, 0))` |
| `B47` | $400/month extra months | `=IFERROR(NPER(('Scenario Engine'!B7-'Scenario Engine'!B10)/12, -('Scenario Engine'!B4-'Scenario Engine'!B5-'Scenario Engine'!B9-400), -('Scenario Engine'!B6-'Scenario Engine'!B8)), "N/A")` |
| `B48` | $400/month extra interest | `=IFERROR(Engine!B47*('Scenario Engine'!B9+400) - 'Scenario Engine'!B8, "N/A")` |
| `B49` | $400/month extra freedom date | `=EDATE(TODAY(), ROUNDUP(B47, 0))` |
| `B50` | $500/month extra months | `=IFERROR(NPER(('Scenario Engine'!B7-'Scenario Engine'!B10)/12, -('Scenario Engine'!B4-'Scenario Engine'!B5-'Scenario Engine'!B9-500), -('Scenario Engine'!B6-'Scenario Engine'!B8)), "N/A")` |
| `B51` | $500/month extra interest | `=IFERROR(Engine!B50*('Scenario Engine'!B9+500) - 'Scenario Engine'!B8, "N/A")` |
| `B52` | $500/month extra freedom date | `=EDATE(TODAY(), ROUNDUP(B50, 0))` |
| `B53` | $750/month extra months | `=IFERROR(NPER(('Scenario Engine'!B7-'Scenario Engine'!B10)/12, -('Scenario Engine'!B4-'Scenario Engine'!B5-'Scenario Engine'!B9-750), -('Scenario Engine'!B6-'Scenario Engine'!B8)), "N/A")` |
| `B54` | $750/month extra interest | `=IFERROR(Engine!B53*('Scenario Engine'!B9+750) - 'Scenario Engine'!B8, "N/A")` |
| `B55` | $750/month extra freedom date | `=EDATE(TODAY(), ROUNDUP(B53, 0))` |
| `B56` | $1,000/month extra months | `=IFERROR(NPER(('Scenario Engine'!B7-'Scenario Engine'!B10)/12, -('Scenario Engine'!B4-'Scenario Engine'!B5-'Scenario Engine'!B9-1000), -('Scenario Engine'!B6-'Scenario Engine'!B8)), "N/A")` |
| `B57` | $1,000/month extra interest | `=IFERROR(Engine!B56*('Scenario Engine'!B9+1000) - 'Scenario Engine'!B8, "N/A")` |
| `B58` | $1,000/month extra freedom date | `=EDATE(TODAY(), ROUNDUP(B56, 0))` |

#### Cross-Tab Validation Formulas (rows 28-30 in Engine)

| Cell | Content | Formula |
|------|---------|---------|
| `B28` | Weighted APR from debts | `=SUMPRODUCT('Debt Payoff'!B5:B8, 'Debt Payoff'!C5:C8) / SUM('Debt Payoff'!B5:B8)` |
| `B29` | User's entered APR | `='Scenario Engine'!B7` |
| `B30` | Match check | `=IF(ABS(B28-B29) < 0.001, "✓ Match", "⚠ Check APR — doesn't match Debt Payoff tab")` |

#### Conditional Formatting

| Range | Condition | Format |
|-------|-----------|--------|
| `B13` (months) | `< 12` | Bold, bg `#DCFCE7`, text `#0F973C` |
| `B13` | `>= 12 AND < 36` | Bold, bg `#FEF9C3`, text `#A16207` |
| `B13` | `>= 36` | Bold, bg `#FEE2E2`, text `#DC2626` |
| `B15` (interest saved) | `> 0` | Text `#10B981` |

#### Frozen Panes

- Row 1 frozen (title stays visible)

---

### Tab 2: Goals

**Purpose:** Track savings goals with target amounts, deadlines, and progress.

#### Layout

```
A                B                  C                  D
──────────────────────────────────────────────────────────────
1  GOALS · Track Your Savings Targets
2
3  ┌─ YOUR GOALS ─────────────────────────────────────────────┐
4  │ Goal name       Target    Deadline    Saved     Progress │
5  │ Emergency fund  $10,000   Dec 2026    $6,000    60%      │
6  │ Vacation        $3,000    Jun 2027    $800      27%      │
7  │ New laptop      $1,500    Mar 2026    $1,200    80%      │
8  │ Down payment    $25,000   Dec 2028    $4,500    18%      │
9  └─────────────────────────────────────────────────────────┘
10
11 ┌─ SUMMARY ────────────────────────────────────────────────┐
12 │ Total saved across all goals:           $12,500          │
13 │ Total target across all goals:          $39,500          │
14 │ Overall progress:                       31.6%            │
15 │ Next goal deadline:                     Mar 2026         │
16 └─────────────────────────────────────────────────────────┘
```

#### Cell Specifications

| Cell | Content | Type | Format | Validation |
|------|---------|------|--------|------------|
| `A5:A8` | Goal name | Text | Regular, 10pt | — |
| `B5:B8` | Target amount | Number | Currency, $#,##0 | `> 0` |
| `C5:C8` | Deadline | Date | Date, "MMM YYYY" | `>= TODAY()` |
| `D5:D8` | Amount saved | Number | Currency, $#,##0 | `>= 0` |
| `E5:E8` | Progress % | Formula | Percentage, 0.0% | — |

#### Key Formulas

| Cell | Content | Formula | Format |
|------|---------|---------|--------|
| `E5` | Progress % | `=IF(B5=0, 0, D5/B5)` | Percentage, 0.0% |
| `B12` | Total saved | `=SUM(D5:D8)` | Currency, bold |
| `B13` | Total target | `=SUM(B5:B8)` | Currency, bold |
| `B14` | Overall progress | `=IF(B13=0, 0, B12/B13)` | Percentage, 0.0%, bold |
| `B15` | Next deadline | `=TEXT(MIN(C5:C8), "MMM YYYY")` | Text, bold |

#### Conditional Formatting

| Range | Condition | Format |
|-------|-----------|--------|
| `E5:E8` (progress) | `>= 1.0` | Bold, bg `#DCFCE7`, text `#0F973C`, strikethrough on goal name |
| `E5:E8` | `>= 0.50 AND < 1.0` | Bold, bg `#FEF9C3`, text `#A16207` |
| `E5:E8` | `< 0.50` | Bold, bg `#FEE2E2`, text `#DC2626` |
| `C5:C8` (deadline) | `<= TODAY() + 30` | Text `#DC2626` (due within 30 days) |

#### Frozen Panes

- Row 1 frozen
- Column A frozen

---

### Tab 3: Spendable

**Purpose:** Daily and weekly spending budget with remaining balance tracking.

#### Layout

```
A                B                  C                  D
──────────────────────────────────────────────────────────────
1  SPENDABLE · Daily & Weekly Budget
2
3  ┌─ BUDGET SETUP ──────────────────────────────────────────┐
4  │ Monthly take-home pay        [green cell]  $4,200       │
5  │ Daily budget (= pay ÷ 30)    [result]      $140         │
6  │ Weekly budget (= pay ÷ 4.3)  [result]      $977         │
7  └─────────────────────────────────────────────────────────┘
8
9  ── TODAY ──────────────────────────────────────────────────
10 Date                  Category        Amount      Remaining
11 Jun 9                 Food            $42         $98
12 Jun 9                 Transport       $15         $83
13 Jun 9                 Entertainment   $0          $83
14
15 ── THIS WEEK (Jun 9 - Jun 15) ─────────────────────────────
16 Total spent this week:                $57
17 Weekly budget:                        $977
18 Remaining this week:                  $920
19
20 ── CATEGORY LIMITS ────────────────────────────────────────
21 Category            Monthly Limit   Spent      Remaining
22 Food                $600            $180       $420
23 Transport           $200            $45        $155
24 Entertainment       $300            $75        $225
25 Other               $200            $30        $170
```

#### Cell Specifications

| Cell | Content | Type | Format | Validation |
|------|---------|------|--------|------------|
| `B4` | Monthly take-home | Number | Currency, $#,##0 | `> 0` |
| `A11:A13` | Date | Date | Date, "MMM D" | — |
| `B11:B13` | Category | Text | Regular, 10pt | List from category range |
| `C11:C13` | Amount | Number | Currency, $#,##0 | `>= 0` |
| `D11:D13` | Remaining | Formula | Currency, $#,##0 | — |

#### Key Formulas

| Cell | Content | Formula | Format |
|------|---------|---------|--------|
| `B5` | Daily budget | `=IF(B4=0, 0, B4/30)` | Currency, bold |
| `B6` | Weekly budget | `=IF(B4=0, 0, B4/4.3)` | Currency, bold |
| `D11` | Remaining (daily) | `=B5 - SUMIF(A:A, A11, C:C)` | Currency |
| `B16` | Weekly spent | `=SUMIFS(C:C, A:A, ">="&week_start, A:A, "<="&week_end)` | Currency, bold |
| `B18` | Weekly remaining | `=B6 - B16` | Currency, bold |
| `D22` | Category remaining | `=C22 - SUMIF(B:B, A22, C:C)` | Currency |

#### Conditional Formatting

| Range | Condition | Format |
|-------|-----------|--------|
| `D11:D13` (remaining) | `< 0` | Text `#DC2626`, bold |
| `D11:D13` | `< 20` | Text `#F59E0B` (warning: low balance) |
| `B18` (weekly remaining) | `< 0` | Text `#DC2626`, bold, bg `#FEE2E2` |
| `D22:D25` (category remaining) | `< 0` | Text `#DC2626`, bold |

#### Frozen Panes

- Row 1 frozen
- Column A frozen

---

### Tab 4: Budget Tracker

**Purpose:** Simple monthly income vs expenses with category breakdown.

#### Layout

```
A                B          C          D          E          F
────────────────────────────────────────────────────────────────
1  BUDGET TRACKER · 2026
2
3  ── INCOME ─────────────────────────────────────────────────
4  Category                Jan        Feb        Mar        ...
5  Salary                  $5,400     $5,400     $5,400
6  Side hustle             $800       $1,200     $600
7  Other income            $0         $200       $0
8  ─────────────────────────────────────────────────────────────
9  Total income            $6,200     $6,800     $6,000
10
11 ── EXPENSES ────────────────────────────────────────────────
12 Category                Jan        Feb        Mar        ...
13 Housing                 $1,800     $1,800     $1,800
14 Utilities               $280       $310       $260
15 Food                    $450       $520       $480
16 Transport               $160       $140       $180
17 Entertainment           $200       $150       $250
18 Savings                 $500       $500       $500
19 Debt payments           $490       $490       $490
20 Other                   $100       $80        $120
21 ─────────────────────────────────────────────────────────────
22 Total expenses          $3,980     $3,990     $4,080
23
24 Net (income - expenses) $2,220     $2,810     $1,920
25 Savings rate            35.8%      41.3%      32.0%
```

#### Cell Specifications

| Cell | Content | Type | Format |
|------|---------|------|--------|
| `A1` | Title | Label | Bold, 14pt, #0F172A |
| `A4:A8` | Income category labels | Label | Regular, 10pt |
| `A12:A20` | Expense category labels | Label | Regular, 10pt |
| `B4:F8` | Income amounts | Number | Currency, $#,##0 |
| `B12:F20` | Expense amounts | Number | Currency, $#,##0 |

#### Formula Row Specifications

| Row | Label | Formula (column B, repeat across) | Format |
|-----|-------|-----------------------------------|--------|
| 9 | "Total income" | `=SUM(B4:B8)` | Currency, bold, top border |
| 22 | "Total expenses" | `=SUM(B12:F20)` | Currency, bold, top border |
| 24 | "Net (income - expenses)" | `=B9-B22` | Currency, bold |
| 25 | "Savings rate" | `=IF(B9=0, 0, B24/B9)` | Percentage, 1 decimal |

#### Conditional Formatting

| Range | Condition | Format |
|-------|-----------|--------|
| `B24:F24` (net) | `< 0` | Text `#DC2626`, bold |
| `B24:F24` | `>= 0` | Text `#10B981`, bold |
| `B25:F25` (savings rate) | `>= 0.20` | Bold, bg `#DCFCE7`, text `#0F973C` |
| `B25:F25` | `< 0.10` | Bold, bg `#FEE2E2`, text `#DC2626` |

#### Frozen Panes

- Row 1 frozen
- Column A frozen

---

### Tab 5: Debt Payoff

**Purpose:** Snowball vs avalanche comparison with payoff timeline.

#### Layout

```
A                B          C          D          E          F
────────────────────────────────────────────────────────────────
1  DEBT PAYOFF · Snowball vs Avalanche
2
3  ── YOUR DEBTS ─────────────────────────────────────────────
4  Debt name        Balance    APR        Min payment  Extra
5  Chase Visa       $2,800     24.99%     $85          $200
6  Car Loan         $8,400     6.75%      $225         $0
7  Student Loan     $15,800    5.50%      $180         $0
8  Medical Bill     $1,200     0.00%      $100         $100
9  ─────────────────────────────────────────────────────────────
10 Total             $28,200                         $300
11
12 ── PAYOFF COMPARISON ──────────────────────────────────────
13                    Snowball         Avalanche
14 Total months        38               36
15 Total interest      $6,214           $5,847
16 Interest saved vs min   $3,180       $3,547
17
18 ── PAYOFF TIMELINE ────────────────────────────────────────
19 Debt              Snowball payoff    Avalanche payoff
20 Chase Visa         May 2026           May 2026
21 Medical Bill       Jul 2026           Jul 2026
22 Car Loan           Feb 2027           Jan 2027
23 Student Loan       Apr 2028           Apr 2028
```

#### Cell Specifications

| Cell | Content | Type | Format | Validation |
|------|---------|------|--------|------------|
| `A5:A8` | Debt name | Text | Regular, 10pt | — |
| `B5:B8` | Balance | Number | Currency, $#,##0 | `> 0` |
| `C5:C8` | APR | Number | Percentage, 0.00% | `>= 0` AND `<= 0.50` |
| `D5:D8` | Minimum payment | Number | Currency, $#,##0 | `>= 0` |
| `E5:E8` | Extra payment | Number | Currency, $#,##0 | `>= 0` |

#### Key Formulas

| Cell | Content | Formula | Format |
|------|---------|---------|--------|
| `B10` | Total balance | `=SUM(B5:B8)` | Currency, bold |
| `E10` | Total extra | `=SUM(E5:E8)` | Currency, bold |
| `B13` | Snowball total months | `=Engine!B20` | Number |
| `C13` | Avalanche total months | `=Engine!B21` | Number |
| `B14` | Snowball total interest | `=Engine!B22` | Currency |
| `C14` | Avalanche total interest | `=Engine!B23` | Currency |
| `B15` | Snowball interest saved | `=Engine!B24` | Currency |
| `C15` | Avalanche interest saved | `=Engine!B25` | Currency |

#### Per-Debt Payoff Formulas (rows 20-23)

| Cell | Formula |
|------|---------|
| `B20` | `=Engine!C2` (Snowball payoff for debt 1) |
| `C20` | `=Engine!D2` (Avalanche payoff for debt 1) |
| `B21` | `=Engine!C3` (Snowball payoff for debt 2) |
| `C21` | `=Engine!D3` (Avalanche payoff for debt 2) |
| `B22` | `=Engine!C4` (Snowball payoff for debt 3) |
| `C22` | `=Engine!D4` (Avalanche payoff for debt 3) |
| `B23` | `=Engine!C5` (Snowball payoff for debt 4) |
| `C23` | `=Engine!D5` (Avalanche payoff for debt 4) |

#### Conditional Formatting

| Range | Condition | Format |
|-------|-----------|--------|
| `B5:B8` (balance) | `= 0` | Strikethrough, text `#94A3B8` |
| `C5:C8` (APR) | `>= 0.20` | Bold, text `#DC2626` |
| `B14:C14` (total interest) | — | Bold |
| `B15:C15` (interest saved) | `> 0` | Bold, bg `#DCFCE7`, text `#10B981` |

#### Frozen Panes

- Row 1 frozen
- Column A frozen

---

### Tab 6: Instructions

**Purpose:** How to use each tab. What each metric means. Troubleshooting FAQ.

#### Layout

```
A                B
─────────────────────────────────────────────────
1  INSTRUCTIONS · How to Use Budget Pro 2026
2
3  ── QUICK START (5 minutes) ───────────────────
4  1. Open the "Scenario Engine" tab
5  2. Enter your 6 numbers in the green cells
6  3. Read your results in the blue section
7  4. Try different scenarios by changing inputs
8
9  ── TAB 1: SCENARIO ENGINE ────────────────────
10 What it does: Calculates when you'll be
11 financially free based on your income,
12 expenses, savings, and debt.
12
13 Green cells = edit these
14 Blue cells = results (don't edit)
15
16 What "financial freedom" means:
17 Your savings + investments generate enough
18 passive income to cover your monthly expenses,
19 AND your debt is paid off.
20
21 Key metrics:
22 - Months to freedom: how many months until
23   your net worth exceeds your expenses × 12
24 - Freedom date: the calendar month you'll
25   reach financial freedom
26 - Interest saved: how much less interest you'll
27   pay compared to minimum payments only
28
29 ── WHY TAB 1 AND TAB 5 SHOW DIFFERENT DATES ──
30 Tab 1 (Scenario Engine) uses your weighted average
31 APR — one rate for all debt combined. Tab 5 (Debt
32 Payoff) calculates each debt individually with its
33 own APR. Different math = different dates.
34
35 Both are correct. Tab 1 gives you a quick estimate.
36 Tab 5 gives you the exact payoff for each debt.
37
38 Tip: Use Tab 1 for "what if" experiments.
39 Use Tab 5 for your actual payoff plan.
40
41 ── HOW THE SCENARIO ENGINE WORKS ──
42 The Scenario Engine uses two powerful Google Sheets
43 formulas:
44
45 NPER (Number of Periods)
46 - Calculates how many months until a financial goal
47 - Uses: interest rate, monthly payment, starting balance
48 - Returns: number of months to reach $0 (or freedom)
49
50 EDATE (Exact Date)
51 - Converts months to a calendar date
52 - Adds NPER result to today's date
53 - Shows you the exact month you'll be free
54
55 Important assumptions:
56 - Your income and expenses stay constant
57 - Your interest rate stays constant
58 - You make the same payment every month
59 - Inflation is accounted for (default 3%)
60
61 These are simplifications. Your actual freedom date
62 will likely come SOONER because:
63 - You'll probably increase income over time
64 - You'll likely reduce expenses as debt shrinks
65 - Windfalls (bonuses, tax refunds) accelerate payoff
66 - This calculator is a conservative baseline
67
68 ── TAB 2: GOALS ──────────────────────────────
69 What it does: Track savings goals with target
70 amounts, deadlines, and progress percentages.
71
72 How to use it:
73 - List each goal with name, target, and deadline
74 - Enter how much you've saved so far
75 - Progress percentages auto-calculate
76
77 Tips:
78 - Set 3-5 goals max (focus beats scattered saving)
79 - The "Next deadline" shows your most urgent goal
80 - When a goal hits 100%, celebrate — then set a new one
81
82 ── TAB 3: SPENDABLE ──────────────────────────
83 What it does: Daily and weekly spending budget
84 with remaining balance tracking.
85
86 How to use it:
87 - Enter your monthly take-home pay in the green cell
88 - Daily and weekly budgets auto-calculate
89 - Log expenses as you spend throughout the day
90
91 Tips:
92 - Check remaining balance before each purchase
93 - Category limits help you stay on track per area
94 - The weekly view catches overspending early
95
96 ── TAB 4: BUDGET TRACKER ─────────────────────
30 What it does: Tracks your monthly income
31 and expenses by category.
32
32 How to use it:
33 - Fill in each month's columns (B through M)
34 - Enter your income in rows 5-7
35 - Enter your expenses in rows 13-20
36 - Totals and savings rate auto-calculate
37
38 Tips:
38 - Update weekly (5 minutes) instead of monthly
39 - The savings rate target is 20%+
40 - If net is negative, check your top 3 expense
41   categories — that's where the leak is
42
43 ── TAB 5: DEBT PAYOFF ────────────────────────
44 What it does: Compares debt snowball vs
45 avalanche strategies and shows payoff dates.
46
47 How to use it:
48 - List each debt with name, balance, APR, min
49 - Enter any extra payment you can make monthly
50 - The comparison shows which strategy saves more
51
52 Snowball: pay off smallest balance first
53   (quick wins, psychological boost)
54
55 Avalanche: pay off highest APR first
56   (saves the most money)
57
58 ── FAQ ────────────────────────────────────────
59 Q: Can I add more debts?
60 A: Yes, add rows below row 8. The formulas
61    auto-extend.
62
63 Q: Can I add more expense categories?
64 A: Yes, add rows below row 20 in Budget Tracker.
65
66 Q: What if my income changes each month?
67 A: That's fine — enter each month separately.
68    The Scenario Engine uses an average.
69
70 Q: I broke a formula. How do I fix it?
71 A: Press Ctrl+Z to undo. Google Sheets has
72    unlimited undo and version history.
73
72 Q: Can I use this in Excel?
73 A: No — this is built for Google Sheets only.
74    The NPER/EDATE formulas work in Excel but
75    the file is optimized for Sheets.
76
77 Q: How do I share this with my partner?
78 A: Click Share in Google Sheets. Both of you
79    can edit in real time.
80
81 Q: Why does the Scenario Engine show a different
82    date than my debt payoff calculator?
83 A: The Scenario Engine uses a weighted average APR
84    across all debts. Debt payoff calculators use
85    individual APRs. Both are correct — they answer
86    different questions.
87
88 Q: What's the inflation adjustment for?
89 A: It adjusts your returns for inflation. If your
90    investments earn 8% and inflation is 3%, your
91    real return is 5%. Set to 0% for nominal dollars.
92
93 Q: Can I use this for retirement planning?
94 A: The Scenario Engine can estimate when your
95    savings reach a target. For detailed retirement
96    planning, consult a financial advisor.
97
98 ── NEED HELP? ─────────────────────────────────
99 Message me on Etsy. I respond within 48 hours.
100 30-day money-back guarantee, no questions.
```

---

### Hidden Tab: Engine

**Purpose:** Houses all NPER/EDATE/scenario formulas. Never visible to users.

#### Protection

- Sheet is hidden (right-click → Hide sheet)
- Sheet is protected (only owner can edit)
- Users never see this tab

#### Layout

```
A                B                  C                  D
──────────────────────────────────────────────────────────────
1  ENGINE (HIDDEN - DO NOT EDIT)
2
3  ── SCENARIO ENGINE FORMULAS ───────────────────────────────
4  Months to freedom       =NPER(('Scenario Engine'!B7-'Scenario Engine'!B10)/12,
5                             -('Scenario Engine'!B4-'Scenario Engine'!B5-'Scenario Engine'!B9),
6                             -('Scenario Engine'!B6-'Scenario Engine'!B8))
7  Freedom date            =EDATE(TODAY(), B2)
8  Interest saved          =... (see formula section)
9
10 ── COMPARISON FORMULAS ────────────────────────────────────
11 Min-only months         =NPER(...)
12 Min-only interest       =...
13 Extra $200 months       =NPER(...)
14 Extra $200 interest     =...
15 Extra $400 months       =NPER(...)
16 Extra $400 interest     =...
17
18 ── DEBT PAYOFF FORMULAS ───────────────────────────────────
19 Snowball payoff dates   =EDATE(TODAY(), NPER(...)) × 4 rows
20 Avalanche payoff dates  =EDATE(TODAY(), NPER(...)) × 4 rows
21 Snowball total months   =MAX(C2:C5)
22 Avalanche total months  =MAX(D2:D5)
23 Snowball total interest =SUM(...)
24 Avalanche total interest=SUM(...)
25 Snowball saved          =B24-B23 (vs minimum-only baseline)
26 Avalanche saved         =B24-C23
27
28 ── CROSS-TAB CHECK ─────────────────────────────────────────
29 Weighted APR from debts  =SUMPRODUCT('Debt Payoff'!B5:B8, 'Debt Payoff'!C5:C8) / SUM('Debt Payoff'!B5:B8)
30 User's entered APR       ='Scenario Engine'!B7
31 Match check              =IF(ABS(B28-B29) < 0.001, "✓ Match", "⚠ Check APR — doesn't match Debt Payoff tab")
32
33 ── INFLATION-ADJUSTED SCENARIO ─────────────────────────────
34 Inflation-adjusted months =NPER(...)
35 Inflation-adjusted interest =...
36 Inflation-adjusted freedom date =EDATE(TODAY(), B32)
37
38 ── SENSITIVITY TABLE ───────────────────────────────────────
39 $0/month extra          =NPER(...) → Months, Freedom Date, Interest Saved
40 $100/month extra        =NPER(...) → Months, Freedom Date, Interest Saved
41 $200/month extra        =NPER(...) → Months, Freedom Date, Interest Saved
42 $300/month extra        =NPER(...) → Months, Freedom Date, Interest Saved
43 $400/month extra        =NPER(...) → Months, Freedom Date, Interest Saved
44 $500/month extra        =NPER(...) → Months, Freedom Date, Interest Saved
45 $750/month extra        =NPER(...) → Months, Freedom Date, Interest Saved
46 $1,000/month extra      =NPER(...) → Months, Freedom Date, Interest Saved
```

---

## 3. Formula Reference

### Formula 1: Months to Financial Freedom (Engine `B2`)

```
=IFERROR(
  NPER(
    ('Scenario Engine'!B7 - 'Scenario Engine'!B10)/12,
    -('Scenario Engine'!B4 - 'Scenario Engine'!B5 - 'Scenario Engine'!B9),
    -('Scenario Engine'!B6 - 'Scenario Engine'!B8)
  ),
  "Check inputs"
)
```

**Breakdown:**

| Parameter | Value | Source |
|-----------|-------|--------|
| Rate | `(B7 - B10)/12` | Annual interest rate minus inflation, ÷ 12 = monthly real rate |
| Pmt | `-(B4-B5-B9)` | Negative of (income - expenses - debt payment) = net monthly savings toward freedom |
| Pv | `-(B6-B8)` | Negative of (savings - debt) = starting net position |

**Why inflation adjustment:** The default 3% inflation rate adjusts your returns for purchasing power. If your investments earn 8.5% and inflation is 3%, your real return is 5.5%. Set B10 to 0% for nominal dollars.

**Why negative:** NPER expects cash outflows as negative. We negate both payment and present value so the function returns a positive month count.

**Error handling:** If inputs are invalid (e.g., expenses > income), returns "Check inputs" instead of `#NUM!`.

---

### Formula 2: Freedom Date (Engine `B3`)

```
=EDATE(TODAY(), ROUNDUP(B2, 0))
```

**What it does:** Adds the calculated number of months to today's date, producing the calendar month of financial freedom.

**Why ROUNDUP:** Partial months round up because you can't be free on day 15 of a month — you need the full month.

---

### Formula 3: Total Interest Saved (Engine `B4`)

This is a comparison formula. The exact implementation:

```
=Engine!B7 - Engine!B23
```

Where `B7` = total interest paid under minimum-only scenario, and `B23` = total interest paid under the user's scenario. The difference is interest saved.

---

### Formula 4: Minimum-Only Months (Engine `B6`)

```
=IFERROR(
  NPER(
    'Scenario Engine'!B7/12,
    -('Scenario Engine'!B9),
    -('Scenario Engine'!B6 - 'Scenario Engine'!B8)
  ),
  "N/A"
)
```

**What it does:** Same NPER but with only the minimum payment (no extra savings applied). This is the baseline "worst case" scenario.

---

### Formula 5: Minimum-Only Interest (Engine `B7`)

```
=IFERROR(
  Engine!B6 * 'Scenario Engine'!B9 - ('Scenario Engine'!B8),
  "N/A"
)
```

**What it does:** Total payments (months × minimum payment) minus principal = total interest paid.

---

### Formula 6: Extra $200/month Months (Engine `B9`)

```
=IFERROR(
  NPER(
    'Scenario Engine'!B7/12,
    -('Scenario Engine'!B4 - 'Scenario Engine'!B5 - 'Scenario Engine'!B9 - 200),
    -('Scenario Engine'!B6 - 'Scenario Engine'!B8)
  ),
  "N/A"
)
```

**What it does:** Same as Formula 1 but adds $200 to the monthly savings. Shows the impact of a modest extra payment.

---

### Formula 7: Extra $200/month Interest (Engine `B10`)

```
=IFERROR(
  Engine!B9 * ('Scenario Engine'!B9 + 200) - ('Scenario Engine'!B8),
  "N/A"
)
```

---

### Formula 8: Extra $400/month Months (Engine `B12`)

```
=IFERROR(
  NPER(
    'Scenario Engine'!B7/12,
    -('Scenario Engine'!B4 - 'Scenario Engine'!B5 - 'Scenario Engine'!B9 - 400),
    -('Scenario Engine'!B6 - 'Scenario Engine'!B8)
  ),
  "N/A"
)
```

---

### Formula 9: Extra $400/month Interest (Engine `B13`)

```
=IFERROR(
  Engine!B12 * ('Scenario Engine'!B9 + 400) - ('Scenario Engine'!B8),
  "N/A"
)
```

---

### Formula 10: Single-Debt Payoff Months (Engine `C2` for Snowball, `D2` for Avalanche)

```
=IFERROR(
  IF(
    ('Debt Payoff'!D2 + 'Debt Payoff'!E2) * 12 <= 'Debt Payoff'!B2 * 'Debt Payoff'!C2,
    "Never",
    ROUNDUP(NPER('Debt Payoff'!C2/12, -('Debt Payoff'!D2 + 'Debt Payoff'!E2), 'Debt Payoff'!B2), 0)
  ),
  "Never"
)
```

**Breakdown:**

| Parameter | Value | Source |
|-----------|-------|--------|
| Rate | `C2/12` | Debt's APR ÷ 12 |
| Pmt | `-(D2+E2)` | Negative of (minimum + extra) payment |
| Pv | `B2` | Debt balance (positive = you owe it) |

**Guard clause:** If monthly payment ≤ monthly interest charge, returns "Never" (you're not making progress).

---

### Formula 11: Snowball Total Months (Engine `B20`)

```
=MAX(C2:C5)
```

**What it does:** The last debt to pay off determines the total timeline. MAX of all individual payoff months.

---

### Formula 12: Avalanche Total Months (Engine `B21`)

```
=MAX(D2:D5)
```

---

### Formula 13: Snowball Total Interest (Engine `B22`)

```
=SUMPRODUCT(
  ('Debt Payoff'!D2:D5 + 'Debt Payoff'!E2:E5),
  C2:C5
) - SUM('Debt Payoff'!B2:B5)
```

**What it does:** Total payments across all debts minus total principal = total interest paid under snowball strategy.

---

### Formula 14: Avalanche Total Interest (Engine `B23`)

```
=SUMPRODUCT(
  ('Debt Payoff'!D2:D5 + 'Debt Payoff'!E2:E5),
  D2:D5
) - SUM('Debt Payoff'!B2:B5)
```

---

### Formula 19: Goals Progress Percentage (Goals `E5`)

```
=IF(B5=0, 0, D5/B5)
```

**What it does:** Calculates what percentage of the goal target has been saved. Repeat for each goal row (E5:E8).

---

### Formula 20: Goals Total Saved (Goals `B12`)

```
=SUM(D5:D8)
```

**What it does:** Sums all amounts saved across goals.

---

### Formula 21: Goals Total Target (Goals `B13`)

```
=SUM(B5:B8)
```

**What it does:** Sums all target amounts across goals.

---

### Formula 22: Goals Overall Progress (Goals `B14`)

```
=IF(B13=0, 0, B12/B13)
```

**What it does:** Weighted progress across all goals combined.

---

### Formula 23: Goals Next Deadline (Goals `B15`)

```
=TEXT(MIN(C5:C8), "MMM YYYY")
```

**What it does:** Finds the earliest deadline across all goals and displays it as a readable date.

---

### Formula 24: Spendable Daily Budget (Spendable `B5`)

```
=IF(B4=0, 0, B4/30)
```

**What it does:** Divides monthly take-home pay by 30 days to get a daily spending budget.

---

### Formula 25: Spendable Weekly Budget (Spendable `B6`)

```
=IF(B4=0, 0, B4/4.3)
```

**What it does:** Divides monthly take-home pay by 4.3 weeks to get a weekly spending budget.

---

### Formula 26: Spendable Daily Remaining (Spendable `D11`)

```
=B5 - SUMIF(A:A, A11, C:C)
```

**What it does:** Subtracts all spending on the same date from the daily budget to show remaining balance.

---

### Formula 27: Spendable Category Remaining (Spendable `D22`)

```
=SUMIFS(C:C, B:B, A22) is the spent amount; Remaining = C22 - spent
```

**What it does:** Tracks how much is left in each spending category for the month.

---

### Formula 28: Budget Tracker Total Income (row 9)

```
=SUM(B4:B8)
```

Repeat for each month column (C, D, E, ...).

---

### Formula 29: Budget Tracker Total Expenses (row 22)

```
=SUM(B12:B20)
```

Repeat for each month column.

---

### Formula 30: Budget Tracker Net (row 24)

```
=B9-B22
```

Repeat for each month column.

---

### Formula 31: Budget Tracker Savings Rate (row 25)

```
=IF(B9=0, 0, B24/B9)
```

Formatted as percentage. Repeat for each month column.

---

## 4. Protection Strategy

### Step 1: Hide the Engine Tab

1. Right-click the "Engine" tab at the bottom
2. Select "Hide sheet"
3. The tab disappears from the user's view
4. To unhide: View → Hidden sheets → Engine

### Step 2: Protect the Engine Tab

1. Data → Protected sheets and ranges
2. Select "Engine" tab
3. Set permissions: "Only you" (the spreadsheet owner)
4. This prevents anyone with edit access from modifying formulas

### Step 3: Protect Formula Cells on Scenario Engine

1. Select cells `B13:B15` (results) and `B20:D24` (comparison table)
2. Data → Protected sheets and ranges → Add a range
3. Name it "Scenario Engine Results"
4. Set permissions: "Only you"
5. Users can edit green input cells (`B4:B10`) but not blue result cells

### Step 4: Protect Budget Tracker Formula Rows

1. Select rows 9, 22, 24, 25 (all formula rows across all month columns)
2. Data → Protected sheets and ranges → Add a range
3. Name it "Budget Tracker Formulas"
4. Set permissions: "Only you"
5. Users can edit data cells (rows 4-8, 12-20) but not totals

### Step 5: Protect Debt Payoff Formula Areas

1. Select `B10:E10` (totals), `B13:C15` (comparison), `B20:C23` (payoff timeline)
2. Data → Protected sheets and ranges → Add a range
3. Name it "Debt Payoff Formulas"
4. Set permissions: "Only you"
5. Users can edit debt entries (rows 5-8) but not calculations

### Step 6: Protect Goals Formula Areas

1. Select `E5:E8` (progress %), `B12:B15` (summary formulas)
2. Data → Protected sheets and ranges → Add a range
3. Name it "Goals Formulas"
4. Set permissions: "Only you"
5. Users can edit goal entries (rows 5-8) but not progress calculations

### Step 7: Protect Spendable Formula Areas

1. Select `B5:B6` (daily/weekly budget), `D11:D13` (remaining balance)
2. Data → Protected sheets and ranges → Add a range
3. Name it "Spendable Formulas"
4. Set permissions: "Only you"
5. Users can edit spending log entries (rows 11-13) but not budget calculations

### Step 8: Data Validation on Inputs

| Tab | Cell(s) | Validation Rule | Error Message |
|-----|---------|----------------|---------------|
| Scenario Engine | `B4` | `> 0` | "Enter a positive monthly income" |
| Scenario Engine | `B5` | `> 0` | "Enter a positive monthly expense amount" |
| Scenario Engine | `B6` | `>= 0` | "Savings cannot be negative" |
| Scenario Engine | `B7` | `>= 0` AND `<= 0.50` | "Rate must be between 0% and 50%" |
| Scenario Engine | `B8` | `>= 0` | "Debt cannot be negative" |
| Scenario Engine | `B9` | `>= 0` | "Payment cannot be negative" |
| Scenario Engine | `B10` | `>= 0` AND `<= 0.15` | "Inflation must be between 0% and 15%" |
| Debt Payoff | `B5:B8` | `> 0` | "Balance must be positive" |
| Debt Payoff | `C5:C8` | `>= 0` AND `<= 0.50` | "APR must be between 0% and 50%" |
| Debt Payoff | `D5:D8` | `>= 0` | "Payment cannot be negative" |
| Debt Payoff | `E5:E8` | `>= 0` | "Extra payment cannot be negative" |
| Goals | `B5:B8` | `> 0` | "Target must be positive" |
| Goals | `D5:D8` | `>= 0` | "Amount saved cannot be negative" |
| Spendable | `B4` | `> 0` | "Monthly take-home must be positive" |

### Step 9: Safety Net (Built into Google Sheets)

- **Unlimited undo:** Ctrl+Z works for any accidental edit
- **Version history:** File → Version history → See named versions
- **No Excel = no file corruption risk:** Google Sheets auto-saves to cloud

### Protection Summary

| What | How | Effort |
|------|-----|--------|
| Engine tab hidden | Right-click → Hide | 10 seconds |
| Engine tab locked | Protected range, owner-only | 30 seconds |
| Scenario Engine results | Protected range, 9 cells | 1 minute |
| Goals formulas | Protected range, 5 cells | 30 seconds |
| Spendable formulas | Protected range, 5 cells | 30 seconds |
| Budget Tracker formulas | Protected range, 4 rows × 12 cols | 1 minute |
| Debt Payoff formulas | Protected range, 3 areas | 1 minute |
| Input validation | Data validation rules, 13 cells | 5 minutes |
| **Total protection time** | | **~11 minutes** |

---

## 5. Build Checklist (21.5 Hours)

### Phase 1: Scenario Engine (5 hours)

| Hour | Task | Deliverable |
|------|------|-------------|
| 0:00-0:30 | Create Google Sheet, name tabs | 7 tabs created: Scenario Engine, Goals, Spendable, Budget Tracker, Debt Payoff, Instructions, Engine |
| 0:30-1:00 | Build Scenario Engine input section | Cells A1:B10 with labels, green formatting, data validation |
| 1:00-1:30 | Build Engine tab formulas | NPER/EDATE formulas in Engine B2:B14 |
| 1:30-2:00 | Wire Scenario Engine outputs to Engine | Cells B13:B15 pulling from Engine tab |
| 2:00-2:30 | Build comparison table | Rows 18-24 with labels and Engine references |
| 2:30-3:00 | Add inflation toggle | Row 10 with B10 input, validation, and note |
| 3:00-3:30 | Add sensitivity table | Engine rows 30-37 with 8 extra payment scenarios |
| 3:30-4:00 | Add cross-tab validation | Engine rows 28-30 with weighted APR check |
| 4:00-4:30 | Add conditional formatting | Color rules on months, interest saved, results |
| 4:30-5:00 | Test with 3 scenarios | Verify NPER returns correct months for known inputs |
| 5:00-5:00 | Protect cells + validation | Hide Engine tab, lock result cells, add validation |

### Phase 2: Budget Tracker (4 hours)

| Hour | Task | Deliverable |
|------|------|-------------|
| 4:00-4:30 | Build income section | Rows 3-9 with 3 income categories, 12 month columns |
| 4:30-5:00 | Build expense section | Rows 11-22 with 8 expense categories, 12 month columns |
| 5:00-5:30 | Add formula rows | Total income, total expenses, net, savings rate |
| 5:30-6:00 | Add conditional formatting | Color rules on net, savings rate |
| 6:00-6:30 | Freeze panes + formatting | Row 1 and column A frozen, consistent typography |
| 6:30-7:00 | Populate sample data | 3 months of realistic income/expense data |
| 7:00-7:30 | Test totals | Verify sums, net, and savings rate match manual calc |
| 7:30-8:00 | Protect formula rows | Lock rows 9, 22, 24, 25 |

### Phase 3: Goals (2 hours)

| Hour | Task | Deliverable |
|------|------|-------------|
| 8:00-8:30 | Build Goals input section | Rows 3-8 with goal name, target, deadline, saved |
| 8:30-9:00 | Add progress formulas | Percentage formulas, summary section, next deadline |
| 9:00-9:30 | Add conditional formatting | Color rules on progress %, deadline warnings |
| 9:30-10:00 | Populate sample goals | 4 sample goals (emergency fund, vacation, laptop, down payment) |

### Phase 4: Spendable (2 hours)

| Hour | Task | Deliverable |
|------|------|-------------|
| 10:00-10:30 | Build Spendable input section | Monthly take-home pay, daily/weekly budget formulas |
| 10:30-11:00 | Build spending log | Date, category, amount, remaining columns |
| 11:00-11:30 | Build category limits | Category limits section with spent/remaining tracking |
| 11:30-12:00 | Add conditional formatting + sample data | Color rules on remaining balance, 3 days of sample spending |

### Phase 5: Debt Payoff (3 hours)

| Hour | Task | Deliverable |
|------|------|-------------|
| 8:00-8:30 | Build debt input section | Rows 3-10 with 4 debt slots, columns A-E |
| 8:30-9:00 | Build comparison section | Rows 12-17 with snowball vs avalanche totals |
| 9:00-9:30 | Build payoff timeline | Rows 18-24 with per-debt payoff dates |
| 9:30-10:00 | Add conditional formatting | Color rules on balance, APR, interest saved |
| 10:00-10:30 | Populate sample debts | 4 sample debts (credit card, car, student, medical) |
| 10:30-11:00 | Test + protect | Verify NPER formulas, lock formula cells |

### Phase 6: Instructions (1.5 hours)

| Hour | Task | Deliverable |
|------|------|-------------|
| 11:00-11:30 | Write Quick Start section | 4-step setup in rows 3-8 |
| 11:30-12:00 | Write tab-by-tab guides | Rows 9-42 with usage instructions |
| 12:00-12:30 | Write "Why Dates Differ" section | Explanation of Tab 1 vs Tab 5 differences |
| 12:30-12:45 | Write NPER/EDATE documentation | Technical explanation in plain language |
| 12:45-13:00 | Write FAQ | Rows 43-80 with 9 common questions |
| 13:00-13:30 | Write support info + format | Contact details, refund policy, consistent typography |

### Phase 7: Cover & Listing (2 hours)

| Hour | Task | Deliverable |
|------|------|-------------|
| 13:00-13:30 | Write Etsy title | 140-char title with primary keywords |
| 13:30-14:00 | Write Etsy description | Full listing copy (see Section 6) |
| 14:00-14:30 | Select 13 Etsy tags | Keyword-optimized tags (see Section 6) |
| 14:30-15:00 | Write cover image brief | Prompt for AI image generation (see Section 7) |

### Phase 8: Polish & Testing (5.5 hours)

| Hour | Task | Deliverable |
|------|------|-------------|
| 15:00-15:30 | Full walkthrough test | Use the spreadsheet as a real user would |
| 15:30-16:00 | Fix any formula errors | Debug NPER edge cases, circular refs |
| 16:00-16:30 | Mobile test | Open on Google Sheets app, verify readability |
| 16:30-17:00 | Print test | Export to PDF, verify all tabs print cleanly |
| 17:00-17:30 | Spell check + polish | Fix typos, consistent formatting |
| 17:30-18:00 | Edge case testing | Test with $0 income, negative net, 0% rate, max debts |
| 18:00-18:30 | Generate cover image | Use brief from Section 7 |
| 18:30-19:00 | Create mockup images | 3-5 product mockups for listing |
| 19:00-19:30 | Write README | Product overview, file structure, support info |
| 19:30-20:00 | Final review | Checklist from Section 8 |

---

## 6. Etsy Listing Copy

### Title (140 char max)

```
Budget Spreadsheet Google Sheets — Scenario Engine, Debt Payoff Planner, Monthly Budget Template, Financial Freedom Calculator
```

**Length:** 136 characters

### Alternative Titles

| Variation | Length |
|-----------|--------|
| Google Sheets Budget Template — Financial Freedom Calculator, Debt Snowball vs Avalanche, Monthly Budget Tracker, $14.99 | 124 |
| Budget Pro 2026 — Google Sheets Financial Dashboard, Debt Payoff Planner, Scenario Engine, Budget Tracker | 113 |

### Description

**Stop guessing when you'll be debt-free. Start seeing the exact date.**

Budget Pro 2026 is a $14.99 Google Sheets budget template with a built-in Scenario Engine — a calculator that answers "when will I be financially free?" using real NPER and EDATE formulas. No other budget spreadsheet at this price does this.

**THE SCENARIO ENGINE (THE DIFFERENTIATOR)**

Enter 6 numbers — monthly income, expenses, savings, interest rate, debt balance, minimum payment — and instantly see:
- Months to financial freedom
- Exact freedom date (e.g., "June 2028")
- Total interest saved vs minimum payments
- Comparison: what happens if you pay an extra $200/month? $400/month?

Change one number. Watch everything recalculate. That's the power of a spreadsheet vs an app.

**WHAT'S INSIDE (6 TABS)**

| Tab | What It Does |
|-----|-------------|
| **Scenario Engine** | "When am I free?" calculator with NPER/EDATE formulas |
| **Goals** | Track savings goals with targets, deadlines, and progress |
| **Spendable** | Daily/weekly spending budget with remaining balance |
| **Budget Tracker** | Monthly income vs expenses, 8 categories, savings rate |
| **Debt Payoff** | Snowball vs avalanche comparison with payoff dates |
| **Instructions** | How to use each tab, FAQ, troubleshooting |

**WHY THIS INSTEAD OF YNAB ($109/YEAR)**

- $14.99 once → you own it forever
- No app to learn → it's a spreadsheet
- No subscription → no annual renewal
- No bank linking → your data stays yours
- Scenario Engine → YNAB doesn't have this

**HOW IT WORKS**

1. Buy & download (instant access)
2. Open in Google Sheets (free with any Google account)
3. Enter your 6 numbers in the Scenario Engine
4. Read your results — when you'll be free, how much interest you'll save
5. Track your budget monthly in the Budget Tracker tab
6. Compare debt payoff strategies in the Debt Payoff tab

**WHAT'S INCLUDED**

- ✅ 6 Google Sheets tabs (Scenario Engine, Goals, Spendable, Budget Tracker, Debt Payoff, Instructions)
- ✅ 1 hidden Engine tab (all formulas — you never see it)
- ✅ 3 months of sample data (see it working before you customize)
- ✅ Data validation (prevents bad input)
- ✅ Protected formula cells (can't accidentally break anything)
- ✅ Step-by-step instructions tab
- ✅ 30-day money-back guarantee

**WHO THIS IS FOR**

✅ You want to know the exact date you'll be debt-free
✅ You want to compare "what if I pay extra?" scenarios
✅ You want a simple budget tracker (not 12 overwhelming sheets)
✅ You want to own your financial tool, not rent it

**WHO THIS IS NOT FOR**

❌ You want real-time bank syncing (this is manual entry)
❌ You want a freebie ($19, premium quality)
❌ You need Excel support (Google Sheets only)

**SPECS**

- Platform: Google Sheets (free with any Google account)
- Tabs: 6 visible + 1 hidden
- Mobile: Optimized for Google Sheets app
- Protection: Formula cells locked, input cells editable
- Updates: Free updates for 12 months

**30-DAY MONEY-BACK GUARANTEE**

Buy it, try it, decide it's not for you within 30 days? Message me. Full refund. No questions.

### Tags (13 max, 20 chars each)

| # | Tag | Volume |
|---|-----|--------|
| 1 | budget spreadsheet | High |
| 2 | google sheets | High |
| 3 | debt payoff planner | Medium |
| 4 | financial calculator | Medium |
| 5 | budget template | High |
| 6 | monthly budget | High |
| 7 | debt snowball | Medium |
| 8 | savings calculator | Medium |
| 9 | expense tracker | Medium |
| 10 | money planner | Low-Med |
| 11 | budget planner | High |
| 12 | financial freedom | Low-Med |
| 13 | net worth tracker | Medium |

### Pricing Rationale

| Factor | Value |
|--------|-------|
| YNAB annual cost | $109/year |
| Competitor spreadsheets | $5-$15 (basic, no Scenario Engine) |
| Our differentiator | Scenario Engine (NPER/EDATE) — unique at this price |
| Price | $14.99 (one-time) |
| Value proposition | "For less than 7 weeks of YNAB, own a budget tool forever" |

---

## 7. Cover Image Brief

### Primary Prompt (Midjourney v6 / DALL-E 3 / Ideogram)

```
Premium SaaS-style hero image for a personal-finance spreadsheet product called "Budget Pro 2026". Clean isometric dashboard floating in deep midnight-blue space, casting a soft glow. The dashboard shows 3 KPI cards: "Financial Freedom: Jun 2028" in emerald green, "Months to Go: 24" with a circular countdown ring at 67%, "Interest Saved: $3,847" in gold. Below the cards: a 6-month line chart trending upward in glowing teal, a bar chart comparing "Minimum Payments" vs "Extra $200/mo" vs "Extra $400/mo" payoff timelines. Subtle paper-grid texture on the dashboard surface. Soft bokeh particles in background. Color palette: midnight navy (#0B0F17), emerald green (#10B981), warm white (#F8FAFC), soft gold accents (#F59E0B). No text overlays other than the visible KPI numbers. Photorealistic 3D render, premium tech product photography, soft cinematic lighting, 8K detail, sharp focus on the dashboard, slight depth of field on the background. --ar 1:1 --style raw --v 6
```

### Variations

#### Variation A (Apple-style minimal)
```
Minimalist product hero. Single Apple-style KPI card centered on soft gradient background (top: pale mint #ECFDF5, bottom: warm white). Card shows: "Financial Freedom · Jun 2028 · 24 months" in SF Pro typography. Below: thin glowing line chart in emerald. Small badge in corner reads "Google Sheets" in subtle gray. Floating soft shadows, paper texture, no clutter, negative space dominant. 15-degree angle, soft morning light from upper left. 4K, sharp. --ar 1:1
```

#### Variation B (Bento grid)
```
Isometric bento-grid dashboard floating in softly-lit studio. 4 tiles in 2x2 grid: top-left "Scenario Engine" with 6 input fields and results, top-right "Budget Tracker" with monthly columns, bottom-left "Debt Payoff" with snowball vs avalanche bars, bottom-right "Instructions" with checkmark icons. Tiles are rounded white slabs with soft drop shadows. Numbers in clean sans-serif, midnight navy and emerald green. Background warm off-white with subtle film grain. Top-down 30-degree angle, photorealistic, 8K. --ar 1:1
```

#### Variation C (Editorial magazine)
```
Editorial-style flat-lay photograph from above. Dark walnut wooden desk. Center: MacBook screen showing a beautifully designed spreadsheet with "Financial Freedom: Jun 2028" in large text. Left: leather wallet, two $100 bills, fountain pen. Right: small potted succulent, ceramic coffee mug. Morning sunlight from upper right, long soft shadows. Warm wood browns, cream, emerald green dashboard glow, gold accents. Magazine-quality, shallow depth of field, 50mm lens, f/2.8, 4K. --ar 1:1
```

### Negative Prompt
```
no text errors, no spelling mistakes, no garbled numbers, no cartoonish style, no clipart, no emoji icons, no stock-photo smiling models, no bright neon, no cheap gradients, no blurry charts, no 3D pie chart explosions, no stock ticker symbols, no cryptocurrency logos
```

### Design Notes
- Resolution: 2700x2025 px (Etsy optimal)
- Safe zone: central 1800x1800 (Etsy adds 100px frame)
- Color palette: midnight navy, emerald, warm white, gold
- Keep visible numbers exact (Jun 2028, 24, $3,847)
- File format: PNG, no watermarks
- Post-process: subtle vignette, +5% contrast, sharpen edges

### Text Overlay (Add in Canva/Figma)
- Top-left: "GOOGLE SHEETS TEMPLATE" white on emerald pill
- Bottom-center: "BUDGET PRO 2026" heavy sans-serif, white
- Below title: "Your Financial Freedom Calculator" lighter weight
- Bottom-right: "$14.99" price tag in gold

### Export Specs
- Etsy primary: 2700x2025 px, PNG, sRGB, < 10 MB
- Pinterest pin: 1000x1500 px, PNG
- Instagram square: 1080x1080 px, JPG

---

## 8. Quality Checklist

### Must Be True Before Launch

#### Formulas

- [ ] NPER returns correct months for known test case: income $5,400, expenses $3,200, savings $12,000, rate 8.50%, debt $24,200, payment $490 → should return ~24 months
- [ ] EDATE produces correct freedom date (today + NPER months)
- [ ] Interest saved calculation matches manual: (months × payment) - principal
- [ ] Comparison table shows correct progression: min-only > extra $200 > extra $400 > user scenario
- [ ] Debt Payoff NPER returns "Never" when payment < monthly interest
- [ ] Debt Payoff NPER returns correct months for each sample debt
- [ ] Snowball total months = MAX of individual payoff months
- [ ] Avalanche total months = MAX of individual payoff months
- [ ] All `IFERROR` wrappers catch `#NUM!` and return "Check inputs" or "N/A"
- [ ] No `#REF!`, `#N/A`, `#VALUE!`, or `#DIV/0!` errors visible anywhere
- [ ] Inflation toggle correctly adjusts the NPER rate (B7 - B10) / 12
- [ ] Sensitivity table shows 8 rows with correct progression
- [ ] Cross-tab validation catches mismatched APRs
- [ ] Weighted average APR from Debt Payoff matches Scenario Engine input

#### Formatting

- [ ] All input cells have green background (#DCFCE7)
- [ ] All result cells have blue background or bold formatting
- [ ] Currency cells formatted as `$#,##0`
- [ ] Percentage cells formatted as `0.00%` (Scenario Engine) or `0.0%` (Budget Tracker)
- [ ] Headers are Bold, 14pt, #0F172A
- [ ] Body text is Regular, 10pt
- [ ] Conditional formatting fires correctly:
  - [ ] Months < 12 = green, 12-36 = yellow, 36+ = red
  - [ ] Net negative = red text
  - [ ] Savings rate >= 20% = green background
  - [ ] APR >= 20% = red text
  - [ ] Interest saved > 0 = green text
- [ ] Inflation toggle cell has green background (#DCFCE7)
- [ ] Sensitivity table has alternating row colors
- [ ] Cross-tab check shows green checkmark when matched, yellow warning when mismatched

#### Protection

- [ ] Engine tab is hidden
- [ ] Engine tab is protected (owner-only)
- [ ] Scenario Engine result cells are protected
- [ ] Budget Tracker formula rows are protected
- [ ] Debt Payoff formula areas are protected
- [ ] Users can edit all input cells without errors
- [ ] Users cannot accidentally delete formulas

#### Data Validation

- [ ] Scenario Engine B4 rejects 0 and negative income
- [ ] Scenario Engine B5 rejects 0 and negative expenses
- [ ] Scenario Engine B7 rejects rates > 50%
- [ ] Scenario Engine B9 rejects negative payments
- [ ] Scenario Engine B10 rejects inflation > 15%
- [ ] Debt Payoff B5:B8 rejects 0 and negative balances
- [ ] Debt Payoff C5:C8 rejects APR > 50%
- [ ] Error messages are clear and helpful

#### User Experience

- [ ] First-time user can get results in under 5 minutes
- [ ] Instructions tab answers all common questions
- [ ] Sample data shows the product working (not empty)
- [ ] Mobile view is readable (Google Sheets app)
- [ ] All tabs have frozen panes (title row + first column)
- [ ] Tab order is intuitive: Scenario Engine → Goals → Spendable → Budget Tracker → Debt Payoff → Instructions
- [ ] Instructions explain why Tab 1 and Tab 5 show different dates
- [ ] NPER/EDATE documentation is clear and non-technical
- [ ] Inflation toggle has helpful default (3%) and clear label

#### Etsy Listing

- [ ] Title is under 140 characters
- [ ] Description includes: what it is, who it's for, what's inside, pricing rationale
- [ ] 13 tags selected, all under 20 characters
- [ ] Cover image is 2700x2025 px, PNG, sRGB
- [ ] Price is $14.99 (no discounts)

#### Legal & Support

- [ ] 30-day refund policy stated in listing
- [ ] Support contact method listed (Etsy message)
- [ ] "Google Sheets only" stated clearly (no Excel promise)
- [ ] No copyrighted content in sample data

---

## Appendix A: Sample Data

### Scenario Engine Sample

| Input | Value |
|-------|-------|
| Monthly income | $5,400 |
| Monthly living expenses (excl. debt payments) | $3,200 |
| Current savings | $12,000 |
| Weighted average APR (%) | 8.50% |
| Total debt balance | $24,200 |
| Total monthly debt payment | $490 |
| Inflation adjustment (%) | 3.00% |

**Expected results:**
- Months to freedom: ~24
- Freedom date: ~June 2028
- Interest saved: ~$3,800

### Goals Sample

| Goal | Target | Deadline | Saved | Progress |
|------|--------|----------|-------|----------|
| Emergency fund | $10,000 | Dec 2026 | $6,000 | 60% |
| Vacation | $3,000 | Jun 2027 | $800 | 27% |
| New laptop | $1,500 | Mar 2026 | $1,200 | 80% |
| Down payment | $25,000 | Dec 2028 | $4,500 | 18% |

**Summary:**
- Total saved: $12,500
- Total target: $39,500
- Overall progress: 31.6%

### Spendable Sample

| Setting | Value |
|---------|-------|
| Monthly take-home pay | $4,200 |
| Daily budget | $140 |
| Weekly budget | $977 |

**Sample spending (3 days):**

| Date | Category | Amount | Remaining |
|------|----------|--------|-----------|
| Jun 9 | Food | $42 | $98 |
| Jun 9 | Transport | $15 | $83 |
| Jun 10 | Food | $35 | $105 |
| Jun 10 | Entertainment | $25 | $80 |
| Jun 11 | Food | $28 | $112 |

**Category limits:**

| Category | Monthly Limit | Spent | Remaining |
|----------|---------------|-------|-----------|
| Food | $600 | $180 | $420 |
| Transport | $200 | $45 | $155 |
| Entertainment | $300 | $75 | $225 |
| Other | $200 | $30 | $170 |

### Budget Tracker Sample (3 months)

| Category | Jan | Feb | Mar |
|----------|-----|-----|-----|
| Salary | $5,400 | $5,400 | $5,400 |
| Side hustle | $800 | $1,200 | $600 |
| Other income | $0 | $200 | $0 |
| Housing | $1,800 | $1,800 | $1,800 |
| Utilities | $280 | $310 | $260 |
| Food | $450 | $520 | $480 |
| Transport | $160 | $140 | $180 |
| Entertainment | $200 | $150 | $250 |
| Savings | $500 | $500 | $500 |
| Debt payments | $490 | $490 | $490 |
| Other | $100 | $80 | $120 |

### Debt Payoff Sample

| Debt | Balance | APR | Min | Extra |
|------|---------|-----|-----|-------|
| Chase Visa | $2,800 | 24.99% | $85 | $200 |
| Car Loan | $8,400 | 6.75% | $225 | $0 |
| Student Loan | $15,800 | 5.50% | $180 | $0 |
| Medical Bill | $1,200 | 0.00% | $100 | $100 |

---

## Appendix B: Design Tokens

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
| `--input-bg` | `#DCFCE7` | Editable input cells |

### Typography

- **Headers:** Inter / Roboto / system-ui, **Bold**, 14pt
- **Body:** Inter / Roboto / system-ui, Regular, 10pt
- **Numbers:** Tabular alignment, right-justified, 10pt
- **Sheet titles (row 1):** 14pt Bold, color `--ink-900`, background `--surface-alt`

### Cell Heights

- Header row: 32px
- Data rows: 24px
- Section dividers: 12px

---

## Appendix C: Files in This Folder

```
budget-pro-2026/
├── build-spec-lean.md         ← you are here (this document)
├── metadata.json              ← product metadata
```

---

**End of build spec. Ready to build.**
