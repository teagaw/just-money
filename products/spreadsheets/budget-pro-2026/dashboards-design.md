# Dashboard Design — Visual Spec

The 📊 Dashboard is the sheet that does the marketing. This document is the design system for it.

---

## Design Goals

1. **Screenshotable.** Every section should be self-contained so a buyer can crop and post.
2. **Glanceable.** 3 seconds to know if this month is on track.
3. **Premium feel.** Looks $200-designer, not $5-Etsy.
4. **Dark + light mode.** Two palettes baked in.
5. **One screen.** Fits a 1440×900 laptop without scrolling.

---

## Canvas Dimensions

- Rows shown: **1 to 28** (the "above the fold")
- Columns shown: **A to H** (8 columns)
- Row heights:
  - Row 1: 40px (sheet title)
  - Row 2: 12px (spacer)
  - Section header rows: 32px
  - Data rows: 24px
  - Chart rows: 180px tall (set row height manually)

- Column widths:
  - A: 32 (icon)
  - B: 160 (label)
  - C: 120 (number, right-aligned, tabular)
  - D: 120
  - E: 120
  - F: 200 (visual bar)
  - G: 40 (flag emoji)
  - H: 32 (right margin)

---

## Layout Grid

```
A B C D E F G H
═════════════════════════════════════════════════════════════════════════
Row 1   ▸ Sheet title:        "BUDGET PRO 2026 · DASHBOARD"      [G1 picker]
Row 2   ▸ spacer

Row 3   ─── THIS MONTH ────────  │  ─── NET WORTH ─────────────────
Row 4   │ 💰  Income      $X,XXX │  │  line chart of last 12 months
Row 5   │ 💸  Expenses    $X,XXX │  │  starts row 3, ends row 8
Row 6   │ ✨  Net         $X,XXX │  │
Row 7   │ 🎯  Savings %    XX%   │  │
Row 8   └────────────────────────┘  └──────────────────────────────

Row 9   ▸ spacer

Row 10  ─── BUDGET STATUS ─────────────────────────────────────────
Row 11  Category   Budget   Spent   Remaining   %     Bar          Flag
Row 12  Housing    $1,800  $1,800   $0          100%  ████████████ ✓
Row 13  Food       $600    $712    -$112        119%  ████████████ ⚠
...     ...
Row 25  (up to 14 categories)

Row 26  ▸ spacer

Row 27  ─── GOAL PROGRESS ────────  │  ─── TOP CATEGORIES ────────
Row 28  │ Emergency Fund 80% ██████ │  │  pie chart
Row 29  │ Vacation       30% ███    │  │
Row 30  │ Pay off Viso   72% ████   │  │
Row 31  │ Laptop         25% ██     │  │

Row 33  ─── CASH FLOW (6 MONTHS) ─────────────────────────────────
Row 34  stacked bar chart
Row 41
```

---

## Color Palette

### Light mode (default)

| Element | Hex |
|---------|-----|
| Background | `#FFFFFF` |
| Section header bg | `#F8FAFC` |
| Section border | `#E2E8F0` |
| Primary text | `#0F172A` |
| Secondary text | `#64748B` |
| Income / positive | `#10B981` |
| Expense / negative | `#EF4444` |
| Warning | `#F59E0B` |
| Info / goals | `#3B82F6` |
| Neutral | `#94A3B8` |

### Dark mode

| Element | Hex |
|---------|-----|
| Background | `#0B0F17` |
| Section header bg | `#1A1F2E` |
| Section border | `#334155` |
| Primary text | `#E2E8F0` |
| Secondary text | `#94A3B8` |
| Income / positive | `#34D399` |
| Expense / negative | `#F87171` |
| Warning | `#FBBF24` |
| Info / goals | `#60A5FA` |
| Neutral | `#94A3B8` |

> **To switch:** Format → Theme → use Google Sheets' light/dark theme. The conditional formatting colors will still pop against either background since both use medium-intensity hues.

---

## Typography

| Element | Font | Weight | Size |
|---------|------|--------|------|
| Sheet title (`A1`) | Inter / system-ui | 700 | 14pt |
| Section headers (`A3, A10, A27, A33`) | Inter | 600 | 11pt, letter-spacing +1pt, all caps |
| Labels (`B4:B7, A12:A25, etc.`) | Inter | 500 | 10pt |
| Numbers (`C4:C7, B12:E25, etc.`) | Inter | 600 | 11pt, tabular align right |
| Bars (`F12:F25`) | Monospace fallback | 400 | 11pt |
| Flags (`G12:G25`) | system emoji | 400 | 11pt |

> Google Sheets only supports a limited font set. Use **"Inter"** if available, otherwise **"Roboto"**, otherwise the default sans-serif. All look clean.

---

## Section: This Month KPI Card (B3:D8)

### Cells

| Cell | Content | Style |
|------|---------|-------|
| `B3:D3` (merged) | `THIS MONTH` | bold, bg `#F8FAFC`, letter-spacing, all caps, 11pt |
| `B4` | `💰  Income` | secondary text color |
| `C4` | formula | primary, bold, right-align, currency format |
| `B5` | `💸  Expenses` | secondary |
| `C5` | formula | primary, bold, right, currency |
| `B6` | `✨  Net` | secondary |
| `C6` | formula | primary, bold, right, currency. **Conditional:** if < 0 then red |
| `B7` | `🎯  Savings rate` | secondary |
| `C7` | formula | primary, bold, right, % format. **Conditional:** ≥ 20% green, < 10% amber |

### Border / box treatment

- Outer border `B3:D8` 1px `#E2E8F0`
- Top accent row `B3:D3` bg `#F8FAFC`
- Cell padding via column width (no native padding in Sheets)

---

## Section: Net Worth Chart (E3:G8)

