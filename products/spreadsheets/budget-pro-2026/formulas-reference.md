# Formulas Reference — Budget Pro 2026

Every formula in the template, what it does, where it lives, and how to debug it.

---

## Conventions

- All cell references use `A1` notation
- Sheet names are quoted with single quotes when they contain spaces: `'Net Worth'!A2`
- Helpful named ranges (set in **Data → Named ranges**):
  - `txDate` = `Transactions!A:A`
  - `txAccount` = `Transactions!B:B`
  - `txPayee` = `Transactions!C:C`
  - `txType` = `Transactions!D:D`
  - `txAmount` = `Transactions!E:E`
  - `txSigned` = `Transactions!F:F`
  - `txCategory` = `Transactions!G:G`

Using named ranges makes every other formula readable.

---

## Formula 1 — Monthly Income (Dashboard `C4`)

```
=SUMIFS(txSigned, txType, "Income",
        txDate, ">="&EOMONTH($G$1,-1)+1,
        txDate, "<="&EOMONTH($G$1,0))
```

**What it does:** Adds every positive transaction (Income) whose date falls within the month picked in `G1`.

**How it works:**
- `EOMONTH($G$1,-1)+1` = first day of the selected month
- `EOMONTH($G$1,0)` = last day of the selected month
- `SUMIFS` only sums rows where `txType = "Income"` AND date is in range

**Debug tips:**
- If returns 0: check that `G1` is a real date, not text
- If too high: check that no `Transfer` rows are mis-tagged as `Income`

---

## Formula 2 — Monthly Expenses (Dashboard `C5`)

```
=ABS(SUMIFS(txSigned, txType, "Expense",
            txDate, ">="&EOMONTH($G$1,-1)+1,
            txDate, "<="&EOMONTH($G$1,0)))
```

**What it does:** Sums every Expense row (which is negative in `txSigned`) and wraps in `ABS` so the dashboard shows a positive number.

---

## Formula 3 — Savings Rate (Dashboard `C7`)

```
=IF(C4=0, 0, (C4-C5)/C4)
```

**What it does:** Net / Income. Formatted as a percentage.

- 20%+ is generally considered excellent
- 10–20% is healthy
- < 10% triggers the warning color

---

## Formula 4 — Category Spend (Dashboard `C11+`)

```
=ABS(SUMIFS(txSigned, txCategory, $A11,
            txDate, ">="&EOMONTH($G$1,-1)+1,
            txDate, "<="&EOMONTH($G$1,0)))
```

Same pattern, narrowed by category in column `A`.

---

## Formula 5 — Budget Lookup (Dashboard `B11+`)

```
=IFERROR(VLOOKUP($A11, 'Budget vs Actual'!$A:$AL,
                  MATCH(TEXT($G$1,"MMM")&" Budget",
                        'Budget vs Actual'!$A$1:$AL$1, 0), FALSE), 0)
```

**What it does:** Looks up the current month's budget for category `$A11` from the **Budget vs Actual** sheet.

**Why MATCH inside VLOOKUP:** Avoids hard-coding column numbers. The header row uses `Jan Budget`, `Feb Budget`, ... `Dec Budget`, so `MATCH("Mar Budget", header)` returns the correct column.

---

## Formula 6 — Percent of Budget (Dashboard `E11+`)

```
=IFERROR(C11/B11, 0)
```

Simple ratio. Formatted as `%`.

---

## Formula 7 — Visual Bar (Dashboard `F11+`)

```
=REPT("█", MIN(12, ROUND(E11*12,0))) & REPT("░", MAX(0, 12-ROUND(E11*12,0)))
```

**What it does:** Builds a 12-character bar like `████████░░░░` using filled and empty block characters proportional to `E11`.

`MIN(12, ...)` caps the filled portion so a 150% overrun still shows a full bar (and the % column does the warning).

---

## Formula 8 — Flag Emoji (Dashboard `G11+`)

```
=IF(E11>1, "⚠", IF(E11>=0.8, "▲", "✓"))
```

- `⚠` over budget
- `▲` approaching budget
- `✓` on track

---

## Formula 9 — Auto-categorize Suggestion (Transactions `K2+`)

```
=IFERROR(INDEX(Categories!$B$2:$B$26,
              MATCH(TRUE, ISNUMBER(SEARCH(Categories!$D$2:$D$26, LOWER($C2))), 0)),
        "Other")
```

**What it does:** Scans the **Match keyword** column (col `D`) in Categories for a substring that appears in the payee. Returns the matching **Category** (col `B`). Falls back to `"Other"` if nothing matches.

> **v2 change:** Now resolves to a Category name (col `B`) and falls back to "Other" instead of an empty string. The old version left blank cells which broke downstream SUMIFS.
> The match is case-insensitive via `LOWER($C2)`.

