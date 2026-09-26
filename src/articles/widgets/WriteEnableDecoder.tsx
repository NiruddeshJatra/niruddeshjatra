import { useState } from 'react';
import { useLang } from '../context/LanguageContext';
import { Instrument } from '../primitives/Instrument';
import { Caption } from '../primitives/Caption';

const ON = '#00d26a';
const DIM = '#3a5847';
const TEXT_DIM = '#6c8873';
const TEXT_LIT = '#8aa893';

const NAMES = ['A', 'B', 'C', 'D'];
const CODES = ['00', '01', '10', '11'];
const COL_X = [22, 108, 194, 280];
const BOX_W = 74;

/** The value standing on the datapath, available at every register's input. */
const RESULT = '0101';

export function WriteEnableDecoder() {
  const { bn } = useLang();
  const [dest, setDest] = useState(2); // Register C
  const [held, setHeld] = useState<string[]>(['0000', '0000', '0000', '0000']);

  const captureEdge = () => {
    setHeld(prev => prev.map((v, i) => (i === dest ? RESULT : v)));
  };

  const reset = () => setHeld(['0000', '0000', '0000', '0000']);

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
        bnTitle="decoder → write enable"
        enTitle="decoder → write enable"
        control={
          <span style={{ fontFamily: "'Departure Mono',monospace", fontSize: 11.5, color: ON, whiteSpace: 'nowrap' }}>
            dest = {CODES[dest]} · {NAMES[dest]}
          </span>
        }
      >
        <svg
          viewBox="0 0 376 236"
          style={{ display: 'block', width: '100%', height: 'auto' }}
          aria-label={`An ALU result sits on the datapath reaching all four register inputs; the decoder raises write enable only for Register ${NAMES[dest]}`}
        >
          {/* ALU result on the datapath */}
          <rect x={133} y={6} width={110} height={26} fill="none" stroke={ON} strokeWidth={2} />
          <text x={188} y={23} fill={ON} fontSize={10} fontFamily="Departure Mono,monospace" textAnchor="middle">
            ALU result {RESULT}
          </text>

          {/* Datapath spine — reaches every register input */}
          <path d="M188 32 V56" stroke={ON} strokeWidth={2} fill="none" />
          <path d="M59 56 H317" stroke={ON} strokeWidth={2} fill="none" />
          <text x={324} y={52} fill={TEXT_DIM} fontSize={8} fontFamily="Departure Mono,monospace">datapath</text>

          {NAMES.map((n, i) => {
            const enabled = i === dest;
            const cx = COL_X[i] + BOX_W / 2;
            const col = enabled ? ON : DIM;
            return (
              <g key={n}>
                {/* stub down to the register input — always present, never gated here */}
                <path d={`M${cx} 56 V96`} stroke={ON} strokeWidth={1.4} fill="none" strokeDasharray="4 4" opacity={0.55} />

                {/* register */}
                <rect x={COL_X[i]} y={96} width={BOX_W} height={34} fill="none" stroke={col} strokeWidth={enabled ? 2 : 1.4} />
                <text x={cx} y={109} fill={enabled ? TEXT_LIT : TEXT_DIM} fontSize={8} fontFamily="Departure Mono,monospace" textAnchor="middle">Register {n}</text>
                <text x={cx} y={123} fill={held[i] === RESULT ? ON : TEXT_DIM} fontSize={10} fontFamily="Departure Mono,monospace" textAnchor="middle">{held[i]}</text>

                {/* write-enable line up into the register */}
                <path d={`M${cx} 162 V130`} stroke={col} strokeWidth={enabled ? 2 : 1.2} fill="none" />
                <text x={cx} y={176} fill={col} fontSize={9} fontFamily="Departure Mono,monospace" textAnchor="middle">
                  WE_{n} = {enabled ? '1' : '0'}
                </text>

                {/* decoder fan-out */}
                <path
                  d={`M188 196 L${cx} 182`}
                  stroke={col}
                  strokeWidth={enabled ? 2 : 1}
                  fill="none"
                  opacity={enabled ? 1 : 0.55}
                />
              </g>
            );
          })}

          {/* Decoder */}
          <rect x={138} y={196} width={100} height={28} fill="none" stroke={ON} strokeWidth={2} />
          <text x={188} y={214} fill={ON} fontSize={10} fontFamily="Departure Mono,monospace" textAnchor="middle">Decoder</text>
          <text x={248} y={214} fill={TEXT_DIM} fontSize={8.5} fontFamily="Departure Mono,monospace">dest = {CODES[dest]}</text>
        </svg>

        {/* Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 14px', borderTop: '1px solid #2e392e', flexWrap: 'wrap' }}>
          <span style={{ fontFamily: "'Departure Mono',monospace", fontSize: 10.5, color: TEXT_DIM, letterSpacing: '0.06em' }}>
            destination
          </span>
          {CODES.map((code, i) => (
            <button
              key={code}
              onClick={() => setDest(i)}
              style={{ ...btn, borderColor: dest === i ? ON : DIM, color: dest === i ? ON : TEXT_DIM }}
            >
              {code} · {NAMES[i]}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 14px 12px', flexWrap: 'wrap' }}>
          <button onClick={captureEdge} style={{ ...btn, borderColor: ON, color: ON }}>
            ⌐ {bn ? 'clock edge' : 'clock edge'}
          </button>
          <button onClick={reset} style={{ ...btn, color: TEXT_LIT }}>↺ reset</button>
        </div>

        <div
          style={{ fontFamily: "'Departure Mono',monospace", fontSize: 11.5, lineHeight: 1.7, color: TEXT_LIT, padding: '0 14px 14px' }}
          {...(bn ? { lang: 'bn' } : {})}
        >
          {bn
            ? `> ${RESULT} চারটা register-এরই input-এ পৌঁছে আছে। Decoder সেটাকে কোথাও ঠেলে পাঠাচ্ছে না — সে শুধু WE_${NAMES[dest]} = 1 করে দিচ্ছে। clock edge এলে তাই কেবল Register ${NAMES[dest]}-ই মানটা capture করবে।`
            : `> ${RESULT} is already present at all four register inputs. The decoder does not push it anywhere — it only raises WE_${NAMES[dest]}. So when the clock edge arrives, only Register ${NAMES[dest]} captures the value.`}
        </div>
      </Instrument>
      <Caption
        bn="Datapath মানটাকে সবার কাছে পৌঁছে দেয়; decoder ঠিক করে কার WE active হবে; clock edge ঠিক করে কখন সেটা capture হবে।"
        en="The datapath makes the value available to everyone; the decoder decides whose WE goes high; the clock edge decides when it is captured."
      />
    </>
  );
}
