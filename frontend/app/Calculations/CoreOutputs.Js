import { expenses } from './ExpenseFunction.Js';

export const outputs = (
  AfterRep,
  MonthsHeld,
  AgentCommish,
  MonthRent,
  PurchPrice,
  CashDown,
  MonthlyCost
) => {
    // Convert inputs to numbers to ensure we're working with numeric values
    AfterRep = Number(AfterRep);
    MonthsHeld = Number(MonthsHeld);
    AgentCommish = Number(AgentCommish);
    MonthRent = Number(MonthRent);
    PurchPrice = Number(PurchPrice);
    CashDown = Number(CashDown);
    MonthlyCost = Number(MonthlyCost);
  
  // Calculate total profit
  const AgentLoss = AfterRep * (AgentCommish / 100);
  const TotalExpense = CashDown + (MonthsHeld * MonthlyCost);
  const TotalProfit = (AfterRep - (PurchPrice + AgentLoss + TotalExpense));

  // Calculate ReturnCash (formerly ROI)
  const ReturnPerc = ((TotalProfit / PurchPrice) * 100).toFixed(2);
  const CashROI = ((TotalProfit / TotalExpense) * 100).toFixed(2);

  // Calculate monthly cashflow
  const Cashflow = (MonthRent - MonthlyCost).toFixed(2);

  // Calculate annual cashflow
  const AnnualCashflow = Cashflow * 12;

  // Calculate Cash on Cash return
  const CashOnCash = ((AnnualCashflow / CashDown) * 100).toFixed(2);

  // Calculate Cap Rate
  const CapRate = ((AnnualCashflow / PurchPrice) * 100).toFixed(2);

  // Calculate Months Till Even
  const MonthsTillEven = Math.ceil(CashDown / parseFloat(Cashflow));

  return [TotalProfit.toFixed(2), ReturnPerc, CashROI, Cashflow, AnnualCashflow.toFixed(2), CashOnCash, CapRate, MonthsTillEven, TotalExpense.toFixed(2)];
};