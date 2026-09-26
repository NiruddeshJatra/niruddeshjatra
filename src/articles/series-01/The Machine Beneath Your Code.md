## হার্ডওয়্যার আর অপারেটিং সিস্টেমের ভেতরের গল্প

ধরেন, কোডে লিখলাম:

```python
x = 5
```

কয়েক মিলিসেকেন্ড পরে আরেকটা লাইন রান হলো:

```python
print(x)
```

কম্পিউটার ঠিকই ৫ প্রিন্ট করল।

এখন প্রশ্ন হলো — এই কয়েক মিলিসেকেন্ড ধরে ৫ সংখ্যাটা ছিল কোথায়?

Screen-এ তো ছিল না। CPU-ও সারাক্ষণ ধরে বসে ছিল না। তাহলে? সিলিকন আর কপারের একটা physical board-এর ভেতরে ৫ সংখ্যাটা আসলে কোথায় ছিল? (এটা তো অন্তত জানেন যে,  ডিজিটাল ইলেকট্রনিক্সে ব্যবহৃত অধিকাংশ যন্ত্রই সিলিকন নামক সেমিকন্ডাক্টর পদার্থ দিয়ে তৈরি? না জানলে আফসোস!)

---

// কেন এই সিরিজ

এই series পড়ে আপনি নতুন CPU design করতে পারবেন না। গাড়ির engine বোঝা মানেই কেউ Toyota-র কারখানা খুলে বসে না।

কিন্তু গাড়ি হঠাৎ থেমে গেলে, বা hood-এর নিচ থেকে ধোঁয়া উঠতে শুরু করলে — অন্তত বুঝবেন সমস্যাটা কোন দিকে খুঁজতে হবে।

আপনি হয়তো এমন bug দেখেছেন:

- একই API local-এ ২০ms, production-এ ২s সময় নিচ্ছে
- সার্ভার হঠাৎ "Out of Memory" বলে ক্র্যাশ করেছে
- Chrome-এর একটা tab ৩GB RAM খেয়ে বসে আছে
- 502 Bad Gateway। কোন gateway, কোথায়, কেন bad — কিচ্ছু বুঝা যাচ্ছে না

এগুলোর প্রত্যেকটার সমাধান এই series-এ দেব — এমন কোনো প্রতিশ্রুতি দিচ্ছি না। আমার ওই দক্ষতা বা জ্ঞান কোনোটাই এখনো হয়নি। কিন্তু এগুলোর পেছনে যে পৃথিবীটা কাজ করছে, সেটা আপনার কাছে অনেক কম রহস্যময় হয়ে যাবে বলে আশা করি।

আজকালকার high-level language-এ কোড লেখার সময় আমরা পেছনের mechanism নিয়ে চিন্তা করি না। Browser, runtime, framework — সব পর্দার আড়ালে সামলে নেয়। এই আড়াল করাটাকে বলে **abstraction** — জটিল mechanism-কে একটা সহজ interface-এর পেছনে লুকিয়ে ফেলা।

Abstraction আমাদের অসাধারণ productive করে। কিন্তু এর একটা দামও আছে। প্রতিটা abstraction-এর নিচে আরেকটা abstraction লুকিয়ে থাকে। কোনো একদিন যদি নিচের কোনো layer ভেঙে পড়ে — তখন সেখানে কী আছে সেটা মোটামুটি জানা থাকা দরকার। অন্তত একজন ভালো সিএসই পড়ুয়া ছাত্রের ন্যূনতম পরিষ্কার ধারণা রাখা উচিত আমার মতে, হোক না যুগ এখন Artificial Intelligence এর।

বাংলাদেশের বিশ্ববিদ্যালয়ে computer science-এর hardware-related কোর্সগুলো বেশ কাঠখোট্টা। অন্তত আমার নিজের অভিজ্ঞতা তো এমনই ছিল। বইয়ে SR Latch, Virtual Memory, Cache — সব ছিল। স্যারেরাও কেমন যেন গৎবাঁধা উপায়ে পড়াতেন, মুখস্থ করা যেতো, কিন্তু আদৌ এগুলো কি বুঝায়, কানেকশন কই, আগামাথা খুঁজে পেতাম না। কিন্তু বাসায় ফিরে যখন Python-এ `x = 5` লিখতাম, মনে হতো coding আর hardware দুইটা দুই জগতের বাসিন্দা।

অনেক পরে বুঝেছি — এগুলো আলাদা বিষয় না। একই গল্পের দুই প্রান্ত। এই series এ সেই মাঝখানের অংশটা দেখানোর চেষ্টা করবো।

