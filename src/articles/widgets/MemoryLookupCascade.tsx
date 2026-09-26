import { useEffect, useState } from 'react';
import { useLang } from '../context/LanguageContext';
import { Instrument } from '../primitives/Instrument';
import { Caption } from '../primitives/Caption';
import { SegmentedToggle } from '../primitives/SegmentedToggle';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { LOOKUP_LAYERS, type MemoryLayerId } from '../data/memoryLayers';

export function MemoryLookupCascade() {
  const { bn } = useLang();
  const reduced = useReducedMotion();
  const [target, setTarget] = useState<MemoryLayerId>('ram');
  const [revealed, setRevealed] = useState(0);
  const [playing, setPlaying] = useState(false);

  const targetIdx = LOOKUP_LAYERS.findIndex((s) => s.id === target);

  const play = () => {
    setRevealed(0);
    setPlaying(true);
    if (reduced) { setRevealed(targetIdx + 1); setPlaying(false); return; }
  };

  useEffect(() => {
    if (!playing || reduced) return;
    if (revealed > targetIdx) { setPlaying(false); return; }
    const t = setTimeout(() => setRevealed((r) => r + 1), 450);
    return () => clearTimeout(t);
  }, [playing, revealed, targetIdx, reduced]);

  const changeTarget = (t: MemoryLayerId) => { setTarget(t); setRevealed(0); setPlaying(false); };

  return (
    <>
      <Instrument
        bnTitle="THE FULL LOOKUP"
        enTitle="THE FULL LOOKUP"
        control={
          <SegmentedToggle
            value={target}
            onChange={changeTarget}
            options={LOOKUP_LAYERS.map((s) => ({ value: s.id, label: bn ? s.bn : s.en }))}
          />
        }
      >
        <div className="flex flex-col gap-[14px] py-[18px] px-4">
          <div className="flex flex-wrap gap-[6px]">
            {LOOKUP_LAYERS.map((s, i) => {
              if (i > targetIdx) return null;
              const isShown = i < revealed;
              const isFinal = i === targetIdx;
              return (
                <div
                  key={s.id}
                  className="font-mono text-[11.5px]"
                  style={{
                    padding: '8px 12px',
                    border: `1px solid ${isShown ? (isFinal ? '#00d26a' : '#00753f') : '#2e392e'}`,
                    background: isShown ? (isFinal ? '#16402a' : 'rgba(0,117,63,0.25)') : '#1b231b',
                    color: isShown ? '#00d26a' : '#3a5847',
                    opacity: isShown ? 1 : 0.4,
                    transition: 'opacity 0.2s, border-color 0.2s, background 0.2s',
                  }}
                >
                  {bn ? s.bn : s.en} {isShown && !isFinal && (bn ? '· miss' : '· miss')}
                  {isShown && isFinal && (bn ? ' · পাওয়া গেল' : ' · found')}
                </div>
              );
            })}
          </div>
          <button
            onClick={play}
            className="well-focus font-mono text-[12px]"
            style={{ background: 'none', border: '1px solid #3a5847', color: '#00d26a', padding: '7px 16px', cursor: 'pointer', width: 'fit-content' }}
          >
            {bn ? 'CPU data চাইল ▶' : 'CPU requests data ▶'}
          </button>
          {revealed > targetIdx && (
            <div
              className="font-mono text-[12px]"
              style={{ color: '#00d26a', border: '1px dashed #00d26a', padding: '6px 12px', width: 'fit-content', maxWidth: 420, lineHeight: 1.6 }}
              {...(bn ? { lang: 'bn' } : {})}
            >
              {bn
                ? 'যত নিচের layer পর্যন্ত যেতে হয়, অপেক্ষা তত বাড়ে'
                : 'the further down it has to go, the longer the wait'}
            </div>
          )}
        </div>
      </Instrument>
      <Caption
        bn="যে layer-এ data পাওয়া যায়, তার আগের প্রতিটা layer একেকটা miss। উপরের layer-এ পাওয়া গেলে নিচ পর্যন্ত যেতেই হয় না — এজন্যই cache hit মূল্যবান।"
        en="Every layer before the one that has the data is a miss. Found higher up, and the request never travels further down — which is exactly why a cache hit is worth so much."
      />
    </>
  );
}
