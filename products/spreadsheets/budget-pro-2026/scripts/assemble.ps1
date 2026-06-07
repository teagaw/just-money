#requires -Version 5.1
<#
.SYNOPSIS
    Assembles the Budget Pro 2026 workbook from 12 CSV templates into a single .xlsx.

.DESCRIPTION
    Reads the 12 CSV files under csv-templates/ in numeric order, creates one
    tab per CSV in the order documented in sheet-architecture.md, and writes a
    single .xlsx at the repo root (or the path passed via -Output).

    Requires the ImportExcel PowerShell module:
        Install-Module ImportExcel -Scope CurrentUser

    Run from the product folder:
        pwsh ./scripts/assemble.ps1

    Or to a custom path:
        pwsh ./scripts/assemble.ps1 -Output ../releases/budget-pro-2026-v1.xlsx

.NOTES
    This script does NOT apply conditional formatting, charts, or the dark-mode
    palette — those are documented in dashboards-design.md and need to be added
    in Excel/Google Sheets after the .xlsx is built. See ../critique.md and
    ./assemble-gsheets.md for the full list of post-import polish steps.
#>

[CmdletBinding()]
param(
    [string]$CsvDir = (Join-Path $PSScriptRoot ".." "csv-templates"),
    [string]$Output = (Join-Path $PSScriptRoot ".." ".." "releases" "budget-pro-2026-v1.xlsx")
)

$ErrorActionPreference = "Stop"

# Sheet order must match sheet-architecture.md
$sheetOrder = @(
    "01-dashboard",
    "02-transactions",
    "03-budget-vs-actual",
    "04-categories",
    "05-accounts",
    "06-goals",
    "07-debt-payoff",
    "08-net-worth",
    "09-subscriptions",
    "10-annual",
    "11-reports",
    "12-tutorial"
)

# 1. Verify ImportExcel is available
if (-not (Get-Module -ListAvailable -Name ImportExcel)) {
    Write-Host "ImportExcel module not found. Install with:" -ForegroundColor Yellow
    Write-Host "    Install-Module ImportExcel -Scope CurrentUser" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Then re-run this script." -ForegroundColor Yellow
    exit 1
}

Import-Module ImportExcel -ErrorAction Stop | Out-Null

# 2. Verify CSV directory and files
if (-not (Test-Path -LiteralPath $CsvDir)) {
    throw "CSV directory not found: $CsvDir"
}
$missing = @()
foreach ($sheet in $sheetOrder) {
    $path = Join-Path $CsvDir "$sheet.csv"
    if (-not (Test-Path -LiteralPath $path)) {
        $missing += $path
    }
}
if ($missing.Count -gt 0) {
    throw "Missing CSV files: $($missing -join ', ')"
}

# 3. Ensure output directory exists
$outputDir = Split-Path -Parent -Path $Output
if (-not (Test-Path -LiteralPath $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir -Force | Out-Null
}

# 4. Build the .xlsx by importing each CSV in order.
#    ImportExcel's -Append flag lets us add tabs to an existing workbook.
Write-Host "Assembling $Output from 12 CSVs..." -ForegroundColor Cyan

# Create the workbook with the first tab
$firstSheet = $sheetOrder[0]
$firstCsv = Join-Path $CsvDir "$firstSheet.csv"
$firstData = Import-Csv -LiteralPath $firstCsv
$firstData | Export-Excel -Path $Output -WorksheetName $sheetOrder[0] -AutoSize -BoldTopRow -FreezeTopRow

# Append the remaining 11 tabs
for ($i = 1; $i -lt $sheetOrder.Count; $i++) {
    $sheet = $sheetOrder[$i]
    $csv = Join-Path $CsvDir "$sheet.csv"
    $data = Import-Csv -LiteralPath $csv
    $data | Export-Excel -Path $Output -WorksheetName $sheet -AutoSize -BoldTopRow -FreezeTopRow -Append
    Write-Host "  + $sheet ($($data.Count) rows)" -ForegroundColor DarkGray
}

Write-Host ""
Write-Host "Built: $Output" -ForegroundColor Green
Write-Host "Tabs in order: $($sheetOrder -join ', ')" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps (manual, in Excel or Google Sheets):" -ForegroundColor Yellow
Write-Host "  1. Apply conditional formatting from ../dashboards-design.md"
Write-Host "  2. Insert the 6 charts from ../dashboards-design.md into the Dashboard tab"
Write-Host "  3. Apply the dark-mode palette from ../data-vocabulary.md"
Write-Host "  4. Tab-color the tabs per the mobile-friendly order in ../setup-guide.md"
Write-Host "  5. Validate formulas by changing a Transactions amount and checking Dashboard updates"
Write-Host "  6. Upload to Google Drive and confirm formulas resolve (some Excel-only functions need replacement)"
