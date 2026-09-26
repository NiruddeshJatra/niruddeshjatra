import { useState } from 'react';
import { useLang } from '../context/LanguageContext';
import { Instrument } from '../primitives/Instrument';
import { Caption } from '../primitives/Caption';

type Mode = 'U' | '→' | 'K';

interface StepConfig {
  user: { bn: string; en: string };
  kern: { bn: string; en: string };
  mode: Mode;
  gate: string;
  narr: { bn: string; en: string };
  btn: { bn: string; en: string };
}

const STEPS: StepConfig[] = [
  {
    user: { bn: 'app library-র read(fd) কল করল', en: "app calls the library's read(fd)" },
    kern: { bn: '—', en: '—' },
    mode: 'U', gate: '│',
    narr: { bn: 'app user mode-এ চলছে — hardware-এ সরাসরি হাত নেই। Library-র wrapper এখন kernel-এ যাওয়ার প্রস্তুতি নিচ্ছে।', en: 'The app runs in user mode — no direct hand on the hardware. The library wrapper now prepares to enter the kernel.' },
    btn: { bn: 'parameter সাজাও ▶', en: 'set up parameters ▶' },
  },
  {
    user: { bn: 'parameter register-এ বসাল (fd, buf, n)', en: 'params placed in registers (fd, buf, n)' },
    kern: { bn: '—', en: '—' },
    mode: 'U', gate: '│',
    narr: { bn: 'কী চাই আর কোথায় দিতে হবে — সব নির্দিষ্ট জায়গায় রেখে দিল।', en: 'What it wants and where to put it — laid out in fixed spots.' },
    btn: { bn: 'syscall instruction fire ▶', en: 'fire syscall instruction ▶' },
  },
  {
    user: { bn: 'syscall — mode flip!', en: 'syscall — mode flip!' },
    kern: { bn: 'CPU kernel mode-এ ঢুকছে', en: 'CPU entering kernel mode' },
    mode: '→', gate: '◉',
    narr: { bn: 'একটা special instruction CPU-কে user থেকে kernel mode-এ নিয়ে গেল। দরজা খুলল।', en: 'A special instruction moved the CPU from user to kernel mode. The gate opens.' },
    btn: { bn: 'handler চালাও ▶', en: 'run the handler ▶' },
  },
  {
    user: { bn: '(অপেক্ষায়, থামানো)', en: '(blocked, waiting)' },
    kern: { bn: 'OS-এর handler disk থেকে পড়ছে', en: 'OS handler reads from disk' },
    mode: 'K', gate: '◉',
    narr: { bn: 'kernel mode-এ OS-এর pre-registered handler আসল কাজটা করছে — hardware ছুঁয়ে ডেটা আনছে।', en: "In kernel mode the OS's pre-registered handler does the real work — touching hardware to fetch the data." },
    btn: { bn: 'result দাও, ফিরে যাও ▶', en: 'place result, return ▶' },
  },
  {
    user: { bn: '(শীঘ্রই জাগবে)', en: '(about to wake)' },
    kern: { bn: 'result বসিয়ে user mode-এ ফেরত', en: 'result placed, returning to user' },
    mode: '→', gate: '◉',
    narr: { bn: 'কাজ শেষ। ফলাফল নির্দিষ্ট জায়গায় রেখে CPU আবার user mode-এ ফিরছে।', en: 'Work done. With the result in place, the CPU flips back to user mode.' },
    btn: { bn: 'app চালিয়ে যাও ▶', en: 'app continues ▶' },
  },
  {
    user: { bn: 'read() ফিরল — buffer-এ ডেটা', en: 'read() returned — data in buffer' },
    kern: { bn: '—', en: '—' },
    mode: 'U', gate: '│',
    narr: { bn: 'app আবার user mode-এ, হাতে ডেটা। এই পুরো round trip-এর দাম কিছু CPU cycle।', en: 'The app is back in user mode with its data. The whole round trip cost some CPU cycles.' },
    btn: { bn: '↺ আবার', en: '↺ again' },
  },
];

