import { useState } from 'react';
import type { CSSProperties } from 'react';
import { useLang } from '../context/LanguageContext';
import { Instrument } from '../primitives/Instrument';
import { Caption } from '../primitives/Caption';

const ON = '#00d26a';
const OFF = '#33473a';
const IDLE = '#6c8873';
const DIM = '#8aa893';

const PHASES = ['IDLE', 'FETCH 1/2', 'FETCH 2/2', 'DECODE 1/2', 'DECODE 2/2', 'EXECUTE'];
const TOTAL = PHASES.length;

const NARR_BN = [
  'PC ধরে আছে 0x004 — পরের instruction-এর ঠিকানা। ধাপে ধাপে এগোন।',
  'FETCH — PC-র address-টা Address Bus বেয়ে RAM-এ গেল; 0x004-এর ঘর খুলল।',
  'FETCH — ১৩টা bit Data Bus বেয়ে IR-এ জমা হলো; PC নিজে বেড়ে 0x005 হলো।',
  'DECODE — CU IR-এর প্রথম ৪টা bit কেটে নিল: 0001 মানে ADD।',
  'DECODE — control signal সেট হলো: ALU ADD-এর জন্য configure, MUX-এর select A আর B, Reg C-র write enable ১।',
  'EXECUTE — combinational logic settle করে ৫-এ; clock edge-এ Reg C সেটা capture করল। তারপর আবার fetch।',
];

const NARR_EN = [
  'The PC holds 0x004 — the address of the next instruction. Walk through it step by step.',
  "FETCH — the PC's address travels the Address Bus to RAM; the cell at 0x004 opens.",
  'FETCH — 13 bits ride the Data Bus into the IR; the PC increments itself to 0x005.',
  'DECODE — the CU slices the first 4 bits out of the IR: 0001 means ADD.',
  "DECODE — control signals set: the ALU configured for ADD, the MUX selects A and B, Reg C's write enable is 1.",
  'EXECUTE — the combinational logic settles at 5; on the clock edge Reg C captures it. Then fetch again.',
];

const btnBase: CSSProperties = {
  fontFamily: "'Departure Mono',monospace",
  fontSize: 12,
  background: 'none',
  border: '1px solid #3a5847',
  color: ON,
  padding: '7px 14px',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
};

const overlay = (left: string, top: string, size: number, color: string, glow = false): CSSProperties => ({
  position: 'absolute',
  left,
  top,
  fontFamily: "'Departure Mono',monospace",
  fontSize: size,
  color,
  ...(glow ? { textShadow: '0 0 8px rgba(0,210,106,0.5)' } : {}),
});

