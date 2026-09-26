# Bit-এর ভেতরে কী থাকে?

## Transistor, voltage, আর memory-র শুরু

> *`[DEEPER · …]` দিয়ে চিহ্নিত অংশগুলো article-এ collapsible toggle হিসেবে render হয় (`<Deeper>` primitive) — misconception ঠিক করা বা article-এর মূল depth-এর চেয়ে একটু গভীরে যাওয়া অংশ। পড়ার মূল সুতো এগুলো ছাড়াও সম্পূর্ণ। Hover definition-গুলোর একমাত্র উৎস `src/articles/glossary.ts`।*

ধরুন, কোডে লিখলাম:

```python
x = 5
```

কোডটা রান হলো। এবার একটা অদ্ভুত প্রশ্ন — এই ৫ সংখ্যাটা আসলে কম্পিউটারের ভেতরে কোথায় আছে? কাগজে লেখা ৫-এর মতো তো নয়, screen-এর pixel-এও নয়। তাহলে hardware-এর চোখে এর কি কোনো physical অস্তিত্ব আছে?

আছে — তবে মাঝখানে একটা ধাপ আছে। ৫ নিজে একটা **abstract সংখ্যা**। Computer সেটাকে লেখে একটা bit pattern হিসেবে — যেমন সাধারণ binary-তে `101`। সেই pattern-এর প্রতিটা bit একটা logical মান, ০ অথবা ১। আর hardware প্রতিটা bit-কে ধরে রাখে কোনো একটা **physical বৈদ্যুতিক অবস্থা** দিয়ে।

**[DIAGRAM · সংখ্যা থেকে hardware]**

```text
5            ← abstract সংখ্যা
↓
101          ← bit pattern
↓
1 · 0 · 1    ← তিনটা logical bit
↓
physical বৈদ্যুতিক অবস্থা
```

এই series-এ সেই physical অবস্থা থেকে screen পর্যন্ত পুরো যাত্রাটা দেখানোর চেষ্টা করবো। আজকের প্রশ্ন একটাই — একটা [HOVER: bit]-এর ০ বা ১-কে hardware physically ধরে রাখে কীভাবে?

একটা কথা আগে বলে রাখি — এখানে কোনো নির্দিষ্ট programming language নিয়ে কথা বলবো না। Software-এর স্তরগুলো সরিয়ে একেবারে hardware-এর কাছে নামবো, যেখানে "variable" বা "object" বলে কিছু নেই — আছে transistor, তার, electrical signal আর জমা রাখা charge। বোঝার সুবিধার জন্য বেশিরভাগ সময় voltage-এর ভাষায় কথা বলবো।

> তবে মনে রাখবেন: **bit নিজে voltage নয়**। Voltage হলো bit-এর logical মানটাকে বাস্তবে প্রকাশ করার একটা physical উপায়।

---

## ০১ — Binary কেন?

কম্পিউটারের ভেতরে তথ্য শেষ পর্যন্ত রাখতে হয় electrical signal দিয়ে। কিন্তু একটা signal-এর [HOVER: voltage] ক্রমাগত যেকোনো মান নিতে পারে — ০.৩ ভোল্ট, ১.৭ ভোল্ট, মাঝামাঝি যেকোনো কিছু।

তাহলে স্বাভাবিক প্রশ্ন — কম্পিউটার base-10 ব্যবহার করলে কী হতো? মানুষের ১০টা আঙুল বলে আমরা ০ থেকে ৯ গুনি। কম্পিউটারেও তো ১০টা আলাদা voltage level রাখা যেত।

তাত্ত্বিকভাবে যেত। ঝামেলাটা math-এ না, physics-এ। আর ঝামেলাটার নাম — **noise**।

বাস্তব circuit-এ signal কখনো একদম স্থির থাকে না। তাপমাত্রার ওঠানামা, power supply-র ছোট fluctuation, পাশের তারের electromagnetic interference — সবকিছু voltage-কে একটু এদিক-ওদিক করে দেয়।

**[WIDGET · NoiseVsBands]** — noise বাড়িয়ে base-10 আর binary তুলনা। Caption: কাছাকাছি সাজানো দশটা range-এ noise-এর জায়গা কম; দূরে রাখা দুটো range-এর মাঝখানের gap-টাই noise margin। Threshold-গুলো উদাহরণ মাত্র।

দশটা level রাখতে গেলে প্রতিটার জন্য জায়গা খুব সরু। সামান্য noise-ই একটা level-কে পাশেরটায় ঠেলে দেয় — আর "২" নিঃশব্দে "৩" হয়ে যায়।

Binary-তে level মাত্র দুটো, তাই LOW আর HIGH-কে অনেক দূরে রাখা যায়। মাঝখানে থাকে একটা চওড়া gap — [HOVER: noise margin]। Noise যতক্ষণ এই gap পার না করে, circuit একই মান পড়ে। 

