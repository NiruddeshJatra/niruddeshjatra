# Bit-এর ভেতরে কী থাকে?

## Transistor, voltage, আর memory-র শুরু

ধরুন, কোডে লিখলাম:

```python
x = 5
```

কোডটা রান হলো। ভালো কথা।

কিন্তু একটা প্রশ্ন — এই ৫ সংখ্যাটা আসলে কম্পিউটারের কোথায় গেল? এর কি কোনো ফিজিক্যাল রূপ আছে?

আক্ষরিক অর্থে — কম্পিউটারের ভেতরে কোথাও না কোথাও এই ৫ সংখ্যাটা এখন জমা হয়ে আছে। যদি বলা হয় এটা মেমোরিতে আছে—সেটা আসলে কীভাবে থাকে? কাগজে তো লেখা না, screen-এর pixel এ না নিশ্চয়ই। এই ৫ মূলত এটা silicon আর copper-এর একটা physical state।

এই series-এ আমি সেই physical state থেকে screen পর্যন্ত পুরো যাত্রাটা দেখানোর চেষ্টা করবো। আপাতত এই আর্টিকেলের লক্ষ্য একটা বিষয় পরিষ্কার করা —[HOVER: bit] কীভাবে physically মেমোরিতে অবস্থান করে?

---

// একটা কথা আগে বলে রাখি

এখানে Python, C, JavaScript বা কোনো নির্দিষ্ট প্রোগ্রামিং ল্যাংগুয়েজ নিয়ে কথা বলবো না। সব software layer বাদ দিয়ে আলোচনা করবো একেবারে হার্ডওয়্যার লেভেলে, যেখানে কম্পিউটার আর কোনো "variable" বা "object" বোঝে না। সেখানে আছে শুধু কিছু তার, কিছু transistor, আর voltage।

---

// Binary কেন?

কম্পিউটারের ভেতরে data মানে কী? [HOVER: voltage]। Electrical signal-এর মাত্রা। ০ মানে "কম voltage" (প্রায় ০ ভোল্ট), ১ মানে "বেশি voltage" (প্রায় ৫ ভোল্ট বা ১.৮ ভোল্ট — chip-এর design-এর উপর নির্ভর করে)। অর্থাৎ, যেহেতু কম্পিউটার মূলত ইলেক্ট্রনিক ডিভাইস, এখানে আমরা যেমন কাগজে লিখে রাখি বা অন্য কোনো বস্তু গণনার কাজে ব্যবহার করি, সেরকমটা সম্ভব না। এখানে কোনো তথ্য সংরক্ষণ করতে চাইলে সেটাকে বিদ্যুতে রুপান্তর করে তারপরই সংরক্ষণ করা যাবে। এজন্যই যেকোনো ডিজিট্যাল ইলেকট্রনিকস এ data মানেই voltage।

স্বাভাবিক প্রশ্ন — কম্পিউটার base-10 use করলে কী হতো? মানুষের ১০টা আঙুল আছে বলে আমরা ০ থেকে ৯ পর্যন্ত ব্যবহার করি। কম্পিউটারেও তো ১০টা আলাদা voltage level রাখা যেত:

- ০ = ০ ভোল্ট
- ১ = ০.৫ ভোল্ট
- ২ = ১ ভোল্ট
- ...
- ৯ = ৪.৫ ভোল্ট

ঝামেলাটা math-এ না। ঝামেলাটা physics-এ। আর ঝামেলাটার নাম — noise।

বাস্তব circuit-এ voltage কখনো একদম একইরকম থাকে না। তাপমাত্রার ওঠানামা, পাশের তারের electromagnetic interference, power supply-র ছোটখাটো fluctuation — সবকিছু voltage-কে একটু এদিক-ওদিক করে দেয়।

[FIGURE 1: A voltage-vs-time graph with two side-by-side panels. Left: base-10 setup with 10 narrow horizontal bands stacked closely. A jittery signal line easily crosses boundaries — annotate "Noise flips 2 to 3, you never notice." Right: binary with only two wide bands separated by a shaded "forbidden zone" — the same jittery signal stays inside its band. Caption: "কেন noise binary-কে ভাঙে না।"]

Base-10-এ ১.১ ভোল্ট মানে "২", আর ০.৯ ভোল্ট মানে "১"। মাত্র ০.২ ভোল্টের এই পার্থক্য noise সহজে ভেঙে ফেলে। আপনার "১" হঠাৎ "২" হয়ে গেছে — আপনি টেরও পাবেন না।

Binary-তে? ০ মানে "কম voltage-এর যেকোনো ভ্যালু" (ধরুন ০ থেকে ০.৮ ভোল্ট), ১ মানে "বেশি voltage-এর যেকোনো ভ্যালু" (ধরুন ২ থেকে ৫ ভোল্ট)। মাঝখানে একটা [HOVER: noise margin] — একটা "নিষিদ্ধ অঞ্চল" যেটা signal-কে অতিক্রম করতেই হয় state change-এর জন্য। ছোটখাটো noise এই margin ভাঙতে পারে না।

এটাই বাইনারির আসল কারণ। ০ আর ১ দিয়ে data represent করা সহজ, তা না — ০ আর ১ **নির্ভরযোগ্য**। বাকিসব সেখান থেকে বানানো।

