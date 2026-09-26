import { useState } from 'react';
import { useLang } from '../context/LanguageContext';
import { Instrument } from '../primitives/Instrument';
import { Caption } from '../primitives/Caption';

type Gate = 'AND' | 'OR' | 'NOT';
const useReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function calcOut(gate: Gate, A: number, B: number) {
  if (gate === 'AND') return A & B;
  if (gate === 'OR') return A | B;
  return A ? 0 : 1;
}

export function GatePlayground() {
  const { bn, num } = useLang();
  const reduced = useReducedMotion();
  const [gate, setGate] = useState<Gate>('AND');
  const [A, setA] = useState(1);
  const [B, setB] = useState(0);
  const [visited, setVisited] = useState<Record<Gate, Record<string, boolean>>>({ AND: {}, OR: {}, NOT: {} });

  const out = calcOut(gate, A, B);
  const on = '#00d26a', off = '#33473a';
  const conducting = out === 1;
  const flowAnim: React.CSSProperties = (conducting && !reduced) ? { animation: 'flow 0.6s linear infinite' } : {};
  const wDash = '6 6';

  const flipA = () => {
    const A2 = A ? 0 : 1;
    const k = gate === 'NOT' ? String(A2) : A2 + '' + B;
    setVisited((v) => ({ ...v, [gate]: { ...v[gate], [k]: true } }));
    setA(A2);
  };
  const flipB = () => {
    const B2 = B ? 0 : 1;
    const k = A + '' + B2;
    setVisited((v) => ({ ...v, [gate]: { ...v[gate], [k]: true } }));
    setB(B2);
  };
  const switchGate = (g: Gate) => setGate(g);

  const segG = (active: boolean): React.CSSProperties => ({
    background: active ? '#16402a' : 'none', color: active ? '#00d26a' : '#6c8873',
    border: 'none', padding: '5px 12px', cursor: 'pointer',
    fontFamily: "'Departure Mono', monospace", fontSize: '11.5px',
  });
  const inBtn = (v: number): React.CSSProperties => ({
    fontFamily: "'Departure Mono', monospace", fontSize: 13, width: 64, padding: '10px 0', cursor: 'pointer',
    border: `1px solid ${v ? '#00d26a' : '#3a5847'}`, background: v ? '#16402a' : 'none', color: v ? '#00d26a' : '#6c8873',
  });

  const gateControl = (
    <div className="flex" style={{ border: '1px solid #3a5847' }}>
      {(['AND', 'OR', 'NOT'] as Gate[]).map((g) => (
        <button key={g} style={segG(gate === g)} onClick={() => switchGate(g)} className="well-focus">{g}</button>
      ))}
    </div>
  );

  // Blade helpers
  const blade = (cx: number, topY: number, closed: boolean) =>
    closed ? { x: cx, y: topY + 28 } : { x: cx + 16, y: topY + 22 };
  let aB = blade(40, 58, A === 1), bB = blade(40, 112, B === 1);
  if (gate === 'OR') { aB = blade(40, 52, A === 1); bB = blade(110, 52, B === 1); }
  else if (gate === 'NOT') { aB = blade(40, 104, A === 1); bB = { x: 0, y: 0 }; }

  const wTop = conducting || (gate === 'OR' && (A || B)) ? on : off;
  const wMid = gate === 'AND' && A ? (conducting ? on : '#4f7a5f') : off;
  const wOut = conducting ? on : off;
  const aSwCol = A ? on : '#6c8873';
  const bSwCol = B ? on : '#6c8873';
  const gndCol = gate === 'NOT' && A ? on : off;

  // Truth table
  const combos: [number, number?][] = gate === 'NOT' ? [[0], [1]] : [[0, 0], [0, 1], [1, 0], [1, 1]];
  const vkey = gate === 'NOT' ? String(A) : A + '' + B;
  const vis = visited[gate];

  return (
    <>
      <Instrument
        bnTitle="GATE PLAYGROUND"
        enTitle="GATE PLAYGROUND"
        control={gateControl}
      >
        <div className="flex flex-wrap items-center gap-2 p-4">
          {/* Input buttons */}
          <div className="flex flex-col gap-3 items-center flex-none">
            <button style={inBtn(A)} onClick={flipA} className="well-focus">A = {num(A)}</button>
            {gate !== 'NOT' && <button style={inBtn(B)} onClick={flipB} className="well-focus">B = {num(B)}</button>}
          </div>

          {/* Circuit SVG */}
          <div className="flex-1 min-w-[220px] relative">
            <svg viewBox="0 0 300 190" style={{ display: 'block', width: '100%', height: 'auto' }} aria-label="transistor circuit">
              <text x="24" y="20" fill="#6c8873" fontSize="11" fontFamily="Departure Mono,monospace">V+</text>

              {gate === 'AND' && <>
                <path d={`M40 26 V54`} stroke={wTop} strokeWidth="2" fill="none" style={flowAnim} strokeDasharray={wDash} />
                <line x1="40" y1="54" x2="40" y2="58" stroke="#3a5847" strokeWidth="2" />
                <line x1="40" y1="58" x2={aB.x} y2={aB.y} stroke={aSwCol} strokeWidth="2.5" />
                <circle cx="40" cy="58" r="3" fill={aSwCol} /><circle cx="40" cy="86" r="3" fill={aSwCol} />
                <text x="56" y="76" fill={aSwCol} fontSize="11" fontFamily="Departure Mono,monospace">A</text>
                <path d="M40 86 V112" stroke={wMid} strokeWidth="2" fill="none" style={flowAnim} strokeDasharray={wDash} />
                <line x1="40" y1="112" x2={bB.x} y2={bB.y} stroke={bSwCol} strokeWidth="2.5" />
                <circle cx="40" cy="112" r="3" fill={bSwCol} /><circle cx="40" cy="140" r="3" fill={bSwCol} />
                <text x="56" y="130" fill={bSwCol} fontSize="11" fontFamily="Departure Mono,monospace">B</text>
                <path d="M40 140 V160 H150" stroke={wOut} strokeWidth="2" fill="none" style={flowAnim} strokeDasharray={wDash} />
              </>}

              {gate === 'OR' && <>
                <path d="M40 26 V44 H110" stroke={wTop} strokeWidth="2" fill="none" style={flowAnim} strokeDasharray={wDash} />
                <line x1="40" y1="52" x2={aB.x} y2={aB.y} stroke={aSwCol} strokeWidth="2.5" />
                <circle cx="40" cy="52" r="3" fill={aSwCol} /><circle cx="40" cy="80" r="3" fill={aSwCol} />
                <text x="18" y="70" fill={aSwCol} fontSize="11" fontFamily="Departure Mono,monospace">A</text>
                <path d="M40 44 V52 M40 80 V120" stroke={A ? on : off} strokeWidth="2" fill="none" />
                <line x1="110" y1="52" x2={bB.x} y2={bB.y} stroke={bSwCol} strokeWidth="2.5" />
                <circle cx="110" cy="52" r="3" fill={bSwCol} /><circle cx="110" cy="80" r="3" fill={bSwCol} />
                <text x="126" y="70" fill={bSwCol} fontSize="11" fontFamily="Departure Mono,monospace">B</text>
                <path d="M110 44 V52 M110 80 V120" stroke={B ? on : off} strokeWidth="2" fill="none" />
                <path d="M40 120 H110 M75 120 V160 H150" stroke={wOut} strokeWidth="2" fill="none" style={flowAnim} strokeDasharray={wDash} />
              </>}

              {gate === 'NOT' && <>
                <path d="M40 26 V50" stroke="#00d26a" strokeWidth="2" fill="none" />
                <path d="M34 50 h12 l-12 8 h12 l-12 8 h12 l-6 8" stroke="#6c8873" strokeWidth="2" fill="none" />
                <path d="M40 74 V96" stroke={wOut} strokeWidth="2" fill="none" />
                <circle cx="40" cy="96" r="3.5" fill={wOut} />
                <path d="M40 96 H150 V160" stroke={wOut} strokeWidth="2" fill="none" style={flowAnim} strokeDasharray={wDash} />
                <line x1="40" y1="104" x2={aB.x} y2={aB.y} stroke={aSwCol} strokeWidth="2.5" />
                <circle cx="40" cy="104" r="3" fill={aSwCol} /><circle cx="40" cy="132" r="3" fill={aSwCol} />
                <text x="56" y="122" fill={aSwCol} fontSize="11" fontFamily="Departure Mono,monospace">A</text>
                <path d="M40 132 V150 M30 150 H50 M34 155 H46 M38 160 H42" stroke={gndCol} strokeWidth="2" fill="none" />
                <path d="M40 96 V104" stroke={A ? on : off} strokeWidth="2" fill="none" />
              </>}

              <circle cx="170" cy="160" r="13" fill={conducting ? 'rgba(0,210,106,0.25)' : 'none'} stroke={conducting ? on : '#55695a'} strokeWidth="2" />
            </svg>
            <span className="absolute font-mono text-[12px]" style={{ left: '64%', top: '80%', color: conducting ? on : '#55695a' }}>
              out = {num(out)}
            </span>
          </div>

          {/* Gate symbol + truth table */}
          <div className="flex-none flex flex-col items-center gap-[10px]">
            <svg viewBox="0 0 90 60" width="90" height="60" aria-label="gate symbol">
              {gate === 'AND' && <path d="M18 10 H45 A20 20 0 0 1 45 50 H18 Z M6 22 H18 M6 38 H18 M65 30 H84" fill="none" stroke={conducting ? on : '#6c8873'} strokeWidth="2.5" />}
              {gate === 'OR' && <path d="M16 10 Q30 30 16 50 Q45 50 62 30 Q45 10 16 10 M6 22 H20 M6 38 H20 M62 30 H84" fill="none" stroke={conducting ? on : '#6c8873'} strokeWidth="2.5" />}
              {gate === 'NOT' && <>
                <path d="M20 12 V48 L52 30 Z M6 30 H20 M62 30 H84" fill="none" stroke={conducting ? on : '#6c8873'} strokeWidth="2.5" />
                <circle cx="57" cy="30" r="5" fill="none" stroke={conducting ? on : '#6c8873'} strokeWidth="2.5" />
              </>}
            </svg>
            <table style={{ borderCollapse: 'collapse', fontFamily: "'Departure Mono', monospace", fontSize: 12, color: '#8aa893' }}>
              <thead><tr>
                <th style={{ border: '1px solid #2e392e', padding: '3px 9px', color: '#6c8873' }}>A</th>
                {gate !== 'NOT' && <th style={{ border: '1px solid #2e392e', padding: '3px 9px', color: '#6c8873' }}>B</th>}
                <th style={{ border: '1px solid #2e392e', padding: '3px 9px', color: '#6c8873' }}>out</th>
              </tr></thead>
              <tbody>
                {combos.map((c, i) => {
                  const k = c.join('');
                  const o = calcOut(gate, c[0], c[1] ?? 0);
                  const seen = vis[k];
                  const cur = k === vkey;
                  return (
                    <tr key={i} style={{ background: cur ? 'rgba(0,210,106,0.12)' : 'none', color: seen || cur ? '#c8dfd0' : '#55695a' }}>
                      <td style={{ border: '1px solid #2e392e', padding: '3px 9px', textAlign: 'center' }}>{num(c[0])}</td>
                      {gate !== 'NOT' && <td style={{ border: '1px solid #2e392e', padding: '3px 9px', textAlign: 'center' }}>{num(c[1] ?? 0)}</td>}
                      <td style={{ border: '1px solid #2e392e', padding: '3px 9px', textAlign: 'center', color: (seen || cur) && o === 1 ? on : '#8aa893' }}>
                        {seen || cur ? num(o) : '·'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </Instrument>
      <Caption
        bn="Switch-এর ছবি → abstract symbol। Series-এ সাজানো switch AND-এর মতো আচরণ করে, parallel-এ সাজানো switch OR-এর মতো — এটা বোঝার জন্য একটা সরল মডেল।"
        en="Switch picture → abstract symbol. Switches in series behave like AND; switches in parallel behave like OR — a simple model for building intuition."
      />
    </>
  );
}