**Array-formula wrapper (Google Sheets):**

```
=IFERROR(
  INDEX(Categories!$B$2:$B$26,
    MATCH(TRUE,
      ARRAYFORMULA(ISNUMBER(SEARCH(Categories!$D$2:$D$26, LOWER($C2)))),
    0)),
  "Other")
```

**In Excel 365+** (native dynamic arrays — no Ctrl+Shift+Enter needed):

```
=IFERROR(INDEX(Categories!$B$2:$B$26,
              MATCH(TRUE, ISNUMBER(SEARCH(Categories!$D$2:$D$26, LOWER($C2))), 0)),
        "Other")
```

**How the substring match works:**
- `SEARCH(needle, haystack)` returns the position of `needle` inside `haystack` (case-insensitive), or `#VALUE!` if not found
- `ISNUMBER(...)` converts that to `TRUE`/`FALSE`
- `MATCH(TRUE, array, 0)` finds the first row where the result is TRUE
- `INDEX(...)` returns the value from col `B` at that row

**Example:**
- Categories row has `netflix` (col D) and `Subscriptions` (col B)
- Transaction payee is `"Netflix.com 866-579-7172"`
- `SEARCH("netflix", "netflix.com 866...")` returns `1`
- `MATCH(TRUE, ..., 0)` returns the row number
- `INDEX(...)` returns `"Subscriptions"`
- Transactions!G (Category) auto-fills with `Subscriptions`

**Adding new rules:** Just add a row to Categories with the keyword in column D and the category in column B. No formula changes needed.

---

## Formula 10 — Signed Amount Helper (Transactions `F2+`)

```
=IF(D2="Income", ABS(E2), IF(D2="Expense", -ABS(E2), 0))
```

Normalizes user input so dashboards can sum `F:F` regardless of sign-typing habits.

---

## Formula 11 — Monthly Actual per Category (Budget vs Actual `C2+`)

For January Actual:

```
=ABS(SUMIFS(txSigned, txCategory, $A2,
            txDate, ">="&DATE(YEAR(TODAY()),1,1),
            txDate, "<="&DATE(YEAR(TODAY()),1,31)))
```

For February Actual (column F):

```
=ABS(SUMIFS(txSigned, txCategory, $A2,
            txDate, ">="&DATE(YEAR(TODAY()),2,1),
            txDate, "<="&EOMONTH(DATE(YEAR(TODAY()),2,1),0)))
```

> Tip: copy the January formula across, then **Find & Replace** `,1,1` → `,2,1` etc. for each month.

---

## Formula 12 — Variance (Budget vs Actual `D2+`)

```
=B2-C2
```

Positive variance = under budget (good). Negative = over (bad).

---

## Formula 13 — YTD Budget (Budget vs Actual `AJ2+`)

```
=SUM(B2,E2,H2,K2,N2,Q2,T2,W2,Z2,AC2,AF2,AI2)
```

Sums all 12 monthly Budget cells.

---

## Formula 14 — YTD Actual (Budget vs Actual `AK2+`)

For any category row, sum all transactions from Jan 1 of the current year through today, filtered by category.

```
=SUMIFS(txSigned,
        txDate, ">="&DATE(YEAR(TODAY()),1,1),
        txDate, "<="&TODAY(),
        txCategory, $A2)
```

**What it does:** Adds every signed transaction whose date falls in `[Jan 1, today]` AND whose category matches the row's category. Auto-rolls forward every day — no manual update.

**Why the new formula (v2):** The original `=SUM(C2,F2,I2,L2,...)` referenced the Actual cells in the same sheet, which is brittle (a typo on one cell broke the whole YTD). The SUMIFS version is live, references the canonical transaction log, and never needs maintenance.

> Wrap with `=IF(ABS(SUMIFS(...))<0.01, "", SUMIFS(...))` to leave the cell visually blank when there is no YTD activity.

**Debug tips:**
- If YTD shows 0 for a category that has data: check that the category in `$A2` exactly matches `txCategory` values
- If YTD includes future-dated rows: the `<=`&TODAY() cap is missing

---

## Formula 15 — Goal Progress (Goals `H2+`)

```
=IFERROR(G2/C2, 0)
```

Current / Target. Formatted `%`.

---

## Formula 16 — Goal Linked-Account Sync (Goals `G2+`)

```
=IF(F2=TRUE, IFERROR(VLOOKUP(E2, Accounts!$A:$D, 4, FALSE), D2), D2)
```

If `Auto-sync` checkbox is on, pulls the live balance from the linked Accounts row. Otherwise uses the manual `D` value.

---

## Formula 17 — Goal Monthly Need (Goals `K2+`)

```
=IF(OR(J2<=TODAY(), C2<=G2), 0,
     (C2-G2)/MAX(1, DATEDIF(TODAY(), J2, "M")))
```

