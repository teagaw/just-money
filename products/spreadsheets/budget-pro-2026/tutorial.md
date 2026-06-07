# Tutorial — Your First Month With Budget Pro 2026

A walkthrough. Sample data → real data → first dashboard you took a screenshot of.

---

## Before You Start

You've already:
- [x] Imported the 12 CSVs (see `setup-guide.md`)
- [x] Set up dropdowns + conditional formatting
- [x] Built the 3 dashboard charts

The file opens to **📊 Dashboard**. The dashboard is full of sample data (Sarah's March–May 2026 numbers). That's intentional — it shows you what "alive" looks like.

We're going to:

1. Look at Sarah's data (5 min)
2. Replace it with yours (15 min)
3. Enter one week of real transactions (10 min)
4. Watch your dashboard come alive

Total: ~30 min the first time. **5 min/week** after that.

---

## Step 1 — Tour the sample data (5 min)

### Open 💳 Transactions

You'll see ~90 rows across 3 months. Notice:

- **Column D (Type)** is color-coded — green Income, red Expense, gray Transfer
- **Column G (Category)** is filled from a dropdown
- **Column K (Auto-cat)** shows a suggestion that matched a keyword in the payee

Click on row 5. Look at the formula in column F:

```
=IF(D5="Income", ABS(E5), IF(D5="Expense", -ABS(E5), 0))
```

That's the helper that lets you type a positive number for everything but the sheet remembers the sign. **You never have to type a negative.**

### Open 📊 Dashboard

The month picker (`G1`) is set to May 2026. Try changing it to **April 2026**.

Every number on the dashboard updates instantly. Income, expenses, top categories, budget bars — all recalculated for April.

Change it back to **May 2026**.

Notice the **Food** row in the budget table:
- Budget: $600
- Spent: $712
- Remaining: -$112 (red)
- 119% (red, bold)
- Bar: ████████████ (capped at 12 chars but full)
- Flag: ⚠

That's what going over budget looks like. The dashboard told you the moment it happened, not at the end of the month.

### Open 🎯 Goals

Five sample goals. Look at **Emergency Fund**:
- Target $10,000
- Current $4,800 (auto-synced from the **Emergency Fund** account)
- 48% progress (blue, halfway feel)
- Bar: █████░░░░░
- Monthly need: $X (calculated from today → target date)
- Status: 🎯 On track

Look at **Vacation Italy 2027** — it's behind because the current pace is slower than what's needed. Status reads ⚠ Behind.

This is the system. It tells you the truth without nagging.

### Open 📈 Net Worth

12 months of snapshots. The line should slope up. The sparkline next to each row shows the trend up to that row.

### Open 🔁 Subscriptions

10 sample subscriptions. Notice:
- **Audible** has bg `#FEF3C7` (warning) on column I because `Used in last 30d?` = FALSE
- The cancel checkbox (J) for Audible is unchecked
- If you check J, the row gets a strikethrough — visually showing it's gone

Sum at the bottom: ~$2,200/year if you keep all of them. The "if all cancelled" column tells you how much you'd save.

### Open 💸 Debt Payoff

Three sample debts: Visa, Amex, Student Loan.

Look at the summary box (top right):
- Snowball total months: X
- Avalanche total months: X
- Avalanche saves: $X in interest

For most people, **avalanche** saves money. But snowball wins motivation. The sheet shows both so you can choose.

---

## Step 2 — Replace Sarah's data with yours (15 min)

> **Before** you delete anything, take a screenshot of the dashboard. It's your "before" picture for when you want to see how far you've come.

### Replace accounts

1. Open 🏦 **Accounts**
2. For each row, change:
   - Column A: your account name (e.g. "Chase Checking")
   - Column C: your institution
   - Column D: today's balance (positive even for credit cards — the sheet handles the sign)
   - Column E: today's date
   - Column G: APR (for credit cards & loans only)
   - Column H: minimum payment (for credit cards & loans only)
3. Delete rows you don't have. Add rows for any extra accounts.

> **Tip:** name accounts the way your brain calls them, not your bank ("Chase Checking" not "Chase Total Checking 6712"). Less typing every week.

### Replace categories (optional)

The 25 default categories cover 90% of people. Only edit if:
- You want to merge two (e.g. combine "Personal" and "Misc")
- You want to add a niche one (e.g. "Kids", "Pets")

> **Don't** delete the default categories until you've replaced every Transaction that uses them. Otherwise dashboard rows get orphaned.

### Replace goals

1. Open 🎯 **Goals**
2. Delete all 5 sample goals
3. Add 1–3 of your own. **Three max.** More than 3 = none.

Each goal needs:
- A name you'd actually say out loud ("Quit job runway" not "Goal 1")
- A target $
- A current $ (or link to an account and check auto-sync)
- A target date (be honest — "someday" doesn't count)
- A current monthly pace (what you actually save right now, not what you wish)

### Replace debts

1. Open 💸 **Debt Payoff**
2. Delete sample debts you don't have
3. Add your actual ones
4. **Extra payment column (E):** set this to what you can realistically add each month, even if it's $25

### Replace subscriptions

1. Open 🔁 **Subscriptions**
2. Go through your bank statement of the last 30 days
3. Every recurring charge gets a row
4. Set "Last used" honestly — if you can't remember the last time, set it to 90 days ago

> **Quick wins:** there are usually 1–3 subscriptions you forgot about. Find them now.

### Delete sample transactions

1. Open 💳 **Transactions**
2. Select rows 2–91 (all sample data)
3. Right-click → **Delete rows**
4. Header row stays

The dashboard will go blank. Don't panic — you're about to fill it.

---

## Step 3 — Enter your last 7 days of transactions (10 min)

The fastest way to feel the system click: enter **one real week**.

1. Open your bank app or website
2. Look at the last 7 days
3. For each transaction:
   - Date (A)
   - Account (B) — pick from dropdown
   - Payee (C) — type the merchant
   - Type (D) — Income or Expense or Transfer
   - Amount (E) — always positive
   - Category (G) — pick from dropdown (or wait for the auto-cat suggestion in K and copy it over)
   - Notes (I) — optional

Don't worry about being perfect. The dashboard updates as you type.

> **Pro move:** for credit card transactions, type the **purchase** as an Expense from the credit card account. When you pay the card down, that's a **Transfer** from checking to credit card. Don't double-count.

---

## Step 4 — Watch the dashboard come alive (1 min)

1. Open 📊 **Dashboard**
2. Set `G1` to **the current month**
3. See:
   - Real income (probably partial since the month isn't over)
   - Real expenses
   - Real net
   - Real savings rate
   - Budget bars per category — most will be in green this early in the month

**Take a second screenshot.** This is your "starting line" picture.

---

## Step 5 — The weekly habit (5 min/week)

Every Sunday (or whatever day you pick):

1. Open 💳 **Transactions**
2. Paste this week's bank transactions (or type them)
3. Open 📊 **Dashboard** — glance at the budget bars
4. If anything is red or amber, make a mental note for next week

That's it. No daily check-in. No nagging app.

---

## Step 6 — The monthly habit (10 min)

On the 1st of the next month:

1. Open 🏦 **Accounts** — update every balance, update `Last updated`
2. Open 📈 **Net Worth** — add a new row for the previous month with the totals
3. Open 📄 **Reports** — set the report month to the month that just ended
4. Screenshot the report. Save it.
5. Open 💰 **Budget vs Actual** — set next month's budgets based on what you learned

---

## Step 7 — Year-end (30 min)

In late December:

1. Open 📅 **Annual** — look at the full year
2. Filter by `Tax-relevant = TRUE` for tax prep
3. Look at the big-expense ledger
4. Set next year's goals on 🎯 **Goals**
5. Reset 💰 **Budget vs Actual** for the new year (overwrite the Budget columns; Actual will recalc from new transactions)
6. Archive the year: **File → Make a copy** named **Budget Pro 2026 ARCHIVE**, then clear Transactions for the new year

---

## Common First-Week Questions

### "I have transactions in two accounts — how do I avoid double-counting?"

Use **Type: Transfer**. The dashboard ignores transfers in the income/expense totals. They show up in the transaction log so you have history, but they don't count as income or expense.

### "I paid for a friend's dinner and they paid me back — what type?"

If it nets to zero in the same month, easiest is to skip both rows. If you want the record, enter the original expense as Expense, and the reimbursement as Income with category "Reimbursement" (add it to Categories if you want).

### "I bought something with savings — does it go through?"

Yes. Transfer the money from Savings → Checking (Transfer), then enter the purchase as Expense from Checking. Two rows.

### "My paycheck is split between checking and savings — one row or two?"

Two rows: Income from "Payroll" to Checking for the checking portion, and Income from "Payroll" to Savings for the savings portion. The full paycheck shows as Income on the dashboard.

### "I forgot to enter transactions for 3 weeks"

Open your bank, sort by date, copy-paste a batch into Transactions. Set the dates as they actually happened. The dashboard catches up the moment you paste.

### "Can I share this with my partner?"

Yes — **File → Share** → enter their email. The 🏦 Accounts sheet has an **Owner** column (Me/Partner/Joint) so you can split things if needed.

---

## Bad-Day Reminder

The first month you actually look at your money will probably feel uncomfortable. That's the point.

By month 3 you'll have:
- A clear picture of where money goes
- A working budget (not a wished-for one)
- Real goal progress
- A net worth chart that slopes up

The dashboard is the proof.

Welcome.
