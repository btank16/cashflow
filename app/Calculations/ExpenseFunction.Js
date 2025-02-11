export const expenses = (
  PurchasePrice,
  DownPay,
  IntRate,
  LoanTerm,
  PropTax,
  PropInsurance,
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
  let DownPayPerc
  let DownPayment
  if (PurchasePrice.isCashPurchase) {
    DownPayPerc = 100;
    DownPayment = PurchPrice;
  } else {
    if (DownPay.isDollar) {
      DownPayment = Number(DownPay.value);
      DownPayPerc = ((Number(DownPay.value) / PurchPrice) * 100).toFixed(2);
    } else {
      DownPayment = PurchPrice * (Number(DownPay.value) / 100);
      DownPayPerc = Number(DownPay.value);
    }
  }

  // Calculate loan amount
  let LoanAmount = PurchPrice - DownPayment;

  // If statement for 3.5% down payment
  if (DownPayPerc <= 3.5) {
    LoanAmount = LoanAmount + (LoanAmount * 0.0175);
  }

  // Calculate monthly mortgage payment
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
      ).toFixed(2);
    }
  }
  
  // Calculate Principal left
  let PrincipalAmt = LoanAmount;
  let adjMonths = MonthsHeld;
  while (adjMonths > 0) {
    const PrincipalPayment = MortgageCost - (PrincipalAmt * monthlyRate);
    PrincipalAmt = PrincipalAmt - PrincipalPayment;
    adjMonths--;
  }

  // New if statement for PMI
  if (DownPayPerc < 20) {
    MortgageCost = (parseFloat(MortgageCost) + ((LoanAmount * 0.0085) / 12)).toFixed(2);
  }

  // Calculate property tax and insurance
  let monthlyPropTax;
  if (PropTax.isDollar) {
    monthlyPropTax = Number(PropTax.value) / 12;
  } else {
    monthlyPropTax = (PurchPrice * (Number(PropTax.value) / 100)) / 12;
  }
  const monthlyPropInsurance = PropInsurance / 12;

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
  const MonthEx = monthlyPropTax + monthlyPropInsurance + monthlyCapEx + totalMonthlyExpenses;
  const MonthlyCost = (
    parseFloat(MortgageCost) + MonthEx).toFixed(2);
  
  // Calculate DSCR
  const DSCRexpense = parseFloat(MortgageCost) + monthlyPropTax;
  let DSCR;
  if (PurchasePrice.isCashPurchase) {
    DSCR = 'N/A';
  } else {
    DSCR = Number(MonthRent) / DSCRexpense;
  }

  // Calculate cash down (down payment + rehab cost + closing costs)
  let closingCostTotal;
  if (ClosingCost.isDollar) {
    closingCostTotal = Number(ClosingCost.value);
  } else {
    closingCostTotal = PurchPrice * (Number(ClosingCost.value) / 100);
  }
  const CashDown = (DownPayment + RehabCost + closingCostTotal+totalFixedExpenses).toFixed(2);

  return [MortgageCost, MonthlyCost, CashDown, MonthEx.toFixed(2), PrincipalAmt.toFixed(2), 
    DSCR, monthlyPropTax.toFixed(2), monthlyCapEx.toFixed(2), totalMonthlyExpenses.toFixed(2)];
};