এর মানে এই না যে কম্পিউটার ৫, ২৫ বা ১০০০ বোঝে না। বরং প্রতিটা সংখ্যাকে সে অসংখ্য ০ আর ১-এর combination-এ ভেঙে ফেলে। সেই গল্পটা পরের article-এ।

**পরের প্রশ্ন:** এই voltage-গুলো কে তৈরি করে? কে switch করে?

---

### // Transistor — সবচেয়ে ছোট্ট সুইচ

এখন পর্যন্ত একটা জিনিস পরিষ্কার—কম্পিউটার শেষ পর্যন্ত ভোল্টেজ নিয়েই কাজ করে। কিন্তু প্রশ্ন হলো, **এই ভোল্টেজ কে নিয়ন্ত্রণ করে?** কারণ কম্পিউটারকে তো মাঝে মাঝে কারেন্ট যেতে দিতে হবে, আবার মাঝে মাঝে আটকে দিতেও হবে। মানে, কম্পিউটারের এমন একটা জিনিস দরকার যেটা ইচ্ছে হলে বিদ্যুতের রাস্তা খুলে দেবে, আর ইচ্ছে হলে বন্ধ করে দেবে।

অর্থাৎ একটা **switch**।

কিন্তু এখানে একটা সমস্যা আছে। বাড়ির লাইটের সুইচ তো আপনি হাত দিয়ে চাপেন। কম্পিউটারের ভেতরে যদি ১০০ বিলিয়ন সুইচ থাকে, তাহলে সেগুলো কে চাপবে?

সেখানেই আসে **transistor**।

Transistor-কে সবচেয়ে সহজভাবে ভাবা যায় একটা **অতি ক্ষুদ্র ইলেকট্রনিক কল** হিসেবে। বাসার পানির কল যেমন খুললে পানি যায়, বন্ধ করলে পানি থেমে যায়—transistor-ও ঠিক তেমন। শুধু এখানে পানির বদলে চলাচল করছে বিদ্যুৎ। আর সবচেয়ে মজার ব্যাপার হলো, এই কলটা মানুষ ঘোরায় না। **আরেকটা ছোট্ট electrical signal-ই কলটা খুলে বা বন্ধ করে দেয়।**

ভাবুন, আপনি একটা পানির কলের হাতল স্পর্শই করলেন না। বরং পাশ থেকে একটা ছোট্ট মোটর এসে নিজে নিজেই হাতলটা ঘুরিয়ে দিল। Transistor অনেকটা এমনই। যখন control signal আসে, তখন বিদ্যুতের রাস্তা খুলে যায়। Current চলতে পারে। আমরা সেটাকে ধরি **১**। Control signal চলে গেলে রাস্তা আবার বন্ধ হয়ে যায়। Current আর যেতে পারে না। আমরা সেটাকে ধরি **০**।

[ANIMATION: Water tap and transistor side-by-side. Water tap: reservoir → tap → bucket. A tiny motor automatically rotates the handle instead of a human hand. Beside it, a transistor circuit where a control signal opens or closes the current path. Caption: "Transistor হলো এমন একটি switch, যেটাকে আরেকটি electrical signal নিয়ন্ত্রণ করে।"]

এখানে ইঞ্জিনিয়াররা তিনটা নাম ব্যবহার করেন।

যেদিক দিয়ে কারেন্ট ঢোকে, তাকে **Source** বলে।

যেদিক দিয়ে বের হয়, তাকে **Drain** বলে।

আর যে control signal পুরো সুইচটাকে চালায়, সেটার নাম **Gate**।

নামগুলো মুখস্থ করার দরকার নেই। এখানে গুরুত্বপূর্ণ ব্যাপার হলো—**একটা ছোট্ট electrical signal আরেকটা electrical signal-কে নিয়ন্ত্রণ করতে পারে।**

ব্যস, এইটুকুই।

এই ছোট্ট আইডিয়াটার ওপরই দাঁড়িয়ে আছে পুরো আধুনিক কম্পিউটার।

আপনি এই লেখাটা যতক্ষণ পড়ছেন, আপনার ফোন বা ল্যাপটপের ভেতরে কয়েক বিলিয়ন transistor প্রতি সেকেন্ডে অসংখ্যবার on-off হচ্ছে।

কিন্তু এত কিছুর পরও প্রতিটা transistor একই কাজ করে—

**বিদ্যুৎ যেতে দেবে, অথবা দেবে না।**

এই দুইটাই।

---

// Switch জোড়া দিলে কী হয়?

একটা transistor দিয়ে বেশি কিছু হয় না। ঠিক যেমন একটা LEGO block দিয়ে ঘর বানানো যায় না। কিন্তু হাজার হাজার transistor একসাথে জোড়া লাগালে ধীরে ধীরে এমন circuit তৈরি হয়, যেগুলো decision নিতে পারে, হিসাব করতে পারে, এমনকি memory-ও বানাতে পারে।

**দুইটা transistor যদি এক লাইনে (series)** [HOVER: series and parallel] **জোড়া দেন**, তাহলে current যেতে হলে দুইটাকেই একসাথে on হতে হবে। এভাবেই তৈরি হয় AND gate।

| A | B | Output |
| --- | --- | --- |
| 0 | 0 | 0 |
| 0 | 1 | 0 |
| 1 | 0 | 0 |
| 1 | 1 | 1 |

**আবার পাশাপাশি (parallel) জোড়া দিলে**, যেকোনো একটা on থাকলেই current যেতে পারে। এভাবেই তৈরি হয় OR gate।

