# হার্টবিট: Fetch-Decode-Execute

## Instruction কীভাবে কাজে পরিণত হয়

> *`[DIAGRAM · …]` blocks render through the `<Diagram>` primitive (flow art on paper, not a code well). `[WIDGET · …]` marks an interactive instrument, `[DEEPER · …]` a collapsible toggle. Hover definitions live only in `src/articles/glossary.ts`.*

আগের আর্টিকেলে দেখা গেছে — ২ আর ৩ কীভাবে যোগ হয়ে ৫ হয়। কিন্তু পুরো কাহিনী শেষ হয়নি। একটা প্রশ্নের উত্তর বাকি ছিল।

CPU জানল কীভাবে যে এই মুহূর্তে তাকে *যোগ* করতে হবে? বিয়োগ না, গুণ না — যোগ। আর *এই* দুইটা register-এর ডেটা নিতে হবে, বাকিগুলো না। সেই control signal-গুলো এল কোথা থেকে?

আজকের গল্পটা ঠিক এখান থেকেই শুরু।

> **// সিলিকন সিটির time-lapse**
>
> আমরা এখনও সিলিকনের সেই ছোট্ট শহরের ভেতরেই আছি, যেখানে ALU, register, datapath আর clock একসাথে কাজ করছে। তবে আজকের ফোকাস যন্ত্রাংশের ওপর নয়, কাজের ধারাবাহিকতার ওপর। আগের আর্টিকেলটি ছিল একটি স্থিরচিত্র — ভেতরে কী কী আছে তার বিবরণ। আজকেরটা চলমান ছবি: একটা instruction কীভাবে memory থেকে CPU-তে আসে, নিজের অর্থ control signal-এ রূপ নেয়, আর শেষে CPU-র state বদলে দেয়।

---

## ০১ — Instruction-ও শুধু bits

আমরা যখন code লিখি, তখন "code" আর "data" সম্পূর্ণ আলাদা জিনিস মনে হয়। কিন্তু memory-র স্তরে instruction আর data — দুটোই শেষ পর্যন্ত **bit pattern**।

```text
ADD instruction   →  একটা bit pattern
42                →  একটা bit pattern
একটা pixel value  →  একটা bit pattern
```

Memory নিজে বসে সিদ্ধান্ত নেয় না — "এই bit-গুলো instruction" আর "ওগুলো data"।

তবে তাই বলে CPU যেকোনো bit-কে ইচ্ছামতো instruction বানিয়ে ফেলে না। CPU যখন **instruction fetch** করার জন্য একটা নির্দিষ্ট memory address থেকে bit pattern আনে, তখনই সেই bits instruction হিসেবে decode হওয়ার process-এ ঢোকে।

> Instruction নাকি data — সেটা bit pattern-এর গায়ে লেখা থাকে না; CPU কোন কাজে সেই bits ব্যবহার করছে, তার ওপরই interpretation নির্ভর করে।

তাহলে প্রশ্নটা দাঁড়ায় — CPU কোন address থেকে instruction আনবে, সেটা ঠিক হয় কীভাবে? তার আগে দেখা যাক, একটা instruction দেখতে কেমন।

---

## ০২ — একটা instruction-এর ব্যবচ্ছেদ

ধরুন CPU-কে বলতে চাই: **"Register A আর Register B যোগ করে ফলাফল Register C-তে রাখো।"** এই বাক্যটা CPU-র কাছে মানুষের ভাষায় যায় না। Machine instruction-এর একটা নির্দিষ্ট binary format থাকে, যেখানে আলাদা আলাদা bit field-এর আলাদা মানে।

বাস্তব processor-এ instruction format নির্ভর করে তার architecture বা ISA-র ওপর। সব processor-এ instruction একই মাপের — এমন নয়।

বোঝার সুবিধার জন্য আমরা একটা কাল্পনিক ১৩-bit format ধরে নিচ্ছি:

```text
  0001  |  001  |  010  |  011
 Opcode | Reg A | Reg B | Reg C
```

