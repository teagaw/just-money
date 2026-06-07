# Generates 02-transactions.csv for Budget Pro 2026
# 3 months (Mar-May 2026), all 25 categories, accounts match 05-accounts.csv

$accounts = @('Chase Checking','Chase Visa','Ally Savings','Cash Wallet')
$accountsCredit = @('Chase Visa')
$accountsDebit = @('Chase Checking')

# Category = exactly from data-vocabulary.md (25 categories)
$cats = @(
  'Housing','Groceries','Dining','Transport','Insurance','Healthcare',
  'Entertainment','Subscriptions','Personal Care','Clothing','Education',
  'Kids','Pets','Gifts','Charity','Travel','Utilities','Phone','Internet',
  'Fitness','Hobbies','Home','Business','Taxes','Other'
)

# Build transaction list: date, account, payee, type, amount, category, memo
$tx = New-Object System.Collections.Generic.List[Object]

# ======== INCOME ========
# Biweekly salary, $5,400 net, on Chase Checking
$salaryDates = @(
  [datetime]'2026-03-06',[datetime]'2026-03-20',
  [datetime]'2026-04-03',[datetime]'2026-04-17',[datetime]'2026-05-01',
  [datetime]'2026-05-15',[datetime]'2026-05-29'
)
foreach ($d in $salaryDates) {
  $tx.Add([pscustomobject]@{
    Date = $d.ToString('yyyy-MM-dd')
    Account = 'Chase Checking'
    Payee = 'Acme Corp Payroll'
    Type = 'Income'
    Amount = '5400.00'
    Category = 'Business'
    Memo = 'Bi-weekly salary'
  })
}

# Freelance income
$freelance = @(
  [pscustomobject]@{D='2026-03-22'; P='Side Gig Client'; A='650.00'; M='Logo design'},
  [pscustomobject]@{D='2026-04-18'; P='Side Gig Client'; A='420.00'; M='Web copy'},
  [pscustomobject]@{D='2026-05-12'; P='Side Gig Client'; A='580.00'; M='Landing page'},
  [pscustomobject]@{D='2026-04-05'; P='Ally Bank'; A='24.00'; M='Interest'},
  [pscustomobject]@{D='2026-05-30'; P='Amazon'; A='35.00'; M='Refund'}
)
foreach ($f in $freelance) {
  $tx.Add([pscustomobject]@{
    Date = $f.D
    Account = 'Chase Checking'
    Payee = $f.P
    Type = 'Income'
    Amount = $f.A
    Category = 'Business'
    Memo = $f.M
  })
}
# Interest and refund go to "Other" instead of Business per vocabulary
$tx[-2].Category = 'Other'
$tx[-1].Category = 'Other'

# ======== TRANSFERS ========
# Auto-save to Ally every payday
foreach ($d in $salaryDates) {
  $tx.Add([pscustomobject]@{
    Date = $d.ToString('yyyy-MM-dd')
    Account = 'Chase Checking'
    Payee = 'Transfer to Ally Savings'
    Type = 'Transfer'
    Amount = '500.00'
    Category = 'Other'
    Memo = 'Auto-save'
  })
}
# Loan payments
$loanPays = @(
  [pscustomobject]@{D='2026-03-15'; P='Nelnet Student Loan'; A='180.00'; M='Monthly payment'},
  [pscustomobject]@{D='2026-04-15'; P='Nelnet Student Loan'; A='180.00'; M='Monthly payment'},
  [pscustomobject]@{D='2026-05-15'; P='Nelnet Student Loan'; A='180.00'; M='Monthly payment'},
  [pscustomobject]@{D='2026-03-22'; P='Capital One Auto Loan'; A='225.00'; M='Monthly payment'},
  [pscustomobject]@{D='2026-04-22'; P='Capital One Auto Loan'; A='225.00'; M='Monthly payment'},
  [pscustomobject]@{D='2026-05-22'; P='Capital One Auto Loan'; A='225.00'; M='Monthly payment'}
)
foreach ($l in $loanPays) {
  $tx.Add([pscustomobject]@{
    Date = $l.D
    Account = 'Chase Checking'
    Payee = $l.P
    Type = 'Transfer'
    Amount = $l.A
    Category = 'Other'
    Memo = $l.M
  })
}
# Investment contributions
$inv = @(
  [pscustomobject]@{D='2026-03-31'; P='Vanguard Brokerage'; A='500.00'; M='Monthly contribution'},
  [pscustomobject]@{D='2026-04-30'; P='Vanguard Brokerage'; A='500.00'; M='Monthly contribution'},
  [pscustomobject]@{D='2026-05-31'; P='Vanguard Brokerage'; A='500.00'; M='Monthly contribution'}
)
foreach ($i in $inv) {
  $tx.Add([pscustomobject]@{
    Date = $i.D
    Account = 'Chase Checking'
    Payee = $i.P
    Type = 'Transfer'
    Amount = $i.A
    Category = 'Other'
    Memo = $i.M
  })
}
# Credit card payment
$ccPay = @(
  [pscustomobject]@{D='2026-03-15'; P='Chase Visa Payment'; A='485.00'; M='Card payoff'},
  [pscustomobject]@{D='2026-04-15'; P='Chase Visa Payment'; A='485.00'; M='Card payoff'},
  [pscustomobject]@{D='2026-05-15'; P='Chase Visa Payment'; A='485.00'; M='Card payoff'}
)
foreach ($c in $ccPay) {
  $tx.Add([pscustomobject]@{
    Date = $c.D
    Account = 'Chase Checking'
    Payee = $c.P
    Type = 'Transfer'
    Amount = $c.A
    Category = 'Other'
    Memo = $c.M
  })
}

