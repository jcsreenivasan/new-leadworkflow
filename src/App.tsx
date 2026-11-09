import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useFunnel } from './hooks/useFunnel';
import { FunnelLayout } from './components/funnel/FunnelLayout';
import { EmbeddedFunnel } from './components/funnel/EmbeddedFunnel';
import { StepLoanType } from './components/funnel/steps/StepLoanType';
import { StepOne } from './components/funnel/steps/StepOne';
import { StepTwo } from './components/funnel/steps/StepTwo';
import { StepThree } from './components/funnel/steps/StepThree';
import { StepFour } from './components/funnel/steps/StepFour';
import { LeadCapture } from './components/funnel/LeadCapture';
import { LoadingScreen } from './components/funnel/LoadingScreen';
import { RatesDisplay } from './components/funnel/RatesDisplay';

const isEmbed = new URLSearchParams(window.location.search).has('embed');

// ─── FunnelModal ───────────────────────────────────────────────────────────────

function FunnelModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
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
  } = useFunnel();

  const renderStep = () => {
    switch (currentStep) {
      case 'loan-type':
        return <StepLoanType onChange={updateData} onNext={goNext} />;
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
  { src: '/zillow-logo.png', label: 'Zillow', score: '4.98' },
  { src: '/google-logo.png', label: 'Google', score: '4.3'  },
  { src: '/yelp-logo.png',   label: 'Yelp',   score: '4.7'  },
];

export default function App() {
  const [isOpen, setIsOpen] = useState(false);

  if (isEmbed) return <EmbeddedFunnel />;

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

          {/* CTA */}
          <motion.button
            onClick={() => setIsOpen(true)}
            whileHover={{ scale: 1.03, boxShadow: '0 16px 48px rgba(234,37,35,0.30)' }}
            whileTap={{ scale: 0.97 }}
            className="px-10 py-4 bg-[#EA2523] text-white font-bold text-base rounded-2xl transition-all inline-flex items-center gap-3 mb-8"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="9 22 9 12 15 12 15 22" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Get My Mortgage Rate
          </motion.button>

          {/* Embedded funnel iframe */}
          <div className="w-full mb-8 rounded-2xl overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.12)] border border-gray-100">
            <iframe
              src="/?embed"
              title="Mortgage Rate Quote"
              style={{ width: '100%', height: '750px', border: 'none', display: 'block' }}
              allow="geolocation"
            />
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
        <FunnelModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
      )}
    </div>
  );
}
