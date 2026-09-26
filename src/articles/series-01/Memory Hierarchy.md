# মেমোরি হায়ারার্কি

## কেন এক memory দিয়ে হয় না

> *`[DIAGRAM · …]` blocks render through the `<Diagram>` primitive (flow art on paper, not a code well). `[WIDGET · …]` marks an interactive instrument. Hover definitions live only in `src/articles/glossary.ts`.*

আপনার laptop-এ কি একটাই memory আছে?

স্বাভাবিক উত্তর — হ্যাঁ, RAM। ১৬ GB বা ৩২ GB, যা-ই হোক।

কিন্তু আসলে laptop-এ এই মুহূর্তে কয়েক রকমের storage একসাথে কাজ করছে। কিছু এত ছোট যে সবমিলিয়ে সামান্য কয়েকটা value ধরে, কিন্তু CPU-র execution logic-এর একদম গায়ে লাগানো। কিছু এত বড় যে টেরাবাইট পর্যন্ত ধরে, কিন্তু সেখান থেকে data আনতে CPU-কে তুলনায় অনেক বেশি অপেক্ষা করতে হয়।

কেন এই ব্যবস্থা? আগের আর্টিকেলে দেখেছি একটা instruction কীভাবে fetch, decode আর execute হয়। কিন্তু সেই instruction আর data-গুলো থাকে কোথায়, আর একটাই memory দিয়ে কেন কাজ চলে না? এটাই আজকের গল্প।

---

## ০১ — কেন একটাই memory দিয়ে হয় না?

সোজা প্রশ্ন:

**একটাই বিশাল memory বানিয়ে সেটাকে CPU-র সবচেয়ে কাছের storage-এর মতো দ্রুত বানানো যায় না?**

সমস্যাটা engineering trade-off-এর।

Memory design-এ আমরা একসাথে চাই:

- **কম latency** — data খুব দ্রুত পাওয়া যাবে
- **বেশি capacity** — অনেক data রাখা যাবে
- **কম cost** — একই capacity-র জন্য খরচ নাগালের মধ্যে থাকবে

কোনো একটা storage technology একসাথে এই সব দিকেই সেরা হতে পারে না।

**[DIAGRAM · trade-off]**

```text
Very fast + very large
→ very expensive

Very fast + inexpensive
→ small capacity

Very large + inexpensive
→ higher latency
```

তাই computer engineer-রা একটাই memory technology বেছে নেয়নি। বরং বিভিন্ন trade-off-এর storage-কে স্তরে স্তরে সাজানো হয়েছে — সবচেয়ে ছোট আর দ্রুত storage CPU-র সবচেয়ে কাছে, বড় আর ধীর storage আরও নিচে।

এই layered বিন্যাসটাই **Memory Hierarchy**।

> **এটা কোনো কঠিন rule নয় যে প্রতিটা computer-এ ঠিক একই সংখ্যক layer থাকবে।** Architecture অনুযায়ী স্তরের সংখ্যা, মাপ, কোনটা shared আর কোনটা নয় — সব বদলাতে পারে। আমরা এখানে একটা simplified hierarchy নিয়ে কাজ করছি, যাতে মূল ধারণাটা পরিষ্কার হয়।

> **// memory নিয়ে তিনটা প্রশ্ন**
>
> কোনো storage layer নিয়ে ভাবার সময় তিনটা আলাদা প্রশ্ন করুন:
>
> **কত দ্রুত data পাওয়া যায়?** → Latency
>
> **কত data রাখা যায়?** → Capacity
>
> **প্রতি unit capacity-র জন্য খরচ কত?** → Cost
>
> Memory hierarchy মূলত এই তিনটার মধ্যে balance করার একটা engineering সমাধান।

---

## ০২ — Layer-গুলো

একটা simplified laptop বা desktop-এর memory hierarchy-কে এভাবে ভাবা যায়:

- **Register** — CPU-র execution logic-এর সবচেয়ে কাছের storage। চলমান computation-এর জন্য দরকারি কিছু value, address বা state এখানে থাকে। Capacity খুব ছোট, কিন্তু access latency সবচেয়ে কম।
- **L1 Cache** — প্রতিটা core-এর খুব কাছের ছোট cache। প্রায়ই instruction আর data-র জন্য আলাদা ভাগে থাকে — L1i আর L1d।
- **L2 Cache** — L1-এর চেয়ে বড়, সাধারণত একটু বেশি latency-র। অনেক architecture-এ এটা core-এর সঙ্গে ঘনিষ্ঠভাবে যুক্ত থাকে, যদিও exact design processor ভেদে আলাদা।
- **L3 Cache** — আরও বড় cache layer। অনেক modern multi-core processor-এ এটা একাধিক core-এর মধ্যে shared হতে পারে, তবে exact organization architecture অনুযায়ী বদলায়।
- **RAM** — system-এর main memory। চলমান program আর তাদের data-র বড় অংশ এখানে থাকে। Cache বা register-এর তুলনায় ধারণক্ষমতা অনেক বেশি, latency-ও অনেক বেশি।
- **SSD / HDD** — persistent storage। ধারণক্ষমতা অনেক বড়, আর power বন্ধ হলেও data থেকে যায়। কিন্তু CPU-র জন্য এদের access RAM-এর তুলনায়ও অনেক ধীর।

