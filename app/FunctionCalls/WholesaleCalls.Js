import { wholesalefunction } from '../Calculations/WholesalingFunction.Js';

export const fourthTranslation = (inputValues, navigation, destinationScreen) => {
  // Destructure inputValues with default values
  const {
    purchasePrice = '0',
    expenseArray = [],
    rehabCost = '0',
    afterRev = '0',
  } = inputValues;

  // Helper function to convert to number and default to 0 if empty
  const toNumber = (value) => value === '' ? 0 : Number(value);

  // Call wholesalefunction
  const wholesaleResults = wholesalefunction(
    toNumber(purchasePrice),
    toNumber(rehabCost),
    toNumber(afterRev),
    expenseArray.map(toNumber)
  );

  // Navigate to the specified destination screen with the calculated values
  navigation.navigate(destinationScreen, {
    maximumAllowableOffer: wholesaleResults[0],
    totalExpenses: wholesaleResults[1],
    fee5Perc: wholesaleResults[2],
    fee15Perc: wholesaleResults[3],
    sale5Perc: wholesaleResults[4],
    sale15Perc: wholesaleResults[5],
    inputValues: {
      purchasePrice: toNumber(purchasePrice),
      expenseArray: expenseArray.map(toNumber),
      rehabCost: toNumber(rehabCost),
      afterRev: toNumber(afterRev),
    }
  });
};