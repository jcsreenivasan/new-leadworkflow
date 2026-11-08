import type { FunnelData, RateData } from '../types/funnel';

type CreditBand = 'excellent' | 'good' | 'fair' | 'poor';

function scoreToBand(score: number): CreditBand {
  if (score >= 720) return 'excellent';
  if (score >= 680) return 'good';
  if (score >= 620) return 'fair';
  return 'poor';
}

function mortgageRates(band: CreditBand): { primary: number; secondary: number } {
  const map: Record<CreditBand, { primary: number; secondary: number }> = {
    excellent: { primary: 6.25, secondary: 5.75 },
    good:      { primary: 6.75, secondary: 6.25 },
    fair:      { primary: 7.25, secondary: 6.75 },
    poor:      { primary: 7.99, secondary: 7.49 },
  };
  return map[band];
}

function calcMonthlyPayment(principal: number, annualRate: number, termMonths: number): number {
  const r = annualRate / 100 / 12;
  if (r === 0) return principal / termMonths;
  return (principal * r * Math.pow(1 + r, termMonths)) / (Math.pow(1 + r, termMonths) - 1);
}

export interface RateCalculationResult {
  rates: RateData[];
  loanAmount: number;
}

export function calculateRates(data: FunnelData): RateCalculationResult {
  const band = scoreToBand(data.creditScore);
  const rates = mortgageRates(band);

  // VA discount for military service
  const vaDiscount = data.militaryService === 'yes' ? 0.25 : 0;

  const primary30Rate   = rates.primary   - vaDiscount;
  const secondary15Rate = rates.secondary - vaDiscount;

  const loanAmount = Math.max(0, data.propertyValue - data.downPayment);

  const primary30Monthly   = calcMonthlyPayment(loanAmount, primary30Rate,   360);
  const secondary15Monthly = calcMonthlyPayment(loanAmount, secondary15Rate, 180);

  return {
    loanAmount,
    rates: [
      {
        label: '30-Year Fixed',
        badge: 'Best Rate',
        interestRate: primary30Rate,
        apr: primary30Rate + 0.1,
        monthlyPayment: primary30Monthly,
        loanAmount,
        termMonths: 360,
        totalInterest: primary30Monthly * 360 - loanAmount,
      },
      {
        label: '15-Year Fixed',
        badge: 'Lower Interest',
        interestRate: secondary15Rate,
        apr: secondary15Rate + 0.1,
        monthlyPayment: secondary15Monthly,
        loanAmount,
        termMonths: 180,
        totalInterest: secondary15Monthly * 180 - loanAmount,
      },
    ],
  };
}

export function creditScoreLabel(score: number): string {
  const band = scoreToBand(score);
  const labels: Record<CreditBand, string> = {
    excellent: `Excellent (${score})`,
    good:      `Good (${score})`,
    fair:      `Fair (${score})`,
    poor:      `Poor (${score})`,
  };
  return labels[band];
}
