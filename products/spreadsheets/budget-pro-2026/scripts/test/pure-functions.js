/**
 * Pure functions extracted from build-engine.gs for testing.
 * These are the computation-only functions with no Sheets API dependency.
 */

function simulatePayoff(debts, strategy) {
  if (!debts || debts.length === 0) {
    return { totalMonths: 0, totalInterest: 0, totalPaid: 0, perDebtInterest: [], perDebtMonths: [], payoffMonths: [] };
  }

  const MAX_MONTHS = 120;
  let balances = debts.map(d => d.balance);
  let rates = debts.map(d => d.apr / 12);
  let minimums = debts.map(d => d.minPayment);
  let totalExtra = debts.reduce((sum, d) => sum + (d.extraPayment || 0), 0);

  let totalPaid = 0;
  let totalInterest = 0;
  let months = 0;
  let perDebtInterest = new Array(debts.length).fill(0);
  let perDebtMonths = new Array(debts.length).fill(0);
  let payoffMonths = new Array(debts.length).fill(0);

  for (let month = 1; month <= MAX_MONTHS; month++) {
    let targetIdx = -1;
    let bestValue = strategy === 'snowball' ? Infinity : -Infinity;

    balances.forEach((b, i) => {
      if (b > 0) {
        if (strategy === 'snowball') {
          if (b < bestValue ||
              (b === bestValue && targetIdx >= 0 && debts[i].apr > debts[targetIdx].apr)) {
            bestValue = b;
            targetIdx = i;
          }
        } else if (strategy === 'avalanche') {
          if (debts[i].apr > bestValue ||
              (debts[i].apr === bestValue && targetIdx >= 0 && b < balances[targetIdx])) {
            bestValue = debts[i].apr;
            targetIdx = i;
          }
        }
      }
    });

    let availableSnowball = totalExtra;

    for (let i = 0; i < debts.length; i++) {
      if (balances[i] <= 0) continue;

      let interest = balances[i] * rates[i];
      perDebtInterest[i] += interest;

      let payment = minimums[i];
      if (i === targetIdx) {
        payment += availableSnowball;
      }

      payment = Math.min(payment, balances[i] + interest);

      let principalPaid = payment - interest;
      balances[i] -= principalPaid;
      totalPaid += payment;
      totalInterest += interest;
      perDebtMonths[i] = month;

      if (balances[i] <= 0) {
        balances[i] = 0;
        if (payoffMonths[i] === 0) {
          payoffMonths[i] = month;
        }
        totalExtra += minimums[i];
      }
    }

    months = month;

    if (balances.every(b => b <= 0)) break;
  }

  return {
    totalMonths: months,
    totalInterest: Math.round(totalInterest),
    totalPaid: Math.round(totalPaid),
    perDebtInterest: perDebtInterest.map(i => Math.round(i)),
    perDebtMonths: perDebtMonths,
    payoffMonths: payoffMonths
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
