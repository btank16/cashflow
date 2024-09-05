export const wholesalefunction = (
    contractPrice,
    rehabCost,
    afterRepairValue,
    expenseArray
) => {
    // Calculate total expenses for the wholesaler
    const totalExpenses = expenseArray.reduce((sum, expense) => sum + expense, 0);
  
    // Calculate Maximum Allowable Offer (MAO)
    const maximumAllowableOffer = (afterRepairValue * 0.7) - rehabCost;
  
    // Calculate fees
    const fee5Percent = afterRepairValue * 0.05;
    const fee15Percent = afterRepairValue * 0.15;
  
    // Calculate sale prices
    const salePrice5Percent = contractPrice + fee5Percent;
    const salePrice15Percent = contractPrice + fee15Percent;
  
    return [
      maximumAllowableOffer,
      totalExpenses,
      fee5Percent,
      fee15Percent,
      salePrice5Percent,
      salePrice15Percent
    ];
  }
  
