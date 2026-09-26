import { Section } from '../primitives/Section';
import { Term } from '../primitives/Term';
import { Diagram } from '../primitives/Diagram';
import { Recap } from '../primitives/Recap';
import { RelayNav } from '../primitives/RelayNav';
import { SERIES_HUB_PATH } from '../manifest';
import { Colophon } from '../primitives/Colophon';
import { useProse, LINK, mono as MONO } from '../primitives/useProse';
import { KeyMatrixScan } from '../widgets/KeyMatrixScan';
import { Rasterize } from '../widgets/Rasterize';
import { FullRelay } from '../widgets/FullRelay';

/* ── shared flow art, identical in both languages ─────────────────────── */

const ART_SCAN = `Keyboard matrix
      ↓
controller scans
      ↓
which key changed?
      ↓
input report / usage code`;

const ART_INTERRUPT = `current execution
       ↓
   interrupt
       ↓
OS interrupt handling
       ↓
resume previous work
        or
scheduler runs another task`;

const ART_EVENT = `keyboard event
      ↓
OS input handling
      ↓
application becomes runnable
      ↓
scheduler
      ↓
application runs`;

const ART_APPLOOP = `event waiting in the queue
          ↓
app takes the next event
          ↓
    update state
          ↓
mark the UI as needing a redraw
          ↓
  wait for the next event`;

const ART_RASTER = `'A' character
      ↓
  font shape
      ↓
 rasterization
      ↓
pixel information`;

const ART_DISPLAY = `Application UI
      ↓
  rendering
      ↓
  compositor
      ↓
  final frame
      ↓
 display buffer
      ↓
   monitor`;

const ART_LAYERS = `Finger
  ↓
Keyboard switch
  ↓
Keyboard controller
  ↓
USB / HID
  ↓
Interrupt + OS input handling
  ↓
Application event
  ↓
Editor state
  ↓
Font + rasterization
  ↓
Compositor / graphics pipeline
  ↓
Display hardware
  ↓
Light
  ↓
Your eye`;

/** Reading-list rows: title, where to find it, and the blurb. */
type Res = { name: string; where?: string; bn: string; en: string };