# ======== FIXED EXPENSES (Housing, Utilities, Phone, Internet, Insurance, Subscriptions, Fitness) ========
$fixed = @(
  # Housing
  [pscustomobject]@{D='2026-03-01'; Acct='Chase Checking'; P='Landlord';    A='1450.00'; C='Housing';      M='Monthly rent'},
  [pscustomobject]@{D='2026-04-01'; Acct='Chase Checking'; P='Landlord';    A='1450.00'; C='Housing';      M='Monthly rent'},
  [pscustomobject]@{D='2026-05-01'; Acct='Chase Checking'; P='Landlord';    A='1450.00'; C='Housing';      M='Monthly rent'},
  # Utilities
  [pscustomobject]@{D='2026-03-05'; Acct='Chase Checking'; P='PG&E';        A='142.00';  C='Utilities';    M='Electric'},
  [pscustomobject]@{D='2026-04-05'; Acct='Chase Checking'; P='PG&E';        A='128.00';  C='Utilities';    M='Electric'},
  [pscustomobject]@{D='2026-05-05'; Acct='Chase Checking'; P='PG&E';        A='135.00';  C='Utilities';    M='Electric'},
  [pscustomobject]@{D='2026-03-12'; Acct='Chase Checking'; P='Gas Company'; A='68.00';   C='Utilities';    M='Heat'},
  [pscustomobject]@{D='2026-04-12'; Acct='Chase Checking'; P='Gas Company'; A='72.00';   C='Utilities';    M='Heat'},
  [pscustomobject]@{D='2026-05-12'; Acct='Chase Checking'; P='Gas Company'; A='65.00';   C='Utilities';    M='Heat'},
  [pscustomobject]@{D='2026-03-08'; Acct='Chase Checking'; P='Water Dept';  A='45.00';   C='Utilities';    M='Water + sewer'},
  [pscustomobject]@{D='2026-04-08'; Acct='Chase Checking'; P='Water Dept';  A='45.00';   C='Utilities';    M='Water + sewer'},
  [pscustomobject]@{D='2026-05-08'; Acct='Chase Checking'; P='Water Dept';  A='45.00';   C='Utilities';    M='Water + sewer'},
  # Phone
  [pscustomobject]@{D='2026-03-10'; Acct='Chase Checking'; P='Verizon';     A='55.00';   C='Phone';        M='Mobile'},
  [pscustomobject]@{D='2026-04-10'; Acct='Chase Checking'; P='Verizon';     A='55.00';   C='Phone';        M='Mobile'},
  [pscustomobject]@{D='2026-05-10'; Acct='Chase Checking'; P='Verizon';     A='55.00';   C='Phone';        M='Mobile'},
  # Internet
  [pscustomobject]@{D='2026-03-08'; Acct='Chase Checking'; P='Comcast';     A='89.00';   C='Internet';     M='Home internet'},
  [pscustomobject]@{D='2026-04-08'; Acct='Chase Checking'; P='Comcast';     A='89.00';   C='Internet';     M='Home internet'},
  [pscustomobject]@{D='2026-05-08'; Acct='Chase Checking'; P='Comcast';     A='89.00';   C='Internet';     M='Home internet'},
  # Insurance (Geico auto on Chase Checking monthly)
  [pscustomobject]@{D='2026-03-15'; Acct='Chase Checking'; P='Geico Auto';  A='118.50';  C='Insurance';    M='Auto policy'},
  [pscustomobject]@{D='2026-04-15'; Acct='Chase Checking'; P='Geico Auto';  A='118.50';  C='Insurance';    M='Auto policy'},
  [pscustomobject]@{D='2026-05-15'; Acct='Chase Checking'; P='Geico Auto';  A='118.50';  C='Insurance';    M='Auto policy'},
  [pscustomobject]@{D='2026-03-22'; Acct='Chase Checking'; P='Lemonade Renters'; A='18.00'; C='Insurance'; M='Renters'},
  [pscustomobject]@{D='2026-04-22'; Acct='Chase Checking'; P='Lemonade Renters'; A='18.00'; C='Insurance'; M='Renters'},
  [pscustomobject]@{D='2026-05-22'; Acct='Chase Checking'; P='Lemonade Renters'; A='18.00'; C='Insurance'; M='Renters'},
  # Subscriptions (recurring monthly)
  [pscustomobject]@{D='2026-03-04'; Acct='Chase Checking'; P='Netflix';     A='15.99';   C='Subscriptions'; M='Streaming'},
  [pscustomobject]@{D='2026-04-04'; Acct='Chase Checking'; P='Netflix';     A='15.99';   C='Subscriptions'; M='Streaming'},
  [pscustomobject]@{D='2026-05-04'; Acct='Chase Checking'; P='Netflix';     A='15.99';   C='Subscriptions'; M='Streaming'},
  [pscustomobject]@{D='2026-03-12'; Acct='Chase Checking'; P='Spotify';     A='10.99';   C='Subscriptions'; M='Music'},
  [pscustomobject]@{D='2026-04-12'; Acct='Chase Checking'; P='Spotify';     A='10.99';   C='Subscriptions'; M='Music'},
  [pscustomobject]@{D='2026-05-12'; Acct='Chase Checking'; P='Spotify';     A='10.99';   C='Subscriptions'; M='Music'},
  [pscustomobject]@{D='2026-03-15'; Acct='Chase Visa';     P='Adobe Creative Cloud'; A='54.99'; C='Subscriptions'; M='Software'},
  [pscustomobject]@{D='2026-04-15'; Acct='Chase Visa';     P='Adobe Creative Cloud'; A='54.99'; C='Subscriptions'; M='Software'},
  [pscustomobject]@{D='2026-05-15'; Acct='Chase Visa';     P='Adobe Creative Cloud'; A='54.99'; C='Subscriptions'; M='Software'},
  [pscustomobject]@{D='2026-03-22'; Acct='Chase Visa';     P='New York Times';      A='17.00';  C='Subscriptions'; M='News'},
  [pscustomobject]@{D='2026-04-22'; Acct='Chase Visa';     P='New York Times';      A='17.00';  C='Subscriptions'; M='News'},
  [pscustomobject]@{D='2026-05-22'; Acct='Chase Visa';     P='New York Times';      A='17.00';  C='Subscriptions'; M='News'},
  [pscustomobject]@{D='2026-03-08'; Acct='Chase Visa';     P='iCloud Storage';      A='2.99';   C='Subscriptions'; M='Backup'},
  [pscustomobject]@{D='2026-04-08'; Acct='Chase Visa';     P='iCloud Storage';      A='2.99';   C='Subscriptions'; M='Backup'},
  [pscustomobject]@{D='2026-05-08'; Acct='Chase Visa';     P='iCloud Storage';      A='2.99';   C='Subscriptions'; M='Backup'},
  [pscustomobject]@{D='2026-03-08'; Acct='Chase Visa';     P='ChatGPT Plus';        A='20.00';  C='Subscriptions'; M='AI assistant'},
  [pscustomobject]@{D='2026-04-08'; Acct='Chase Visa';     P='ChatGPT Plus';        A='20.00';  C='Subscriptions'; M='AI assistant'},
  [pscustomobject]@{D='2026-05-08'; Acct='Chase Visa';     P='ChatGPT Plus';        A='20.00';  C='Subscriptions'; M='AI assistant'},
  # Fitness
  [pscustomobject]@{D='2026-03-10'; Acct='Chase Checking'; P='Planet Fitness'; A='24.99'; C='Fitness'; M='Gym membership'},
  [pscustomobject]@{D='2026-04-10'; Acct='Chase Checking'; P='Planet Fitness'; A='24.99'; C='Fitness'; M='Gym membership'},
  [pscustomobject]@{D='2026-05-10'; Acct='Chase Checking'; P='Planet Fitness'; A='24.99'; C='Fitness'; M='Gym membership'}
)
foreach ($f in $fixed) {
  $tx.Add([pscustomobject]@{
    Date = $f.D
    Account = $f.Acct
    Payee = $f.P
    Type = 'Expense'
    Amount = $f.A
    Category = $f.C
    Memo = $f.M
  })
}

