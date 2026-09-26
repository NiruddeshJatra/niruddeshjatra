// Canonical register→disk layer list shared by MemoryPyramid, LatencyScale and
// MemoryLookupCascade — single source so the layers can't drift between widgets
// (or from the article prose).
//
// Deliberately carries NO capacity figures and NO cycle counts. Sizes, cycle
// costs and cache topology vary by architecture, and pinning them here taught
// readers a particular processor's spec sheet instead of the hierarchy itself.
// What every layer does carry is its *role* and its position in the order.
export type MemoryLayerId = 'reg' | 'l1' | 'l2' | 'l3' | 'ram' | 'disk';

export interface MemoryLayerInfo {
  id: MemoryLayerId;
  bn: string;
  en: string;
  /** What the layer is for — qualitative, no numbers. */
  bnRole: string;
  enRole: string;
  /** Illustrative "if a register access took 1 second" distance. Orders of
   *  magnitude for intuition only — not a latency specification. */
  scaledSeconds: number;
  scaledBn: string;
  scaledEn: string;
}

export const MEMORY_LAYERS: MemoryLayerInfo[] = [
  {
    id: 'reg',
    bn: 'Register',
    en: 'Register',
    bnRole: 'execution logic-এর সবচেয়ে কাছে · ধারণক্ষমতা সবচেয়ে কম · latency সবচেয়ে কম',
    enRole: 'closest to the execution logic · smallest capacity · lowest latency',
    scaledSeconds: 1,
    scaledBn: '১ সেকেন্ড',
    scaledEn: '1 second',
  },
  {
    id: 'l1',
    bn: 'L1 Cache',
    en: 'L1 Cache',
    bnRole: 'প্রতিটি core-এর খুব কাছের ছোট cache · প্রায়ই instruction আর data-র জন্য আলাদা ভাগ',
    enRole: 'a small cache very close to each core · often split for instructions and data',
    scaledSeconds: 5,
    scaledBn: 'কয়েক সেকেন্ড',
    scaledEn: 'a few seconds',
  },
  {
    id: 'l2',
    bn: 'L2 Cache',
    en: 'L2 Cache',
    bnRole: 'L1-এর চেয়ে বড়, সাধারণত একটু বেশি latency',
    enRole: 'larger than L1, generally somewhat higher latency',
    scaledSeconds: 30,
    scaledBn: 'প্রায় আধা মিনিট',
    scaledEn: 'about half a minute',
  },
  {
    id: 'l3',
    bn: 'L3 Cache',
    en: 'L3 Cache',
    bnRole: 'আরও বড় cache layer · অনেক multi-core processor-এ core-দের মধ্যে shared',
    enRole: 'a larger cache layer · in many multi-core processors, shared between cores',
    scaledSeconds: 90,
    scaledBn: 'কয়েক মিনিট',
    scaledEn: 'a couple of minutes',
  },
  {
    id: 'ram',
    bn: 'RAM',
    en: 'RAM',
    bnRole: "system-এর main memory · cache-এর চেয়ে অনেক বেশি ধারণক্ষমতা, অনেক বেশি latency",
    enRole: "the system's main memory · far more capacity than cache, far higher latency",
    scaledSeconds: 900,
    scaledBn: 'ঘণ্টাখানেকের কাছাকাছি',
    scaledEn: 'the better part of an hour',
  },
  {
    id: 'disk',
    bn: 'SSD / HDD',
    en: 'SSD / HDD',
    bnRole: 'persistent storage · ধারণক্ষমতা সবচেয়ে বেশি, CPU-র জন্য access সবচেয়ে ধীর',
    enRole: 'persistent storage · the largest capacity, the slowest for the CPU to reach',
    scaledSeconds: 200000,
    scaledBn: 'কয়েক দিন',
    scaledEn: 'days',
  },
];

/** The layers a memory-operand lookup actually walks: caches, then main memory.
 *  Registers are named by the instruction itself — there is no "register miss"
 *  before a cache lookup — and storage sits behind the virtual-memory system,
 *  not behind a cache miss. */
export const LOOKUP_LAYERS = MEMORY_LAYERS.filter(
  (l) => l.id !== 'reg' && l.id !== 'disk',
);
