import { useEffect, useState } from 'react';
import { useLang } from '../context/LanguageContext';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { Instrument } from '../primitives/Instrument';
import { Caption } from '../primitives/Caption';

/**
 * A real keyboard wires its keys as a row/column matrix, not one wire per key.
 * This grid mirrors that: 4 rows x 4 columns = 16 keys addressed by 8 pins.
 */
const GRID: { label: string; code: string }[][] = [
  [{ label: 'esc', code: '0x29' }, { label: '1', code: '0x1E' }, { label: '2', code: '0x1F' }, { label: '3', code: '0x20' }],
  [{ label: 'Q', code: '0x14' }, { label: 'W', code: '0x1A' }, { label: 'E', code: '0x08' }, { label: 'R', code: '0x15' }],
  [{ label: 'A', code: '0x04' }, { label: 'S', code: '0x16' }, { label: 'D', code: '0x07' }, { label: 'F', code: '0x09' }],
  [{ label: 'Z', code: '0x1D' }, { label: 'X', code: '0x1B' }, { label: 'C', code: '0x06' }, { label: '␣', code: '0x2C' }],
];
const ROWS = GRID.length;
const COLS = GRID[0].length;

type Pressed = { r: number; c: number } | null;

export function KeyMatrixScan() {
  const { bn, num } = useLang();
  const [row, setRow] = useState(0);
  const [pressed, setPressed] = useState<Pressed>({ r: 2, c: 0 });
  const [latched, setLatched] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!running) return;
    const iv = setInterval(() => setRow((r) => (r + 1) % ROWS), reduced ? 200 : 460);
    return () => clearInterval(iv);
  }, [running, reduced]);

  // The chip only sees the key when the energized row is the pressed key's row.
  const detected = pressed !== null && pressed.r === row;

  useEffect(() => {
    if (detected && pressed) setLatched(GRID[pressed.r][pressed.c].code);
  }, [detected, pressed]);

  const pressedKey = pressed ? GRID[pressed.r][pressed.c] : null;
  const outByte = latched ?? (detected && pressedKey ? pressedKey.code : null);
  // A column reads high only while its row is energized and a key on it is down.
  const colLive = (c: number) => detected && pressed !== null && pressed.c === c;

  const reset = () => { setRunning(false); setRow(0); setLatched(null); };

  let narr: string;
  if (!pressed) {
    narr = bn
      ? 'একটা key চাপুন (click), তারপর "run scan" চালিয়ে দেখুন chip কীভাবে সেটা ধরে।'
      : 'Click a key to hold it down, then "run scan" and watch the chip catch it.';
  } else if (outByte) {
    narr = bn
      ? `সারি ${num(pressed.r + 1)} + কলাম ${num(pressed.c + 1)} — এই সংযোগেই ${pressedKey!.label}। lookup → byte ${outByte} USB-তে গেল।`
      : `row ${pressed.r + 1} + column ${pressed.c + 1} — that intersection is ${pressedKey!.label}. Lookup → byte ${outByte} went out over USB.`;
  } else {
    narr = bn
      ? `chip সারি ${num(row + 1)}/${num(ROWS)}-এ current দিচ্ছে, সব কলাম একসাথে পড়ছে… সারি ${num(pressed.r + 1)}-এ পৌঁছালে ধরা পড়বে।`
      : `the chip is energizing row ${row + 1}/${ROWS} and reading all columns at once… it will catch the key when it reaches row ${pressed.r + 1}.`;
  }

  const btn = (accent: boolean): React.CSSProperties => ({
    fontFamily: "'Departure Mono',monospace", fontSize: 12, background: 'none',
    border: '1px solid #3a5847', color: accent ? '#00d26a' : '#6c8873',
    padding: '7px 14px', cursor: 'pointer', whiteSpace: 'nowrap',
  });
  const tag = (t: string) => (
    <div style={{ fontFamily: "'Departure Mono',monospace", fontSize: 9, color: '#6c8873', letterSpacing: '0.06em' }}>{t}</div>
  );

  return (
    <>
      <Instrument
        bnTitle="যন্ত্র ০১ — THE SCAN"
        enTitle="INSTRUMENT 01 — THE SCAN"
        control={
          <span style={{ fontFamily: "'Departure Mono',monospace", fontSize: 11, color: '#8aa893', whiteSpace: 'nowrap' }}>
            {bn ? `সারি ${num(row + 1)}/${num(ROWS)}` : `row ${row + 1}/${ROWS}`}
          </span>
        }
      >
        <div style={{ padding: 16, display: 'flex', gap: 18, flexWrap: 'wrap', alignItems: 'flex-start' }}>
          {/* Matrix */}
          <div style={{ flex: 1, minWidth: 210, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {tag(bn ? 'KEY MATRIX · সারি × কলাম' : 'KEY MATRIX · rows × columns')}
            <div style={{ display: 'flex', gap: 6 }}>
              {/* Row-drive pins */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {GRID.map((_, r) => (
                  <div
                    key={r}
                    style={{
                      width: 20, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: "'Departure Mono',monospace", fontSize: 9,
                      border: `1px solid ${row === r ? '#00d26a' : '#2e392e'}`,
                      background: row === r ? '#16402a' : 'transparent',
                      color: row === r ? '#00d26a' : '#55695a',
                      boxShadow: row === r ? '0 0 6px rgba(0,210,106,0.4)' : 'none',
                    }}
                  >
                    R{r + 1}
                  </div>
                ))}
              </div>
              {/* Keys + column-sense pins */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {GRID.map((keys, r) => (
                  <div key={r} style={{ display: 'flex', gap: 4 }}>
                    {keys.map((k, c) => {
                      const isDown = pressed?.r === r && pressed?.c === c;
                      const lit = isDown && row === r;
                      return (
                        <button
                          key={k.label}
                          onClick={() => { setPressed(isDown ? null : { r, c }); setLatched(null); }}
                          aria-pressed={isDown}
                          aria-label={`key ${k.label}`}
                          style={{
                            fontFamily: "'Departure Mono',monospace", fontSize: 11,
                            width: 36, height: 30, cursor: 'pointer',
                            background: lit ? '#16402a' : isDown ? '#1d3020' : row === r ? '#26332a' : '#1b231b',
                            border: `1px solid ${lit ? '#00d26a' : isDown ? '#6c8873' : '#3a5847'}`,
                            color: lit ? '#00d26a' : isDown ? '#cfe8d8' : '#8aa893',
                            boxShadow: lit ? '0 0 8px rgba(0,210,106,0.45)' : 'none',
                          }}
                        >
                          {k.label}
                        </button>
                      );
                    })}
                  </div>
                ))}
                <div style={{ display: 'flex', gap: 4, marginTop: 2 }}>
                  {Array.from({ length: COLS }, (_, c) => (
                    <div
                      key={c}
                      style={{
                        width: 36, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: "'Departure Mono',monospace", fontSize: 8,
                        border: `1px solid ${colLive(c) ? '#00d26a' : '#2e392e'}`,
                        background: colLive(c) ? '#16402a' : 'transparent',
                        color: colLive(c) ? '#00d26a' : '#55695a',
                        boxShadow: colLive(c) ? '0 0 6px rgba(0,210,106,0.5)' : 'none',
                      }}
                    >
                      C{c + 1}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ fontFamily: "'Departure Mono',monospace", fontSize: 10, color: '#6c8873', lineHeight: 1.6 }}>
              {bn
                ? `${num(ROWS)}×${num(COLS)} = ${num(ROWS * COLS)}টা key, মাত্র ${num(ROWS + COLS)}টা pin-এ`
                : `${ROWS}×${COLS} = ${ROWS * COLS} keys on just ${ROWS + COLS} pins`}
            </div>
          </div>

          {/* Chip readout */}
          <div style={{ flex: 'none', width: 152, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {tag('CHIP')}
            <div style={{ border: '1px solid #2e392e', padding: '8px 10px', fontFamily: "'Departure Mono',monospace", fontSize: 10.5, color: detected ? '#00d26a' : '#8aa893' }}>
              {pressed == null
                ? (bn ? 'সব কলাম শান্ত' : 'all columns quiet')
                : detected
                  ? (bn ? `C${pressed.c + 1}-এ voltage!` : `voltage on C${pressed.c + 1}!`)
                  : (bn ? 'কিছু নেই…' : 'nothing yet…')}
            </div>
            <div>
              {tag('LOOKUP')}
              <div style={{ fontFamily: "'Departure Mono',monospace", fontSize: 10.5, color: outByte ? '#cfe8d8' : '#55695a', marginTop: 4 }}>
                {outByte && pressed ? `R${pressed.r + 1}·C${pressed.c + 1} → ${pressedKey!.label}` : '—'}
              </div>
            </div>
            <div
              style={{
                border: `1px solid ${outByte ? '#00d26a' : '#3a5847'}`,
                background: outByte ? '#16402a' : '#1b231b',
                padding: '10px 12px', textAlign: 'center',
              }}
            >
              {tag('USB OUT')}
              <div style={{ fontFamily: "'Departure Mono',monospace", fontSize: 15, marginTop: 4, color: outByte ? '#00d26a' : '#55695a', textShadow: outByte ? '0 0 8px rgba(0,210,106,0.5)' : 'none' }}>
                {outByte ?? '—'}
              </div>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', borderTop: '1px solid #2e392e', flexWrap: 'wrap' }}>
          <button onClick={() => setRunning((r) => !r)} style={btn(true)}>{running ? '⏸ pause' : 'run scan ▶'}</button>
          <button onClick={() => setRow((r) => (r + 1) % ROWS)} style={btn(true)}>{bn ? 'পরের সারি ▶' : 'step row ▶'}</button>
          <button onClick={reset} style={btn(false)}>↺ reset</button>
          <span style={{ fontFamily: "'Departure Mono',monospace", fontSize: 11.5, color: '#8aa893', flex: 1, minWidth: 180 }}>{narr}</span>
        </div>
      </Instrument>
      <Caption
        bn="প্রতিটা key-এর আলাদা তার নেই। Chip একটা করে সারিতে current পাঠায় আর সব কলাম একসাথে পড়ে — চাপা key যেই সারিতে, সেই সারির পালা এলেই তার কলামে voltage ধরা পড়ে। সারি আর কলামের সংযোগ থেকেই বোঝা যায় কোন key — আর সেই key-এর জন্য HID usage code পাঠানো হয় (এগুলো ASCII নয়)।"
        en="There is no wire per key. The chip energizes one row at a time and reads every column at once — when the pressed key's row comes around, its column reads high. That row-and-column intersection is what identifies the key — and the HID usage code for that key is what gets reported (these are not ASCII values)."
      />
    </>
  );
}