# ======== VARIABLE EXPENSES ========
# Groceries (frequent)
$groceries = @(
  [pscustomobject]@{D='2026-03-02'; Acct='Chase Visa';     P='Whole Foods'; A='87.43'; M='Stock-up'},
  [pscustomobject]@{D='2026-03-13'; Acct='Chase Visa';     P='Trader Joes'; A='52.30'; M='Quick stop'},
  [pscustomobject]@{D='2026-03-19'; Acct='Chase Visa';     P='Costco';      A='178.45'; M='Bulk'},
  [pscustomobject]@{D='2026-03-22'; Acct='Chase Checking'; P='Trader Joes'; A='32.15'; M='Quick stop'},
  [pscustomobject]@{D='2026-03-26'; Acct='Chase Checking'; P='Safeway';     A='67.20'; M='Top-up'},
  [pscustomobject]@{D='2026-04-02'; Acct='Chase Visa';     P='Whole Foods'; A='95.20'; M='Stock-up'},
  [pscustomobject]@{D='2026-04-11'; Acct='Chase Visa';     P='Trader Joes'; A='61.40'; M='Stock-up'},
  [pscustomobject]@{D='2026-04-17'; Acct='Chase Visa';     P='Costco';      A='192.30'; M='Bulk'},
  [pscustomobject]@{D='2026-04-20'; Acct='Chase Checking'; P='Trader Joes'; A='28.95'; M='Quick stop'},
  [pscustomobject]@{D='2026-04-25'; Acct='Chase Checking'; P='Safeway';     A='72.10'; M='Top-up'},
  [pscustomobject]@{D='2026-04-29'; Acct='Chase Checking'; P='Whole Foods'; A='45.30'; M='Top-up'},
  [pscustomobject]@{D='2026-05-02'; Acct='Chase Visa';     P='Whole Foods'; A='82.10'; M='Stock-up'},
  [pscustomobject]@{D='2026-05-11'; Acct='Chase Visa';     P='Trader Joes'; A='48.30'; M='Stock-up'},
  [pscustomobject]@{D='2026-05-17'; Acct='Chase Visa';     P='Costco';      A='168.20'; M='Bulk'},
  [pscustomobject]@{D='2026-05-20'; Acct='Chase Checking'; P='Trader Joes'; A='31.40'; M='Quick stop'},
  [pscustomobject]@{D='2026-05-25'; Acct='Chase Checking'; P='Safeway';     A='62.50'; M='Top-up'},
  [pscustomobject]@{D='2026-05-29'; Acct='Chase Checking'; P='Whole Foods'; A='52.10'; M='Top-up'}
)
foreach ($g in $groceries) {
  $tx.Add([pscustomobject]@{
    Date = $g.D
    Account = $g.Acct
    Payee = $g.P
    Type = 'Expense'
    Amount = $g.A
    Category = 'Groceries'
    Memo = $g.M
  })
}