আরেকটা transistor-এর wiring-এ ছোট্ট একটা পরিবর্তন করে বানানো যায় NOT gate — input ১ হলে output ০, input ০ হলে output ১।

[FIGURE 2: Three panels showing AND, OR, NOT gates. Each panel shows (top) transistor-level circuit — series for AND, parallel for OR, inverted for NOT, with voltage sources and ground labeled. (Bottom) The standard engineering logic-gate symbols (D-shape for AND, curved shield for OR, triangle-with-dot for NOT). Caption: "Physical circuit → abstract symbol।"]

এই তিনটা gate — AND, OR, NOT — দিয়ে যেকোনো logical operation বানানো যায়। যেকোনো decision, যেকোনো comparison, যেকোনো গাণিতিক হিসাব। XOR, NAND, NOR gate — সব এই তিনটা মৌলিক gate এর combination।

Arithmetic operation-ও এভাবেই করা যায়। দুইটা bit যোগ করার circuit ("full adder") বানানো যায় শুধু AND, OR, XOR দিয়ে। ৬৪টা full adder পাশাপাশি রেখে ৬৪-bit integer যোগ করার circuit তৈরি করা যায় — যা CPU-র ভেতরের [HOVER: ALU]-র একটি গুরুত্বপূর্ণ অংশ।

এখানে এখনো একটা সমস্যা আছে।

---

// Switch কীভাবে "মনে রাখে"?

এতক্ষণের সব gate-এর একটা বড় সমস্যা আছে। Input সরিয়ে নিলে output-ও চলে যায়।

মানে ধরুন, AND gate-কে দিলাম (১, ১)। Output ১ হলো। এখন input সরিয়ে নিন। Output কী?

০। Gate কিছু মনে রাখে না।

এটা memory না। কিন্তু কম্পিউটারের memory দরকার। আপনার `x = 5` মানে ৫-কে কোথাও রাখতে হবে, যেন পরে read করা যায়। কীভাবে?

আমার সবচেয়ে বড় বিভ্রান্তিটা এখানেই ছিল। বিশ্ববিদ্যালয়ে ডিজিটাল লজিক ডিজাইন কোর্সে SR Latch, JK Flip-Flop, truth table, register — সবই ছিলো। প্রত্যেকটা কম্পোনেন্ট কেন লাগে, কিভাবেই আসলেই “ধরে রাখে” — বুঝতাম না। কোডিং করার সময় যখন `x = 5` লিখতাম, এই দুই পৃথিবীর মধ্যে কোনো সম্পর্ক খুঁজে পেতাম না। Memory কি এক ফালি magnetic ধাতু? নাকি charge-এর কোনো চৌবাচ্চা? দুঃখজনকভাবে, আমাদেরকে কোর্সের পর কোর্স করানো হয়, যেখানে কোনোকিছু গোড়া থেকে না বুঝেই কেবল স্লাইড মুখস্থ করে আর বিগত প্রশ্নপত্রগুলো একটু স্টাডি করেই পার পাওয়া যায়।

যাই হোক, bit ধরে রাখার সমাধানটা চমৎকার এবং সহজ। **Feedback loop।**

দুইটা NOT gate নিন। প্রথমটার output-কে দ্বিতীয়টার input-এ connect করুন। দ্বিতীয়টার output-কে প্রথমটার input-এ connect করুন।

[FIGURE 3: A cross-coupled latch circuit. Two NOT gates drawn as triangles with dots, arranged in a loop — Gate A's output feeds Gate B's input, Gate B's output feeds Gate A's input. Show two side-by-side snapshots: State 1 (Gate A output = 1, Gate B output = 0, arrows showing signal circulating) and State 2 (Gate A output = 0, Gate B output = 1). Annotation: "দুইটা stable state। Loop যতক্ষণ current পাচ্ছে ততক্ষণ state hold করে।"]

এখন কী হবে?

ধরুন, প্রথম gate-এর output ১। সেটা দ্বিতীয় gate-এর input-এ যাচ্ছে। NOT gate, তাই দ্বিতীয় gate-এর output হবে ০। সেটা প্রথম gate-এর input, তাই প্রথম gate-এর output হবে ১।

Loop। Stable। প্রথম gate সবসময় ১, দ্বিতীয় সবসময় ০।

এখন input সরিয়ে নিলে কী হবে? **কিছুই না।** State loop-এ আটকে আছে।

আরেকভাবে ভাবুন — একটা marble দুইটা পাহাড়ের মাঝে দুইটা গর্তের একটায় বসে আছে। ওটা নিজে নিজে আর নড়বে না। কিন্তু আপনি যদি যথেষ্ট জোরে ধাক্কা দেন, তাহলে অন্য গর্তে চলে যাবে। সেখানেও আবার স্থির হয়ে থাকবে।

একটা [HOVER: latch]-ও তেমনই। দুইটা stable state — ০ আর ১।

## A Gatekeeper Before Memory

আমরা একটা সমস্যা সমাধান করেছি। দুটি NOT gate একে অপরকে feedback দিয়ে নিজেদের অবস্থা মনে রাখতে পারে। কিন্তু এবার নতুন সমস্যা।

