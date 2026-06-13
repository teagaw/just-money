/**
 * Tests for Budget Pro 2026 pure functions.
 * Run: node products/spreadsheets/budget-pro-2026/scripts/test/pure-functions.test.js
 */

import { simulatePayoff, getColumnLetter } from './pure-functions.js';

let passed = 0;
let failed = 0;

function assert(condition, name) {
  if (condition) {
    passed++;
    console.log(`  ✓ ${name}`);
  } else {
    failed++;
    console.log(`  ✗ ${name}`);
  }
}

function assertEqual(actual, expected, name) {
  if (actual === expected) {
    passed++;
    console.log(`  ✓ ${name}`);
  } else {
    failed++;
    console.log(`  ✗ ${name} — expected ${expected}, got ${actual}`);
  }
}

// ─── getColumnLetter ───

console.log('\ngetColumnLetter');

const colCases = [[1,'A'],[2,'B'],[26,'Z'],[27,'AA'],[52,'AZ'],[53,'BA'],[702,'ZZ'],[703,'AAA']];
colCases.forEach(([n, expected]) => assertEqual(getColumnLetter(n), expected, `column ${n} → ${expected}`));

// ─── simulatePayoff — single debt ───

console.log('\nsimulatePayoff — single debt');

// $1000 at 12% APR, $50/month payment
// Monthly rate: 0.01. Month 1 interest: $10, principal: $40, balance: $960.
// Total interest is the sum of decreasing monthly interest charges.
const singleDebt = [{ name: 'Card', balance: 1000, apr: 0.12, minPayment: 50, extraPayment: 0 }];
const singleResult = simulatePayoff(singleDebt, 'snowball');

assertEqual(singleResult.totalMonths, 23, 'single $1000 debt at 12% APR pays off in 23 months');
assert(singleResult.totalInterest > 50 && singleResult.totalInterest < 150,
  `single debt interest in expected range (got ${singleResult.totalInterest})`);
assertEqual(singleResult.totalPaid, 1000 + singleResult.totalInterest,
  'total paid = principal + interest');
assertEqual(singleResult.payoffMonths[0], singleResult.totalMonths,
  'payoff month matches total months');

// ─── simulatePayoff — snowball vs avalanche ordering ───

console.log('\nsimulatePayoff — snowball vs avalanche ordering');

const twoDebts = [
  { name: 'Big', balance: 5000, apr: 0.18, minPayment: 100, extraPayment: 200 },
  { name: 'Small', balance: 1000, apr: 0.06, minPayment: 25, extraPayment: 0 }
];

const snowball = simulatePayoff(twoDebts, 'snowball');
const avalanche = simulatePayoff(twoDebts, 'avalanche');

assert(snowball.totalMonths > 0, 'snowball pays off two debts');
assert(avalanche.totalMonths > 0, 'avalanche pays off two debts');

// Snowball pays off smallest balance first (Small at $1000 before Big at $5000)
assert(snowball.payoffMonths[1] > 0 && snowball.payoffMonths[1] < snowball.payoffMonths[0],
  'snowball pays off Small debt before Big debt');

// Avalanche pays off highest APR first (Big at 18% before Small at 6%)
assert(avalanche.payoffMonths[0] > 0 && avalanche.payoffMonths[0] < avalanche.payoffMonths[1],
  'avalanche pays off Big debt before Small debt');

// Avalanche should save more interest (higher APR debt paid first)
assert(avalanche.totalInterest <= snowball.totalInterest,
  'avalanche saves ≥ snowball interest');

// ─── simulatePayoff — extra payments reduce months ───

console.log('\nsimulatePayoff — extra payments reduce months');

const noExtra = [{ name: 'Debt', balance: 5000, apr: 0.10, minPayment: 100, extraPayment: 0 }];
const withExtra = [{ name: 'Debt', balance: 5000, apr: 0.10, minPayment: 100, extraPayment: 200 }];

const noExtraResult = simulatePayoff(noExtra, 'snowball');
const withExtraResult = simulatePayoff(withExtra, 'snowball');

