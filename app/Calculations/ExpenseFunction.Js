export const expenses = (
  PurchasePrice,
  DownPay,
  IntRate,
  LoanTerm,
  PropTax,
  CapExEst,
  RehabCost,
  ClosingCost,
  MonthRent,
  MonthsHeld,
  OperatingExpense
) => {

  // Purchase Price Handling
  const PurchPrice = Number(PurchasePrice.value);

  // Calculate down payment
  //If cash purchase, down payment is 100% of purchase price to properly handle below calculations
  let DownPayPerc
  let DownPayment
  if (PurchasePrice.isCashPurchase) {
    DownPayPerc = 100;
    DownPayment = PurchPrice;
  } else {
    if (DownPay.isDollar) {
      DownPayment = Number(DownPay.value);
      DownPayPerc = ((Number(DownPay.value) / PurchPrice) * 100);
    } else {
      DownPayment = PurchPrice * (Number(DownPay.value) / 100);
      DownPayPerc = Number(DownPay.value);
    }
  }

  // Calculate loan amount
  let LoanAmount = PurchPrice - DownPayment;

  // For FHA Loans (3.5% down) a 1.75% up-front mortgage insurance premium is added to the loan amount
  if (DownPayPerc <= 3.5) {
    LoanAmount = LoanAmount + (LoanAmount * 0.0175);
  }

  // Calculate amortized monthly mortgage payment
  let MortgageCost;
  let monthlyRate;
  if (PurchasePrice.isCashPurchase) {
    MortgageCost = 0;
    monthlyRate = 0;
  } else {
    monthlyRate = Number(IntRate.value) / 12 / 100;
    const numberOfPayments = LoanTerm * 12;
    if (IntRate.isInterestOnly) {
      MortgageCost = LoanAmount * monthlyRate;
    } else {
      MortgageCost = (
        (LoanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
        (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
      );
    }
  }
  
  // Calculate Principal left on loan to account for profit on a sale
  let PrincipalAmt = LoanAmount;
  let adjMonths = MonthsHeld;
  while (adjMonths > 0) {
    const PrincipalPayment = MortgageCost - (PrincipalAmt * monthlyRate);
    PrincipalAmt = PrincipalAmt - PrincipalPayment;
    adjMonths--;
  }

  // Account for a 0.85% monthly PMI for loans with less than 20% down
  if (DownPayPerc < 20) {
    MortgageCost = (parseFloat(MortgageCost) + ((LoanAmount * 0.0085) / 12));
  }

  // Calculate property tax
  let monthlyPropTax;
  if (PropTax.isDollar) {
    monthlyPropTax = Number(PropTax.value) / 12;
  } else {
    monthlyPropTax = (PurchPrice * (Number(PropTax.value) / 100)) / 12;
  }

  // Calculate CapEx
  let monthlyCapEx;
  if (CapExEst.isDollar) {
    monthlyCapEx = Number(CapExEst.value) / 12;
  } else {
    monthlyCapEx = (MonthRent * (Number(CapExEst.value) / 100));
  }

  // Sum up all monthly expenses
  let totalMonthlyExpenses = 0;
  let totalFixedExpenses = 0;
  
  if (OperatingExpense.isActive && OperatingExpense.expenses) {
    OperatingExpense.expenses.forEach(expense => {
      const cost = Number(expense.cost);
      
      if (expense.frequency === 'Annually') {
        totalMonthlyExpenses += cost / 12;
      } else if (expense.frequency === 'Monthly') {
        totalMonthlyExpenses += cost;
      } else if (expense.frequency === 'Non-recurring') {
        totalFixedExpenses += cost;
      }
    });
  }

  // Calculate total monthly cost
  const MonthEx = monthlyPropTax + monthlyCapEx + totalMonthlyExpenses;
  const MonthlyCost = (
    parseFloat(MortgageCost) + MonthEx);
  
  // Calculate DSCR
  let DSCR;
  if (PurchasePrice.isCashPurchase) {
    DSCR = 'N/A';
  } else {
    DSCR = Number((MonthRent - (MonthlyCost - monthlyCapEx))) / parseFloat(MortgageCost);
  }

  // Calculate closing costs andcash down (down payment + rehab cost + closing costs)
  let closingCostTotal;
  if (ClosingCost.isDollar) {
    closingCostTotal = Number(ClosingCost.value);
  } else {
    closingCostTotal = PurchPrice * (Number(ClosingCost.value) / 100);
  }
  const CashDown = (DownPayment + RehabCost + closingCostTotal + totalFixedExpenses);

  return [MortgageCost.toFixed(2), MonthlyCost.toFixed(2), CashDown.toFixed(2), MonthEx.toFixed(2), PrincipalAmt.toFixed(2), 
    DSCR.toFixed(2), monthlyPropTax.toFixed(2), monthlyCapEx.toFixed(2), totalMonthlyExpenses.toFixed(2)];
};