# Dining (frequent)
$dining = @(
  [pscustomobject]@{D='2026-03-04'; Acct='Chase Checking'; P='Chipotle';   A='14.85'; M='Lunch'},
  [pscustomobject]@{D='2026-03-07'; Acct='Chase Checking'; P='Starbucks';  A='6.75';  M='Coffee'},
  [pscustomobject]@{D='2026-03-16'; Acct='Chase Checking'; P='Olive Garden'; A='42.50'; M='Dinner with friends'},
  [pscustomobject]@{D='2026-03-27'; Acct='Chase Checking'; P='Bar Tab';    A='42.00'; M='Birthday'},
  [pscustomobject]@{D='2026-04-05'; Acct='Chase Checking'; P='Chipotle';   A='16.45'; M='Lunch'},
  [pscustomobject]@{D='2026-04-06'; Acct='Chase Checking'; P='Uber Eats';  A='32.10'; M='Dinner delivery'},
  [pscustomobject]@{D='2026-04-08'; Acct='Chase Checking'; P='Starbucks';  A='7.25';  M='Coffee'},
  [pscustomobject]@{D='2026-04-14'; Acct='Chase Checking'; P='Cafe';       A='12.50'; M='Brunch'},
  [pscustomobject]@{D='2026-05-05'; Acct='Chase Checking'; P='Chipotle';   A='15.25'; M='Lunch'},
  [pscustomobject]@{D='2026-05-08'; Acct='Chase Checking'; P='Starbucks';  A='6.50';  M='Coffee'},
  [pscustomobject]@{D='2026-05-14'; Acct='Chase Checking'; P='Cafe';       A='11.80'; M='Meeting'},
  [pscustomobject]@{D='2026-05-31'; Acct='Chase Checking'; P='Restaurant'; A='68.40'; M='Date night'}
)
foreach ($d in $dining) {
  $tx.Add([pscustomobject]@{
    Date = $d.D
    Account = $d.Acct
    Payee = $d.P
    Type = 'Expense'
    Amount = $d.A
    Category = 'Dining'
    Memo = $d.M
  })
}