ধরুন, আমি এই মুহূর্তে latch-এর ভেতরে ১ লিখতে চাই। তারপর ৫ সেকেন্ড পরে ০ লিখতে চাই। Latch বুঝবে কীভাবে **কখন** নতুন ডেটা নিতে হবে, আর **কখন** পুরোনো ডেটাই ধরে রাখতে হবে? সবসময় যদি ইনপুট শুনতেই থাকে, তাহলে তো নতুন সিগন্যাল এলেই আগের ডেটা বদলে যাবে। সেজন্য দরকার একটা "দারোয়ান"। যে বলবে— "এখন ভেতরে ঢোকো।" অথবা "এখন কেউ ঢুকতে পারবে না।" এই দারোয়ানের কাজটাই করে **Write Enable wire**। তখন একে বলে gated latch।

```jsx
Data ----AND----->
^
|
Write Enable
```

যখন Write Enable = 0, AND gate ইনপুট আটকে দেয়। নতুন ডেটা latch-এর ভেতরে ঢুকতেই পারে না। তাই পুরোনো ভ্যালুই থেকে যায়। যখন Write Enable = 1, AND gate দরজা খুলে দেয়। এবার নতুন ভ্যালু latch-এর ভেতরে ঢুকে feedback loop-এর অংশ হয়ে যায়।

Latch-এর একটা ছোট্ট সমস্যা আছে। যতক্ষণ Write Enable চালু থাকে, ততক্ষণ ইনপুট বদলালে আউটপুটও বদলাতে থাকে। কিন্তু CPU এটা চায় না। CPU চায়—"একটা নির্দিষ্ট মুহূর্তে মাত্র ডেটা বদলাবে।" নাহলে কম্পিউটারের একেক অংশ একেক সময় আউটপুট জেনারেট করবে এবং তাদের মধ্যে কোনো সমন্বয় থাকবে না। সেই জন্য latch-এর সাথে clock যুক্ত করা হয়। (Clock নিয়ে পরে আরও বিস্তারিত লিখবো।) এবার আর যেকোনো সময় ডেটা লেখা যায় না। Clock-এর নির্দিষ্ট tick এলেই কেবল নতুন ডেটা ঢুকতে পারে। এই clock-controlled latch-ই হলো flip-flop।

▾ আরেকটু গভীরে যাই — শুধু Clock জুড়ে দিলেই কি Flip-flop হয়ে যায়?

এখানে একটা স্বাভাবিক খটকা লাগতে পারে— Latch-এর সাথে শুধু একটা Clock জুড়ে দিলেই কি সেটা নিজে থেকেই প্রতিবার ঠিক একবার করে মান বদলাবে?

আসলে ব্যাপারটা এত সহজ না। যতক্ষণ Clock (বা Write Enable) চালু থাকবে, Latch কিন্তু পুরোটা সময়জুড়ে "transparent" থাকে— অর্থাৎ এই পুরো সময়টাতে Input বদলালেই সাথে সাথে Output-ও বদলে যাবে। এখন Counter-এর মতো কোনো circuit-এ যদি এই Output ঘুরে এসে নিজের Input-কেই আবার বদলে দেয়, তবেই সমস্যা বাঁধবে। Clock যতক্ষণ High (1) থাকে, Latch ততক্ষণ transparent থাকে। ফলে Output বদলানোর সাথে সাথে সেই নতুন মান ব্যাক-ফিড হয়ে Input-কে আবার পাল্টে দেয়। Gate-এর অভ্যন্তরীণ delay ($\Delta t_{prop}$) মাত্র কয়েক নানোসেকেন্ড, যা Clock Pulse-এর স্থায়িত্বের চেয়ে অনেক কম। ফলে Clock High থাকা অবস্থাতেই Output অতি দ্রুত একাধিকবার 0 ও 1-এর মধ্যে চেঞ্জ হতে থাকে (oscillate করে)। Clock বন্ধ হওয়ার মুহূর্তে Output-এর মান 0 নাকি 1 হবে—তা সম্পূর্ণ অনিশ্চিত হয়ে পড়ে। এটিই race-around সমস্যা।

এই কারণেই আসল Flip-flop একটা Latch দিয়ে বানানো হয় না; বানানো হয় দুটো Latch জোড়া দিয়ে— যার একটিকে বলে Master আর অন্যটিকে Slave। Clock 0 থাকলে Master চালু হয়, আর 1 থাকলে Slave চালু হয়— অর্থাৎ দুটো কখনোই একসাথে খোলা থাকে না। ফলে Input একবার Master-এ ধরা পড়ে, আর সেখান থেকে ঠিক একবারই Slave-এ গিয়ে পৌঁছায়। পুরো প্রক্রিয়াটি Clock-এর প্রতি Tick-এ ঠিক একবারই ঘটে।

এর বিস্তারিত আলোচনা এই Article-এর বিষয় না— সেটা আসবে যখন Clock নিয়ে আলাদা করে লিখব। আপাতত এটুকু মনে রাখলেই চলবে: শুধু Clock জুড়ে দেওয়াটাই কিন্তু গল্পের শেষ নয়।

আবার একটা ডিসক্লেইমার দিই — বাস্তব RAM ঠিক এই সরল latch দিয়ে তৈরি হয় না। আধুনিক DRAM আরও জটিল, আরও কম জায়গায় বেশি data রাখার জন্য ভিন্ন কৌশল ব্যবহার করে। কিন্তু "একটা bit মনে রাখার" মৌলিক ধারণাটা এই feedback থেকেই আসে।

