//Inputs: purchasePrice, downPayment, interestRate, loanTerm, propertyTax, closingCosts, capexEst, rehabCost,
// monthRent, vacancyRate and operatingExpenses

//Outputs: annualCashflow, monthlyCashflow, cashDown, cashOnCash, capRate, monthsTillEven, DSCR
//Output Expenses: mortgageCost, monthlyPropTax, monthlyOpEx, monthlyCapEx

import { downPayment, mortgageCalculation, propertyTax, capEx, operatingExpense, sum, NOICalc, DSCRCalc, closingCosts,
    cashFlow, cashOnCashCalc, capRateCalc, monthsToEvenCalc
} from './CoreFunctions.Js';

export const rentalFunction = (
    purchasePrice,
    downPay,
    interestRate,
    loanTerm,
    propTax,
    closingCost,
    capexEst,
    rehabCost,
    monthRent,
    vacancyRate,
    operatingExpenses
) => {
    
    //Calculates Operating Expenses
    const {totalMonthlyExpenses, totalFixedExpenses} = operatingExpense(operatingExpenses);
    const {monthlyPropTax} = propertyTax(purchasePrice, propTax);
    const {monthlyCapEx} = capEx(monthRent, capexEst);

    //Calculates Mortgage Costs
    const {downPaymentCash, downPaymentPercent, loanAmount} = downPayment(purchasePrice, downPay);
    const {mortgageCost} = mortgageCalculation(purchasePrice, loanAmount, downPaymentPercent, interestRate, loanTerm);
    const {closingCostTotal} = closingCosts(purchasePrice, closingCost);

    //Operating expenses pre and post mortgage
    const sumOpEx = sum(totalMonthlyExpenses, monthlyPropTax);    
    const monthOperatingExpenses = sumOpEx.total

    const sumTotalEx = sum(monthOperatingExpenses, mortgageCost, monthlyCapEx);
    const monthTotalExpenses = sumTotalEx.total

    //Calculate NOI and DSCR
    const {NOI} = NOICalc(monthRent, monthOperatingExpenses, vacancyRate);
    const {DSCR} = DSCRCalc(purchasePrice, NOI, mortgageCost);

    //Calculate Total Cash Down
    const sumCashDown = sum(downPaymentCash, closingCostTotal, totalFixedExpenses, rehabCost);
    const totalCashDown = sumCashDown.total
    //Calculate Cashflow
    const {monthlyCashflow, annualCashflow} = cashFlow(monthRent, monthTotalExpenses, vacancyRate);

    //Calculate Cash on Cash and Cap Rate
    const {cashOnCash} = cashOnCashCalc(annualCashflow, totalCashDown);
    const {capRate} = capRateCalc(annualCashflow, purchasePrice);

    //Calculate Months to Even
    const {monthsToEven} = monthsToEvenCalc(totalCashDown, monthlyCashflow);
    
    return [
        mortgageCost.toFixed(2),
        totalCashDown.toFixed(2),
        DSCR,
        monthlyPropTax.toFixed(2),
        monthlyCapEx.toFixed(2),
        totalMonthlyExpenses.toFixed(2),
        monthlyCashflow.toFixed(2),
        annualCashflow.toFixed(2),
        cashOnCash.toFixed(2),
        capRate.toFixed(2),
        monthsToEven.toFixed(2)
    ];
}