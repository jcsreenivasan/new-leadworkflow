import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useFunnel } from '../../hooks/useFunnel';
import { StepLoanType } from './steps/StepLoanType';
import { StepOne } from './steps/StepOne';
import { StepTwo } from './steps/StepTwo';
import { StepThree } from './steps/StepThree';
import { StepFour } from './steps/StepFour';
import { LoadingScreen } from './LoadingScreen';
import { LeadCapture } from './LeadCapture';
import { RatesDisplay } from './RatesDisplay';
import type { FunnelStep } from '../../types/funnel';

const slideVariants = {
  enter: (dir: 'forward' | 'backward') => ({ x: dir === 'forward' ? 48 : -48, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:  (dir: 'forward' | 'backward') => ({ x: dir === 'forward' ? -48 : 48, opacity: 0 }),
};

const STEP_LABELS: Partial<Record<FunnelStep, string>> = {
  step1: 'Property Details',
  step2: 'Property & Financing',
  step3: 'Financial Profile',
  step4: 'Almost There',
  'lead-capture': 'Almost There',
};

export function EmbeddedFunnel() {
  const {
    currentStep, direction, data, updateData, goNext, goBack,
    currentQuestionIndex, isQuestionStep, totalQuestions, canGoBack,
  } = useFunnel();

  const isLoading = currentStep === 'loading';

  const renderStep = () => {
    switch (currentStep) {
      case 'loan-type':    return <StepLoanType onChange={updateData} onNext={goNext} />;
      case 'step1':        return <StepOne data={data} onChange={updateData} onNext={goNext} />;
      case 'step2':        return <StepTwo data={data} onChange={updateData} onNext={goNext} />;
      case 'step3':        return <StepThree data={data} onChange={updateData} onNext={goNext} />;
      case 'step4':        return <StepFour data={data} onChange={updateData} onNext={goNext} />;
      case 'loading':      return <LoadingScreen onComplete={goNext} />;
      case 'lead-capture': return <LeadCapture data={data} onChange={updateData} onSubmit={goNext} />;
      case 'rates':        return <RatesDisplay data={data} />;
      default:             return null;
    }
  };

  return (
    <div className="bg-white flex flex-col" style={{ minHeight: '100vh' }}>
      {/* Chrome header */}
      {!isLoading && (
        <div className="flex-shrink-0 bg-white">
          <div className="flex items-center px-5 py-3.5 gap-3">
            <div className="w-9 flex-shrink-0">
              <AnimatePresence mode="wait">
                {canGoBack ? (
                  <motion.button
                    key="back"
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    onClick={goBack}
                    className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 transition-colors"
                  >
                    <ArrowLeft size={17} />
                  </motion.button>
                ) : (
                  <div className="w-9" />
                )}
              </AnimatePresence>
            </div>

            <div className="flex-1 flex items-center justify-center">
              <img src="/texas-united-logo.webp" alt="Texas United Mortgage" className="h-7 w-auto object-contain" />
            </div>

            <div className="w-9 flex-shrink-0" />
          </div>

          {isQuestionStep && (
            <div className="px-5 pb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#757575' }}>
                  {STEP_LABELS[currentStep]}
                </span>
                <span className="text-xs font-bold text-[#EA2523] tabular-nums">
                  Step {currentQuestionIndex + 1} of {totalQuestions}
                </span>
              </div>
              <div className="flex gap-1.5">
                {Array.from({ length: totalQuestions }).map((_, i) => (
                  <div key={i} className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: i <= currentQuestionIndex ? '100%' : '0%', backgroundColor: '#EA2523' }}
                      transition={{ duration: 0.4, ease: 'easeInOut' }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="h-px bg-gray-100" />
        </div>
      )}

      {/* Step content */}
      <div className="flex-1 overflow-y-auto overscroll-contain">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', stiffness: 340, damping: 32 }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
