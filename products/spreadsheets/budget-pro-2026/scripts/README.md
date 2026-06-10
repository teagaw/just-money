# Budget Pro 2026

## For Buyers

Your spreadsheet is ready!

**[Setup Guide →](../SETUP-GUIDE.md)** — 2 minutes to get started.

Open the Google Sheet link from your Etsy download, click **File → Make a copy**, and start entering your numbers in the green cells. See your debt-free date instantly.

---

## For Developers

Technical documentation for the Google Apps Script engine.

### Architecture

| Tab | Formulas | Features |
|-----|----------|----------|
| Start Here | 0 formulas | Welcome screen, quick start steps, color legend |
| Scenario Engine | 15+ formulas | 9 inputs, 3 results, comparison table, sensitivity table, cross-tab validation |
| Goals | 10+ formulas | Savings goals with target amounts, deadlines, progress tracking |
| Spendable | 8+ formulas | Daily/weekly spending budget, remaining balance, category limits |
| Budget Tracker | 48+ formulas | 3 income + 8 expense categories, 12 months, totals, savings rate |
| Debt Payoff | 10+ formulas | 4 debt slots, snowball vs avalanche, payoff timeline |
| Instructions | 0 formulas | Quick start, tab guides, FAQ, NPER/EDATE docs |
| Engine (hidden) | 58+ formulas | All NPER/EDATE calculations, comparison logic, sensitivity |

### Sample Data

The script pre-fills realistic sample data:
- **Scenario Engine:** $6,200 income, $3,200 expenses, $8,200 savings, 7.57% APR, $28,200 debt, $590 payment
- **Goals:** Emergency Fund ($5,000/$1,750), Vacation ($2,000/$600), Car Down Payment ($8,000/$2,400), New Laptop ($1,500/$450), Wedding ($15,000/$3,000)
- **Spendable:** Weekly = (income - expenses - debt payment) × 12 ÷ 52; daily = weekly ÷ 7
- **Budget Tracker:** 3 months of income/expense data
- **Debt Payoff:** Chase Visa, Car Loan, Student Loan, Medical Bill

### Testing

```bash
npm test
```

33 tests covering simulatePayoff() and getColumnLetter().

### CI/CD

GitHub Actions runs tests on every push to master. Docker available:

```bash
docker build -t just-money-test .
docker run --rm just-money-test
```

### Troubleshooting

| Issue | Solution |
|-------|----------|
| "Authorization required" | Click Review permissions → Allow |
| "Script not found" | Make sure you pasted the entire script |
| Formulas show errors | Check that all 8 tabs were created |
| Engine tab visible | Right-click tab → Hide sheet |