---

// মূল চরিত্র কে?

এই series-এ hardware, OS, compiler — কোনোটাই মূল চরিত্র না।

মূল চরিত্র একটাই — **information**।

একটা bit। একটা সংখ্যা। একটা keystroke। একটা instruction।

প্রতিটা article-এ আমরা এই information-এর পিছু নেব। এখন সে কোথায় আছে? কে তাকে ধরেছে? কীসে রূপান্তর হচ্ছে? পরে কোথায় যাচ্ছে?

এখানে যন্ত্র শুধু গল্পের background। মূল গল্পটা information-এর।

একটা সময় আমি বুঝেছিলাম — আমি আসলে Python, C বা JavaScript শিখছি না। শিখছি abstraction-এর স্তরগুলো।

প্রতিটা নতুন language আমাকে আরও সমৃদ্ধ করছে, কিন্তু একই সঙ্গে মেশিন থেকে আরও দূরে সরিয়ে দিচ্ছে।

---

// রোডম্যাপ

পুরো যাত্রাটা ৮টা article-এ ভাগ করা:

#### Level 1: The Atoms — বিটের জগৎ

**১. Bit-এর ভেতরে কী থাকে?**
একটা bit কি বিমূর্ত ধারণা, নাকি এর একটা physical রূপ আছে? Voltage, transistor, আর memory-র সাথে bit-এর সম্পর্ক কি?

**২. যেকোনো তথ্য কীভাবে ০ আর ১ হয়?**
একটা "A" অক্ষর, একটা ছবির pixel, একটা গানের এক মুহূর্ত — সবই শেষমেশ ০ আর ১। কিন্তু কীভাবে? আর compression এখানে কী করে?

#### Level 2: The Machinery — যন্ত্রের গল্প

**৩. CPU-র blueprint**
একটা processor-এর ভেতরে আসলে কী কী অংশ থাকে? কে হিসাব করে, কে মনে রাখে, কে পুরো orchestrate করে?

**৪. Heartbeat: Fetch-Decode-Execute**
CPU একটা instruction পেয়ে কী করে? পুরো cycle-টা কত সময়ে ঘটে? কে সব synchronize রাখে?

**৫. Memory Hierarchy**
Register থেকে RAM, RAM থেকে SSD — কেন এত ধরনের memory? একটাই দিয়ে সব করা যেত না?

#### Level 3: The Bridges — যেখানে সব মিলে

**৬. Operating System — Grand Conductor**
একটা মেশিনে ৫০টা program একসাথে চলে কীভাবে? কে ঠিক করে কোন program কখন RAM পাবে? Process আর [HOVER: thread]-এর ভেতরের পার্থক্য কী?

**৭. কোড থেকে মেশিন কোড**
আপনি JavaScript লিখলেন। CPU তো JavaScript বোঝে না। মাঝখানে কী ঘটে?

**৮. Key-press থেকে screen**
একটা 'A' চাপার পর screen-এ 'A' আসা পর্যন্ত পুরো relay race। এই article-টাই পুরো series-এর payoff।

---

// শেষে আপনি এই প্রশ্নগুলোর উত্তর দিতে পারবেন

- RAM আসলে কী?
- CPU কি সত্যিই একসাথে অনেক কাজ করে?
- Variable কম্পিউটারের কোথায় থাকে?
- Cache কেন এত দ্রুত?
- Compiler আসলে কী বানায়?
- Keyboard চাপলে screen-এ অক্ষর আসে কীভাবে?
- Power চলে গেলে RAM কেন সব ভুলে যায়?

---

// কীভাবে পড়বেন

একটা অনুরোধ।

কোথাও কিছু মুখস্থ করার চেষ্টা করবেন না।

আমি চাই, আপনি প্রতিটা article পড়ে মাথার ভেতরে একটা ছোট animation দেখতে পান। কোনো একদিন সব technical term ভুলে গেলেও যদি সেই animation-টা মনে থাকে — তাহলেই এই series সফল।

আমি ধরে নিচ্ছি আপনি আগে কখনো Digital Logic, Computer Architecture বা Operating System পড়েননি। সেই ধরে নিয়েই শুরু করব। শেষ পর্যন্ত পৌঁছালে বিশ্ববিদ্যালয়ের বইও অনেক কম ভয় নিয়ে খুলতে পারবেন বলে আশা রাখছি।

নতুন কোনো technical term দেখলে সেটার ওপর cursor রাখুন (মোবাইলে tap করুন)। একটা ছোট popup সহজ ভাষায় সেটার মানে বুঝিয়ে দেবে — পড়া থামিয়ে Google-এ গিয়ে হারিয়ে যেতে হবে না।