- **[HOVER: Opcode]** — কোন operation হবে সেটা নির্দেশ করে। আমাদের কাল্পনিক CPU-তে ধরা যাক `0001` = ADD, `0010` = SUB, `0011` = LOAD।
- **Register field** — কোন register থেকে operand নিতে হবে আর কোন register-এ result রাখতে হবে, সেগুলোর পরিচয় নম্বর।

খেয়াল করুন, `001`, `010`, `011` কোনো memory address নয় — এগুলো CPU-র register-গুলোর identifier।

এই field-গুলো decode করার পর CPU এমন control signal তৈরি করতে পারে, যা A আর B-এর value ALU-তে পাঠায়, ALU-কে ADD-এর জন্য configure করে, আর destination হিসেবে Register C বেছে নেয়। এখানেই instruction-এর bit pattern থেকে CPU-র ভেতরের আচরণের যোগসূত্র তৈরি হয়। নিচের যন্ত্রে opcode আর operand পাল্টে দেখুন:

**[WIDGET · InstructionAnatomy]**

---

## ০৩ — Program Counter: কার পালা এখন?

Memory-র কাছে instruction আর data দেখতে একইরকম হলে স্বাভাবিক প্রশ্ন আসে — CPU কীভাবে জানে এখন কোন bits-কে instruction হিসেবে fetch করতে হবে?

এর জন্য CPU-তে একটা গুরুত্বপূর্ণ register আছে — **[HOVER: Program Counter]** (PC)। কোনো কোনো architecture-এ একে Instruction Pointer-ও বলে। সহজভাবে, PC ধরে রাখে **পরবর্তী instruction কোন memory address থেকে fetch হবে**।

আমাদের simplified CPU-তে instruction-গুলো যদি fixed-size হয়, তাহলে একটা instruction fetch করার পর PC পরেরটার address-এ এগিয়ে যেতে পারে।

```text
[ Memory ]

0x004: 0001001010011   ← PC
0x008: 0000000000010   ← data
0x00C: 0000000000011   ← data
```

PC এখন 0x004 নির্দেশ করছে। CPU সেখান থেকে fetch করলে ওই bit pattern instruction হিসেবে decode হওয়ার পথে যায়। তারপর simplified model-এ PC পরের instruction-এর দিকে এগোয়।

কোনো program চালু হলে system সেটির entry point থেকে execution শুরুর ব্যবস্থা করে — আমাদের model-এ ধরে নিতে পারি, PC-তে প্রথম instruction-এর address বসানো হয়।

**[WIDGET · ProgramCounterDemo]**

তবে বাস্তব CPU-তে PC সবসময় শুধু "এক ধাপ বাড়ে" — এমন নয়। Instruction-এর size, branch, jump, function call, return — এসবের কারণে পরের instruction কোথা থেকে আসবে, সেটা বদলে যেতে পারে।

> Memory-তে instruction আর data-র জন্য আলাদা কোনো label থাকে না। CPU-র instruction-fetch process ঠিক করে, কোন memory location-এর bits instruction হিসেবে decode হবে।

এবার সব উপাদান হাতে আছে। Instruction memory-তে বসে আছে, PC জানে কোনটা এখন পড়তে হবে। কিন্তু সেই bits থেকে আসল কাজটা হয় কীভাবে?

---

## Mental model: article ০৩ + instruction

> **// একটা mental model মনে রাখুন**
>
> আগের article-এ আমরা দেখেছিলাম:
>
> ```text
> Current State
>      ↓
> Combinational Logic
>      ↓
> Next State
>      ↓
> Clock Edge
>      ↓
> New State
> ```
>
> এবার instruction যোগ করলে ছবিটা দাঁড়ায়:
>
> ```text
> Instruction bits
>        ↓
>      Decode
>        ↓
> Control signals
>        ↓
> Current State
>        ↓
> Combinational Datapath
>        ↓
> Next State
>        ↓
> Clock Edge
>        ↓
> New State
> ```
>
> **Instruction বলে কী করতে হবে।** Control logic সেই কাজের configuration তৈরি করে। Datapath result তৈরি করে। আর clock দেয় নতুন state capture করার timing boundary।

