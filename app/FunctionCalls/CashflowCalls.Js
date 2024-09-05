import { PriceSuggestion } from '../Calculations/SuggestPrice.Js';

export const thirdTranslation = (inputValues, navigation, destinationScreen) => {
  // Destructure inputValues with default values
  const {
    monthCashflow = '0',
    downPayment = '0',
    interestRate = '0',
    loanTerm = '30',
    propertyTax = '0',
    propertyInsurance = '0',
    capexEst = { value: '0', isDollar: false },
    expenseArray = [],
    monthRent = '0',
    closingCost = { value: '0', isDollar: false },
    rehabCost = '0'
  } = inputValues;

  // Helper function to convert to number and default to 0 if empty
  const toNumber = (value) => value === '' ? 0 : Number(value);

  // Call PriceSuggestion
  const cashflowResults = PriceSuggestion(
    toNumber(monthCashflow),
    toNumber(downPayment),
    toNumber(interestRate),
    toNumber(loanTerm),
    toNumber(propertyTax),
    toNumber(propertyInsurance),
    capexEst,
    expenseArray.map(toNumber),
    toNumber(monthRent),
    closingCost,
    toNumber(rehabCost)
  );

  // Navigate to the specified destination screen with the calculated values
  navigation.navigate(destinationScreen, {
    TargetPrice: cashflowResults[0],
    NetZeroPrice: cashflowResults[1],
    netZeroCash: cashflowResults[2],
    targetPriceCash: cashflowResults[3],
    netZeroExp: cashflowResults[4],
    targetExp: cashflowResults[5],
    inputValues: {
      monthCashflow: toNumber(monthCashflow),
      downPayment: toNumber(downPayment),
      interestRate: toNumber(interestRate),
      loanTerm: toNumber(loanTerm),
      propertyTax: toNumber(propertyTax),
      propertyInsurance: toNumber(propertyInsurance),
      expenseArray: expenseArray.map(toNumber),
      capexEst,
      monthRent: toNumber(monthRent),
      closingCost,
      rehabCost: toNumber(rehabCost)
    }
  });
};