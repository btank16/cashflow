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
    capexEst = '0',
    expenseArray = [],
    monthRent = '0'
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
    toNumber(capexEst),
    expenseArray.map(toNumber),
    toNumber(monthRent)
  );

  // Navigate to the specified destination screen with the calculated values
  navigation.navigate(destinationScreen, {
    TargetPrice: cashflowResults[0],
    NetZeroPrice: cashflowResults[1],
    inputValues: {
      monthCashflow: toNumber(monthCashflow),
      downPayment: toNumber(downPayment),
      interestRate: toNumber(interestRate),
      loanTerm: toNumber(loanTerm),
      propertyTax: toNumber(propertyTax),
      propertyInsurance: toNumber(propertyInsurance),
      expenseArray: expenseArray.map(toNumber),
      capexEst: toNumber(capexEst),
      monthRent: toNumber(monthRent)
    }
  });
};