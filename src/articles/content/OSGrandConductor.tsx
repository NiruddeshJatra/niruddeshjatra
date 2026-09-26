import type { ReactNode } from 'react';
import { useLang } from '../context/LanguageContext';
import { Section } from '../primitives/Section';
import { Term } from '../primitives/Term';
import { Deeper } from '../primitives/Deeper';
import { Diagram } from '../primitives/Diagram';
import { Recap } from '../primitives/Recap';
import { RelayNav, SERIES_HUB_CARD } from '../primitives/RelayNav';
import { Colophon } from '../primitives/Colophon';
import { ProcessAnatomy } from '../widgets/ProcessAnatomy';
import { ContextSwitch } from '../widgets/ContextSwitch';
import { Scheduler } from '../widgets/Scheduler';
import { MMUTranslator } from '../widgets/MMUTranslator';
import { SyscallDoorway } from '../widgets/SyscallDoorway';
import { KeypressRelay } from '../widgets/KeypressRelay';

const LINK: React.CSSProperties = { color: '#00753F' };
const MONO = (s: string) => <span style={{ fontFamily: "'Departure Mono',monospace", fontSize: '0.85em' }}>{s}</span>;

/* ── shared flow art, identical in both languages ─────────────────────── */

const ART_SWITCH = `current thread's execution state
              ↓
            saved
              ↓
other thread's saved state
              ↓
           restored
              ↓
       execution resumes`;

const ART_MAP = `Process A
virtual address 100
        ↓
physical location X

Process B
virtual address 100
        ↓
physical location Y`;

const ART_VM = `Virtual Memory
├── address space abstraction
├── protection / isolation
├── virtual → physical mapping
└── other mechanisms

Swap
└── one mechanism: move memory contents
    out to secondary storage`;

const ART_SYSCALL = `Application
    ↓
library / API function
    ↓
system call interface
    ↓
kernel
    ↓
requested operation
    ↓
result
    ↓
Application`;

const ART_THREADS = `Process
├── Thread A → own stack + execution state
├── Thread B → own stack + execution state
└── Thread C → own stack + execution state

shared between them:
virtual address space
files and other process resources`;

const ART_KEYPRESS = `Keyboard
   ↓
input controller
   ↓
interrupt / input event
   ↓
kernel + device driver
   ↓
input subsystem
   ↓
window system → focused application
   ↓
application updates its state
   ↓
rendering / graphics system
   ↓
display`;

