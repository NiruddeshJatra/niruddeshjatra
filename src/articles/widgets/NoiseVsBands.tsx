import { useEffect, useRef, useState, useCallback } from 'react';
import { useLang } from '../context/LanguageContext';
import { Instrument } from '../primitives/Instrument';
import { Caption } from '../primitives/Caption';

type Mode = 'bin' | 'b10';

const useReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function computeRead(v: number, mode: Mode, lastRead: number | null) {
  if (mode === 'bin') {
    const read = v >= 2.0 ? 1 : v <= 0.8 ? 0 : (lastRead ?? 1);
    return { read, flip: read !== 1 };
  }
  const read = Math.max(0, Math.min(9, Math.round(v / 0.5)));
  return { read, flip: read !== 2 };
}

function redraw(
  canvas: HTMLCanvasElement,
  hist: { v: number; flip: boolean }[],
  mode: Mode,
  bn: boolean,
) {
  const dpr = window.devicePixelRatio || 1;
  const w = canvas.clientWidth || 400;
  const h = 240;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  const ctx = canvas.getContext('2d')!;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const yOf = (v: number) => h - 18 - (v / 5) * (h - 36);
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = '#1b231b';
  ctx.fillRect(0, 0, w, h);
  ctx.font = '10px "Departure Mono", monospace';

  if (mode === 'bin') {
    ctx.fillStyle = 'rgba(0,210,106,0.07)';
    ctx.fillRect(0, yOf(5), w, yOf(2) - yOf(5));
    ctx.fillRect(0, yOf(0.8), w, yOf(0) - yOf(0.8));
    ctx.fillStyle = 'rgba(255,80,80,0.08)';
    ctx.fillRect(0, yOf(2), w, yOf(0.8) - yOf(2));
    ctx.strokeStyle = 'rgba(255,80,80,0.25)';
    ctx.lineWidth = 1;
    for (let x = -h; x < w; x += 14) {
      ctx.beginPath();
      ctx.moveTo(x, yOf(0.8));
      ctx.lineTo(x + (yOf(0.8) - yOf(2)), yOf(2));
      ctx.stroke();
    }
    ctx.fillStyle = '#6c8873';
    ctx.fillText('1 · HIGH', 8, yOf(3.5));
    ctx.fillText('0 · LOW', 8, yOf(0.4));
    ctx.fillStyle = '#c07070';
    ctx.fillText(bn ? 'নিষিদ্ধ অঞ্চল / forbidden' : 'forbidden zone', 8, (yOf(2) + yOf(0.8)) / 2 + 3);
    ctx.strokeStyle = 'rgba(0,210,106,0.25)';
    [0.8, 2.0].forEach((vl) => {
      ctx.beginPath(); ctx.moveTo(0, yOf(vl)); ctx.lineTo(w, yOf(vl)); ctx.stroke();
    });
  } else {
    for (let d = 0; d < 10; d++) {
      if (d % 2 === 0) { ctx.fillStyle = 'rgba(0,210,106,0.05)'; ctx.fillRect(0, yOf(d * 0.5 + 0.25), w, Math.abs(yOf(d * 0.5 - 0.25) - yOf(d * 0.5 + 0.25))); }
      ctx.strokeStyle = 'rgba(140,170,140,0.18)';
      ctx.beginPath(); ctx.moveTo(0, yOf(d * 0.5 + 0.25)); ctx.lineTo(w, yOf(d * 0.5 + 0.25)); ctx.stroke();
      ctx.fillStyle = d === 2 ? '#7fd6a4' : '#6c8873';
      ctx.fillText(String(d), w - 16, yOf(d * 0.5) + 3);
    }
  }

  const n = hist.length;
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#00d26a';
  ctx.shadowColor = 'rgba(0,210,106,0.6)';
  ctx.shadowBlur = 6;
  ctx.beginPath();
  hist.forEach(({ v }, i) => {
    const x = w - (n - i) * 2, y = yOf(v);
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  });
  ctx.stroke();
  ctx.shadowBlur = 0;
  hist.forEach(({ v, flip }, i) => {
    if (flip) { ctx.fillStyle = 'rgba(255,80,80,0.85)'; ctx.fillRect(w - (n - i) * 2 - 1, yOf(v) - 2, 3, 4); }
  });
}

