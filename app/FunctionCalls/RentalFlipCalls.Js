import { expenses } from '../Calculations/ExpenseFunction.Js';
import { outputs } from '../Calculations/CoreOutputs.Js';

export const firstTranslation = (inputValues, navigation, destinationScreen) => {
  // Destructure inputValues with default values
  const {
    purchasePrice = '0',
    downPayment = { value: '0', isDollar: false },
    interestRate = '0',
    loanTerm = '30',
    propertyTax = { value: '0', isDollar: false },
    propertyInsurance = '0',
    capexEst = { value: '0', isDollar: false },
    expenseArray = [],
    rehabCost = '0',
    closingCost = { value: '0', isDollar: false },
    monthRent = '0',
    afterRev = '0',
    rehabTime = '0',
    agentCommish = { value: '0', isDollar: false }
  } = inputValues;

  // Helper function to convert to number and default to 0 if empty
  const toNumber = (value) => value === '' ? 0 : Number(value);

  // Call ExpenseFunction
  const expenseResults = expenses(
    toNumber(purchasePrice),
    downPayment,
    toNumber(interestRate),
    toNumber(loanTerm),
    propertyTax,
    toNumber(propertyInsurance),
    capexEst,
    expenseArray.map(toNumber),
    toNumber(rehabCost),
    closingCost,
    toNumber(monthRent),
    toNumber(rehabTime)
  );

  // Call CoreOutputs function
  const outputResults = outputs(
    toNumber(afterRev),
    toNumber(rehabTime),
    agentCommish,
    toNumber(monthRent),
    toNumber(purchasePrice),
    expenseResults[2], // cashDown
    expenseResults[1]  // monthlyCost
  );

  // Navigate to the specified destination screen with the calculated values
  navigation.navigate(destinationScreen, {
    mortgageCost: expenseResults[0],
    monthlyCost: expenseResults[1],
    cashDown: expenseResults[2],
    monthEx: expenseResults[3],
    DSCR: expenseResults[5],
    totalProfit: outputResults[0],
    returnPerc: outputResults[1],
    cashROI: outputResults[2],
    cashflow: outputResults[3],
    annualCashflow: outputResults[4],
    cashOnCash: outputResults[5],
    capRate: outputResults[6],
    monthsTillEven: outputResults[7],
    totalCashCost: outputResults[8],
    inputValues: {
      purchasePrice: toNumber(purchasePrice),
      downPayment,
      interestRate: toNumber(interestRate),
      loanTerm: toNumber(loanTerm),
      propertyTax,
      propertyInsurance: toNumber(propertyInsurance),
      capexEst,
      expenseArray: expenseArray.map(toNumber),
      rehabCost: toNumber(rehabCost),
      closingCost,
      monthRent: toNumber(monthRent),
      afterRev: toNumber(afterRev),
      rehabTime: toNumber(rehabTime),
      agentCommish: toNumber(agentCommish)
    }
  });
};