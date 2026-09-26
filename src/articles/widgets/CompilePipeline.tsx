import { useEffect, useState } from 'react';
import { useLang } from '../context/LanguageContext';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { Instrument } from '../primitives/Instrument';
import { Caption } from '../primitives/Caption';

const STAGES = [
  { bn: 'Node startup — V8 engine load হয়', en: 'Node starts up — the V8 engine loads', badge: 'BOOT' },
  { bn: 'V8 code পড়ে, syntax parse করে, AST বানায়', en: 'V8 reads your code, parses the syntax, builds an AST', badge: 'PARSE' },
  { bn: 'AST থেকে V8 bytecode তৈরি করে', en: 'From the AST, V8 generates bytecode', badge: 'BC' },
  { bn: 'V8 bytecode interpret করে execute করে (interpreter mode)', en: 'V8 interprets and executes that bytecode (interpreter mode)', badge: 'INT' },
  { bn: 'square() যথেষ্ট বার চলার পর V8 তাকে "hot" হিসেবে চিহ্নিত করতে পারে', en: 'after square() has run enough times, V8 can mark it "hot"', badge: 'HOT' },
  { bn: 'JIT square()-কে optimized machine code-এ compile করে', en: 'JIT compiles square() into optimized machine code', badge: 'JIT' },
  { bn: 'পরের call-গুলো interpret না — সরাসরি compiled native চলে', en: "subsequent calls aren't interpreted — the compiled native runs directly", badge: 'NAT' },
  { bn: "loop-এর body-ও একইভাবে JIT-compile হয়", en: 'the loop body gets JIT-compiled the same way', badge: 'JIT' },
  { bn: 'Result — hot অংশগুলো compiled native হিসেবে চলে', en: 'Result — the hot parts run as compiled native code', badge: 'DONE' },
];

/** Index of the final stage — derived so adding a STAGES entry needs no other edit. */
const LAST = STAGES.length - 1;

const FUNNEL = [
  { label: 'source', reach: 0 },
  { label: 'AST', reach: 1 },
  { label: 'bytecode', reach: 2 },
  { label: 'interpret', reach: 3 },
  { label: 'native', reach: 5 },
];

function badgeColOf(b: string) {
  if (b === 'NAT' || b === 'DONE') return '#00d26a';
  if (b === 'HOT' || b === 'JIT' || b === 'INT') return '#e0c264';
  return '#8aa893';
}

export function CompilePipeline() {
  const { bn, num } = useLang();
  const [step, setStep] = useState(0);
  const [running, setRunning] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!running) return;
    const iv = setInterval(() => {
      setStep((k) => {
        if (k + 1 >= LAST) { setRunning(false); return LAST; }
        return k + 1;
      });
    }, reduced ? 140 : 640);
    return () => clearInterval(iv);
  }, [running, reduced]);

  const tier = step <= 0 ? 'boot' : step <= 2 ? 'parse/compile' : step === 3 ? 'interpreter' : step <= 5 ? 'JIT' : 'native';
  const tierCol = step >= 6 ? '#00d26a' : step >= 4 ? '#e0c264' : '#8aa893';

  const btn = (accent: boolean): React.CSSProperties => ({
    fontFamily: "'Departure Mono',monospace", fontSize: 12, background: 'none',
    border: '1px solid #3a5847', color: accent ? '#00d26a' : '#6c8873',
    padding: '7px 14px', cursor: 'pointer', whiteSpace: 'nowrap',
  });

  return (
    <>
      <Instrument
        bnTitle="যন্ত্র ০৪ — THE PIPELINE (node hello.js)"
        enTitle="INSTRUMENT 04 — THE PIPELINE (node hello.js)"
        control={
          <span style={{ fontFamily: "'Departure Mono',monospace", fontSize: 10.5, color: tierCol, whiteSpace: 'nowrap' }}>tier: {tier}</span>
        }
      >
        <div style={{ padding: 16, display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <div style={{ flex: 2, minWidth: 230, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {STAGES.map((s, i) => {
              const active = i === step, done = i < step;
              const bc = active ? badgeColOf(s.badge) : done ? '#4a5a4e' : '#3a4a3e';
              return (
                <div
                  key={`${s.badge}-${i}`}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8, padding: '5px 8px',
                    borderLeft: `2px solid ${active ? '#00d26a' : done ? '#2e392e' : 'transparent'}`,
                    background: active ? 'rgba(0,210,106,0.08)' : 'none',
                  }}
                >
                  <span style={{ fontFamily: "'Departure Mono',monospace", fontSize: 9, minWidth: 34, color: bc, border: `1px solid ${bc}`, textAlign: 'center', padding: '1px 0' }}>{s.badge}</span>
                  <span style={{ fontFamily: "'Anek Bangla','Anek Latin',sans-serif", fontSize: 12.5, color: active ? '#cfe8d8' : done ? '#8aa893' : '#55695a' }}>{bn ? s.bn : s.en}</span>
                </div>
              );
            })}
          </div>
          <div style={{ flex: 1, minWidth: 130, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <div style={{ fontFamily: "'Departure Mono',monospace", fontSize: 9, color: '#6c8873', letterSpacing: '0.08em' }}>PIPELINE</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3, width: '100%' }}>
              {FUNNEL.map((f) => {
                const on = step >= f.reach;
                const lit = f.label === 'native' && step >= 5;
                return (
                  <div
                    key={f.label}
                    style={{
                      fontFamily: "'Departure Mono',monospace", fontSize: 10, textAlign: 'center', padding: '4px 6px',
                      border: `1px solid ${on ? (lit ? '#00d26a' : '#3a5847') : '#2e392e'}`,
                      background: on ? (lit ? '#16402a' : '#1b231b') : 'transparent',
                      color: on ? (lit ? '#00d26a' : '#8aa893') : '#55695a',
                    }}
                  >
                    {f.label}
                  </div>
                );
              })}
            </div>
            <div style={{ fontFamily: "'Departure Mono',monospace", fontSize: 10, color: '#8aa893', textAlign: 'center', lineHeight: 1.6, marginTop: 2 }}>
              {step >= 3 ? 'output: 0 1 4 9 …' : (bn ? '(এখনো output নেই)' : '(no output yet)')}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', borderTop: '1px solid #2e392e', flexWrap: 'wrap' }}>
          <button onClick={() => setStep((k) => Math.min(LAST, k + 1))} style={btn(true)}>step ▶</button>
          <button onClick={() => { if (running) setRunning(false); else if (step < LAST) setRunning(true); }} style={btn(true)}>
            {running ? '⏸ pause' : 'run ▶▶'}
          </button>
          <button onClick={() => { setRunning(false); setStep(0); }} style={btn(false)}>↺ reset</button>
          <span style={{ fontFamily: "'Departure Mono',monospace", fontSize: 11.5, color: '#8aa893', flex: 1, minWidth: 160 }}>
            {bn ? `ধাপ ${num(step + 1)}/${num(STAGES.length)}` : `step ${step + 1}/${STAGES.length}`} · source → AST → bytecode → interpret → JIT → native
          </span>
        </div>
      </Instrument>
      <Caption
        bn="V8 আপনার code parse করে, AST বানায়, bytecode-এ নামায়, interpret শুরু করে, তারপর hot অংশের জন্য machine code তৈরি করতে পারে। পুরোটা invisible — আর এটা একটা simplified model; আসল V8-এ একাধিক compilation tier আছে।"
        en="V8 parses your code, builds an AST, lowers it to bytecode, starts interpreting, and can then produce machine code for the hot parts. All invisible — and a simplified model: real V8 has several compilation tiers."
      />
    </>
  );
}