- Smooth line chart
- Data: `Net Worth!A2:B14`
- Color: `#3B82F6`
- Line width: 2px
- No grid lines (chart options → Customize → Gridlines → Major count: 0)
- Y-axis: visible, format currency, no decimals
- X-axis: visible, format short month ("Jan")
- Marker: only at the last data point, color `#10B981`, size 6
- Title: "Net Worth (12mo)" inside the chart, top-left, 10pt
- Background: transparent
- Border: 1px `#E2E8F0`

---

## Section: Budget Status Table (A10:G25)

### Header row (row 10)

- `A10:G10` merged: `BUDGET STATUS — [Month YYYY]` (dynamic title via formula `=" BUDGET STATUS — "&TEXT(G1,"MMM YYYY")`)
- bg `#F8FAFC`, bold, 11pt, all caps

### Sub-header row (row 11)

| Col | Label |
|-----|-------|
| `A` | Category |
| `B` | Budget |
| `C` | Spent |
| `D` | Remaining |
| `E` | % |
| `F` | (no header — bar column) |
| `G` | (no header — flag column) |

bg `#F8FAFC`, secondary text color, 10pt, uppercase

### Data rows (12-25)

- Alternating row color: rows 12, 14, 16... bg `#FFFFFF`; rows 13, 15, 17... bg `#F8FAFC` (zebra)
- All numbers tabular, right-aligned, no decimals (except %)
- Bar column (F) uses the `REPT` formula generating `████████░░░░`
- Flag column (G) shows `✓` / `▲` / `⚠`

### Conditional formatting (priority order)

1. `D12:D25` < 0 → bg `#FEE2E2`, text `#991B1B`, bold
2. `D12:D25` ≥ 0 → text `#065F46`
3. `E12:E25` ≥ 1 → text `#EF4444`, bold
4. `E12:E25` ≥ 0.8 and < 1 → text `#F59E0B`
5. `E12:E25` < 0.8 → text `#10B981`
6. `F12:F25` (the bar) → text color matches the flag: green / amber / red

---

## Section: Goal Progress (A27:D31)

| Col | Header | Width |
|-----|--------|-------|
| `A` | Goal name | wide |
| `B` | % | narrow |
| `C` | Bar (10 chars) | medium |

5 rows max — only the top 5 goals by progress or by priority.

Conditional formatting:
- B27:B31 ≥ 100% → text `#10B981`, prefix with `✓`
- B27:B31 ≥ 50% → text `#3B82F6`
- B27:B31 < 25% → text `#F59E0B`

---

## Section: Top Categories Pie (E27:G31)

- Pie / doughnut chart
- Data: dynamic top 5 categories from the budget status table
- Colors: pull from `Categories!H` (each category has its own hex code)
- Legend: right of pie, 10pt, label format `Category — $XXX`
- No title (the section header above provides context)
- Border: 1px `#E2E8F0`

---

## Section: Cash Flow Bar Chart (A33:G41)

- Stacked column chart
- Data: helper table on Reports sheet with 6 months × (Income, Expense)
- Income bars: `#10B981`
- Expense bars: `#EF4444`
- X-axis: month names
- Y-axis: currency, no decimals, soft gridlines (`#F1F5F9`)
- Title inside chart: "Cash Flow (last 6 months)"
- Border: 1px `#E2E8F0`

---

## Micro-interactions

Google Sheets has limited interactivity, but use these:

### Month picker (`G1`)
- Data validation: Is valid date
- Place a 🗓️ emoji in `F1` to hint
- Changing G1 cascades every formula on the page

### Hover info
- Add cell **notes** (right-click → Insert note) on each metric explaining the formula. Users learn the system without leaving the dashboard.

### Click to drill down
- Add hyperlinks: e.g. `C5` → `=HYPERLINK("#gid=<transactions sheet gid>", SUMIFS_formula)`. Clicking the expense number jumps you to the Transactions sheet to investigate.

---

## Screenshot Crop Guides

For the marketing screenshots that buyers will post, designate these as "perfect crops":

| Crop name | Range | Aspect | Use |
|-----------|-------|--------|-----|
| Hero | A1:G31 | ~3:2 | Etsy main cover |
| KPI card | B3:D8 | square | Instagram square |
| Budget table | A10:G25 | wide | Twitter / X |
| Goal progress | A27:D31 | wide | "I hit my goal" post |
| Net worth chart | E3:G8 | wide | "look at my growth" post |

---

## Print Treatment

If a user prints (rare but happens):

- Set print area: `A1:G41`
- Orientation: landscape
- Scale: fit to one page
- Margins: narrow
- Hide gridlines: Yes
- Print row headers: No

The dashboard will fit one landscape letter page with all sections visible.

---

## Accessibility

- Color is **never the only signal** — every red/amber/green is paired with an emoji flag (`✓ ▲ ⚠`) so colorblind users still get the meaning.
- Font size minimum 10pt — readable on retina + low-vision.
- Tabular numbers align under each other (no proportional digit widths).

---

## What Makes This Different From Free Templates

| Free templates do | Budget Pro 2026 does |
|-------------------|----------------------|
| Cluttered, every-cell-filled | Generous whitespace, sections separated |
| Default Google blue everywhere | 5-color palette with semantic meaning |
| Numbers float, no alignment | All numbers tabular, right-aligned |
| Bars are 3-color highlights | Bars are visual block characters that scale to value |
| No emoji / icons | Icons used semantically (✓ ▲ ⚠ 💰 💸 ✨ 🎯) |
| Charts use default colors | Charts use the brand palette |
| Single layout, mobile broken | Tab order + section widths optimized for mobile |

---

This is the look. Apply the formatting in `setup-guide.md` Step 4 and the dashboard built from CSV will match this spec.
