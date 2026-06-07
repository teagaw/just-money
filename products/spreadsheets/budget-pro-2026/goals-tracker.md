# Goals Tracker — Deep Dive

The 🎯 Goals sheet is the most-screenshotted page in the file. This document explains how it works and how to design goals that actually move.

---

## What a Goal Is

A goal in Budget Pro 2026 has four parts:

1. **A target $** — how much money is needed (or for a Debt goal, $0 = paid off)
2. **A current $** — where you are right now (manual or auto-synced from an account)
3. **A target date** — when you want to be done
4. **A current monthly pace** — what you're actually contributing per month

Everything else is computed.

---

## The Four Goal Types

### 1. Savings (target $X by date Y)

The classic. Examples:
- Emergency fund: $10,000 by Dec 2026
- Down payment: $40,000 by 2028
- Quit-job runway: $30,000 by Dec 2027

Set `Type = Savings`. Link to a real Savings account so the current balance auto-updates.

### 2. Debt (target $0 by date Y)

A debt is just a savings goal in reverse. Target = $0. Current = the debt balance. As the balance comes down, progress goes up.

Set `Type = Debt`. Link to the Credit Card or Loan account.

> The Goals sheet calculates progress as `(Original balance - Current balance) / Original balance`. You'll need to manually enter the **original** balance the first time so progress shows correctly. Update the goal's target to reflect the path-from-where-you-started.

### 3. Purchase (target $X by date Y)

A specific thing you're saving up for. Examples:
- Italy vacation: $4,500 by May 2027
- New laptop: $2,400 by Oct 2026
- Engagement ring: $X by Y

Set `Type = Purchase`. Don't link to a real account unless you have a dedicated fund.

### 4. Emergency (special: 3-6 months of expenses)

For your "what if I lose my job" fund. Calculated as a multiple of average monthly expenses, not a fixed dollar amount.

Set `Type = Emergency`. Manually compute target from your last 6 months of expense data (use the 📅 Annual sheet to find the average).

> **Rule of thumb:** 3 months for stable W-2 income + steady job market. 6 months for variable income, kids, or recession-y times.

---

## The Goal Status Algorithm

The `Status` column shows one of four icons:

```
✓ Complete       progress >= 100%
🎯 On track      projected hit date <= target date
⚠ Behind         projected hit date > target date
⏸ Stalled        monthly pace = 0
```

The status is calculated by formula 19 in `formulas-reference.md`:

```
=IF(H2>=1, "✓ Complete",
   IF(M2="—", "⏸ Stalled",
     IF(M2<=J2, "🎯 On track", "⚠ Behind")))
```

Conditional formatting paints them green / blue / red / gray.

---

## The Projection Math

This is the formula that does the work (`M2` — projected hit date):

```
=IF(L2<=0, "—",
   IF(G2>=C2, "✓",
     EDATE(TODAY(), CEILING((C2-G2)/L2, 1))))
```

In plain English: **"At your current monthly pace, you'll hit the target N months from today."**

- `C2 - G2` = how much $ left to save
- `(C2 - G2) / L2` = how many months at your current pace
- `CEILING(..., 1)` = round up to whole months
- `EDATE(TODAY(), ...)` = add that many months to today

If the projected date is **earlier** than your target date → 🎯 On track.
If it's **later** → ⚠ Behind. The sheet is telling you to either raise the pace or move the date.

---

## The Monthly Need

The `Monthly need` column tells you the contribution required to hit the goal **on time**, given today's date:

```
=IF(OR(J2<=TODAY(), C2<=G2), 0,
     (C2-G2)/MAX(1, DATEDIF(TODAY(), J2, "M")))
```

Compare this to your **Current pace** (column L). The gap is the gap.

Example:
- Vacation goal needs $310/month to hit on time
- You're paying $150/month
- The goal is on track to land 5 months late
- Solutions: pay $310/month, or move the date 5 months later, or accept the slip

The sheet doesn't moralize. It just shows you the math.

---

## Designing Good Goals

After 100+ people have used this template, the patterns are clear:

### Goals that work

- **Specific.** "Save $10,000 by Dec 2026" — yes. "Save more" — no.
- **Tied to a date.** Open-ended goals die.
- **Three at most.** More than 3 = none.
- **Visible.** This is why the sheet exists.