এটাই binary-র আসল কারণ। ০ আর ১ দিয়ে data রাখা সহজ, তা না — **০ আর ১ নির্ভরযোগ্য**। Digital circuit ইচ্ছা করেই এমনভাবে বানানো হয়, যাতে এই দুটো অবস্থা পরিষ্কার আলাদা থাকে।

এর মানে এই না যে কম্পিউটার শুধু ০ আর ১ নিয়েই কাজ করতে পারে। বড় সংখ্যা, লেখা, ছবি, শব্দ — সবই অনেকগুলো bit-এর pattern দিয়ে প্রকাশ করা যায়। সেই গল্প পরের article-এ।

পরের প্রশ্ন: এই signal-গুলো নিয়ন্ত্রণ করে কে?

---

## ০২ — Transistor — সবচেয়ে ছোট সুইচ

কম্পিউটারকে কখনো একটা বৈদ্যুতিক পথ খুলে দিতে হয়, কখনো বন্ধ করতে হয়। মানে তার দরকার একটা switch।

কিন্তু বাড়ির লাইটের switch তো আপনি হাত দিয়ে চাপেন। একটা chip-এ যদি কয়েকশো কোটি switch থাকে, সেগুলো চাপবে কে?

সেখানেই আসে transistor।

Transistor-কে এই পর্যায়ে ভাবা যায় একটা অতি ক্ষুদ্র, বিদ্যুৎ-নিয়ন্ত্রিত কল হিসেবে। বাসার পানির কল খুললে পানি যায়, বন্ধ করলে থামে। শুধু এই কলটার হাতল কোনো মানুষ ঘোরায় না — ঘোরায় আরেকটা ছোট্ট electrical signal।

**[WIDGET · TransistorSwitch]** — পানির কল আর n-MOSFET পাশাপাশি; Gate-এ signal দিলে পথ খোলে। ভেতরে একটা ছোট toggle: MOSFET-এর তিনটা terminal — Gate, Source, Drain। Gate-এর voltage ঠিক করে Source আর Drain-এর মাঝ দিয়ে current কতটা সহজে যাবে; "যেদিক দিয়ে ঢোকে সেটাই Source" — এমন সরল নিয়ম নেই।

এখানে গুরুত্বপূর্ণ ব্যাপার একটাই — **একটা electrical signal আরেকটা electrical পথকে নিয়ন্ত্রণ করতে পারে**।

এই ছোট্ট আইডিয়াটার ওপরই দাঁড়িয়ে আছে পুরো আধুনিক কম্পিউটার। আপনি এই লেখাটা পড়তে পড়তে আপনার ফোন বা ল্যাপটপের ভেতরে কয়েকশো কোটি transistor প্রতি সেকেন্ডে অসংখ্যবার এক অবস্থা থেকে আরেক অবস্থায় যাচ্ছে।

**[DEEPER · আরেকটু গভীরে — transistor কি শুধু on আর off-ই বোঝে?]**

না। Transistor একটা **physical device** — "০" বা "১" বলে কিছু সে বোঝে না। Gate-এর voltage একটু একটু করে বাড়ালে তার ভেতর দিয়ে current-ও ধীরে ধীরে বাড়ে; পুরো বন্ধ আর পুরো চালুর মাঝখানে অনেক অবস্থা আছে।

Digital circuit এই মাঝামাঝি অঞ্চলটা এড়িয়ে চলে। Transistor-কে প্রায় সবসময় জোরালোভাবে "প্রায় পুরো চালু" বা "প্রায় পুরো বন্ধ"-এর দিকে ঠেলে রাখা হয়, আর তার ফলে output-এ যে voltage তৈরি হয়, সেটাকে আমরা LOW বা HIGH — ০ বা ১ — হিসেবে পড়ি।

অর্থাৎ ০ আর ১ transistor-এর নিজের গুণ নয়; অনেকগুলো transistor মিলে গড়া circuit-এর আচরণকে আমরা এভাবে ব্যাখ্যা করি।

---

## ০৩ — Switch জোড়া দিলে কী হয়?

একটা transistor দিয়ে বেশি কিছু হয় না — ঠিক যেমন একটা LEGO block দিয়ে ঘর হয় না। কিন্তু অনেকগুলো transistor নির্দিষ্টভাবে জোড়া দিলে এমন circuit তৈরি হয়, যা হিসাব করতে পারে, এমনকি মনেও রাখতে পারে।

