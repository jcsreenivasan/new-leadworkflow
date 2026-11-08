export interface FunnelData {
  loanType: 'home-purchase' | 'home-refinance' | null;
  propertyType: 'single-family' | 'townhome' | 'condo' | 'multi-unit' | null;
  decisionTimeline: 'considering-now' | '30-days' | '2-4-months' | 'just-researching' | null;
  residencyType: 'primary' | 'second-home' | 'rental' | null;
  zipCode: string;
  state: string;
  propertyValue: number;
  downPayment: number;
  annualIncome: number;
  creditScore: number;
  militaryService: 'yes' | 'no' | null;
  workingWithLoanOfficer: 'yes' | 'no' | null;
  lead: { name: string; email: string; phone: string };
}

export interface RateData {
  label: string;
  badge?: string;
  interestRate: number;
  apr: number;
  monthlyPayment: number;
  loanAmount: number;
  termMonths: number;
  totalInterest: number;
}

export type FunnelStep = 'step1' | 'step2' | 'step3' | 'step4' | 'loading' | 'lead-capture' | 'rates';

export const STEP_ORDER: FunnelStep[] = ['step1', 'step2', 'step3', 'step4', 'loading', 'lead-capture', 'rates'];

export const QUESTION_STEPS: FunnelStep[] = ['step1', 'step2', 'step3', 'step4'];
