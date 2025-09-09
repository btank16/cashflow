// This file holds all the functions divided

const downPayment = (purchasePrice, downPayment) => {
    //Purchase price is an object with a value and a isCashPurchase boolean
    //Down payment is an object with a value and a isDollar boolean
    let downPaymentPercent;
    let downPaymentCash;
    if (purchasePrice.isCashPurchase) {
      downPaymentPercent = 100;
      downPaymentCash = Number(purchasePrice.value);
    } else {
      if (downPayment.isDollar) {
        downPaymentCash = Number(downPayment.value);
        downPaymentPercent = ((Number(downPayment.value) / Number(purchasePrice.value)) * 100);
      } else {
        downPaymentCash = Number(purchasePrice.value) * (Number(downPayment.value) / 100);
        downPaymentPercent = Number(downPayment.value);
      }
    }
    const loanAmount = Number(purchasePrice.value) - downPaymentCash;
    return{downPaymentCash, downPaymentPercent, loanAmount}
};

const mortgageCalculation = (purchasePrice, loanAmount, downPaymentPercent, interestRate, loanTerm) => {
    //purchasePrice is an object with a value and a isCashPurchase boolean
    //loanAmount is a number
    //downPaymentPercent is a number
    //interestRate is an object with a value and a isInterestOnly boolean
    //loanTerm is a number

    // For FHA Loans (3.5% down) a 1.75% up-front mortgage insurance premium is added to the loan amount
  if (downPaymentPercent <= 3.5) {
    loanAmount = loanAmount + (loanAmount * 0.0175);
  }

  //calculate mortgage through ammortization formula
  let mortgageCost;
  if (purchasePrice.isCashPurchase) {
    mortgageCost = 0;
  } else {
    const monthlyRate = Number(interestRate.value) / 12 / 100;
    const numberOfPayments = loanTerm * 12;
    if (interestRate.isInterestOnly) {
      mortgageCost = loanAmount * monthlyRate;
    } else {
      mortgageCost = (
        (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
        (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
      );
    }
  }

    // Account for a 0.85% monthly PMI for loans with less than 20% down
    if (downPaymentPercent < 20) {
        mortgageCost = mortgageCost + ((loanAmount * 0.0085) / 12);
    }

    return{mortgageCost}
};

const principalLeft = (loanAmount, interestRate, monthsHeld, mortgageCost) => {
    //loanAmount is a number
    //interestRate is an object with a value and a isInterestOnly boolean
    //monthsHeld is a number
    //mortgageCost is a number

    const monthlyRate = Number(interestRate.value) / 12 / 100;

    let principalAmt = loanAmount;
    let adjMonths = monthsHeld;
    while (adjMonths > 0) {
      const PrincipalPayment = mortgageCost - (principalAmt * monthlyRate);
      principalAmt = principalAmt - PrincipalPayment;
      adjMonths--;
    }

    return{principalAmt}
};

const propertyTax = (purchasePrice, propertyTax) => {
    //purchasePrice is an object with a value and a isCashPurchase boolean
    //propertyTax is an object with a value and a isDollar boolean

    let monthlyPropTax;
    if (propertyTax.isDollar) {
      monthlyPropTax = Number(propertyTax.value) / 12;
    } else {
      monthlyPropTax = (Number(purchasePrice.value) * (Number(propertyTax.value) / 100)) / 12;
    }

    return{monthlyPropTax}
};

const capEx = (monthRent, capEx) => {
    //monthRent is a number
    //capEx is an object with a value and a isDollar boolean

    let monthlyCapEx;
    if (capEx.isDollar) {
      monthlyCapEx = Number(capEx.value) / 12;
    } else {
      monthlyCapEx = (monthRent * (Number(capEx.value) / 100));
    }

    return{monthlyCapEx}
};

const operatingExpense = (operatingExpense, customAllowed = false) => {
    //Accepts operatingExpense array which has a isActive boolean and an expenses array
    //Expense array has a name, cost, and frequency
    let totalMonthlyExpenses = 0;
    let totalFixedExpenses = 0;
    let totalAnnualExpenses = 0;
    let customArray = [];
    let totalCustomMonthlyAverage = 0;
    
    if (operatingExpense.isActive && operatingExpense.expenses) {
      operatingExpense.expenses.forEach(expense => {
        const cost = Number(expense.cost);
        
        // Check if this is a custom frequency
        let isCustom = false;
        let customData = null;
        
        if (customAllowed) {
          // Handle both object and string formats
          if (typeof expense.frequency === 'object' && expense.frequency !== null && expense.frequency.type === 'custom') {
            customData = expense.frequency;
            isCustom = true;
          } else if (typeof expense.frequency === 'string' && expense.frequency.startsWith('{')) {
            try {
              customData = JSON.parse(expense.frequency);
              if (customData.type === 'custom') {
                isCustom = true;
              }
            } catch (e) {
              // If parsing fails, treat as regular frequency
              isCustom = false;
            }
          }
        }
        
        if (isCustom && customData) {
          // Handle custom frequency
          let monthlyAverage = 0;
          
          if (customData.pattern === 'monthly') {
            // For monthly custom: cost * months selected / 12
            const monthsPerYear = customData.months ? customData.months.length : 0;
            monthlyAverage = (cost * monthsPerYear) / 12;
            
            customArray.push({
              category: expense.category,
              cost: cost,
              yearInterval: 1,
              monthsApplied: customData.months,
              firstYear: true,
              pattern: 'monthly'
            });
          } else if (customData.pattern === 'annual') {
            // For annual custom: only include in first year average if firstYear is true OR yearInterval is 1
            const yearInterval = customData.years || 1;
            if (customData.firstYear === true || yearInterval === 1) {
              monthlyAverage = cost / 12;
            } else {
              monthlyAverage = 0;
            }
            
            customArray.push({
              category: expense.category,
              cost: cost,
              yearInterval: yearInterval,
              monthsApplied: [customData.month],
              firstYear: customData.firstYear !== false,
              pattern: 'annual'
            });
          }
          
          totalCustomMonthlyAverage += monthlyAverage;
          
        } else {
          // Handle standard frequencies
          if (expense.frequency === 'Annually') {
            if (customAllowed) {
              totalAnnualExpenses += cost;
            } else {
              totalMonthlyExpenses += cost / 12;
            }
          } else if (expense.frequency === 'Monthly') {
            totalMonthlyExpenses += cost;
          } else if (expense.frequency === 'Non-recurring') {
            totalFixedExpenses += cost;
          }
        }
      });
    }
    
    if (customAllowed) {
      // Calculate average monthly expenses (all recurring expenses averaged over 12 months)
      const averageMonthlyExpenses = totalMonthlyExpenses + (totalAnnualExpenses / 12) + totalCustomMonthlyAverage;
      
      return {
        totalMonthlyExpenses,
        totalFixedExpenses,
        totalAnnualExpenses,
        averageMonthlyExpenses,
        customArray
      };
    } else {
      // Legacy behavior - include annual expenses in monthly
      if (totalAnnualExpenses > 0) {
        totalMonthlyExpenses += totalAnnualExpenses / 12;
      }
      
      return {
        totalMonthlyExpenses,
        totalFixedExpenses
      };
    }
};

//Used to sum expenses, cash down, etc.
const sum = (...numbers) => {
    const total = numbers.reduce((acc, current) => acc + current, 0);
    return { total };
};

//Calculates annual NOI
const NOICalc = (monthRent, operatingExpense, vacancy) => {
    //monthRent is a number
    //operatingExpense a number
    //vacancy is a number
    const annualRent = Number(monthRent) * 12;
    const annualExpenses = Number(operatingExpense) * 12;
    const annualVacancy = (Number(vacancy) / 100) * annualRent;
    const NOI = annualRent - (annualExpenses + annualVacancy);

    return{NOI}
};

//Ensure to use annual values and vacancy for DSCR (use NOI)
const DSCRCalc = (purchasePrice, NOI, mortgageCost) => {
    //purchasePrice is an object with a value and a isCashPurchase boolean
    //NOI is a number
    //mortgageCost is a number
    const annualMortgage = Number(mortgageCost) * 12;
    let DSCR;
    if (purchasePrice.isCashPurchase) {
      DSCR = 'N/A';
    } else if (annualMortgage === 0) {
      DSCR = 'N/A';
    } else {
      DSCR = (Number(NOI) / annualMortgage).toFixed(2);
    }

    return{DSCR}
};

const closingCosts = (purchasePrice, closingCost) => {
    //purchasePrice is an object with a value and a isCashPurchase boolean
    //closingCost is an object with a value and a isDollar boolean

    let closingCostTotal;
    if (closingCost.isDollar) {
      closingCostTotal = Number(closingCost.value);
    } else {
      closingCostTotal = Number(purchasePrice.value) * (Number(closingCost.value) / 100);
    }

    return{closingCostTotal}
};

const agentCommission = (ARV, agentCommission) => {
    //ARV is a number
    //agentCommission is an object with a value and a isDollar boolean

    let agentLoss;
    if (agentCommission.isDollar) {
      agentLoss = Number(agentCommission.value);
    } else {
      agentLoss = ARV * (Number(agentCommission.value) / 100);
    }

    return{agentLoss}
};

//Use for other calculations!!!
const holdingExpenses = (monthsHeld, monthlyExpenses) => {
    //monthsHeld is a number
    //monthlyExpenses is a number

    const totalHoldingExpenses = Number(monthlyExpenses) * Number(monthsHeld);

    return{totalHoldingExpenses}
};

const totalProfitCalc = (purchasePrice, ARV, totalExpense, agentCommission, principalAmt) => {
    //purchasePrice is an object with a value and a isCashPurchase boolean
    //ARV is a number
    //totalExpense is a number
    //agentCommission is a number
    //principalAmt is a number
    let totalProfit;
    if (purchasePrice.isCashPurchase) {
    //Note that TotalExpense holds the whole purchase price here
      totalProfit = ARV - (totalExpense + agentCommission);
    } else {
      //Note that we use PrincipalAmt here to account for the amount left on the loan at the time of sale
      totalProfit = ARV - (totalExpense + agentCommission + principalAmt);
    }
    return{totalProfit}
};

const ROI = (totalProfit, purchasePrice, totalExpense) => {
    //totalProfit is a number
    //purchasePrice is an object with a value and a isCashPurchase boolean
    //totalExpense is a number
    const PercROI = ((totalProfit / Number(purchasePrice.value)) * 100);
    const CashROI = ((totalProfit / totalExpense) * 100);
    return{PercROI, CashROI}
};

const cashFlow = (monthRent, monthlyCost, vacancy) => {
    //monthRent is a number
    //monthlyCost is a number
    //vacancy is a number
    const annualRent = Number(monthRent) * 12;
    const annualExpenses = Number(monthlyCost) * 12;
    const annualVacancy = (Number(vacancy) / 100) * annualRent;
    //Only apply vacancy loss to annual cashflow
    const annualCashflow = annualRent - (annualExpenses + annualVacancy);
    const monthlyCashflow = Number(monthRent) - Number(monthlyCost);
    
    return{monthlyCashflow, annualCashflow}
};

const cashOnCashCalc = (annualCashFlow, cashDown) => {
    //annualCashFlow is a number
    //cashDown is a number
    const cashOnCash = ((annualCashFlow / cashDown) * 100);
    return{cashOnCash}
};

const capRateCalc = (annualCashFlow, purchasePrice) => {
    //annualCashFlow is a number
    //purchasePrice is an object with a value and a isCashPurchase boolean
    const capRate = ((annualCashFlow / Number(purchasePrice.value)) * 100);
    return{capRate}
};

const monthsToEvenCalc = (cashDown, monthlyCashFlow) => {
    //cashDown is a number
    //monthlyCashFlow is a number
    let monthsToEven;
    if (monthlyCashFlow <= 0) {
      monthsToEven = 'N/A';
    } else {
      monthsToEven = Math.ceil(cashDown / monthlyCashFlow);
    }
    return{monthsToEven}
};

const maxEquityCalc = (purchasePrice, ARV, principalAmt) => {
    //purchasePrice is an object with a value and a isCashPurchase boolean
    //ARV is a number
    //principalAmt is a number
    const newLoanAmount = ARV * 0.8;
    let maxEquity;
    if (purchasePrice.isCashPurchase) {
      maxEquity = newLoanAmount;
    } else {
      maxEquity = (newLoanAmount-principalAmt);
    }

    return{newLoanAmount, maxEquity}
};

const equityReturnCalc = (maxEquity, totalInvestment) => {
    //maxEquity is a number
    //totalInvestment is a number
    const equityReturn = maxEquity - totalInvestment;
    const equityReturnPerc = ((equityReturn / totalInvestment) * 100);
    return{equityReturn, equityReturnPerc}
};

const acquisitionCosts = (purchasePrice, acquisitionCosts) => {
    //purchasePrice is an object with a value and a isCashPurchase boolean
    //acquisitionCosts is an object with a value and a isDollar boolean
    let realAcquisitionCosts;
    if (acquisitionCosts.isDollar) {
      realAcquisitionCosts = Number(acquisitionCosts.value);
    } else {
      realAcquisitionCosts = Number(purchasePrice.value) * (Number(acquisitionCosts.value) / 100);
    }

    return{realAcquisitionCosts}
};

const maximumAllowableOffer = (ARV, rehabCost) => {
    //only accepts number inputs
    const MAO = (ARV * 0.7) - rehabCost;
    return{MAO}
};

const wholesalingFees = (ARV, contractPrice, feePercent) => {
    //only accepts number inputs
    const wholesaleFee = ARV * feePercent;
    const wholesaleSalePrice = contractPrice + wholesaleFee;
    return{wholesaleFee, wholesaleSalePrice}
};

//START OF PRICE TARGET!!!
// M = Mortgage
// I = Monthly Interest Rate
// D = Down Payment Percentage
// n = Loan Term (months)
// L = Loan Amount
// P = Purchase Price
// Default Mortgage Equation: 
// M = (L*I) [(1+I)^n / ((1+I)^n - 1)]
//   = ((P-(P*D))*I) [(1+I)^n / ((1+I)^n - 1)]
//   = (P*(1-D)*I) [(1+I)^n / ((1+I)^n - 1)]
//   = P * [(1-D)*I*((1+I)^n / ((1+I)^n - 1))]
// Reverse to get Purchase Price:
// P = M / [(1-D)*I*((1+I)^n / ((1+I)^n - 1))]

const reverseMortgage = (interestRate, DownPayPerc, LoanTerm) => {
    //Only accepts number inputs
    const MonthInt = interestRate / 100 / 12;
    const AdjustedInt = 1 + MonthInt;
    const monthlyLoanTerm = LoanTerm * 12;
    const downPayDecimal = DownPayPerc / 100;
    const NormRate = (1-downPayDecimal) * ((MonthInt * Math.pow(AdjustedInt,monthlyLoanTerm) / (Math.pow(AdjustedInt,monthlyLoanTerm) - 1)));
    //Account for FHA and other PMI
    const LowDPRate = downPayDecimal <= 0.035
      ? 1.0175 * (((1-downPayDecimal) * ((MonthInt * Math.pow(AdjustedInt,monthlyLoanTerm) / (Math.pow(AdjustedInt,monthlyLoanTerm) - 1)))) + (((1-downPayDecimal) * 0.0085) / 12))
      : ((1-downPayDecimal) * ((MonthInt * Math.pow(AdjustedInt,monthlyLoanTerm) / (Math.pow(AdjustedInt,monthlyLoanTerm) - 1)))) + (((1-downPayDecimal) * 0.0085) / 12);
    return{NormRate, LowDPRate}
};

module.exports = {
  downPayment,
  mortgageCalculation,
  principalLeft,
  propertyTax,
  capEx,
  operatingExpense,
  sum,
  NOICalc,
  DSCRCalc,
  closingCosts,
  agentCommission,
  holdingExpenses,
  totalProfitCalc,
  ROI,
  cashFlow,
  cashOnCashCalc,
  capRateCalc,
  monthsToEvenCalc,
  maxEquityCalc,
  equityReturnCalc,
  acquisitionCosts,
  maximumAllowableOffer,
  wholesalingFees,
  reverseMortgage
};




