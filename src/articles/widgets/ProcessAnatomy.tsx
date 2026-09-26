import { useState } from 'react';
import { useLang } from '../context/LanguageContext';
import { Instrument } from '../primitives/Instrument';
import { Caption } from '../primitives/Caption';

const FRAMES = ['main()', 'parse()', 'loop()', 'calc()', 'leaf()'];
const BLOCKS = ['obj', 'buf', 'arr', 'node', 'img'];

const BTN: React.CSSProperties = {
  fontFamily: "'Departure Mono',monospace",
  fontSize: 10.5,
  background: 'none',
  border: '1px solid #3a5847',
  color: '#00d26a',
  padding: '6px 4px',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
};

export function ProcessAnatomy() {
  const { bn, num } = useLang();
  const [stack, setStack] = useState(1);
  const [heap, setHeap] = useState(1);

  const collision = stack + heap >= 9;

  let narr: string;
  if (collision) {
    narr = bn
      ? 'stack আর heap প্রায় মুখোমুখি! আর একটু হলেই collision — এটাই stack overflow / out-of-memory-র সীমানা।'
      : 'Stack and heap are nearly touching! A bit more and they collide — this is the edge of stack overflow / out-of-memory.';
  } else {
    narr = bn
      ? `stack: ${num(stack)} frame · heap: ${num(heap)} block। call/return stack নাড়ায় (উপর থেকে নিচে), malloc/free heap নাড়ায় (নিচ থেকে উপরে) — দুই দিক একে অপরের দিকে এগোয়।`
      : `stack: ${stack} frames · heap: ${heap} blocks. call/return move the stack (top-down); malloc/free move the heap (bottom-up) — the two grow toward each other.`;
  }

  const row = (label: string, active: boolean) => ({
    label,
    color: active ? '#00d26a' : '#8aa893',
    bg: active ? 'rgba(0,210,106,0.10)' : 'none',
  });

  const frames = FRAMES.slice(0, stack).map((f, i) => row(f, i === stack - 1));
  const heapBlocks = BLOCKS.slice(0, heap).map((b, i) => row(b, i === heap - 1));

  const rowStyle = (r: { color: string; bg: string }): React.CSSProperties => ({
    padding: '4px 8px',
    fontSize: 10.5,
    fontFamily: "'Departure Mono',monospace",
    color: r.color,
    borderBottom: '1px solid #2e392e',
    background: r.bg,
  });

  return (
    <>
      <Instrument
        bnTitle="যন্ত্র ০১ — PROCESS ANATOMY"
        enTitle="INSTRUMENT 01 — PROCESS ANATOMY"
      >
        <div style={{ padding: 16, display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'stretch' }}>
          {/* Address space column */}
          <div style={{ flex: 1, minWidth: 210, display: 'flex', flexDirection: 'column', gap: 0, fontFamily: "'Departure Mono',monospace", fontSize: 10.5 }}>
            <div style={{ color: '#6c8873', letterSpacing: '0.06em', marginBottom: 4 }}>HIGH ADDR ↑</div>
            <div style={{ border: '1px solid #3a5847', borderBottom: 'none', background: 'rgba(0,210,106,0.05)' }}>
              <div style={{ padding: '5px 8px', color: '#8aa893', borderBottom: '1px dashed #2e392e', display: 'flex', justifyContent: 'space-between' }}>
                <span>STACK</span><span style={{ color: '#6c8873' }}>↓ grows down</span>
              </div>
              {frames.map((f, i) => (
                <div key={i} style={rowStyle(f)}>{f.label}</div>
              ))}
            </div>
            <div style={{ flex: 1, minHeight: 26, borderLeft: '1px solid #3a5847', borderRight: '1px solid #3a5847', background: 'repeating-linear-gradient(45deg, #1b231b 0 6px, #1e261e 6px 12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#55695a' }}>· unused ·</div>
            <div style={{ border: '1px solid #3a5847', borderTop: 'none', background: 'rgba(0,210,106,0.05)' }}>
              {heapBlocks.map((b, i) => (
                <div key={i} style={{ ...rowStyle(b), borderTop: '1px solid #2e392e', borderBottom: 'none' }}>{b.label}</div>
              ))}
              <div style={{ padding: '5px 8px', color: '#8aa893', borderTop: '1px dashed #2e392e', display: 'flex', justifyContent: 'space-between' }}>
                <span>HEAP</span><span style={{ color: '#6c8873' }}>↑ grows up</span>
              </div>
            </div>
            <div style={{ padding: '5px 8px', border: '1px solid #2e392e', borderTop: 'none', color: '#8aa893', background: '#1b231b' }}>DATA / BSS · globals</div>
            <div style={{ padding: '5px 8px', border: '1px solid #2e392e', borderTop: 'none', color: '#8aa893', background: '#1b231b' }}>CODE · read-only</div>
            <div style={{ color: '#6c8873', letterSpacing: '0.06em', marginTop: 4 }}>LOW ADDR ↓</div>
          </div>
          {/* Controls column */}
          <div style={{ flex: 1, minWidth: 160, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7 }}>
              <button style={BTN} onClick={() => setStack((s) => Math.min(5, s + 1))}>call f() ↓</button>
              <button style={BTN} onClick={() => setStack((s) => Math.max(0, s - 1))}>return ↑</button>
              <button style={BTN} onClick={() => setHeap((h) => Math.min(5, h + 1))}>malloc() ↑</button>
              <button style={BTN} onClick={() => setHeap((h) => Math.max(0, h - 1))}>free ↓</button>
            </div>
            <div style={{ fontFamily: "'Departure Mono',monospace", fontSize: 11, color: '#8aa893', lineHeight: 1.7, borderTop: '1px dashed #2e392e', paddingTop: 10 }}>
              {narr}
            </div>
          </div>
        </div>
      </Instrument>
      <Caption
        bn="এক process-এর address space-এর একটা conceptual ছবি: উপরে stack, নিচে heap, মাঝে ফাঁকা জায়গা যা দুই দিক ভাগ করে নেয়, আর নিচে code ও global data। Exact বিন্যাস architecture, OS আর runtime ভেদে আলাদা।"
        en="A conceptual picture of a process's address space: stack above, heap below, a gap in the middle they share, and code plus global data at the bottom. The exact arrangement varies by architecture, OS and runtime."
      />
    </>
  );
}
