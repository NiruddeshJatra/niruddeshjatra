import type { ReactNode } from 'react';
import { useLang } from '../context/LanguageContext';
import { Section } from '../primitives/Section';
import { Term } from '../primitives/Term';
import { Diagram } from '../primitives/Diagram';
import { Recap } from '../primitives/Recap';
import { RelayNav, SERIES_HUB_CARD } from '../primitives/RelayNav';
import { Colophon } from '../primitives/Colophon';
import { MemoryPyramid } from '../widgets/MemoryPyramid';
import { LatencyScale } from '../widgets/LatencyScale';
import { CacheLineLocality } from '../widgets/CacheLineLocality';
import { RowColumnTraversal } from '../widgets/RowColumnTraversal';
import { SRAMvsDRAM } from '../widgets/SRAMvsDRAM';
import { MemoryLookupCascade } from '../widgets/MemoryLookupCascade';

const LINK = { color: '#00753F' };

/* ── shared flow art, identical in both languages ─────────────────────── */

const ART_TRADEOFF = `Very fast + very large
→ very expensive

Very fast + inexpensive
→ small capacity

Very large + inexpensive
→ higher latency`;

const ART_STACK = `Registers
   ↓
L1 Cache
   ↓
L2 Cache
   ↓
L3 Cache
   ↓
RAM
   ↓
SSD / HDD`;

const ART_DISTANCE = `Closer to the CPU
→ generally lower latency

Farther down the hierarchy
→ generally higher latency`;

const ART_SEQ = `arr[0]
arr[1]
arr[2]
arr[3]
...`;

const ART_ROW = `arr[0][0]
arr[0][1]
arr[0][2]
arr[0][3]
...`;

const ART_COL = `arr[0][0]
arr[1][0]
arr[2][0]
arr[3][0]
...`;

const ART_STRIDE = `2048 × 4 = 8192 bytes`;

const ART_TECH = `SRAM → faster, larger per-bit footprint, more expensive per bit
DRAM → slower, denser, cheaper per bit`;

const ART_VOLATILE = `Volatile
→ requires power to retain state

Non-volatile
→ can retain state without continuous power`;

const ART_LOOKUP = `CPU
 ↓
L1
 ↓
L2
 ↓
L3
 ↓
RAM`;