---

## ০৪ — Fetch-Decode-Execute: মৌলিক flow

একটা instruction CPU-তে আসা থেকে তার effect CPU-র state-এ বসা পর্যন্ত পুরো ব্যাপারটাকে তিনটি বড় conceptual phase-এ ভাগ করে দেখা যায়: Fetch → Decode → Execute।

এটা একটা কাজে দেওয়া mental model। কিন্তু একটা কথা গুরুত্বপূর্ণ:

> **Fetch, Decode আর Execute মানেই তিনটা clock tick — এমন নয়।** কোনো processor-এ একটা instruction একাধিক clock cycle নিতে পারে; আবার pipelined CPU-তে একই সময়ে ভিন্ন instruction এই তিন phase-এর ভিন্ন অংশে থাকতে পারে।

তাই "phase" বলতে এখানে বোঝাচ্ছি কাজের ধরন, নির্দিষ্ট সময় নয়।

**[DIAGRAM · flow · simplified model]**

```text
Fetch
  ↓
Decode
  ↓
Execute / state update
```

*Caption:* Fetch-Decode-Execute বলে কী ধরনের কাজ হচ্ছে; clock বলে stored state কখন update হওয়ার সুযোগ পাবে। দুটো এক জিনিস নয়।

### ১ · Fetch — instruction আনা

Fetch phase-এর কাজ একটাই — পরবর্তী instruction-এর bits CPU-র execution machinery-র কাছে আনা।

- PC-তে পরবর্তী instruction-এর address আছে।
- CPU সেই address ব্যবহার করে memory subsystem-এর কাছে instruction চায়।
- Memory থেকে instruction-এর bits CPU-র কাছে আসে।
- CPU-র একটা internal storage element — আমাদের model-এ **[HOVER: Instruction Register]** (IR) — সেই bits ধরে রাখে।

একই সঙ্গে simplified model-এ PC পরবর্তী instruction-এর দিকে এগোয়।

> Fetch মানে clock tick এসে data-কে ঠেলে এক জায়গা থেকে আরেক জায়গায় পাঠানো নয়। Signal propagate করে, আর data ready হলে CPU নির্দিষ্ট timing boundary-তে নিজের state update করতে পারে।

**[DIAGRAM · flow · fetch]**

```text
PC
 ↓
instruction address
 ↓
memory subsystem
 ↓
instruction bits
 ↓
IR
```

### ২ · Decode — instruction থেকে control তৈরি

Instruction-এর bits এখন CPU-র ভেতরে। এবার সেই bits থেকে পরবর্তী কাজের control information তৈরি করতে হবে। এই কাজটা করে **[HOVER: Control Unit]** (CU) আর তার decoding logic।

```text
0001 | 001 | 010 | 011
  ↓     ↓     ↓     ↓
 ADD    A     B     C
```

Instruction-এর field দেখে control logic এমন signal তৈরি করতে পারে:

```text
Select Register A
Select Register B
ALU operation = ADD
Destination = Register C
Write Enable for C = 1
```

খেয়াল করুন — CU এখানে ALU-কে "চালু" করেনি, MUX-কে "রাস্তা খুলতে" বলেনি।

> Control logic datapath-এর বিভিন্ন অংশকে নির্দিষ্ট configuration-এ সেট করে। তারপর combinational logic সেই configuration আর current input অনুযায়ী output তৈরি করে।

**[DIAGRAM · flow · decode]**

```text
Instruction bits
      ↓
   Decode
      ↓
Control signals
      ↓
Configured datapath
```

### ৩ · Execute — computation আর state update

Control signal এখন datapath-কে configure করে রেখেছে। Register A আর B-এর বর্তমান value MUX-এর input-এ আছে; select signal অনুযায়ী সেগুলো ALU-র input-এ পৌঁছায়।

