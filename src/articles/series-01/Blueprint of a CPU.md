# CPU-র blueprint

## একটা processor-এর ভেতরে আসলে কী কী থাকে?

> *`[DEEPER · …]` দিয়ে চিহ্নিত অংশগুলো article-এ collapsible toggle হিসেবে render হয় (`<Deeper>` primitive) — misconception ঠিক করা বা article-এর মূল depth-এর চেয়ে একটু গভীরে যাওয়া অংশ। পড়ার মূল সুতো এগুলো ছাড়াও সম্পূর্ণ।*

ধরা যাক, আমাদের CPU-এর ভেতরে **Register A**-তে `2` এবং **Register B**-তে `3` রাখা আছে। এই দুটি সংখ্যা CPU-এর কাছে কোনো abstract "number" হিসেবে নেই। এগুলো আসলে কিছু electrical state — যেমন নির্দিষ্ট voltage level — যা binary `0010` এবং `0011`-কে represent করছে।

এখন CPU-কে বলা হলো:

```text
Register A + Register B → Register C
```

কিছুক্ষণ পর Register C-তে `0101`, অর্থাৎ `5`, পাওয়া গেল।

প্রশ্ন হলো, সিলিকনের একটা জড় টুকরো কীভাবে "জানল" যে `2 + 3 = 5`?

আসলে তাকে কিছু বোঝারও প্রয়োজন নেই। CPU-র ভেতরের logic gate-গুলো এমনভাবে সাজানো থাকে যে নির্দিষ্ট input voltage pattern দিলে নির্দিষ্ট output voltage pattern তৈরি হয়। সেই pattern-গুলোর অর্থ আমরা `0`, `1`, `2`, `3`, `5` ইত্যাদি হিসেবে ব্যাখ্যা করি।

এই article-এ আমরা সেই `2` আর `3`-এর hardware-level journey অনুসরণ করব। Python, operating system, compiler — এসবের পুরো গল্প এখানে নয়। আমরা ধরে নিচ্ছি, CPU-র কাছে প্রয়োজনীয় data এবং operation-এর control information ইতিমধ্যেই পৌঁছে গেছে। এখন শুধু দেখব, electronic circuit কীভাবে সেই data-কে ব্যবহার করে একটি result তৈরি করে এবং কোথায় সেটা store করে।

বোঝার সুবিধার জন্য আমরা কয়েকটি গুরুত্বপূর্ণ building block-এর ওপর focus করব:

- ALU (Arithmetic Logic Unit) — যেখানে arithmetic ও logic operation implement করা থাকে।
- Registers — CPU-র নিজের খুব ছোট, খুব দ্রুত state-holding storage।
- Datapath / internal connections — data কোন কোন পথে যেতে পারে।
- Control logic — কোন path, কোন operation, কোন destination ব্যবহার হবে তা configure করে।
- Clock — কখন নতুন state capture হবে তার timing boundary।

> **একটি জরুরি পার্থক্য:** অনেকেই CPU এবং ALU-কে একই জিনিস মনে করে গুলিয়ে ফেলেন। আসলে ALU হলো CPU-র ভেতরের একটি নির্দিষ্ট department মাত্র। একটি বাড়ির রান্নাঘর যেমন পুরো বাড়িটার প্রতিনিধি নয়, কিন্তু রান্নার কাজটা সেখানেই হয় — ঠিক তেমনি ALU পুরো processor নয়, কিন্তু গাণিতিক ও যৌক্তিক হিসাবের মূল দায়িত্বটা তারই।

**[DEEPER · আরেকটু গভীরে — voltage pattern আর "number" এক জিনিস নয়]**

এখানে `2`, `3`, `5` বললে আমরা আসলে electrical state-এর ওপর একটি human interpretation বসাচ্ছি।

যেমন:

**[DIAGRAM · pattern → meaning]**

```text
0010 → আমরা বলি "2"
0011 → আমরা বলি "3"
0101 → আমরা বলি "5"
```

কিন্তু transistor বা logic gate নিজে "2" বা "5" দেখে না। তার কাছে আছে electrical signal-এর state।

একই binary pattern অন্য context-এ instruction, memory address, character, বা অন্য কোনো data-এর অংশও represent করতে পারে।

অর্থাৎ:

> Hardware দেখে electrical state; আমরা সেই state-এর meaning নির্ধারণ করি context অনুযায়ী।

---

## ০১ — ALU: logic gate থেকে গণিত

CPU-র execution logic-এর মধ্যে ALU একটি গুরুত্বপূর্ণ অংশ, যেখানে addition, subtraction, bitwise operation এবং বিভিন্ন ধরনের comparison-এর মতো arithmetic/logic operation implement করা হয়।

কিন্তু ALU-র ভেতরে কোনো রহস্যময় বুদ্ধিমত্তা নেই। এটা তৈরি হয়েছে আগের article-এ দেখা সেই logic gate-গুলো নিখুঁত বিন্যাসে জোড়া লাগিয়ে।

**[DEEPER · আরেকটু গভীরে — ALU কি "চালু" হয়ে তারপর হিসাব করে?]**

এখানে একটা mental model পরিষ্কার করে নেওয়া জরুরি।

ALU কোনো ছোট calculator-এর মতো নয় যে কেউ তাকে বলল, "এখন যোগ করো", তারপর সে কাজ শুরু করল। ALU-র ভেতরের logic gate-গুলো হলো **combinational logic**।

অর্থাৎ, তার input-এ যে electrical pattern আছে এবং তার control input-গুলো যে অবস্থায় আছে, তার ভিত্তিতে output স্বাভাবিকভাবেই তৈরি হয়।

**[DIAGRAM · combinational response]**

```text
Inputs + Control signals
          ↓
   Combinational logic
          ↓
        Output
```

Input বদলালে output-ও বদলাতে থাকে। Logic gate-গুলোর মধ্য দিয়ে electrical signal propagate করে এবং অল্প সময়ের মধ্যে নতুন output state-এ settle করে।

এখানে এখনো clock-এর কোনো দরকার পড়েনি।

Clock ALU-কে "এখন হিসাব করো" বলে না। Clock মূলত পরে কোনো storage element — যেমন register — কখন এই calculated value-টাকে গ্রহণ করবে, সেই timing boundary তৈরি করে।

এই পার্থক্যটা পুরো CPU বোঝার জন্য খুব গুরুত্বপূর্ণ:

> Combinational logic হিসাব করে।
> Registers state ধরে রাখে।
> Control signals ঠিক করে কীভাবে হিসাব হবে।
> Clock ঠিক করে কখন নতুন state-টা commit হবে।

### Binary যোগের circuit

দুইটা ১-bit binary সংখ্যা (ধরুন A আর B) যোগ করার circuit কীভাবে বানানো যায়, সেটা একটু দেখা যাক।

Binary যোগের নিয়মগুলো সরল:

```text
0 + 0 = 00
0 + 1 = 01
1 + 0 = 01
1 + 1 = 10  (decimal 2)
```

খেয়াল করুন:

- **ডানপাশের bit (Sum)** কেবল তখনই ১ হয় যখন A অথবা B-এর যেকোনো একটার মান ১, কিন্তু দুইটাই ১ হলে ০। ঠিক একটা XOR gate-এর মতো আচরণ।
- **বাঁপাশের bit (Carry)** কেবল তখনই ১ হয় যখন A এবং B — দুইটাই ১। এটা ঠিক AND gate-এর মতো।

XOR আর AND gate পাশাপাশি জোড়া দিলে তৈরি হয় একটা Half Adder।

কিন্তু এখানে একটা সমস্যা আছে।

Half Adder শুধু দুটি একক bit যোগ করতে পারে। মানুষ যেমন হাতে একটা "carry" মনে রাখে বড় সংখ্যা যোগ করার সময়, Half Adder সেটা পারে না। তাহলে এটি 1111 + 0001 যোগ করবে কীভাবে?

এই সমস্যার সমাধান হলো Full Adder। একই কাঠামোর সাথে "Carry In" নামে একটা অতিরিক্ত input যোগ করা হয়, যাতে আগের bit-এর carry পরের bit-এ এসে ঢুকতে পারে।

এখন processor-এ ৬৪-bit-এর দুইটা সংখ্যা যোগ করতে চাইলে কী করতে হবে?

সহজ বুদ্ধি হলো — এমন ৬৪টি Full Adder একের পর এক সিরিজে জোড়া দেওয়া। একটা ট্রেনের কথা কল্পনা করুন। প্রতিটা বগি একটা Full Adder। প্রথম বগি carry পাঠায় দ্বিতীয় বগিতে। দ্বিতীয়টা তৃতীয়তে। এভাবে ৬৪ নম্বর বগি পর্যন্ত সেই ছোট্ট carry signal দৌড়াতে থাকে। এই নকশাকে বলা হয় Ripple Carry Adder।

**[WIDGET · AdderWidget]** — Half Adder → Full Adder → Ripple Carry Adder, তিনটার সংযোগ interactive ভাবে।

**একটা গুরুত্বপূর্ণ নোট:** এই train analogy-টি Ripple Carry Adder-এর mental model হিসেবে খুব ভালো, কিন্তু এটা আধুনিক সব CPU কী করে তার প্রতিনিধিত্ব করে না।

Ripple Carry Adder-এ একটি bit-এর carry পরের bit-এ পৌঁছানোর জন্য আগের stage-এর ওপর নির্ভর করতে হয়। তাই bit-এর সংখ্যা বাড়লে worst-case **propagation delay**-ও বাড়ে।

এই bottleneck কমানোর জন্য processor design-এ Carry-Lookahead, Prefix এবং অন্যান্য faster adder architecture ব্যবহার করা যেতে পারে। এগুলো carry information এমনভাবে calculate করে যাতে প্রতিটি carry-কে পুরোপুরি একটির পর একটি stage পেরিয়ে যেতে না হয়।

তবে মূল ধারণাটা একই থাকে: শেষ পর্যন্ত logic gate-ই এমন একটি circuit তৈরি করে, যা দুইটি binary input এবং তাদের carry information থেকে sum তৈরি করে।

---

## ০২ — Register: state কোথায় থাকে

যোগফল তৈরি হলো। কিন্তু এই যোগফলটা রাখা হবে কোথায়?

CPU সাধারণত প্রতিটি intermediate value তৈরি হওয়ার সঙ্গে সঙ্গে RAM-এ পাঠিয়ে দেয় না। তার বদলে processor-এর ভেতরে এমন কিছু খুব দ্রুত storage location থাকে যেখানে calculation-এর জন্য প্রয়োজনীয় value রাখা যায়। এগুলোই **register**।

Register-কে শুধু "CPU-র নিজের memory" বললে পুরো ব্যাপারটা বোঝা যায় না। আরও ভালো mental model হলো:

> Register হলো CPU-র খুব ছোট, খুব দ্রুত state-holding storage।

এখানে operand, address, pointer, intermediate value, এবং অন্যান্য গুরুত্বপূর্ণ processor state রাখা যেতে পারে।

নিচের instrument-টা ঠিক এই পার্থক্যটাই হাতে ধরে দেখায় — ALU-র input বদলান, তার output সঙ্গে সঙ্গে বদলাবে; কিন্তু Register C অপেক্ষা করবে clock edge-এর জন্য।

RAM-এর তুলনায় register অনেক ছোট এবং CPU-র execution logic-এর খুব কাছাকাছি। তবে শুধু "RAM অনেক দূরে বলে slow" — এভাবে ব্যাপারটা ব্যাখ্যা করা ঠিক নয়। মূল পার্থক্য হলো তাদের storage architecture, size, access mechanism এবং latency।

### Register আসলে কী?

আগের article-এ দেখা **flip-flop**-এর কথা মনে আছে?

সহজ mental model হিসেবে, একটি register-কে অনেকগুলো 1-bit storage element পাশাপাশি সাজানো হিসেবে ভাবতে পারি। একটি 64-bit register-এ এমন 64টি bit-এর state রাখা যায়।

**[DIAGRAM · 64-bit register]**

```text
Register A

bit 63                         bit 0
 ↓                              ↓
[1][0][0][1] ... [0][1][0][0]
             64 bits
```

তবে এটাকে একটি simplified model হিসেবে মনে রাখতে হবে। বাস্তব processor-এর register file এবং storage circuitry আরও জটিল হতে পারে।

বিশ্ববিদ্যালয়ে AX, BX, PC-এর মতো নাম শুনলে register-কে রহস্যময় কোনো বিশেষ hardware মনে হতে পারে। আসলে register হলো CPU-র state রাখার একটি অত্যন্ত গুরুত্বপূর্ণ storage structure। নাম আলাদা, কিন্তু মৌলিক ধারণা হলো — কিছু binary state ধরে রাখা।

**[DEEPER · আরেকটু গভীরে — register-এর জন্য clock লাগে কেন?]**

এখন একটা fundamental distinction করা যাক।

MUX বা ALU-এর মতো combinational circuit-এর output মূলত তার বর্তমান input-এর function:

**[DIAGRAM · combinational vs sequential]**

```text
Current inputs
      ↓
Combinational logic
      ↓
Current output
```

কিন্তু register-এর কাজ হলো আগের state ধরে রাখা।

ধরা যাক Register C-তে `0101` রাখা আছে। ALU-র input পরে বদলে গেলেও Register C যেন সঙ্গে সঙ্গে তার value বদলে না ফেলে — এটাই storage-এর উদ্দেশ্য।

Register-কে তাই এমন timing mechanism দরকার যা বলে দেয় কখন নতুন input গ্রহণ করতে হবে।

সেখানেই clocked storage element-এর ধারণা আসে।

এটি আমাদের CPU-র সবচেয়ে গুরুত্বপূর্ণ distinction-গুলোর একটিতে নিয়ে যায়:

> Combinational logic-এর output input-এর সঙ্গে বদলায়।
> Sequential/storage logic-এর state সময়ের সঙ্গে নির্দিষ্ট নিয়মে update হয়।

**[WIDGET · CombinationalVsClocked]** — ALU-র input বদলান, output সঙ্গে সঙ্গে বদলাবে; কিন্তু Register C বদলাবে শুধু clock edge-এ, আর তখনও কেবল Write Enable active থাকলে। Settle করার আগেই edge চাপলে কী হয়, সেটাও দেখা যাবে।