আর এই state যতক্ষণ থাকবে? **যতক্ষণ current থাকবে।** Power চলে গেলে loop ভেঙে যায়, state হারিয়ে যায়। এজন্যই RAM volatile — একবার unplug করলে সব ভুলে যায়। এটা নিয়ে আমরা পরবর্তীতে আরও জানবো।

---

// পুরো গল্পটা একবার

এবার পুরো গল্পটা একবার চোখের সামনে চালাই।

আপনি লিখলেন:

```python
x = 5
```

Python অবশ্যই সরাসরি transistor on-off করছে না। মাঝখানে compiler/interpreter, operating system, CPU — আরও অনেক ধাপ আছে। সেগুলো আমরা পরে দেখব।

কিন্তু একেবারে hardware-এ পৌঁছানোর পর ঘটনাটা মোটামুটি এমন:

- ৫ সংখ্যাটা binary-তে রূপ নেয় — `101`
- তিনটা bit-এর জন্য তিনটা memory cell বরাদ্দ হয়
- প্রতিটা cell আসলে কয়েকটা transistor দিয়ে বানানো একটা flip-flop
- সেই flip-flop-এ voltage set হয় (high, low, high — ১, ০, ১)
- Feedback loop সেই voltage ধরে রাখে
- পরে যখন CPU `x` read করতে চায়, সেই তিনটা flip-flop-এর voltage read করে, তিনটা bit পায়, মিলিয়ে ৫ বের করে

মজার ব্যাপার — এই pattern (transistor → gate → latch) প্রতিটা computer-এর সবচেয়ে ছোট building block। এই তিনটা layer-ই সব। এর উপরে যা কিছু আছে — RAM, CPU, cache, GPU, OS, আপনার browser, আপনার React app — সবই এই তিনটা layer-এর repeated composition।

RAM-এ কয়েক বিলিয়ন flip-flop।
CPU-তে কয়েক বিলিয়ন gate।
প্রতিটা gate-এ কয়েকটা করে transistor।

সব শুরু voltage থেকে।

---

// এই আর্টিকেলে কী শিখলাম

- **Bit কোনো বিমূর্ত ধারণা নয়** — এটা voltage-এর একটা physical state।
- **Binary এসেছে math-এর জন্য নয়, reliability-র জন্য।** Noise দুইটা state সহজে ভাঙতে পারে না।
- **Memory ম্যাজিক না** — জাস্ট দুইটা gate loop করে বসিয়ে দেওয়া। Feedback থেকেই memory-র জন্ম।

---

// পরের article-এ

এখন আমরা জানি একটা bit কীভাবে ধরে রাখা যায়।

কিন্তু একটা bit দিয়ে তো কিছুই হয় না।

তাহলে লক্ষ-কোটি bit একসাথে মিলে কীভাবে একটা বাংলা বাক্য, একটা JPEG ছবি, একটা MP3 গান — কিংবা আপনার লেখা এই কোড — তৈরি করে?

পরের article-এ সেই রহস্যটাই খুলব।

**[পরের article: ২. দুনিয়া কীভাবে ০ আর ১ হয়?]**

---

### Hover Definitions

[HOVER: bit] ***Bit** হলো কম্পিউটারের তথ্যের সবচেয়ে ক্ষুদ্রতম একক (Smallest unit of data)। এটি "Binary Digit" শব্দদ্বয় থেকে এসেছে। একটি বিটের মান শুধুমাত্র দুটি হতে পারে: **`0`** অথবা **`1`**। ডিজিটাল সার্কিটে এটি দুটি ভিন্ন বৈদ্যুতিক অবস্থাকে নির্দেশ করে। সাধারণত `0` মানে Off (নিম্ন ভোল্টেজ) এবং `1` মানে On (উচ্চ ভোল্টেজ)।*

**[HOVER: voltage]***Voltage মানে electrical "pressure" — দুইটা point-এর মাঝে energy-র পার্থক্য। যেভাবে পানির চাপ পানিকে pipe-এ ঠেলে, voltage electron-কে  তারের মধ্য দিয়ে বয়ে নিয়ে যায়। যত বেশি voltage তত বেশি push। ভোল্ট-এ মাপা হয় (V)। কম্পিউটারে সাধারণত ০ থেকে ৫ ভোল্টের মধ্যে কাজ হয় (আধুনিক chip-এ ১.৮ ভোল্ট বা তার কম)।*

**[HOVER: noise margin]***Noise margin হলো binary signal-এর "safety zone" — high state (১) আর low state (০)-এর মাঝখানে একটা forbidden gap। এই gap এত বড় যে ছোটখাটো electrical noise (interference, fluctuation) signal-কে এক state থেকে অন্য state-এ ঠেলে দিতে পারে না। এই margin ছাড়া binary computing চলত না — প্রতি nanosecond-এ data corrupt হতো।*

**[HOVER: series and parallel]***Circuit-এ দুইটা component "series"-এ থাকা মানে তারা একই লাইনে বা একই তারে যুক্ত— current-কে দুইটার মধ্য দিয়েই যেতে হবে। "Parallel"-এ মানে তারা পাশাপাশি জোড়া — current যেকোনো একটার মধ্য দিয়ে গেলেই হলো। Series মানে "দুইটাই লাগবে" (AND-এর মতো), parallel মানে "যেকোনো একটা চললেই হবে" (OR-এর মতো)।*