ALU-র combinational logic সেই input নিয়ে কাজ করে, আর propagation delay পেরোনোর পর output-এ দাঁড়ায় ৫ (`0101`)।

> **Clock ALU-কে হিসাব শুরু করায়নি।** Control signal datapath configure করেছে, আর combinational logic current input থেকে result তৈরি করেছে।

এখন সেই result Register C-এর input-এ available, আর `WE_C` active। পরবর্তী appropriate clock edge-এ Register C সেটা capture করতে পারে:

**[DIAGRAM · flow · capture]**

```text
ALU result = 0101
       │
       ▼
   Clock edge
       │
       ▼
Register C captures 0101
```

অর্থাৎ পুরো hardware pattern-টা এই:

> **Instruction-এর bits → control signals → datapath configuration → combinational computation → state update**

নিচের যন্ত্রে পুরো পথটা ধাপে ধাপে চালিয়ে দেখুন:

**[WIDGET · FetchDecodeExecute]** — button হলো "পরের ধাপ", clock tick নয়।

---

## ০৫ — অবিরাম চক্র

একটা instruction-এর state update হয়ে গেলেই CPU থেমে যায় না। পরের instruction-এর জন্য আবার fetch শুরু হয় — আর modern processor-এ একই সময়ে অন্য instruction-গুলো ভিন্ন stage-এ থাকতে পারে।

**[WIDGET · InstructionCycleLoop]**

তবে এই loop দেখে ভাববেন না যে প্রতিটা instruction ঠিক এই তিন ধাপে, নির্দিষ্ট সংখ্যক clock tick-এ শেষ হয়।

> **Clock cycle হলো timing-এর একক; Fetch-Decode-Execute হলো কাজের conceptual stage।**

একটা 3 GHz CPU-তে প্রতি সেকেন্ডে প্রায় ৩ বিলিয়ন clock cycle থাকে। কিন্তু প্রতি সেকেন্ডে ঠিক ৩ বিলিয়ন instruction পুরো fetch-decode-execute সেরে ফেলে — তা নয়। একটা cycle-এ একাধিক instruction-এর কাজ এগোতে পারে, আবার একটা instruction একাধিক cycle নিতেও পারে।

---

## ০৬ — পুরো গল্পটা একবার

Memory-তে কোথাও একটা bit pattern বসে আছে — `0001 001 010 011`। তার গায়ে "instruction" লেখা নেই।

কিন্তু PC-তে সেই address রাখা আছে। CPU সেখান থেকে fetch করে, আর bits চলে আসে IR-এ। PC এগিয়ে যায় পরেরটার দিকে।

Control logic সেই bits-এর field পড়ে control signal তৈরি করে: কোন register select হবে, ALU কোন operation করবে, কোন register result নেবে।

Configured datapath-এ ২ আর ৩ ALU-তে পৌঁছায়, combinational logic settle করে ৫-এ, আর একটা clock edge-এ Register C সেই ৫ capture করে। এই মুহূর্তে result CPU-র state-এর অংশ।

তারপর আবার পরের instruction। এই loop চলতেই থাকে।

আপনার React app, YouTube, Photoshop বা AI chatbot — সবই শেষ পর্যন্ত machine instruction-এ নেমে আসে, আর সেই instruction-গুলো fetch, decode আর execution-এর বিভিন্ন stage-এর মধ্য দিয়ে process হয়। বাস্তব CPU-তে এই stage-গুলো অনেক বেশি জটিল, একসাথে overlap-ও করে — কিন্তু conceptual flow-টা এখান থেকেই শুরু।

---

## ০৭ — সবকিছু এত সরল নয়: Pipelining

বোঝার সুবিধার জন্য আমরা instruction-এর flow দেখিয়েছি একটা সরল ধারাবাহিক প্রক্রিয়া হিসেবে — একটা instruction-এর তিন phase conceptually শেষ হওয়ার পর পরেরটা। এটা শুধু একটা teaching model।