### Goals that fail

- "Be better with money" — not measurable
- "Save 20% of income" — no target $, no date
- 8 simultaneous goals — attention dies
- Goals without a monthly pace — `Stalled` from day one

---

## The Snowball Effect Inside Goals

A trick most spreadsheets don't show:

When a goal hits 100% → the money you were contributing to it can roll to the next goal. The sheet doesn't automate this (because it should be your decision), but here's the manual workflow:

1. Goal X hits ✓ Complete
2. You were paying $400/mo to Goal X
3. Open Goals → find Goal Y → increase its monthly pace by $400
4. Watch Goal Y's projected hit date jump forward
5. Status changes from ⚠ Behind to 🎯 On track

This is the same psychology that makes the debt snowball work.

---

## The "Auto-Sync" Checkbox

Column F on each goal row. If checked:

- The goal's `Current $` is pulled from the linked account's balance
- You don't have to type the current balance ever again
- The goal updates the moment you update the account

If unchecked, you type the current $ in column D manually.

**Recommended:**
- ✓ Auto-sync for Savings goals linked to a real account
- ✓ Auto-sync for Debt goals linked to the actual debt account
- ✗ Don't auto-sync for Purchase goals (you usually save toward them inside a general fund)
- ✗ Don't auto-sync for Emergency goals if you have multiple savings accounts contributing

---

## Sample Goal Walkthrough — "Pay Off Visa"

Let's design the Visa payoff goal that ships in the template:

| Field | Value |
|-------|-------|
| Goal | Pay off Visa |
| Type | Debt |
| Target $ | 0 |
| Current $ | 2,180 (the balance) |
| Linked account | Visa |
| Auto-sync | ✓ TRUE |
| Synced current | 2,180 (auto from Accounts.D) |
| Progress % | (Original 4,500 − 2,180) / 4,500 = **51.6%** |
| Target date | 2026-12-31 |
| Monthly need | (2,180) / 7 months ≈ **$311/mo** |
| Current pace | $350/mo (your actual extra payment) |
| Projected hit | EDATE(TODAY, CEILING(2180/350, 1)) ≈ **Nov 2026** |
| Status | 🎯 On track |

Now imagine you cut Netflix and Spotify, freeing $30/mo, and redirect it to Visa:
- Current pace: $380
- Projected hit: shifts to Oct 2026
- Status: still 🎯 On track, just earlier

That's the loop. Free up $30 → see the date move → motivated to find another $30.

---

## Pro Tips

### Use the sheet as a calendar
The `Projected hit` column shows you when each goal lands. Open the sheet at the start of each year — you'll know which months will feel like victories.

### Stagger the dates
If you have 3 goals all targeted Dec 2026 with combined monthly need of $X but your free cash is < $X, you'll fail all three. Pick which one matters most, push the others out.

### Celebrate completion
When a goal hits ✓ Complete, **don't** delete the row. Add a `Completed` checkbox column or move it to a "Done" section at the bottom. Looking at completed goals is fuel.

### Annual review
On Jan 1, audit goals. Some won't matter anymore. Delete them. Add new ones aligned with the new year.

### The "wish list" anti-pattern
Don't make goals out of vague wants. "Get fitter," "travel more," etc. — those aren't money goals. Money goals are line items with dollar amounts.

---

## When to Add a Goal

Add a goal when:
- You have a specific $ target in mind
- You have a date in mind
- You have at least some monthly capacity to fund it
- It would change your behavior to track it

Don't add a goal when:
- It's a maybe ("might want a boat someday")
- It overlaps another goal ("save for a house" + "save for a down payment")
- You can't think of $1 you'd contribute this month

---

## When to Remove a Goal

Remove (or archive) a goal when:
- It's complete
- It no longer matters (priorities shift — that's allowed)
- It's been stalled for 3+ months and the date keeps slipping with no plan to fix
- It's not honest anymore

---

## The Mental Model

The Goals sheet is a contract with your future self.

- The **target** is the destination.
- The **pace** is the speed.
- The **projected date** is what physics says will happen.

If the projected date doesn't match the target date, only three things can change: spend less, earn more, or move the date.

The sheet doesn't tell you which. It tells you the consequences of each.