**[DIAGRAM · hierarchy]**

```text
Registers
   ↓
L1 Cache
   ↓
L2 Cache
   ↓
L3 Cache
   ↓
RAM
   ↓
SSD / HDD
```

উপরের দিকে গেলে সাধারণত:

> **ছোট → দ্রুত → প্রতি unit capacity-তে বেশি খরচসাপেক্ষ**

নিচের দিকে গেলে সাধারণত:

> **বড় → ধীর → প্রতি unit capacity-তে সস্তা**

এটা একটা conceptual hierarchy। বাস্তব processor-এ কিছু layer আলাদা হতে পারে, কিছু shared হতে পারে, আবার কোনো architecture-এ নির্দিষ্ট কোনো layer না-ও থাকতে পারে। নিচের যন্ত্রে একেকটা layer-এ চাপ দিয়ে তার ভূমিকা দেখুন:

**[WIDGET · MemoryPyramid]**

### Cache কি শুধু "আরও দ্রুত RAM"?

না।

Cache আর RAM — দুটোই memory, কিন্তু এরা একই technology-র storage নয়, একই ভূমিকারও নয়। CPU cache সাধারণত অনেক ছোট, কম latency-র, আর processor-এর execution logic-এর সঙ্গে ঘনিষ্ঠভাবে যুক্ত। Main memory অনেক বড়, আর system-এর অনেক বড় working set ধরে রাখে।

> Cache-এর উদ্দেশ্য RAM-এর *বিকল্প* হওয়া নয়। উদ্দেশ্য হলো **বারবার কাজে লাগা data-কে CPU-র কাছাকাছি রাখা**, যাতে প্রতিবার ধীর main memory পর্যন্ত যেতে না হয়।

---

## ০৩ — Latency-র পার্থক্য কেন গুরুত্বপূর্ণ?

"Register দ্রুত, RAM ধীর" — বলা সহজ।

আসল কথাটা হলো, এই latency-গুলো একই scale-এর নয়। Hierarchy-র নিচের দিকে নামলে access time অনেক গুণ বেড়ে যেতে পারে।

আর clock cycle-এর সংখ্যাও কোনো memory technology-র স্থায়ী বৈশিষ্ট্য নয়। একটা নির্দিষ্ট access কত cycle নেবে, সেটা processor-এর clock frequency, architecture আর সেই particular access-এর ওপর নির্ভর করে।

তাই নির্দিষ্ট সংখ্যা মুখস্থ করার চেয়ে এই mental model-টা কাজে লাগবে:

**[DIAGRAM · mental model]**

```text
Closer to the CPU
→ generally lower latency

Farther down the hierarchy
→ generally higher latency
```

**[WIDGET · LatencyScale]** — "সবচেয়ে কাছের access = ১ সেকেন্ড" ধরে দূরত্বের অনুভব। Order of magnitude, hardware-এর মাপ নয়।

CPU-কে যদি প্রতিটা data access-এর জন্য বারবার অনেক ধীর layer পর্যন্ত অপেক্ষা করতে হতো, তাহলে execution প্রায়ই data-র জন্য বসে থাকত। এই অবস্থাকে বলা হয় **[HOVER: stall]**।

তাই hierarchy-র মূল লক্ষ্যটা এক লাইনে:

> **যে data এখন বা খুব শিগগির দরকার হতে পারে, তার অন্তত কিছু অংশ CPU-র কাছের দ্রুত layer-এ রাখা।**

কিন্তু cache তো ছোট। পুরো program-এর data সেখানে ধরবে না। তাহলে hardware বুঝবে কীভাবে কোন data কাছে রাখলে কাজে লাগবে? এখানেই আসে locality।

---

## ০৪ — Locality: কেন hierarchy কাজ করে

এত ছোট cache দিয়ে লাভটা হয়, কারণ অনেক program memory access করার সময় **[HOVER: locality]** দেখায়।