বাস্তব processor-এ pipelining ব্যবহার করে একই সময়ে একাধিক instruction-এর কাজ ভিন্ন stage-এ চলতে পারে:

**[DIAGRAM · flow · pipelining]**

```text
Cycle 1:  I1 Fetch
Cycle 2:  I1 Decode   | I2 Fetch
Cycle 3:  I1 Execute  | I2 Decode  | I3 Fetch
```

I1 যখন execute হচ্ছে, তখনই I2 decode আর I3 fetch হতে পারে। এভাবে প্রতিটা clock cycle-এ আরও বেশি কাজ এগোয়। নিচের যন্ত্রে দুই mode-এর তফাত দেখুন:

**[WIDGET · PipelineVisualizer]** — "একটা করে" বনাম "pipelined"।

**[DEEPER · আরেকটু গভীরে — superscalar, out-of-order, branch prediction]**

Pipelining ছাড়াও modern CPU-তে আরও কিছু mechanism থাকে:

- **Superscalar:** একটা core-এ একাধিক execution unit থাকায় একই clock cycle-এ একাধিক instruction-এর কাজ শুরু বা শেষ হতে পারে।
- **Out-of-order execution:** কোনো instruction-এর operand এখনো তৈরি না থাকলে, তার পরের স্বাধীন instruction-গুলোর কাজ আগে এগোতে পারে।
- **Branch prediction:** conditional branch-এর সম্ভাব্য path অনুমান করে CPU সেই path-এর instruction আগেভাগে fetch/decode করতে পারে। অনুমান ভুল হলে সেই speculative কাজ বাতিল করে সঠিক path-এ ফেরে।

এগুলো basic fetch-decode-execute model-কে বাতিল করে না; বরং সেই flow-কে আরও parallel আর sophisticated করে তোলে।

---

## এই আর্টিকেলে কী শিখলাম

- Instruction-ও শেষ পর্যন্ত bits — memory-র স্তরে instruction আর data দুটোই bit pattern হিসেবে থাকে।
- Instruction format বলে দেয় কী করতে হবে — opcode operation শনাক্ত করে, বাকি field operand আর destination জানায়।
- Program Counter ঠিক করে পরের instruction কোথা থেকে fetch হবে — branch বা অন্য control-flow হলে সেই address বদলাতে পারে।
- Control Unit instruction-এর field থেকে control signal তৈরি করে — কোন register select হবে, ALU কোন operation করবে, কোন register result capture করবে।
- Fetch-Decode-Execute একটা conceptual flow — modern CPU-তে এগুলো একাধিক clock cycle জুড়ে থাকতে পারে, আর একাধিক instruction-এর stage overlap করতে পারে।
- Clock আর Fetch-Decode-Execute এক জিনিস নয় — clock দেয় timing boundary, FDE বলে কাজের ধরন।

---

## পরের article-এ: Memory Hierarchy

এখন আমরা জানি CPU কীভাবে instruction fetch করে, decode করে, আর control signal দিয়ে datapath-কে কাজে লাগায়। কিন্তু একটা প্রশ্ন বাকি — যে instruction আর data CPU বারবার ব্যবহার করে, সেগুলো থাকে কোথায়? CPU-র সবচেয়ে কাছের storage খুব দ্রুত, কিন্তু ছোট; বড় storage অনেক বেশি ধরে, কিন্তু সেখান থেকে data আনতে সময় বেশি লাগে। এই speed, size আর cost-এর trade-off থেকেই তৈরি হয় **Memory Hierarchy** — পরের article-এর বিষয়।

**[পরের article: ০৫ — The Memory Hierarchy]**

**Hover terms used** (definitions live in `glossary.ts`): `opcode`, `pc`, `ir`, `cu`

---
---

# Heartbeat: Fetch-Decode-Execute

## How an instruction becomes work

> *Blocks marked `[DIAGRAM · …]` render through the `<Diagram>` primitive (flow art on paper, not a code well). `[WIDGET · …]` marks an interactive instrument, `[DEEPER · …]` a collapsible toggle. Hover definitions live only in `src/articles/glossary.ts`.*