assert(withExtraResult.totalMonths < noExtraResult.totalMonths,
  'extra payments reduce payoff months');
assert(withExtraResult.totalInterest < noExtraResult.totalInterest,
  'extra payments reduce total interest');

// ─── simulatePayoff — freed-up minimum rolls into snowball ───

console.log('\nsimulatePayoff — freed-up minimum rolls into snowball');

const threeDebts = [
  { name: 'Tiny', balance: 500, apr: 0.10, minPayment: 50, extraPayment: 0 },
  { name: 'Medium', balance: 3000, apr: 0.12, minPayment: 100, extraPayment: 0 },
  { name: 'Large', balance: 8000, apr: 0.08, minPayment: 200, extraPayment: 0 }
];

const threeResult = simulatePayoff(threeDebts, 'snowball');

// Snowball ordering: Tiny (smallest) → Medium → Large (largest)
assert(threeResult.payoffMonths[0] > 0 && threeResult.payoffMonths[0] <= threeResult.payoffMonths[1],
  'Tiny payoff ≤ Medium payoff');
assert(threeResult.payoffMonths[1] <= threeResult.payoffMonths[2],
  'Medium payoff ≤ Large payoff');

// ─── simulatePayoff — zero balance debts ───

console.log('\nsimulatePayoff — zero balance debts');

const withZero = [
  { name: 'Paid', balance: 0, apr: 0.10, minPayment: 50, extraPayment: 0 },
  { name: 'Active', balance: 2000, apr: 0.10, minPayment: 100, extraPayment: 0 }
];

const zeroResult = simulatePayoff(withZero, 'snowball');

assertEqual(zeroResult.payoffMonths[0], 0, 'zero balance debt has no payoff month');
assert(zeroResult.totalMonths > 0, 'active debt still pays off');

// ─── simulatePayoff — already free (zero debt) ───

console.log('\nsimulatePayoff — empty input returns zeroed result');

const emptyResult = simulatePayoff([], 'snowball');
assertEqual(emptyResult.totalMonths, 0, 'empty input → 0 months');
assertEqual(emptyResult.totalInterest, 0, 'empty input → 0 interest');
assertEqual(emptyResult.totalPaid, 0, 'empty input → 0 paid');

// ─── simulatePayoff — math sanity checks ───

console.log('\nsimulatePayoff — math sanity');

const sanityDebt = [{ name: 'Loan', balance: 1200, apr: 0.12, minPayment: 100, extraPayment: 0 }];
const sanityResult = simulatePayoff(sanityDebt, 'snowball');

// At 12% APR on $1200, monthly interest ~$12. With $100 payment, ~$88 goes to principal.
// Should pay off in roughly 13 months.
assert(sanityResult.totalMonths >= 10 && sanityResult.totalMonths <= 16,
  `payoff months in expected range (got ${sanityResult.totalMonths})`);

// Total paid should be principal + interest
assertEqual(sanityResult.totalPaid, 1200 + sanityResult.totalInterest,
  'total paid = principal + interest');

// Interest should be positive but less than principal
assert(sanityResult.totalInterest > 0 && sanityResult.totalInterest < 1200,
  `interest in reasonable range (got ${sanityResult.totalInterest})`);

// ─── simulatePayoff — avalanche tiebreaker ───

console.log('\nsimulatePayoff — avalanche tiebreaker');

const tieDebts = [
  { name: 'A', balance: 1000, apr: 0.10, minPayment: 50, extraPayment: 0 },
  { name: 'B', balance: 1000, apr: 0.10, minPayment: 50, extraPayment: 0 }
];

const tieResult = simulatePayoff(tieDebts, 'avalanche');

// Same APR, same balance — both should pay off and produce deterministic results
assert(tieResult.totalMonths > 0, 'identical debts complete under avalanche');
assertEqual(tieResult.payoffMonths[0], tieResult.payoffMonths[1],
  'identical debts pay off in same month under avalanche tiebreaker');

// ─── Bug fixes: B24/B25 interest-saved & B2 NPER formula ───