সব program-এর access pattern একরকম নয়, সব access predictable-ও নয়। কিন্তু অনেক common workload-এ দুটো pattern খুব বেশি দেখা যায়।

### Temporal locality

এই মুহূর্তে যে data access হয়েছে, অল্প সময়ের মধ্যে সেটাই আবার access হওয়ার সম্ভাবনা থাকে — কোনো loop-এর counter, বারবার ব্যবহার করা variable, বা বারবার কল হওয়া function-এর data।

> **Recently used data আবার লাগতে পারে।**

### Spatial locality

এখন যে memory address access হয়েছে, তার আশেপাশের address-গুলোও শিগগির লাগতে পারে। যেমন একটা array sequentially traverse করলে:

**[DIAGRAM · sequential access]**

```text
arr[0]
arr[1]
arr[2]
arr[3]
...
```

একটা element-এর পরে সাধারণত তার কাছের element-ই আসে।

> **কাছের data-ও শিগগির দরকার হতে পারে।**

Cache এই দুই ধরনের locality-ই কাজে লাগায়। এই কারণেই CPU যে byte চেয়েছে শুধু সেটা cache-এ আনা সবচেয়ে ভালো কৌশল নাও হতে পারে — আশেপাশের data সহ একটা ছোট block আনা লাভজনক হতে পারে।

### Cache line: cache আসলে কীভাবে data আনে?

Cache সাধারণত একেকটা byte আলাদা করে নয়, বরং **[HOVER: cache line]** নামের fixed-size block ধরে data manage করে। অনেক modern CPU-তে একটা cache line 64 byte, যদিও exact size architecture অনুযায়ী বদলায়।

ধরুন CPU `arr[0]` access করল, আর সেই access-এ **[HOVER: cache miss]** হলো। তখন সেই address-কে ধারণ করা cache line-টা hierarchy-র নিচের level থেকে আনা হতে পারে। সেই line-এর ভেতরে `arr[1]`, `arr[2]` আর আরও কাছের element-ও থাকতে পারে — ফলে পরের access-গুলো cache থেকেই মিটে যেতে পারে।

> **Cache line হলো cache-এর transfer বা storage-এর একক।** "CPU সবসময় RAM থেকে ঠিক 64 byte চায়" — এমন কোনো universal নিয়ম এটা নয়।

নিচের যন্ত্রে একটা address-এ চাপ দিয়ে দেখুন — line-এর বাকি অংশও কীভাবে সঙ্গে চলে আসে:

**[WIDGET · CacheLineLocality]**

### কোড লেভেলে প্রভাব: row-major vs column-major

Memory hierarchy শুধু hardware engineer-দের মাথাব্যথা নয় — সাধারণ code-এর performance-এও এর সরাসরি প্রভাব পড়ে।

C-র built-in multidimensional array memory-তে row-major order-এ contiguousভাবে সাজানো থাকে — এক row-এর সব element পাশাপাশি, তারপরেই পরের row।

নিচের দুটো loop একই matrix-এর সব element যোগ করে, কিন্তু access pattern আলাদা:

```c
#define SIZE 2048
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
}
```

Approach A-র inner loop-এ পাশাপাশি address পড়া হয়:

**[DIAGRAM · approach a · row-major]**

```text
arr[0][0]
arr[0][1]
arr[0][2]
arr[0][3]
...
```

একটা cache line একবার চলে এলে সেই line-এর আরও অনেক element কাজে লাগানো যায়। Cache hit-এর সম্ভাবনা বাড়ে।

Approach B-তে inner loop-এ `i` বাড়ে, তাই access-গুলো হয়:

**[DIAGRAM · approach b · column-major]**

```text
arr[0][0]
arr[1][0]
arr[2][0]
arr[3][0]
...
```

`SIZE = 2048` আর `sizeof(int) = 4` হলে প্রতিটা access-এর মাঝে দূরত্ব:

**[DIAGRAM · stride]**

```text
2048 × 4 = 8192 bytes
```

অর্থাৎ পরের element পেতে memory-তে প্রায় ৮ KB লাফ দিতে হচ্ছে। এতে spatial locality খারাপ হয় — একই cache line আবার কাজে লাগার সুযোগ কমে যায়, cache miss-এর হার অনেক বেড়ে যেতে পারে।

তাই Approach A সাধারণত Approach B-র চেয়ে অনেক বেশি cache-friendly। তবে **ঠিক কত গুণ দ্রুত হবে, সেটা hardware, compiler আর workload-এর ওপর নির্ভর করে।**

> **একই algorithmic result-এর জন্যও memory access pattern performance বদলে দিতে পারে।**