---

## ০৩ — Datapath, Multiplexer এবং Decoder: CPU-র ভেতরের পথ

*ব্যাখ্যা সহজ রাখার জন্য এখানে কয়েকটা কাল্পনিক register-এর নাম ধরা যাক — Register A, B, C, D। বাস্তব processor-এ এদের নাম অন্যরকম হয়, কিন্তু কাজের ধরন একই।*

এখন আমাদের কাছে register আছে, ALU আছে। কিন্তু Register A-এর value কীভাবে ALU-র input-এ যাবে? আর ALU result কীভাবে Register C-তে যাবে?

এখানেই আসে **datapath** — CPU-র ভেতরে data যে বিভিন্ন পথ ধরে এক জায়গা থেকে অন্য জায়গায় যায়, সেই পুরো কাঠামো।

বাস্তব modern CPU-তে একটিমাত্র central "data bus" ধরে সবকিছু চলাচল করে — এমনটা ধরে নেওয়া ঠিক নয়। অনেক ধরনের internal connection, datapath এবং interconnect থাকতে পারে।

> একটি CPU-কে 64-bit বলা মানেই তার ভেতরে একটি মাত্র 64-wire data bus আছে — এমন নয়। এখানে বোঝার সুবিধার জন্য আমরা একটি 64-bit-wide datapath ধরে নিচ্ছি, যেখানে 64টি bit parallel-এ represent/transfer করা যায়।

বোঝা সহজ করার জন্য আমরা এখানে একটি simplified datapath ধরে নিচ্ছি:

**[DIAGRAM · simplified datapath]**

```text
Register A ──┐
             ├──► MUX ──► ALU ──► Register C
Register B ──┘
```

এখানে একটি গুরুত্বপূর্ণ ব্যাপার আছে।

### Multiplexer (MUX): একটি electronic selector

MUX-এর কাজ traffic police-এর মতো অন্য register-কে রাস্তা থেকে সরিয়ে দেওয়া নয়।

MUX-এর একাধিক input থাকে এবং একটি output থাকে। Select signal বলে দেয় কোন input-টি output-এ দেখা যাবে।

**[DIAGRAM · 4→1 MUX]**

```text
A ──┐
B ──┤
C ──┤──► MUX ──► ALU input
D ──┘      ↑
          Select
```

ধরা যাক select signal বলছে `B` বেছে নিতে হবে। তাহলে MUX-এর output-এ B-এর বর্তমান bit pattern দেখা যাবে।

এখানে MUX-এর ভেতরেই selection-এর logic আছে। Register A, B, C, D সবাই "একই wire-এ নিজেদের data ঠেলে দিচ্ছে" — এমনটা ধরে নেওয়া উচিত নয়।

আরেকটি গুরুত্বপূর্ণ বিষয়:

> MUX নিজে clock-এর জন্য অপেক্ষা করে না।

Select signal বা input বদলালে MUX-এর output-ও propagation delay-এর পর নতুন value-তে settle করে। Clock তার output-কে "চালু" করে না।

**[WIDGET · MuxSelector]** — select signal বদলান, output সঙ্গে সঙ্গে বদলায়।

### Decoder: কোন storage location-এ write হবে?

এবার ধরা যাক ALU একটি result তৈরি করেছে এবং আমরা চাই সেটি Register C-তে store হোক।

এখানে একটি simplified register structure ধরে ভাবি:

**[DIAGRAM · decoder → write enable]**

```text
          destination
              │
              ▼
          ┌─────────┐
          │ Decoder │
          └────┬────┘
               │
      ┌────────┼────────┐
      ▼        ▼        ▼
    WE_A     WE_B     WE_C
      0        0        1
```

এখানে `WE` মানে **Write Enable**।

Destination field-এ যদি Register C-এর identifier থাকে, decoder সেটিকে এমন control signal-এ পরিণত করতে পারে যাতে Register C-এর write enable active হয় এবং অন্য register-গুলোর write enable inactive থাকে।

তারপর যখন clock-এর নির্দিষ্ট edge আসে, Register C input-এ থাকা value-টি capture করতে পারে।

এখানে একটা গুরুত্বপূর্ণ distinction আছে:

> Decoder result-টাকে physically "একটা দরজা দিয়ে ঢুকিয়ে" C-তে পাঠায় না।

বরং result-এর datapath Register C-সহ প্রয়োজনীয় destination register-গুলোর input-এ পৌঁছাতে পারে; decoder/control logic ঠিক করে কোন register সেই value capture করবে।

অর্থাৎ:

**[DIAGRAM · one value, four inputs, one enable]**

```text
ALU result ─────────────► Register A
            ────────────► Register B
            ────────────► Register C
            ────────────► Register D

Write Enable:
     A    B    C    D
     0    0    1    0
```

শুধু Register C-এর storage element-গুলো নতুন value capture করবে।

**[WIDGET · WriteEnableDecoder]** — destination বদলান, দেখুন কোন WE line active হয়; তারপর clock edge দিন।

বাস্তব register file আরও sophisticated হতে পারে, কিন্তু এই simplified model-টি একটি গুরুত্বপূর্ণ ধারণা শেখায়:

> Datapath value কোথায় যেতে পারে সেটা নির্ধারণ করে; control logic নির্ধারণ করে কোন path/operation/destination ব্যবহার হবে; storage element নির্দিষ্ট timing boundary-তে state ধরে রাখে।

---

## ০৪ — Clock: CPU-র timing boundary

এখন পর্যন্ত আমরা দেখলাম:

- logic gate কীভাবে computation তৈরি করে,
- ALU কীভাবে সেই computation করে,
- register কীভাবে binary state ধরে রাখে,
- আর datapath ও control logic কীভাবে ঠিক করে কোন data কোন operation-এর মধ্যে দিয়ে যাবে।

কিন্তু একটা প্রশ্ন রয়ে যায়:

কখন একটি নতুন value-কে "officially" state হিসেবে ধরে নেওয়া হবে?

এখানেই আসে **clock**।

CPU-র clock সাধারণত একটি periodic electrical signal। এটি নির্দিষ্ট rhythm-এ `0` এবং `1`-এর মতো state-এর মধ্যে পরিবর্তিত হয়। একটি 3 GHz clock-এর ক্ষেত্রে প্রতি সেকেন্ডে প্রায় 3 billion clock cycle হয়।

কিন্তু এখানে একটি খুব গুরুত্বপূর্ণ ভুল ধারণা এড়িয়ে যেতে হবে:

> Clock CPU-র প্রতিটি component-কে "এখন কাজ শুরু করো" বলে না।

MUX বা ALU clock-এর tick-এর জন্য অপেক্ষা করে বসে থাকে না। এগুলো combinational logic। Input বা control signal বদলালে তারা electrical signal-এর propagation-এর মাধ্যমে নতুন output তৈরি করে।

তাহলে clock করে কী?

Clock মূলত CPU-র state change-এর timing framework তৈরি করে। বিশেষ করে register-এর মতো storage element নির্দিষ্ট clock edge-এ তাদের input-এর value capture করতে পারে।

