import { useEffect, useState } from 'react';
import { useLang } from '../context/LanguageContext';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { Instrument } from '../primitives/Instrument';
import { Caption } from '../primitives/Caption';

type Layer = 'HW' | 'K' | 'U';

const STAGES: { bn: string; en: string; layer: Layer }[] = [
  { bn: "'A' চাপলেন — switch-এর contact লাগল", en: "you press 'A' — the switch contacts close", layer: 'HW' },
  { bn: 'keyboard controller matrix scan করে, HID input report পাঠায়', en: 'the keyboard controller scans the matrix and sends an HID input report', layer: 'HW' },
  { bn: 'USB subsystem সেটা পায়, CPU-কে interrupt দিয়ে জানায়', en: 'the USB subsystem receives it and signals the CPU with an interrupt', layer: 'HW' },
  { bn: 'CPU ফেরার মতো state রেখে privileged code-এ যায়', en: 'the CPU preserves enough state to return, then enters privileged code', layer: 'K' },
  { bn: 'OS-এর interrupt handling input data process করে', en: "the OS's interrupt handling processes the input data", layer: 'K' },
  { bn: 'driver + input subsystem একটা keyboard event বানায়', en: 'driver + input subsystem build a keyboard event', layer: 'K' },
  { bn: 'window system event-টা focused application-এর জন্য পাঠায়', en: 'the window system routes the event to the focused application', layer: 'K' },
  { bn: 'application runnable; scheduler তাকে CPU-তে চালায়', en: 'the application becomes runnable; the scheduler runs it on the CPU', layer: 'K' },
  { bn: "app-এর event handler state বদলায় — cursor-এ 'A'", en: "the app's event handler updates state — 'A' at the cursor", layer: 'U' },
  { bn: "font system 'A'-এর shape rasterize করে pixel information বানায়", en: "the font system rasterizes the shape of 'A' into pixel information", layer: 'U' },
  { bn: 'compositor final frame বানায়, display buffer-এ প্রস্তুত হয়', en: 'the compositor builds the final frame; it is prepared in a display buffer', layer: 'K' },
  { bn: 'display pipeline cable দিয়ে monitor-এ frame পাঠায়', en: 'the display pipeline sends the frame down the cable to the monitor', layer: 'HW' },
  { bn: "pixel আলো ছাড়ল — photon চোখে পড়ল, 'A' দেখলেন", en: "pixels emit light — photons hit your eye, you see 'A'", layer: 'HW' },
];

const LAST = STAGES.length - 1;

const LAYERS: { id: Layer; label: string }[] = [
  { id: 'HW', label: 'HW' },
  { id: 'K', label: 'KERNEL' },
  { id: 'U', label: 'USER' },
];

const layerCol = (l: Layer) => (l === 'K' ? '#00d26a' : l === 'U' ? '#8ab89c' : '#e0c264');

/** Mode flips accumulate as the relay crosses the user/kernel boundary. */
/** Privilege transitions crossed by the given stage index. */
const modeFlips = (k: number) => (k < 3 ? 0 : k < 8 ? 1 : k < 10 ? 2 : 3);