In the last article we traced how 2 and 3 become 5 inside the hardware. But the story wasn't finished. One question was left open.

How did the CPU know it was supposed to *add* at that moment? Not subtract, not multiply — add. And to take the data from *those* two registers and no others. Where did those control signals come from?

That is where today's story starts.

> **// a silicon time-lapse**
>
> We're still inside the same small silicon town where the ALU, registers, datapath and clock all work together. But today the focus shifts from the parts to the sequence of work. The previous article was a still photograph — what sits inside the chip. This one is a moving picture: how an instruction travels from memory into the CPU, turns its own meaning into control signals, and finally changes the CPU's state.

---

## 01 — Instructions are just bits

When we write programs, "code" and "data" feel like completely different things. But at the memory level, instructions and data are both ultimately **bit patterns**.

```text
ADD instruction   →  a bit pattern
42                →  a bit pattern
a pixel value     →  a bit pattern
```

Memory itself never looks at those bits and decides "this is an instruction" or "that is data."

That doesn't mean the CPU can treat any bit pattern as a command, though. When the CPU **fetches** bits from a particular address as part of instruction fetching, those bits enter the instruction-decoding process.

> Whether a bit pattern is treated as an instruction or as data isn't written into the bits; it depends on how the CPU is using them.

So the question becomes — how does the CPU decide which address to fetch an instruction from? Before that, let's see what an instruction actually looks like.

---

## 02 — Anatomy of an instruction

Suppose we want to tell the CPU: **"Add the contents of Register A and Register B, then store the result in Register C."** The CPU doesn't receive that sentence in human language. Machine instructions use a defined binary format, where different bit fields carry different meanings.

Real instruction formats depend on the processor's architecture, or ISA. Not all processors use instructions of the same size.

To keep things simple, let's invent a 13-bit format:

```text
  0001  |  001  |  010  |  011
 Opcode | Reg A | Reg B | Reg C
```

- **[HOVER: Opcode]** — identifies which operation to perform. In our fictional CPU, say `0001` = ADD, `0010` = SUB, `0011` = LOAD.
- **Register fields** — identify which registers supply the operands and which one receives the result.

Note that `001`, `010`, and `011` are not memory addresses — they are identifiers for the CPU's registers.

Once those fields are decoded, the CPU can generate control signals that route A and B into the ALU, configure the ALU for ADD, and select Register C as the destination. This is where an instruction's bit pattern connects to the CPU's internal behaviour. Change the opcode and operands on the instrument below:

**[WIDGET · InstructionAnatomy]**

---

## 03 — Program Counter: whose turn is it?

If instructions and data look the same in memory, a natural question follows — how does the CPU know which bits to fetch as the next instruction?

That's the job of an important register: the **[HOVER: Program Counter]** (PC), called the Instruction Pointer in some architectures. In simple terms, the PC holds **the memory address the next instruction should be fetched from**.

If our simplified CPU uses fixed-size instructions, then after fetching one instruction the PC can advance to the address of the next.

```text
[ Memory ]

0x004: 0001001010011   ← PC
0x008: 0000000000010   ← data
0x00C: 0000000000011   ← data
```

The PC points at 0x004. When the CPU fetches from that address, the bit pattern it gets enters the instruction-decoding process. In our simplified model the PC then advances to the next instruction.

When a program starts, the system arranges for execution to begin at the program's entry point — in our model, we can picture the address of the first instruction being placed into the PC.

**[WIDGET · ProgramCounterDemo]**

In a real CPU, though, the PC does not always simply "add one step." Instruction size, branches, jumps, function calls and returns can all change where the next instruction comes from.

> Memory holds no label marking instructions apart from data. The CPU's instruction-fetch process is what determines which location's bits get decoded as an instruction.

Now we have all the pieces. The instruction sits in memory, and the PC knows which one to read. But how do those bits turn into actual work?

---

## Mental model: article 03 + the instruction