একটি simplified CPU-কে এভাবে ভাবা যায়:

**[DIAGRAM · state transition loop]**

```text
       Current State
             │
             ▼
    ┌──────────────────┐
    │ Combinational    │
    │ Logic            │
    │                  │
    │ MUX → ALU → ...  │
    └────────┬─────────┘
             │
             ▼
        Next State
             │
        CLOCK EDGE
             │
             ▼
       Current State
```

অর্থাৎ:

> **Current state → combinational logic → next state → clock edge → new current state**

এখানে clock হলো সেই boundary, যেখানে storage element নতুন state capture করার সুযোগ পায়।

### তাহলে clock দরকার কেন?

কারণ বাস্তব electronic signal instantaneously এক জায়গা থেকে আরেক জায়গায় পৌঁছায় না। Logic gate-এর মধ্যে **propagation delay** থাকে। একটি বড় combinational circuit-এর input বদলানোর পর তার output-এর প্রতিটি bit একই মুহূর্তে final অবস্থায় পৌঁছাবে — এমন নিশ্চয়তা নেই।

ধরা যাক Register A এবং B থেকে ALU-তে data গেল। ALU-র ভেতরের অনেকগুলো gate-এর মধ্য দিয়ে signal propagate করার পর output ধীরে ধীরে একটি stable pattern-এ settle করবে।

CPU যদি জানতেই না পারে কখন এই result-টাকে valid ধরে পরের register-এ capture করা নিরাপদ, তাহলে বিভিন্ন অংশের মধ্যে coordination কঠিন হয়ে যায়।

Clock একটি shared timing framework দেয়।

একটি simplified synchronous design-এ আমরা বলতে পারি:

1. একটি clock edge-এ register current state capture করে।
2. সেই state থেকে combinational logic তার output তৈরি করতে থাকে।
3. কিছু সময় পরে output যথেষ্ট stable হয়।
4. পরবর্তী clock edge-এ destination register সেই result capture করে।

এই কারণেই clock-কে "CPU-র heartbeat" বলা যায় — কিন্তু "conductor" analogy-টি সীমিত। Clock নিজে MUX বা ALU-কে চালায় না। বরং এটি পুরো synchronous system-কে একটি common timing reference দেয়।

আরেকভাবে বললে:

> Control logic ঠিক করে WHAT হবে।
> Combinational logic সেই operation-এর electrical result তৈরি করে।
> Clock ঠিক করে WHEN নতুন state capture করা হবে।

**[WIDGET · ClockVisualizer]** — frequency বাড়িয়ে দেখুন কখন period propagation delay-র চেয়ে ছোট হয়ে যায়।

**[DEEPER · আরেকটু গভীরে — clock-এর দুই edge-এর মাঝখানে কী হয়?]**

এখানে আরেকটি subtle misconception হতে পারে।

Clock edge না থাকা মানে CPU-র ভেতরের সব electrical activity বন্ধ হয়ে গেছে — এমন নয়।

Clock edge-এর মাঝখানে combinational circuit তাদের input অনুযায়ী continuously respond করতে পারে। Signal propagate করতে পারে, output change করতে পারে এবং শেষ পর্যন্ত settle করতে পারে।

Clock মূলত storage/state update-এর boundary দেয়।

অর্থাৎ:

**[DIAGRAM · between two edges]**

```text
Clock edge
   ↓
Register state changes
   ↓
Signals propagate
   ↓
Combinational logic settles
   ↓
Next clock edge
   ↓
Destination register captures
```

তাই "clock data-কে এক জায়গা থেকে আরেক জায়গায় ঠেলে দেয়" — এই mental model-টা এড়িয়ে চলাই ভালো।

আরও ভালো mental model হলো:

> Clock data-কে push করে না; clock বলে দেয় কখন state capture করার সময়।

**[DEEPER · আরেকটু গভীরে — clock speed কি CPU-র speed?]**

আংশিকভাবে, কিন্তু পুরোপুরি নয়।

Clock frequency যত বেশি, একটি synchronous design তত বেশি ঘন ঘন state transition করতে পারে — যদি তার combinational logic এবং storage element সেই timing-এর মধ্যে নির্ভরযোগ্যভাবে কাজ করতে পারে।

কিন্তু CPU performance শুধু clock frequency দিয়ে নির্ধারিত হয় না। Architecture, instruction throughput, pipeline depth, cache behavior, memory latency, branch prediction, execution resource এবং আরও অনেক কিছু performance-এ ভূমিকা রাখে।

তাই:

> বেশি clock frequency মানে বেশি ঘন ঘন timing boundary — কিন্তু বেশি GHz মানেই আনুপাতিকভাবে দ্রুততর CPU নয়।

আর clock frequency বাড়ালে সাধারণত power consumption এবং heat management-এর সমস্যাও বাড়তে পারে, যদিও exact relationship processor design-এর ওপর নির্ভর করে।

---

## Mental model: CPU-কে এভাবে ভাবুন

> CPU-র একটা simplified synchronous datapath-কে এই চারটি বাক্যে মনে রাখা যায়:
>
> **1. Registers remember.** — Registers binary state ধরে রাখে।
>
> **2. Combinational logic computes.** — MUX, ALU এবং অন্যান্য logic circuit current input ও control signal থেকে output তৈরি করে।
>
> **3. Control logic configures.** — Control signal বলে দেয় কোন data select হবে, কোন operation হবে এবং কোন destination ব্যবহার হবে।
>
> **4. Clock provides the timing boundary.** — Clock storage element-কে কখন নতুন state capture করা হবে তার shared timing reference দেয়।

**[DIAGRAM · the whole flow]**

```text
       Current State
             │
             ▼
     Control + Datapath
             │
             ▼
    Combinational Logic
             │
             ▼
         Next State
             │
         Clock Edge
             │
             ▼
       Current State
```

> Clock computation-এর engine নয়। Clock হলো state transition-এর timing framework।

---

## ০৫ — ২ + ৩ = ৫: প্রসেসরের ভেতরের একটি simplified journey

এবার আমাদের তৈরি করা mental model ব্যবহার করে `2 + 3`-এর journey দেখি।

ধরে নিই:

```text
Register A = 0010   (2)
Register B = 0011   (3)
```

এবং আমাদের লক্ষ্য:

```text
Register A + Register B → Register C
```

### ১. Current state

এই মুহূর্তে Register A এবং Register B তাদের respective binary value ধরে রেখেছে।

```text
A = 0010
B = 0011
```

এই value registers-এর output-এ available থাকে।

### ২. Control signal operation-টাকে configure করে

CPU-র control logic এমন signal তৈরি করে যাতে:

```text
MUX 1 → Register A
MUX 2 → Register B
ALU   → ADD
Destination → Register C
WE_C → 1
```

অর্থাৎ, কোন data ALU-তে যাবে, ALU কী operation করবে এবং result কোন register-এ store হবে — এসব configure করা হলো।

### ৩. MUX ও ALU কাজ করে — কিন্তু clock তাদের "start" করায় না

MUX-গুলো তাদের select signal অনুযায়ী A এবং B-এর value ALU-র input-এ present করে।

