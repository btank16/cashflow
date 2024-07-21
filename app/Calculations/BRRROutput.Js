import { expenses } from './ExpenseFunction.Js';

export const BuyRefi = (
    PurchPrice,
    DownPayPerc,
    RefinanceCost,
    NewInterest,
    AfterRep,
    MonthsHeld,
    BRRMonthRent,
    CashDown,
    MortgageCost,
    MonthlyCost,
    MonthEx,
    LoanTerm
  ) => {
    // Convert inputs to numbers
    PurchPrice = Number(PurchPrice);
    DownPayPerc = Number(DownPayPerc);
    RefinanceCost = Number(RefinanceCost);
    NewInterest = Number(NewInterest);
    AfterRep = Number(AfterRep);
    MonthsHeld = Number(MonthsHeld);
    BRRMonthRent = Number(BRRMonthRent);
    CashDown = Number(CashDown);
    MortgageCost = Number(MortgageCost);
    MonthlyCost = Number(MonthlyCost);
    LoanTerm = Number(LoanTerm);  
    MonthEx = Number(MonthEx)
  
    // Calculate new loan amount after refinance
    const NewLoanAmount = AfterRep * 0.80; // Assuming 80% LTV refinance
  
    // Calculate new mortgage payment
    const monthlyRate = NewInterest / 12 / 100;
    const numberOfPayments = LoanTerm * 12; // Use the provided LoanTerm
    const BRRMortgageCost = (
      (NewLoanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
    ).toFixed(2);
  
    // Calculate new monthly cost
    const BRRMonthlyCost = (
      parseFloat(BRRMortgageCost) + MonthEx).toFixed(2);
  
    // Calculate new cashflow
    const BRRCashflow = (BRRMonthRent - BRRMonthlyCost).toFixed(2);
  
    // Calculate new annual cashflow
    const BRRAnnualCashflow = (BRRCashflow * 12).toFixed(2);
  
    // Calculate maximum equity
    const MaxEquity = (AfterRep - NewLoanAmount).toFixed(2);
  
    // Calculate equity return
    const totalInvestment = CashDown + (MonthsHeld * MonthlyCost) + RefinanceCost;
    const EquityReturn = MaxEquity - totalInvestment;
    const EquityReturnPerc = totalInvestment > 0 
      ? (((EquityReturn) / totalInvestment) * 100).toFixed(2)
      : "N/A";
  
    return [
      BRRMortgageCost,
      BRRMonthlyCost,
      BRRCashflow,
      BRRAnnualCashflow,
      MaxEquity,
      EquityReturn.toFixed(2),
      EquityReturnPerc
    ];
  };