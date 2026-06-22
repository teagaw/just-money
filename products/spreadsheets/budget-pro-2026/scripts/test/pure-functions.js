/**
 * Pure functions extracted from build-engine.gs for testing.
 * These are the computation-only functions with no Sheets API dependency.
 *
 * SYNC: simulatePayoff() is a copy of the production version in
 * scripts/build-engine.gs (C4 consolidation). When modifying
 * simulatePayoff() in build-engine.gs, update this copy to match.
 * GAS cannot use ES module imports, so both files must be kept in sync.
 */

function simulatePayoff(debts, strategy) {
  // debts: array of {name, balance, apr, minPayment}
  // strategy: 'snowball' (smallest balance first) or 'avalanche' (highest APR first)
  if (!debts || debts.length === 0) {
    return { totalMonths: 0, totalInterest: 0, totalPaid: 0, perDebtInterest: [], perDebtMonths: [], payoffMonths: [], converged: true, convergedPerDebt: [] };
  }

  const MAX_MONTHS = 120; // 10 year cap
  let balances = debts.map(d => d.balance);
  let rates = debts.map(d => d.apr / 12); // monthly rate
  let minimums = debts.map(d => d.minPayment);
  let totalExtraBaseSnowball = debts.reduce((sum, d) => sum + (d.extraPayment || 0), 0);

  let totalPaid = 0;
  let totalInterest = 0;
  let months = 0;
  let perDebtInterest = new Array(debts.length).fill(0);
  let perDebtMonths = new Array(debts.length).fill(0);
  let payoffMonths = new Array(debts.length).fill(0);
  let convergedPerDebt = new Array(debts.length).fill(false);

  // Helper: find next target debt index based on strategy
  function findTargetDebt(balances, debts, strategy) {
    let targetIdx = -1;
    let bestValue = strategy === 'snowball' ? Infinity : -Infinity;

    balances.forEach((b, i) => {
      if (b > 0) {
        if (strategy === 'snowball') {
          // Primary: smallest balance. Tiebreaker: higher APR (avalanche within snowball)
          if (b < bestValue ||
              (b === bestValue && targetIdx >= 0 && debts[i].apr > debts[targetIdx].apr)) {
            bestValue = b;
            targetIdx = i;
          }
        } else if (strategy === 'avalanche') {
          // Primary: highest APR. Tiebreaker: smaller balance
          if (debts[i].apr > bestValue ||
              (debts[i].apr === bestValue && targetIdx >= 0 && b < balances[targetIdx])) {
            bestValue = debts[i].apr;
            targetIdx = i;
          }
        }
      }
    });
    return targetIdx;
  }

  for (let month = 1; month <= MAX_MONTHS; month++) {
    // 1. Calculate monthly interest for all active debts
    let monthlyInterest = [];
    let totalMinimumsRequired = 0;

    for (let i = 0; i < debts.length; i++) {
      if (balances[i] > 0) {
        monthlyInterest[i] = balances[i] * rates[i];
        balances[i] += monthlyInterest[i]; // Add interest to balance first
        totalMinimumsRequired += minimums[i];
      } else {
        monthlyInterest[i] = 0;
      }
    }

    // 2. Establish total available cash pool for this month
    let cashPool = totalExtraBaseSnowball + totalMinimumsRequired;

    // 3. Pay minimums first to keep accounts in good standing
    for (let i = 0; i < debts.length; i++) {
      if (balances[i] <= 0) continue;
      let minPayment = Math.min(minimums[i], balances[i]);
      balances[i] -= minPayment;
      cashPool -= minPayment;
      if (balances[i] <= 0) {
        balances[i] = 0;
        perDebtMonths[i] = month;
        if (payoffMonths[i] === 0) {
          payoffMonths[i] = month;
        }
        convergedPerDebt[i] = true;
      }
    }

    // 4. Aggressively deploy remaining cash pool sequentially to priority targets
    while (cashPool > 0 && balances.some(b => b > 0)) {
      let targetIdx = findTargetDebt(balances, debts, strategy);
      if (targetIdx === -1) break;

      let extraPayment = Math.min(cashPool, balances[targetIdx]);
      balances[targetIdx] -= extraPayment;
      cashPool -= extraPayment;

      if (balances[targetIdx] <= 0) {
        balances[targetIdx] = 0;
        perDebtMonths[targetIdx] = month;
        if (payoffMonths[targetIdx] === 0) {
          payoffMonths[targetIdx] = month;
        }
        convergedPerDebt[targetIdx] = true;
      }
    }

    // Track interest for the month
    for (let i = 0; i < debts.length; i++) {
      if (monthlyInterest[i] > 0) {
        perDebtInterest[i] += monthlyInterest[i];
        totalInterest += monthlyInterest[i];
      }
    }

    // Track payments for the month
    // Total payment = minimums paid + extra paid from cash pool
    // Since we drained cashPool, the amount used is totalExtraBaseSnowball + totalMinimumsRequired - cashPool
    let paymentsThisMonth = totalExtraBaseSnowball + totalMinimumsRequired - cashPool;
    totalPaid += paymentsThisMonth;

    months = month;

    // Stop if all debts paid
    if (balances.every(b => b <= 0)) break;
  }

  const converged = balances.every(b => b <= 0);

  return {
    totalMonths: months,
    totalInterest: Math.round(totalInterest),
    totalPaid: Math.round(totalPaid),
    perDebtInterest: perDebtInterest.map(i => Math.round(i)),
    perDebtMonths: perDebtMonths,
    payoffMonths: payoffMonths,
    converged: converged,
    convergedPerDebt: convergedPerDebt
  };
}

function getColumnLetter(col) {
  let letter = "";
  while (col > 0) {
    const mod = (col - 1) % 26;
    letter = String.fromCharCode(65 + mod) + letter;
    col = Math.floor((col - mod - 1) / 26);
  }
  return letter;
}

export { simulatePayoff, getColumnLetter };