# Transport
$transport = @(
  [pscustomobject]@{D='2026-03-02'; Acct='Chase Checking'; P='Shell Gas';  A='42.10'; M='Fill up'},
  [pscustomobject]@{D='2026-03-05'; Acct='Chase Checking'; P='Uber';       A='18.50'; M='Airport'},
  [pscustomobject]@{D='2026-04-03'; Acct='Chase Checking'; P='Shell Gas';  A='38.50'; M='Fill up'},
  [pscustomobject]@{D='2026-04-25'; Acct='Chase Checking'; P='Uber';       A='14.00'; M='Downtown'},
  [pscustomobject]@{D='2026-05-03'; Acct='Chase Checking'; P='Shell Gas';  A='40.00'; M='Fill up'},
  [pscustomobject]@{D='2026-05-06'; Acct='Chase Checking'; P='Uber';       A='22.00'; M='Airport ride'},
  [pscustomobject]@{D='2026-05-21'; Acct='Chase Checking'; P='Lyft';       A='18.50'; M='Across town'}
)
foreach ($t in $transport) {
  $tx.Add([pscustomobject]@{
    Date = $t.D
    Account = $t.Acct
    Payee = $t.P
    Type = 'Expense'
    Amount = $t.A
    Category = 'Transport'
    Memo = $t.M
  })
}

# Healthcare
$healthcare = @(
  [pscustomobject]@{D='2026-03-25'; Acct='Chase Checking'; P='Pharmacy';     A='18.50'; M='Vitamins'},
  [pscustomobject]@{D='2026-03-31'; Acct='Chase Checking'; P='Dentist';      A='165.00'; M='Cleaning'},
  [pscustomobject]@{D='2026-04-24'; Acct='Chase Checking'; P='Pharmacy';     A='22.40'; M='Vitamins'},
  [pscustomobject]@{D='2026-04-30'; Acct='Chase Checking'; P='Doctor Copay'; A='45.00'; M='Visit'},
  [pscustomobject]@{D='2026-05-24'; Acct='Chase Checking'; P='Pharmacy';     A='15.80'; M='Vitamins'},
  [pscustomobject]@{D='2026-05-30'; Acct='Chase Checking'; P='Dentist';      A='85.00'; M='Cleaning'}
)
foreach ($h in $healthcare) {
  $tx.Add([pscustomobject]@{
    Date = $h.D
    Account = $h.Acct
    Payee = $h.P
    Type = 'Expense'
    Amount = $h.A
    Category = 'Healthcare'
    Memo = $h.M
  })
}

