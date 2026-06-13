# Budget Pro 2026 — Quick Setup Guide

## What You'll Need
- A Google account
- 2 minutes of time

## Step 1: Create a Blank Google Sheet
1. Go to [sheets.new](https://sheets.new) or open Google Sheets and click **Blank spreadsheet**
2. Name it something like "Budget Pro 2026" (or any name you prefer)

## Step 2: Open the Script Editor
1. In your new sheet, go to **Extensions > Apps Script**
2. A new tab opens with the Apps Script editor
3. You'll see a default `myFunction()` — select all and delete it

## Step 3: Paste the Script
1. Copy the entire script code (provided with your purchase)
2. Paste it into the Apps Script editor, replacing any existing content
3. Click the **Save** icon (or press Ctrl+S)
4. If prompted, name the project "Budget Pro 2026" and click **OK**

## Step 4: Run the Build
1. In the Apps Script editor, find the **function dropdown** (next to the Run button)
2. Select `buildBudgetPro2026` from the dropdown
3. Click the **Run** button (▶️)
4. Authorize the script when prompted:
   - Click **Review Permissions**
   - Select your Google account
   - Click **Advanced** (if you see a warning)
   - Click **Go to Budget Pro 2026 (unsafe)**
   - Click **Allow**

## Step 5: Wait for Completion
- The script takes 30-60 seconds to build all 8 tabs
- You'll see "Budget Pro 2026" appear as the sheet name when done
- **Do not close the tab or navigate away** while the script is running

## What You'll Get
The script creates 8 tabs:
1. **Start Here** — Overview and instructions
2. **Scenario Engine** — Your inputs (9 green cells)
3. **Budget Tracker** — Monthly budget with income/expenses
4. **Goals** — Savings goals with progress tracking
5. **Debt Payoff** — Your debts with snowball vs avalanche comparison
6. **Instructions** — Detailed guide for each tab
7. **Spendable** — What's left after bills
8. **Engine** — Auto-calculated results (don't edit directly)

## Troubleshooting

### "Authorization Required" Error
- The script needs permission to modify your spreadsheet
- Follow the authorization steps in Step 4 above

### Script Times Out
- If the script takes longer than 6 minutes, try refreshing the page and running again
- Make sure you're not editing the sheet while the script runs

### Tabs Don't Appear
- Make sure you selected `buildBudgetPro2026` from the function dropdown
- Check that the entire script was pasted (no truncation)
- Try running again — sometimes Google's servers need a moment

### "Sheet name already exists" Error
- This is normal — the script handles this automatically
- If it persists, refresh the page and run again

## Need Help?
Contact support at [your email] with:
- A screenshot of any error message
- The Google Sheet URL
- Description of what happened

---

**Pro Tip:** After setup, bookmark your Google Sheet for quick access. The Scenario Engine tab is where you'll spend most of your time — enter your income, expenses, and extra payments there, and watch all other tabs update automatically.
