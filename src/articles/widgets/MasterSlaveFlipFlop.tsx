import { useState } from 'react';
import { useLang } from '../context/LanguageContext';
import { Instrument } from '../primitives/Instrument';
import { Caption } from '../primitives/Caption';
import { SegmentedToggle } from '../primitives/SegmentedToggle';

const ON = '#00d26a';
const DIM = '#3a5847';
const TEXT_DIM = '#6c8873';
const TEXT_LIT = '#8aa893';
const WARN = '#b87c2a';

type Mode = 'latch' | 'ms';
type Sample = { v: number; bad: boolean };

/** A toggle counter: the stored bit feeds back as its own inverted input (D = NOT Q). */
export function MasterSlaveFlipFlop() {
  const { bn, num } = useLang();
  const [mode, setMode] = useState<Mode>('latch');
  const [clk, setClk] = useState(0);
  const [q, setQ] = useState(0);
  const [master, setMaster] = useState(1);
  const [osc, setOsc] = useState(false);
  const [hist, setHist] = useState<Sample[]>([]);

  const reset = (m: Mode) => {
    setMode(m); setClk(0); setQ(0); setMaster(1); setOsc(false); setHist([]);
  };

  const step = () => {
    const next = clk ? 0 : 1;
    if (mode === 'ms') {
      if (next === 1) {
        // rising edge — the slave opens and takes what the master caught
        setQ(master);
        setHist((h) => [...h.slice(-7), { v: master, bad: false }]);
      } else {
        // falling edge — the master opens and samples D = NOT Q
        setMaster(q ? 0 : 1);
      }
      setOsc(false);
    } else {
      if (next === 1) {
        setOsc(true); // transparent + feedback → Q races around
      } else {
        const settled = Math.random() < 0.5 ? 0 : 1;
        setQ(settled);
        setOsc(false);
        setHist((h) => [...h.slice(-7), { v: settled, bad: true }]);
      }
    }
    setClk(next);
  };

  const qText = osc ? '?' : num(q);
  const qCol = osc ? WARN : ON;
  const masterOpen = mode === 'ms' && clk === 0;
  const slaveOpen = mode === 'ms' && clk === 1;
  const latchOpen = mode === 'latch' && clk === 1;

  const status = osc
    ? (bn ? 'Q দুলছে — clock নামলে কোথায় থামবে জানা নেই' : 'Q is racing — no telling where it lands when the clock drops')
    : mode === 'ms'
      ? (bn ? `প্রতি tick-এ ঠিক একবার বদলায় · Q = ${num(q)}` : `flips exactly once per tick · Q = ${q}`)
      : (bn ? `স্থির — Q = ${num(q)}` : `settled — Q = ${q}`);

  const box = (x: number, label: string, open: boolean, shown: boolean) => (
    <g opacity={shown ? 1 : 0.25}>
      <rect x={x} y={34} width={78} height={40} fill="none" stroke={open ? ON : DIM} strokeWidth={open ? 2.5 : 1.5} />
      <text x={x + 39} y={51} fill={open ? ON : TEXT_DIM} fontSize={10} fontFamily="Departure Mono,monospace" textAnchor="middle">{label}</text>
      <text x={x + 39} y={65} fill={open ? ON : TEXT_DIM} fontSize={8.5} fontFamily="Departure Mono,monospace" textAnchor="middle">
        {open ? (bn ? 'খোলা' : 'open') : (bn ? 'বন্ধ' : 'closed')}
      </text>
    </g>
  );

  const btn: React.CSSProperties = {
    fontFamily: "'Departure Mono',monospace", fontSize: 12, background: 'none',
    border: `1px solid ${DIM}`, color: ON, padding: '8px 13px', cursor: 'pointer', minHeight: 36,
  };

  return (
    <>
      <Instrument
        bnTitle="TOGGLE COUNTER — latch বনাম master + slave"
        enTitle="TOGGLE COUNTER — latch vs master + slave"
        control={
          <SegmentedToggle
            value={mode}
            onChange={reset}
            options={[
              { value: 'latch', label: bn ? 'একটা latch' : 'one latch' },
              { value: 'ms', label: bn ? 'master + slave' : 'master + slave' },
            ]}
          />
        }
      >
        <svg viewBox="0 0 360 120" style={{ display: 'block', width: '100%', height: 'auto' }}
          aria-label="a toggle counter built either from one latch or from a master and slave latch pair">
          {/* D input, fed back from Q */}
          <text x={8} y={50} fill={TEXT_DIM} fontSize={9} fontFamily="Departure Mono,monospace">D = NOT Q</text>
          <path d="M8 58 H86" stroke={ON} strokeWidth={1.6} fill="none" />

          {mode === 'ms' ? (
            <>
              {box(86, 'MASTER', masterOpen, true)}
              <path d="M164 54 H196" stroke={masterOpen ? DIM : ON} strokeWidth={1.6} fill="none" />
              {box(196, 'SLAVE', slaveOpen, true)}
              <path d="M274 54 H320" stroke={ON} strokeWidth={1.6} fill="none" />
            </>
          ) : (
            <>
              {box(140, 'LATCH', latchOpen, true)}
              <path d="M218 54 H320" stroke={ON} strokeWidth={1.6} fill="none" />
            </>
          )}

          <text x={324} y={51} fill={qCol} fontSize={14} fontFamily="Departure Mono,monospace">Q</text>
          <text x={324} y={67} fill={qCol} fontSize={14} fontFamily="Departure Mono,monospace">{qText}</text>

          {/* feedback wire from Q back to D */}
          <path d="M320 74 V100 H8 V62" stroke={ON} strokeWidth={1.2} fill="none" strokeDasharray="4 4" opacity={0.6} />

          {/* clock line */}
          <text x={8} y={22} fill={TEXT_DIM} fontSize={9} fontFamily="Departure Mono,monospace">
            clock = {num(clk)}
          </text>
          <path d={clk ? 'M60 20 H74 V10 H100' : 'M60 10 H74 V20 H100'} stroke={ON} strokeWidth={2} fill="none" />
        </svg>

        {/* history strip */}
        <div className="flex items-center gap-2 px-[14px] pb-2" style={{ flexWrap: 'wrap' }}>
          <span style={{ fontFamily: "'Departure Mono',monospace", fontSize: 10.5, color: TEXT_DIM }}>
            {bn ? 'প্রতি tick-এ Q' : 'Q each tick'}
          </span>
          {hist.length === 0 && (
            <span style={{ fontFamily: "'Departure Mono',monospace", fontSize: 11, color: DIM }}>—</span>
          )}
          {hist.map((s, i) => (
            <span key={i} style={{
              fontFamily: "'Departure Mono',monospace", fontSize: 13,
              color: s.bad ? WARN : ON, border: `1px solid ${s.bad ? WARN : DIM}`, padding: '1px 7px',
            }}>{num(s.v)}</span>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderTop: '1px solid #2e392e', flexWrap: 'wrap' }}>
          <button onClick={step} style={btn}>
            {bn ? `clock → ${num(clk ? 0 : 1)}` : `clock → ${clk ? 0 : 1}`}
          </button>
          <button onClick={() => reset(mode)} style={{ ...btn, color: TEXT_LIT }}>↺ reset</button>
          <span style={{ fontFamily: "'Departure Mono',monospace", fontSize: 11.5, color: osc ? WARN : TEXT_LIT, flex: 1, minWidth: 200 }}
            {...(bn ? { lang: 'bn' } : {})}>
            {status}
          </span>
        </div>
      </Instrument>
      <Caption
        bn="একই counter, দুই রকম storage। একটামাত্র latch খোলা থাকে clock high-এর পুরো সময় — তাই Q নিজের feedback-এ দুলতে থাকে। Master + slave কখনো একসঙ্গে খোলে না, তাই প্রতি tick-এ ঠিক একবার বদলায়।"
        en="The same counter, two kinds of storage. A single latch stays open for the whole clock-high window, so Q races around on its own feedback. A master and slave are never open together, so Q flips exactly once per tick."
      />
    </>
  );
}
