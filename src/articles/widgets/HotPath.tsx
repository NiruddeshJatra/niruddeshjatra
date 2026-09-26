import { useEffect, useState } from 'react';
import { useLang } from '../context/LanguageContext';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { Instrument } from '../primitives/Instrument';
import { Caption } from '../primitives/Caption';

/** Calls before the JIT declares square() "hot" and compiles it to native. */
const THRESH = 8;
/** Where the demo stops counting — the call-count meter is full at this value. */
const CAP = 20;

export function HotPath() {
  const { bn, num } = useLang();
  const [count, setCount] = useState(0);
  const [running, setRunning] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!running) return;
    const iv = setInterval(() => {
      setCount((c) => {
        if (c + 1 >= CAP) { setRunning(false); return CAP; }
        return c + 1;
      });
    }, reduced ? 140 : 560);
    return () => clearInterval(iv);
  }, [running, reduced]);

  const hot = count >= THRESH;
  const justHot = count === THRESH;
  const modeCol = hot && !justHot ? '#00d26a' : '#e0c264';
  const modeLabel = justHot ? 'MODE: COMPILING' : hot ? 'MODE: NATIVE' : 'MODE: INTERPRETING';
  const barPct = Math.min(100, (count / CAP) * 100);
  const speedPct = hot ? 96 : Math.max(8, Math.min(30, count * 3));

  let narr: string;
  if (count === 0) narr = bn ? 'loop চালান — square(i) বারবার call হবে।' : 'run the loop — square(i) gets called over and over.';
  else if (justHot) narr = bn ? '⚡ square() এখন hot! JIT একে native machine code-এ compile করছে।' : '⚡ square() just went hot! The JIT is compiling it to native machine code.';
  else if (!hot) narr = bn ? `call #${num(count)} — এখনো interpreter mode-এ, প্রতিবার bytecode পড়ে (ধীর)।` : `call #${count} — still in interpreter mode, reading bytecode each time (slow).`;
  else narr = bn ? `call #${num(count)} — square() এখন native, interpret ছাড়াই সরাসরি চলছে (দ্রুত)।` : `call #${count} — square() runs native now, straight through without interpreting (fast).`;

  const step = () => setCount((c) => Math.min(CAP, c + 1));
  const btn = (accent: boolean): React.CSSProperties => ({
    fontFamily: "'Departure Mono',monospace", fontSize: 12, background: 'none',
    border: '1px solid #3a5847', color: accent ? '#00d26a' : '#6c8873',
    padding: '7px 14px', cursor: 'pointer', whiteSpace: 'nowrap',
  });
  const meterLabel = (t: string) => (
    <div style={{ fontFamily: "'Departure Mono',monospace", fontSize: 9, color: '#6c8873', letterSpacing: '0.06em', marginBottom: 4 }}>{t}</div>
  );

  return (
    <>
      <Instrument
        bnTitle="যন্ত্র ০৩ — THE HOT PATH"
        enTitle="INSTRUMENT 03 — THE HOT PATH"
        control={
          <span style={{ fontFamily: "'Departure Mono',monospace", fontSize: 11, color: modeCol, border: `1px solid ${modeCol}`, padding: '3px 8px', whiteSpace: 'nowrap' }}>{modeLabel}</span>
        }
      >
        <div style={{ padding: 16, display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'stretch' }}>
          <div style={{ flex: 1, minWidth: 180, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ fontFamily: "'Departure Mono',monospace", fontSize: 10.5, color: '#8aa893', lineHeight: 1.6 }}>
              square() calls: <span style={{ color: modeCol, fontSize: 14 }}>{num(count)}</span>
            </div>
            <div>
              {meterLabel(`CALL COUNT · hot at ${num(THRESH)}`)}
              <div style={{ position: 'relative', height: 16, background: '#1b231b', border: '1px solid #2e392e' }}>
                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${barPct}%`, background: hot ? '#00d26a' : '#e0c264', transition: 'width 0.3s' }} />
                <div style={{ position: 'absolute', top: -2, bottom: -2, left: `${(THRESH / CAP) * 100}%`, width: 1, background: '#ff6b6b' }} />
              </div>
            </div>
            <div>
              {meterLabel('SPEED / call')}
              <div style={{ position: 'relative', height: 12, background: '#1b231b', border: '1px solid #2e392e' }}>
                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${speedPct}%`, background: hot ? '#00d26a' : '#8a7a3a', transition: 'width 0.4s' }} />
              </div>
              <div style={{ fontFamily: "'Departure Mono',monospace", fontSize: 10, color: '#8aa893', marginTop: 4 }}>
                {hot ? (bn ? 'compiled native' : 'compiled native') : (bn ? 'interpreted' : 'interpreted')}
              </div>
            </div>
          </div>
          <div style={{ flex: 'none', width: 130, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <div style={{ fontFamily: "'Departure Mono',monospace", fontSize: 9, color: '#6c8873', letterSpacing: '0.06em' }}>square(x)</div>
            <div style={{ border: `1px solid ${hot ? '#00d26a' : '#3a5847'}`, background: hot ? '#16402a' : '#1b231b', padding: '12px 10px', textAlign: 'center', minWidth: 104 }}>
              <div style={{ fontFamily: "'Departure Mono',monospace", fontSize: 11, color: hot ? '#00d26a' : '#8aa893', textShadow: hot ? '0 0 10px rgba(0,210,106,0.5)' : 'none' }}>
                {justHot ? '⚙ compiling' : hot ? 'native ⚡' : 'bytecode'}
              </div>
            </div>
            <div style={{ fontFamily: "'Departure Mono',monospace", fontSize: 9.5, color: '#8aa893', textAlign: 'center', lineHeight: 1.5 }}>
              {hot && !justHot
                ? (bn ? `call #${num(THRESH)}-এ compiled` : `compiled at call #${THRESH}`)
                : (bn ? 'interpreter চালাচ্ছে' : 'interpreter is running it')}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', borderTop: '1px solid #2e392e', flexWrap: 'wrap' }}>
          <button onClick={() => { if (running) setRunning(false); else if (count < CAP) setRunning(true); }} style={btn(true)}>
            {running ? '⏸ pause' : 'run ▶▶'}
          </button>
          <button onClick={step} style={btn(true)}>step ▶</button>
          <button onClick={() => { setRunning(false); setCount(0); }} style={btn(false)}>↺ reset</button>
          <span style={{ fontFamily: "'Departure Mono',monospace", fontSize: 11.5, color: '#8aa893', flex: 1, minWidth: 170 }}>{narr}</span>
        </div>
      </Instrument>
      <Caption
        bn={'শুরুতে square() interpreter-এর মধ্য দিয়ে চলে (হলুদ)। যথেষ্ট বার চলার পর সেটা "hot" ধরা পড়ে, JIT তার জন্য machine code তৈরি করে — পরের call-গুলো সেই compiled রূপ ব্যবহার করতে পারে। এখানে threshold ৮ ধরা হয়েছে শুধু দেখানোর জন্য; আসল engine-এ সিদ্ধান্তটা অনেক বেশি কিছুর ওপর নির্ভর করে।'}
        en={'square() runs through the interpreter at first (yellow). After enough calls it is detected as "hot" and the JIT produces machine code for it — later calls can use that compiled version. The threshold of 8 here is purely illustrative; a real engine decides on far more than a call count.'}
      />
    </>
  );
}
