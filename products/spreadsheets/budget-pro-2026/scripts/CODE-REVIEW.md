# Code review: Budget Pro 2026 — bug fixes and new code

## Summary
The three bug fixes address real correctness issues (NPER formula, interest-saved calculation, safe tab replacement). However, the implementation introduces new critical problems: `safeReplace()` will throw on duplicate sheet names, `recalculateDebtSimulation()` swallows all errors, and `simulatePayoff()` is duplicated across files. The code needs targeted fixes before shipping.

## Critical findings

- **safeReplace() inserts before deleting — will throw on duplicate names** — `build-engine.gs:219-228`
  Evidence: `const existing = ss.getSheetByName(name); const sheet = ss.insertSheet(name);` — Google Sheets throws `Exception: A sheet with the name "X" already exists.` when `insertSheet()` is called while a sheet with that name already exists.
  Principle violated: AI failure mode #13 (plausible-but-wrong code) — the comment says "delete only the existing tab, then immediately create its replacement" but the code does the opposite.
  Suggested fix: Reverse the order back to delete-then-insert, but wrap in try-catch to handle the case where no sheets remain (the original concern the reorder was trying to fix):
  ```javascript
  function safeReplace(name) {
    const existing = ss.getSheetByName(name);
    if (existing) {
      // Ensure we always have at least one sheet
      if (ss.getSheets().length > 1) {
        ss.deleteSheet(existing);
      } else {
        // Rename the default, then create new
        existing.setName(name + "_old");
        ss.deleteSheet(existing);
      }
    }
    return ss.insertSheet(name);
  }
  ```

- **recalculateDebtSimulation() swallows all errors** — `build-engine.gs:1856-1858`
  Evidence: `catch (e) { Logger.log("ERROR in recalculateDebtSimulation: " + e.message); }` — silently swallows any error, including data corruption, API failures, or formula errors.
  Principle violated: AI failure mode #1 (catch-all error handling that swallows failures) — Karpathy.
  Suggested fix: Let critical errors propagate, or at minimum re-throw after logging:
  ```javascript
  } catch (e) {
    Logger.log("ERROR in recalculateDebtSimulation: " + e.message);
    SpreadsheetApp.getUi().alert("Recalculation failed: " + e.message);
    throw e; // Propagate so caller knows it failed
  }
  ```

- **simulatePayoff() is duplicated across files** — `build-engine.gs:278-374` and `pure-functions.js:6-89`
  Evidence: Identical 96-line function exists in both files. The test file imports from `pure-functions.js`, but the production code in `build-engine.gs` has its own copy.
  Principle violated: AI failure mode #5 (code duplication instead of reuse) — GitClear 2025: copy-pasted blocks increased 8x.
  Suggested fix: Extract `simulatePayoff()` to a shared module, or have `build-engine.gs` import from `pure-functions.js` (if GAS module imports are supported). If not possible, add a comment explaining why duplication exists and when to sync.

## Important findings

- **simulatePayoff() is 96 lines — violates ≤20 line limit** — `build-engine.gs:278-374`
  Evidence: Function mixes target debt selection, payment calculation, interest tracking, and payoff recording in a single nested loop.
  Principle violated: Function size limit (Clean Code Ch. 3) and AI failure mode #8 (long functions doing many things).
  Suggested fix: Extract helpers:
  - `findTargetDebt(balances, debts, strategy)` — returns index
  - `applyMonthlyPayment(balances, rates, minimums, targetIdx, extra)` — returns {interest, paid}
  - `recordPayoff(i, month, ...)` — updates tracking arrays

- **recalculateDebtSimulation() is 56 lines — violates ≤20 line limit** — `build-engine.gs:1803-1859`
  Evidence: Function reads data, processes debts, runs three simulations, writes 8+ cells.
  Principle violated: Function size limit.
  Suggested fix: Extract helpers:
  - `readDebtData(debtSheet)` — returns debts array
  - `writeSimulationResults(engineSheet, results)` — writes to cells
  - Keep `recalculateDebtSimulation()` as thin orchestrator.

- **buildEngineTab() is ~400+ lines — violates ≤20 line limit** — `build-engine.gs:376-1796`
  Evidence: Single function creates entire Engine tab with 58+ formulas, formatting, and protections.
  Principle violated: Function size limit (extreme violation).
  Suggested fix: Break into section builders:
  - `buildScenarioEngineSection(sheet)`
  - `buildComparisonSection(sheet)`
  - `buildDebtSimulationSection(sheet)`
  - etc.

- **Comment on safeReplace() contradicts implementation** — `build-engine.gs:215-218`
  Evidence: Comment says "delete only the existing tab, then immediately create its replacement" but code does insert-then-delete.
  Principle violated: AI failure mode #4 (comment pollution) — misleading comment worse than no comment.
  Suggested fix: Update comment to match actual behavior, or fix the code to match the comment.

## Nits

- **Test file uses hardcoded expected values** — `pure-functions.test.js:48,148`
  Evidence: `assertEqual(singleResult.totalMonths, 23, ...)` and `assert(sanityResult.totalMonths >= 10 && sanityResult.totalMonths <= 16, ...)`
  Principle: Not a violation, but note that these expected values are derived from manual calculation. Consider adding comments showing the derivation for maintainability.

- **Redundant test in Bug 1 suite** — `pure-functions.test.js:263-264`
  Evidence: `noExtraMin` and `noExtraStrat` use identical inputs `({ ...d, extraPayment: 0 })`.
  Principle: YAGNI — the second simulation is unnecessary. Could just assert `noExtraSaved === 0` directly.

- **No tests for edge cases in safeReplace()** — missing test coverage
  Evidence: No test for the tab replacement logic (can't test GAS API in pure JS, but could test the logic pattern).
  Principle: Testing gap.

## What's good

- **Bug fixes are well-targeted**: The NPER formula fix (adding inflation adjustment) and interest-saved calculation fix (using minOnly.totalInterest - strategy.totalInterest) are mathematically correct and address real user-facing bugs.
- **Test coverage is thorough for simulatePayoff()**: 50 tests covering single debt, snowball vs avalanche ordering, extra payments, zero balances, tiebreakers, and the specific bug fixes. The manual calculation verification (Bug 1 tests) is excellent practice.
- **Defensive error handling in protectRange()**: The try-catch around sheet protection is appropriate — protection is optional and shouldn't block the build.
- **Clear naming throughout**: Function names like `simulatePayoff`, `safeReplace`, `recalculateDebtSimulation` reveal intent. Variable names like `availableSnowball`, `totalExtra`, `payoffMonths` are descriptive.

## Self-check coverage
- [x] Walked Section A (naming & functions) — flagged 3 long functions
- [x] Walked Section B (comments & formatting) — flagged misleading comment
- [x] Walked Section C (SOLID) — no violations found (build scripts are naturally monolithic)
- [x] Walked Section D (DRY/KISS/YAGNI) — flagged duplication, complexity
- [x] Walked Section E (AI failure modes) — flagged catch-all error swallowing, plausible-but-wrong code, duplication, long functions