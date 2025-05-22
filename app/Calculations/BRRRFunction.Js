//Inputs:
//Initial Loan: purchasePrice, downPayment, interestRate, loanTerm, closingCost
//Pre-refinance ONLY expenses: rehabCost, rehabTime, refinanceCost, operatingExpense (fixed costs)
//Both Expenses: propertyTax, operatingExpense (variable costs)
//Post-refinance ONLY expenses: BRRcapexEst, VacancyRate, BRRmonthRent
//Post-refinance Loan: NewInterest, NewLoanTerm, refinanceCost, afterRev

//Outputs: BRRCashflow, cashDown, CashOnCash, EquityReturnPerc, MaxEquity, BRRAnnualCashflow
//Outputs Expenses Pre-refinance: MortgageCost, PropTax, monthlyOpEx
//Outputs Expenses Post-refinance: BRRMortgageCost, BRRPropTax, monthlyOpEx, BRRCapEx

import { downPayment, mortgageCalculation, propertyTax, capEx, operatingExpense, sum, closingCosts,
    cashFlow, cashOnCashCalc, holdingExpenses, principalLeft, maxEquityCalc, equityReturnCalc
} from './CoreFunctions.Js';

export const BRRRRFunction = (
    purchasePrice,
    downPay,
    interestRate,
    loanTerm,
    propTax,
    closingCost,
    capexEst,
    rehabCost,
    rehabTime,
    refinanceCost,
    newInterest,
    newLoanTerm,
    afterRev,
    monthRent,
    vacancyRate,
    operatingExpenses
) => {
    
    //Calculates Pre-refinance Operating Expenses
    const {totalMonthlyExpenses, totalFixedExpenses} = operatingExpense(operatingExpenses);
    const {monthlyPropTax} = propertyTax(purchasePrice, propTax);

    //Calculates Initial Mortgage Costs
    const {downPaymentCash, downPaymentPercent, loanAmount} = downPayment(purchasePrice, downPay);
    const {mortgageCost} = mortgageCalculation(purchasePrice, loanAmount, downPaymentPercent, interestRate, loanTerm);
    const {closingCostTotal} = closingCosts(purchasePrice, closingCost);

    //Operating expenses Pre-refinance
    const sumOpEx = sum(totalMonthlyExpenses, monthlyPropTax, mortgageCost);    
    const monthPreRefiExpenses = sumOpEx.total
    const {totalHoldingExpenses} = holdingExpenses(rehabTime, monthPreRefiExpenses);

    //Calculate Total Cash Down
    const sumCashDown = sum(downPaymentCash, closingCostTotal, totalFixedExpenses, rehabCost);
    const totalCashDown = sumCashDown.total

    //Calculate Principal Left
    const {principalAmt} = principalLeft(loanAmount, interestRate, rehabTime, mortgageCost);

    //Calculate Max Equity and Equity Return
    const {newLoanAmount, maxEquity} = maxEquityCalc(purchasePrice, afterRev, principalAmt);
    const totalCashInvest = sum(totalCashDown, totalHoldingExpenses, refinanceCost);
    const totalInvestment = totalCashInvest.total
    const {equityReturn, equityReturnPerc} = equityReturnCalc(maxEquity, totalInvestment);

    //Need to update variables to fit functions
    const revisedARV = {
        value: afterRev,
        isCashPurchase: false
    };
    const refiDownPay = 20;

    //Calculate post-refinance mortgage
    const refiMortgage = mortgageCalculation(revisedARV, newLoanAmount, refiDownPay, newInterest, newLoanTerm);
    const BRRRmortgageCost = refiMortgage.mortgageCost;

    //Calculate post-refinance Expenses
    const {monthlyCapEx} = capEx(monthRent, capexEst);
    const refiPropTax = propertyTax(revisedARV, propTax);
    const BRRRpropTax = refiPropTax.monthlyPropTax;
    const sumPostRefiExpenses = sum(BRRRmortgageCost, BRRRpropTax, monthlyCapEx, totalMonthlyExpenses);
    const monthPostRefiExpenses = sumPostRefiExpenses.total;

    //Calculate Cashflow
    const {monthlyCashflow, annualCashflow} = cashFlow(monthRent, monthPostRefiExpenses, vacancyRate);

    //Calculate Cash on Cash and Cap Rate
    const {cashOnCash} = cashOnCashCalc(annualCashflow, totalInvestment);
    
    return [
        mortgageCost.toFixed(2),
        monthlyPropTax.toFixed(2),
        totalMonthlyExpenses.toFixed(2),
        BRRRmortgageCost.toFixed(2),
        BRRRpropTax.toFixed(2),
        monthlyCapEx.toFixed(2),
        totalCashDown.toFixed(2),
        monthlyCashflow.toFixed(2),
        annualCashflow.toFixed(2),
        cashOnCash.toFixed(2),
        maxEquity.toFixed(2),
        equityReturnPerc.toFixed(2)
    ];
}