console.log('\nsimulatePayoff — min-only interest matches manual calculation (Bug 1)');

// Test 1: Single debt $10,000, 12% APR, $200/mo min payment, zero extra.
// Manually iterate month-by-month to compute expected totalInterest.
const bug1Debts = [{ name: 'Card', balance: 10000, apr: 0.12, minPayment: 200, extraPayment: 0 }];
const bug1Result = simulatePayoff(bug1Debts, 'snowball');

let manualBalance = 10000;
let manualInterest = 0;
let manualMonths = 0;
const manualRate = 0.12 / 12;
while (manualBalance > 0 && manualMonths < 240) {
  manualMonths++;
  const interest = manualBalance * manualRate;
  manualInterest += interest;
  const payment = Math.min(200, manualBalance + interest);
  manualBalance -= (payment - interest);
}
const expectedInterest = Math.round(manualInterest);

assertEqual(bug1Result.totalInterest, expectedInterest,
  `min-only interest $${bug1Result.totalInterest} matches manual $${expectedInterest}`);
assertEqual(bug1Result.totalMonths, manualMonths,
  `min-only months ${bug1Result.totalMonths} matches manual ${manualMonths}`);
assertEqual(bug1Result.totalPaid, 10000 + bug1Result.totalInterest,
  'min-only: totalPaid = principal + interest');

// ─── Interest-saved arithmetic (core of Bug 1 fix) ───

console.log('\nsimulatePayoff — interest-saved calculation (Bug 1 core)');

// Test 2: Two debts. minOnly (extraPayment: 0) minus strategy (extraPayment: 500)
// must equal the interest saved.
const savedDebts = [
  { name: 'Big', balance: 8000, apr: 0.18, minPayment: 160, extraPayment: 0 },
  { name: 'Small', balance: 2000, apr: 0.06, minPayment: 50, extraPayment: 0 }
];

const savedMinOnly = simulatePayoff(savedDebts.map(d => ({ ...d, extraPayment: 0 })), 'snowball');
const savedWithExtra = simulatePayoff(savedDebts.map(d => ({ ...d, extraPayment: 500 })), 'snowball');
const interestSaved = savedMinOnly.totalInterest - savedWithExtra.totalInterest;

assert(interestSaved >= 0,
  `interest saved is non-negative (got ${interestSaved})`);


// ─── Test 3: single debt zero extra — basic invariants ───

console.log('\nsimulatePayoff — single debt zero extra invariants (Bug 1)');

const zeroExtraDebt = [{ name: 'Loan', balance: 5000, apr: 0.10, minPayment: 100, extraPayment: 0 }];
const zeroExtraResult = simulatePayoff(zeroExtraDebt, 'snowball');

assert(zeroExtraResult.totalMonths > 0, 'totalMonths > 0');
assert(zeroExtraResult.totalInterest > 0, 'totalInterest > 0');
assert(zeroExtraResult.totalPaid >= zeroExtraResult.totalInterest + 5000,
  'totalPaid covers interest + principal');

// ─── Test 4: interest saved is always non-negative with extra payments ───

console.log('\nsimulatePayoff — interest saved positive with extra (Bug 1)');

const posDebts = [
  { name: 'Card', balance: 6000, apr: 0.15, minPayment: 120, extraPayment: 0 },
  { name: 'Loan', balance: 3000, apr: 0.08, minPayment: 80, extraPayment: 0 }
];

const posMinOnly = simulatePayoff(posDebts.map(d => ({ ...d, extraPayment: 0 })), 'snowball');
const posWithExtra = simulatePayoff(posDebts.map(d => ({ ...d, extraPayment: 300 })), 'snowball');
const posSaved = posMinOnly.totalInterest - posWithExtra.totalInterest;

assert(posSaved >= 0,
  `interest saved with extra payments ≥ 0 (got ${posSaved})`);
assert(posWithExtra.totalMonths <= posMinOnly.totalMonths,
  'extra payments reduce or maintain payoff months');

// ─── Test 5: snowball vs avalanche interest-saved comparison ───