export function MemoryHierarchy() {
  const { bn } = useLang();

  const bodyStyle = bn
    ? { fontFamily: "'Anek Bangla','Anek Latin',sans-serif" }
    : { fontFamily: "'Anek Latin',sans-serif" };

  const p = (s: string | ReactNode) => <p style={{ margin: '0 0 16px', ...bodyStyle }}>{s}</p>;

  const mono = (s: string) => (
    <span style={{ fontFamily: "'Departure Mono',monospace", fontSize: '0.85em' }}>{s}</span>
  );

  const blockquote = (s: ReactNode) => (
    <blockquote style={{ margin: '0 0 20px', padding: '12px 18px', borderLeft: '3px solid #c9bda0', background: 'rgba(255,252,243,0.5)', color: '#3c382b', ...bodyStyle }}>
      {s}
    </blockquote>
  );

  const ul = (items: ReactNode[]) => (
    <ul style={{ margin: '0 0 20px', paddingLeft: 24, ...bodyStyle }}>
      {items.map((it, i) => <li key={i} style={{ marginBottom: 8 }}>{it}</li>)}
    </ul>
  );

  const codeBlock = (s: string) => (
    <pre style={{ fontFamily: "'Departure Mono',monospace", fontSize: '12.5px', background: '#232b23', color: '#00d26a', padding: '15px 20px', margin: '0 0 20px', overflowX: 'auto', border: '1px solid #4a493a' }}>
      {s}
    </pre>
  );

  const h3 = (s: string) => (
    <h3 style={{ fontFamily: "'Departure Mono',monospace", fontSize: '13px', letterSpacing: '0.08em', color: '#5a5444', margin: '30px 0 14px' }}>{s}</h3>
  );

  /* The three questions the whole article turns on. */
  const threeQuestions = (
    <aside
      style={{ margin: '44px 0 10px', border: '2px solid #00753F', padding: '22px 24px', background: 'rgba(255,252,243,0.55)', ...bodyStyle }}
      {...(bn ? { lang: 'bn' } : {})}
    >
      <div style={{ fontFamily: "'Departure Mono',monospace", fontSize: '11.5px', letterSpacing: '0.1em', color: '#00753F', marginBottom: 14, textTransform: 'uppercase' }}>
        {bn ? '// memory নিয়ে তিনটা প্রশ্ন' : '// three questions about memory'}
      </div>
      <p style={{ margin: '0 0 12px', ...bodyStyle }}>
        {bn
          ? 'কোনো storage layer নিয়ে ভাবার সময় তিনটা আলাদা প্রশ্ন করুন:'
          : 'When thinking about a storage layer, ask three separate questions:'}
      </p>
      <p style={{ margin: '0 0 8px', ...bodyStyle }}>
        {bn ? <><strong>কত দ্রুত data পাওয়া যায়?</strong> → Latency</> : <><strong>How quickly can we get the data?</strong> → Latency</>}
      </p>
      <p style={{ margin: '0 0 8px', ...bodyStyle }}>
        {bn ? <><strong>কত data রাখা যায়?</strong> → Capacity</> : <><strong>How much data can it hold?</strong> → Capacity</>}
      </p>
      <p style={{ margin: '0 0 12px', ...bodyStyle }}>
        {bn ? <><strong>প্রতি unit capacity-র জন্য খরচ কত?</strong> → Cost</> : <><strong>How expensive is each unit of capacity?</strong> → Cost</>}
      </p>
      <p style={{ margin: 0, ...bodyStyle }}>
        {bn
          ? 'Memory hierarchy মূলত এই তিনটার মধ্যে balance করার একটা engineering সমাধান।'
          : 'The memory hierarchy is largely an engineering solution for balancing these three.'}
      </p>
    </aside>
  );

  return (
    <article style={{ marginTop: 40, fontSize: '16.5px', lineHeight: 1.9 }}>
      {/* ── Hook ─────────────────────────────────────────────────────── */}
      <div>
        {bn ? (
          <div lang="bn" style={bodyStyle}>
            {p('আপনার laptop-এ কি একটাই memory আছে?')}
            {p('স্বাভাবিক উত্তর — হ্যাঁ, RAM। ১৬ GB বা ৩২ GB, যা-ই হোক।')}
            {p('কিন্তু আসলে laptop-এ এই মুহূর্তে কয়েক রকমের storage একসাথে কাজ করছে। কিছু এত ছোট যে সবমিলিয়ে সামান্য কয়েকটা value ধরে, কিন্তু CPU-র execution logic-এর একদম গায়ে লাগানো। কিছু এত বড় যে টেরাবাইট পর্যন্ত ধরে, কিন্তু সেখান থেকে data আনতে CPU-কে তুলনায় অনেক বেশি অপেক্ষা করতে হয়।')}
            {p(<>কেন এই ব্যবস্থা? <a href="/writing/heartbeat-fde" style={LINK}>আগের আর্টিকেলে</a> দেখেছি একটা instruction কীভাবে fetch, decode আর execute হয়। কিন্তু সেই instruction আর data-গুলো থাকে কোথায়, আর একটাই memory দিয়ে কেন কাজ চলে না? এটাই আজকের গল্প।</>)}
          </div>
        ) : (
          <div style={bodyStyle}>
            {p('Does your laptop have just one memory?')}
            {p('The natural answer — yes, RAM. 16 GB or 32 GB, whatever it is.')}
            {p("But in reality several kinds of storage are working at once in there. Some are so small they hold only a handful of values, but they sit right against the CPU's execution logic. Some are so large they hold terabytes, but the CPU has to wait far longer for anything that comes from them.")}
            {p(<>Why this arrangement? In the <a href="/writing/heartbeat-fde" style={LINK}>last article</a> we followed an instruction through fetch, decode and execute. But where do those instructions and their data actually live, and why can't one memory do the whole job? That's today's story.</>)}
          </div>
        )}
      </div>

      <Section num="01" bnH2="কেন একটাই memory দিয়ে হয় না?" enH2="Why can't we just have one memory?">
        {bn ? (
          <div lang="bn" style={bodyStyle}>
            {p('সোজা প্রশ্ন:')}
            {p(<strong>একটাই বিশাল memory বানিয়ে সেটাকে CPU-র সবচেয়ে কাছের storage-এর মতো দ্রুত বানানো যায় না?</strong>)}
            {p('সমস্যাটা engineering trade-off-এর।')}
            {p('Memory design-এ আমরা একসাথে চাই:')}
            {ul([
              <><strong>কম latency</strong> — data খুব দ্রুত পাওয়া যাবে</>,
              <><strong>বেশি capacity</strong> — অনেক data রাখা যাবে</>,
              <><strong>কম cost</strong> — একই capacity-র জন্য খরচ নাগালের মধ্যে থাকবে</>,
            ])}
            {p('কোনো একটা storage technology একসাথে এই সব দিকেই সেরা হতে পারে না।')}
            <Diagram art={ART_TRADEOFF} bnLabel="trade-off" enLabel="trade-off" />
            {p('তাই computer engineer-রা একটাই memory technology বেছে নেয়নি। বরং বিভিন্ন trade-off-এর storage-কে স্তরে স্তরে সাজানো হয়েছে — সবচেয়ে ছোট আর দ্রুত storage CPU-র সবচেয়ে কাছে, বড় আর ধীর storage আরও নিচে।')}
            {p(<>এই layered বিন্যাসটাই <strong>Memory Hierarchy</strong>।</>)}
            {blockquote(<><strong>এটা কোনো কঠিন rule নয় যে প্রতিটা computer-এ ঠিক একই সংখ্যক layer থাকবে।</strong> Architecture অনুযায়ী স্তরের সংখ্যা, মাপ, কোনটা shared আর কোনটা নয় — সব বদলাতে পারে। আমরা এখানে একটা simplified hierarchy নিয়ে কাজ করছি, যাতে মূল ধারণাটা পরিষ্কার হয়।</>)}
          </div>
        ) : (
          <div style={bodyStyle}>
            {p('Simple question:')}
            {p(<strong>Why not build one huge memory and make it as fast as the storage closest to the CPU?</strong>)}
            {p('The problem is engineering trade-offs.')}
            {p('A memory technology has to balance things like:')}
            {ul([
              <><strong>Low latency</strong> — data arrives quickly</>,
              <><strong>High capacity</strong> — lots of data can be stored</>,
              <><strong>Low cost</strong> — the system stays affordable</>,
            ])}
            {p('No single storage technology is simultaneously best at all of these.')}
            <Diagram art={ART_TRADEOFF} bnLabel="trade-off" enLabel="trade-off" />
            {p('So computer engineers do not rely on one memory technology. Instead, storage with different trade-offs is arranged in layers — the smallest and fastest sits closest to the CPU, larger and slower sits further away.')}
            {p(<>That layered arrangement is the <strong>Memory Hierarchy</strong>.</>)}
            {blockquote(<><strong>There is no universal rule that every computer has exactly the same number of memory layers.</strong> The number of levels, their sizes, whether they are shared — all of it varies by architecture. We're using a simplified hierarchy here to get at the underlying idea.</>)}
          </div>
        )}
        {threeQuestions}
      </Section>

      <Section num="02" bnH2="Layer-গুলো" enH2="The layers">
        {bn ? (
          <div lang="bn" style={bodyStyle}>
            {p('একটা simplified laptop বা desktop-এর memory hierarchy-কে এভাবে ভাবা যায়:')}
            {ul([
              <><strong>Register</strong> — CPU-র execution logic-এর সবচেয়ে কাছের storage। চলমান computation-এর জন্য দরকারি কিছু value, address বা state এখানে থাকে। Capacity খুব ছোট, কিন্তু access latency সবচেয়ে কম।</>,
              <><strong>L1 Cache</strong> — প্রতিটা core-এর খুব কাছের ছোট cache। প্রায়ই instruction আর data-র জন্য আলাদা ভাগে থাকে — L1i আর L1d।</>,
              <><strong>L2 Cache</strong> — L1-এর চেয়ে বড়, সাধারণত একটু বেশি latency-র। অনেক architecture-এ এটা core-এর সঙ্গে ঘনিষ্ঠভাবে যুক্ত থাকে, যদিও exact design processor ভেদে আলাদা।</>,
              <><strong>L3 Cache</strong> — আরও বড় cache layer। অনেক modern multi-core processor-এ এটা একাধিক core-এর মধ্যে shared হতে পারে, তবে exact organization architecture অনুযায়ী বদলায়।</>,
              <><strong>RAM</strong> — system-এর main memory। চলমান program আর তাদের data-র বড় অংশ এখানে থাকে। Cache বা register-এর তুলনায় ধারণক্ষমতা অনেক বেশি, latency-ও অনেক বেশি।</>,
              <><strong>SSD / HDD</strong> — persistent storage। ধারণক্ষমতা অনেক বড়, আর power বন্ধ হলেও data থেকে যায়। কিন্তু CPU-র জন্য এদের access RAM-এর তুলনায়ও অনেক ধীর।</>,
            ])}
            <Diagram art={ART_STACK} bnLabel="hierarchy" enLabel="hierarchy" />
            {p('উপরের দিকে গেলে সাধারণত:')}
            {blockquote(<strong>ছোট → দ্রুত → প্রতি unit capacity-তে বেশি খরচসাপেক্ষ</strong>)}
            {p('নিচের দিকে গেলে সাধারণত:')}
            {blockquote(<strong>বড় → ধীর → প্রতি unit capacity-তে সস্তা</strong>)}
            {p('এটা একটা conceptual hierarchy। বাস্তব processor-এ কিছু layer আলাদা হতে পারে, কিছু shared হতে পারে, আবার কোনো architecture-এ নির্দিষ্ট কোনো layer না-ও থাকতে পারে। নিচের যন্ত্রে একেকটা layer-এ চাপ দিয়ে তার ভূমিকা দেখুন:')}
          </div>
        ) : (
          <div style={bodyStyle}>
            {p('A simplified laptop or desktop memory hierarchy can be pictured like this:')}
            {ul([
              <><strong>Registers</strong> — the storage closest to the CPU's execution logic. They hold values, addresses and state needed directly by ongoing computation. Their capacity is tiny; their access latency is the lowest of all.</>,
              <><strong>L1 Cache</strong> — a small cache very close to each core. It is often divided into separate areas for instructions and data — L1i and L1d.</>,
              <><strong>L2 Cache</strong> — larger than L1, generally with somewhat higher latency. In many architectures it is closely associated with a core, though the exact design varies.</>,
              <><strong>L3 Cache</strong> — a larger cache layer. In many modern multi-core processors it can be shared among cores, but the exact organisation depends on the architecture.</>,
              <><strong>RAM</strong> — the system's main memory. It holds a large part of running programs and their data, with far more capacity than caches or registers, and far higher latency.</>,
              <><strong>SSD / HDD</strong> — persistent storage. Far more capacity, and it keeps data when power is removed. But it is much slower for the CPU to reach than RAM.</>,
            ])}
            <Diagram art={ART_STACK} bnLabel="hierarchy" enLabel="hierarchy" />
            {p('Moving upward generally means:')}
            {blockquote(<strong>Smaller → faster → more expensive per unit of capacity</strong>)}
            {p('Moving downward generally means:')}
            {blockquote(<strong>Larger → slower → cheaper per unit of capacity</strong>)}
            {p('This is a conceptual hierarchy. Real processors can organise these layers differently, share some of them, or leave a particular level out entirely. Tap a layer on the instrument below to see its role:')}
          </div>
        )}
        <MemoryPyramid />

        {h3(bn ? 'Cache কি শুধু "আরও দ্রুত RAM"?' : 'Is cache just "faster RAM"?')}
        {bn ? (
          <div lang="bn" style={bodyStyle}>
            {p('না।')}
            {p('Cache আর RAM — দুটোই memory, কিন্তু এরা একই technology-র storage নয়, একই ভূমিকারও নয়। CPU cache সাধারণত অনেক ছোট, কম latency-র, আর processor-এর execution logic-এর সঙ্গে ঘনিষ্ঠভাবে যুক্ত। Main memory অনেক বড়, আর system-এর অনেক বড় working set ধরে রাখে।')}
            {blockquote(<>Cache-এর উদ্দেশ্য RAM-এর <em>বিকল্প</em> হওয়া নয়। উদ্দেশ্য হলো <strong>বারবার কাজে লাগা data-কে CPU-র কাছাকাছি রাখা</strong>, যাতে প্রতিবার ধীর main memory পর্যন্ত যেতে না হয়।</>)}
          </div>
        ) : (
          <div style={bodyStyle}>
            {p('Not exactly.')}
            {p('Cache and RAM are both memory, but they are not the same technology at different speeds, and not the same role either. CPU caches are much smaller, lower-latency, and tightly integrated with the processor. Main memory is much larger and holds a much bigger working set.')}
            {blockquote(<>The purpose of a cache is not to <em>replace</em> RAM. It is to <strong>keep useful data closer to the CPU</strong> so the processor does not have to reach all the way into slower main memory every time.</>)}
          </div>
        )}
      </Section>

      <Section num="03" bnH2="Latency-র পার্থক্য কেন গুরুত্বপূর্ণ?" enH2="Why does the latency difference matter?">
        {bn ? (
          <div lang="bn" style={bodyStyle}>
            {p('"Register দ্রুত, RAM ধীর" — বলা সহজ।')}
            {p('আসল কথাটা হলো, এই latency-গুলো একই scale-এর নয়। Hierarchy-র নিচের দিকে নামলে access time অনেক গুণ বেড়ে যেতে পারে।')}
            {p('আর clock cycle-এর সংখ্যাও কোনো memory technology-র স্থায়ী বৈশিষ্ট্য নয়। একটা নির্দিষ্ট access কত cycle নেবে, সেটা processor-এর clock frequency, architecture আর সেই particular access-এর ওপর নির্ভর করে।')}
            {p('তাই নির্দিষ্ট সংখ্যা মুখস্থ করার চেয়ে এই mental model-টা কাজে লাগবে:')}
            <Diagram art={ART_DISTANCE} bnLabel="mental model" enLabel="mental model" />
          </div>
        ) : (
          <div style={bodyStyle}>
            {p('It is easy to say "registers are fast and RAM is slow."')}
            {p('The point that matters is that these latencies are not on the same scale. Moving down the hierarchy, access time can grow by very large factors.')}
            {p("And a number of clock cycles is not a fixed property of a memory technology either. How many cycles a given access takes depends on the processor's clock frequency, its architecture, and that particular access.")}
            {p('So rather than memorising exact numbers, keep this mental model:')}
            <Diagram art={ART_DISTANCE} bnLabel="mental model" enLabel="mental model" />
          </div>
        )}
        <LatencyScale />
        {bn ? (
          <div lang="bn" style={bodyStyle}>
            <p style={{ margin: '0 0 16px', ...bodyStyle }}>CPU-কে যদি প্রতিটা data access-এর জন্য বারবার অনেক ধীর layer পর্যন্ত অপেক্ষা করতে হতো, তাহলে execution প্রায়ই data-র জন্য বসে থাকত। এই অবস্থাকে বলা হয় <Term id="stall">stall</Term>।</p>
            {p('তাই hierarchy-র মূল লক্ষ্যটা এক লাইনে:')}
            {blockquote(<><strong>যে data এখন বা খুব শিগগির দরকার হতে পারে, তার অন্তত কিছু অংশ CPU-র কাছের দ্রুত layer-এ রাখা।</strong></>)}
            {p('কিন্তু cache তো ছোট। পুরো program-এর data সেখানে ধরবে না। তাহলে hardware বুঝবে কীভাবে কোন data কাছে রাখলে কাজে লাগবে? এখানেই আসে locality।')}
          </div>
        ) : (
          <div style={bodyStyle}>
            <p style={{ margin: '0 0 16px', ...bodyStyle }}>If the CPU had to wait on a much slower layer for every piece of data it needed, execution would frequently sit idle waiting. That condition is a <Term id="stall">stall</Term>.</p>
            {p('So the goal of the hierarchy, in one line:')}
            {blockquote(<><strong>Keep data that is needed now, or likely to be needed soon, in a fast layer close to the CPU.</strong></>)}
            {p("But a cache is small — a whole program's data will not fit. So how does the hardware know which data is worth keeping close? That's where locality comes in.")}
          </div>
        )}
      </Section>

      <Section num="04" bnH2="Locality: কেন hierarchy কাজ করে" enH2="Locality: why the hierarchy works">
        {bn ? (
          <div lang="bn" style={bodyStyle}>
            <p style={{ margin: '0 0 16px', ...bodyStyle }}>এত ছোট cache দিয়ে লাভটা হয়, কারণ অনেক program memory access করার সময় <Term id="locality">locality</Term> দেখায়।</p>
            {p('সব program-এর access pattern একরকম নয়, সব access predictable-ও নয়। কিন্তু অনেক common workload-এ দুটো pattern খুব বেশি দেখা যায়।')}
          </div>
        ) : (
          <div style={bodyStyle}>
            <p style={{ margin: '0 0 16px', ...bodyStyle }}>A tiny cache helps because many programs exhibit <Term id="locality">locality</Term> in how they access memory.</p>
            {p('Not every program has the same access pattern, and not every access is predictable. But two patterns are extremely common.')}
          </div>
        )}

        {h3(bn ? 'Temporal locality' : 'Temporal locality')}
        {bn ? (
          <div lang="bn" style={bodyStyle}>
            {p('এই মুহূর্তে যে data access হয়েছে, অল্প সময়ের মধ্যে সেটাই আবার access হওয়ার সম্ভাবনা থাকে — কোনো loop-এর counter, বারবার ব্যবহার করা variable, বা বারবার কল হওয়া function-এর data।')}
            {blockquote(<strong>Recently used data আবার লাগতে পারে।</strong>)}
          </div>
        ) : (
          <div style={bodyStyle}>
            {p('Data that was just accessed is likely to be accessed again soon — a loop counter, a frequently used variable, data a function keeps reaching for.')}
            {blockquote(<strong>Recently used data may be needed again soon.</strong>)}
          </div>
        )}

        {h3(bn ? 'Spatial locality' : 'Spatial locality')}
        {bn ? (
          <div lang="bn" style={bodyStyle}>
            {p('এখন যে memory address access হয়েছে, তার আশেপাশের address-গুলোও শিগগির লাগতে পারে। যেমন একটা array sequentially traverse করলে:')}
            <Diagram art={ART_SEQ} bnLabel="sequential access" enLabel="sequential access" />
            {p('একটা element-এর পরে সাধারণত তার কাছের element-ই আসে।')}
            {blockquote(<strong>কাছের data-ও শিগগির দরকার হতে পারে।</strong>)}
            {p('Cache এই দুই ধরনের locality-ই কাজে লাগায়। এই কারণেই CPU যে byte চেয়েছে শুধু সেটা cache-এ আনা সবচেয়ে ভালো কৌশল নাও হতে পারে — আশেপাশের data সহ একটা ছোট block আনা লাভজনক হতে পারে।')}
          </div>
        ) : (
          <div style={bodyStyle}>
            {p('When one memory address is accessed, nearby addresses are often needed soon as well. Traversing an array sequentially, for instance:')}
            <Diagram art={ART_SEQ} bnLabel="sequential access" enLabel="sequential access" />
            {p('The next access is usually close to the current one.')}
            {blockquote(<strong>Nearby data may be needed soon too.</strong>)}
            {p('Caches exploit both patterns. Which is why bringing in only the exact byte the CPU asked for is not necessarily the best strategy — pulling in a small block of nearby data can pay off.')}
          </div>
        )}

        {h3(bn ? 'Cache line: cache আসলে কীভাবে data আনে?' : 'Cache lines: how does a cache bring data in?')}
        {bn ? (
          <div lang="bn" style={bodyStyle}>
            <p style={{ margin: '0 0 16px', ...bodyStyle }}>Cache সাধারণত একেকটা byte আলাদা করে নয়, বরং <Term id="cacheline">cache line</Term> নামের fixed-size block ধরে data manage করে। অনেক modern CPU-তে একটা cache line 64 byte, যদিও exact size architecture অনুযায়ী বদলায়।</p>
            <p style={{ margin: '0 0 16px', ...bodyStyle }}>ধরুন CPU {mono('arr[0]')} access করল, আর সেই access-এ <Term id="cachemiss">cache miss</Term> হলো। তখন সেই address-কে ধারণ করা cache line-টা hierarchy-র নিচের level থেকে আনা হতে পারে। সেই line-এর ভেতরে {mono('arr[1]')}, {mono('arr[2]')} আর আরও কাছের element-ও থাকতে পারে — ফলে পরের access-গুলো cache থেকেই মিটে যেতে পারে।</p>
            {blockquote(<><strong>Cache line হলো cache-এর transfer বা storage-এর একক।</strong> "CPU সবসময় RAM থেকে ঠিক 64 byte চায়" — এমন কোনো universal নিয়ম এটা নয়।</>)}
            {p('নিচের যন্ত্রে একটা address-এ চাপ দিয়ে দেখুন — line-এর বাকি অংশও কীভাবে সঙ্গে চলে আসে:')}
          </div>
        ) : (
          <div style={bodyStyle}>
            <p style={{ margin: '0 0 16px', ...bodyStyle }}>Caches generally manage data in fixed-size blocks called <Term id="cacheline">cache lines</Term>, rather than treating every byte as its own transfer. Many modern CPUs use a 64-byte cache line, although the exact size depends on the architecture.</p>
            <p style={{ margin: '0 0 16px', ...bodyStyle }}>Say the CPU accesses {mono('arr[0]')} and that access is a <Term id="cachemiss">cache miss</Term>. The cache line containing that address may be brought in from a lower level of the hierarchy. That line can also hold {mono('arr[1]')}, {mono('arr[2]')} and other neighbours — so later accesses may be served straight from the cache.</p>
            {blockquote(<><strong>A cache line is a cache's unit of transfer and storage.</strong> It is not a universal rule that the CPU always asks RAM for exactly 64 bytes.</>)}
            {p('Tap an address on the instrument below and watch the rest of its line arrive with it:')}
          </div>
        )}
        <CacheLineLocality />

        {h3(bn ? 'কোড লেভেলে প্রভাব: row-major vs column-major' : 'Code-level impact: row-major vs column-major')}
        {bn ? (
          <div lang="bn" style={bodyStyle}>
            {p('Memory hierarchy শুধু hardware engineer-দের মাথাব্যথা নয় — সাধারণ code-এর performance-এও এর সরাসরি প্রভাব পড়ে।')}
            {p('C-র built-in multidimensional array memory-তে row-major order-এ contiguousভাবে সাজানো থাকে — এক row-এর সব element পাশাপাশি, তারপরেই পরের row।')}
            {p('নিচের দুটো loop একই matrix-এর সব element যোগ করে, কিন্তু access pattern আলাদা:')}
          </div>
        ) : (
          <div style={bodyStyle}>
            {p("Memory hierarchy isn't only a hardware engineer's concern — it shows up directly in the performance of ordinary code.")}
            {p("C's built-in multidimensional arrays are laid out in row-major order in contiguous memory — a row's elements sit next to each other, followed immediately by the next row.")}
            {p('The two loops below sum the same matrix, but with different access patterns:')}
          </div>
        )}
        {codeBlock(`#define SIZE 2048
int arr[SIZE][SIZE];

// Approach A: row-major traversal
long long sumA = 0;
for (int i = 0; i < SIZE; i++) {
    for (int j = 0; j < SIZE; j++) {
        sumA += arr[i][j];   // neighbouring addresses
    }
}

// Approach B: column-major traversal
long long sumB = 0;
for (int j = 0; j < SIZE; j++) {
    for (int i = 0; i < SIZE; i++) {
        sumB += arr[i][j];   // large-stride jumps
    }
}`)}
        {bn ? (
          <div lang="bn" style={bodyStyle}>
            {p('Approach A-র inner loop-এ পাশাপাশি address পড়া হয়:')}
            <Diagram art={ART_ROW} bnLabel="approach a · row-major" enLabel="approach a · row-major" />
            {p('একটা cache line একবার চলে এলে সেই line-এর আরও অনেক element কাজে লাগানো যায়। Cache hit-এর সম্ভাবনা বাড়ে।')}
            <p style={{ margin: '0 0 16px', ...bodyStyle }}>Approach B-তে inner loop-এ {mono('i')} বাড়ে, তাই access-গুলো হয়:</p>
            <Diagram art={ART_COL} bnLabel="approach b · column-major" enLabel="approach b · column-major" />
            <p style={{ margin: '0 0 16px', ...bodyStyle }}>{mono('SIZE = 2048')} আর {mono('sizeof(int) = 4')} হলে প্রতিটা access-এর মাঝে দূরত্ব:</p>
            <Diagram art={ART_STRIDE} bnLabel="stride" enLabel="stride" />
            {p('অর্থাৎ পরের element পেতে memory-তে প্রায় ৮ KB লাফ দিতে হচ্ছে। এতে spatial locality খারাপ হয় — একই cache line আবার কাজে লাগার সুযোগ কমে যায়, cache miss-এর হার অনেক বেড়ে যেতে পারে।')}
            {p(<>তাই Approach A সাধারণত Approach B-র চেয়ে অনেক বেশি cache-friendly। তবে <strong>ঠিক কত গুণ দ্রুত হবে, সেটা hardware, compiler আর workload-এর ওপর নির্ভর করে।</strong></>)}
            {blockquote(<><strong>একই algorithmic result-এর জন্যও memory access pattern performance বদলে দিতে পারে।</strong></>)}
            {p('এই একই locality principle-এর কারণেই data structure বা algorithm বাছার সময় শুধু Big-O complexity নয়, memory access pattern-ও গুরুত্বপূর্ণ হতে পারে। নিচের যন্ত্রে দুই mode toggle করে hit/miss গুনে দেখুন:')}
          </div>
        ) : (
          <div style={bodyStyle}>
            {p("Approach A's inner loop reads neighbouring addresses:")}
            <Diagram art={ART_ROW} bnLabel="approach a · row-major" enLabel="approach a · row-major" />
            {p('Once a cache line is brought in, many more elements from that same line can be used. The chance of a cache hit goes up.')}
            <p style={{ margin: '0 0 16px', ...bodyStyle }}>Approach B increments {mono('i')} in the inner loop, so the accesses go:</p>
            <Diagram art={ART_COL} bnLabel="approach b · column-major" enLabel="approach b · column-major" />
            <p style={{ margin: '0 0 16px', ...bodyStyle }}>With {mono('SIZE = 2048')} and {mono('sizeof(int) = 4')}, each access is separated by:</p>
            <Diagram art={ART_STRIDE} bnLabel="stride" enLabel="stride" />
            {p('So the inner loop jumps roughly 8 KB through memory every step. That gives poor spatial locality — the chance of reusing the same cache line drops, and cache misses can climb substantially.')}
            {p(<>Approach A will therefore usually be much more cache-friendly than Approach B. But <strong>the exact performance difference depends on the hardware, the compiler and the workload.</strong></>)}
            {blockquote(<><strong>Even when two pieces of code produce the same result, their memory-access patterns can perform very differently.</strong></>)}
            {p('This same locality principle is why performance can depend not only on an algorithm\'s Big-O complexity, but also on its memory-access pattern. Toggle the two modes below and watch the hit/miss count:')}
          </div>
        )}
        <RowColumnTraversal />
      </Section>

      <Section num="05" bnH2="SRAM আর DRAM: ভেতরে পার্থক্য কী?" enH2="SRAM vs DRAM: what's different inside?">
        {bn ? (
          <div lang="bn" style={bodyStyle}>
            {p('Cache আর main RAM — দুটোই semiconductor memory, কিন্তু সাধারণত এদের storage cell একরকম নয়।')}
          </div>
        ) : (
          <div style={bodyStyle}>
            {p('Cache and main memory are both semiconductor memory, but their storage cells are typically built differently.')}
          </div>
        )}

        {h3(bn ? 'SRAM — cache-এর দিকে' : 'SRAM — toward the cache side')}
        {bn ? (
          <div lang="bn" style={bodyStyle}>
            <p style={{ margin: '0 0 16px', ...bodyStyle }}><Term id="sram">SRAM</Term> (Static RAM) সাধারণত একাধিক transistor দিয়ে তৈরি একটা bistable cell ব্যবহার করে bit ধরে রাখে; common design-এ ৬-transistor cell দেখা যায়।</p>
            {p('সুবিধা: খুব দ্রুত access, আলাদা refresh cycle লাগে না, আর CPU-র কাছাকাছি ঘন ঘন access করা data-র জন্য উপযুক্ত।')}
            {p('অসুবিধা: প্রতি bit-এ বেশি hardware লাগে, তাই storage density কম — একই capacity বানাতে বেশি silicon area লাগে।')}
            {p('এই কারণেই SRAM তুলনামূলক ছোট আর দ্রুত cache-এর জন্য উপযোগী।')}
          </div>
        ) : (
          <div style={bodyStyle}>
            <p style={{ margin: '0 0 16px', ...bodyStyle }}><Term id="sram">SRAM</Term> (Static RAM) generally uses a transistor-based bistable cell to hold a bit; a common design uses six transistors.</p>
            {p('Advantages: very fast access, no periodic refresh cycle, and a good fit for frequently accessed data close to the CPU.')}
            {p('Disadvantages: more hardware per bit, so lower storage density — the same capacity needs more silicon area.')}
            {p('Which is why SRAM suits relatively small, fast caches.')}
          </div>
        )}

        {h3(bn ? 'DRAM — main memory-র দিকে' : 'DRAM — toward the main-memory side')}
        {bn ? (
          <div lang="bn" style={bodyStyle}>
            <p style={{ margin: '0 0 16px', ...bodyStyle }}><Term id="dram">DRAM</Term> (Dynamic RAM) সাধারণত একটা transistor আর একটা capacitor-ভিত্তিক cell দিয়ে bit রাখে। Capacitor-এ জমা charge সময়ের সঙ্গে leak করে, তাই DRAM-কে নিয়মিত <strong>refresh</strong> করতে হয়।</p>
            {p('এর বড় সুবিধা density — অনেক বেশি bit খুব ছোট physical area-তে রাখা যায়। তাই large-capacity main memory-র জন্য DRAM উপযোগী।')}
            {p('কিন্তু এর cell structure আর read/write process SRAM-এর তুলনায় বেশি জটিল, তাই latency-ও বেশি।')}
            <Diagram art={ART_TECH} bnLabel="trade-off" enLabel="trade-off" />
            {p('এই trade-off-টাই বুঝিয়ে দেয় কেন cache আর main memory আলাদা technology-তে বানানো হয়।')}
          </div>
        ) : (
          <div style={bodyStyle}>
            <p style={{ margin: '0 0 16px', ...bodyStyle }}><Term id="dram">DRAM</Term> (Dynamic RAM) generally stores a bit in a transistor-and-capacitor cell. The charge in that capacitor gradually leaks away, so DRAM has to be <strong>refreshed</strong> periodically.</p>
            {p('Its major advantage is density — a very large number of bits fit into a small physical area, which makes it suitable for large-capacity main memory.')}
            {p('Its cell structure and access process are more involved than SRAM\'s, so its latency is higher.')}
            <Diagram art={ART_TECH} bnLabel="trade-off" enLabel="trade-off" />
            {p('That trade-off is the key to why caches and main memory are built from different technologies.')}
          </div>
        )}
        <SRAMvsDRAM />
      </Section>

      <Section num="06" bnH2="Volatility: power গেলে কী হয়?" enH2="Volatility: what happens when power is removed?">
        {bn ? (
          <div lang="bn" style={bodyStyle}>
            <p style={{ margin: '0 0 16px', ...bodyStyle }}>Memory-কে আরেকভাবেও ভাগ করা যায়: <strong>power বন্ধ হওয়ার পর data কি নির্ভরযোগ্যভাবে থেকে যায়?</strong> এটাই <Term id="volatile">volatile আর non-volatile</Term>-এর পার্থক্য।</p>
            {p('Register, cache আর DRAM-based main memory volatile। মানে এগুলো power ছাড়া stored state অনির্দিষ্টকাল ধরে রাখার জন্য designed নয় — power চলে গেলে আগের data আর নির্ভরযোগ্যভাবে থাকে না।')}
            {p('SSD আর HDD non-volatile। power ছাড়াও এরা data ধরে রাখতে পারে, আর এদের physical technology আলাদা:')}
            {ul([
              <><strong>HDD:</strong> magnetic storage ব্যবহার করে।</>,
              <><strong>SSD:</strong> NAND flash memory ব্যবহার করে, যেখানে electrical charge দিয়ে stored state বহুদিন ধরে রাখা যায়।</>,
            ])}
            <Diagram art={ART_VOLATILE} bnLabel="state retention" enLabel="state retention" />
            {p('এখানে এই distinction-টুকুই যথেষ্ট। physical implementation-এর গভীর detail পরে দরকার হলে দেখা যাবে।')}
          </div>
        ) : (
          <div style={bodyStyle}>
            <p style={{ margin: '0 0 16px', ...bodyStyle }}>Memory can also be split by another question: <strong>does the stored data remain reliably available after power is removed?</strong> That is the <Term id="volatile">volatile / non-volatile</Term> distinction.</p>
            {p('Registers, caches, and DRAM-based main memory are volatile. They are not designed to retain their stored state indefinitely without power — once power goes, the previous state is no longer reliably there.')}
            {p('SSDs and HDDs are non-volatile. They retain data without continuous power, and their physical technologies differ:')}
            {ul([
              <><strong>HDD:</strong> uses magnetic storage.</>,
              <><strong>SSD:</strong> uses NAND flash memory, where electrical charge represents stored state over long periods.</>,
            ])}
            <Diagram art={ART_VOLATILE} bnLabel="state retention" enLabel="state retention" />
            {p('That distinction is all this article needs. The deeper physical implementation can be explored later if it ever matters.')}
          </div>
        )}
      </Section>

      <Section num="07" bnH2="পুরো ছবিটা একবার" enH2="The complete picture">
        {bn ? (
          <div lang="bn" style={bodyStyle}>
            {p('ধরুন CPU-কে এমন একটা instruction execute করতে হবে, যার জন্য memory থেকে একটা value load করা দরকার। Simplifiedভাবে গল্পটা এমন:')}
            {ul([
              <><strong>CPU memory access-এর প্রয়োজন বুঝল।</strong> Instruction-এর control information থেকে CPU জানে যে একটা memory value লাগবে, আর কোন address থেকে সেটা নিতে হবে।</>,
              <><strong>কাছের cache-এ খোঁজা হয়।</strong> L1 data cache-এ value থাকলে সেটা cache hit — CPU কম latency-তেই data পেয়ে যায়।</>,
              <><strong>না থাকলে নিচের level-এ।</strong> Processor-এর design অনুযায়ী request L2, তারপর L3-এ যেতে পারে। যেখানে data পাওয়া যায়, সেখান থেকে সেটা CPU-র দিকে ফেরে, আর প্রয়োজন অনুযায়ী cache-এ রাখা হতে পারে। কোনো cache-এই না থাকলে request main memory পর্যন্ত যায়।</>,
              <><strong>Data পেলে execution এগোয়।</strong> Data execution machinery-তে ফিরে এলে instruction-এর বাকি অংশ চলতে পারে, আর result শেষ পর্যন্ত কোনো register-এ বসতে পারে।</>,
            ])}
            <Diagram art={ART_LOOKUP} bnLabel="lookup" enLabel="lookup" />
            {p('উপরের layer-এ data পাওয়া গেলে নিচ পর্যন্ত যেতেই হয় না। এই কারণেই cache hit মূল্যবান, আর cache miss expensive হতে পারে। নিচের যন্ত্রে data কোথায় পাওয়া গেল সেটা বেছে নিয়ে পুরো cascade দেখুন:')}
          </div>
        ) : (
          <div style={bodyStyle}>
            {p('Suppose the CPU has to execute an instruction that needs a value loaded from memory. In a simplified model, the story runs like this:')}
            {ul([
              <><strong>The CPU needs a memory value.</strong> The instruction's control information tells it that a memory value is required, and what is needed to determine its address.</>,
              <><strong>The nearby cache is checked.</strong> If the value is in the L1 data cache, that is a cache hit — the CPU gets its data at low latency.</>,
              <><strong>If not, lower levels are tried.</strong> Depending on the processor's organisation, the request can proceed to L2, then L3. Wherever the data is found, it is returned toward the CPU and may be placed into one or more cache levels. If it is in no cache at all, the request goes to main memory.</>,
              <><strong>Execution continues.</strong> Once the data reaches the execution machinery, the rest of the instruction can proceed, and a result may eventually land in a register.</>,
            ])}
            <Diagram art={ART_LOOKUP} bnLabel="lookup" enLabel="lookup" />
            {p('If the data is found at a higher level, the request never has to travel all the way down. That is why cache hits are valuable and cache misses can be expensive. Pick where the data turns up on the instrument below and watch the whole cascade:')}
          </div>
        )}
        <MemoryLookupCascade />

        {h3(bn ? 'Page fault কোথায় আসে?' : 'Where does a page fault fit?')}
        {bn ? (
          <div lang="bn" style={bodyStyle}>
            <p style={{ margin: '0 0 16px', ...bodyStyle }}>এটা আলাদা একটা concept, যেটা আমরা এখানে বিস্তারিত করছি না। Virtual memory-তে CPU যে address ব্যবহার করছে, তার required page যদি RAM-এ এই মুহূর্তে না থাকে, তখন <Term id="pagefault">page fault</Term> ঘটতে পারে, আর operating system-কে জড়াতে হয়।</p>
            {blockquote(<><strong>Cache miss মানে relevant cache-এ data পাওয়া যায়নি। Page fault হলো virtual memory system-এর একটা আলাদা ঘটনা।</strong> দুটোকে গুলিয়ে না ফেলাই ভালো।</>)}
          </div>
        ) : (
          <div style={bodyStyle}>
            <p style={{ margin: '0 0 16px', ...bodyStyle }}>That is a separate concept, and one we won't go into here. In a virtual-memory system, if the page an address falls in isn't currently resident in RAM, accessing it can trigger a <Term id="pagefault">page fault</Term> and pull in the operating system.</p>
            {blockquote(<><strong>A cache miss means the data wasn't found in the relevant cache. A page fault is a separate virtual-memory event.</strong> Keeping the two apart makes the next article easier.</>)}
          </div>
        )}
      </Section>

      <Section num="08" bnH2="বাস্তবতার কোণা: একাধিক core হলে?" enH2="Reality corner: what changes with multiple cores?">
        {bn ? (
          <div lang="bn" style={bodyStyle}>
            {p('একাধিক CPU core থাকলে আরেকটা সমস্যা আসে।')}
            <p style={{ margin: '0 0 16px', ...bodyStyle }}>একই memory data-র copy একাধিক core-এর private cache-এ থাকতে পারে। কোনো একটা core সেই data বদলালে অন্য core যেন অনির্দিষ্টকাল পুরোনো, inconsistent copy ব্যবহার করতে না থাকে — তার জন্য processor-এ <Term id="cachecoherence">cache coherence</Term> mechanism থাকে।</p>
            {blockquote(<><strong>একাধিক core-এর private cache থাকলে cached copy-গুলোর মধ্যে consistency রাখতে hardware-এর বাড়তি coordination দরকার হয়।</strong></>)}
            {p('এখানে অনেক protocol আর hardware mechanism জড়িত। MESI-র মতো protocol-এর বিস্তারিত পরে আলাদা করে দেখা যেতে পারে।')}
          </div>
        ) : (
          <div style={bodyStyle}>
            {p('Multiple CPU cores introduce another problem.')}
            <p style={{ margin: '0 0 16px', ...bodyStyle }}>The same piece of memory data may have copies in the private caches of different cores. If one core changes that data, the others must not keep using an inconsistent copy indefinitely — so processors implement <Term id="cachecoherence">cache coherence</Term> mechanisms.</p>
            {blockquote(<><strong>When multiple cores hold private caches, extra hardware coordination is needed to keep the cached copies consistent.</strong></>)}
            {p('Many protocols and hardware mechanisms are involved. Protocols such as MESI can be explored separately later.')}
          </div>
        )}
      </Section>

      <Section num="09" bnH2="এই আর্টিকেলে কী শিখলাম" enH2="What this article covered">
        <Recap>
          {bn ? (
            <>
              <li>একটা memory technology সবদিক থেকে সেরা হতে পারে না — latency, capacity আর cost-এর মধ্যে trade-off আছে, তাই computer একাধিক storage layer ব্যবহার করে।</li>
              <li>Memory hierarchy CPU-কে দরকারি data দ্রুত পাওয়ার সুযোগ দেয় — register আর cache ছোট কিন্তু দ্রুত, RAM অনেক বড়, storage আরও বড় কিন্তু অনেক ধীর।</li>
              <li>Cache দাঁড়িয়ে আছে locality-র ওপর — recently used data আবার লাগতে পারে (temporal), আর কাছের address-ও শিগগির লাগতে পারে (spatial)।</li>
              <li>Cache line কাছের data-কে কাজে লাগায় — একটা miss-এর সময় আশেপাশের data সহ একটা block আসতে পারে, ফলে পরের access-গুলো hit হতে পারে।</li>
              <li>SRAM আর DRAM আলাদা trade-off দেয় — SRAM দ্রুত কিন্তু প্রতি bit-এ জায়গা বেশি; DRAM dense আর সস্তা, কিন্তু latency বেশি ও refresh লাগে।</li>
              <li>Volatile আর non-volatile-এর পার্থক্য state retention-এর — volatile storage power ছাড়া state নির্ভরযোগ্যভাবে রাখতে পারে না, non-volatile পারে।</li>
            </>
          ) : (
            <>
              <li>No single memory technology is best at everything — latency, capacity and cost trade off against each other, so computers use several storage layers.</li>
              <li>The hierarchy helps the CPU reach useful data quickly — registers and caches are small but fast, RAM is much larger, storage larger still but far slower.</li>
              <li>Caches rely on locality — recently used data may be needed again (temporal), and nearby addresses may be needed soon too (spatial).</li>
              <li>Cache lines exploit nearby data — a miss can bring in a block containing neighbours, so later accesses may become hits.</li>
              <li>SRAM and DRAM make different trade-offs — SRAM is faster but takes more area per bit; DRAM is denser and cheaper per bit, but higher latency and needs refreshing.</li>
              <li>Volatile and non-volatile differ in state retention — volatile storage can't reliably hold state without power; non-volatile can.</li>
            </>
          )}
        </Recap>
      </Section>

      <RelayNav
        hub={SERIES_HUB_CARD}
        next={{ label: { bn: 'baton পরের পর্বে', en: 'baton to the next leg' }, title: bn ? '০৬ — অপারেটিং সিস্টেম: মহাব্যবস্থাপক' : '06 — Operating System: The Grand Conductor', href: '/writing/os-grand-conductor', variant: 'next' }}
        bridge={{
          bn: 'এখন computer-এর memory hierarchy-র গল্পটা জানা হলো। কিন্তু laptop খুলে দেখুন — browser, VS Code, Spotify, terminal, video call, সব একসাথে চলছে। এখান থেকেই নতুন প্রশ্ন: একটা program নিজের memory space পায় কীভাবে? একটা program হঠাৎ করে অন্য program-এর memory-তে ঢুকে যেতে পারে না কেন? কে ঠিক করে কোন program কখন CPU পাবে? আর virtual memory কীভাবে RAM-কে প্রতিটা program-এর কাছে নিজের আলাদা address space-এর মতো দেখায়? এই কাজগুলোতে operating system-এর পাশাপাশি CPU-র কিছু hardware mechanism-ও জড়িত। পরের আর্টিকেলে আমরা software আর hardware-এর সেই boundary-তে যাব।',
          en: "We now understand the basic idea of the memory hierarchy. But look at a real laptop: browser, VS Code, Spotify, terminal, a video call, all running at once. That raises new questions. How does each program get its own memory space? How does one program stop reaching into another's memory? Who decides which program gets the CPU, and when? And how does virtual memory make RAM look, to every program, like its own private address space? These responsibilities involve both the operating system and hardware mechanisms inside the processor. The next article steps into that boundary between software and hardware.",
        }}
      />
      <Colophon />
    </article>
  );
}
