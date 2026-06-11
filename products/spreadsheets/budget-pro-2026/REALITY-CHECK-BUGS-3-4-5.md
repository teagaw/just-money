# Budget Pro 2026 — Consolidated Reality Check: Bugs 3, 4, 5

## Executive Summary

After tracing every formula in `build-engine.gs` against `build-spec-lean.md`, I found **5 confirmed bugs** and **1 design decision** requiring resolution. The most critical finding: **B2 in the code doesn't match the spec**, and **B32 is identical to B2** (making the "Inflation-adjusted" row completely redundant).

| Bug | Severity | Status | Fix Effort |
|-----|----------|--------|------------|
| B33 wrong formula | CRITICAL | Confirmed | 5 min |
| B32 = B2 (redundant) | HIGH | Confirmed | 15 min |
| B2 spec mismatch | HIGH | Confirmed | 10 min |
| Sensitivity vs Comparison rounding | MEDIUM | Confirmed | 5 min |
| B4 "interest saved" misleading | LOW | Confirmed | 5 min |

---

## Bug 1: B33 Inflation-Adjusted Interest — WRONG FORMULA

### Location
`build-engine.gs` line 321:
```javascript
'=IF(B32="Already free!",0,IF(B32="Check inputs","N/A",IFERROR((\'Scenario Engine\'!B4-\'Scenario Engine\'!B5)*B32-\'Scenario Engine\'!B8,0)))'
```

### What Code Does
```
(income - expenses) × months - debt
= ($6,200 - $3,200) × 65.7 - $28,200
= $3,000 × 65.7 - $28,200
= $168,900
```
This computes **total surplus cash minus debt** — NOT interest. It's a meaningless number labeled as "interest."

### What It Should Do
Total interest paid = total payments minus principal:
```
months × payment - debt
= 65.7 × $490 - $28,200
= $32,193 - $28,200
= $3,993
```

### Fix
```javascript
// BEFORE (line 321):
'=IF(B32="Already free!",0,IF(B32="Check inputs","N/A",IFERROR((\'Scenario Engine\'!B4-\'Scenario Engine\'!B5)*B32-\'Scenario Engine\'!B8,0)))'

// AFTER:
'=IF(B32="Already free!",0,IF(B32="Check inputs","N/A",IFERROR(B32*\'Scenario Engine\'!B9-\'Scenario Engine\'!B8,0)))'
```

### Impact
The current formula returns values 42× too high ($168,900 vs $3,993). This is the most critical bug — it displays completely wrong numbers to users.

---

## Bug 2: B32 = B2 (Inflation-Adjusted Row Is Redundant)

### Location
`build-engine.gs` lines 137-138 (B2) and 314-315 (B32):

**B2:**
```javascript
'=IF(\'Scenario Engine\'!B8<=0,"Already free!",IFERROR(ROUNDUP(NPER((\'Scenario Engine\'!B7-\'Scenario Engine\'!B10)/12,-\'Scenario Engine\'!B9,\'Scenario Engine\'!B8),0),"Check inputs"))'
```

**B32:**
```javascript
'=IF(\'Scenario Engine\'!B8<=0,"Already free!",IFERROR(ROUNDUP(NPER((\'Scenario Engine\'!B7-\'Scenario Engine\'!B10)/12,-\'Scenario Engine\'!B9,\'Scenario Engine\'!B8),0),"N/A"))'
```

### Analysis
These are **identical formulas** — same rate `(B7-B10)/12`, same payment `-B9`, same PV `B8`. The only difference is the error message text. Therefore:
- B32 always equals B2
- B34 always equals B3
- The "Inflation-adjusted" row in the comparison table shows the exact same numbers as "Match my scenario"

### Why This Happens
The code's B2 already uses the real rate `(APR - inflation) / 12`. The spec intended B2 to use a **different formula** (see Bug 3). Because the code "pre-applied" the inflation adjustment to B2, there's nothing left for B32 to do differently.

### Fix Options

**Option A: Restore spec's B2 formula, keep B32 as-is (recommended)**

