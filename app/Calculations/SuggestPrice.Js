export const PriceSuggestion = (
  CashflowTarget,
  DownPayPerc,
  IntRate,
  LoanTerm,
  PropTaxPerc,
  PropInsurance,
  CapExEst,
  ExpenseArray,
  MonthRent,
  closingCost,
  rehabCost
) => {
  // Convert inputs to numbers
  CashflowTarget = Number(CashflowTarget);
  DownPayPerc = Number(DownPayPerc) / 100;
  IntRate = Number(IntRate) / 100; 
  const MonthInt = IntRate / 12; // Monthly interest rate
  LoanTerm = Number(LoanTerm) * 12; // Convert years to months
  PropTaxPerc = Number(PropTaxPerc) / 100 / 12; // Monthly property tax rate
  PropInsurance = Number(PropInsurance) / 12; // Monthly insurance
  MonthRent = Number(MonthRent);
  rehabCost = Number(rehabCost);

  const totalMonthlyExpenses = ExpenseArray.reduce((sum, expense) => sum + Number(expense), 0);
  let monthlyCapEx;
  if (CapExEst.isDollar) {
    monthlyCapEx = Number(CapExEst.value) / 12;
  } else {
    monthlyCapEx = (MonthRent * (Number(CapExEst.value) / 100));
  }
  const CapExTotal = monthlyCapEx + totalMonthlyExpenses;
  // Calculates the total expenses known without the purchase price
  const ExpNoProperty = CapExTotal + PropInsurance;

  // Calculates the maximum monthly payment that makes the cashflow target
  const MaxCashflowMortgage = MonthRent - (ExpNoProperty + CashflowTarget);

  // Calculates the maximum monthly payment to net zero
  const MaxZeroMortgage = MonthRent - ExpNoProperty;

  // Input to the interest rate equation
  const AdjustedInt = 1 + MonthInt;
  const NormRate = (1-DownPayPerc) * ((MonthInt * Math.pow(AdjustedInt,LoanTerm) / (Math.pow(AdjustedInt,LoanTerm) - 1)));
  const LowDPRate = DownPayPerc == 0.035
    ? 1.0175 * (((1-DownPayPerc) * ((MonthInt * Math.pow(AdjustedInt,LoanTerm) / (Math.pow(AdjustedInt,LoanTerm) - 1)))) + (((1-DownPayPerc) * 0.0085) / 12))
    : ((1-DownPayPerc) * ((MonthInt * Math.pow(AdjustedInt,LoanTerm) / (Math.pow(AdjustedInt,LoanTerm) - 1)))) + (((1-DownPayPerc) * 0.0085) / 12);


  // Calculates target purchase price
  const TargetPrice = DownPayPerc < 0.2
    ? MaxCashflowMortgage / (LowDPRate + PropTaxPerc)
    : MaxCashflowMortgage / (NormRate + PropTaxPerc);

  // Calculates target purchase price
  const NetZeroPrice = DownPayPerc < 0.2
    ? MaxZeroMortgage / (LowDPRate + PropTaxPerc)
    : MaxZeroMortgage / (NormRate + PropTaxPerc);

    // Calculates Closing Costs and Down Payment Sum (plus rehab)
    let closingCostTarget;
    let closingCostZero;
    if (closingCost.isDollar) {
      closingCostTarget = Number(closingCost.value);
      closingCostZero = Number(closingCost.value);
    } else {
      closingCostTarget = (TargetPrice * (Number(closingCost.value) / 100));
      closingCostZero = (NetZeroPrice * (Number(closingCost.value) / 100));
    }
    const netZeroCash = (NetZeroPrice * DownPayPerc) + closingCostZero + rehabCost;
    const targetPriceCash = (TargetPrice * DownPayPerc) + closingCostTarget + rehabCost;

    // Calculate Monthly Expenses for Each Scenario
    const netZeroExp = MaxZeroMortgage + (NetZeroPrice * PropTaxPerc) + ExpNoProperty;
    const targetExp = MaxCashflowMortgage + (TargetPrice * PropTaxPerc) + ExpNoProperty;

  return [TargetPrice.toFixed(2), NetZeroPrice.toFixed(2), netZeroCash.toFixed(2), targetPriceCash.toFixed(2), netZeroExp.toFixed(2), targetExp.toFixed(2)];
};