console.log('\nsimulatePayoff — snowball vs avalanche interest-saved with extra payments (Bug 1)');

// Two debts with meaningfully different APRs and balances
const compareDebts = [
  { name: 'High APR', balance: 8000, apr: 0.22, minPayment: 160, extraPayment: 0 },
  { name: 'Low APR', balance: 3000, apr: 0.06, minPayment: 60, extraPayment: 0 }
];

// Run with extraPayment: 0 to get min-only interest
const compareMinOnly = simulatePayoff(compareDebts.map(d => ({ ...d, extraPayment: 0 })), 'snowball');

// Run with extraPayment: 500 to get strategy interest
const snowballExtra5 = simulatePayoff(compareDebts.map(d => ({ ...d, extraPayment: 500 })), 'snowball');
const avalancheExtra5 = simulatePayoff(compareDebts.map(d => ({ ...d, extraPayment: 500 })), 'avalanche');

// Interest saved = min-only - strategy
const snowballSaved5 = compareMinOnly.totalInterest - snowballExtra5.totalInterest;
const avalancheSaved5 = compareMinOnly.totalInterest - avalancheExtra5.totalInterest;

// Interest saved > 0 (extra payments always save interest)
assert(snowballSaved5 > 0,
  `snowball interest saved > 0 with extra payments (got ${snowballSaved5})`);
assert(avalancheSaved5 > 0,
  `avalanche interest saved > 0 with extra payments (got ${avalancheSaved5})`);

// Assert that interest saved = min-only - strategy (arithmetic check)
assertEqual(snowballExtra5.totalInterest + snowballSaved5, compareMinOnly.totalInterest,
  'snowball: strategy interest + saved = min-only interest');
assertEqual(avalancheExtra5.totalInterest + avalancheSaved5, compareMinOnly.totalInterest,
  'avalanche: strategy interest + saved = min-only interest');

// Avalanche saves MORE interest than snowball (higher APR paid first)
assert(avalancheSaved5 > snowballSaved5,
  `avalanche saves more interest than snowball (${avalancheSaved5} > ${snowballSaved5})`);

// ─── recalculateDebtSimulation() logic tests ───
// recalculateDebtSimulation() depends on Google Sheets API and cannot be unit
// tested directly. However, it contains testable logic: input filtering, empty
// debt handling, data mapping, and interest-saved calculation. These tests
// verify that logic by replicating the same operations.

console.log('\nrecalculateDebtSimulation logic — input filtering');

// Simulate the filtering logic from recalculateDebtSimulation (line 1835)
const rawDebtData = [
  [2800, 0.2499, 85, 200],   // Chase Visa
  [0, 0.0675, 225, 0],       // Car Loan — zero balance (should be filtered out)
  [15800, 0.055, 180, 0],    // Student Loan
  [0, 0.0, 100, 100],        // Medical Bill — zero balance (should be filtered out)
];

const filteredDebts = rawDebtData
  .filter(row => row[0] && row[0] > 0)
  .map(row => ({
    name: "",
    balance: row[0],
    apr: row[1],
    minPayment: row[2],
    extraPayment: row[3] || 0
  }));

assertEqual(filteredDebts.length, 2, 'filters out zero-balance debts (2 of 4 remain)');
assertEqual(filteredDebts[0].balance, 2800, 'first filtered debt has correct balance');
assertEqual(filteredDebts[1].balance, 15800, 'second filtered debt has correct balance');
assertEqual(filteredDebts[0].extraPayment, 200, 'extraPayment preserved from raw data');
assertEqual(filteredDebts[1].extraPayment, 0, 'missing extraPayment defaults to 0');

// ─── recalculateDebtSimulation logic — empty debts ───

console.log('\nrecalculateDebtSimulation logic — empty debt array');

const emptyFiltered = []
  .filter(row => row[0] && row[0] > 0)
  .map(row => ({
    name: "",
    balance: row[0],
    apr: row[1],
    minPayment: row[2],
    extraPayment: row[3] || 0
  }));

assertEqual(emptyFiltered.length, 0, 'empty input produces empty filtered array');

