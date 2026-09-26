import { useState } from 'react';
import { useLang } from '../context/LanguageContext';
import { Instrument } from '../primitives/Instrument';
import { Caption } from '../primitives/Caption';
import { MEMORY_LAYERS, type MemoryLayerId } from '../data/memoryLayers';

const MAX_LOG = Math.log10(MEMORY_LAYERS[MEMORY_LAYERS.length - 1].scaledSeconds + 1);

export function LatencyScale() {
  const { bn } = useLang();
  const [sel, setSel] = useState<MemoryLayerId>('ram');
  const active = MEMORY_LAYERS.find((l) => l.id === sel)!;

  return (
    <>
      <Instrument bnTitle="IF THE NEAREST ACCESS = 1 SECOND" enTitle="IF THE NEAREST ACCESS = 1 SECOND">
        <div className="flex flex-col gap-[10px] py-4 px-4">
          {MEMORY_LAYERS.map((l) => {
            const isActive = l.id === sel;
            const widthPct = Math.max(2, (Math.log10(l.scaledSeconds + 1) / MAX_LOG) * 100);
            return (
              <button
                key={l.id}
                onClick={() => setSel(l.id)}
                className="well-focus"
                style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'none', border: 'none', cursor: 'pointer', padding: 0, textAlign: 'left' }}
              >
                <span className="font-mono text-[11px]" style={{ color: isActive ? '#00d26a' : '#6c8873', width: 92, flexShrink: 0 }}>
                  {bn ? l.bn : l.en}
                </span>
                <span style={{ flex: 1, height: 12, background: '#1b231b', border: '1px solid #2e392e', position: 'relative' }}>
                  <span
                    style={{
                      display: 'block', height: '100%', width: `${widthPct}%`,
                      background: isActive ? '#00d26a' : '#33473a',
                      boxShadow: isActive ? '0 0 8px rgba(0,210,106,0.5)' : 'none',
                    }}
                  />
                </span>
                <span className="font-mono text-[11px]" style={{ color: isActive ? '#00d26a' : '#8aa893', width: 96, textAlign: 'right', flexShrink: 0 }}>
                  {bn ? l.scaledBn : l.scaledEn}
                </span>
              </button>
            );
          })}
        </div>
        <div className="font-mono text-[12px] px-4 pb-4" style={{ color: '#8aa893', borderTop: '1px solid #2e392e', paddingTop: 12 }} {...(bn ? { lang: 'bn' } : {})}>
          <span style={{ color: '#00d26a' }}>{bn ? active.bnRole : active.enRole}</span>
        </div>
      </Instrument>
      <Caption
        bn="CPU-র সবচেয়ে কাছের access ১ সেকেন্ড ধরলে দূরের layer-গুলো কতটা দূরে, তার একটা অনুভব। bar-টা log scale-এ আঁকা। এগুলো কোনো hardware-এর মাপ নয় — শুধু order of magnitude বোঝানোর জন্য।"
        en="A feel for how far the distant layers sit if the nearest access took one human second. The bars are log-scaled. These are not hardware measurements — only orders of magnitude."
      />
    </>
  );
}
