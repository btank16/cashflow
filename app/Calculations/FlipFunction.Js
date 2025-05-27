//Inputs: purchasePrice, downPayment, interestRate, loanTerm, propertyTax, closingCost, rehabCost,
//afterRev, rehabTime, agentCommish, operatingExpenses

//Outputs: returnPerc, cashROI, cashDown, totalCashCost, totalProfit
//Outputs Expenses: mortgageCost, monthlyPropTax, monthlyOpEx

const { downPayment, mortgageCalculation, principalLeft, propertyTax, operatingExpense, sum, closingCosts,
    agentCommission, holdingExpenses, totalProfitCalc, ROI
} = require('./CoreFunctions.Js');

const flipFunction = (
    purchasePrice,
    downPay,
    interestRate,
    loanTerm,
    propTax,
    closingCost,
    rehabCost,
    afterRev,
    rehabTime,
    agentCommish,
    operatingExpenses
) => {
    
    //Calculates Operating Expenses
    const {totalMonthlyExpenses, totalFixedExpenses} = operatingExpense(operatingExpenses);
    const {monthlyPropTax} = propertyTax(purchasePrice, propTax);

    //Calculates Mortgage Costs
    const {downPaymentCash, downPaymentPercent, loanAmount} = downPayment(purchasePrice, downPay);
    const {mortgageCost} = mortgageCalculation(purchasePrice, loanAmount, downPaymentPercent, interestRate, loanTerm);
    const {closingCostTotal} = closingCosts(purchasePrice, closingCost);

    //Calculate Holding Costs
    const sumTotalEx = sum(totalMonthlyExpenses, mortgageCost, monthlyPropTax);
    const monthTotalExpenses = sumTotalEx.total
    const {totalHoldingExpenses} = holdingExpenses(rehabTime, monthTotalExpenses);

    //Calculate Total Cash Down
    const sumCashDown = sum(downPaymentCash, closingCostTotal, totalFixedExpenses, rehabCost);
    const totalCashDown = sumCashDown.total

    //Calculate Total Cas Out of Pocket
    const sumTotalOut = sum(totalCashDown, totalHoldingExpenses);
    const totalCashCost = sumTotalOut.total

    //Inputs to Profit
    const {agentLoss} = agentCommission(afterRev, agentCommish);
    const {principalAmt} = principalLeft(loanAmount, interestRate, rehabTime, mortgageCost);

    //Calculate Profit
    const {totalProfit} = totalProfitCalc(purchasePrice, afterRev, totalCashCost, agentLoss, principalAmt);

    //Calculate Return
    const {PercROI, CashROI} = ROI(totalProfit, purchasePrice, totalCashCost);
    
    
    return [
        mortgageCost.toFixed(2),
        totalCashDown.toFixed(2),
        monthlyPropTax.toFixed(2),
        totalMonthlyExpenses.toFixed(2),
        totalCashCost.toFixed(2),
        PercROI.toFixed(2),
        CashROI.toFixed(2),
        totalProfit.toFixed(2)
    ];
}

module.exports = { flipFunction };