এই আর্টিকেলে CPU-কে ইচ্ছাকৃতভাবে অনেক সহজ করে দেখানো হয়েছে।

**[DIAGRAM · operands reach the ALU]**

```text
A = 0010 ──► MUX ──► ALU input A
B = 0011 ──► MUX ──► ALU input B
```

ALU-র ভেতরের combinational logic এই input pattern-এর ওপর কাজ করতে থাকে।

Signal বিভিন্ন logic gate-এর মধ্য দিয়ে propagate করে এবং propagation delay পেরোনোর পর ALU output settle করে:

```text
  0010
+ 0011
──────
  0101
```

অর্থাৎ ALU output এখন `0101`।

এখানে clock এসে ALU-কে "যোগ করো" বলেনি। Control signal ALU-কে ADD operation-এর জন্য configure করেছে, আর combinational logic input অনুযায়ী result তৈরি করেছে।

### ৪. Clock edge: Register C result capture করে

এখন Register C-এর write enable active এবং ALU result তার input-এ available।

পরবর্তী appropriate clock edge-এ Register C সেই value capture করে:

**[DIAGRAM · capture]**

```text
ALU result = 0101
                 │
                 ▼
          Register C captures
                 │
                 ▼
          C = 0101  (5)
```

এই মুহূর্তে result CPU-র stored state-এর অংশ হয়ে গেল।

**[WIDGET · CPUDatapath]** — উপরের চারটি ধাপ একে একে চালিয়ে দেখুন। খেয়াল করুন, clock line শুধু register-এ যায় — MUX বা ALU-তে নয়।

### পুরো ব্যাপারটাকে এক লাইনে

**[DIAGRAM · one line]**

```text
Current State
     ↓
Control + Combinational Logic
     ↓
Next State
     ↓
Clock Edge
     ↓
New Current State
```

এখানে সবচেয়ে গুরুত্বপূর্ণ বিষয় হলো:

> Clock MUX-কে চালু করেনি।
> Clock ALU-কে হিসাব শুরু করতে বলেনি।
> Clock data-কে ঠেলে Register C-তে পাঠায়নি।

বরং MUX এবং ALU তাদের input/control signal অনুযায়ী continuously respond করেছে। Clock শুধু একটি নির্দিষ্ট timing boundary দিয়েছে যেখানে Register C result-টিকে capture করতে পারে।

এটাই synchronous digital logic বোঝার সবচেয়ে গুরুত্বপূর্ণ mental model-গুলোর একটি।

**[DEEPER · আরেকটু গভীরে — আর "কয়েক nanosecond"-এর গল্প?]**

এই simplified datapath-এ combinational logic-এর output-কে পরবর্তী clock edge-এর আগে যথেষ্ট stable হতে হবে। বাস্তব processor-এ instruction execution আরও অনেক stage, pipeline এবং timing constraint-এর মধ্যে ঘটে।

তাই এখানে আমাদের উদ্দেশ্য exact latency দাবি করা নয়। উদ্দেশ্য হলো hardware-এর state, combinational computation এবং clocked state transition-এর সম্পর্ক বোঝা।

---

## ০৬ — সবকিছু এত সরল নয়

এই article-এ CPU-কে ইচ্ছাকৃতভাবে অনেক সহজ করে দেখানো হয়েছে।

বাস্তব processor-এ pipeline, cache hierarchy, branch prediction, out-of-order execution, multiple execution unit, register renaming, sophisticated interconnect এবং আরও অনেক mechanism থাকে।

একটি modern CPU একই সময়ে একাধিক instruction-এর বিভিন্ন stage নিয়ে কাজ করতে পারে। ফলে "একটি instruction → একটি ALU calculation → একটি clock tick" — এমন সরল model বাস্তব CPU-র ক্ষেত্রে যথেষ্ট নয়।

এখানে আমরা বরং একটি conceptual synchronous datapath ব্যবহার করেছি — নিচের চারটি মৌলিক ধারণা পরিষ্কার করার জন্য, বাস্তব CPU-র পুরো ছবি আঁকার জন্য নয়। এবং এটাই এই model-এর শক্তি: বাস্তব CPU-র complexity এই basic idea-গুলোকে বাতিল করে না, বরং এগুলোর ওপরেই অনেক বেশি sophisticated structure তৈরি করে।

---

## এই article-এ কী শিখলাম

- CPU "গণিত বোঝে" না — hardware-এর গণিতের অর্থ বোঝার দরকার নেই, তার physical structure-ই সংশ্লিষ্ট logical transformation-টা implement করে। আমরা সেই electrical pattern-কে number এবং operation হিসেবে interpret করি।

- Combinational logic হিসাব করে; registers state ধরে রাখে — ALU এবং MUX-এর মতো combinational circuit input ও control signal অনুযায়ী output তৈরি করে। Register সেই state-কে ধরে রাখতে পারে।

- Control logic ঠিক করে WHAT হবে; clock ঠিক করে WHEN state update হবে — Clock MUX বা ALU-কে "start" করায় না। এটি মূলত storage element-এর state capture করার timing boundary দেয়।

- MUX হলো electronic selector — অনেক input-এর মধ্যে select signal অনুযায়ী একটি input output-এ পাঠায়।

- Decoder/control logic destination এবং অন্যান্য control signal নির্ধারণে সাহায্য করে — result-কে কোনো physical "door" দিয়ে Register C-তে ঢোকানোর বদলে, এটি ঠিক করতে পারে কোন register নতুন value capture করবে।

- CPU-র ভেতরে একটিমাত্র universal data bus আছে — এমন নয়। বাস্তব processor-এ অনেক ধরনের datapath এবং interconnect থাকতে পারে। আমাদের article-এ বোঝার সুবিধার জন্য একটি simplified datapath ব্যবহার করা হয়েছে।

সবচেয়ে গুরুত্বপূর্ণ mental model:

> **Current State → Combinational Logic → Next State → Clock Edge → New Current State**

---

## পরের article-এ

একটা বড় প্রশ্ন এখনো বাকি রয়ে গেল।

এই article-এ আমরা ধরে নিয়েছিলাম CPU-র control logic ইতিমধ্যেই জানে:

```text
MUX 1 → Register A
MUX 2 → Register B
ALU   → ADD
Destination → Register C
```

কিন্তু এই control signal তৈরি হলো কীভাবে?

CPU কীভাবে জানল যে এখন ADD operation করতে হবে? কোন register থেকে operand নিতে হবে? Result কোথায় রাখতে হবে?

এর উত্তর লুকিয়ে আছে **instruction**-এর মধ্যে।

Instruction কোথা থেকে আসে? Memory-তে সেটা কীভাবে রাখা থাকে? CPU কীভাবে সেই instruction আনে, তার bit-গুলো interpret করে এবং সেই bit থেকে প্রয়োজনীয় control signal তৈরি করে?

এখান থেকেই শুরু হবে CPU-র পরের গল্প:

> **Fetch → Decode → Execute**

পরের article-এ আমরা দেখব, একটি machine instruction কীভাবে memory থেকে CPU-তে আসে এবং কীভাবে তার bit pattern শেষ পর্যন্ত CPU-র control logic-কে বলে দেয় — কী করতে হবে।

