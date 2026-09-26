import { useState } from 'react';
import { useLang } from '../context/LanguageContext';
import { Instrument } from '../primitives/Instrument';
import { Caption } from '../primitives/Caption';

const ON = '#00d26a';
const DIM = '#3a5847';
const TEXT_DIM = '#6c8873';
const TEXT_LIT = '#8aa893';
const ACTIVE = '#00d26a';
const IDLE = '#8aa893';

const wc = (active: boolean) => (active ? ON : DIM);

interface Step {
  bnTitle: string;
  enTitle: string;
  bn: string;
  en: string;
  // which components are active
  regA: boolean;
  regB: boolean;
  mux: boolean;
  wireIn: boolean;
  alu: boolean;
  wireOut: boolean;
  decoder: boolean;
  wireDec: boolean;
  regC: boolean;
  clockEdge: boolean;
  aluVal: string;
  cVal: string;
}

const STEPS: Step[] = [
  {
    bnTitle: 'current state',
    enTitle: 'current state',
    bn: 'Register A-তে ২ (0010) আর Register B-তে ৩ (0011) state হিসেবে ধরা আছে, আর সেই মান দুটো register-এর output-এ available।',
    en: 'Register A holds 2 (0010) and Register B holds 3 (0011) as stored state, and those values are available at the registers’ outputs.',
    regA: true, regB: true, mux: false, wireIn: false,
    alu: false, wireOut: false, decoder: false, wireDec: false, regC: false,
    clockEdge: false,
    aluVal: '', cVal: '?',
  },
  {
    bnTitle: 'control configures',
    enTitle: 'control configures',
    bn: 'Control logic signal তৈরি করে: MUX-এর select A ও B-কে বেছে নেয়, ALU-কে ADD-এর জন্য configure করা হয়, decoder WE_C = 1 করে। এখনো কোনো clock edge আসেনি।',
    en: 'Control logic asserts its signals: the MUX selects A and B, the ALU is configured for ADD, and the decoder raises WE_C = 1. No clock edge has arrived yet.',
    regA: true, regB: true, mux: true, wireIn: true,
    alu: false, wireOut: false, decoder: true, wireDec: true, regC: false,
    clockEdge: false,
    aluVal: '~~~~', cVal: '?',
  },
  {
    bnTitle: 'combinational logic settles',
    enTitle: 'combinational logic settles',
    bn: 'Signal gate-গুলোর মধ্য দিয়ে propagate করে, আর propagation delay পেরোনোর পর ALU output ৫ (0101)-এ settle করে। কেউ ALU-কে "শুরু করো" বলেনি — input অনুযায়ী সে responding করছিল।',
    en: 'Signals propagate through the gates and, after the propagation delay, the ALU output settles at 5 (0101). Nothing told the ALU to “start” — it was responding to its inputs all along.',
    regA: true, regB: true, mux: true, wireIn: true,
    alu: true, wireOut: true, decoder: true, wireDec: true, regC: false,
    clockEdge: false,
    aluVal: '5 · 0101', cVal: '?',
  },
  {
    bnTitle: 'clock edge — capture',
    enTitle: 'clock edge — capture',
    bn: 'Clock edge এলো। WE_C active থাকায় Register C তার input-এ দাঁড়িয়ে থাকা মানটা capture করল। এই মুহূর্তে ৫ CPU-র state-এর অংশ হলো।',
    en: 'The clock edge arrives. Because WE_C is active, Register C captures the value standing at its input. Only now does 5 become part of the CPU’s state.',
    regA: true, regB: true, mux: true, wireIn: true,
    alu: true, wireOut: true, decoder: true, wireDec: true, regC: true,
    clockEdge: true,
    aluVal: '5 · 0101', cVal: '5 · 0101',
  },
];

const TOTAL = STEPS.length;

