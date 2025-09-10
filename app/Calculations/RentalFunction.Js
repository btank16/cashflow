//Inputs: purchasePrice, downPayment, interestRate, loanTerm, propertyTax, closingCosts, capexEst, rehabCost,
// monthRent, vacancyRate and operatingExpenses

//Outputs: annualCashflow, monthlyCashflow, cashDown, cashOnCash, capRate, monthsTillEven, DSCR
//Output Expenses: mortgageCost, monthlyPropTax, monthlyOpEx, monthlyCapEx

const { downPayment, mortgageCalculation, propertyTax, capEx, operatingExpense, sum, NOICalc, DSCRCalc, closingCosts,
    cashFlow, cashOnCashCalc, capRateCalc, monthsToEvenCalc
} = require('./CoreFunctions.Js');

const rentalFunction = (
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
    insuranceCost,
    operatingExpenses
) => {
    // Calculate total rehab cost if itemized
    let totalRehabCost = 0;
    if (typeof rehabCost === 'object' && rehabCost.isItemized && rehabCost.items) {
        totalRehabCost = rehabCost.items.reduce((sum, item) => sum + (parseFloat(item.cost) || 0), 0);
    } else {
        totalRehabCost = parseFloat(rehabCost) || 0;
    }
    
    //Calculates Operating Expenses
    // Check if we should enable custom expense handling
    const customAllowed = true; // Enable custom expenses for rental calculator
    const expenseResult = operatingExpense(operatingExpenses, customAllowed);
    
    // Use appropriate values based on whether custom is allowed
    const totalMonthlyExpenses = customAllowed ? expenseResult.averageMonthlyExpenses : expenseResult.totalMonthlyExpenses;
    const isoOpEx = expenseResult.totalMonthlyExpenses;
    const totalFixedExpenses = expenseResult.totalFixedExpenses;
    const customExpenseArray = customAllowed ? expenseResult.customArray : [];
    
    const {monthlyPropTax} = propertyTax(purchasePrice, propTax);
    const {monthlyCapEx} = capEx(monthRent, capexEst);

    //Calculates Mortgage Costs
    const {downPaymentCash, downPaymentPercent, loanAmount} = downPayment(purchasePrice, downPay);
    const {mortgageCost} = mortgageCalculation(purchasePrice, loanAmount, downPaymentPercent, interestRate, loanTerm);
    const {closingCostTotal} = closingCosts(purchasePrice, closingCost);

    //Operating expenses pre and post mortgage
    const monthlyInsuranceCost = insuranceCost / 12;
    const sumOpEx = sum(totalMonthlyExpenses, monthlyPropTax, monthlyInsuranceCost);    
    const monthOperatingExpenses = sumOpEx.total

    const sumTotalEx = sum(monthOperatingExpenses, mortgageCost, monthlyCapEx);
    const monthTotalExpenses = sumTotalEx.total

    //Calculate NOI and DSCR
    const {NOI} = NOICalc(monthRent, monthOperatingExpenses, vacancyRate);
    const {DSCR} = DSCRCalc(purchasePrice, NOI, mortgageCost);

    //Calculate Total Cash Down
    const sumCashDown = sum(downPaymentCash, closingCostTotal, totalFixedExpenses, totalRehabCost);
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
        monthsToEven, 
        monthlyInsuranceCost.toFixed(2),
        customExpenseArray,
        isoOpEx.toFixed(2),
    ];
}

module.exports = { rentalFunction };