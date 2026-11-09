import { motion } from 'framer-motion';
import type { FunnelData } from '../../../types/funnel';

interface StepLoanTypeProps {
  onChange: (updates: Partial<FunnelData>) => void;
  onNext: () => void;
}

export function StepLoanType({ onChange, onNext }: StepLoanTypeProps) {
  const handleSelect = (type: 'home-purchase' | 'home-refinance') => {
    onChange({ loanType: type });
    setTimeout(onNext, 180);
  };

  return (
    <div className="px-5 py-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-black text-[#233B86] leading-tight mb-2">
          The Low Rate Leader. Everyday!
        </h1>
        <h2 className="text-base font-semibold" style={{ color: '#757575' }}>
          Start your custom quote below.
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
        <motion.button
          onClick={() => handleSelect('home-purchase')}
          whileHover={{ scale: 1.04, boxShadow: '0 12px 32px rgba(35,59,134,0.18)' }}
          whileTap={{ scale: 0.96 }}
          className="flex flex-col items-center gap-3 p-6 bg-white border-2 border-gray-200 rounded-2xl hover:border-[#233B86] transition-all group"
        >
          <img src="/icons/home-purchase.png" alt="Home Purchase" className="w-16 h-16 object-contain" />
          <div>
            <p className="text-base font-black text-gray-900 group-hover:text-[#233B86] transition-colors whitespace-nowrap">Home Purchase</p>
            <p className="text-sm mt-0.5" style={{ color: '#757575' }}>Buy a new home</p>
          </div>
        </motion.button>

        <motion.button
          onClick={() => handleSelect('home-refinance')}
          whileHover={{ scale: 1.04, boxShadow: '0 12px 32px rgba(234,37,35,0.18)' }}
          whileTap={{ scale: 0.96 }}
          className="flex flex-col items-center gap-3 p-6 bg-white border-2 border-gray-200 rounded-2xl hover:border-[#EA2523] transition-all group"
        >
          <img src="/icons/home-refinance.png" alt="Home Refinance" className="w-16 h-16 object-contain" />
          <div>
            <p className="text-base font-black text-gray-900 group-hover:text-[#EA2523] transition-colors whitespace-nowrap">Home Refinance</p>
            <p className="text-sm mt-0.5" style={{ color: '#757575' }}>Lower your rate</p>
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