**[HOVER: ALU]***ALU মানে Arithmetic Logic Unit — CPU-র সেই অংশ যেটা arithmetic (যোগ, বিয়োগ, গুণ, ভাগ) আর logical operations (AND, OR, comparison) করে। ALU সম্পূর্ণভাবে logic gate দিয়ে বানানো — কোনো "processor within processor" না, শুধু অনেকগুলো gate একসাথে সাজানো। যখন আপনি JavaScript-এ `a + b` লেখেন, শেষ পর্যন্ত সেই দুইটা সংখ্যা ALU-র মধ্য দিয়ে যায় আর যোগফল বের হয়।*

**[HOVER: latch]***Latch একটা circuit যা ১ bit information "hold" করে রাখতে পারে। এটা তৈরিতে দুইটা logic gate-কে cross-coupled ভাবে জোড়ানো হয় (একটার output অন্যটার input-এ), যার ফলে circuit-টা দুইটা stable state-এর যেকোনো একটায় settle হয় — ১ বা ০। এই stability-ই memory। Current যতক্ষণ থাকবে state ততক্ষণ থাকবে।*

**[HOVER: flip-flop]***Flip-flop হচ্ছে latch-এরই একটা variant, কিন্তু state পরিবর্তন হয় শুধু clock signal-এর edge-এ (rising বা falling)। এটা synchronization-এর জন্য জরুরি — CPU-র সব register একই clock-এ চলে, তাই সবকিছু একসাথে ঘটে। CPU-র প্রতিটা register-এ  থাকে৩২ বা ৬৪টা flip-flop, প্রতিটা ১ bit করে ধরে রাখতে পারে।*

# What's inside a bit?

## Transistors, voltage, and the birth of memory

Suppose you write:

```python
x = 5
```

The code runs. Fine.

But there's a question — where did that 5 actually go? Does it have a physical form?

Literally — somewhere inside your computer, right now, there's a 5 stored. If we say it's in memory — what does that actually look like? Not ink on paper. Not pixels on screen. That 5 is, essentially, a physical state of silicon and copper.

Over this series I'll try to walk that whole journey — from physical state up to what appears on screen. For today, the goal is one specific question: how does a [HOVER: bit] physically live in memory?

---

## One thing to clear up first

I'm not going to talk about Python, C, JavaScript, or any specific language today. All the software layers are stripped off. We're staying at the hardware level, where the computer no longer understands "variable" or "object." What exists down here is wires, transistors, and voltage.

---

## Why binary?

What is data, inside a computer? [HOVER: voltage]. The level of an electrical signal. 0 means "low voltage" (near 0V), 1 means "high voltage" (near 5V or 1.8V — depends on chip design). That is to say, because a computer is fundamentally an electronic device, we cannot rely on physical mediums like paper or mechanical tokens for calculation and storage. To store any information, it must first be encoded into electrical states. This is precisely why in digital electronics, data equates to voltage.

Natural question — what if the computer used base-10? We have 10 fingers, we count 0 to 9. Couldn't the computer just have 10 different voltage levels?

- 0 = 0V
- 1 = 0.5V
- 2 = 1V
- ...
- 9 = 4.5V

The problem isn't math. It's physics. And the problem has a name — noise.

In a real circuit, voltage is never perfectly stable. Temperature swings, electromagnetic interference from neighboring wires, small fluctuations in the power supply — everything nudges voltage around.

[FIGURE 1: A voltage-vs-time graph with two side-by-side panels. Left: base-10 setup with 10 narrow horizontal bands stacked. A jittery signal line easily crosses boundaries — annotate "Noise flips 2 to 3, you never notice." Right: binary with only two wide bands separated by a shaded "forbidden zone" — the same jittery signal stays inside its band. Caption: "Why noise doesn't break binary."]

In base-10, 1.1V means "2" and 0.9V means "1". A mere 0.2V shift and your "2" is silently a "3". You'd never know.

In binary? 0 is "any low voltage" (say, 0 to 0.8V). 1 is "any high voltage" (say, 2 to 5V). Between them is a [HOVER: noise margin] — a "forbidden zone" the signal has to cross to change state. Small noise can't cross that gap.

That's the real reason binary exists. Not "0 and 1 are easy" — 0 and 1 are **reliable**. Everything else is built on that.

This doesn't mean a computer can't understand 5, 25, or 1000. It breaks every number into a combination of many 0s and 1s. That story is the next article.

**Next question:** who creates these voltages? Who does the switching?

---

## The transistor — the smallest switch

So far, one thing is clear — a computer ultimately works with voltage. But the question is: **who controls that voltage?** Because sometimes current has to flow through, and sometimes it has to be blocked. Which means we need something that can open the electrical path when it wants to, and close it when it wants to.

We need a **switch**.

But there's a problem. A light switch in your house, you press with your hand. If a computer has 100 billion switches inside it, who presses those?

That's where the **transistor** comes in.

The simplest way to think about a transistor is as an **extremely tiny electronic tap**. A tap in your kitchen — open it, water flows; close it, water stops. A transistor is the same, except electricity is flowing instead of water. And the wild part is, no human turns this tap. **Another small electrical signal opens or closes it.**

Imagine you didn't even touch the tap's handle. Instead, a small motor on the side automatically rotated the handle for you. A transistor works something like that. When a control signal arrives, the electrical path opens. Current flows. We call that **1**. When the control signal leaves, the path closes again. No current. We call that **0**.

