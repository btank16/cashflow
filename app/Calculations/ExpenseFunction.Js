export const expenses = (
  PurchPrice,
  DownPay,
  IntRate,
  LoanTerm,
  PropTax,
  PropInsurance,
  CapExEst,
  ExpenseArray,
  RehabCost,
  ClosingCost,
  MonthRent,
  MonthsHeld
) => {
  // Calculate down payment
  let DownPayPerc
  let DownPayment
  if (DownPay.isDollar) {
    DownPayment = Number(DownPay.value);
    DownPayPerc = ((Number(DownPay.value) / PurchPrice) * 100).toFixed(2);
  } else {
    DownPayment = PurchPrice * (Number(DownPay.value) / 100);
    DownPayPerc = Number(DownPay.value);
  }

  // Calculate loan amount
  let LoanAmount = PurchPrice - DownPayment;

  // If statement for 3.5% down payment
  if (DownPayPerc <= 3.5) {
    LoanAmount = LoanAmount + (LoanAmount * 0.0175);
  }

  // Calculate monthly mortgage payment
  const monthlyRate = IntRate / 12 / 100;
  const numberOfPayments = LoanTerm * 12;
  let MortgageCost = (
    (LoanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
    (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
  ).toFixed(2);

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
  const totalMonthlyExpenses = ExpenseArray.reduce((sum, expense) => sum + expense, 0);

  // Calculate total monthly cost
  const MonthEx = monthlyPropTax + monthlyPropInsurance + monthlyCapEx + totalMonthlyExpenses;
  const MonthlyCost = (
    parseFloat(MortgageCost) + MonthEx).toFixed(2);

  // Calculate cash down (down payment + rehab cost + closing costs)
  let closingCostTotal;
  if (ClosingCost.isDollar) {
    closingCostTotal = Number(ClosingCost.value);
  } else {
    closingCostTotal = PurchPrice * (Number(ClosingCost.value) / 100);
  }
  const CashDown = (DownPayment + RehabCost + closingCostTotal).toFixed(2);

  return [MortgageCost, MonthlyCost, CashDown, MonthEx.toFixed(2), PrincipalAmt.toFixed(2)];
};