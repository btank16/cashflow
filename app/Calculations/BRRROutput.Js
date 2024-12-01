import { expenses } from './ExpenseFunction.Js';

export const BuyRefi = (
    PurchPrice,
    // DownPayPerc,
    RefinanceCost,
    NewInterest,
    AfterRep,
    MonthsHeld,
    BRRMonthRent,
    BRRCapex,
    CashDown,
    MortgageCost,
    MonthlyCost,
    MonthEx,
    LoanTerm,
    PrincipalAmt,
    propTax,
    ExpenseArray
  ) => {
    // Convert inputs to numbers
    PurchPrice = Number(PurchPrice);
    // DownPayPerc = Number(DownPayPerc);
    RefinanceCost = Number(RefinanceCost);
    // NewInterest = Number(NewInterest);
    AfterRep = Number(AfterRep);
    MonthsHeld = Number(MonthsHeld);
    BRRMonthRent = Number(BRRMonthRent);
    // BRRCapexPerc = Number(BRRCapexPerc);
    CashDown = Number(CashDown);
    MortgageCost = Number(MortgageCost);
    MonthlyCost = Number(MonthlyCost);
    LoanTerm = Number(LoanTerm);  
    MonthEx = Number(MonthEx)
  
    // Calculate new loan amount after refinance
    const NewLoanAmount = AfterRep * 0.80; // Assuming 80% LTV refinance
  
    // Calculate new mortgage payment
    const monthlyRate = Number(NewInterest.value) / 12 / 100;
    const numberOfPayments = LoanTerm * 12; 
    let BRRMortgageCost;
    if (NewInterest.isInterestOnly) {
      BRRMortgageCost = NewLoanAmount * monthlyRate;
    } else {
      BRRMortgageCost = (
        (NewLoanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
        (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
      ).toFixed(2);
    }

    // Calculate property tax and insurance
    let BRRPropTax;
    if (propTax.isDollar) {
      BRRPropTax = Number(propTax.value) / 12;
    } else {
      BRRPropTax = (AfterRep * (Number(propTax.value) / 100)) / 12;
    }
  
    // Calculate new monthly cost
    let monthlyCapEx;
    if (BRRCapex.isDollar) {
      monthlyCapEx = Number(BRRCapex.value) / 12;
    } else {
      monthlyCapEx = (BRRMonthRent * (Number(BRRCapex.value) / 100));
    }

    const totalMonthlyExpenses = ExpenseArray.reduce((sum, expense) => sum + expense, 0);

    const BRRMonthlyCost = (
      parseFloat(BRRMortgageCost) + BRRPropTax + totalMonthlyExpenses + monthlyCapEx).toFixed(2);
  
    // Calculate new cashflow
    const BRRCashflow = (BRRMonthRent - BRRMonthlyCost).toFixed(2);
  
    // Calculate new annual cashflow
    const BRRAnnualCashflow = (BRRCashflow * 12).toFixed(2);
  
    // Calculate maximum equity
    const MaxEquity = (NewLoanAmount-PrincipalAmt).toFixed(2);
  
    // Calculate equity return
    const totalInvestment = CashDown + (MonthsHeld * MonthlyCost) + RefinanceCost;
    const EquityReturn = MaxEquity - totalInvestment;
    const EquityReturnPerc = totalInvestment > 0 
      ? (((EquityReturn) / totalInvestment) * 100).toFixed(2)
      : "N/A";

    const CashOnCash = ((BRRAnnualCashflow / CashDown) * 100).toFixed(2);

  
    return [
      BRRMortgageCost,
      BRRMonthlyCost,
      BRRCashflow,
      BRRAnnualCashflow,
      MaxEquity,
      EquityReturn.toFixed(2),
      EquityReturnPerc,
      monthlyCapEx,
      BRRPropTax,
      CashOnCash
    ];
  };