[ANIMATION: Water tap and transistor side-by-side. Water tap: reservoir → tap → bucket. A tiny motor automatically rotates the handle instead of a human hand. Beside it, a transistor circuit where a control signal opens or closes the current path. Caption: "A transistor is a switch — controlled by another electrical signal."]

Engineers use three names here.

The side current enters is called the **Source**.

The side it exits is called the **Drain**.

And the control signal that runs the whole switch — that's called the **Gate**.

You don't need to memorize these names. What matters is this — **one small electrical signal can control another electrical signal.**

That's it. That's the whole idea.

And on top of that tiny idea, the entire modern computer stands.

While you're reading this, billions of transistors inside your phone or laptop are flipping on and off many times per second. But no matter how many of them there are, each transistor does the same one thing —

**Let current through, or don't.**

That's the whole trick.

---

## When switches connect

You can't do much with one transistor. Same way one LEGO block doesn't build a house. But wire thousands of transistors together and gradually you start getting circuits that can decide, calculate, even remember.

**Wire two transistors in [HOVER: series and parallel]** — one after the other on the same line — and for current to reach the end, both have to be on at the same time. That's how you build an AND gate.

| A | B | Output |
| --- | --- | --- |
| 0 | 0 | 0 |
| 0 | 1 | 0 |
| 1 | 0 | 0 |
| 1 | 1 | 1 |

**Wire them side by side (parallel)**, and current can flow whenever either one is on. That's how you build an OR gate.

A small tweak to a single transistor's wiring gives you a NOT gate — input 1 flips to output 0, input 0 flips to output 1.

[FIGURE 2: Three panels showing AND, OR, NOT gates. Each panel: (top) transistor-level circuit — series for AND, parallel for OR, inverted for NOT, with voltage sources and ground labeled. (bottom) standard logic-gate symbols (D-shape for AND, curved shield for OR, triangle-with-dot for NOT). Caption: "Physical circuit → abstract symbol."]

These three gates — AND, OR, NOT — can build any logical operation. Any decision, any comparison, any bit of arithmetic. XOR, NAND, NOR — all combinations of these three.

Arithmetic too. A circuit to add two bits (a "full adder") can be built from just AND, OR, and XOR gates. Line up 64 full adders side by side and you have a circuit that adds 64-bit integers — one of the important pieces of the [HOVER: ALU] inside a CPU.

There's still one problem here.

---

## How does a switch "remember"?

Every gate we've seen so far has one big problem. Take the input away and the output disappears too.

Say you feed an AND gate (1, 1). Output is 1. Now remove the inputs. What's the output? 0. The gate remembers nothing.

That's not memory. But a computer needs memory. Your `x = 5` needs the 5 to sit somewhere so it can be read later. How does that work?

My biggest confusion was right here. In my university's Digital Logic Design course, 
we covered everything: SR Latches, JK Flip-Flops, truth tables, and registers. Yet, I never truly understood *why* each component was necessary, or *how* it actually retained data. When coding, whenever I wrote `x = 5`, I couldn't bridge the gap between these two worlds. Was memory just a sliver of magnetic metal? Or a pool of trapped electrical charge? Regrettably, we are pushed through course after course where you can get by simply memorizing slides and cramming past exam papers, without ever understanding anything from first principles.

However, the answer to this problem is elegant, and simple. **Feedback loop.**

Take two NOT gates. Connect the output of the first to the input of the second. Connect the output of the second back to the input of the first.

[FIGURE 3: A cross-coupled latch circuit. Two NOT gates drawn as triangles with dots, arranged in a loop — Gate A's output feeds Gate B's input, Gate B's output feeds Gate A's input. Show two side-by-side snapshots: State 1 (Gate A output = 1, Gate B output = 0, arrows showing signal circulating) and State 2 (Gate A output = 0, Gate B output = 1). Annotation: "Two stable states. The loop holds state as long as current flows."]

Now what happens?

Say the first gate's output is 1. That feeds into the second gate. NOT gate, so the second gate's output is 0. That feeds back into the first, and the first's output stays 1.

Loop. Stable. The first is always 1, the second always 0.

Remove the input now. What happens? Nothing at all. The state is trapped in the loop.

Another way to think about it — imagine a marble sitting in one of two valleys, separated by a small hill. It won't move on its own. But if you push it hard enough, it rolls over into the other valley. And it settles there.

A [HOVER: latch] is like that. Two stable states — 0 and 1.

## A gatekeeper before memory

We've solved one problem. Two NOT gates giving each other feedback can hold on to their state. But now there's a new problem.

Say I want to write a 1 into the latch right now. Then five seconds later I want to write a 0. How does the latch know **when** to accept new data, and when to hold on to the old data? If it's always listening for input, every new signal that comes along will overwrite the previous value.

So we need a "doorman." Something that says — "come in now." Or — "no one enters right now." That doorman is a **Write Enable wire**. And once we add it, we call the whole thing a gated latch.

```
Data ----AND----->
          ^
          |
     Write Enable
```

When Write Enable = 0, the AND gate blocks the input. New data can't get into the latch. So the old value stays. When Write Enable = 1, the AND gate opens the door. Now the new value enters the latch and becomes part of the feedback loop.

There's still a small problem with the plain latch. As long as Write Enable stays on, any change on the input keeps changing the output. But a CPU doesn't want that. A CPU wants — "data changes only at a specific moment." Otherwise different parts of the computer would generate outputs at different times and there'd be no coordination.

