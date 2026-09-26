import type { ReactNode } from 'react';
import { useLang } from '../context/LanguageContext';
import { Section } from '../primitives/Section';
import { Term } from '../primitives/Term';
import { Recap } from '../primitives/Recap';
import { Deeper } from '../primitives/Deeper';
import { Diagram } from '../primitives/Diagram';
import { RelayNav, SERIES_HUB_CARD } from '../primitives/RelayNav';
import { Colophon } from '../primitives/Colophon';
import { AdderWidget } from '../widgets/AdderWidget';
import { CombinationalVsClocked } from '../widgets/CombinationalVsClocked';
import { MuxSelector } from '../widgets/MuxSelector';
import { WriteEnableDecoder } from '../widgets/WriteEnableDecoder';
import { CPUDatapath } from '../widgets/CPUDatapath';
import { ClockVisualizer } from '../widgets/ClockVisualizer';

/* ── shared flow art, identical in both languages ─────────────────────── */

const ART_COMBINATIONAL = `Inputs + Control signals
          ↓
   Combinational logic
          ↓
        Output`;

const ART_REGISTER_64 = `Register A

bit 63                         bit 0
 ↓                              ↓
[1][0][0][1] ... [0][1][0][0]
             64 bits`;

const ART_COMB_VS_SEQ = `Current inputs
      ↓
Combinational logic
      ↓
Current output`;

const ART_DATAPATH = `Register A ──┐
             ├──► MUX ──► ALU ──► Register C
Register B ──┘`;

const ART_MUX = `A ──┐
B ──┤
C ──┤──► MUX ──► ALU input
D ──┘      ↑
          Select`;

const ART_DECODER = `          destination
              │
              ▼
          ┌─────────┐
          │ Decoder │
          └────┬────┘
               │
      ┌────────┼────────┐
      ▼        ▼        ▼
    WE_A     WE_B     WE_C
      0        0        1`;

const ART_ONE_ENABLE = `ALU result ─────────────► Register A
            ────────────► Register B
            ────────────► Register C
            ────────────► Register D

Write Enable:
     A    B    C    D
     0    0    1    0`;

const ART_STATE_LOOP = `       Current State
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
       Current State`;

const ART_BETWEEN_EDGES = `Clock edge
   ↓
Register state changes
   ↓
Signals propagate
   ↓
Combinational logic settles
   ↓
Next clock edge
   ↓
Destination register captures`;

const ART_WHOLE_FLOW = `       Current State
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
       Current State`;

const ART_OPERANDS = `A = 0010 ──► MUX ──► ALU input A
B = 0011 ──► MUX ──► ALU input B`;

const ART_CAPTURE = `ALU result = 0101
                 │
                 ▼
          Register C captures
                 │
                 ▼
          C = 0101  (5)`;

const ART_ONE_LINE = `Current State
     ↓
Control + Combinational Logic
     ↓
Next State
     ↓
Clock Edge
     ↓
New Current State`;