**[পরের article: ০৪ — হার্টবিট: Fetch-Decode-Execute]**

---
---

# The CPU's blueprint

## What actually lives inside a processor?

> *Blocks marked `[DEEPER · …]` render as collapsible toggles in the article (the `<Deeper>` primitive) — misconception corrections, or detail that sits below the article's main depth level. The main thread reads complete without opening any of them.*

Imagine that our CPU already has the number `2` in **Register A** and the number `3` in **Register B**. These are not sitting inside the CPU as abstract mathematical numbers. At the hardware level, they are held as electrical states — for example, particular voltage levels — that represent the binary values `0010` and `0011`.

Now suppose the CPU has been told:

```text
Register A + Register B → Register C
```

After the operation completes, Register C contains `0101`, which represents `5`.

The obvious question is: how does a lifeless piece of silicon "know" that `2 + 3 = 5`?

It doesn't need to know anything.

The logic gates inside the CPU are wired together in such a way that particular input voltage patterns produce particular output voltage patterns. We interpret those patterns as `0`, `1`, `2`, `3`, `5`, and so on.

In this article, we'll follow the hardware-level journey of those two values. We are not going to trace the entire Python → compiler → machine-code story here. Instead, we'll assume that the required data and control information have already reached the CPU. Our job is to understand what happens inside the electronic circuits once the CPU has to perform the operation.

To build our mental model, we'll focus on several important building blocks:

- ALU (Arithmetic Logic Unit) — where arithmetic and logic operations are implemented.
- Registers — the CPU's own very small, very fast state-holding storage.
- Datapath / internal connections — the routes data can take.
- Control logic — what configures which path, which operation, which destination.
- Clock — the timing boundary at which new state is captured.

> **A Critical Distinction:** People often use "CPU" and "ALU" interchangeably, but they are not the same. The ALU is merely a department inside the CPU. Just as a kitchen is not the entire house — even though it's where the cooking happens — the ALU is not the entire processor. It handles the math, but the rest of the CPU coordinates the movement.

**[DEEPER · go deeper — a voltage pattern is not the number itself]**

Whenever we write `2`, `3`, or `5` in this article, we are applying a human interpretation to an electrical state.

For example:

**[DIAGRAM · pattern → meaning]**

```text
0010 → we interpret this as "2"
0011 → we interpret this as "3"
0101 → we interpret this as "5"
```

But a transistor or logic gate does not literally see the number "2" or "5." It responds to electrical signal states.

The same binary pattern can represent an instruction, a memory address, a character, or some other kind of data depending on context.

In other words:

> Hardware deals with electrical states; we assign meaning to those states according to context.

---

## 01 — ALU: from logic gates to math

The ALU is an important part of the CPU's execution logic, implementing arithmetic and logical operations such as addition, subtraction, bitwise operations, and various forms of comparison.

But there's no mysterious intelligence inside the ALU. It's built by wiring together the logic gates we saw in the previous article.

**[DEEPER · go deeper — does the ALU "turn on" and then calculate?]**

There is an important mental model to fix here.

The ALU is not like a little calculator that waits for someone to tell it, "Now calculate." The logic gates inside the ALU form **combinational logic**.

That means its output is determined continuously by its current inputs and control signals.

In simplified form:

**[DIAGRAM · combinational response]**

```text
Inputs + Control signals
          ↓
   Combinational logic
          ↓
        Output
```

When the inputs change, the output changes as the electrical signals propagate through the logic gates and settle into a new state.

The clock is not required to make the ALU "start calculating."

The clock does not tell the ALU, "calculate now." Its main job is to provide timing boundaries for storage elements — such as registers — to capture new values.

This distinction is fundamental to understanding a CPU:

> Combinational logic computes.
> Registers hold state.
> Control signals configure the computation.
> The clock determines when stored state is updated.

### The circuit for binary addition

Let's see how to build a circuit that adds two 1-bit binary numbers (say, A and B).

The rules of binary addition are straightforward:

```text
0 + 0 = 00
0 + 1 = 01
1 + 0 = 01
1 + 1 = 10  (decimal 2)
```

Notice the pattern:

- **The right bit (Sum)** is 1 only when either A or B is 1, but 0 when both are 1. Exactly like an XOR gate.
- **The left bit (Carry)** is 1 only when both A and B are 1. Exactly like an AND gate.

Wire an XOR gate and an AND gate side by side, and you've built a Half Adder.

But there's a problem here.

A Half Adder can only add two individual bits. When humans add larger numbers, we carry a digit in our head — the Half Adder can't do that. So how would it handle 1111 + 0001?

The solution is the Full Adder. Same basic structure plus an extra input called "Carry In," which lets the carry from a previous bit feed into the next.

Now if a processor wants to add two 64-bit numbers?

The conceptual solution is to chain 64 Full Adders together in a series. Imagine a train where each carriage represents a single Full Adder. The first carriage passes its carry bit to the second, the second to the third, and that small electrical signal ripples all the way down to the 64th carriage. This architecture is known as a Ripple Carry Adder.

**[WIDGET · AdderWidget]** — Half Adder → Full Adder → Ripple Carry Adder, wired together interactively.

**An important hardware note:** The train analogy is excellent as a mental model *for a Ripple Carry Adder*, but it is not a picture of what every modern CPU does.

In a Ripple Carry Adder, each bit's carry depends on the result of the previous stage. As the number of bits increases, the worst-case **propagation delay** therefore increases as well.

To reduce this bottleneck, processor designs can use Carry-Lookahead, Prefix, and other faster adder architectures. These structures organize the carry calculation so that it does not have to wait for every previous stage in a simple chain.

The underlying idea remains the same: logic gates are arranged into a circuit that takes binary inputs and carry information and produces the correct sum.

---

## 02 — Register: where state lives

The sum has been calculated. But where does the result go?

A CPU does not normally send every intermediate value straight to RAM. Instead, the processor contains very small, very fast storage locations that can hold values needed during execution. These are **registers**.

Calling a register simply "the CPU's own memory" is useful, but incomplete. A better mental model is:

> A register is a very small, very fast storage element that holds CPU state.

Registers can hold operands, addresses, pointers, intermediate values, and other important processor state.

The instrument below puts that difference in your hands — change the ALU's inputs and its output follows immediately, while Register C waits for a clock edge.

Registers are much smaller than RAM and are tightly integrated with the processor's execution logic. But it would be misleading to explain their speed simply by saying "RAM is far away." The important differences include their storage architecture, size, access mechanism, and latency.

### What is a register, really?

Remember the **flip-flops** from the previous article?

As a simplified mental model, think of a register as a collection of 1-bit storage elements arranged side by side. A 64-bit register can hold 64 bits of state.

**[DIAGRAM · 64-bit register]**

```text
Register A

bit 63                         bit 0
 ↓                              ↓
[1][0][0][1] ... [0][1][0][0]
             64 bits
```

This is a simplified model, though. Real processor register files and their surrounding circuitry can be considerably more complex.

Names like AX, BX, or PC can make registers sound like mysterious pieces of hardware. They are not. At the fundamental level, a register is a storage structure used to hold binary state that the processor needs to keep.

**[DEEPER · go deeper — why does a register need a clock at all?]**