> **// one mental model to remember**
>
> In the previous article we saw:
>
> ```text
> Current State
>      ↓
> Combinational Logic
>      ↓
> Next State
>      ↓
> Clock Edge
>      ↓
> New State
> ```
>
> Now add the instruction, and the picture becomes:
>
> ```text
> Instruction bits
>        ↓
>      Decode
>        ↓
> Control signals
>        ↓
> Current State
>        ↓
> Combinational Datapath
>        ↓
> Next State
>        ↓
> Clock Edge
>        ↓
> New State
> ```
>
> **The instruction specifies WHAT should happen.** Control logic configures the operation. The datapath produces the result. And the clock provides the timing boundary for capturing the new state.

---

## 04 — Fetch-Decode-Execute: the basic flow

The journey of an instruction — from entering the CPU to leaving its mark on the CPU's state — can be split into three broad conceptual phases: Fetch → Decode → Execute.

That's a useful mental model. But one thing matters:

> **Fetch, Decode and Execute do not mean three clock ticks.** In some processors an instruction takes several clock cycles; in a pipelined CPU, different instructions can sit in different parts of these phases at the same time.

So "phase" here describes the kind of work being done, not a fixed amount of time.

**[DIAGRAM · flow · simplified model]**

```text
Fetch
  ↓
Decode
  ↓
Execute / state update
```

*Caption:* Fetch-Decode-Execute describes what kind of work happens; the clock describes when stored state gets a chance to update. They are not the same thing.

### 1 · Fetch — bringing in the instruction

The Fetch phase has one job — bring the bits of the next instruction to the CPU's execution machinery.

- The PC holds the address of the next instruction.
- The CPU uses that address to request the instruction from the memory subsystem.
- The instruction bits arrive from memory.
- An internal storage element — in our model the **[HOVER: Instruction Register]** (IR) — holds those bits.

At the same time, in our simplified model, the PC advances toward the next instruction.

> Fetch doesn't mean a clock tick shoves data from one place to another. Signals propagate, and once the data is ready the CPU can update its state at the appropriate timing boundary.

**[DIAGRAM · flow · fetch]**

```text
PC
 ↓
instruction address
 ↓
memory subsystem
 ↓
instruction bits
 ↓
IR
```

### 2 · Decode — generating control signals

The instruction bits are inside the CPU now. Those fields have to become the control information the operation needs. That's the work of the **[HOVER: Control Unit]** (CU) and its decoding logic.

```text
0001 | 001 | 010 | 011
  ↓     ↓     ↓     ↓
 ADD    A     B     C
```

Reading those fields, the control logic can generate signals such as:

```text
Select Register A
Select Register B
ALU operation = ADD
Destination = Register C
Write Enable for C = 1
```

Notice what is not happening: the CU is not "switching the ALU on" or "opening the MUX."

> Control logic configures the parts of the datapath for the required operation. The combinational logic then produces its output from that configuration and the current inputs.

**[DIAGRAM · flow · decode]**

```text
Instruction bits
      ↓
   Decode
      ↓
Control signals
      ↓
Configured datapath
```

### 3 · Execute — computation and state update

The control signals have configured the datapath. The current values in Register A and B sit at the MUX inputs, and the select signals present them to the ALU.

The ALU's combinational logic works on those inputs, and after the propagation delay its output settles at 5 (`0101`).

> **The clock did not tell the ALU to start calculating.** The control signals configured the datapath, and the combinational logic produced the result from its current inputs.

That result is now available at Register C's input, and `WE_C` is active. At the next appropriate clock edge, Register C can capture it:

**[DIAGRAM · flow · capture]**

```text
ALU result = 0101
       │
       ▼
   Clock edge
       │
       ▼
Register C captures 0101
```

So the core hardware pattern is this:

> **Instruction bits → control signals → datapath configuration → combinational computation → state update**

Step through the whole path on the instrument below:

**[WIDGET · FetchDecodeExecute]** — the button is "step," not a clock tick.

---

## 05 — The continuous loop

