import { useState } from 'react';
import { useLang } from '../context/LanguageContext';
import { Instrument } from '../primitives/Instrument';
import { Caption } from '../primitives/Caption';
import { Deeper } from '../primitives/Deeper';

const useReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const FLOW_ANIM: React.CSSProperties = { animation: 'flow 0.6s linear infinite' };

export function TransistorSwitch() {
  const { bn, num } = useLang();
  const reduced = useReducedMotion();
  const [gate, setGate] = useState(0);
  const on = gate === 1;

  const gateCol = on ? '#00d26a' : '#6c8873';
  const gateFill = on ? 'rgba(0,210,106,0.2)' : 'none';
  const outWire = on ? '#00d26a' : '#33473a';
  const lampFill = on ? 'rgba(0,210,106,0.25)' : 'none';
  const lampCol = on ? '#00d26a' : '#55695a';
  const dash = on ? '6 6' : undefined;
  const waterCol = on ? '#00d26a' : 'transparent';
  const flowAnim = (on && !reduced) ? FLOW_ANIM : {};

  // Tap blade: vertical (open) or horizontal (closed)
  const tapX1 = on ? 85 : 73, tapY1 = on ? 98 : 110, tapX2 = on ? 85 : 97, tapY2 = on ? 122 : 110;

  const toggleBtn = (
    <button
      onClick={() => setGate((v) => (v ? 0 : 1))}
      className="well-focus font-mono text-[11.5px]"
      style={{
        background: on ? '#16402a' : 'none',
        border: '1px solid #3a5847',
        color: on ? '#00d26a' : '#6c8873',
        padding: '5px 12px',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
      }}
    >
      gate = {num(gate)}
    </button>
  );

  return (
    <>
      <Instrument
        bnTitle="TRANSISTOR, দ্য সুইচ"
        enTitle="TRANSISTOR, THE SWITCH"
        control={toggleBtn}
      >
        <div className="relative">
          <div className="flex items-center flex-wrap">
            {/* Left: Water tap analogy */}
            <svg viewBox="0 0 170 240" style={{ display: 'block', flex: 1, minWidth: 150, height: 'auto' }}
              aria-label="water tap analogy: a small motor turns the tap so water flows or stops">
              <rect x="55" y="14" width="60" height="26" fill="none" stroke="#6c8873" strokeWidth="2" />
              <rect x="58" y="20" width="54" height="17" fill="rgba(0,210,106,0.18)" />
              <path d="M85 40 V96" stroke="#4f7a5f" strokeWidth="3" fill="none" />
              <circle cx="85" cy="110" r="14" fill="none" stroke="#6c8873" strokeWidth="2" />
              <line x1={tapX1} y1={tapY1} x2={tapX2} y2={tapY2} stroke={gateCol} strokeWidth="3" />
              <rect x="118" y="100" width="26" height="20" fill={gateFill} stroke={gateCol} strokeWidth="2" />
              <path d="M118 110 H99" stroke={gateCol} strokeWidth="2" />
              <text x="131" y="136" fill={gateCol} fontSize="9" fontFamily="Departure Mono,monospace" textAnchor="middle">signal</text>
              <path d="M85 124 V186" stroke={waterCol} strokeWidth="3" fill="none" strokeDasharray="4 6" style={flowAnim} />
              <path d="M60 186 L66 216 H104 L110 186" fill="none" stroke="#6c8873" strokeWidth="2" />
              <text x="85" y="232" fill="#55695a" fontSize="10" fontFamily="Departure Mono,monospace" textAnchor="middle">the tap</text>
            </svg>

            {/* Right: n-channel MOSFET */}
            <svg viewBox="0 0 210 240" style={{ display: 'block', flex: 1.2, minWidth: 180, height: 'auto' }}
              aria-label="n-channel MOSFET as a switch: gate voltage forms the channel, current flows drain to source">
              <text x="140" y="16" fill="#6c8873" fontSize="11" fontFamily="Departure Mono,monospace" textAnchor="middle">Vdd</text>
              <path d="M140 22 V39" stroke={outWire} strokeWidth="2" fill="none" strokeDasharray={dash} style={flowAnim} />
              <circle cx="140" cy="51" r="11" fill={lampFill} stroke={lampCol} strokeWidth="2" />
              <path d="M133 44 L147 58 M147 44 L133 58" stroke={lampCol} strokeWidth="1.5" />
              <path d="M140 62 V96 H132 V100" stroke={outWire} strokeWidth="2" fill="none" strokeDasharray={dash} style={flowAnim} />
              <text x="150" y="94" fill="#6c8873" fontSize="11" fontFamily="Departure Mono,monospace">D</text>
              {on && <rect x="129" y="100" width="5" height="32" fill="rgba(0,210,106,0.55)" />}
              <path d="M132 100 V108 M132 112 V120 M132 124 V132" stroke="#8aa893" strokeWidth="3" fill="none" />
              <path d="M132 132 V136 H140 V158" stroke={outWire} strokeWidth="2" fill="none" strokeDasharray={dash} style={flowAnim} />
              <text x="150" y="146" fill="#6c8873" fontSize="11" fontFamily="Departure Mono,monospace">S</text>
              <path d="M140 158 V166 M126 166 H154 M132 172 H148 M137 178 H143" stroke="#6c8873" strokeWidth="2" fill="none" />
              <text x="164" y="172" fill="#6c8873" fontSize="10" fontFamily="Departure Mono,monospace">GND</text>
              <line x1="122" y1="100" x2="122" y2="132" stroke={gateCol} strokeWidth="3" />
              <path d="M122 116 H64" stroke={gateCol} strokeWidth="2" fill="none" />
              <circle cx="56" cy="116" r="5" fill={gateFill} stroke={gateCol} strokeWidth="2" />
              <text x="56" y="100" fill={gateCol} fontSize="11" fontFamily="Departure Mono,monospace" textAnchor="middle">Gate</text>
              <text x="30" y="232" fill="#55695a" fontSize="10" fontFamily="Departure Mono,monospace">n-MOSFET</text>
            </svg>
          </div>
          <span
            className="absolute font-mono text-[11px]"
            style={{ right: '2%', bottom: '10%', maxWidth: '46%', textAlign: 'right', color: lampCol }}
          >
            {on
              ? (bn ? 'D→S current যাচ্ছে — on' : 'D→S current flows — on')
              : (bn ? 'রাস্তা বন্ধ — off' : 'road closed — off')}
          </span>
        </div>
      </Instrument>
      <Caption
        bn="কল আর MOSFET, একই গল্প: Gate-এ ছোট্ট voltage দিলে channel তৈরি হয় — Drain থেকে Source-এ current যায়, bulb জ্বলে। signal সরান, channel মিলিয়ে যায়, রাস্তা বন্ধ।"
        en="The tap and the MOSFET, same story: a small voltage at the Gate forms the channel — current flows Drain→Source, the bulb lights. Remove it, the channel vanishes, the road closes."
      />
      <Deeper
        bnLabel="আরেকটু গভীরে — Source, Drain, Gate"
        enLabel="go deeper — Source, Drain, Gate"
      >
        {bn ? (
          <p lang="bn" className="font-body mt-[14px] mb-0">
            উপরের transistor-টা একটা MOSFET। এর তিনটা terminal:{' '}
            <code>Gate</code>, <code>Source</code> আর <code>Drain</code>। Gate-এ দেওয়া voltage ঠিক করে
            Source আর Drain-এর মাঝখান দিয়ে current কতটা সহজে যেতে পারবে। কোন দিকে current যায়, সেটা
            circuit-এর ওপর নির্ভর করে — "যেদিক দিয়ে ঢোকে সেটাই Source", এমন সরল নিয়ম নেই।
            নামগুলো মুখস্থ করার দরকার নেই — গুরুত্বপূর্ণ ব্যাপারটা নিচেই।
          </p>
        ) : (
          <p className="font-body mt-[14px] mb-0">
            The transistor above is a MOSFET. It has three terminals:{' '}
            <code>Gate</code>, <code>Source</code>, and <code>Drain</code>. The voltage on the Gate controls how
            easily current can flow between Source and Drain. Which way the current flows depends on the
            circuit — there's no simple rule like "Source is where current enters."
            No need to memorize the names — the important part is below.
          </p>
        )}
      </Deeper>
    </>
  );
}