For that reason, the latch gets paired with a clock. (More on clocks later in the series.) Now new data can't be written at just any moment. It only gets written on a specific tick of the clock. This clock-controlled latch is what we call a [HOVER: flip-flop].

▾ go deeper — does attaching a clock alone make it a flip-flop?

A natural doubt here: if we just attach a clock to the latch, does it automatically change exactly once, cleanly?

Not quite. For as long as the clock (or Write Enable) is on, the latch stays "transparent" the whole time — the output changes the instant the input does, for the entire window. In a circuit like a counter, a problem arises if the output loops back to drive its own input. As long as the Clock is High (1), the latch remains transparent. Consequently, any output change immediately feeds back to flip the input again. Because gate propagation delays ($\Delta t_{prop}$) are in nanoseconds—much shorter than the clock pulse—the output rapidly oscillates between 0 and 1 multiple times during a single clock cycle. When the clock drops low, the final state of $Q$ becomes completely unpredictable. This is the race-around condition.

So a real flip-flop isn’t one latch — it’s two, chained: a master and a slave. The master is open while the clock is 0; the slave is open while the clock is 1 — opposite windows, never both open. The input gets caught once by the master, then handed off once to the slave — the whole thing happens exactly once per tick.

The full detail isn’t this article’s job — that’s for when we cover clocks directly. For now: just attaching a clock isn’t the whole story.

One important note — real RAM isn't actually built from these simple latches. Modern DRAM is more complex and uses different tricks to pack more data into less space. But the fundamental idea of "one bit that remembers" comes from feedback.

And how long does the state last? **As long as there's current.** Power off, the loop collapses, state is lost. That's why RAM is volatile — unplug and it forgets everything. We'll come back to this in a later article.

---

## The full story in one glance

Let's play the whole thing back.

You wrote:

```python
x = 5
```

Python isn't flipping transistors directly, obviously. There's a compiler/interpreter, an operating system, a CPU — many layers in between. We'll get to those later.

But once we're all the way down at the hardware, the story looks something like this:

- The number 5 becomes binary — `101`
- Three memory cells are allocated for those three bits
- Each cell is a flip-flop built from a few transistors
- Voltage gets set into those flip-flops (high, low, high — 1, 0, 1)
- The feedback loop holds that voltage in place
- Later when the CPU reads `x`, it reads voltages from those three flip-flops, gets three bits, and reconstructs 5

The interesting bit — this pattern (transistor → gate → latch) is the smallest building block of every computer. Those three layers are the base. Everything above them — RAM, CPU, cache, GPU, OS, your browser, your React app — is repeated composition of these three layers.

Billions of flip-flops in RAM.
Billions of gates in a CPU.
A few transistors in each gate.

All of it starting with voltage.

---

## What this article covered

- **A bit isn't an abstract idea** — it's a physical state of voltage.
- **Binary came from reliability, not math.** Noise can't easily flip between two well-separated states.
- **Memory isn't magic** — it's just two gates in a loop. Feedback is the origin of memory.

---

## Next article

Now we know how one bit can be held.

But one bit does nothing.

So how do millions of bits, together, become a sentence in Bangla, a JPEG image, an MP3 song — or the code you just wrote?

Next article, we crack that mystery.

**[Next: 2. How does the world become zeros and ones?]**

---

### Hover Definitions

**[HOVER: bit]***A bit is the smallest unit of information in a computer. The word comes from "binary digit." A bit can only hold two possible values — `0` or `1`. In a digital circuit these two values represent two different electrical states. Usually `0` means Off (low voltage) and `1` means On (high voltage).*

**[HOVER: voltage]***Voltage is electrical "pressure" — an energy difference between two points. The way water pressure pushes water through a pipe, voltage carries electrons through a wire. More voltage, more push. Measured in volts (V). Computers usually operate between 0 and 5 volts (modern chips run at 1.8V or lower).*

**[HOVER: noise margin]***A noise margin is the "safety zone" of a binary signal — a forbidden gap between the high state (1) and the low state (0). This gap is wide enough that small electrical noise (interference, fluctuation) can't accidentally push the signal from one state to the other. Without noise margins, binary computing wouldn't work — data would corrupt every few nanoseconds.*

**[HOVER: series and parallel]***Two components "in series" in a circuit means they're wired one after the other on the same line — current has to go through both. "In parallel" means side by side — current can go through either one. Series means "both must be on" (like AND); parallel means "either one is fine" (like OR).*

**[HOVER: ALU]***ALU stands for Arithmetic Logic Unit — the part of the CPU that does arithmetic (add, subtract, multiply, divide) and logical operations (AND, OR, comparison). Built entirely from logic gates — not a "processor within a processor", just many gates arranged together. When you write `a + b` in JavaScript, those two numbers eventually flow through the ALU and the sum comes out.*

**[HOVER: latch]***A latch is a circuit that can "hold" one bit of information. Two logic gates are wired in a cross-coupled way (each one's output going to the other's input), which forces the circuit to settle into one of two stable states — 1 or 0. That stability is memory. The state lasts as long as there's current.*

**[HOVER: flip-flop]***A flip-flop is a variant of a latch, but the state only changes on the edge of a clock signal (rising or falling). This is essential for synchronization — every register in a CPU runs on the same clock, so everything happens together. Each register in a CPU has 32 or 64 flip-flops, holding one bit each.*
