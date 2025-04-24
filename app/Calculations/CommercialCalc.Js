export const CommercialCalc = (
  purchasePrice,
  downPayment,
  acquisitionCosts,
  interestRate,
  closingCosts,
  loanTerm,
  grossRent,
  rentFees,
  vacancy,
  capEx,
  propertyTax,
  OperatingExpense,
) => {
  // Calculate down payment
  let DownPayPerc
  let downPaymentAmount
  if (downPayment.isDollar) {
    downPaymentAmount = Number(downPayment.value);
    DownPayPerc = ((Number(downPayment.value) / purchasePrice) * 100);
  } else {
    downPaymentAmount = purchasePrice * (Number(downPayment.value) / 100);
    DownPayPerc = Number(downPayment.value);
  }

  // Calculate loan amount
  let LoanAmount = purchasePrice - downPaymentAmount;

  // If statement for 3.5% down payment
  if (DownPayPerc <= 3.5) {
    LoanAmount = LoanAmount + (LoanAmount * 0.0175);
  }

  // Calculate monthly mortgage payment
  const monthlyRate = Number(interestRate.value) / 12 / 100;
  const numberOfPayments = loanTerm * 12;
  let MortgageCost;
  if (interestRate.isInterestOnly) {
    MortgageCost = LoanAmount * monthlyRate;
  } else {
    MortgageCost = (
      (LoanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
    );
  }

  // New if statement for PMI
  if (DownPayPerc < 20) {
    MortgageCost = (parseFloat(MortgageCost) + ((LoanAmount * 0.0085) / 12));
  }

  // Calculate property tax and insurance
  let monthlyPropTax;
  if (propertyTax.isDollar) {
    monthlyPropTax = Number(propertyTax.value) / 12;
  } else {
    monthlyPropTax = (purchasePrice * (Number(propertyTax.value) / 100)) / 12;
  }
  // calculate monthly rent
  const totalAnnualIncome = grossRent + rentFees;
  const monthlyRent = Number(totalAnnualIncome) / 12;

  // Calculate CapEx
  let monthlyCapEx;
  if (capEx.isDollar) {
    monthlyCapEx = Number(capEx.value) / 12;
  } else {
    monthlyCapEx = (monthlyRent * (Number(capEx.value) / 100));
  }

    // Calculate vacancy
    const VacancyLoss = (vacancy / 100) * (monthlyRent * 12);

  // Sum up all monthly expenses
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

  // Calculate total monthly cost
  const MonthEx = monthlyPropTax + monthlyCapEx + totalMonthlyExpenses;
  const MonthlyCost = (
    parseFloat(MortgageCost) + MonthEx);
  
  // Calculate DSCR
  const DSCR = (monthlyRent - (MonthlyCost - monthlyCapEx)) / parseFloat(MortgageCost);

  // Calculate closing costs
  let closingCostTotal;
  if (closingCosts.isDollar) {
    closingCostTotal = Number(closingCosts.value);
  } else {
    closingCostTotal = purchasePrice * (Number(closingCosts.value) / 100);
  }

    // Calculate acquisition costs
    let realAcqCosts;
    if (acquisitionCosts.isDollar) {
      realAcqCosts = Number(acquisitionCosts.value);
    } else {
      realAcqCosts = purchasePrice * (Number(acquisitionCosts.value) / 100);
    }

  // Calculate cash down
  const totalAcquisitionCosts = (downPaymentAmount + closingCostTotal + realAcqCosts + totalFixedExpenses);

    // Calculate monthly cashflow
    const Cashflow = (monthlyRent - MonthlyCost);
  
    // Calculate annual cashflow
    const AnnualCashflow = ((Cashflow * 12) - VacancyLoss);
  
    // Calculate Cash on Cash return
    const CashOnCash = ((AnnualCashflow / totalAcquisitionCosts) * 100);
  
    // Calculate Cap Rate
    const CapRate = ((AnnualCashflow / purchasePrice) * 100);
  
    // Calculate Months Till Even
    const MonthsTillEven = Math.ceil(totalAcquisitionCosts / parseFloat(Cashflow));

  return [MortgageCost.toFixed(2), MonthlyCost.toFixed(2), totalAcquisitionCosts.toFixed(2), MonthEx.toFixed(2), 
    DSCR.toFixed(2), monthlyPropTax.toFixed(2), monthlyCapEx.toFixed(2), 
    totalMonthlyExpenses.toFixed(2), Number(CashOnCash).toFixed(2), 
    Number(CapRate).toFixed(2), MonthsTillEven.toFixed(2), AnnualCashflow.toFixed(2)];
};