এই একই locality principle-এর কারণেই data structure বা algorithm বাছার সময় শুধু Big-O complexity নয়, memory access pattern-ও গুরুত্বপূর্ণ হতে পারে। নিচের যন্ত্রে দুই mode toggle করে hit/miss গুনে দেখুন:

**[WIDGET · RowColumnTraversal]**

---

## ০৫ — SRAM আর DRAM: ভেতরে পার্থক্য কী?

Cache আর main RAM — দুটোই semiconductor memory, কিন্তু সাধারণত এদের storage cell একরকম নয়।

### SRAM — cache-এর দিকে

**[HOVER: SRAM]** (Static RAM) সাধারণত একাধিক transistor দিয়ে তৈরি একটা bistable cell ব্যবহার করে bit ধরে রাখে; common design-এ ৬-transistor cell দেখা যায়।

সুবিধা: খুব দ্রুত access, আলাদা refresh cycle লাগে না, আর CPU-র কাছাকাছি ঘন ঘন access করা data-র জন্য উপযুক্ত।

অসুবিধা: প্রতি bit-এ বেশি hardware লাগে, তাই storage density কম — একই capacity বানাতে বেশি silicon area লাগে।

এই কারণেই SRAM তুলনামূলক ছোট আর দ্রুত cache-এর জন্য উপযোগী।

### DRAM — main memory-র দিকে

**[HOVER: DRAM]** (Dynamic RAM) সাধারণত একটা transistor আর একটা capacitor-ভিত্তিক cell দিয়ে bit রাখে। Capacitor-এ জমা charge সময়ের সঙ্গে leak করে, তাই DRAM-কে নিয়মিত **refresh** করতে হয়।

এর বড় সুবিধা density — অনেক বেশি bit খুব ছোট physical area-তে রাখা যায়। তাই large-capacity main memory-র জন্য DRAM উপযোগী।

কিন্তু এর cell structure আর read/write process SRAM-এর তুলনায় বেশি জটিল, তাই latency-ও বেশি।

**[DIAGRAM · trade-off]**

```text
SRAM → faster, larger per-bit footprint, more expensive per bit
DRAM → slower, denser, cheaper per bit
```

এই trade-off-টাই বুঝিয়ে দেয় কেন cache আর main memory আলাদা technology-তে বানানো হয়।

**[WIDGET · SRAMvsDRAM]**

---

## ০৬ — Volatility: power গেলে কী হয়?

Memory-কে আরেকভাবেও ভাগ করা যায়: **power বন্ধ হওয়ার পর data কি নির্ভরযোগ্যভাবে থেকে যায়?** এটাই **[HOVER: volatile আর non-volatile]**-এর পার্থক্য।

Register, cache আর DRAM-based main memory volatile। মানে এগুলো power ছাড়া stored state অনির্দিষ্টকাল ধরে রাখার জন্য designed নয় — power চলে গেলে আগের data আর নির্ভরযোগ্যভাবে থাকে না।

SSD আর HDD non-volatile। power ছাড়াও এরা data ধরে রাখতে পারে, আর এদের physical technology আলাদা:

- **HDD:** magnetic storage ব্যবহার করে।
- **SSD:** NAND flash memory ব্যবহার করে, যেখানে electrical charge দিয়ে stored state বহুদিন ধরে রাখা যায়।

**[DIAGRAM · state retention]**

```text
Volatile
→ requires power to retain state

Non-volatile
→ can retain state without continuous power
```

এখানে এই distinction-টুকুই যথেষ্ট। physical implementation-এর গভীর detail পরে দরকার হলে দেখা যাবে।

---

## ০৭ — পুরো ছবিটা একবার

ধরুন CPU-কে এমন একটা instruction execute করতে হবে, যার জন্য memory থেকে একটা value load করা দরকার। Simplifiedভাবে গল্পটা এমন:

- **CPU memory access-এর প্রয়োজন বুঝল।** Instruction-এর control information থেকে CPU জানে যে একটা memory value লাগবে, আর কোন address থেকে সেটা নিতে হবে।
- **কাছের cache-এ খোঁজা হয়।** L1 data cache-এ value থাকলে সেটা cache hit — CPU কম latency-তেই data পেয়ে যায়।
- **না থাকলে নিচের level-এ।** Processor-এর design অনুযায়ী request L2, তারপর L3-এ যেতে পারে। যেখানে data পাওয়া যায়, সেখান থেকে সেটা CPU-র দিকে ফেরে, আর প্রয়োজন অনুযায়ী cache-এ রাখা হতে পারে। কোনো cache-এই না থাকলে request main memory পর্যন্ত যায়।
- **Data পেলে execution এগোয়।** Data execution machinery-তে ফিরে এলে instruction-এর বাকি অংশ চলতে পারে, আর result শেষ পর্যন্ত কোনো register-এ বসতে পারে।

