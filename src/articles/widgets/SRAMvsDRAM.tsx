import { useEffect, useState } from 'react';
import { useLang } from '../context/LanguageContext';
import { Instrument } from '../primitives/Instrument';
import { Caption } from '../primitives/Caption';
import { SegmentedToggle } from '../primitives/SegmentedToggle';
import { useReducedMotion } from '../hooks/useReducedMotion';

type Mode = 'sram' | 'dram';

export function SRAMvsDRAM() {
  const { bn } = useLang();
  const reduced = useReducedMotion();
  const [mode, setMode] = useState<Mode>('dram');
  const [charge, setCharge] = useState(100);
  const [refreshes, setRefreshes] = useState(0);

  useEffect(() => {
    if (mode !== 'dram' || reduced) { setCharge(100); return; }
    setCharge(100);
    setRefreshes(0);
    const iv = setInterval(() => {
      setCharge((c) => {
        const next = c - 4;
        if (next <= 0) { setRefreshes((r) => r + 1); return 100; }
        return next;
      });
    }, 90);
    return () => clearInterval(iv);
  }, [mode, reduced]);

  const control = (
    <SegmentedToggle
      value={mode}
      onChange={setMode}
      options={[
        { value: 'sram', label: 'SRAM' },
        { value: 'dram', label: 'DRAM' },
      ]}
    />
  );

  return (
    <>
      <Instrument bnTitle="SRAM vs DRAM" enTitle="SRAM vs DRAM" control={control}>
        <div className="flex flex-col items-center gap-[14px] py-[22px] px-4">
          <div className="font-mono text-[11.5px]" style={{ color: '#6c8873' }}>
            {mode === 'sram'
              ? (bn ? 'transistor দিয়ে বানানো bistable cell — power থাকলে refresh ছাড়াই state ধরে রাখে' : 'a transistor-based bistable cell — holds its state without refreshing while powered')
              : (bn ? 'transistor + capacitor cell — জমা charge leak করে, তাই নিয়মিত refresh লাগে' : 'a transistor-and-capacitor cell — the stored charge leaks, so it must be refreshed periodically')}
          </div>
          <div style={{ width: 220, height: 28, border: '1px solid #3a5847', background: '#1b231b', position: 'relative' }}>
            <div
              style={{
                height: '100%', width: `${charge}%`,
                background: mode === 'sram' ? '#00d26a' : charge < 25 ? '#ff6b6b' : '#00d26a',
                transition: mode === 'sram' ? 'none' : 'width 90ms linear, background 200ms',
              }}
            />
          </div>
          <div className="font-mono text-[12px]" style={{ color: '#8aa893' }}>
            {mode === 'sram'
              ? (bn ? 'charge: স্থির ১০০%' : 'charge: steady 100%')
              : (bn ? `charge: ${Math.round(charge)}% · refresh হয়েছে ${refreshes} বার` : `charge: ${Math.round(charge)}% · refreshed ${refreshes}×`)}
          </div>
          <div className="flex gap-6 font-mono text-[11.5px]" style={{ color: '#6c8873' }}>
            <span>{bn ? 'প্রতি bit-এ' : 'per bit'}: <span style={{ color: '#00d26a' }}>{mode === 'sram' ? (bn ? 'জায়গা বেশি' : 'larger footprint') : (bn ? 'জায়গা কম' : 'smaller footprint')}</span></span>
            <span>{bn ? 'ব্যবহার' : 'used for'}: <span style={{ color: '#00d26a' }}>{mode === 'sram' ? (bn ? 'CPU cache' : 'CPU cache') : (bn ? 'Main RAM' : 'Main RAM')}</span></span>
          </div>
        </div>
      </Instrument>
      <Caption
        bn="SRAM-এর cell নিজে থেকেই state ধরে রাখে — দ্রুত, কিন্তু প্রতি bit-এ জায়গা বেশি লাগে। DRAM-এর capacitor leak করে, তাই refresh লাগে — dense আর সস্তা, কিন্তু latency বেশি।"
        en="An SRAM cell holds its own state — fast, but each bit takes more area. A DRAM capacitor leaks, so it has to be refreshed — dense and cheap per bit, but higher latency."
      />
    </>
  );
}
