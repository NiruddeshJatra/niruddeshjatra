import { useEffect, useRef, useState } from 'react';
import { useLang } from '../context/LanguageContext';
import { Instrument } from '../primitives/Instrument';
import { Caption } from '../primitives/Caption';

const ON = '#00d26a';
const DIM = '#3a5847';
const TEXT_DIM = '#6c8873';
const TEXT_LIT = '#8aa893';
const WARN = '#b87c2a';

/** How long the combinational output is treated as "not yet settled". */
const SETTLE_MS = 650;

type Op = 'ADD' | 'SUB' | 'AND' | 'XOR';

const OPS: Op[] = ['ADD', 'SUB', 'AND', 'XOR'];

const bin4 = (n: number) => n.toString(2).padStart(4, '0');

function compute(a: number, b: number, op: Op): number {
  switch (op) {
    case 'ADD': return (a + b) & 15;
    case 'SUB': return (a - b + 16) & 15;
    case 'AND': return a & b;
    case 'XOR': return a ^ b;
  }
}

type Capture = 'ok' | 'mid-settle' | 'blocked' | null;

export function CombinationalVsClocked() {
  const { bn } = useLang();

  const [a, setA] = useState(2);
  const [b, setB] = useState(3);
  const [op, setOp] = useState<Op>('ADD');
  const [we, setWe] = useState(true);
  const [c, setC] = useState<number | 'X'>(0);
  const [settling, setSettling] = useState(false);
  const [capture, setCapture] = useState<Capture>(null);

  const timer = useRef<number | undefined>(undefined);
  const first = useRef(true);

  // Combinational output has no memory: any input or control change makes it
  // re-settle. Nothing "starts" it — it is already responding.
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    setSettling(true);
    setCapture(null);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setSettling(false), SETTLE_MS);
    return () => window.clearTimeout(timer.current);
  }, [a, b, op]);

  const result = compute(a, b, op);

  const clockEdge = () => {
    if (!we) { setCapture('blocked'); return; }
    if (settling) { setC('X'); setCapture('mid-settle'); return; }
    setC(result);
    setCapture('ok');
  };

  const stale = c !== 'X' && c !== result;

  const aluCol = settling ? WARN : ON;
  const cCol = c === 'X' ? WARN : ON;

  const btn: React.CSSProperties = {
    fontFamily: "'Departure Mono',monospace",
    fontSize: 12,
    background: 'none',
    border: `1px solid ${DIM}`,
    color: ON,
    padding: '8px 12px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    minHeight: 36,
  };

  const stepBtn: React.CSSProperties = { ...btn, padding: '6px 11px', minWidth: 34 };

  const label: React.CSSProperties = {
    fontFamily: "'Departure Mono',monospace",
    fontSize: 10.5,
    color: TEXT_DIM,
    letterSpacing: '0.06em',
  };

  const statusText = (() => {
    if (capture === 'blocked') {
      return bn
        ? '! clock edge এসেছিল, কিন্তু WE = 0 — Register C পুরনো state ধরেই রাখল।'
        : '! A clock edge arrived, but WE = 0 — Register C held its old state.';
    }
    if (capture === 'mid-settle') {
      return bn
        ? '✗ output settle করার আগেই edge এসে গেল — Register C একটা অনির্দিষ্ট pattern capture করল। এটাই propagation delay-র timing ঝুঁকি।'
        : '✗ The edge arrived before the output settled — Register C captured an indeterminate pattern. This is the timing hazard propagation delay creates.';
    }
    if (capture === 'ok') {
      return bn
        ? 'ok · clock edge-এ Register C নতুন মান capture করল। এখন সেটাই CPU-র state।'
        : 'ok · On the clock edge Register C captured the new value. That is now CPU state.';
    }
    if (settling) {
      return bn
        ? '… ALU output propagate করছে। কেউ তাকে "শুরু করো" বলেনি — input বদলেছে বলেই সে বদলাচ্ছে।'
        : '… The ALU output is propagating. Nothing told it to "start" — it is changing because its inputs changed.';
    }
    if (stale) {
      return bn
        ? '> ALU output stable, কিন্তু Register C এখনো পুরনো মান ধরে আছে। clock edge ছাড়া কোনো state বদলায় না।'
        : '> The ALU output is stable, but Register C still holds the old value. No state changes without a clock edge.';
    }
    return bn
      ? '> Register C এখন ALU output-এর সাথে মিলে আছে। A, B বা operation বদলে দেখুন।'
      : '> Register C currently matches the ALU output. Try changing A, B, or the operation.';
  })();

  const statusCol = capture === 'mid-settle' || capture === 'blocked'
    ? WARN
    : settling ? WARN : stale ? TEXT_LIT : ON;

  const stepper = (
    name: string,
    val: number,
    set: (n: number) => void,
  ) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ ...label, width: 64 }}>Register {name}</span>
      <button
        style={stepBtn}
        onClick={() => set((val + 7) & 7)}
        aria-label={`decrease register ${name}`}
      >−</button>
      <span
        style={{
          fontFamily: "'Departure Mono',monospace", fontSize: 13, color: ON,
          minWidth: 78, textAlign: 'center',
        }}
      >
        {val} · {bin4(val)}
      </span>
      <button
        style={stepBtn}
        onClick={() => set((val + 1) & 7)}
        aria-label={`increase register ${name}`}
      >+</button>
    </div>
  );

  return (
    <>
      <Instrument
        bnTitle="combinational vs clocked"
        enTitle="combinational vs clocked"
        control={
          <span style={{ fontFamily: "'Departure Mono',monospace", fontSize: 11.5, color: aluCol, whiteSpace: 'nowrap' }}>
            {settling ? (bn ? 'settling…' : 'settling…') : (bn ? 'stable' : 'stable')}
          </span>
        }
      >
        {/* Readouts */}
        <div
          style={{
            display: 'flex', flexWrap: 'wrap', gap: 14,
            padding: '16px 14px', borderBottom: `1px solid #2e392e`,
          }}
        >
          {/* Combinational side */}
          <div style={{ flex: '1 1 190px', minWidth: 170, border: `1px solid ${DIM}`, padding: '12px 14px' }}>
            <div style={{ ...label, marginBottom: 6 }}>
              {bn ? 'COMBINATIONAL — ALU' : 'COMBINATIONAL — ALU'}
            </div>
            <div
              style={{
                fontFamily: "'Departure Mono',monospace", fontSize: 20, color: aluCol,
                textShadow: settling ? 'none' : '0 0 10px rgba(0,210,106,0.4)',
                transition: 'color 120ms linear',
              }}
            >
              {settling ? '~~~~' : bin4(result)}
            </div>
            <div style={{ ...label, marginTop: 6, color: TEXT_LIT }}>
              {settling
                ? (bn ? 'propagating…' : 'propagating…')
                : `= ${result} · ${op}`}
            </div>
          </div>

          {/* Sequential side */}
          <div style={{ flex: '1 1 190px', minWidth: 170, border: `1px solid ${DIM}`, padding: '12px 14px' }}>
            <div style={{ ...label, marginBottom: 6 }}>
              {bn ? 'SEQUENTIAL — REGISTER C' : 'SEQUENTIAL — REGISTER C'}
            </div>
            <div
              style={{
                fontFamily: "'Departure Mono',monospace", fontSize: 20, color: cCol,
                textShadow: '0 0 10px rgba(0,210,106,0.3)',
              }}
            >
              {c === 'X' ? 'XXXX' : bin4(c)}
            </div>
            <div style={{ ...label, marginTop: 6, color: TEXT_LIT }}>
              {c === 'X'
                ? (bn ? 'অনির্দিষ্ট' : 'indeterminate')
                : `= ${c} · ${bn ? 'ধরে রাখা state' : 'held state'}`}
            </div>
          </div>
        </div>

        {/* Inputs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '14px', borderBottom: `1px solid #2e392e` }}>
          {stepper('A', a, setA)}
          {stepper('B', b, setB)}

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ ...label, width: 64 }}>ALU op</span>
            {OPS.map(o => (
              <button
                key={o}
                onClick={() => setOp(o)}
                style={{
                  ...stepBtn,
                  borderColor: op === o ? ON : DIM,
                  color: op === o ? ON : TEXT_DIM,
                }}
              >{o}</button>
            ))}
          </div>
        </div>

        {/* Clock controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setWe(v => !v)}
            style={{ ...btn, borderColor: we ? ON : DIM, color: we ? ON : TEXT_DIM }}
          >
            WE_C = {we ? '1' : '0'}
          </button>
          <button
            onClick={clockEdge}
            style={{ ...btn, borderColor: ON, color: ON }}
          >
            ⌐ {bn ? 'clock edge' : 'clock edge'}
          </button>
          <span style={{ ...label, color: TEXT_LIT, flexBasis: '100%' }}>
            {bn
              ? 'settle হওয়ার আগেই edge চাপলে কী হয়, দেখুন।'
              : 'Try hitting the edge before the output settles.'}
          </span>
        </div>

        {/* Status */}
        <div
          role="status"
          style={{
            fontFamily: "'Departure Mono',monospace", fontSize: 11.5, lineHeight: 1.7,
            color: statusCol, padding: '0 14px 14px',
          }}
          {...(bn ? { lang: 'bn' } : {})}
        >
          {statusText}
        </div>
      </Instrument>
      <Caption
        bn="ALU-র output input বদলানোর সাথে সাথেই বদলায় — clock লাগে না। Register C বদলায় শুধু clock edge-এ, আর তখনও কেবল WE = 1 হলে।"
        en="The ALU output changes the moment its inputs change — no clock needed. Register C changes only on a clock edge, and only when WE = 1."
      />
    </>
  );
}
