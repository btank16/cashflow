import { operatingExpense, maximumAllowableOffer, wholesalingFees } from './CoreFunctions.Js';

export const wholesalefunction = (
    contractPrice,
    rehabCost,
    afterRepairValue,
    monthsHeld,
    OperatingExpense
) => {

    const {totalMonthlyExpenses, totalFixedExpenses} = operatingExpense(OperatingExpense);
    
    const totalExpenses = (totalMonthlyExpenses * monthsHeld) + totalFixedExpenses;

    // Calculate Maximum Allowable Offer (MAO)
    const {MAO} = maximumAllowableOffer(afterRepairValue, rehabCost);
  
    // Calculate fees and sale prices
    const lowFee = 0.05;
    const highFee = 0.15;
    
    // Use destructuring with alias assignment to get correctly named variables
    const lowFeesResult = wholesalingFees(afterRepairValue, contractPrice, lowFee);
    const highFeesResult = wholesalingFees(afterRepairValue, contractPrice, highFee);
    
    const fee5Percent = lowFeesResult.wholesaleFee;
    const salePrice5Percent = lowFeesResult.wholesaleSalePrice;
    const fee15Percent = highFeesResult.wholesaleFee;
    const salePrice15Percent = highFeesResult.wholesaleSalePrice;


    return [
      MAO.toFixed(2),
      totalExpenses.toFixed(2),
      fee5Percent.toFixed(2),
      fee15Percent.toFixed(2),
      salePrice5Percent.toFixed(2),
      salePrice15Percent.toFixed(2)
    ];
  }
  
