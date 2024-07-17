export const expenses = (
  PurchPrice,
  DownPayPerc,
  IntRate,
  LoanTerm,
  PropTaxPerc,
  PropInsurance,
  CapExPerc,
  ExpenseArray,
  RehabCost,
  ClosingCostPerc,
  MonthRent
) => {
  // Calculate down payment
  const DownPayment = PurchPrice * (DownPayPerc / 100);

  // Calculate loan amount
  let LoanAmount = PurchPrice - DownPayment;

  // If statement for 3.5% down payment
  if (DownPayPerc === 3.5) {
    LoanAmount = LoanAmount + (LoanAmount * 0.0175);
  }

  // Calculate monthly mortgage payment
  const monthlyRate = IntRate / 12 / 100;
  const numberOfPayments = LoanTerm * 12;
  let MortgageCost = (
    (LoanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
    (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
  ).toFixed(2);

  // New if statement for PMI
  if (DownPayPerc < 20) {
    MortgageCost = (parseFloat(MortgageCost) + ((LoanAmount * 0.0085) / 12)).toFixed(2);
  }

  // Calculate property tax and insurance
  const monthlyPropTax = (PurchPrice * (PropTaxPerc / 100)) / 12;
  const monthlyPropInsurance = PropInsurance / 12;

  // Calculate CapEx
  const monthlyCapEx = (MonthRent * (CapExPerc / 100)) / 12;

  // Sum up all monthly expenses
  const totalMonthlyExpenses = ExpenseArray.reduce((sum, expense) => sum + expense, 0);

  // Calculate total monthly cost
  const MonthEx = monthlyPropTax + monthlyPropInsurance + monthlyCapEx + totalMonthlyExpenses;
  const MonthlyCost = (
    parseFloat(MortgageCost) + MonthEx).toFixed(2);

  // Calculate cash down (down payment + rehab cost + closing costs)
  const ClosingCosts = PurchPrice * (ClosingCostPerc / 100);
  const CashDown = (DownPayment + RehabCost + ClosingCosts).toFixed(2);

  return [MortgageCost, MonthlyCost, CashDown, MonthEx.toFixed(2)];
};