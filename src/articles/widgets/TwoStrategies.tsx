import { useState } from 'react';
import { useLang } from '../context/LanguageContext';
import { Instrument } from '../primitives/Instrument';
import { Caption } from '../primitives/Caption';

const SRC_LINES = ['x = 5', 'x = x + 3', 'print x'];

type Mode = 'compile' | 'interpret';

export function TwoStrategies() {
  const { bn, num } = useLang();
  const [mode, setMode] = useState<Mode>('compile');
  const [compiled, setCompiled] = useState(false);
  const [trans, setTrans] = useState(0);
  const [exec, setExec] = useState(0);
  const [runs, setRuns] = useState(0);

  const cm = mode === 'compile';
  const active = cm && compiled;
  const runEnabled = !cm || compiled;
  const binOn = cm && compiled;

  const reset = () => { setCompiled(false); setTrans(0); setExec(0); setRuns(0); };
  const pickMode = (m: Mode) => () => { setMode(m); reset(); };

  const seg = (on: boolean): React.CSSProperties => ({
    background: on ? '#16402a' : 'none',
    color: on ? '#00d26a' : '#6c8873',
    border: 'none', padding: '5px 12px', cursor: 'pointer',
    fontFamily: "'Departure Mono',monospace", fontSize: 11,
  });
  const btn = (accent: boolean): React.CSSProperties => ({
    fontFamily: "'Departure Mono',monospace", fontSize: 12, background: 'none',
    border: `1px solid ${accent ? '#3a5847' : '#2e392e'}`,
    color: accent ? '#00d26a' : '#55695a',
    padding: '7px 14px', cursor: accent ? 'pointer' : 'not-allowed', whiteSpace: 'nowrap',
  });

  let narr: string;
  if (cm && !compiled) narr = bn ? 'compiler mode: আগে compile করুন — তখন একবারই ৩টা লাইন অনুবাদ হবে।' : 'compiler mode: compile first — the 3 lines get translated once, right then.';
  else if (cm && runs === 0) narr = bn ? 'binary তৈরি। এবার যতবার run করবেন, আর অনুবাদ হবে না — সরাসরি চলবে।' : 'binary built. Now run it as many times as you like — no more translation, it runs directly.';
  else if (cm) narr = bn ? `run #${num(runs)} — translations এখনো ৩-এই আটকে। compiler-এর কাজ একবারই হয়েছিল।` : `run #${runs} — translations still stuck at 3. The compiler's work happened once.`;
  else if (runs === 0) narr = bn ? 'interpreter mode: আগে থেকে তৈরি native binary নেই। run চাপলেই runtime-এ অনুবাদ + execute।' : 'interpreter mode: no native binary prepared up front. Hit run and the translating + executing happens at runtime.';
  else narr = bn ? `run #${num(runs)} — প্রতি run-এ একই ৩টা লাইনের কাজ আবার runtime-এ। translations = ৩×${num(runs)}।` : `run #${runs} — the same 3 lines are processed again at runtime on every run. translations = 3×${runs}.`;

  const binTxt = binOn
    ? 'binary: prog ✓ (compiled)'
    : cm
      ? (bn ? 'binary: — (compile করুন)' : 'binary: — (not yet)')
      : (bn ? 'binary: — (interpreter, কোনো binary নেই)' : 'binary: — (none, interpreter)');

  const redundant = !cm && runs > 1;

  const stat = (label: string, value: string, color: string, glow?: string) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', border: '1px solid #2e392e', padding: '8px 10px' }}>
      <span style={{ fontSize: 10, color: '#6c8873', letterSpacing: '0.06em' }}>{label}</span>
      <span style={{ fontSize: 18, color, textShadow: glow }}>{value}</span>
    </div>
  );

  return (
    <>
      <Instrument
        bnTitle="যন্ত্র ০১ — TWO STRATEGIES"
        enTitle="INSTRUMENT 01 — TWO STRATEGIES"
        control={
          <div style={{ display: 'flex', border: '1px solid #3a5847' }}>
            <button onClick={pickMode('compile')} style={seg(cm)}>compiler</button>
            <button onClick={pickMode('interpret')} style={seg(!cm)}>interpreter</button>
          </div>
        }
      >
        <div style={{ padding: 16, display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'stretch' }}>
          <div style={{ flex: 1, minWidth: 180, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ fontFamily: "'Departure Mono',monospace", fontSize: 9.5, color: '#6c8873', letterSpacing: '0.08em' }}>program.src</div>
            <div style={{ border: '1px solid #3a5847', background: '#1b231b', fontFamily: "'Departure Mono',monospace", fontSize: 11 }}>
              {SRC_LINES.map((t, i) => (
                <div key={t} style={{ padding: '4px 10px', color: active ? '#00d26a' : '#8aa893', borderBottom: i < SRC_LINES.length - 1 ? '1px solid #2e392e' : undefined }}>{t}</div>
              ))}
            </div>
            <div style={{ fontFamily: "'Departure Mono',monospace", fontSize: 10.5, color: binOn ? '#00d26a' : '#6c8873', borderTop: '1px dashed #2e392e', paddingTop: 8 }}>{binTxt}</div>
          </div>
          <div style={{ flex: 1, minWidth: 160, display: 'flex', flexDirection: 'column', gap: 8, fontFamily: "'Departure Mono',monospace" }}>
            {stat('TRANSLATIONS', num(trans), redundant ? '#ff6b6b' : '#00d26a', redundant ? '0 0 8px rgba(255,107,107,0.4)' : '0 0 8px rgba(0,210,106,0.3)')}
            {stat('EXECUTIONS', num(exec), '#8aa893')}
            {stat('RUNS', num(runs), '#8aa893')}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', borderTop: '1px solid #2e392e', flexWrap: 'wrap' }}>
          {cm && (
            <button
              onClick={() => { if (!compiled) { setCompiled(true); setTrans(3); } }}
              disabled={compiled}
              style={btn(!compiled)}
            >
              compile ⚙
            </button>
          )}
          <button
            onClick={() => {
              if (cm) { if (!compiled) return; setRuns((r) => r + 1); setExec((e) => e + 3); return; }
              setRuns((r) => r + 1); setExec((e) => e + 3); setTrans((t) => t + 3);
            }}
            disabled={!runEnabled}
            style={btn(runEnabled)}
          >
            run ▶
          </button>
          <button onClick={reset} style={{ fontFamily: "'Departure Mono',monospace", fontSize: 12, background: 'none', border: '1px solid #3a5847', color: '#6c8873', padding: '7px 14px', cursor: 'pointer', whiteSpace: 'nowrap' }}>↺ reset</button>
          <span style={{ fontFamily: "'Departure Mono',monospace", fontSize: 11.5, color: '#8aa893', flex: 1, minWidth: 170 }}>{narr}</span>
        </div>
      </Instrument>
      <Caption
        bn="একই ৩-লাইনের program। এক পাশে অনুবাদ আগেই একবার হয়ে আছে (translations ৩-এই থামে); অন্য পাশে কাজটা প্রতি run-এ runtime-এ হয় (৩×run) — এটাই মূল trade-off। Simplified model; আসল interpreter এই কাজের অংশবিশেষ cache-ও করতে পারে।"
        en="The same 3-line program. On one side the translation already happened once (translations stop at 3); on the other it happens at runtime on every run (3×runs) — the core trade-off. A simplified model: real interpreters can cache part of that work."
      />
    </>
  );
}