একটা সরল switch-মডেল দিয়ে ভাবা যাক। দুটো switch যদি এক লাইনে ([HOVER: series / parallel]) থাকে, পথ সম্পূর্ণ হতে দুটোকেই চালু থাকতে হবে — আচরণটা AND-এর মতো। পাশাপাশি (parallel) থাকলে যেকোনো একটা চালু হলেই পথ সম্পূর্ণ — আচরণটা OR-এর মতো। আর wiring একটু বদলে পাওয়া যায় NOT — input ১ হলে output ০, input ০ হলে output ১।

**[WIDGET · GatePlayground]** — AND / OR / NOT-এর switch-ছবি, symbol আর truth table। Caption: series-এ সাজানো switch AND-এর মতো, parallel-এ OR-এর মতো — বোঝার জন্য একটা সরল মডেল।

**[DEEPER · আরেকটু গভীরে — আসল AND gate কি সত্যিই দুটো transistor series-এ?]**

পুরোপুরি না — উপরের switch-ছবিটা বোঝার জন্য, chip-এর আসল নকশা নয়। আসল chip-এ AND gate সরাসরি বানানো হয় না; বানানো হয় একটা **NAND** gate, তার পরে একটা NOT বসিয়ে। NAND আর NOR — chip-এ এই দুটো gate বানানো সবচেয়ে সস্তা, তাই বাকি gate-গুলো সাধারণত এদের দিয়েই গড়া হয়।

"Series মানে দুটোই লাগবে, parallel মানে যেকোনো একটা" — এই intuition-টা এতে নষ্ট হয় না। শুধু মাথায় রাখুন, আসল chip-এ AND gate মানে হুবহু দুটো transistor এক লাইনে বসানো নয়।

AND, OR, NOT — এই তিনটা gate দিয়ে **যেকোনো logical operation** বানানো যায়: যেকোনো তুলনা, যেকোনো গাণিতিক হিসাব। XOR, NAND, NOR — সবই এদের combination।

Arithmetic-ও এভাবেই। দুইটা bit যোগ করার circuit (full adder) বানানো যায় কয়েকটা gate দিয়ে, আর অনেকগুলো full adder পাশাপাশি রাখলে বড় সংখ্যা যোগ করার circuit হয় — যা CPU-র ভেতরের [HOVER: ALU]-র একটা গুরুত্বপূর্ণ অংশ।

কিন্তু arithmetic-এর গল্প পরে। এখানে এখনো একটা সমস্যা আছে।

---

## ০৪ — Switch কীভাবে "মনে রাখে"?

এতক্ষণের সব gate-এর একটা বড় সীমাবদ্ধতা আছে: output নির্ভর করে শুধু এই মুহূর্তের input-এর ওপর। Input বদলালেই output বদলে যায় — **আগের মান ধরে রাখার কোনো ব্যবস্থা নেই**।

যেমন, AND gate-কে দিলাম (১, ১) — output ১। Input বদলে (০, ১) করলাম — output সঙ্গে সঙ্গে ০। আগে যে ১ ছিল, gate সেটা মনে রাখে না।

এটা memory না। কিন্তু কম্পিউটারের memory দরকার। আপনার `x = 5` মানে ৫-কে কোথাও রাখতে হবে, যেন পরে পড়া যায়। কীভাবে?

আমার সবচেয়ে বড় বিভ্রান্তিটা এখানেই ছিল। বিশ্ববিদ্যালয়ে ডিজিটাল লজিক ডিজাইন কোর্সে SR Latch, JK Flip-Flop, truth table, register — সবই ছিলো। প্রত্যেকটা কম্পোনেন্ট কেন লাগে, কিভাবেই আসলেই “ধরে রাখে” — বুঝতাম না। কোডিং করার সময় যখন `x = 5` লিখতাম, এই দুই পৃথিবীর মধ্যে কোনো সম্পর্ক খুঁজে পেতাম না। Memory কি এক ফালি magnetic ধাতু? নাকি charge-এর কোনো চৌবাচ্চা? দুঃখজনকভাবে, আমাদেরকে কোর্সের পর কোর্স করানো হয়, যেখানে কোনোকিছু গোড়া থেকে না বুঝেই কেবল স্লাইড মুখস্থ করে আর বিগত প্রশ্নপত্রগুলো একটু স্টাডি করেই পার পাওয়া যায়।

যাই হোক, সমাধানটা চমৎকার এবং সহজ — **feedback**। এমন একটা circuit দরকার, যার এখনকার অবস্থা নিজেই তার পরের অবস্থাকে প্রভাবিত করে।

দুইটা NOT gate নিন। প্রথমটার output দ্বিতীয়টার input-এ দিন। দ্বিতীয়টার output আবার প্রথমটার input-এ দিন।

**[WIDGET · FeedbackLatch]** — দুটো cross-coupled NOT gate; write 1 / write 0 আর power কাটার বোতাম। Wire-এ কোনো "ঘুরতে থাকা current" animation নেই — শুধু কোন wire HIGH, সেটা আলো। Caption: দুটো stable state; বদলাতে বাইরে থেকে লিখতে হয়; power কাটলে state আর নিশ্চিত নয়।