কোথাও অতিরিক্ত গভীরে যাব না। যেখানে concept-টা অতিরিক্ত academic হয়ে যাচ্ছে বলে মনে হবে — সেখানে থামব, আর ইশারা দিয়ে দেব যে, "বস, এইটুকু জানলেই আপাতত চলবে।"

কোথাও অতিরিক্ত গভীরে যাব না। তাহলে এবার software-এর সব আরাম-আয়েশ ছেড়ে একেবারে নিচে নেমে যাই।

আমার মূল উদ্দেশ্য হলো—কম্পিউটিংয়ের প্রতিটা স্তরের (Layer) মূল আইডিয়া বা মেকানিক্সটা যেন একজন পাঠক খুব সহজে একটা স্পষ্ট Mental Model হিসেবে দাঁড় করাতে পারেন। আর সেই স্পষ্টতা ও সহজবোধ্যতার খাতিরে অনেক জায়গায় জটিল বিষয়গুলোকে কিছুটা সরলীকরণ করতে হয়েছে। যেখানে মনে হয়েছে অতিরিক্ত জটিলতা মূল গল্প পড়ার অভিজ্ঞতাকে ব্যাহত করবে, সেখানে সূক্ষ্ম অনেক ডিটেইলস এড়িয়ে যাওয়া হয়েছে।

এর মানে এই নয় যে আপনাকে বিভ্রান্ত করার চেষ্টা করা হয়েছে। বিষয়গুলোকে এমনভাবে সাজানো হয়েছে যেন বেসিক ধারণাটা একদম সঠিক থাকে, কিন্তু পড়তে সহজ হয়। তবুও, সরলীকরণ করতে গিয়ে কোথাও কোনো টেকনিক্যাল ভুল থেকে গেলে বা আপনার চোখে পড়লে অবশ্যই জানাবেন—সংশোধন করে নেওয়া হবে।

যদি কোনো নির্দিষ্ট স্তর বা বিষয় আপনার মধ্যে বাড়তি আগ্রহ তৈরি করে, তবে সিরিজের শেষে দারুণ কিছু বই ও রিসোর্সের তালিকা দেওয়া থাকবে—যা আপনাকে এই বিষয়ের গভীরে নিয়ে যেতে সাহায্য করবে।

---

// একটা সৎ স্বীকারোক্তি

এই সিরিজে অনেক কিছু ইচ্ছাকৃতভাবে সহজ করে উপস্থাপন করা হয়েছে।

Computer Architecture, Operating System, Compiler—এর প্রতিটিই এক একটি বিশাল ও স্বাধীন বিষয়। এগুলো নিয়ে বিশ্ববিদ্যালয়ে একাধিক সেমিস্টার ধরে পড়ানো হয়, হাজার পাতার মোটা মোটা বই লেখা হয়, আর প্রতিনিয়ত নতুন গবেষণা চলছে। কয়েকটি আর্টিকেলে সেই পুরো মহাসমুদ্র তুলে আনা সম্ভব নয়, আর সেই চেষ্টাও করা হয়নি।

আমার মূল উদ্দেশ্য হলো—কম্পিউটিংয়ের প্রতিটা স্তরের (Layer) মূল আইডিয়া বা মেকানিক্সটা যেন একজন পাঠক খুব সহজে একটা স্পষ্ট Mental Model হিসেবে দাঁড় করাতে পারেন। আর সেই স্পষ্টতা ও সহজবোধ্যতার খাতিরে অনেক জায়গায় জটিল বিষয়গুলোকে কিছুটা সরলীকরণ করতে হয়েছে। যেখানে মনে হয়েছে অতিরিক্ত জটিলতা মূল গল্প পড়ার অভিজ্ঞতাকে ব্যাহত করবে, সেখানে সূক্ষ্ম অনেক ডিটেইলস এড়িয়ে যাওয়া হয়েছে।

এর মানে এই নয় যে আপনাকে বিভ্রান্ত করার চেষ্টা করা হয়েছে। বিষয়গুলোকে এমনভাবে সাজানো হয়েছে যেন বেসিক ধারণাটা একদম সঠিক থাকে, কিন্তু পড়তে সহজ হয়। তবুও, সরলীকরণ করতে গিয়ে কোথাও কোনো টেকনিক্যাল ভুল থেকে গেলে বা আপনার চোখে পড়লে অবশ্যই জানাবেন—সংশোধন করে নেওয়া হবে।

