# Setup Guide — Budget Pro 2026

From zero to a working dashboard in **15 minutes**.

---

## What You're Getting

A bundle of 12 CSV files (one per sheet) plus this guide. You'll import the CSVs into a single Google Sheets file, then customize.

```
csv-templates/
├── 01-dashboard.csv
├── 02-transactions.csv
├── 03-budget-vs-actual.csv
├── 04-categories.csv
├── 05-accounts.csv
├── 06-goals.csv
├── 07-debt-payoff.csv
├── 08-net-worth.csv
├── 09-subscriptions.csv
├── 10-annual.csv
├── 11-reports.csv
└── 12-tutorial.csv
```

---

## Step 1 — Create the Google Sheets file (1 min)

1. Open [sheets.google.com](https://sheets.google.com)
2. Click **+ Blank**
3. Rename the file (top-left): **Budget Pro 2026**

---

## Step 2 — Import each CSV as a new sheet (5 min)

For each of the 12 CSVs:

1. **File → Import**
2. Select the CSV (e.g. `01-dashboard.csv`)
3. Import location: **Insert new sheet(s)**
4. Separator type: **Detect automatically**
5. Convert text to numbers/dates: **Yes**
6. Click **Import data**

Repeat for all 12 files in this exact order so tabs line up:

1. 02-transactions.csv → rename tab **💳 Transactions**
2. 04-categories.csv → rename tab **🗂️ Categories**
3. 05-accounts.csv → rename tab **🏦 Accounts**
4. 03-budget-vs-actual.csv → rename tab **💰 Budget vs Actual**
5. 06-goals.csv → rename tab **🎯 Goals**
6. 07-debt-payoff.csv → rename tab **💸 Debt Payoff**
7. 08-net-worth.csv → rename tab **📈 Net Worth**
8. 09-subscriptions.csv → rename tab **🔁 Subscriptions**
9. 10-annual.csv → rename tab **📅 Annual**
10. 11-reports.csv → rename tab **📄 Reports**
11. 01-dashboard.csv → rename tab **📊 Dashboard** (do last so it can reference others)
12. 12-tutorial.csv → rename tab **📖 Tutorial**

Delete the original blank "Sheet1" Google created.

**Drag the tabs into this order (left to right):**

```
📊 Dashboard | 💳 Transactions | 🎯 Goals | 💰 Budget vs Actual | 🏦 Accounts | 📈 Net Worth | 💸 Debt Payoff | 🔁 Subscriptions | 🗂️ Categories | 📅 Annual | 📄 Reports | 📖 Tutorial
```

---

## Step 3 — Set up the data validations (3 min)

CSV import doesn't carry dropdowns. Add them once:

### Transactions sheet

| Range | Validation |
|-------|------------|
| `B2:B1000` | List from a range: `Accounts!A2:A50` |
| `D2:D1000` | List of items: `Income, Expense, Transfer` |
| `G2:G1000` | List from a range: `Categories!A2:A100` |
| `J2:J1000` | Checkbox |

### Accounts sheet

| Range | Validation |
|-------|------------|
| `B2:B50` | List: `Checking, Savings, Credit Card, Loan, Investment, Cash, Other` |
| `F2:F50` | List: `Me, Partner, Joint` |

### Goals sheet

| Range | Validation |
|-------|------------|
| `B2:B30` | List: `Savings, Debt, Purchase, Emergency` |
| `E2:E30` | List from a range: `Accounts!A2:A50` |
| `F2:F30` | Checkbox |

### Subscriptions sheet

| Range | Validation |
|-------|------------|
| `B2:B50` | List from a range: `Categories!A2:A100` |
| `D2:D50` | List: `Monthly, Yearly, Quarterly` |
| `J2:J50` | Checkbox |

> Tip: **Data → Data validation → + Add rule** for each. Save once per sheet.

---

## Step 4 — Apply conditional formatting (3 min)

The CSV import strips formatting. The fastest way to get it back is the **Format → Conditional formatting** menu. Below is the quickest setup — apply each rule to the listed range.

### Dashboard

| Range | Rule | Color |
|-------|------|-------|
| `D11:D40` | Cell value `< 0` | bg `#EF4444`, white text |
| `D11:D40` | Cell value `>= 0` | bg `#10B981`, white text |
| `E11:E40` | Cell value `>= 1` | text `#EF4444`, bold |
| `E11:E40` | Cell value between `0.8` and `1` | text `#F59E0B` |
| `E11:E40` | Cell value `< 0.8` | text `#10B981` |
| `C7` | Cell value `>= 0.20` | bg `#10B981`, white |
| `C7` | Cell value `< 0.10` | bg `#F59E0B` |

### Transactions

| Range | Rule | Color |
|-------|------|-------|
| `D:D` | Text equals `Income` | text `#10B981`, bold |
| `D:D` | Text equals `Expense` | text `#EF4444` |
| `D:D` | Text equals `Transfer` | text `#94A3B8`, italic |
| `G:G` | Custom formula `=ISBLANK(G2)` | bg `#FEF3C7` |

### Budget vs Actual

| Range | Rule | Color |
|-------|------|-------|
| `D:D, G:G, J:J, M:M, P:P, S:S, V:V, Y:Y, AB:AB, AE:AE, AH:AH, AK:AK` | Cell value `< 0` | bg `#EF4444`, white |
| same | Cell value `> 0` | bg `#10B981`, white |

### Goals

| Range | Rule | Color |
|-------|------|-------|
| `H:H` | Cell value `>= 1` | bg `#10B981`, white |
| `H:H` | Cell value between `0.5` and `0.99` | bg `#3B82F6`, white |
| `H:H` | Cell value `< 0.25` | bg `#F59E0B` |
| `N:N` | Text contains `Complete` | bg `#10B981` |
| `N:N` | Text contains `On track` | text `#3B82F6`, bold |
| `N:N` | Text contains `Behind` | text `#EF4444`, bold |

### Subscriptions

| Range | Rule | Color |
|-------|------|-------|
| `I:I` | Cell value `=FALSE` | bg `#FEF3C7` |
| `J:J` | Cell value `=TRUE` | strikethrough |

### Net Worth

| Range | Rule | Color |
|-------|------|-------|
| `E:E` | Cell value `> 0` | text `#10B981` |
| `E:E` | Cell value `< 0` | text `#EF4444` |

### Accounts

| Range | Rule | Color |
|-------|------|-------|
| `B:B` | Text equals `Credit Card` | bg `#FEE2E2` |
| `B:B` | Text equals `Investment` | bg `#DBEAFE` |
| `E:E` | Custom formula `=TODAY()-E2>30` | bg `#FEF3C7` |

---

## Step 5 — Build the dashboard charts (2 min)

### Chart 1: Net Worth trend (line)

1. Select range `📈 Net Worth!A1:B14`
2. **Insert → Chart**
3. Chart type: **Smooth line chart**
4. Series color: `#3B82F6`
5. Title: **Net Worth (last 12 months)**
6. Cut the chart, paste into 📊 Dashboard around row 3 col E

### Chart 2: Top categories (pie)

1. Select range `📊 Dashboard!A11:A20` and `C11:C20`
2. **Insert → Chart**
3. Chart type: **Pie chart** (or **Doughnut chart**)
4. Title: **Top spending categories**
5. Position around row 17 col A

### Chart 3: Cash flow (stacked bar)

1. On a hidden helper area of Reports, build the 6-month sums table (see `formulas-reference.md` formula 39)
2. Select the helper range
3. **Insert → Chart** → **Stacked column chart**
4. Income series color: `#10B981`, Expense series color: `#EF4444`
5. Title: **Cash flow (6 months)**
6. Position around row 23 col A

---

## Step 6 — Set up the month picker (1 min)

1. Click 📊 Dashboard tab
2. Click cell **G1**
3. **Data → Data validation**
4. Criteria: **Date** → **Is valid date**
5. Default value: type today's date

---

## Step 7 — Protect the formulas (optional but recommended)

1. **Data → Protect sheets and ranges**
2. Protect the **📖 Tutorial** sheet (entire sheet, except yourself)
3. Protect the **📄 Reports** sheet (entire sheet)
4. On other sheets, protect just **row 1** (the header)

This prevents you from accidentally typing over a formula.

---

## Step 8 — Make it yours (5 min cleanup)

When you're ready to use your own data:

1. **🏦 Accounts** — replace sample accounts with yours, update balances
2. **🗂️ Categories** — keep, rename, or delete categories
3. **🎯 Goals** — replace the 6 sample goals with 1–3 of your own
4. **💸 Debt Payoff** — list your actual debts (or leave blank)
5. **🔁 Subscriptions** — list your real subscriptions
6. **💳 Transactions** — delete all sample rows and start fresh, OR keep them for now to see the dashboard work and delete later

> The dashboard, budget, annual, and reports sheets are 100% formula-driven — they'll repopulate the moment you put in your own data.

---

## Importing your bank transactions

Most banks let you export a CSV of transactions:

1. In your bank's web UI, go to **Statements** or **Activity**
2. Download a date range as CSV
3. Open the CSV, copy the rows you want
4. Paste into 💳 Transactions (start at the first empty row)
5. Map columns: date → A, description → C, amount → E
6. Set the **Account** (B), **Type** (D), and **Category** (G) for each row (dropdowns help)
7. The **Auto-cat** (K) column will suggest categories based on the rules in 🗂️ Categories

---

## Excel / Numbers users

The CSVs work in any spreadsheet app. Differences to note:

| Feature | Google Sheets | Excel | Numbers |
|---------|--------------|-------|---------|
| Sparkline | `=SPARKLINE(...)` | Insert → Sparkline | Insert → Chart |
| QUERY | works | not available — use Pivot tables instead | use Pivot tables |
| Checkboxes | Insert → Checkbox | Form Controls → Checkbox | Insert → Checkbox |
| Emoji tab names | works | works (Office 365+) | works |

If you're an Excel user, the **Reports** sheet's top-5 lists need to be rebuilt as Pivot tables. Everything else works as-is.

---

## Mobile app

The Google Sheets mobile app shows all 12 sheets in the tab order set above. The order is intentional: most-used left (Dashboard, Transactions, Goals).

On mobile:
- Adding a transaction takes ~15 seconds
- The dashboard scrolls cleanly
- Conditional formatting renders correctly

---

## You're done

Open the **📊 Dashboard** tab. You should see:

- Current month income, expenses, net, savings rate
- Budget status bars per category
- Net worth chart
- Goal progress
- Top categories pie chart

Next: see `tutorial.md` for the first-month walkthrough.

If you hit a snag, check `formulas-reference.md` → **Common Pitfalls** at the bottom.
