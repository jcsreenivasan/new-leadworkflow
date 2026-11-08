import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import type { FunnelData } from '../../../types/funnel';

interface StepFourProps {
  data: FunnelData;
  onChange: (updates: Partial<FunnelData>) => void;
  onNext: () => void;
}

export function StepFour({ data, onChange, onNext }: StepFourProps) {
  const { workingWithLoanOfficer } = data;

  const handleSelect = (val: 'yes' | 'no') => {
    onChange({ workingWithLoanOfficer: val });
    setTimeout(onNext, 220);
  };

  return (
    <div className="px-5 py-5">
      <div className="pb-6">
        <div className="flex items-baseline gap-2 mb-5">
          <span className="text-[10px] font-black tracking-widest shrink-0" style={{ color: '#757575' }}>Q1</span>
          <h2 className="text-base font-black text-gray-900">Are You Already Working With A Loan Officer?</h2>
        </div>
        <div className="flex flex-col gap-2">
          {(['yes', 'no'] as const).map(val => {
            const selected = workingWithLoanOfficer === val;
            return (
              <motion.button
                key={val}
                onClick={() => handleSelect(val)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className={`relative flex items-center justify-between px-5 py-4 rounded-xl border-2 transition-all ${
                  selected
                    ? 'border-[#EA2523] bg-[#EA2523]/5'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <p className="text-base font-bold text-gray-900">{val === 'yes' ? 'Yes, I am' : "No, I'm not"}</p>
                {selected ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-5 h-5 bg-[#EA2523] rounded-full flex items-center justify-center flex-shrink-0"
                  >
                    <Check size={10} className="text-white" strokeWidth={3} />
                  </motion.div>
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex-shrink-0" />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
