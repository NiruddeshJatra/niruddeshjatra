import type { ReactNode } from 'react';
import { useLang } from '../context/LanguageContext';
import { Section } from '../primitives/Section';
import { Term } from '../primitives/Term';
import { Deeper } from '../primitives/Deeper';
import { Diagram } from '../primitives/Diagram';
import { Recap } from '../primitives/Recap';
import { RelayNav, SERIES_HUB_CARD } from '../primitives/RelayNav';
import { Colophon } from '../primitives/Colophon';
import { PlaceValueBuilder } from '../widgets/PlaceValueBuilder';
import { UnicodeEncodingDemo } from '../widgets/UnicodeEncodingDemo';
import { PixelColorDemo } from '../widgets/PixelColorDemo';
import { SamplingRateDemo } from '../widgets/SamplingRateDemo';
import { RLECompressionDemo } from '../widgets/RLECompressionDemo';
import { CPUBlindLens } from '../widgets/CPUBlindLens';

export function HowDoesAnythingBecomeBits() {
  const { bn } = useLang();

  const bodyStyle = bn
    ? { fontFamily: "'Anek Bangla','Anek Latin',sans-serif" }
    : { fontFamily: "'Anek Latin',sans-serif" };

  const p = (s: string | ReactNode) => <p style={{ margin: '0 0 16px', ...bodyStyle }}>{s}</p>;
  const pre = (s: string) => (
    <pre style={{ fontFamily: "'Departure Mono',monospace", fontSize: '13.5px', background: 'rgba(255,252,243,0.65)', border: '1px solid #c9bda0', color: '#33301F', padding: '13px 18px', margin: '0 0 20px', overflowX: 'auto' }}>{s}</pre>
  );
  const ul = (items: ReactNode[]) => (
    <ul style={{ margin: '0 0 20px', paddingLeft: 24, ...bodyStyle }}>
      {items.map((it, i) => <li key={i} style={{ marginBottom: 8 }}>{it}</li>)}
    </ul>
  );
  const deeperBody = (children: ReactNode) => (
    <div {...(bn ? { lang: 'bn' } : {})} style={{ ...bodyStyle, marginTop: 14 }}>{children}</div>
  );
  const dp = (s: ReactNode, last = false) => <p style={{ margin: last ? 0 : '0 0 12px' }}>{s}</p>;

  return (
    <article style={{ marginTop: 40, fontSize: '16.5px', lineHeight: 1.9 }}>
      {/* ── Hook ─────────────────────────────────────────────────────── */}
      <div>
        {bn ? (
          <div lang="bn" style={bodyStyle}>
            {p('ধরুন, একটা কাগজে "Hello" লিখে আপনার সামনে ধরলাম। আপনি বুঝবেন এটা পাঁচটা অক্ষর, একটা শব্দ। যদি একটা বিড়ালের ছবি দেখাই, বুঝবেন এটা একটা প্রাণীর ছবি। MP3 চালালে শুনবেন একটা গান।')}
            {p('কিন্তু কম্পিউটার এগুলোর কোনোটাই দেখে না। তার কাছে "Hello" শব্দটা, বিড়ালের ছবি আর আপনার প্রিয় গান — সবই শেষ পর্যন্ত bit-এর pattern।')}
            <p style={{ margin: '0 0 16px', ...bodyStyle }}><a href="/writing/whats-inside-a-bit" style={{ color: '#00753F' }}>আগের আর্টিকেলে</a> দেখেছি, একটা bit হলো logical ০ বা ১, যাকে hardware কোনো physical বৈদ্যুতিক অবস্থা দিয়ে ধরে রাখে।</p>
            {p('কিন্তু বাস্তব জগতের একটা অক্ষর, একটা রঙ, একটা সুর — এগুলো memory-তে ঢোকার আগে কীভাবে ০ আর ১-এ রূপ নেয়? সেই translation-এর গল্পটাই আজকের বিষয়।')}
          </div>
        ) : (
          <div style={bodyStyle}>
            {p('Suppose I write "Hello" on a piece of paper and hand it to you. You\'ll see five letters, a word. Show you a picture of a cat, you\'ll see an animal. Play an MP3, you\'ll hear a song.')}
            {p('But the computer sees none of that. To it, the word "Hello", the cat picture, and your favourite song all end up as patterns of bits.')}
            <p style={{ margin: '0 0 16px', ...bodyStyle }}>In the <a href="/writing/whats-inside-a-bit" style={{ color: '#00753F' }}>last article</a> we saw that a bit is a logical 0 or 1, held by the hardware as some physical electrical state.</p>
            {p('Today the question flips. A character in the real world, a colour, a sound — how do they become 0s and 1s before landing in memory? That translation is the story for today.')}
          </div>
        )}
      </div>

      {/* ── 01 — First rule ──────────────────────────────────────────── */}
      <Section num="01" bnH2="প্রথম নিয়ম: সবকিছুকে bit-এ প্রকাশ করতে হবে" enH2="First rule: everything must be represented as bits">
        {bn ? (
          <div lang="bn" style={bodyStyle}>
            {p(<>Computer "Hello" শব্দটা, লাল রঙ বা একটা সুরকে যেমন আছে তেমন রাখতে পারে না। তথ্যটাকে আগে <strong>একটা নির্দিষ্ট নিয়মে encode</strong> করতে হয় — এমন একটা রূপে, যা শেষ পর্যন্ত bit-এর pattern হিসেবে লেখা যায়।</>)}
            {p('বেশিরভাগ ক্ষেত্রে মাঝখানে একটা সংখ্যা থাকে। প্রতিটা অক্ষর পায় একটা পরিচয় নম্বর, ছবির প্রতিটা বিন্দু পায় উজ্জ্বলতার নম্বর, শব্দ পায় মাপা উচ্চতার নম্বর। তারপর সেই সংখ্যা bit হয়।')}
            {p(<>তবে একটা কথা মনে রাখবেন: একটা bit pattern-এর অর্থ কী, সেটা নির্ভর করে <strong>কোন নিয়মে সেটা পড়া হচ্ছে</strong>। এই কথায় article-এর শেষে ফিরব।</>)}
            {p('তাহলে প্রথম প্রশ্ন — সংখ্যা নিজেই কীভাবে binary হয়?')}
          </div>
        ) : (
          <div style={bodyStyle}>
            {p(<>A computer can't store the word "Hello," the colour red, or a melody as they are. The information first has to be <strong>encoded by some defined rule</strong> — into a form that can ultimately be written as a pattern of bits.</>)}
            {p('Most of the time, a number sits in the middle. Each character gets an identity number, each point of an image gets brightness numbers, a sound gets numbers for its measured height. Then those numbers become bits.')}
            {p(<>But keep one thing in mind: what a bit pattern means <strong>depends on the rule it's read with</strong>. We'll come back to that at the end of the article.</>)}
            {p('So the first question — how do numbers themselves become binary?')}
          </div>
        )}
      </Section>

      {/* ── 02 — Number to binary ────────────────────────────────────── */}
      <Section num="02" bnH2="সংখ্যা থেকে binary" enH2="From number to binary">
        {bn ? (
          <div lang="bn" style={bodyStyle}>
            {p('মানুষ base-10 বা ডেসিমাল সিস্টেম ব্যবহার করে। কেন? সম্ভবত কারণটা সহজ — আমাদের ১০টা আঙুল আছে। ০ থেকে ৯ পর্যন্ত ১০টা digit, আর প্রতিটা column-এর মান ১০-এর power হিসেবে বাড়ে — একক, দশক, শতক, সহস্র।')}
            {p('আগের article-এ দেখেছি, digital circuit দুটো অবস্থাকে সবচেয়ে নির্ভরযোগ্যভাবে আলাদা করতে পারে। তাই কম্পিউটারে ব্যবহার হয় base-2 বা binary। এখানে digit শুধু দুইটা (০ আর ১), আর প্রতিটা column-এর মান ২-এর power হিসেবে বাড়ে — ১, ২, ৪, ৮, ১৬, ৩২ — এভাবে।')}
            {p('কেন ঠিক ২-এর power? প্রতিটা নতুন bit সম্ভাবনার সংখ্যা দ্বিগুণ করে দেয়। এক bit-এ দুইটা possibility (০ অথবা ১)। দুই bit-এ চারটা (০০, ০১, ১০, ১১)। তিন bit-এ আটটা, চার bit-এ ষোলটা। এভাবেই সম্ভাবনা exponentially বাড়তে থাকে।')}
            {p('তাহলে এই কলামগুলো দিয়ে সংখ্যা বানাবো কীভাবে? নিয়মটা সহজ: যে যে কলামের মান যোগ করতে হবে, সেগুলোকে 1 করে দিন, বাকিগুলোকে 0। নিচের যন্ত্রে নিজেই ১৩ বানিয়ে দেখুন:')}
          </div>
        ) : (
          <div style={bodyStyle}>
            {p("Humans use base-10, or the decimal system. Why? The reason is probably simple — we have 10 fingers. Ten digits (0 through 9), and each column's value grows as a power of 10 — ones, tens, hundreds, thousands.")}
            {p("As we saw last time, digital circuits tell two states apart most reliably. So computers use base-2, or binary. Only two digits (0 and 1), and each column's value grows as a power of 2 — 1, 2, 4, 8, 16, 32, and so on.")}
            {p('Why powers of 2? Every new bit doubles the possibilities. One bit gives two (0 or 1). Two bits give four (00, 01, 10, 11). Three give eight, four give sixteen. The possibilities grow exponentially.')}
            {p('So how do we build numbers from these columns? The rule is simple: set the columns whose values you need to add to 1, and leave the rest at 0. Build 13 yourself on the instrument below:')}
          </div>
        )}
        <PlaceValueBuilder />
        {bn ? (
          <div lang="bn" style={bodyStyle}>
            {p(<>উদাহরণ হিসেবে ১৩ ধরা যাক। কলামগুলো ৮, ৪, ২, ১। ১৩ বানাতে লাগবে একটা ৮, একটা ৪ আর একটা ১ (৮ + ৪ + ১ = ১৩)। ২ লাগছে না। তাই বাইনারিতে ১৩ হলো <code>1101</code>।</>)}
            {pre('1101₂ = (1×8) + (1×4) + (0×2) + (1×1) = 13₁₀')}
            {p('পজিটিভ সংখ্যা তো বুঝলাম, কিন্তু মাইনাস (−) চিহ্ন রাখা হবে কীভাবে? Memory-তে প্লাস-মাইনাস বলে কিছু নেই — আছে শুধু bit।')}
            {p(<>প্রথম দেখায় মনে হতে পারে, একদম বামের bit-টাকে (Most Significant Bit) চিহ্নের জন্য রেখে দিলেই হয় — 0 মানে প্লাস, 1 মানে মাইনাস। এই পদ্ধতির নাম Sign-Magnitude। কিন্তু এতে একটা বড় খুঁত আছে: +0 আর −0 নামে শূন্যের দুটো আলাদা রূপ তৈরি হয় (৮-bit-এ <code>00000000</code> আর <code>10000000</code>)। গণিতে শূন্যের কোনো চিহ্ন নেই, আর দুটো শূন্য থাকা মানে যোগ-বিয়োগের circuit অকারণে জটিল হওয়া।</>)}
            {p(<>এর সবচেয়ে চমৎকার, hardware-বান্ধব সমাধান হলো <Term id="twoscomp">Two's Complement</Term>।</>)}
            {p('নেগেটিভ সংখ্যা বের করার নিয়মটা সহজ: পজিটিভ রূপের প্রতিটা bit উল্টে দিন (0-কে 1, 1-কে 0 — যাকে বলে One\'s Complement), তারপর তার সাথে 1 যোগ করুন।')}
            {p(<>এর বড় সুবিধা: <strong>বিয়োগকে যোগ হিসেবে করা যায়</strong> — A − B মানে A + (−B)। ফলে একই adder circuit দিয়েই যোগ-বিয়োগ দুটো চলে; ALU-কে শুধু সামান্য control দিয়ে বলে দিতে হয় এখন যোগ না বিয়োগ। চিহ্ন সামলানোর জন্য আলাদা কোনো circuit লাগে না।</>)}
            {p('সংখ্যা তো হলো। কিন্তু বাস্তবে তো শুধু সংখ্যা লেখেন না। চ্যাটবক্সে "Hello" লিখলে সেই অক্ষরগুলো কীভাবে binary হয়?')}
          </div>
        ) : (
          <div style={bodyStyle}>
            {p(<>Take 13 as an example. The columns are 8, 4, 2, 1. To make 13 we need one 8, one 4, and one 1 (8 + 4 + 1 = 13). We don't need the 2. So 13 in binary is <code>1101</code>.</>)}
            {pre('1101₂ = (1×8) + (1×4) + (0×2) + (1×1) = 13₁₀')}
            {p("Positive numbers make sense — but how do we store a minus (−) sign? Memory has no plus or minus in it — only bits.")}
            {p(<>At first glance you might reserve the leftmost bit (the Most Significant Bit) for the sign — 0 for positive, 1 for negative. That's called Sign-Magnitude. But it has a real flaw: zero ends up with two forms, +0 and −0 (<code>00000000</code> and <code>10000000</code> in 8 bits). Zero has no sign in mathematics, and two zeros needlessly complicate the circuits that add and subtract.</>)}
            {p(<>The most elegant, hardware-friendly solution is <Term id="twoscomp">Two's Complement</Term>.</>)}
            {p("The rule for a negative number is simple: flip every bit of the positive version (0 to 1, 1 to 0 — known as One's Complement), then add 1.")}
            {p(<>The big payoff: <strong>subtraction becomes addition</strong> — A − B is A + (−B). So one adder circuit handles both; the ALU only needs a little control to say "add" or "subtract" right now. No separate circuitry is needed just to handle signs.</>)}
            {p('Numbers are handled. But in real life you don\'t only type numbers. When you type "Hello" in a chat box, how do those letters become binary?')}
          </div>
        )}
      </Section>

      {/* ── 03 — Text ────────────────────────────────────────────────── */}
      <Section num="03" bnH2="তথ্য যদি হয় text" enH2="If our piece of information is text">
        {bn ? (
          <div lang="bn" style={bodyStyle}>
            {p('Text-কে binary বানানোর ট্রিকটা সহজ — প্রতিটা অক্ষরের জন্য একটা করে নির্দিষ্ট সংখ্যা বরাদ্দ করা।')}
            {p(<>Computing-এর একেবারে শুরুর দিকে এই standard-এর নাম ছিল <Term id="ascii">ASCII</Term>। প্রতিটা ইংরেজি অক্ষর, digit, punctuation — সবার জন্য একটা করে ৭-bit code:</>)}
            {pre('বড় হাতের  A  →  65  →  01000001\nছোট হাতের  a  →  97  →  01100001')}
            {p('ইংরেজির জন্য ASCII ঠিকঠাকই কাজ করত। সমস্যা শুরু হলো অন্য ভাষা বা emoji-র প্রয়োজন পড়ায়। ৭ bit-এ সর্বোচ্চ ১২৮টা character-এর জায়গা — শুধু বাংলা বর্ণমালার জন্যই যথেষ্ট না, পৃথিবীর হাজার হাজার ভাষার কথা তো বাদই দিলাম।')}
            {p('শুরুর দিকে যখন Python বা C দিয়ে database-এ বাংলা input নেওয়া হতো, প্রায়ই screen-এ অদ্ভুত হিজিবিজি character দেখাত। প্রোগ্রামাররা ভাবত — লিখলাম বাংলা, screen-এ কেন এই garbage?')}
            {p('Computer আসলে বাংলা character-কে ভুল dictionary দিয়ে decode করার চেষ্টা করছিল। ASCII-র dictionary-তে বাংলা নেই। ছিলই না।')}
            {p(<>এর সমাধান <Term id="unicode">Unicode</Term> — একটা international standard, যা পৃথিবীর নানা লিপির অক্ষর আর symbol-এর জন্য একটা করে code point, মানে পরিচয় নম্বর, ঠিক করে দেয়।</>)}
            {p(<>এখানে একটা সূক্ষ্ম পার্থক্য আছে, যেটা অনেকেই ধরতে পারে না, কারণ Unicode আর UTF-8 প্রায়ই একই অর্থে বলা হয়। কিন্তু <strong>এরা এক জিনিস না</strong>। Unicode বলে দেয় প্রতিটা অক্ষরের পরিচয় কী। সেই পরিচয় actual byte হিসেবে কীভাবে লেখা হবে — সেটা বলে UTF-8।</>)}
            {p(<><Term id="utf8">UTF-8</Term> হলো variable-length encoding। ইংরেজি অক্ষরের জন্য ১ byte — ASCII-র সাথে হুবহু মিলে যায়। বাংলা অক্ষরের জন্য সাধারণত ৩ byte, আর অনেক emoji-র জন্য ৪ byte।</>)}
          </div>
        ) : (
          <div style={bodyStyle}>
            {p('The trick for turning text into binary is simple — give every character a specific number.')}
            {p(<>The earliest standard for this was <Term id="ascii">ASCII</Term>. Every English letter, digit, and punctuation mark got a 7-bit code:</>)}
            {pre('Capital  A  →  65  →  01000001\nSmall    a  →  97  →  01100001')}
            {p('ASCII worked fine for English. The trouble started when other languages and emoji came along. 7 bits leaves room for only 128 characters — not even enough for the Bangla alphabet, let alone the thousands of languages in the world.')}
            {p("Early on, when I tried taking Bangla input into a database using Python or C, I'd often see weird garbage on the screen. I typed Bangla; the screen showed nonsense.")}
            {p("Later I understood — the computer was trying to decode my Bangla characters with the wrong dictionary. ASCII's dictionary doesn't have Bangla. It never did.")}
            {p(<>The solution is <Term id="unicode">Unicode</Term> — an international standard that assigns a code point, an identity number, to characters and symbols across the world's writing systems.</>)}
            {p(<>There's a subtle distinction here that many people miss, because Unicode and UTF-8 are often used interchangeably. <strong>They aren't the same thing.</strong> Unicode says what each character's identity is. How that identity is written as actual bytes — that's UTF-8's job.</>)}
            {p(<><Term id="utf8">UTF-8</Term> is a variable-length encoding. An English character takes 1 byte — identical to ASCII. A Bangla letter usually takes 3 bytes, and many emoji take 4.</>)}
          </div>
        )}
        <UnicodeEncodingDemo />
        {bn ? (
          <div lang="bn" style={bodyStyle}>
            {p('Text-এর গল্প এতটুকুই। তথ্যের টুকরোটা যদি অক্ষর হয়, এতক্ষণে সে byte হয়ে memory-তে ঢোকার জন্য প্রস্তুত।')}
            {p('কিন্তু তথ্য যদি ছবির একটা অংশ হয়?')}
          </div>
        ) : (
          <div style={bodyStyle}>
            {p("That's the text story. If our piece of information is a character, it's now bytes, ready to land in memory.")}
            {p("But what if it's part of an image?")}
          </div>
        )}
      </Section>

      {/* ── 04 — Image ───────────────────────────────────────────────── */}
      <Section num="04" bnH2="তথ্যের টুকরো যদি হয় image" enH2="If our piece of information is an image">
        {bn ? (
          <div lang="bn" style={bodyStyle}>
            {p('যেকোনো digital ছবিকে খুব কাছ থেকে দেখলে দেখা যাবে, এটা আসলে লক্ষ লক্ষ ক্ষুদ্র বিন্দুর সমষ্টি। প্রতিটা বিন্দুকে বলে pixel।')}
            {p('Screen-এ রঙ তৈরিতে ব্যবহার হয় RGB model — প্রতিটা pixel তিনটা primary color-এর মিশ্রণ: Red, Green, Blue।')}
            {p('প্রতিটা color কতটা উজ্জ্বল, সেটা বলে ০ থেকে ২৫৫-এর একটা মান। ২৫৫ মানে সর্বোচ্চ উজ্জ্বলতা, ০ মানে সম্পূর্ণ বন্ধ। ২৫৫ পর্যন্ত রাখতে প্রতি channel-এ ৮ bit (১ byte) লাগে।')}
            {p('তাহলে একটা pixel-এর রঙে মোট ৮ + ৮ + ৮ = ২৪ bit। একেই বলে 24-bit color depth। নিচের যন্ত্রে যেকোনো pixel-এ চাপ দিয়ে তার binary রূপ দেখুন:')}
          </div>
        ) : (
          <div style={bodyStyle}>
            {p("Zoom in on any digital picture and you'll see it's made of millions of tiny dots. Each dot is called a pixel.")}
            {p('To produce colour on a screen we use the RGB model — every pixel is a mix of three primary colours: Red, Green, Blue.')}
            {p("Each colour's brightness is a value from 0 to 255. 255 is full brightness, 0 is completely off. Holding values up to 255 takes 8 bits (1 byte) per channel.")}
            {p("So one pixel's colour takes 8 + 8 + 8 = 24 bits. That's what we call 24-bit colour depth. Press any pixel on the instrument below to see its binary form:")}
          </div>
        )}
        <PixelColorDemo />
        {bn ? (
          <div lang="bn" style={bodyStyle}>
            {p('Computer এই pixel মানগুলো row-by-row সাজিয়ে পুরো ছবিটাকে একটা লম্বা bit sequence হিসেবে রাখে।')}
            {p('এবার একটা হিসাব। 1920×1080 একটা ছবিতে:')}
            {pre('1920 × 1080  =  2,073,600 pixel\n× 24 bit      ≈  49.8 million bit\n              ≈  6.2 MB')}
            {p(<>অর্থাৎ compress না করা (raw) অবস্থায় এমন একটা ছবির জন্য সত্যিই প্রায় ৬.২ MB লাগে। অথচ phone-এর একটা JPEG ছবি প্রায়ই এর চেয়ে অনেক ছোট file। কেন? কারণ <strong>সেটা compressed</strong> — সেই গল্প একটু পরে।</>)}
            {p('Image-এর গল্পও শেষ। কিন্তু কানে যা শুনি? বাতাসে ভেসে আসা একটা সুর তো কোনো অক্ষর না, কোনো pixel-ও না। সেটাকে bit বানাব কীভাবে?')}
          </div>
        ) : (
          <div style={bodyStyle}>
            {p('The computer lays these pixel values out row by row and keeps the whole image as one long sequence of bits.')}
            {p("Now a quick calculation. A 1920×1080 image has:")}
            {pre('1920 × 1080  =  2,073,600 pixels\n× 24 bits     ≈  49.8 million bits\n              ≈  6.2 MB')}
            {p(<>So an uncompressed (raw) image like this really does need about 6.2 MB. Yet a JPEG photo on your phone is often a much smaller file. Why? <strong>Because it's compressed</strong> — more on that shortly.</>)}
            {p("Image handled. But what about what we hear? A tune floating through the air isn't a character, and it isn't a pixel either. How does that become bits?")}
          </div>
        )}
      </Section>

      {/* ── 05 — Sound ───────────────────────────────────────────────── */}
      <Section num="05" bnH2="তথ্যের টুকরো যদি হয় sound" enH2="If our piece of information is sound">
        {bn ? (
          <div lang="bn" style={bodyStyle}>
            {p('শব্দ মূলত একটা continuous pressure wave — বাতাসের কাঁপুনি। কিন্তু computer রাখতে পারে শুধু আলাদা আলাদা (discrete) সংখ্যা।')}
            {p('তাহলে continuous জিনিসকে discrete করা যায় কীভাবে?')}
            {p('একটা analogy। ধরুন আপনি একটা দৌড়ের video করছেন। প্রতি সেকেন্ডে একটাই ছবি তুললে video খাপছাড়া লাগবে — এক মুহূর্তে দৌড়বিদ এখানে, পরের মুহূর্তে হঠাৎ অনেক দূরে। কিন্তু প্রতি সেকেন্ডে ৬০টা ছবি তুললে সেটা smooth চলমান video হয়ে যায়।')}
            {p('শব্দের ক্ষেত্রেও তাই। পুরো wave-টা ধরে রাখা হয় না — বরং খুব দ্রুত অনেকগুলো "ছবি" তোলা হয়। প্রতিটা "ছবি" মানে: ঠিক এই মুহূর্তে wave-টার উচ্চতা (amplitude) কত।')}
            {p(<>এই প্রক্রিয়ার নাম <Term id="sampling">sampling</Term>। নিচের যন্ত্রে rate কমিয়ে-বাড়িয়ে দেখুন wave-টা কতটা বিশ্বস্তভাবে ধরা পড়ে:</>)}
          </div>
        ) : (
          <div style={bodyStyle}>
            {p('Sound is a continuous pressure wave — the air shaking. But a computer can only store separate (discrete) numbers.')}
            {p('So how do you turn something continuous into something discrete?')}
            {p("Think of it this way. You're filming someone running. Take one picture per second and the video looks jerky — one moment the runner is here, the next they're way over there. Take 60 pictures per second and it becomes smooth motion.")}
            {p('Sound works the same way. The wave itself isn\'t kept in full — instead, very frequent "snapshots" are taken. Each snapshot means: at this exact moment, how high is the wave (its amplitude)?')}
            {p(<>This process is called <Term id="sampling">sampling</Term>. Sweep the rate up and down below and watch how faithfully the wave gets captured:</>)}
          </div>
        )}
        <SamplingRateDemo />
        {bn ? (
          <div lang="bn" style={bodyStyle}>
            {p('একটা audio কতটা নিখুঁত হবে, সেটা নির্ভর করে দুটো জিনিসের ওপর।')}
            {p(<><strong>Sample rate:</strong> প্রতি সেকেন্ডে কতবার wave-এর উচ্চতা মাপা হচ্ছে। CD quality audio-র standard 44,100 Hz — প্রতি সেকেন্ডে ৪৪,১০০ বার measurement।</>)}
          </div>
        ) : (
          <div style={bodyStyle}>
            {p('How faithful a piece of audio is depends on two things.')}
            {p(<><strong>Sample rate:</strong> how many times per second the wave's height is measured. The standard for CD-quality audio is 44,100 Hz — 44,100 measurements per second.</>)}
          </div>
        )}
        <Deeper
          bnLabel="আরেকটু গভীরে — কেন 44.1 kHz?"
          enLabel="go deeper — why 44.1 kHz?"
        >
          {deeperBody(bn ? (
            <>
              {dp('এত বেশি কেন? মানুষের কান মোটামুটি 20 kHz পর্যন্ত শুনতে পারে। আর কোনো শব্দের সবচেয়ে উঁচু frequency যদি f হয়, সেটাকে ঠিকঠাক ধরতে sample rate হতে হয় 2f-এর চেয়ে বেশি — এটাই Nyquist-এর মূল কথা। তার কম হলে উঁচু সুরগুলো ভুল করে নিচু সুর হিসেবে ধরা পড়ে। 20 kHz-এর জন্য তাই 40 kHz-এর বেশি লাগবে।')}
              {dp('কিন্তু ঠিক 44,100 কেন, 40,000 বা 45,000 না? এর উত্তর Nyquist না, ইতিহাস। শুরুর দিকে digital audio রেকর্ড করা হতো video tape-এ। NTSC আর PAL — দুই টেলিভিশন standard-এর সাথেই মিলে যায় এমন একটা সংখ্যা দরকার ছিল, আর 44,100 ছিল সেই সংখ্যা। আজকের প্রতিটা গান সেই পুরনো video equipment-এর হিসাব বয়ে বেড়াচ্ছে।', true)}
            </>
          ) : (
            <>
              {dp("Why so many? The human ear hears up to roughly 20 kHz. And if the highest frequency in a sound is f, capturing it correctly needs a sample rate greater than 2f — that's the core of Nyquist. Go lower and high tones get mistaken for lower ones. So 20 kHz needs more than 40 kHz.")}
              {dp("But why exactly 44,100, and not 40,000 or 45,000? That part isn't Nyquist — it's history. Early digital audio was recorded onto video tape. Engineers needed one number that worked with both television standards, NTSC and PAL, and 44,100 was that number. Every song today still carries the arithmetic of that old video equipment.", true)}
            </>
          ))}
        </Deeper>
        {bn ? (
          <div lang="bn" style={bodyStyle}>
            {p(<><strong>Bit depth:</strong> প্রতিটা measurement কতগুলো সম্ভাব্য মানের একটা হতে পারবে। ১৬ bit মানে ৬৫,৫৩৬টা আলাদা level। Bit বেশি হলে প্রতিটা measurement আসল উচ্চতার আরও কাছাকাছি বসে।</>)}
            {p(<>সহজ করে বললে — sample rate ঠিক করে <strong>কত ঘনঘন</strong> মাপা হচ্ছে, আর bit depth ঠিক করে প্রতিবার <strong>কত সূক্ষ্মভাবে</strong> মাপা হচ্ছে।</>)}
            {p('তারমানে তথ্যের টুকরো এখন আর অক্ষর, pixel বা শব্দ না — সব রূপেই সে এখন সংখ্যা, আর সংখ্যা মানেই bit।')}
            {p('কিন্তু এখানে একটা সমস্যা আছে।')}
          </div>
        ) : (
          <div style={bodyStyle}>
            {p(<><strong>Bit depth:</strong> how many possible values each measurement can take. 16 bits means 65,536 distinct levels. More bits, and each measurement lands closer to the wave's true height.</>)}
            {p(<>Put simply — sample rate decides <strong>how often</strong> we measure, and bit depth decides <strong>how finely</strong> we measure each time.</>)}
            {p("So our piece of information is no longer a character, a pixel, or a sound — in every form it's now numbers, and numbers are bits.")}
            {p("But there's a problem.")}
          </div>
        )}
      </Section>

      {/* ── 06 — Size problem ────────────────────────────────────────── */}
      <Section num="06" bnH2="সমস্যা — সব কিছুই বিশাল" enH2="The problem — everything is huge">
        {bn ? (
          <div lang="bn" style={bodyStyle}>
            {p('Text, image, sound-এর প্রতিটা কণা যদি এভাবে হুবহু লিখে রাখা হয়, file size হবে ভয়াবহ:')}
            {pre('3-minute গান (CD quality)   →  ~30 MB   (raw)\n1080p ছবি                    →  ~6 MB    (raw)\n1-hour 4K video (30 fps)     →  ~2.7 TB  (raw)')}
            {p('এত বড় file-এর ভার internet সহ্য করতে পারবে না। Instagram-এ ছবি upload করতে ঘণ্টা লেগে যাবে। YouTube video load-ই হবে না।')}
            {p('সমাধান হলো compression — ছোট করে ফেলা। আর এই magic আসলে দুই ধরনের।')}
          </div>
        ) : (
          <div style={bodyStyle}>
            {p('If every bit of text, image, and sound were stored exactly like this, file sizes would be terrifying:')}
            {pre('3-minute song (CD quality)  →  ~30 MB   (raw)\n1080p image                 →  ~6 MB    (raw)\n1-hour 4K video (30 fps)    →  ~2.7 TB  (raw)')}
            {p("The internet couldn't carry this weight. Instagram uploads would take hours. YouTube videos wouldn't load.")}
            {p('The solution is compression — making it small. And the magic comes in two flavours.')}
          </div>
        )}
      </Section>

      {/* ── 07 — Compression ─────────────────────────────────────────── */}
      <Section num="07" bnH2="Compression: চতুরভাবে ছোট করা" enH2="Compression: clever shrinking">
        {bn ? (
          <div lang="bn" style={bodyStyle}>
            {p(<><Term id="lossless">Lossless compression</Term>-এ <strong>কিছুই হারায় না</strong>। File compress করলাম, পরে decompress করলাম — হুবহু original ফিরে পেলাম, একটাও bit বদলাল না।</>)}
            {p('এটা কীভাবে সম্ভব? একটা প্রচলিত কৌশল হলো data-র মধ্যে repetition বা pattern খুঁজে বের করা। সবচেয়ে সরল উদাহরণ দিয়ে শুরু করা যাক — নিচের জিনিসটা লেখার সহজ উপায় কী?')}
            {pre('AAAAAAAAAAAAAAAAAA')}
            {p('আপনি হয়তো বলবেন — "18 × A"।')}
            {p('দুটোই একই কথা, কিন্তু দ্বিতীয়টা অনেক ছোট। এটাই Run-Length Encoding (RLE)-এর আইডিয়া: পর পর একই জিনিস থাকলে বারবার না লিখে শুধু "কতবার" আর "কী" লেখা। কোনো ছবিতে পর পর ৫০টা সাদা pixel থাকলে RLE লিখবে 50 × White — ৫০টা আলাদা মানের বদলে একটা জোড়া।')}
          </div>
        ) : (
          <div style={bodyStyle}>
            {p(<><Term id="lossless">Lossless compression</Term> <strong>loses nothing</strong>. Compress a file, decompress it later, and you get the exact original back — not a single bit changed.</>)}
            {p("How is that possible? A common approach is to find repetition or patterns in the data. Let's start with the simplest example — what's the shortest way to write this?")}
            {pre('AAAAAAAAAAAAAAAAAA')}
            {p('You\'d probably say — "18 × A."')}
            {p('Both say the same thing, but the second is much smaller. That\'s the idea behind Run-Length Encoding (RLE): when something repeats, don\'t write it out; just write "how many" and "what." A picture with 50 white pixels in a row? RLE writes 50 × White instead of storing 50 separate values.')}
          </div>
        )}
        <RLECompressionDemo />
        {bn ? (
          <div lang="bn" style={bodyStyle}>
            {p('আরেকটা technique হলো Huffman coding। ধরুন আপনি আর আপনার বন্ধু প্রতিদিন ১০০ বার একটা phrase লেখেন — "ঠিক আছে"। দুজন মিলে যদি আগে থেকে ঠিক করে রাখেন একটা ⭐ মানে "ঠিক আছে", তাহলে একই তথ্য অনেক কম জায়গায় প্রকাশ করা যায়।')}
            {p('Huffman-এর আইডিয়া ঠিক এমন: file-এ সবচেয়ে বেশিবার আসা data-কে সবচেয়ে ছোট code দাও, কম আসা data-কে বড় code। মোট size তখন কমে যায়। (পুরো algorithm-এ tree, priority queue আসে — আপাতত এই intuition-টুকুই যথেষ্ট।)')}
            {p('Developer হিসেবে যখন browser-এ HTML, CSS, JS পাঠান, server সাধারণত Gzip বা Brotli দিয়ে সেটা ছোট করে নেয়। এখানে lossless-ই দরকার — একটা semicolon হারালেই code ভেঙে পড়বে, আর lossless-এ decompress করলে হুবহু একই byte ফিরে আসে।')}
            {p(<><Term id="lossy">Lossy compression</Term> অন্য জিনিস। এখানে কিছু তথ্য ইচ্ছা করে বাদ দেওয়া বা আনুমানিক (approximate) করা হয় — বেছে বেছে সেই অংশ, যেটা হারালে মানুষের চোখ-কানে ক্ষতিটা সবচেয়ে কম ধরা পড়ে। তবে ক্ষতিটা সবসময় পুরোপুরি অদৃশ্য, তা না।</>)}
            {p('Sound-এ: MP3 মানুষের শোনার সীমাবদ্ধতা কাজে লাগায়। যে অংশ মানুষ প্রায় শুনতেই পায় না, সেটা বাদ। একটা জোরালো শব্দের পাশে একই মুহূর্তে একটা হালকা শব্দ থাকলে কান হালকাটা ধরতে পারে না — তাই সেটাও বাদ।')}
            {p('Image-এ: JPEG চোখের বৈশিষ্ট্য কাজে লাগায়। আমাদের চোখ রঙের চেয়ে আলোর তারতম্য বেশি ভালো ধরে। তাই রঙের তথ্য কিছুটা কমিয়ে দিলে চোখ টের পায় না, কিন্তু file অনেক ছোট হয়।')}
            {p('Video-তে: এক frame থেকে পরের frame-এ যে অংশ বদলায় না (যেমন background), সেটা নতুন করে না রেখে আগের frame থেকে reference নেওয়া হয়। H.264, H.265, AV1 — এরা সবাই এই আইডিয়া কাজে লাগায়।')}
          </div>
        ) : (
          <div style={bodyStyle}>
            {p('Another technique is Huffman coding. Suppose you and a friend text the phrase "yeah, okay" 100 times a day. If you agree in advance that one ⭐ means "yeah, okay," the same information takes far less space.')}
            {p("Huffman's idea is exactly that: give the data that appears most often the shortest code, and rarer data longer codes. The total size shrinks. (The full algorithm involves trees and priority queues — this intuition is enough for now.)")}
            {p("As a developer, when you send HTML, CSS, or JS to a browser, the server commonly shrinks it with Gzip or Brotli. Lossless is what's needed there — lose one semicolon and the code breaks, and lossless decompression gives back exactly the same bytes.")}
            {p(<><Term id="lossy">Lossy compression</Term> is a different beast. Here some information is deliberately thrown away or approximated — choosing the parts whose loss people notice least. The loss isn't always invisible, though.</>)}
            {p("Sound: MP3 exploits the limits of hearing. Parts people can barely hear are dropped. If a quiet sound plays at the same moment as a loud one, the ear can't catch the quiet one — so that goes too.")}
            {p("Image: JPEG exploits how the eye works. We notice differences in brightness better than differences in colour, so JPEG trims colour detail; the eye doesn't notice, but the file shrinks a lot.")}
            {p("Video: parts that don't change from one frame to the next (like the background) aren't stored again; the encoder refers back to the previous frame. H.264, H.265, AV1 — all exploit this idea.")}
          </div>
        )}
        <Deeper
          bnLabel="আরেকটু গভীরে — ছোট JPEG file, কিন্তু screen-এ বড় ছবি"
          enLabel="go deeper — a small JPEG file, but a big image on screen"
        >
          {deeperBody(bn ? (
            dp('২ MB-র একটা JPEG দেখাতে কি ২ MB memory-ই লাগে? না। Screen-এ দেখানোর আগে computer file-টা decode করে প্রতিটা pixel-এর পুরো মান আবার বের করে আনে — মানে আগের হিসাবের সেই raw pixel data।')
          ) : (
            dp("Does a 2 MB JPEG only need 2 MB of memory to show? No. Before it reaches the screen, the computer decodes the file and rebuilds every pixel's full value — the same raw pixel data we calculated earlier.")
          ))}
          <Diagram
            art={bn
              ? 'JPEG file   (compressed, ছোট)\n     ↓ decode\nপুরো pixel data   (raw, 1080p-তে ~6.2 MB)\n     ↓\nScreen'
              : 'JPEG file   (compressed, small)\n     ↓ decode\nfull pixel data   (raw, ~6.2 MB at 1080p)\n     ↓\nScreen'}
            bnLabel="diagram · file থেকে screen"
            enLabel="diagram · file to screen"
          />
          {deeperBody(bn ? (
            dp('Compression file ছোট করে — রাখা আর পাঠানোর সুবিধার জন্য। ছবি দেখানোর সময় সেই raw pixel-গুলোই আবার লাগে।', true)
          ) : (
            dp('Compression makes the file small — for storing and sending. Showing the picture still needs the raw pixels.', true)
          ))}
        </Deeper>
        {bn ? (
          <div lang="bn" style={bodyStyle}>
            {p('সহজ rule of thumb — হুবহু original দরকার হলে lossless; চোখ-কানে প্রায় একই লাগলেই চলবে এমন হলে lossy। তাই code, text, database-এ lossless। আর media মানেই lossy, তা-ও না — PNG ছবি বা FLAC গান lossless।')}
          </div>
        ) : (
          <div style={bodyStyle}>
            {p("A simple rule of thumb — if you need the exact original, use lossless; if something that looks or sounds nearly the same is good enough, lossy works. That's why code, text, and databases use lossless. And media isn't automatically lossy either — PNG images and FLAC audio are lossless.")}
          </div>
        )}
      </Section>

      {/* ── 08 — Meaning needs context ───────────────────────────────── */}
      <Section num="08" bnH2="CPU নিজে থেকে এসব meaning জানে না" enH2="The CPU doesn't know any of this meaning by itself">
        {bn ? (
          <div lang="bn" style={bodyStyle}>
            {p('এই জায়গায় একটা গুরুত্বপূর্ণ ব্যাপার আছে।')}
            {p(<>ধরুন memory-তে কোথাও এই আটটা bit আছে: <code>01000001</code>। Hardware এর দিকে তাকিয়ে নিজে থেকে বলবে না "এটা A"। আবার এটা জন্মগতভাবে ৬৫ সংখ্যাও না।</>)}
            {p('একই bit pattern ভিন্ন context-এ ভিন্ন জিনিস বোঝাতে পারে — unsigned সংখ্যা হিসেবে পড়লে ৬৫, ASCII বা UTF-8 text হিসেবে পড়লে "A", আর কোনো ছবির format-এর ভেতরে হয়তো একটা রঙের channel-এর মান।')}
            {p('কোনটা ঠিক, সেটা ঠিক করে program কোন instruction চালাচ্ছে আর data-টা কোন format-এ রাখা আছে। নিচে একই আট bit, তিনটা ভিন্ন lens-এ:')}
          </div>
        ) : (
          <div style={bodyStyle}>
            {p("Here's an important point.")}
            {p(<>Suppose memory contains these eight bits: <code>01000001</code>. The hardware doesn't look at them and spontaneously say "that's the letter A." Nor is the pattern inherently the number 65.</>)}
            {p("The same bit pattern can mean different things in different contexts — read as an unsigned number it's 65, read as ASCII or UTF-8 text it's \"A\", and inside an image format it might be one colour channel's value.")}
            {p('Which reading is right depends on the instructions the program runs and the format the data is stored in. Here are the same eight bits through three different lenses:')}
          </div>
        )}
        <CPUBlindLens />
        {bn ? (
          <div lang="bn" style={bodyStyle}>
            {p(<>তার মানে CPU অকেজো, তা না — সে machine instruction-এর নির্দিষ্ট নিয়ম নিখুঁতভাবে মেনে চলে। কিন্তু কোনো bit pattern "বাংলা", "বিড়াল" নাকি "৬৫" — সেটা সে নিজে থেকে আবিষ্কার করে না। Bit নিজে কোনো মানুষ-বোধ্য অর্থ বহন করে না; অর্থ আসে <strong>representation আর context</strong> থেকে।</>)}
          </div>
        ) : (
          <div style={bodyStyle}>
            {p(<>That doesn't mean the CPU does nothing — it executes machine instructions by precise rules. But it never discovers on its own that a bit pattern is \"Bangla,\" \"a cat,\" or \"the number 65.\" Bits carry no human-level meaning by themselves; meaning comes from <strong>representation and context</strong>.</>)}
          </div>
        )}
      </Section>

      {/* ── 09 — Whole story ─────────────────────────────────────────── */}
      <Section num="09" bnH2="পুরো গল্পটা একবার" enH2="The whole story at once">
        {bn ? (
          <div lang="bn" style={bodyStyle}>
            {p('এবার "Hello"-কে উদাহরণ হিসেবে নিই। আপনি একটা source file-এ লিখলেন:')}
            {pre('const message = "Hello";')}
            {p('File-টা UTF-8-এ save হলে "Hello"-র পাঁচটা অক্ষর file-এ পাঁচটা byte হিসেবে বসে (hex-এ লেখা):')}
            {pre('H    e    l    l    o\n48   65   6C   6C   6F')}
            {ul([
              <>প্রতিটা byte আটটা bit — যেমন H মানে <code>01001000</code></>,
              'File disk-এ থাকুক বা RAM-এ, সেই bit-গুলো সেখানকার hardware-এর physical অবস্থা হিসেবে থাকে — ঠিক কী ধরনের অবস্থা, সেটা storage technology-র ওপর নির্ভর করে',
              'JavaScript engine byte-গুলো পড়ে code parse করে, আর string-টাকে নিজের ভেতরের একটা representation-এ রাখে — সেটা হুবহু UTF-8 হতেই হবে, এমন না',
              'একই text network-এ পাঠালে আরও কিছু layer যোগ হতে পারে — যেমন ইচ্ছামতো Gzip compression',
            ])}
            {p('একটা অক্ষরের যাত্রাটা আলাদা করে দেখলে:')}
          </div>
        ) : (
          <div style={bodyStyle}>
            {p('Let\'s use "Hello" as an example. You write this in a source file:')}
            {pre('const message = "Hello";')}
            {p('If the file is saved as UTF-8, the five letters of "Hello" sit in it as five bytes (written in hex):')}
            {pre('H    e    l    l    o\n48   65   6C   6C   6F')}
            {ul([
              <>Each byte is eight bits — H is <code>01001000</code></>,
              'Whether the file is on disk or in RAM, those bits live there as physical states of that hardware — exactly what kind of state depends on the storage technology',
              'The JavaScript engine reads the bytes, parses the code, and keeps the string in its own internal representation — which doesn\'t have to be UTF-8',
              'Send the same text over a network and more layers can join in — optional Gzip compression, for example',
            ])}
            {p('Following one character on its own:')}
          </div>
        )}
        <Diagram
          art={bn
            ? '"H"          ← মানুষের অক্ষর\n↓ Unicode\nU+0048       ← code point\n↓ UTF-8\n0x48         ← byte\n↓\n01001000     ← bit\n↓\nphysical বৈদ্যুতিক অবস্থা'
            : '"H"          ← a human character\n↓ Unicode\nU+0048       ← code point\n↓ UTF-8\n0x48         ← byte\n↓\n01001000     ← bits\n↓\nphysical electrical states'}
          bnLabel="diagram · একটা অক্ষর, অনেক স্তর"
          enLabel="diagram · one character, many layers"
        />
        {bn ? (
          <div lang="bn" style={bodyStyle}>
            {p('পুরো পথে representation বদলেছে বারবার। কখনো শুধু রূপ বদলায় আর original হুবহু ফিরে পাওয়া যায় — যেমন lossless compression-এ। কখনো ইচ্ছা করেই আনুমানিক করা হয় — যেমন lossy compression-এ। দুই ক্ষেত্রেই লক্ষ্য একটাই: তথ্যের কাজের অর্থটুকু যতটা সম্ভব ধরে রাখা।')}
          </div>
        ) : (
          <div style={bodyStyle}>
            {p('The representation changed again and again along the way. Sometimes only the form changes and the original can be recovered exactly — as with lossless compression. Sometimes it is deliberately approximated — as with lossy compression. Either way, the goal is to keep the useful meaning of the information as intact as possible.')}
          </div>
        )}

        <aside
          style={{ margin: '28px 0 24px', border: '2px solid #00753F', padding: '20px 22px', background: 'rgba(255,252,243,0.55)', ...bodyStyle }}
          {...(bn ? { lang: 'bn' } : {})}
        >
          <div style={{ fontFamily: "'Departure Mono',monospace", fontSize: '11.5px', letterSpacing: '0.1em', color: '#00753F', marginBottom: 12, textTransform: 'uppercase' }}>
            {bn ? '// চারটা জিনিস গুলিয়ে ফেলবেন না' : "// don't mix up these four"}
          </div>
          <ul style={{ margin: '0 0 14px', paddingLeft: 22, ...bodyStyle }}>
            {(bn
              ? [
                  ['Bit', 'একটা logical ০ বা ১'],
                  ['Byte', '৮টা bit-এর একটা দল'],
                  ['সংখ্যা', 'একটা গাণিতিক মান, কোনো নির্দিষ্ট নিয়মে bit-এ লেখা'],
                  ['Voltage', 'একটা physical বৈদ্যুতিক রাশি, যা দিয়ে hardware একটা bit-এর অবস্থা ধরে রাখতে পারে'],
                ]
              : [
                  ['Bit', 'a logical 0 or 1'],
                  ['Byte', 'a group of 8 bits'],
                  ['Number', 'a mathematical value, written into bits by some defined rule'],
                  ['Voltage', "a physical electrical quantity that hardware can use to hold a bit's state"],
                ]
            ).map(([k, v]) => (
              <li key={k} style={{ marginBottom: 6 }}><strong>{k}</strong> — {v}</li>
            ))}
          </ul>
          <p style={{ margin: 0, ...bodyStyle }}>
            {bn
              ? <>যেমন সংখ্যা ৫, তার binary রূপ <code>101</code>, একটা byte-এ রাখলে <code>00000101</code>, আর hardware-এ কিছু বৈদ্যুতিক অবস্থা — সম্পর্কিত, কিন্তু এক জিনিস না।</>
              : <>For example: the number 5, its binary form <code>101</code>, stored in a byte as <code>00000101</code>, and some electrical states in the hardware — related, but not the same thing.</>}
          </p>
        </aside>

        <Recap>
          {bn ? (
            <>
              <li>কম্পিউটার ছবি "দেখে" না, গান "শোনে" না — সব তথ্যকে আগে একটা নির্দিষ্ট নিয়মে bit-এ encode করতে হয়।</li>
              <li>প্রতিটা ধরনের তথ্যের নিজের নিয়ম আছে — text-এর জন্য Unicode + UTF-8, ছবির জন্য RGB pixel, শব্দের জন্য sampling।</li>
              <li>Compression দুই ধরনের — lossless-এ হুবহু original ফেরে, lossy-তে কিছু তথ্য বাদ বা আনুমানিক করা হয়।</li>
              <li>Meaning bit-এ থাকে না — একই bit pattern representation আর context ভেদে অক্ষর, সংখ্যা বা pixel।</li>
              <li>সংখ্যা, byte, bit আর voltage এক জিনিস নয় — একই তথ্যের ভিন্ন ভিন্ন স্তর।</li>
            </>
          ) : (
            <>
              <li>The computer doesn't "see" images or "hear" songs — every kind of information first has to be encoded into bits by some defined rule.</li>
              <li>Each kind of information has its own rules — Unicode + UTF-8 for text, RGB pixels for images, sampling for sound.</li>
              <li>Compression comes in two kinds — lossless gives back the exact original; lossy discards or approximates some information to shrink size.</li>
              <li>Meaning doesn't live in the bits — the same bit pattern is a character, a number, or a pixel depending on representation and context.</li>
              <li>A number, a byte, a bit, and a voltage are not the same thing — they're different layers of the same information.</li>
            </>
          )}
        </Recap>

        <Diagram
          art={bn
            ? 'অর্থ\n↓  representation        ← এই article\nbit pattern\n↓  physical অবস্থা         ← article ০১\nstored state\n↓  computation            ← পরের article\nনতুন state → নতুন bit → অর্থ'
            : 'meaning\n↓  representation        ← this article\nbit pattern\n↓  physical state          ← article 01\nstored state\n↓  computation             ← next article\nnew state → new bits → meaning'}
          bnLabel="flow · series-এর পথ"
          enLabel="flow · the series so far"
        />
      </Section>

      <RelayNav
        hub={SERIES_HUB_CARD}
        next={{ label: { bn: 'baton পরের পর্বে', en: 'baton to the next leg' }, title: bn ? '০৩ — CPU-র blueprint' : "03 — The CPU's blueprint", href: '/writing/cpu-blueprint', variant: 'next' }}
        bridge={{ bn: 'Bit memory-তে পড়ে থাকলেই কাজ শেষ না — তাদের পড়তে হবে, যোগ করতে হবে, তুলনা করতে হবে, ফলটা আবার রাখতে হবে। এই bit দিয়ে CPU আসলে হিসাব করে কীভাবে? পরের article-এ processor-এর ভেতরে ঢুকে ALU, register, datapath, control আর clock-এর সম্পর্কটা দেখব।', en: "Storing bits isn't the end of the story — they have to be read, added, compared, and stored again. How does a CPU actually compute with those bits? Next article, we step inside the processor and connect the ALU, registers, datapath, control, and clock." }}
      />
      <Colophon />
    </article>
  );
}
