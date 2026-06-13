/**
 * Budget Pro 2026 — Google Apps Script Builder
 *
 * This script creates the entire Budget Pro 2026 spreadsheet:
 * - 8 tabs (Start Here, Scenario Engine, Budget Tracker, Debt Payoff, Goals, Instructions, Spendable, Engine)
 * - 58+ formulas in the hidden Engine tab
 * - Data validation, conditional formatting, protection
 * - Sample data pre-filled
 *
 * HOW TO USE:
 * 1. Create a new Google Sheet
 * 2. Go to Extensions → Apps Script
 * 3. Paste this entire script
 * 4. Run `buildBudgetPro2026()`
 * 5. Authorize when prompted
 * 6. The spreadsheet will be built automatically
 *
 * CUSTOM MENU:
 * After pasting, refresh the spreadsheet. A "Budget Pro" menu will appear.
 * Use the menu to rebuild at any time.
 */

/**
 * Creates the custom menu when the spreadsheet opens.
 * This is the primary entry point for rebuilds.
 */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("Budget Pro")
    .addItem("Build / Rebuild Spreadsheet", "buildBudgetPro2026")
    .addItem("Recalculate Debt Simulation", "recalculateDebtSimulation")
    .addItem("About Budget Pro 2026", "showAbout")
    .addToUi();
}

/**
 * Shows an "About" dialog with product info.
 */