export function NoiseVsBands() {
  const { bn, bd } = useLang();
  const reduced = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const histRef = useRef<{ v: number; flip: boolean }[]>([]);
  const lastReadRef = useRef<number | null>(null);
  const flipsRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const [noise, setNoise] = useState(18);
  const [mode, setMode] = useState<Mode>('bin');
  const [display, setDisplay] = useState({ digit: '1', flips: 0 });

  const noiseAmp = (noise / 100) * 1.6;

  const step = useCallback((m: Mode, amp: number) => {
    const v = (m === 'bin' ? 3.4 : 1.0) + (Math.random() * 2 - 1) * amp;
    const { read, flip } = computeRead(v, m, lastReadRef.current);
    lastReadRef.current = read;
    if (flip) flipsRef.current++;
    const cap = Math.max(60, Math.floor((canvasRef.current?.clientWidth || 400) / 2));
    histRef.current.push({ v, flip });
    while (histRef.current.length > cap) histRef.current.shift();
  }, []);

  const changeMode = (m: Mode) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    histRef.current = []; lastReadRef.current = null; flipsRef.current = 0;
    setMode(m);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    histRef.current = []; lastReadRef.current = null; flipsRef.current = 0;
    const cap = Math.max(60, Math.floor((canvas.clientWidth || 400) / 2));
    for (let i = 0; i < cap; i++) step(mode, noiseAmp);
    redraw(canvas, histRef.current, mode, bn);
    setDisplay({ digit: bn ? bd(String(lastReadRef.current ?? 1)) : String(lastReadRef.current ?? 1), flips: flipsRef.current });

    if (reduced) return;

    let lastUi = 0;
    const tick = () => {
      step(mode, noiseAmp); step(mode, noiseAmp);
      if (canvasRef.current) redraw(canvasRef.current, histRef.current, mode, bn);
      const now = performance.now();
      if (now - lastUi > 250) {
        lastUi = now;
        setDisplay({ digit: bn ? bd(String(lastReadRef.current ?? 1)) : String(lastReadRef.current ?? 1), flips: flipsRef.current });
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [mode, noise, bn, reduced, step, noiseAmp, bd]);

  const segG = (active: boolean): React.CSSProperties => ({
    background: active ? '#16402a' : 'none', color: active ? '#00d26a' : '#6c8873',
    border: 'none', padding: '5px 12px', cursor: 'pointer',
    fontFamily: "'Departure Mono', monospace", fontSize: '11.5px',
  });

  const modeControl = (
    <div className="flex" style={{ border: '1px solid #3a5847' }}>
      <button style={segG(mode === 'b10')} onClick={() => changeMode('b10')} className="well-focus">base-10</button>
      <button style={segG(mode === 'bin')} onClick={() => changeMode('bin')} className="well-focus">binary</button>
    </div>
  );

  return (
    <>
      <Instrument
        bnTitle="NOISE VS BANDS"
        enTitle="NOISE VS BANDS"
        control={modeControl}
      >
        <div className="flex items-stretch">
          <canvas ref={canvasRef} style={{ flex: 1, minWidth: 0, display: 'block', height: 240 }} />
          <div className="flex flex-col justify-center items-center gap-[6px] py-[10px] px-[6px]"
            style={{ width: 118, flexShrink: 0, borderLeft: '1px solid #2e392e' }}>
            <div className="font-mono text-[10.5px] text-well-text">{bn ? 'পড়ছে' : 'reading'}</div>
            <div className="font-mono leading-none" style={{ fontSize: 40, color: '#00d26a', textShadow: '0 0 12px rgba(0,210,106,0.5)' }}>
              {display.digit}
            </div>
            <div className="font-mono text-[11px]" style={{ color: display.flips > 0 ? '#ff6b6b' : '#6c8873' }}>
              {(bn ? 'ভুল পড়া: ' : 'misreads: ') + (bn ? bd(String(display.flips)) : display.flips)}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 px-[14px] py-3" style={{ borderTop: '1px solid #2e392e' }}>
          <label htmlFor="noise-slider" className="font-mono text-[11.5px] text-well-text whitespace-nowrap">noise</label>
          <input id="noise-slider" type="range" min={0} max={100} value={noise}
            onChange={(e) => setNoise(+e.target.value)}
            className="flex-1 cursor-ew-resize well-focus" style={{ accentColor: '#00d26a' }} />
          <span className="font-mono text-[11.5px] text-machine-phosphor w-14 text-right">
            ±{bn ? bd((noiseAmp).toFixed(1)) : noiseAmp.toFixed(1)}V
          </span>
        </div>
      </Instrument>
      <Caption
        bn="একই noise, দুই ধরনের ফলাফল — কাছাকাছি সাজানো দশটা voltage range-এ noise-এর জায়গা কম; অনেক দূরে রাখা দুটো range-এর মাঝখানের gap-টাই noise margin। (Threshold-গুলো উদাহরণ মাত্র; আসল মান chip অনুযায়ী বদলায়।)"
        en="Same noise, two outcomes — ten closely spaced voltage ranges leave little room for noise; two widely separated ranges leave a gap between them, the noise margin. (Thresholds are illustrative; real values vary by chip.)"
      />
    </>
  );
}
