# Budget Pro 2026 — Google Sheets Manual Assembly

This guide walks you through turning the 12 CSVs in `csv-templates/` into a
single, polished Google Sheets workbook that you can sell on Etsy, Gumroad,
or Creative Market.

**Time:** 15-20 minutes for the import + tab setup, 1-2 hours for the polish
(conditional formatting, charts, dark-mode palette).

If you have PowerShell and the ImportExcel module, the faster path is
`./assemble.ps1` (2 min) which produces an `.xlsx` you can upload to Drive.

---

## Step 1 — Create the workbook

1. Go to https://sheets.new — a new Google Sheet opens.
2. Rename it `Budget Pro 2026 — Personal Finance Command Center`.
3. The first tab defaults to "Sheet1". Rename it to `Dashboard` (we'll overwrite
   its content in Step 3).

## Step 2 — Create 12 tabs in the correct order

Right-click any tab → **+ Insert 1 more sheet**. Repeat until you have 12.
Rename them in this exact order (the order is documented in `../sheet-architecture.md`
and matters for the SUMIFS, VLOOKUP, and INDEX/MATCH references that span
tabs):

1. Dashboard
2. Transactions
3. Budget vs Actual
4. Categories
5. Accounts
6. Goals
7. Debt Payoff
8. Net Worth
9. Subscriptions
10. Annual
11. Reports
12. Tutorial

You can drag tabs to reorder them.

## Step 3 — Import each CSV into the matching tab

For each tab (in order):

1. Click the tab to make it active.
2. **File → Import → Upload** → drag the corresponding CSV from
   `csv-templates/` (or click *Select a file from your device*).
3. Import location: **Replace current sheet**.
4. Separator type: **Comma**.
5. Click **Import data**.

Import in this order (skip the Dashboard tab — we replace it last with a
formula-driven version):

| Tab | CSV file | Approx rows |
|---|---|---|
| Transactions | `02-transactions.csv` | 60+ (3 months sample data) |
| Budget vs Actual | `03-budget-vs-actual.csv` | 12 (one per month) |
| Categories | `04-categories.csv` | 20+ |
| Accounts | `05-accounts.csv` | 6-8 |
| Goals | `06-goals.csv` | 5 |
| Debt Payoff | `07-debt-payoff.csv` | 3-5 debts |
| Net Worth | `08-net-worth.csv` | 12+ months |
| Subscriptions | `09-subscriptions.csv` | 8-12 |
| Annual | `10-annual.csv` | 12+ recurring items |
| Reports | `11-reports.csv` | 0 (blank, formula-driven) |
| Tutorial | `12-tutorial.csv` | 0 (blank, instructions go here) |

## Step 4 — Set up the Dashboard tab

The Dashboard tab is a rollup of the other tabs. It should NOT have a CSV
import — it has formulas only. Set it up like this:

1. Click the **Dashboard** tab.
2. In cell A1, type `Budget Pro 2026`. Format as title (48pt, bold).
3. In cell A2, type `Last updated:` and in B2 enter `=TODAY()`.
4. Build the 6 KPI cards by following `../dashboards-design.md` Section 1:
   - A4: `Total Income (MTD)` → `=SUMIFS(Transactions!E:E, Transactions!C:C, ">0", Transactions!A:A, ">="&EOMONTH(TODAY(),-1)+1, Transactions!A:A, "<="&EOMONTH(TODAY(),0))`
   - A8: `Total Spend (MTD)`
   - A12: `Net (MTD)`
   - A16: `Total Net Worth`
   - A20: `Active Goals`
   - A24: `Debt Remaining`
5. Insert the 6 charts from `../dashboards-design.md` Section 2:
   - Category Spend pie → data from `Transactions`
   - Income vs Expense bars → from `Transactions`
   - Net Worth line → from `Net Worth`
   - Goal Progress bars → from `Goals`
   - Debt Payoff line → from `Debt Payoff`
   - 12-Month Cash Flow area → from `Reports`

## Step 5 — Apply conditional formatting

Open `../dashboards-design.md` Section 3. For each rule listed:

1. Select the target range.
2. **Format → Conditional formatting**.
3. Add a rule with the color, icon, or bar shown in the spec.
4. Repeat for all 18 rules.

The highest-impact rules are:
- **Budget vs Actual**: red bar over budget, green bar under budget
- **Transactions**: gray-out Transfers (so they don't inflate income/expense)
- **Net Worth**: red if any row has a negative value
- **Goals**: green fill when Current ≥ Target

## Step 6 — Apply the dark-mode palette

The palette is defined in `../data-vocabulary.md` Section 2. To apply:

1. **View → Theme → Custom** to set a workbook-wide accent color.
2. For tab colors, right-click each tab → **Change color** → use the
   semantic colors from data-vocabulary.md (revenue = green, expense = red,
   neutral = gray, etc.).
3. For tab text on dark backgrounds, the palette gives you foreground/background
   pairs in the "Dark mode" section.

## Step 7 — Apply the mobile-friendly tab order

The 12 tabs should be in the order listed in Step 2. This order puts the
high-frequency tabs (Dashboard, Transactions, Budget vs Actual) at the front
so they appear in the bottom navigation bar of the Sheets mobile app without
scrolling.

To enforce this, drag any out-of-order tab to its correct position.

## Step 8 — Validate the workbook

1. Change a value in `Transactions` (e.g. flip the amount of one row to -50).
2. Switch to `Dashboard`. The MTD spend KPI should update within a second.
3. Switch to `Budget vs Actual`. The corresponding month row should update.
4. Switch to `Reports`. The cash-flow row should update.
5. Revert the test value.

If any KPI does not update, the formula reference is wrong. Check the
`..\formulas-reference.md` Section "Cross-tab references" for the canonical
syntax.

## Step 9 — Lock the structure (optional but recommended for the buyer)

1. Right-click the `Tutorial` tab → **Protect sheet** → add a note like
   "This tab contains setup instructions — please do not edit".
2. **Data → Protected sheets and ranges** → protect cell ranges in `Categories`
   that buyers should not edit (e.g. the category-type column).

Do not add a hard password — buyers will want to customize. Use a warning
instead of a block.

## Step 10 — Make a copy for delivery

1. **File → Make a copy** with the name `Budget Pro 2026 — Buyer Copy`.
2. **Share → Anyone with the link can view**.
3. Copy the link — this is what buyers get. They will click **File → Make a
   copy** to get their own editable version.

## Step 11 — Package for sale

Zip the workbook with the supplementary files:

```
Budget-Pro-2026-v1.zip
├── Budget Pro 2026 — Buyer Copy.gsheet
├── setup-guide.pdf   (export from setup-guide.md)
├── cover.png         (from cover-prompt.md)
├── mockup-dashboard.png
├── mockup-networth.png
├── mockup-goals.png
└── README.txt        (one-paragraph: "Open the .gsheet, make a copy, follow the Tutorial tab")
```

Upload `Budget-Pro-2026-v1.zip` to Gumroad / Etsy / Creative Market.

## Step 12 — Update the listing

In your marketplace dashboard:

- **Title** (from `../listing/title.md`)
- **Description** (from `../listing/description.md`)
- **Tags / keywords** (from `../listing/tags.md` — strip the keyword-stuffing
  block at the bottom, keep the first 13)
- **Cover image** = `cover.png`
- **Preview images** (up to 10): the 3 mockup PNGs + 3 charts from the Dashboard
  tab (screenshot them) + the 12-tab overview screenshot
