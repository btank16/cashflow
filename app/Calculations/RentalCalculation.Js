//Inputs: purchasePrice, downPayment, interestRate, loanTerm, propertyTax,
//closingCost, capEx, rehabCost, monthRent, operatingExpenses, vacancyRate

//Outputs: monthlyCashflow, cashDown, cashOnCash, capRate, DSCR, monthsTillEven,
//mortgageCost, propTax, monthOpEx, monthCapEx, annualCashflow
import { downPayment, mortgageCalculation, propertyTax, capEx, operatingExpense, sum, NOI, 
    DSCR, closingCosts, cashflow, cashOnCash, capRate, monthsToEven } from "./CoreFunctions.Js";
export const rentalCalculation = (purchasePrice, downPayment, interestRate, loanTerm, propertyTax,
    closingCost, capEx, rehabCost, monthRent, operatingExpenses, vacancyRate) => {

        const {downPaymentCash, downPaymentPercent, loanAmount} = downPayment(purchasePrice, downPayment);
        const {mortgageCost} = mortgageCalculation(purchasePrice, loanAmount, downPaymentPercent, interestRate, loanTerm);
        const {propTax} = propertyTax(purchasePrice, propertyTax);
        const {monthOpEx, totalFixedExpenses} = operatingExpense(operatingExpenses);
        const {monthCapEx} = capEx(monthRent, capEx);
        const {monthlyCashflow, annualCashflow} = cashflow(monthRent, monthOpEx, monthCapEx, vacancyRate);
        
        return [monthlyCashflow, annualCashflow, cashDown, cashOnCash, capRate, DSCR, 
            monthsTillEven, mortgageCost, propTax, monthOpEx, monthCapEx]
}