# Entertainment
$entertainment = @(
  [pscustomobject]@{D='2026-03-23'; Acct='Chase Checking'; P='Cinema';   A='28.00'; M='Movie night'},
  [pscustomobject]@{D='2026-04-10'; Acct='Chase Checking'; P='AMC';      A='42.00'; M='Concessions'},
  [pscustomobject]@{D='2026-04-23'; Acct='Chase Checking'; P='Cinema';   A='32.00'; M='Movie night'},
  [pscustomobject]@{D='2026-05-09'; Acct='Chase Checking'; P='Concert';  A='85.00'; M='Live show'},
  [pscustomobject]@{D='2026-05-23'; Acct='Chase Checking'; P='Cinema';   A='30.00'; M='Movie night'}
)
foreach ($e in $entertainment) {
  $tx.Add([pscustomobject]@{
    Date = $e.D
    Account = $e.Acct
    Payee = $e.P
    Type = 'Expense'
    Amount = $e.A
    Category = 'Entertainment'
    Memo = $e.M
  })
}

# Personal Care
$personal = @(
  [pscustomobject]@{D='2026-03-30'; Acct='Chase Checking'; P='Barber'; A='28.00'; M='Haircut'},
  [pscustomobject]@{D='2026-04-28'; Acct='Chase Checking'; P='Barber'; A='28.00'; M='Haircut'},
  [pscustomobject]@{D='2026-05-28'; Acct='Chase Checking'; P='Barber'; A='28.00'; M='Haircut'},
  [pscustomobject]@{D='2026-03-15'; Acct='Chase Checking'; P='CVS';     A='24.30'; M='Toiletries'},
  [pscustomobject]@{D='2026-04-19'; Acct='Chase Checking'; P='CVS';     A='18.40'; M='Toiletries'},
  [pscustomobject]@{D='2026-05-17'; Acct='Chase Checking'; P='CVS';     A='22.80'; M='Toiletries'}
)
foreach ($p in $personal) {
  $tx.Add([pscustomobject]@{
    Date = $p.D
    Account = $p.Acct
    Payee = $p.P
    Type = 'Expense'
    Amount = $p.A
    Category = 'Personal Care'
    Memo = $p.M
  })
}

# Clothing
$clothing = @(
  [pscustomobject]@{D='2026-03-09'; Acct='Chase Visa';     P='Uniqlo';     A='89.00'; M='Spring shirt'},
  [pscustomobject]@{D='2026-04-12'; Acct='Chase Visa';     P='Patagonia';  A='149.00'; M='Hiking jacket'},
  [pscustomobject]@{D='2026-05-15'; Acct='Chase Visa';     P='Nordstrom';  A='78.50'; M='Summer outfit'}
)
foreach ($c in $clothing) {
  $tx.Add([pscustomobject]@{
    Date = $c.D
    Account = $c.Acct
    Payee = $c.P
    Type = 'Expense'
    Amount = $c.A
    Category = 'Clothing'
    Memo = $c.M
  })
}

# Education
$education = @(
  [pscustomobject]@{D='2026-03-18'; Acct='Chase Visa';     P='Amazon Books'; A='32.40'; M='Two books'},
  [pscustomobject]@{D='2026-04-22'; Acct='Chase Visa';     P='Udemy';        A='24.99'; M='Course'},
  [pscustomobject]@{D='2026-05-12'; Acct='Chase Visa';     P='Amazon Books'; A='28.50'; M='Two books'}
)
foreach ($e in $education) {
  $tx.Add([pscustomobject]@{
    Date = $e.D
    Account = $e.Acct
    Payee = $e.P
    Type = 'Expense'
    Amount = $e.A
    Category = 'Education'
    Memo = $e.M
  })
}