function showAbout() {
  SpreadsheetApp.getUi().alert(
    "Budget Pro 2026 — by Just Money",
    "Version 2.0.0\n\n" +
    "Premium financial tools you own once.\n" +
    "No subscriptions, no guilt, no BS.\n\n" +
    "Features: NPER scenario planning, amortization simulation, " +
    "inflation modeling, and spendable budgeting.\n\n" +
    "Built with love by Just Money.",
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}

function buildBudgetPro2026() {
  Logger.log("Starting Budget Pro 2026 build...");

  let ss;
  try {
    ss = SpreadsheetApp.getActiveSpreadsheet();
    if (!ss) {
      ss = SpreadsheetApp.create("Budget Pro 2026");
      Logger.log("Created new spreadsheet: " + ss.getUrl());
    } else {
      Logger.log("Using existing spreadsheet: " + ss.getName());
    }
  } catch (e) {
    Logger.log("ERROR getting spreadsheet: " + e.message);
    return;
  }

  // Clean up ghost tabs left behind by previous failed builds
  const ghostsCleaned = cleanGhostTabs(ss);
  if (ghostsCleaned > 0) {
    Logger.log("Cleaned " + ghostsCleaned + " ghost tab(s) from previous build");
  }

  ss.rename("Budget Pro 2026");

  // ── IDEMPOTENCY GUARD ──
  // If the Engine tab already exists, the spreadsheet was previously built.
  // Log and proceed — safeReplace() will handle overwriting safely.
  const existingEngine = ss.getSheetByName("Engine");
  if (existingEngine) {
    Logger.log("Engine tab already exists — will be replaced during rebuild.");
  }

  // Create all tabs
  Logger.log("Creating tabs...");
  const tabs = createTabs(ss);
  Logger.log("Tabs created: " + Object.keys(tabs).join(", "));

  // Build each tab
  const tabBuilders = [
    { name: "Start Here", fn: () => buildStartHereTab(tabs.startHere) },
    { name: "Engine", fn: () => buildEngineTab(tabs.engine) },
    { name: "Scenario Engine", fn: () => buildScenarioEngineTab(tabs.scenario) },
    { name: "Budget Tracker", fn: () => buildBudgetTrackerTab(tabs.budget) },
    { name: "Debt Payoff", fn: () => buildDebtPayoffTab(tabs.debt) },
    { name: "Goals", fn: () => buildGoalsTab(tabs.goals) },
    { name: "Spendable", fn: () => buildSpendableTab(tabs.spendable) },
    { name: "Instructions", fn: () => buildInstructionsTab(tabs.instructions) }
  ];

  const failures = [];
  for (const tab of tabBuilders) {
    try {
      Logger.log("Building " + tab.name + " tab...");
      tab.fn();
    } catch (e) {
      Logger.log("ERROR building " + tab.name + " tab: " + e.message);
      Logger.log(e.stack);
      failures.push(tab.name);
    }
  }
  if (failures.length > 0) {
    Logger.log("BUILD INCOMPLETE — failed tabs: " + failures.join(", "));
  }

  // Run debt simulation now (onEdit doesn't fire from script)
  Logger.log("Running initial debt simulation...");
  recalculateDebtSimulation();

  // Apply protection and hide Engine tab
  Logger.log("Applying protection...");
  applyProtection(ss, tabs);

  // Set tab colors (Just Money brand palette)
  tabs.startHere.setTabColor("#0D7C5F");     // Money Green
  tabs.scenario.setTabColor("#0D7C5F");      // Money Green
  tabs.budget.setTabColor("#2563EB");        // Ocean Blue
  tabs.debt.setTabColor("#DC2626");          // Alert Red
  tabs.goals.setTabColor("#D4AF37");         // Soft Gold
  tabs.spendable.setTabColor("#E8F5E9");     // Light Sage
  tabs.instructions.setTabColor("#6B7280");  // Warm Gray
  tabs.engine.setTabColor("#1A1A2E");        // Deep Charcoal

  // Set explicit tab order for all 8 tabs
  ss.setActiveSheet(tabs.startHere);
  ss.moveActiveSheet(1);
  ss.setActiveSheet(tabs.scenario);
  ss.moveActiveSheet(2);
  ss.setActiveSheet(tabs.budget);
  ss.moveActiveSheet(3);
  ss.setActiveSheet(tabs.goals);
  ss.moveActiveSheet(4);
  ss.setActiveSheet(tabs.debt);
  ss.moveActiveSheet(5);
  ss.setActiveSheet(tabs.spendable);
  ss.moveActiveSheet(6);
  ss.setActiveSheet(tabs.instructions);
  ss.moveActiveSheet(7);
  ss.setActiveSheet(tabs.engine);
  ss.moveActiveSheet(8);

  SpreadsheetApp.flush();
  Logger.log("Budget Pro 2026 built successfully! URL: " + ss.getUrl());
}

function buildStartHereTab(sheet) {
  sheet.clear();

  const HEADER_COLOR = "#1A1A2E";   // Deep Charcoal
  const SECONDARY_COLOR = "#6B7280"; // Warm Gray
  const accentColor = "#0D7C5F";   // Money Green
  const lightBg = "#E8F5E9";       // Light Sage

  // BRAND
  sheet.getRange("A1").setValue("JUST MONEY")
    .setFontSize(10).setFontWeight("bold").setFontColor(accentColor)
    .setLetterSpacing(2);

  // TITLE
  sheet.getRange("A3").setValue("Welcome to Budget Pro 2026")
    .setFontSize(24).setFontWeight("bold").setFontColor(HEADER_COLOR);

  // SUBTITLE
  sheet.getRange("A4").setValue("Premium financial tools you own once. No subscriptions, no guilt, no BS.")
    .setFontSize(12).setFontStyle("italic").setFontColor(SECONDARY_COLOR);

  // SEPARATOR
  sheet.getRange("A6").setValue("—")
    .setFontColor(SECONDARY_COLOR);

  // GETTING STARTED SECTION
  sheet.getRange("A8").setValue("GETTING STARTED")
    .setFontSize(14).setFontWeight("bold").setFontColor(HEADER_COLOR);

  // STEP 1
  sheet.getRange("A9").setValue("Step 1: Open the Scenario Engine tab")
    .setFontSize(12).setFontWeight("bold").setFontColor(HEADER_COLOR);
  sheet.getRange("A10").setValue("Enter your 9 numbers in the green cells. That's it.")
    .setFontSize(10).setFontColor(SECONDARY_COLOR);

  // STEP 2
  sheet.getRange("A11").setValue("Step 2: Check your results")
    .setFontSize(12).setFontWeight("bold").setFontColor(HEADER_COLOR);
  sheet.getRange("A12").setValue("See when you'll be debt-free and how much interest you'll save.")
    .setFontSize(10).setFontColor(SECONDARY_COLOR);

  // STEP 3
  sheet.getRange("A13").setValue("Step 3: Try different scenarios")
    .setFontSize(12).setFontWeight("bold").setFontColor(HEADER_COLOR);
  sheet.getRange("A14").setValue("Change the numbers. See what happens. Find your best plan.")
    .setFontSize(10).setFontColor(SECONDARY_COLOR);

  // SEPARATOR
  sheet.getRange("A16").setValue("—")
    .setFontColor(SECONDARY_COLOR);

  // MOTIVATIONAL MESSAGE
  sheet.getRange("A18").setValue("You don't need to be perfect. You just need to start.")
    .setFontSize(12).setFontStyle("italic").setFontColor(accentColor);

  // HELPFUL NOTES
  sheet.getRange("A20").setValue("Green cells = edit these. Blue cells = results (don't edit).")
    .setFontSize(9).setFontColor(SECONDARY_COLOR);
  sheet.getRange("A21").setValue("If you get stuck, check the Instructions tab.")
    .setFontSize(9).setFontColor(SECONDARY_COLOR);

  // FOOTER
  sheet.getRange("A23").setValue("Built with love by Just Money")
    .setFontSize(9).setFontStyle("italic").setFontColor(SECONDARY_COLOR);

  // FORMATTING
  sheet.setColumnWidth(1, 500);
  sheet.setTabColor("#0D7C5F");

  // Freeze row 1
  sheet.setFrozenRows(1);
}

function createTabs(ss) {
  Logger.log("Creating tabs...");

  // Safe per-tab replacement: insert a temp sheet first, delete the existing
  // sheet, then rename the temp to the target name.  This avoids Google's
  // "cannot delete all sheets" error because we never go below 1 sheet.
  function safeReplace(name) {
    const existing = ss.getSheetByName(name);
    if (existing) {
      const tempName = "_TEMP_" + Date.now();
      const temp = ss.insertSheet(tempName);
      ss.deleteSheet(existing);
      Logger.log("Deleted existing '" + name + "' tab");
      temp.setName(name);
      Logger.log("Created " + name + " tab");
      return temp;
    }
    const sheet = ss.insertSheet(name);
    Logger.log("Created " + name + " tab");
    return sheet;
  }

  const startHere     = safeReplace("Start Here");
  const engine       = safeReplace("Engine");
  const instructions  = safeReplace("Instructions");
  const spendable     = safeReplace("Spendable");
  const debt          = safeReplace("Debt Payoff");
  const goals         = safeReplace("Goals");
  const budget        = safeReplace("Budget Tracker");
  const scenario      = safeReplace("Scenario Engine");

  // Delete default Sheet1 if it still exists
  const defaultSheet = ss.getSheetByName("Sheet1");
  if (defaultSheet && ss.getSheets().length > 1) {
    ss.deleteSheet(defaultSheet);
    Logger.log("Deleted Sheet1");
  }

  Logger.log("All tabs created successfully");
  return { startHere, scenario, budget, goals, debt, instructions, spendable, engine };
}

/**
 * Removes leftover ghost tabs from previous failed builds.
 * safeReplace() creates _TEMP_ prefixed sheets; if the script errors mid-rebuild,
 * those sheets persist permanently and confuse buyers.  This function cleans them up
 * at the start of each build.
 *
 * @param {GoogleAppsScript.Spreadsheet.Spreadsheet} ss - The active spreadsheet
 * @returns {number} Count of deleted ghost tabs
 */
function cleanGhostTabs(ss) {
  const sheets = ss.getSheets();
  let cleaned = 0;
  for (const sheet of sheets) {
    const name = sheet.getName();
    if (name.startsWith('_TEMP_') || name.startsWith('_DEL_')) {
      try {
        ss.deleteSheet(sheet);
        Logger.log('Cleaned ghost tab: ' + name);
        cleaned++;
      } catch (e) {
        Logger.log('Could not delete ghost tab: ' + name + ' — ' + e.message);
      }
    }
  }
  return cleaned;
}

// Helper constants and functions
const INPUT_BG = "#DCFCE7";
const INPUT_BORDER = "#0D7C5F";  // Money Green
const HEADER_COLOR = "#0F172A";
const SECONDARY_COLOR = "#64748B";

/**
 * Styles a cell as an editable input: green background, green border, number format.
 * Adds data validation to ensure numeric input.
 */
function styleInputCell(cell, value, format, validation) {
  cell.setValue(value)
    .setBackground(INPUT_BG)
    .setBorder(true, true, true, true, false, false, INPUT_BORDER, SpreadsheetApp.BorderStyle.SOLID)
    .setFontSize(10);
  if (format) cell.setNumberFormat(format);
  
  // Add data validation if specified
  if (validation) {
    const rule = SpreadsheetApp.newDataValidation()
      .setAllowInvalid(false)
      .setHelpText(validation.helpText)
      .build();
    
    if (validation.min !== undefined && validation.max !== undefined) {
      rule.requireNumberBetween(validation.min, validation.max);
    } else if (validation.min !== undefined) {
      rule.requireNumberGreaterThan(validation.min - 1);
    } else if (validation.max !== undefined) {
      rule.requireNumberLessThan(validation.max + 1);
    }
    
    cell.setDataValidation(rule);
  }
}

/**
 * Creates a warning-only protection on a range.
 */
function protectRange(sheet, range, description) {
  try {
    const p = sheet.getRange(range).protect();
    p.setDescription(description);
    p.setWarningOnly(true);
  } catch (e) {
    Logger.log("Protection skipped for " + range + ": " + e.message);
  }
}

// SYNC: A test-only copy of this function exists in scripts/test/pure-functions.js.
// When modifying simulatePayoff(), update both files to stay in sync.
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
  let totalExtra = debts.reduce((sum, d) => sum + (d.extraPayment || 0), 0);
  
  let totalPaid = 0;
  let totalInterest = 0;
  let months = 0;
  let perDebtInterest = new Array(debts.length).fill(0);
  let perDebtMonths = new Array(debts.length).fill(0);
  let payoffMonths = new Array(debts.length).fill(0);
  let convergedPerDebt = new Array(debts.length).fill(false);
  
  for (let month = 1; month <= MAX_MONTHS; month++) {
    // Find target debt (smallest balance for snowball, highest APR for avalanche)
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
    
    // Available snowball = total extra payments
    let availableSnowball = totalExtra;
    
    // Apply payments
    for (let i = 0; i < debts.length; i++) {
      if (balances[i] <= 0) continue;
      
      // Calculate interest
      let interest = balances[i] * rates[i];
      perDebtInterest[i] += interest;
      
      // Determine payment
      let payment = minimums[i];
      if (i === targetIdx) {
        payment += availableSnowball;
      }
      
      // Don't overpay
      payment = Math.min(payment, balances[i] + interest);
      
      // Apply payment
      let principalPaid = payment - interest;
      balances[i] -= principalPaid;
      totalPaid += payment;
      totalInterest += interest;
      perDebtMonths[i] = month;
      
      // If debt paid off, record payoff month and redistribute minimum
      if (balances[i] <= 0) {
        balances[i] = 0;
        if (payoffMonths[i] === 0) {
          payoffMonths[i] = month;
        }
        convergedPerDebt[i] = true;
        totalExtra += minimums[i]; // freed-up minimum rolls into snowball
      }
    }
    
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

function buildEngineTab(sheet) {
  sheet.clear();

  sheet.getRange("A1").setValue("ENGINE (HIDDEN — DO NOT EDIT)").setFontSize(14).setFontWeight("bold");

  // A2: Visible warning when income <= expenses
  sheet.getRange("A2").setFormula(
    '=IF(\'Scenario Engine\'!B4<=\'Scenario Engine\'!B5,"⚠ WARNING: Income must exceed expenses for these results to be meaningful","")'
  ).setFontWeight("bold").setFontSize(11).setFontColor("#DC2626");

  sheet.getRange("A3").setValue("✦ PAYOFF CALCULATOR FORMULAS").setFontWeight("bold");

  // B2: Months to debt-free (NPER for debt payoff)
  sheet.getRange("A4").setValue("Months to freedom");
  sheet.getRange("B2").setFormula(
    '=IF(\'Scenario Engine\'!B4<=\'Scenario Engine\'!B5,"⚠ N/A — Income must exceed expenses",IF(\'Scenario Engine\'!B8<=0,"Already free!",IF(\'Scenario Engine\'!B7=0,ROUNDUP((\'Scenario Engine\'!B6-\'Scenario Engine\'!B8)/(\'Scenario Engine\'!B4-\'Scenario Engine\'!B5-\'Scenario Engine\'!B9),0),IFERROR(ABS(ROUNDUP(NPER((\'Scenario Engine\'!B7-\'Scenario Engine\'!B10)/12,-(\'Scenario Engine\'!B4-\'Scenario Engine\'!B5-\'Scenario Engine\'!B9),(\'Scenario Engine\'!B6-\'Scenario Engine\'!B8)),0)),"Check inputs"))))'
  );

  // B3: Freedom date
  sheet.getRange("A5").setValue("Freedom date");
  sheet.getRange("B3").setFormula(
    '=IF(B2="Already free!","Already free!",IF(B2="Check inputs","Check inputs",IFERROR(IF(ISNUMBER(B2),EDATE(TODAY(),B2),B2),"Check inputs")))'
  );

  // B4: Total interest saved = (min months − strategy months) × payment
  sheet.getRange("A6").setValue("Interest saved");
  sheet.getRange("B4").setFormula(
    '=IF(\'Scenario Engine\'!B4<=\'Scenario Engine\'!B5,0,IFERROR(MAX(0,B7-B22),0))'
  );

  sheet.getRange("A7").setValue("✦ COMPARISON FORMULAS").setFontWeight("bold");

  // B6: Minimum-only months (debt payoff with minimum payments only)
  sheet.getRange("A8").setValue("Min-only months");
  sheet.getRange("B6").setFormula(
    '=IF(\'Scenario Engine\'!B8<=0,"Already free!",IF(\'Scenario Engine\'!B7=0,ROUNDUP(\'Scenario Engine\'!B8/\'Scenario Engine\'!B9,0),IFERROR(ABS(ROUNDUP(NPER(\'Scenario Engine\'!B7/12,-\'Scenario Engine\'!B9,\'Scenario Engine\'!B8),0)),"Check inputs")))'
  );

  // B7: Minimum-only interest
  sheet.getRange("A9").setValue("Min-only interest");
  sheet.getRange("B7").setFormula(
    '=IF(B6="Already free!",0,IF(B6="Check inputs","N/A",IFERROR(B6*\'Scenario Engine\'!B9-\'Scenario Engine\'!B8,0)))'
  );

  // B8: Minimum-only freedom date
  sheet.getRange("A10").setValue("Min-only freedom date");
  sheet.getRange("B8").setFormula(
    '=IF(B6="Already free!","Already free!",IF(B6="Check inputs","N/A",IF(B6=0,"120+ months",IFERROR(EDATE(TODAY(),B6),"N/A"))))'
  );

  // B9: Extra custom #1 months (minimum payment + custom #1 extra)
  sheet.getRange("A11").setFormula("=\"Extra $\"&'Scenario Engine'!B11&\" months\"");
  sheet.getRange("B9").setFormula(
    '=IF(\'Scenario Engine\'!B8<=0,"Already free!",IF(\'Scenario Engine\'!B7=0,ROUNDUP(\'Scenario Engine\'!B8/(\'Scenario Engine\'!B9+\'Scenario Engine\'!B11),0),IFERROR(ABS(ROUNDUP(NPER(\'Scenario Engine\'!B7/12,-(\'Scenario Engine\'!B9+\'Scenario Engine\'!B11),\'Scenario Engine\'!B8),0)),"Check inputs")))'
  );

  // B10: Extra custom #1 interest saved (vs min-only baseline)
  sheet.getRange("A12").setFormula("=\"Extra $\"&'Scenario Engine'!B11&\" saved\"");
  sheet.getRange("B10").setFormula(
    '=IF(B9="Already free!",0,IF(B9="Check inputs","N/A",IFERROR(B6*\'Scenario Engine\'!B9-B9*(\'Scenario Engine\'!B9+\'Scenario Engine\'!B11),0)))'
  );

  // B11: Extra custom #1 freedom date
  sheet.getRange("A13").setFormula("=\"Extra $\"&'Scenario Engine'!B11&\" freedom date\"");
  sheet.getRange("B11").setFormula(
    '=IF(B9="Already free!","Already free!",IF(B9="Check inputs","N/A",IF(B9=0,"120+ months",IFERROR(EDATE(TODAY(),B9),"N/A"))))'
  );

  // B12: Extra custom #2 months (minimum payment + custom #2 extra)
  sheet.getRange("A14").setFormula("=\"Extra $\"&'Scenario Engine'!B12&\" months\"");
  sheet.getRange("B12").setFormula(
    '=IF(\'Scenario Engine\'!B8<=0,"Already free!",IF(\'Scenario Engine\'!B7=0,ROUNDUP(\'Scenario Engine\'!B8/(\'Scenario Engine\'!B9+\'Scenario Engine\'!B12),0),IFERROR(ABS(ROUNDUP(NPER(\'Scenario Engine\'!B7/12,-(\'Scenario Engine\'!B9+\'Scenario Engine\'!B12),\'Scenario Engine\'!B8),0)),"Check inputs")))'
  );

  // B13: Extra custom #2 interest saved (vs min-only baseline)
  sheet.getRange("A15").setFormula("=\"Extra $\"&'Scenario Engine'!B12&\" saved\"");
  sheet.getRange("B13").setFormula(
    '=IF(B12="Already free!",0,IF(B12="Check inputs","N/A",IFERROR(B6*\'Scenario Engine\'!B9-B12*(\'Scenario Engine\'!B9+\'Scenario Engine\'!B12),0)))'
  );

  // B14: Extra custom #2 freedom date
  sheet.getRange("A16").setFormula("=\"Extra $\"&'Scenario Engine'!B12&\" freedom date\"");
  sheet.getRange("B14").setFormula(
    '=IF(B12="Already free!","Already free!",IF(B12="Check inputs","N/A",IF(B12=0,"120+ months",IFERROR(EDATE(TODAY(),B12),"N/A"))))'
  );

  sheet.getRange("A18").setValue("✦ DEBT PAYOFF FORMULAS").setFontWeight("bold");

  // PAYOFF ORDER HELPER COLUMNS (E=Snowball rank, F=Avalanche rank)
  // Snowball: rank by balance ASCENDING (smallest first)
  for (let i = 0; i < 4; i++) {
    const row = i + 2;
    const debtRow = i + 5;
    // E: Snowball rank (1=smallest balance)
    sheet.getRange(`E${row}`).setFormula(
      `=RANK('Debt Payoff'!B${debtRow},'Debt Payoff'!B5:B8,1)`
    );
    // F: Avalanche rank (1=highest APR)
    sheet.getRange(`F${row}`).setFormula(
      `=RANK('Debt Payoff'!C${debtRow},'Debt Payoff'!C5:C8,0)`
    );
  }

  // CASCADING PAYMENT COLUMNS (G=Snowball cascade, H=Avalanche cascade)
  // G: For each debt, sum payments from all debts with LOWER snowball rank (paid off earlier)
  for (let i = 0; i < 4; i++) {
    const row = i + 2;
    const debtRow = i + 5;
    // G: Snowball cascading payment = this debt's min+extra + sum of payments from debts paid before it
    sheet.getRange(`G${row}`).setFormula(
      `=('Debt Payoff'!D${debtRow}+'Debt Payoff'!E${debtRow})+SUMPRODUCT(('Debt Payoff'!D5:D8+'Debt Payoff'!E5:E8)*(E2:E5<E${row}))`
    );
    // H: Avalanche cascading payment = this debt's min+extra + sum of payments from debts paid before it
    sheet.getRange(`H${row}`).setFormula(
      `=('Debt Payoff'!D${debtRow}+'Debt Payoff'!E${debtRow})+SUMPRODUCT(('Debt Payoff'!D5:D8+'Debt Payoff'!E5:E8)*(F2:F5<F${row}))`
    );
  }

  // AMORTIZATION SIMULATION RESULTS
  // B20-B25 and C2:D5 are written by recalculateDebtSimulation() (live data).

  // CROSS-TAB CHECK (rows 28-30)
  sheet.getRange("A27").setValue("✦ CROSS-TAB CHECK").setFontWeight("bold");

  // B28: Weighted APR from debts
  sheet.getRange("A28").setValue("Weighted APR from debts");
  sheet.getRange("B28").setFormula(
    "=IF(SUM('Debt Payoff'!B5:B8)=0,0,SUMPRODUCT('Debt Payoff'!B5:B8,'Debt Payoff'!C5:C8)/SUM('Debt Payoff'!B5:B8))"
  );

  // B29: User's entered APR
  sheet.getRange("A29").setValue("User's entered APR");
  sheet.getRange("B29").setFormula("='Scenario Engine'!B9");

  // B30: Match check
  sheet.getRange("A30").setValue("Match check");
  sheet.getRange("B30").setFormula(
    '=IF(ABS(B28-B29)<0.0001,"✓ Match","⚠ Check APR — doesn\'t match Debt Payoff tab")'
  );

  sheet.getRange("A32").setValue("✦ INFLATION-ADJUSTED").setFontWeight("bold");

  // B32: Months to debt-free using nominal APR (B9) instead of real rate (B9-B12).
  // Same surplus and net position as B2 — only the rate differs.
  sheet.getRange("A33").setValue("Nominal rate (no inflation)");
  sheet.getRange("B32").setFormula(
    '=IF(\'Scenario Engine\'!B10<=0,"Already free!",IF(\'Scenario Engine\'!B9=0,ROUNDUP((\'Scenario Engine\'!B8-\'Scenario Engine\'!B10)/(\'Scenario Engine\'!B6-\'Scenario Engine\'!B7-\'Scenario Engine\'!B11),0),IFERROR(ABS(ROUNDUP(NPER(\'Scenario Engine\'!B9/12,-(\'Scenario Engine\'!B6-\'Scenario Engine\'!B7-\'Scenario Engine\'!B11),(\'Scenario Engine\'!B8-\'Scenario Engine\'!B10)),0)),"N/A")))'
  );

  // B33: Inflation-adjusted interest (real-rate payment × months − debt)
  sheet.getRange("A34").setValue("Inflation-adjusted interest");
  sheet.getRange("B33").setFormula(
    '=IF(B32="Already free!",0,IF(B32="N/A","N/A",IFERROR(B32*\'Scenario Engine\'!B11-\'Scenario Engine\'!B10,0)))'
  );

  // B34: Nominal rate freedom date
  sheet.getRange("A35").setValue("Nominal rate freedom date");
  sheet.getRange("B34").setFormula(
    '=IF(B32="Already free!","Already free!",IF(B32="Check inputs","N/A",IF(B32=0,"120+ months",IFERROR(EDATE(TODAY(),B32),"N/A"))))'
  );

  // Nominal rate comparison note
  sheet.getRange("A36").setValue("⚠ Note:").setFontWeight("bold").setFontColor("#666666").setFontSize(9);
  sheet.getRange("B36").setValue("Nominal APR (no inflation adjustment) — same surplus & net position as B2; only the rate differs")
    .setFontStyle("italic")
    .setFontColor("#666666")
    .setFontSize(9);

  sheet.getRange("B2").setComment("Sample results — enter your debts in the Debt Payoff tab for your personalized plan");
  sheet.getRange("B24").setComment("Sample results — enter your debts in the Debt Payoff tab for your personalized plan");
  sheet.getRange("B25").setComment("Sample results — enter your debts in the Debt Payoff tab for your personalized plan");
  sheet.getRange("B32").setComment("Months to freedom using nominal APR (B7/12) instead of real rate ((B7-B10)/12). Same surplus & net position as B2 — only the rate differs.");
  sheet.getRange("B33").setComment("Sample results — enter your debts in the Debt Payoff tab for your personalized plan");

  sheet.getRange("A37").setValue("✦ SENSITIVITY TABLE").setFontWeight("bold");

  const extraPayments = [0, 100, 200, 300, 400, 500, 750, 1000];
  const startRow = 38;

  for (let i = 0; i < extraPayments.length; i++) {
    const row = startRow + (i * 3); // 3 rows per scenario (months, interest, date)
    const extra = extraPayments[i];

    // Months — debt payoff with minimum payment + extra
    sheet.getRange(`A${row}`).setValue(`Extra $${extra}/month months`);
    sheet.getRange(`B${row}`).setFormula(
      `=IF('Scenario Engine'!B10<=0,"Already free!",IF('Scenario Engine'!B9=0,ROUNDUP('Scenario Engine'!B10/('Scenario Engine'!B11+${extra}),0),IFERROR(ABS(ROUNDUP(NPER('Scenario Engine'!B9/12,-('Scenario Engine'!B11+${extra}),'Scenario Engine'!B10),0)),"N/A")))`
    );

    // Interest — use EXACT NPER (not rounded) to ensure monotonicity.
    // Rounded months cause non-monotonic results because ROUNDUP can push
    // a higher-payment scenario into a worse total-payment bucket.
    sheet.getRange(`A${row + 1}`).setValue(`Extra $${extra}/month interest`);
    sheet.getRange(`B${row + 1}`).setFormula(
      `=IF(B${row}="Already free!",0,IF(B${row}="Check inputs","N/A",IF('Scenario Engine'!B9=0,0,IFERROR(('Scenario Engine'!B11+${extra})*ABS(NPER('Scenario Engine'!B9/12,-('Scenario Engine'!B11+${extra}),'Scenario Engine'!B10))-'Scenario Engine'!B10,0))))`
    );

    // Freedom date
    sheet.getRange(`A${row + 2}`).setValue(`Extra $${extra}/month freedom date`);
    sheet.getRange(`B${row + 2}`).setFormula(
      `=IF(B${row}="Already free!","Already free!",IF(B${row}="Check inputs","N/A",IF(B${row}=0,"120+ months",IFERROR(EDATE(TODAY(),B${row}),"N/A"))))`
    );
  }

  // Format the Engine tab
  sheet.setColumnWidth(1, 250);
  sheet.setColumnWidth(2, 150);
  sheet.setColumnWidth(3, 150);
  sheet.setColumnWidth(4, 150);
}

function buildScenarioEngineTab(sheet) {
  sheet.clear();

  const resultBg = "#EFF6FF";

  // TITLE
  sheet.getRange("A1").setValue("PAYOFF CALCULATOR · \"When am I free?\"")
    .setFontSize(16).setFontWeight("bold").setFontColor(HEADER_COLOR);
  sheet.getRange("A1:F1").setBackground("#F8FAFC");
  sheet.setRowHeight(1, 40);

  // MOBILE QUICK VIEW - Key numbers at a glance
  sheet.getRange("A2").setValue("✦ QUICK VIEW").setFontWeight("bold").setFontColor(HEADER_COLOR);
  sheet.getRange("A3").setValue("Freedom date").setFontSize(10).setFontColor(HEADER_COLOR);
  sheet.getRange("B3").setFormula("=Engine!B3")
    .setFontSize(12).setFontWeight("bold").setFontColor("#0F172A")
    .setNumberFormat("MMM YYYY");
  sheet.getRange("C3").setValue("Months left").setFontSize(10).setFontColor(HEADER_COLOR);
  sheet.getRange("D3").setFormula("=Engine!B2")
    .setFontSize(12).setFontWeight("bold").setFontColor("#0F172A")
    .setNumberFormat("0");
  sheet.getRange("E3").setValue("Interest saved").setFontSize(10).setFontColor(HEADER_COLOR);
  sheet.getRange("F3").setFormula("=Engine!B4")
    .setFontSize(12).setFontWeight("bold").setFontColor("#10B981")
    .setNumberFormat("$#,##0");

  // INPUT SECTION
  sheet.getRange("A5").setValue("✦ YOUR NUMBERS (edit these cells)")
    .setFontColor(SECONDARY_COLOR).setFontWeight("bold");

  // Input labels and values
  const inputs = [
    { row: 6, label: "Monthly income", value: 6200, note: "← Edit this cell", validation: { min: 0, helpText: "Enter a positive number (e.g., 6200)" } },
    { row: 7, label: "Monthly living expenses (excl. debt payments)", value: 3200, note: "← Do NOT include debt payments here (they're in B9)", validation: { min: 0, helpText: "Enter a positive number (e.g., 3200)" } },
    { row: 8, label: "Current savings", value: 8200, note: "← Edit this cell", validation: { min: 0, helpText: "Enter a positive number (e.g., 8200)" } },
    { row: 9, label: "Weighted average APR (%)", value: 0.0757, note: "← Weighted average: (Debt1 balance × APR1 + Debt2 × APR2 + ...) ÷ Total debt", validation: { min: 0, max: 1, helpText: "Enter as decimal (e.g., 0.0757 for 7.57%)" } },
    { row: 10, label: "Total debt balance", value: 28200, note: "← Edit this cell", validation: { min: 0, helpText: "Enter a positive number (e.g., 28200)" } },
    { row: 11, label: "Total monthly debt payment", value: 590, note: "← Sum of ALL minimum payments from Debt Payoff tab", validation: { min: 0, helpText: "Enter a positive number (e.g., 590)" } },
    { row: 12, label: "Inflation adjustment (%)", value: 0.03, note: "← Set to 0% for nominal dollars, 3% for real dollars", validation: { min: 0, max: 1, helpText: "Enter as decimal (e.g., 0.03 for 3%)" } },
    { row: 13, label: "Custom comparison #1", value: 200, note: "← Extra $/month for first comparison scenario", validation: { min: 0, helpText: "Enter a positive number (e.g., 200)" } },
    { row: 14, label: "Custom comparison #2", value: 400, note: "← Extra $/month for second comparison scenario", validation: { min: 0, helpText: "Enter a positive number (e.g., 400)" } }
  ];

  inputs.forEach(input => {
    sheet.getRange(`A${input.row}`).setValue(input.label).setFontSize(10).setFontColor(HEADER_COLOR);
    const cell = sheet.getRange(`B${input.row}`);

    // Format as currency or percentage
    const format = (input.row === 9 || input.row === 12) ? "0.00%" : "$#,##0";
    styleInputCell(cell, input.value, format);

    // Add helper note
    sheet.getRange(`C${input.row}`).setValue(input.note)
      .setFontColor(SECONDARY_COLOR).setFontSize(9).setFontStyle("italic");
  });

  sheet.getRange("A15").setValue("↓ Scroll down for results")
    .setFontColor(SECONDARY_COLOR).setFontSize(9).setFontStyle("italic");

  // ── INFORMATIONAL ROW ──
  // Net debt after savings — reference only, not used in calculations
  sheet.getRange("A16").setValue("Net debt after savings").setFontSize(10).setFontColor(HEADER_COLOR);
  sheet.getRange("B16").setFormula("=MAX(0,B10-B8)").setNumberFormat("$#,##0").setFontSize(10);
  sheet.getRange("C16").setValue("← For reference only (not used in calculations)").setFontColor(SECONDARY_COLOR).setFontSize(9).setFontStyle("italic");

  // RESULTS SECTION
  sheet.getRange("A17").setValue("✦ YOUR RESULTS")
    .setFontColor(SECONDARY_COLOR).setFontWeight("bold");

  sheet.getRange("A18").setValue("Months to financial freedom").setFontSize(10).setFontWeight("bold");
  sheet.getRange("B18").setFormula("=Engine!B2")
    .setBackground(resultBg).setFontWeight("bold").setFontSize(12).setFontColor("#0F172A")
    .setNumberFormat("0");

  sheet.getRange("A19").setValue("Freedom date").setFontSize(10).setFontWeight("bold");
  sheet.getRange("B19").setFormula("=Engine!B3")
    .setBackground(resultBg).setFontWeight("bold").setFontSize(12).setFontColor("#0F172A")
    .setNumberFormat("MMM YYYY");

  sheet.getRange("A20").setValue("Total interest saved").setFontSize(10).setFontWeight("bold");
  sheet.getRange("B20").setFormula("=Engine!B4")
    .setBackground(resultBg).setFontWeight("bold").setFontSize(12).setFontColor("#10B981")
    .setNumberFormat("$#,##0");

  sheet.getRange("A21").setValue("↓ Scroll down for more")
    .setFontColor(SECONDARY_COLOR).setFontSize(9).setFontStyle("italic");

  // EMERGENCY FUND SECTION
  sheet.getRange("A22").setValue("✦ EMERGENCY FUND").setFontColor(SECONDARY_COLOR);

  sheet.getRange("A23").setValue("Emergency fund health:").setFontSize(10).setFontWeight("bold");
  sheet.getRange("B23").setFormula("=IFERROR(IF('Scenario Engine'!B7=0,\"N/A\",ROUND('Scenario Engine'!B8/'Scenario Engine'!B7,1)),\"Enter expenses\")")
    .setNumberFormat("0.0").setFontSize(12).setFontWeight("bold").setBackground(resultBg);
  sheet.getRange("C23").setFormula("=IF(B23=\"N/A\",\"—\",IF(B23<1,\"⚠ Below 1 month\",IF(B23<3,\"✓ Getting there\",\"✓ Strong (3+ months)\")))")
    .setFontSize(10).setFontColor(HEADER_COLOR);

  // INTEREST THIS MONTH SECTION
  sheet.getRange("A25").setValue("✦ INTEREST").setFontColor(SECONDARY_COLOR);

  sheet.getRange("A26").setValue("Interest this month:").setFontSize(10).setFontWeight("bold");
  sheet.getRange("B24").setFormula("=IFERROR('Scenario Engine'!B10*'Scenario Engine'!B9/12,0)")
    .setNumberFormat("$#,##0").setFontSize(12).setFontWeight("bold").setBackground(resultBg);
  sheet.getRange("C24").setFormula("=IFERROR(\"→ ~\"&TEXT(B24*12,\"$#,##0\")&\"/yr\",\"\")")
    .setFontSize(10).setFontColor(SECONDARY_COLOR);

  // B11 DEPENDENCY GUARDRAIL
  sheet.getRange("A25").setFormula("=IF(AND('Scenario Engine'!B10>0,'Scenario Engine'!B11=0),\"⚠ You have debt but no payment entered. Go to B11 and enter your monthly debt payment.\",\"\")")
    .setFontSize(10).setFontColor("#DC2626").setFontWeight("bold");

  // CROSS-TAB CHECK
  sheet.getRange("A27").setValue("✦ CROSS-TAB CHECK")
    .setFontColor(SECONDARY_COLOR).setFontWeight("bold");

  sheet.getRange("A28").setValue("Weighted APR from Debt Payoff tab:").setFontSize(9);
  sheet.getRange("B28").setFormula("=Engine!B28").setNumberFormat("0.00%").setFontSize(9);

  sheet.getRange("A29").setValue("Your entered APR:").setFontSize(9);
  sheet.getRange("B29").setFormula("=B9").setNumberFormat("0.00%").setFontSize(9);

  sheet.getRange("A30").setValue("Match:").setFontSize(9).setFontWeight("bold");
  sheet.getRange("B30").setFormula("=Engine!B30").setFontSize(9).setFontWeight("bold");

  sheet.getRange("A31").setValue("↓ Scroll down for comparison")
    .setFontColor(SECONDARY_COLOR).setFontSize(9).setFontStyle("italic");

  // COMPARISON TABLE
  sheet.getRange("A33").setValue("✦ COMPARISON")
    .setFontColor(SECONDARY_COLOR).setFontWeight("bold");

  // Headers
  sheet.getRange("A34").setValue("Scenario").setFontWeight("bold").setFontSize(9);
  sheet.getRange("B34").setValue("Months").setFontWeight("bold").setFontSize(9);
  sheet.getRange("C34").setValue("Interest Paid").setFontWeight("bold").setFontSize(9);
  sheet.getRange("D34").setValue("Freedom").setFontWeight("bold").setFontSize(9);

  // Comparison rows — all show TOTAL INTEREST PAID for each scenario
  const comparisons = [
    { row: 35, label: "Minimum payments only", months: "=Engine!B6", interest: "=IFERROR(Engine!B6*B11-B10,0)", date: "=Engine!B8" },
    { row: 36, labelFormula: "=\"Extra $\"&B13&\"/month\"", label: "Extra $/month #1", months: "=Engine!B9", interest: "=IFERROR(Engine!B9*(B11+B13)-B10,0)", date: "=Engine!B11" },
    { row: 37, labelFormula: "=\"Extra $\"&B14&\"/month\"", label: "Extra $/month #2", months: "=Engine!B12", interest: "=IFERROR(Engine!B12*(B11+B14)-B10,0)", date: "=Engine!B14" },
    { row: 38, label: "Match my scenario", months: "=B18", interest: "=IFERROR(Engine!B7-B20,0)", date: "=B19" },
    { row: 39, label: "Nominal rate (no inflation)", months: "=Engine!B32", interest: "=Engine!B33", date: "=Engine!B34" }
  ];

  comparisons.forEach(c => {
    const labelCell = sheet.getRange(`A${c.row}`);
    if (c.labelFormula) {
      labelCell.setFormula(c.labelFormula).setFontSize(9);
    } else {
      labelCell.setValue(c.label).setFontSize(9);
    }
    sheet.getRange(`B${c.row}`).setFormula(c.months).setNumberFormat("0").setFontSize(9);
    sheet.getRange(`C${c.row}`).setFormula(c.interest).setNumberFormat("$#,##0").setFontSize(9);
    sheet.getRange(`D${c.row}`).setFormula(c.date).setNumberFormat("MMM YYYY").setFontSize(9);
  });

  sheet.getRange("A40").setValue("↓ Scroll down for sensitivity analysis")
    .setFontColor(SECONDARY_COLOR).setFontSize(9).setFontStyle("italic");

  // SENSITIVITY TABLE
  sheet.getRange("A42").setValue("✦ SENSITIVITY: Freedom Date at Different Savings Rates")
    .setFontColor(SECONDARY_COLOR).setFontWeight("bold");

  // Headers
  sheet.getRange("A43").setValue("Extra $/month").setFontWeight("bold").setFontSize(9);
  sheet.getRange("B43").setValue("Months").setFontWeight("bold").setFontSize(9);
  sheet.getRange("C43").setValue("Freedom Date").setFontWeight("bold").setFontSize(9);
  sheet.getRange("D43").setValue("Interest Paid").setFontWeight("bold").setFontSize(9);

  // Sensitivity rows — reference Engine tab sensitivity formulas
  const sensitivityData = [
    { row: 44, label: "$0/month", engineMonths: 38, engineInterest: 39, engineDate: 40 },
    { row: 45, label: "$100/month", engineMonths: 41, engineInterest: 42, engineDate: 43 },
    { row: 46, label: "$200/month", engineMonths: 44, engineInterest: 45, engineDate: 46 },
    { row: 47, label: "$300/month", engineMonths: 47, engineInterest: 48, engineDate: 49 },
    { row: 48, label: "$400/month", engineMonths: 50, engineInterest: 51, engineDate: 52 },
    { row: 49, label: "$500/month", engineMonths: 53, engineInterest: 54, engineDate: 55 },
    { row: 50, label: "$750/month", engineMonths: 56, engineInterest: 57, engineDate: 58 },
    { row: 51, label: "$1,000/month", engineMonths: 59, engineInterest: 60, engineDate: 61 }
  ];

  sensitivityData.forEach(s => {
    sheet.getRange(`A${s.row}`).setValue(s.label).setFontSize(9);
    sheet.getRange(`B${s.row}`).setFormula(`=Engine!B${s.engineMonths}`).setNumberFormat("0").setFontSize(9);
    sheet.getRange(`C${s.row}`).setFormula(`=Engine!B${s.engineDate}`).setNumberFormat("MMM YYYY").setFontSize(9);
    sheet.getRange(`D${s.row}`).setFormula(`=Engine!B${s.engineInterest}`).setNumberFormat("$#,##0").setFontSize(9);
  });

  sheet.getRange("A52").setValue("↑ End of sensitivity table")
    .setFontColor(SECONDARY_COLOR).setFontSize(9).setFontStyle("italic");

  // HOW TO READ
  sheet.getRange("A54").setValue("✦ HOW TO READ THIS").setFontColor(SECONDARY_COLOR).setFontSize(9);
  sheet.getRange("A55").setValue("Debt-free = when your debt balance reaches $0.")
    .setFontColor(SECONDARY_COLOR).setFontSize(9);
  sheet.getRange("A56").setValue("This calculator shows the month your debt will be")
    .setFontColor(SECONDARY_COLOR).setFontSize(9);
  sheet.getRange("A57").setValue("paid off, based on your income, expenses,")
    .setFontColor(SECONDARY_COLOR).setFontSize(9);
  sheet.getRange("A58").setValue("interest rate, and debt balance.")
    .setFontColor(SECONDARY_COLOR).setFontSize(9);

  // FORMATTING
  sheet.setColumnWidth(1, 380);
  sheet.setColumnWidth(2, 120);
  sheet.setColumnWidth(3, 120);
  sheet.setColumnWidth(4, 120);

  // Freeze row 1
  sheet.setFrozenRows(1);

  // DATA VALIDATION
  addScenarioEngineValidation(sheet);

  // CONDITIONAL FORMATTING
  addScenarioEngineConditionalFormatting(sheet);

  // Protection
  protectRange(sheet, "B16:B18", "Results — auto-calculated");
  protectRange(sheet, "B35:D39", "Comparison table — auto-calculated");
}

function buildBudgetTrackerTab(sheet) {
  sheet.clear();

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // TITLE
  sheet.getRange("A1").setValue("BUDGET TRACKER · " + new Date().getFullYear())
    .setFontSize(16).setFontWeight("bold").setFontColor(HEADER_COLOR);
  sheet.getRange("A1:M1").setBackground("#F8FAFC");
  sheet.setRowHeight(1, 40);

  // INCOME SECTION
  sheet.getRange("A3").setValue("✦ INCOME").setFontWeight("bold").setFontColor(SECONDARY_COLOR);

  // Month headers
  sheet.getRange("A4").setValue("Category").setFontWeight("bold");
  months.forEach((month, i) => {
    sheet.getRange(4, i + 2).setValue(month).setFontWeight("bold").setFontSize(9);
  });

  // Income categories
  const incomeCategories = ["Salary", "Side hustle", "Other income"];
  const sampleIncome = {
    "Salary": [5400, 5400, 5400, 5400, 5400, 5400, 5400, 5400, 5400, 5400, 5400, 5400],
    "Side hustle": [800, 1200, 600, 900, 1100, 700, 1000, 800, 1200, 900, 1100, 800],
    "Other income": [0, 200, 0, 100, 0, 300, 0, 150, 0, 200, 0, 100]
  };

  incomeCategories.forEach((cat, i) => {
    const row = 5 + i;
    sheet.getRange(`A${row}`).setValue(cat).setFontSize(10);
    months.forEach((_, j) => {
      const cell = sheet.getRange(row, j + 2);
      cell.setValue(sampleIncome[cat][j]).setNumberFormat("$#,##0").setFontSize(10);
    });
  });

  // Total income (row 9)
  sheet.getRange("A9").setValue("Total income").setFontWeight("bold").setFontSize(10);
  months.forEach((_, i) => {
    const col = i + 2;
    sheet.getRange(9, col).setFormula(`=SUM(${sheet.getRange(5, col).getA1Notation()}:${sheet.getRange(7, col).getA1Notation()})`)
      .setNumberFormat("$#,##0").setFontWeight("bold")
      .setBorder(true, false, false, false, false, false);
  });

  // EXPENSES SECTION
  sheet.getRange("A11").setValue("✦ EXPENSES").setFontWeight("bold").setFontColor(SECONDARY_COLOR);

  // Month headers
  sheet.getRange("A12").setValue("Category").setFontWeight("bold");
  months.forEach((month, i) => {
    sheet.getRange(12, i + 2).setValue(month).setFontWeight("bold").setFontSize(9);
  });

  // Expense categories
  const expenseCategories = ["Housing", "Utilities", "Food", "Transport", "Entertainment", "Other"];
  const sampleExpenses = {
    "Housing": [1800, 1800, 1800, 1800, 1800, 1800, 1800, 1800, 1800, 1800, 1800, 1800],
    "Utilities": [280, 310, 260, 290, 270, 300, 320, 310, 280, 260, 290, 300],
    "Food": [450, 520, 480, 500, 470, 510, 490, 460, 530, 480, 500, 520],
    "Transport": [160, 140, 180, 150, 170, 160, 140, 180, 150, 170, 160, 140],
    "Entertainment": [200, 150, 250, 180, 220, 190, 210, 160, 240, 200, 180, 220],
    "Other": [100, 80, 120, 90, 110, 100, 80, 120, 90, 110, 100, 80]
  };

  expenseCategories.forEach((cat, i) => {
    const row = 13 + i;
    sheet.getRange(`A${row}`).setValue(cat).setFontSize(10);
    months.forEach((_, j) => {
      const cell = sheet.getRange(row, j + 2);
      cell.setValue(sampleExpenses[cat][j]).setNumberFormat("$#,##0").setFontSize(10);
    });
  });

  // Total expenses (row 22)
  sheet.getRange("A22").setValue("Total expenses").setFontWeight("bold").setFontSize(10);
  months.forEach((_, i) => {
    const col = i + 2;
    sheet.getRange(22, col).setFormula(`=SUM(${sheet.getRange(13, col).getA1Notation()}:${sheet.getRange(18, col).getA1Notation()})`)
      .setNumberFormat("$#,##0").setFontWeight("bold")
      .setBorder(true, false, false, false, false, false);
  });

  // Net (row 24)
  sheet.getRange("A24").setValue("Net (income - expenses)").setFontWeight("bold").setFontSize(10);
  months.forEach((_, i) => {
    const col = i + 2;
    sheet.getRange(24, col).setFormula(`=${sheet.getRange(9, col).getA1Notation()}-${sheet.getRange(22, col).getA1Notation()}`)
      .setNumberFormat("$#,##0").setFontWeight("bold").setFontSize(10);
  });

  // Savings rate (row 25)
  sheet.getRange("A25").setValue("Savings rate").setFontWeight("bold").setFontSize(10);
  months.forEach((_, i) => {
    const col = i + 2;
    sheet.getRange(25, col).setFormula(`=IF(${sheet.getRange(9, col).getA1Notation()}=0,0,${sheet.getRange(24, col).getA1Notation()}/${sheet.getRange(9, col).getA1Notation()})`)
      .setNumberFormat("0.0%").setFontWeight("bold").setFontSize(10);
  });

  // FORMATTING
  sheet.setColumnWidth(1, 180);
  for (let i = 2; i <= 13; i++) {
    sheet.setColumnWidth(i, 85);
  }

  // Freeze panes
  sheet.setFrozenRows(1);
  sheet.setFrozenColumns(1);

  // CONDITIONAL FORMATTING
  addBudgetTrackerConditionalFormatting(sheet);

  // Protection
  [9, 22, 24, 25].forEach(row => {
    protectRange(sheet, `A${row}:M${row}`, "Formula row");
  });
}

function buildDebtPayoffTab(sheet) {
  sheet.clear();

  // TITLE
  sheet.getRange("A1").setValue("DEBT PAYOFF · Pay Off Debt Faster")
    .setFontSize(16).setFontWeight("bold").setFontColor(HEADER_COLOR);
  sheet.getRange("A1:F1").setBackground("#F8FAFC");
  sheet.setRowHeight(1, 40);

  // DEBT INPUT SECTION
  sheet.getRange("A3").setValue("✦ YOUR DEBT LIST").setFontWeight("bold").setFontColor(SECONDARY_COLOR);

  // Headers
  sheet.getRange("A4").setValue("Debt name").setFontWeight("bold");
  sheet.getRange("B4").setValue("Balance").setFontWeight("bold");
  sheet.getRange("C4").setValue("APR").setFontWeight("bold");
  sheet.getRange("D4").setValue("Min payment").setFontWeight("bold");
  sheet.getRange("E4").setValue("Extra").setFontWeight("bold");

  // Sample debts
  const debts = [
    { name: "Chase Visa", balance: 2800, apr: 0.2499, min: 85, extra: 200 },
    { name: "Car Loan", balance: 8400, apr: 0.0675, min: 225, extra: 0 },
    { name: "Student Loan", balance: 15800, apr: 0.055, min: 180, extra: 0 },
    { name: "Medical Bill", balance: 1200, apr: 0.0, min: 100, extra: 100 }
  ];

  debts.forEach((debt, i) => {
    const row = 5 + i;
    sheet.getRange(`A${row}`).setValue(debt.name).setFontSize(10);

    const balanceCell = sheet.getRange(`B${row}`);
    styleInputCell(balanceCell, debt.balance, "$#,##0", { min: 0, helpText: "Enter a positive balance (e.g., 2800)" });

    const aprCell = sheet.getRange(`C${row}`);
    styleInputCell(aprCell, debt.apr, "0.00%", { min: 0, max: 1, helpText: "Enter as decimal (e.g., 0.2499 for 24.99%)" });

    const minCell = sheet.getRange(`D${row}`);
    styleInputCell(minCell, debt.min, "$#,##0", { min: 0, helpText: "Enter a positive payment (e.g., 85)" });

    const extraCell = sheet.getRange(`E${row}`);
    styleInputCell(extraCell, debt.extra, "$#,##0", { min: 0, helpText: "Enter 0 or more (e.g., 200)" });
  });

  // Totals row
  sheet.getRange("A9").setValue("—").setFontColor(SECONDARY_COLOR);
  sheet.getRange("A10").setValue("Total").setFontWeight("bold").setFontSize(10);
  sheet.getRange("B10").setFormula("=SUM(B5:B8)").setNumberFormat("$#,##0").setFontWeight("bold").setFontSize(10);
  sheet.getRange("E10").setFormula("=SUM(E5:E8)").setNumberFormat("$#,##0").setFontWeight("bold").setFontSize(10);

  // PAYOFF COMPARISON
  sheet.getRange("A12").setValue("✦ PAYOFF COMPARISON").setFontWeight("bold").setFontColor(SECONDARY_COLOR);

  sheet.getRange("B13").setValue("Snowball").setFontWeight("bold");
  sheet.getRange("C13").setValue("Avalanche").setFontWeight("bold");

  sheet.getRange("A14").setValue("Total months").setFontSize(10);
  sheet.getRange("B14").setFormula("=Engine!B20").setNumberFormat("0").setFontSize(10).setFontWeight("bold");
  sheet.getRange("C14").setFormula("=Engine!B21").setNumberFormat("0").setFontSize(10).setFontWeight("bold");

  sheet.getRange("A15").setValue("Total interest").setFontSize(10);
  sheet.getRange("B15").setFormula("=Engine!B22").setNumberFormat("$#,##0").setFontSize(10).setFontWeight("bold");
  sheet.getRange("C15").setFormula("=Engine!B23").setNumberFormat("$#,##0").setFontSize(10).setFontWeight("bold");

  sheet.getRange("A16").setValue("Interest saved vs min (Est.)").setFontSize(10);
  sheet.getRange("B16").setFormula("=Engine!B24").setNumberFormat("$#,##0").setFontSize(10)
    .setFontColor("#10B981").setFontWeight("bold");
  sheet.getRange("C16").setFormula("=Engine!B25").setNumberFormat("$#,##0").setFontSize(10)
    .setFontColor("#10B981").setFontWeight("bold");

  // PAYOFF TIMELINE
  sheet.getRange("A18").setValue("✦ PAYOFF TIMELINE").setFontWeight("bold").setFontColor(SECONDARY_COLOR);

  sheet.getRange("A19").setValue("Debt").setFontWeight("bold");
  sheet.getRange("B19").setValue("Snowball payoff").setFontWeight("bold");
  sheet.getRange("C19").setValue("Avalanche payoff").setFontWeight("bold");

  // Per-debt payoff dates
  debts.forEach((debt, i) => {
    const row = 20 + i;
    const engineRow = i + 2;
    sheet.getRange(`A${row}`).setValue(debt.name).setFontSize(10);
    sheet.getRange(`B${row}`).setFormula(`=IF(Engine!I${engineRow}=0,"120+ months",IFERROR(EDATE(TODAY(),Engine!C${engineRow}),"N/A"))`).setNumberFormat("MMM YYYY").setFontSize(10);
    sheet.getRange(`C${row}`).setFormula(`=IF(Engine!J${engineRow}=0,"120+ months",IFERROR(EDATE(TODAY(),Engine!D${engineRow}),"N/A"))`).setNumberFormat("MMM YYYY").setFontSize(10);
  });

  // DISCLAIMER
  sheet.getRange("A25").setValue("✦ IMPORTANT NOTES").setFontWeight("bold").setFontColor(SECONDARY_COLOR);
  sheet.getRange("A26").setValue("These estimates use month-by-month simulation")
    .setFontSize(9).setFontColor(SECONDARY_COLOR);
  sheet.getRange("A27").setValue("with your exact debts, rates, and payments.")
    .setFontSize(9).setFontColor(SECONDARY_COLOR);
  sheet.getRange("A28").setValue("Results assume consistent monthly payments")
    .setFontSize(9).setFontColor(SECONDARY_COLOR);
  sheet.getRange("A29").setValue("and no skipped payments.")
    .setFontSize(9).setFontColor(SECONDARY_COLOR);
  sheet.getRange("A30").setValue("For this specific debt profile, Snowball and Avalanche")
    .setFontSize(9).setFontColor(SECONDARY_COLOR);
  sheet.getRange("A31").setValue("produce similar results.")
    .setFontSize(9).setFontColor(SECONDARY_COLOR);

  // FORMATTING
  sheet.setColumnWidth(1, 180);
  sheet.setColumnWidth(2, 120);
  sheet.setColumnWidth(3, 120);
  sheet.setColumnWidth(4, 120);
  sheet.setColumnWidth(5, 100);

  // Freeze panes
  sheet.setFrozenRows(1);
  sheet.setFrozenColumns(1);

  // CONDITIONAL FORMATTING
  addDebtPayoffConditionalFormatting(sheet);

  // DATA VALIDATION
  addDebtPayoffValidation(sheet);

  // Protection
  protectRange(sheet, "A10:E10", "Totals");
  protectRange(sheet, "B14:C16", "Comparison");
  protectRange(sheet, "B20:C23", "Timeline");
}

function buildGoalsTab(sheet) {
  sheet.clear();

  // TITLE
  sheet.getRange("A1").setValue("SAVINGS GOALS · Track Your Progress")
    .setFontSize(16).setFontWeight("bold").setFontColor(HEADER_COLOR);
  sheet.getRange("A1:G1").setBackground("#F8FAFC");
  sheet.setRowHeight(1, 40);

  // GROWTH RATE INPUT
  sheet.getRange("A2").setValue("Assumed growth rate")
    .setFontSize(10).setFontWeight("bold").setFontColor(HEADER_COLOR);
  const growthRateCell = sheet.getRange("B2");
  styleInputCell(growthRateCell, 0.03, "0.00%", { min: 0, max: 1, helpText: "Enter as decimal (e.g., 0.03 for 3%)" });
  sheet.getRange("C2").setValue("← Annual growth rate for savings (used in Months formula)")
    .setFontSize(9).setFontStyle("italic").setFontColor(SECONDARY_COLOR);

  // SECTION HEADER
  sheet.getRange("A4").setValue("✦ SAVINGS GOALS").setFontWeight("bold").setFontColor(SECONDARY_COLOR);

  // COLUMN HEADERS
  sheet.getRange("A5").setValue("Goal Name").setFontWeight("bold");
  sheet.getRange("B5").setValue("Target").setFontWeight("bold");
  sheet.getRange("C5").setValue("Current").setFontWeight("bold");
  sheet.getRange("D5").setValue("Monthly").setFontWeight("bold");
  sheet.getRange("E5").setValue("Months").setFontWeight("bold");
  sheet.getRange("F5").setValue("Progress").setFontWeight("bold");
  sheet.getRange("G5").setValue("Target Date").setFontWeight("bold");

  // SAMPLE GOALS
  const goals = [
    { name: "Emergency Fund", target: 5000, current: 1750, monthly: 200 },
    { name: "Vacation", target: 2000, current: 600, monthly: 150 },
    { name: "Car Down Payment", target: 8000, current: 2400, monthly: 300 },
    { name: "New Laptop", target: 1500, current: 450, monthly: 100 },
    { name: "Wedding", target: 15000, current: 3000, monthly: 400 }
  ];

  goals.forEach((goal, i) => {
    const row = 6 + i;

    // Goal name
    sheet.getRange(`A${row}`).setValue(goal.name).setFontSize(10);

    // Target amount (input)
    const targetCell = sheet.getRange(`B${row}`);
    styleInputCell(targetCell, goal.target, "$#,##0", { min: 1, helpText: "Enter a positive target (e.g., 5000)" });

    // Current balance (input)
    const currentCell = sheet.getRange(`C${row}`);
    styleInputCell(currentCell, goal.current, "$#,##0", { min: 0, helpText: "Enter 0 or more (e.g., 1750)" });

    // Monthly contribution (input)
    const monthlyCell = sheet.getRange(`D${row}`);
    styleInputCell(monthlyCell, goal.monthly, "$#,##0", { min: 0, helpText: "Enter 0 or more (e.g., 200)" });

    // Months to goal (NPER formula)
    sheet.getRange(`E${row}`).setFormula(
      `=IFERROR(IF(D${row}<=0,"N/A",ABS(ROUNDUP(NPER($B$2/12,-D${row},-C${row},B${row}),0))),"Check inputs")`
    ).setFontSize(10).setFontWeight("bold");

    // Progress (percentage formula)
    sheet.getRange(`F${row}`).setFormula(
      `=IFERROR(MIN(C${row}/B${row},1),0)`
    ).setNumberFormat("0%").setFontSize(10).setFontWeight("bold");

    // Target date (EDATE formula) - shows "GOAL REACHED!" when progress is 100%
    sheet.getRange(`G${row}`).setFormula(
      `=IFERROR(IF(F${row}>=1,"GOAL REACHED!",IF(F${row}="N/A","N/A",EDATE(TODAY(),E${row}))),"Check inputs")`
    ).setFontSize(10).setFontWeight("bold");
  });

  // SEPARATOR
  sheet.getRange("A11").setValue("—").setFontColor(SECONDARY_COLOR);

  // TOTALS ROW
  sheet.getRange("A12").setValue("TOTALS").setFontWeight("bold").setFontSize(10);
  sheet.getRange("B12").setFormula("=SUM(B6:B10)").setNumberFormat("$#,##0").setFontWeight("bold").setFontSize(10);
  sheet.getRange("C12").setFormula("=SUM(C6:C10)").setNumberFormat("$#,##0").setFontWeight("bold").setFontSize(10);
  sheet.getRange("D12").setFormula("=SUM(D6:D10)").setNumberFormat("$#,##0").setFontWeight("bold").setFontSize(10);

  // FORMATTING
  sheet.setColumnWidth(1, 180);
  sheet.setColumnWidth(2, 110);
  sheet.setColumnWidth(3, 110);
  sheet.setColumnWidth(4, 110);
  sheet.setColumnWidth(5, 100);
  sheet.setColumnWidth(6, 100);
  sheet.setColumnWidth(7, 120);

  // Freeze panes
  sheet.setFrozenRows(2);
  sheet.setFrozenColumns(1);

  // CONDITIONAL FORMATTING
  addGoalsConditionalFormatting(sheet);

  // DATA VALIDATION
  addGoalsValidation(sheet);

  // Protection
  protectRange(sheet, "E6:G10", "Formula columns — auto-calculated");
  protectRange(sheet, "A12:G12", "Totals row");
}

function addGoalsConditionalFormatting(sheet) {
  // F6:F10: Progress = 100% = gold background (celebration)
  const progressCompleteRule = SpreadsheetApp.newConditionalFormatRule()
    .whenNumberEqualTo(1)
    .setBackground("#FEF3C7")
    .setFontColor("#D4AF37")
    .setRanges([sheet.getRange("F6:F10")])
    .build();

  // F6:F10: Progress 50-99% = yellow
  const progressHalfRule = SpreadsheetApp.newConditionalFormatRule()
    .whenNumberBetween(0.5, 0.99)
    .setBackground("#FEF9C3")
    .setFontColor("#A16207")
    .setRanges([sheet.getRange("F6:F10")])
    .build();

  // G6:G10: "GOAL REACHED!" = gold background
  const goalReachedTextRule = SpreadsheetApp.newConditionalFormatRule()
    .whenTextContains("GOAL REACHED")
    .setBackground("#FEF3C7")
    .setFontColor("#D4AF37")
    .setRanges([sheet.getRange("G6:G10")])
    .build();

  // E6:E10: Months <= 6 = green text (near-term goal)
  const nearTermGoalRule = SpreadsheetApp.newConditionalFormatRule()
    .whenNumberLessThanOrEqualTo(6)
    .setFontColor("#10B981")
    .setRanges([sheet.getRange("E6:E10")])
    .build();

  sheet.setConditionalFormatRules([progressCompleteRule, progressHalfRule, goalReachedTextRule, nearTermGoalRule]);
}

function addGoalsValidation(sheet) {
  // B2: Growth rate 0-25%
  sheet.getRange("B2").setDataValidation(
    SpreadsheetApp.newDataValidation()
      .requireNumberBetween(0, 0.25)
      .setAllowInvalid(false)
      .setHelpText("Growth rate must be between 0% and 25%")
      .build()
  );

  // B6:B10: Target > 0
  sheet.getRange("B6:B10").setDataValidation(
    SpreadsheetApp.newDataValidation()
      .requireNumberGreaterThan(0)
      .setAllowInvalid(false)
      .setHelpText("Target must be a positive amount")
      .build()
  );

  // C6:C10: Current >= 0
  sheet.getRange("C6:C10").setDataValidation(
    SpreadsheetApp.newDataValidation()
      .requireNumberGreaterThanOrEqualTo(0)
      .setAllowInvalid(false)
      .setHelpText("Current balance cannot be negative")
      .build()
  );

  // D6:D10: Monthly >= 0
  sheet.getRange("D6:D10").setDataValidation(
    SpreadsheetApp.newDataValidation()
      .requireNumberGreaterThanOrEqualTo(0)
      .setAllowInvalid(false)
      .setHelpText("Monthly contribution cannot be negative")
      .build()
  );
}

function buildInstructionsTab(sheet) {
  sheet.clear();

  // TITLE
  sheet.getRange("A1").setValue("How to Use Budget Pro 2026")
    .setFontSize(16).setFontWeight("bold").setFontColor(HEADER_COLOR);
  sheet.getRange("A1:B1").setBackground("#F8FAFC");
  sheet.setRowHeight(1, 40);

  // WELCOME
  sheet.getRange("A3").setValue("Hey! Welcome. This spreadsheet is designed to be simple. Here's everything you need to know.")
    .setFontSize(11).setFontStyle("italic").setFontColor(HEADER_COLOR);

  // QUICK START
  sheet.getRange("A5").setValue("✦ QUICK START (5 minutes)").setFontWeight("bold").setFontColor(SECONDARY_COLOR);

  const quickStart = [
    "1. Open the \"Scenario Engine\" tab",
    "2. Enter your 9 numbers in the green cells",
    "3. Read your results in the blue section",
    "4. Try different scenarios by changing inputs"
  ];

  quickStart.forEach((line, i) => {
    sheet.getRange(`A${6 + i}`).setValue(line).setFontSize(10);
  });

  // TAB 1: SCENARIO ENGINE
  sheet.getRange("A11").setValue("✦ TAB 1: PAYOFF CALCULATOR").setFontWeight("bold").setFontColor(SECONDARY_COLOR);

  const tab1Instructions = [
    "What it does: Calculates when you'll be",
    "debt-free based on your income, expenses,",
    "interest rate, and debt balance.",
    "",
    "Green cells = edit these",
    "Blue cells = results (don't edit)",
    "",
    "What \"debt-free\" means:",
    "Your debt balance reaches $0. You owe nothing",
    "more to creditors. All surplus income is yours.",
    "",
    "Key metrics:",
    "- Months to freedom: how many months until",
    "  your debt is completely paid off",
    "- Freedom date: the calendar month you'll",
    "  reach debt-free status",
    "- Interest saved: how much less interest you'll",
    "  pay compared to minimum payments only"
  ];

  tab1Instructions.forEach((line, i) => {
    sheet.getRange(`A${12 + i}`).setValue(line).setFontSize(10);
  });

  // WHY DATES DIFFER
  sheet.getRange("A31").setValue("✦ WHY TAB 1 AND TAB 3 SHOW DIFFERENT DATES")
    .setFontWeight("bold").setFontColor(SECONDARY_COLOR);

  const whyDatesDiffer = [
    "Tab 1 (Scenario Engine) uses your weighted average",
    "APR — one rate for all debt combined. Tab 3 (Debt",
    "Payoff) calculates each debt individually with its",
    "own APR. Different math = different dates.",
    "",
    "Both are correct. Tab 1 gives you a quick estimate.",
    "Tab 3 gives you the exact payoff for each debt.",
    "",
    "Tip: Use Tab 1 for \"what if\" experiments.",
    "Use Tab 3 for your actual payoff plan."
  ];

  whyDatesDiffer.forEach((line, i) => {
    sheet.getRange(`A${32 + i}`).setValue(line).setFontSize(10);
  });
  // HOW THE PAYOFF CALCULATOR WORKS

  sheet.getRange("A43").setValue("✦ HOW THE PAYOFF CALCULATOR WORKS")
    .setFontWeight("bold").setFontColor(SECONDARY_COLOR);

  const engineWorks = [
    "The Scenario Engine uses two powerful Google Sheets",
    "formulas:",
    "",
    "NPER (Number of Periods)",
    "- Calculates how many months until debt is paid off",
    "- Uses: interest rate, monthly payment, debt balance",
    "- Returns: number of months to reach $0 debt",
    "",
    "EDATE (Exact Date)",
    "- Converts months to a calendar date",
    "- Adds NPER result to today's date",
    "- Shows you the exact month you'll be debt-free",
    "",
    "Important assumptions:",
    "- Your income and expenses stay constant",
    "- Your interest rate stays constant",
    "- You make the same payment every month",
    "- Inflation adjustment available (default 3%)",
    "",
    "These are simplifications. Your actual payoff date",
    "will likely come SOONER because:",
    "- You'll probably increase income over time",
    "- You'll likely reduce expenses as debt shrinks",
    "- Windfalls (bonuses, tax refunds) accelerate payoff",
    "- This calculator is a conservative baseline"
  ];

  engineWorks.forEach((line, i) => {
    sheet.getRange(`A${44 + i}`).setValue(line).setFontSize(10);
  });

  // TAB 2: BUDGET TRACKER
  sheet.getRange("A69").setValue("✦ TAB 2: BUDGET TRACKER")
    .setFontWeight("bold").setFontColor(SECONDARY_COLOR);

  const tab2Instructions = [
    "What it does: Tracks your monthly income",
    "and expenses by category.",
    "",
    "How to use it:",
    "- Fill in each month's columns (B through M)",
    "- Enter your income in rows 5-7",
    "- Enter your expenses in rows 13-18",
    "- Totals and savings rate auto-calculate",
    "",
    "Tips:",
    "- Update weekly (5 minutes) instead of monthly",
    "- The savings rate target is 20%+",
    "- If net is negative, check your top 3 expense",
    "  categories — that's where the leak is"
  ];

  tab2Instructions.forEach((line, i) => {
    sheet.getRange(`A${70 + i}`).setValue(line).setFontSize(10);
  });

  // TAB 3: DEBT PAYOFF
  sheet.getRange("A85").setValue("✦ TAB 3: DEBT PAYOFF")
    .setFontWeight("bold").setFontColor(SECONDARY_COLOR);

  const tab3Instructions = [
    "What it does: Compares debt snowball vs",
    "avalanche strategies and shows payoff dates.",
    "",
    "How to use it:",
    "- List each debt with name, balance, APR, min",
    "- Enter any extra payment you can make monthly",
    "- The comparison shows which strategy saves more",
    "",
    "Snowball: pay off smallest balance first",
    "  (quick wins, psychological boost)",
    "",
    "Avalanche: pay off highest APR first",
    "  (saves the most money)"
  ];

  tab3Instructions.forEach((line, i) => {
    sheet.getRange(`A${86 + i}`).setValue(line).setFontSize(10);
  });

  // TAB 4: GOALS
  sheet.getRange("A101").setValue("✦ TAB 4: GOALS")
    .setFontWeight("bold").setFontColor(SECONDARY_COLOR);

  const tab4Instructions = [
    "What it does: Tracks savings goals with progress",
    "bars and estimated target dates.",
    "",
    "How to use it:",
    "- Enter your goal name, target amount, current",
    "  savings, and monthly contribution in green cells",
    "- Months to goal and progress auto-calculate",
    "- Target date estimates when you'll reach each goal",
    "",
    "Tips:",
    "- Set realistic monthly contributions",
    "- The progress bar shows percentage complete",
    "- Update current balances monthly",
    "- Add more goals by inserting rows below row 9"
  ];

  tab4Instructions.forEach((line, i) => {
    sheet.getRange(`A${102 + i}`).setValue(line).setFontSize(10);
  });

  // TAB 5: SPENDABLE
  sheet.getRange("A118").setValue("✦ TAB 5: SPENDABLE")
    .setFontWeight("bold").setFontColor(SECONDARY_COLOR);

  const tab5Instructions = [
    "What it does: Shows how much guilt-free spending",
    "money you have each week and day.",
    "",
    "How it works:",
    "- Takes your income minus expenses minus debt payments",
    "- Divides the remainder into weekly and daily amounts",
    "- This is your fun money — no guilt required",
    "",
    "If the number is $0:",
    "- Your expenses + debt equal or exceed your income",
    "- Check the Budget Tracker to find where money leaks",
    "- Consider reducing discretionary spending categories",
    "",
    "Tips:",
    "- Use this as a daily spending allowance",
    "- If you stay under budget, the savings roll over",
    "- Track actual spending against this number"
  ];

  tab5Instructions.forEach((line, i) => {
    sheet.getRange(`A${119 + i}`).setValue(line).setFontSize(10);
  });

  // FAQ
  sheet.getRange("A137").setValue("✦ FAQ").setFontWeight("bold").setFontColor(SECONDARY_COLOR);

  const faq = [
    "Q: Can I add more debts?",
    "A: Group your smallest debts together as 'Other debts' and enter one line for the combined total.",
    "",
    "Q: Can I add more expense categories?",
    "A: Yes, add rows below row 20 in Budget Tracker.",
    "",
    "Q: What if my income changes each month?",
    "A: That's fine — enter each month separately.",
    "   The Scenario Engine uses an average.",
    "",
    "Q: I broke a formula. How do I fix it?",
    "A: Press Ctrl+Z to undo. Google Sheets has",
    "   unlimited undo and version history.",
    "",
    "Q: How do I share this with my partner?",
    "A: Click Share in Google Sheets. Both of you",
    "   can edit in real time.",
    "",
    "Q: Why does the Scenario Engine show a different",
    "   date than my debt payoff calculator?",
    "A: The Scenario Engine uses a weighted average APR",
    "   across all debts. Debt payoff calculators use",
    "   individual APRs. Both are correct — they answer",
    "   different questions.",
    "",
    "Q: What's the inflation adjustment for?",
    "A: It adjusts your interest rate for inflation. If",
    "   your debt APR is 8.5% and inflation is 3%, the",
    "   real cost of debt is 5.5%. Set to 0% for nominal."
  ];

  faq.forEach((line, i) => {
    sheet.getRange(`A${138 + i}`).setValue(line).setFontSize(10);
  });

  // NEED HELP
  sheet.getRange("A179").setValue("✦ NEED HELP?").setFontWeight("bold").setFontColor(SECONDARY_COLOR);
  sheet.getRange("A180").setValue("Questions? Message me on Etsy. I respond within 48 hours.").setFontSize(10);
  sheet.getRange("A181").setValue("30-day money-back guarantee.").setFontSize(10);

  // FORMATTING
  sheet.setColumnWidth(1, 400);
  sheet.setColumnWidth(2, 200);

  // Freeze row 1
  sheet.setFrozenRows(1);
}

function buildSpendableTab(sheet) {
  sheet.clear();

  const accentColor = "#10B981";

  // TITLE
  sheet.getRange("A1").setValue("SPENDABLE · Your guilt-free spending money")
    .setFontSize(16).setFontWeight("bold").setFontColor(HEADER_COLOR);
  sheet.getRange("A1:C1").setBackground("#F8FAFC");
  sheet.setRowHeight(1, 40);

  // BIG NUMBER: WEEKLY
  sheet.getRange("A3").setValue("✦ SPENDABLE").setFontWeight("bold").setFontColor(accentColor);

  sheet.getRange("A4").setValue("You have").setFontSize(12).setFontColor(HEADER_COLOR);
  sheet.getRange("B4").setFormula("=IFERROR(MAX(0,('Scenario Engine'!B6-'Scenario Engine'!B7-'Scenario Engine'!B11)*12/52),0)")
    .setFontSize(18).setFontWeight("bold").setFontColor(accentColor)
    .setNumberFormat("$#,##0");
  sheet.getRange("C4").setValue("this week").setFontSize(12).setFontColor(HEADER_COLOR);

  // BIG NUMBER: DAILY
  sheet.getRange("A6").setValue("You have").setFontSize(12).setFontColor(HEADER_COLOR);
  sheet.getRange("B6").setFormula("=IFERROR(MAX(0,B4/7),0)")
    .setFontSize(18).setFontWeight("bold").setFontColor(accentColor)
    .setNumberFormat("$#,##0.00");
  sheet.getRange("C6").setValue("this day").setFontSize(12).setFontColor(HEADER_COLOR);

  // BREAKDOWN
  sheet.getRange("A8").setValue("✦ HOW IT'S CALCULATED").setFontWeight("bold").setFontColor(SECONDARY_COLOR);

  // Monthly income
  sheet.getRange("A9").setValue("Monthly income").setFontSize(10).setFontColor(HEADER_COLOR);
  sheet.getRange("B9").setFormula("=MAX(0,'Scenario Engine'!B6)")
    .setNumberFormat("$#,##0").setFontSize(10).setFontWeight("bold");

  // Minus expenses
  sheet.getRange("A10").setValue("Minus expenses").setFontSize(10).setFontColor(HEADER_COLOR);
  sheet.getRange("B10").setFormula("=MAX(0,'Scenario Engine'!B7)")
    .setNumberFormat("$#,##0").setFontSize(10);

  // Minus debt payment
  sheet.getRange("A11").setValue("Minus debt payment").setFontSize(10).setFontColor(HEADER_COLOR);
  sheet.getRange("B11").setFormula("=MAX(0,'Scenario Engine'!B11)")
    .setNumberFormat("$#,##0").setFontSize(10);

  // Equals monthly spendable
  sheet.getRange("A12").setValue("Monthly spendable").setFontSize(10).setFontWeight("bold").setFontColor(HEADER_COLOR);
  sheet.getRange("B12").setFormula("=IFERROR(MAX(0,B9-B10-B11),0)")
    .setNumberFormat("$#,##0").setFontSize(10).setFontWeight("bold")
    .setBorder(true, false, false, false, false, false);

  // Weekly spendable (monthly × 12 months ÷ 52 weeks)
  sheet.getRange("A14").setValue("Monthly × 12 ÷ 52").setFontSize(10).setFontColor(HEADER_COLOR);
  sheet.getRange("B14").setFormula("=IFERROR(MAX(0,B12*12/52),0)")
    .setNumberFormat("$#,##0").setFontSize(10).setFontWeight("bold")
    .setBorder(true, false, false, false, false, false);
  sheet.getRange("C14").setValue("weekly spendable").setFontSize(10).setFontColor(SECONDARY_COLOR);

  // Divided by 7 = daily spendable
  sheet.getRange("A15").setValue("Divided by 7").setFontSize(10).setFontColor(HEADER_COLOR);
  sheet.getRange("B15").setFormula("=IFERROR(MAX(0,B14/7),0)")
    .setNumberFormat("$#,##0.00").setFontSize(10).setFontWeight("bold")
    .setBorder(true, false, false, false, false, false);
  sheet.getRange("C15").setValue("daily spendable").setFontSize(10).setFontColor(SECONDARY_COLOR);

  // NOTE
  sheet.getRange("A17").setValue("This is your guilt-free spending money after all obligations are met")
    .setFontSize(10).setFontStyle("italic").setFontColor(SECONDARY_COLOR);

  // FORMATTING
  sheet.setColumnWidth(1, 220);
  sheet.setColumnWidth(2, 150);
  sheet.setColumnWidth(3, 200);

  // Freeze row 1
  sheet.setFrozenRows(1);

  // Protection
  protectRange(sheet, "B4:B15", "Formulas — auto-calculated");
}

function addScenarioEngineValidation(sheet) {
  // B4: Income > 0
  sheet.getRange("B4").setDataValidation(
    SpreadsheetApp.newDataValidation()
      .requireNumberGreaterThan(0)
      .setAllowInvalid(false)
      .setHelpText("Enter a positive monthly income")
      .build()
  );

  // B5: Expenses > 0
  sheet.getRange("B5").setDataValidation(
    SpreadsheetApp.newDataValidation()
      .requireNumberGreaterThan(0)
      .setAllowInvalid(false)
      .setHelpText("Enter a positive monthly expense amount")
      .build()
  );

  // B6: Savings >= 0
  sheet.getRange("B6").setDataValidation(
    SpreadsheetApp.newDataValidation()
      .requireNumberGreaterThanOrEqualTo(0)
      .setAllowInvalid(false)
      .setHelpText("Savings cannot be negative")
      .build()
  );

  // B7: APR 0-50%
  sheet.getRange("B7").setDataValidation(
    SpreadsheetApp.newDataValidation()
      .requireNumberBetween(0, 0.5)
      .setAllowInvalid(false)
      .setHelpText("Rate must be between 0% and 50%")
      .build()
  );

  // B8: Debt >= 0
  sheet.getRange("B8").setDataValidation(
    SpreadsheetApp.newDataValidation()
      .requireNumberGreaterThanOrEqualTo(0)
      .setAllowInvalid(false)
      .setHelpText("Debt cannot be negative")
      .build()
  );

  // B9: Payment >= 0
  sheet.getRange("B9").setDataValidation(
    SpreadsheetApp.newDataValidation()
      .requireNumberGreaterThanOrEqualTo(0)
      .setAllowInvalid(false)
      .setHelpText("Payment cannot be negative")
      .build()
  );

  // B10: Inflation 0-15%
  sheet.getRange("B10").setDataValidation(
    SpreadsheetApp.newDataValidation()
      .requireNumberBetween(0, 0.15)
      .setAllowInvalid(false)
      .setHelpText("Inflation must be between 0% and 15%")
      .build()
  );

  // B11: Custom comparison #1 >= 0
  sheet.getRange("B11").setDataValidation(
    SpreadsheetApp.newDataValidation()
      .requireNumberGreaterThanOrEqualTo(0)
      .setAllowInvalid(false)
      .setHelpText("Custom comparison amount cannot be negative")
      .build()
  );

  // B12: Custom comparison #2 >= 0
  sheet.getRange("B12").setDataValidation(
    SpreadsheetApp.newDataValidation()
      .requireNumberGreaterThanOrEqualTo(0)
      .setAllowInvalid(false)
      .setHelpText("Custom comparison amount cannot be negative")
      .build()
  );

}

function addDebtPayoffValidation(sheet) {
  // B5:B8: Balance >= 0
  sheet.getRange("B5:B8").setDataValidation(
    SpreadsheetApp.newDataValidation()
      .requireNumberGreaterThanOrEqualTo(0)
      .setAllowInvalid(false)
      .setHelpText("Balance must be zero or positive")
      .build()
  );

  // C5:C8: APR 0-50%
  sheet.getRange("C5:C8").setDataValidation(
    SpreadsheetApp.newDataValidation()
      .requireNumberBetween(0, 0.5)
      .setAllowInvalid(false)
      .setHelpText("APR must be between 0% and 50%")
      .build()
  );

  // D5:D8: Min payment >= 0
  sheet.getRange("D5:D8").setDataValidation(
    SpreadsheetApp.newDataValidation()
      .requireNumberGreaterThanOrEqualTo(0)
      .setAllowInvalid(false)
      .setHelpText("Payment cannot be negative")
      .build()
  );

  // E5:E8: Extra payment >= 0
  sheet.getRange("E5:E8").setDataValidation(
    SpreadsheetApp.newDataValidation()
      .requireNumberGreaterThanOrEqualTo(0)
      .setAllowInvalid(false)
      .setHelpText("Extra payment cannot be negative")
      .build()
  );
}

function addScenarioEngineConditionalFormatting(sheet) {
  // B16: Months < 12 = green, 12-36 = yellow, 36+ = red
  const monthsRule1 = SpreadsheetApp.newConditionalFormatRule()
    .whenNumberLessThan(12)
    .setBackground("#DCFCE7")
    .setFontColor("#0F973C")
    .setRanges([sheet.getRange("B16")])
    .build();

  const monthsRule2 = SpreadsheetApp.newConditionalFormatRule()
    .whenNumberBetween(12, 35)
    .setBackground("#FEF9C3")
    .setFontColor("#A16207")
    .setRanges([sheet.getRange("B16")])
    .build();

  const monthsRule3 = SpreadsheetApp.newConditionalFormatRule()
    .whenNumberGreaterThanOrEqualTo(36)
    .setBackground("#FEE2E2")
    .setFontColor("#DC2626")
    .setRanges([sheet.getRange("B16")])
    .build();

  // B18: Interest saved > 0 = green
  const interestRule = SpreadsheetApp.newConditionalFormatRule()
    .whenNumberGreaterThan(0)
    .setFontColor("#10B981")
    .setRanges([sheet.getRange("B18")])
    .build();

  // B21: Emergency fund health score
  // <1 = red bg
  const emergencyRule1 = SpreadsheetApp.newConditionalFormatRule()
    .whenNumberLessThan(1)
    .setBackground("#FEE2E2")
    .setFontColor("#DC2626")
    .setRanges([sheet.getRange("B21")])
    .build();

  // 1-3 = yellow bg
  const emergencyRule2 = SpreadsheetApp.newConditionalFormatRule()
    .whenNumberBetween(1, 2.9)
    .setBackground("#FEF9C3")
    .setFontColor("#A16207")
    .setRanges([sheet.getRange("B21")])
    .build();

  // >3 = green bg
  const emergencyRule3 = SpreadsheetApp.newConditionalFormatRule()
    .whenNumberGreaterThanOrEqualTo(3)
    .setBackground("#DCFCE7")
    .setFontColor("#0F973C")
    .setRanges([sheet.getRange("B21")])
    .build();

  sheet.setConditionalFormatRules([monthsRule1, monthsRule2, monthsRule3, interestRule, emergencyRule1, emergencyRule2, emergencyRule3]);
}

function addBudgetTrackerConditionalFormatting(sheet) {
  // Net row (24): negative = red, positive = green
  const netNegativeRule = SpreadsheetApp.newConditionalFormatRule()
    .whenNumberLessThan(0)
    .setFontColor("#DC2626")
    .setRanges([sheet.getRange("B24:M24")])
    .build();

  const netPositiveRule = SpreadsheetApp.newConditionalFormatRule()
    .whenNumberGreaterThanOrEqualTo(0)
    .setFontColor("#10B981")
    .setRanges([sheet.getRange("B24:M24")])
    .build();

  // Savings rate (25): >= 20% = green bg, < 10% = red bg
  const savingsGoodRule = SpreadsheetApp.newConditionalFormatRule()
    .whenNumberGreaterThanOrEqualTo(0.2)
    .setBackground("#DCFCE7")
    .setFontColor("#0F973C")
    .setRanges([sheet.getRange("B25:M25")])
    .build();

  const savingsBadRule = SpreadsheetApp.newConditionalFormatRule()
    .whenNumberLessThan(0.1)
    .setBackground("#FEE2E2")
    .setFontColor("#DC2626")
    .setRanges([sheet.getRange("B25:M25")])
    .build();

  sheet.setConditionalFormatRules([netNegativeRule, netPositiveRule, savingsGoodRule, savingsBadRule]);
}

function addDebtPayoffConditionalFormatting(sheet) {
  // B5:B8: Balance = 0 = strikethrough
  const balanceZeroRule = SpreadsheetApp.newConditionalFormatRule()
    .whenNumberEqualTo(0)
    .setStrikethrough(true)
    .setFontColor("#94A3B8")
    .setRanges([sheet.getRange("B5:B8")])
    .build();

  // C5:C8: APR >= 20% = red
  const aprHighRule = SpreadsheetApp.newConditionalFormatRule()
    .whenNumberGreaterThanOrEqualTo(0.2)
    .setFontColor("#DC2626")
    .setRanges([sheet.getRange("C5:C8")])
    .build();

  // B16:C16: Interest saved > 0 = green bg
  const savedRule = SpreadsheetApp.newConditionalFormatRule()
    .whenNumberGreaterThan(0)
    .setBackground("#DCFCE7")
    .setFontColor("#10B981")
    .setRanges([sheet.getRange("B16:C16")])
    .build();

  sheet.setConditionalFormatRules([balanceZeroRule, aprHighRule, savedRule]);
}

function applyProtection(ss, tabs) {
  // Hide Engine tab
  tabs.engine.hideSheet();

  // Protect Engine tab (owner only)
  try {
    const engineProtection = tabs.engine.protect();
    engineProtection.setDescription("Engine tab — all formulas. Do not edit.");
    engineProtection.setWarningOnly(true);
  } catch (e) {
    Logger.log("Engine protection skipped: " + e.message);
  }
}

/**
 * Reads live debt data from the Debt Payoff tab and recalculates
 * the debt payoff simulation in the Engine tab.
 * Called automatically on debt edits, or manually via menu.
 */
function recalculateDebtSimulation() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const engineSheet = ss.getSheetByName("Engine");
    const debtSheet = ss.getSheetByName("Debt Payoff");
    if (!engineSheet || !debtSheet) {
      Logger.log("Engine or Debt Payoff tab not found — skipping recalculation");
      return;
    }

    // Read debt data from Debt Payoff tab (rows 5-8: B=balance, C=APR, D=min, E=extra)
    const debtRange = debtSheet.getRange("B5:E8").getValues();
    const debts = debtRange
      .filter(row => row[0] && row[0] > 0) // skip empty/zero debts
      .map(row => ({
        name: "",
        balance: row[0],
        apr: row[1],
        minPayment: row[2],
        extraPayment: row[3] || 0
      }));

    if (debts.length === 0) {
      Logger.log("No debts found — setting simulation to 0");
      engineSheet.getRange("B20").setValue(0);
      engineSheet.getRange("B21").setValue(0);
      engineSheet.getRange("B22").setValue(0);
      engineSheet.getRange("B23").setValue(0);
      engineSheet.getRange("B24").setValue(0);
      engineSheet.getRange("B25").setValue(0);
      engineSheet.getRange("I20").setValue(1); // trivially converged
      engineSheet.getRange("J20").setValue(1);
      return;
    }

    const snowball = simulatePayoff(debts, "snowball");
    const avalanche = simulatePayoff(debts, "avalanche");

    engineSheet.getRange("B20").setValue(snowball.totalMonths);
    engineSheet.getRange("B21").setValue(avalanche.totalMonths);
    engineSheet.getRange("B22").setValue(snowball.totalInterest);
    engineSheet.getRange("B23").setValue(avalanche.totalInterest);

    // Calculate minimum-only interest for interest saved comparison
    const minOnly = simulatePayoff(debts.map(d => ({...d, extraPayment: 0})), "snowball");
    engineSheet.getRange("B24").setValue(Math.max(0, minOnly.totalInterest - snowball.totalInterest));
    engineSheet.getRange("B25").setValue(Math.max(0, minOnly.totalInterest - avalanche.totalInterest));

    // Write convergence flags for display formulas
    engineSheet.getRange("I20").setValue(snowball.converged ? 1 : 0);
    engineSheet.getRange("J20").setValue(avalanche.converged ? 1 : 0);

    // Update per-debt payoff months (C2:D5) and convergence (I2:J5)
    for (let i = 0; i < debts.length; i++) {
      engineSheet.getRange(`C${i + 2}`).setValue(snowball.payoffMonths[i]);
      engineSheet.getRange(`D${i + 2}`).setValue(avalanche.payoffMonths[i]);
      engineSheet.getRange(`I${i + 2}`).setValue(snowball.convergedPerDebt[i] ? 1 : 0);
      engineSheet.getRange(`J${i + 2}`).setValue(avalanche.convergedPerDebt[i] ? 1 : 0);
    }

    Logger.log("Debt simulation recalculated: Snowball=" + snowball.totalMonths + "mo, Avalanche=" + avalanche.totalMonths + "mo");
  } catch (e) {
    // ERROR HANDLING STRATEGY:
    // - Sheets API errors (e.g., rate limits, network failures): log and fail silently
    //   because the user can retry manually via menu or onEdit trigger.
    // - Null sheet errors: already handled above with early return.
    // - Data corruption / unexpected errors: re-throw so the user sees the error
    //   and can investigate. Silent failures hide data integrity problems.
    const isSheetsApiError = e.message &&
      (e.message.includes("Service Spreadsheets") ||
       e.message.includes("Rate Limit") ||
       e.message.includes("network") ||
       e.message.includes("timeout") ||
       e.message.includes("internal error"));

    if (isSheetsApiError) {
      Logger.log("Sheets API error in recalculateDebtSimulation (retryable): " + e.message);
    } else {
      Logger.log("UNEXPECTED ERROR in recalculateDebtSimulation: " + e.message);
      Logger.log(e.stack);
      throw e;
    }
  }
}

/**
 * onEdit trigger — recalculates debt simulation only when the user edits
 * a debt input cell (rows 5-8, columns B-E) in the Debt Payoff tab.
 */
function onEdit(e) {
  const sheet = e.source.getActiveSheet();
  const range = e.range;
  
  // Debt Payoff tab — recalculate simulation
  if (sheet.getName() !== "Debt Payoff") return;
  if (range.getRow() >= 5 && range.getRow() <= 8 &&
      range.getColumn() >= 2 && range.getColumn() <= 5) {
    recalculateDebtSimulation();
  }
}
