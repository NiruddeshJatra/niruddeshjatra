import { useState } from 'react';
import { useLang } from '../context/LanguageContext';
import { Instrument } from '../primitives/Instrument';
import { Caption } from '../primitives/Caption';
import { SegmentedToggle } from '../primitives/SegmentedToggle';

type Lens = 'text' | 'num' | 'pix';

export function CPUBlindLens() {
  const { bn, num } = useLang();
  const [lens, setLens] = useState<Lens>('text');

  const control = (
    <SegmentedToggle
      value={lens}
      onChange={setLens}
      options={[
        { value: 'text', label: bn ? 'text' : 'text' },
        { value: 'num', label: bn ? 'সংখ্যা' : 'number' },
        { value: 'pix', label: bn ? 'pixel' : 'pixel' },
      ]}
    />
  );

  const stepText = lens === 'text'
    ? (bn ? 'ASCII table lookup' : 'ASCII table lookup')
    : lens === 'num'
      ? (bn ? 'unsigned binary → decimal' : 'unsigned binary → decimal')
      : (bn ? 'color channel value' : 'color channel value');

  const outText = lens === 'text'
    ? (bn ? '"A" অক্ষর হিসেবে দেখানো হলো' : 'shown as the character "A"')
    : lens === 'num'
      ? (bn ? `সংখ্যা ${num(65)} হিসেবে দেখানো হলো` : `shown as the number ${num(65)}`)
      : (bn ? 'একটা গাঢ় নীল pixel হিসেবে দেখানো হলো' : 'shown as one dark-blue pixel');

  return (
    <>
      <Instrument bnTitle="SAME BITS, DIFFERENT LENS" enTitle="SAME BITS, DIFFERENT LENS" control={control}>
        <div className="flex flex-col items-center gap-[10px] py-[22px] px-4">
          <div
            className="font-mono text-[22px]"
            style={{ letterSpacing: '0.14em', color: '#8aa893', border: '1px solid #2e392e', background: '#1b231b', padding: '10px 18px' }}
          >
            01000001
          </div>
          <div className="font-mono text-[12px]" style={{ color: '#6c8873' }}>↓ {stepText}</div>
          {lens === 'text' && (
            <div style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 700, fontSize: 64, lineHeight: 1, color: '#00d26a', textShadow: '0 0 16px rgba(0,210,106,0.45)' }}>
              A
            </div>
          )}
          {lens === 'num' && (
            <div className="font-mono" style={{ fontSize: 56, lineHeight: 1, color: '#00d26a', textShadow: '0 0 16px rgba(0,210,106,0.45)' }}>
              {num(65)}
            </div>
          )}
          {lens === 'pix' && (
            <div style={{ width: 64, height: 64, background: 'rgb(0,0,65)', border: '1px solid #3a5847' }} />
          )}
          <div className="font-mono text-[11.5px] text-center" style={{ color: '#8aa893' }}>{outText}</div>
        </div>
      </Instrument>
      <Caption
        bn="একই আট bit, তিনটা ভিন্ন গল্প। কোন অর্থ, সেটা ঠিক করে program-এর instruction আর data-র format।"
        en="The same eight bits, three different stories. Which meaning is decided by the program's instructions and the data's format."
      />
    </>
  );
}
