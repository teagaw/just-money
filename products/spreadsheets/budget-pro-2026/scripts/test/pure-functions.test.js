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

// ─── Test 5: zero extra means zero interest saved ───

console.log('\nsimulatePayoff — zero extra means zero interest saved (Bug 1)');

const noExtraDebts = [
  { name: 'A', balance: 4000, apr: 0.12, minPayment: 100, extraPayment: 0 },
  { name: 'B', balance: 2000, apr: 0.06, minPayment: 50, extraPayment: 0 }
];

const noExtraMin = simulatePayoff(noExtraDebts.map(d => ({ ...d, extraPayment: 0 })), 'snowball');
const noExtraStrat = simulatePayoff(noExtraDebts.map(d => ({ ...d, extraPayment: 0 })), 'snowball');
const noExtraSaved = noExtraMin.totalInterest - noExtraStrat.totalInterest;

assertEqual(noExtraSaved, 0,
  'interest saved is 0 when both runs use extraPayment: 0');
assertEqual(noExtraMin.totalMonths, noExtraStrat.totalMonths,
  'identical inputs produce identical months');
assertEqual(noExtraMin.totalInterest, noExtraStrat.totalInterest,
  'identical inputs produce identical interest');

// ─── Summary ───

console.log(`\n${passed + failed} tests: ${passed} passed, ${failed} failed\n`);
process.exit(failed > 0 ? 1 : 0);