const READING: { bnGroup: string; enGroup: string; items: Res[] }[] = [
  {
    bnGroup: 'একদম শুরু থেকে বুঝতে চাইলে',
    enGroup: 'Starting from the beginning',
    items: [
      {
        name: 'Crash Course Computer Science',
        bn: 'YouTube-এ ৪০ পর্বের একটা সিরিজ, প্রতিটা ১০-১৫ মিনিট। Transistor থেকে AI পর্যন্ত computing-এর অনেকগুলো গুরুত্বপূর্ণ idea সহজভাবে পরিচয় করিয়ে দেয়। ভাষা সহজ, উপস্থাপনা চমৎকার। শুরু করার জন্য একটা ভালো overview।',
        en: 'a 40-episode YouTube series, 10-15 minutes each. Introduces a lot of computing ideas simply, from transistors to AI. Clear language, excellent production. A good overview to start with.',
      },
      {
        name: 'Ben Eater',
        bn: 'YouTube channel। এই ভদ্রলোক breadboard-এ তার দিয়ে একটা সম্পূর্ণ 8-bit computer বানিয়েছেন, আর প্রতিটা ধাপ ক্যামেরার সামনে ব্যাখ্যা করেছেন। Article 1 আর 3-এ যা পড়েছেন, সেটা চোখের সামনে তৈরি হতে দেখতে পারবেন। ধৈর্য ধরে দেখার মতো জিনিস।',
        en: 'a YouTube channel. This man built a complete 8-bit computer on breadboards with wires, and explained every step on camera. Everything you read in Articles 1 and 3, you can watch being built. Worth the patience.',
      },
      {
        name: 'Nand2Tetris',
        where: 'nand2tetris.org',
        bn: 'শুধু একটা NAND gate থেকে শুরু করে ধাপে ধাপে একটা পুরো computer system আর তার software hierarchy বানানোর কোর্স। CPU, assembler, VM, compiler, OS — সব নিজে হাতে project আকারে। Official website-এ lecture, project material আর tool বিনামূল্যে পাওয়া যায়; Coursera version-টা paid course। এই সিরিজের প্রায় সবকিছু এখানে হাতে-কলমে করে দেখা যাবে।',
        en: 'a course that starts with a single NAND gate and walks you up through a complete computer system and its software hierarchy. CPU, assembler, VM, compiler, OS — you build all of it yourself as projects. Lectures, project materials and tools are free on the official site; the Coursera version is a paid course. Almost everything in this series, done hands-on.',
      },
    ],
  },
  {
    bnGroup: 'Hardware আর CPU নিয়ে',
    enGroup: 'Hardware and CPUs',
    items: [
      {
        name: "Computer Systems: A Programmer's Perspective",
        bn: "Bryant ও O'Hallaron-এর লেখা। Carnegie Mellon-এর বিখ্যাত বই। Programmer-এর দৃষ্টিকোণ থেকে লেখা, তাই আপনার কোডের সাথে hardware-এর সম্পর্ক কোথায় সেটা স্পষ্ট হয়। Article 3, 4, 5-এর গভীর version।",
        en: "Bryant and O'Hallaron. The famous Carnegie Mellon book. Written from a programmer's perspective, so the connection between your code and the hardware stays visible throughout. The deep version of Articles 3, 4, and 5.",
      },
      {
        name: 'Computer Organization and Design',
        bn: 'Patterson ও Hennessy-র লেখা। Computer architecture-এর classic textbook। একটু ভারী, কিন্তু reference হিসেবে দাঁড়িয়ে থাকার মতো।',
        en: 'Patterson and Hennessy. The classic computer architecture textbook. Heavier going, but the kind of reference that stays on the shelf.',
      },
      {
        name: 'Inside the Machine',
        bn: 'Jon Stokes। আধুনিক processor-এর ভেতরটা ছবির সাহায্যে ব্যাখ্যা করা। Textbook-এর চেয়ে সহজ পাঠ।',
        en: 'Jon Stokes. Explains modern processors with illustrations. An easier read than a textbook.',
      },
    ],
  },
  {
    bnGroup: 'Memory আর Performance নিয়ে',
    enGroup: 'Memory and performance',
    items: [
      {
        name: 'What Every Programmer Should Know About Memory',
        bn: 'Ulrich Drepper-এর লেখা একটা দীর্ঘ প্রবন্ধ, বিনামূল্যে পাওয়া যায়। Article 5-এ যা ছুঁয়ে গেছি, তার সম্পূর্ণ রূপ। Cache, DRAM, NUMA — সব এখানে। খুঁজলেই PDF পাবেন।',
        en: 'a long paper by Ulrich Drepper, freely available. The complete version of what Article 5 touched on. Cache, DRAM, NUMA — all of it. Search for the PDF.',
      },
      {
        name: 'Latency Numbers Every Programmer Should Know',
        bn: 'Jeff Dean-এর তৈরি একটা ছোট তালিকা, ইন্টারনেটে সহজেই পাওয়া যায়। বিভিন্ন operation-এ কত সময় লাগে তার একটা mental model তৈরি করে দেয়।',
        en: 'a short table originally by Jeff Dean, easy to find online. Builds a mental model for how long different operations actually take.',
      },
    ],
  },
  {
    bnGroup: 'Operating System নিয়ে',
    enGroup: 'Operating systems',
    items: [
      {
        name: 'Operating Systems: Three Easy Pieces',
        where: 'ostep.org',
        bn: 'Arpaci-Dusseau দম্পতির লেখা। সম্পূর্ণ বিনামূল্যে, PDF আকারে ওয়েবসাইটেই আছে। OS শেখার জন্য চমৎকার একটা বই — লেখার ধরন সহজ, উদাহরণ প্রচুর। Article 6-এর প্রতিটা বিষয় এখানে বিস্তারিত।',
        en: 'by the Arpaci-Dusseaus. Completely free, full PDF on the website. An excellent book for learning operating systems — readable style, plenty of examples. Every topic from Article 6 in full detail.',
      },
      {
        name: 'Linux Kernel Development',
        bn: 'Robert Love। Linux kernel-এর ভেতরটা কীভাবে কাজ করে জানতে চাইলে।',
        en: 'Robert Love. For getting inside the Linux kernel specifically.',
      },
    ],
  },
  {
    bnGroup: 'Compiler আর Language নিয়ে',
    enGroup: 'Compilers and languages',
    items: [
      {
        name: 'Crafting Interpreters',
        where: 'craftinginterpreters.com',
        bn: 'Robert Nystrom-এর লেখা, ওয়েবসাইটে সম্পূর্ণ বিনামূল্যে পড়া যায়। নিজে হাতে দুইটা interpreter বানানোর মধ্য দিয়ে পুরো বিষয়টা শেখানো হয়। লেখার মান অসাধারণ — technical বই এত সুন্দরভাবে কম লেখা হয়।',
        en: 'by Robert Nystrom, fully readable free on the site. Teaches the whole subject by having you build two interpreters by hand. The writing quality is exceptional — technical books are rarely this well made.',
      },
      {
        name: 'V8 blog',
        where: 'v8.dev/blog',
        bn: 'JavaScript engine-এর ভেতরে কী ঘটে, engineer-রা নিজেরাই লেখেন। JIT, garbage collection, optimization নিয়ে গভীর লেখা।',
        en: 'what happens inside a JavaScript engine, written by the engineers themselves. Deep posts on JIT, garbage collection, and optimization.',
      },
    ],
  },
  {
    bnGroup: 'হাতে-কলমে শিখতে চাইলে',
    enGroup: 'Learning by doing',
    items: [
      {
        name: 'nandgame.com',
        bn: 'ব্রাউজারেই NAND gate থেকে শুরু করে ধাপে ধাপে কম্পিউটার বানানোর একটা খেলা। বিনামূল্যে, মজার, আর শেখার জন্য চমৎকার।',
        en: 'a browser game that walks you from a NAND gate up to a computer. Free, fun, and genuinely educational.',
      },
      {
        name: 'CS50',
        where: 'Harvard',
        bn: 'YouTube আর edX-এ পাওয়া যায়; বর্তমান CS50x material free OpenCourseWare হিসেবেও available। C থেকে শুরু করে computer science-এর ভিত্তি, তারপর Python, SQL, web development। শিক্ষকতার মান অসাধারণ।',
        en: 'available on YouTube and edX; the current CS50x materials are also available free as OpenCourseWare. Starts with C and covers the foundations of computer science, then Python, SQL and web development. The teaching is superb.',
      },
    ],
  },
];

