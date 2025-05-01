export const outputs = (
  AfterRep,
  MonthsHeld,
  AgentCommish,
  MonthRent,
  PurchPrice,
  CashDown,
  MonthlyCost,
  VacancyRate,
  PrincipalAmt
) => {
    // Convert inputs to numbers to ensure we're working with numeric values
    AfterRep = Number(AfterRep);
    MonthsHeld = Number(MonthsHeld);
    MonthRent = Number(MonthRent);
    const purchaseAmount = Number(PurchPrice.value);
    CashDown = Number(CashDown);
    MonthlyCost = Number(MonthlyCost);
    VacancyRate = Number(VacancyRate);
    PrincipalAmt = Number(PrincipalAmt);

  // Calculate agent commission
  let AgentLoss;
  if (AgentCommish.isDollar) {
    AgentLoss = Number(AgentCommish.value);
  } else {
    AgentLoss = AfterRep * (Number(AgentCommish.value) / 100);
  }
  
  //Calculate Total Expense and Total Profit
  const TotalExpense = CashDown + (MonthsHeld * MonthlyCost);
  let TotalProfit;
  if (PurchPrice.isCashPurchase) {
    //Note that TotalExpense holds the whole purchase price here
    TotalProfit = AfterRep - (TotalExpense + AgentLoss);
  } else {
    //Note that we use PrincipalAmt here to account for the amount left on the loan at the time of sale
    TotalProfit = (AfterRep - (PrincipalAmt + AgentLoss + TotalExpense));
  }

  // Calculate ROI and Cash ROI
  //Note that cash ROI is based on the investor's cash costs and returns
  const ReturnPerc = ((TotalProfit / purchaseAmount) * 100);
  const CashROI = ((TotalProfit / TotalExpense) * 100);

  // Calculate monthly cashflow and vacancy loss
  const VacancyLoss = (VacancyRate / 100) * (MonthRent * 12);
  const Cashflow = (MonthRent - (MonthlyCost));

  // Calculate annual cashflow
  //Note that only Annual Cashflow accounts for vacancy loss
  const AnnualCashflow = ((Cashflow * 12) - VacancyLoss);

  // Calculate Cash on Cash return
  const CashOnCash = ((AnnualCashflow / CashDown) * 100);

  // Calculate Cap Rate
  const CapRate = ((AnnualCashflow / purchaseAmount) * 100);

  // Calculate Months Till Even
  const MonthsTillEven = Math.ceil(CashDown / parseFloat(Cashflow));

  return [TotalProfit.toFixed(2), ReturnPerc.toFixed(2), CashROI.toFixed(2), Cashflow.toFixed(2), AnnualCashflow.toFixed(2), 
    CashOnCash.toFixed(2), CapRate.toFixed(2), MonthsTillEven.toFixed(2), TotalExpense.toFixed(2)];
};