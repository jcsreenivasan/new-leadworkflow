import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import type { FunnelData } from '../../../types/funnel';

interface StepTwoProps {
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
  label, value, min, max, step, onChange: onChangeProp, fmtLeft, fmtRight, badge,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  fmtLeft: string;
  fmtRight: string;
  badge?: string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="bg-white border border-gray-200 rounded-xl px-4 py-3">
      <div className="flex items-baseline justify-between mb-3">
        <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: '#757575' }}>{label}</span>
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-black text-[#1E3569]">{fmtCurrency(value)}</span>
          {badge && (
            <span className="text-xs font-bold text-[#EA2523] bg-[#EA2523]/10 px-2 py-0.5 rounded-full">{badge}</span>
          )}
        </div>
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

const US_STATES = [
  'Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware',
  'Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky',
  'Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi',
  'Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico',
  'New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania',
  'Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont',
  'Virginia','Washington','West Virginia','Wisconsin','Wyoming',
];

export function StepTwo({ data, onChange, onNext }: StepTwoProps) {
  const { zipCode, state, propertyValue, downPayment } = data;
  const [locating, setLocating] = useState(false);
  const [locError, setLocError] = useState('');

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) { setLocError('Geolocation not supported.'); return; }
    setLocating(true);
    setLocError('');
    navigator.geolocation.getCurrentPosition(
      async pos => {
        try {
          const res = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${pos.coords.latitude}&longitude=${pos.coords.longitude}&localityLanguage=en`
          );
          const json = await res.json() as { postcode?: string; principalSubdivision?: string };
          const updates: Partial<FunnelData> = {};
          if (json.postcode) updates.zipCode = json.postcode.slice(0, 5);
          if (json.principalSubdivision) updates.state = json.principalSubdivision;
          if (Object.keys(updates).length) onChange(updates);
          else setLocError('Could not determine location. Please type it manually.');
        } catch { setLocError('Could not determine location. Please type it manually.'); }
        finally { setLocating(false); }
      },
      () => { setLocating(false); setLocError('Location denied. Please type your ZIP manually.'); }
    );
  };

  const maxDown = Math.min(400000, propertyValue);
  const downPct = propertyValue > 0 ? Math.round((downPayment / propertyValue) * 100) : 0;

  const canContinue = zipCode.length === 5;

  return (
    <div className="px-5 py-5">

      {/* Q1: State & ZIP */}
      <div className="pb-6">
        <div className="flex items-baseline gap-2 mb-3">
          <QLabel n={1} />
          <h2 className="text-base font-black text-gray-900">Where is the property located?</h2>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <input
              type="text"
              inputMode="numeric"
              maxLength={5}
              placeholder="ZIP code (e.g. 77001)"
              value={zipCode}
              onChange={e => onChange({ zipCode: e.target.value.replace(/\D/g, '').slice(0, 5) })}
              className="flex-1 px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#233B86] transition-all"
            />
            <motion.button
              onClick={handleUseMyLocation}
              disabled={locating}
              whileHover={!locating ? { scale: 1.02 } : {}}
              whileTap={!locating ? { scale: 0.97 } : {}}
              className="flex items-center gap-1.5 px-3 py-2.5 bg-[#EEF1FB] text-[#233B86] font-semibold text-xs rounded-xl hover:bg-[#dce2f5] transition-colors disabled:opacity-60 whitespace-nowrap"
            >
              <MapPin size={13} />
              {locating ? 'Locating…' : 'Use my location'}
            </motion.button>
          </div>
          <select
            value={state}
            onChange={e => onChange({ state: e.target.value })}
            className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm font-medium text-gray-800 focus:outline-none focus:border-[#233B86] transition-all bg-white"
          >
            <option value="">Select state</option>
            {US_STATES.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        {locError && <p className="text-xs text-red-500 mt-1.5">{locError}</p>}
      </div>

      {/* Q2: Property value */}
      <div className="border-t-2 border-gray-100 pt-6 pb-6">
        <div className="flex items-baseline gap-2 mb-3">
          <QLabel n={2} />
          <h2 className="text-base font-black text-gray-900">What is the estimated property value?</h2>
        </div>
        <PriceSlider
          label="Property Value"
          value={propertyValue}
          min={100000}
          max={2000000}
          step={10000}
          onChange={v => {
            const newDown = Math.min(downPayment, Math.min(400000, v));
            onChange({ propertyValue: v, downPayment: newDown });
          }}
          fmtLeft="$100K"
          fmtRight="$2M"
        />
      </div>

      {/* Q3: Down payment */}
      <div className="border-t-2 border-gray-100 pt-6 pb-3">
        <div className="flex items-baseline gap-2 mb-3">
          <QLabel n={3} />
          <h2 className="text-base font-black text-gray-900">How much will you put down?</h2>
        </div>
        <PriceSlider
          label="Down Payment"
          value={downPayment}
          min={0}
          max={maxDown}
          step={5000}
          onChange={v => onChange({ downPayment: v })}
          fmtLeft="$0"
          fmtRight={fmtCurrency(maxDown)}
          badge={`${downPct}%`}
        />
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
