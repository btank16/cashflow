import { expenses } from '../Calculations/ExpenseFunction.Js';
import { outputs } from '../Calculations/CoreOutputs.Js';

export const firstTranslation = (inputValues, navigation, destinationScreen) => {
  // Destructure inputValues with default values
  const {
    purchasePrice = '0',
    downPayment = '0',
    interestRate = '0',
    loanTerm = '30',
    propertyTax = '0',
    propertyInsurance = '0',
    capexEst = '0',
    expenseArray = [],
    rehabCost = '0',
    closingCost = '0',
    monthRent = '0',
    afterRev = '0',
    monthsHeld = '0',
    agentCommish = '0'
  } = inputValues;

  // Helper function to convert to number and default to 0 if empty
  const toNumber = (value) => value === '' ? 0 : Number(value);

  // Call ExpenseFunction
  const expenseResults = expenses(
    toNumber(purchasePrice),
    toNumber(downPayment),
    toNumber(interestRate),
    toNumber(loanTerm),
    toNumber(propertyTax),
    toNumber(propertyInsurance),
    toNumber(capexEst),
    expenseArray.map(toNumber),
    toNumber(rehabCost),
    toNumber(closingCost),
    toNumber(monthRent)
  );

  // Call CoreOutputs function
  const outputResults = outputs(
    toNumber(afterRev),
    toNumber(monthsHeld),
    toNumber(agentCommish),
    toNumber(monthRent),
    toNumber(purchasePrice),
    expenseResults[2], // cashDown
    expenseResults[1]  // monthlyCost
  );

  // Log the results
  // console.log('Expense Function Results:', {
  //   mortgageCost: expenseResults[0],
  //   monthlyCost: expenseResults[1],
  //   cashDown: expenseResults[2],
  //   monthEx: expenseResults[3]
  // });

  // console.log('Core Outputs Results:', {
  //   totalProfit: outputResults[0],
  //   returnPerc: outputResults[1],
  //   cashROI: outputResults[2],
  //   cashflow: outputResults[3],
  //   annualCashflow: outputResults[4],
  //   cashOnCash: outputResults[5],
  //   capRate: outputResults[6],
  //   monthsTillEven: outputResults[7]
  // });

  // Navigate to the specified destination screen with the calculated values
  navigation.navigate(destinationScreen, {
    mortgageCost: expenseResults[0],
    monthlyCost: expenseResults[1],
    cashDown: expenseResults[2],
    monthEx: expenseResults[3],
    totalProfit: outputResults[0],
    returnPerc: outputResults[1],
    cashROI: outputResults[2],
    cashflow: outputResults[3],
    annualCashflow: outputResults[4],
    cashOnCash: outputResults[5],
    capRate: outputResults[6],
    monthsTillEven: outputResults[7],
    inputValues: {
      purchasePrice: toNumber(purchasePrice),
      downPayment: toNumber(downPayment),
      interestRate: toNumber(interestRate),
      loanTerm: toNumber(loanTerm),
      propertyTax: toNumber(propertyTax),
      propertyInsurance: toNumber(propertyInsurance),
      capexEst: toNumber(capexEst),
      expenseArray: expenseArray.map(toNumber),
      rehabCost: toNumber(rehabCost),
      closingCost: toNumber(closingCost),
      monthRent: toNumber(monthRent),
      afterRev: toNumber(afterRev),
      monthsHeld: toNumber(monthsHeld),
      agentCommish: toNumber(agentCommish)
    }
  });
};