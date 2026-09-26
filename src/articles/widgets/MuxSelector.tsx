import { useState } from 'react';
import { useLang } from '../context/LanguageContext';
import { Instrument } from '../primitives/Instrument';
import { Caption } from '../primitives/Caption';

const ON = '#00d26a';
const DIM = '#3a5847';
const TEXT_DIM = '#6c8873';
const TEXT_LIT = '#8aa893';

const SOURCES = [
  { name: 'Register A', val: 2, bits: '0010' },
  { name: 'Register B', val: 3, bits: '0011' },
  { name: 'Register C', val: 5, bits: '0101' },
  { name: 'Register D', val: 9, bits: '1001' },
];

const CODES = ['00', '01', '10', '11'];

const ROW_Y = [10, 48, 86, 124];

export function MuxSelector() {
  const { bn } = useLang();
  const [sel, setSel] = useState(0);

  const chosen = SOURCES[sel];

  const btn: React.CSSProperties = {
    fontFamily: "'Departure Mono',monospace",
    fontSize: 12,
    background: 'none',
    border: `1px solid ${DIM}`,
    color: TEXT_DIM,
    padding: '8px 13px',
    cursor: 'pointer',
    minHeight: 36,
  };

  return (
    <>
      <Instrument
        bnTitle="4→1 multiplexer"
        enTitle="4→1 multiplexer"
        control={
          <span style={{ fontFamily: "'Departure Mono',monospace", fontSize: 11.5, color: ON, whiteSpace: 'nowrap' }}>
            select = {CODES[sel]}
          </span>
        }
      >
        <svg
          viewBox="0 0 360 200"
          style={{ display: 'block', width: '100%', height: 'auto' }}
          aria-label={`Four registers feed a multiplexer; select ${CODES[sel]} routes ${chosen.name} to the output`}
        >
          {SOURCES.map((s, i) => {
            const active = i === sel;
            const col = active ? ON : DIM;
            const y = ROW_Y[i];
            return (
              <g key={s.name}>
                <rect x={8} y={y} width={96} height={28} fill="none" stroke={col} strokeWidth={active ? 2 : 1.5} />
                <text x={56} y={y + 12} fill={active ? TEXT_LIT : TEXT_DIM} fontSize={8} fontFamily="Departure Mono,monospace" textAnchor="middle">{s.name}</text>
                <text x={56} y={y + 23} fill={col} fontSize={9.5} fontFamily="Departure Mono,monospace" textAnchor="middle">{s.val} · {s.bits}</text>
                {/* fan-in wire */}
                <path
                  d={`M104 ${y + 14} H150 L178 ${y + 14 - (y + 14 - 84) * 0.55}`}
                  stroke={col}
                  strokeWidth={active ? 2 : 1.2}
                  fill="none"
                  strokeDasharray={active ? '6 4' : undefined}
                />
              </g>
            );
          })}

          {/* MUX trapezoid */}
          <polygon points="178,26 178,142 206,126 206,42" fill="none" stroke={ON} strokeWidth={2} />
          <text x={192} y={87} fill={ON} fontSize={8} fontFamily="Departure Mono,monospace" textAnchor="middle" transform="rotate(-90 192 87)">MUX</text>

          {/* select line */}
          <path d="M192 175 V142" stroke={ON} strokeWidth={1.5} fill="none" strokeDasharray="3 3" />
          <text x={192} y={190} fill={TEXT_DIM} fontSize={8.5} fontFamily="Departure Mono,monospace" textAnchor="middle">select = {CODES[sel]}</text>

          {/* output */}
          <path d="M206 84 H300" stroke={ON} strokeWidth={2} fill="none" strokeDasharray="6 4" />
          <text x={300} y={74} fill={TEXT_DIM} fontSize={8.5} fontFamily="Departure Mono,monospace">→ ALU input</text>
          <text x={300} y={97} fill={ON} fontSize={11} fontFamily="Departure Mono,monospace" style={{ textShadow: '0 0 8px rgba(0,210,106,0.5)' }}>{chosen.bits}</text>
        </svg>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 14px', borderTop: '1px solid #2e392e', flexWrap: 'wrap' }}>
          <span style={{ fontFamily: "'Departure Mono',monospace", fontSize: 10.5, color: TEXT_DIM, letterSpacing: '0.06em' }}>
            select
          </span>
          {CODES.map((code, i) => (
            <button
              key={code}
              onClick={() => setSel(i)}
              style={{ ...btn, borderColor: sel === i ? ON : DIM, color: sel === i ? ON : TEXT_DIM }}
            >
              {code}
            </button>
          ))}
        </div>

        <div
          style={{ fontFamily: "'Departure Mono',monospace", fontSize: 11.5, lineHeight: 1.7, color: TEXT_LIT, padding: '0 14px 14px' }}
          {...(bn ? { lang: 'bn' } : {})}
        >
          {bn
            ? `> select = ${CODES[sel]}, তাই output-এ ${chosen.name}-এর pattern। বাকি তিনটা register কোথাও "ঠেলাঠেলি" করছে না — selection-টা MUX-এর নিজের gate-এর ভেতরেই ঘটছে, এবং কোনো clock edge লাগেনি।`
            : `> select = ${CODES[sel]}, so the output carries ${chosen.name}'s pattern. The other three registers are not "fighting" over a wire — the selection happens inside the MUX's own gates, and no clock edge was involved.`}
        </div>
      </Instrument>
      <Caption
        bn="select signal বদলান — output সঙ্গে সঙ্গে বদলায়। MUX traffic police নয়, selector।"
        en="Change the select signal — the output follows immediately. A MUX is a selector, not a traffic cop."
      />
    </>
  );
}
