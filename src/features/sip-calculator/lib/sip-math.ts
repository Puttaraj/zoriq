/**
 * SIP (Systematic Investment Plan) Math Utilities
 */

export interface SipResult {
  investedAmount: number;
  estimatedReturns: number;
  totalValue: number;
  investedPct: number;
  returnsPct: number;
  yearlyBreakdown: {
    year: number;
    invested: number;
    returns: number;
    balance: number;
  }[];
}

export function calculateSip(
  monthlyInvestment: number,
  expectedReturnRate: number,
  tenureYears: number,
): SipResult {
  const P = Math.max(0, monthlyInvestment);
  const annualRate = Math.max(0, expectedReturnRate);
  const years = Math.max(1, tenureYears);
  const totalMonths = years * 12;

  if (P === 0 || annualRate === 0) {
    const invested = P * totalMonths;
    return {
      investedAmount: invested,
      estimatedReturns: 0,
      totalValue: invested,
      investedPct: 100,
      returnsPct: 0,
      yearlyBreakdown: [],
    };
  }

  const i = annualRate / 12 / 100;
  const totalValue = P * ((Math.pow(1 + i, totalMonths) - 1) / i) * (1 + i);
  const investedAmount = P * totalMonths;
  const estimatedReturns = Math.max(0, totalValue - investedAmount);

  const returnsPct = Math.round((estimatedReturns / totalValue) * 100) || 0;
  const investedPct = 100 - returnsPct;

  const yearlyBreakdown = [];
  for (let y = 1; y <= years; y++) {
    const months = y * 12;
    const yearInvested = P * months;
    const yearBalance = P * ((Math.pow(1 + i, months) - 1) / i) * (1 + i);
    const yearReturns = Math.max(0, yearBalance - yearInvested);

    yearlyBreakdown.push({
      year: y,
      invested: Math.round(yearInvested),
      returns: Math.round(yearReturns),
      balance: Math.round(yearBalance),
    });
  }

  return {
    investedAmount: Math.round(investedAmount),
    estimatedReturns: Math.round(estimatedReturns),
    totalValue: Math.round(totalValue),
    investedPct,
    returnsPct,
    yearlyBreakdown,
  };
}
