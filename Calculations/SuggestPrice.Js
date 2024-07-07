export const PriceSuggestion = (
    CashflowTarget,
    DownPayPerc,
    IntRate,
    LoanTerm,
    PropTaxPerc,
    PropInsurance,
    CapExPerc,
    ExpenseArray,
    MonthRent
  ) => {
    // Convert inputs to numbers
    CashflowTarget = Number(CashflowTarget);
    DownPayPerc = Number(DownPayPerc) / 100;
    IntRate = Number(IntRate) / 100; 
    const MonthInt = IntRate / 12; // Monthly interest rate
    LoanTerm = Number(LoanTerm) * 12; // Convert years to months
    PropTaxPerc = Number(PropTaxPerc) / 100 / 12; // Monthly property tax rate
    PropInsurance = Number(PropInsurance) / 12; // Monthly insurance
    CapExPerc = Number(CapExPerc) / 100 / 12; // Monthly CapEx rate
    MonthRent = Number(MonthRent);
  
    const totalMonthlyExpenses = ExpenseArray.reduce((sum, expense) => sum + Number(expense), 0);
    const CapExTotal = totalMonthlyExpenses + (MonthRent * CapExPerc);

    // Calculates the total expenses known without the purchase price
    const ExpNoProperty = CapExTotal + PropInsurance;

    // Calculates the maximum monthly payment that makes the cashflow target
    const MaxCashflowMortgage = MonthRent - (ExpNoProperty + CashflowTarget);

    // Calculates the maximum monthly payment to net zero
    const MaxZeroMortgage = MonthRent - ExpNoProperty;

    // Input to the interest rate equation
    const AdjustedInt = 1 + MonthInt;
    const NormRate = (1-DownPayPerc) * ((MonthInt * Math.pow(AdjustedInt,LoanTerm) / (Math.pow(AdjustedInt,LoanTerm) - 1)));
    const LowDPRate = IntRate == 0.035
      ? 1.0175 * (((1-DownPayPerc) * ((MonthInt * Math.pow(AdjustedInt,LoanTerm) / (Math.pow(AdjustedInt,LoanTerm) - 1)))) + (((1-DownPayPerc) * 0.0085) / 12))
      : ((1-DownPayPerc) * ((MonthInt * Math.pow(AdjustedInt,LoanTerm) / (Math.pow(AdjustedInt,LoanTerm) - 1)))) + (((1-DownPayPerc) * 0.0085) / 12);


    // Calculates target purchase price
    const TargetPrice = IntRate < 20
      ? MaxCashflowMortgage / (LowDPRate + PropTaxPerc)
      : MaxCashflowMortgage / (NormRate + PropTaxPerc);

    // Calculates target purchase price
    const NetZeroPrice = IntRate < 20
      ? MaxZeroMortgage / (LowDPRate + PropTaxPerc)
      : MaxZeroMortgage / (NormRate + PropTaxPerc);
  
    return [TargetPrice.toFixed(2), NetZeroPrice.toFixed(2)];
  };