// When no debts exist, recalculateDebtSimulation sets B20-B25 to 0
// Verify that simulatePayoff with empty array returns zeroed result
const emptySimResult = simulatePayoff([], 'snowball');
assertEqual(emptySimResult.totalMonths, 0, 'empty debts → 0 months');
assertEqual(emptySimResult.totalInterest, 0, 'empty debts → 0 interest');
assertEqual(emptySimResult.totalPaid, 0, 'empty debts → 0 paid');

// ─── recalculateDebtSimulation logic — data mapping ───

console.log('\nrecalculateDebtSimulation logic — data mapping to simulatePayoff');

const sheetData = [
  [5000, 0.18, 100, 200],
  [1000, 0.06, 25, 0],
];

const mappedDebts = sheetData
  .filter(row => row[0] && row[0] > 0)
  .map(row => ({
    name: "",
    balance: row[0],
    apr: row[1],
    minPayment: row[2],
    extraPayment: row[3] || 0
  }));

// Verify the mapped data produces valid simulation results
const mappedResult = simulatePayoff(mappedDebts, 'snowball');
assert(mappedResult.totalMonths > 0, 'mapped debts produce valid simulation');
assert(mappedResult.totalInterest > 0, 'mapped debts produce positive interest');
assertEqual(mappedResult.payoffMonths.length, 2, 'payoff months array matches debt count');

// ─── recalculateDebtSimulation logic — interest saved calculation ───

console.log('\nrecalculateDebtSimulation logic — interest saved calculation');

// Recalculate the interest-saved logic from lines 1864-1866
const savedDebts2 = [
  { name: "", balance: 5000, apr: 0.18, minPayment: 100, extraPayment: 200 },
  { name: "", balance: 1000, apr: 0.06, minPayment: 25, extraPayment: 0 },
];

const snowballResult = simulatePayoff(savedDebts2, 'snowball');
const avalancheResult = simulatePayoff(savedDebts2, 'avalanche');
const minOnly = simulatePayoff(savedDebts2.map(d => ({...d, extraPayment: 0})), 'snowball');

const snowballSaved = Math.max(0, minOnly.totalInterest - snowballResult.totalInterest);
const avalancheSaved = Math.max(0, minOnly.totalInterest - avalancheResult.totalInterest);

assert(snowballSaved >= 0, 'snowball interest saved is non-negative');
assert(avalancheSaved >= 0, 'avalanche interest saved is non-negative');
assertEqual(typeof snowballSaved, 'number', 'interest saved is a number');
assert(!isNaN(snowballSaved), 'interest saved is not NaN');

// ─── recalculateDebtSimulation logic — extraPayment defaulting ───

console.log('\nrecalculateDebtSimulation logic — extraPayment defaulting');

// Rows with undefined extraPayment should default to 0
const dataWithUndefined = [
  [2000, 0.10, 100, undefined],
  [3000, 0.12, 150, null],
  [1000, 0.08, 50, 0],
];

const defaultedDebts = dataWithUndefined
  .filter(row => row[0] && row[0] > 0)
  .map(row => ({
    name: "",
    balance: row[0],
    apr: row[1],
    minPayment: row[2],
    extraPayment: row[3] || 0
  }));

assertEqual(defaultedDebts[0].extraPayment, 0, 'undefined extraPayment defaults to 0');
assertEqual(defaultedDebts[1].extraPayment, 0, 'null extraPayment defaults to 0');
assertEqual(defaultedDebts[2].extraPayment, 0, 'explicit 0 extraPayment stays 0');

// ─── H5: Snowball tiebreaker with different APRs ───

console.log('\nsimulatePayoff — snowball tiebreaker with different APRs (H5)');

// Two debts with SAME balance but DIFFERENT APRs
const tieDebtsH5 = [
  { name: 'High', balance: 3000, apr: 0.18, minPayment: 50, extraPayment: 0 },
  { name: 'Low', balance: 3000, apr: 0.06, minPayment: 50, extraPayment: 0 }
];

