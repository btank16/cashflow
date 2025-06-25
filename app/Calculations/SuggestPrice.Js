const { operatingExpense, capEx, reverseMortgage, closingCosts, sum } = require('./CoreFunctions.Js');

const PriceSuggestion = (
  CashflowTarget,
  DownPayPerc,
  IntRate,
  LoanTerm,
  PropTaxPerc,
  CapExEst,
  MonthRent,
  closingCost,
  rehabCost,
  OperatingExpense
) => {
  // Convert inputs to numbers
  CashflowTarget = Number(CashflowTarget);
  DownPayPerc = Number(DownPayPerc);
  IntRate = Number(IntRate); 
  LoanTerm = Number(LoanTerm);
  PropTaxPerc = Number(PropTaxPerc);
  MonthRent = Number(MonthRent);
  rehabCost = Number(rehabCost);
  
  // Calculate operating expenses using CoreFunctions
  const { totalMonthlyExpenses, totalFixedExpenses } = operatingExpense(OperatingExpense);
  
  // Calculate monthly CapEx using CoreFunctions
  const { monthlyCapEx } = capEx(MonthRent, CapExEst);

  // Calculates the total expenses known without the purchase price
  const ExpNoProperty = monthlyCapEx + totalMonthlyExpenses;

  // Calculates the maximum monthly payment w/ tax that makes the cashflow target
  const MaxCashflowMortgageTax = MonthRent - (ExpNoProperty + CashflowTarget);

  // Calculates the maximum monthly payment w/ tax to net zero
  const MaxZeroMortgageTax = MonthRent - ExpNoProperty;

  // Use reverseMortgage to get the rates
  const { NormRate, LowDPRate } = reverseMortgage(IntRate, DownPayPerc, LoanTerm);
  
  // Adjust property tax rate to monthly
  const monthlyPropTaxRate = PropTaxPerc / 100 / 12;

  // Calculates target purchase price
  const TargetPrice = DownPayPerc < 20
    ? MaxCashflowMortgageTax / (LowDPRate + monthlyPropTaxRate)
    : MaxCashflowMortgageTax / (NormRate + monthlyPropTaxRate);

  // Calculates net zero purchase price
  const NetZeroPrice = DownPayPerc < 20
    ? MaxZeroMortgageTax / (LowDPRate + monthlyPropTaxRate)
    : MaxZeroMortgageTax / (NormRate + monthlyPropTaxRate);

  // Create purchase price objects to use with CoreFunctions
  const targetPriceObj = { value: TargetPrice, isCashPurchase: false };
  const netZeroPriceObj = { value: NetZeroPrice, isCashPurchase: false };

  // Calculate closing costs using CoreFunctions
  const targetClosingCosts = closingCosts(targetPriceObj, closingCost);
  const netZeroClosingCosts = closingCosts(netZeroPriceObj, closingCost);
  
  const closingCostTarget = targetClosingCosts.closingCostTotal;
  const closingCostZero = netZeroClosingCosts.closingCostTotal;

  // Calculate down payment for each scenario
  const downPaymentTarget = TargetPrice * (DownPayPerc / 100);
  const downPaymentNetZero = NetZeroPrice * (DownPayPerc / 100);

  // Calculate the total cash down for each scenario using sum function
  const targetCashDownResult = sum(downPaymentTarget, closingCostTarget, rehabCost, totalFixedExpenses);
  const netZeroCashDownResult = sum(downPaymentNetZero, closingCostZero, rehabCost, totalFixedExpenses);
  
  const targetPriceCash = targetCashDownResult.total;
  const netZeroCash = netZeroCashDownResult.total;

  // Calculate Property Tax for each scenario
  const netZeroTax = NetZeroPrice * monthlyPropTaxRate;
  const targetTax = TargetPrice * monthlyPropTaxRate;

  // Calculate Monthly Mortgage for each scenario
  const MaxCashflowMortgage = MaxCashflowMortgageTax - targetTax;
  const MaxZeroMortgage = MaxZeroMortgageTax - netZeroTax;

  // Calculate Monthly Expenses for Each Scenario
  const netZeroExp = MaxZeroMortgage + netZeroTax + ExpNoProperty;
  const targetExp = MaxCashflowMortgage + targetTax + ExpNoProperty;

  return [TargetPrice.toFixed(2), NetZeroPrice.toFixed(2), netZeroCash.toFixed(2), 
    targetPriceCash.toFixed(2), netZeroExp.toFixed(2), targetExp.toFixed(2), 
    netZeroTax.toFixed(2), targetTax.toFixed(2), monthlyCapEx.toFixed(2), 
    totalMonthlyExpenses.toFixed(2), MaxZeroMortgage.toFixed(2), MaxCashflowMortgage.toFixed(2)];
};

module.exports = { PriceSuggestion };