এখন কী হয়? ধরুন প্রথম gate-এর output ১। সেটা দ্বিতীয় gate-এ যায়; NOT gate, তাই তার output ০। সেই ০ ফিরে যায় প্রথম gate-এ; NOT gate, তাই output ১ — যা ছিল, তাই। Loop নিজেকে ধরে রাখছে।

উল্টোটাও একইভাবে stable: প্রথম gate ০, দ্বিতীয় ১। মানে circuit-টার **দুটো stable অবস্থা** আছে — একটাকে আমরা ০ বলি, অন্যটাকে ১। এখানে বাইরে থেকে কোনো input নেই যেটা সরিয়ে নেওয়া যায়; state বদলাতে হলে বাইরে থেকে জোর করে লিখতে হয় — যন্ত্রের write বোতামের মতো।

আরেকভাবে ভাবুন — একটা marble দুইটা গর্তের একটায় বসে আছে। নিজে নিজে নড়বে না। কিন্তু যথেষ্ট জোরে ধাক্কা দিলে অন্য গর্তে চলে যাবে, আর সেখানেও স্থির থাকবে।

এখানে "মনে রাখা" মানে circuit অতীতের কিছু জানে, তা না। শুধু এটুকু — **power থাকা পর্যন্ত** circuit-এর বর্তমান বৈদ্যুতিক অবস্থা নিজেই নিজেকে টিকিয়ে রাখে। এই feedback-ই একটা [HOVER: latch]-এর মূল ভিত্তি।

**[DEEPER · আরেকটু গভীরে — Gated latch আর flip-flop]**

এবার নতুন প্রশ্ন: circuit নতুন মান নেবে কখন? আমি এখন ১ লিখতে চাই, ৫ সেকেন্ড পরে ০। সবসময় input শুনতে থাকলে প্রতিটা নতুন signal আগের মান মুছে দেবে।

তাই দরকার একটা "দারোয়ান" — যে বলবে "এখন নাও", অথবা "এখন উপেক্ষা করো, পুরনোটাই ধরে রাখো।" এই কাজটাই করে `Write Enable` signal। এমন circuit-কে বলে gated latch।

**[DIAGRAM · gated storage]**

```text
Data ─────────► Storage
                  ▲
                  │
            Write Enable
```

তবে latch আর [HOVER: flip-flop] **এক জিনিস নয়**। Latch-এর enable যতক্ষণ চালু থাকে, সেই পুরো সময়টা input বদলালে stored মানও বদলায়। Flip-flop input নেয় শুধু clock-এর একটা নির্দিষ্ট মুহূর্তে — clock edge-এ। CPU-র register সাধারণত flip-flop দিয়েই বানানো।

**[DIAGRAM · কখন নতুন মান ঢোকে]**

```text
Latch:      enable চালু থাকার পুরো সময়  → input ঢুকতে পারে
Flip-flop:  clock edge-এর মুহূর্তে      → একবার capture
```

**[DEEPER (nested) · আরেকটু গভীরে যাই — শুধু Clock জুড়ে দিলেই কি Flip-flop হয়ে যায়?]**

কিছু circuit-এ শুধু clock জুড়ে দিলেই নতুন একটা সমস্যা তৈরি হয়। উদাহরণ হিসেবে একটা counter ধরুন — যে circuit প্রতি tick-এ নিজের মান উল্টে দেয়: ০ → ১ → ০ → ১। মানে তার input আসলে নিজের output-এরই উল্টো (D = NOT Q)।

এখন storage হিসেবে যদি একটা সাধারণ latch বসাই — clock high থাকা মানে latch transparent, এই পুরো সময়টা input বদলালে output-ও বদলায়। Q বদলাতেই D উল্টে যায়, সেই নতুন D আবার Q বদলায়। Gate-এর ভেতরের delay কয়েক ন্যানোসেকেন্ড, আর clock high থাকে তার চেয়ে অনেক বেশি সময় — তাই এক pulse-এর ভেতরেই Q বহুবার দুলতে থাকে। Clock নামার সময় কোনটায় গিয়ে থামবে, বলা যায় না। এটাই **race-around** সমস্যা।

সমাধানের একটা classic উপায়: একটা latch-এর বদলে দুটো — **Master আর Slave**। Clock ০ হলে খোলে শুধু Master, ১ হলে শুধু Slave। দুটো কখনো একসঙ্গে খোলা থাকে না, তাই নতুন মান একবার Master-এ আটকা পড়ে, পরের ধাপে একবারই Slave-এ পৌঁছায় — প্রতি tick-এ Q বদলায় ঠিক একবার।

