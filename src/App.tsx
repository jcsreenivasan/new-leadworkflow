import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useFunnel } from './hooks/useFunnel';
import { FunnelLayout } from './components/funnel/FunnelLayout';
import { StepOne } from './components/funnel/steps/StepOne';
import { StepTwo } from './components/funnel/steps/StepTwo';
import { StepThree } from './components/funnel/steps/StepThree';
import { StepFour } from './components/funnel/steps/StepFour';
import { LeadCapture } from './components/funnel/LeadCapture';
import { LoadingScreen } from './components/funnel/LoadingScreen';
import { RatesDisplay } from './components/funnel/RatesDisplay';
import type { FunnelData } from './types/funnel';

// ─── Inline SVG icons for loan-type cards ──────────────────────────────────────

function HomePurchaseIcon({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 22L24 6L42 22V42H30V30H18V42H6V22Z" stroke="#233B86" strokeWidth="2.5" strokeLinejoin="round" fill="#EEF1FB"/>
      <path d="M18 42V30H30V42" stroke="#233B86" strokeWidth="2.5" strokeLinejoin="round"/>
      <circle cx="38" cy="36" r="8" fill="#16A34A"/>
      <path d="M34.5 36L37 38.5L41.5 33.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function HomeRefinanceIcon({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 22L24 6L42 22V42H30V30H18V42H6V22Z" stroke="#233B86" strokeWidth="2.5" strokeLinejoin="round" fill="#EEF1FB"/>
      <path d="M18 42V30H30V42" stroke="#233B86" strokeWidth="2.5" strokeLinejoin="round"/>
      <circle cx="38" cy="36" r="8" fill="#EA2523"/>
      <path d="M35 36.5C35.5 34.5 37.5 33 39.5 33.5" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M41 35.5C40.5 37.5 38.5 39 36.5 38.5" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M39.5 33.5L41 35" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M36.5 38.5L35 37" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
}

// ─── FunnelModal ───────────────────────────────────────────────────────────────

interface FunnelModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialLoanType: 'home-purchase' | 'home-refinance' | null;
}

function FunnelModal({ isOpen, onClose, initialLoanType }: FunnelModalProps) {
  const {
    currentStep,
    direction,
    data,
    updateData,
    goNext,
    goBack,
    currentQuestionIndex,
    isQuestionStep,
    totalQuestions,
    canGoBack,
  } = useFunnel(initialLoanType);

  // Seed initialLoanType once when modal opens
  useEffect(() => {
    if (initialLoanType) {
      updateData({ loanType: initialLoanType } as Partial<FunnelData>);
    }
  // Only run when the modal first opens (initialLoanType won't change mid-session)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderStep = () => {
    switch (currentStep) {
      case 'step1':
        return <StepOne data={data} onChange={updateData} onNext={goNext} />;
      case 'step2':
        return <StepTwo data={data} onChange={updateData} onNext={goNext} />;
      case 'step3':
        return <StepThree data={data} onChange={updateData} onNext={goNext} />;
      case 'step4':
        return <StepFour data={data} onChange={updateData} onNext={goNext} />;
      case 'lead-capture':
        return <LeadCapture data={data} onChange={updateData} onSubmit={goNext} />;
      case 'loading':
        return <LoadingScreen onComplete={goNext} />;
      case 'rates':
        return <RatesDisplay data={data} />;
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <FunnelLayout
          currentStep={currentStep}
          currentQuestionIndex={currentQuestionIndex}
          isQuestionStep={isQuestionStep}
          totalQuestions={totalQuestions}
          canGoBack={canGoBack}
          onBack={goBack}
          onClose={onClose}
          direction={direction}
        >
          {renderStep()}
        </FunnelLayout>
      )}
    </AnimatePresence>
  );
}

// ─── Landing Page ──────────────────────────────────────────────────────────────

const TRUST_BADGES = [
  'No social or date of birth',
  'Access to live rates',
  'Compare multiple loan options',
];

