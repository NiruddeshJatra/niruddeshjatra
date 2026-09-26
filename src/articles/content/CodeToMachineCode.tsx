import { Section } from '../primitives/Section';
import { Term } from '../primitives/Term';
import { Deeper } from '../primitives/Deeper';
import { Diagram } from '../primitives/Diagram';
import { Recap } from '../primitives/Recap';
import { RelayNav, SERIES_HUB_CARD } from '../primitives/RelayNav';
import { Colophon } from '../primitives/Colophon';
import { useProse, LINK, WELL, mono as MONO } from '../primitives/useProse';
import { TwoStrategies } from '../widgets/TwoStrategies';
import { MiddleLayer } from '../widgets/MiddleLayer';
import { HotPath } from '../widgets/HotPath';
import { CompilePipeline } from '../widgets/CompilePipeline';

/* ── shared flow art, identical in both languages ─────────────────────── */

const ART_RUNTIME = `Source code
     ↓
  parsing / internal representation
     ↓
  bytecode                      ← in many systems
     ↓
  interpretation
     ↓
  runtime information
     ↓
  JIT compilation               ← where it pays off
     ↓
  native machine code
     ↓
   CPU`;

const ART_JAVA = `Java source
     ↓
  Java bytecode  (.class)
     ↓
    JVM
     ↓
  execution`;

const ART_AOT = `Source code
     ↓
  compiler
     ↓
  assembly / object code
     ↓
  linking
     ↓
  native executable
     ↓
   CPU`;