যদি কোনো নির্দিষ্ট স্তর বা বিষয় আপনার মধ্যে বাড়তি আগ্রহ তৈরি করে, তবে সিরিজের শেষে দারুণ কিছু বই ও রিসোর্সের তালিকা দেওয়া থাকবে—যা আপনাকে এই বিষয়ের গভীরে নিয়ে যেতে সাহায্য করবে।

তাহলে এবার software-এর সব আরাম-আয়েশ ছেড়ে একেবারে নিচে নেমে যাই।

Variable না।

Object না।

Function না।

Operating System-ও না।

শুধু silicon।

শুধু তার।

শুধু voltage।

সেখান থেকেই পুরো গল্পটা শুরু করা যাক।

**[পরের article: ১. Bit-এর ভেতরে কী থাকে?]**

---

### Hover Definitions

**[HOVER: thread]***Thread হলো একটা program-এর ভেতরে code execute করার সবচেয়ে ছোট unit। একটা program-কে factory ধরুন, thread হলো সেই factory-র একেকজন worker। একটা factory-তে multiple worker একসাথে কাজ করতে পারে (multithreading), কিন্তু তারা সবাই একই factory-র resource share করে। ধরা যাক, আপনি **MS Word** অ্যাপটি ওপেন করেছেন।এখানে পুরো **MS Word** অ্যাপ্লিকেশনটি হলো একটি **প্রসেস (Process)**। এই প্রসেসের ভেতরে ব্যাকগ্রাউন্ডে একসাথে অনেকগুলো কাজ চলে। এই প্রতিটি আলাদা আলাদা কাজই হলো একেকটি **থ্রেড (Thread)**। আপনি যখন টাইপ করছেন, তখন প্রসেসের ভেতরে প্রধানত ৩টি থ্রেড একসাথে কাজ করে:
• **থ্রেড ১ (টাইপিং ও ডিসপ্লে):** আপনার কিবোর্ডের প্রেস করা অক্ষরগুলো স্ক্রিনে ফুটিয়ে তোলে।
• **থ্রেড ২ (বানান চেক):** আপনি টাইপ করার সাথে সাথে ব্যাকগ্রাউন্ডে লাল দাগ দিয়ে ভুল বানান সনাক্ত করে।
• **থ্রেড ৩ (অটো-সেভ):** আপনি যাতে ডেটা না হারান, তাই প্রতি মিনিটে আপনার ফাইলটি স্বয়ংক্রিয়ভাবে সেভ করতে থাকে।*

# ***English Version***

## A story of hardware and operating systems, from the ground up

You wrote:

```python
x = 5
```

A few milliseconds later:

```python
print(x)
```

The computer printed 5.

Question — where was that 5 during those milliseconds?

Not on the screen. Not held in the CPU the whole time. So where? On a physical board of silicon and copper, where exactly was that 5? (If you don’t know that most of the components of digital electronics is made of a semiconductor material named Silicon, SAD!)

---

## Why this series

You won't be able to design a CPU after reading this. Understanding a car engine doesn't mean you can open a Toyota factory tomorrow.

But when the engine stops mid-highway, or smoke starts rising from under the hood — you'll at least know which direction to look.

You've probably seen bugs like these:

- An API that runs in 20ms locally but takes 2 seconds in production
- A server that crashes with "Out of Memory"
- A Chrome tab holding 3GB of RAM hostage
- 502 Bad Gateway. Which gateway. Where. Why bad. Silence.

I'm not promising this series will solve each of those. I don’t have that level of skill and knowledge yet. But I believe that the world underneath — the one that produces those symptoms — will become a lot less mysterious to you.

When we write code in high-level languages today, we don't think about the machinery underneath. The browser, the runtime, the framework — everything is handled behind a curtain. That curtain has a name: **abstraction**. Hiding complex machinery behind a simple interface.

Abstraction makes us wildly productive. But it has a cost. Every abstraction hides another abstraction underneath. And when one of those lower layers breaks — you at least need to know roughly what's down there. In my opinion, any decent CSE student must have a solid grasp of the fundamentals, even in the age of AI.

Hardware-related computer science courses at Bangladeshi universities tend to be dry. At least mine was. Textbooks were full of SR Latches, Virtual Memory, Cache. But when I went home and wrote `x = 5` in Python, I couldn't find a single connection between those two worlds.

I understood much later — they aren't separate subjects. They're two ends of the same story. This series is about the middle.

---

## Who's the main character?

Hardware, OS, compiler — none of these are the protagonist of this series.

There's only one protagonist — **information**.

A bit. A number. A keystroke. An instruction.