const RATINGS = [
  { src: '/zillow-logo.png',  label: 'Zillow',  score: '4.98' },
  { src: '/google-logo.png',  label: 'Google',  score: '4.3'  },
  { src: '/yelp-logo.png',    label: 'Yelp',    score: '4.7'  },
];

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [pendingLoanType, setPendingLoanType] = useState<'home-purchase' | 'home-refinance' | null>(null);

  const handleLoanTypeSelect = (type: 'home-purchase' | 'home-refinance') => {
    setPendingLoanType(type);
    setIsOpen(true);
  };

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      {/* Nav */}
      <nav className="border-b border-gray-100 bg-white sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-5 h-16 flex items-center justify-between">
          <img
            src="/texas-united-logo.webp"
            alt="Texas United Mortgage"
            className="h-9 w-auto object-contain"
          />
          <a
            href="tel:+18005551234"
            className="text-sm font-semibold text-[#233B86] hover:text-[#EA2523] transition-colors hidden sm:block"
          >
            (800) 555-1234
          </a>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-5 py-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-lg text-center"
        >
          <p className="text-xs font-black uppercase tracking-widest text-[#EA2523] mb-2">Texas United Mortgage</p>
          <h1 className="text-3xl sm:text-4xl font-black text-[#233B86] leading-tight mb-2">
            The Low Rate Leader.
          </h1>
          <h2 className="text-3xl sm:text-4xl font-black text-[#EA2523] leading-tight mb-6">
            Everyday!
          </h2>
          <p className="text-gray-500 text-sm mb-8">Start your custom quote below.</p>

          {/* Loan type cards */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {/* Home Purchase */}
            <motion.button
              onClick={() => handleLoanTypeSelect('home-purchase')}
              whileHover={{ scale: 1.03, boxShadow: '0 12px 32px rgba(35,59,134,0.18)' }}
              whileTap={{ scale: 0.97 }}
              className="flex flex-col items-center gap-3 p-6 bg-white border-2 border-gray-200 rounded-2xl hover:border-[#233B86] transition-all group"
            >
              <HomePurchaseIcon size={48} />
              <div>
                <p className="text-sm font-black text-gray-900 group-hover:text-[#233B86] transition-colors">Home Purchase</p>
                <p className="text-xs text-gray-400 mt-0.5">Buy a new home</p>
              </div>
            </motion.button>

            {/* Home Refinance */}
            <motion.button
              onClick={() => handleLoanTypeSelect('home-refinance')}
              whileHover={{ scale: 1.03, boxShadow: '0 12px 32px rgba(234,37,35,0.18)' }}
              whileTap={{ scale: 0.97 }}
              className="flex flex-col items-center gap-3 p-6 bg-white border-2 border-gray-200 rounded-2xl hover:border-[#EA2523] transition-all group"
            >
              <HomeRefinanceIcon size={48} />
              <div>
                <p className="text-sm font-black text-gray-900 group-hover:text-[#EA2523] transition-colors">Home Refinance</p>
                <p className="text-xs text-gray-400 mt-0.5">Lower your rate</p>
              </div>
            </motion.button>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {TRUST_BADGES.map(badge => (
              <div key={badge} className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth={2.5}>
                  <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-xs font-semibold text-gray-700">{badge}</span>
              </div>
            ))}
          </div>

          {/* Rating bar */}
          <div className="flex items-center justify-center gap-4 flex-wrap">
            {RATINGS.map(r => (
              <div key={r.label} className="flex items-center gap-1.5">
                <img src={r.src} alt={r.label} className="h-5 w-auto object-contain" />
                <div className="flex items-center gap-0.5">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="#FBBF24" stroke="none">
                    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
                  </svg>
                  <span className="text-xs font-bold text-gray-800">{r.score}</span>
                </div>
              </div>
            ))}
            <div className="flex items-center gap-1.5">
              <img src="/bankingbridge-badge.png" alt="BankingBridge" className="h-5 w-auto object-contain" />
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-5 px-5 text-center">
        <p className="text-xs text-gray-400">
          © {new Date().getFullYear()} Texas United Mortgage Company · NMLS #46749 ·{' '}
          <a href="tel:+18005551234" className="hover:text-[#233B86] transition-colors">
            (800) 555-1234
          </a>
        </p>
        <p className="text-xs text-gray-300 mt-1">
          Equal Housing Opportunity Lender. This is not a loan commitment. Rates subject to change.
        </p>
      </footer>

      {isOpen && (
        <FunnelModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          initialLoanType={pendingLoanType}
        />
      )}
    </div>
  );
}
