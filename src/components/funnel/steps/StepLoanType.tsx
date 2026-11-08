import { motion } from 'framer-motion';
import type { FunnelData } from '../../../types/funnel';

interface StepLoanTypeProps {
  onChange: (updates: Partial<FunnelData>) => void;
  onNext: () => void;
}

function HomePurchaseIcon() {
  return (
    <svg width="52" height="52" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 22L24 6L42 22V42H30V30H18V42H6V22Z" stroke="#233B86" strokeWidth="2.5" strokeLinejoin="round" fill="#EEF1FB"/>
      <circle cx="38" cy="36" r="8" fill="#16A34A"/>
      <path d="M34.5 36L37 38.5L41.5 33.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function HomeRefinanceIcon() {
  return (
    <svg width="52" height="52" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 22L24 6L42 22V42H30V30H18V42H6V22Z" stroke="#233B86" strokeWidth="2.5" strokeLinejoin="round" fill="#EEF1FB"/>
      <circle cx="38" cy="36" r="8" fill="#EA2523"/>
      <path d="M35 36.5C35.5 34.5 37.5 33 39.5 33.5" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M41 35.5C40.5 37.5 38.5 39 36.5 38.5" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M39.5 33.5L41 35" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M36.5 38.5L35 37" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
}

export function StepLoanType({ onChange, onNext }: StepLoanTypeProps) {
  const handleSelect = (type: 'home-purchase' | 'home-refinance') => {
    onChange({ loanType: type });
    setTimeout(onNext, 180);
  };

  return (
    <div className="px-5 py-8">
      <div className="text-center mb-8">
        <p className="text-xs font-black uppercase tracking-widest text-[#EA2523] mb-2">Get Started</p>
        <h2 className="text-xl font-black text-gray-900 leading-tight">
          What would you like to do?
        </h2>
        <p className="text-sm text-gray-500 mt-2">Select one to get your personalized mortgage rate.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
        <motion.button
          onClick={() => handleSelect('home-purchase')}
          whileHover={{ scale: 1.04, boxShadow: '0 12px 32px rgba(35,59,134,0.18)' }}
          whileTap={{ scale: 0.96 }}
          className="flex flex-col items-center gap-3 p-6 bg-white border-2 border-gray-200 rounded-2xl hover:border-[#233B86] transition-all group"
        >
          <HomePurchaseIcon />
          <div>
            <p className="text-sm font-black text-gray-900 group-hover:text-[#233B86] transition-colors">Home Purchase</p>
            <p className="text-xs text-gray-400 mt-0.5">Buy a new home</p>
          </div>
        </motion.button>

        <motion.button
          onClick={() => handleSelect('home-refinance')}
          whileHover={{ scale: 1.04, boxShadow: '0 12px 32px rgba(234,37,35,0.18)' }}
          whileTap={{ scale: 0.96 }}
          className="flex flex-col items-center gap-3 p-6 bg-white border-2 border-gray-200 rounded-2xl hover:border-[#EA2523] transition-all group"
        >
          <HomeRefinanceIcon />
          <div>
            <p className="text-sm font-black text-gray-900 group-hover:text-[#EA2523] transition-colors">Home Refinance</p>
            <p className="text-xs text-gray-400 mt-0.5">Lower your rate</p>
          </div>
        </motion.button>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mt-8">
        {['No SSN required', 'Live rates', 'Compare options'].map(badge => (
          <div key={badge} className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth={2.5}>
              <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-xs font-semibold text-gray-700">{badge}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