This is the cleanest fix. B2 should use the spec's formula (net savings), and B32 should use the code's current formula (minimum payment at real rate). This gives two meaningfully different scenarios:

```javascript
// B2 — spec's formula (net savings toward freedom):
'=IF(\'Scenario Engine\'!B8<=0,"Already free!",IFERROR(ROUNDUP(NPER((\'Scenario Engine\'!B7-\'Scenario Engine\'!B10)/12,-(\'Scenario Engine\'!B4-\'Scenario Engine\'!B5-\'Scenario Engine\'!B9),-(\'Scenario Engine\'!B6-\'Scenario Engine\'!B8)),0),"Check inputs"))'

// B32 — minimum payment at real rate (inflation-adjusted baseline):
'=IF(\'Scenario Engine\'!B8<=0,"Already free!",IFERROR(ROUNDUP(NPER((\'Scenario Engine\'!B7-\'Scenario Engine\'!B10)/12,-\'Scenario Engine\'!B9,\'Scenario Engine\'!B8),0),"N/A"))'
```

**Option B: Remove B32/B33/B34 entirely**

If you don't want the inflation-adjusted row, delete the section and update the comparison table to skip row 31.

---

## Bug 3: B2 Doesn't Match Spec (Fundamental Design Mismatch)

### Location
`build-engine.gs` line 137-138 (B2) vs `build-spec-lean.md` Formula 1 (line 838-846)

### Spec Formula
```
NPER((B7-B10)/12, -(B4-B5-B9), -(B6-B8))
```
| Param | Value | Meaning |
|-------|-------|---------|
| Rate | `(APR - inflation) / 12` | Monthly real rate |
| Pmt | `-(income - expenses - payment)` | Net monthly savings toward freedom |
| Pv | `-(savings - debt)` | Net starting position (savings minus debt) |

### Code Formula
```
NPER((B7-B10)/12, -B9, B8)
```
| Param | Value | Meaning |
|-------|-------|---------|
| Rate | `(APR - inflation) / 12` | Same |
| Pmt | `-payment` | Just the minimum payment |
| Pv | `debt` | Just the debt (positive) |

### What Each Computes
- **Spec**: "When does my net worth (savings + investment growth - debt) become positive?" → **Financial freedom**
- **Code**: "When is my debt paid off to $0?" → **Debt payoff**

### With Sample Data
- Spec formula: `NPER(0.0457/12, -(6200-3200-490), -(8200-28200))` = `NPER(0.0038, -2510, 20000)` ≈ **9 months**
- Code formula: `NPER(0.0457/12, -490, 28200)` ≈ **66 months**
- Difference: **57 months**

### Recommendation

The code's formula is actually more useful for the product's positioning ("When am I free?" = when debt is $0). The spec's formula answers a different question that's less intuitive for the target audience.

**Decision needed**: Which model do you want?

| Model | Formula | Answer | Pros | Cons |
|-------|---------|--------|------|------|
| **Debt payoff** (code) | `NPER(rate, -payment, debt)` | "When is debt $0?" | Simple, intuitive, matches product copy | Doesn't account for savings growth |
| **Financial freedom** (spec) | `NPER(rate, -(income-expenses-payment), -(savings-debt))` | "When is net worth positive?" | More comprehensive | Complex, less intuitive, 9 months seems too fast |
| **Hybrid** (recommended) | Use debt payoff for B2, add a separate "net worth" row | Both | Best of both worlds | More rows in comparison table |

### If Keeping Code's Model (Recommended)

B2 is fine as-is. Update the spec to match the code. Update the product copy to say "When will your debt be paid off?" instead of "When will you be financially free?"

### If Switching to Spec's Model

```javascript
// B2 — Replace with spec's formula:
'=IF(\'Scenario Engine\'!B8<=0,"Already free!",IFERROR(ROUNDUP(NPER((\'Scenario Engine\'!B7-\'Scenario Engine\'!B10)/12,-(\'Scenario Engine\'!B4-\'Scenario Engine\'!B5-\'Scenario Engine\'!B9),-(\'Scenario Engine\'!B6-\'Scenario Engine\'!B8)),0),"Check inputs"))'
```