export function BlueprintOfACPU() {
  const { bn } = useLang();

  const bodyStyle = bn
    ? { fontFamily: "'Anek Bangla','Anek Latin',sans-serif" }
    : { fontFamily: "'Anek Latin',sans-serif" };

  const p = (s: string | ReactNode) => <p style={{ margin: '0 0 16px', ...bodyStyle }}>{s}</p>;

  const pre = (s: string) => (
    <pre style={{ fontFamily: "'Departure Mono',monospace", fontSize: '13.5px', background: 'rgba(255,252,243,0.65)', border: '1px solid #c9bda0', color: '#33301F', padding: '13px 18px', margin: '0 0 20px', overflowX: 'auto' }}>{s}</pre>
  );

  const blockquote = (s: ReactNode) => (
    <blockquote style={{ margin: '0 0 20px', padding: '12px 18px', borderLeft: '3px solid #c9bda0', background: 'rgba(255,252,243,0.5)', color: '#3c382b', ...bodyStyle }}>
      {s}
    </blockquote>
  );

  const h3 = (s: string) => (
    <h3 style={{ fontFamily: "'Departure Mono',monospace", fontSize: '13px', letterSpacing: '0.08em', color: '#5a5444', margin: '30px 0 14px' }}>
      {s}
    </h3>
  );

  const ul = (items: ReactNode[]) => (
    <ul style={{ margin: '0 0 20px', paddingLeft: 24, ...bodyStyle }}>
      {items.map((it, i) => <li key={i} style={{ marginBottom: 8 }}>{it}</li>)}
    </ul>
  );

  /* The mental-model box: the condensed answer to every misconception the
     article corrects. Deliberately heavier than a blockquote. */
  const mentalModel = (
    <aside
      style={{
        margin: '44px 0 10px',
        border: '2px solid #00753F',
        padding: '22px 24px',
        background: 'rgba(255,252,243,0.55)',
        ...bodyStyle,
      }}
      {...(bn ? { lang: 'bn' } : {})}
    >
      <div style={{ fontFamily: "'Departure Mono',monospace", fontSize: '11.5px', letterSpacing: '0.1em', color: '#00753F', marginBottom: 14, textTransform: 'uppercase' }}>
        {bn ? '// mental model — CPU-কে এভাবে ভাবুন' : '// mental model — think of the CPU this way'}
      </div>

      <p style={{ margin: '0 0 16px', ...bodyStyle }}>
        {bn
          ? 'CPU-র একটা simplified synchronous datapath-কে এই চারটি বাক্যে মনে রাখা যায়:'
          : 'A simplified synchronous datapath can be remembered with four statements:'}
      </p>

      <ol style={{ margin: '0 0 4px', paddingLeft: 22, ...bodyStyle }}>
        <li style={{ marginBottom: 12 }}>
          <strong>Registers remember.</strong><br />
          {bn ? 'Registers binary state ধরে রাখে।' : 'Registers hold binary state.'}
        </li>
        <li style={{ marginBottom: 12 }}>
          <strong>Combinational logic computes.</strong><br />
          {bn
            ? 'MUX, ALU এবং অন্যান্য logic circuit current input ও control signal থেকে output তৈরি করে।'
            : 'MUXes, ALUs, and other logic circuits produce outputs from current inputs and control signals.'}
        </li>
        <li style={{ marginBottom: 12 }}>
          <strong>Control logic configures.</strong><br />
          {bn
            ? 'Control signal বলে দেয় কোন data select হবে, কোন operation হবে এবং কোন destination ব্যবহার হবে।'
            : 'Control signals determine which data is selected, which operation is performed, and which destination is used.'}
        </li>
        <li style={{ marginBottom: 4 }}>
          <strong>The clock provides the timing boundary.</strong><br />
          {bn
            ? 'Clock storage element-কে কখন নতুন state capture করা হবে তার shared timing reference দেয়।'
            : 'The clock provides a shared timing reference for when storage elements capture new state.'}
        </li>
      </ol>

      <Diagram
        art={ART_WHOLE_FLOW}
        bnLabel="flow · পুরো চক্র"
        enLabel="flow · the whole cycle"
      />

      <p style={{ margin: 0, color: '#26241C', ...bodyStyle }}>
        {bn
          ? 'Clock computation-এর engine নয়। Clock হলো state transition-এর timing framework।'
          : 'The clock is not the engine of computation. It is the timing framework for state transitions.'}
      </p>
    </aside>
  );

  return (
    <article style={{ marginTop: 40, fontSize: '16.5px', lineHeight: 1.9 }}>
      {/* ── Hook ─────────────────────────────────────────────────────── */}
      <div>
        {bn ? (
          <div lang="bn" style={bodyStyle}>
            <p style={{ margin: '0 0 16px', ...bodyStyle }}>
              <a href="/writing/how-does-anything-become-bits" style={{ color: '#00753F' }}>আগের আর্টিকেলে</a> দেখেছিলাম বাস্তব জগতের তথ্য — সংখ্যা, text, image, sound — কীভাবে ০ আর ১-এ রূপ নেয় এবং memory-তে voltage হিসেবে জমা হয়। এবার দেখবো সেই voltage-এর কী হয়।
            </p>
            {p(<>ধরা যাক, আমাদের CPU-এর ভেতরে <strong>Register A</strong>-তে <code>2</code> এবং <strong>Register B</strong>-তে <code>3</code> রাখা আছে। এই দুটি সংখ্যা CPU-এর কাছে কোনো abstract "number" হিসেবে নেই। এগুলো আসলে কিছু electrical state — যেমন নির্দিষ্ট <Term id="voltage">voltage</Term> level — যা binary <code>0010</code> এবং <code>0011</code>-কে represent করছে।</>)}
            {p('এখন CPU-কে বলা হলো:')}
            {pre('Register A + Register B → Register C')}
            {p(<>কিছুক্ষণ পর Register C-তে <code>0101</code>, অর্থাৎ <code>5</code>, পাওয়া গেল।</>)}
            {p(<>প্রশ্ন হলো, সিলিকনের একটা জড় টুকরো কীভাবে "জানল" যে <code>2 + 3 = 5</code>?</>)}
            {p(<>আসলে তার মানুষের মতো কিছু বোঝারও প্রয়োজন নেই। CPU-র ভেতরের logic gate-গুলো এমনভাবে সাজানো থাকে যে নির্দিষ্ট input voltage pattern দিলে নির্দিষ্ট output voltage pattern তৈরি হয়। সেই pattern-গুলোর অর্থ আমরা <code>0</code>, <code>1</code>, <code>2</code>, <code>3</code>, <code>5</code> ইত্যাদি হিসেবে ব্যাখ্যা করি।</>)}
            {p(<>এই article-এ আমরা সেই <code>2</code> আর <code>3</code>-এর hardware-level journey অনুসরণ করব। Python, operating system, compiler — এসবের পুরো গল্প এখানে নয়। আমরা ধরে নিচ্ছি, CPU-র কাছে প্রয়োজনীয় data এবং operation-এর control information ইতিমধ্যেই পৌঁছে গেছে। এখন শুধু দেখব, electronic circuit কীভাবে সেই data-কে ব্যবহার করে একটি result তৈরি করে এবং কোথায় সেটা store করে।</>)}
            {p('বোঝার সুবিধার জন্য আমরা কয়েকটি গুরুত্বপূর্ণ building block-এর ওপর focus করব:')}
            {ul([
              <><Term id="alu">ALU</Term> (Arithmetic Logic Unit) — যেখানে arithmetic ও logic operation implement করা থাকে।</>,
              <><Term id="register">Registers</Term> — CPU-র নিজের খুব ছোট, খুব দ্রুত state-holding storage।</>,
              <><Term id="datapath">Datapath</Term> / internal connections — data কোন কোন পথে যেতে পারে।</>,
              <><Term id="controlsignal">Control logic</Term> — কোন path, কোন operation, কোন destination ব্যবহার হবে তা configure করে।</>,
              <>Clock — কখন নতুন state capture হবে তার timing boundary।</>,
            ])}
            {blockquote(<span><strong>একটি জরুরি পার্থক্য:</strong> অনেকেই CPU আর ALU-কে একই জিনিস মনে করে গুলিয়ে ফেলেন। আসলে ALU হলো CPU-র ভেতরের একটি নির্দিষ্ট department মাত্র। একটা বাড়ির রান্নাঘর যেমন পুরো বাড়ির প্রতিনিধি নয়, কিন্তু রান্নার কাজটা সেখানেই হয় — ঠিক তেমনি ALU পুরো processor নয়, কিন্তু গাণিতিক ও যৌক্তিক হিসাবের মূল দায়িত্বটা তারই।</span>)}
          </div>
        ) : (
          <div style={bodyStyle}>
            <p style={{ margin: '0 0 16px', ...bodyStyle }}>
              In the <a href="/writing/how-does-anything-become-bits" style={{ color: '#00753F' }}>last article</a> we saw how real-world data — numbers, text, images, sound — becomes 0s and 1s and lands in memory as voltage. Now: what happens to that voltage.
            </p>
            {p(<>Imagine that our CPU already has the number <code>2</code> in <strong>Register A</strong> and the number <code>3</code> in <strong>Register B</strong>. These are not sitting inside the CPU as abstract mathematical numbers. At the hardware level, they are held as electrical states — for example, particular <Term id="voltage">voltage</Term> levels — that represent the binary values <code>0010</code> and <code>0011</code>.</>)}
            {p('Now suppose the CPU has been told:')}
            {pre('Register A + Register B → Register C')}
            {p(<>After the operation completes, Register C contains <code>0101</code>, which represents <code>5</code>.</>)}
            {p(<>The obvious question is: how does a lifeless piece of silicon "know" that <code>2 + 3 = 5</code>?</>)}
            {p(<>It doesn't need to know anything. The logic gates inside the CPU are wired together in such a way that particular input voltage patterns produce particular output voltage patterns. We interpret those patterns as <code>0</code>, <code>1</code>, <code>2</code>, <code>3</code>, <code>5</code>, and so on.</>)}
            {p(<>In this article, we'll follow the hardware-level journey of those two values. We are not going to trace the entire Python → compiler → machine-code story here. Instead, we'll assume that the required data and control information have already reached the CPU. Our job is to understand what happens inside the electronic circuits once the CPU has to perform the operation.</>)}
            {p("To build our mental model, we'll focus on several important building blocks:")}
            {ul([
              <><Term id="alu">ALU</Term> (Arithmetic Logic Unit) — where arithmetic and logic operations are implemented.</>,
              <><Term id="register">Registers</Term> — the CPU's own very small, very fast state-holding storage.</>,
              <><Term id="datapath">Datapath</Term> / internal connections — the routes data can take.</>,
              <><Term id="controlsignal">Control logic</Term> — what configures which path, which operation, which destination.</>,
              <>Clock — the timing boundary at which new state is captured.</>,
            ])}
            {blockquote(<span><strong>A Critical Distinction:</strong> People often use "CPU" and "ALU" interchangeably, but they are not the same. The ALU is merely a department inside the CPU. Just as a kitchen is not the entire house — even though it's where the cooking happens — the ALU is not the entire processor. It handles the math, but the rest of the CPU coordinates the movement.</span>)}
          </div>
        )}

        <Deeper
          bnLabel='আরেকটু গভীরে — voltage pattern আর "number" এক জিনিস নয়'
          enLabel='go deeper — a voltage pattern is not the number itself'
        >
          {bn ? (
            <div lang="bn" style={{ ...bodyStyle, marginTop: 14 }}>
              {p(<>এখানে <code>2</code>, <code>3</code>, <code>5</code> বললে আমরা আসলে electrical state-এর ওপর একটি human interpretation বসাচ্ছি। যেমন:</>)}
              <Diagram
                art={'0010 → আমরা বলি "2"\n0011 → আমরা বলি "3"\n0101 → আমরা বলি "5"'}
                bnLabel="diagram · pattern → meaning"
                enLabel="diagram · pattern → meaning"
              />
              {p('কিন্তু transistor বা logic gate নিজে "2" বা "5" দেখে না। তার কাছে আছে electrical signal-এর state। একই binary pattern অন্য context-এ instruction, memory address, character, বা অন্য কোনো data-এর অংশও represent করতে পারে।')}
              <p style={{ margin: 0, ...bodyStyle }}>Hardware দেখে electrical state; আমরা সেই state-এর meaning নির্ধারণ করি context অনুযায়ী।</p>
            </div>
          ) : (
            <div style={{ ...bodyStyle, marginTop: 14 }}>
              {p(<>Whenever we write <code>2</code>, <code>3</code>, or <code>5</code> in this article, we are applying a human interpretation to an electrical state. For example:</>)}
              <Diagram
                art={'0010 → we interpret this as "2"\n0011 → we interpret this as "3"\n0101 → we interpret this as "5"'}
                bnLabel="diagram · pattern → meaning"
                enLabel="diagram · pattern → meaning"
              />
              {p('But a transistor or logic gate does not literally see the number "2" or "5." It responds to electrical signal states. The same binary pattern can represent an instruction, a memory address, a character, or some other kind of data depending on context.')}
              <p style={{ margin: 0, ...bodyStyle }}>Hardware deals with electrical states; we assign meaning to those states according to context.</p>
            </div>
          )}
        </Deeper>
      </div>

      {/* ── 01 — ALU ─────────────────────────────────────────────────── */}
      <Section num="01" bnH2="ALU: logic gate থেকে গণিত" enH2="ALU: from logic gates to math">
        {bn ? (
          <div lang="bn" style={bodyStyle}>
            {p('CPU-র execution logic-এর মধ্যে ALU একটি গুরুত্বপূর্ণ অংশ, যেখানে addition, subtraction, bitwise operation এবং বিভিন্ন ধরনের comparison-এর মতো arithmetic/logic operation implement করা হয়।')}
            {p('কিন্তু ALU-র ভেতরে কোনো রহস্যময় বুদ্ধিমত্তা নেই। এটা তৈরি হয়েছে আগের আর্টিকেলে দেখা সেই logic gate-গুলো নিখুঁত বিন্যাসে জোড়া লাগিয়ে।')}
          </div>
        ) : (
          <div style={bodyStyle}>
            {p("The ALU is an important part of the CPU's execution logic, implementing arithmetic and logical operations such as addition, subtraction, bitwise operations, and various forms of comparison.")}
            {p("But there's no mysterious intelligence inside the ALU. It's built by wiring together the logic gates we saw in the previous article.")}
          </div>
        )}

        <Deeper
          bnLabel='আরেকটু গভীরে — ALU কি "চালু" হয়ে তারপর হিসাব করে?'
          enLabel='go deeper — does the ALU "turn on" and then calculate?'
        >
          {bn ? (
            <div lang="bn" style={{ ...bodyStyle, marginTop: 14 }}>
              {p('এখানে একটা mental model পরিষ্কার করে নেওয়া জরুরি।')}
              {p(<>ALU কোনো ছোট calculator-এর মতো নয় যে কেউ তাকে বলল, "এখন যোগ করো", তারপর সে কাজ শুরু করল। ALU-র ভেতরের logic gate-গুলো হলো <Term id="combinational">combinational logic</Term>। অর্থাৎ, তার input-এ যে electrical pattern আছে এবং তার control input-গুলো যে অবস্থায় আছে, তার ভিত্তিতে output স্বাভাবিকভাবেই তৈরি হয়।</>)}
            </div>
          ) : (
            <div style={{ ...bodyStyle, marginTop: 14 }}>
              {p('There is an important mental model to fix here.')}
              {p(<>The ALU is not like a little calculator that waits for someone to tell it, "Now calculate." The logic gates inside the ALU form <Term id="combinational">combinational logic</Term>. That means its output is determined continuously by its current inputs and control signals.</>)}
            </div>
          )}

          <Diagram
            art={ART_COMBINATIONAL}
            bnLabel="diagram · combinational response"
            enLabel="diagram · combinational response"
            bnCaption="কেউ এটাকে trigger করে না — input বদলালেই output বদলায়।"
            enCaption="Nothing triggers this — when the input changes, the output follows."
          />

          {bn ? (
            <div lang="bn" style={bodyStyle}>
              {p(<>Input বদলালে output-ও বদলাতে থাকে। Logic gate-গুলোর মধ্য দিয়ে electrical signal propagate করে এবং অল্প সময়ের মধ্যে নতুন output state-এ settle করে। এখানে এখনো clock-এর কোনো দরকার পড়েনি।</>)}
              {p(<>Clock ALU-কে "এখন হিসাব করো" বলে না। Clock মূলত পরে কোনো storage element — যেমন register — কখন এই calculated value-টাকে গ্রহণ করবে, সেই timing boundary তৈরি করে।</>)}
              {p('এই পার্থক্যটা পুরো CPU বোঝার জন্য খুব গুরুত্বপূর্ণ:')}
              {blockquote(
                <span>
                  Combinational logic হিসাব করে।<br />
                  Registers state ধরে রাখে।<br />
                  Control signal ঠিক করে কীভাবে হিসাব হবে।<br />
                  Clock ঠিক করে কখন নতুন state-টা commit হবে।
                </span>
              )}
            </div>
          ) : (
            <div style={bodyStyle}>
              {p('When the inputs change, the output changes as the electrical signals propagate through the logic gates and settle into a new state. The clock is not required to make the ALU "start calculating."')}
              {p(<>The clock does not tell the ALU, "calculate now." Its main job is to provide timing boundaries for storage elements — such as registers — to capture new values.</>)}
              {p('This distinction is fundamental to understanding a CPU:')}
              {blockquote(
                <span>
                  Combinational logic computes.<br />
                  Registers hold state.<br />
                  Control signals configure the computation.<br />
                  The clock determines when stored state is updated.
                </span>
              )}
            </div>
          )}
        </Deeper>

        {bn ? (
          <div lang="bn" style={bodyStyle}>
            {h3('binary যোগের circuit')}
            {p('দুইটা ১-bit binary সংখ্যা (ধরুন A আর B) যোগ করার circuit কীভাবে বানানো যায়, সেটা একটু দেখা যাক। Binary যোগের নিয়মগুলো সরল:')}
            {pre('0 + 0 = 00\n0 + 1 = 01\n1 + 0 = 01\n1 + 1 = 10  (decimal 2)')}
            {p('খেয়াল করুন:')}
            {ul([
              <><strong>ডানপাশের bit (Sum)</strong> কেবল তখনই ১ হয় যখন A অথবা B-এর যেকোনো একটার মান ১, কিন্তু দুইটাই ১ হলে ০ — ঠিক একটা XOR gate-এর মতো।</>,
              <><strong>বাঁপাশের bit (Carry)</strong> কেবল তখনই ১ হয় যখন A এবং B — দুইটাই ১ — এটা ঠিক AND gate-এর মতো।</>,
            ])}
            {p('XOR আর AND gate পাশাপাশি জোড়া দিলে তৈরি হয় একটা Half Adder। কিন্তু এখানে একটা সমস্যা আছে।')}
            {p('Half Adder শুধু দুটি একক bit যোগ করতে পারে — মানুষ যেমন হাতে একটা "carry" মনে রাখে বড় সংখ্যা যোগ করার সময়, Half Adder সেটা পারে না। তাহলে এটি 1111 + 0001 যোগ করবে কীভাবে?')}
            {p('এই সমস্যার সমাধান হলো Full Adder। একই কাঠামোর সাথে "Carry In" নামে একটা অতিরিক্ত input যোগ করা হয়, যাতে আগের bit-এর carry পরের bit-এ এসে ঢুকতে পারে।')}
            {p('এখন processor-এ ৬৪-bit-এর দুইটা সংখ্যা যোগ করতে চাইলে কী করতে হবে? সহজ বুদ্ধি হলো — এমন ৬৪টি Full Adder একের পর এক সিরিজে জোড়া দেওয়া। একটা ট্রেনের কথা কল্পনা করুন: প্রতিটা বগি একটা Full Adder। প্রথম বগি carry পাঠায় দ্বিতীয় বগিতে, দ্বিতীয়টা তৃতীয়তে — এভাবে ৬৪ নম্বর বগি পর্যন্ত সেই ছোট্ট carry signal দৌড়াতে থাকে। এই নকশাকে বলা হয় Ripple Carry Adder।')}
          </div>
        ) : (
          <div style={bodyStyle}>
            {h3('the circuit for binary addition')}
            {p("Let's see how to build a circuit that adds two 1-bit binary numbers (say, A and B). The rules of binary addition are straightforward:")}
            {pre('0 + 0 = 00\n0 + 1 = 01\n1 + 0 = 01\n1 + 1 = 10  (decimal 2)')}
            {p('Notice the pattern:')}
            {ul([
              <><strong>The right bit (Sum)</strong> is 1 only when either A or B is 1, but 0 when both are 1 — exactly like an XOR gate.</>,
              <><strong>The left bit (Carry)</strong> is 1 only when both A and B are 1 — exactly like an AND gate.</>,
            ])}
            {p("Wire an XOR gate and an AND gate side by side, and you've built a Half Adder. But there's a problem.")}
            {p("A Half Adder can only add two individual bits — when humans add larger numbers, we carry a digit in our head; the Half Adder can't. So how would it handle 1111 + 0001?")}
            {p('The solution is the Full Adder. Same basic structure plus an extra input called "Carry In," which lets the carry from a previous bit feed into the next.')}
            {p('Now if a processor wants to add two 64-bit numbers? Chain 64 Full Adders in series. Imagine a train where each carriage represents a single Full Adder. The first carriage passes its carry bit to the second, the second to the third, and that small signal ripples all the way down to the 64th carriage. This architecture is a Ripple Carry Adder.')}
          </div>
        )}

        <AdderWidget />

        {bn ? (
          <div lang="bn" style={bodyStyle}>
            {blockquote(
              <span>
                <strong>একটা গুরুত্বপূর্ণ নোট:</strong> এই train analogy-টি Ripple Carry Adder-এর mental model হিসেবে খুব ভালো, কিন্তু এটা আধুনিক সব CPU কী করে তার প্রতিনিধিত্ব করে না। Ripple Carry Adder-এ একটি bit-এর carry পরের bit-এ পৌঁছানোর জন্য আগের stage-এর ওপর নির্ভর করতে হয়। তাই bit-এর সংখ্যা বাড়লে worst-case <Term id="propdelay">propagation delay</Term>-ও বাড়ে। এই bottleneck কমানোর জন্য processor design-এ <Term id="cla">Carry-Lookahead</Term>, Prefix এবং অন্যান্য faster adder architecture ব্যবহার করা যেতে পারে — এগুলো carry information এমনভাবে calculate করে যাতে প্রতিটি carry-কে একটির পর একটি stage পেরিয়ে যেতে না হয়।
              </span>
            )}
            {p('তবে মূল ধারণাটা একই থাকে: শেষ পর্যন্ত logic gate-ই এমন একটি circuit তৈরি করে, যা দুইটি binary input এবং তাদের carry information থেকে sum তৈরি করে।')}
          </div>
        ) : (
          <div style={bodyStyle}>
            {blockquote(
              <span>
                <strong>An important hardware note:</strong> The train analogy is excellent as a mental model <em>for a Ripple Carry Adder</em>, but it is not a picture of what every modern CPU does. In a Ripple Carry Adder, each bit's carry depends on the result of the previous stage, so as the number of bits increases the worst-case <Term id="propdelay">propagation delay</Term> increases as well. To reduce this bottleneck, processor designs can use <Term id="cla">Carry-Lookahead</Term>, Prefix, and other faster adder architectures — structures that organize the carry calculation so it does not have to wait for every previous stage in a simple chain.
              </span>
            )}
            {p('The underlying idea remains the same: logic gates are arranged into a circuit that takes binary inputs and carry information and produces the correct sum.')}
          </div>
        )}
      </Section>

      {/* ── 02 — Register ────────────────────────────────────────────── */}
      <Section num="02" bnH2="Register: state কোথায় থাকে" enH2="Register: where state lives">
        {bn ? (
          <div lang="bn" style={bodyStyle}>
            {p('যোগফল তৈরি হলো। কিন্তু এই যোগফলটা রাখা হবে কোথায়?')}
            {p(<>CPU সাধারণত প্রতিটি intermediate value তৈরি হওয়ার সঙ্গে সঙ্গে RAM-এ পাঠিয়ে দেয় না। তার বদলে processor-এর ভেতরে এমন কিছু খুব দ্রুত storage location থাকে যেখানে calculation-এর জন্য প্রয়োজনীয় value রাখা যায়। এগুলোই <Term id="register">register</Term>।</>)}
            {p('Register-কে শুধু "CPU-র নিজের memory" বললে পুরো ব্যাপারটা বোঝা যায় না। আরও ভালো mental model হলো:')}
            {blockquote('Register হলো CPU-র খুব ছোট, খুব দ্রুত state-holding storage।')}
            {p('এখানে operand, address, pointer, intermediate value, এবং অন্যান্য গুরুত্বপূর্ণ processor state রাখা যেতে পারে।')}
            {p(<>RAM-এর তুলনায় register অনেক ছোট এবং CPU-র execution logic-এর খুব কাছাকাছি। তবে শুধু "RAM অনেক দূরে বলে slow" — এভাবে ব্যাপারটা ব্যাখ্যা করা ঠিক নয়। মূল পার্থক্য হলো তাদের storage architecture, size, access mechanism এবং latency।</>)}

            {h3('register আসলে কী?')}
            {p(<><a href="/writing/whats-inside-a-bit" style={{ color: '#00753F' }}>আগের আর্টিকেলে</a> দেখা সেই <Term id="flipflop">flip-flop</Term>-এর কথা মনে আছে? সহজ mental model হিসেবে, একটি register-কে অনেকগুলো 1-bit storage element পাশাপাশি সাজানো হিসেবে ভাবতে পারি। একটি 64-bit register-এ এমন 64টি bit-এর state রাখা যায়।</>)}
          </div>
        ) : (
          <div style={bodyStyle}>
            {p('The sum has been calculated. But where does the result go?')}
            {p(<>A CPU does not normally send every intermediate value straight to RAM. Instead, the processor contains very small, very fast storage locations that can hold values needed during execution. These are <Term id="register">registers</Term>.</>)}
            {p('Calling a register simply "the CPU\'s own memory" is useful, but incomplete. A better mental model is:')}
            {blockquote('A register is a very small, very fast storage element that holds CPU state.')}
            {p('Registers can hold operands, addresses, pointers, intermediate values, and other important processor state.')}
            {p(<>Registers are much smaller than RAM and are tightly integrated with the processor's execution logic. But it would be misleading to explain their speed simply by saying "RAM is far away." The important differences include their storage architecture, size, access mechanism, and latency.</>)}

            {h3('what is a register, really?')}
            {p(<>Remember the <Term id="flipflop">flip-flops</Term> from the <a href="/writing/whats-inside-a-bit" style={{ color: '#00753F' }}>previous article</a>? As a simplified mental model, think of a register as a collection of 1-bit storage elements arranged side by side. A 64-bit register can hold 64 bits of state.</>)}
          </div>
        )}

        <Diagram
          art={ART_REGISTER_64}
          bnLabel="diagram · 64-bit register"
          enLabel="diagram · 64-bit register"
          bnCaption="একটি simplified model — বাস্তব register file এবং তার circuitry আরও জটিল হতে পারে।"
          enCaption="A simplified model — real register files and their circuitry can be considerably more complex."
        />

        {bn ? (
          <div lang="bn" style={bodyStyle}>
            {p(<>বিশ্ববিদ্যালয়ে AX, BX, PC-এর মতো নাম শুনলে register-কে রহস্যময় কোনো বিশেষ hardware মনে হতে পারে। আসলে register হলো CPU-র state রাখার একটি অত্যন্ত গুরুত্বপূর্ণ storage structure। নাম আলাদা, কিন্তু মৌলিক ধারণা হলো — কিছু binary state ধরে রাখা।</>)}
          </div>
        ) : (
          <div style={bodyStyle}>
            {p(<>Names like AX, BX, or PC can make registers sound like mysterious pieces of hardware. They are not. At the fundamental level, a register is a storage structure used to hold binary state that the processor needs to keep.</>)}
          </div>
        )}

        <Deeper
          bnLabel="আরেকটু গভীরে — register-এর জন্য clock লাগে কেন?"
          enLabel="go deeper — why does a register need a clock at all?"
        >
          {bn ? (
            <div lang="bn" style={{ ...bodyStyle, marginTop: 14 }}>
              {p('এখন একটা fundamental distinction করা যাক। MUX বা ALU-এর মতো combinational circuit-এর output মূলত তার বর্তমান input-এর function:')}
            </div>
          ) : (
            <div style={{ ...bodyStyle, marginTop: 14 }}>
              {p('There is a fundamental distinction to make here. For a combinational circuit such as a MUX or ALU, the output is primarily a function of its current inputs:')}
            </div>
          )}

          <Diagram
            art={ART_COMB_VS_SEQ}
            bnLabel="diagram · no memory"
            enLabel="diagram · no memory"
            bnCaption="অতীতের কোনো স্মৃতি নেই — শুধু এই মুহূর্তের input।"
            enCaption="No memory of the past — only the inputs of this moment."
          />

          {bn ? (
            <div lang="bn" style={bodyStyle}>
              {p(<>কিন্তু register-এর কাজ হলো আগের state ধরে রাখা। ধরা যাক Register C-তে <code>0101</code> রাখা আছে। ALU-র input পরে বদলে গেলেও Register C যেন সঙ্গে সঙ্গে তার value বদলে না ফেলে — এটাই storage-এর উদ্দেশ্য।</>)}
              {p('Register-কে তাই এমন timing mechanism দরকার যা বলে দেয় কখন নতুন input গ্রহণ করতে হবে। সেখানেই clocked storage element-এর ধারণা আসে।')}
              {blockquote(
                <span>
                  Combinational logic-এর output input-এর সঙ্গে বদলায়।<br />
                  <Term id="sequential">Sequential</Term>/storage logic-এর state সময়ের সঙ্গে নির্দিষ্ট নিয়মে update হয়।
                </span>
              )}
            </div>
          ) : (
            <div style={bodyStyle}>
              {p(<>A register, however, exists to hold a previous state. Suppose Register C currently contains <code>0101</code>. If the ALU inputs change afterward, Register C should not immediately change just because its input wiring changed. That would defeat the purpose of storage.</>)}
              {p('A register therefore needs a timing mechanism that determines when a new input value should be captured. That is where the idea of a clocked storage element comes in.')}
              {blockquote(
                <span>
                  The output of combinational logic responds to its inputs.<br />
                  The state of <Term id="sequential">sequential</Term>/storage logic is updated according to timing rules.
                </span>
              )}
            </div>
          )}
        </Deeper>

        {bn ? (
          <div lang="bn" style={bodyStyle}>
            {p('নিচের instrument-টা ঠিক এই পার্থক্যটাই হাতে ধরে দেখায় — ALU-র input বদলান, তার output সঙ্গে সঙ্গে বদলাবে; কিন্তু Register C অপেক্ষা করবে clock edge-এর জন্য।')}
          </div>
        ) : (
          <div style={bodyStyle}>
            {p("The instrument below puts that difference in your hands — change the ALU's inputs and its output follows immediately, while Register C waits for a clock edge.")}
          </div>
        )}

        <CombinationalVsClocked />
      </Section>

      {/* ── 03 — Datapath, MUX, decoder ──────────────────────────────── */}
      <Section num="03" bnH2="Datapath, multiplexer, decoder: CPU-র ভেতরের পথ" enH2="Datapath, multiplexers, decoders: the paths inside the CPU">
        {bn ? (
          <div lang="bn" style={bodyStyle}>
            <p style={{ margin: '0 0 16px', fontStyle: 'italic', color: '#5a5444', ...bodyStyle }}>ব্যাখ্যা সহজ রাখার জন্য এখানে কয়েকটা কাল্পনিক register-এর নাম ধরা যাক — Register A, B, C, D। বাস্তব processor-এ এদের নাম অন্যরকম হয়, কিন্তু কাজের ধরন একই।</p>
            {p('এখন আমাদের কাছে register আছে, ALU আছে। কিন্তু Register A-এর value কীভাবে ALU-র input-এ যাবে? আর ALU result কীভাবে Register C-তে যাবে?')}
            {p(<>এখানেই আসে <Term id="datapath">datapath</Term> — CPU-র ভেতরে data যে বিভিন্ন পথ ধরে এক জায়গা থেকে অন্য জায়গায় যায়, সেই পুরো কাঠামো। বাস্তব modern CPU-তে একটিমাত্র central "data bus" ধরে সবকিছু চলাচল করে — এমনটা ধরে নেওয়া ঠিক নয়। অনেক ধরনের internal connection, datapath এবং interconnect থাকতে পারে।</>)}
            {blockquote(<span>একটি CPU-কে 64-bit বলা মানেই তার ভেতরে একটি মাত্র 64-wire data bus আছে — এমন নয়। এখানে বোঝার সুবিধার জন্য আমরা একটি 64-bit-wide datapath ধরে নিচ্ছি, যেখানে 64টি bit parallel-এ represent/transfer করা যায়।</span>)}
          </div>
        ) : (
          <div style={bodyStyle}>
            <p style={{ margin: '0 0 16px', fontStyle: 'italic', color: '#5a5444', ...bodyStyle }}>For simplicity, let's use a few imaginary register names — Register A, B, C, and D. Real CPUs use different naming schemes, but they operate on identical principles.</p>
            {p("We now have registers and an ALU. But how does the value in Register A reach an ALU input? And how does the ALU's result get stored in Register C?")}
            {p(<>This is where the <Term id="datapath">datapath</Term> comes in — the collection of paths through which data moves between different parts of the processor. In a modern CPU, it would be misleading to imagine one giant central "data bus" connecting everything. Real processors contain many internal connections, datapaths, and interconnect structures.</>)}
            {blockquote(<span>Calling a CPU "64-bit" does not mean that it contains one single 64-wire data bus. For simplicity, we'll assume a 64-bit-wide datapath in our model, where 64 bits can be represented or transferred in parallel.</span>)}
          </div>
        )}

        <Diagram
          art={ART_DATAPATH}
          bnLabel="diagram · simplified datapath"
          enLabel="diagram · simplified datapath"
        />

        {bn ? (
          <div lang="bn" style={bodyStyle}>
            {h3('multiplexer (MUX): একটি electronic selector')}
            {p(<>MUX-এর কাজ traffic police-এর মতো অন্য register-কে রাস্তা থেকে সরিয়ে দেওয়া নয়। <Term id="mux">MUX</Term>-এর একাধিক input থাকে এবং একটি output থাকে। Select signal বলে দেয় কোন input-টি output-এ দেখা যাবে।</>)}
          </div>
        ) : (
          <div style={bodyStyle}>
            {h3('multiplexer (MUX): an electronic selector')}
            {p(<>A <Term id="mux">MUX</Term> is not primarily a traffic cop preventing registers from fighting over the same wire. It has multiple inputs and one output. Select signals determine which input is reflected at the output.</>)}
          </div>
        )}

        <Diagram
          art={ART_MUX}
          bnLabel="diagram · 4→1 multiplexer"
          enLabel="diagram · 4→1 multiplexer"
        />

        {bn ? (
          <div lang="bn" style={bodyStyle}>
            {p(<>ধরা যাক select signal বলছে <code>B</code> বেছে নিতে হবে। তাহলে MUX-এর output-এ B-এর বর্তমান bit pattern দেখা যাবে। এখানে MUX-এর ভেতরেই selection-এর logic আছে। Register A, B, C, D সবাই "একই wire-এ নিজেদের data ঠেলে দিচ্ছে" — এমনটা ধরে নেওয়া উচিত নয়।</>)}
            {blockquote(<span>MUX নিজে clock-এর জন্য অপেক্ষা করে না। Select signal বা input বদলালে MUX-এর output-ও propagation delay-এর পর নতুন value-তে settle করে। Clock তার output-কে "চালু" করে না।</span>)}
          </div>
        ) : (
          <div style={bodyStyle}>
            {p(<>If the select signal chooses <code>B</code>, the MUX output represents the current value of B. The selection happens inside the MUX's own logic. We should not imagine Registers A, B, C, and D all trying to push their values onto one physical wire with the MUX stopping them.</>)}
            {blockquote(<span>A MUX does not wait for the clock. If its inputs or select signal change, its output changes after the corresponding propagation delay. The clock does not "activate" the MUX.</span>)}
          </div>
        )}

        <MuxSelector />

        {bn ? (
          <div lang="bn" style={bodyStyle}>
            {h3('decoder: কোন storage location-এ write হবে?')}
            {p(<>এবার ধরা যাক ALU একটি result তৈরি করেছে এবং আমরা চাই সেটি Register C-তে store হোক। একটি simplified register structure ধরে ভাবা যাক — এখানে <Term id="decoder">decoder</Term>-এর কাজ শুরু।</>)}
          </div>
        ) : (
          <div style={bodyStyle}>
            {h3('decoder: deciding which storage location writes the result')}
            {p(<>Now suppose the ALU has produced a result and we want to store it in Register C. Using a simplified register structure, this is where the <Term id="decoder">decoder</Term> does its work.</>)}
          </div>
        )}

        <Diagram
          art={ART_DECODER}
          bnLabel="diagram · decoder → write enable"
          enLabel="diagram · decoder → write enable"
          bnCaption="একটি binary destination code, আর ঠিক একটি active write-enable line।"
          enCaption="One binary destination code in, exactly one active write-enable line out."
        />

        {bn ? (
          <div lang="bn" style={bodyStyle}>
            {p(<>এখানে <code>WE</code> মানে <Term id="writeenable">Write Enable</Term>। Destination field-এ যদি Register C-এর identifier থাকে, decoder সেটিকে এমন control signal-এ পরিণত করতে পারে যাতে Register C-এর write enable active হয় এবং অন্য register-গুলোর write enable inactive থাকে। তারপর যখন clock-এর নির্দিষ্ট edge আসে, Register C input-এ থাকা value-টি capture করতে পারে।</>)}
            {p('এখানে একটা গুরুত্বপূর্ণ distinction আছে:')}
            {blockquote('Decoder result-টাকে physically "একটা দরজা দিয়ে ঢুকিয়ে" C-তে পাঠায় না।')}
            {p(<>বরং result-এর datapath Register C-সহ প্রয়োজনীয় destination register-গুলোর input-এ পৌঁছাতে পারে; decoder/control logic ঠিক করে কোন register সেই value capture করবে। অর্থাৎ:</>)}
          </div>
        ) : (
          <div style={bodyStyle}>
            {p(<>Here, <code>WE</code> means <Term id="writeenable">Write Enable</Term>. If the destination field identifies Register C, decoder/control logic can generate the appropriate write-enable signal so that Register C is allowed to capture the incoming value while the other registers remain disabled. Then, when the appropriate clock edge arrives, Register C can capture the value present at its input.</>)}
            {p('This distinction is important:')}
            {blockquote('The decoder does not physically "open a door" and send the result into Register C.')}
            {p(<>Instead, the datapath can make the ALU result available to the relevant register inputs, while the decoder/control logic determines which register is allowed to capture that value. Conceptually:</>)}
          </div>
        )}

        <Diagram
          art={ART_ONE_ENABLE}
          bnLabel="diagram · এক মান, চার input, এক enable"
          enLabel="diagram · one value, four inputs, one enable"
          bnCaption="শুধু Register C-এর storage element-গুলো নতুন value capture করবে।"
          enCaption="Only Register C's storage elements capture the new value."
        />

        <WriteEnableDecoder />

        {bn ? (
          <div lang="bn" style={bodyStyle}>
            {p('বাস্তব register file আরও sophisticated হতে পারে, কিন্তু এই simplified model-টি একটি গুরুত্বপূর্ণ ধারণা শেখায়:')}
            {blockquote('Datapath value কোথায় যেতে পারে সেটা নির্ধারণ করে; control logic নির্ধারণ করে কোন path/operation/destination ব্যবহার হবে; storage element নির্দিষ্ট timing boundary-তে state ধরে রাখে।')}
          </div>
        ) : (
          <div style={bodyStyle}>
            {p('Real register files can be considerably more sophisticated, but this simplified model teaches an important idea:')}
            {blockquote('The datapath provides possible routes for values. Control logic configures which routes, operations, and destinations are used. Storage elements capture the resulting state at defined timing boundaries.')}
          </div>
        )}
      </Section>

      {/* ── 04 — Clock ───────────────────────────────────────────────── */}
      <Section num="04" bnH2="Clock: CPU-র timing boundary" enH2="Clock: the CPU's timing boundary">
        {bn ? (
          <div lang="bn" style={bodyStyle}>
            {p('এখন পর্যন্ত আমরা দেখলাম:')}
            {ul([
              'logic gate কীভাবে computation তৈরি করে,',
              'ALU কীভাবে সেই computation করে,',
              'register কীভাবে binary state ধরে রাখে,',
              'আর datapath ও control logic কীভাবে ঠিক করে কোন data কোন operation-এর মধ্যে দিয়ে যাবে।',
            ])}
            {p(<>কিন্তু একটা প্রশ্ন রয়ে যায়: কখন একটি নতুন value-কে "officially" state হিসেবে ধরে নেওয়া হবে? এখানেই আসে clock।</>)}
            {p(<>CPU-র clock সাধারণত একটি periodic electrical signal। এটি নির্দিষ্ট rhythm-এ <code>0</code> এবং <code>1</code>-এর মতো state-এর মধ্যে পরিবর্তিত হয়। একটি 3 GHz clock-এর ক্ষেত্রে প্রতি সেকেন্ডে প্রায় 3 billion clock cycle হয়।</>)}
            {p('কিন্তু এখানে একটি খুব গুরুত্বপূর্ণ ভুল ধারণা এড়িয়ে যেতে হবে:')}
            {blockquote('Clock CPU-র প্রতিটি component-কে "এখন কাজ শুরু করো" বলে না।')}
            {p('MUX বা ALU clock-এর tick-এর জন্য অপেক্ষা করে বসে থাকে না। এগুলো combinational logic। Input বা control signal বদলালে তারা electrical signal-এর propagation-এর মাধ্যমে নতুন output তৈরি করে।')}
            {p(<>তাহলে clock করে কী? Clock মূলত CPU-র state change-এর timing framework তৈরি করে। বিশেষ করে register-এর মতো storage element নির্দিষ্ট <Term id="clockedge">clock edge</Term>-এ তাদের input-এর value capture করতে পারে।</>)}
            {p('একটি simplified CPU-কে এভাবে ভাবা যায়:')}
          </div>
        ) : (
          <div style={bodyStyle}>
            {p("So far we've seen:")}
            {ul([
              'how logic gates create computation,',
              'how the ALU performs that computation,',
              'how registers hold binary state,',
              'and how datapath and control logic determine which data goes through which operation.',
            ])}
            {p(<>But one question remains: when does a newly calculated value officially become part of the CPU's state? This is where the clock comes in.</>)}
            {p(<>A CPU clock is generally a periodic electrical signal that changes state at a regular rhythm. A 3 GHz clock corresponds to roughly 3 billion clock cycles per second.</>)}
            {p('But there is a very important misconception to avoid:')}
            {blockquote('The clock does not tell every component, "Start working now."')}
            {p('A MUX or ALU does not sit idle waiting for the next clock tick. They are combinational logic. When their inputs or control signals change, their outputs respond as electrical signals propagate through the circuit.')}
            {p(<>So what does the clock actually do? It provides a timing framework for state changes in the CPU. In particular, storage elements such as registers can capture new values at defined <Term id="clockedge">clock edges</Term>.</>)}
            {p('A simplified CPU can be thought of like this:')}
          </div>
        )}

        <Diagram
          art={ART_STATE_LOOP}
          bnLabel="diagram · state transition loop"
          enLabel="diagram · state transition loop"
          bnCaption="Current state → combinational logic → next state → clock edge → new current state."
          enCaption="Current state → combinational logic → next state → clock edge → new current state."
        />

        {bn ? (
          <div lang="bn" style={bodyStyle}>
            {p('এখানে clock হলো সেই boundary, যেখানে storage element নতুন state capture করার সুযোগ পায়।')}

            {h3('তাহলে clock দরকার কেন?')}
            {p(<>কারণ বাস্তব electronic signal instantaneously এক জায়গা থেকে আরেক জায়গায় পৌঁছায় না। Logic gate-এর মধ্যে <Term id="propdelay">propagation delay</Term> থাকে। একটি বড় combinational circuit-এর input বদলানোর পর তার output-এর প্রতিটি bit একই মুহূর্তে final অবস্থায় পৌঁছাবে — এমন নিশ্চয়তা নেই।</>)}
            {p('ধরা যাক Register A এবং B থেকে ALU-তে data গেল। ALU-র ভেতরের অনেকগুলো gate-এর মধ্য দিয়ে signal propagate করার পর output ধীরে ধীরে একটি stable pattern-এ settle করবে। CPU যদি জানতেই না পারে কখন এই result-টাকে valid ধরে পরের register-এ capture করা নিরাপদ, তাহলে বিভিন্ন অংশের মধ্যে coordination কঠিন হয়ে যায়।')}
            {p('Clock একটি shared timing framework দেয়। একটি simplified synchronous design-এ আমরা বলতে পারি:')}
            <ol style={{ margin: '0 0 20px', paddingLeft: 24, ...bodyStyle }}>
              <li style={{ marginBottom: 8 }}>একটি clock edge-এ register current state capture করে।</li>
              <li style={{ marginBottom: 8 }}>সেই state থেকে combinational logic তার output তৈরি করতে থাকে।</li>
              <li style={{ marginBottom: 8 }}>কিছু সময় পরে output যথেষ্ট stable হয়।</li>
              <li style={{ marginBottom: 8 }}>পরবর্তী clock edge-এ destination register সেই result capture করে।</li>
            </ol>
            {p(<>এই কারণেই clock-কে "CPU-র heartbeat" বলা যায়। Clock নিজে MUX বা ALU-কে চালায় না। বরং এটি পুরো synchronous system-কে একটি common timing reference দেয়। আরেকভাবে বললে:</>)}
            {blockquote(
              <span>
                <Term id="controlsignal">Control logic</Term> ঠিক করে <i>কী</i> হবে।<br />
                Combinational logic সেই operation-এর electrical result তৈরি করে।<br />
                Clock ঠিক করে <i>কখন</i> নতুন state capture করা হবে।
              </span>
            )}
          </div>
        ) : (
          <div style={bodyStyle}>
            {p('The clock provides the boundary at which storage elements can capture the new state.')}

            {h3('why do we need a clock?')}
            {p(<>Because real electrical signals do not travel instantaneously. Logic gates have <Term id="propdelay">propagation delays</Term>. After an input changes, different paths through a combinational circuit may take different amounts of time before their outputs settle.</>)}
            {p('Imagine Register A and Register B feeding an ALU. The signals propagate through many gates inside the ALU before the output settles into the correct pattern representing the result. If the system had no shared notion of when that result should be considered safe to capture, coordinating many state-holding components would be much harder.')}
            {p('A clock provides that shared timing framework. In a simplified synchronous design:')}
            <ol style={{ margin: '0 0 20px', paddingLeft: 24, ...bodyStyle }}>
              <li style={{ marginBottom: 8 }}>A clock edge causes registers to capture the current state.</li>
              <li style={{ marginBottom: 8 }}>That state becomes the input to combinational logic.</li>
              <li style={{ marginBottom: 8 }}>The combinational logic computes and its outputs settle.</li>
              <li style={{ marginBottom: 8 }}>At a later clock edge, destination registers capture the resulting values.</li>
            </ol>
            {p(<>This is why the clock can be called the "heartbeat" of a CPU — but the conductor analogy has limits. The clock does not activate the MUX or ALU. Instead, it provides a common timing reference for the synchronous system. Another useful way to remember it:</>)}
            {blockquote(
              <span>
                <Term id="controlsignal">Control logic</Term> decides WHAT should happen.<br />
                Combinational logic produces the electrical result.<br />
                The clock determines WHEN the new state is captured.
              </span>
            )}
          </div>
        )}

        <ClockVisualizer />

        <Deeper
          bnLabel="আরেকটু গভীরে — clock-এর দুই edge-এর মাঝখানে কী হয়?"
          enLabel="go deeper — what happens between clock edges?"
        >
          {bn ? (
            <div lang="bn" style={{ ...bodyStyle, marginTop: 14 }}>
              {p('এখানে আরেকটি subtle misconception হতে পারে। Clock edge না থাকা মানে CPU-র ভেতরের সব electrical activity বন্ধ হয়ে গেছে — এমন নয়।')}
              {p('Clock edge-এর মাঝখানে combinational circuit তাদের input অনুযায়ী continuously respond করতে পারে। Signal propagate করতে পারে, output change করতে পারে এবং শেষ পর্যন্ত settle করতে পারে। Clock মূলত storage/state update-এর boundary দেয়।')}
            </div>
          ) : (
            <div style={{ ...bodyStyle, marginTop: 14 }}>
              {p('There is another subtle misconception worth addressing. The absence of a clock edge does not mean that all electrical activity inside the CPU stops.')}
              {p('Between clock edges, combinational circuits can continuously respond to their inputs. Signals propagate through the logic, outputs change, and eventually settle into stable patterns. The clock mainly provides the boundary for updating stored state.')}
            </div>
          )}

          <Diagram
            art={ART_BETWEEN_EDGES}
            bnLabel="diagram · দুই edge-এর মাঝখানে"
            enLabel="diagram · between two edges"
          />

          {bn ? (
            <div lang="bn" style={bodyStyle}>
              {p('তাই "clock data-কে এক জায়গা থেকে আরেক জায়গায় ঠেলে দেয়" — এই mental model-টা এড়িয়ে চলাই ভালো। আরও ভালো mental model হলো:')}
              {blockquote('Clock data-কে push করে না; clock বলে দেয় কখন state capture করার সময়।')}
            </div>
          ) : (
            <div style={bodyStyle}>
              {p('So it is better to avoid thinking of the clock as something that "pushes data" from one component to another. A better mental model is:')}
              {blockquote('The clock does not push the data; it provides the moment at which state is captured.')}
            </div>
          )}
        </Deeper>

        <Deeper
          bnLabel="আরেকটু গভীরে — clock speed কি CPU-র speed?"
          enLabel="go deeper — does clock speed mean CPU speed?"
        >
          {bn ? (
            <div lang="bn" style={{ ...bodyStyle, marginTop: 14 }}>
              {p('আংশিকভাবে, কিন্তু পুরোপুরি নয়।')}
              {p('Clock frequency যত বেশি, একটি synchronous design তত বেশি ঘন ঘন state transition করতে পারে — যদি তার combinational logic এবং storage element সেই timing-এর মধ্যে নির্ভরযোগ্যভাবে কাজ করতে পারে।')}
              {p('কিন্তু CPU performance শুধু clock frequency দিয়ে নির্ধারিত হয় না। Architecture, instruction throughput, pipeline depth, cache behavior, memory latency, branch prediction, execution resource এবং আরও অনেক কিছু performance-এ ভূমিকা রাখে। তাই:')}
              {blockquote('বেশি clock frequency মানে বেশি ঘন ঘন timing boundary — কিন্তু বেশি GHz মানেই আনুপাতিকভাবে দ্রুততর CPU নয়।')}
              <p style={{ margin: 0, ...bodyStyle }}>আর clock frequency বাড়ালে সাধারণত power consumption এবং heat management-এর সমস্যাও বাড়তে পারে, যদিও exact relationship processor design-এর ওপর নির্ভর করে।</p>
            </div>
          ) : (
            <div style={{ ...bodyStyle, marginTop: 14 }}>
              {p('Partly, but not by itself.')}
              {p('A higher clock frequency allows a synchronous design to perform state transitions more frequently, provided the combinational logic and storage elements can reliably meet the timing requirements.')}
              {p('But CPU performance is not determined by clock frequency alone. Architecture, instruction throughput, pipeline design, cache behavior, memory latency, branch prediction, execution resources, and many other factors matter. So:')}
              {blockquote('A higher clock frequency can allow more frequent timing boundaries, but a higher GHz number does not automatically make a CPU proportionally faster.')}
              <p style={{ margin: 0, ...bodyStyle }}>Increasing clock frequency can also increase power consumption and thermal demands, although the exact relationship depends heavily on the processor's design.</p>
            </div>
          )}
        </Deeper>
      </Section>

      {/* ── Mental model box ─────────────────────────────────────────── */}
      {mentalModel}

      {/* ── 05 — 2 + 3 = 5 ───────────────────────────────────────────── */}
      <Section num="05" bnH2="২ + ৩ = ৫: প্রসেসরের ভেতরের একটি simplified journey" enH2="2 + 3 = 5: a simplified journey through the processor">
        {bn ? (
          <div lang="bn" style={bodyStyle}>
            {p(<>এবার আমাদের তৈরি করা mental model ব্যবহার করে <code>2 + 3</code>-এর journey দেখি। ধরে নিই:</>)}
            {pre('Register A = 0010   (2)\nRegister B = 0011   (3)')}
            {p('এবং আমাদের লক্ষ্য:')}
            {pre('Register A + Register B → Register C')}

            {h3('১ · current state')}
            {p('এই মুহূর্তে Register A এবং Register B তাদের respective binary value ধরে রেখেছে, আর সেই value registers-এর output-এ available।')}
            {pre('A = 0010\nB = 0011')}

            {h3('২ · control signal operation-টাকে configure করে')}
            {p('CPU-র control logic এমন signal তৈরি করে যাতে:')}
            {pre('MUX 1 → Register A\nMUX 2 → Register B\nALU   → ADD\nDestination → Register C\nWE_C → 1')}
            {p('অর্থাৎ, কোন data ALU-তে যাবে, ALU কী operation করবে এবং result কোন register-এ store হবে — এসব configure করা হলো।')}

            {h3('৩ · MUX ও ALU কাজ করে — clock তাদের "start" করায় না')}
            {p('MUX-গুলো তাদের select signal অনুযায়ী A এবং B-এর value ALU-র input-এ present করে।')}
          </div>
        ) : (
          <div style={bodyStyle}>
            {p(<>Now let's use our mental model to follow <code>2 + 3</code>. Assume:</>)}
            {pre('Register A = 0010   (2)\nRegister B = 0011   (3)')}
            {p('And our goal is:')}
            {pre('Register A + Register B → Register C')}

            {h3('1 · current state')}
            {p("At this moment, Register A and Register B are holding their respective binary values, and those values are available at the registers' outputs.")}
            {pre('A = 0010\nB = 0011')}

            {h3('2 · control signals configure the operation')}
            {p("The CPU's control logic establishes signals such as:")}
            {pre('MUX 1 → Register A\nMUX 2 → Register B\nALU   → ADD\nDestination → Register C\nWE_C → 1')}
            {p('In other words, the control logic configures which data will feed the ALU, which operation the ALU should perform, and which register should receive the result.')}

            {h3('3 · the MUX and ALU respond — the clock does not "start" them')}
            {p('The MUXes select A and B according to their select signals and present those values to the ALU inputs.')}
          </div>
        )}

        <Diagram
          art={ART_OPERANDS}
          bnLabel="diagram · operands reach the ALU"
          enLabel="diagram · operands reach the ALU"
        />

        {bn ? (
          <div lang="bn" style={bodyStyle}>
            {p('ALU-র ভেতরের combinational logic এই input pattern-এর ওপর কাজ করতে থাকে। Signal বিভিন্ন logic gate-এর মধ্য দিয়ে propagate করে এবং propagation delay পেরোনোর পর ALU output settle করে:')}
            {pre('  0010\n+ 0011\n──────\n  0101')}
            {p(<>অর্থাৎ ALU output এখন <code>0101</code>। এখানে clock এসে ALU-কে "যোগ করো" বলেনি। Control signal ALU-কে ADD operation-এর জন্য configure করেছে, আর combinational logic input অনুযায়ী result তৈরি করেছে।</>)}

            {h3('৪ · clock edge: Register C result capture করে')}
            {p('এখন Register C-এর write enable active এবং ALU result তার input-এ available। পরবর্তী appropriate clock edge-এ Register C সেই value capture করে:')}
          </div>
        ) : (
          <div style={bodyStyle}>
            {p('The combinational logic inside the ALU responds to those input patterns. Electrical signals propagate through the logic gates, and after some propagation delay the ALU output settles to:')}
            {pre('  0010\n+ 0011\n──────\n  0101')}
            {p(<>The ALU output is now <code>0101</code>. The clock did not tell the ALU, "Start adding." The control signals configured the ALU for an ADD operation, and the combinational logic produced the result from its inputs.</>)}

            {h3('4 · clock edge: Register C captures the result')}
            {p("Now the ALU result is available at Register C's input, and Register C's write enable is active. At the appropriate clock edge, Register C captures that value:")}
          </div>
        )}

        <Diagram
          art={ART_CAPTURE}
          bnLabel="diagram · capture"
          enLabel="diagram · capture"
          bnCaption="এই মুহূর্তে result CPU-র stored state-এর অংশ হয়ে গেল।"
          enCaption="The result has now become part of the CPU's stored state."
        />

        <CPUDatapath />

        {bn ? (
          <div lang="bn" style={bodyStyle}>
            {h3('পুরো ব্যাপারটাকে এক লাইনে')}
          </div>
        ) : (
          <div style={bodyStyle}>
            {h3('the whole process in one line')}
          </div>
        )}

        <Diagram
          art={ART_ONE_LINE}
          bnLabel="flow · এক লাইনে"
          enLabel="flow · in one line"
        />

        {bn ? (
          <div lang="bn" style={bodyStyle}>
            {p('এখানে সবচেয়ে গুরুত্বপূর্ণ বিষয় হলো:')}
            {blockquote(
              <span>
                Clock MUX-কে চালু করেনি।<br />
                Clock ALU-কে হিসাব শুরু করতে বলেনি।<br />
                Clock data-কে ঠেলে Register C-তে পাঠায়নি।
              </span>
            )}
            {p('বরং MUX এবং ALU তাদের input/control signal অনুযায়ী continuously respond করেছে। Clock শুধু একটি নির্দিষ্ট timing boundary দিয়েছে যেখানে Register C result-টিকে capture করতে পারে। এটাই synchronous digital logic বোঝার সবচেয়ে গুরুত্বপূর্ণ mental model-গুলোর একটি।')}
          </div>
        ) : (
          <div style={bodyStyle}>
            {p('The most important point is this:')}
            {blockquote(
              <span>
                The clock did not activate the MUX.<br />
                The clock did not tell the ALU to start calculating.<br />
                The clock did not physically push the data into Register C.
              </span>
            )}
            {p('The MUX and ALU continuously respond to their inputs and control signals. The clock provides a defined timing boundary at which Register C can capture the result. This is one of the most important mental models for understanding synchronous digital logic.')}
          </div>
        )}

        <Deeper
          bnLabel='আরেকটু গভীরে — আর "কয়েক nanosecond"-এর গল্প?'
          enLabel='go deeper — what about the "few nanoseconds" story?'
        >
          {bn ? (
            <div lang="bn" style={{ ...bodyStyle, marginTop: 14 }}>
              <p style={{ margin: 0, ...bodyStyle }}>এই simplified datapath-এ combinational logic-এর output-কে পরবর্তী clock edge-এর আগে যথেষ্ট stable হতে হবে। বাস্তব processor-এ instruction execution আরও অনেক stage, pipeline এবং timing constraint-এর মধ্যে ঘটে। তাই এখানে আমাদের উদ্দেশ্য exact latency দাবি করা নয় — উদ্দেশ্য হলো hardware-এর state, combinational computation এবং clocked state transition-এর সম্পর্ক বোঝা।</p>
            </div>
          ) : (
            <div style={{ ...bodyStyle, marginTop: 14 }}>
              <p style={{ margin: 0, ...bodyStyle }}>In this simplified datapath, the combinational logic must produce a stable enough result before the destination register's capture edge. Real processors execute instructions through much more complicated pipelines, timing constraints, and execution units. So the purpose of this example is not to claim an exact latency — it is to understand the relationship between stored state, combinational computation, and clocked state transitions.</p>
            </div>
          )}
        </Deeper>
      </Section>

      {/* ── 06 — Reality corner ──────────────────────────────────────── */}
      <Section num="06" bnH2="সবকিছু এত সরল নয়" enH2="Reality corner">
        {bn ? (
          <div lang="bn" style={bodyStyle}>
            {p('এই আর্টিকেলে CPU-কে ইচ্ছাকৃতভাবে অনেক সহজ করে দেখানো হয়েছে।')}
            {p('বাস্তব processor-এ pipeline, cache hierarchy, branch prediction, out-of-order execution, multiple execution unit, register renaming, sophisticated interconnect এবং আরও অনেক mechanism থাকে। একটি modern CPU একই সময়ে একাধিক instruction-এর বিভিন্ন stage নিয়ে কাজ করতে পারে — ফলে "একটি instruction → একটি ALU calculation → একটি clock tick" এমন সরল model বাস্তব CPU-র ক্ষেত্রে যথেষ্ট নয়।')}
            {p(<>এখানে আমরা বরং একটি conceptual synchronous datapath ব্যবহার করেছি — নিচের চারটি মৌলিক ধারণা পরিষ্কার করার জন্য, বাস্তব CPU-র পুরো ছবি আঁকার জন্য নয়। এবং এটাই এই model-এর শক্তি: বাস্তব CPU-র complexity এই basic idea-গুলোকে বাতিল করে না, বরং এগুলোর ওপরেই অনেক বেশি sophisticated structure তৈরি করে।</>)}
          </div>
        ) : (
          <div style={bodyStyle}>
            {p('We deliberately simplified the CPU in this article.')}
            {p('Real processors contain pipelines, cache hierarchies, branch prediction, out-of-order execution, multiple execution units, register renaming, sophisticated interconnects, and many other mechanisms. A modern CPU can have multiple instructions in different stages at the same time — so the simple model of "one instruction → one ALU calculation → one clock tick" is not an accurate description of a modern processor.')}
            {p(<>Instead, we have used a conceptual synchronous datapath — built to establish the four fundamental ideas below, not to draw the full picture of a real processor. And that is the strength of the model: the complexity of a modern CPU does not replace these basic ideas, it builds much more sophisticated structures on top of them.</>)}
          </div>
        )}

        <Recap>
          {bn ? (
            <>
              <li>CPU "গণিত বোঝে" না — hardware-এর গণিতের অর্থ বোঝার দরকার নেই, তার physical structure-ই সংশ্লিষ্ট logical transformation-টা implement করে। আমরা সেই electrical pattern-কে number ও operation হিসেবে interpret করি।</li>
              <li>Combinational logic হিসাব করে; registers state ধরে রাখে — ALU ও MUX-এর মতো circuit input ও control signal অনুযায়ী output তৈরি করে; register সেই state ধরে রাখে।</li>
              <li>Control logic ঠিক করে কী হবে; clock ঠিক করে কখন state update হবে — Clock MUX বা ALU-কে "start" করায় না, এটি storage element-এর state capture করার timing boundary দেয়।</li>
              <li>MUX হলো electronic selector — অনেক input-এর মধ্যে select signal অনুযায়ী একটি input output-এ পাঠায়।</li>
              <li>Decoder/control logic destination নির্ধারণে সাহায্য করে — result-কে কোনো physical "door" দিয়ে Register C-তে ঢোকানোর বদলে, এটি ঠিক করে কোন register নতুন value capture করবে।</li>
              <li>CPU-র ভেতরে একটিমাত্র universal data bus আছে — এমন নয়। বাস্তব processor-এ অনেক ধরনের datapath ও interconnect থাকতে পারে; এখানে বোঝার সুবিধার জন্য simplified datapath ব্যবহার করা হয়েছে।</li>
              <li>সবচেয়ে গুরুত্বপূর্ণ mental model: Current State → Combinational Logic → Next State → Clock Edge → New Current State।</li>
            </>
          ) : (
            <>
              <li>The CPU does not "understand" mathematics — the hardware doesn't need to understand what mathematics means, its physical structure implements the corresponding logical transformation. We interpret those electrical patterns as numbers and operations.</li>
              <li>Combinational logic computes; registers hold state — circuits such as MUXes and ALUs respond to their current inputs and control signals, while registers hold state across clock cycles.</li>
              <li>Control logic decides WHAT happens; the clock determines WHEN state is updated — the clock does not tell the MUX or ALU to start working, it provides the timing boundary at which storage elements capture new state.</li>
              <li>A MUX is an electronic selector — it selects one of several inputs according to its select signals and presents that input at its output.</li>
              <li>Decoder/control logic helps determine the destination — it does not send a result through a "door" into Register C, it enables the appropriate register to capture the result.</li>
              <li>A CPU does not necessarily contain one universal internal data bus. Real processors can contain many datapaths and interconnect structures; this article uses a simplified one to make the concept easier to see.</li>
              <li>The most important mental model: Current State → Combinational Logic → Next State → Clock Edge → New Current State.</li>
            </>
          )}
        </Recap>
      </Section>

      <RelayNav
        hub={SERIES_HUB_CARD}
        next={{ label: { bn: 'baton পরের পর্বে', en: 'baton to the next leg' }, title: bn ? '০৪ — হার্টবিট: Fetch-Decode-Execute' : '04 — Heartbeat: Fetch-Decode-Execute', href: '/writing/heartbeat-fde', variant: 'next' }}
        bridge={{
          bn: 'একটা বড় প্রশ্ন এখনো বাকি। এই article-এ আমরা ধরে নিয়েছিলাম control logic ইতিমধ্যেই জানে — MUX কোনটা বাছবে, ALU কী operation করবে, result কোন register-এ যাবে। কিন্তু এই control signal-গুলো তৈরি হলো কীভাবে? উত্তরটা লুকিয়ে আছে instruction-এর bit-এর মধ্যে। Instruction কোথা থেকে আসে, memory-তে কীভাবে থাকে, আর CPU কীভাবে সেই bit-কে control signal-এ রূপ দেয় — এখান থেকেই শুরু fetch → decode → execute।',
          en: "One major question is still unanswered. In this article we assumed the control logic already knew which input the MUX should select, which operation the ALU should perform, and which register should receive the result. But how were those control signals generated? The answer is encoded in the bits of an instruction. Where that instruction comes from, how it sits in memory, and how the CPU turns its bits into control signals — that is where fetch → decode → execute begins.",
        }}
      />
      <Colophon />
    </article>
  );
}