নিচের যন্ত্রে একই counter দুই ভাবে চালিয়ে দেখুন:

**[WIDGET · MasterSlaveFlipFlop]** — একই toggle counter, mode বদলে: একটামাত্র latch (clock high-এর পুরো সময় খোলা → Q দুলতে থাকে, প্রতি tick-এ এলোমেলো মান) বনাম master + slave (কখনো একসঙ্গে খোলে না → প্রতি tick-এ ঠিক একবার বদলায়)।

বাস্তবে flip-flop আরও অন্য নকশাতেও বানানো হয় — সেই বিস্তারিত এই series-এর বাইরে। তবে clock নিজে কী করে আর কেন লাগে, তার পুরো আলোচনা আছে ০৩ নম্বর article-এ। আপাতত এটুকুই যথেষ্ট: শুধু clock জুড়ে দেওয়াটাই গল্পের শেষ নয়।

আর এই state টেকে কতক্ষণ? যতক্ষণ power আছে। Power চলে গেলে state আর নিশ্চিত থাকে না। RAM-ও তাই volatile — unplug করলে সব হারায়।

**[DEEPER · আরেকটু গভীরে — RAM-ও কি এই circuit দিয়েই বানানো?]**

**ঠিক এই circuit দিয়ে না।** Feedback এখানে storage বোঝার মূল ধারণা, সব memory-র হুবহু নকশা নয়।

CPU-র register সাধারণত flip-flop দিয়ে বানানো। [HOVER: SRAM]-এর প্রতিটা cell আসলে এই article-এর latch-এরই আত্মীয় — সেই একই cross-coupled feedback loop, সঙ্গে read-write-এর জন্য বাড়তি দুটো transistor। অর্থাৎ এটি একটি latch, clock edge-এ capture করা flip-flop নয়। আর computer-এর main RAM সাধারণত [HOVER: DRAM] — সেখানে bit থাকে একটা ছোট্ট capacitor-এ জমা charge হিসেবে, যা ধীরে ধীরে leak করে বলে বারবার refresh করতে হয়।

কোথায় কোনটা কেন ব্যবহার হয়, সেই গল্প memory hierarchy-র article-এ।

---

## ০৫ — পুরো গল্পটা একবার

এবার পুরো বিষয়টা প্রথম থেকে একবার দেখি। আপনি লিখলেন `x = 5`।

Python অবশ্যই সরাসরি transistor নাড়াচ্ছে না — মাঝখানে interpreter, operating system, CPU আছে, আর Python memory-তে একটা সংখ্যাকে নিজের মতো করে একটা object হিসেবে সাজায়। সেসব পরে। শুধু hardware-এর ধারণাটা বোঝার জন্য ধরে নিই:

- ৫ binary-তে `101`
- এই তিনটা logical bit hardware-এ তিনটা physical অবস্থা হিসেবে থাকে
- অবস্থাগুলো কী দিয়ে তৈরি, সেটা নির্ভর করে কোথায় রাখা হচ্ছে — CPU register-এ flip-flop, RAM-এ memory cell
- পরে CPU সেই অবস্থাগুলো sense করে আবার তিনটা bit ফিরে পায়
- আর software সেই `101`-কে ৫ হিসেবে ব্যবহার করে

**[WIDGET · ThreeBits]** — তিনটা bit toggle করে ১০১ = ৫।

পুরো ব্যাপারটাকে কয়েকটা স্তরে ভাবা যায়:

**[DIAGRAM · স্তরগুলো]**

```text
Transistor
↓
Logic gate আর storage circuit
↓
বড় digital circuit (adder, register …)
↓
Memory, CPU, controller, I/O
↓
Software
```

প্রতিটা স্তর নিজের নতুন abstraction যোগ করে, তাই software-এর কোনো ধারণা সরাসরি একটা নির্দিষ্ট circuit-এর সাথে মিলবে — এমন ভাবা ঠিক নয়। কিন্তু সবকিছুর নিচে আছে এই তিনটা ধারণা: transistor দিয়ে switch, switch দিয়ে gate, আর feedback দিয়ে মনে রাখা।

---

## এই আর্টিকেলে কী শিখলাম

- Bit কোনো voltage নয় — bit একটা logical মান, hardware সেটাকে physical বৈদ্যুতিক অবস্থা দিয়ে প্রকাশ করে।
- Binary এসেছে reliability-র জন্য — দুটো অবস্থাকে দূরে রাখলে noise সহজে একটাকে অন্যটা বানাতে পারে না।
- Transistor হলো বিদ্যুৎ-নিয়ন্ত্রিত switch — অনেকগুলো মিলে gate আর storage circuit বানায়।
- Feedback থেকেই মনে রাখা — দুটো stable অবস্থার circuit power থাকা পর্যন্ত নিজের state ধরে রাখে।
- Latch, flip-flop, SRAM, DRAM এক জিনিস নয় — একই মূল ধারণার ভিন্ন ভিন্ন বাস্তব রূপ।