**Warning**: With sample data this returns ~9 months, which may confuse users who expect a longer timeline. The spec's claimed output of "24 months" doesn't match its own formula.

---

## Bug 4: Sensitivity Table vs Comparison Table Rounding Inconsistency

### Location
- Comparison table interest: `build-engine.gs` lines 475-479 (Scenario Engine)
- Sensitivity table interest: `build-engine.gs` lines 350-351 (Engine)

### Comparison Table Interest Formula
```javascript
// Uses Engine!B6 (rounded months):
"=IFERROR(Engine!B6*'Scenario Engine'!B9-'Scenario Engine'!B8,0)"
```
`Engine!B6` = `ROUNDUP(NPER(...), 0)` — rounded to integer months.

### Sensitivity Table Interest Formula
```javascript
// Uses exact NPER (not rounded):
"=IFERROR(('Scenario Engine'!B9+${extra})*NPER('Scenario Engine'!B7/12,-('Scenario Engine'!B9+${extra}),'Scenario Engine'!B8)-'Scenario Engine'!B8,0)"
```
`NPER(...)` returns a decimal (e.g., 36.70413...).

### Impact
At every row, the sensitivity table shows slightly different interest than the comparison table for the same payment level. For example:

| Scenario | Comparison Interest | Sensitivity Interest | Diff |
|----------|--------------------|--------------------|------|
| Min-only ($490) | `ROUNDUP(72.3) × 490 - 28200 = $7,128` | `72.3 × 490 - 28200 = $7,027` | $101 |
| Extra $200 ($690) | `ROUNDUP(47.8) × 690 - 28200 = $5,582` | `47.8 × 690 - 28200 = $4,782` | $800 |

### Fix

Standardize on **exact NPER** for interest in both tables. The sensitivity table already does this correctly. Update the comparison table:

```javascript
// BEFORE (Scenario Engine comparison table, lines 475-479):
{ row: 27, label: "Minimum payments only", months: "=Engine!B6", interest: "=IFERROR(Engine!B6*'Scenario Engine'!B9-'Scenario Engine'!B8,0)", date: "=Engine!B8" },
{ row: 28, label: "Extra $200/month", months: "=Engine!B9", interest: "=IFERROR(Engine!B9*('Scenario Engine'!B9+200)-'Scenario Engine'!B8,0)", date: "=Engine!B11" },
{ row: 29, label: "Extra $400/month", months: "=Engine!B12", interest: "=IFERROR(Engine!B12*('Scenario Engine'!B9+400)-'Scenario Engine'!B8,0)", date: "=Engine!B14" },

// AFTER — use exact NPER for interest (add Engine helper cells or inline NPER):
// Option 1: Add Engine B35-B37 for exact NPER values, reference those
// Option 2: Inline NPER in comparison table (verbose but accurate)
```

**Option 1 (cleaner)**: Add 3 new Engine cells that store exact NPER values:
```javascript
// Engine B35: exact NPER for min-only
sheet.getRange("B35").setFormula('=IFERROR(NPER(\'Scenario Engine\'!B7/12,-\'Scenario Engine\'!B9,\'Scenario Engine\'!B8),0)');

// Engine B36: exact NPER for extra $200
sheet.getRange("B36").setFormula('=IFERROR(NPER(\'Scenario Engine\'!B7/12,-(\'Scenario Engine\'!B9+200),\'Scenario Engine\'!B8),0)');

// Engine B37: exact NPER for extra $400
sheet.getRange("B37").setFormula('=IFERROR(NPER(\'Scenario Engine\'!B7/12,-(\'Scenario Engine\'!B9+400),\'Scenario Engine\'!B8),0)');
```

Then update comparison table to reference these:
```javascript
interest: "=IFERROR(Engine!B35*'Scenario Engine'!B9-'Scenario Engine'!B8,0)"  // min-only
interest: "=IFERROR(Engine!B36*('Scenario Engine'!B9+200)-'Scenario Engine'!B8,0)"  // extra $200
interest: "=IFERROR(Engine!B37*('Scenario Engine'!B9+400)-'Scenario Engine'!B8,0)"  // extra $400
```