export function OSGrandConductor() {
  const { bn } = useLang();

  const body: React.CSSProperties = bn
    ? { fontFamily: "'Anek Bangla','Anek Latin',sans-serif" }
    : { fontFamily: "'Anek Latin',sans-serif" };

  const p = (s: ReactNode) => <p style={{ margin: '0 0 16px', ...body }}>{s}</p>;
  const ul = (items: ReactNode[]) => (
    <ul style={{ margin: '0 0 16px', paddingLeft: 22, lineHeight: 1.9, ...body }}>
      {items.map((item, i) => <li key={i} style={{ marginBottom: 8 }}>{item}</li>)}
    </ul>
  );
  const quote = (s: ReactNode) => (
    <blockquote style={{ margin: '0 0 20px', padding: '12px 18px', borderLeft: '3px solid #c9bda0', background: 'rgba(255,252,243,0.5)', color: '#3c382b', ...body }}>
      {s}
    </blockquote>
  );
  const box = (label: string, children: ReactNode) => (
    <div style={{ border: '1px solid #c9bda0', background: 'rgba(255,252,243,0.65)', padding: '14px 18px', margin: '0 0 16px' }}>
      <div style={{ fontFamily: "'Departure Mono',monospace", fontSize: 11.5, color: '#00753F', letterSpacing: '0.08em', marginBottom: 8 }}>{label}</div>
      <div style={{ margin: 0, fontSize: 15.5, ...body }}>{children}</div>
    </div>
  );
  const h3 = (s: string) => (
    <h3 style={{ fontFamily: "'Departure Mono',monospace", fontSize: 13, letterSpacing: '0.08em', color: '#5a5444', margin: '30px 0 14px' }}>{s}</h3>
  );

  return (
    <article style={{ marginTop: 40, fontSize: '16.5px', lineHeight: 1.9 }}>
      {/* Hook */}
      <div>
        {bn ? (
          <div lang="bn" style={body}>
            {p('আপনার laptop-এ এই মুহূর্তে কতগুলো program চলছে?')}
            {p('সহজে যা মনে পড়ে — browser, code editor, terminal, Spotify। কিন্তু task manager বা system monitor খুলে দেখলে দেখা যায়, এর বাইরেও অনেক process আর background task চলছে। ')}
            {p('কিন্তু laptop-এ কি ততগুলো CPU core আছে? না। হাতে গোনা কয়েকটা। আর প্রতিটা core একই সময়ে সীমিত সংখ্যক instruction stream চালাতে পারে।')}
            {p('তাহলে এতগুলো program একসাথে চলে কীভাবে?')}
            {p(<> মূল কৌশলের নাম < strong > concurrency</strong>। CPU খুব দ্রুত বিভিন্ন runnable কাজের মধ্যে সময় ভাগ করে দেয় — এত দ্রুত যে আপনার চোখে "একসাথে" মনে হয়। আর একাধিক core থাকলে কিছু কাজ সত্যিই একই সময়ে চলে।</>)}
            {p(<>এই ভাগাভাগির পুরো ব্যবস্থাপনা যে করে, সে আপনার laptop-এর সবচেয়ে গুরুত্বপূর্ণ software — <strong>Operating System</strong>। আর সে শুধু CPU ভাগ করে না। Memory, file, device, network access, permission — এসবও application-গুলোর মধ্যে managed আর isolated রাখে।</>)}
            {p('আজকের গল্প OS-কে ঘিরে।')}
            {box('// একটা কথা আগে বলে রাখি', <>
              <p style={{ margin: '0 0 12px', ...body }}>এই সিরিজে এতদিন সব কথা ছিল hardware নিয়ে। Transistor, gate, CPU, register, <a href="/writing/memory-hierarchy" style={LINK}>cache, RAM</a>। আজ প্রথম software-এর দুনিয়ায় পা রাখা।</p>
              <p style={{ margin: '0 0 12px', ...body }}>কিন্তু এই software সাধারণ কোনো app না। Operating System এমন একটা system software, যেটা hardware-এর resource পরিচালনা করে আর application-কে সেগুলো ব্যবহারের জন্য abstraction ও controlled access দেয়। Linux, Windows, macOS, Android, iOS — এদের implementation আলাদা, কিন্তু কাজের তালিকা মোটামুটি একই: process আর thread management, memory management, device management, filesystem, networking, protection।</p>
            </>)}
            <p style={{ margin: '0 0 8px', ...body }}>আজকে যেসব প্রশ্নের উত্তর খুঁজব:</p>
            {ul([
              'অনেকগুলো program বা thread কীভাবে সীমিত CPU resource ভাগ করে নেয়?',
              'একটা program-এর memory অন্য program থেকে আলাদা থাকে কীভাবে?',
              'আপনার লেখা app hardware-এ সরাসরি access পায় না, তাহলে file বা network ব্যবহার করে কীভাবে?',
            ])}
          </div>
        ) : (
          <div style={body}>
            {p("How many programs are running on your laptop right now?")}
            {p("The easy answer — browser, code editor, terminal, Spotify. But open a task manager or system monitor and you'll find many more processes and background tasks. System services, background sync, notification handlers — all of it.")}
            {p("But does your laptop have that many CPU cores? No. It has a handful. And each core can run only a limited number of instruction streams at any one moment.")}
            {p("So how do all these programs run at the same time?")}
            {p(<>The main trick is <strong>concurrency</strong>. The CPU divides its time among the runnable work, switching fast enough that it feels simultaneous to you. And with several cores, some of that work really does happen at the same time.</>)}
            {p(<>Managing all that sharing is the job of the most important software on your laptop — the <strong>Operating System</strong>. And it shares far more than the CPU: memory, files, devices, network access, permissions, all kept managed and isolated between applications.</>)}
            {p("That's today's story.")}
            {box('// the first software', <>
              <p style={{ margin: '0 0 12px', ...body }}>Everything so far in this series has been about hardware. Transistors, gates, CPU, registers, <a href="/writing/memory-hierarchy" style={LINK}>cache, RAM</a>. Today we step into the world of software for the first time.</p>
              <p style={{ margin: '0 0 12px', ...body }}>But this isn't ordinary software. An operating system is system software that manages the hardware's resources and gives applications an abstraction over them, plus controlled access to them. Linux, Windows, macOS, Android, iOS — the implementations differ, but the job list is broadly the same: process and thread management, memory management, device management, filesystems, networking, protection.</p>
            </>)}
            <p style={{ margin: '0 0 8px', ...body }}>Today's questions:</p>
            {ul([
              'How do many programs and threads share a limited amount of CPU?',
              "How does one program's memory stay separate from another's?",
              "Why can't your app touch hardware directly, and how does it use files and the network then?",
            ])}
          </div>
        )
        }
      </div >

      <Section num="01" bnH2="Program আর Process — এক জিনিস না" enH2="Program vs Process — Not the Same Thing">
        {bn ? (
          <div lang="bn" style={body}>
            {p('শুরুতেই একটা distinction পরিষ্কার করে নেওয়া দরকার। এই দুইটা শব্দ প্রায়ই মিশিয়ে ব্যবহার হয়, কিন্তু আসলে দুই জিনিস।')}
            {p(<><strong>Program</strong> হলো instruction আর data-র একটা নিষ্ক্রিয় বর্ণনা — যেমন disk-এ পড়ে থাকা একটা executable file বা program image। এটা নিজে কোনো কাজ করছে না।</>)}
            {p(<>ধরেন, সেই file-এ double-click করলেন। এখন সেটা "চলতে" শুরু করেছে — সেটাই process। অর্থাৎ, <strong><Term id="process">Process</Term></strong> হলো সেই program-এর একটা <em>running instance</em> — চলতে থাকা কাজটা, আর তার জন্য যা যা state ও resource লাগে সেগুলো সহ।</>)}
            {p('সহজ কথায় — একটা recipe (program) আর সেই recipe দেখে করা রান্না (process) দুই জিনিস। একই recipe দিয়ে দশজন রাঁধুনি দশটা আলাদা রান্না করতে পারেন; ঠিক তেমনি একই program থেকে একাধিক process চলতে পারে।')}
          </div>
        ) : (
          <div style={body}>
            {p('The distinction matters up front. These two words often get mixed up, but they mean different things.')}
            {p(<>A <strong>program</strong> is a passive description of instructions and data — an executable file or program image sitting on disk, say. Right now, it isn't doing anything. Just sitting there.</>)}
            {p(<>Double-click that file. Now it's starting to "run" — that's called a process. So, a <strong><Term id="process">process</Term></strong> is a <em>running instance</em> of that program — the work actually in progress, along with the state and resources it needs to keep going.</>)}
            {p("Simply put: a recipe (program) and someone actually cooking with it (process) are two different things. Ten cooks can make ten different meals from the same recipe; likewise, many processes can run from the same program.")}
          </div>
        )}
      </Section>

      <Section num="02" bnH2="একটা process-এর ভেতরে কী থাকে?" enH2="What Lives Inside a Process?">
        {bn ? (
          <div lang="bn" style={body}>
            {p('OS যখন একটা process তৈরি করে, তখন শুধু program-এর code memory-তে তুলে দেয় না। Process-এর সঙ্গে তার execution আর resource নিয়ে বেশ কিছু state জড়িয়ে থাকে:')}
            {p(<><strong>PID (Process ID):</strong> Process-কে চিহ্নিত করার একটা identifier — যাতে OS বুঝতে পারে কোন process-এর কথা বলা হচ্ছে।</>)}
            {p(<><strong>Memory space:</strong> Process-এর একটা virtual address space থাকে, যেখানে তার code, data, stack, heap আর অন্যান্য mapped region বসে। এই এলাকা কীভাবে "নিজস্ব" হয়, সেটা একটু পরের section-এর গল্প।</>)}
            <p style={{ margin: '0 0 8px', ...body }}>সেই address space-এর ভেতরে কয়েকটা গুরুত্বপূর্ণ অংশ:</p>
            {p(<><strong>Code section:</strong> Program-এর executable instruction-গুলো সাধারণত এখানে থাকে। সাধারণ protection-এর অধীনে এই অংশ read-only হিসেবে map করা হতে পারে, যাতে চলতি code সহজে নিজেকে পাল্টে ফেলতে না পারে।</>)}
            {p(<><strong>Data section:</strong> Global আর static variable-এর মতো data এখানে থাকে। যেমন C-তে function-এর বাইরে declare করা {MONO('int counter = 0;')} — এই ধরনের global variable এখানে বসে থাকে। Program যতক্ষণ চলবে, ততক্ষণ এই variable-ও থাকবে।</>)}
            {p(<><strong>Stack:</strong> Function call-এর সময় parameter, local variable আর return information-এর জন্য জায়গা লাগে; সেটা আসে stack থেকে।<br />কল্পনা করুন একটা tray-তে একের পর এক কাগজ রাখছেন — সবশেষ কাগজটাই সবার ওপরে, সেটাই আগে সরাতে হবে। Function call-ও তেমনই: যে function সবশেষ call হয়েছে, সে-ই আগে শেষ হয়। এই "শেষে এসে আগে যায়" pattern-এর নামই stack।</>)}
            {p(<><strong>Heap:</strong> Program চলার সময় dynamically allocate করা memory-র জন্য heap ব্যবহার হয়। C-তে {MONO('malloc()')} করলে বা JavaScript runtime-এ {MONO('new Array(1000)')} লিখলে memory আসে এখান থেকেই।</>)}
            {p(<><strong>File descriptors:</strong> Process কোনো file, socket, pipe বা অন্য OS resource ব্যবহার করলে OS তাকে একটা handle দেয়। Unix-এর মতো system-এ সেই handle একটা ছোট integer — file descriptor। ওই নম্বর দেখিয়েই process বলে, "এই resource-টার সাথে কাজ করো।"</>)}
            {p(<><strong>Execution state:</strong> এই process যখন CPU-তে চলছিল, তখন CPU-র register-এর মান, program counter — এই ধরনের execution state লাগে। কেন এটা track করে রাখতে হয়? কারণ context switch-এর সময় এই state সংরক্ষণ করে পরে আবার restore করা যায়। Context Switching নিয়ে আমরা একটু পরে জানবো।</>)}
            {quote(<><strong>Process হলো address space আর resource-এর একটা context; CPU-তে যে execution state save আর restore হয়, সেটা মূলত thread-এর সঙ্গে জড়িত।</strong> এক process-এ একাধিক thread থাকলে address space এক, কিন্তু register state আর stack প্রত্যেকের নিজের।</>)}
            {p(<>এই সব তথ্য kernel তার নিজের data structure-এ track করে। Classic OS বইয়ে প্রতি process-এর এই record-টাকে বলা হয় <Term id="pcb">PCB</Term> (Process Control Block) — তবে বাস্তব kernel-এ এটা একটামাত্র literal "central table" হতেই হবে এমন নয়।</>)}
            {p('নিচের যন্ত্রে process-এর memory কীভাবে সাজানো থাকে, তার একটা conceptual ছবি:')}
          </div>
        ) : (
          <div style={body}>
            {p("When the OS creates a process, it doesn't just load the program's code into memory. A process carries a good deal of state about its execution and its resources.")}
            {p(<><strong>PID (Process ID):</strong> an identifier for the process — so the OS knows which one is being talked about.</>)}
            {p(<><strong>Memory space:</strong> a process has a virtual address space holding its code, data, stack, heap and other mapped regions. How that area becomes "its own" is the next section's story.</>)}
            <p style={{ margin: '0 0 8px', ...body }}>Inside that address space, a few important parts:</p>
            {p(<><strong>Code section:</strong> the program's executable instructions usually live here. Under normal protection this region may be mapped read-only, so running code can't casually rewrite itself.</>)}
            {p(<><strong>Data section:</strong> globals and statics live here — something like {MONO('int counter = 0;')} declared outside any function in C. Their lifetime is generally tied to the whole program execution.</>)}
            {p(<><strong>Stack:</strong> function calls need room for parameters, local variables and return information; that comes from the stack.<br />Picture stacking papers into a tray, one after another — the last paper on top is the first one you take out. Function calls work the same way: the one called last finishes first. That "last-in, first-out" pattern is where the stack gets its name.</>)}
            {p(<><strong>Heap:</strong> memory allocated dynamically while the program runs comes from the heap. {MONO('malloc()')} in C, or {MONO('new Array(1000)')} in a JavaScript runtime — that memory comes from here.</>)}
            {p(<><strong>File descriptors:</strong> when a process uses a file, socket, pipe or other OS resource, the OS hands it a handle. On Unix-like systems that handle is a small integer — a file descriptor. The process shows that number to say "work with this resource."</>)}
            {p(<><strong>Execution state:</strong> running the work on a CPU needs execution state — register values, the program counter. On a context switch this state can be saved and later restored.</>)}
            {quote(<><strong>A process is a context of address space and resources; the execution state saved and restored on the CPU belongs mainly to a thread.</strong> Several threads in one process share the address space, but each has its own registers and stack.</>)}
            {p(<>The kernel tracks all of this in its own data structures. Classic OS textbooks call the per-process record a <Term id="pcb">PCB</Term> (Process Control Block) — though a real kernel needn't keep it all in one literal "central table."</>)}
            {p('The instrument below shows a conceptual picture of how a process\'s memory is laid out:')}
          </div>
        )}
        <ProcessAnatomy />
        {bn ? (
          <div lang="bn" style={body}>{p('একটা কথা মনে রাখবেন — এটা একটা conceptual layout। Exact বিন্যাস architecture, OS, executable format আর runtime-এর ওপর নির্ভর করে; "stack সবসময় নিচের দিকে নামে, heap উপরে ওঠে" কোনো universal physical নিয়ম নয়।')}</div>
        ) : (
          <div style={body}>{p('Keep in mind that this is a conceptual layout. The exact arrangement depends on the architecture, the OS, the executable format and the runtime; "the stack always grows down and the heap grows up" is not a universal physical law.')}</div>
        )}
      </Section>

      <Section num="03" bnH2="এক CPU-তে অনেক কাজ: পালা-বদলের গল্প" enH2="Many Tasks on One CPU: The Turn-Taking Story">
        {bn ? (
          <div lang="bn" style={body}>
            {p('এবার আসল প্রশ্ন। CPU core সীমিত, কিন্তু runnable process আর thread অনেকগুলো। তাহলে?')}
            {p('OS-এর scheduler ঠিক করে দেয় কোন runnable thread কোন core-এ কখন চলার সুযোগ পাবে। একটা thread কিছুক্ষণ চলে; তারপর হয় preemption-এর কারণে তাকে সরে যেতে হয়, নয়তো সে নিজেই অপেক্ষায় চলে যায় — যেমন কোনো I/O শেষ হওয়ার অপেক্ষায়।')}
            {p(<>এই execution context বদলে যাওয়ার ঘটনার নাম <strong>context switch</strong>।</>)}
            {p('কল্পনা করুন আপনি ৫টা আলাদা subject-এ homework করছেন — গণিত, বাংলা, ইংরেজি, বিজ্ঞান, সমাজ। একসাথে পাঁচটা খাতায় লেখা যায় না। তাই একটা করে করছেন। কিন্তু একটা ছেড়ে আরেকটায় যাওয়ার আগে কয়েকটা কাজ করতে হয়:')}
            {ul([
              'এখন যে subject-এ আছেন, সেটার page কোথায় ছিল তা bookmark দিয়ে রাখা।',
              'কোন চিন্তা কোথায় ছিল, রাফখাতায় টুকে রাখা।',
              'বই বন্ধ করা।',
              'পরের subject-এর বই বের করা।',
              'আগেরবার যে page-এ থেমেছিলেন সেখানে ফেরত যাওয়া।',
              'কোথায় কী ভাবছিলেন, মনে করা।',
            ])}
            {p('তারপরই কাজ শুরু করা যায়।')}
            {p('CPU-তেও ধারণাটা একই:')}
            <Diagram art={ART_SWITCH} bnLabel="context switch" enLabel="context switch" />
            {p('Save করা state-এর মধ্যে থাকে register-এর মান, program counter — এই ধরনের execution information। পরে সেই state আবার restore করলে কাজটা মোটামুটি যেখানে থেমেছিল সেখান থেকেই এগোতে পারে।')}
            {quote(<><strong>Context switch মানেই পুরো process বদলে যাওয়া নয়</strong> — একই process-এর দুইটা thread-এর মধ্যেও context switch হতে পারে।</>)}
            {p('CPU নিজে ঠিক করে না এখন কোন application "গুরুত্বপূর্ণ"। সে শুধু তার সামনে থাকা instruction চালিয়ে যায়। OS-এর scheduler runnable কাজের তথ্য আর নিজের policy দেখে পরেরজনকে বেছে নেয়। নিচে এক ধাপ এক ধাপ করে switch-টা ঘটিয়ে দেখুন:')}
          </div>
        ) : (
          <div style={body}>
            {p("Now the real question. CPU cores are limited, but runnable processes and threads are many. So?")}
            {p("The OS's scheduler decides which runnable thread gets time on which core, and when. A thread runs for a while; then either preemption moves it aside, or it steps aside on its own — waiting for some I/O to finish, say.")}
            {p(<>That changing of the execution context is called a <strong>context switch</strong>.</>)}
            {p("Imagine you're doing homework in 5 different subjects — math, Bangla, English, science, social studies. You can't write in five notebooks at once. So you do one at a time. But before switching from one to another, a few things have to happen:")}
            {ul([
              'Bookmark the page in the current subject.',
              'Jot down whatever you were thinking about in a scratch pad.',
              'Close the book.',
              "Open the next subject's book.",
              'Go to the page where you last left off.',
              'Recall what you were thinking about last time.',
            ])}
            {p('Only then does work resume.')}
            {p('The idea on a CPU is the same:')}
            <Diagram art={ART_SWITCH} bnLabel="context switch" enLabel="context switch" />
            {p('The saved state holds execution information such as register values and the program counter. Restore it later and the work can pick up roughly where it left off.')}
            {quote(<><strong>A context switch doesn't necessarily mean a whole new process</strong> — two threads of the same process can switch between each other too.</>)}
            {p("The CPU itself doesn't decide which application matters right now. It just executes whatever is in front of it. The OS scheduler picks the next one using what it knows about the runnable work and its own policy. Step through one switch below:")}
          </div>
        )}
        <ContextSwitch />
        {bn ? (
          <div lang="bn" style={body}>{p('এই পালা-বদলের একটা দাম আছে। প্রতিবার save আর restore-এ কিছু সময় যায় — অর্থাৎ switch যত ঘনঘন হবে, CPU-র কিছুটা সময় ততই bookkeeping-এ খরচ হবে। তাই OS-কে একটা balance খুঁজতে হয়: এত ঘনঘন নয় যে overhead-ই বড় হয়ে ওঠে, আবার এত কম নয় যে user "hang" টের পায়।')}</div>
        ) : (
          <div style={body}>{p('This turn-taking has a cost. Every save and restore takes time — the more frequent the switches, the more CPU time goes into bookkeeping rather than work. So the OS has to find a balance: not so frequent that the overhead dominates, not so rare that users notice a "hang".')}</div>
        )}
      </Section>

      <Section num="04" bnH2="Scheduling: কার পালা এখন?" enH2="Scheduling: Whose Turn Is It Now?">
        {bn ? (
          <div lang="bn" style={body}>
            {p('আরেকটা প্রশ্ন। যদি একই সময়ে অনেকগুলো thread runnable থাকে, OS কীভাবে ঠিক করে পরের বার CPU কে পাবে?')}
            {p(<>এই সিদ্ধান্ত নেওয়ার নাম <strong>scheduling</strong>, আর যে নেয় তার নাম <strong>scheduler</strong>।</>)}
            {p('Scheduler-কে একসাথে কয়েকটা জিনিস সামলাতে হয় — সবাই যেন fair chance পায়, জরুরি কাজ যেন সময়মতো হয়, system যেন responsive থাকে। এই তিনটা একসাথে মেলানো কঠিন, তাই ইতিহাসে আর বিভিন্ন system-এ নানা algorithm ব্যবহার হয়েছে:')}
            {ul([
              <><strong>Round-Robin:</strong> runnable কাজগুলোকে পালা করে সময় দাও। ক্লাসে teacher যেমন সবাইকে পালা করে বলার সুযোগ দেন। সরল আর fair — কিন্তু এখানে কোন কাজটা বেশি জরুরি, সেই পার্থক্য ধরা পড়ে না।</>,
              <><strong>Priority-based:</strong> কিছু কাজকে বেশি priority দেওয়া যায়, যাতে তারা আগে CPU পায়। এখানে ঝুঁকি একটাই — কোনো low-priority কাজ দীর্ঘ সময় CPU না-ও পেতে পারে। একে বলে <strong>starvation</strong>।</>,
              <><strong>Fair-share scheduling:</strong> যে এখন পর্যন্ত সবচেয়ে কম CPU time পেয়েছে, পরের সুযোগটা তার। Linux বহু বছর এই ধারায় <strong>CFS (Completely Fair Scheduler)</strong> ব্যবহার করেছে; kernel 6.6 থেকে সেই জায়গায় এসেছে <strong>EEVDF</strong>, যেটা virtual runtime-এর পাশাপাশি deadline-ও হিসাব করে — যাতে latency-sensitive কাজ শুধু fairly নয়, সময়মতোও চলে।</>,
            ])}
            {p('সব algorithm-এর ভেতরের হিসাব জানার দরকার নেই। এতটুকু মনে রাখলেই চলবে:')}
            {quote(<><strong>Scheduler হলো OS-এর সেই রেফারি, যে ঠিক করে runnable কাজগুলোর মধ্যে CPU time কীভাবে বণ্টন হবে।</strong></>)}
          </div>
        ) : (
          <div style={body}>
            {p('Another question. If many threads are runnable at once, how does the OS decide who goes next?')}
            {p(<>That decision is <strong>scheduling</strong>, and the part of the OS that makes it is the <strong>scheduler</strong>.</>)}
            {p("A scheduler has to juggle several things at once — everyone gets a fair chance, urgent work happens in time, the system stays responsive. Satisfying all three together is hard, so many algorithms have been used over the years and across systems:")}
            {ul([
              <><strong>Round-Robin:</strong> give the runnable tasks time in turn, like a teacher letting every student speak in order. Simple and fair — but it can't tell which work is more urgent.</>,
              <><strong>Priority-based:</strong> some tasks get higher priority so they reach the CPU sooner. The risk here is that a low-priority task may go a long time without any CPU at all — that's <strong>starvation</strong>.</>,
              <><strong>Fair-share scheduling:</strong> whoever has had the least CPU time so far goes next. Linux followed this line for years with <strong>CFS (the Completely Fair Scheduler)</strong>; since kernel 6.6 its place has been taken by <strong>EEVDF</strong>, which tracks virtual deadlines alongside virtual runtime — so latency-sensitive work runs not just fairly, but on time.</>,
            ])}
            {p("You don't need the internal math of any of these. This much is enough:")}
            {quote(<><strong>The scheduler is the OS's referee, deciding how CPU time gets divided among the runnable work.</strong></>)}
          </div>
        )}
        <Scheduler />
      </Section>

      <Section num="05" bnH2="Virtual Memory: প্রতিটা process-এর নিজস্ব address space" enH2="Virtual Memory: Every Process Gets Its Own Address Space">
        {bn ? (
          <div lang="bn" style={body}>
            {p('Multitasking-এর আরেকটা বড় সমস্যা — memory isolation।')}
            {p('আপনার laptop-এ এখন Chrome, VS Code, Spotify — সবাই একই physical RAM ব্যবহার করছে। একটা program যেন ইচ্ছামতো আরেকটার private memory পড়তে বা লিখতে না পারে, সেটা নিশ্চিত হয় কীভাবে?')}
            {p(<>এখানেই আসে <strong>virtual memory</strong>। সহজ কথায়: প্রতিটা process পায় নিজের একটা আলাদা <strong>virtual address space</strong>।</>)}
            {p('Program যখন কোনো memory address ব্যবহার করে, সেটাকে সরাসরি physical RAM-এর ঘর ভাবার দরকার নেই। সেটা একটা virtual address। Hardware-এর MMU (Memory Management Unit) আর OS-এর তৈরি mapping information মিলে সেই virtual address-কে corresponding physical location-এর সঙ্গে মিলিয়ে দেয়।')}
            <Diagram art={ART_MAP} bnLabel="address mapping" enLabel="address mapping" />
            {p('দুই process একই virtual address number ব্যবহার করতে পারে, কিন্তু তাদের address space আলাদা বলে physical mapping আলাদা হয়। কেউ কারো এলাকায় ঢুকছে না।')}
            {p(<>এই mapping-এর তথ্য <strong>page table</strong>-এর মতো data structure-এ থাকে, আর MMU সেটা ব্যবহার করে translation সেরে ফেলে। নিচে দুই process টগল করে দেখুন একই virtual address কীভাবে ভিন্ন জায়গায় যায়:</>)}
          </div>
        ) : (
          <div style={body}>
            {p('Another big problem in multitasking — memory isolation.')}
            {p("Chrome, VS Code and Spotify on your laptop are all using the same physical RAM. How do you make sure one program can't freely read or write another's private memory?")}
            {p(<>This is where <strong>virtual memory</strong> comes in. Put simply: each process gets its own separate <strong>virtual address space</strong>.</>)}
            {p("When a program uses a memory address, that address needn't be thought of as a slot in physical RAM. It's a virtual address. The hardware's MMU (Memory Management Unit), together with mapping information the OS sets up, connects it to a corresponding physical location.")}
            <Diagram art={ART_MAP} bnLabel="address mapping" enLabel="address mapping" />
            {p('Two processes can use the same virtual address number, but because their address spaces are separate, the physical mappings differ. Neither is stepping into the other\'s territory.')}
            {p(<>That mapping information lives in structures such as <strong>page tables</strong>, which the MMU uses to perform the translation. Toggle between two processes below and watch the same virtual address land in different places:</>)}
          </div>
        )}
        <MMUTranslator />
        {bn ? (
          <div lang="bn" style={body}>
            {h3('Isolation')}
            {p('একটা সাধারণ user process নিজের অনুমোদিত virtual memory-র বাইরে গিয়ে অন্য process-এর private memory সরাসরি পড়তে বা লিখতে পারে না। আধুনিক system security-র একটা বড় ভিত্তি এটাই।')}
            {p('এটাকে এভাবে ভাবতে পারেন — একই শহরে ৫০ জন থাকছে, কিন্তু প্রত্যেকের হাতে আলাদা মানচিত্র। কারো মানচিত্রে অন্যের ঘরের রাস্তাটা আঁকাই নেই।')}
            {h3(bn ? 'Virtual memory আর swap এক জিনিস না' : 'Virtual memory is not swap')}
            {p('এই পার্থক্যটা জরুরি।')}
            {p(<><strong>Virtual memory</strong> হলো address space abstraction, protection আর virtual-to-physical mapping-এর পুরো ব্যবস্থাটা।</>)}
            {p(<><strong>Swap</strong> হলো সেই ব্যবস্থার ভেতরের একটা mechanism, যেখানে memory-র কিছু content RAM থেকে সরিয়ে secondary storage-এ রাখা হতে পারে, যাতে RAM অন্য কাজে লাগে। সেই page পরে আবার দরকার হলে storage থেকে ফিরিয়ে আনতে হয় — আর তখন <Term id="pagefault">page fault</Term>-এর মধ্য দিয়ে সেই কাজটা হয়।</>)}
            <Diagram art={ART_VM} bnLabel="virtual memory vs swap" enLabel="virtual memory vs swap" />
            {p('তাই virtual memory-কে শুধু "RAM-এর চেয়ে বেশি memory পাওয়ার কৌশল" ভাবা ঠিক নয়। Swap ছাড়াও virtual memory থাকে।')}
            {p('আর একটা কথা — program physical location জানে না ঠিকই, কিন্তু swap হলে সে টের পায় না তা নয়। Performance-এ সেটা স্পষ্ট ধরা পড়ে।')}
            {quote(<><strong>Physical RAM সবাই মিলে ভাগ করে, কিন্তু প্রতিটা process দেখে নিজের আলাদা virtual address space।</strong></>)}
          </div>
        ) : (
          <div style={body}>
            {h3('Isolation')}
            {p("An ordinary user process cannot reach outside its own permitted virtual memory to read or write another process's private memory directly. That is one of the foundations of modern system security.")}
            {p("Think of it this way — fifty people live in the same city, but each holds a different map. Nobody's map has a road drawn to anyone else's room.")}
            {h3('Virtual memory is not swap')}
            {p('This distinction matters.')}
            {p(<><strong>Virtual memory</strong> is the whole arrangement: the address space abstraction, protection, and virtual-to-physical mapping.</>)}
            {p(<><strong>Swap</strong> is one mechanism inside that arrangement, where some memory contents may be moved out of RAM to secondary storage so the RAM can be used for something else. If that page is needed again it has to come back — which is what a <Term id="pagefault">page fault</Term> sorts out.</>)}
            <Diagram art={ART_VM} bnLabel="virtual memory vs swap" enLabel="virtual memory vs swap" />
            {p('So virtual memory isn\'t just "a trick for having more memory than you have RAM." Virtual memory exists with or without swap.')}
            {p("And one more thing — a program doesn't know its physical location, but that doesn't mean swapping goes unnoticed. It shows up clearly in performance.")}
            {quote(<><strong>Physical RAM is shared by everyone, but every process sees its own separate virtual address space.</strong></>)}
          </div>
        )}
      </Section>

      <Section num="06" bnH2="Kernel Mode আর User Mode: দুই স্তরের দরজা" enH2="Kernel Mode and User Mode: Two Levels of Doors">
        {bn ? (
          <div lang="bn" style={body}>
            {p('আরেকটা fundamental separation আছে — এবার privilege আর security-র দিক থেকে।')}
            {p('Windows-এ Admin account আর regular user account-এর পার্থক্যটা মনে করুন। Admin সব করতে পারে — settings বদলানো, software install, system file edit। Regular user restricted — নিজের কাজ করতে পারে, কিন্তু system ভাঙতে পারে না।')}
            {p('CPU-র execution-কেও একটা simplified model হিসেবে দুই ধরনের privilege level-এ ভাবা যায়:')}
            {p(<><strong>Kernel Mode:</strong> এখানে চলা kernel code privileged operation করতে পারে — memory-management configuration, কিছু hardware-related control, এই ধরনের কাজ।</>)}
            {p(<><strong>User Mode:</strong> সাধারণ application এই restricted mode-এ চলে। privileged operation তারা সরাসরি করতে পারে না — আপনার browser, editor, game, সবাই এখানেই।</>)}
            {p('বাস্তব CPU architecture-এ privilege mechanism-এর implementation ভিন্ন হতে পারে; কোথাও দুইয়ের বেশি level-ও থাকে। এই article-এর জন্য মূল কথাটা এইটুকু:')}
            {quote(<><strong>Application code আর trusted OS code একই privilege level-এ চলে না।</strong></>)}
            {p('কোনো application যদি এমন কিছু করতে যায় যার অনুমতি তার নেই, CPU সেটা নিঃশব্দে হতে দেয় না — একটা exception বা trap ঘটে, আর নিয়ন্ত্রণ চলে যায় kernel-এর হাতে। এরপর কী হবে (process terminate, signal, error return) সেটা OS ঠিক করে।')}
            {p('কেন এই বিভাজন? সহজ কারণ — প্রতিটা app যদি যা খুশি করতে পারত, একটা খারাপ app পুরো system-এ ছড়িয়ে পড়তে পারত।')}
            {p('কিন্তু app-এর তো file পড়তে হবে, network ব্যবহার করতে হবে, নতুন process বানাতে হবে। তাহলে সে করে কীভাবে? OS-এর কাছে অনুরোধ করে — আর সেই অনুরোধের রাস্তার নাম system call।')}
          </div>
        ) : (
          <div style={body}>
            {p('Another fundamental separation — this time about privilege and security.')}
            {p("Recall the difference between an Admin account and a regular user account on Windows. Admin can do everything — change settings, install software, edit system files. A regular user is restricted: they can do their own work, but can't break the system.")}
            {p('As a simplified model, CPU execution can be thought of in two privilege levels:')}
            {p(<><strong>Kernel Mode:</strong> kernel code running here can perform privileged operations — memory-management configuration, certain hardware-related control, that sort of thing.</>)}
            {p(<><strong>User Mode:</strong> ordinary applications run in this restricted mode and cannot perform privileged operations directly — your browser, editor, games, all of them live here.</>)}
            {p('Real CPU architectures implement privilege differently, and some have more than two levels. For this article, the core idea is enough:')}
            {quote(<><strong>Application code and trusted OS code do not run at the same privilege level.</strong></>)}
            {p("If an application attempts something it isn't allowed to do, the CPU doesn't quietly let it through — an exception or trap occurs and control passes to the kernel. What happens next (terminate the process, deliver a signal, return an error) is the OS's decision.")}
            {p('Why the split? Simple reason — if every app could do anything, one bad app could spread through the whole system.')}
            {p('But apps do need to read files, use the network, create processes. So how? They ask the OS — and the road that request travels is the system call.')}
          </div>
        )}
      </Section>

      <Section num="07" bnH2="System Call: OS-এর কাছে অনুরোধের দরজা" enH2="System Call: The Door for Asking the OS">
        {bn ? (
          <div lang="bn" style={body}>
            {p(<><Term id="syscall"><strong>System call</strong></Term> হলো user mode-এ থাকা application আর kernel-এর মধ্যে একটা controlled interface। Application নিজে privileged কাজটা না করে OS-কে বলে — "আমার হয়ে এই কাজটা করে দাও।"</>)}
            {p('C-তে একটা সহজ উদাহরণ:')}
          </div>
        ) : (
          <div style={body}>
            {p(<>A <Term id="syscall"><strong>system call</strong></Term> is a controlled interface between a user-mode application and the kernel. Instead of performing the privileged work itself, the application says — "please do this for me."</>)}
            {p('A simple example in C:')}
          </div>
        )}
        {/* Code block */}
        <div style={{ margin: '22px 0', background: '#1b231b', border: '1px solid #4a493a', overflow: 'hidden', boxShadow: '0 10px 28px rgba(20,18,10,0.28)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 14px', background: '#232b23', borderBottom: '1px solid #2e392e' }}>
            <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#ff6b6b', display: 'block' }} />
            <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#e0c264', display: 'block' }} />
            <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#00d26a', display: 'block' }} />
            <span style={{ fontFamily: "'Departure Mono',monospace", fontSize: 11, color: '#8aa893', marginLeft: 8 }}>read_file.c</span>
          </div>
          <div style={{ display: 'flex', fontFamily: "'Departure Mono',monospace", fontSize: 12.5, lineHeight: 1.9, overflowX: 'auto' }}>
            <div aria-hidden="true" style={{ flex: 'none', textAlign: 'right', color: '#455545', padding: '12px 12px', borderRight: '1px solid #2e392e', userSelect: 'none', whiteSpace: 'pre' }}>{'1\n2\n3\n4\n5\n6\n7\n8\n9\n10'}</div>
            <div style={{ margin: 0, padding: '12px 18px', color: '#cfe8d8', whiteSpace: 'pre' }}>
              <span style={{ color: '#6c8873' }}>#include</span> <span style={{ color: '#8aa893' }}>&lt;fcntl.h&gt;</span>{'\n'}
              <span style={{ color: '#6c8873' }}>#include</span> <span style={{ color: '#8aa893' }}>&lt;unistd.h&gt;</span>{'\n\n'}
              <span style={{ color: '#7fae94' }}>int</span> <span style={{ color: '#9fd8b8' }}>main</span>() {'{'}
              {'\n'}
              {'  '}<span style={{ color: '#7fae94' }}>int</span> fd = <span style={{ color: '#00d26a', textShadow: '0 0 8px rgba(0,210,106,0.35)' }}>open</span>(<span style={{ color: '#b8d8c4' }}>"file.txt"</span>, O_RDONLY);  <span style={{ color: '#6c8873' }}>{'// library wrapper → syscall'}</span>{'\n'}
              {'  '}<span style={{ color: '#7fae94' }}>char</span> buffer[<span style={{ color: '#d8c88a' }}>100</span>];{'\n'}
              {'  '}<span style={{ color: '#00d26a', textShadow: '0 0 8px rgba(0,210,106,0.35)' }}>read</span>(fd, buffer, <span style={{ color: '#d8c88a' }}>100</span>);                 <span style={{ color: '#6c8873' }}>{'// library wrapper → syscall'}</span>{'\n'}
              {'  '}<span style={{ color: '#00d26a', textShadow: '0 0 8px rgba(0,210,106,0.35)' }}>close</span>(fd);                            <span style={{ color: '#6c8873' }}>{'// library wrapper → syscall'}</span>{'\n'}
              {'  '}<span style={{ color: '#7fae94' }}>return</span> <span style={{ color: '#d8c88a' }}>0</span>;{'\n'}
              {'}'}
            </div>
          </div>
        </div>
        {bn ? (
          <div lang="bn" style={body}>
            {p(<>একটা সূক্ষ্ম কিন্তু গুরুত্বপূর্ণ কথা: {MONO('open()')}, {MONO('read()')}, {MONO('close()')} নিজেরা system call নয় — এরা library/API function। Linux-এ C library-র এই wrapper-গুলো প্রয়োজন হলে kernel-এর system call interface ব্যবহার করে। x86-64 Linux-এ সেই কাজটা হয় {MONO('syscall')} instruction দিয়ে, যা user mode থেকে kernel-এর নির্ধারিত entry point-এ নিয়ে যায়।</>)}
            <Diagram art={ART_SYSCALL} bnLabel="request path" enLabel="request path" />
            <p style={{ margin: '0 0 8px', ...body }}>পুরো ব্যাপারটা সংক্ষেপে:</p>
            <ol style={{ margin: '0 0 16px', paddingLeft: 22, lineHeight: 1.9, ...body }}>
              <li style={{ marginBottom: 6 }}>Application system call-এর argument গুলো নির্দিষ্ট জায়গায় প্রস্তুত করে।</li>
              <li style={{ marginBottom: 6 }}>System call mechanism ব্যবহার করে kernel-এ entry নেওয়া হয়।</li>
              <li style={{ marginBottom: 6 }}>CPU privilege transition করে kernel-এর নির্দিষ্ট entry point-এ যায়।</li>
              <li style={{ marginBottom: 6 }}>Kernel অনুরোধটা যাচাই করে আর কাজটা করে।</li>
              <li style={{ marginBottom: 6 }}>Result বা error information ফেরত বসানো হয়।</li>
              <li style={{ marginBottom: 6 }}>Execution আবার user mode-এ ফিরে আসে।</li>
            </ol>
            <p style={{ margin: '0 0 8px', ...body }}>OS-এর প্রায় সব service-এর জন্যই এমন system call আছে:</p>
            {ul([
              <><strong>File:</strong> {MONO('open()')}, {MONO('read()')}, {MONO('write()')}, {MONO('close()')}</>,
              <><strong>Network:</strong> {MONO('socket()')}, {MONO('send()')}, {MONO('recv()')}</>,
              <><strong>Process:</strong> {MONO('fork()')} (নতুন process), {MONO('exit()')} (শেষ করা)</>,
              <><strong>Memory:</strong> {MONO('mmap()')} (address space-এ region map করা)</>,
            ])}
            {quote(<><strong>প্রতিটা high-level function call কিন্তু system call নয়।</strong> অনেক library function পুরো কাজটাই user space-এ সেরে ফেলতে পারে; দরকার হলে তবেই kernel-এ যায়।</>)}
            {p('এই kernel transition-এর একটা overhead আছে। তাই performance-sensitive code অপ্রয়োজনে বারবার kernel-এ যাওয়া এড়ায়। নিচের যন্ত্রে দরজাটা এক ধাপ এক ধাপে পার হয়ে দেখুন:')}
          </div>
        ) : (
          <div style={body}>
            {p(<>A subtle but important point: {MONO('open()')}, {MONO('read()')} and {MONO('close()')} are not themselves system calls — they're library/API functions. On Linux these C library wrappers use the kernel's system call interface when they need to. On x86-64 Linux that happens through the {MONO('syscall')} instruction, which moves execution from user mode to a defined kernel entry point.</>)}
            <Diagram art={ART_SYSCALL} bnLabel="request path" enLabel="request path" />
            <p style={{ margin: '0 0 8px', ...body }}>The sequence, in short:</p>
            <ol style={{ margin: '0 0 16px', paddingLeft: 22, lineHeight: 1.9, ...body }}>
              <li style={{ marginBottom: 6 }}>The application prepares the system call's arguments in the expected places.</li>
              <li style={{ marginBottom: 6 }}>The system call mechanism is used to enter the kernel.</li>
              <li style={{ marginBottom: 6 }}>The CPU performs a privilege transition into a defined kernel entry point.</li>
              <li style={{ marginBottom: 6 }}>The kernel validates the request and does the work.</li>
              <li style={{ marginBottom: 6 }}>A result or error is placed back for the caller.</li>
              <li style={{ marginBottom: 6 }}>Execution returns to user mode.</li>
            </ol>
            <p style={{ margin: '0 0 8px', ...body }}>Nearly every OS service has system calls behind it:</p>
            {ul([
              <><strong>Files:</strong> {MONO('open()')}, {MONO('read()')}, {MONO('write()')}, {MONO('close()')}</>,
              <><strong>Network:</strong> {MONO('socket()')}, {MONO('send()')}, {MONO('recv()')}</>,
              <><strong>Processes:</strong> {MONO('fork()')} (a new process), {MONO('exit()')} (end one)</>,
              <><strong>Memory:</strong> {MONO('mmap()')} (map a region into the address space)</>,
            ])}
            {quote(<><strong>Not every high-level function call is a system call.</strong> Plenty of library functions finish their work entirely in user space, and only enter the kernel when they actually have to.</>)}
            {p('That kernel transition carries overhead, so performance-sensitive code avoids crossing into the kernel more often than it needs to. Step through the doorway on the instrument below:')}
          </div>
        )}
        <SyscallDoorway />
      </Section>

      <Section num="08" bnH2="Thread: এক Process-এর ভেতরে অনেক execution path" enH2="Threads: Many Execution Paths Inside One Process">
        {bn ? (
          <div lang="bn" style={body}>
            {p('এতক্ষণ process-এর কথা বললাম। এবার thread।')}
            {p(<>একটা process-এর ভেতরে একাধিক <Term id="thread"><strong>thread</strong></Term> থাকতে পারে। তারা একই process-এর virtual address space আর অনেক process-level resource share করে, কিন্তু প্রত্যেকের নিজের stack আর নিজের execution state থাকে।</>)}
            {p('Process যদি একটা কারখানা হয়, thread হলো সেই কারখানার শ্রমিক। এক কারখানায় অনেক শ্রমিক একসাথে কাজ করে, একই মেশিন আর একই কাঁচামাল ব্যবহার করে — কিন্তু প্রত্যেকের নিজের কাজের ধারা আছে।')}
            <Diagram art={ART_THREADS} bnLabel="inside a process" enLabel="inside a process" />
            {p('একই process-এর দুইটা thread একই memory access করতে পারে — এতে data ভাগাভাগি সহজ হয়, আবার coordination-এর দায়িত্বও এসে পড়ে। কে কখন কী লিখছে সেটা ঠিকঠাক না সামলালে ফল অনিশ্চিত হয়ে যেতে পারে।')}
            {h3('Concurrency ≠ parallelism')}
            {p(<><strong>Concurrency</strong> মানে একাধিক কাজের অগ্রগতি overlap করা। <strong>Parallelism</strong> মানে একাধিক কাজ সত্যিই একই সময়ে আলাদা core-এ চলা। Single-core CPU-তেও concurrency সম্ভব; একাধিক core থাকলে কিছু thread সত্যিই parallel-এ চলতে পারে।</>)}
          </div>
        ) : (
          <div style={body}>
            {p("We've been talking about processes. Now threads.")}
            {p(<>A process can contain several <Term id="thread"><strong>threads</strong></Term>. They share the process's virtual address space and many of its resources, but each has its own stack and its own execution state.</>)}
            {p("If a process is a factory, a thread is one of its workers. Many workers can be at it at once, sharing the same machines and the same raw materials — but each follows its own line of work.")}
            <Diagram art={ART_THREADS} bnLabel="inside a process" enLabel="inside a process" />
            {p('Two threads in one process can reach the same memory — which makes sharing data easy, and makes coordination your problem. Get the "who writes what, when" wrong and the outcome stops being predictable.')}
            {h3('Concurrency ≠ parallelism')}
            {p(<><strong>Concurrency</strong> means the progress of several tasks overlaps. <strong>Parallelism</strong> means several tasks genuinely execute at the same instant on different cores. Concurrency is possible even on a single-core CPU; with several cores, some threads really do run in parallel.</>)}
          </div>
        )}
        {/* Thread vs Process table */}
        <div style={{ border: '1px solid #c9bda0', background: 'rgba(255,252,243,0.65)', margin: '0 0 20px', overflowX: 'auto' }}>
          <table style={{ borderCollapse: 'collapse', width: '100%', fontFamily: "'Departure Mono',monospace", fontSize: 12, color: '#33301F', minWidth: 420 }}>
            <thead>
              <tr>
                {[bn ? 'দিক' : 'ASPECT', 'PROCESS', 'THREAD'].map((h) => (
                  <th key={h} style={{ textAlign: 'left', padding: '10px 14px', borderBottom: '1px solid #26241C', fontWeight: 400, color: '#5c5442', letterSpacing: '0.06em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(bn
                ? [
                  ['Address space', 'সাধারণত আলাদা', 'process-এর মধ্যে share করে'],
                  ['Execution state', 'process context', 'নিজের register state আর stack'],
                  ['Resource sharing', 'বেশি isolated', 'বেশি shared'],
                  ['Context switch', 'বেশি state জড়িত', 'একই process হলে কিছু state shared'],
                  ['Crash হলে', 'অন্য process সাধারণত বেঁচে থাকে', 'fatal হলে পুরো process যেতে পারে'],
                ]
                : [
                  ['Address space', 'usually separate', 'shared within the process'],
                  ['Execution state', 'process context', 'own register state and stack'],
                  ['Resource sharing', 'more isolated', 'more shared'],
                  ['Context switch', 'more state involved', 'some state shared within a process'],
                  ['Crash impact', 'other processes usually survive', 'a fatal one can take the process down'],
                ]
              ).map(([aspect, proc, thr]) => (
                <tr key={aspect as string}>
                  <td style={{ padding: '8px 14px', borderBottom: '1px solid #c9bda0' }}>{aspect}</td>
                  <td style={{ padding: '8px 14px', borderBottom: '1px solid #c9bda0', color: '#00753F' }}>{proc}</td>
                  <td style={{ padding: '8px 14px', borderBottom: '1px solid #c9bda0' }}>{thr}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {bn ? (
          <div lang="bn" style={body}>{p('বাস্তব software-এ process আর thread — দুটোই একসাথে ব্যবহার হয়। যেমন একটা modern browser একাধিক process ব্যবহার করে (UI, renderer, GPU), আর সেই process-গুলোর ভেতরেও একাধিক thread চলে।')}</div>
        ) : (
          <div style={body}>{p('Real software uses both together. A modern browser, for instance, runs several processes (UI, renderers, GPU) — and inside those processes, several threads.')}</div>
        )}
      </Section>

      <Section num="09" bnH2="পুরো ছবিটা একবার: Keyboard-এর 'A' Screen-এ যাওয়ার গল্প" enH2="The Whole Picture: 'A' from Keyboard to Screen">
        {bn ? (
          <div lang="bn" style={body}>
            {p(<>এবার সব একসাথে। ধরুন আপনি keyboard-এ {'\''}A{'\''} চাপলেন।</>)}
            {p('নিচের পথটা একটা simplified conceptual model — ভিন্ন operating system, input stack, window system আর graphics architecture-এ আসল ধাপগুলো আলাদা হতে পারে।')}
            <Diagram art={ART_KEYPRESS} bnLabel="conceptual path" enLabel="conceptual path" />
            {p('ধাপে ধাপে ধারণাটা:')}
            <ol style={{ margin: '0 0 16px', paddingLeft: 22, lineHeight: 1.9, ...body }}>
              <li style={{ marginBottom: 6 }}>Keyboard hardware থেকে input-এর signal বা data তৈরি হয়।</li>
              <li style={{ marginBottom: 6 }}>Hardware-এর মাধ্যমে CPU-কে জানানো হয় যে input এসেছে।</li>
              <li style={{ marginBottom: 6 }}>OS-এর privileged code আর device driver সেই input process করে।</li>
              <li style={{ marginBottom: 6 }}>Input subsystem সেটাকে একটা higher-level input event হিসেবে প্রকাশ করে।</li>
              <li style={{ marginBottom: 6 }}>Window system বা application সেই event পায়।</li>
              <li style={{ marginBottom: 6 }}>Application নিজের state update করে — যেমন text field-এ {'\''}A{'\''} যোগ করা।</li>
              <li style={{ marginBottom: 6 }}>UI আবার render করতে হয়।</li>
              <li style={{ marginBottom: 6 }}>Rendering আর display pipeline-এর মধ্য দিয়ে পরিবর্তনটা শেষ পর্যন্ত screen-এ পৌঁছায়।</li>
            </ol>
            {p('নিচের যন্ত্রে step চেপে পুরো relay-টা দেখুন:')}
          </div>
        ) : (
          <div style={body}>
            {p(<>Let's pull it all together. You press {'\''}A{'\''} on your keyboard.</>)}
            {p('The path below is a simplified conceptual model — the actual steps differ across operating systems, input stacks, window systems and graphics architectures.')}
            <Diagram art={ART_KEYPRESS} bnLabel="conceptual path" enLabel="conceptual path" />
            {p('Step by step, the idea:')}
            <ol style={{ margin: '0 0 16px', paddingLeft: 22, lineHeight: 1.9, ...body }}>
              <li style={{ marginBottom: 6 }}>The keyboard hardware produces a signal or data for the input.</li>
              <li style={{ marginBottom: 6 }}>Through the hardware, the CPU is notified that input has arrived.</li>
              <li style={{ marginBottom: 6 }}>The OS's privileged code and a device driver process that input.</li>
              <li style={{ marginBottom: 6 }}>The input subsystem turns it into a higher-level input event.</li>
              <li style={{ marginBottom: 6 }}>The window system or application receives that event.</li>
              <li style={{ marginBottom: 6 }}>The application updates its own state — adding {'\''}A{'\''} to a text field, say.</li>
              <li style={{ marginBottom: 6 }}>The UI has to be rendered again.</li>
              <li style={{ marginBottom: 6 }}>Through the rendering and display pipeline, the change finally reaches the screen.</li>
            </ol>
            {p('Step through the whole relay on the instrument below:')}
          </div>
        )}
        <KeypressRelay />
        {bn ? (
          <div lang="bn" style={body}>
            {p('শুধু একটা keypress-এর জন্য এতগুলো ধাপ, কয়েকটা privilege transition, কয়েকটা component-এর হাতবদল। আর মাঝখানে OS scheduling, protection, device access আর এই সব component-এর মধ্যে coordination সামলাচ্ছে।')}
            {p('এই কারণেই OS-কে "Grand Conductor" বলা — hardware আর application-এর মাঝখানে বসে পুরো orchestra-টা চালানো।')}
            {quote(<>তবে মনে রাখবেন — <strong>এটা একটা conceptual flow, কোনো নির্দিষ্ট OS-এর exact instruction-by-instruction sequence নয়।</strong> বাস্তবে interrupt handling, driver, event queue, window system, rendering আর GPU pipeline অনেক বেশি জটিল।</>)}
          </div>
        ) : (
          <div style={body}>
            {p('For one keypress: that many stages, several privilege transitions, several components handing work to each other. And through it all the OS is handling scheduling, protection, device access, and the coordination between those components.')}
            {p('Which is why the OS gets called the "Grand Conductor" — sitting between hardware and applications, running the whole orchestra.')}
            {quote(<>But keep in mind — <strong>this is a conceptual flow, not any particular OS's exact instruction-by-instruction sequence.</strong> In real systems the interrupt handling, drivers, event queues, window systems, rendering and GPU pipelines are far more complex.</>)}
          </div>
        )}
        <Recap>
          {bn ? (
            <>
              <li><strong>Program আর process এক জিনিস না।</strong> Program হলো instruction আর data-র নিষ্ক্রিয় বর্ণনা; process হলো তার একটা running execution context।</li>
              <li><strong>অনেক runnable thread সীমিত CPU resource ভাগ করে নেয়।</strong> Scheduler ঠিক করে কে কখন CPU time পাবে।</li>
              <li><strong>Context switch-এ execution state save আর restore হয়</strong> — একই process-এর দুই thread-এর মধ্যেও সেটা ঘটতে পারে।</li>
              <li><strong>Virtual memory প্রতিটা process-কে আলাদা virtual address space দেয়।</strong> Hardware আর OS-এর mapping ও protection mechanism মিলে physical memory access নিয়ন্ত্রণ করে — আর virtual memory মানেই swap নয়।</li>
              <li><strong>Kernel mode আর user mode privilege আলাদা রাখে।</strong> সাধারণ application privileged operation সরাসরি করতে পারে না; চেষ্টা করলে trap হয়।</li>
              <li><strong>System call হলো kernel service ব্যবহারের controlled interface</strong> — তবে প্রতিটা library function call system call নয়।</li>
              <li><strong>Thread হলো process-এর ভেতরের আলাদা execution path।</strong> Memory আর resource shared, কিন্তু stack আর execution state যার যার নিজের।</li>
            </>
          ) : (
            <>
              <li><strong>A program and a process aren't the same thing.</strong> A program is a passive description of instructions and data; a process is a running execution context for it.</li>
              <li><strong>Many runnable threads share a limited amount of CPU.</strong> The scheduler decides who gets CPU time and when.</li>
              <li><strong>A context switch saves and restores execution state</strong> — and it can happen between two threads of the same process.</li>
              <li><strong>Virtual memory gives each process its own virtual address space.</strong> Hardware and OS mapping and protection control physical memory access — and virtual memory is not the same thing as swap.</li>
              <li><strong>Kernel mode and user mode keep privilege separate.</strong> Ordinary applications can't perform privileged operations directly; attempting one traps.</li>
              <li><strong>A system call is the controlled interface to kernel services</strong> — though not every library function call is one.</li>
              <li><strong>Threads are separate execution paths inside a process.</strong> Memory and resources are shared; the stack and execution state are each thread's own.</li>
            </>
          )}
        </Recap>
      </Section>

      <RelayNav
        hub={SERIES_HUB_CARD}
        next={{ label: { bn: 'baton পরের পর্বে', en: 'baton to the next leg' }, title: bn ? '০৭ — কোড থেকে মেশিন কোড' : '07 — Code to Machine Code', href: '/writing/code-to-machine-code', variant: 'next' }}
        bridge={{
          bn: 'Hardware দেখা হলো। OS দেখা হলো। কিন্তু আপনি যে code লেখেন — JavaScript, Python, Go, C — সেটা তো CPU-র নিজের ভাষা না। CPU শেষ পর্যন্ত machine instruction চালায়; সেগুলো memory-তে থাকে binary bit pattern হিসেবে, আর আমরা মানুষ সুবিধার জন্য সেগুলোকে প্রায়ই hexadecimal-এ লিখি। তাহলে আপনার লেখা text file কীভাবে সেই machine instruction হয়ে ওঠে? কখন compiler লাগে, interpreter কী করে, আর JavaScript-এর মতো ভাষায় JIT কোথায় এসে দাঁড়ায়? সেই গল্প পরের আর্টিকেলে।',
          en: "Hardware — done. OS — done. But the code you write — JavaScript, Python, Go, C — isn't the CPU's own language. The CPU ultimately executes machine instructions; those sit in memory as binary bit patterns, and we humans just tend to write them out in hexadecimal for convenience. So how does the text file you write become those machine instructions? When is a compiler involved, what does an interpreter do, and where does JIT fit in for a language like JavaScript? That's the next article.",
        }}
      />
      <Colophon />
    </article >
  );
}
