import { useState } from 'react';
import { useLang } from '../context/LanguageContext';
import { Instrument } from '../primitives/Instrument';
import { Caption } from '../primitives/Caption';

type Mode = 'rr' | 'prio' | 'fair';

const PROCS = [
  { bnName: 'UI', enName: 'UI', pri: 1 },
  { bnName: 'compile',     enName: 'compile',     pri: 3 },
  { bnName: 'music',       enName: 'music',       pri: 2 },
  { bnName: 'bg sync',     enName: 'bg sync',     pri: 3 },
];

const segBtn = (on: boolean): React.CSSProperties => ({
  background: on ? '#16402a' : 'none',
  color: on ? '#00d26a' : '#6c8873',
  border: 'none',
  padding: '5px 10px',
  cursor: 'pointer',
  fontFamily: "'Departure Mono',monospace",
  fontSize: 11,
});

const priLabel = (p: number, bn: boolean) =>
  p === 1 ? (bn ? 'pri: উচ্চ' : 'pri: high') : p === 2 ? (bn ? 'pri: মাঝ' : 'pri: med') : (bn ? 'pri: নিম্ন' : 'pri: low');

export function Scheduler() {
  const { bn, num } = useLang();
  const [mode, setMode] = useState<Mode>('rr');
  const [times, setTimes] = useState([0, 0, 0, 0]);
  const [ptr, setPtr] = useState(0);
  const [last, setLast] = useState(-1);

  const runSlice = () => {
    setTimes((t) => {
      const next = [...t];
      let idx = 0;
      let newPtr = ptr;
      if (mode === 'rr') {
        idx = ptr;
        newPtr = (ptr + 1) % 4;
      } else if (mode === 'prio') {
        let best = 0;
        for (let i = 1; i < 4; i++) {
          if (PROCS[i].pri < PROCS[best].pri || (PROCS[i].pri === PROCS[best].pri && t[i] < t[best])) best = i;
        }
        idx = best;
      } else {
        let best = 0;
        for (let i = 1; i < 4; i++) { if (t[i] < t[best]) best = i; }
        idx = best;
      }
      next[idx] += 1;
      setPtr(newPtr);
      setLast(idx);
      return next;
    });
  };

  const reset = () => { setTimes([0, 0, 0, 0]); setPtr(0); setLast(-1); };

  const maxT = Math.max(1, ...times);
  const total = times.reduce((a, b) => a + b, 0);

  let narr: string;
  if (total === 0) narr = bn ? '"run slice" চাপুন — নীতিভেদে দেখুন কে CPU পায়।' : 'Press "run slice" — watch who gets the CPU under each policy.';
  else if (mode === 'rr') narr = bn ? 'round-robin: সবাই পালা করে সমান স্লাইস — priority যা-ই হোক। fair, কিন্তু জরুরি UI বাড়তি কিছু পায় না।' : 'round-robin: everyone takes equal turns regardless of priority. Fair, but the urgent UI gets nothing extra.';
  else if (mode === 'prio') narr = bn ? 'priority: উচ্চ-priority UI প্রতিবার জিতছে — নিম্ন-priority compile আর bg sync অনাহারে (starvation)।' : 'priority: the high-priority UI wins every time — low-priority compile and bg sync are starving.';
  else narr = bn ? 'fair-share: যে এখন পর্যন্ত সবচেয়ে কম CPU পেয়েছে, পরের বার সে-ই পায় — bar-গুলো সমান হয়ে আসছে। Linux-এর CFS আর এখনকার EEVDF, দুটোরই ভিত্তি এই ধারণা।' : 'fair-share: whoever has had the least CPU so far goes next, so the bars even out. This is the idea behind Linux CFS and, now, EEVDF.';

  const modeControl = (
    <div style={{ display: 'flex', border: '1px solid #3a5847', fontFamily: "'Departure Mono',monospace", fontSize: 11 }}>
      {(['rr', 'prio', 'fair'] as Mode[]).map((m) => (
        <button key={m} style={segBtn(mode === m)} onClick={() => setMode(m)}>
          {m === 'rr' ? 'round-robin' : m === 'prio' ? 'priority' : 'fair-share'}
        </button>
      ))}
    </div>
  );

  return (
    <>
      <Instrument bnTitle="যন্ত্র ০৩ — THE SCHEDULER" enTitle="INSTRUMENT 03 — THE SCHEDULER" control={modeControl}>
        <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {PROCS.map((p, i) => {
            const on = i === last;
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '5px 8px', border: `1px solid ${on ? '#00d26a' : '#2e392e'}`, background: on ? 'rgba(0,210,106,0.08)' : 'none' }}>
                <span style={{ fontFamily: "'Departure Mono',monospace", fontSize: 11, color: on ? '#00d26a' : '#8aa893', minWidth: 118 }}>{bn ? p.bnName : p.enName}</span>
                <span style={{ fontFamily: "'Departure Mono',monospace", fontSize: 9.5, color: '#6c8873', minWidth: 52 }}>{priLabel(p.pri, bn)}</span>
                <span style={{ flex: 1, height: 14, background: '#1b231b', border: '1px solid #2e392e', position: 'relative', minWidth: 60 }}>
                  <span style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${(times[i] / maxT) * 100}%`, background: on ? '#00d26a' : '#3a5847', transition: 'width 0.3s' }} />
                </span>
                <span style={{ fontFamily: "'Departure Mono',monospace", fontSize: 10.5, color: '#8aa893', minWidth: 48, textAlign: 'right' }}>{num(times[i] * 10)}ms</span>
              </div>
            );
          })}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', borderTop: '1px solid #2e392e', flexWrap: 'wrap' }}>
          <button onClick={runSlice} style={{ fontFamily: "'Departure Mono',monospace", fontSize: 12, background: 'none', border: '1px solid #3a5847', color: '#00d26a', padding: '7px 14px', cursor: 'pointer', whiteSpace: 'nowrap' }}>run slice ▶</button>
          <button onClick={reset} style={{ fontFamily: "'Departure Mono',monospace", fontSize: 12, background: 'none', border: '1px solid #3a5847', color: '#6c8873', padding: '7px 14px', cursor: 'pointer', whiteSpace: 'nowrap' }}>↺ reset</button>
          <span style={{ fontFamily: "'Departure Mono',monospace", fontSize: 11.5, color: '#8aa893', flex: 1, minWidth: 180 }}>{narr}</span>
        </div>
      </Instrument>
      <Caption
        bn={'চার process, একটাই CPU। প্রতিটা "run slice" নির্বাচিত নীতি অনুযায়ী একজনকে ১০ms দেয়। bar = মোট পাওয়া CPU time।'}
        en='Four processes, one CPU. Each "run slice" gives one process 10ms per the selected policy. Bars = total CPU time received.'
      />
    </>
  );
}