export function CPUDatapath() {
  const { bn } = useLang();
  const [step, setStep] = useState(0);

  const s = STEPS[step];

  const regACol = s.regA ? ON : DIM;
  const regBCol = s.regB ? ON : DIM;
  const muxCol = s.mux ? ON : DIM;
  const wireInCol = wc(s.wireIn);
  const aluCol = s.alu ? ON : DIM;
  const wireOutCol = wc(s.wireOut);
  const decCol = s.decoder ? ON : DIM;
  const wireDecCol = wc(s.wireDec);
  const regCCol = s.regC ? ON : DIM;

  const nextStep = () => setStep(v => (v + 1) % TOTAL);
  const reset = () => setStep(0);

  const nextLabelBn = step === TOTAL - 1 ? '↺ ফিরে শুরুতে' : `পরের step (${step + 2}/${TOTAL}) ▶`;
  const nextLabelEn = step === TOTAL - 1 ? '↺ restart' : `next step (${step + 2}/${TOTAL}) ▶`;

  const btnBase: React.CSSProperties = {
    fontFamily: "'Departure Mono',monospace",
    fontSize: 12,
    background: 'none',
    border: `1px solid ${DIM}`,
    color: ON,
    padding: '7px 14px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  };

  return (
    <>
      <Instrument
        bnTitle={`CPU datapath — ${s.bnTitle}`}
        enTitle={`CPU datapath — ${s.enTitle}`}
        control={
          <span style={{ fontFamily: "'Departure Mono',monospace", fontSize: 11.5, color: s.clockEdge ? ON : TEXT_LIT, whiteSpace: 'nowrap' }}>
            step {step + 1}/{TOTAL}
          </span>
        }
      >
        {/* SVG datapath diagram */}
        <div style={{ position: 'relative' }}>
          <svg
            viewBox="0 0 380 250"
            style={{ display: 'block', width: '100%', height: 'auto' }}
            aria-label="CPU datapath: registers A and B feed the ALU through a multiplexer; result returns to register C through data bus, gated by decoder; shared clock line"
          >
            {/* Register A */}
            <rect x={15} y={20} width={100} height={36} fill="none" stroke={regACol} strokeWidth={2} />
            <text x={65} y={33} fill={TEXT_LIT} fontSize={9} fontFamily="Departure Mono,monospace" textAnchor="middle">Register A</text>
            <text x={65} y={48} fill={regACol} fontSize={10} fontFamily="Departure Mono,monospace" textAnchor="middle">2 · 0010</text>

            {/* Register B */}
            <rect x={15} y={90} width={100} height={36} fill="none" stroke={regBCol} strokeWidth={2} />
            <text x={65} y={103} fill={TEXT_LIT} fontSize={9} fontFamily="Departure Mono,monospace" textAnchor="middle">Register B</text>
            <text x={65} y={118} fill={regBCol} fontSize={10} fontFamily="Departure Mono,monospace" textAnchor="middle">3 · 0011</text>

            {/* Wires from Registers to MUX */}
            <path d="M115 38 H150" stroke={wireInCol} strokeWidth={2} fill="none"
              strokeDasharray={s.wireIn ? '6 4' : undefined} />
            <path d="M115 108 H150" stroke={wireInCol} strokeWidth={2} fill="none"
              strokeDasharray={s.wireIn ? '6 4' : undefined} />

            {/* MUX trapezoid */}
            <polygon points="150,25 150,145 180,125 180,45" fill="none" stroke={muxCol} strokeWidth={2} />
            <text x={165} y={88} fill={muxCol} fontSize={8} fontFamily="Departure Mono,monospace"
              textAnchor="middle" transform="rotate(-90 165 88)">MUX</text>

            {/* Wires from MUX to ALU */}
            <path d="M180 60 H210" stroke={wireInCol} strokeWidth={2} fill="none"
              strokeDasharray={s.wireIn ? '6 4' : undefined} />
            <path d="M180 120 H210" stroke={wireInCol} strokeWidth={2} fill="none"
              strokeDasharray={s.wireIn ? '6 4' : undefined} />

            {/* ALU pentagon */}
            <polygon points="210,40 210,80 222,90 210,100 210,140 290,115 290,65"
              fill="none" stroke={aluCol} strokeWidth={2.5} />
            <text x={253} y={94} fill={aluCol} fontSize={11} fontFamily="Departure Mono,monospace" textAnchor="middle">ALU</text>
            {/* ALU computed value */}
            {s.aluVal && (
              <text x={248} y={80} fill={ON} fontSize={9} fontFamily="Departure Mono,monospace" textAnchor="middle"
                style={{ textShadow: '0 0 8px rgba(0,210,106,0.5)' }}>
                {s.aluVal}
              </text>
            )}

            {/* Data bus (vertical line from ALU output) */}
            <path d="M290 90 H330 V194" stroke={wireOutCol} strokeWidth={2} fill="none"
              strokeDasharray={s.wireOut ? '6 4' : undefined} />
            <text x={344} y={130} fill={TEXT_DIM} fontSize={8} fontFamily="Departure Mono,monospace">bus</text>

            {/* Register C */}
            <rect x={265} y={194} width={100} height={36} fill="none" stroke={regCCol} strokeWidth={2} />
            <text x={315} y={207} fill={TEXT_LIT} fontSize={9} fontFamily="Departure Mono,monospace" textAnchor="middle">Register C</text>
            <text x={315} y={222} fill={regCCol} fontSize={10} fontFamily="Departure Mono,monospace" textAnchor="middle">{s.cVal}</text>

            {/* Decoder */}
            <rect x={125} y={194} width={75} height={32} fill="none" stroke={decCol} strokeWidth={2} />
            <text x={162} y={213} fill={decCol} fontSize={9} fontFamily="Departure Mono,monospace" textAnchor="middle">Decoder</text>

            {/* Wire from Decoder to Register C */}
            <path d="M200 210 H265" stroke={wireDecCol} strokeWidth={2} fill="none"
              strokeDasharray={s.wireDec ? '6 4' : undefined} />

            {/* Clock line — only reaches storage elements, never the combinational blocks */}
            <path d="M15 244 H365 M65 244 V126 M330 244 V230"
              stroke={s.clockEdge ? ON : '#3a5847'} strokeWidth={s.clockEdge ? 2 : 1.5} fill="none" strokeDasharray="3 4" />
            <text x={18} y={239} fill={s.clockEdge ? ON : TEXT_DIM} fontSize={8} fontFamily="Departure Mono,monospace">
              {s.clockEdge ? 'clock ⌐ edge' : 'clock'}
            </text>
          </svg>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', borderTop: `1px solid #2e392e`, flexWrap: 'wrap' }}>
          <button onClick={nextStep} style={btnBase}>
            {bn ? nextLabelBn : nextLabelEn}
          </button>
          {step > 0 && (
            <button onClick={reset} style={{ ...btnBase, color: TEXT_LIT }}>
              ↺ reset
            </button>
          )}
          <span style={{ fontFamily: "'Departure Mono',monospace", fontSize: 11.5, color: TEXT_LIT, flex: 1, minWidth: 180 }}>
            {bn ? s.bn : s.en}
          </span>
        </div>
      </Instrument>
      <Caption
        bn="Current state → control configures → combinational logic settles → clock edge → new current state। খেয়াল করুন, clock line শুধু register-এ যায় — MUX বা ALU-তে নয়।"
        en="Current state → control configures → combinational logic settles → clock edge → new current state. Note that the clock line reaches only the registers — never the MUX or the ALU."
      />
    </>
  );
}
