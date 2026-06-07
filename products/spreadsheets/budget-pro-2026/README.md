# Budget Pro 2026 — Personal Finance Command Center

**A Google Sheets system that shows you exactly where your money went, where it's going, and how to hit your goals.**

- **Slug:** `spreadsheets/budget-pro-2026`
- **Price:** $19
- **Status:** Built — ready to list
- **Format:** Google Sheets (also opens in Excel & Numbers)
- **Sheets:** 12 interconnected
- **Sample data:** 3 months pre-populated so it looks alive on first open

---

## Who This Is For

The 25–40 year old who:

- Tried Mint (now dead), YNAB ($14.99/mo forever), or Rocket Money and bounced
- Wants **ownership** — no app holding your data hostage, no subscription, your file forever
- Is past the "I need an app to nudge me" stage and is ready to **see the numbers**
- Has at least one of: debt to pay down, a savings goal that keeps slipping, or a "where did my money go this month" problem
- Knows enough Sheets to type in a cell — that's literally the only prerequisite

This is **not** for someone who wants a passive auto-import experience. This is for someone who wants to look their money in the eye.

---

## The Pain → The Promise

| Pain | Promise |
|------|---------|
| "I have no idea where my money went" | **Transactions** + **Categories** sheets auto-roll into a category breakdown the moment you paste a bank export |
| "I never stick to a budget" | **Budget vs Actual** shows green/amber/red the second you go over — no end-of-month surprise |
| "My savings goals never move" | **Goals** sheet shows you a progress bar per goal and a forecasted hit date based on current pace |
| "Debt feels endless" | **Debt Payoff** sheet models snowball vs avalanche side-by-side and shows the exact payoff month |
| "I don't know if I'm getting richer" | **Net Worth** sheet plots a monthly line — the most addictive chart in the file |
| "Subscriptions are bleeding me" | **Subscriptions** sheet sums annualized cost and flags ones you haven't used |

---

## The 12 Sheets

The order matters — it's the workflow:

```
You enter data here          Dashboard reads from these
        ↓                              ↓
┌─────────────────┐         ┌──────────────────────┐
│  TRANSACTIONS   │ ──────▶ │      DASHBOARD       │
│  ACCOUNTS       │ ──────▶ │   (single source of  │
│  CATEGORIES     │ ──────▶ │       truth)         │
│  GOALS          │ ──────▶ │                      │
│  DEBT PAYOFF    │ ──────▶ │                      │
│  SUBSCRIPTIONS  │ ──────▶ │                      │
└─────────────────┘         └──────────────────────┘
        ↓                              ↓
┌─────────────────┐         ┌──────────────────────┐
│ BUDGET VS ACTUAL│ ◀────── │   monthly snapshots  │
│   NET WORTH     │ ◀────── │   feed:              │
│    ANNUAL       │ ◀────── │   - REPORTS          │
└─────────────────┘         │   - ANNUAL view      │
                            └──────────────────────┘
```

### 1. Dashboard
Single screen overview — current month income, expenses, savings rate, top 5 categories, budget status per category, net worth trend, goal progress. Refreshes the moment you add a transaction.

### 2. Transactions
The single source of truth. Every income/expense entry. Date, account, payee, category, amount, notes, cleared status. Designed for 5,000+ rows. You paste your bank export here.

### 3. Budget vs Actual
For each category, your planned monthly budget vs what you actually spent. Green if under, amber at 80%+, red over. Variance column shows $ and % over/under.

### 4. Categories
Master list of income + expense categories with auto-categorization rules (matches keywords in the payee/memo field).

### 5. Accounts
Every account: checking, savings, credit, investment, loan. Type, balance, last-updated date, owner (you/joint/partner). Feeds net worth.

### 6. Goals
Each goal: name, target $, current $, target date, monthly contribution needed, projected hit date, progress %. Live progress bars.

### 7. Debt Payoff
For each debt: balance, APR, minimum, your extra payment. Snowball (smallest first) vs avalanche (highest APR first) comparison. Total interest saved.

### 8. Net Worth
Monthly snapshot: assets, liabilities, net worth. Line chart that becomes addictive.

### 9. Subscriptions
Every recurring charge. Monthly cost, annualized cost, category, last used, cancel checkbox. Flags subscriptions you haven't used in 60+ days.

