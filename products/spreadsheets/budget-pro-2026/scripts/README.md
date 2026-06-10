# Budget Pro 2026 — Build Guide

## How to Build the Spreadsheet

### Step 1: Create a Google Sheet
1. Go to [sheets.google.com](https://sheets.google.com)
2. Click **+ Blank** to create a new spreadsheet
3. Name it "Budget Pro 2026"

### Step 2: Open Apps Script
1. In your new spreadsheet, go to **Extensions → Apps Script**
2. Delete any existing code in the editor
3. Copy the entire contents of `scripts/build-engine.gs`
4. Paste it into the Apps Script editor
5. Click the **Save** button (💾)

### Step 3: Run the Script
1. Click the **Run** button (▶️) next to `buildBudgetPro2026`
2. Authorize when prompted (Google will ask for permissions)
3. Wait 10-30 seconds for the script to complete
4. Check the Execution log for "Budget Pro 2026 built successfully!"

### Step 4: Verify the Build
1. Check that 7 tabs exist: Scenario Engine, Goals, Spendable, Budget Tracker, Debt Payoff, Instructions, Engine
2. The "Engine" tab should be hidden (right-click → See all sheets to find it)
3. Enter test values in the Scenario Engine green cells
4. Verify results calculate correctly

### Step 5: Apply Final Protection
1. Go to **Data → Protected sheets and ranges**
2. Add protection for each formula area (see build-spec-lean.md Section 4)
3. The Engine tab is already hidden and protected by the script

## What the Script Creates

| Tab | Formulas | Features |
|-----|----------|----------|
| Scenario Engine | 15+ formulas | 9 inputs, 3 results, comparison table, sensitivity table, cross-tab validation |
| Goals | 10+ formulas | Savings goals with target amounts, deadlines, progress tracking |
| Spendable | 8+ formulas | Daily/weekly spending budget, remaining balance, category limits |
| Budget Tracker | 48+ formulas | 3 income + 8 expense categories, 12 months, totals, savings rate |
| Debt Payoff | 10+ formulas | 4 debt slots, snowball vs avalanche, payoff timeline |
| Instructions | 0 formulas | Quick start, tab guides, FAQ, NPER/EDATE docs |
| Engine (hidden) | 58+ formulas | All NPER/EDATE calculations, comparison logic, sensitivity |

## Sample Data Pre-filled

The script includes realistic sample data:
- **Scenario Engine:** $6,200 income, $3,200 expenses, $8,200 savings, 7.57% APR, $28,200 debt, $590 payment
- **Goals:** Emergency Fund ($5,000 target, $1,750 saved), Vacation ($2,000 target, $600 saved), Car Down Payment ($8,000 target, $2,400 saved), New Laptop ($1,500 target, $450 saved), Wedding ($15,000 target, $3,000 saved)
- **Spendable:** Weekly budget calculated as (income - expenses - debt payment) × 12 ÷ 52; daily budget is the weekly amount ÷ 7
- **Budget Tracker:** 3 months of income/expense data
- **Debt Payoff:** Chase Visa, Car Loan, Student Loan, Medical Bill

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Authorization required" | Click Review permissions → Allow |
| "Script not found" | Make sure you pasted the entire script |
| Formulas show errors | Check that all 7 tabs were created |
| Engine tab visible | Right-click tab → Hide sheet |