export function FullRelay() {
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
    }, reduced ? 140 : 560);
    return () => clearInterval(iv);
  }, [running, reduced]);

  const cur = STAGES[step];
  const shown = step >= LAST;

  const btn = (accent: boolean): React.CSSProperties => ({
    fontFamily: "'Departure Mono',monospace", fontSize: 12, background: 'none',
    border: '1px solid #3a5847', color: accent ? '#00d26a' : '#6c8873',
    padding: '7px 14px', cursor: 'pointer', whiteSpace: 'nowrap',
  });

  return (
    <>
      <Instrument
        bnTitle="যন্ত্র ০৩ — THE RELAY ('A' → screen)"
        enTitle="INSTRUMENT 03 — THE RELAY ('A' → screen)"
        control={
          <span style={{ fontFamily: "'Departure Mono',monospace", fontSize: 10.5, color: shown ? '#00d26a' : '#8aa893', whiteSpace: 'nowrap' }}>
            {bn ? `ধাপ ${num(step + 1)}/${num(STAGES.length)}` : `step ${step + 1}/${STAGES.length}`}
          </span>
        }
      >
        <div style={{ padding: 16, display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-start' }}>
          {/* Stage list */}
          <div style={{ flex: 2, minWidth: 240, display: 'flex', flexDirection: 'column', gap: 3 }}>
            {STAGES.map((s, i) => {
              const active = i === step, done = i < step;
              const bc = active ? layerCol(s.layer) : done ? '#4a5a4e' : '#3a4a3e';
              return (
                <div
                  key={i}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8, padding: '4px 8px',
                    borderLeft: `2px solid ${active ? '#00d26a' : done ? '#2e392e' : 'transparent'}`,
                    background: active ? 'rgba(0,210,106,0.08)' : 'none',
                  }}
                >
                  <span style={{ fontFamily: "'Departure Mono',monospace", fontSize: 9, minWidth: 22, color: bc, border: `1px solid ${bc}`, textAlign: 'center', padding: '1px 0' }}>{s.layer}</span>
                  <span style={{ fontFamily: "'Anek Bangla','Anek Latin',sans-serif", fontSize: 12.5, color: active ? '#cfe8d8' : done ? '#8aa893' : '#55695a' }}>
                    {bn ? s.bn : s.en}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Screen + layer indicator */}
          <div style={{ flex: 1, minWidth: 130, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
            <div style={{ display: 'flex', gap: 3 }}>
              {LAYERS.map((L) => {
                const on = L.id === cur.layer;
                return (
                  <span
                    key={L.id}
                    style={{
                      fontFamily: "'Departure Mono',monospace", fontSize: 8, letterSpacing: '0.04em', padding: '3px 5px',
                      border: `1px solid ${on ? layerCol(L.id) : '#2e392e'}`,
                      color: on ? layerCol(L.id) : '#55695a',
                      background: on ? 'rgba(0,210,106,0.08)' : 'transparent',
                    }}
                  >
                    {L.label}
                  </span>
                );
              })}
            </div>
            <div
              style={{
                width: 108, height: 76, border: '1px solid #3a5847', background: '#161d15',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <span
                style={{
                  fontFamily: "'Departure Mono',monospace", fontSize: 40,
                  color: shown ? '#00d26a' : '#2e392e',
                  textShadow: shown ? '0 0 14px rgba(0,210,106,0.6)' : 'none',
                }}
              >
                {shown ? 'A' : step >= 1 ? '█' : ''}
              </span>
            </div>
            <div style={{ fontFamily: "'Departure Mono',monospace", fontSize: 9.5, color: '#8aa893', textAlign: 'center', lineHeight: 1.7 }}>
              {bn
                ? `privilege transition: ${num(modeFlips(step))}`
                : `privilege transitions: ${modeFlips(step)}`}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', borderTop: '1px solid #2e392e', flexWrap: 'wrap' }}>
          <button onClick={() => setStep((k) => Math.min(LAST, k + 1))} style={btn(true)}>step ▶</button>
          <button onClick={() => { if (running) setRunning(false); else if (step < LAST) setRunning(true); }} style={btn(true)}>
            {running ? '⏸ pause' : 'run ▶▶'}
          </button>
          <button onClick={() => { setRunning(false); setStep(0); }} style={btn(false)}>↺ reset</button>
          <span style={{ fontFamily: "'Departure Mono',monospace", fontSize: 11.5, color: '#8aa893', flex: 1, minWidth: 180 }}>
            {bn
              ? `HW hardware · K kernel · U user। ধাপ ${num(step + 1)}/${num(STAGES.length)}`
              : `HW hardware · K kernel · U user. step ${step + 1}/${STAGES.length}`}
          </span>
        </div>
      </Instrument>
      <Caption
        bn="এক keypress-এর পুরো chain: keyboard controller, HID, interrupt, OS-এর input handling, scheduler, application event, rasterization, compositor, display — প্রতিটা layer নিজের কাজ করে পরেরজনের হাতে তুলে দেয়। এটা একটা conceptual path; আসল ধাপ আর timing system ভেদে আলাদা।"
        en="The whole chain behind one keypress: keyboard controller, HID, interrupt, the OS's input handling, the scheduler, an application event, rasterization, the compositor, the display — each layer does its job and hands over to the next. A conceptual path; the real steps and timings vary by system."
      />
    </>
  );
}