export function CodeToMachineCode() {
  const { bn, body, p, lead, ul, box, shell } = useProse();

  return (
    <article style={{ marginTop: 40, fontSize: '16.5px', lineHeight: 1.9 }}>
      {/* Hook */}
      <div>
        {bn ? (
          <div lang="bn" style={body}>
            {p('আপনি লিখলেন:')}
          </div>
        ) : (
          <div style={body}>
            {p('You wrote:')}
          </div>
        )}

        {/* hello.js snippet */}
        <div style={{ margin: '0 0 20px', background: '#1b231b', border: '1px solid #4a493a', overflow: 'hidden', boxShadow: '0 10px 28px rgba(20,18,10,0.28)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 14px', background: '#232b23', borderBottom: '1px solid #2e392e' }}>
            <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#ff6b6b', display: 'block' }} />
            <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#e0c264', display: 'block' }} />
            <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#00d26a', display: 'block' }} />
            <span style={{ fontFamily: "'Departure Mono',monospace", fontSize: 11, color: '#8aa893', marginLeft: 8 }}>hello.js</span>
          </div>
          <div style={{ fontFamily: "'Departure Mono',monospace", fontSize: 12.5, lineHeight: 1.9, padding: '12px 18px', color: '#cfe8d8', whiteSpace: 'pre', overflowX: 'auto' }}>
            <span style={{ color: '#7fae94' }}>const</span> x = <span style={{ color: '#d8c88a' }}>5</span> + <span style={{ color: '#d8c88a' }}>3</span>;{'\n'}
            console.<span style={{ color: '#9fd8b8' }}>log</span>(x);
          </div>
        </div>

        {bn ? (
          <div lang="bn" style={body}>
            {p(<>Node চালালেন। Screen-এ {MONO('8')} দেখলেন।</>)}
            {p(<>কিন্তু আগের আর্টিকেলগুলোতে দেখেছি — CPU JavaScript বোঝে না। CPU শেষ পর্যন্ত যে instruction চালায়, সেগুলো তার <strong>machine code</strong>-এর অংশ — memory-তে থাকা bit pattern, byte-এর ধারা। মানুষকে দেখানোর সুবিধার জন্য আমরা সেই byte-গুলো প্রায়ই <a href="/writing/heartbeat-fde" style={LINK}>hexadecimal</a>-এ লিখি। যেমন x86-এর কিছু machine-code byte দেখতে এমন হতে পারে:</>)}
            <div style={WELL}>89 E5 83 EC 10 C7 45 FC ...</div>
            {p(<>এখানে {MONO('89')}, {MONO('E5')} — এগুলো hexadecimal-এ লেখা byte। <strong>Hexadecimal নিজে CPU-র ভাষা নয়</strong>, শুধু আমাদের লেখার notation।</>)}
            {p('তাহলে মাঝখানে কী ঘটল? আপনার লেখা text কীভাবে এমন একটা রূপে পৌঁছাল, যেখান থেকে CPU শেষ পর্যন্ত machine instruction চালাতে পারে?')}
            {p('এটাই আজকের গল্প।')}
            {box('// একটা কথা আগে বলে রাখি', <>
              <p style={{ margin: '0 0 12px', ...body }}>এই সিরিজে এতদিন <a href="/writing/cpu-blueprint" style={LINK}>hardware</a> আর <a href="/writing/os-grand-conductor" style={LINK}>OS</a> দেখা হয়েছে। এই আর্টিকেল-এ software-এর একটা special layer দেখব — যেটা "translator" হিসেবে কাজ করে।</p>
              <p style={{ margin: '0 0 12px', ...body }}>মূল প্রশ্ন সহজ: মানুষ যা লেখে (JavaScript, Python, C) আর CPU যা চালায় (machine code) — এই দুইটার মাঝে অনুবাদ কে করে, আর কখন করে?</p>
              <p style={{ margin: 0, ...body }}>আজকে সেই অনুবাদকদের গল্প।</p>
            </>)}
          </div>
        ) : (
          <div style={body}>
            {p(<>Ran Node. Saw {MONO('8')} on screen.</>)}
            {p(<>But we've seen in earlier articles — the CPU doesn't understand JavaScript. What it ultimately executes belongs to its <strong>machine code</strong> — bit patterns in memory, sequences of bytes. For our own convenience we usually write those bytes in <a href="/writing/heartbeat-fde" style={LINK}>hexadecimal</a>. Some x86 machine-code bytes might look like this:</>)}
            <div style={WELL}>89 E5 83 EC 10 C7 45 FC ...</div>
            {p(<>Those {MONO('89')} and {MONO('E5')} are bytes written in hexadecimal. <strong>Hexadecimal isn't the CPU's language</strong> — it's our notation for writing those bytes down.</>)}
            {p('So what happened in between? How did the text you wrote reach a form the CPU can eventually execute as machine instructions?')}
            {p("That's today's story.")}
            {box('// one thing to clear up first', <>
              <p style={{ margin: '0 0 12px', ...body }}>This series has covered <a href="/writing/cpu-blueprint" style={LINK}>hardware</a> and the <a href="/writing/os-grand-conductor" style={LINK}>OS</a> so far. In this article we look at a special layer of software — one that works as a translator.</p>
              <p style={{ margin: '0 0 12px', ...body }}>The core question is simple: what people write (JavaScript, Python, C) and what the CPU executes (machine code) — who translates between them, and when?</p>
              <p style={{ margin: 0, ...body }}>Today, the story of those translators.</p>
            </>)}
          </div>
        )}
      </div>

      <Section num="01" bnH2="প্রথম কথা: মাঝখানে একটা machinery লাগবেই" enH2="First thing: something has to carry code toward the CPU">
        {bn ? (
          <div lang="bn" style={body}>
            {p('একটা foreign language বই পড়তে চাইলে কোনো না কোনোভাবে ভাষাটা বুঝতে হবে। Computer-এর ক্ষেত্রেও তেমনই। আপনি JavaScript, Python বা C-তে source code লিখেছেন; CPU সেই text সরাসরি চালাতে পারে না। মাঝখানে এমন software machinery দরকার, যা সেই code-কে CPU-র চালানোর মতো রূপে নিয়ে যাবে। এই machinery নিজেও program — CPU-তেই চলে।')}
            {p('কিন্তু কাজটা সব ভাষায়, সব implementation-এ একইভাবে হয় না। কেউ পুরো বইটা আগেই অনুবাদ করে ছাপিয়ে রাখে। কেউ meeting চলার সময় অনুবাদ করে। কেউ আগে একটা common intermediate ভাষায় নামিয়ে দেয়, তারপর সেই ভাষা-জানা একজন reader সেটা চালায়। আর কেউ চলতে চলতে খেয়াল করে কোন অংশ বারবার আসছে, আর সেটুকুর জন্য দ্রুততর অনুবাদ বানিয়ে ফেলে।')}
            {lead(<>এই approach-গুলোই আমরা দেখব:</>)}
            {ul([
              <><strong><Term id="compiler">Compiler</Term>:</strong> চালানোর আগেই source code process করে executable/native রূপ তৈরি করতে পারে (C, Go, Rust)।</>,
              <><strong><Term id="interpreter">Interpreter</Term>:</strong> runtime-এ source বা তার কোনো intermediate representation execute করে (Python, Bash)।</>,
              <><strong><Term id="bytecode">Bytecode</Term> + <Term id="vm">VM</Term>:</strong> প্রথমে একটা intermediate form-এ নামানো হয়, তারপর সেটা VM-এর মাধ্যমে চলে (Java, Python, C#)।</>,
              <><strong><Term id="jit">JIT</Term> (Just-In-Time):</strong> program চলার সময়কার information দেখে কিছু অংশ machine code-এ compile করে (V8, HotSpot)।</>,
            ])}
            {p(<>এখানেই একটা কথা গোড়াতেই বলে রাখা ভালো: <strong>"compiled" আর "interpreted" কোনো ভাষার স্থায়ী পরিচয় নয় — এগুলো বলে দেয় একটা নির্দিষ্ট implementation কীভাবে code চালায়।</strong> এই কথাটা শেষ section-এ কাজে লাগবে।</>)}
            {p('একটা একটা করে দেখা যাক।')}
          </div>
        ) : (
          <div style={body}>
            {p("If you want to read a book in a foreign language, the language has to be understood somehow. Computers are the same. You write source code in JavaScript, Python or C; the CPU cannot execute that text directly. Some software machinery has to carry it to a form the CPU can run — and that machinery is itself a program, running on the CPU.")}
            {p('But the work is not done the same way in every language or every implementation. Someone translates the whole book ahead of time and prints it. Someone translates while the meeting is happening. Someone first brings everything down to a common intermediate language, and a reader who knows that language runs it. And someone notices, mid-meeting, which phrases keep coming back, and prepares a faster translation for those.')}
            {lead(<>The approaches we'll look at:</>)}
            {ul([
              <><strong><Term id="compiler">Compiler</Term>:</strong> processes source code before execution and can produce an executable/native form (C, Go, Rust).</>,
              <><strong><Term id="interpreter">Interpreter</Term>:</strong> executes source code, or an intermediate representation of it, at runtime (Python, Bash).</>,
              <><strong><Term id="bytecode">Bytecode</Term> + <Term id="vm">VM</Term>:</strong> code drops to an intermediate form first, then runs through a virtual machine (Java, Python, C#).</>,
              <><strong><Term id="jit">JIT</Term> (Just-In-Time):</strong> compiles selected code into machine code during execution, using what the running program reveals (V8, HotSpot).</>,
            ])}
            {p(<>One thing is worth saying up front: <strong>"compiled" and "interpreted" are not permanent properties of a language — they describe how a particular implementation executes it.</strong> That will matter in the last section.</>)}
            {p("Let's take them one at a time.")}
          </div>
        )}
      </Section>

      <Section num="02" bnH2="Compiler: আগে থেকে অনুবাদক" enH2="Compiler: the ahead-of-time translator">
        {bn ? (
          <div lang="bn" style={body}>
            {p(<>Compiler এমন একটা program যেটা চালানোর আগেই source code process করে এমন একটা executable রূপ তৈরি করে, যা পরে target machine-এ চালানো যায়। এই process-এর নাম <strong>compilation</strong>।</>)}
            {p('কল্পনা করুন একজন professional book translator। সে পুরো বাংলা বই আগে থেকেই অনুবাদ করে ইংরেজি version ছাপিয়ে দেয়। এরপর যে পড়বে, তাকে পাশে একজন অনুবাদক নিয়ে বসতে হবে না।')}
            {p(<>Compiler-এর basic idea-টাও এমন। আপনি C-তে লিখলেন {MONO('hello.c')}, তারপর চালালেন:</>)}
            {shell('gcc hello.c -o hello')}
            {p(<>এখানে একটা ছোট clarification দরকার। {MONO('gcc')} command-টা এক ধাপের কোনো জাদু নয় — ভেতরে সাধারণত কয়েকটা ধাপ আছে: preprocessing, compilation, assembly, তারপর linking। শেষে গিয়ে {MONO('hello')} নামের native executable তৈরি হয়।</>)}
            {p(<>এরপর {MONO('./hello')} চালালে source code আবার নতুন করে compile করতে হয় না — CPU সরাসরি সেই তৈরি হয়ে থাকা machine instruction চালায়।</>)}
            <p style={{ margin: '0 0 6px', ...body }}><strong>সুবিধা:</strong></p>
            {ul([
              <>Source থেকে native-এ যাওয়ার মূল কাজটা প্রতিবার চালানোর সময় আবার করতে হয় না।</>,
              'Compile করার সময় compiler পুরো code বিশ্লেষণ করতে পারে, তাই optimization-এর অনেক সুযোগ পায়।',
              'Native executable distribute করা যায় source code ছাড়াই।',
            ])}
            <p style={{ margin: '0 0 6px', ...body }}><strong>অসুবিধা:</strong></p>
            {ul([
              'Source বদলালে updated executable পেতে আবার কিছু compilation লাগে — তবে build system চাইলে শুধু বদলে যাওয়া অংশটুকুই rebuild করতে পারে।',
              'Native executable একটা নির্দিষ্ট পরিবেশের জন্য তৈরি — CPU architecture, operating system আর binary convention, সবই compatibility-তে জড়িত।',
              'Compile time-এ অনেক ভুল ধরা পড়ে, কিন্তু সব runtime behavior আগেই জানা সম্ভব নয়।',
            ])}
            {p('C, Go, Rust — এদের সাধারণ ব্যবহারে native executable-এর জন্য compile করা হয়। এই article-এ আমরা সেই common model-টাই ধরছি।')}
          </div>
        ) : (
          <div style={body}>
            {p(<>A compiler is a program that processes source code before execution and produces an executable form that can later run on the target machine. The process is called <strong>compilation</strong>.</>)}
            {p('Picture a professional book translator. They translate the whole book ahead of time and print an English version. From then on, readers do not need a translator sitting beside them.')}
            {p(<>That's the basic idea. You write {MONO('hello.c')} in C, then run:</>)}
            {shell('gcc hello.c -o hello')}
            {p(<>One clarification matters here. The {MONO('gcc')} command isn't a single magical step — under it sit several stages: preprocessing, compilation, assembly, then linking. What comes out at the end is a native executable named {MONO('hello')}.</>)}
            {p(<>Run {MONO('./hello')} afterwards and the source doesn't have to be compiled again — the CPU executes machine instructions that already exist.</>)}
            <p style={{ margin: '0 0 6px', ...body }}><strong>Advantages:</strong></p>
            {ul([
              'The main source-to-native translation does not have to be repeated every time the program starts.',
              'The compiler can analyse the code during compilation, which opens up many optimizations.',
              'Native executables can be distributed without shipping the source.',
            ])}
            <p style={{ margin: '0 0 6px', ...body }}><strong>Disadvantages:</strong></p>
            {ul([
              'After changing the source, some compilation work is needed for an updated executable — though build systems can rebuild only the parts that changed.',
              'A native executable targets a particular environment. CPU architecture, operating system and binary conventions all affect compatibility.',
              'Many errors are caught before execution, but not every runtime behaviour can be known in advance.',
            ])}
            {p('C, Go and Rust are commonly used through native compilation. That is the model we are assuming here.')}
          </div>
        )}
      </Section>

      <Section num="03" bnH2="Interpreter: চলতে চলতে অনুবাদ" enH2="Interpreter: translating as it runs">
        {bn ? (
          <div lang="bn" style={body}>
            {p('Interpreter আগে থেকে পুরো program-এর native executable বানিয়ে রাখে না। বরং program চালানোর সময়েই source code বা তার কোনো internal রূপ process করে execution এগিয়ে নেয়।')}
            {p('কল্পনা করুন UN meeting-এর live translator। সে আগে থেকে কোনো বই ছাপায়নি; meeting চলাকালীনই কথাগুলো অন্য ভাষায় পৌঁছে দিচ্ছে।')}
            {p(<>তবে analogy-টা এক জায়গায় থামানো দরকার। <strong>Interpreter মানেই "একটা করে source line পড়ে, সেটা অনুবাদ করে, চালায়, তারপর পরের line" — এমন নয়।</strong> অনেক interpreter আগে পুরো source parse করে একটা internal representation বানিয়ে নেয়, তারপর সেই representation চালায়। সেই representation নিজেই bytecode হতে পারে।</>)}
            {p(<>Python-এ {MONO('python hello.py')} চালালে ঠিক এটাই হয় — CPython source থেকে bytecode তৈরি করে, তারপর সেই bytecode চালায়। ({MONO('.pyc')} file-এ সেই bytecode cache-ও থাকতে পারে — পরের section-এ সে গল্প।)</>)}
            <p style={{ margin: '0 0 6px', ...body }}><strong>সুবিধা:</strong></p>
            {ul([
              'আলাদা native executable আগে থেকে না বানিয়েই code চালানো যায় — লিখলেন, চালালেন।',
              'একই source বিভিন্ন platform-এ চলে, যদি সেখানে উপযুক্ত runtime থাকে।',
              'Runtime-এর তথ্য হাতে থাকায় dynamic behavior সামলানো সহজ।',
            ])}
            <p style={{ margin: '0 0 6px', ...body }}><strong>অসুবিধা:</strong></p>
            {ul([
              'Execution-এর কিছু কাজ runtime-এ করতে হয়, তাই আগে থেকেই তৈরি native code চালানোর তুলনায় overhead থাকতে পারে।',
              'Target machine-এ উপযুক্ত runtime থাকা লাগে — শুধু code পাঠালেই হয় না।',
              'একই কাজ বারবার হলে interpreter-এর dispatch আর runtime check-এর খরচ জমতে থাকে।',
            ])}
            {p(<><strong>আর "interpreter মানেই ধীর" — এটাও কোনো নিয়ম নয়।</strong> Modern interpreter অনেক optimized হতে পারে, আর তার ওপর JIT যোগ হলে ঘন ঘন চলা code আরও দ্রুত হয়ে যেতে পারে। সেই গল্প একটু পরেই।</>)}
            {p('নিচের যন্ত্রে একই ছোট program দুই কৌশলে চালিয়ে দেখুন — একদিকে আগেই একবার অনুবাদ, অন্যদিকে প্রতি run-এ আবার:')}
          </div>
        ) : (
          <div style={body}>
            {p("An interpreter doesn't build a complete native executable ahead of time. Instead, while the program runs, it processes the source code — or some internal form of it — and carries execution forward.")}
            {p('Picture a live translator at a UN meeting. Nothing was printed as a book beforehand; the translation happens while the meeting is going on.')}
            {p(<>But the analogy needs one stop sign. <strong>Interpreter does not necessarily mean "read one source line, translate it, execute it, move to the next."</strong> Many interpreters parse the whole source into an internal representation first, then execute that representation. And that representation may itself be bytecode.</>)}
            {p(<>Running {MONO('python hello.py')} does exactly this — CPython turns the source into bytecode and executes that. (It can cache the bytecode in {MONO('.pyc')} files too, which is the next section's story.)</>)}
            <p style={{ margin: '0 0 6px', ...body }}><strong>Advantages:</strong></p>
            {ul([
              'Code runs without first producing a separate native executable — write it, run it.',
              'The same source runs on different platforms, wherever a compatible runtime exists.',
              'Having runtime information at hand makes dynamic behaviour easier to support.',
            ])}
            <p style={{ margin: '0 0 6px', ...body }}><strong>Disadvantages:</strong></p>
            {ul([
              'Some execution work happens at runtime, which can cost more than running native code that already exists.',
              'A compatible runtime has to be present on the target machine — shipping the code alone is not enough.',
              'Repeated interpreter dispatch and runtime checks add up in code that runs over and over.',
            ])}
            {p(<><strong>And "interpreter means slow" is not a rule either.</strong> Modern interpreters can be heavily optimized, and with a JIT on top, frequently executed code can get much faster. That story is coming shortly.</>)}
            {p('Run the same little program under both strategies below — translated once up front on one side, re-translated every run on the other:')}
          </div>
        )}
        <TwoStrategies />
      </Section>

      <Section num="04" bnH2="দুটোর মাঝামাঝি: Bytecode + Virtual Machine" enH2="The middle ground: Bytecode + Virtual Machine">
        {bn ? (
          <div lang="bn" style={body}>
            {p(<>Source code সরাসরি native machine code-এ না গিয়ে আগে একটা <strong>intermediate representation</strong>-এ নামতে পারে — যাকে বলে <Term id="bytecode">bytecode</Term>। Bytecode মানুষের source code-এর চেয়ে নিচের স্তরের, কিন্তু সাধারণত কোনো নির্দিষ্ট CPU-র native machine code নয়।</>)}
            {p(<>এই bytecode চালানোর জন্য থাকে একটা <Term id="vm">virtual machine (VM)</Term> — software-এ তৈরি একটা execution environment, যে জানে এই নির্দিষ্ট bytecode কীভাবে চালাতে হয়। (VirtualBox-এর মতো পুরো virtual computer-এর কথা এখানে বলা হচ্ছে না; সেটা আলাদা জিনিস।)</>)}
            {p('কল্পনা করুন — বাংলা বইটাকে সরাসরি ইংরেজিতে অনুবাদ না করে Esperanto-র মতো একটা common intermediate ভাষায় নামানো হলো। এখন যেকোনো জায়গার পাঠক সেটা পড়তে পারবেন, যদি তাঁর কাছে Esperanto-জানা একজন reader থাকে।')}
            {p(<>Java-র বিখ্যাত slogan মনে আছে? "Write once, run anywhere।" পথটা এমন:</>)}
            <Diagram art={ART_JAVA} bnLabel="java-র পথ" enLabel="the java path" />
            {p(<>উপযুক্ত JVM থাকলে একই bytecode Windows, Linux, Mac — সবখানেই চলে।</>)}
            {p(<>তবে VM চিরকাল শুধু bytecode interpret করবে, এমন কোনো বাধ্যবাধকতা নেই। Runtime চাইলে সেই bytecode-এর কিছু অংশ পরে machine code-এ compile-ও করতে পারে। এখানেই এই model-এর সঙ্গে JIT-এর যোগসূত্র।</>)}
            {p(<>Python-ও এই পথেই হাঁটে। আমি অনেক দিন Python-কে pure interpreted ভাষা মনে করতাম। যতদিন না একদিন project folder-এ {MONO('__pycache__')} folder দেখলাম — ভেতরে অনেকগুলো {MONO('.pyc')} file। ভাবলাম, "এগুলো কী?" খুঁজে বার করলাম — CPython source code থেকে bytecode তৈরি করে, সেই bytecode cache করে রাখে, আর সেটাই চালায়।</>)}
            {p(<>এখানে পার্থক্যটা সূক্ষ্ম কিন্তু গুরুত্বপূর্ণ: <strong>"compile হয়েছে" মানেই "native machine code-এ compile হয়েছে" নয়।</strong> Python-এর ক্ষেত্রে compile হয়েছে bytecode পর্যন্ত, তারপর সেটা VM চালায়।</>)}
            {p('তাহলে "Python compiled না interpreted?" — উত্তরটা implementation-এর ওপর নির্ভর করে। CPython bytecode বানিয়ে সেটা চালায়; PyPy-র মতো অন্য implementation আবার JIT compilation-ও ব্যবহার করে।')}
            {p('নিচের যন্ত্রে source থেকে bytecode থেকে VM — মাঝের স্তরটা এক ধাপ এক ধাপ করে দেখুন:')}
          </div>
        ) : (
          <div style={body}>
            {p(<>Instead of going straight from source code to native machine code, code can first drop into an <strong>intermediate representation</strong> called <Term id="bytecode">bytecode</Term>. Bytecode sits below human-readable source, but it is usually not the native machine code of any particular CPU.</>)}
            {p(<>Running that bytecode is the job of a <Term id="vm">virtual machine (VM)</Term> — a software execution environment that knows how to execute this particular bytecode. (Not a whole virtual computer like VirtualBox; that's a different concept.)</>)}
            {p('Picture this — instead of translating the Bangla book into English, you bring it down to a common intermediate language such as Esperanto. Now a reader anywhere can read it, as long as they have a reader that understands Esperanto.')}
            {p(<>Remember Java's famous slogan? "Write once, run anywhere." The path looks like this:</>)}
            <Diagram art={ART_JAVA} bnLabel="java-র পথ" enLabel="the java path" />
            {p(<>With a compatible JVM installed, the same bytecode runs on Windows, Linux and Mac.</>)}
            {p(<>But nothing forces a VM to interpret bytecode forever. The runtime may later compile parts of that bytecode into machine code — which is exactly where this model meets JIT compilation.</>)}
            {p(<>Python walks the same path. For a long time I thought Python was a purely interpreted language. Then one day I noticed a {MONO('__pycache__')} folder in a project directory, full of {MONO('.pyc')} files. "What are these?" I looked it up — CPython compiles source into bytecode, caches that bytecode, and executes it.</>)}
            {p(<>The distinction here is subtle but important: <strong>"it was compiled" doesn't have to mean "compiled to native machine code."</strong> In Python's case the compilation stops at bytecode, and a VM takes it from there.</>)}
            {p('So, "is Python compiled or interpreted?" — the answer depends on the implementation. CPython produces bytecode and executes it; other implementations such as PyPy add JIT compilation.')}
            {p('Step through the middle layer below — source to bytecode to VM:')}
          </div>
        )}
        <MiddleLayer />
      </Section>

      <Section num="05" bnH2="JIT: চলতে চলতে compile" enH2="JIT: compiling while it runs">
        {bn ? (
          <div lang="bn" style={body}>
            {p('Bytecode + VM model-এ execution শুরু হতে পারে interpreter দিয়ে। কিন্তু program-এর কোনো অংশ যদি বারবার চলে, প্রতিবার একই interpretation overhead দেওয়াটা অপচয়।')}
            {p(<>এখানেই আসে <strong><Term id="jit">JIT</Term> (Just-In-Time compilation)</strong>। একে "smart interpreter" ভাবার চেয়ে ভাবুন <strong>program চলার মাঝখানেই চলতে থাকা একটা compiler</strong> হিসেবে — যে interpreter-কে সরিয়ে দেয় না, বরং তার পাশে বসে কাজ করে।</>)}
            {p('Program চলার সময় সে তথ্য জমায় — কোন function বা loop কতবার চলছে, কী ধরনের value নিয়ে চলছে, behavior কেমন। কোনো অংশ যথেষ্ট "hot" হলে (ঘন ঘন execute হচ্ছে) সে সেই অংশের জন্য machine code তৈরি করতে পারে, আর পরের বার সেই compiled রূপটাই চলে।')}
            {p('কল্পনা করুন — একজন live translator শুরুতে সব বাক্য অনুবাদ করছে। কিন্তু কয়েকটা phrase বারবার আসছে ("Ladies and gentlemen", "As I was saying")। কয়েকবার শোনার পর সে সেই phrase-এর জন্য একটা তৈরি অনুবাদ হাতে রেখে দিল। এখন সেটা শুনলেই সঙ্গে সঙ্গে বলে দেয়। JIT-এর "hot code" ধরার intuition-টা ঠিক এমন।')}
            {p(<>তবে JIT-এর বানানো machine code চিরস্থায়ী নয়। Optimizer runtime-এর কিছু অনুমানের ওপর ভিত্তি করে optimize করে; পরে সেই অনুমান ভুল প্রমাণিত হলে engine সেই optimized code ছেড়ে অন্য execution path-এ ফিরে যেতে পারে। এই কারণেই JIT-কে <strong>adaptive optimization</strong> হিসেবে ভাবা যায়।</>)}
            {p('')}
            {p('এখানে Trade-off আছে — compilation নিজেই CPU time খায়, optimized code memory-ও নেয়। কিন্তু দীর্ঘক্ষণ চলা, বারবার execute হওয়া code-এ সেই বিনিয়োগ পরে পুষিয়ে যায়।')}
            {p(<>নিচের যন্ত্রে loop চালান — দেখুন কখন {MONO('square()')} "hot" ধরা পড়ে আর compiled native-এ পরিণত হয়:</>)}
          </div>
        ) : (
          <div style={body}>
            {p("In the bytecode + VM model, execution can start out through an interpreter. But if part of a program runs over and over, paying the same interpretation overhead every single time is waste.")}
            {p(<>This is where <strong><Term id="jit">JIT</Term> (Just-In-Time compilation)</strong> comes in. Rather than a "smart interpreter," think of it as <strong>a compiler that runs during program execution</strong> — not a replacement for the interpreter, but something working alongside it.</>)}
            {p('While the program runs it gathers information — which functions or loops run often, what kinds of values they see, how the code behaves. When something is hot enough, it can compile that code into machine code, and later calls can use the compiled version.')}
            {p('Picture this — a live translator starts out translating every sentence. But some phrases keep repeating ("Ladies and gentlemen," "As I was saying"). After hearing them a few times, the translator keeps a ready-made translation at hand and delivers it instantly. That is the "hot code" intuition behind a JIT.')}
            {p(<>The machine code a JIT produces isn't permanent, though. The optimizer makes assumptions based on what it observed at runtime; if those assumptions stop holding, the engine can leave the optimized version and continue along another execution path. Which is why JIT compilation is better thought of as <strong>adaptive optimization</strong>.</>)}
            {p('There is a trade-off — compilation itself costs CPU time, and optimized code costs memory. But for long-running, frequently executed code, that investment pays back later.')}
            {p(<>Run the loop below — watch when {MONO('square()')} is detected as "hot" and turns into compiled native code:</>)}
          </div>
        )}
        <HotPath />
      </Section>

      <Section num="06" bnH2="যখন আপনি node hello.js চালান" enH2="When you run node hello.js">
        {bn ? (
          <div lang="bn" style={body}>{p('এবার সব একসাথে করে দেখা যাক। একটা CPU-heavy example নিলাম, যাতে JIT-এর ভূমিকাটা পরিষ্কার হয়:')}</div>
        ) : (
          <div style={body}>{p("Let's put it all together, with a CPU-heavy example so the JIT's role is easier to see:")}</div>
        )}

        {/* square() code block */}
        <div style={{ margin: '0 0 20px', background: '#1b231b', border: '1px solid #4a493a', overflow: 'hidden', boxShadow: '0 10px 28px rgba(20,18,10,0.28)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 14px', background: '#232b23', borderBottom: '1px solid #2e392e' }}>
            <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#ff6b6b', display: 'block' }} />
            <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#e0c264', display: 'block' }} />
            <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#00d26a', display: 'block' }} />
            <span style={{ fontFamily: "'Departure Mono',monospace", fontSize: 11, color: '#8aa893', marginLeft: 8 }}>hello.js</span>
            <span style={{ flex: 1 }} />
            <span style={{ fontFamily: "'Departure Mono',monospace", fontSize: 10, color: '#55695a' }}>JS</span>
          </div>
          <div style={{ display: 'flex', fontFamily: "'Departure Mono',monospace", fontSize: 12.5, lineHeight: 1.9, overflowX: 'auto' }}>
            <div aria-hidden="true" style={{ flex: 'none', textAlign: 'right', color: '#455545', padding: '12px 12px', borderRight: '1px solid #2e392e', userSelect: 'none', whiteSpace: 'pre' }}>{'1\n2\n3\n4\n5\n6\n7\n8\n9'}</div>
            <div style={{ margin: 0, padding: '12px 18px', color: '#cfe8d8', whiteSpace: 'pre' }}>
              <span style={{ color: '#7fae94' }}>function</span> <span style={{ color: '#9fd8b8' }}>square</span>(x) {'{'}{'\n'}
              {'  '}<span style={{ color: '#7fae94' }}>return</span> x * x;{'\n'}
              {'}'}{'\n\n'}
              <span style={{ color: '#7fae94' }}>let</span> total = <span style={{ color: '#d8c88a' }}>0</span>;{'\n'}
              <span style={{ color: '#7fae94' }}>for</span> (<span style={{ color: '#7fae94' }}>let</span> i = <span style={{ color: '#d8c88a' }}>0</span>; i &lt; <span style={{ color: '#d8c88a' }}>1000000</span>; i++) {'{'}{'\n'}
              {'  '}total += <span style={{ color: '#9fd8b8' }}>square</span>(i);{'\n'}
              {'}'}{'\n'}
              console.<span style={{ color: '#9fd8b8' }}>log</span>(total);
            </div>
          </div>
        </div>

        {bn ? (
          <div lang="bn" style={body}>
            {p(<>{MONO('node hello.js')} চালালেন। V8-এর আসল execution pipeline এর চেয়ে জটিল, আর version ভেদে বদলায়ও — তাই নিচেরটা <strong>একটা simplified mental model</strong>, কোনো instruction-by-instruction trace নয়:</>)}
            {ul([
              'Node চালু হয় আর V8 engine load করে।',
              <>V8 source parse করে তার গঠন বোঝে — সেই গঠনের রূপটাই <Term id="ast">AST</Term>।</>,
              'সেই representation থেকে V8 bytecode তৈরি করতে পারে।',
              'Execution শুরু হয় interpreter-এর মাধ্যমে।',
              'চলার সময় V8 code-এর behavior নিয়ে তথ্য জমায়।',
              <>কোনো function বা loop যথেষ্ট hot আর optimization-উপযোগী হলে V8 তার জন্য compiled machine code তৈরি করতে পারে ({MONO('square()')} আর loop body — দুটোই এই পথে যেতে পারে)।</>,
              'পরের execution সেই compiled রূপ ব্যবহার করতে পারে; আর optimization-এর অনুমান ভেঙে গেলে আবার অন্য path-এ ফিরে যেতে পারে।',
            ])}
          </div>
        ) : (
          <div style={body}>
            {p(<>You run {MONO('node hello.js')}. V8's real pipeline is more complex than this and changes between versions, so what follows is <strong>a simplified mental model</strong>, not an instruction-by-instruction trace:</>)}
            {ul([
              'Node starts and loads the V8 engine.',
              <>V8 parses the source and works out its structure — that structure is the <Term id="ast">AST</Term>.</>,
              'From that representation, V8 can generate bytecode.',
              'Execution begins through the interpreter.',
              'As it runs, V8 gathers information about how the code behaves.',
              <>If a function or loop becomes hot enough and looks optimizable, V8 can produce compiled machine code for it (both {MONO('square()')} and the loop body can take this route).</>,
              'Later execution can use that compiled version — and if the assumptions behind it stop holding, execution can fall back to another path.',
            ])}
          </div>
        )}
        <CompilePipeline />
        {bn ? (
          <div lang="bn" style={body}>
            {p('পুরোটা conceptually এভাবে সাজানো যায়:')}
            <Diagram art={ART_RUNTIME} bnLabel="runtime path" enLabel="runtime path" />
            {p(<>একটা কথা মনে রাখা জরুরি — <strong>JIT মানে "JavaScript C হয়ে যাওয়া" নয়।</strong> এর মানে হলো, runtime যেখানে লাভ দেখে, সেখানে JavaScript-এর execution-এর কিছু অংশ native machine instruction-এ পরিণত হয়। ঠিক কখন, কোন অংশে, কতটা — সেটা input, runtime behavior আর engine version-এর ওপর নির্ভর করে। "ঠিক ১০০০ বার call হলেই compile হবে" জাতীয় কোনো fixed নিয়ম নেই।</>)}
            {p('এই পুরো process আপনার কাছে invisible। আপনি শুধু output দেখছেন।')}
          </div>
        ) : (
          <div style={body}>
            {p('Conceptually the whole thing lines up like this:')}
            <Diagram art={ART_RUNTIME} bnLabel="runtime path" enLabel="runtime path" />
            {p(<>One thing is worth holding onto — <strong>JIT is not "JavaScript becoming C."</strong> It means that where the runtime sees a benefit, part of JavaScript's execution gets turned into native machine instructions. Exactly when, for which code, and how far depends on the input, the runtime behaviour and the engine version. There is no fixed rule like "after exactly 1,000 calls it compiles."</>)}
            {p('The whole process is invisible to you. You just see the output.')}
          </div>
        )}
      </Section>

      <Section num="07" bnH2="আধুনিক জটিলতা: সীমানা মুছে যাচ্ছে" enH2="Modern complexity: the boundaries are dissolving">
        {bn ? (
          <div lang="bn" style={body}>
            {p('এবার একটা গুরুত্বপূর্ণ conclusion-এ আসা যাক। আমরা প্রায়ই বলি — "C compiled language", "Python interpreted language", "JavaScript interpreted language"। Beginner-এর জন্য এই label-গুলো কাজে দেয়, কিন্তু এগুলো ভাষার স্থায়ী পরিচয় নয়। একই ভাষার ভিন্ন implementation ভিন্ন execution strategy ব্যবহার করতে পারে।')}
          </div>
        ) : (
          <div style={body}>
            {p('Now for an important conclusion. We often say — "C is a compiled language," "Python is an interpreted language," "JavaScript is an interpreted language." Those labels are useful beginner shorthand, but they are not permanent properties of the languages. Different implementations of the same language can use entirely different execution strategies.')}
          </div>
        )}

        {/* Language table */}
        <div style={{ border: '1px solid #c9bda0', background: 'rgba(255,252,243,0.65)', margin: '0 0 20px', overflowX: 'auto' }}>
          <table style={{ borderCollapse: 'collapse', width: '100%', fontFamily: "'Departure Mono',monospace", fontSize: 12, color: '#33301F', minWidth: 420 }}>
            <thead>
              <tr>
                {(bn ? ['ভাষা', 'কীভাবে চলে'] : ['LANGUAGE', 'HOW IT RUNS']).map((h) => (
                  <th key={h} style={{ textAlign: 'left', padding: '10px 14px', borderBottom: '1px solid #26241C', fontWeight: 400, color: '#5c5442', letterSpacing: '0.06em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(bn
                ? [
                  ['Python', 'CPython source → bytecode, তারপর সেই bytecode execute করে। PyPy আবার JIT compilation যোগ করে।'],
                  ['JavaScript', 'V8-এর মতো engine bytecode/interpreter-এর সঙ্গে একাধিক compilation tier ব্যবহার করে।'],
                  ['Java', 'Source → JVM bytecode; JVM সেটা execute করে আর runtime-এ JIT-compile করতে পারে।'],
                  ['C#', 'Source সাধারণত intermediate representation-এ compile হয়, .NET runtime সেটা execute/JIT করে।'],
                  ['C, Go, Rust', 'সাধারণ ব্যবহারে ahead-of-time compilation — native machine code তৈরি হয়।'],
                ]
                : [
                  ['Python', 'CPython turns source into bytecode and executes it. PyPy adds JIT compilation on top.'],
                  ['JavaScript', 'Engines such as V8 combine bytecode/interpreter execution with several compilation tiers.'],
                  ['Java', 'Source → JVM bytecode; the JVM executes it and can JIT-compile it at runtime.'],
                  ['C#', 'Source is commonly compiled to an intermediate representation that the .NET runtime executes and JIT-compiles.'],
                  ['C, Go, Rust', 'Commonly ahead-of-time compilation, producing native machine code.'],
                ]
              ).map(([lang, how]) => (
                <tr key={lang}>
                  <td style={{ padding: '8px 14px', borderBottom: '1px solid #c9bda0', color: '#00753F', whiteSpace: 'nowrap' }}>{lang}</td>
                  <td style={{ padding: '8px 14px', borderBottom: '1px solid #c9bda0' }}>{how}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {bn ? (
          <div lang="bn" style={body}>
            {lead(<>তাই "এটা compiled না interpreted?" প্রশ্নের চেয়ে বেশি কাজে দেয় এই প্রশ্নটা — <strong>এই implementation code-টা আসলে কীভাবে চালায়?</strong> সেখান থেকে যা জানতে চাই:</>)}
            {ul([
              'Native code কি আগে থেকেই তৈরি হচ্ছে?',
              'মাঝখানে কোনো intermediate representation আছে?',
              'Interpreter আছে?',
              'JIT compilation আছে?',
              'Runtime-এর তথ্য কি optimization-এ কাজে লাগানো হচ্ছে?',
            ])}
            {p('দুই প্রান্তের দুটো সাধারণ পথ পাশাপাশি রাখলে ছবিটা পরিষ্কার হয় — একদিকে runtime-নির্ভর পথ, অন্যদিকে C-র চেনা AOT পথ:')}
            <Diagram art={ART_AOT} bnLabel="ahead-of-time path" enLabel="ahead-of-time path" />
            {p('আর practical প্রশ্নগুলো তো থেকেই যায় — startup দ্রুত দরকার, নাকি দীর্ঘক্ষণ চলা কাজে গতি? একটা portable binary চাই, নাকি এমন কিছু যা runtime থাকলেই সব platform-এ চলবে?')}
          </div>
        ) : (
          <div style={body}>
            {lead(<>So a more useful question than "is it compiled or interpreted?" is — <strong>how does this particular implementation execute the code?</strong> From there, the things worth asking:</>)}
            {ul([
              'Is native code produced ahead of time?',
              'Is there an intermediate representation in the middle?',
              'Is there an interpreter?',
              'Is there JIT compilation?',
              'Is runtime information used for optimization?',
            ])}
            {p("Putting the two common paths side by side makes it clearer — the runtime-driven path above, and C's familiar ahead-of-time path here:")}
            <Diagram art={ART_AOT} bnLabel="ahead-of-time path" enLabel="ahead-of-time path" />
            {p('And the practical questions remain — do you need fast startup, or speed in long-running work? A portable binary, or something that runs anywhere a runtime exists?')}
          </div>
        )}

        <Recap>
          {bn ? (
            <>
              <li><strong>Machine code আর hexadecimal এক জিনিস নয়।</strong> Machine code হলো CPU-র executable instruction-এর encoding; hexadecimal সেই byte-গুলো মানুষের লেখার notation।</li>
              <li><strong>Compiler চালানোর আগেই code process করে executable/native রূপ তৈরি করতে পারে।</strong></li>
              <li><strong>Interpreter runtime-এ source বা intermediate representation চালায়</strong> — "line ধরে ধরে source অনুবাদ" এর একমাত্র অর্থ নয়।</li>
              <li><strong>Bytecode হলো source আর native machine code-এর মাঝের একটা intermediate representation,</strong> আর VM হলো সেই bytecode চালানোর software environment।</li>
              <li><strong>JIT হলো program চলার মাঝখানে চলা compiler</strong> — runtime-এর তথ্য দেখে যেখানে লাভ, সেখানে machine code তৈরি করে; সেই optimization চিরস্থায়ীও নয়।</li>
              <li><strong>Compiled বনাম interpreted একটা implementation strategy</strong>, কোনো ভাষার স্থায়ী পরিচয় নয়।</li>
            </>
          ) : (
            <>
              <li><strong>Machine code and hexadecimal are not the same thing.</strong> Machine code is the encoding of the CPU's executable instructions; hexadecimal is how we write those bytes down.</li>
              <li><strong>A compiler can process code ahead of execution and produce an executable/native form.</strong></li>
              <li><strong>An interpreter executes source or an intermediate representation at runtime</strong> — it does not have to mean translating source line by line.</li>
              <li><strong>Bytecode is an intermediate representation between source and native machine code,</strong> and a VM is the software environment that executes it.</li>
              <li><strong>A JIT is a compiler that runs during execution</strong> — using runtime information to generate machine code where it pays off, and that optimization isn't permanent either.</li>
              <li><strong>Compiled vs interpreted describes an implementation strategy</strong>, not a permanent identity of a language.</li>
            </>
          )}
        </Recap>
      </Section>

      <RelayNav
        hub={SERIES_HUB_CARD}
        next={{ label: { bn: 'baton পরের পর্বে', en: 'baton to the next leg' }, title: bn ? '০৮ — কীপ্রেস থেকে স্ক্রিন' : '08 — From keypress to screen', href: '/writing/from-keypress-to-screen', variant: 'next' }}
        bridge={{
          bn: "Article 1 থেকে এখান পর্যন্ত — voltage থেকে JIT compilation পর্যন্ত — সব দেখা হলো। কিন্তু এই সিরিজের একটা মূল প্রশ্ন এখনো ঝুলে আছে। প্রথম আর্টিকেলে জিজ্ঞেস করেছিলাম — x = 5 লিখলে কী হয়? এখন জানি। আজ শেষ প্রশ্ন — আপনি keyboard-এ 'A' চাপলেন, screen-এ 'A' এল। মাঝখানে কী কী ঘটল? এই সিরিজের প্রতিটা আর্টিকেলের সব concept ব্যবহার করে সেই journey-টা দেখব। এই সিরিজের payoff, final article।",
          en: "From Article 1 to here — from voltage to JIT compilation — we've covered everything. But one core question of this series is still hanging. In the first article I asked — what happens when you write x = 5? Now we know. Today, the last question — you press 'A' on your keyboard, 'A' appears on screen. What happened in between? We'll walk through that journey using every concept from this series. The payoff of this series, the final article.",
        }}
      />
      <Colophon />
    </article>
  );
}
