import { useState, useCallback } from 'react';
import type { FunnelData, FunnelStep } from '../types/funnel';
import { STEP_ORDER, QUESTION_STEPS } from '../types/funnel';

const DEFAULT_DATA: FunnelData = {
  loanType: null,
  propertyType: null,
  decisionTimeline: null,
  residencyType: null,
  zipCode: '',
  state: '',
  propertyValue: 500000,
  downPayment: 50000,
  annualIncome: 85000,
  creditScore: 700,
  militaryService: null,
  workingWithLoanOfficer: null,
  lead: { name: '', email: '', phone: '' },
};

export function useFunnel(initialLoanType?: 'home-purchase' | 'home-refinance' | null) {
  const [currentStep, setCurrentStep] = useState<FunnelStep>('step1');
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const [data, setData] = useState<FunnelData>({
    ...DEFAULT_DATA,
    loanType: initialLoanType ?? null,
  });

  const updateData = useCallback((updates: Partial<FunnelData>) => {
    setData(prev => ({ ...prev, ...updates }));
  }, []);

  const reset = useCallback(() => {
    setData(DEFAULT_DATA);
    setCurrentStep('step1');
    setDirection('forward');
  }, []);

  const goNext = useCallback(() => {
    setDirection('forward');
    setCurrentStep(prev => {
      const idx = STEP_ORDER.indexOf(prev);
      if (idx !== -1 && idx < STEP_ORDER.length - 1) return STEP_ORDER[idx + 1];
      return prev;
    });
  }, []);

  const goBack = useCallback(() => {
    setDirection('backward');
    setCurrentStep(prev => {
      const idx = STEP_ORDER.indexOf(prev);
      if (idx > 0) return STEP_ORDER[idx - 1];
      return prev;
    });
  }, []);

  const currentQuestionIndex = QUESTION_STEPS.indexOf(currentStep);
  const isQuestionStep = currentQuestionIndex !== -1;
  const totalQuestions = QUESTION_STEPS.length;
  const canGoBack =
    currentStep !== 'step1' &&
    currentStep !== 'loading' &&
    currentStep !== 'lead-capture' &&
    currentStep !== 'rates';

  return {
    currentStep,
    direction,
    data,
    updateData,
    reset,
    goNext,
    goBack,
    currentQuestionIndex,
    isQuestionStep,
    totalQuestions,
    canGoBack,
  };
}
