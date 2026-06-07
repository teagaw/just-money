# Reclassify transactions: Transfer rows get Category=Transfer
$txPath = 'C:\Users\QQQ\Desktop\JUST MONEY\products\spreadsheets\budget-pro-2026\csv-templates\02-transactions.csv'
$tx = Import-Csv -LiteralPath $txPath

$count = 0
foreach ($row in $tx) {
  if ($row.Type -eq 'Transfer') {
    $row.Category = 'Transfer'
    $count++
  }
}

$tx | Export-Csv -LiteralPath $txPath -NoTypeInformation
Write-Host "Reclassified $count Transfer rows"
