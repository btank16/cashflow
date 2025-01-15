export const wholesalefunction = (
    contractPrice,
    rehabCost,
    afterRepairValue,
    monthsHeld,
    OperatingExpense
) => {
    // Calculate total expenses for the wholesaler
    let totalMonthlyExpenses = 0;
    let totalFixedExpenses = 0;
    
    if (OperatingExpense.isActive && OperatingExpense.expenses) {
      OperatingExpense.expenses.forEach(expense => {
        const cost = Number(expense.cost);
        
        if (expense.frequency === 'Annually') {
          totalMonthlyExpenses += cost / 12;
        } else if (expense.frequency === 'Monthly') {
          totalMonthlyExpenses += cost;
        } else if (expense.frequency === 'Non-recurring') {
          totalFixedExpenses += cost;
        }
      });
    }
    
    const totalExpenses = (totalMonthlyExpenses * monthsHeld) + totalFixedExpenses;

    // Calculate Maximum Allowable Offer (MAO)
    const maximumAllowableOffer = (afterRepairValue * 0.7) - rehabCost;
  
    // Calculate fees
    const fee5Percent = afterRepairValue * 0.05;
    const fee15Percent = afterRepairValue * 0.15;
  
    // Calculate sale prices
    const salePrice5Percent = contractPrice + fee5Percent;
    const salePrice15Percent = contractPrice + fee15Percent;
  
    return [
      maximumAllowableOffer.toFixed(2),
      totalExpenses.toFixed(2),
      fee5Percent.toFixed(2),
      fee15Percent.toFixed(2),
      salePrice5Percent.toFixed(2),
      salePrice15Percent.toFixed(2)
    ];
  }
  