**[DIAGRAM · lookup]**

```text
CPU
 ↓
L1
 ↓
L2
 ↓
L3
 ↓
RAM
```

উপরের layer-এ data পাওয়া গেলে নিচ পর্যন্ত যেতেই হয় না। এই কারণেই cache hit মূল্যবান, আর cache miss expensive হতে পারে। নিচের যন্ত্রে data কোথায় পাওয়া গেল সেটা বেছে নিয়ে পুরো cascade দেখুন:

**[WIDGET · MemoryLookupCascade]**

### Page fault কোথায় আসে?

এটা আলাদা একটা concept, যেটা আমরা এখানে বিস্তারিত করছি না। Virtual memory-তে CPU যে address ব্যবহার করছে, তার required page যদি RAM-এ এই মুহূর্তে না থাকে, তখন **[HOVER: page fault]** ঘটতে পারে, আর operating system-কে জড়াতে হয়।

> **Cache miss মানে relevant cache-এ data পাওয়া যায়নি। Page fault হলো virtual memory system-এর একটা আলাদা ঘটনা।** দুটোকে গুলিয়ে না ফেলাই ভালো।

---

## ০৮ — বাস্তবতার কোণা: একাধিক core হলে?

একাধিক CPU core থাকলে আরেকটা সমস্যা আসে।

একই memory data-র copy একাধিক core-এর private cache-এ থাকতে পারে। কোনো একটা core সেই data বদলালে অন্য core যেন অনির্দিষ্টকাল পুরোনো, inconsistent copy ব্যবহার করতে না থাকে — তার জন্য processor-এ **[HOVER: cache coherence]** mechanism থাকে।

> **একাধিক core-এর private cache থাকলে cached copy-গুলোর মধ্যে consistency রাখতে hardware-এর বাড়তি coordination দরকার হয়।**

এখানে অনেক protocol আর hardware mechanism জড়িত। MESI-র মতো protocol-এর বিস্তারিত পরে আলাদা করে দেখা যেতে পারে।

---

## এই আর্টিকেলে কী শিখলাম

- একটা memory technology সবদিক থেকে সেরা হতে পারে না — latency, capacity আর cost-এর মধ্যে trade-off আছে, তাই computer একাধিক storage layer ব্যবহার করে।
- Memory hierarchy CPU-কে দরকারি data দ্রুত পাওয়ার সুযোগ দেয় — register আর cache ছোট কিন্তু দ্রুত, RAM অনেক বড়, storage আরও বড় কিন্তু অনেক ধীর।
- Cache দাঁড়িয়ে আছে locality-র ওপর — recently used data আবার লাগতে পারে (temporal), আর কাছের address-ও শিগগির লাগতে পারে (spatial)।
- Cache line কাছের data-কে কাজে লাগায় — একটা miss-এর সময় আশেপাশের data সহ একটা block আসতে পারে, ফলে পরের access-গুলো hit হতে পারে।
- SRAM আর DRAM আলাদা trade-off দেয় — SRAM দ্রুত কিন্তু প্রতি bit-এ জায়গা বেশি; DRAM dense আর সস্তা, কিন্তু latency বেশি ও refresh লাগে।
- Volatile আর non-volatile-এর পার্থক্য state retention-এর — volatile storage power ছাড়া state নির্ভরযোগ্যভাবে রাখতে পারে না, non-volatile পারে।

---

## পরের article-এ: Operating System

এখন আমরা computer-এর memory hierarchy-র গল্পটা জানি। কিন্তু laptop খুলে দেখুন — browser, VS Code, Spotify, terminal, video call, সব একসাথে চলছে। এখান থেকেই নতুন প্রশ্ন: একটা program নিজের memory space পায় কীভাবে? একটা program হঠাৎ করে অন্য program-এর memory-তে ঢুকে যেতে পারে না কেন? কে ঠিক করে কোন program কখন CPU পাবে? আর virtual memory কীভাবে RAM-কে প্রতিটা program-এর কাছে নিজের আলাদা address space-এর মতো দেখায়?

এই কাজগুলোতে operating system-এর পাশাপাশি CPU-র কিছু hardware mechanism-ও জড়িত। পরের আর্টিকেলে আমরা software আর hardware-এর সেই boundary-তে যাব।

**[পরের article: ০৬ — Operating System: The Grand Conductor]**

**Hover terms used** (definitions live in `glossary.ts`): `stall`, `locality`, `cacheline`, `cachemiss`, `sram`, `dram`, `volatile`, `pagefault`, `cachecoherence`

