import type { ReactNode } from 'react';
import { useLang } from '../context/LanguageContext';
import { Section } from '../primitives/Section';
import { Term } from '../primitives/Term';
import { Deeper } from '../primitives/Deeper';
import { Diagram } from '../primitives/Diagram';
import { Recap } from '../primitives/Recap';
import { RelayNav, SERIES_HUB_CARD } from '../primitives/RelayNav';
import { Colophon } from '../primitives/Colophon';
import { InstructionAnatomy } from '../widgets/InstructionAnatomy';
import { ProgramCounterDemo } from '../widgets/ProgramCounterDemo';
import { FetchDecodeExecute } from '../widgets/FetchDecodeExecute';
import { InstructionCycleLoop } from '../widgets/InstructionCycleLoop';
import { PipelineVisualizer } from '../widgets/PipelineVisualizer';

const LINK = { color: '#00753F' };

/* ── shared flow art, identical in both languages ─────────────────────── */

const ART_FDE = `Fetch
  ↓
Decode
  ↓
Execute / state update`;

const ART_A3 = `Current State
     ↓
Combinational Logic
     ↓
Next State
     ↓
Clock Edge
     ↓
New State`;

const ART_A4 = `Instruction bits
       ↓
     Decode
       ↓
Control signals
       ↓
Current State
       ↓
Combinational Datapath
       ↓
Next State
       ↓
Clock Edge
       ↓
New State`;

const ART_FETCH = `PC
 ↓
instruction address
 ↓
memory subsystem
 ↓
instruction bits
 ↓
IR`;

const ART_DECODE = `Instruction bits
      ↓
   Decode
      ↓
Control signals
      ↓
Configured datapath`;

const ART_CAPTURE = `ALU result = 0101
       │
       ▼
   Clock edge
       │
       ▼
Register C captures 0101`;

const ART_PIPE = `Cycle 1:  I1 Fetch
Cycle 2:  I1 Decode   | I2 Fetch
Cycle 3:  I1 Execute  | I2 Decode  | I3 Fetch`;

