# Generates 03-budget-vs-actual.csv
# Reads 02-transactions.csv, aggregates Actual by category+month
# Output: 25 categories x 12 months (Jan-Dec 2026) + YTD

# Hard-code the 25 categories in their canonical order
$cats = @(
  'Housing','Utilities','Phone','Internet','Groceries','Dining','Transport',
  'Insurance','Healthcare','Entertainment','Subscriptions','Personal Care',
  'Clothing','Education','Kids','Pets','Gifts','Charity','Travel',
  'Fitness','Hobbies','Home','Business','Taxes','Other'
)

# Default monthly budget per category (matches data-vocabulary.md defaults)
$defaultBudget = @{
  'Housing'        = 1450
  'Utilities'      = 280   # electric + gas + water combined
  'Phone'          = 55
  'Internet'       = 89
  'Groceries'      = 420
  'Dining'         = 150
  'Transport'      = 120
  'Insurance'      = 180
  'Healthcare'     = 80
  'Entertainment'  = 80
  'Subscriptions'  = 65
  'Personal Care'  = 60
  'Clothing'       = 100
  'Education'      = 50
  'Kids'           = 0
  'Pets'           = 80
  'Gifts'          = 75
  'Charity'        = 50
  'Travel'         = 200
  'Fitness'        = 25
  'Hobbies'        = 50
  'Home'           = 100
  'Business'       = 0     # Business is mostly income; expenses are software/coworking
  'Taxes'          = 425   # quarterly: 0/0/0/425/0/0/0/425/0/0/0/0
  'Other'          = 50
}

# Build Actual dict from transactions
$txPath = 'C:\Users\QQQ\Desktop\JUST MONEY\products\spreadsheets\budget-pro-2026\csv-templates\02-transactions.csv'
$tx = Import-Csv -LiteralPath $txPath

# monthKey -> cat -> total (absolute)
$actual = @{}
foreach ($row in $tx) {
  if ($row.Type -ne 'Expense') { continue }
  $d = [datetime]::Parse($row.Date)
  $key = "$($d.Year)-$($d.Month.ToString('00'))"
  $cat = $row.Category
  $amt = [double]$row.Amount
  if (-not $actual.ContainsKey($key)) { $actual[$key] = @{} }
  if (-not $actual[$key].ContainsKey($cat)) { $actual[$key][$cat] = 0.0 }
  $actual[$key][$cat] += $amt
}

# Build header
$months = 1..12
$header = 'Category'
foreach ($m in $months) {
  $mn = (Get-Culture).DateTimeFormat.GetMonthName($m)
  $header += ",$mn Budget,$mn Actual"
}
$header += ',YTD Budget,YTD Actual,YTD Var,YTD %,Notes'

# Build rows
$rows = New-Object System.Collections.Generic.List[string]
$rows.Add($header)

$totalsBudget = 0.0
$totalsActual = 0.0

foreach ($cat in $cats) {
  $bud = [int]$defaultBudget[$cat]
  $row = $cat
  $ytdBud = 0
  $ytdAct = 0
  foreach ($m in $months) {
    # Quarterly tax: Q1=Mar, Q2=Jun, Q3=Sep, Q4=Dec
    if ($cat -eq 'Taxes') {
      if ($m -in 3,6,9,12) { $mbud = 425 } else { $mbud = 0 }
    } elseif ($cat -eq 'Travel' -and $m -eq 7) {
      $mbud = 800  # vacation bump in July
    } elseif ($cat -eq 'Home' -and $m -eq 9) {
      $mbud = 250  # seasonal repair
    } else {
      $mbud = $bud
    }
    $key = "2026-$($m.ToString('00'))"
    $mact = ''
    if ($actual.ContainsKey($key) -and $actual[$key].ContainsKey($cat)) {
      $mact = [math]::Round($actual[$key][$cat], 2)
    }
    if ($mact -ne '') { $row += ",$mbud,$mact" } else { $row += ",$mbud," }
    $ytdBud += $mbud
    $ytdAct += $mact
  }
  $ytdBudR = [int]$ytdBud
  $ytdActR = [math]::Round($ytdAct, 2)
  $ytdVarR = [int]($ytdBud - $ytdAct)
  $ytdPct = if ($ytdBud -gt 0) { [math]::Round(($ytdAct / $ytdBud) * 100, 1) } else { 0 }
  $row += ",$ytdBudR,$ytdActR,$ytdVarR,$ytdPct%,"
  $rows.Add($row)
  $totalsBudget += $ytdBud
  $totalsActual += $ytdAct
}

# Income + Net rows
$incomeRow = 'INCOME'
$netRow = 'NET (Income - Expense)'
$rateRow = 'SAVINGS RATE %'
foreach ($m in $months) {
  $key = "2026-$($m.ToString('00'))"
  $income = 0
  foreach ($row in $tx) {
    if ($row.Type -ne 'Income') { continue }
    $d = [datetime]::Parse($row.Date)
    if ($d.Year -eq 2026 -and $d.Month -eq $m) {
      $income += [double]$row.Amount
    }
  }
  $incomeR = [math]::Round($income, 2)
  if ($incomeR -gt 0) { $incomeRow += ",,$incomeR" } else { $incomeRow += ",," }
  $netRow += ",,"
  $rateRow += ",,"
}
$incomeTotal = 0.0
foreach ($row in $tx) {
  if ($row.Type -ne 'Income') { continue }
  $d = [datetime]::Parse($row.Date)
  if ($d.Year -eq 2026) { $incomeTotal += [double]$row.Amount }
}
$incomeTotalR = [math]::Round($incomeTotal, 2)
$incomeRow += ",,$incomeTotalR,,,"
$netRow += ",,,,,"
$rateRow += ",,,,"

$rows.Add($incomeRow)
$rows.Add($netRow)
$rows.Add($rateRow)

# Write file
$outPath = 'C:\Users\QQQ\Desktop\JUST MONEY\products\spreadsheets\budget-pro-2026\csv-templates\03-budget-vs-actual.csv'
[System.IO.File]::WriteAllText($outPath, ($rows -join "`n") + "`n", [System.Text.Encoding]::UTF8)
Write-Host "Wrote budget-vs-actual with $($cats.Count) categories to $outPath"
Write-Host "YTD budget: $totalsBudget, YTD actual: $totalsActual"
Write-Host "Income total: $incomeTotalR"
