import { expenses } from './ExpenseFunction.Js';

export const outputs = (
  AfterRep,
  MonthsHeld,
  AgentCommish,
  MonthRent,
  PurchPrice,
  CashDown,
  MonthlyCost,
  VacancyRate
) => {
    // Convert inputs to numbers to ensure we're working with numeric values
    AfterRep = Number(AfterRep);
    MonthsHeld = Number(MonthsHeld);
    MonthRent = Number(MonthRent);
    const purchaseAmount = Number(PurchPrice.value);
    CashDown = Number(CashDown);
    MonthlyCost = Number(MonthlyCost);
    VacancyRate = Number(VacancyRate);
  // Calculate total profit
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
    TotalProfit = AfterRep - (TotalExpense + AgentLoss);
  } else {
    TotalProfit = (AfterRep - (purchaseAmount + AgentLoss + TotalExpense));
  }

  // Calculate ReturnCash (formerly ROI)
  const ReturnPerc = ((TotalProfit / purchaseAmount) * 100).toFixed(2);
  const CashROI = ((TotalProfit / TotalExpense) * 100).toFixed(2);

  // Calculate monthly cashflow
  const VacancyLoss = MonthRent * (VacancyRate / 100);
  const Cashflow = (MonthRent - (MonthlyCost + VacancyLoss)).toFixed(2);

  // Calculate annual cashflow
  const AnnualCashflow = Cashflow * 12;

  // Calculate Cash on Cash return
  const CashOnCash = ((AnnualCashflow / CashDown) * 100).toFixed(2);

  // Calculate Cap Rate
  const CapRate = ((AnnualCashflow / purchaseAmount) * 100).toFixed(2);

  // Calculate Months Till Even
  const MonthsTillEven = Math.ceil(CashDown / parseFloat(Cashflow));

  return [TotalProfit.toFixed(2), ReturnPerc, CashROI, Cashflow, AnnualCashflow.toFixed(2), 
    CashOnCash, CapRate, MonthsTillEven, TotalExpense.toFixed(2)];
};