There is a fundamental distinction to make here.

For a combinational circuit such as a MUX or ALU, the output is primarily a function of its current inputs:

**[DIAGRAM · combinational vs sequential]**

```text
Current inputs
      ↓
Combinational logic
      ↓
Current output
```

A register, however, exists to hold a previous state.

Suppose Register C currently contains `0101`. If the ALU inputs change afterward, Register C should not immediately change just because its input wiring changed. That would defeat the purpose of storage.

A register therefore needs a timing mechanism that determines when a new input value should be captured.

This leads to one of the most important distinctions in digital logic:

> The output of combinational logic responds to its inputs.
> The state of sequential/storage logic is updated according to timing rules.

**[WIDGET · CombinationalVsClocked]** — change the ALU's inputs and the output follows immediately; Register C changes only on a clock edge, and only when Write Enable is active. You can also hit the edge before the output settles and see what happens.

---

## 03 — Datapath, Multiplexers and Decoders: the paths inside the CPU

*For simplicity, let's use a few imaginary register names — Register A, B, C, D. Real CPUs use different naming schemes, but they operate on identical principles.*

We now have registers and an ALU. But how does the value in Register A reach an ALU input? And how does the ALU's result get stored in Register C?

This is where the **datapath** comes in — the collection of paths through which data moves between different parts of the processor.

In a modern CPU, it would be misleading to imagine one giant central "data bus" connecting everything. Real processors contain many internal connections, datapaths, and interconnect structures.

> Calling a CPU "64-bit" does not mean that it contains one single 64-wire data bus. For simplicity, we'll assume a 64-bit-wide datapath in our model, where 64 bits can be represented or transferred in parallel.

To keep things simple, we'll use a simplified datapath:

**[DIAGRAM · simplified datapath]**

```text
Register A ──┐
             ├──► MUX ──► ALU ──► Register C
Register B ──┘
```

There is an important detail here.

### Multiplexer (MUX): an electronic selector

A MUX is not primarily a traffic cop preventing registers from fighting over the same wire.

A MUX has multiple inputs and one output. Select signals determine which input is reflected at the output.

**[DIAGRAM · 4→1 MUX]**

```text
A ──┐
B ──┤
C ──┤──► MUX ──► ALU input
D ──┘      ↑
          Select
```

If the select signal chooses `B`, the MUX output represents the current value of B.

The selection happens inside the MUX's logic. We should not imagine Registers A, B, C, and D all trying to push their values onto one physical wire and the MUX stopping them.

And there is another important point:

> A MUX does not wait for the clock.

If its inputs or select signal change, its output changes after the corresponding propagation delay. The clock does not "activate" the MUX.

**[WIDGET · MuxSelector]** — change the select signal and watch the output follow.

### Decoder: deciding which storage location writes the result

Now suppose the ALU has produced a result and we want to store it in Register C.

Using a simplified register structure:

**[DIAGRAM · decoder → write enable]**

```text
          destination
              │
              ▼
          ┌─────────┐
          │ Decoder │
          └────┬────┘
               │
      ┌────────┼────────┐
      ▼        ▼        ▼
    WE_A     WE_B     WE_C
      0        0        1
```

Here, `WE` means **Write Enable**.

If the destination field identifies Register C, decoder/control logic can generate the appropriate write-enable signal so that Register C is allowed to capture the incoming value while the other registers remain disabled.

Then, when the appropriate clock edge arrives, Register C can capture the value present at its input.

This distinction is important:

> The decoder does not physically "open a door" and send the result into Register C.

Instead, the datapath can make the ALU result available to the relevant register inputs, while the decoder/control logic determines which register is allowed to capture that value.

Conceptually:

**[DIAGRAM · one value, four inputs, one enable]**

```text
ALU result ─────────────► Register A
            ────────────► Register B
            ────────────► Register C
            ────────────► Register D

Write Enable:
     A    B    C    D
     0    0    1    0
```

Only Register C's storage elements capture the new value.

**[WIDGET · WriteEnableDecoder]** — change the destination, watch which WE line goes high, then apply a clock edge.

Real register files can be considerably more sophisticated, but this simplified model teaches an important idea:

> The datapath provides possible routes for values. Control logic configures which routes, operations, and destinations are used. Storage elements capture the resulting state at defined timing boundaries.

---

## 04 — Clock: the CPU's timing boundary

So far we've seen:

- how logic gates create computation,
- how the ALU performs that computation,
- how registers hold binary state,
- and how datapath and control logic determine which data goes through which operation.

But one question remains:

When does a newly calculated value officially become part of the CPU's state?

This is where the **clock** comes in.

A CPU clock is generally a periodic electrical signal that changes state at a regular rhythm. A 3 GHz clock corresponds to roughly 3 billion clock cycles per second.

But there is a very important misconception to avoid:

> The clock does not tell every component, "Start working now."

A MUX or ALU does not sit idle waiting for the next clock tick. They are combinational logic. When their inputs or control signals change, their outputs respond as electrical signals propagate through the circuit.

So what does the clock actually do?

The clock provides a timing framework for state changes in the CPU. In particular, storage elements such as registers can capture new values at defined clock edges.

A simplified CPU can be thought of like this:

**[DIAGRAM · state transition loop]**

```text
       Current State
             │
             ▼
    ┌──────────────────┐
    │ Combinational    │
    │ Logic            │
    │                  │
    │ MUX → ALU → ...  │
    └────────┬─────────┘
             │
             ▼
        Next State
             │
        CLOCK EDGE
             │
             ▼
       Current State
```

In other words:

> **Current state → combinational logic → next state → clock edge → new current state**

The clock provides the boundary at which storage elements can capture the new state.

### Why do we need a clock?

Because real electrical signals do not travel instantaneously. Logic gates have **propagation delays**. After an input changes, different paths through a combinational circuit may take different amounts of time before their outputs settle.

Imagine Register A and Register B feeding an ALU. The signals propagate through many gates inside the ALU before the output settles into the correct pattern representing the result.

If the system had no shared notion of when that result should be considered safe to capture, coordinating many state-holding components would be much harder.

A clock provides that shared timing framework.

In a simplified synchronous design:

1. A clock edge causes registers to capture the current state.
2. That state becomes the input to combinational logic.
3. The combinational logic computes and its outputs settle.
4. At a later clock edge, destination registers capture the resulting values.

This is why the clock can be called the "heartbeat" of a CPU — but the conductor analogy has limits. The clock does not activate the MUX or ALU. Instead, it provides a common timing reference for the synchronous system.

Another useful way to remember it is:

> Control logic decides WHAT should happen.
> Combinational logic produces the electrical result.
> The clock determines WHEN the new state is captured.

**[WIDGET · ClockVisualizer]** — raise the frequency and watch the period fall below the propagation delay.

**[DEEPER · go deeper — what happens between clock edges?]**

There is another subtle misconception worth addressing.

The absence of a clock edge does **not** mean that all electrical activity inside the CPU stops.

Between clock edges, combinational circuits can continuously respond to their inputs. Signals propagate through the logic, outputs change, and eventually settle into stable patterns.

The clock mainly provides the boundary for updating stored state.

Conceptually:

**[DIAGRAM · between two edges]**

```text
Clock edge
   ↓
Register state changes
   ↓
Signals propagate
   ↓
Combinational logic settles
   ↓
Next clock edge
   ↓
Destination register captures
```

So it is better to avoid thinking of the clock as something that "pushes data" from one component to another.

A better mental model is:

> The clock does not push the data; it provides the moment at which state is captured.

**[DEEPER · go deeper — does clock speed mean CPU speed?]**

Partly, but not by itself.

A higher clock frequency allows a synchronous design to perform state transitions more frequently, provided the combinational logic and storage elements can reliably meet the timing requirements.

But CPU performance is not determined by clock frequency alone. Architecture, instruction throughput, pipeline design, cache behavior, memory latency, branch prediction, execution resources, and many other factors matter.

So:

> A higher clock frequency can allow more frequent timing boundaries, but a higher GHz number does not automatically make a CPU proportionally faster.

Increasing clock frequency can also increase power consumption and thermal demands, although the exact relationship depends heavily on the processor's design.

---

## Mental model: think of the CPU this way

> A simplified synchronous datapath can be remembered with four statements:
>
> **1. Registers remember.** — Registers hold binary state.
>
> **2. Combinational logic computes.** — MUXes, ALUs, and other logic circuits produce outputs from current inputs and control signals.
>
> **3. Control logic configures.** — Control signals determine which data is selected, which operation is performed, and which destination is used.
>
> **4. The clock provides the timing boundary.** — The clock provides a shared timing reference for when storage elements capture new state.

**[DIAGRAM · the whole flow]**

```text
       Current State
             │
             ▼
     Control + Datapath
             │
             ▼
    Combinational Logic
             │
             ▼
         Next State
             │
         Clock Edge
             │
             ▼
       Current State
```

> The clock is not the engine of computation. It is the timing framework for state transitions.

---

## 05 — 2 + 3 = 5: a simplified journey through the processor

Now let's use our mental model to follow `2 + 3`.

Assume:

```text
Register A = 0010   (2)
Register B = 0011   (3)
```

And our goal is:

```text
Register A + Register B → Register C
```

### 1. Current state

At this moment, Register A and Register B are holding their respective binary values.

```text
A = 0010
B = 0011
```

Those values are available at the registers' outputs.

### 2. Control signals configure the operation

The CPU's control logic establishes signals such as:

```text
MUX 1 → Register A
MUX 2 → Register B
ALU   → ADD
Destination → Register C
WE_C → 1
```

In other words, the control logic configures which data will feed the ALU, which operation the ALU should perform, and which register should receive the result.

### 3. The MUX and ALU respond — but the clock does not "start" them

The MUXes select A and B according to their select signals and present those values to the ALU inputs.

**[DIAGRAM · operands reach the ALU]**

```text
A = 0010 ──► MUX ──► ALU input A
B = 0011 ──► MUX ──► ALU input B
```

The combinational logic inside the ALU responds to those input patterns.

Electrical signals propagate through the logic gates, and after some propagation delay the ALU output settles to:

```text
  0010
+ 0011
──────
  0101
```

The ALU output is now `0101`.

The clock did not tell the ALU, "Start adding." The control signals configured the ALU for an ADD operation, and the combinational logic produced the result from its inputs.

### 4. Clock edge: Register C captures the result

Now the ALU result is available at Register C's input, and Register C's write enable is active.

At the appropriate clock edge, Register C captures that value:

**[DIAGRAM · capture]**

```text
ALU result = 0101
                 │
                 ▼
          Register C captures
                 │
                 ▼
          C = 0101  (5)
```

The result has now become part of the CPU's stored state.

**[WIDGET · CPUDatapath]** — step through the four stages above. Note that the clock line reaches only the registers — never the MUX or the ALU.

### The whole process in one line

**[DIAGRAM · one line]**

```text
Current State
     ↓
Control + Combinational Logic
     ↓
Next State
     ↓
Clock Edge
     ↓
New Current State
```

The most important point is this:

> The clock did not activate the MUX.
> The clock did not tell the ALU to start calculating.
> The clock did not physically push the data into Register C.

The MUX and ALU continuously respond to their inputs and control signals. The clock provides a defined timing boundary at which Register C can capture the result.

This is one of the most important mental models for understanding synchronous digital logic.

**[DEEPER · go deeper — what about the "few nanoseconds" story?]**

In this simplified datapath, the combinational logic must produce a stable enough result before the destination register's capture edge.

Real processors execute instructions through much more complicated pipelines, timing constraints, execution units, and other mechanisms.

So the purpose of this example is not to claim an exact latency. The purpose is to understand the relationship between stored state, combinational computation, and clocked state transitions.

---

## 06 — Reality corner

We deliberately simplified the CPU in this article.

Real processors contain pipelines, cache hierarchies, branch prediction, out-of-order execution, multiple execution units, register renaming, sophisticated interconnects, and many other mechanisms.

A modern CPU can have multiple instructions in different stages at the same time. So the simple model of "one instruction → one ALU calculation → one clock tick" is not an accurate description of a modern processor.

Instead, we have used a conceptual synchronous datapath — built to establish the four fundamental ideas below, not to draw the full picture of a real processor. And that is the strength of the model: the complexity of a modern CPU does not replace these basic ideas, it builds much more sophisticated structures on top of them.

---

## What this article covered

- The CPU does not "understand" mathematics — the hardware doesn't need to understand the meaning of mathematics, its physical structure implements the corresponding logical transformation. We interpret those electrical patterns as numbers and operations.

- Combinational logic computes; registers hold state — circuits such as MUXes and ALUs respond to their current inputs and control signals, while registers hold state across clock cycles.

- Control logic decides WHAT happens; the clock determines WHEN state is updated — the clock does not tell the MUX or ALU to start working. It primarily provides the timing boundary at which storage elements capture new state.

- A MUX is an electronic selector — it selects one of several inputs according to its select signals and presents that input at its output.

- Decoder/control logic helps determine the destination and other control signals — it does not physically send a result through a "door" into Register C; instead, it can enable the appropriate register to capture the result.

- A CPU does not necessarily contain one universal internal data bus. Real processors can contain many datapaths and interconnect structures. Our article uses a simplified datapath to make the underlying concept easier to understand.

The most important mental model is:

> **Current State → Combinational Logic → Next State → Clock Edge → New Current State**

---

## Next article

One major question is still unanswered.

In this article, we assumed that the CPU's control logic already knew to configure:

```text
MUX 1 → Register A
MUX 2 → Register B
ALU   → ADD
Destination → Register C
```

But how were those control signals generated?

How did the CPU know that it should perform an ADD operation? Which registers should provide the operands? Where should the result go?

The answer is encoded in the **instruction**.

Where did that instruction come from? How is it stored in memory? How does the CPU fetch it, interpret its bits, and turn those bits into the control signals that configure the datapath?

That is where the next part of the CPU story begins:

> **Fetch → Decode → Execute**

In the next article, we'll follow a machine instruction from memory into the CPU and see how its bit pattern ultimately tells the control logic what to do.

**[Next: 04 — Heartbeat: Fetch-Decode-Execute]**

---