### 10. Annual
Year-at-a-glance: 12 months in columns, categories in rows. Tax-relevant categories highlighted. Big-expense ledger (cars, vacations, medical).

### 11. Reports
Auto-generated month-end summary you can screenshot or print. Income vs expenses, savings rate, top wins, top leaks, goal updates.

### 12. Tutorial
Sample data + step-by-step walkthrough. Where to click, what to type, what to delete when you're ready to start with your own data.

---

## The Workflow

**Day 1 (15 min):**
1. Copy your bank balances into **Accounts**
2. Skim **Categories** — keep the defaults or rename
3. Set 1–3 **Goals** (don't overdo it)
4. List your **Subscriptions** + your **Debts**

**Every week (5 min):**
1. Paste new transactions into **Transactions** (or type them)
2. Glance at **Dashboard** — anything red?

**Month-end (10 min):**
1. Update **Accounts** balances (snapshot day)
2. Look at **Reports** sheet
3. Adjust budget for next month in **Budget vs Actual**

That's it. No daily nag, no app to open, no subscription.

---

## What Makes This $19 Instead Of Free

- **12 interconnected sheets**, not 12 isolated tabs — change a category once, every sheet updates
- **3 months of realistic sample data** — opens looking like a finished file, not an empty template
- **Conditional formatting on 22 fields** — visual feedback at a glance, not just numbers
- **4 chart types** ready to drop in (line, pie, stacked bar, sparkline)
- **Snowball vs avalanche calculator** that's actually correct (most free ones aren't)
- **Net worth chart** designed to be screenshot-worthy
- **Light and dark mode color schemes** included
- **Mobile-friendly tab order** so the Google Sheets app doesn't feel cramped
- **Setup guide + tutorial** that doesn't assume you're a spreadsheet wizard
- **Tag/tax-export ready** — annual sheet pivots to tax categories with one filter

---

## Files in This Folder

```
budget-pro-2026/
├── README.md                  ← you are here
├── metadata.json              ← product metadata
├── sheet-architecture.md      ← every sheet's columns, formulas, formatting
├── formulas-reference.md      ← every formula explained
├── setup-guide.md             ← import CSVs → first dashboard
├── tutorial.md                ← first-month walkthrough
├── goals-tracker.md           ← deep dive on the goals system
├── dashboards-design.md       ← visual spec of the dashboard sheet
├── cover-prompt.md            ← AI prompt for marketplace cover
├── mockup-prompts.md          ← 5 AI prompts for product mockups
├── csv-templates/             ← 12 CSV files, one per sheet, pre-filled
│   ├── 01-dashboard.csv
│   ├── 02-transactions.csv
│   ├── 03-budget-vs-actual.csv
│   ├── 04-categories.csv
│   ├── 05-accounts.csv
│   ├── 06-goals.csv
│   ├── 07-debt-payoff.csv
│   ├── 08-net-worth.csv
│   ├── 09-subscriptions.csv
│   ├── 10-annual.csv
│   ├── 11-reports.csv
│   └── 12-tutorial.csv
└── listing/
    ├── title.md               ← Etsy/marketplace title
    ├── description.md         ← full listing description
    └── tags.md                ← 13 keyword tags
```

---

## Self-Promotion Angle

Buyers will post:

- **Net worth charts** — "6 months of using Budget Pro 2026" — line goes up
- **"Paid off $X" screenshots** — Debt Payoff sheet with a victory line through a debt
- **Savings milestone screenshots** — Goals sheet with a goal at 100%
- **"Where my money goes" pie charts** — Dashboard category breakdown
- **End-of-year wrap** — Annual sheet, perfect for a December LinkedIn humble-brag

Each one is a free ad. The chart is the marketing.

---

## Compatibility

- **Primary:** Google Sheets (free Google account)
- **Works in:** Microsoft Excel (Office 365 / 2021+), Apple Numbers, LibreOffice Calc
- **Mobile:** Google Sheets app on iOS / Android (tab order optimized for it)

---

## Support

- 30-day refund if it doesn't fit your life
- Free updates for 12 months
- Email-based support, 48h response

---

**Built for people who are ready to actually look.**
