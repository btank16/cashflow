import { expenses } from '../Calculations/ExpenseFunction.Js';
import { BuyRefi } from '../Calculations/BRRROutput.Js';

export const secondTranslation = (inputValues, navigation, destinationScreen) => {
  // Destructure inputValues with default values
  const {
    purchasePrice = '0',
    downPayment = { value: '0', isDollar: false },
    interestRate = '0',
    loanTerm = '30',
    propertyTax = { value: '0', isDollar: false },
    propertyInsurance = '0',
    capexEst = { value: '0', isDollar: false },
    BRRcapexEst = { value: '0', isDollar: false },
    expenseArray = [],
    rehabCost = '0',
    closingCost = { value: '0', isDollar: false },
    monthRent = '0',
    BRRmonthRent = '0',
    afterRev = '0',
    rehabTime = '0',
    refinanceCost = '0',
    newInterest = '0',
    newloanTerm = '0'
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
    expenseArray.map(toNumber), //Parses through each number in the expenseArray
    toNumber(rehabCost),
    closingCost,
    toNumber(monthRent),
    toNumber(rehabTime)
  );

  // Call CoreOutputs function
  const outputResults = BuyRefi(
    toNumber(purchasePrice),
    // toNumber(downPayment),
    toNumber(refinanceCost),
    toNumber(newInterest),
    toNumber(afterRev),
    toNumber(rehabTime),
    toNumber(BRRmonthRent),
    BRRcapexEst,
    expenseResults[2], // cashDown
    expenseResults[0],  // mortgageCost
    expenseResults[1], // monthlyCost
    expenseResults[3],  // monthEx
    toNumber(newloanTerm),
    expenseResults[4]  // PrincipalAmt
  );

  // Navigate to the specified destination screen with the calculated values
  //Sets variables using the notation to call variables from the output of the function
  navigation.navigate(destinationScreen, {
    mortgageCost: expenseResults[0],
    monthlyCost: expenseResults[1],
    cashDown: expenseResults[2],
    monthEx: expenseResults[3],
    BRRMortgageCost: outputResults[0],
    BRRMonthlyCost: outputResults[1],
    BRRCashflow: outputResults[2],
    BRRAnnualCashflow: outputResults[3],
    MaxEquity: outputResults[4],
    EquityReturn: outputResults[5],
    EquityReturnPerc: outputResults[6],
    inputValues: {
      purchasePrice: toNumber(purchasePrice),
      downPayment: toNumber(downPayment),
      interestRate: toNumber(interestRate),
      loanTerm: toNumber(loanTerm),
      propertyTax: toNumber(propertyTax),
      propertyInsurance: toNumber(propertyInsurance),
      BRRcapexEst: toNumber(BRRcapexEst),
      expenseArray: expenseArray.map(toNumber),
      rehabCost: toNumber(rehabCost),
      closingCost: toNumber(closingCost),
      BRRmonthRent: toNumber(BRRmonthRent),
      afterRev: toNumber(afterRev),
      rehabTime: toNumber(rehabTime),
      refinanceCost: toNumber(refinanceCost),
      newInterest: toNumber(newInterest)
    }
  });
};