# Pets
$pets = @(
  [pscustomobject]@{D='2026-03-14'; Acct='Chase Checking'; P='Chewy';     A='64.30'; M='Food + treats'},
  [pscustomobject]@{D='2026-03-26'; Acct='Chase Checking'; P='Vet Clinic'; A='85.00'; M='Checkup'},
  [pscustomobject]@{D='2026-04-14'; Acct='Chase Checking'; P='Chewy';     A='64.30'; M='Food + treats'},
  [pscustomobject]@{D='2026-05-10'; Acct='Chase Checking'; P='Chewy';     A='64.30'; M='Food + treats'}
)
foreach ($p in $pets) {
  $tx.Add([pscustomobject]@{
    Date = $p.D
    Account = $p.Acct
    Payee = $p.P
    Type = 'Expense'
    Amount = $p.A
    Category = 'Pets'
    Memo = $p.M
  })
}

# Gifts
$gifts = @(
  [pscustomobject]@{D='2026-03-15'; Acct='Chase Visa';     P='Amazon';    A='42.00'; M='Birthday gift'},
  [pscustomobject]@{D='2026-04-20'; Acct='Chase Checking'; P='Local Shop'; A='35.00'; M='Wedding gift'},
  [pscustomobject]@{D='2026-05-08'; Acct='Chase Visa';     P='Amazon';    A='28.00'; M='Thank you gift'}
)
foreach ($g in $gifts) {
  $tx.Add([pscustomobject]@{
    Date = $g.D
    Account = $g.Acct
    Payee = $g.P
    Type = 'Expense'
    Amount = $g.A
    Category = 'Gifts'
    Memo = $g.M
  })
}

# Kids
$txKids = @(
  [pscustomobject]@{D='2026-04-26'; Acct='Chase Checking'; P='Activity Hero'; A='65.00'; M='Niece birthday outing'},
  [pscustomobject]@{D='2026-05-22'; Acct='Chase Checking'; P='Toys R Us';     A='48.00'; M='Nephew gift'}
)
foreach ($k in $txKids) {
  $tx.Add([pscustomobject]@{
    Date = $k.D
    Account = $k.Acct
    Payee = $k.P
    Type = 'Expense'
    Amount = $k.A
    Category = 'Kids'
    Memo = $k.M
  })
}

# Charity
$charity = @(
  [pscustomobject]@{D='2026-03-01'; Acct='Chase Checking'; P='Red Cross';     A='50.00'; M='Monthly donation'},
  [pscustomobject]@{D='2026-04-01'; Acct='Chase Checking'; P='Red Cross';     A='50.00'; M='Monthly donation'},
  [pscustomobject]@{D='2026-05-01'; Acct='Chase Checking'; P='Red Cross';     A='50.00'; M='Monthly donation'}
)
foreach ($c in $charity) {
  $tx.Add([pscustomobject]@{
    Date = $c.D
    Account = $c.Acct
    Payee = $c.P
    Type = 'Expense'
    Amount = $c.A
    Category = 'Charity'
    Memo = $c.M
  })
}

# Travel (mostly zero or single trip)
$travel = @(
  [pscustomobject]@{D='2026-03-15'; Acct='Chase Visa';     P='United Airlines'; A='425.00'; M='Flight booking'},
  [pscustomobject]@{D='2026-05-05'; Acct='Chase Visa';     P='Marriott';       A='198.00'; M='Hotel deposit'}
)
foreach ($t in $travel) {
  $tx.Add([pscustomobject]@{
    Date = $t.D
    Account = $t.Acct
    Payee = $t.P
    Type = 'Expense'
    Amount = $t.A
    Category = 'Travel'
    Memo = $t.M
  })
}

# Hobbies
$hobbies = @(
  [pscustomobject]@{D='2026-03-21'; Acct='Chase Checking'; P='Climbing Gym';   A='85.00'; M='Day pass + shoes'},
  [pscustomobject]@{D='2026-04-18'; Acct='Chase Checking'; P='REI';            A='42.00'; M='Climbing gear'},
  [pscustomobject]@{D='2026-05-16'; Acct='Chase Checking'; P='Climbing Gym';   A='85.00'; M='Day pass + shoes'}
)
foreach ($h in $hobbies) {
  $tx.Add([pscustomobject]@{
    Date = $h.D
    Account = $h.Acct
    Payee = $h.P
    Type = 'Expense'
    Amount = $h.A
    Category = 'Hobbies'
    Memo = $h.M
  })
}

