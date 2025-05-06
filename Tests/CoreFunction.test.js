import {
  downPayment,
  mortgageCalculation,
  principalLeft,
  propertyTax,
  capEx,
  operatingExpense,
  sum,
  NOI,
  DSCR,
  closingCosts,
  agentCommission,
  holdingExpenses,
  totalProfit,
  ROI,
  cashFlow,
  cashOnCash,
  capRate,
  monthsToEven,
  maxEquity,
  equityReturn,
  acquisitionCosts,
  maximumAllowableOffer,
  wholesalingFees,
  reverseMortgage
} from '../app/Calculations/CoreFunctions.Js';

// Helper function to compare floating point numbers with precision
const closeTo = (value, expected, precision = 0.01) => {
  return Math.abs(value - expected) < precision;
};

describe('CoreFunctions', () => {
  // downPayment tests
  describe('downPayment', () => {
    test('calculates down payment when provided as percentage', () => {
      const result = downPayment(
        { value: 200000, isCashPurchase: false },
        { value: 20, isDollar: false }
      );
      
      expect(result.downPaymentCash).toBe(40000);
      expect(result.downPaymentPercent).toBe(20);
      expect(result.loanAmount).toBe(160000);
    });
    
    test('calculates down payment when provided as dollar amount', () => {
      const result = downPayment(
        { value: 200000, isCashPurchase: false },
        { value: 50000, isDollar: true }
      );
      
      expect(result.downPaymentCash).toBe(50000);
      expect(closeTo(result.downPaymentPercent, 25)).toBe(true);
      expect(result.loanAmount).toBe(150000);
    });
    
    test('handles cash purchase (100% down)', () => {
      const result = downPayment(
        { value: 200000, isCashPurchase: true },
        { value: 0, isDollar: true }
      );
      
      expect(result.downPaymentCash).toBe(200000);
      expect(result.downPaymentPercent).toBe(100);
      expect(result.loanAmount).toBe(0);
    });
  });
  
  // mortgageCalculation tests
  describe('mortgageCalculation', () => {
    test('calculates mortgage payment for standard loan', () => {
      const result = mortgageCalculation(
        { value: 200000, isCashPurchase: false },
        160000,
        20,
        { value: 4.5, isInterestOnly: false },
        30
      );
      
      expect(closeTo(result.mortgageCost, 810.70)).toBe(true);
    });
    
    test('calculates interest-only mortgage payment', () => {
      const result = mortgageCalculation(
        { value: 200000, isCashPurchase: false },
        160000,
        20,
        { value: 4.5, isInterestOnly: true },
        30
      );
      
      expect(closeTo(result.mortgageCost, 600)).toBe(true);
    });
    
    test('returns zero mortgage for cash purchase', () => {
      const result = mortgageCalculation(
        { value: 200000, isCashPurchase: true },
        0,
        100,
        { value: 4.5, isInterestOnly: false },
        30
      );
      
      expect(result.mortgageCost).toBe(0);
    });
    
    test('adds PMI for down payment less than 20%', () => {
      const resultWithoutPMI = mortgageCalculation(
        { value: 200000, isCashPurchase: false },
        160000,
        20,
        { value: 4.5, isInterestOnly: false },
        30
      );
      
      const resultWithPMI = mortgageCalculation(
        { value: 200000, isCashPurchase: false },
        180000,
        10,
        { value: 4.5, isInterestOnly: false },
        30
      );
      
      // PMI should be 0.85% of loan amount / 12
      const expectedPMI = (180000 * 0.0085) / 12;
      expect(resultWithPMI.mortgageCost).toBeGreaterThan(resultWithoutPMI.mortgageCost);
      expect(closeTo(resultWithPMI.mortgageCost - (180000/160000)*resultWithoutPMI.mortgageCost, expectedPMI)).toBe(true);
    });
    
    test('adds FHA upfront fee for 3.5% down payments', () => {
      const result = mortgageCalculation(
        { value: 200000, isCashPurchase: false },
        193000, // 200000 - (200000 * 0.035)
        3.5,
        { value: 4.5, isInterestOnly: false },
        30
      );
      
      // Should add 1.75% to loan amount
      const expectedLoanWithFee = 193000 * 1.0175;
      expect(closeTo(result.mortgageCost, 1027)).toBe(true);
    });
  });
  
  // principalLeft tests
  describe('principalLeft', () => {
    test('calculates remaining principal after specified months', () => {
      const result = principalLeft(
        160000,
        { value: 4.5, isInterestOnly: false },
        60, // 5 years
        810.70
      );
      
      expect(closeTo(result.principalAmt, 146622, 1)).toBe(true);
    });
    
    test('handles interest-only loans (no principal reduction)', () => {
      const result = principalLeft(
        160000,
        { value: 4.5, isInterestOnly: true },
        60, // 5 years
        600
      );
      
      expect(closeTo(result.principalAmt, 160000)).toBe(true);
    });
  });
  
  // propertyTax tests
  describe('propertyTax', () => {
    test('calculates monthly property tax from percentage', () => {
      const result = propertyTax(
        { value: 200000, isCashPurchase: false },
        { value: 1.2, isDollar: false }
      );
      
      // (200000 * 0.012) / 12 = 200
      expect(result.monthlyPropTax).toBe(200);
    });
    
    test('calculates monthly property tax from annual dollar amount', () => {
      const result = propertyTax(
        { value: 200000, isCashPurchase: false },
        { value: 2400, isDollar: true }
      );
      
      // 2400 / 12 = 200
      expect(result.monthlyPropTax).toBe(200);
    });
  });
  
  // capEx tests
  describe('capEx', () => {
    test('calculates monthly capEx from percentage of rent', () => {
      const result = capEx(
        2000, // monthly rent
        { value: 5, isDollar: false }
      );
      
      // 2000 * 0.05 = 100
      expect(result.monthlyCapEx).toBe(100);
    });
    
    test('calculates monthly capEx from annual dollar amount', () => {
      const result = capEx(
        2000, // monthly rent
        { value: 1200, isDollar: true }
      );
      
      // 1200 / 12 = 100
      expect(result.monthlyCapEx).toBe(100);
    });
  });
  
  // operatingExpense tests
  describe('operatingExpense', () => {
    test('calculates total monthly and fixed expenses', () => {
      const expenses = {
        isActive: true,
        expenses: [
          { name: 'Insurance', cost: 1200, frequency: 'Annually' },
          { name: 'Repairs', cost: 150, frequency: 'Monthly' },
          { name: 'HOA', cost: 200, frequency: 'Monthly' },
          { name: 'Initial Repairs', cost: 5000, frequency: 'Non-recurring' }
        ]
      };
      
      const result = operatingExpense(expenses);
      
      // Monthly: 150 + 200 + (1200/12) = 450
      // Fixed: 5000
      expect(closeTo(result.totalMonthlyExpenses, 450)).toBe(true);
      expect(result.totalFixedExpenses).toBe(5000);
    });
    
    test('returns zero when no expenses', () => {
      const emptyExpenses = {
        isActive: true,
        expenses: []
      };
      
      const result = operatingExpense(emptyExpenses);
      
      expect(result.totalMonthlyExpenses).toBe(0);
      expect(result.totalFixedExpenses).toBe(0);
    });
    
    test('returns zero when not active', () => {
      const inactiveExpenses = {
        isActive: false,
        expenses: [
          { name: 'Insurance', cost: 1200, frequency: 'Annually' }
        ]
      };
      
      const result = operatingExpense(inactiveExpenses);
      
      expect(result.totalMonthlyExpenses).toBe(0);
      expect(result.totalFixedExpenses).toBe(0);
    });
  });
  
  // sum tests
  describe('sum', () => {
    test('sums multiple numbers', () => {
      const result = sum(100, 200, 300, 400);
      expect(result.total).toBe(1000);
    });
    
    test('handles empty input', () => {
      const result = sum();
      expect(result.total).toBe(0);
    });
  });
  
  // NOI tests
  describe('NOI', () => {
    test('calculates Net Operating Income correctly', () => {
      const result = NOI(
        2000, // monthly rent
        500,  // monthly operating expenses
        5     // vacancy percentage
      );
      
      // Annual rent: 2000 * 12 = 24000
      // Annual expenses: 500 * 12 = 6000
      // Annual vacancy: 24000 * 0.05 = 1200
      // NOI = 24000 - (6000 + 1200) = 16800
      expect(result.NOI).toBe(16800);
    });
  });
  
  // DSCR tests
  describe('DSCR', () => {
    test('calculates Debt Service Coverage Ratio', () => {
      const result = DSCR(
        { value: 200000, isCashPurchase: false },
        16800, // NOI
        900    // monthly mortgage
      );
      
      // Annual mortgage: 900 * 12 = 10800
      // DSCR = 16800 / 10800 = 1.56
      expect(result.DSCR).toBe('1.56');
    });
    
    test('returns N/A for cash purchases', () => {
      const result = DSCR(
        { value: 200000, isCashPurchase: true },
        16800, // NOI
        0      // monthly mortgage (cash purchase)
      );
      
      expect(result.DSCR).toBe('N/A');
    });
  });
  
  // closingCosts tests
  describe('closingCosts', () => {
    test('calculates closing costs from percentage', () => {
      const result = closingCosts(
        { value: 200000, isCashPurchase: false },
        { value: 3, isDollar: false }
      );
      
      // 200000 * 0.03 = 6000
      expect(result.closingCostTotal).toBe(6000);
    });
    
    test('uses direct dollar amount when provided', () => {
      const result = closingCosts(
        { value: 200000, isCashPurchase: false },
        { value: 5000, isDollar: true }
      );
      
      expect(result.closingCostTotal).toBe(5000);
    });
  });
  
  // agentCommission tests
  describe('agentCommission', () => {
    test('calculates agent commission from percentage', () => {
      const result = agentCommission(
        250000, // ARV
        { value: 6, isDollar: false }
      );
      
      // 250000 * 0.06 = 15000
      expect(result.agentLoss).toBe(15000);
    });
    
    test('uses direct dollar amount when provided', () => {
      const result = agentCommission(
        250000, // ARV
        { value: 10000, isDollar: true }
      );
      
      expect(result.agentLoss).toBe(10000);
    });
  });
  
  // holdingExpenses tests
  describe('holdingExpenses', () => {
    test('calculates total holding expenses for a period', () => {
      const result = holdingExpenses(
        6,    // months held
        1000  // monthly expenses
      );
      
      // 6 * 1000 = 6000
      expect(result.totalHoldingExpenses).toBe(6000);
    });
  });
  
  // totalProfit tests
  describe('totalProfit', () => {
    test('calculates profit for financed purchase', () => {
      const result = totalProfit(
        { value: 200000, isCashPurchase: false },
        250000, // ARV
        50000,  // total expenses
        15000,  // agent commission
        150000  // principal amount left
      );
      
      // 250000 - (50000 + 15000 + 150000) = 35000
      expect(result.totalProfit).toBe(35000);
    });
    
    test('calculates profit for cash purchase', () => {
      const result = totalProfit(
        { value: 200000, isCashPurchase: true },
        250000, // ARV
        220000, // total expenses (including purchase price)
        15000,  // agent commission
        0       // principal amount left (unused for cash)
      );
      
      // 250000 - (220000 + 15000) = 15000
      expect(result.totalProfit).toBe(15000);
    });
  });
  
  // ROI tests
  describe('ROI', () => {
    test('calculates ROI correctly', () => {
      const result = ROI(
        35000,  // total profit
        { value: 200000, isCashPurchase: false },
        50000   // total expenses
      );
      
      // PercROI: (35000 / 200000) * 100 = 17.5%
      // CashROI: (35000 / 50000) * 100 = 70%
      expect(result.PercROI).toBe(17.5);
      expect(result.CashROI).toBe(70);
    });
  });
  
  // cashFlow tests
  describe('cashFlow', () => {
    test('calculates monthly and annual cash flow', () => {
      const result = cashFlow(
        2000, // monthly rent
        1200, // monthly cost
        5     // vacancy percentage
      );
      
      // Monthly: 2000 - 1200 = 800
      // Annual: (2000 * 12) - (1200 * 12) - (0.05 * 2000 * 12) = 24000 - 14400 - 1200 = 8400
      expect(result.monthlyCashFlow).toBe(800);
      expect(result.annualCashFlow).toBe(8400);
    });
  });
  
  // cashOnCash tests
  describe('cashOnCash', () => {
    test('calculates cash on cash return', () => {
      const result = cashOnCash(
        8400,  // annual cash flow
        50000  // cash down
      );
      
      // (8400 / 50000) * 100 = 16.8%
      expect(result.cashOnCash).toBe(16.8);
    });
  });
  
  // capRate tests
  describe('capRate', () => {
    test('calculates capitalization rate', () => {
      const result = capRate(
        16800, // annual cash flow (NOI)
        { value: 200000, isCashPurchase: false }
      );
      
      // (16800 / 200000) * 100 = 8.4%
      expect(result.capRate).toBe(8.4);
    });
  });
  
  // monthsToEven tests
  describe('monthsToEven', () => {
    test('calculates months to break even', () => {
      const result = monthsToEven(
        48000, // cash down
        800    // monthly cash flow
      );
      
      // 48000 / 800 = 60
      expect(result.monthsToEven).toBe(60);
    });
    
    test('rounds up to nearest month', () => {
      const result = monthsToEven(
        50000, // cash down
        800    // monthly cash flow
      );
      
      // 50000 / 800 = 62.5, rounds up to 63
      expect(result.monthsToEven).toBe(63);
    });
  });
  
  // maxEquity tests
  describe('maxEquity', () => {
    test('calculates maximum equity for financed property', () => {
      const result = maxEquity(
        { value: 200000, isCashPurchase: false },
        250000, // ARV
        150000  // principal amount
      );
      
      // (250000 * 0.8) - 150000 = 200000 - 150000 = 50000
      expect(result.maxEquity).toBe(50000);
    });
    
    test('calculates maximum equity for cash purchased property', () => {
      const result = maxEquity(
        { value: 200000, isCashPurchase: true },
        250000, // ARV
        0       // principal amount
      );
      
      // 250000 * 0.8 = 200000
      expect(result.maxEquity).toBe(200000);
    });
  });
  
  // equityReturn tests
  describe('equityReturn', () => {
    test('calculates equity return and percentage', () => {
      const result = equityReturn(
        50000, // max equity
        40000  // total investment
      );
      
      // Return: 50000 - 40000 = 10000
      // Percentage: (10000 / 40000) * 100 = 25%
      expect(result.equityReturn).toBe(10000);
      expect(result.equityReturnPerc).toBe(25);
    });
  });
  
  // acquisitionCosts tests
  describe('acquisitionCosts', () => {
    test('calculates acquisition costs from percentage', () => {
      const result = acquisitionCosts(
        { value: 200000, isCashPurchase: false },
        { value: 2, isDollar: false }
      );
      
      // 200000 * 0.02 = 4000
      expect(result.realAcquisitionCosts).toBe(4000);
    });
    
    test('uses direct dollar amount when provided', () => {
      const result = acquisitionCosts(
        { value: 200000, isCashPurchase: false },
        { value: 3000, isDollar: true }
      );
      
      expect(result.realAcquisitionCosts).toBe(3000);
    });
  });
  
  // maximumAllowableOffer tests
  describe('maximumAllowableOffer', () => {
    test('calculates MAO using the 70% rule', () => {
      const result = maximumAllowableOffer(
        250000, // ARV
        30000   // rehab cost
      );
      
      // (250000 * 0.7) - 30000 = 175000 - 30000 = 145000
      expect(result.MAO).toBe(145000);
    });
  });
  
  // wholesalingFees tests
  describe('wholesalingFees', () => {
    test('calculates wholesaling fees and sale price', () => {
      const result = wholesalingFees(
        250000, // ARV
        140000, // contract price
        0.05    // fee percentage
      );
      
      // Fee: 250000 * 0.05 = 12500
      // Sale price: 140000 + 12500 = 152500
      expect(result.wholesaleFee).toBe(12500);
      expect(result.wholesaleSalePrice).toBe(152500);
    });
  });
  
  // reverseMortgage tests
  describe('reverseMortgage', () => {
    test('calculates normal rate for 20% down payment', () => {
      const result = reverseMortgage(
        4.5,  // interest rate
        0.2,  // down payment percentage
        360   // loan term in months
      );
      
      expect(closeTo(result.NormRate, 0.00405, 0.0001)).toBe(true);
    });
    
    test('calculates rate with PMI for low down payment', () => {
      const result = reverseMortgage(
        4.5,   // interest rate
        0.1,   // down payment percentage
        360    // loan term in months
      );
      
      expect(result.LowDPRate).toBeGreaterThan(result.NormRate);
    });
    
    test('calculates rate with FHA adjustments for 3.5% down', () => {
      const result = reverseMortgage(
        4.5,     // interest rate
        0.035,   // down payment percentage (FHA)
        360      // loan term in months
      );
      
      // Should include both FHA upfront fee and PMI
      expect(result.LowDPRate).toBeGreaterThan(0);
    });
  });
});
