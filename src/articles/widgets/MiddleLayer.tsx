import { useState } from 'react';
import { useLang } from '../context/LanguageContext';
import { Instrument } from '../primitives/Instrument';
import { Caption } from '../primitives/Caption';

type LangKey = 'java' | 'python';

const DATA: Record<LangKey, { srcFile: string; src: string; bcFile: string; bc: string; vm: string }> = {
  java: {
    srcFile: 'Hello.java',
    src: 'void main() {\n  print("hi");\n}',
    bcFile: 'Hello.class',
    bc: 'getstatic  out\nldc        "hi"\ninvokevirtual',
    vm: 'JVM',
  },
  python: {
    srcFile: 'hello.py',
    src: 'print("hi")',
    bcFile: '__pycache__/hello.pyc',
    bc: 'LOAD_NAME    print\nLOAD_CONST   "hi"\nCALL_FUNCTION 1',
    vm: 'CPython VM',
  },
};

export function MiddleLayer() {
  const { bn } = useLang();
  const [key, setKey] = useState<LangKey>('java');
  const [step, setStep] = useState(0);

  const java = key === 'java';
  const data = DATA[key];
  const bcShown = step >= 1, vmShown = step >= 2, outShown = step >= 3;

  const seg = (on: boolean): React.CSSProperties => ({
    background: on ? '#16402a' : 'none',
    color: on ? '#00d26a' : '#6c8873',
    border: 'none', padding: '5px 12px', cursor: 'pointer',
    fontFamily: "'Departure Mono',monospace", fontSize: 11,
  });
  const card = (on: boolean, minw: number): React.CSSProperties => ({
    flex: 1, minWidth: minw,
    border: `1px solid ${on ? '#00d26a' : '#3a5847'}`,
    background: on ? '#16402a' : '#1b231b',
    padding: '10px 12px',
    boxShadow: on ? '0 0 10px rgba(0,210,106,0.25)' : undefined,
  });
  const arrow = (on: boolean): React.CSSProperties => ({
    flex: 'none', alignSelf: 'center',
    fontFamily: "'Departure Mono',monospace", fontSize: 16,
    color: on ? '#00d26a' : '#3a5847',
  });

  let narr: string, btn: string;
  if (step === 0) {
    narr = bn ? 'source code — মানুষের লেখা, পড়ার মতো।' : 'source code — human-written, readable.';
    btn = 'compile → bytecode ▶';
  } else if (step === 1) {
    narr = bn ? `compiler source-কে bytecode-এ নামাল (${data.bcFile})। এটা CPU-র জন্য নয়, VM-এর জন্য।` : `the compiler lowered source to bytecode (${data.bcFile}). Not for the CPU — for the VM.`;
    btn = bn ? 'VM interpret ▶' : 'VM interprets ▶';
  } else if (step === 2) {
    narr = bn ? `${data.vm} প্রতিটা bytecode instruction পড়ে interpret করছে।` : `${data.vm} reads and interprets each bytecode instruction.`;
    btn = 'output ▶';
  } else {
    narr = bn ? 'output — "hi"। একই bytecode যেকোনো platform-এর VM-এ চলে।' : 'output — "hi". The same bytecode runs on any platform’s VM.';
    btn = bn ? '↺ আবার' : '↺ again';
  }

  const label = (t: string) => (
    <div style={{ fontFamily: "'Departure Mono',monospace", fontSize: 9, color: '#6c8873', letterSpacing: '0.06em', marginBottom: 6 }}>{t}</div>
  );

  return (
    <>
      <Instrument
        bnTitle="যন্ত্র ০২ — THE MIDDLE LAYER"
        enTitle="INSTRUMENT 02 — THE MIDDLE LAYER"
        control={
          <div style={{ display: 'flex', border: '1px solid #3a5847' }}>
            <button onClick={() => { setKey('java'); setStep(0); }} style={seg(java)}>java</button>
            <button onClick={() => { setKey('python'); setStep(0); }} style={seg(!java)}>python</button>
          </div>
        }
      >
        <div style={{ padding: 16, display: 'flex', gap: 8, alignItems: 'stretch', flexWrap: 'wrap', justifyContent: 'center' }}>
          <div style={card(step === 0, 120)}>
            {label(data.srcFile)}
            <div style={{ fontFamily: "'Departure Mono',monospace", fontSize: 10.5, color: '#cfe8d8', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{data.src}</div>
          </div>
          <div style={arrow(bcShown)}>→</div>
          <div style={card(step === 1, 130)}>
            {label(bcShown ? data.bcFile : '—')}
            <div style={{ fontFamily: "'Departure Mono',monospace", fontSize: 10, color: bcShown ? '#cfe8d8' : '#55695a', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{bcShown ? data.bc : '(…)'}</div>
          </div>
          <div style={arrow(vmShown)}>→</div>
          <div style={card(step >= 2, 96)}>
            {label('VM → CPU')}
            <div style={{ fontFamily: "'Departure Mono',monospace", fontSize: 11, color: vmShown ? '#cfe8d8' : '#55695a', lineHeight: 1.7 }}>{vmShown ? data.vm : '—'}</div>
            <div style={{ fontFamily: "'Departure Mono',monospace", fontSize: 16, color: '#00d26a', marginTop: 8, textShadow: outShown ? '0 0 12px rgba(0,210,106,0.5)' : 'none' }}>{outShown ? '"hi"' : ''}</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', borderTop: '1px solid #2e392e', flexWrap: 'wrap' }}>
          <button
            onClick={() => setStep((s) => (s + 1) % 4)}
            style={{ fontFamily: "'Departure Mono',monospace", fontSize: 12, background: 'none', border: '1px solid #3a5847', color: '#00d26a', padding: '7px 14px', cursor: 'pointer', whiteSpace: 'nowrap' }}
          >
            {btn}
          </button>
          <span style={{ fontFamily: "'Departure Mono',monospace", fontSize: 11.5, color: '#8aa893', flex: 1, minWidth: 180 }}>{narr}</span>
        </div>
      </Instrument>
      <Caption
        bn="Source সরাসরি native machine code-এ যায় না — আগে একটা intermediate bytecode-এ নামে, তারপর VM সেটা চালায়। Java আর Python — শেপ একই। VM চাইলে পরে সেই bytecode-এর কিছু অংশ machine code-এও compile করতে পারে।"
        en="Source doesn't go straight to native machine code — it drops to an intermediate bytecode first, and the VM runs that. Java and Python share the shape. A VM can also compile parts of that bytecode to machine code later."
      />
    </>
  );
}