export function SyscallDoorway() {
  const { bn } = useLang();
  const [step, setStep] = useState(0);
  const s = STEPS[step];
  const inKern = s.mode === 'K' || s.mode === '→';

  const modeCol = s.mode === 'K' ? '#00d26a' : s.mode === '→' ? '#e0c264' : '#8aa893';
  const modeLabel = s.mode === 'U' ? 'MODE: USER' : s.mode === 'K' ? 'MODE: KERNEL' : 'MODE: SWITCHING';

  const modeControl = (
    <span style={{ fontFamily: "'Departure Mono',monospace", fontSize: 11, color: modeCol, border: `1px solid ${modeCol}`, padding: '3px 8px', whiteSpace: 'nowrap' }}>
      {modeLabel}
    </span>
  );

  return (
    <>
      <Instrument bnTitle="যন্ত্র ০৫ — THE DOORWAY" enTitle="INSTRUMENT 05 — THE DOORWAY" control={modeControl}>
        <div style={{ padding: '20px 16px 10px', display: 'flex', gap: 0, alignItems: 'stretch' }}>
          {/* User mode panel */}
          <div style={{ flex: 1, border: `1px solid ${!inKern ? '#00d26a' : '#3a5847'}`, background: !inKern ? '#16402a' : '#1b231b', padding: '14px 12px', minWidth: 0 }}>
            <div style={{ fontFamily: "'Departure Mono',monospace", fontSize: 10, color: '#8aa893', letterSpacing: '0.08em', marginBottom: 10 }}>USER MODE</div>
            <div style={{ fontFamily: "'Departure Mono',monospace", fontSize: 11.5, color: !inKern ? '#00d26a' : '#8aa893', lineHeight: 1.7, minHeight: 44 }}>{bn ? s.user.bn : s.user.en}</div>
          </div>
          {/* Gate */}
          <div style={{ flex: 'none', width: 44, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <div style={{ width: 1, flex: 1, background: 'repeating-linear-gradient(0deg, #4a493a 0 4px, transparent 4px 8px)' }} />
            <div style={{ fontSize: 16, color: s.gate === '◉' ? '#00d26a' : '#4a493a' }}>{s.gate}</div>
            <div style={{ width: 1, flex: 1, background: 'repeating-linear-gradient(0deg, #4a493a 0 4px, transparent 4px 8px)' }} />
          </div>
          {/* Kernel mode panel */}
          <div style={{ flex: 1, border: `1px solid ${s.mode === 'K' ? '#00d26a' : '#3a5847'}`, background: s.mode === 'K' ? '#16402a' : '#1b231b', padding: '14px 12px', minWidth: 0 }}>
            <div style={{ fontFamily: "'Departure Mono',monospace", fontSize: 10, color: '#8aa893', letterSpacing: '0.08em', marginBottom: 10 }}>KERNEL MODE · OS</div>
            <div style={{ fontFamily: "'Departure Mono',monospace", fontSize: 11.5, color: s.mode === 'K' ? '#00d26a' : (s.kern.en === '—' ? '#55695a' : '#8aa893'), lineHeight: 1.7, minHeight: 44 }}>{bn ? s.kern.bn : s.kern.en}</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', borderTop: '1px solid #2e392e', flexWrap: 'wrap' }}>
          <button
            onClick={() => setStep((step + 1) % 6)}
            style={{ fontFamily: "'Departure Mono',monospace", fontSize: 12, background: 'none', border: '1px solid #3a5847', color: '#00d26a', padding: '7px 14px', cursor: 'pointer', whiteSpace: 'nowrap' }}
          >
            {bn ? s.btn.bn : s.btn.en}
          </button>
          <span style={{ fontFamily: "'Departure Mono',monospace", fontSize: 11.5, color: '#8aa893', flex: 1, minWidth: 180 }}>{bn ? s.narr.bn : s.narr.en}</span>
        </div>
      </Instrument>
      <Caption
        bn="System call = user আর kernel-এর মাঝের নিয়ন্ত্রিত দরজা। শুধু এই দরজা দিয়েই app hardware-এর কাজ OS-কে দিয়ে করায় — mode বদলে, আবার ফিরে।"
        en="A system call is the controlled door between user and kernel. Only through it does an app get the OS to do hardware work — flipping mode and flipping back."
      />
    </>
  );
}