export function FetchDecodeExecute() {
  const { bn } = useLang();
  const [st, setStep] = useState(0);

  // A wire is "live" only on the exact step it carries signal; it animates then.
  const wire = (live: boolean) => ({
    stroke: live ? ON : OFF,
    strokeDasharray: live ? '6 6' : undefined,
    style: live ? { animation: 'flow 0.65s linear infinite' } : undefined,
  });

  const addr = wire(st === 1);
  const data = wire(st === 2);
  const irCu = wire(st === 3);
  const ctl = { ...wire(st >= 4), style: st === 4 ? { animation: 'flow 0.65s linear infinite' } : undefined };
  const exe = wire(st === 5);

  const pcCol = st <= 1 ? ON : IDLE;
  const irCol = st >= 2 ? (st === 2 ? ON : DIM) : IDLE;
  const cuCol = st === 3 || st === 4 ? ON : IDLE;
  const row0Col = st === 1 ? ON : st > 1 ? DIM : OFF;
  const muxCol = st >= 4 ? ON : IDLE;
  const aluCol = st >= 4 ? ON : IDLE;
  const regACol = st === 5 ? ON : IDLE;
  const regCCol = st === 5 ? ON : IDLE;

  return (
    <>
      <Instrument
        bnTitle="যন্ত্র ০৩ — THE HEARTBEAT"
        enTitle="INSTRUMENT 03 — THE HEARTBEAT"
        control={
          <span style={{ fontFamily: "'Departure Mono',monospace", fontSize: 11.5, color: ON, whiteSpace: 'nowrap' }}>
            {PHASES[st]}
          </span>
        }
      >
        <div style={{ position: 'relative' }}>
          <svg
            viewBox="0 0 380 310"
            style={{ display: 'block', width: '100%', height: 'auto' }}
            aria-label="fetch-decode-execute datapath: the PC addresses RAM over the address bus; the instruction travels the data bus into the IR; the control unit decodes the opcode and asserts control wires to the MUX, ALU and register C; registers A and B pass through the MUX into the ALU and the result latches into register C"
          >
            {/* RAM block */}
            <rect x={14} y={16} width={110} height={108} fill="none" stroke="#4a493a" strokeWidth={2} />
            <text x={20} y={30} fill={IDLE} fontSize={9} fontFamily="Departure Mono,monospace">RAM</text>
            <rect x={20} y={36} width={98} height={24} fill={st === 1 ? 'rgba(0,210,106,0.12)' : 'none'} stroke={row0Col} strokeWidth={1.5} />
            <text x={25} y={47} fill={DIM} fontSize={7} fontFamily="Departure Mono,monospace">0x004</text>
            <text x={25} y={56} fill={DIM} fontSize={7} fontFamily="Departure Mono,monospace">0001001010011</text>
            <rect x={20} y={64} width={98} height={24} fill="none" stroke={OFF} strokeWidth={1.5} />
            <text x={25} y={75} fill="#55695a" fontSize={7} fontFamily="Departure Mono,monospace">0x008</text>
            <text x={25} y={84} fill="#55695a" fontSize={7} fontFamily="Departure Mono,monospace">0000000000010</text>
            <rect x={20} y={92} width={98} height={24} fill="none" stroke={OFF} strokeWidth={1.5} />
            <text x={25} y={103} fill="#55695a" fontSize={7} fontFamily="Departure Mono,monospace">0x00C</text>
            <text x={25} y={112} fill="#55695a" fontSize={7} fontFamily="Departure Mono,monospace">0000000000011</text>

            {/* PC / IR / CU */}
            <rect x={170} y={20} width={70} height={32} fill="none" stroke={pcCol} strokeWidth={2} />
            <text x={176} y={32} fill={DIM} fontSize={8} fontFamily="Departure Mono,monospace">PC</text>
            <rect x={270} y={20} width={96} height={32} fill="none" stroke={irCol} strokeWidth={2} />
            <text x={276} y={32} fill={DIM} fontSize={8} fontFamily="Departure Mono,monospace">IR</text>
            <rect x={270} y={80} width={96} height={32} fill="none" stroke={cuCol} strokeWidth={2} />
            <text x={276} y={92} fill={DIM} fontSize={8} fontFamily="Departure Mono,monospace">Control Unit</text>

            {/* Address bus: PC → RAM */}
            <path d="M170 40 H147 V48 H124" strokeWidth={2} fill="none" {...addr} />
            <text x={128} y={36} fill="#55695a" fontSize={7} fontFamily="Departure Mono,monospace">addr bus</text>

            {/* Data bus: RAM → IR */}
            <path d="M118 56 V132 H255 V36 H270" strokeWidth={2} fill="none" {...data} />
            <text x={200} y={128} fill="#55695a" fontSize={7} fontFamily="Departure Mono,monospace">data bus</text>

            {/* IR → CU */}
            <path d="M318 52 V80" strokeWidth={2} fill="none" {...irCu} />

            {/* Control wires: CU → MUX / ALU / Reg C */}
            <path d="M290 112 V160 H126" strokeWidth={1.5} fill="none" {...ctl} />
            <path d="M318 112 V140 H186 V168" strokeWidth={1.5} fill="none" {...ctl} />
            <path d="M346 112 V226 H310 V240" strokeWidth={1.5} fill="none" {...ctl} />
            <text x={296} y={130} fill="#55695a" fontSize={7} fontFamily="Departure Mono,monospace">control wires</text>

            {/* Registers A / B */}
            <rect x={14} y={164} width={72} height={26} fill="none" stroke={regACol} strokeWidth={2} />
            <text x={20} y={180} fill={DIM} fontSize={8} fontFamily="Departure Mono,monospace">Reg A</text>
            <rect x={14} y={200} width={72} height={26} fill="none" stroke={regACol} strokeWidth={2} />
            <text x={20} y={216} fill={DIM} fontSize={8} fontFamily="Departure Mono,monospace">Reg B</text>

            {/* Reg A/B → MUX */}
            <path d="M86 177 H100 M86 213 H100" strokeWidth={2} fill="none" {...exe} />

            {/* MUX */}
            <polygon points="100,164 100,226 124,208 124,182" fill="none" stroke={muxCol} strokeWidth={2} />
            <text x={109} y={199} fill={muxCol} fontSize={7} fontFamily="Departure Mono,monospace" textAnchor="middle" transform="rotate(-90 109 199)">MUX</text>

            {/* MUX → ALU */}
            <path d="M124 186 H150 M124 204 H150" strokeWidth={2} fill="none" {...exe} />

            {/* ALU */}
            <polygon points="150,168 150,188 158,195 150,202 150,222 222,204 222,186" fill="none" stroke={aluCol} strokeWidth={2.5} />
            <text x={192} y={199} fill={aluCol} fontSize={9} fontFamily="Departure Mono,monospace" textAnchor="middle">ALU</text>

            {/* ALU → Reg C */}
            <path d="M222 195 H285 V240" strokeWidth={2} fill="none" {...exe} />
            <rect x={250} y={240} width={116} height={30} fill="none" stroke={regCCol} strokeWidth={2} />
            <text x={256} y={258} fill={DIM} fontSize={8} fontFamily="Departure Mono,monospace">Reg C</text>

            {/* Shared clock line */}
            <path d="M14 296 H366 M50 296 V226 M112 296 V220 M186 296 V222 M205 296 V29 M310 296 V270"
              stroke="#3a5847" strokeWidth={1.5} fill="none" strokeDasharray="3 4" />
            <text x={18} y={291} fill="#55695a" fontSize={8} fontFamily="Departure Mono,monospace">clock</text>
          </svg>

          {/* Live value overlays, positioned over their SVG boxes */}
          <span style={overlay('53.7%', '12.2%', 11, st === 2 ? ON : DIM)}>{st >= 2 ? '0x005' : '0x004'}</span>
          <span style={overlay('77%', '12.2%', 9, st >= 2 ? (st >= 3 ? ON : DIM) : '#55695a')}>
            {st >= 2 ? '0001001010011' : '—'}
          </span>
          {st >= 3 && <span style={overlay('77%', '31.5%', 10, ON, true)}>0001 = ADD</span>}
          <span style={overlay('18.5%', '55.5%', 10, st === 5 ? ON : DIM)}>2</span>
          <span style={overlay('18.5%', '67.2%', 10, st === 5 ? ON : DIM)}>3</span>
          {st === 5 && <span style={overlay('41%', '50%', 10, ON, true)}>5 · 0101</span>}
          <span style={overlay('78%', '81.5%', 10, st === 5 ? ON : '#55695a')}>{st === 5 ? '5' : '—'}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', borderTop: '1px solid #2e392e', flexWrap: 'wrap' }}>
          <button onClick={() => setStep(s => (s + 1) % TOTAL)} className="well-focus" style={btnBase}>
            {bn ? 'পরের ধাপ ▶' : 'step ▶'}
          </button>
          <button onClick={() => setStep(0)} className="well-focus" style={{ ...btnBase, color: IDLE }}>
            ↺ reset
          </button>
          <span style={{ fontFamily: "'Departure Mono',monospace", fontSize: 11.5, color: DIM, flex: 1, minWidth: 180 }}>
            {bn ? NARR_BN[st] : NARR_EN[st]}
          </span>
        </div>
      </Instrument>
      <Caption
        bn="এক instruction-এর পুরো পথ: PC address দেয় → memory bits ফেরত দেয় → IR ধরে রাখে → CU decode করে control signal সেট করে → datapath result তৈরি করে। নিচের dashed clock line বলে, register কখন নতুন মান capture করবে।"
        en="One instruction's full path: the PC gives an address → memory returns bits → the IR holds them → the CU decodes and sets the control signals → the datapath produces the result. The dashed clock line below marks when registers capture a new value."
      />
    </>
  );
}
