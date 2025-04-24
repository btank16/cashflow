
export const BuyRefi = (
    PurchPrice,
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
    OperatingExpense,
    VacancyRate
  ) => {
    // Convert inputs to numbers
    const purchaseAmount = Number(PurchPrice.value);
    RefinanceCost = Number(RefinanceCost);
    AfterRep = Number(AfterRep);
    MonthsHeld = Number(MonthsHeld);
    BRRMonthRent = Number(BRRMonthRent);
    CashDown = Number(CashDown);
    MortgageCost = Number(MortgageCost);
    MonthlyCost = Number(MonthlyCost);
    LoanTerm = Number(LoanTerm);  
    MonthEx = Number(MonthEx)
    OperatingExpense = Number(OperatingExpense)
    VacancyRate = Number(VacancyRate)

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
      );
    }

    // Calculate property tax
    let BRRPropTax;
    if (propTax.isDollar) {
      BRRPropTax = Number(propTax.value) / 12;
    } else {
      BRRPropTax = (AfterRep * (Number(propTax.value) / 100)) / 12;
    }
  
    // Calculate monthly capex
    let monthlyCapEx;
    if (BRRCapex.isDollar) {
      monthlyCapEx = Number(BRRCapex.value) / 12;
    } else {
      monthlyCapEx = (BRRMonthRent * (Number(BRRCapex.value) / 100));
    }
    
    // Inverse the vacancy rate to calculate the vacancy loss from cashflow
    const VacancyLoss = (VacancyRate / 100) * (BRRMonthRent * 12);
    //Total monthly expenses
    const BRRMonthlyCost = (
      parseFloat(BRRMortgageCost) + BRRPropTax + OperatingExpense + monthlyCapEx);
  
    // Calculate new cashflow
    const BRRCashflow = BRRMonthRent - BRRMonthlyCost;
  
    // Calculate new annual cashflow accounting for vacancy loss
    const BRRAnnualCashflow = ((BRRCashflow * 12) - VacancyLoss);
  
    // Calculate maximum equity
    let MaxEquity
    if (PurchPrice.isCashPurchase) {
      MaxEquity = NewLoanAmount;
    } else {
      MaxEquity = (NewLoanAmount-PrincipalAmt);
    }
  
    // Calculate equity return
    const totalInvestment = CashDown + (MonthsHeld * MonthlyCost) + RefinanceCost;
    const EquityReturn = MaxEquity - totalInvestment;
    const EquityReturnPerc = totalInvestment > 0 
      ? ((EquityReturn / totalInvestment) * 100)
      : "N/A";

    //Calculate Cash on Cash including expenses during the rehab period
    const CashOnCash = ((BRRAnnualCashflow / totalInvestment) * 100);

  
    return [
      BRRMortgageCost.toFixed(2),
      BRRMonthlyCost.toFixed(2),
      BRRCashflow.toFixed(2),
      BRRAnnualCashflow.toFixed(2),
      MaxEquity.toFixed(2),
      EquityReturn.toFixed(2),
      EquityReturnPerc.toFixed(2),
      monthlyCapEx.toFixed(2) ,
      BRRPropTax.toFixed(2),
      CashOnCash.toFixed(2)
    ];
  };