---

## পরের article-এ

এখন আমরা জানি একটা bit কীভাবে ধরে রাখা যায়।

কিন্তু একটা bit দিয়ে তো কিছুই হয় না।

তাহলে লক্ষ-কোটি bit একসাথে মিলে কীভাবে একটা বাংলা বাক্য, একটা JPEG ছবি, একটা MP3 গান — কিংবা আপনার লেখা এই কোড — তৈরি করে?

**[পরের article: ০২ — যেকোনো তথ্য কীভাবে ০ আর ১ হয়?]**

**Hover terms used** (definitions live in `glossary.ts`): `bit`, `voltage`, `noisemargin`, `serpar`, `alu`, `latch`, `flipflop`, `sram`, `dram`

---
---

# What's inside a bit?

## Transistors, voltage, and the birth of memory

> *Blocks marked `[DEEPER · …]` render as collapsible toggles in the article (the `<Deeper>` primitive) — misconception corrections, or detail that sits below the article's main depth level. The main thread reads complete without opening any of them. Hover definitions live only in `src/articles/glossary.ts`.*

Suppose you write:

```python
x = 5
```

The code runs. Now a strange question — where is that 5 actually stored inside the computer? Not like a 5 written on paper, and not in a pixel on the screen. So does it have any physical existence in the hardware?

It does — but there's a step in between. The 5 itself is **an abstract number**. The computer writes it as a bit pattern — in plain binary, `101`. Each bit in that pattern is a logical value, 0 or 1. And the hardware holds each bit using some **physical electrical state**.

**[DIAGRAM · from number to hardware]**

```text
5            ← an abstract number
↓
101          ← a bit pattern
↓
1 · 0 · 1    ← three logical bits
↓
physical electrical states
```

Over this series I'll try to walk that whole journey — from physical state up to what appears on screen. Today's question is just one: how does hardware physically hold the 0 or 1 of a [HOVER: bit]?

One thing first — I won't talk about any specific programming language. We're stripping away the software layers and going right down to the hardware, where there's no "variable" or "object" — just transistors, wires, electrical signals, and stored charge. To keep things simple, we'll mostly talk in terms of voltage.

> But keep this in mind: **a bit is not itself a voltage**. A voltage is one physical way of representing a bit's logical value.

---

## 01 — Why binary?

Inside a computer, information ultimately has to be held as electrical signals. But a signal's [HOVER: voltage] can take any value along a continuous range — 0.3 volts, 1.7 volts, anything in between.

So a natural question — what if the computer used base-10? We have ten fingers, so we count 0 to 9. Couldn't the computer just keep 10 different voltage levels?

In principle, it could. The problem isn't math. It's physics. And the problem has a name — **noise**.

In a real circuit, a signal is never perfectly steady. Temperature swings, small power-supply fluctuations, electromagnetic interference from neighbouring wires — all of it nudges voltage around.

**[WIDGET · NoiseVsBands]** — raise the noise and compare base-10 with binary. Caption: ten closely spaced ranges leave little room for noise; two widely separated ranges leave a gap, the noise margin. Thresholds are illustrative.

With ten levels, each one gets a very narrow slice of voltage. A little noise pushes a level into its neighbour — and a "2" silently becomes a "3".

Binary has only two levels, so LOW and HIGH can be kept far apart. Between them sits a wide gap — the [HOVER: noise margin]. As long as noise doesn't push the signal across that gap, the circuit reads the same value. (The 0.8 V and 2 V on the instrument are just an example; real thresholds depend on the chip's technology.)

That's the real reason for binary. Not that 0 and 1 make data easy to store — that **0 and 1 are reliable**. Digital circuits are deliberately designed so that those two states stay clearly apart.

That doesn't mean a computer can only work with 0 and 1. Large numbers, text, images, sound — all of it can be expressed as patterns of many bits. That story is the next article.

Next question: what controls these signals?

---

## 02 — The transistor — the smallest switch

A computer sometimes needs to open an electrical path and sometimes needs to close it. In other words, it needs a switch.

But you press your light switch with your hand. If a chip holds billions of switches — who presses them?

That's where the transistor comes in.

At this stage, the easiest way to picture a transistor is as a microscopic, electrically controlled tap. Open your kitchen tap and water flows; close it and it stops. The only difference: no human turns this tap's handle — another tiny electrical signal does.

**[WIDGET · TransistorSwitch]** — a water tap beside an n-MOSFET; a signal on the Gate opens the path. Inner toggle: the MOSFET's three terminals — Gate, Source, Drain. The Gate voltage controls how easily current flows between Source and Drain; there's no simple rule like "Source is where current enters."