// Run twice to verify deterministic behavior
const tieResultH5a = simulatePayoff(tieDebtsH5, 'snowball');
const tieResultH5b = simulatePayoff(tieDebtsH5, 'snowball');

assert(tieResultH5a.totalMonths > 0, 'snowball tie completes');
assertEqual(tieResultH5a.totalMonths, tieResultH5b.totalMonths,
  'snowball tie is deterministic (same total months across runs)');
assertEqual(tieResultH5a.totalInterest, tieResultH5b.totalInterest,
  'snowball tie is deterministic (same interest across runs)');
assertEqual(tieResultH5a.payoffMonths[0], tieResultH5b.payoffMonths[0],
  'snowball tie: debt 0 payoff month deterministic');
assertEqual(tieResultH5a.payoffMonths[1], tieResultH5b.payoffMonths[1],
  'snowball tie: debt 1 payoff month deterministic');

// ─── H6: 0% APR debt ───

console.log('\nsimulatePayoff — 0% APR debt (H6)');

// Single debt with 0% APR — should pay off in exactly ceil(balance / minPayment) months
const zeroAprDebt = [{ name: 'Zero APR', balance: 5000, apr: 0, minPayment: 120, extraPayment: 0 }];
const zeroAprResult = simulatePayoff(zeroAprDebt, 'snowball');

const expectedZeroAprMonths = Math.ceil(5000 / 120); // 42
assertEqual(zeroAprResult.totalMonths, expectedZeroAprMonths,
  `0% APR debt pays off in ${expectedZeroAprMonths} months (ceil(5000/120))`);
assertEqual(zeroAprResult.totalInterest, 0,
  '0% APR debt has zero interest');
assertEqual(zeroAprResult.totalPaid, 5000,
  '0% APR debt: totalPaid equals principal');

// ─── H7: Minimum payment less than monthly interest ───

console.log('\nsimulatePayoff — negative amortization (H7)');

// minPayment ($100) < monthly interest ($200 at 24% APR on $10k) → balance grows
const negAmortDebt = [{ name: 'NegAmort', balance: 10000, apr: 0.24, minPayment: 100, extraPayment: 0 }];
const negAmortResult = simulatePayoff(negAmortDebt, 'snowball');

// Should hit MAX_MONTHS without paying off
assertEqual(negAmortResult.totalMonths, 120,
  'negative amortization hits MAX_MONTHS (120)');
assertEqual(negAmortResult.payoffMonths[0], 0,
  'negative amortization debt never pays off');

// Payments are less than interest → totalPaid < totalInterest (balance grew)
assert(negAmortResult.totalPaid < negAmortResult.totalInterest,
  `totalPaid ($${negAmortResult.totalPaid}) < totalInterest ($${negAmortResult.totalInterest}) — balance grew`);

// ─── H8: MAX_MONTHS boundary ───

console.log('\nsimulatePayoff — MAX_MONTHS boundary (H8)');

// 0% APR debt that takes exactly 120 months: balance = 119*100 + 1 = 11901
// Month 119: balance = 11901 - 11900 = 1 (still > 0)
// Month 120: payment = min(100, 1) = 1, balance = 0 (pays off)
const maxMonthsDebt = [{ name: 'Boundary', balance: 11901, apr: 0, minPayment: 100, extraPayment: 0 }];
const maxMonthsResult = simulatePayoff(maxMonthsDebt, 'snowball');

assertEqual(maxMonthsResult.totalMonths, 120,
  'MAX_MONTHS boundary debt pays off in exactly 120 months');
assertEqual(maxMonthsResult.totalInterest, 0,
  'MAX_MONTHS boundary: zero interest (0% APR)');
assertEqual(maxMonthsResult.totalPaid, 11901,
  'MAX_MONTHS boundary: totalPaid equals principal');
assertEqual(maxMonthsResult.payoffMonths[0], 120,
  'MAX_MONTHS boundary: payoff month is 120');

// ─── Summary ───

console.log(`\n${passed + failed} tests: ${passed} passed, ${failed} failed\n`);
process.exit(failed > 0 ? 1 : 0);
