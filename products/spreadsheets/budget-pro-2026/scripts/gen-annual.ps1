# Generates 10-annual.csv — year-at-a-glance by category
# Reads budget-vs-actual.csv for actuals; fills blanks for the rest

$cats = @(
  'Housing','Utilities','Phone','Internet','Groceries','Dining','Transport',
  'Insurance','Healthcare','Entertainment','Subscriptions','Personal Care',
  'Clothing','Education','Kids','Pets','Gifts','Charity','Travel',
  'Fitness','Hobbies','Home','Business','Taxes','Other'
)

$groups = @{
  'Housing' = 'Core'; 'Utilities' = 'Core'; 'Phone' = 'Core'; 'Internet' = 'Core'
  'Groceries' = 'Food'; 'Dining' = 'Food'
  'Transport' = 'Transport'
  'Insurance' = 'Core'; 'Healthcare' = 'Health'
  'Entertainment' = 'Lifestyle'; 'Subscriptions' = 'Lifestyle'
  'Personal Care' = 'Lifestyle'; 'Clothing' = 'Lifestyle'
  'Education' = 'Growth'; 'Kids' = 'Family'; 'Pets' = 'Family'
  'Gifts' = 'Giving'; 'Charity' = 'Giving'
  'Travel' = 'Lifestyle'
  'Fitness' = 'Health'; 'Hobbies' = 'Lifestyle'
  'Home' = 'Core'; 'Business' = 'Work'; 'Taxes' = 'Tax'; 'Other' = 'Misc'
}

$notes = @{
  'Housing' = 'Rent - fixed'
  'Utilities' = 'Electric, gas, water - seasonal'
  'Phone' = 'Verizon'
  'Internet' = 'Comcast'
  'Groceries' = 'Cook at home baseline'
  'Dining' = 'Restaurants + takeout'
  'Transport' = 'Gas + rideshare'
  'Insurance' = 'Auto + renters'
  'Healthcare' = 'Copays + pharmacy'
  'Entertainment' = 'Movies + events'
  'Subscriptions' = 'Streaming + software'
  'Personal Care' = 'Haircuts + toiletries'
  'Clothing' = 'Replace as needed'
  'Education' = 'Books + courses'
  'Kids' = 'Niece/nephew gifts + activities'
  'Pets' = 'Food + vet'
  'Gifts' = 'Birthdays + holidays'
  'Charity' = 'Monthly recurring'
  'Travel' = 'Bump in Jul for vacation'
  'Fitness' = 'Gym membership'
  'Hobbies' = 'Climbing + gear'
  'Home' = 'Repairs + cleaning'
  'Business' = 'Coworking day passes'
  'Taxes' = 'Quarterly estimated'
  'Other' = 'Cash, fees, misc'
}

# Read budget-vs-actual to get actuals
$budPath = 'C:\Users\QQQ\Desktop\JUST MONEY\products\spreadsheets\budget-pro-2026\csv-templates\03-budget-vs-actual.csv'
$bud = Import-Csv -LiteralPath $budPath

# Header
$header = 'Category,Group,Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec,Annual Total,Notes'
$rows = @($header)

foreach ($cat in $cats) {
  $catRow = $bud | Where-Object { $_.Category -eq $cat } | Select-Object -First 1
  $row = "$cat,$($groups[$cat])"
  $annual = 0.0
  $monthNames = @('January','February','March','April','May','June','July','August','September','October','November','December')
  foreach ($i in 0..11) {
    $actual = $catRow."$($monthNames[$i]) Actual"
    if ([string]::IsNullOrWhiteSpace($actual)) { $row += ',' } else { $row += ",$actual"; $annual += [double]$actual }
  }
  $row += ",$([math]::Round($annual, 2)),$($notes[$cat])"
  $rows += $row
}

# Totals
$totalRow = 'TOTAL EXPENSES,Computed'
$incomeRow = 'TOTAL INCOME,Computed'
$netRow = 'NET (Income - Expense),Computed'
$rateRow = 'SAVINGS RATE,Computed'

$totalAnnual = 0.0
$incomeAnnual = 0.0
foreach ($i in 0..11) {
  $monthExp = 0.0
  $monthInc = 0.0
  foreach ($cat in $cats) {
    $catRow = $bud | Where-Object { $_.Category -eq $cat } | Select-Object -First 1
    $actual = $catRow."$($monthNames[$i]) Actual"
    if (-not [string]::IsNullOrWhiteSpace($actual)) { $monthExp += [double]$actual }
  }
  $totalRow += ",$([math]::Round($monthExp, 2))"
  $totalAnnual += $monthExp
  # income from INCOME row
  $incRow = $bud | Where-Object { $_.Category -eq 'INCOME' } | Select-Object -First 1
  $inc = $incRow."$($monthNames[$i]) Actual"
  if ([string]::IsNullOrWhiteSpace($inc)) { $incomeRow += ',' } else { $incomeRow += ",$inc"; $monthInc = [double]$inc; $incomeAnnual += [double]$inc }
}

$totalRow += ",$([math]::Round($totalAnnual, 2)),"
$incomeRow += ",$([math]::Round($incomeAnnual, 2)),"
$netVal = $incomeAnnual - $totalAnnual
$rateVal = if ($incomeAnnual -gt 0) { ($netVal / $incomeAnnual) * 100 } else { 0 }
$netRow += ",$([math]::Round($netVal, 2)),"
$rateRow += ",$([math]::Round($rateVal, 1))%,"

$rows += $totalRow
$rows += $incomeRow
$rows += $netRow
$rows += $rateRow

$outPath = 'C:\Users\QQQ\Desktop\JUST MONEY\products\spreadsheets\budget-pro-2026\csv-templates\10-annual.csv'
[System.IO.File]::WriteAllText($outPath, ($rows -join "`n") + "`n", [System.Text.Encoding]::UTF8)
Write-Host "Wrote annual CSV with $($cats.Count) categories"
Write-Host "Total expense: $totalAnnual"
Write-Host "Total income: $incomeAnnual"
Write-Host "Net: $netVal"
Write-Host "Savings rate: $rateVal%"