**What it does:** How much you need to save per month to hit the target by the target date.

- Returns 0 if goal is already met or date is in the past
- Uses `DATEDIF` in months
- `MAX(1, ...)` avoids divide-by-zero in the last month

---

## Formula 18 — Goal Projected Hit Date (Goals `M2+`)

```
=IF(L2<=0, "—",
   IF(G2>=C2, "✓",
     EDATE(TODAY(), CEILING((C2-G2)/L2, 1))))
```

**What it does:** Given the current monthly pace `L2`, projects which month the goal will be hit using `EDATE` (date arithmetic in months).

---

## Formula 19 — Goal Status (Goals `N2+`)

```
=IF(H2>=1, "✓ Complete",
   IF(M2="—", "⏸ Stalled",
     IF(M2<=J2, "🎯 On track", "⚠ Behind")))
```

Combines progress and projection into a single status string used for conditional formatting.

---

## Formula 20 — Single-Debt Payoff Months (Debt Payoff `G2+`)

Uses Excel's built-in `NPER` (number of periods):

```
=IFERROR(
   IF(F2*12 <= B2*C2, "Never",
      ROUNDUP(NPER(C2/12, -F2, B2), 0)),
   "Never")
```

**What it does:** Calculates how many monthly payments of `F2` (min + extra) it takes to pay off balance `B2` at annual rate `C2`.

- Returns `"Never"` if the payment is less than monthly interest
- `ROUNDUP` because partial months still cost

---

## Formula 21 — Single-Debt Total Interest (Debt Payoff `H2+`)

```
=IF(G2="Never", "∞", F2*G2 - B2)
```

Total paid minus balance = interest.

---

## Formula 22 — Snowball Order (Debt Payoff `J2+`)

```
=IFERROR(RANK(B2, $B$2:$B$20, 1), "")
```

Rank by balance ascending (smallest first = snowball order).

---

## Formula 23 — Avalanche Order (Debt Payoff `M2+`)

```
=IFERROR(RANK(C2, $C$2:$C$20, 0), "")
```

Rank by APR descending (highest first = avalanche order).

---

## Formula 24 — Net Worth Live Sum (Net Worth `B[currentmonth]`)

```
=SUMIF(Accounts!$I:$I, "Asset", Accounts!$D:$D)
```

Sum of all asset balances. For the live row only — past months should be hard-coded snapshots.

```
=SUMIF(Accounts!$I:$I, "Liability", Accounts!$D:$D)
```

Sum of all liability balances. Subtract for net worth.

---

## Formula 25 — Net Worth Change $ (Net Worth `E2+`)

```
=IFERROR(D2-D1, 0)
```

Simple month-over-month delta.

---

## Formula 26 — Net Worth Change % (Net Worth `F2+`)

```
=IFERROR((D2-D1)/ABS(D1), 0)
```

ABS in the denominator handles negative net worth without flipping the sign of the change.

---

## Formula 27 — Net Worth Sparkline (Net Worth `G2+`)

Google Sheets:

```
=SPARKLINE($D$2:D2, {"charttype","line";"color1","#3B82F6";"linewidth",2})
```

Each row's sparkline shows the trend up to that row, so the bottom-most cell shows the full chart.

In Excel, use the built-in **Insert → Sparkline → Line** with range `$D$2:D2`.

---

## Formula 28 — Subscription Monthly Equivalent (Subscriptions `E2+`)

```
=SWITCH(D2,
   "Monthly", C2,
   "Yearly", C2/12,
   "Quarterly", C2/3,
   0)
```

Cleaner than nested IFs.

---

## Formula 29 — Subscription Yearly Equivalent (Subscriptions `F2+`)

```
=E2*12
```

---

## Formula 30 — Subscription Used Recently (Subscriptions `I2+`)

```
=IF(H2="", FALSE, TODAY()-H2<=30)
```

Returns TRUE if used in the last 30 days. Triggers the green flag.

---

## Formula 31 — Annual Cell (Annual `B2+`)

January for category `$A2`:

```
=ABS(SUMIFS(txSigned, txCategory, $A2,
            txDate, ">="&DATE(YEAR(TODAY()),1,1),
            txDate, "<="&DATE(YEAR(TODAY()),1,31)))
```

Repeat for each month, shifting the month index.

> Power-user trick: use `=ABS(SUMIFS(txSigned, txCategory, $A2, txDate, ">="&DATE(YEAR(TODAY()),COLUMN()-1,1), txDate, "<="&EOMONTH(DATE(YEAR(TODAY()),COLUMN()-1,1),0)))` so it auto-shifts based on column position.

---

## Formula 32 — Annual YTD Total (Annual `N2+`)

```
=SUM(B2:M2)
```

---

