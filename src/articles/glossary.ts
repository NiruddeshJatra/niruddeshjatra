export interface GlossaryEntry {
  term: string;
  bn: string;
  en: string;
}

export const glossary: Record<string, GlossaryEntry> = {
  bit: {
    term: "bit",
    bn: "Bit বা binary digit হলো তথ্যের একটি logical একক, যার মান দুটোর একটি: ০ অথবা ১। Bit নিজে কোনো voltage নয়। Hardware এই logical মানটাকে কোনো physical অবস্থা দিয়ে প্রকাশ করে — যেমন একটা নির্দিষ্ট voltage range, কিংবা জমা রাখা electrical charge।",
    en: "A bit — binary digit — is a logical unit of information with one of two values: 0 or 1. A bit is not itself a voltage. Hardware represents that logical value with some physical state — a particular voltage range, for example, or a stored electrical charge.",
  },
  voltage: {
    term: "voltage",
    bn: "Voltage হলো দুইটা point-এর মধ্যে electrical \"চাপ\"-এর পার্থক্য — পানির চাপ যেমন pipe-এ পানি ঠেলে, voltage তেমনি তারের মধ্য দিয়ে current চালায়। ভোল্ট (V)-এ মাপা হয়। Digital circuit একটা নির্দিষ্ট voltage range-কে LOW (০) আর আরেকটা range-কে HIGH (১) হিসেবে পড়ে; ঠিক কোন range, সেটা chip-এর technology অনুযায়ী বদলায়।",
    en: "Voltage is the difference in electrical \"pressure\" between two points — the way water pressure pushes water through a pipe, voltage drives current through a wire. Measured in volts (V). A digital circuit reads one voltage range as LOW (0) and another as HIGH (1); which ranges exactly depends on the chip's technology.",
  },
  noisemargin: {
    term: "noise margin",
    bn: "Noise margin হলো LOW আর HIGH-এর মাঝখানের safety gap। Signal-এ ছোটখাটো noise ঢুকলেও, যতক্ষণ সেটা এই gap পার না করে, circuit একই logical মানই পড়ে। Margin যত চওড়া, noise-এর বিরুদ্ধে signal তত নির্ভরযোগ্য। ঠিক কতটা margin থাকবে, তা circuit technology-র ওপর নির্ভর করে।",
    en: "A noise margin is the safety gap between LOW and HIGH. As long as noise on a signal doesn't push it across that gap, the circuit still reads the same logical value. The wider the margin, the more reliable the signal is against noise. The exact margin depends on the circuit technology.",
  },
  serpar: {
    term: 'series / parallel',
    bn: 'Circuit-এ দুইটা component "series"-এ থাকা মানে তারা একই লাইনে যুক্ত — current-কে দুইটার মধ্য দিয়েই যেতে হবে। "Parallel"-এ মানে তারা পাশাপাশি জোড়া — current যেকোনো একটার মধ্য দিয়ে গেলেই হলো। Series মানে "দুইটাই লাগবে" (AND-এর মতো), parallel মানে "যেকোনো একটা চললেই হবে" (OR-এর মতো)।',
    en: 'Two components in "series" sit on the same line — current must pass through both. In "parallel" they sit side by side — current through either one is enough. Series means "both required" (like AND); parallel means "any one will do" (like OR).',
  },
  alu: {
    term: 'ALU',
    bn: 'ALU মানে Arithmetic Logic Unit — CPU-র সেই অংশ যেটা arithmetic (যোগ, বিয়োগ, গুণ, ভাগ) আর logical operations (AND, OR, comparison) করে। ALU সম্পূর্ণভাবে logic gate দিয়ে বানানো — কোনো "processor within processor" না, শুধু অনেকগুলো gate একসাথে সাজানো। যখন আপনি JavaScript-এ a + b লেখেন, শেষ পর্যন্ত সেই দুইটা সংখ্যা ALU-র মধ্য দিয়ে যায় আর যোগফল বের হয়।',
    en: 'ALU means Arithmetic Logic Unit — the part of the CPU that does arithmetic (add, subtract, multiply, divide) and logical operations (AND, OR, comparison). The ALU is built entirely from logic gates — no "processor within a processor," just many gates arranged together. When you write a + b in JavaScript, those two numbers eventually pass through the ALU and the sum comes out.',
  },
  latch: {
    term: "latch",
    bn: "Latch হলো এমন storage circuit যা ১ bit ধরে রাখতে পারে। ভেতরে feedback থাকে বলে circuit-টা দুটো stable অবস্থার একটায় থিতু হয় — একটাকে আমরা ০, অন্যটাকে ১ ধরি। একটা enable signal যতক্ষণ চালু থাকে, ততক্ষণ latch input শোনে; বন্ধ হলে শেষ মানটা ধরে রাখে। Power থাকা পর্যন্ত state টিকে থাকে।",
    en: "A latch is a storage circuit that can hold 1 bit. Feedback inside it makes the circuit settle into one of two stable states — one we call 0, the other 1. While an enable signal is active the latch follows its input; once it goes inactive, the latch holds the last value. The state lasts as long as the circuit stays powered.",
  },
  flipflop: {
    term: "flip-flop",
    bn: "Flip-flop হলো clock-নির্ভর storage element, যা input নেয় শুধু clock-এর একটা নির্দিষ্ট edge-এ (০ থেকে ১ হওয়ার মুহূর্তে, বা উল্টোটায়) — enable চালু থাকার পুরো সময়জুড়ে নয়। Latch আর flip-flop এক জিনিস নয়। CPU-র register সাধারণত flip-flop দিয়ে বানানো হয়, যাতে সব register একই clock edge-এ একসাথে নতুন মান নেয়।",
    en: "A flip-flop is a clocked storage element that takes its input only at a specific clock edge (the moment the clock goes 0→1, or 1→0) — not for the whole time an enable is active. A latch and a flip-flop are not the same thing. CPU registers are commonly built from flip-flops so that every register takes its new value together, on the same clock edge.",
  },
  sram: {
    term: "SRAM",
    bn: "SRAM (Static RAM)-এর প্রতিটা cell দুটো inverter cross-coupled করে বানানো একটা bistable loop, সঙ্গে read-write-এর জন্য বাড়তি দুটো access transistor (সব মিলিয়ে সাধারণত ৬টা transistor)। Power থাকা পর্যন্ত refresh ছাড়াই bit ধরে রাখে — দ্রুত, কিন্তু প্রতি bit-এ জায়গা বেশি লাগে বলে ব্যবহার হয় CPU cache-এর মতো ছোট, দ্রুত memory-তে।",
    en: "Each SRAM (Static RAM) cell is two cross-coupled inverters forming a bistable loop, plus two access transistors for reading and writing (six transistors in all, typically). It holds its bit without refreshing for as long as power is on — fast, but each bit takes a lot of space, so it's used for small, fast memory like CPU caches.",
  },
  dram: {
    term: "DRAM",
    bn: "DRAM (Dynamic RAM)-এ প্রতিটা bit থাকে একটা transistor আর একটা ছোট্ট capacitor-এ, জমা রাখা electrical charge হিসেবে। সেই charge ধীরে ধীরে leak করে, তাই DRAM-কে প্রতি সেকেন্ডে বহুবার refresh করতে হয়। প্রতি bit-এ জায়গা কম লাগে বলে computer-এর main RAM সাধারণত DRAM।",
    en: "In DRAM (Dynamic RAM), each bit is stored as electrical charge in one transistor and a tiny capacitor. That charge slowly leaks away, so DRAM has to be refreshed many times per second. Because each bit takes so little space, a computer's main RAM is usually DRAM.",
  },
  thread: {
    term: 'thread',
    bn: "Thread হলো একটা program-এর ভেতরে code execute করার সবচেয়ে ছোট unit। একটা program-কে factory ধরুন, thread হলো সেই factory-র একেকজন worker। একটা factory-তে multiple worker একসাথে কাজ করতে পারে (multithreading), কিন্তু তারা সবাই একই factory-র resource share করে। ধরা যাক, আপনি MS Word অ্যাপটি ওপেন করেছেন। এখানে পুরো MS Word অ্যাপ্লিকেশনটি হলো একটি Process। এই প্রসেসের ভেতরে ব্যাকগ্রাউন্ডে একসাথে অনেকগুলো কাজ চলে — প্রতিটি আলাদা কাজই একেকটি Thread। আপনি যখন টাইপ করছেন: • থ্রেড ১ (টাইপিং ও ডিসপ্লে) — প্রেস করা অক্ষরগুলো স্ক্রিনে ফুটিয়ে তোলে • থ্রেড ২ (বানান চেক) — ব্যাকগ্রাউন্ডে লাল দাগ দিয়ে ভুল বানান সনাক্ত করে • থ্রেড ৩ (অটো-সেভ) — প্রতি মিনিটে ফাইলটি স্বয়ংক্রিয়ভাবে সেভ করতে থাকে।",
    en: "A thread is the smallest unit of code execution inside a program. Think of a program as a factory; a thread is one worker in that factory. A factory can have multiple workers at once (multithreading), but they all share the factory's resources. Suppose you open MS Word — the whole application is a Process; the separate tasks running inside it are Threads. While you type: • Thread 1 (typing & display) renders your keystrokes on screen • Thread 2 (spell check) underlines misspellings in the background • Thread 3 (auto-save) saves your file every minute so you lose nothing.",
  },
  abstraction: {
    term: 'abstraction',
    bn: 'জটিল mechanism-কে একটা সহজ interface-এর পেছনে লুকিয়ে ফেলা। গাড়ির accelerator-এ চাপ দিলে গাড়ি চলে — engine-এর ভেতরে কী ঘটছে জানতে হয় না। Software-এ প্রতিটা layer-ই নিচের layer-এর abstraction: আপনার কোড → runtime → OS → hardware।',
    en: "Hiding complex machinery behind a simple interface. Press a car's accelerator and it moves — you don't need to know what the engine is doing. In software every layer is an abstraction of the one below: your code → runtime → OS → hardware.",
  },
  twoscomp: {
    term: "two's complement",
    bn: "চিহ্নযুক্ত (পজিটিভ ও নেগেটিভ) পূর্ণসংখ্যা bit-এ রাখার সবচেয়ে প্রচলিত পদ্ধতি। নির্দিষ্ট সংখ্যক bit-এর (যেমন ৮-bit) মধ্যে একটা পজিটিভ সংখ্যার সব bit উল্টে দিয়ে ১ যোগ করলে তার নেগেটিভ রূপ পাওয়া যায়। সুবিধা দুটো: শূন্যের একটাই রূপ থাকে, আর বিয়োগকে যোগ হিসেবে করা যায় (A − B = A + (−B)) — ফলে সামান্য control logic-সহ একই adder circuit দিয়ে যোগ-বিয়োগ দুটোই চলে।",
    en: "The most common way to store signed (positive and negative) integers in bits. Within a fixed width (say, 8 bits), flip every bit of a positive number and add 1 to get its negative. Two advantages: zero has only one form, and subtraction becomes addition (A − B = A + (−B)) — so the same adder circuit, plus a little control logic, handles both.",
  },
  ascii: {
    term: "ASCII",
    bn: "ASCII (American Standard Code for Information Interchange) — computing-এর সবচেয়ে পুরনো character encoding-গুলোর একটা। ৭ bit দিয়ে ১২৮টা code: ইংরেজি অক্ষর, digit, punctuation, আর newline-এর মতো কিছু control character। ১৯৬০-এর দশকে শুধু ইংরেজির কথা ভেবে বানানো। UTF-8-এ প্রথম ১২৮টা code point হুবহু ASCII-র একই byte — তাই ASCII এখনো UTF-8-এর ভেতরে টিকে আছে।",
    en: "ASCII (American Standard Code for Information Interchange) is one of computing's oldest character encodings. 7 bits give 128 codes: English letters, digits, punctuation, and a few control characters such as newline. Designed in the 1960s with only English in mind. UTF-8 uses the exact same bytes for its first 128 code points, so ASCII still lives inside UTF-8.",
  },
  unicode: {
    term: "Unicode",
    bn: "Unicode একটা international standard, যা পৃথিবীর বিভিন্ন লিপির অক্ষর আর symbol-এর জন্য একটা করে code point (পরিচয় নম্বর) ঠিক করে দেয় — যেমন 'ক'-এর code point U+0995। এটা শুধু পরিচয় বণ্টন, encoding নয়। সেই পরিচয় কীভাবে bit-এ লেখা হবে, সেটা ঠিক করে UTF-8-এর মতো encoding।",
    en: "Unicode is an international standard that assigns a code point (an identity number) to characters and symbols across the world's writing systems — U+0995 for 'ক', for example. It only hands out identities; it is not an encoding. How that identity is written as bits is decided by an encoding such as UTF-8.",
  },
  utf8: {
    term: "UTF-8",
    bn: "UTF-8 হলো Unicode code point-কে byte-এ লেখার সবচেয়ে প্রচলিত নিয়ম। Variable-length — একেকটা code point ১ থেকে ৪ byte নেয়। ASCII-র প্রথম ১২৮টা অক্ষর UTF-8-এ হুবহু একই এক byte, তাই পুরনো ASCII text স্বাভাবিকভাবেই valid UTF-8। বাংলা অক্ষরের code point সাধারণত ৩ byte, অনেক emoji ৪ byte নেয়।",
    en: "UTF-8 is the most widely used way to write Unicode code points as bytes. It's variable-length — each code point takes 1 to 4 bytes. ASCII's first 128 characters are the exact same single byte in UTF-8, so old ASCII text is automatically valid UTF-8. A Bangla letter's code point usually takes 3 bytes; many emoji take 4.",
  },
  sampling: {
    term: "sampling",
    bn: "Sampling হলো একটা continuous signal-কে (যেমন শব্দের wave) নিয়মিত বিরতিতে মেপে আলাদা আলাদা সংখ্যায় রূপান্তরের প্রক্রিয়া — অনেকটা video camera যেমন প্রতি সেকেন্ডে অনেকগুলো ছবি তোলে। Sample rate বলে প্রতি সেকেন্ডে কতবার মাপা হচ্ছে।",
    en: "Sampling is turning a continuous signal (like a sound wave) into separate numbers by measuring it at regular intervals — a bit like a video camera taking many pictures per second. The sample rate says how many measurements are taken each second.",
  },
  lossless: {
    term: "lossless compression",
    bn: "Lossless compression data ছোট করে কিছুই না হারিয়ে — decompress করলে হুবহু original byte ফিরে আসে। একটা প্রচলিত কৌশল হলো data-র ভেতরের repetition আর pattern খুঁজে সংক্ষেপে লেখা। Gzip, Brotli, PNG, FLAC — এগুলো lossless। যেখানে হুবহু original দরকার (code, text, database), সেখানে এটাই ব্যবহার হয়।",
    en: "Lossless compression shrinks data without losing anything — decompress it and you get the exact original bytes back. A common approach is to find repetition and patterns in the data and write them more compactly. Gzip, Brotli, PNG, FLAC — all lossless. It's what you use wherever the exact original matters (code, text, databases).",
  },
  propdelay: {
    term: 'propagation delay',
    bn: 'Electrical signal instantaneously এক জায়গা থেকে আরেক জায়গায় পৌঁছায় না। Input বদলানোর পর সেই পরিবর্তন gate-গুলোর মধ্য দিয়ে propagate করে output-এ পৌঁছাতে যে সময় লাগে, সেটাই propagation delay। প্রতিটা gate পার হতে কয়েক picosecond লাগে, আর একটা বড় combinational circuit-এ সেই delay জমে বড় হয় — যেমন ৬৪টা full adder সিরিজে জোড়া থাকলে carry signal-কে পুরো চেইন পেরোতে হয়। এর ব্যবহারিক তাৎপর্য হলো timing: combinational logic-এর output যথেষ্ট stable হওয়ার আগেই যদি পরবর্তী clock edge এসে পড়ে, তাহলে register একটা অর্ধেক-settle হওয়া pattern capture করে ফেলবে — অর্থাৎ ভুল মান। তাই propagation delay-ই ঠিক করে দেয় একটা synchronous design কত দ্রুত clock চালাতে পারে।',
    en: "Electrical signals do not travel instantaneously. Propagation delay is the time it takes for a change at a circuit's input to ripple through its gates and settle at the output. Each gate adds a few picoseconds, and in a large combinational circuit those delays accumulate — chain 64 full adders in series and the carry signal has to cross the whole chain. The practical consequence is timing: if the next clock edge arrives before the combinational output has settled, the register captures a half-settled pattern — a wrong value. Propagation delay is therefore what sets the ceiling on how fast a synchronous design can be clocked.",
  },
  combinational: {
    term: 'combinational logic',
    bn: 'Combinational logic হলো এমন circuit যার output শুধু তার বর্তমান input-এর উপর নির্ভর করে — অতীতের কোনো স্মৃতি নেই। Logic gate, adder, MUX, ALU — সবই combinational। এদের কেউ "চালু" করে দেয় না; input বা control signal বদলালেই output নিজে থেকে propagation delay-এর পর নতুন মানে settle করে। এই কারণেই clock combinational logic-কে "এখন হিসাব করো" বলে না — clock না থাকলেও এরা তাদের input অনুযায়ী respond করতেই থাকে।',
    en: 'Combinational logic is any circuit whose output depends only on its present inputs — it has no memory of the past. Logic gates, adders, MUXes, and ALUs are all combinational. Nothing "switches them on": when an input or control signal changes, the output settles to a new value on its own after the propagation delay. This is why the clock never tells combinational logic to "compute now" — it keeps responding to its inputs whether or not a clock edge has arrived.',
  },
  sequential: {
    term: 'sequential logic',
    bn: 'Sequential logic-এর output শুধু বর্তমান input-এর উপর নির্ভর করে না, তার সংরক্ষিত state-এর উপরও নির্ভর করে — অর্থাৎ এর স্মৃতি আছে। Latch, flip-flop, register, counter — সবই sequential। Combinational logic হিসাব করে, আর sequential logic সেই হিসাবের ফল ধরে রাখে। এবং যেহেতু state ধরে রাখতে হয়, তাই কখন নতুন মান গ্রহণ করা হবে সেটা ঠিক করে দেওয়ার জন্য একটা timing rule দরকার — সাধারণত clock edge।',
    en: "Sequential logic's output depends not only on its current inputs but also on stored state — it has memory. Latches, flip-flops, registers, and counters are all sequential. Combinational logic computes; sequential logic holds the result. And because it holds state, it needs a timing rule that decides when a new value may be accepted — usually a clock edge.",
  },
  mux: {
    term: 'multiplexer (MUX)',
    bn: 'Multiplexer হলো একটা electronic selector — অনেকগুলো input line, একটা output line, আর একটা select signal যা ঠিক করে কোন input-টা output-এ দেখা যাবে। n-টা select bit দিয়ে 2ⁿ-টা input-এর মধ্যে বেছে নেওয়া যায়। এটা traffic police নয় যে অন্য register-কে ঠেলে সরিয়ে দেয়; selection-এর কাজটা MUX-এর নিজের ভেতরের gate-গুলোই করে। MUX combinational — clock-এর tick-এর জন্য অপেক্ষা করে না, select বা input বদলালে propagation delay-এর পরেই output বদলে যায়।',
    en: 'A multiplexer is an electronic selector — several input lines, one output line, and a select signal that decides which input appears at the output. With n select bits you can choose among 2ⁿ inputs. It is not a traffic cop shoving other registers out of the way; the selection happens inside the MUX\'s own gates. A MUX is combinational — it never waits for a clock tick; change the select or an input and the output follows after the propagation delay.',
  },
  decoder: {
    term: 'decoder',
    bn: 'Decoder একটা binary code-কে "one-hot" output-এ অনুবাদ করে — n-bit input থেকে 2ⁿ-টা output line, যার মধ্যে ঠিক একটা active হয়। CPU-র register file-এ এটাই destination address-কে write-enable signal-এ রূপান্তর করে: ২-bit code `10` এলে decoder শুধু Register C-র WE line-টা 1 করে, বাকিগুলো 0 রাখে। Decoder result-কে physically ঠেলে কোনো register-এ পাঠায় না — সে শুধু ঠিক করে দেয় কোন register নতুন মান capture করার অনুমতি পাবে।',
    en: 'A decoder translates a binary code into a "one-hot" output — n input bits drive 2ⁿ output lines, exactly one of which goes active. In a CPU register file this is what turns a destination address into write-enable signals: feed it the 2-bit code `10` and it raises only Register C\'s WE line, leaving the rest at 0. A decoder never physically pushes a result into a register — it only decides which register is permitted to capture the new value.',
  },
  datapath: {
    term: 'datapath',
    bn: 'Datapath হলো CPU-র সেই পুরো কাঠামো যার মধ্য দিয়ে data এক জায়গা থেকে আরেক জায়গায় যেতে পারে — register, MUX, ALU, এবং এদের সংযোগকারী wire-গুলো মিলিয়ে। Datapath ঠিক করে দেয় কোন কোন route সম্ভব; control logic ঠিক করে সেই মুহূর্তে কোন route-টা ব্যবহার হবে। খেয়াল রাখা দরকার, modern CPU-তে একটামাত্র central data bus থাকে না — অনেক ধরনের internal path আর interconnect থাকে; "একটা 64-wire হাইওয়ে" হলো শেখার সুবিধার জন্য বানানো একটা simplified model।',
    en: 'The datapath is the whole structure through which data can move inside a CPU — the registers, MUXes, ALU, and the wires that connect them. The datapath defines which routes are possible; control logic decides which route is used at a given moment. Note that a modern CPU does not contain one central data bus — it has many internal paths and interconnects; "a single 64-wire highway" is a simplified teaching model.',
  },
  controlsignal: {
    term: 'control signal',
    bn: 'Control signal হলো সেই wire-গুলো যারা data বহন করে না, বরং datapath-কে configure করে — কোন MUX কোন input বেছে নেবে, ALU কোন operation করবে, কোন register-এর write enable active হবে। এক কথায়: control signal ঠিক করে "কী" হবে, আর clock ঠিক করে "কখন" নতুন state capture হবে। পরের article-এ দেখব এই signal-গুলো আসলে instruction-এর bit থেকে তৈরি হয়।',
    en: 'Control signals are the wires that carry no data but configure the datapath — which input a MUX selects, which operation the ALU performs, which register has its write enable raised. In one line: control signals decide WHAT happens; the clock decides WHEN the new state is captured. The next article shows how these signals are generated from the bits of an instruction.',
  },
  clockedge: {
    term: 'clock edge',
    bn: 'Clock signal 0 আর 1-এর মধ্যে দুলতে থাকে; সেই transition-এর মুহূর্তটাই clock edge — 0 থেকে 1 হলে rising edge, 1 থেকে 0 হলে falling edge। Edge-triggered flip-flop শুধু এই মুহূর্তেই তার input-এ থাকা মান capture করে, clock high থাকা পুরো সময়টা জুড়ে নয়। এটাই synchronous design-এর মূল ভিত্তি: clock edge হলো সেই নির্দিষ্ট timing boundary যেখানে "next state" গিয়ে "current state" হয়ে যায়।',
    en: "A clock signal swings between 0 and 1; a clock edge is the instant of that transition — rising for 0→1, falling for 1→0. An edge-triggered flip-flop captures whatever is at its input only at that instant, not throughout the time the clock is high. This is the foundation of synchronous design: the clock edge is the defined timing boundary at which the \"next state\" becomes the \"current state.\"",
  },
  writeenable: {
    term: 'write enable',
    bn: 'Write Enable (WE) হলো একটা control wire যা একটা storage element-কে বলে দেয়, পরবর্তী clock edge-এ সে তার input-এর মান নেবে নাকি পুরনো মানটাই ধরে রাখবে। WE = 0 হলে clock edge এলেও register কিছু বদলায় না; WE = 1 হলে edge-এ নতুন মান ঢুকে যায়। ALU-র result একই সাথে অনেক register-এর input-এ পৌঁছাতে পারে — কিন্তু যার WE active, শুধু সে-ই সেটা capture করে।',
    en: 'Write Enable (WE) is a control wire that tells a storage element whether to take the value at its input on the next clock edge or to keep holding the old one. With WE = 0 the register does not change even when the edge arrives; with WE = 1 the new value lands. An ALU result may reach the inputs of many registers at once — but only the one whose WE is active captures it.',
  },
  register: {
    term: 'register',
    bn: 'Register হলো CPU-র ভেতরের খুব ছোট, খুব দ্রুত storage — কয়েকটা flip-flop পাশাপাশি বসিয়ে বানানো, যার প্রতিটা ১ bit ধরে রাখে (৬৪-bit register মানে ৬৪ bit-এর state)। এখানে operand, address, pointer, intermediate value — CPU-র যে state এই মুহূর্তে দরকার, সব রাখা যায়। ',
    en: 'A register is a very small, very fast storage element inside the CPU — built from flip-flops side by side, each holding 1 bit (a 64-bit register holds 64 bits of state). It can hold operands, addresses, pointers, intermediate values — whatever processor state is needed right now. What separates it from RAM is not merely "distance"; it is storage architecture, size, access mechanism, and latency. Names like AX, BX, or PC sound mysterious, but the fundamental job is the same — holding some binary state.',
  },
  cla: {
    term: 'carry-lookahead adder',
    bn: 'Ripple Carry Adder-এ প্রতিটা bit-এর carry আগের stage-এর ফলাফলের জন্য অপেক্ষা করে, তাই bit বাড়লে worst-case propagation delay-ও বাড়ে। Carry-Lookahead Adder সেই bottleneck কমায়: প্রতিটা bit position থেকে দুটো signal আগেভাগে বের করে নেয় — "generate" (এই position নিজেই carry তৈরি করবে) আর "propagate" (এই position ভেতরে আসা carry-কে পরেরটায় পাঠিয়ে দেবে)। এই দুটো থেকে সব carry একসাথে হিসাব করা যায়, প্রতিটা stage একে একে পেরোতে হয় না। Prefix adder-ও একই ধারণার আরেকটা গঠন। মূল ব্যাপারটা বদলায় না — শেষ পর্যন্ত logic gate-ই sum তৈরি করে।',
    en: 'In a Ripple Carry Adder each bit\'s carry waits on the previous stage, so worst-case propagation delay grows with the number of bits. A Carry-Lookahead Adder attacks that bottleneck: from each bit position it derives two signals up front — "generate" (this position produces a carry by itself) and "propagate" (this position passes an incoming carry along). From those, all the carries can be computed together instead of crossing every stage one at a time. Prefix adders are another arrangement of the same idea. The underlying story is unchanged — logic gates still produce the sum.',
  },
  pc: {
    term: "Program Counter",
    bn: "Program Counter (PC) হলো CPU-র একটা register, যা simplified model-এ ধরে রাখে পরবর্তী instruction কোন memory address থেকে fetch করা হবে। Sequential execution-এ এটি পরের instruction-এর দিকে এগোয়; branch, jump, function call বা return হলে পরের address বদলে যেতে পারে। কোনো কোনো architecture-এ একে Instruction Pointer বলা হয়।",
    en: "The Program Counter (PC) is a CPU register that, in our simplified model, holds the memory address the next instruction will be fetched from. During sequential execution it advances to the next instruction; branches, jumps, calls and returns can change that address instead. Some architectures call it the Instruction Pointer.",
  },
  ir: {
    term: "Instruction Register",
    bn: "Instruction Register (IR) হলো আমাদের simplified CPU model-এর একটা internal storage element, যেখানে fetch করা instruction-এর bits decode হওয়ার সময় ধরে রাখা হয়। বোঝার সুবিধার জন্য ব্যবহার করা একটা conceptual register — বাস্তব modern CPU-তে instruction handling এর চেয়ে অনেক বেশি sophisticated হতে পারে।",
    en: "The Instruction Register (IR) is an internal storage element in our simplified CPU model that holds a fetched instruction's bits while its fields are decoded. It is a useful conceptual register — real modern CPUs handle instructions with far more sophisticated structures.",
  },
  cu: {
    term: "Control Unit",
    bn: "Control Unit (CU) হলো CPU-র সেই control logic, যা instruction-এর field decode করে datapath-এর জন্য প্রয়োজনীয় control signal তৈরি করে। এই signal-গুলো ঠিক করে কোন register select হবে, ALU কোন operation-এর জন্য configure হবে, কোন register-এর write enable active থাকবে। CU নিজে কোনো হিসাব করে না, আর কোনো অংশকে \"চালু\"ও করে না — সে datapath-কে নির্দিষ্ট configuration-এ সেট করে।",
    en: "The Control Unit (CU) is the CPU's control logic: it decodes an instruction's fields and generates the control signals the datapath needs. Those signals decide which registers are selected, which operation the ALU is configured for, and which register has its write enable raised. The CU does no arithmetic of its own and doesn't \"switch parts on\" — it configures the datapath.",
  },
  opcode: {
    term: "Opcode",
    bn: "Opcode (Operation Code) হলো instruction-এর সেই bit field, যা নির্দেশ করে কোন operation করতে হবে — যেমন ADD, SUB না LOAD। আমাদের কাল্পনিক ১৩-bit format-এ opcode হলো প্রথম ৪ bit; বাস্তব instruction format-এ opcode-এর অবস্থান আর size architecture অনুযায়ী আলাদা হয়।",
    en: "The Opcode (Operation Code) is the instruction field that identifies which operation to perform — ADD, SUB or LOAD, for example. In our fictional 13-bit format it's the first 4 bits; in real instruction formats the opcode's position and size vary by architecture.",
  },
  lossy: {
    term: "lossy compression",
    bn: "Lossy compression সাইজ কমাতে কিছু তথ্য বাদ দেয় বা আনুমানিক করে — চেষ্টা থাকে এমন অংশ বেছে নেওয়ার, যেটা হারালে ব্যবহারের ক্ষেত্রে ক্ষতি সবচেয়ে কম। MP3, JPEG, H.264 — এগুলো lossy। Compression অনেক বেশি পাওয়া যায়, কিন্তু decompress করলে হুবহু original আর ফেরে না, আর ক্ষতিটা সবসময় চোখ-কানে অদৃশ্যও থাকে না।",
    en: "Lossy compression shrinks data by discarding or approximating some information — trying to pick the parts whose loss matters least for the intended use. MP3, JPEG, H.264 — all lossy. You get much stronger compression, but decompressing never gives back the exact original, and the loss isn't always invisible.",
  },
  cacheline: {
    term: 'cache line',
    bn: 'Cache line হলো cache-এ data manage করার একটি fixed-size block। অনেক modern processor-এ এর মাপ 64 byte, যদিও exact size architecture অনুযায়ী বদলায়। একটা cache miss-এর সময় requested address-কে ধারণ করা পুরো line memory hierarchy-র নিচের level থেকে আনা হতে পারে, যাতে আশেপাশের data-ও cache-এ পাওয়া যায়। এভাবেই hardware spatial locality কাজে লাগায়।',
    en: 'A cache line is a fixed-size block used to manage data in a cache. Many modern processors use 64-byte cache lines, although the exact size depends on the architecture. On a cache miss, the cache line containing the requested address may be brought in from a lower level of the memory hierarchy so that nearby data is available too — which is how hardware exploits spatial locality.',
  },
  locality: {
    term: 'locality',
    bn: 'অনেক program memory access করার সময় locality দেখায় — দুই রকম। Temporal locality: এই মুহূর্তে যে data access হয়েছে, অল্প সময়ের মধ্যে আবার লাগার সম্ভাবনা থাকে (loop counter-এর মতো)। Spatial locality: এখন যে address access হয়েছে, তার আশেপাশের address-ও শিগগির লাগতে পারে (array sequentially traverse করার মতো)। সব program-এর access pattern predictable নয়, কিন্তু এই দুটো pattern এত common যে পুরো cache hierarchy এদের ওপর ভিত্তি করে দাঁড়ানো।',
    en: "Many programs exhibit locality in how they access memory, in two forms. Temporal locality: data accessed right now is likely to be accessed again soon (a loop counter, say). Spatial locality: when one address is accessed, nearby addresses are often needed soon as well (traversing an array sequentially). Not every program has a predictable access pattern, but these two are common enough that the whole cache hierarchy is built on them.",
  },
  cachecoherence: {
    term: 'cache coherence',
    bn: 'Multi-core CPU-তে প্রতিটা core-এর নিজস্ব L1/L2 cache থাকে। একটা core কোনো variable বদলালে, অন্য core-এর cache-এ থাকা পুরনো copy-টা stale হয়ে যায়। Cache coherence protocol (যেমন MESI — Modified, Exclusive, Shared, Invalid) এই সমস্যা সমাধান করে — কোনো core কিছু বদলালে, বাকি core-দের cache-এ থাকা সেই line-কে "Invalid" ঘোষণা করে দেয়, যাতে কেউ পুরনো ডেটা না পড়ে।',
    en: 'In a multi-core CPU, each core has its own private L1/L2 cache. If one core modifies a variable, the copy sitting in another core\'s cache goes stale. Cache coherence protocols (like MESI — Modified, Exclusive, Shared, Invalid) solve this — when a core writes, it broadcasts an invalidation signal that marks the matching line "Invalid" in every other core\'s cache, so nobody reads stale data.',
  },
  stall: {
    term: 'stall',
    bn: 'Stall হলো সেই অবস্থা, যখন প্রয়োজনীয় data বা result এখনো তৈরি না হওয়ায় CPU-র execution এগোতে পারে না — অপেক্ষা করতে হয়। দূরের memory layer থেকে data আনতে হলে এই অপেক্ষা অনেক লম্বা হতে পারে। Memory hierarchy-র একটা বড় উদ্দেশ্যই হলো এই অপেক্ষা কমানো।',
    en: "A stall is when execution cannot make progress because the data or result it needs is not available yet, so the CPU has to wait. Fetching from a distant memory layer can make that wait long. Reducing these waits is one of the main purposes of the memory hierarchy.",
  },
  cachemiss: {
    term: 'cache hit / miss',
    bn: 'CPU যে data চাইছে সেটা যদি relevant cache-এ পাওয়া যায়, সেটা cache hit — data দ্রুত পাওয়া যায়। না পাওয়া গেলে cache miss, আর request-টা hierarchy-র নিচের level-এ যেতে হয়, যেখানে latency বেশি। তাই একই কাজ করা দুই program-এর মধ্যে hit-miss অনুপাতের পার্থক্য performance-এ বড় পার্থক্য তৈরি করতে পারে।',
    en: "If the data the CPU wants is present in the relevant cache, that is a cache hit and the data arrives quickly. If it is not, that is a cache miss and the request has to travel to a lower, higher-latency level of the hierarchy. Two programs computing the same result can perform very differently purely through their hit-to-miss ratio.",
  },
  volatile: {
    term: 'volatile / non-volatile',
    bn: 'Volatile storage power ছাড়া নিজের stored state নির্ভরযোগ্যভাবে ধরে রাখার জন্য designed নয় — register, cache আর DRAM-based main memory এই দলে। Non-volatile storage (SSD, HDD) power ছাড়াও data ধরে রাখতে পারে। এটা speed-এর নয়, state retention-এর পার্থক্য।',
    en: "Volatile storage is not designed to retain its stored state reliably without power — registers, caches, and DRAM-based main memory are all volatile. Non-volatile storage (SSDs, HDDs) can retain data without continuous power. The distinction is about state retention, not speed.",
  },
  concurrency: {
    term: 'concurrency',
    bn: 'Concurrency মানে একাধিক কাজের অগ্রগতি overlap করা — OS দ্রুত পালা বদল করায় কাজগুলো "একসাথে" এগোচ্ছে বলে মনে হয়। Parallelism আলাদা জিনিস: একাধিক কাজ সত্যিই একই মুহূর্তে আলাদা CPU core-এ চলা। Single-core CPU-তেও concurrency সম্ভব; parallelism-এর জন্য একাধিক core লাগে।',
    en: "Concurrency means the progress of several tasks overlaps — fast turn-taking makes them appear to advance together. Parallelism is a different thing: several tasks genuinely executing at the same instant on different cores. Concurrency is possible on a single-core CPU; parallelism needs more than one core.",
  },
  process: {
    term: 'process',
    bn: 'Process হলো একটা program-এর running instance — চলতে থাকা কাজটা, আর তার জন্য যা যা state ও resource লাগে সেগুলো সহ: নিজস্ব virtual address space, PID, open file descriptor, আর execution state। Program নিজে নিষ্ক্রিয় একটা বর্ণনা (যেমন disk-এ পড়ে থাকা executable); একই program থেকে একাধিক process চলতে পারে।',
    en: "A process is a running instance of a program — the work actually in progress, plus the state and resources it needs: its own virtual address space, a PID, open file descriptors, and execution state. The program itself is a passive description (an executable on disk, say); several processes can run from one program.",
  },
  pcb: {
    term: 'PCB',
    bn: 'Process Control Block — classic OS বইয়ে প্রতি process-এর সেই record, যেখানে PID, memory map, open file-এর তালিকা, scheduling information আর process-এর state (running/ready/waiting) রাখা হয়। বাস্তব kernel এই তথ্য একটামাত্র literal table-এ না রেখে নিজের একাধিক data structure-এ রাখতে পারে, আর CPU-র execution state সাধারণত thread-ভিত্তিক structure-এ থাকে।',
    en: "Process Control Block — in classic OS texts, the per-process record holding the PID, memory map, list of open files, scheduling information, and process state (running/ready/waiting). A real kernel may keep this across several of its own structures rather than one literal table, and CPU execution state generally lives in per-thread structures.",
  },
  pagefault: {
    term: 'page fault',
    bn: 'Process যখন এমন কোনো virtual address access করতে চায় যেটার ডেটা এই মুহূর্তে physical RAM-এ নেই (disk-এ swap করা আছে), তখন CPU একটা "page fault" exception তোলে। OS তখন disk থেকে সেই page RAM-এ আনে, page table update করে, আর process-কে আবার চালায়।',
    en: "When a process tries to access a virtual address whose data isn't currently in physical RAM (it's been swapped to disk), the CPU raises a \"page fault\" exception. The OS fetches that page from disk, updates the page table, and resumes the process.",
  },
  syscall: {
    term: 'system call',
    bn: 'User mode-এ চলা program privileged কাজ সরাসরি করতে পারে না; সে kernel-এর কাছে অনুরোধ করে, আর সেই controlled interface-টাই system call। Application সাধারণত library/API function কল করে (যেমন C library-র open(), read()), আর সেই wrapper প্রয়োজন হলে kernel-এর system call interface ব্যবহার করে — x86-64 Linux-এ syscall instruction দিয়ে। তাই প্রতিটা function call system call নয়, আর প্রতিটা kernel transition-এ কিছু overhead আছে।',
    en: "A program in user mode cannot perform privileged work directly; it asks the kernel, and that controlled interface is the system call. Applications normally call a library/API function (the C library's open(), read(), and so on), and that wrapper uses the kernel's system call interface when it needs to — via the syscall instruction on x86-64 Linux. So not every function call is a system call, and each kernel transition carries some overhead.",
  },
  interrupt: {
    term: 'interrupt',
    bn: 'Hardware বা software থেকে CPU-কে পাঠানো একটা signal যে "এখনই একটা জরুরি কাজ আছে।" CPU চলতি কাজ থামিয়ে একটা pre-registered "interrupt handler" function-এ লাফ দেয়, সেটা শেষ করে, তারপর আগের কাজে ফিরে আসে। Keyboard press, timer tick, network packet আসা — সবই interrupt দিয়ে CPU-কে জানায়।',
    en: 'A signal from hardware or software to the CPU meaning "there\'s urgent work right now." The CPU pauses whatever it\'s doing, jumps to a pre-registered interrupt handler function, finishes it, and returns to the previous task. Keyboard presses, timer ticks, arriving network packets — all notify the CPU via interrupts.',
  },
  compiler: {
    term: 'compiler',
    bn: 'Compiler এমন একটা program যা চালানোর আগেই source code process করে অন্য একটা executable রূপ তৈরি করে। সেটা native machine code হতে পারে, object code হতে পারে, আবার bytecode-এর মতো intermediate representation-ও হতে পারে — কোন implementation কী করছে তার ওপর নির্ভর করে। C-র gcc একাধিক ধাপ (preprocess, compile, assemble, link) পেরিয়ে native executable বানায়।',
    en: "A compiler is a program that processes source code before execution and produces some other executable representation — native machine code, object code, or an intermediate representation such as bytecode, depending on the implementation. C's gcc runs several stages (preprocess, compile, assemble, link) to produce a native executable.",
  },
  interpreter: {
    term: 'interpreter',
    bn: 'Interpreter হলো সেই software machinery যা program-এর source বা তার কোনো intermediate representation runtime-এ execute করে — আগে থেকে তৈরি native executable ছাড়াই। "Interpreter মানেই একটা করে source line পড়ে সেটা নতুন করে অনুবাদ করা" — এটা ঠিক নয়; অনেক interpreter আগে source parse করে internal representation (প্রায়ই bytecode) বানায়, তারপর সেটা চালায়।',
    en: "An interpreter is the software machinery that executes a program's source, or an intermediate representation of it, at runtime — without a native executable prepared in advance. It does not mean \"read one source line and translate it afresh\": many interpreters parse the source into an internal representation (often bytecode) first and execute that.",
  },
  bytecode: {
    term: 'bytecode',
    bn: 'Bytecode হলো source code-এর একটা intermediate representation — মানুষের source-এর চেয়ে নিচের স্তরের, কিন্তু সাধারণত কোনো নির্দিষ্ট CPU-র native machine code নয়। একটা VM বা runtime সেটা execute করে, আর চাইলে তার কিছু অংশ পরে machine code-এ compile-ও করতে পারে। Java-র .class file, CPython-এর .pyc — দুটোই bytecode-এর উদাহরণ।',
    en: "Bytecode is an intermediate representation of source code — below human-readable source, but usually not the native machine code of any particular CPU. A VM or runtime executes it, and may later compile parts of it to machine code. Java's .class files and CPython's .pyc files are both bytecode.",
  },
  vm: {
    term: 'virtual machine (VM)',
    bn: 'এখানে VM বলতে বোঝানো হচ্ছে software-এ তৈরি একটা execution environment, যা কোনো নির্দিষ্ট bytecode বা language-এর execution model implement করে — যেমন JVM বা CPython-এর VM। সে শুধু bytecode interpret করতে বাধ্য নয়; runtime চাইলে কিছু অংশ machine code-এও compile করতে পারে। VirtualBox/VMware-এর মতো পুরো virtual computer আলাদা concept।',
    en: "Here a VM means a software execution environment that implements the execution model of a particular bytecode or language — the JVM, or CPython's VM. It is not obliged to interpret bytecode forever; the runtime may compile parts of it to machine code. A whole virtual computer such as VirtualBox or VMware is a different concept.",
  },
  jit: {
    term: 'JIT',
    bn: 'JIT (Just-In-Time compilation) হলো program চলার মধ্যেই code compile করার কৌশল — অর্থাৎ runtime-এ চলা একটা compiler, interpreter-এর বিকল্প নয়, তার পাশে। Execution চলাকালীন সংগৃহীত তথ্য (কোন অংশ কতবার চলছে, কী ধরনের value নিয়ে) দেখে সে ঘন ঘন চলা বা optimizable অংশের জন্য machine code তৈরি করতে পারে। সেই optimization অনুমানের ওপর দাঁড়ানো — অনুমান ভাঙলে engine আবার অন্য execution path-এ ফিরতে পারে (deoptimization)। V8, HotSpot, PyPy — সবই JIT ব্যবহার করে।',
    en: "JIT (Just-In-Time compilation) is the technique of compiling code while the program runs — a compiler operating at runtime, working alongside the interpreter rather than replacing it. Using information gathered during execution (how often code runs, what kinds of values it sees), it can generate machine code for hot or optimizable parts. Those optimizations rest on assumptions; when an assumption breaks, the engine can fall back to another execution path (deoptimization). V8, HotSpot and PyPy all use JIT.",
  },
  ast: {
    term: 'AST — Abstract Syntax Tree',
    bn: 'AST (Abstract Syntax Tree) হলো parse করার পর তৈরি হওয়া source code-এর একটা tree-আকৃতির structural রূপ। Engine এই tree ধরে এগিয়ে bytecode তৈরি করে। এখানে code-এর মানে ধরা থাকে — কোন expression কার ভেতরে বসেছে — কিন্তু source text-এর যতিচিহ্ন বা whitespace আর থাকে না।',
    en: "An AST (Abstract Syntax Tree) is a tree-shaped representation of your source code's structure, built after parsing. The engine walks this tree to generate bytecode. It captures what the code means — which expression nests inside which — without the raw text's punctuation or whitespace.",
  },
  scancode: {
    term: 'key code',
    bn: 'Keyboard-এর নিজের controller প্রতিটা key-কে একটা code দিয়ে চেনায় — অক্ষর দিয়ে নয়। USB keyboard-এ সেটা HID usage code হিসেবে যায়; USB HID Usage Tables-এ 0x04 মানে "Keyboard a and A"। এই code আর character-এর ASCII code এক জিনিস নয় — এটা বলে কোন key-এর কথা হচ্ছে, আর অক্ষরে রূপান্তর হয় পরে OS-এর স্তরে (layout বদলালে একই key অন্য অক্ষরও হতে পারে)। পুরোনো PS/2 keyboard-এ একই ধরনের code-কে বলা হতো scancode।',
    en: 'A keyboard controller identifies each key by a code, not by a character. On a USB keyboard that travels as an HID usage code; in the USB HID Usage Tables, 0x04 means "Keyboard a and A". This is not the same as a character ASCII code — it says which key is being reported, and turning that into a letter happens later at the OS level (change the layout and the same key can become a different character). On older PS/2 keyboards the equivalent code was called a scancode.',
  },
  rasterization: {
    term: 'rasterization',
    bn: 'একটা অক্ষরের আকৃতি font-এ থাকে vector (গাণিতিক curve) হিসেবে। কিন্তু screen শুধু pixel বোঝে। Vector shape-কে current font size অনুযায়ী pixel-এর grid-এ পরিণত করার প্রক্রিয়াই rasterization — মসৃণ curve থেকে নির্দিষ্ট R,G,B-ওয়ালা কয়েকশো pixel। বড় size মানে বেশি pixel, তাই কিনারা আরও মসৃণ।',
    en: 'A letter’s shape lives in the font as a vector (mathematical curves). But a screen only understands pixels. Turning that vector shape into a grid of pixels at the current font size is rasterization — from smooth curves to a few hundred pixels, each with a definite R,G,B. A bigger size means more pixels, so smoother edges.',
  },
  framebuffer: {
    term: 'display buffer',
    bn: 'Display-এর জন্য প্রস্তুত frame বা pixel data যে memory area-তে থাকে — সেখান থেকে display hardware সেটা monitor-এর দিকে পাঠাতে পারে। একে প্রায়ই framebuffer বলা হয়। Exact implementation hardware আর graphics architecture ভেদে আলাদা; "GPU প্রতি refresh-এ একবার পুরো ছবিটা একসাথে ছুঁড়ে দেয়" — এমন ভাবা ঠিক নয়, display system frame-এর data ধারাবাহিকভাবে scan out করে।',
    en: 'The memory area holding a frame, or pixel data, prepared for the display — from which the display hardware can send it toward the monitor. It is often called a framebuffer. The exact implementation varies with the hardware and graphics architecture, and it is not that the GPU flings the whole picture out at once on every refresh — the display system scans the frame data out continuously.',
  },
  compositor: {
    term: 'window compositor',
    bn: 'System-এর যে অংশ বিভিন্ন window বা visual surface-এর content মিলিয়ে screen-এর জন্য একটা final image বা frame তৈরি করে। কোন window কোথায় বসানো সেটা সে জানে, তাই overlap, transparency, shadow — সব সে সামলাতে পারে। সেই final frame তারপর display-এর পথে যায়।',
    en: 'The part of the system that combines the content of different windows or visual surfaces into one final image, or frame, for the screen. It knows where each window sits, so it can handle overlap, transparency and shadows. That final frame then travels on toward the display.',
  },
  hid: {
    term: 'USB HID',
    bn: 'HID (Human Interface Device) হলো keyboard, mouse-এর মতো device-এর input বর্ণনা করা আর পাঠানোর জন্য USB-র একটা standard উপায়। Keyboard আলগোছে byte না পাঠিয়ে একটা input report পাঠায়, যেখানে কোন key-এর কথা বলা হচ্ছে তার usage code-এর মতো information থাকে। OS-এর HID layer সেই report পড়ে higher-level keyboard event তৈরি করতে পারে।',
    en: 'HID (Human Interface Device) is the USB standard way of describing and transmitting input from devices such as keyboards and mice. Rather than sending loose bytes, a keyboard sends an input report carrying information such as the usage code for the key being reported. The HID layer in the OS can read that report and build a higher-level keyboard event.',
  },
};
