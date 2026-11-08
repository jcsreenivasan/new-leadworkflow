import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronRight } from 'lucide-react';
import type { FunnelData } from '../../../types/funnel';

interface StepOneProps {
  data: FunnelData;
  onChange: (updates: Partial<FunnelData>) => void;
  onNext: () => void;
}

function QLabel({ n }: { n: number }) {
  return (
    <span className="text-[10px] font-black tracking-widest shrink-0" style={{ color: '#757575' }}>
      Q{n}
    </span>
  );
}

const PROPERTY_TYPES: { value: FunnelData['propertyType']; label: string; img: string; large?: boolean }[] = [
  { value: 'single-family', label: 'Single Family', img: '/icons/single-family.png', large: true  },
  { value: 'townhome',      label: 'Townhome',      img: '/icons/townhome.png'                    },
  { value: 'condo',         label: 'Condo',         img: '/icons/condo.png'                       },
  { value: 'multi-unit',    label: 'Multi-Unit',    img: '/icons/multi-unit.png',    large: true  },
];

const TIMELINES: { value: FunnelData['decisionTimeline']; label: string; sub: string }[] = [
  { value: 'considering-now',  label: 'Considering Now',  sub: 'Ready to move forward' },
  { value: '30-days',          label: 'Within 30 Days',   sub: 'Looking soon'           },
  { value: '2-4-months',       label: 'In 2–4 Months',    sub: 'Still planning'         },
  { value: 'just-researching', label: 'Just Researching', sub: 'Exploring options'      },
];

const RESIDENCY_TYPES: { value: FunnelData['residencyType']; label: string; img: string }[] = [
  { value: 'primary',     label: 'Primary Home',       img: '/icons/primary-home.png' },
  { value: 'second-home', label: 'Second Home',        img: '/icons/second-home.png'  },
  { value: 'rental',      label: 'Rental / Investment', img: '/icons/rental.png'      },
];

export function StepOne({ data, onChange, onNext }: StepOneProps) {
  const { propertyType, decisionTimeline, residencyType } = data;
  const canContinue = propertyType !== null && decisionTimeline !== null && residencyType !== null;

  return (
    <div className="px-5 py-5">

      {/* Q1: Property type */}
      <div className="pb-6">
        <div className="flex items-baseline gap-2 mb-3">
          <QLabel n={1} />
          <h2 className="text-base font-black text-gray-900">What type of property is it?</h2>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {PROPERTY_TYPES.map(pt => {
            const selected = propertyType === pt.value;
            return (
              <motion.button
                key={pt.value}
                onClick={() => onChange({ propertyType: pt.value })}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className={`relative flex flex-col items-center gap-2 px-4 py-4 rounded-xl border-2 transition-all ${
                  selected
                    ? 'border-[#EA2523] bg-[#EA2523]/5'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                {selected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2 right-2 w-4 h-4 bg-[#EA2523] rounded-full flex items-center justify-center"
                  >
                    <Check size={9} className="text-white" strokeWidth={3} />
                  </motion.div>
                )}
                <img
                  src={pt.img}
                  alt={pt.label}
                  className={`object-contain ${pt.large ? 'w-[58px] h-[58px]' : 'w-12 h-12'}`}
                />
                <p className="text-sm font-bold text-gray-900 text-center">{pt.label}</p>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Q2: Decision timeline */}
      <div className="border-t-2 border-gray-100 pt-6 pb-6">
        <div className="flex items-baseline gap-2 mb-3">
          <QLabel n={2} />
          <h2 className="text-base font-black text-gray-900">When are you looking to purchase?</h2>
        </div>
        <div className="flex flex-col gap-2">
          {TIMELINES.map(t => {
            const selected = decisionTimeline === t.value;
            return (
              <motion.button
                key={t.value}
                onClick={() => onChange({ decisionTimeline: t.value })}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className={`relative flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all ${
                  selected
                    ? 'border-[#EA2523] bg-[#EA2523]/5'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="text-left">
                  <p className="text-base font-bold text-gray-900">{t.label}</p>
                  <p className="text-sm text-gray-500 mt-0.5">{t.sub}</p>
                </div>
                {selected ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-5 h-5 bg-[#EA2523] rounded-full flex items-center justify-center flex-shrink-0"
                  >
                    <Check size={10} className="text-white" strokeWidth={3} />
                  </motion.div>
                ) : (
                  <ChevronRight size={16} className="text-gray-400 flex-shrink-0" />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Q3: Residency type */}
      <div className="border-t-2 border-gray-100 pt-6 pb-3">
        <div className="flex items-baseline gap-2 mb-3">
          <QLabel n={3} />
          <h2 className="text-base font-black text-gray-900">How will you use this property?</h2>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {RESIDENCY_TYPES.map(rt => {
            const selected = residencyType === rt.value;
            return (
              <motion.button
                key={rt.value}
                onClick={() => onChange({ residencyType: rt.value })}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className={`relative flex flex-col items-center gap-2 px-2 py-4 rounded-xl border-2 transition-all ${
                  selected
                    ? 'border-[#EA2523] bg-[#EA2523]/5'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                {selected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-1.5 right-1.5 w-3.5 h-3.5 bg-[#EA2523] rounded-full flex items-center justify-center"
                  >
                    <Check size={8} className="text-white" strokeWidth={3} />
                  </motion.div>
                )}
                <img src={rt.img} alt={rt.label} className="w-[62px] h-[62px] object-contain" />
                <p className="text-[13px] font-bold text-gray-900 text-center leading-tight">{rt.label}</p>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Continue */}
      <AnimatePresence>
        {canContinue && (
          <motion.div key="continue" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-5">
            <motion.button
              onClick={onNext}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 bg-[#EA2523] text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2"
            >
              Continue
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
