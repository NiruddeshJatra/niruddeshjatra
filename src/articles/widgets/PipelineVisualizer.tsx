import { useState } from 'react';
import type { CSSProperties } from 'react';
import { useLang } from '../context/LanguageContext';
import { Instrument } from '../primitives/Instrument';
import { Caption } from '../primitives/Caption';
import { SegmentedToggle } from '../primitives/SegmentedToggle';

type Mode = 'single' | 'pipe';

const TICKS = 9;
const STAGES = ['F', 'D', 'E'];
const INSTRUCTIONS = [0, 1, 2];

const cellStyle = (state: 'active' | 'done' | 'empty'): CSSProperties => {
  const base: CSSProperties = {
    fontFamily: "'Departure Mono',monospace",
    fontSize: 11,
    width: 34,
    height: 26,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  };
  if (state === 'active') {
    return { ...base, border: '1px solid #00d26a', background: '#16402a', color: '#00d26a', textShadow: '0 0 8px rgba(0,210,106,0.5)' };
  }
  if (state === 'done') {
    return { ...base, border: '1px solid #3a5847', background: '#1b231b', color: '#6c8873' };
  }
  return { ...base, border: '1px dashed #2e392e', color: '#2e392e' };
};

const btnBase: CSSProperties = {
  fontFamily: "'Departure Mono',monospace",
  fontSize: 12,
  background: 'none',
  border: '1px solid #3a5847',
  color: '#00d26a',
  padding: '7px 14px',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
};

export function PipelineVisualizer() {
  const { bn, num } = useLang();
  const [mode, setMode] = useState<Mode>('pipe');
  const [tick, setTick] = useState(0);

  const pipe = mode === 'pipe';
  // Pipelined: each instruction starts one tick after the previous.
  // Single-cycle: the next instruction waits for the previous to fully finish.
  const startOf = (i: number) => (pipe ? i : i * STAGES.length);
  const finishTick = pipe ? 5 : 9;

  const setModeReset = (m: Mode) => { setMode(m); setTick(0); };

  const doneCount = INSTRUCTIONS.filter(i => tick >= startOf(i) + STAGES.length).length;

  let narr: string;
  if (tick === 0) {
    narr = bn ? 'tick চেপে clock চালান।' : 'Press tick to drive the clock.';
  } else if (tick >= finishTick) {
    narr = pipe
      ? bn
        ? `৩টা instruction শেষ মাত্র ${num(5)} tick-এ — প্রতিটা stage প্রতি tick-এই ব্যস্ত।`
        : 'All 3 instructions done in just 5 ticks — every stage stays busy on every tick.'
      : bn
        ? `৩টা instruction শেষ করতে ${num(9)} tick লাগল — বেশিরভাগ hardware বসে ছিল।`
        : 'It took 9 ticks to finish 3 instructions — most of the hardware sat idle.';
  } else {
    narr = bn
      ? `tick ${num(tick)} — শেষ: ${num(doneCount)}/৩`
      : `tick ${tick} — completed: ${doneCount}/3`;
  }

  return (
    <>
      <Instrument
        bnTitle="যন্ত্র ০৪ — THE PIPELINE"
        enTitle="INSTRUMENT 04 — THE PIPELINE"
        control={
          <SegmentedToggle<Mode>
            value={mode}
            onChange={setModeReset}
            options={[
              { value: 'single', label: bn ? 'একটা করে' : 'one at a time' },
              { value: 'pipe', label: 'pipelined' },
            ]}
          />
        }
      >
        <div style={{ padding: '18px 16px 6px', overflowX: 'auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5, minWidth: 460 }}>
            {/* Tick header */}
            <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
              <span style={{ width: 54, flex: 'none' }} />
              {Array.from({ length: TICKS }, (_, t) => (
                <span
                  key={t}
                  style={{
                    fontFamily: "'Departure Mono',monospace",
                    fontSize: 9,
                    width: 34,
                    textAlign: 'center',
                    color: t === tick - 1 ? '#00d26a' : '#55695a',
                  }}
                >
                  t{num(t + 1)}
                </span>
              ))}
            </div>

            {/* One row per instruction */}
            {INSTRUCTIONS.map(i => {
              const start = startOf(i);
              return (
                <div key={i} style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                  <span style={{ fontFamily: "'Departure Mono',monospace", fontSize: 10.5, color: '#8aa893', width: 54, flex: 'none', whiteSpace: 'nowrap' }}>
                    instr {num(i + 1)}
                  </span>
                  {Array.from({ length: TICKS }, (_, t) => {
                    const k = t - start;
                    if (k < 0 || k >= STAGES.length) {
                      return <span key={t} style={cellStyle('empty')} />;
                    }
                    const state = t < tick - 1 ? 'done' : t === tick - 1 ? 'active' : 'empty';
                    return (
                      <span key={t} style={cellStyle(state)}>
                        {state === 'empty' ? '·' : STAGES[k]}
                      </span>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', borderTop: '1px solid #2e392e', flexWrap: 'wrap', marginTop: 10 }}>
          <button onClick={() => setTick(t => Math.min(t + 1, TICKS))} className="well-focus" style={btnBase}>
            tick ▶
          </button>
          <button onClick={() => setTick(0)} className="well-focus" style={{ ...btnBase, color: '#6c8873' }}>
            ↺ reset
          </button>
          <span style={{ fontFamily: "'Departure Mono',monospace", fontSize: 11.5, color: '#8aa893', flex: 1, minWidth: 180 }}>
            {narr}
          </span>
        </div>
      </Instrument>
      <Caption
        bn="অ্যাসেম্বলি লাইন: একটা করে চালালে এক instruction শেষ না হওয়া পর্যন্ত পরেরটা শুরু হয় না; pipelined-এ একই cycle-এ একজন execute, একজন decode, একজন fetch হচ্ছে।"
        en="The assembly line: one at a time, the next instruction waits for the previous to finish; pipelined, the same cycle has one instruction executing, one decoding, one fetching."
      />
    </>
  );
}
