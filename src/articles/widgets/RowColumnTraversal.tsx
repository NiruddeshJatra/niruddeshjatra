import { useMemo, useState } from 'react';
import { useLang } from '../context/LanguageContext';
import { Instrument } from '../primitives/Instrument';
import { Caption } from '../primitives/Caption';
import { SegmentedToggle } from '../primitives/SegmentedToggle';

const N = 6;
const LINE_SIZE = 3;

type Mode = 'row' | 'col';

function buildOrder(mode: Mode): number[] {
  const order: number[] = [];
  if (mode === 'row') {
    for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) order.push(i * N + j);
  } else {
    for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) order.push(i * N + j);
  }
  return order;
}

export function RowColumnTraversal() {
  const { bn, num } = useLang();
  const [mode, setMode] = useState<Mode>('row');
  const [step, setStep] = useState(-1);

  const order = useMemo(() => buildOrder(mode), [mode]);

  let hits = 0, misses = 0, lastLine = -1;
  for (let s = 0; s <= step; s++) {
    const addr = order[s];
    const line = Math.floor(addr / LINE_SIZE);
    if (line === lastLine) hits++; else { misses++; lastLine = line; }
  }

  const current = step >= 0 ? order[step] : undefined;

  const changeMode = (m: Mode) => { setMode(m); setStep(-1); };
  const next = () => setStep((s) => Math.min(order.length - 1, s + 1));
  const reset = () => setStep(-1);

  return (
    <>
      <Instrument
        bnTitle="ROW-MAJOR vs COLUMN-MAJOR"
        enTitle="ROW-MAJOR vs COLUMN-MAJOR"
        control={
          <SegmentedToggle
            value={mode}
            onChange={changeMode}
            options={[
              { value: 'row', label: bn ? 'row-major' : 'row-major' },
              { value: 'col', label: bn ? 'column-major' : 'column-major' },
            ]}
          />
        }
      >
        <div className="flex flex-col gap-[14px] py-[18px] px-4">
          <div
            className="grid gap-[3px]"
            style={{ gridTemplateColumns: `repeat(${N}, 28px)`, gridAutoRows: 28, background: '#1b231b', padding: 6, border: '1px solid #2e392e', width: 'fit-content' }}
          >
            {Array.from({ length: N * N }, (_, addr) => {
              const visitedIdx = order.indexOf(addr);
              const isVisited = visitedIdx <= step;
              const isCurrent = addr === current;
              return (
                <div
                  key={addr}
                  className="font-mono text-[9px] flex items-center justify-center"
                  style={{
                    width: 28, height: 28,
                    border: `1px solid ${isCurrent ? '#00d26a' : isVisited ? '#00753f' : '#2e392e'}`,
                    background: isCurrent ? '#16402a' : isVisited ? 'rgba(0,117,63,0.3)' : 'transparent',
                    color: isVisited ? '#00d26a' : '#3a5847',
                  }}
                >
                  {isVisited ? num(visitedIdx + 1) : ''}
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={next}
              disabled={step >= order.length - 1}
              className="well-focus font-mono text-[11.5px]"
              style={{ background: 'none', border: '1px solid #3a5847', color: '#00d26a', padding: '6px 14px', cursor: step >= order.length - 1 ? 'not-allowed' : 'pointer' }}
            >
              {bn ? 'পরের access ▶' : 'next access ▶'}
            </button>
            <button
              onClick={reset}
              className="well-focus font-mono text-[11.5px]"
              style={{ background: 'none', border: '1px solid #3a5847', color: '#8aa893', padding: '6px 14px', cursor: 'pointer' }}
            >
              {bn ? 'reset' : 'reset'}
            </button>
            <span className="font-mono text-[12px]" style={{ color: '#00d26a' }}>{bn ? 'hit' : 'hits'}: {num(hits)}</span>
            <span className="font-mono text-[12px]" style={{ color: '#ff9f5a' }}>{bn ? 'miss' : 'misses'}: {num(misses)}</span>
          </div>
        </div>
      </Instrument>
      <Caption
        bn="Row-major-এ পাশাপাশি address পড়া হয়, তাই একই line বারবার কাজে লাগে — HIT বেশি। Column-major-এ প্রতিবার লাফ দিয়ে নতুন line-এ যেতে হয়, তাই miss অনেক বেড়ে যায়।"
        en="Row-major reads neighbouring addresses, so the same line keeps getting reused — more HITs. Column-major jumps to a different line each step, so misses climb sharply."
      />
    </>
  );
}