---
---

# The Memory Hierarchy

## Why one memory is never enough

> *Blocks marked `[DIAGRAM · …]` render through the `<Diagram>` primitive (flow art on paper, not a code well). `[WIDGET · …]` marks an interactive instrument. Hover definitions live only in `src/articles/glossary.ts`.*

Does your laptop have just one memory?

The natural answer — yes, RAM. 16 GB or 32 GB, whatever it is.

But in reality several kinds of storage are working at once in there. Some are so small they hold only a handful of values, but they sit right against the CPU's execution logic. Some are so large they hold terabytes, but the CPU has to wait far longer for anything that comes from them.

Why this arrangement? In the last article we followed an instruction through fetch, decode and execute. But where do those instructions and their data actually live, and why can't one memory do the whole job? That's today's story.

---

## 01 — Why can't we just have one memory?

Simple question:

**Why not build one huge memory and make it as fast as the storage closest to the CPU?**

The problem is engineering trade-offs.

A memory technology has to balance things like:

- **Low latency** — data arrives quickly
- **High capacity** — lots of data can be stored
- **Low cost** — the system stays affordable

No single storage technology is simultaneously best at all of these.

**[DIAGRAM · trade-off]**

```text
Very fast + very large
→ very expensive

Very fast + inexpensive
→ small capacity

Very large + inexpensive
→ higher latency
```

So computer engineers do not rely on one memory technology. Instead, storage with different trade-offs is arranged in layers — the smallest and fastest sits closest to the CPU, larger and slower sits further away.

That layered arrangement is the **Memory Hierarchy**.

> **There is no universal rule that every computer has exactly the same number of memory layers.** The number of levels, their sizes, whether they are shared — all of it varies by architecture. We're using a simplified hierarchy here to get at the underlying idea.

> **// three questions about memory**
>
> When thinking about a storage layer, ask three separate questions:
>
> **How quickly can we get the data?** → Latency
>
> **How much data can it hold?** → Capacity
>
> **How expensive is each unit of capacity?** → Cost
>
> The memory hierarchy is largely an engineering solution for balancing these three.

---

## 02 — The layers

A simplified laptop or desktop memory hierarchy can be pictured like this:

- **Registers** — the storage closest to the CPU's execution logic. They hold values, addresses and state needed directly by ongoing computation. Their capacity is tiny; their access latency is the lowest of all.
- **L1 Cache** — a small cache very close to each core. It is often divided into separate areas for instructions and data — L1i and L1d.
- **L2 Cache** — larger than L1, generally with somewhat higher latency. In many architectures it is closely associated with a core, though the exact design varies.
- **L3 Cache** — a larger cache layer. In many modern multi-core processors it can be shared among cores, but the exact organisation depends on the architecture.
- **RAM** — the system's main memory. It holds a large part of running programs and their data, with far more capacity than caches or registers, and far higher latency.
- **SSD / HDD** — persistent storage. Far more capacity, and it keeps data when power is removed. But it is much slower for the CPU to reach than RAM.

**[DIAGRAM · hierarchy]**

```text
Registers
   ↓
L1 Cache
   ↓
L2 Cache
   ↓
L3 Cache
   ↓
RAM
   ↓
SSD / HDD
```

Moving upward generally means:

> **Smaller → faster → more expensive per unit of capacity**

Moving downward generally means:

> **Larger → slower → cheaper per unit of capacity**

This is a conceptual hierarchy. Real processors can organise these layers differently, share some of them, or leave a particular level out entirely. Tap a layer on the instrument below to see its role:

**[WIDGET · MemoryPyramid]**

### Is cache just "faster RAM"?

Not exactly.

Cache and RAM are both memory, but they are not the same technology at different speeds, and not the same role either. CPU caches are much smaller, lower-latency, and tightly integrated with the processor. Main memory is much larger and holds a much bigger working set.

> The purpose of a cache is not to *replace* RAM. It is to **keep useful data closer to the CPU** so the processor does not have to reach all the way into slower main memory every time.

---

## 03 — Why does the latency difference matter?

It is easy to say "registers are fast and RAM is slow."

The point that matters is that these latencies are not on the same scale. Moving down the hierarchy, access time can grow by very large factors.

And a number of clock cycles is not a fixed property of a memory technology either. How many cycles a given access takes depends on the processor's clock frequency, its architecture, and that particular access.

So rather than memorising exact numbers, keep this mental model:

**[DIAGRAM · mental model]**

```text
Closer to the CPU
→ generally lower latency

Farther down the hierarchy
→ generally higher latency
```

