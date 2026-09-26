import { useState, useRef } from 'react';
import { useLang } from '../context/LanguageContext';
import { Instrument } from '../primitives/Instrument';
import { Caption } from '../primitives/Caption';

type LatchState = 'one' | 'zero' | 'off' | 'garbage';
function randBit(): LatchState { return Math.random() > 0.5 ? 'one' : 'zero'; }

export function FeedbackLatch() {
  const { bn, num } = useLang();
  const [state, setState] = useState<LatchState>('zero');
  const [powered, setPowered] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const write1 = () => { if (powered) setState('one'); };
  const write0 = () => { if (powered) setState('zero'); };
  const togglePower = () => {
    if (powered) {
      setState('off');
      setPowered(false);
    } else {
      setState('garbage');
      setPowered(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setState(randBit()), 800);
    }
  };

  const Q = state === 'one' ? 1 : state === 'zero' ? 0 : null;
  const on = '#00d26a';
  const dim = '#33473a';
  const dead = '#1a2a1a';

  const gACol = powered ? (Q === 1 ? on : dim) : dead;
  const gBCol = powered ? (Q === 0 ? on : dim) : dead;
  const wQCol = powered ? (Q === 1 ? on : dim) : dead;
  const wQbCol = powered ? (Q === 0 ? on : dim) : dead;

  const qVal = Q !== null ? num(Q) : (state === 'off' ? '×' : '?');
  const qbVal = Q !== null ? num(Q === 1 ? 0 : 1) : (state === 'off' ? '×' : '?');
  const qLabelCol = Q === 1 ? on : (state === 'off' ? '#ff6b6b' : (state === 'garbage' ? '#b87c2a' : dim));
  const qbLabelCol = Q === 0 ? on : (state === 'off' ? '#ff6b6b' : (state === 'garbage' ? '#b87c2a' : dim));

  const stateText = !powered
    ? (bn ? 'no power — state হারিয়ে গেছে' : 'no power — state lost')
    : Q === null ? (bn ? 'state নিশ্চিত নয়...' : 'state unknown...')
    : (bn ? `state ধরে রাখছে: ${num(Q)}` : `storing state: ${Q}`);
  const stateColor = !powered ? '#ff6b6b' : Q === null ? '#b87c2a' : '#6c8873';

  const btnBase: React.CSSProperties = {
    fontFamily: "'Departure Mono',monospace", fontSize: 11.5, padding: '7px 14px', cursor: 'pointer',
  };

  return (
    <>
      <Instrument
        bnTitle="FEEDBACK LATCH"
        enTitle="FEEDBACK LATCH"
        control={
          <span style={{ fontFamily: "'Departure Mono',monospace", fontSize: 11.5, color: stateColor }}>
            {stateText}
          </span>
        }
      >
        <div style={{ opacity: !powered ? 0.5 : 1, transition: 'opacity 0.3s' }}>
          <div style={{ position: 'relative' }}>
            <svg
              viewBox="0 0 360 180"
              style={{ display: 'block', width: '100%', height: 'auto' }}
              aria-label="cross-coupled NOT gates forming a latch"
            >
              {/* Top NOT gate — points right, left side */}
              <path d="M70 40 L70 80 L130 60 Z" fill="#232b23" stroke={gACol} strokeWidth="2.5" />
              <circle cx="136" cy="60" r="5" fill="none" stroke={gACol} strokeWidth="2.5" />
              <text x="82" y="65" fill={gACol} fontSize="12" fontFamily="Departure Mono,monospace">NOT</text>

              {/* Bottom NOT gate — points LEFT, right side */}
              <path d="M290 100 L290 140 L230 120 Z" fill="#232b23" stroke={gBCol} strokeWidth="2.5" />
              <circle cx="224" cy="120" r="5" fill="none" stroke={gBCol} strokeWidth="2.5" />
              <text x="248" y="125" fill={gBCol} fontSize="12" fontFamily="Departure Mono,monospace">NOT</text>

              {/* Q wire: top output → right → down → bottom input */}
              <path d="M141 60 H320 V120 H295" fill="none" stroke={wQCol} strokeWidth="2" />

              {/* Q̄ wire: bottom output → left → up → top input */}
              <path d="M219 120 H30 V60 H70" fill="none" stroke={wQbCol} strokeWidth="2" />
            </svg>

            {/* Absolute Q / Q̄ value labels */}
            <span style={{ position: 'absolute', left: '41%', top: '20%', fontFamily: "'Departure Mono',monospace", fontSize: 13, color: qLabelCol }}>
              Q = {qVal}
            </span>
            <span style={{ position: 'absolute', left: '41%', top: '74%', fontFamily: "'Departure Mono',monospace", fontSize: 13, color: qbLabelCol }}>
              Q̄ = {qbVal}
            </span>
          </div>

          {/* Button footer */}
          <div style={{ display: 'flex', gap: 10, padding: '12px 14px', borderTop: '1px solid #2e392e', flexWrap: 'wrap' }}>
            <button
              onClick={write1} disabled={!powered} className="well-focus"
              style={{ ...btnBase, background: state === 'one' ? '#16402a' : 'none', color: state === 'one' ? on : '#6c8873', border: `1px solid ${state === 'one' ? '#00753f' : '#3a5847'}`, cursor: powered ? 'pointer' : 'not-allowed' }}
            >
              {bn ? 'লিখি ১' : 'write 1'}
            </button>
            <button
              onClick={write0} disabled={!powered} className="well-focus"
              style={{ ...btnBase, background: state === 'zero' ? '#16402a' : 'none', color: state === 'zero' ? on : '#6c8873', border: `1px solid ${state === 'zero' ? '#00753f' : '#3a5847'}`, cursor: powered ? 'pointer' : 'not-allowed' }}
            >
              {bn ? 'লিখি ০' : 'write 0'}
            </button>
            <button
              onClick={togglePower} className="well-focus"
              style={{ ...btnBase, background: 'none', color: powered ? '#ff6b6b' : '#6c8873', border: `1px solid ${powered ? '#5a3a3a' : '#3a5847'}`, marginLeft: 'auto' }}
            >
              {powered ? (bn ? 'power কাটুন' : 'cut power') : (bn ? 'power দিন' : 'power on')}
            </button>
          </div>
        </div>
      </Instrument>
      <Caption
        bn="দুটো NOT gate একে অপরকে ধরে রাখে — দুটো stable state। একটা থেকে অন্যটায় নিতে বাইরে থেকে জোর করে লিখতে হয়। Power কাটলে state আর নিশ্চিত থাকে না; আবার চালু করলে যেকোনো একটায় থিতু হয়।"
        en="Two NOT gates hold each other in place — two stable states. Moving from one to the other takes an outside write. Cut the power and the state is no longer guaranteed; power back on and it settles into either one."
      />
    </>
  );
}