Once an instruction's state update has happened, the CPU doesn't stop. Fetching begins again for the next one — and in a modern processor other instructions may be sitting in different stages at the same time.

**[WIDGET · InstructionCycleLoop]**

But don't read this loop as saying every instruction finishes in exactly these three steps, in a fixed number of clock ticks.

> **A clock cycle is a unit of timing; Fetch-Decode-Execute describes conceptual stages of work.**

A 3 GHz CPU has roughly 3 billion clock cycles per second. That does not mean it completes exactly 3 billion full fetch-decode-execute cycles per second. Work from several instructions can progress in one cycle, and a single instruction can also take several cycles.

---

## 06 — The whole story, once through

Somewhere in memory sits a bit pattern — `0001 001 010 011`. Nothing on it says "instruction."

But the PC holds that address. The CPU fetches from it, and the bits land in the IR. The PC advances toward the next one.

Control logic reads those fields and generates control signals: which registers are selected, which operation the ALU performs, which register receives the result.

On the configured datapath, 2 and 3 reach the ALU, the combinational logic settles at 5, and on a clock edge Register C captures it. At that moment the result becomes part of the CPU's state.

Then the next instruction. The loop keeps going.

Your React app, YouTube, Photoshop, an AI chatbot — all of it eventually becomes machine instructions, and those instructions are processed through stages corresponding to fetch, decode and execution. Real CPUs make those stages far more complex and overlapping, but the conceptual flow begins here.

---

## 07 — Reality corner: pipelining

To keep things simple we showed instruction flow as a straightforward sequential process — one instruction passing through the three conceptual phases before the next. That is only a teaching model.

Real processors use pipelining, so work from several instructions can occupy different stages at the same time:

**[DIAGRAM · flow · pipelining]**

```text
Cycle 1:  I1 Fetch
Cycle 2:  I1 Decode   | I2 Fetch
Cycle 3:  I1 Execute  | I2 Decode  | I3 Fetch
```

While I1 is being executed, I2 can be decoded and I3 fetched. That way more work progresses during each clock cycle. Compare the two modes on the instrument below:

**[WIDGET · PipelineVisualizer]** — "one at a time" vs "pipelined".

**[DEEPER · go deeper — superscalar, out-of-order, branch prediction]**

Beyond pipelining, modern CPUs use several more mechanisms:

- **Superscalar:** a core can have several execution units, so work from multiple instructions can start or finish in the same clock cycle.
- **Out-of-order execution:** if one instruction is still waiting on an operand, independent later instructions may be allowed to make progress first.
- **Branch prediction:** the CPU predicts the likely path of a conditional branch and may fetch and decode from that path early. If the prediction is wrong, that speculative work is discarded and it returns to the correct path.

None of these replace the basic fetch-decode-execute idea. They make that flow more parallel and more sophisticated.

---

## What this article covered

- Instructions are ultimately bits — at the memory level, instructions and data are both just bit patterns.
- The instruction format says what to do — the opcode identifies the operation, the other fields name operands and destination.
- The Program Counter decides where the next instruction is fetched from — branches and other control flow can change that address.
- The Control Unit turns instruction fields into control signals — which registers are selected, which ALU operation runs, which register captures the result.
- Fetch-Decode-Execute is a conceptual flow — in modern CPUs these stages can span multiple clock cycles and overlap across instructions.
- The clock is not the same thing as Fetch-Decode-Execute — the clock gives timing boundaries; FDE describes the kinds of work.

---

## Next article: The Memory Hierarchy

We now know how a CPU fetches an instruction, decodes it, and uses control signals to drive the datapath. But one question remains — where do all the instructions and data the CPU keeps using actually live? The storage closest to the CPU is very fast but small; larger storage holds far more but takes longer to reach. That trade-off between speed, size and cost is what produces the **Memory Hierarchy** — the subject of the next article.

**[Next: 05 — The Memory Hierarchy]**

**Hover terms used** (definitions live in `glossary.ts`): `opcode`, `pc`, `ir`, `cu`