The one thing that matters here — **one electrical signal can control another electrical path**.

The entire modern computer stands on that small idea. While you read this, billions of transistors inside your phone or laptop are switching from one state to another countless times per second.

**[DEEPER · go deeper — does a transistor only know on and off?]**

No. A transistor is **a physical device** — it has no notion of "0" or "1". Raise the gate voltage little by little and the current through it rises little by little too; between fully off and fully on there are many in-between states.

Digital circuits avoid that middle region. Transistors are driven firmly toward "almost fully on" or "almost fully off," and the voltage that produces at the output is what we read as LOW or HIGH — 0 or 1.

So 0 and 1 aren't a property of the transistor itself; they're how we interpret the behaviour of a circuit built from many transistors.

---

## 03 — What happens when you join switches?

One transistor doesn't do much — the way one LEGO block doesn't build a house. But connect many transistors in the right arrangement and you get circuits that can calculate, and even remember.

A simple switch model helps here. Put two switches in a line ([HOVER: series / parallel]) and both must be on for the path to complete — that behaves like AND. Put them side by side (parallel) and either one completes the path — that behaves like OR. Change the wiring a little and you get NOT — input 1 gives output 0, input 0 gives output 1.

**[WIDGET · GatePlayground]** — switch pictures, symbols, and truth tables for AND / OR / NOT. Caption: switches in series behave like AND, in parallel like OR — a simple model for intuition.

**[DEEPER · go deeper — is a real AND gate really two transistors in series?]**

Not exactly — the switch picture above is for intuition, not the real chip layout. On a real chip an AND gate usually isn't built directly: it's a **NAND** gate followed by a NOT. NAND and NOR are the cheapest gates to build in silicon, so most other gates are made out of them.

None of that breaks the intuition — "series means both are needed, parallel means either one will do" still holds. Just don't picture a real AND gate as literally two transistors sitting in a line.

AND, OR, NOT — with these three gates you can build **any logical operation**: any comparison, any arithmetic. XOR, NAND, NOR are all combinations of them.

Arithmetic works the same way. A circuit that adds two bits (a full adder) takes only a few gates, and chaining many full adders gives you a circuit that adds large numbers — an important part of the [HOVER: ALU] inside a CPU.

But arithmetic's story comes later. Here, one problem still remains.

---

## 04 — How does a switch "remember"?

Every gate so far has one big limitation: its output depends only on its inputs right now. Change the input and the output changes — **there's no way to hold on to a previous value**.

Say you give an AND gate (1, 1) — output 1. Change the input to (0, 1) — the output is 0 immediately. The gate doesn't remember that it was 1 a moment ago.

That's not memory. But a computer needs memory. Your `x = 5` means the 5 has to be kept somewhere so it can be read later. How?

My biggest confusion was right here. In my university's Digital Logic Design course, we covered everything: SR Latches, JK Flip-Flops, truth tables, and registers. Yet, I never truly understood why each component was necessary, or how it actually retained data. When coding, whenever I wrote `x = 5`, I couldn't bridge the gap between these two worlds. Was memory just a sliver of magnetic metal? Or a pool of trapped electrical charge? Regrettably, we are pushed through course after course where you can get by simply memorizing slides and cramming past exam papers, without ever understanding anything from first principles.

However, the answer is beautiful and simple — **feedback**. We need a circuit whose present state influences its own next state.

Take two NOT gates. Feed the first one's output into the second one's input. Feed the second one's output back into the first one's input.

**[WIDGET · FeedbackLatch]** — two cross-coupled NOT gates; write 1 / write 0 and a power button. No "circulating current" animation on the wires — only which wire is HIGH lights up. Caption: two stable states; changing them takes an outside write; cut the power and the state is no longer guaranteed.

Now what happens? Say the first gate's output is 1. That goes into the second gate; it's a NOT gate, so its output is 0. That 0 goes back into the first gate; NOT again, so its output is 1 — exactly what it already was. The loop holds itself in place.

The opposite arrangement is just as stable: first gate 0, second gate 1. So the circuit has **two stable states** — one we call 0, the other 1. There's no outside input here to take away; to change the state, something has to force it from outside — like the write buttons on the instrument.

Another way to picture it — a marble resting in one of two valleys, separated by a small hill. It won't move on its own. Push it hard enough and it rolls into the other valley, and settles there instead.

"Remembering" doesn't mean the circuit knows anything about the past. It only means this: **as long as it's powered**, the circuit's present electrical state keeps itself in place. That feedback is the heart of a [HOVER: latch].

**[DEEPER · go deeper — gated latch and flip-flop]**

Now a new question: when should the circuit take a new value? I want to write 1 now, and 0 five seconds later. If it listened to its input all the time, every new signal would wipe out the old value.