export function KeyboardToScreen() {
  const { bn, body, p } = useProse();

  return (
    <article style={{ marginTop: 40, fontSize: '16.5px', lineHeight: 1.9 }}>
      {/* Hook */}
      <div>
        {bn ? (
          <div lang="bn" style={body}>
            {p("Keyboard-এ 'A' চাপলেন। এক মুহূর্ত পর screen-এ 'A' ফুটে উঠল।")}
            {p('আপনার কাছে মনে হলো instant। কোনো delay টের পাননি, কোনো অপেক্ষাও করতে হয়নি। আঙুল নামল আর অক্ষরটা চলে এল।')}
            {p('কিন্তু "instant" মানে literally zero time নয়। আপনার আঙুলের চাপ থেকে screen-এ আলো জ্বলা পর্যন্ত বেশ কয়েকটি আলাদা hardware এবং software layer কাজ করে।')}
            {p('এই সিরিজে এতদিন আমরা এই system-গুলোকে আলাদা আলাদা করে দেখেছি। আজ দেখব সবাই একসাথে কীভাবে কাজ করে। একটা মাত্র keystroke-কে follow করে পুরো পথটা হেঁটে যাব — আঙুলের চাপ থেকে শুরু করে চোখে আলো পড়া পর্যন্ত।')}
          </div>
        ) : (
          <div style={body}>
            {p("You press 'A' on your keyboard. A moment later, 'A' appears on the screen.")}
            {p('It felt instant to you. No delay you could detect, no waiting. Your finger went down and the character showed up.')}
            {p('But "instant" does not mean literally zero time. Between your finger pressing down and light coming off the screen, several completely separate hardware and software layers do their work. Each has a different responsibility, each was designed by different people at different times.')}
            {p("Throughout this series we've looked at these systems one at a time. Today we watch them work together. We'll follow a single keystroke through the whole path — from the press of a finger to light hitting your eye.")}
          </div>
        )}
      </div>

      <Section num="01" bnH2="প্রথম চমক: keyboard-এর ভেতরেও একটা ছোট computer আছে" enH2="First surprise: there's a small computer inside your keyboard">
        {bn ? (
          <div lang="bn" style={body}>
            {p("'A' চাপলে সরাসরি laptop-এর main CPU-তে কিছু যায় না। তার আগে সেই signal-কে থামতে হয় keyboard-এর নিজের ভেতরে বসে থাকা একটা ছোট্ট computer-এ।")}
            {p('শুনতে অদ্ভুত লাগতে পারে। Keyboard তো একটা input device মাত্র, তার আবার নিজের computer কেন থাকবে? কিন্তু keyboard-এর ভেতরে সাধারণত একটা ছোট controller chip থাকে। এতে processor logic, কিছু memory আর keyboard-এর firmware থাকে। তার কাজ হলো key press detect করা আর সেটাকে computer-এর জন্য meaningful input data-তে পরিণত করা।')}
            {p('অনেক keyboard-এ key-গুলো একটা matrix আকারে সাজানো — সারি আর কলামের intersection-এ key বসে। Controller বারবার সেই matrix scan করে দেখে কোন key-এর electrical state বদলেছে। প্রতিটা key-এর জন্য আলাদা তার টানার দরকার হয় না; সারি আর কলামের সংযোগই বলে দেয় কোন key চাপা হয়েছে।')}
            {p('যতক্ষণ কোনো key চাপা না হচ্ছে, কোনো কলামেই কিছু ধরা পড়ে না। কিন্তু যেই কোনো key চাপা হয়, সেই key-এর নিচের switch-এর দুইটা metal contact একসাথে লেগে যায়, সেই সারি আর সেই কলামের মাঝে circuit complete হয়ে যায়, আর chip ঐ কলামে voltage দেখতে পায়।')}
            <Diagram art={ART_SCAN} bnLabel="scan cycle" enLabel="scan cycle" />
            {p(<>ধরুন {"'A'"} key press detect হলো। USB keyboard হলে controller সাধারণত <Term id="hid">USB HID</Term> (Human Interface Device) protocol ব্যবহার করে host-এর কাছে একটা input report পাঠায়। সেই report-এ {"'A'"} key-এর জন্য একটা নির্দিষ্ট usage code থাকতে পারে — USB HID Usage Tables-এ {MONO('0x04')} হলো "Keyboard a and A"।</>)}
            {p(<>খেয়াল করুন — এই {MONO('0x04')} character {"'A'"}-এর ASCII code নয়। এটা keyboard-এর কোন key-এর কথা বলা হচ্ছে, সেটার একটা code। অক্ষরে রূপান্তরটা হবে পরে, OS-এর স্তরে — layout বদলালে একই key অন্য অক্ষরও হতে পারে।</>)}
            {p('মানে laptop-এর main CPU কিছু জানার আগেই keyboard-এর নিজের controller একটা পুরো কাজ সেরে ফেলেছে। Electrical change পড়া হয়েছে, সিদ্ধান্ত নেওয়া হয়েছে, digital input information তৈরি হয়েছে।')}
            {p(<>আর সেই controller-এর processor-ও কিন্তু আমাদের দেখা <a href="/writing/heartbeat-fde" style={LINK}>সেই একই নিয়মে</a> চলে — fetch করে, decode করে, execute করে। শুধু scale-টা অনেক ছোট। নিচের যন্ত্রে একটা key চেপে scan cycle-টা দেখুন:</>)}
          </div>
        ) : (
          <div style={body}>
            {p("When you press 'A', nothing goes directly to the laptop's main CPU. Before that, the signal has to stop at a tiny computer sitting inside the keyboard itself.")}
            {p('It sounds strange. A keyboard is just an input device — why would it have its own computer? But inside a keyboard there is usually a small controller chip, holding processor logic, a little memory, and the keyboard\'s firmware. Its job is to detect key presses and turn them into input data that means something to the computer.')}
            {p('In many keyboards the keys are arranged as a matrix — each key sits at the intersection of a row and a column. The controller keeps scanning that matrix to see which key\'s electrical state changed. No separate wire has to run to every key; the meeting point of a row and a column is what identifies the key.')}
            {p('As long as no key is pressed, nothing shows up on any column. But the moment a key goes down, two metal contacts under that key touch, completing the circuit between that row and that column, and the chip sees voltage on that column.')}
            <Diagram art={ART_SCAN} bnLabel="scan cycle" enLabel="scan cycle" />
            {p(<>Say the {"'A'"} key press is detected. On a USB keyboard the controller typically sends an input report to the host using the <Term id="hid">USB HID</Term> (Human Interface Device) protocol. That report can carry a specific usage code for the {"'A'"} key — in the USB HID Usage Tables, {MONO('0x04')} is "Keyboard a and A".</>)}
            {p(<>Note what that {MONO('0x04')} is not: it isn't the ASCII code for the character {"'A'"}. It is a code for which key on the keyboard is being talked about. Turning it into a character happens later, at the OS level — change the layout and the same key can become a different letter.</>)}
            {p("So before the laptop's main CPU knows anything at all, the keyboard's own controller has already done a complete piece of work. An electrical change was read, a decision was made, digital input information was produced.")}
            {p(<>And that little controller's processor runs by <a href="/writing/heartbeat-fde" style={LINK}>the same rules</a> we've seen throughout this series — fetch, decode, execute. Just at a much smaller scale. Press a key on the instrument below to watch the scan cycle:</>)}
          </div>
        )}
        <KeyMatrixScan />
      </Section>

      <Section num="02" bnH2="Interrupt: CPU-কে জানানো" enH2="Interrupt: telling the CPU">
        {bn ? (
          <div lang="bn" style={body}>
            {p('USB-এর মাধ্যমে keyboard-এর input information laptop-এ পৌঁছাল। Motherboard-এ বসে থাকা USB controller সেটা receive করল — এই controller একটা আলাদা chip, CPU-র বাইরে, যার কাজ USB device-এর সঙ্গে কথা বলা।')}
            {p('এখন data এসেছে, কিন্তু CPU এই মুহূর্তে অন্য কাজ করতে পারে — হয়তো Chrome-এর কোনো JavaScript চালাচ্ছে, বা video decode করছে। তাকে জানাতে হবে যে একটা hardware event ঘটেছে।')}
            {p(<>এই জানানোর একটা mechanism হলো <Term id="interrupt">interrupt</Term>। USB subsystem host CPU-কে জানায় যে নতুন data এসেছে, আর CPU তার বর্তমান execution-এর উপযুক্ত point থেকে interrupt handling-এর দিকে যায়।</>)}
            {p('তার আগে CPU-কে এতটুকু state সংরক্ষণ করতে হয়, যাতে পরে আগের execution-এ ফিরে আসা যায়। তারপর privileged OS code interrupt-এর কাজটা সামলায়।')}
            {p(<>এখানে একটা গুরুত্বপূর্ণ distinction: <strong>interrupt আসা মানেই context switch নয়।</strong> Interrupt handle করার পর CPU আগের কাজেই ফিরে যেতে পারে। আবার interrupt handling-এর ফলে কোনো task runnable হলে scheduler পরে অন্য task-কে CPU-তে চালাতেও পারে।</>)}
            <Diagram art={ART_INTERRUPT} bnLabel="interrupt handling" enLabel="interrupt handling" />
            {p('অর্থাৎ interrupt মূলত একটা বার্তা — "CPU, hardware-এ একটা event ঘটেছে, এটা handle করো।"')}
          </div>
        ) : (
          <div style={body}>
            {p("The keyboard's input information reached the laptop over USB. The USB controller sitting on the motherboard received it — a separate chip, outside the CPU, whose job is talking to USB devices.")}
            {p("The data has arrived, but the CPU may be busy with something else right now — running some Chrome JavaScript, decoding a video. It has to be told that a hardware event happened.")}
            {p(<>One mechanism for telling it is an <Term id="interrupt">interrupt</Term>. The USB subsystem signals the host CPU that new data has arrived, and the CPU moves from a suitable point in its current execution into interrupt handling.</>)}
            {p('Before that, the CPU has to preserve enough state to be able to return to the previous execution afterwards. Then privileged OS code handles the interrupt\'s work.')}
            {p(<>An important distinction here: <strong>an interrupt arriving does not mean a context switch.</strong> After handling the interrupt, the CPU can go straight back to what it was doing. Or, if the interrupt handling made some task runnable, the scheduler may later run a different task on the CPU.</>)}
            <Diagram art={ART_INTERRUPT} bnLabel="interrupt handling" enLabel="interrupt handling" />
            {p('So an interrupt is essentially one message — "CPU, an event happened in hardware; handle it."')}
          </div>
        )}
      </Section>

      <Section num="03" bnH2="OS-এর ভেতরে: এই event কার জন্য?" enH2="Inside the OS: who is this event for?">
        {bn ? (
          <div lang="bn" style={body}>
            {p('Interrupt handler চলতে শুরু করে। এই handler আসলে কী জিনিস? এটা Linux বা Windows kernel-এর একটা অংশ, যেটা বছর কয়েক আগে কোনো developer লিখেছিলেন। তারপর সেটা compile হয়ে machine code হয়েছে, আর আপনার laptop boot হওয়ার সময় সেই machine code memory-তে load হয়েছে। এই মুহূর্তে সেই বহু পুরনো compiled code-ই চলছে।')}
            {p('তারপর OS-এর keyboard driver সেই input data পড়ে বোঝে — কোন key চাপা হয়েছে। সেখান থেকে OS একটা keyboard event তৈরি করে নিজের উপরের স্তরে পাঠিয়ে দেয়।')}
            {p('এখন প্রশ্ন — এই event কোন application-এর জন্য? আপনার laptop-এ তো এই মুহূর্তে অনেকগুলো program চলছে। Key press সাধারণত সবাইকে পাঠানো হয় না।')}
            {p('Desktop-এর input/window system জানে কোন window এই মুহূর্তে focused। ধরা যাক সেটা VS Code। তাহলে event সেই application-এর জন্য deliver করা হবে।')}
            {p('এরপর application যদি এই মুহূর্তে CPU-তে না চলে, তাকে runnable করা হতে পারে। Scheduler তার policy অনুযায়ী পরে তাকে CPU-তে চালানোর সুযোগ দেয়।')}
            <Diagram art={ART_EVENT} bnLabel="event delivery" enLabel="event delivery" />
            {p(<>এখানেও আগের distinction-টা মনে রাখুন — <strong>event আসা আর context switch একই ঘটনা নয়।</strong> Application তখন CPU-তেই থাকতে পারে; তখন আলাদা করে context switch-এর দরকার নাও হতে পারে।</>)}
            {p(<>আর যদি সত্যিই অন্য process-এর thread থেকে VS Code-এর thread-এ execution যায়, তখন প্রয়োজন অনুযায়ী তাদের execution state আর virtual memory context বদলায় — <a href="/writing/os-grand-conductor" style={LINK}>Article 6</a>-এ যেভাবে দেখেছিলাম।</>)}
          </div>
        ) : (
          <div style={body}>
            {p("The interrupt handler starts running. What is this handler, exactly? It's a piece of the Linux or Windows kernel that some developer wrote years ago. That code was then compiled into machine code, and when your laptop booted, that machine code was loaded into memory. Right now, that very old compiled code is what's running.")}
            {p("Then the OS's keyboard driver reads that input data and works out which key was pressed. From there the OS builds a keyboard event and passes it up to its own higher layers.")}
            {p('Now the question — which application is this event for? Plenty of programs are running on your laptop at this moment, and a key press is usually not sent to all of them.')}
            {p("The desktop's input/window system knows which window is focused right now. Say that's VS Code. Then the event is delivered for that application.")}
            {p("If that application isn't running on the CPU at this moment, it can be made runnable. The scheduler, following its policy, later gives it a turn on the CPU.")}
            <Diagram art={ART_EVENT} bnLabel="event delivery" enLabel="event delivery" />
            {p(<>Keep the earlier distinction in mind here too — <strong>an event arriving and a context switch are not the same event.</strong> The application may already be on the CPU; then no separate context switch is necessarily needed.</>)}
            {p(<>And if execution really does move from another process's thread to VS Code's thread, then their execution state and virtual memory context change as needed — exactly as we saw in <a href="/writing/os-grand-conductor" style={LINK}>Article 6</a>.</>)}
          </div>
        )}
      </Section>

      <Section num="04" bnH2="App জেগে উঠল" enH2="The app wakes up">
        {bn ? (
          <div lang="bn" style={body}>
            {p('ধরুন আপনি একটা text editor-এ টাইপ করছেন — এই মুহূর্তে সেটাই focused application। Event তার কাছে পৌঁছায়, আর application-এর ভেতরের একটা event handler বুঝতে পারে: user একটা key চেপেছে।')}
            {p('তবে event সাধারণত app-কে মাঝপথে ধাক্কা দিয়ে থামায় না। App-এর নিজের একটা loop আছে, যেটা একটার পর একটা event নিয়ে কাজ করে। আমাদের keypress সেই সারিতেই গিয়ে বসেছিল, আর app CPU-তে সুযোগ পেয়ে সেটা তুলে নিয়েছে।')}
            <Diagram art={ART_APPLOOP} bnLabel="app-এর loop" enLabel="the app loop" />
            {p(<>"State update" বলতে এখানে কী বোঝায়? Editor-এর কাছে আপনার file-টা memory-তে একটা data structure হিসেবে আছে — মোটামুটি character-এর একটা তালিকা। <a href="/writing/how-does-anything-become-bits" style={LINK}>Article 2</a>-তে দেখেছি, প্রতিটা character memory-তে সংখ্যা হিসেবেই থাকে। তাই কাজটা আসলে এই — cursor যেখানে আছে সেখানে সেই সংখ্যাটা ঢোকানো, আর cursor এক ধাপ এগিয়ে দেওয়া।</>)}
            {p('আর একটা keypress-এ প্রায়ই এর চেয়ে বেশি কিছু ঘটে। Undo history-তে একটা entry যোগ হয়, যাতে Ctrl+Z কাজ করে। Syntax highlighting আবার হিসাব হয়। Autocomplete হয়তো নতুন suggestion খুঁজতে শুরু করে। এক অক্ষর টাইপ করলেও editor-এর ভেতরে কয়েকটা ছোট কাজ একসঙ্গে জেগে ওঠে।')}
            {p('কিন্তু খেয়াল করুন — app নিজে screen-এ কিছু আঁকেনি। সে শুধু নিজের state বদলেছে, আর ঠিক করেছে UI-র কোন অংশটা আবার আঁকা দরকার। আঁকার কাজটা এর পরের ধাপ।')}
            {p('আর "আঁকা" মানে screen-এ pixel বসানো। কোন pixel-এ কী রং হবে, সেটা কে ঠিক করবে?')}
          </div>
        ) : (
          <div style={body}>
            {p("Say you're typing in a text editor — that's the focused application right now. The event reaches it, and a handler inside the application works out that the user pressed a key.")}
            {p("The event usually doesn't barge in and stop the app mid-work, though. The app has its own loop, taking one event after another. Our keypress went and sat in that queue, and the app picked it up once it got its turn on the CPU.")}
            <Diagram art={ART_APPLOOP} bnLabel="app-এর loop" enLabel="the app loop" />
            {p(<>And what does "updating state" mean here? To the editor, your file is a data structure in memory — roughly a list of characters. As we saw in <a href="/writing/how-does-anything-become-bits" style={LINK}>Article 2</a>, every character sits in memory as a number. So the actual work is this: put that number in where the cursor is, and move the cursor one step along.</>)}
            {p("And a single keypress usually sets off more than that. An entry goes into the undo history, so Ctrl+Z will work. Syntax highlighting gets recomputed. Autocomplete may start looking for fresh suggestions. Type one character and several small jobs wake up inside the editor together.")}
            {p("But notice — the app hasn't drawn anything on the screen. It only changed its own state and decided which part of the UI needs redrawing. The drawing is the next step.")}
            {p('And "drawing" means placing pixels on the screen. Who decides which pixel gets what colour?')}
          </div>
        )}
      </Section>

      <Section num="05" bnH2="অক্ষর থেকে pixel" enH2="From character to pixel">
        {bn ? (
          <div lang="bn" style={body}>
            {p('এখানে font system কাজে নামে। আপনার editor-এ যে font ব্যবহার করছেন — Consolas, Fira Code, যাই হোক — তার font data system বা application-এর memory/cache-এ আগে থেকেই থাকতে পারে। না থাকলে প্রয়োজন অনুযায়ী load করা হয়।')}
            {p('Font file-এ প্রতিটা character-এর জন্য একটা করে shape-এর বর্ণনা থাকে। বেশিরভাগ modern font-এ সেই বর্ণনা vector আকারে — মানে গাণিতিক curve দিয়ে বলা থাকে অক্ষরটার আকৃতি কেমন হবে। এর সুবিধা হলো, যেকোনো size-এ scale করলেও অক্ষরটা ঝাপসা হয় না।')}
            {p(<>কিন্তু display-এ শেষ পর্যন্ত pixel দরকার। তাই সেই shape-কে আপনার current font size অনুযায়ী pixel grid-এর ওপর বসাতে হয়। এই প্রক্রিয়ার নাম <Term id="rasterization">rasterization</Term>।</>)}
            <Diagram art={ART_RASTER} bnLabel="rasterization" enLabel="rasterization" />
            {p(<>এখন {"'A'"} আর শুধু একটা character হিসেবে নেই। তার shape screen-এর ছোট একটা অঞ্চলের pixel information-এ পরিণত হয়েছে, যার প্রতিটা pixel-এর জন্য brightness বা color information দরকার। <a href="/writing/how-does-anything-become-bits" style={LINK}>Article 2</a>-তে দেখেছিলাম কীভাবে ছবির pixel value শেষ পর্যন্ত bit-এ represent হয় — এখানেও সেই একই idea ফিরে এল। একটা abstract অক্ষর ধীরে ধীরে screen-এর physical image-এর দিকে এগোচ্ছে। নিচের যন্ত্রে vector থেকে pixel-এ যাওয়াটা দেখুন:</>)}
          </div>
        ) : (
          <div style={body}>
            {p("This is where the font system comes in. The font you're using in your editor — Consolas, Fira Code, whatever it is — may already have its data in system or application memory or cache. If not, it gets loaded as needed.")}
            {p('A font file contains a shape description for every character. In most modern fonts, that description is in vector form — the shape of the letter is described mathematically with curves. The advantage is that scaling to any size keeps the letter crisp.')}
            {p(<>But a display ultimately needs pixels. So that shape has to be laid onto a pixel grid according to your current font size. That process is called <Term id="rasterization">rasterization</Term>.</>)}
            <Diagram art={ART_RASTER} bnLabel="rasterization" enLabel="rasterization" />
            {p(<>Now {"'A'"} is no longer just a character. Its shape has become pixel information for a small region of the screen, where every pixel needs brightness or colour information. In <a href="/writing/how-does-anything-become-bits" style={LINK}>Article 2</a> we saw how an image's pixel values end up represented as bits — the same idea has come back here. An abstract character is moving, step by step, toward a physical image on screen. Watch a vector become pixels on the instrument below:</>)}
          </div>
        )}
        <Rasterize />
      </Section>

      <Section num="06" bnH2="Frame থেকে আলো" enH2="From frame to light">
        {bn ? (
          <div lang="bn" style={body}>
            {p(<>এখন application-এর updated UI-কে screen-এর জন্য একটা final image-এ পরিণত করতে হবে। <Term id="compositor">Window compositor</Term> বিভিন্ন visible window-এর content একত্র করে screen-এর final frame তৈরি করতে পারে — সে জানে কোন window কোথায় বসানো।</>)}
            {p(<>তারপর graphics/display pipeline সেই frame-কে একটা <Term id="framebuffer">display buffer</Term>-এ প্রস্তুত করে, যেখান থেকে display hardware সেটা monitor-এর দিকে পাঠাতে পারে।</>)}
            <Diagram art={ART_DISPLAY} bnLabel="display path" enLabel="display path" />
            {p('60 Hz display হলে screen প্রতি second-এ ৬০টা refresh cycle চালায় — প্রতিটা cycle মোটামুটি ১৬.৬৭ millisecond। তবে এর মানে এই নয় যে GPU ঠিক প্রতি ১৬.৬৭ ms অন্তর পুরো ছবিটা একসাথে cable-এ ছুঁড়ে দেয়; display system frame-এর data ধারাবাহিকভাবে scan out করে।')}
            {p('HDMI বা DisplayPort cable-এর মধ্য দিয়ে সেই digital information electrical signal হিসেবে যায়, আর তার মাধ্যমে pixel data ও display control information monitor-এ পৌঁছায়।')}
            {p(<>এই সিরিজের <a href="/writing/whats-inside-a-bit" style={LINK}>একদম প্রথম আর্টিকেলে</a> আমরা যেখান থেকে শুরু করেছিলাম, ঘুরে ফিরে সেই electrical signal-এই ফিরে এলাম।</>)}
            {p('Monitor-এর ভেতরের display electronics সেই data অনুযায়ী panel drive করে। LCD-তে liquid crystal দিয়ে ঠিক করা হয় backlight-এর কতটা আলো প্রতিটা pixel দিয়ে যাবে; OLED-এ প্রতিটা pixel নিজেই আলো তৈরি করে।')}
            {p("'A'-এর shape অনুযায়ী নির্দিষ্ট pixel-গুলোতে উপযুক্ত আলো তৈরি হলো। Photon বেরিয়ে এসে আপনার চোখে পড়ল।")}
            {p("আপনি screen-এ 'A' দেখলেন।")}
          </div>
        ) : (
          <div style={body}>
            {p(<>Now the application's updated UI has to become one final image for the screen. A <Term id="compositor">window compositor</Term> can combine the content of the visible windows into the screen's final frame — it knows where each window sits.</>)}
            {p(<>The graphics/display pipeline then prepares that frame in a <Term id="framebuffer">display buffer</Term>, from which the display hardware can send it toward the monitor.</>)}
            <Diagram art={ART_DISPLAY} bnLabel="display path" enLabel="display path" />
            {p('On a 60 Hz display the screen runs 60 refresh cycles per second — roughly 16.67 milliseconds each. But that does not mean the GPU flings the whole picture down the cable once every 16.67 ms; the display system scans out the frame data continuously.')}
            {p('Through an HDMI or DisplayPort cable that digital information travels as electrical signals, carrying pixel data and display control information to the monitor.')}
            {p(<>Which brings us back to the electrical signals we started from in <a href="/writing/whats-inside-a-bit" style={LINK}>the very first article</a> of this series.</>)}
            {p("The display electronics inside the monitor drive the panel according to that data. In an LCD, liquid crystal decides how much of the backlight passes through each pixel; in OLED, each pixel generates its own light.")}
            {p("The pixels matching the shape of 'A' produced the right light. Photons left the glass and hit your eye.")}
            {p("You saw 'A' on the screen.")}
          </div>
        )}
      </Section>

      <Section num="07" bnH2="একটামাত্র keypress-এ কতগুলো layer" enH2="How many layers in one keypress">
        {bn ? (
          <div lang="bn" style={body}>
            {p('আপনার কাছে পুরোটা instant মনে হয়েছে। এক আঙুলের চাপ, সাথে সাথে অক্ষর। নিচের যন্ত্রে পুরো relay-টা এক ধাপ এক ধাপ করে চালিয়ে দেখুন — keypress থেকে চোখে আলো পর্যন্ত:')}
          </div>
        ) : (
          <div style={body}>
            {p('The whole thing felt instant to you. One press of a finger, and immediately a letter. Step (or run) the full relay below — from keypress to light in your eye:')}
          </div>
        )}
        <FullRelay />
        {bn ? (
          <div lang="bn" style={body}>
            {p('কিন্তু এই ছোট্ট ঘটনার ভেতরে আমরা অনেকগুলো layer দেখতে পেলাম:')}
            <Diagram art={ART_LAYERS} bnLabel="the whole chain" enLabel="the whole chain" />
            {p('প্রতিটা layer-এর কাজ আলাদা। Keyboard জানে না VS Code কীভাবে text edit করে। OS জানে না \'A\'-এর glyph দেখতে কেমন। Font system জানে না keyboard থেকে event কীভাবে এসেছে। Display hardware জানে না আপনি কোন editor ব্যবহার করছেন।')}
            {p('তবু তারা একে অন্যের সঙ্গে কাজ করতে পারে। কেন?')}
            {p('কারণ প্রতিটা layer-এর মধ্যে একটা defined interface আছে — এক layer কী ধরনের information দেবে, পরের layer সেটাকে কীভাবে interpret করবে, আর তার output কী হবে।')}
            {p(<>এই ধারণাটাই <Term id="abstraction">abstraction</Term>। একটা layer-এর ভেতরটা না জেনেও তার interface ব্যবহার করা যায়।</>)}
            {p('এই কারণেই keyboard-এর firmware লেখা engineer-কে VS Code-এর code বুঝতে হয় না। আর VS Code-এর developer-কে LCD panel-এর liquid crystal physics বুঝে keypress handler লিখতে হয় না।')}
            {p('আধুনিক computing-এর বিশাল complexity সামলানোর অন্যতম বড় কৌশল এটাই — প্রতিটা layer নিজের কাজটা করে, আর অন্য layer-এর সঙ্গে একটা defined interface দিয়ে কথা বলে।')}
          </div>
        ) : (
          <div style={body}>
            {p('But inside that small event, we got to see a lot of layers:')}
            <Diagram art={ART_LAYERS} bnLabel="the whole chain" enLabel="the whole chain" />
            {p("Each layer has a different job. The keyboard doesn't know how VS Code edits text. The OS doesn't know what the glyph for 'A' looks like. The font system doesn't know how the event arrived from the keyboard. The display hardware doesn't know which editor you're using.")}
            {p('And yet they work with one another. Why?')}
            {p('Because between each layer there is a defined interface — what kind of information one layer hands over, how the next one interprets it, and what comes back out.')}
            {p(<>That idea is <Term id="abstraction">abstraction</Term>. You can use a layer's interface without knowing what's inside it.</>)}
            {p("Which is why the engineer writing a keyboard's firmware doesn't have to understand VS Code's code. And a VS Code developer doesn't have to understand the liquid-crystal physics of an LCD panel to write a keypress handler.")}
            {p('That is one of the biggest tricks for handling the sheer complexity of modern computing — every layer does its own job and talks to the others through a defined interface.')}
          </div>
        )}
        <Recap>
          {bn ? (
            <>
              <li>Keyboard-এর ভেতরে নিজের একটা controller আছে — সে সারি-কলামের matrix scan করে, input report বানায়, USB HID দিয়ে পাঠায়।</li>
              <li>Interrupt হলো CPU-কে hardware event জানানোর একটা mechanism — আর interrupt আসা মানেই context switch নয়।</li>
              <li>OS-এর input machinery event তৈরি করে, focused application-এর জন্য deliver করে; দরকার হলে scheduler তাকে CPU-তে চালায়।</li>
              <li>Application event handle করে নিজের state বদলায়; font system অক্ষরের shape-কে rasterize করে pixel information বানায়।</li>
              <li>Compositor → final frame → display buffer → cable → monitor-এর pixel আলো ছাড়ে। ঘুরে সেই electrical signal-এই ফেরত।</li>
              <li>প্রতিটা layer নিজের কাজ করে আর defined interface দিয়ে পরেরজনের সঙ্গে কথা বলে — এটাই abstraction।</li>
            </>
          ) : (
            <>
              <li>A keyboard has its own controller inside — it scans a row/column matrix, builds an input report, and sends it over USB HID.</li>
              <li>An interrupt is one mechanism for telling the CPU about a hardware event — and an interrupt arriving does not mean a context switch.</li>
              <li>The OS's input machinery builds an event and delivers it for the focused application; where needed, the scheduler gives that app the CPU.</li>
              <li>The application handles the event and changes its own state; the font system rasterizes the letter's shape into pixel information.</li>
              <li>Compositor → final frame → display buffer → cable → the monitor's pixels emit light. Back to the electrical signals we began with.</li>
              <li>Every layer does its own job and talks to the next through a defined interface — that's abstraction.</li>
            </>
          )}
        </Recap>
      </Section>

      <Section num="08" bnH2="সিরিজের শেষে" enH2="At the end of the series">
        {bn ? (
          <div lang="bn" style={body}>
            {p(<>আটটা আর্টিকেল আগে শুরু করেছিলাম একটা সহজ প্রশ্ন দিয়ে — {MONO('x = 5')} লিখলে সেই ৫ সংখ্যাটা কম্পিউটারের কোথায় যায়?</>)}
            {p('উত্তরটা খুঁজতে গিয়ে আমাদের অনেক দূর যেতে হয়েছে। Transistor থেকে শুরু করে logic gate, gate থেকে latch, latch থেকে register। তারপর binary representation, CPU-র ভেতরের ALU আর datapath, fetch-decode-execute-এর অবিরাম চক্র। এরপর memory hierarchy, cache-এর চতুরতা, locality-র সৌন্দর্য। তারপর operating system — process, scheduling, virtual memory, system call। আর শেষে compiler, interpreter, bytecode, VM আর JIT — source code কীভাবে execution-এর দিকে এগোয়।')}
            {p('সবশেষে keyboard-এর অক্ষর থেকে screen-এর অক্ষর পর্যন্ত পুরো journey-টা একসাথে দেখলাম।')}
            {p('এই সিরিজ পড়ে আপনি নতুন CPU design করতে পারবেন না। সেটা উদ্দেশ্যও ছিল না। উদ্দেশ্য ছিল একটা mental map তৈরি করা।')}
            {p('আমরা প্রতিদিন এমন সব tool ব্যবহার করি যাদের ভেতরের অনেক layer নিয়ে ভাবি না। React লিখি, browser-এর rendering system নিয়ে না ভেবেও। Docker চালাই, container-এর নিচে কী হচ্ছে না জেনেও। এটা খারাপ কিছু নয় — abstraction-এর উদ্দেশ্যই তো আপনাকে সব layer একসাথে মাথায় রাখতে না দেওয়া।')}
            {p('কিন্তু কিছু ভেঙে গেলে সেই abstraction-এর নিচে একটু তাকাতে পারা কাজে দেয়। App slow হলে এখন অন্তত ভাবতে পারবেন — computation, memory, I/O, scheduling, rendering, নাকি অন্য কোনো layer? Memory নিয়ে সমস্যা হলে heap আর virtual memory-র কথা মনে পড়বে। Input বা display নিয়ে গোলমাল হলে keyboard থেকে screen পর্যন্ত এই পুরো chain-টা মাথায় আসতে পারে।')}
            {p('সবচেয়ে বড় কথা, machine আর আগের মতো রহস্যময় থাকবে না। ঢাকনা খুলে ইঞ্জিনটা একবার দেখা হয়ে গেছে। ভেতরে কোনো জাদু নেই — আছে electrical signal, logic, software, interface, আর মানুষের তৈরি অনেকগুলো চতুর abstraction।')}
            {p('সেটুকু জানাই যথেষ্ট।')}
            <p style={{ margin: '0 0 16px', fontFamily: "'Departure Mono',monospace", fontSize: 13, color: '#00753F' }}>পড়ার জন্য ধন্যবাদ। ভালো থাকবেন।</p>
          </div>
        ) : (
          <div style={body}>
            {p(<>Eight articles ago we started with a simple question — when you write {MONO('x = 5')}, where does that 5 go inside the computer?</>)}
            {p('Finding that answer took us a long way. From transistors to logic gates, gates to latches, latches to registers. Then binary representation, the ALU and datapath inside a CPU, the endless cycle of fetch-decode-execute. Then memory hierarchy, the cleverness of caches, the beauty of locality. Then the operating system — processes, scheduling, virtual memory, system calls. And finally compilers, interpreters, bytecode, VMs and JITs — how source code moves toward execution.')}
            {p('And last of all, the whole journey from a letter on the keyboard to a letter on the screen, seen in one piece.')}
            {p("Reading this series won't let you design a new CPU. That was never the goal. The goal was to build a mental map.")}
            {p("Every day we use tools whose inner layers we never think about. We write React without thinking about the browser's rendering system. We run Docker without knowing what happens beneath a container. That's not a bad thing — the whole point of abstraction is to spare you from holding every layer in your head at once.")}
            {p("But when something breaks, being able to look a little way under that abstraction helps. When an app is slow, you can now at least ask — computation, memory, I/O, scheduling, rendering, or some other layer? When there's a memory problem, heaps and virtual memory come to mind. When input or display misbehaves, this whole chain from keyboard to screen is there to think through.")}
            {p("Most of all, the machine won't feel as mysterious anymore. The hood has been opened once and the engine has been looked at. There's no magic inside — just electrical signals, logic, software, interfaces, and a lot of clever abstractions built by people.")}
            {p('Knowing that much is enough.')}
            <p style={{ margin: '0 0 16px', fontFamily: "'Departure Mono',monospace", fontSize: 13, color: '#00753F' }}>Thank you for reading. Take care.</p>
          </div>
        )}
      </Section>

      <Section num="09" bnH2="আরও গভীরে যেতে চাইলে" enH2="If you want to go deeper">
        {bn ? (
          <div lang="bn" style={body}>
            {p('এই সিরিজ ছিল একটা পাখির চোখে দেখা। প্রতিটা topic-ই নিজে একটা পূর্ণ জগত। কোনো একটা layer যদি আপনার ভালো লেগে থাকে, নিচের resource-গুলো থেকে শুরু করতে পারেন। বেশিরভাগই বিনামূল্যে পাওয়া যায়।')}
          </div>
        ) : (
          <div style={body}>
            {p("This series was a bird's-eye view. Each topic is a world of its own. If one of the layers caught your interest, here's where to start. Most of these are free.")}
          </div>
        )}

        {READING.map((group) => (
          <div key={group.enGroup} style={{ margin: '0 0 20px' }}>
            <div
              style={{
                fontFamily: "'Departure Mono',monospace", fontSize: 11.5, color: '#00753F',
                letterSpacing: '0.08em', margin: '0 0 10px',
              }}
            >
              {bn ? group.bnGroup : group.enGroup}
            </div>
            <div style={{ borderLeft: '1px solid #c9bda0', paddingLeft: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {group.items.map((r) => (
                <div key={r.name} {...(bn ? { lang: 'bn' } : {})} style={{ fontSize: 15.5, ...body }}>
                  <em style={{ fontStyle: 'normal', fontWeight: 700 }}>{r.name}</em>
                  {r.where && (
                    <span style={{ fontFamily: "'Departure Mono',monospace", fontSize: '0.8em', color: '#5c5442' }}> ({r.where})</span>
                  )}
                  {' — '}
                  {bn ? r.bn : r.en}
                </div>
              ))}
            </div>
          </div>
        ))}

        {bn ? (
          <div lang="bn" style={body}>
            {p('আমি নিজেও আসলে এখানে দেওয়া প্রত্যেকটা রিসোর্স নিজে ঘেঁটে দেখার সুযোগ পাইনি। তবুও আপনাদের আর আমার নিজের সুবিধার্তে ইন্টারনেট ঘাঁটাঘাঁটি করে রিলেটেড সব রিসোর্স এখানে দিয়ে রাখলাম, যাতে পরে আরও এক্সপ্লোর করা যায়, আরও ভালোভাবে জানা যায়, নিজের জ্ঞানের কমতিগুলো শুধরানো যায়।')}
            {p('শেষ কথা — এই তালিকা দেখে অভিভূত হওয়ার কিছু নেই। সবগুলো পড়তে হবে না। যে একটা জিনিস আপনার কৌতূহল জাগিয়েছে, সেটা নিয়েই শুরু করুন। বাকিটা সময়মতো আসবে।')}
          </div>
        ) : (
          <div style={body}>
            {p("A confession, too — I haven't worked through every resource on this list myself. I went digging around the internet and collected everything related in one place, as much for my own use as for yours, so that any of us can come back later and explore further, understand things better, and patch the gaps in what we know.")}
            {p("One last thing — don't be overwhelmed by this list. You don't need to read all of it. Start with the one thing that made you curious. The rest will come when it comes.")}
          </div>
        )}
      </Section>

      <RelayNav
        hub={{
          label: { bn: 'আগের পর্ব', en: 'previous leg' },
          title: bn ? '০৭ — কোড থেকে মেশিন কোড' : '07 — Code to Machine Code',
          href: '/writing/code-to-machine-code',
          variant: 'hub',
        }}
        next={{
          label: { bn: 'সিরিজ শেষ', en: 'series complete' },
          title: bn ? '↩ সিরিজ hub — আটটা পর্ব একসাথে' : '↩ Series hub — all eight legs',
          href: SERIES_HUB_PATH,
          variant: 'next',
        }}
        bridge={{
          bn: 'এখানেই সিরিজ শেষ। electrical signal থেকে শুরু করে আবার সেখানেই ফেরত — মাঝখানে transistor, gate, register, cache, process, compiler, আর একটা keystroke-এর পুরো যাত্রা। সবগুলো পর্ব একসাথে দেখতে চাইলে hub-এ ফিরে যান।',
          en: "That's the end of the series. From electrical signals back to electrical signals — with transistors, gates, registers, caches, processes, compilers, and one keystroke's full journey in between. Head back to the hub to see all eight legs together.",
        }}
      />
      <Colophon />
    </article>
  );
}