Every article follows this information as it moves. Where is it now? Who's holding it? What's transforming it? Where does it go next?

The machine is just the setting. The story is about information.

At some point I understood — I wasn't really learning Python, C, or JavaScript. I was learning the layers of abstraction.

Every new language made me richer — and moved me further from the machine. That's when the wish took root: climb down once, and see how the whole machine actually runs.

What I want is for every article to leave a small animation running in your head.

So let's leave all of software's comforts behind and climb all the way down.

---

## Roadmap

The journey splits into 8 articles.

### Level 1: The Atoms — inside a bit

**1. What's inside a bit?**
Is a bit just an abstract idea, or does it have a physical form? Voltage, transistors, and the birth of memory.

**2. How does the world become zeros and ones?**
A single letter "A", a pixel of an image, one moment of a song — all of it ends up as 0s and 1s. But how? And where does compression fit in?

### Level 2: The Machinery — the machine's story

**3. The CPU's blueprint**
What parts actually live inside a processor? Who does the math, who remembers, who orchestrates?

**4. Heartbeat: Fetch-Decode-Execute**
The CPU gets an instruction — what happens? How long does the full cycle take? And who keeps everything synchronized?

**5. Memory Hierarchy**
Register to RAM to SSD — why so many kinds of memory? Couldn't we just have one?

### Level 3: The Bridges — where everything meets

**6. Operating System — the Grand Conductor**
How does one machine run 50 programs at once? Who decides which program gets RAM when? What's actually the difference between a process and a [HOVER: thread]?

**7. From code to machine code**
You wrote JavaScript. The CPU doesn't speak JavaScript. What happens in between?

**8. From keypress to screen**
Pressing 'A' to seeing 'A' on screen — the full relay race. This is the payoff of the whole series.

---

## By the end, you'll be able to answer

- What is RAM, really?
- Does the CPU actually do many things at once?
- Where do variables live?
- Why is cache so fast?
- What does a compiler actually produce?
- How does pressing a key make a character appear on screen?
- Why does RAM forget everything when the power goes out?

---

## How to read this

One request.

Don't try to memorize anything.

I want each article to leave a small animation running in your head. If, someday, you forget every technical term but that animation stays — this series has done its job.

I'm assuming you've never taken Digital Logic, Computer Architecture, or Operating Systems. That's the starting assumption. By the end, you'll open a university textbook with much less dread.

When you see a technical term you don't know, hover over it (tap on mobile). A short popup will explain it in plain language — no need to stop reading and vanish into a Google search.

I won't go too deep anywhere. When a concept threatens to turn into pure academia, I'll stop and give you a signal: "look, this much is enough for now."

### / An Honest Disclaimer

A lot in this series is deliberately simplified.

Computer architecture, operating systems, compilers—each is a massive, independent field with multi-semester university courses, thousands of pages of textbooks, and ongoing research. A few articles cannot possibly capture all of that, nor do they try to.

The primary goal here is clarity: to help you build a solid, intuitive mental model of how each layer of computing works. To achieve that clarity, complex technical details have sometimes been abstracted away. Where full precision would have added overwhelming noise, the mechanics were intentionally streamlined to keep the core narrative accessible.

This approach aims to ensure that while the big picture remains accurate and conceptually sound, you aren't bogged down by edge cases or hardware-specific nuances. That said, if you spot an actual error or an oversimplification that crosses into inaccuracy, please let me know—I will happily fix it.

If any section sparks your curiosity, you'll find a curated list of books and resources at the end of the series to help you dive as deep as you'd like.

---

So — let's leave all the comforts of software and go all the way down.

No variables.

No objects.

No functions.

No operating system either.

Just silicon.

Just wire.

Just voltage.

That's where the story starts.

**[Next: 1. What's inside a bit?]**

---

### Hover Definitions

**[HOVER: thread]***A thread is the smallest unit of code execution inside a program. If you think of a program as a factory, a thread is one of the factory's workers. A factory can have multiple workers running at once (multithreading), but they all share the factory's resources. Suppose you have opened the MS Word app. Here, the entire MS Word application is a **Process**. Inside this process, multiple tasks run concurrently in the background. Each of these individual tasks is a **Thread**. When you are typing, there are mainly three threads working together inside the process:*

- ***Thread 1 (Typing & Display):** Renders the characters you press on the keyboard onto the screen.*
- ***Thread 2 (Spell Check):** Detects misspelled words by highlighting them with a red underline in the background as you type.*
- ***Thread 3 (Auto-Save):** Automatically saves your file every minute in the background so you do not lose any data.*