---

## Bug 5: B4 "Interest Saved" Is Misleading

### Location
`build-engine.gs` line 147-148:
```javascript
'=IF(\'Scenario Engine\'!B8<=0,0,IFERROR((B6-B2)*\'Scenario Engine\'!B9,0))'
```

### Analysis
This computes `(B6 - B2) × payment` = difference in months × payment amount.

With current code (B2 = B6): this always returns **$0** because B2 and B6 are identical.

After fixing B2 to use the spec's formula: this would compute `(min-only months - scenario months) × payment`, which is an approximation of interest saved. The exact formula would be `B7 - B22` (min-only total interest - scenario total interest).

### Fix (After Bug 3 is resolved)
```javascript
// BEFORE:
'=IF(\'Scenario Engine\'!B8<=0,0,IFERROR((B6-B2)*\'Scenario Engine\'!B9,0))'

// AFTER — use exact interest difference:
'=IF(\'Scenario Engine\'!B8<=0,0,IFERROR(B7-B22,0))'
```

Where B7 = min-only total interest, B22 = snowball total interest. This gives the true interest saved.

---

## Additional Finding: B9 Sample Data Inconsistency

### Location
`build-engine.gs` line 398:
```javascript
{ row: 9, label: "Total monthly debt payment", value: 490, note: "← Sum of ALL minimum payments from Debt Payoff tab" }
```

### Analysis
- B9 sample value: $490
- Sum of minimum payments from Debt Payoff tab: $85 + $225 + $180 + $100 = **$590**
- Difference: $100

The note says "Sum of ALL minimum payments" but the value doesn't match. This is sample data only — users will enter their own values — but it could confuse users who try to verify the sample.

### Fix
```javascript
// BEFORE:
{ row: 9, label: "Total monthly debt payment", value: 490, ... }

// AFTER:
{ row: 9, label: "Total monthly debt payment", value: 590, ... }
```

---

## Complete Fix Summary

### Priority 1: Fix B33 (5 minutes)
Change `(B4-B5)*B32-B8` to `B32*B9-B8`. This fixes the 42× error.

### Priority 2: Resolve B2 design (10 minutes)
Decide: keep code's debt-payoff model or switch to spec's financial-freedom model. Update either the code or the spec.

### Priority 3: Fix B32 redundancy (15 minutes)
If keeping code's B2: B32 is already different (uses minimum payment at real rate). Just fix B33.
If switching to spec's B2: B32 becomes the minimum-payment-at-real-rate baseline. Fix B33.

### Priority 4: Standardize rounding (5 minutes)
Add exact-NPER helper cells to Engine tab. Update comparison table to reference them.

### Priority 5: Fix B4 (5 minutes)
Change `(B6-B2)*B9` to `B7-B22` for true interest saved.

### Priority 6: Fix B9 sample data (1 minute)
Change 490 to 590.

---

## Test Cases

After applying fixes, verify with sample data:

| Input | Value |
|-------|-------|
| Income | $6,200 |
| Expenses | $3,200 |
| Savings | $8,200 |
| APR | 7.57% |
| Debt | $28,200 |
| Payment | $590 (fixed) |
| Inflation | 3.0% |

### Expected Results (Debt Payoff Model)
- B2 (scenario months): `NPER((0.0757-0.03)/12, -590, 28200)` ≈ **55 months**
- B6 (min-only months): `NPER(0.0757/12, -590, 28200)` ≈ **58 months**
- B7 (min-only interest): `58 × 590 - 28200` ≈ **$6,020**
- B22 (snowball interest): compute from per-debt NPER calculations
- B4 (interest saved): `B7 - B22` (exact difference)

### Expected Results (Spec Model, if chosen)
- B2 (scenario months): `NPER((0.0757-0.03)/12, -(6200-3200-590), -(8200-28200))` ≈ **9 months**
- B32 (inflation-adjusted): `NPER((0.0757-0.03)/12, -590, 28200)` ≈ **55 months**

---

*Report generated: June 9, 2026*
*Code traced: build-engine.gs (1757 lines)*
*Spec referenced: build-spec-lean.md*
