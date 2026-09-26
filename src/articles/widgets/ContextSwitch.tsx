import { useState } from 'react';
import { useLang } from '../context/LanguageContext';
import { Instrument } from '../primitives/Instrument';
import { Caption } from '../primitives/Caption';

const P1 = { pc: '0x0040', acc: '17' };
const P2 = { pc: '0x0088', acc: '05' };
const EMPTY = { pc: '—', acc: '—' };

type Step = 0 | 1 | 2 | 3;

function cardOn(on: boolean) { return on ? '#00d26a' : '#3a5847'; }
function cardBg(on: boolean) { return on ? '#16402a' : '#1b231b'; }

export function ContextSwitch() {
  const { bn } = useLang();
  const [step, setStep] = useState<Step>(0);

  type CpuState = { pc: string; acc: string };
  type Config = {
    cpu: CpuState; pcb1: CpuState; pcb2: CpuState;
    p1running: boolean; p2running: boolean;
    arrow: string; arrowCol: string; pcb1Col: string; pcb2Col: string;
    narr: string; btn: string;
  };

  const configs: Config[] = [
    {
      cpu: P1, pcb1: EMPTY, pcb2: P2, p1running: true, p2running: false,
      arrow: '◉', arrowCol: '#00d26a', pcb1Col: '#55695a', pcb2Col: '#8aa893',
      narr: bn ? 'P1 (chrome) CPU-তে চলছে, register-এ তার live state। এক টুকরো সময় শেষ হতে চলেছে।' : 'P1 (chrome) is running on the CPU, its live state in the registers. Its time slice is about to end.',
      btn: bn ? '⏱ timer fires — save P1 ▶' : '⏱ timer fires — save P1 ▶',
    },
    {
      cpu: P1, pcb1: P1, pcb2: P2, p1running: true, p2running: false,
      arrow: '↑ save', arrowCol: '#e0c264', pcb1Col: '#e0c264', pcb2Col: '#8aa893',
      narr: bn ? 'timer interrupt! P1-এর execution state (register, program counter) সেভ হচ্ছে — যাতে ফিরে এসে সেখান থেকেই এগোতে পারে।' : "Timer interrupt! P1's execution state (registers, program counter) is being saved — so it can pick up there later.",
      btn: bn ? 'load P2 from PCB2 ▶' : 'load P2 from PCB2 ▶',
    },
    {
      cpu: P2, pcb1: P1, pcb2: P2, p1running: false, p2running: false,
      arrow: '↓ load', arrowCol: '#e0c264', pcb1Col: '#8aa893', pcb2Col: '#e0c264',
      narr: bn ? "PCB2 থেকে P2-র আগের অবস্থা register-এ লোড হচ্ছে। CPU টের পায় না — সে শুধু নতুন value পায়।" : "P2's prior state is loading from PCB2 into the registers. The CPU never notices — it just gets new values.",
      btn: bn ? 'resume as P2 ▶' : 'resume as P2 ▶',
    },
    {
      cpu: P2, pcb1: P1, pcb2: EMPTY, p1running: false, p2running: true,
      arrow: '◉', arrowCol: '#00d26a', pcb1Col: '#8aa893', pcb2Col: '#55695a',
      narr: bn ? 'P2 (spotify) এখন চলছে, ঠিক যেখানে থেমেছিল সেখান থেকে। পুরো switch-টা হলো কয়েক microsecond-এ।' : 'P2 (spotify) is now running, right where it left off. The whole switch took a few microseconds.',
      btn: bn ? '↺ আবার প্রথম থেকে' : '↺ from the top',
    },
  ];

  const c = configs[step];

  return (
    <>
      <Instrument bnTitle="যন্ত্র ০২ — THE SWITCH" enTitle="INSTRUMENT 02 — THE SWITCH">
        <div style={{ padding: '18px 16px 8px' }}>
          <div style={{ display: 'flex', alignItems: 'stretch', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            {/* P1 */}
            <div style={{ flex: 1, minWidth: 150, maxWidth: 210, border: `1px solid ${cardOn(c.p1running)}`, background: cardBg(c.p1running), padding: 12 }}>
              <div style={{ fontFamily: "'Departure Mono',monospace", fontSize: 10.5, color: '#6c8873', letterSpacing: '0.06em', marginBottom: 8 }}>P1 · chrome</div>
              <div style={{ fontFamily: "'Departure Mono',monospace", fontSize: 11.5, color: c.p1running ? '#00d26a' : '#8aa893' }}>{c.p1running ? '● running' : '○ ready'}</div>
              <div style={{ fontFamily: "'Departure Mono',monospace", fontSize: 10, color: '#55695a', marginTop: 10, borderTop: '1px dashed #2e392e', paddingTop: 8 }}>PCB1 saved</div>
              <div style={{ fontFamily: "'Departure Mono',monospace", fontSize: 11, color: c.pcb1Col }}>{`PC ${c.pcb1.pc} / ${c.pcb1.acc}`}</div>
            </div>
            {/* CPU */}
            <div style={{ flex: 'none', width: 120, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <div style={{ fontFamily: "'Departure Mono',monospace", fontSize: 9.5, color: '#6c8873', letterSpacing: '0.06em' }}>CPU REGISTERS</div>
              <div style={{ border: '1px solid #00d26a', background: '#16402a', padding: '8px 10px', fontFamily: "'Departure Mono',monospace", fontSize: 11, color: '#00d26a', textShadow: '0 0 8px rgba(0,210,106,0.4)', textAlign: 'center', minWidth: 96 }}>
                <div>PC {c.cpu.pc}</div>
                <div>ACC {c.cpu.acc}</div>
              </div>
              <div style={{ fontSize: 15, color: c.arrowCol }}>{c.arrow}</div>
            </div>
            {/* P2 */}
            <div style={{ flex: 1, minWidth: 150, maxWidth: 210, border: `1px solid ${cardOn(c.p2running)}`, background: cardBg(c.p2running), padding: 12 }}>
              <div style={{ fontFamily: "'Departure Mono',monospace", fontSize: 10.5, color: '#6c8873', letterSpacing: '0.06em', marginBottom: 8 }}>P2 · spotify</div>
              <div style={{ fontFamily: "'Departure Mono',monospace", fontSize: 11.5, color: c.p2running ? '#00d26a' : '#8aa893' }}>{c.p2running ? '● running' : '○ ready'}</div>
              <div style={{ fontFamily: "'Departure Mono',monospace", fontSize: 10, color: '#55695a', marginTop: 10, borderTop: '1px dashed #2e392e', paddingTop: 8 }}>PCB2 saved</div>
              <div style={{ fontFamily: "'Departure Mono',monospace", fontSize: 11, color: c.pcb2Col }}>{`PC ${c.pcb2.pc} / ${c.pcb2.acc}`}</div>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', borderTop: '1px solid #2e392e', flexWrap: 'wrap' }}>
          <button
            onClick={() => setStep(((step + 1) % 4) as Step)}
            style={{ fontFamily: "'Departure Mono',monospace", fontSize: 12, background: 'none', border: '1px solid #3a5847', color: '#00d26a', padding: '7px 14px', cursor: 'pointer', whiteSpace: 'nowrap' }}
          >
            {c.btn}
          </button>
          <span style={{ fontFamily: "'Departure Mono',monospace", fontSize: 11.5, color: '#8aa893', flex: 1, minWidth: 180 }}>{c.narr}</span>
        </div>
      </Instrument>
      <Caption
        bn={'Context switch: চলতি কাজের execution state সেভ, পরেরজনের state restore। CPU-র "মাথা" বদলে যায়, CPU নিজে জানেও না। এখানে দুই process দেখানো হয়েছে, তবে একই process-এর দুই thread-এর মধ্যেও এটা ঘটে।'}
        en={"A context switch: save the running task's execution state, restore the next one's. The CPU's \"head\" swaps out without the CPU ever knowing. Two processes are shown here, but this happens between two threads of one process too."}
      />
    </>
  );
}