# Home
$txHome = @(
  [pscustomobject]@{D='2026-03-28'; Acct='Chase Visa';     P='Target';         A='42.00'; M='Cleaning supplies'},
  [pscustomobject]@{D='2026-04-26'; Acct='Chase Visa';     P='Target';         A='38.00'; M='Cleaning supplies'},
  [pscustomobject]@{D='2026-05-18'; Acct='Chase Checking'; P='Home Depot';     A='85.00'; M='Light fixture'},
  [pscustomobject]@{D='2026-05-27'; Acct='Chase Visa';     P='Target';         A='48.30'; M='Cleaning supplies'}
)
foreach ($h in $txHome) {
  $tx.Add([pscustomobject]@{
    Date = $h.D
    Account = $h.Acct
    Payee = $h.P
    Type = 'Expense'
    Amount = $h.A
    Category = 'Home'
    Memo = $h.M
  })
}

# Business (expense side)
$business = @(
  [pscustomobject]@{D='2026-03-20'; Acct='Chase Visa';     P='WeWork'; A='250.00'; M='Day pass pack'},
  [pscustomobject]@{D='2026-04-19'; Acct='Chase Visa';     P='WeWork'; A='250.00'; M='Day pass pack'},
  [pscustomobject]@{D='2026-05-19'; Acct='Chase Visa';     P='WeWork'; A='250.00'; M='Day pass pack'}
)
foreach ($b in $business) {
  $tx.Add([pscustomobject]@{
    Date = $b.D
    Account = $b.Acct
    Payee = $b.P
    Type = 'Expense'
    Amount = $b.A
    Category = 'Business'
    Memo = $b.M
  })
}

# Taxes (quarterly)
$taxes = @(
  [pscustomobject]@{D='2026-04-15'; Acct='Chase Checking'; P='IRS'; A='425.00'; M='Q1 estimated tax'}
)
foreach ($t in $taxes) {
  $tx.Add([pscustomobject]@{
    Date = $t.D
    Account = $t.Acct
    Payee = $t.P
    Type = 'Expense'
    Amount = $t.A
    Category = 'Taxes'
    Memo = $t.M
  })
}

# Other (cash, ATM, fees)
$other = @(
  [pscustomobject]@{D='2026-03-12'; Acct='Cash Wallet';    P='ATM Withdrawal'; A='100.00'; M='Cash'},
  [pscustomobject]@{D='2026-04-09'; Acct='Cash Wallet';    P='ATM Withdrawal'; A='80.00';  M='Cash'},
  [pscustomobject]@{D='2026-05-11'; Acct='Cash Wallet';    P='ATM Withdrawal'; A='100.00'; M='Cash'},
  [pscustomobject]@{D='2026-04-30'; Acct='Chase Checking'; P='Bank Fee';       A='12.00';  M='Wire fee'}
)
foreach ($o in $other) {
  $tx.Add([pscustomobject]@{
    Date = $o.D
    Account = $o.Acct
    Payee = $o.P
    Type = 'Expense'
    Amount = $o.A
    Category = 'Other'
    Memo = $o.M
  })
}

# Sort by date ascending then by payee
$txSorted = $tx | Sort-Object Date, Payee

# Output
$output = "Date,Account,Payee,Type,Amount,Category,Memo`n"
foreach ($t in $txSorted) {
  # Escape quotes in payee/memo if any
  $payeeEsc = $t.Payee -replace '"','""'
  $memoEsc = $t.Memo -replace '"','""'
  $output += "$($t.Date),$($t.Account),`"$payeeEsc`",$($t.Type),$($t.Amount),$($t.Category),`"$memoEsc`"`n"
}

$outPath = 'C:\Users\QQQ\Desktop\JUST MONEY\products\spreadsheets\budget-pro-2026\csv-templates\02-transactions.csv'
[System.IO.File]::WriteAllText($outPath, $output, [System.Text.Encoding]::UTF8)
Write-Host "Wrote $($txSorted.Count) transactions to $outPath"