So it needs a "doorman" — something that says "take the input now," or "ignore it and keep the old value." That's the job of a `Write Enable` signal. A circuit like this is called a gated latch.

**[DIAGRAM · gated storage]**

```text
Data ─────────► Storage
                  ▲
                  │
            Write Enable
```

But a latch and a [HOVER: flip-flop] **are not the same thing**. While a latch's enable is on, any change on its input changes the stored value for that whole window. A flip-flop takes its input only at one specific moment — a clock edge. CPU registers are usually built from flip-flops.

**[DIAGRAM · when a new value gets in]**

```text
Latch:      whole time enable is on  → input can get in
Flip-flop:  at the clock edge        → captured once
```

**[DEEPER (nested) · go deeper — does attaching a clock alone make it a flip-flop?]**

In some circuits, just attaching a clock creates a new problem. Take a counter — a circuit that flips its own value on every tick: 0 → 1 → 0 → 1. Which means its input is simply the opposite of its own output (D = NOT Q).

Now suppose the storage is a plain latch. While the clock is high the latch is transparent, so for that whole window any change on the input changes the output. The moment Q flips, D flips too — and that new D flips Q again. A gate's internal delay is a few nanoseconds while the clock stays high far longer, so Q swings back and forth many times within a single pulse. Where it lands when the clock drops is anyone's guess. That's the **race-around** problem.

One classic fix: use two latches instead of one — a **master and a slave**. The master opens only while the clock is 0, the slave only while it is 1. They are never open together, so a new value is caught once by the master and handed on once to the slave — Q changes exactly once per tick.

Run the same counter both ways on the instrument below:

**[WIDGET · MasterSlaveFlipFlop]** — the same toggle counter, switchable: one latch (open for the whole clock-high window → Q races, landing on a random value each tick) vs master + slave (never open together → flips exactly once per tick).

Real flip-flops are built with other designs too — that detail sits outside this series. What the clock itself does, and why it's needed, is covered in full in article 03. For now this is enough: just attaching a clock isn't the whole story.

And how long does the state last? As long as there's power. Once power is gone, the state is no longer guaranteed. That's also why RAM is volatile — unplug it and everything is lost.

**[DEEPER · go deeper — is RAM built from this same circuit?]**

**Not this exact circuit.** Here, feedback is the core idea for understanding storage — not the exact blueprint of every kind of memory.

CPU registers are usually built from flip-flops. Each [HOVER: SRAM] cell is a close relative of this article's latch — the same cross-coupled feedback loop, plus two extra transistors for reading and writing. So: a latch, not a flip-flop that captures on a clock edge. And a computer's main RAM is usually [HOVER: DRAM] — there, a bit is stored as charge in a tiny capacitor, which slowly leaks away and so has to be refreshed again and again.

Which one is used where, and why, is the story of the memory hierarchy article.

---

## 05 — The whole story, once through

Let's run the whole story once. You wrote `x = 5`.

Python is certainly not switching transistors directly — there's an interpreter, an operating system, and a CPU in between, and Python lays a number out in memory as its own kind of object. That's for later. Just to see the hardware idea, assume:

- 5 in binary is `101`
- those three logical bits live in the hardware as three physical states
- what those states are made of depends on where they are stored — flip-flops in a CPU register, memory cells in RAM
- later, the CPU senses those states and recovers the three bits
- and software uses that `101` as the number 5

**[WIDGET · ThreeBits]** — toggle three bits; 101 = 5.

We can think of the whole thing as a stack of layers:

**[DIAGRAM · the layers]**

```text
Transistor
↓
Logic gates and storage circuits
↓
Larger digital circuits (adders, registers …)
↓
Memory, CPU, controllers, I/O
↓
Software
```

Each layer adds abstractions of its own, so we shouldn't assume a software idea maps straight onto one particular circuit. But underneath everything sit these three ideas: transistors as switches, switches as gates, and feedback as memory.

---

## What this article covered

- A bit is not a voltage — a bit is a logical value, and hardware represents it with a physical electrical state.
- Binary came for reliability — keep two states far apart and noise can't easily turn one into the other.
- A transistor is an electrically controlled switch — many of them together make gates and storage circuits.
- Memory comes from feedback — a circuit with two stable states holds its state for as long as it's powered.
- Latch, flip-flop, SRAM, and DRAM are not the same thing — they're different real-world forms of related storage ideas.

---

## Next article

Now we know how one bit can be held.

But one bit does nothing.

So how do millions of bits, together, become a sentence in Bangla, a JPEG image, an MP3 song — or the code you just wrote?

**[Next: 02 — How does anything become 0s and 1s?]**

**Hover terms used** (definitions live in `glossary.ts`): `bit`, `voltage`, `noisemargin`, `serpar`, `alu`, `latch`, `flipflop`, `sram`, `dram`