**[WIDGET · LatencyScale]** — a feel for how far the distant layers sit if the nearest access took one human second. Orders of magnitude, not hardware measurements.

If the CPU had to wait on a much slower layer for every piece of data it needed, execution would frequently sit idle waiting. That condition is a **[HOVER: stall]**.

So the goal of the hierarchy, in one line:

> **Keep data that is needed now, or likely to be needed soon, in a fast layer close to the CPU.**

But a cache is small — a whole program's data will not fit. So how does the hardware know which data is worth keeping close? That's where locality comes in.

---

## 04 — Locality: why the hierarchy works

A tiny cache helps because many programs exhibit **[HOVER: locality]** in how they access memory.

Not every program has the same access pattern, and not every access is predictable. But two patterns are extremely common.

### Temporal locality

Data that was just accessed is likely to be accessed again soon — a loop counter, a frequently used variable, data a function keeps reaching for.

> **Recently used data may be needed again soon.**

### Spatial locality

When one memory address is accessed, nearby addresses are often needed soon as well. Traversing an array sequentially, for instance:

**[DIAGRAM · sequential access]**

```text
arr[0]
arr[1]
arr[2]
arr[3]
...
```

The next access is usually close to the current one.

> **Nearby data may be needed soon too.**

Caches exploit both patterns. Which is why bringing in only the exact byte the CPU asked for is not necessarily the best strategy — pulling in a small block of nearby data can pay off.

### Cache lines: how does a cache bring data in?

Caches generally manage data in fixed-size blocks called **[HOVER: cache lines]**, rather than treating every byte as its own transfer. Many modern CPUs use a 64-byte cache line, although the exact size depends on the architecture.

Say the CPU accesses `arr[0]` and that access is a **[HOVER: cache miss]**. The cache line containing that address may be brought in from a lower level of the hierarchy. That line can also hold `arr[1]`, `arr[2]` and other neighbours — so later accesses may be served straight from the cache.

> **A cache line is a cache's unit of transfer and storage.** It is not a universal rule that the CPU always asks RAM for exactly 64 bytes.

Tap an address on the instrument below and watch the rest of its line arrive with it:

**[WIDGET · CacheLineLocality]**

### Code-level impact: row-major vs column-major

Memory hierarchy isn't only a hardware engineer's concern — it shows up directly in the performance of ordinary code.

C's built-in multidimensional arrays are laid out in row-major order in contiguous memory — a row's elements sit next to each other, followed immediately by the next row.

The two loops below sum the same matrix, but with different access patterns:

```c
#define SIZE 2048
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
}
```

Approach A's inner loop reads neighbouring addresses:

**[DIAGRAM · approach a · row-major]**

```text
arr[0][0]
arr[0][1]
arr[0][2]
arr[0][3]
...
```

Once a cache line is brought in, many more elements from that same line can be used. The chance of a cache hit goes up.

Approach B increments `i` in the inner loop, so the accesses go:

**[DIAGRAM · approach b · column-major]**

```text
arr[0][0]
arr[1][0]
arr[2][0]
arr[3][0]
...
```

With `SIZE = 2048` and `sizeof(int) = 4`, each access is separated by:

**[DIAGRAM · stride]**

```text
2048 × 4 = 8192 bytes
```

So the inner loop jumps roughly 8 KB through memory every step. That gives poor spatial locality — the chance of reusing the same cache line drops, and cache misses can climb substantially.

Approach A will therefore usually be much more cache-friendly than Approach B. But **the exact performance difference depends on the hardware, the compiler and the workload.**

> **Even when two pieces of code produce the same result, their memory-access patterns can perform very differently.**

This same locality principle is why performance can depend not only on an algorithm's Big-O complexity, but also on its memory-access pattern. Toggle the two modes below and watch the hit/miss count:

**[WIDGET · RowColumnTraversal]**

---

## 05 — SRAM vs DRAM: what's different inside?

Cache and main memory are both semiconductor memory, but their storage cells are typically built differently.

### SRAM — toward the cache side

**[HOVER: SRAM]** (Static RAM) generally uses a transistor-based bistable cell to hold a bit; a common design uses six transistors.

Advantages: very fast access, no periodic refresh cycle, and a good fit for frequently accessed data close to the CPU.

Disadvantages: more hardware per bit, so lower storage density — the same capacity needs more silicon area.

Which is why SRAM suits relatively small, fast caches.

### DRAM — toward the main-memory side

**[HOVER: DRAM]** (Dynamic RAM) generally stores a bit in a transistor-and-capacitor cell. The charge in that capacitor gradually leaks away, so DRAM has to be **refreshed** periodically.

Its major advantage is density — a very large number of bits fit into a small physical area, which makes it suitable for large-capacity main memory.