export function HeartbeatFDE() {
  const { bn } = useLang();

  const bodyStyle = bn
    ? { fontFamily: "'Anek Bangla','Anek Latin',sans-serif" }
    : { fontFamily: "'Anek Latin',sans-serif" };

  const p = (s: string | ReactNode) => <p style={{ margin: '0 0 16px', ...bodyStyle }}>{s}</p>;

  const pre = (s: string) => (
    <pre style={{ fontFamily: "'Departure Mono',monospace", fontSize: '13px', background: 'rgba(255,252,243,0.65)', border: '1px solid #c9bda0', color: '#33301F', padding: '13px 18px', margin: '0 0 20px', overflowX: 'auto' }}>
      {s}
    </pre>
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

  const h3 = (s: string) => (
    <h3 style={{ fontFamily: "'Departure Mono',monospace", fontSize: '13px', letterSpacing: '0.08em', color: '#5a5444', margin: '30px 0 14px' }}>{s}</h3>
  );

  /* The bridge from article 03's clock model into this article's story. */
  const mentalModel = (
    <aside
      style={{ margin: '44px 0 10px', border: '2px solid #00753F', padding: '22px 24px', background: 'rgba(255,252,243,0.55)', ...bodyStyle }}
      {...(bn ? { lang: 'bn' } : {})}
    >
      <div style={{ fontFamily: "'Departure Mono',monospace", fontSize: '11.5px', letterSpacing: '0.1em', color: '#00753F', marginBottom: 14, textTransform: 'uppercase' }}>
        {bn ? '// একটা mental model মনে রাখুন' : '// one mental model to remember'}
      </div>
      <p style={{ margin: '0 0 8px', ...bodyStyle }}>
        {bn ? <>আগের <a href="/writing/cpu-blueprint" style={LINK}>article-এ</a> আমরা দেখেছিলাম:</> : <>In the <a href="/writing/cpu-blueprint" style={LINK}>previous article</a> we saw:</>}
      </p>
      <Diagram art={ART_A3} bnLabel="flow · article ০৩" enLabel="flow · article 03" />
      <p style={{ margin: '0 0 8px', ...bodyStyle }}>
        {bn ? 'এবার instruction যোগ করলে ছবিটা দাঁড়ায়:' : 'Now add the instruction, and the picture becomes:'}
      </p>
      <Diagram art={ART_A4} bnLabel="flow · এই article" enLabel="flow · this article" />
      <p style={{ margin: 0, ...bodyStyle }}>
        {bn
          ? <><strong>Instruction বলে কী করতে হবে।</strong> Control logic সেই কাজের configuration তৈরি করে। Datapath result তৈরি করে। আর clock দেয় নতুন state capture করার timing boundary।</>
          : <><strong>The instruction specifies WHAT should happen.</strong> Control logic configures the operation. The datapath produces the result. And the clock provides the timing boundary for capturing the new state.</>}
      </p>
    </aside>
  );

  return (
    <article style={{ marginTop: 40, fontSize: '16.5px', lineHeight: 1.9 }}>
      {/* ── Hook ─────────────────────────────────────────────────────── */}
      <div>
        {bn ? (
          <div lang="bn" style={bodyStyle}>
            {p(<><a href="/writing/cpu-blueprint" style={LINK}>আগের আর্টিকেলে</a> দেখা গেছে — ২ আর ৩ কীভাবে যোগ হয়ে ৫ হয়। কিন্তু পুরো কাহিনী শেষ হয়নি। একটা প্রশ্নের উত্তর বাকি ছিল।</>)}
            {p(<>CPU জানল কীভাবে যে এই মুহূর্তে তাকে <em>যোগ</em> করতে হবে? বিয়োগ না, গুণ না — যোগ। আর <em>এই</em> দুইটা register-এর ডেটা নিতে হবে, বাকিগুলো না। সেই control signal-গুলো এল কোথা থেকে?</>)}
            {p('আজকের গল্পটা ঠিক এখান থেকেই শুরু।')}
            <div style={{ border: '1px solid #c9bda0', background: 'rgba(255,252,243,0.65)', padding: '14px 18px', margin: '0 0 16px' }}>
              <div style={{ fontFamily: "'Departure Mono',monospace", fontSize: '11.5px', color: '#00753F', letterSpacing: '0.08em', marginBottom: 8 }}>
                // সিলিকন সিটির time-lapse
              </div>
              <p style={{ margin: 0, fontSize: '15.5px', ...bodyStyle }}>
                আমরা এখনও সিলিকনের সেই ছোট্ট শহরের ভেতরেই আছি, যেখানে ALU, register, datapath আর clock একসাথে কাজ করছে। তবে আজকের ফোকাস যন্ত্রাংশের ওপর নয়, কাজের ধারাবাহিকতার ওপর। আগের আর্টিকেলটি ছিল একটি স্থিরচিত্র — ভেতরে কী কী আছে তার বিবরণ। আজকেরটা চলমান ছবি: একটা instruction কীভাবে memory থেকে CPU-তে আসে, নিজের অর্থ control signal-এ রূপ নেয়, আর শেষে CPU-র state বদলে দেয়।
              </p>
            </div>
          </div>
        ) : (
          <div style={bodyStyle}>
            {p(<>In the <a href="/writing/cpu-blueprint" style={LINK}>last article</a> we traced how 2 and 3 become 5 inside the hardware. But the story wasn't finished. One question was left open.</>)}
            {p(<>How did the CPU know it was supposed to <em>add</em> at that moment? Not subtract, not multiply — add. And to take the data from <em>those</em> two registers and no others. Where did those control signals come from?</>)}
            {p('That is where today\'s story starts.')}
            <div style={{ border: '1px solid #c9bda0', background: 'rgba(255,252,243,0.65)', padding: '14px 18px', margin: '0 0 16px' }}>
              <div style={{ fontFamily: "'Departure Mono',monospace", fontSize: '11.5px', color: '#00753F', letterSpacing: '0.08em', marginBottom: 8 }}>
                // a silicon time-lapse
              </div>
              <p style={{ margin: 0, fontSize: '15.5px', ...bodyStyle }}>
                We're still inside the same small silicon town where the ALU, registers, datapath and clock all work together. But today the focus shifts from the parts to the sequence of work. The previous article was a still photograph — what sits inside the chip. This one is a moving picture: how an instruction travels from memory into the CPU, turns its own meaning into control signals, and finally changes the CPU's state.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ── 01 — Instructions are just bits ──────────────────────────── */}
      <Section num="01" bnH2="Instruction-ও শুধু bits" enH2="Instructions are just bits">
        {bn ? (
          <div lang="bn" style={bodyStyle}>
            {p(<>আমরা যখন code লিখি, তখন "code" আর "data" সম্পূর্ণ আলাদা জিনিস মনে হয়। কিন্তু memory-র স্তরে instruction আর data — দুটোই শেষ পর্যন্ত <strong>bit pattern</strong>।</>)}
            {pre('ADD instruction   →  একটা bit pattern\n42                →  একটা bit pattern\nএকটা pixel value  →  একটা bit pattern')}
            {p('Memory নিজে বসে সিদ্ধান্ত নেয় না — "এই bit-গুলো instruction" আর "ওগুলো data"।')}
            {p(<>তবে তাই বলে CPU যেকোনো bit-কে ইচ্ছামতো instruction বানিয়ে ফেলে না। CPU যখন <strong>instruction fetch</strong> করার জন্য একটা নির্দিষ্ট memory address থেকে bit pattern আনে, তখনই সেই bits instruction হিসেবে decode হওয়ার process-এ ঢোকে।</>)}
            {blockquote('Instruction নাকি data — সেটা bit pattern-এর গায়ে লেখা থাকে না; CPU কোন কাজে সেই bits ব্যবহার করছে, তার ওপরই interpretation নির্ভর করে।')}
            {p('তাহলে প্রশ্নটা দাঁড়ায় — CPU কোন address থেকে instruction আনবে, সেটা ঠিক হয় কীভাবে? তার আগে দেখা যাক, একটা instruction দেখতে কেমন।')}
          </div>
        ) : (
          <div style={bodyStyle}>
            {p(<>When we write programs, "code" and "data" feel like completely different things. But at the memory level, instructions and data are both ultimately <strong>bit patterns</strong>.</>)}
            {pre('ADD instruction   →  a bit pattern\n42                →  a bit pattern\na pixel value     →  a bit pattern')}
            {p('Memory itself never looks at those bits and decides "this is an instruction" or "that is data."')}
            {p(<>That doesn't mean the CPU can treat any bit pattern as a command, though. When the CPU <strong>fetches</strong> bits from a particular address as part of instruction fetching, those bits enter the instruction-decoding process.</>)}
            {blockquote("Whether a bit pattern is treated as an instruction or as data isn't written into the bits; it depends on how the CPU is using them.")}
            {p("So the question becomes — how does the CPU decide which address to fetch an instruction from? Before that, let's see what an instruction actually looks like.")}
          </div>
        )}
      </Section>

      {/* ── 02 — Anatomy of an instruction ───────────────────────────── */}
      <Section num="02" bnH2="একটা instruction-এর ব্যবচ্ছেদ" enH2="Anatomy of an instruction">
        {bn ? (
          <div lang="bn" style={bodyStyle}>
            {p(<>ধরুন CPU-কে বলতে চাই: <strong>"Register A আর Register B যোগ করে ফলাফল Register C-তে রাখো।"</strong> এই বাক্যটা CPU-র কাছে মানুষের ভাষায় যায় না। Machine instruction-এর একটা নির্দিষ্ট binary format থাকে, যেখানে আলাদা আলাদা bit field-এর আলাদা মানে।</>)}
            {p('বাস্তব processor-এ instruction format নির্ভর করে তার architecture বা ISA-র ওপর। সব processor-এ instruction একই মাপের — এমন নয়।')}
            {p('বোঝার সুবিধার জন্য আমরা একটা কাল্পনিক ১৩-bit format ধরে নিচ্ছি:')}
            {pre('  0001  |  001  |  010  |  011\n Opcode | Reg A | Reg B | Reg C')}
            {ul([
              <><Term id="opcode">Opcode</Term> — কোন operation হবে সেটা নির্দেশ করে। আমাদের কাল্পনিক CPU-তে ধরা যাক <code>0001</code> = ADD, <code>0010</code> = SUB, <code>0011</code> = LOAD।</>,
              <><strong>Register field</strong> — কোন register থেকে operand নিতে হবে আর কোন register-এ result রাখতে হবে, সেগুলোর পরিচয় নম্বর।</>,
            ])}
            {p(<>খেয়াল করুন, <code>001</code>, <code>010</code>, <code>011</code> কোনো memory address নয় — এগুলো CPU-র register-গুলোর identifier।</>)}
            {p('এই field-গুলো decode করার পর CPU এমন control signal তৈরি করতে পারে, যা A আর B-এর value ALU-তে পাঠায়, ALU-কে ADD-এর জন্য configure করে, আর destination হিসেবে Register C বেছে নেয়। এখানেই instruction-এর bit pattern থেকে CPU-র ভেতরের আচরণের যোগসূত্র তৈরি হয়। নিচের যন্ত্রে opcode আর operand পাল্টে দেখুন:')}
          </div>
        ) : (
          <div style={bodyStyle}>
            {p(<>Suppose we want to tell the CPU: <strong>"Add the contents of Register A and Register B, then store the result in Register C."</strong> The CPU doesn't receive that sentence in human language. Machine instructions use a defined binary format, where different bit fields carry different meanings.</>)}
            {p('Real instruction formats depend on the processor\'s architecture, or ISA. Not all processors use instructions of the same size.')}
            {p("To keep things simple, let's invent a 13-bit format:")}
            {pre('  0001  |  001  |  010  |  011\n Opcode | Reg A | Reg B | Reg C')}
            {ul([
              <><Term id="opcode">Opcode</Term> — identifies which operation to perform. In our fictional CPU, say <code>0001</code> = ADD, <code>0010</code> = SUB, <code>0011</code> = LOAD.</>,
              <><strong>Register fields</strong> — identify which registers supply the operands and which one receives the result.</>,
            ])}
            {p(<>Note that <code>001</code>, <code>010</code>, and <code>011</code> are not memory addresses — they are identifiers for the CPU's registers.</>)}
            {p("Once those fields are decoded, the CPU can generate control signals that route A and B into the ALU, configure the ALU for ADD, and select Register C as the destination. This is where an instruction's bit pattern connects to the CPU's internal behaviour. Change the opcode and operands on the instrument below:")}
          </div>
        )}
        <InstructionAnatomy />
      </Section>

      {/* ── 03 — Program Counter ─────────────────────────────────────── */}
      <Section num="03" bnH2="Program Counter: কার পালা এখন?" enH2="Program Counter: whose turn is it?">
        {bn ? (
          <div lang="bn" style={bodyStyle}>
            {p('Memory-র কাছে instruction আর data দেখতে একইরকম হলে স্বাভাবিক প্রশ্ন আসে — CPU কীভাবে জানে এখন কোন bits-কে instruction হিসেবে fetch করতে হবে?')}
            {p(<>এর জন্য CPU-তে একটা গুরুত্বপূর্ণ register আছে — <Term id="pc">Program Counter</Term> (PC)। কোনো কোনো architecture-এ একে Instruction Pointer-ও বলে। সহজভাবে, PC ধরে রাখে <strong>পরবর্তী instruction কোন memory address থেকে fetch হবে</strong>।</>)}
            {p('আমাদের simplified CPU-তে instruction-গুলো যদি fixed-size হয়, তাহলে একটা instruction fetch করার পর PC পরেরটার address-এ এগিয়ে যেতে পারে।')}
            {pre('[ Memory ]\n\n0x004: 0001001010011   ← PC\n0x008: 0000000000010   ← data\n0x00C: 0000000000011   ← data')}
            {p('PC এখন 0x004 নির্দেশ করছে। CPU সেখান থেকে fetch করলে ওই bit pattern instruction হিসেবে decode হওয়ার পথে যায়। তারপর simplified model-এ PC পরের instruction-এর দিকে এগোয়।')}
            {p('কোনো program চালু হলে system সেটির entry point থেকে execution শুরুর ব্যবস্থা করে — আমাদের model-এ ধরে নিতে পারি, PC-তে প্রথম instruction-এর address বসানো হয়।')}
          </div>
        ) : (
          <div style={bodyStyle}>
            {p('If instructions and data look the same in memory, a natural question follows — how does the CPU know which bits to fetch as the next instruction?')}
            {p(<>That's the job of an important register: the <Term id="pc">Program Counter</Term> (PC), called the Instruction Pointer in some architectures. In simple terms, the PC holds <strong>the memory address the next instruction should be fetched from</strong>.</>)}
            {p('If our simplified CPU uses fixed-size instructions, then after fetching one instruction the PC can advance to the address of the next.')}
            {pre('[ Memory ]\n\n0x004: 0001001010011   ← PC\n0x008: 0000000000010   ← data\n0x00C: 0000000000011   ← data')}
            {p('The PC points at 0x004. When the CPU fetches from that address, the bit pattern it gets enters the instruction-decoding process. In our simplified model the PC then advances to the next instruction.')}
            {p("When a program starts, the system arranges for execution to begin at the program's entry point — in our model, we can picture the address of the first instruction being placed into the PC.")}
          </div>
        )}
        <ProgramCounterDemo />
        {bn ? (
          <div lang="bn" style={bodyStyle}>
            {p('তবে বাস্তব CPU-তে PC সবসময় শুধু "এক ধাপ বাড়ে" — এমন নয়। Instruction-এর size, branch, jump, function call, return — এসবের কারণে পরের instruction কোথা থেকে আসবে, সেটা বদলে যেতে পারে।')}
            {blockquote('Memory-তে instruction আর data-র জন্য আলাদা কোনো label থাকে না। CPU-র instruction-fetch process ঠিক করে, কোন memory location-এর bits instruction হিসেবে decode হবে।')}
            {p('এবার সব উপাদান হাতে আছে। Instruction memory-তে বসে আছে, PC জানে কোনটা এখন পড়তে হবে। কিন্তু সেই bits থেকে আসল কাজটা হয় কীভাবে?')}
          </div>
        ) : (
          <div style={bodyStyle}>
            {p('In a real CPU, though, the PC does not always simply "add one step." Instruction size, branches, jumps, function calls and returns can all change where the next instruction comes from.')}
            {blockquote("Memory holds no label marking instructions apart from data. The CPU's instruction-fetch process is what determines which location's bits get decoded as an instruction.")}
            {p('Now we have all the pieces. The instruction sits in memory, and the PC knows which one to read. But how do those bits turn into actual work?')}
          </div>
        )}
      </Section>

      {mentalModel}

      {/* ── 04 — Fetch, Decode, Execute ──────────────────────────────── */}
      <Section num="04" bnH2="Fetch-Decode-Execute: মৌলিক flow" enH2="Fetch-Decode-Execute: the basic flow">
        {bn ? (
          <div lang="bn" style={bodyStyle}>
            {p('একটা instruction CPU-তে আসা থেকে তার effect CPU-র state-এ বসা পর্যন্ত পুরো ব্যাপারটাকে তিনটি বড় conceptual phase-এ ভাগ করে দেখা যায়: Fetch → Decode → Execute।')}
            {p('এটা একটা কাজে দেওয়া mental model। কিন্তু একটা কথা গুরুত্বপূর্ণ:')}
            {blockquote(<><strong>Fetch, Decode আর Execute মানেই তিনটা clock tick — এমন নয়।</strong> কোনো processor-এ একটা instruction একাধিক clock cycle নিতে পারে; আবার pipelined CPU-তে একই সময়ে ভিন্ন instruction এই তিন phase-এর ভিন্ন অংশে থাকতে পারে।</>)}
            {p('তাই "phase" বলতে এখানে বোঝাচ্ছি কাজের ধরন, নির্দিষ্ট সময় নয়।')}
          </div>
        ) : (
          <div style={bodyStyle}>
            {p("The journey of an instruction — from entering the CPU to leaving its mark on the CPU's state — can be split into three broad conceptual phases: Fetch → Decode → Execute.")}
            {p("That's a useful mental model. But one thing matters:")}
            {blockquote(<><strong>Fetch, Decode and Execute do not mean three clock ticks.</strong> In some processors an instruction takes several clock cycles; in a pipelined CPU, different instructions can sit in different parts of these phases at the same time.</>)}
            {p('So "phase" here describes the kind of work being done, not a fixed amount of time.')}
          </div>
        )}
        <Diagram
          art={ART_FDE}
          bnLabel="flow · simplified model"
          enLabel="flow · simplified model"
          bnCaption="Fetch-Decode-Execute বলে কী ধরনের কাজ হচ্ছে; clock বলে stored state কখন update হওয়ার সুযোগ পাবে। দুটো এক জিনিস নয়।"
          enCaption="Fetch-Decode-Execute describes what kind of work happens; the clock describes when stored state gets a chance to update. They are not the same thing."
        />

        {bn ? (
          <div lang="bn" style={bodyStyle}>
            {h3('১ · Fetch — instruction আনা')}
            {p('Fetch phase-এর কাজ একটাই — পরবর্তী instruction-এর bits CPU-র execution machinery-র কাছে আনা।')}
            {ul([
              'PC-তে পরবর্তী instruction-এর address আছে।',
              'CPU সেই address ব্যবহার করে memory subsystem-এর কাছে instruction চায়।',
              'Memory থেকে instruction-এর bits CPU-র কাছে আসে।',
              <>CPU-র একটা internal storage element — আমাদের model-এ <Term id="ir">Instruction Register</Term> (IR) — সেই bits ধরে রাখে।</>,
            ])}
            {p('একই সঙ্গে simplified model-এ PC পরবর্তী instruction-এর দিকে এগোয়।')}
            {blockquote('Fetch মানে clock tick এসে data-কে ঠেলে এক জায়গা থেকে আরেক জায়গায় পাঠানো নয়। Signal propagate করে, আর data ready হলে CPU নির্দিষ্ট timing boundary-তে নিজের state update করতে পারে।')}
          </div>
        ) : (
          <div style={bodyStyle}>
            {h3('1 · Fetch — bringing in the instruction')}
            {p("The Fetch phase has one job — bring the bits of the next instruction to the CPU's execution machinery.")}
            {ul([
              'The PC holds the address of the next instruction.',
              'The CPU uses that address to request the instruction from the memory subsystem.',
              'The instruction bits arrive from memory.',
              <>An internal storage element — in our model the <Term id="ir">Instruction Register</Term> (IR) — holds those bits.</>,
            ])}
            {p('At the same time, in our simplified model, the PC advances toward the next instruction.')}
            {blockquote("Fetch doesn't mean a clock tick shoves data from one place to another. Signals propagate, and once the data is ready the CPU can update its state at the appropriate timing boundary.")}
          </div>
        )}
        <Diagram art={ART_FETCH} bnLabel="flow · fetch" enLabel="flow · fetch" />

        {bn ? (
          <div lang="bn" style={bodyStyle}>
            {h3('২ · Decode — instruction থেকে control তৈরি')}
            {p(<>Instruction-এর bits এখন CPU-র ভেতরে। এবার সেই bits থেকে পরবর্তী কাজের control information তৈরি করতে হবে। এই কাজটা করে <Term id="cu">Control Unit</Term> (CU) আর তার decoding logic।</>)}
            {pre('0001 | 001 | 010 | 011\n  ↓     ↓     ↓     ↓\n ADD    A     B     C')}
            {p('Instruction-এর field দেখে control logic এমন signal তৈরি করতে পারে:')}
            {pre('Select Register A\nSelect Register B\nALU operation = ADD\nDestination = Register C\nWrite Enable for C = 1')}
            {p('খেয়াল করুন — CU এখানে ALU-কে "চালু" করেনি, MUX-কে "রাস্তা খুলতে" বলেনি।')}
            {blockquote('Control logic datapath-এর বিভিন্ন অংশকে নির্দিষ্ট configuration-এ সেট করে। তারপর combinational logic সেই configuration আর current input অনুযায়ী output তৈরি করে।')}
          </div>
        ) : (
          <div style={bodyStyle}>
            {h3('2 · Decode — generating control signals')}
            {p(<>The instruction bits are inside the CPU now. Those fields have to become the control information the operation needs. That's the work of the <Term id="cu">Control Unit</Term> (CU) and its decoding logic.</>)}
            {pre('0001 | 001 | 010 | 011\n  ↓     ↓     ↓     ↓\n ADD    A     B     C')}
            {p('Reading those fields, the control logic can generate signals such as:')}
            {pre('Select Register A\nSelect Register B\nALU operation = ADD\nDestination = Register C\nWrite Enable for C = 1')}
            {p('Notice what is not happening: the CU is not "switching the ALU on" or "opening the MUX."')}
            {blockquote('Control logic configures the parts of the datapath for the required operation. The combinational logic then produces its output from that configuration and the current inputs.')}
          </div>
        )}
        <Diagram art={ART_DECODE} bnLabel="flow · decode" enLabel="flow · decode" />

        {bn ? (
          <div lang="bn" style={bodyStyle}>
            {h3('৩ · Execute — computation আর state update')}
            {p('Control signal এখন datapath-কে configure করে রেখেছে। Register A আর B-এর বর্তমান value MUX-এর input-এ আছে; select signal অনুযায়ী সেগুলো ALU-র input-এ পৌঁছায়।')}
            {p(<>ALU-র combinational logic সেই input নিয়ে কাজ করে, আর propagation delay পেরোনোর পর output-এ দাঁড়ায় ৫ (<code>0101</code>)।</>)}
            {blockquote(<><strong>Clock ALU-কে হিসাব শুরু করায়নি।</strong> Control signal datapath configure করেছে, আর combinational logic current input থেকে result তৈরি করেছে।</>)}
            {p(<>এখন সেই result Register C-এর input-এ available, আর <code>WE_C</code> active। পরবর্তী appropriate clock edge-এ Register C সেটা capture করতে পারে:</>)}
          </div>
        ) : (
          <div style={bodyStyle}>
            {h3('3 · Execute — computation and state update')}
            {p("The control signals have configured the datapath. The current values in Register A and B sit at the MUX inputs, and the select signals present them to the ALU.")}
            {p(<>The ALU's combinational logic works on those inputs, and after the propagation delay its output settles at 5 (<code>0101</code>).</>)}
            {blockquote(<><strong>The clock did not tell the ALU to start calculating.</strong> The control signals configured the datapath, and the combinational logic produced the result from its current inputs.</>)}
            {p(<>That result is now available at Register C's input, and <code>WE_C</code> is active. At the next appropriate clock edge, Register C can capture it:</>)}
          </div>
        )}
        <Diagram art={ART_CAPTURE} bnLabel="flow · capture" enLabel="flow · capture" />

        {bn ? (
          <div lang="bn" style={bodyStyle}>
            {p('অর্থাৎ পুরো hardware pattern-টা এই:')}
            {blockquote(<strong>Instruction-এর bits → control signals → datapath configuration → combinational computation → state update</strong>)}
            {p('নিচের যন্ত্রে পুরো পথটা ধাপে ধাপে চালিয়ে দেখুন:')}
          </div>
        ) : (
          <div style={bodyStyle}>
            {p('So the core hardware pattern is this:')}
            {blockquote(<strong>Instruction bits → control signals → datapath configuration → combinational computation → state update</strong>)}
            {p('Step through the whole path on the instrument below:')}
          </div>
        )}
        <FetchDecodeExecute />
      </Section>

      {/* ── 05 — The continuous loop ─────────────────────────────────── */}
      <Section num="05" bnH2="অবিরাম চক্র" enH2="The continuous loop">
        {bn ? (
          <div lang="bn" style={bodyStyle}>
            {p('একটা instruction-এর state update হয়ে গেলেই CPU থেমে যায় না। পরের instruction-এর জন্য আবার fetch শুরু হয় — আর modern processor-এ একই সময়ে অন্য instruction-গুলো ভিন্ন stage-এ থাকতে পারে।')}
          </div>
        ) : (
          <div style={bodyStyle}>
            {p("Once an instruction's state update has happened, the CPU doesn't stop. Fetching begins again for the next one — and in a modern processor other instructions may be sitting in different stages at the same time.")}
          </div>
        )}
        <InstructionCycleLoop />
        {bn ? (
          <div lang="bn" style={bodyStyle}>
            {p('তবে এই loop দেখে ভাববেন না যে প্রতিটা instruction ঠিক এই তিন ধাপে, নির্দিষ্ট সংখ্যক clock tick-এ শেষ হয়।')}
            {blockquote(<><strong>Clock cycle হলো timing-এর একক; Fetch-Decode-Execute হলো কাজের conceptual stage।</strong></>)}
            {p('একটা 3 GHz CPU-তে প্রতি সেকেন্ডে প্রায় ৩ বিলিয়ন clock cycle থাকে। কিন্তু প্রতি সেকেন্ডে ঠিক ৩ বিলিয়ন instruction পুরো fetch-decode-execute সেরে ফেলে — তা নয়। একটা cycle-এ একাধিক instruction-এর কাজ এগোতে পারে, আবার একটা instruction একাধিক cycle নিতেও পারে।')}
          </div>
        ) : (
          <div style={bodyStyle}>
            {p("But don't read this loop as saying every instruction finishes in exactly these three steps, in a fixed number of clock ticks.")}
            {blockquote(<><strong>A clock cycle is a unit of timing; Fetch-Decode-Execute describes conceptual stages of work.</strong></>)}
            {p('A 3 GHz CPU has roughly 3 billion clock cycles per second. That does not mean it completes exactly 3 billion full fetch-decode-execute cycles per second. Work from several instructions can progress in one cycle, and a single instruction can also take several cycles.')}
          </div>
        )}
      </Section>

      {/* ── 06 — The whole story ─────────────────────────────────────── */}
      <Section num="06" bnH2="পুরো গল্পটা একবার" enH2="The whole story, once through">
        {bn ? (
          <div lang="bn" style={bodyStyle}>
            {p(<>Memory-তে কোথাও একটা bit pattern বসে আছে — <code>0001 001 010 011</code>। তার গায়ে "instruction" লেখা নেই।</>)}
            {p('কিন্তু PC-তে সেই address রাখা আছে। CPU সেখান থেকে fetch করে, আর bits চলে আসে IR-এ। PC এগিয়ে যায় পরেরটার দিকে।')}
            {p('Control logic সেই bits-এর field পড়ে control signal তৈরি করে: কোন register select হবে, ALU কোন operation করবে, কোন register result নেবে।')}
            {p(<>Configured datapath-এ ২ আর ৩ ALU-তে পৌঁছায়, combinational logic settle করে ৫-এ, আর একটা clock edge-এ Register C সেই ৫ capture করে। এই মুহূর্তে result CPU-র state-এর অংশ।</>)}
            {p('তারপর আবার পরের instruction। এই loop চলতেই থাকে।')}
            {p('আপনার React app, YouTube, Photoshop বা AI chatbot — সবই শেষ পর্যন্ত machine instruction-এ নেমে আসে, আর সেই instruction-গুলো fetch, decode আর execution-এর বিভিন্ন stage-এর মধ্য দিয়ে process হয়। বাস্তব CPU-তে এই stage-গুলো অনেক বেশি জটিল, একসাথে overlap-ও করে — কিন্তু conceptual flow-টা এখান থেকেই শুরু।')}
          </div>
        ) : (
          <div style={bodyStyle}>
            {p(<>Somewhere in memory sits a bit pattern — <code>0001 001 010 011</code>. Nothing on it says "instruction."</>)}
            {p('But the PC holds that address. The CPU fetches from it, and the bits land in the IR. The PC advances toward the next one.')}
            {p('Control logic reads those fields and generates control signals: which registers are selected, which operation the ALU performs, which register receives the result.')}
            {p('On the configured datapath, 2 and 3 reach the ALU, the combinational logic settles at 5, and on a clock edge Register C captures it. At that moment the result becomes part of the CPU\'s state.')}
            {p('Then the next instruction. The loop keeps going.')}
            {p('Your React app, YouTube, Photoshop, an AI chatbot — all of it eventually becomes machine instructions, and those instructions are processed through stages corresponding to fetch, decode and execution. Real CPUs make those stages far more complex and overlapping, but the conceptual flow begins here.')}
          </div>
        )}
      </Section>

      {/* ── 07 — Reality corner: pipelining ──────────────────────────── */}
      <Section num="07" bnH2="সবকিছু এত সরল নয়: Pipelining" enH2="Reality corner: pipelining">
        {bn ? (
          <div lang="bn" style={bodyStyle}>
            {p('বোঝার সুবিধার জন্য আমরা instruction-এর flow দেখিয়েছি একটা সরল ধারাবাহিক প্রক্রিয়া হিসেবে — একটা instruction-এর তিন phase conceptually শেষ হওয়ার পর পরেরটা। এটা শুধু একটা teaching model।')}
            {p('বাস্তব processor-এ pipelining ব্যবহার করে একই সময়ে একাধিক instruction-এর কাজ ভিন্ন stage-এ চলতে পারে:')}
          </div>
        ) : (
          <div style={bodyStyle}>
            {p('To keep things simple we showed instruction flow as a straightforward sequential process — one instruction passing through the three conceptual phases before the next. That is only a teaching model.')}
            {p('Real processors use pipelining, so work from several instructions can occupy different stages at the same time:')}
          </div>
        )}
        <Diagram art={ART_PIPE} bnLabel="flow · pipelining" enLabel="flow · pipelining" />
        {bn ? (
          <div lang="bn" style={bodyStyle}>
            {p('I1 যখন execute হচ্ছে, তখনই I2 decode আর I3 fetch হতে পারে। এভাবে প্রতিটা clock cycle-এ আরও বেশি কাজ এগোয়। নিচের যন্ত্রে দুই mode-এর তফাত দেখুন:')}
          </div>
        ) : (
          <div style={bodyStyle}>
            {p('While I1 is being executed, I2 can be decoded and I3 fetched. That way more work progresses during each clock cycle. Compare the two modes on the instrument below:')}
          </div>
        )}
        <PipelineVisualizer />
        <Deeper
          bnLabel="আরেকটু গভীরে — superscalar, out-of-order, branch prediction"
          enLabel="go deeper — superscalar, out-of-order, branch prediction"
        >
          {bn ? (
            <div lang="bn" style={{ ...bodyStyle, marginTop: 14 }}>
              <p style={{ margin: '0 0 12px' }}>Pipelining ছাড়াও modern CPU-তে আরও কিছু mechanism থাকে:</p>
              <ul style={{ margin: '0 0 12px', paddingLeft: 20, lineHeight: 1.85 }}>
                <li style={{ marginBottom: 10 }}><strong>Superscalar:</strong> একটা core-এ একাধিক execution unit থাকায় একই clock cycle-এ একাধিক instruction-এর কাজ শুরু বা শেষ হতে পারে।</li>
                <li style={{ marginBottom: 10 }}><strong>Out-of-order execution:</strong> কোনো instruction-এর operand এখনো তৈরি না থাকলে, তার পরের স্বাধীন instruction-গুলোর কাজ আগে এগোতে পারে।</li>
                <li><strong>Branch prediction:</strong> conditional branch-এর সম্ভাব্য path অনুমান করে CPU সেই path-এর instruction আগেভাগে fetch/decode করতে পারে। অনুমান ভুল হলে সেই speculative কাজ বাতিল করে সঠিক path-এ ফেরে।</li>
              </ul>
              <p style={{ margin: 0 }}>এগুলো basic fetch-decode-execute model-কে বাতিল করে না; বরং সেই flow-কে আরও parallel আর sophisticated করে তোলে।</p>
            </div>
          ) : (
            <div style={{ ...bodyStyle, marginTop: 14 }}>
              <p style={{ margin: '0 0 12px' }}>Beyond pipelining, modern CPUs use several more mechanisms:</p>
              <ul style={{ margin: '0 0 12px', paddingLeft: 20, lineHeight: 1.85 }}>
                <li style={{ marginBottom: 10 }}><strong>Superscalar:</strong> a core can have several execution units, so work from multiple instructions can start or finish in the same clock cycle.</li>
                <li style={{ marginBottom: 10 }}><strong>Out-of-order execution:</strong> if one instruction is still waiting on an operand, independent later instructions may be allowed to make progress first.</li>
                <li><strong>Branch prediction:</strong> the CPU predicts the likely path of a conditional branch and may fetch and decode from that path early. If the prediction is wrong, that speculative work is discarded and it returns to the correct path.</li>
              </ul>
              <p style={{ margin: 0 }}>None of these replace the basic fetch-decode-execute idea. They make that flow more parallel and more sophisticated.</p>
            </div>
          )}
        </Deeper>
        <Recap>
          {bn ? (
            <>
              <li>Instruction-ও শেষ পর্যন্ত bits — memory-র স্তরে instruction আর data দুটোই bit pattern হিসেবে থাকে।</li>
              <li>Instruction format বলে দেয় কী করতে হবে — opcode operation শনাক্ত করে, বাকি field operand আর destination জানায়।</li>
              <li>Program Counter ঠিক করে পরের instruction কোথা থেকে fetch হবে — branch বা অন্য control-flow হলে সেই address বদলাতে পারে।</li>
              <li>Control Unit instruction-এর field থেকে control signal তৈরি করে — কোন register select হবে, ALU কোন operation করবে, কোন register result capture করবে।</li>
              <li>Fetch-Decode-Execute একটা conceptual flow — modern CPU-তে এগুলো একাধিক clock cycle জুড়ে থাকতে পারে, আর একাধিক instruction-এর stage overlap করতে পারে।</li>
              <li>Clock আর Fetch-Decode-Execute এক জিনিস নয় — clock দেয় timing boundary, FDE বলে কাজের ধরন।</li>
            </>
          ) : (
            <>
              <li>Instructions are ultimately bits — at the memory level, instructions and data are both just bit patterns.</li>
              <li>The instruction format says what to do — the opcode identifies the operation, the other fields name operands and destination.</li>
              <li>The Program Counter decides where the next instruction is fetched from — branches and other control flow can change that address.</li>
              <li>The Control Unit turns instruction fields into control signals — which registers are selected, which ALU operation runs, which register captures the result.</li>
              <li>Fetch-Decode-Execute is a conceptual flow — in modern CPUs these stages can span multiple clock cycles and overlap across instructions.</li>
              <li>The clock is not the same thing as Fetch-Decode-Execute — the clock gives timing boundaries; FDE describes the kinds of work.</li>
            </>
          )}
        </Recap>
      </Section>

      <RelayNav
        hub={SERIES_HUB_CARD}
        next={{ label: { bn: 'baton পরের পর্বে', en: 'baton to the next leg' }, title: bn ? '০৫ — মেমোরি হায়ারার্কি' : '05 — The Memory Hierarchy', href: '/writing/memory-hierarchy', variant: 'next' }}
        bridge={{
          bn: 'এখন আমরা জানি CPU কীভাবে instruction fetch করে, decode করে, আর control signal দিয়ে datapath-কে কাজে লাগায়। কিন্তু একটা প্রশ্ন বাকি — যে instruction আর data CPU বারবার ব্যবহার করে, সেগুলো থাকে কোথায়? CPU-র সবচেয়ে কাছের storage খুব দ্রুত, কিন্তু ছোট; বড় storage অনেক বেশি ধরে, কিন্তু সেখান থেকে data আনতে সময় বেশি লাগে। এই speed, size আর cost-এর trade-off থেকেই তৈরি হয় memory hierarchy — পরের article-এর বিষয়।',
          en: "We now know how a CPU fetches an instruction, decodes it, and uses control signals to drive the datapath. But one question remains — where do all the instructions and data the CPU keeps using actually live? The storage closest to the CPU is very fast but small; larger storage holds far more but takes longer to reach. That trade-off between speed, size and cost is what produces the memory hierarchy — the subject of the next article.",
        }}
      />
      <Colophon />
    </article>
  );
}
