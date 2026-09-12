import { useLang } from '../context/LanguageContext';
import { Section } from '../primitives/Section';
import { Term } from '../primitives/Term';
import { Deeper } from '../primitives/Deeper';
import { Recap } from '../primitives/Recap';
import { RelayNav, SERIES_HUB_CARD } from '../primitives/RelayNav';
import { Colophon } from '../primitives/Colophon';
import { NoiseVsBands } from '../widgets/NoiseVsBands';
import { TransistorSwitch } from '../widgets/TransistorSwitch';
import { GatePlayground } from '../widgets/GatePlayground';
import { FeedbackLatch } from '../widgets/FeedbackLatch';
import { ThreeBits } from '../widgets/ThreeBits';

export function WhatsInsideABit() {
  const { bn } = useLang();

  const bodyStyle = bn
    ? { fontFamily: "'Anek Bangla','Anek Latin',sans-serif" }
    : { fontFamily: "'Anek Latin',sans-serif" };

  const p = (s: string | React.ReactNode) => <p style={{ margin: '0 0 16px', ...bodyStyle }}>{s}</p>;
  const pre = (s: string) => (
    <pre style={{ fontFamily: "'Departure Mono',monospace", fontSize: '14.5px', background: '#232b23', color: '#00d26a', padding: '15px 20px', margin: '0 0 20px', overflowX: 'auto', border: '1px solid #4a493a' }}>{s}</pre>
  );

  return (
    <article style={{ marginTop: 40, fontSize: '16.5px', lineHeight: 1.9 }}>
      {/* Hook */}
      <div>
        {bn ? (
          <div lang="bn" style={bodyStyle}>
            {p('ধরুন, কোডে লিখলাম:')}
            {pre('x = 5')}
            {p('কোডটা রান হলো। ভালো কথা।')}
            {p('কিন্তু একটা প্রশ্ন — এই ৫ সংখ্যাটা আসলে কম্পিউটারের কোথায় গেল? এর কি কোনো ফিজিক্যাল রূপ আছে?')}
            <p style={{ margin: '0 0 16px', ...bodyStyle }}>আক্ষরিক অর্থে — কম্পিউটারের ভেতরে কোথাও না কোথাও এই ৫ সংখ্যাটা এখন জমা হয়ে আছে। এই series-এ আমি সেই physical state থেকে screen পর্যন্ত পুরো যাত্রাটা দেখানোর চেষ্টা করবো। আপাতত লক্ষ্য একটা — একটা <Term id="bit">bit</Term> কীভাবে physically মেমোরিতে অবস্থান করে?</p>
            {p('একটা কথা আগে বলে রাখি — এখানে কোনো নির্দিষ্ট প্রোগ্রামিং ল্যাংগুয়েজ নিয়ে কথা বলবো না। সব software layer বাদ দিয়ে আলোচনা করবো একেবারে হার্ডওয়্যার লেভেলে — শুধু কিছু তার, কিছু transistor, আর voltage।')}
          </div>
        ) : (
          <div style={bodyStyle}>
            {p('Suppose you write:')}
            {pre('x = 5')}
            {p('The code runs. Fine.')}
            {p("But there's a question — where did that 5 actually go? Does it have a physical form?")}
            <p style={{ margin: '0 0 16px', ...bodyStyle }}>Literally — somewhere inside your computer, right now, there's a 5 stored. Today's goal is one specific question: how does a <Term id="bit">bit</Term> physically live in memory?</p>
            {p("One thing first — I'm not going to talk about any specific language today. All the software layers are stripped off. What exists down here is wires, transistors, and voltage.")}
          </div>
        )}
      </div>

      <Section num="01" bnH2="Binary কেন?" enH2="Why binary?">
        {bn ? (
          <div lang="bn" style={bodyStyle}>
            <p style={{ margin: '0 0 16px', ...bodyStyle }}>কম্পিউটারের ভেতরে data মানে কী? <Term id="voltage">voltage</Term>। Electrical signal-এর মাত্রা। ০ মানে "কম voltage" (প্রায় ০ ভোল্ট), ১ মানে "বেশি voltage" (প্রায় ৫ ভোল্ট বা ১.৮ ভোল্ট — chip-এর design-এর উপর নির্ভর করে)। অর্থাৎ, যেহেতু কম্পিউটার মূলত ইলেক্ট্রনিক ডিভাইস, এখানে আমরা যেমন কাগজে লিখে রাখি বা অন্য কোনো বস্তু গণনার কাজে ব্যবহার করি, সেরকমটা সম্ভব না। এখানে কোনো তথ্য সংরক্ষণ করতে চাইলে সেটাকে বিদ্যুতে রুপান্তর করে তারপরই সংরক্ষণ করা যাবে। এজন্যই যেকোনো ডিজিট্যাল ইলেকট্রনিকস এ data মানেই voltage।</p>
            {p('স্বাভাবিক প্রশ্ন — কম্পিউটার base-10 use করলে কী হতো? মানুষের ১০টা আঙুল আছে বলে আমরা ০ থেকে ৯ পর্যন্ত ব্যবহার করি। কম্পিউটারেও তো ১০টা আলাদা voltage level রাখা যেত।')}
            <p style={{ margin: '0 0 16px', ...bodyStyle }}>ঝামেলাটা math-এ না। ঝামেলাটা physics-এ। আর ঝামেলাটার নাম — <strong>noise</strong>।</p>
            {p('বাস্তব circuit-এ voltage কখনো একদম একইরকম থাকে না। তাপমাত্রার ওঠানামা, পাশের তারের electromagnetic interference — সবকিছু voltage-কে একটু এদিক-ওদিক করে দেয়। নিচের যন্ত্রে noise বাড়িয়ে নিজেই দেখুন:')}
          </div>
        ) : (
          <div style={bodyStyle}>
            <p style={{ margin: '0 0 16px', ...bodyStyle }}>What is data, inside a computer? <Term id="voltage">voltage</Term>. The level of an electrical signal. 0 means "low voltage" (near 0V), 1 means "high voltage" (near 5V or 1.8V — depends on chip design). That is to say, because a computer is fundamentally an electronic device, we cannot rely on physical mediums like paper or mechanical tokens for calculation and storage. To store any information, it must first be encoded into electrical states. This is precisely why in digital electronics, data equates to voltage.</p>
            {p("Natural question — what if the computer used base-10? We have ten fingers, so we count 0 to 9. Couldn't the computer just keep 10 different voltage levels?")}
            <p style={{ margin: '0 0 16px', ...bodyStyle }}>The problem isn't math. It's physics. And the problem has a name — <strong>noise</strong>.</p>
            {p("In a real circuit, voltage is never perfectly stable. Temperature swings, electromagnetic interference — everything nudges voltage around. Raise the noise on the instrument below and see for yourself:")}
          </div>
        )}
        <NoiseVsBands />
        {bn ? (
          <div lang="bn" style={bodyStyle}>
            {p('Base-10-এ ১.১ ভোল্ট মানে "২", আর ০.৯ ভোল্ট মানে "১"। মাত্র ০.২ ভোল্টের এই পার্থক্য noise সহজে ভেঙে ফেলে।')}
            <p style={{ margin: '0 0 16px', ...bodyStyle }}>Binary-তে? ০ মানে "কম voltage-এর যেকোনো ভ্যালু" (ধরুন ০ থেকে ০.৮ ভোল্ট), ১ মানে "বেশি voltage-এর যেকোনো ভ্যালু" (ধরুন ২ থেকে ৫ ভোল্ট)। মাঝখানে একটা <Term id="noisemargin">noise margin</Term> — একটা "নিষিদ্ধ অঞ্চল"।</p>
            <p style={{ margin: '0 0 16px', ...bodyStyle }}>এটাই বাইনারির আসল কারণ। ০ আর ১ দিয়ে data represent করা সহজ, তা না — ০ আর ১ <strong>নির্ভরযোগ্য</strong>। বাকিসব সেখান থেকে বানানো।</p>
            {p('এর মানে এই না যে কম্পিউটার ৫, ২৫ বা ১০০০ বোঝে না। বরং প্রতিটা সংখ্যাকে সে অসংখ্য ০ আর ১-এর combination-এ ভেঙে ফেলে। সেই গল্পটা পরের article-এ।')}
            {p('পরের প্রশ্ন: এই voltage-গুলো কে তৈরি করে? কে switch করে?')}
          </div>
        ) : (
          <div style={bodyStyle}>
            {p('In base-10, 1.1V means "2" and 0.9V means "1." That 0.2V difference is nothing to noise.')}
            <p style={{ margin: '0 0 16px', ...bodyStyle }}>In binary? 0 means "any low-ish voltage" (0 to 0.8V), 1 means "any high-ish voltage" (2 to 5V). In between sits a <Term id="noisemargin">noise margin</Term> — a "forbidden zone."</p>
            <p style={{ margin: '0 0 16px', ...bodyStyle }}>That's the real reason for binary. Not that 0 and 1 make data representation easy — that 0 and 1 are <strong>reliable</strong>. Everything else is built from there.</p>
            {p("This doesn't mean the computer can't handle 5, 25, or 1000. Rather, it breaks every number into combinations of countless 0s and 1s. That story is the next article's.")}
            {p('Next question: who creates these voltages? Who does the switching?')}
          </div>
        )}
      </Section>

      <Section num="02" bnH2="Transistor — সবচেয়ে ছোট সুইচ" enH2="The transistor — the smallest switch">
        {bn ? (
          <div lang="bn" style={bodyStyle}>
            {p('এখন পর্যন্ত একটা জিনিস পরিষ্কার — কম্পিউটার শেষ পর্যন্ত ভোল্টেজ নিয়েই কাজ করে। কিন্তু প্রশ্ন হলো, এই ভোল্টেজ কে নিয়ন্ত্রণ করে? কারণ কম্পিউটারকে তো মাঝে মাঝে কারেন্ট যেতে দিতে হবে, আবার মাঝে মাঝে আটকে দিতেও হবে। মানে, কম্পিউটারের এমন একটা জিনিস দরকার যেটা ইচ্ছে হলে বিদ্যুতের রাস্তা খুলে দেবে, আর ইচ্ছে হলে বন্ধ করে দেবে।')}
            {p('অর্থাৎ একটা switch।')}
            {p('কিন্তু এখানে একটা সমস্যা আছে। বাড়ির লাইটের সুইচ তো আপনি হাত দিয়ে চাপেন। কম্পিউটারের ভেতরে যদি ১০০ বিলিয়ন সুইচ থাকে, তাহলে সেগুলো কে চাপবে?')}
            {p('সেখানেই আসে transistor।')}
            {p('Transistor-কে সবচেয়ে সহজভাবে ভাবা যায় একটা অতি ক্ষুদ্র ইলেকট্রনিক কল হিসেবে। বাসার পানির কল যেমন খুললে পানি যায়, বন্ধ করলে পানি থেমে যায় — transistor-ও ঠিক তেমন। এই কলটা মানুষ ঘোরায় না। আরেকটা ছোট্ট electrical signal-ই কলটা খুলে বা বন্ধ করে দেয়।')}
          </div>
        ) : (
          <div style={bodyStyle}>
            {p("One thing is clear by now — the computer ultimately works with voltage. But the question is: who controls it? Because sometimes current has to flow through, and sometimes it has to be blocked. Which means we need something that can open the electrical path when it wants to, and close it when it wants to.")}
            {p("In other words — a switch.")}
            {p("But there's a problem. You press your light switch with your hand. If there are 100 billion switches inside a computer — who presses them?")}
            {p("That's where the transistor comes in.")}
            {p("The simplest way to picture a transistor is as a microscopic electronic tap. Open your kitchen tap, water flows; close it, water stops — a transistor is exactly that, except what flows is electricity. And no human turns this tap. Another tiny electrical signal opens or closes it.")}
          </div>
        )}
        <TransistorSwitch />
        {bn ? (
          <div lang="bn" style={bodyStyle}>
            <p style={{ margin: '0 0 16px', ...bodyStyle }}>এখানে গুরুত্বপূর্ণ ব্যাপার হলো — <strong>একটা ছোট electrical signal আরেকটা electrical signal-কে নিয়ন্ত্রণ করতে পারে।</strong></p>
            {p('ব্যস, এইটুকুই। এই ছোট্ট আইডিয়াটার ওপরই দাঁড়িয়ে আছে পুরো আধুনিক কম্পিউটার।')}
            {p('আপনি এই লেখাটা যতক্ষণ পড়ছেন, আপনার ফোন বা ল্যাপটপের ভেতরে কয়েক বিলিয়ন transistor প্রতি সেকেন্ডে অসংখ্যবার on-off হচ্ছে। কিন্তু এত কিছুর পরও প্রতিটা transistor একই কাজ করে — বিদ্যুৎ যেতে দেবে, অথবা দেবে না। এই দুইটাই।')}
          </div>
        ) : (
          <div style={bodyStyle}>
            <p style={{ margin: '0 0 16px', ...bodyStyle }}>What matters here is this — <strong>a small electrical signal can control another electrical signal.</strong></p>
            {p("That's it. That's all. The entire modern computer stands on this one small idea.")}
            {p("For as long as you've been reading this, a few billion transistors inside your phone or laptop have been switching on and off countless times per second. And yet every one of them does the same job — let electricity pass, or don't. Just those two.")}
          </div>
        )}
      </Section>

      <Section num="03" bnH2="Switch জোড়া দিলে কী হয়?" enH2="What happens when you join switches?">
        {bn ? (
          <div lang="bn" style={bodyStyle}>
            {p('একটা transistor দিয়ে বেশি কিছু হয় না। ঠিক যেমন একটা LEGO block দিয়ে ঘর বানানো যায় না।')}
            {p('কিন্তু হাজার হাজার transistor একসাথে জোড়া লাগালে ধীরে ধীরে এমন circuit তৈরি হয়, যেগুলো decision নিতে পারে, হিসাব করতে পারে, এমনকি memory-ও বানাতে পারে।')}
            <p style={{ margin: '0 0 16px', ...bodyStyle }}>দুইটা transistor যদি এক লাইনে (<Term id="serpar">series</Term>) জোড়া দেন, তাহলে current যেতে হলে দুইটাকেই একসাথে on হতে হবে। এভাবেই তৈরি হয় AND gate। আবার পাশাপাশি (parallel) জোড়া দিলে, যেকোনো একটা on থাকলেই current যেতে পারে। এভাবেই তৈরি হয় OR gate। আরেকটা transistor-এর wiring-এ ছোট্ট একটা পরিবর্তন করে বানানো যায় NOT gate — input ১ হলে output ০, input ০ হলে output ১।</p>
          </div>
        ) : (
          <div style={bodyStyle}>
            {p("One transistor doesn't do much. The way one LEGO block doesn't build a house.")}
            {p("But join thousands of transistors together and, step by step, circuits emerge that can make decisions, do arithmetic — even build memory.")}
            <p style={{ margin: '0 0 16px', ...bodyStyle }}>Join two transistors in a line (<Term id="serpar">series</Term>) and current can only pass if both are on at once. That's an AND gate. Join them side by side (parallel) and either one being on lets current through. That's an OR gate. A small tweak to a single transistor's wiring gives you a NOT gate — input 1 flips to output 0, input 0 flips to output 1.</p>
          </div>
        )}
        <GatePlayground />
        {bn ? (
          <div lang="bn" style={bodyStyle}>
            <p style={{ margin: '0 0 16px', ...bodyStyle }}>এই তিনটা gate — AND, OR, NOT — দিয়ে যেকোনো logical operation বানানো যায়। যেকোনো decision, যেকোনো comparison, যেকোনো গাণিতিক হিসাব। XOR, NAND, NOR gate — সব এই তিনটা মৌলিক gate-এর combination।</p>
            <p style={{ margin: '0 0 16px', ...bodyStyle }}>Arithmetic-ও এভাবেই। দুইটা bit যোগ করার circuit ("full adder") বানানো যায় শুধু AND, OR, XOR দিয়ে। ৬৪টা full adder পাশাপাশি রেখে ৬৪-bit integer যোগ করার circuit তৈরি করা যায় — যা CPU-র ভেতরের <Term id="alu">ALU</Term>-র একটি গুরুত্বপূর্ণ অংশ।</p>
            {p('কিন্তু arithmetic-এর গল্প পরের article-এ। এখানে এখনো একটা সমস্যা আছে।')}
          </div>
        ) : (
          <div style={bodyStyle}>
            <p style={{ margin: '0 0 16px', ...bodyStyle }}>With these three gates — AND, OR, NOT — you can build any logical operation. Any decision, any comparison, any arithmetic. XOR, NAND, NOR — all combinations of these three fundamental gates.</p>
            <p style={{ margin: '0 0 16px', ...bodyStyle }}>Arithmetic works the same way. A circuit that adds two bits (a "full adder") can be built from just AND, OR, XOR. Put 64 full adders side by side and you have a circuit that adds 64-bit integers — an important part of the <Term id="alu">ALU</Term> inside the CPU.</p>
            {p("But arithmetic's story belongs to the next article. Here, one problem still remains.")}
          </div>
        )}
      </Section>

      <Section num="04" bnH2='Switch কীভাবে "মনে রাখে"?' enH2='How does a switch "remember"?'>
        {bn ? (
          <div lang="bn" style={bodyStyle}>
            {p('এতক্ষণের সব gate-এর একটা বড় সমস্যা আছে। Input সরিয়ে নিলে output-ও চলে যায়।')}
            {p('মানে ধরুন, AND gate-কে দিলাম (১, ১)। Output ১ হলো। এখন input সরিয়ে নিন। Output কী? ০। Gate কিছু মনে রাখে না।')}
            <p style={{ margin: '0 0 16px', ...bodyStyle }}>এটা memory না। কিন্তু কম্পিউটারের memory দরকার। আপনার <span style={{ fontFamily: "'Departure Mono',monospace", fontSize: '0.9em' }}>x = 5</span> মানে ৫-কে কোথাও রাখতে হবে, যেন পরে read করা যায়। কীভাবে?</p>
            <p style={{ margin: '0 0 16px', ...bodyStyle }}>আমার সবচেয়ে বড় বিভ্রান্তিটা এখানেই ছিল। বিশ্ববিদ্যালয়ে ডিজিটাল লজিক ডিজাইন কোর্সে SR Latch, JK Flip-Flop, truth table, register — সবই ছিলো। প্রত্যেকটা কম্পোনেন্ট কেন লাগে, কিভাবেই আসলেই “ধরে রাখে” — বুঝতাম না। কোডিং করার সময় যখন <span style={{ fontFamily: "'Departure Mono',monospace", fontSize: '0.9em' }}>x = 5</span> লিখতাম, এই দুই পৃথিবীর মধ্যে কোনো সম্পর্ক খুঁজে পেতাম না। Memory কি এক ফালি magnetic ধাতু? নাকি charge-এর কোনো চৌবাচ্চা? দুঃখজনকভাবে, আমাদেরকে কোর্সের পর কোর্স করানো হয়, যেখানে কোনোকিছু গোড়া থেকে না বুঝেই কেবল স্লাইড মুখস্থ করে আর বিগত প্রশ্নপত্রগুলো একটু স্টাডি করেই পার পাওয়া যায়।</p>
            {p('যাই হোক, bit ধরে রাখার সমাধানটা চমৎকার এবং সহজ। Feedback loop।')}
            {p('দুইটা NOT gate নিন। প্রথমটার output-কে দ্বিতীয়টার input-এ connect করুন। দ্বিতীয়টার output-কে প্রথমটার input-এ connect করুন।')}
          </div>
        ) : (
          <div style={bodyStyle}>
            {p("Every gate so far has one big problem. Remove the input, and the output goes away too.")}
            {p("Say you give an AND gate (1, 1). The output becomes 1. Now take the inputs away. The output? 0. The gate remembers nothing.")}
            <p style={{ margin: '0 0 16px', ...bodyStyle }}>That's not memory. But a computer needs memory. Your <span style={{ fontFamily: "'Departure Mono',monospace", fontSize: '0.9em' }}>x = 5</span> means the 5 must be kept somewhere.</p>
            <p style={{ margin: '0 0 16px', ...bodyStyle }}>My biggest confusion was right here. In my university's Digital Logic Design course, we covered everything: SR Latches, JK Flip-Flops, truth tables, and registers. Yet, I never truly understood why each component was necessary, or how it actually retained data. When coding, whenever I wrote <span style={{ fontFamily: "'Departure Mono',monospace", fontSize: '0.9em' }}>x = 5</span>, I couldn't bridge the gap between these two worlds. Was memory just a sliver of magnetic metal? Or a pool of trapped electrical charge? Regrettably, we are pushed through course after course where you can get by simply memorizing slides and cramming past exam papers, without ever understanding anything from first principles.</p>
            {p("However, the answer to this problem is beautiful and simple. A feedback loop.")}
            {p("Take two NOT gates. Connect the first one's output to the second one's input. Connect the second one's output back to the first one's input.")}
          </div>
        )}
        <FeedbackLatch />
        {bn ? (
          <div lang="bn" style={bodyStyle}>
            {p('এখন কী হবে? ধরুন, প্রথম gate-এর output ১। সেটা দ্বিতীয় gate-এর input-এ যাচ্ছে। NOT gate, তাই দ্বিতীয় gate-এর output হবে ০। সেটা প্রথম gate-এর input, তাই প্রথম gate-এর output হবে ১। Loop। Stable। প্রথম gate সবসময় ১, দ্বিতীয় সবসময় ০।')}
            {p('এখন input সরিয়ে নিলে কী হবে? কিছুই না। State loop-এ আটকে আছে।')}
            <p style={{ margin: '0 0 16px', ...bodyStyle }}>আরেকভাবে ভাবুন — একটা marble দুইটা পাহাড়ের মাঝে দুইটা গর্তের একটায় বসে আছে। ওটা নিজে নিজে আর নড়বে না। কিন্তু আপনি যদি যথেষ্ট জোরে ধাক্কা দেন, তাহলে অন্য গর্তে চলে যাবে। সেখানেও আবার স্থির হয়ে থাকবে। একটা <Term id="latch">latch</Term>-ও তেমনই। দুইটা stable state — ০ আর ১।</p>
          </div>
        ) : (
          <div style={bodyStyle}>
            {p("Now what happens? Say the first gate's output is 1. It flows into the second gate's input. It's a NOT gate, so the second gate's output is 0. That's the first gate's input, so the first gate's output is 1. Loop. Stable. The first gate stays 1 forever, the second stays 0.")}
            {p("And if you remove the input now? Nothing. The state is trapped in the loop.")}
            <p style={{ margin: '0 0 16px', ...bodyStyle }}>Another way to think about it — imagine a marble sitting in one of two valleys, separated by a small hill. It won't move on its own. But if you push it hard enough, it rolls over into the other valley. And it settles there. A <Term id="latch">latch</Term> is the same. Two stable states — 0 and 1.</p>
          </div>
        )}
        <Deeper
          bnLabel="আরেকটু গভীরে — Gated Latch আর Flip-Flop"
          enLabel="go deeper — Gated Latch and Flip-Flop"
        >
          {bn ? (
            <div lang="bn" style={{ fontFamily: "'Anek Bangla','Anek Latin',sans-serif", marginTop: 14 }}>
              <p style={{ margin: '0 0 12px' }}>আমরা একটা সমস্যা সমাধান করেছি — দুটি NOT gate feedback দিয়ে নিজেদের অবস্থা মনে রাখতে পারে। কিন্তু এবার নতুন সমস্যা। ধরুন, আমি এই মুহূর্তে latch-এর ভেতরে ১ লিখতে চাই। তারপর ৫ সেকেন্ড পরে ০ লিখতে চাই। Latch বুঝবে কীভাবে কখন নতুন ডেটা নিতে হবে? সবসময় যদি ইনপুট শুনতেই থাকে, তাহলে তো নতুন সিগন্যাল এলেই আগের ডেটা বদলে যাবে।</p>
              <p style={{ margin: '0 0 12px' }}>সেজন্য দরকার একটা "দারোয়ান"। যে বলবে— "এখন ভেতরে ঢোকো।" অথবা "এখন কেউ ঢুকতে পারবে না।" এই দারোয়ানের কাজটাই করে <span style={{ fontFamily: "'Departure Mono',monospace", fontSize: '0.9em' }}>Write Enable</span> wire। তখন একে বলে gated latch।</p>
              <p style={{ margin: 0 }}>Latch-এর সাথে clock যুক্ত করলে তৈরি হয় <Term id="flipflop">flip-flop</Term> — clock-এর নির্দিষ্ট tick এলেই কেবল নতুন ডেটা ঢুকতে পারে।</p>
            </div>
          ) : (
            <div style={{ fontFamily: "'Anek Latin',sans-serif", marginTop: 14 }}>
              <p style={{ margin: '0 0 12px' }}>We solved one problem — two NOT gates can remember their own state. But now: how does the latch know when to accept new data and when to hold old?</p>
              <p style={{ margin: '0 0 12px' }}>So it needs a "doorman." That's exactly the job of the <span style={{ fontFamily: "'Departure Mono',monospace", fontSize: '0.9em' }}>Write Enable</span> wire. The circuit is then called a gated latch.</p>
              <p style={{ margin: 0 }}>A clock attached to the latch makes a <Term id="flipflop">flip-flop</Term> — new data can enter only on the clock's tick.</p>
            </div>
          )}
          <Deeper
            bnLabel="আরেকটু গভীরে যাই — শুধু Clock জুড়ে দিলেই কি Flip-flop হয়ে যায়?"
            enLabel="go deeper — does attaching a clock alone make it a flip-flop?"
          >
            {bn ? (
              <div lang="bn" style={{ fontFamily: "'Anek Bangla','Anek Latin',sans-serif", marginTop: 14 }}>
                <p style={{ margin: '0 0 12px' }}>এখানে একটা স্বাভাবিক খটকা লাগতে পারে — Latch-এর সাথে শুধু একটা Clock জুড়ে দিলেই কি সেটা নিজে থেকেই প্রতিবার ঠিক একবার করে মান বদলাবে?</p>
                <p style={{ margin: '0 0 12px' }}>আসলে ব্যাপারটা এত সহজ না। যতক্ষণ Clock (বা Write Enable) চালু থাকবে, Latch কিন্তু পুরোটা সময়জুড়ে "transparent" থাকে — অর্থাৎ এই পুরো সময়টাতে Input বদলালেই সাথে সাথে Output-ও বদলে যাবে। এখন Counter-এর মতো কোনো circuit-এ যদি এই Output ঘুরে এসে নিজের Input-কেই আবার বদলে দেয়, তবেই সমস্যা বাঁধবে। Clock যতক্ষণ High (1) থাকে, Latch ততক্ষণ transparent থাকে। ফলে Output বদলানোর সাথে সাথে সেই নতুন মান ব্যাক-ফিড হয়ে Input-কে আবার পাল্টে দেয়। Gate-এর অভ্যন্তরীণ delay (Δt<sub>prop</sub>) মাত্র কয়েক নানোসেকেন্ড, যা Clock Pulse-এর স্থায়িত্বের চেয়ে অনেক কম। ফলে Clock High থাকা অবস্থাতেই Output অতি দ্রুত একাধিকবার 0 ও 1-এর মধ্যে চেঞ্জ হতে থাকে (oscillate করে)। Clock বন্ধ হওয়ার মুহূর্তে Output-এর মান 0 নাকি 1 হবে — তা সম্পূর্ণ অনিশ্চিত হয়ে পড়ে। এটিই race-around সমস্যা।</p>
                <p style={{ margin: '0 0 12px' }}>এই কারণেই আসল Flip-flop একটা Latch দিয়ে বানানো হয় না; বানানো হয় দুটো Latch জোড়া দিয়ে — যার একটিকে বলে Master আর অন্যটিকে Slave। Clock 0 থাকলে Master চালু হয়, আর 1 থাকলে Slave চালু হয় — অর্থাৎ দুটো কখনোই একসাথে খোলা থাকে না। ফলে Input একবার Master-এ ধরা পড়ে, আর সেখান থেকে ঠিক একবারই Slave-এ গিয়ে পৌঁছায়। পুরো প্রক্রিয়াটি Clock-এর প্রতি Tick-এ ঠিক একবারই ঘটে।</p>
                <p style={{ margin: 0 }}>এর বিস্তারিত আলোচনা এই Article-এর বিষয় না — সেটা আসবে যখন Clock নিয়ে আলাদা করে লিখব। আপাতত এটুকু মনে রাখলেই চলবে: শুধু Clock জুড়ে দেওয়াটাই কিন্তু গল্পের শেষ নয়।</p>
              </div>
            ) : (
              <div style={{ fontFamily: "'Anek Latin',sans-serif", marginTop: 14 }}>
                <p style={{ margin: '0 0 12px' }}>A natural doubt here: if we just attach a clock to the latch, does it automatically change exactly once, cleanly?</p>
                <p style={{ margin: '0 0 12px' }}>Not quite. For as long as the clock (or Write Enable) is on, the latch stays "transparent" the whole time — the output changes the instant the input does, for the entire window. In a circuit like a counter, a problem arises if the output loops back to drive its own input. As long as the Clock is High (1), the latch remains transparent. Consequently, any output change immediately feeds back to flip the input again. Because gate propagation delays (Δt<sub>prop</sub>) are in nanoseconds — much shorter than the clock pulse — the output rapidly oscillates between 0 and 1 multiple times during a single clock cycle. When the clock drops low, the final state of <em>Q</em> becomes completely unpredictable. This is the race-around condition.</p>
                <p style={{ margin: '0 0 12px' }}>So a real flip-flop isn't one latch — it's two, chained: a master and a slave. The master is open while the clock is 0; the slave is open while the clock is 1 — opposite windows, never both open. The input gets caught once by the master, then handed off once to the slave — the whole thing happens exactly once per tick.</p>
                <p style={{ margin: 0 }}>The full detail isn't this article's job — that's for when we cover clocks directly. For now: just attaching a clock isn't the whole story.</p>
              </div>
            )}
          </Deeper>
        </Deeper>
        {bn ? (
          <div lang="bn" style={bodyStyle}>
            {p('আর এই state যতক্ষণ থাকবে? যতক্ষণ current থাকবে। Power চলে গেলে loop ভেঙে যায়, state হারিয়ে যায়। এজন্যই RAM volatile — একবার unplug করলে সব ভুলে যায়। এটা নিয়ে আমরা পরবর্তীতে আরও জানবো।')}
          </div>
        ) : (
          <div style={bodyStyle}>
            {p("One disclaimer again — real RAM isn't built from exactly this simple latch. Modern DRAM is more complex, using different tricks to pack more data into less space. But the fundamental idea of \"remembering one bit\" comes from this feedback.")}
            {p("And how long does the state last? As long as the current does. When power goes, the loop breaks and the state is lost. That's why RAM is volatile — unplug it once and it forgets everything. We'll come back to this in a later article.")}
          </div>
        )}
      </Section>

      <Section num="05" bnH2="পুরো গল্পটা একবার" enH2="The whole story, once through">
        {bn ? (
          <div lang="bn" style={bodyStyle}>
            <p style={{ margin: '0 0 16px', ...bodyStyle }}>এবার পুরো গল্পটা একবার চোখের সামনে চালাই। আপনি লিখলেন: <span style={{ fontFamily: "'Departure Mono',monospace", fontSize: '0.9em' }}>x = 5</span></p>
            {p('Python অবশ্যই সরাসরি transistor on-off করছে না। মাঝখানে compiler/interpreter, operating system, CPU — আরও অনেক ধাপ আছে। সেগুলো আমরা পরে দেখব। কিন্তু একেবারে hardware-এ পৌঁছানোর পর ঘটনাটা মোটামুটি এমন:')}
            <ul style={{ margin: '0 0 16px', paddingLeft: 22, lineHeight: 1.9 }}>
              <li>৫ সংখ্যাটা binary-তে রূপ নেয় — <span style={{ fontFamily: "'Departure Mono',monospace" }}>101</span></li>
              <li>তিনটা bit-এর জন্য তিনটা memory cell বরাদ্দ হয়</li>
              <li>প্রতিটা cell আসলে কয়েকটা transistor দিয়ে বানানো একটা flip-flop</li>
              <li>সেই flip-flop-এ voltage set হয় (high, low, high — ১, ০, ১)</li>
              <li>Feedback loop সেই voltage ধরে রাখে</li>
              <li>পরে CPU x read করতে চাইলে তিনটা bit পেয়ে ৫ বের করে</li>
            </ul>
          </div>
        ) : (
          <div style={bodyStyle}>
            <p style={{ margin: '0 0 16px', ...bodyStyle }}>Let's run the whole story once. You wrote: <span style={{ fontFamily: "'Departure Mono',monospace", fontSize: '0.9em' }}>x = 5</span></p>
            {p("Python is certainly not switching transistors directly. In between sit the compiler/interpreter, the operating system, the CPU — many more steps we'll see later. But once it reaches the hardware, the event goes roughly like this:")}
            <ul style={{ margin: '0 0 16px', paddingLeft: 22, lineHeight: 1.9 }}>
              <li>The number 5 takes binary form — <span style={{ fontFamily: "'Departure Mono',monospace" }}>101</span></li>
              <li>Three memory cells are allocated for the three bits</li>
              <li>Each cell is really a flip-flop built from a few transistors</li>
              <li>Voltages get set in those flip-flops (high, low, high — 1, 0, 1)</li>
              <li>The feedback loops hold those voltages</li>
              <li>Later, when the CPU wants to read x, it reads three bits and reassembles 5</li>
            </ul>
          </div>
        )}
        <ThreeBits />
        {bn ? (
          <div lang="bn" style={bodyStyle}>
            {p('মজার ব্যাপার — এই pattern (transistor → gate → latch) প্রতিটা computer-এর সবচেয়ে ছোট building block। RAM-এ কয়েক বিলিয়ন flip-flop। CPU-তে কয়েক বিলিয়ন gate। প্রতিটা gate-এ কয়েকটা করে transistor। সব শুরু voltage থেকে।')}
          </div>
        ) : (
          <div style={bodyStyle}>
            {p("The fun part — this pattern (transistor → gate → latch) is every computer's smallest building block. These three layers are everything. Whatever sits above them — RAM, CPU, cache, GPU, the OS, your browser, your React app — is repeated composition of these three layers.")}
            {p("A few billion flip-flops in RAM. A few billion gates in a CPU. A few transistors in every gate. All of it starting from voltage.")}
          </div>
        )}
        <Recap>
          {bn ? (
            <ul lang="bn" style={{ fontFamily: "'Anek Bangla','Anek Latin',sans-serif", fontSize: 16, lineHeight: 1.9, margin: 0, paddingLeft: 20, color: '#33301F' }}>
              <li>Bit কোনো বিমূর্ত ধারণা নয় — এটা voltage-এর একটা physical state।</li>
              <li>Binary এসেছে math-এর জন্য নয়, reliability-র জন্য। Noise দুইটা state সহজে ভাঙতে পারে না।</li>
              <li>Memory ম্যাজিক না — জাস্ট দুইটা gate loop করে বসিয়ে দেওয়া। Feedback থেকেই memory-র জন্ম।</li>
            </ul>
          ) : (
            <ul style={{ fontFamily: "'Anek Latin',sans-serif", fontSize: 16, lineHeight: 1.9, margin: 0, paddingLeft: 20, color: '#33301F' }}>
              <li>A bit is not an abstract concept — it's a physical state of voltage.</li>
              <li>Binary came for reliability, not math. Noise can't easily break two states.</li>
              <li>Memory isn't magic — just two gates looped together. Memory is born from feedback.</li>
            </ul>
          )}
        </Recap>
      </Section>

      <RelayNav
        hub={SERIES_HUB_CARD}
        next={{ label: { bn: 'baton পরের পর্বে', en: 'baton to the next leg' }, title: bn ? '০২ — যেকোনো তথ্য কীভাবে ০ আর ১ হয়?' : '02 — How does anything become 0s and 1s?', href: '/writing/how-does-anything-become-bits', variant: 'next' }}
        bridge={{ bn: 'এখন আমরা জানি একটা bit কীভাবে ধরে রাখা যায়। কিন্তু একটা bit দিয়ে তো কিছুই হয় না। তাহলে লক্ষ-কোটি bit একসাথে মিলে কীভাবে একটা বাংলা বাক্য তৈরি করে?', en: 'Now we know how a bit can be held. But one bit alone does nothing. How do trillions of bits together become a Bengali sentence, a JPEG photo, an MP3 song?' }}
      />
      <Colophon />
    </article>
  );
}