## Formula 33 — Annual Monthly Avg (Annual `O2+`)

```
=IFERROR(N2/COUNTIF(B2:M2,">0"), 0)
```

Only divides by months that have data — gives a true running average.

---

## Formula 34 — Annual YoY Change (Annual `Q2+`)

```
=IFERROR((N2-P2)/P2, 0)
```

Formatted as `%`. Requires `P2` to be last year's total (typed in or pulled from a snapshot).

---

## Formula 35 — Reports Top 5 Categories (Reports `B15`)

**v2 change:** The original QUERY used `order by sum(F) asc` which surfaced the *smallest* spenders. Corrected to **`desc`** so the top entries are the highest-spend categories.

```
=QUERY(Transactions!A:G,
       "select G, sum(F) where D='Expense' and A>=date '"
       & TEXT(EOMONTH($B$1,-1)+1,"yyyy-mm-dd")
       & "' and A<=date '"
       & TEXT(EOMONTH($B$1,0),"yyyy-mm-dd")
       & "' group by G order by sum(F) desc limit 5 label sum(F) ''",
       1)
```

**What it does:** Generates a mini-table of the 5 categories with the highest spend within the report's month (`$B$1`).

> `desc` = descending (biggest first) — what users want to see in a "Top 5" list.
> The original `asc` made the report show the smallest spenders, which is the opposite of useful.

### Top 5 with LARGE (cross-platform)

If you want a cell-by-cell Top 5 (no QUERY) that works in both Google Sheets and Excel:

```
=LARGE(category_totals_range, 1)   # biggest
=LARGE(category_totals_range, 2)   # 2nd biggest
...
=LARGE(category_totals_range, 5)   # 5th biggest
```

Pair with `INDEX/MATCH` to recover the category name from the rank.

---

---

## Formula 36 — Reports Top 5 Payees (Reports `B21`)

```
=QUERY(Transactions!A:G,
       "select C, sum(F) where D='Expense' and A>=date '"
       & TEXT(EOMONTH($B$1,-1)+1,"yyyy-mm-dd")
       & "' and A<=date '"
       & TEXT(EOMONTH($B$1,0),"yyyy-mm-dd")
       & "' group by C order by sum(F) desc limit 5 label sum(F) ''",
       1)
```

Same pattern as Top 5 Categories, sorted **descending** (v2 change) and grouped by Payee.

---

## Formula 37 — Account Asset/Liability Flag (Accounts `I2+`)

```
=IF(OR(B2="Credit Card", B2="Loan"), "Liability", "Asset")
```

Drives the signed balance column and the Net Worth sum.

---

## Formula 38 — Account Signed Balance (Accounts `J2+`)

```
=IF(I2="Liability", -ABS(D2), ABS(D2))
```

Used by net worth and dashboards so users never have to type negatives.

---

## Formula 39 — Cash Flow Last 6 Months (helper on Reports)

```
=ARRAYFORMULA(
  EOMONTH(TODAY(), SEQUENCE(6, 1, -5, 1))
)
```

Generates the 6 month-end dates the dashboard chart needs.

For each of those months:

```
=ABS(SUMIFS(txSigned, txType, "Income",
            txDate, ">="&EOMONTH(A2,-1)+1, txDate, "<="&A2))
```

```
=ABS(SUMIFS(txSigned, txType, "Expense",
            txDate, ">="&EOMONTH(A2,-1)+1, txDate, "<="&A2))
```

These three columns feed the dashboard's stacked bar chart.

---

## Formula 40 — Goal Bar (Goals `I2+`)

```
=REPT("█", MIN(10, ROUND(H2*10,0))) & REPT("░", MAX(0, 10-ROUND(H2*10,0)))
```

10-character version of the dashboard bar.

---

## Common Pitfalls

| Symptom | Cause | Fix |
|---------|-------|-----|
| `#REF!` | Deleted a column referenced by VLOOKUP | Restore column or update formula |
| `#N/A` in dropdown | Category in Transactions doesn't match Categories list | Type-match it or pick from dropdown |
| Dashboard shows 0 | `G1` is text not date | Reformat `G1` as Date and re-pick |
| Budget always over | Income rows tagged as Expense | Check `D` column on Transactions |
| Net worth doesn't update | Stale account `Last updated` dates | Refresh `E` column on Accounts |
| Sparkline blank | Range too small | Need at least 2 cells |
| Top 5 QUERY shows headers only | Date range catches no rows | Pick a month with data |

---

## Performance Notes

This template is tested with **5,000 transaction rows** and still recalculates in under 2 seconds on Google Sheets web.

For 10,000+ rows:
- Convert formulas to **arrayformula** where possible
- Cache monthly sums into a hidden helper sheet, refreshed manually
- Switch to importing into a real database (you've outgrown a spreadsheet)

---

End of formula reference.