Its cell structure and access process are more involved than SRAM's, so its latency is higher.

**[DIAGRAM · trade-off]**

```text
SRAM → faster, larger per-bit footprint, more expensive per bit
DRAM → slower, denser, cheaper per bit
```

That trade-off is the key to why caches and main memory are built from different technologies.

**[WIDGET · SRAMvsDRAM]**

---

## 06 — Volatility: what happens when power is removed?

Memory can also be split by another question: **does the stored data remain reliably available after power is removed?** That is the **[HOVER: volatile / non-volatile]** distinction.

Registers, caches, and DRAM-based main memory are volatile. They are not designed to retain their stored state indefinitely without power — once power goes, the previous state is no longer reliably there.

SSDs and HDDs are non-volatile. They retain data without continuous power, and their physical technologies differ:

- **HDD:** uses magnetic storage.
- **SSD:** uses NAND flash memory, where electrical charge represents stored state over long periods.

**[DIAGRAM · state retention]**

```text
Volatile
→ requires power to retain state

Non-volatile
→ can retain state without continuous power
```

That distinction is all this article needs. The deeper physical implementation can be explored later if it ever matters.

---

## 07 — The complete picture

Suppose the CPU has to execute an instruction that needs a value loaded from memory. In a simplified model, the story runs like this:

- **The CPU needs a memory value.** The instruction's control information tells it that a memory value is required, and what is needed to determine its address.
- **The nearby cache is checked.** If the value is in the L1 data cache, that is a cache hit — the CPU gets its data at low latency.
- **If not, lower levels are tried.** Depending on the processor's organisation, the request can proceed to L2, then L3. Wherever the data is found, it is returned toward the CPU and may be placed into one or more cache levels. If it is in no cache at all, the request goes to main memory.
- **Execution continues.** Once the data reaches the execution machinery, the rest of the instruction can proceed, and a result may eventually land in a register.

**[DIAGRAM · lookup]**

```text
CPU
 ↓
L1
 ↓
L2
 ↓
L3
 ↓
RAM
```

If the data is found at a higher level, the request never has to travel all the way down. That is why cache hits are valuable and cache misses can be expensive. Pick where the data turns up on the instrument below and watch the whole cascade:

**[WIDGET · MemoryLookupCascade]**

### Where does a page fault fit?

That is a separate concept, and one we won't go into here. In a virtual-memory system, if the page an address falls in isn't currently resident in RAM, accessing it can trigger a **[HOVER: page fault]** and pull in the operating system.

> **A cache miss means the data wasn't found in the relevant cache. A page fault is a separate virtual-memory event.** Keeping the two apart makes the next article easier.

---

## 08 — Reality corner: what changes with multiple cores?

Multiple CPU cores introduce another problem.

The same piece of memory data may have copies in the private caches of different cores. If one core changes that data, the others must not keep using an inconsistent copy indefinitely — so processors implement **[HOVER: cache coherence]** mechanisms.

> **When multiple cores hold private caches, extra hardware coordination is needed to keep the cached copies consistent.**

Many protocols and hardware mechanisms are involved. Protocols such as MESI can be explored separately later.

---

## What this article covered

- No single memory technology is best at everything — latency, capacity and cost trade off against each other, so computers use several storage layers.
- The hierarchy helps the CPU reach useful data quickly — registers and caches are small but fast, RAM is much larger, storage larger still but far slower.
- Caches rely on locality — recently used data may be needed again (temporal), and nearby addresses may be needed soon too (spatial).
- Cache lines exploit nearby data — a miss can bring in a block containing neighbours, so later accesses may become hits.
- SRAM and DRAM make different trade-offs — SRAM is faster but takes more area per bit; DRAM is denser and cheaper per bit, but higher latency and needs refreshing.
- Volatile and non-volatile differ in state retention — volatile storage can't reliably hold state without power; non-volatile can.

---

## Next article: Operating System

We now understand the basic idea of the memory hierarchy. But look at a real laptop: browser, VS Code, Spotify, terminal, a video call, all running at once. That raises new questions. How does each program get its own memory space? How does one program stop reaching into another's memory? Who decides which program gets the CPU, and when? And how does virtual memory make RAM look, to every program, like its own private address space?

These responsibilities involve both the operating system and hardware mechanisms inside the processor. The next article steps into that boundary between software and hardware.

**[Next: 06 — Operating System: The Grand Conductor]**

**Hover terms used** (definitions live in `glossary.ts`): `stall`, `locality`, `cacheline`, `cachemiss`, `sram`, `dram`, `volatile`, `pagefault`, `cachecoherence`
