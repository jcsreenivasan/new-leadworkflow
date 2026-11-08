import { AnimatePresence, motion } from 'framer-motion';
import { Check } from 'lucide-react';
import type { FunnelData } from '../../../types/funnel';

interface StepThreeProps {
  data: FunnelData;
  onChange: (updates: Partial<FunnelData>) => void;
  onNext: () => void;
}

function fmtCurrency(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
}

function QLabel({ n }: { n: number }) {
  return (
    <span className="text-[10px] font-black tracking-widest shrink-0" style={{ color: '#757575' }}>
      Q{n}
    </span>
  );
}

function PriceSlider({
  label, value, min, max, step, onChange: onChangeProp, fmtLeft, fmtRight,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  fmtLeft: string;
  fmtRight: string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="bg-white border border-gray-200 rounded-xl px-4 py-3">
      <div className="flex items-baseline justify-between mb-3">
        <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: '#757575' }}>{label}</span>
        <span className="text-xl font-black text-[#1E3569]">{fmtCurrency(value)}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChangeProp(Number(e.target.value))}
        className="slider-input w-full"
        style={{ background: `linear-gradient(to right, #1E3569 ${pct}%, #E5E7EB ${pct}%)` }}
      />
      <div className="flex justify-between mt-2">
        <span className="text-xs" style={{ color: '#757575' }}>{fmtLeft}</span>
        <span className="text-xs" style={{ color: '#757575' }}>{fmtRight}</span>
      </div>
    </div>
  );
}

const CREDIT_BANDS = [
  { label: 'Poor',      range: '500–619', min: 500, max: 619, color: '#DC2626' },
  { label: 'Fair',      range: '620–679', min: 620, max: 679, color: '#EA580C' },
  { label: 'Good',      range: '680–719', min: 680, max: 719, color: '#CA8A04' },
  { label: 'Excellent', range: '720–800', min: 720, max: 800, color: '#16A34A' },
];

const CREDIT_BAND_MESSAGES: Record<string, string> = {
  Poor:      'Some options may still be available.',
  Fair:      'You may qualify. A few points more helps.',
  Good:      "You're in a solid range for competitive rates.",
  Excellent: 'You qualify for our best mortgage rates!',
};

function getActiveBand(score: number) {
  return CREDIT_BANDS.find(b => score >= b.min && score <= b.max) ?? CREDIT_BANDS[2];
}

export function StepThree({ data, onChange, onNext }: StepThreeProps) {
  const { annualIncome, creditScore, militaryService } = data;
  const active = getActiveBand(creditScore);
  const CREDIT_MIN = 500, CREDIT_MAX = 800;
  const creditPct = ((creditScore - CREDIT_MIN) / (CREDIT_MAX - CREDIT_MIN)) * 100;

  const canContinue = militaryService !== null;

  return (
    <div className="px-5 py-5">

      {/* Q1: Annual income */}
      <div className="pb-6">
        <div className="flex items-baseline gap-2 mb-3">
          <QLabel n={1} />
          <h2 className="text-base font-black text-gray-900">What is the gross annual income of the borrower(s)?</h2>
        </div>
        <PriceSlider
          label="Annual Income"
          value={annualIncome}
          min={30000}
          max={400000}
          step={5000}
          onChange={v => onChange({ annualIncome: v })}
          fmtLeft="$30K"
          fmtRight="$400K+"
        />
      </div>

      {/* Q2: Credit score */}
      <div className="border-t-2 border-gray-100 pt-6 pb-6">
        <div className="flex items-baseline gap-2 mb-4">
          <QLabel n={2} />
          <h2 className="text-base font-black text-gray-900">What's your estimated credit score?</h2>
        </div>

        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest mb-1" style={{ color: '#757575' }}>Your Score</p>
            <p className="text-5xl font-black leading-none" style={{ color: active.color }}>
              {creditScore >= CREDIT_MAX ? '800+' : creditScore}
            </p>
          </div>
          <div className="text-right mt-1">
            <p className="text-xl font-bold" style={{ color: active.color }}>{active.label}</p>
            <p className="text-sm mt-1 leading-relaxed max-w-[180px] text-gray-900">{CREDIT_BAND_MESSAGES[active.label]}</p>
          </div>
        </div>

        <input
          type="range" min={CREDIT_MIN} max={CREDIT_MAX} step={1} value={creditScore}
          onChange={e => onChange({ creditScore: Number(e.target.value) })}
          className="slider-input w-full"
          style={{ background: `linear-gradient(to right, ${active.color} ${creditPct}%, #E5E7EB ${creditPct}%)` }}
        />
        <div className="flex justify-between mt-2 mb-5">
          <span className="text-xs" style={{ color: '#757575' }}>500</span>
          <span className="text-xs" style={{ color: '#757575' }}>800+</span>
        </div>

        <div className="grid grid-cols-4 gap-1.5">
          {CREDIT_BANDS.map(band => {
            const isActive = creditScore >= band.min && creditScore <= band.max;
            return (
              <div
                key={band.label}
                className={`rounded-xl px-2 py-2 text-center border-2 transition-all ${isActive ? '' : 'border-transparent bg-gray-50'}`}
                style={isActive ? { borderColor: band.color + '50', backgroundColor: band.color + '15' } : {}}
              >
                <p className="text-xs font-bold" style={{ color: band.color }}>{band.label}</p>
                <p className="text-[10px] mt-0.5" style={{ color: '#757575' }}>{band.range}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Q3: Military service */}
      <div className="border-t-2 border-gray-100 pt-6 pb-3">
        <div className="flex items-baseline gap-2 mb-3">
          <QLabel n={3} />
          <h2 className="text-base font-black text-gray-900">Are you a U.S. military veteran or active duty?</h2>
        </div>
        <p className="text-xs text-gray-500 mb-3">VA loans may offer better rates with no down payment required.</p>
        <div className="grid grid-cols-2 gap-2">
          {(['yes', 'no'] as const).map(val => {
            const selected = militaryService === val;
            return (
              <motion.button
                key={val}
                onClick={() => onChange({ militaryService: val })}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className={`relative flex items-center justify-center py-3 rounded-xl border-2 transition-all ${
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
                <p className="text-sm font-bold text-gray-900 capitalize">{val === 'yes' ? 'Yes' : 'No'}</p>
              </motion.button>
            );
          })}
        </div>
      </div>

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
