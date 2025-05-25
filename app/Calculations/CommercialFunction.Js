const { downPayment, mortgageCalculation, propertyTax, capEx, operatingExpense, sum, closingCosts,
    cashFlow, cashOnCashCalc, NOICalc, DSCRCalc, acquisitionCosts, capRateCalc, monthsToEvenCalc
} = require('./CoreFunctions.Js');

const CommercialCalc = (
  purchasePrice,
  downPay,
  acquisitionCost,
  interestRate,
  closingCost,
  loanTerm,
  grossRent,
  rentFees,
  vacancy,
  capExEst,
  propTax,
  OperatingExpense,
) => {

  //Update purchase price format
  const updatedPurchasePrice = {
    value: purchasePrice,
    isCashPurchase: false
  };
  
  //Calculate mortgage cost and down payment
  const {downPaymentCash, downPaymentPercent, loanAmount} = downPayment(updatedPurchasePrice, downPay);
  const {mortgageCost} = mortgageCalculation(updatedPurchasePrice, loanAmount, downPaymentPercent, interestRate, loanTerm);

  // Calculate property tax
  const {monthlyPropTax} = propertyTax(updatedPurchasePrice, propTax);


  // calculate monthly rent
  const totalAnnualIncome = grossRent + rentFees;
  const monthlyRent = Number(totalAnnualIncome) / 12;

  // Calculate CapEx

  const {monthlyCapEx} = capEx(monthlyRent, capExEst);

  // Sum up all monthly expenses
  const {totalMonthlyExpenses, totalFixedExpenses} = operatingExpense(OperatingExpense);
  
  //Operating expenses pre and post mortgage
  const sumOpEx = sum(totalMonthlyExpenses, monthlyPropTax);    
  const monthOperatingExpenses = sumOpEx.total

  const sumTotalEx = sum(monthOperatingExpenses, mortgageCost, monthlyCapEx);
  const monthTotalExpenses = sumTotalEx.total

  //Calculate NOI and DSCR
  const {NOI} = NOICalc(monthlyRent, monthOperatingExpenses, vacancy);
  const {DSCR} = DSCRCalc(updatedPurchasePrice, NOI, mortgageCost);

  // Calculate closing costs
  const {closingCostTotal} = closingCosts(updatedPurchasePrice, closingCost);

  // Calculate acquisition costs
  const {realAcquisitionCosts} = acquisitionCosts(updatedPurchasePrice, acquisitionCost);

  // Calculate cash down
  const totalCashDown = sum(downPaymentCash, closingCostTotal, realAcquisitionCosts, totalFixedExpenses);
  const totalAcquisitionCosts = totalCashDown.total;

    // Calculate cashflow
    const {monthlyCashflow, annualCashflow} = cashFlow(monthlyRent, monthTotalExpenses, vacancy);

    // Calculate Cash on Cash return
    const {cashOnCash} = cashOnCashCalc(annualCashflow, totalAcquisitionCosts);
  
    // Calculate Cap Rate
    const {capRate} = capRateCalc(annualCashflow, updatedPurchasePrice);
    
    // Calculate Months Till Even
    const {monthsToEven} = monthsToEvenCalc(totalAcquisitionCosts, monthlyCashflow);

  return [mortgageCost.toFixed(2), totalAcquisitionCosts.toFixed(2), 
    DSCR, monthlyPropTax.toFixed(2), monthlyCapEx.toFixed(2), 
    totalMonthlyExpenses.toFixed(2), cashOnCash.toFixed(2), 
    capRate.toFixed(2), monthsToEven, annualCashflow.toFixed(2)];
};

module.exports = { CommercialCalc };

