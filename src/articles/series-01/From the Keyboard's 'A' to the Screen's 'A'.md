# Keyboard-এর 'A' থেকে Screen-এর 'A'

## এক keystroke-এর ভেতরে যা কিছু ঘটে

> *`[DIAGRAM · …]` blocks render through the `<Diagram>` primitive. `[WIDGET · …]` marks an interactive instrument. Hover definitions live only in `src/articles/glossary.ts`.*

Keyboard-এ 'A' চাপলেন। এক মুহূর্ত পর screen-এ 'A' ফুটে উঠল।

আপনার কাছে মনে হলো instant। কোনো delay টের পাননি, কোনো অপেক্ষাও করতে হয়নি। আঙুল নামল আর অক্ষরটা চলে এল।

কিন্তু "instant" মানে literally zero time নয়। আপনার আঙুলের চাপ থেকে screen-এ আলো জ্বলা পর্যন্ত বেশ কয়েকটি আলাদা hardware এবং software layer কাজ করে।

এই সিরিজে এতদিন আমরা এই system-গুলোকে আলাদা আলাদা করে দেখেছি। আজ দেখব সবাই একসাথে কীভাবে কাজ করে। একটা মাত্র keystroke-কে follow করে পুরো পথটা হেঁটে যাব — আঙুলের চাপ থেকে শুরু করে চোখে আলো পড়া পর্যন্ত।

---

## ০১ — প্রথম চমক: keyboard-এর ভেতরেও একটা ছোট computer আছে

'A' চাপলে সরাসরি laptop-এর main CPU-তে কিছু যায় না। তার আগে সেই signal-কে থামতে হয় keyboard-এর নিজের ভেতরে বসে থাকা একটা ছোট্ট computer-এ।

শুনতে অদ্ভুত লাগতে পারে। Keyboard তো একটা input device মাত্র, তার আবার নিজের computer কেন থাকবে? কিন্তু keyboard-এর ভেতরে সাধারণত একটা ছোট controller chip থাকে। এতে processor logic, কিছু memory আর keyboard-এর firmware থাকে। তার কাজ হলো key press detect করা আর সেটাকে computer-এর জন্য meaningful input data-তে পরিণত করা।

অনেক keyboard-এ key-গুলো একটা matrix আকারে সাজানো — সারি আর কলামের intersection-এ key বসে। Controller বারবার সেই matrix scan করে দেখে কোন key-এর electrical state বদলেছে। প্রতিটা key-এর জন্য আলাদা তার টানার দরকার হয় না; সারি আর কলামের সংযোগই বলে দেয় কোন key চাপা হয়েছে।

যতক্ষণ কোনো key চাপা না হচ্ছে, কোনো কলামেই কিছু ধরা পড়ে না। কিন্তু যেই কোনো key চাপা হয়, সেই key-এর নিচের switch-এর দুইটা metal contact একসাথে লেগে যায়, সেই সারি আর সেই কলামের মাঝে circuit complete হয়ে যায়, আর chip ঐ কলামে voltage দেখতে পায়।

**[DIAGRAM · scan cycle]**

```text
Keyboard matrix
      ↓
controller scans
      ↓
which key changed?
      ↓
input report / usage code
```

ধরুন 'A' key press detect হলো। USB keyboard হলে controller সাধারণত **[HOVER: USB HID]** (Human Interface Device) protocol ব্যবহার করে host-এর কাছে একটা input report পাঠায়। সেই report-এ 'A' key-এর জন্য একটা নির্দিষ্ট usage code থাকতে পারে — USB HID Usage Tables-এ `0x04` হলো "Keyboard a and A"।

খেয়াল করুন — এই `0x04` character 'A'-এর ASCII code নয়। এটা keyboard-এর কোন key-এর কথা বলা হচ্ছে, সেটার একটা code। অক্ষরে রূপান্তরটা হবে পরে, OS-এর স্তরে — layout বদলালে একই key অন্য অক্ষরও হতে পারে।

মানে laptop-এর main CPU কিছু জানার আগেই keyboard-এর নিজের controller একটা পুরো কাজ সেরে ফেলেছে। Electrical change পড়া হয়েছে, সিদ্ধান্ত নেওয়া হয়েছে, digital input information তৈরি হয়েছে।

আর সেই controller-এর processor-ও কিন্তু আমাদের দেখা সেই একই নিয়মে চলে — fetch করে, decode করে, execute করে। শুধু scale-টা অনেক ছোট।

**[WIDGET · KeyMatrixScan]** — একটা key চেপে scan cycle-টা দেখুন।

---

## ০২ — Interrupt: CPU-কে জানানো

USB-এর মাধ্যমে keyboard-এর input information laptop-এ পৌঁছাল। Motherboard-এ বসে থাকা USB controller সেটা receive করল — এই controller একটা আলাদা chip, CPU-র বাইরে, যার কাজ USB device-এর সঙ্গে কথা বলা।

এখন data এসেছে, কিন্তু CPU এই মুহূর্তে অন্য কাজ করতে পারে — হয়তো Chrome-এর কোনো JavaScript চালাচ্ছে, বা video decode করছে। তাকে জানাতে হবে যে একটা hardware event ঘটেছে।

এই জানানোর একটা mechanism হলো **[HOVER: interrupt]**। USB subsystem host CPU-কে জানায় যে নতুন data এসেছে, আর CPU তার বর্তমান execution-এর উপযুক্ত point থেকে interrupt handling-এর দিকে যায়।

তার আগে CPU-কে এতটুকু state সংরক্ষণ করতে হয়, যাতে পরে আগের execution-এ ফিরে আসা যায়। তারপর privileged OS code interrupt-এর কাজটা সামলায়।

এখানে একটা গুরুত্বপূর্ণ distinction: **interrupt আসা মানেই context switch নয়।** Interrupt handle করার পর CPU আগের কাজেই ফিরে যেতে পারে। আবার interrupt handling-এর ফলে কোনো task runnable হলে scheduler পরে অন্য task-কে CPU-তে চালাতেও পারে।

**[DIAGRAM · interrupt handling]**

```text
current execution
       ↓
   interrupt
       ↓
OS interrupt handling
       ↓
resume previous work
        or
scheduler runs another task
```

অর্থাৎ interrupt মূলত একটা বার্তা — "CPU, hardware-এ একটা event ঘটেছে, এটা handle করো।"

---

## ০৩ — OS-এর ভেতরে: এই event কার জন্য?

Interrupt handler চলতে শুরু করে। এই handler আসলে কী জিনিস? এটা Linux বা Windows kernel-এর একটা অংশ, যেটা বছর কয়েক আগে কোনো developer লিখেছিলেন। তারপর সেটা compile হয়ে machine code হয়েছে, আর আপনার laptop boot হওয়ার সময় সেই machine code memory-তে load হয়েছে। এই মুহূর্তে সেই বহু পুরনো compiled code-ই চলছে।

তারপর OS-এর keyboard driver সেই input data পড়ে বোঝে — কোন key চাপা হয়েছে। সেখান থেকে OS একটা keyboard event তৈরি করে নিজের উপরের স্তরে পাঠিয়ে দেয়।

এখন প্রশ্ন — এই event কোন application-এর জন্য? আপনার laptop-এ তো এই মুহূর্তে অনেকগুলো program চলছে। Key press সাধারণত সবাইকে পাঠানো হয় না।

Desktop-এর input/window system জানে কোন window এই মুহূর্তে focused। ধরা যাক সেটা VS Code। তাহলে event সেই application-এর জন্য deliver করা হবে।

এরপর application যদি এই মুহূর্তে CPU-তে না চলে, তাকে runnable করা হতে পারে। Scheduler তার policy অনুযায়ী পরে তাকে CPU-তে চালানোর সুযোগ দেয়।

**[DIAGRAM · event delivery]**

```text
keyboard event
      ↓
OS input handling
      ↓
application becomes runnable
      ↓
scheduler
      ↓
application runs
```

এখানেও আগের distinction-টা মনে রাখুন — **event আসা আর context switch একই ঘটনা নয়।** Application তখন CPU-তেই থাকতে পারে; তখন আলাদা করে context switch-এর দরকার নাও হতে পারে।

আর যদি সত্যিই অন্য process-এর thread থেকে VS Code-এর thread-এ execution যায়, তখন প্রয়োজন অনুযায়ী তাদের execution state আর virtual memory context বদলায় — Article 6-এ যেভাবে দেখেছিলাম।

---

## ০৪ — App জেগে উঠল

ধরুন আপনি একটা text editor-এ টাইপ করছেন — এই মুহূর্তে সেটাই focused application। Event তার কাছে পৌঁছায়, আর application-এর ভেতরের একটা event handler বুঝতে পারে: user একটা key চেপেছে।

তবে event সাধারণত app-কে মাঝপথে ধাক্কা দিয়ে থামায় না। App-এর নিজের একটা loop আছে, যেটা একটার পর একটা event নিয়ে কাজ করে। আমাদের keypress সেই সারিতেই গিয়ে বসেছিল, আর app CPU-তে সুযোগ পেয়ে সেটা তুলে নিয়েছে।

**[DIAGRAM · the app loop]**

```text
event waiting in the queue
          ↓
app takes the next event
          ↓
    update state
          ↓
mark the UI as needing a redraw
          ↓
  wait for the next event
```

"State update" বলতে এখানে কী বোঝায়? Editor-এর কাছে আপনার file-টা memory-তে একটা data structure হিসেবে আছে — মোটামুটি character-এর একটা তালিকা। Article 2-তে দেখেছি, প্রতিটা character memory-তে সংখ্যা হিসেবেই থাকে। তাই কাজটা আসলে এই — cursor যেখানে আছে সেখানে সেই সংখ্যাটা ঢোকানো, আর cursor এক ধাপ এগিয়ে দেওয়া।

আর একটা keypress-এ প্রায়ই এর চেয়ে বেশি কিছু ঘটে। Undo history-তে একটা entry যোগ হয়, যাতে Ctrl+Z কাজ করে। Syntax highlighting আবার হিসাব হয়। Autocomplete হয়তো নতুন suggestion খুঁজতে শুরু করে। এক অক্ষর টাইপ করলেও editor-এর ভেতরে কয়েকটা ছোট কাজ একসঙ্গে জেগে ওঠে।

কিন্তু খেয়াল করুন — app নিজে screen-এ কিছু আঁকেনি। সে শুধু নিজের state বদলেছে, আর ঠিক করেছে UI-র কোন অংশটা আবার আঁকা দরকার। আঁকার কাজটা এর পরের ধাপ।

আর "আঁকা" মানে screen-এ pixel বসানো। কোন pixel-এ কী রং হবে, সেটা কে ঠিক করবে?

---

## ০৫ — অক্ষর থেকে pixel

এখানে font system কাজে নামে। আপনার editor-এ যে font ব্যবহার করছেন — Consolas, Fira Code, যাই হোক — তার font data system বা application-এর memory/cache-এ আগে থেকেই থাকতে পারে। না থাকলে প্রয়োজন অনুযায়ী load করা হয়।

Font file-এ প্রতিটা character-এর জন্য একটা করে shape-এর বর্ণনা থাকে। বেশিরভাগ modern font-এ সেই বর্ণনা vector আকারে — মানে গাণিতিক curve দিয়ে বলা থাকে অক্ষরটার আকৃতি কেমন হবে। এর সুবিধা হলো, যেকোনো size-এ scale করলেও অক্ষরটা ঝাপসা হয় না।

কিন্তু display-এ শেষ পর্যন্ত pixel দরকার। তাই সেই shape-কে আপনার current font size অনুযায়ী pixel grid-এর ওপর বসাতে হয়। এই প্রক্রিয়ার নাম **[HOVER: rasterization]**।

**[DIAGRAM · rasterization]**

```text
'A' character
      ↓
  font shape
      ↓
 rasterization
      ↓
pixel information
```

এখন 'A' আর শুধু একটা character হিসেবে নেই। তার shape screen-এর ছোট একটা অঞ্চলের pixel information-এ পরিণত হয়েছে, যার প্রতিটা pixel-এর জন্য brightness বা color information দরকার। Article 2-তে দেখেছিলাম কীভাবে ছবির pixel value শেষ পর্যন্ত bit-এ represent হয় — এখানেও সেই একই idea ফিরে এল। একটা abstract অক্ষর ধীরে ধীরে screen-এর physical image-এর দিকে এগোচ্ছে।

**[WIDGET · Rasterize]** — vector থেকে pixel-এ যাওয়াটা দেখুন।

---

## ০৬ — Frame থেকে আলো

এখন application-এর updated UI-কে screen-এর জন্য একটা final image-এ পরিণত করতে হবে। **[HOVER: Window compositor]** বিভিন্ন visible window-এর content একত্র করে screen-এর final frame তৈরি করতে পারে — সে জানে কোন window কোথায় বসানো।

তারপর graphics/display pipeline সেই frame-কে একটা **[HOVER: display buffer]**-এ প্রস্তুত করে, যেখান থেকে display hardware সেটা monitor-এর দিকে পাঠাতে পারে।

**[DIAGRAM · display path]**

```text
Application UI
      ↓
  rendering
      ↓
  compositor
      ↓
  final frame
      ↓
 display buffer
      ↓
   monitor
```

60 Hz display হলে screen প্রতি second-এ ৬০টা refresh cycle চালায় — প্রতিটা cycle মোটামুটি ১৬.৬৭ millisecond। তবে এর মানে এই নয় যে GPU ঠিক প্রতি ১৬.৬৭ ms অন্তর পুরো ছবিটা একসাথে cable-এ ছুঁড়ে দেয়; display system frame-এর data ধারাবাহিকভাবে scan out করে।

HDMI বা DisplayPort cable-এর মধ্য দিয়ে সেই digital information electrical signal হিসেবে যায়, আর তার মাধ্যমে pixel data ও display control information monitor-এ পৌঁছায়।

এই সিরিজের একদম প্রথম আর্টিকেলে আমরা যেখান থেকে শুরু করেছিলাম, ঘুরে ফিরে সেই electrical signal-এই ফিরে এলাম।

Monitor-এর ভেতরের display electronics সেই data অনুযায়ী panel drive করে। LCD-তে liquid crystal দিয়ে ঠিক করা হয় backlight-এর কতটা আলো প্রতিটা pixel দিয়ে যাবে; OLED-এ প্রতিটা pixel নিজেই আলো তৈরি করে।

'A'-এর shape অনুযায়ী নির্দিষ্ট pixel-গুলোতে উপযুক্ত আলো তৈরি হলো। Photon বেরিয়ে এসে আপনার চোখে পড়ল।

আপনি screen-এ 'A' দেখলেন।

---

## ০৭ — একটামাত্র keypress-এ কতগুলো layer

আপনার কাছে পুরোটা instant মনে হয়েছে। এক আঙুলের চাপ, সাথে সাথে অক্ষর।

**[WIDGET · FullRelay]** — পুরো relay-টা এক ধাপ এক ধাপ করে, keypress থেকে চোখে আলো পর্যন্ত।

কিন্তু এই ছোট্ট ঘটনার ভেতরে আমরা অনেকগুলো layer দেখতে পেলাম:

**[DIAGRAM · the whole chain]**

```text
Finger
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
Your eye
```

প্রতিটা layer-এর কাজ আলাদা। Keyboard জানে না VS Code কীভাবে text edit করে। OS জানে না 'A'-এর glyph দেখতে কেমন। Font system জানে না keyboard থেকে event কীভাবে এসেছে। Display hardware জানে না আপনি কোন editor ব্যবহার করছেন।

তবু তারা একে অন্যের সঙ্গে কাজ করতে পারে। কেন?

কারণ প্রতিটা layer-এর মধ্যে একটা defined interface আছে — এক layer কী ধরনের information দেবে, পরের layer সেটাকে কীভাবে interpret করবে, আর তার output কী হবে।

এই ধারণাটাই **[HOVER: abstraction]**। একটা layer-এর ভেতরটা না জেনেও তার interface ব্যবহার করা যায়।

এই কারণেই keyboard-এর firmware লেখা engineer-কে VS Code-এর code বুঝতে হয় না। আর VS Code-এর developer-কে LCD panel-এর liquid crystal physics বুঝে keypress handler লিখতে হয় না।

আধুনিক computing-এর বিশাল complexity সামলানোর অন্যতম বড় কৌশল এটাই — প্রতিটা layer নিজের কাজটা করে, আর অন্য layer-এর সঙ্গে একটা defined interface দিয়ে কথা বলে।

---

## এই আর্টিকেলে কী শিখলাম

- Keyboard-এর ভেতরে নিজের একটা controller আছে — সে সারি-কলামের matrix scan করে, input report বানায়, USB HID দিয়ে পাঠায়।
- Interrupt হলো CPU-কে hardware event জানানোর একটা mechanism — আর interrupt আসা মানেই context switch নয়।
- OS-এর input machinery event তৈরি করে, focused application-এর জন্য deliver করে; দরকার হলে scheduler তাকে CPU-তে চালায়।
- Application event handle করে নিজের state বদলায়; font system অক্ষরের shape-কে rasterize করে pixel information বানায়।
- Compositor → final frame → display buffer → cable → monitor-এর pixel আলো ছাড়ে। ঘুরে সেই electrical signal-এই ফেরত।
- প্রতিটা layer নিজের কাজ করে আর defined interface দিয়ে পরেরজনের সঙ্গে কথা বলে — এটাই abstraction।

---

## ০৮ — সিরিজের শেষে

আটটা আর্টিকেল আগে শুরু করেছিলাম একটা সহজ প্রশ্ন দিয়ে — `x = 5` লিখলে সেই ৫ সংখ্যাটা কম্পিউটারের কোথায় যায়?

উত্তরটা খুঁজতে গিয়ে আমাদের অনেক দূর যেতে হয়েছে। Transistor থেকে শুরু করে logic gate, gate থেকে latch, latch থেকে register। তারপর binary representation, CPU-র ভেতরের ALU আর datapath, fetch-decode-execute-এর অবিরাম চক্র। এরপর memory hierarchy, cache-এর চতুরতা, locality-র সৌন্দর্য। তারপর operating system — process, scheduling, virtual memory, system call। আর শেষে compiler, interpreter, bytecode, VM আর JIT — source code কীভাবে execution-এর দিকে এগোয়।

সবশেষে keyboard-এর অক্ষর থেকে screen-এর অক্ষর পর্যন্ত পুরো journey-টা একসাথে দেখলাম।

এই সিরিজ পড়ে আপনি নতুন CPU design করতে পারবেন না। সেটা উদ্দেশ্যও ছিল না। উদ্দেশ্য ছিল একটা mental map তৈরি করা।

আমরা প্রতিদিন এমন সব tool ব্যবহার করি যাদের ভেতরের অনেক layer নিয়ে ভাবি না। React লিখি, browser-এর rendering system নিয়ে না ভেবেও। Docker চালাই, container-এর নিচে কী হচ্ছে না জেনেও। এটা খারাপ কিছু নয় — abstraction-এর উদ্দেশ্যই তো আপনাকে সব layer একসাথে মাথায় রাখতে না দেওয়া।

কিন্তু কিছু ভেঙে গেলে সেই abstraction-এর নিচে একটু তাকাতে পারা কাজে দেয়। App slow হলে এখন অন্তত ভাবতে পারবেন — computation, memory, I/O, scheduling, rendering, নাকি অন্য কোনো layer? Memory নিয়ে সমস্যা হলে heap আর virtual memory-র কথা মনে পড়বে। Input বা display নিয়ে গোলমাল হলে keyboard থেকে screen পর্যন্ত এই পুরো chain-টা মাথায় আসতে পারে।

সবচেয়ে বড় কথা, machine আর আগের মতো রহস্যময় থাকবে না। ঢাকনা খুলে ইঞ্জিনটা একবার দেখা হয়ে গেছে। ভেতরে কোনো জাদু নেই — আছে electrical signal, logic, software, interface, আর মানুষের তৈরি অনেকগুলো চতুর abstraction।

সেটুকু জানাই যথেষ্ট।

*পড়ার জন্য ধন্যবাদ। ভালো থাকবেন।*

---

## ০৯ — আরও গভীরে যেতে চাইলে

এই সিরিজ ছিল একটা পাখির চোখে দেখা। প্রতিটা topic-ই নিজে একটা পূর্ণ জগত। কোনো একটা layer যদি আপনার ভালো লেগে থাকে, নিচের resource-গুলো থেকে শুরু করতে পারেন। বেশিরভাগই বিনামূল্যে পাওয়া যায়।

**একদম শুরু থেকে বুঝতে চাইলে**

- **Crash Course Computer Science** — YouTube-এ ৪০ পর্বের একটা সিরিজ, প্রতিটা ১০-১৫ মিনিট। Transistor থেকে AI পর্যন্ত computing-এর অনেকগুলো গুরুত্বপূর্ণ idea সহজভাবে পরিচয় করিয়ে দেয়। শুরু করার জন্য একটা ভালো overview।
- **Ben Eater** — YouTube channel। breadboard-এ তার দিয়ে একটা সম্পূর্ণ 8-bit computer বানিয়েছেন, প্রতিটা ধাপ ক্যামেরার সামনে ব্যাখ্যা করেছেন।
- **Nand2Tetris** (nand2tetris.org) — একটা NAND gate থেকে শুরু করে ধাপে ধাপে পুরো computer system আর তার software hierarchy বানানোর কোর্স। Official website-এ lecture, project material আর tool বিনামূল্যে; Coursera version-টা paid course।

**Hardware আর CPU নিয়ে**

- **Computer Systems: A Programmer's Perspective** — Bryant ও O'Hallaron। Programmer-এর দৃষ্টিকোণ থেকে লেখা; Article 3, 4, 5-এর গভীর version।
- **Computer Organization and Design** — Patterson ও Hennessy। Computer architecture-এর classic textbook।
- **Inside the Machine** — Jon Stokes। আধুনিক processor-এর ভেতরটা ছবির সাহায্যে।

**Memory আর Performance নিয়ে**

- **What Every Programmer Should Know About Memory** — Ulrich Drepper-এর দীর্ঘ প্রবন্ধ, বিনামূল্যে। Article 5-এর সম্পূর্ণ রূপ।
- **Latency Numbers Every Programmer Should Know** — Jeff Dean-এর ছোট তালিকা; বিভিন্ন operation-এ কত সময় লাগে তার mental model।

**Operating System নিয়ে**

- **Operating Systems: Three Easy Pieces** (ostep.org) — সম্পূর্ণ বিনামূল্যে। Article 6-এর প্রতিটা বিষয় বিস্তারিত।
- **Linux Kernel Development** — Robert Love।

**Compiler আর Language নিয়ে**

- **Crafting Interpreters** (craftinginterpreters.com) — বিনামূল্যে পড়া যায়; নিজে হাতে দুইটা interpreter বানানোর মধ্য দিয়ে শেখা।
- **V8 blog** (v8.dev/blog) — engine-এর ভেতরে কী ঘটে, engineer-দের নিজের লেখা।

**হাতে-কলমে শিখতে চাইলে**

- **nandgame.com** — ব্রাউজারেই NAND gate থেকে computer বানানোর খেলা।
- **CS50** (Harvard) — YouTube আর edX-এ; বর্তমান CS50x material free OpenCourseWare হিসেবেও available।

আমি নিজেও আসলে এখানে দেওয়া প্রত্যেকটা রিসোর্স নিজে ঘেঁটে দেখার সুযোগ পাইনি। তবুও আপনাদের আর আমার নিজের সুবিধার্তে ইন্টারনেট ঘাঁটাঘাঁটি করে রিলেটেড সব রিসোর্স এখানে দিয়ে রাখলাম, যাতে পরে আরও এক্সপ্লোর করা যায়, আরও ভালোভাবে জানা যায়, নিজের জ্ঞানের কমতিগুলো শুধরানো যায়।

শেষ কথা — এই তালিকা দেখে অভিভূত হওয়ার কিছু নেই। সবগুলো পড়তে হবে না। যে একটা জিনিস আপনার কৌতূহল জাগিয়েছে, সেটা নিয়েই শুরু করুন। বাকিটা সময়মতো আসবে।

**Hover terms used** (definitions live in `glossary.ts`): `hid`, `interrupt`, `rasterization`, `compositor`, `framebuffer`, `abstraction`

---
---

# From the Keyboard's 'A' to the Screen's 'A'

## Everything that happens inside one keystroke

> *Blocks marked `[DIAGRAM · …]` render through the `<Diagram>` primitive. `[WIDGET · …]` marks an interactive instrument. Hover definitions live only in `src/articles/glossary.ts`.*

You press 'A' on your keyboard. A moment later, 'A' appears on the screen.

It felt instant to you. No delay you could detect, no waiting. Your finger went down and the character showed up.

But "instant" does not mean literally zero time. Between your finger pressing down and light coming off the screen, several completely separate hardware and software layers do their work. Each has a different responsibility, each was designed by different people at different times.

Throughout this series we've looked at these systems one at a time. Today we watch them work together. We'll follow a single keystroke through the whole path — from the press of a finger to light hitting your eye.

---

## 01 — First surprise: there's a small computer inside your keyboard

When you press 'A', nothing goes directly to the laptop's main CPU. Before that, the signal has to stop at a tiny computer sitting inside the keyboard itself.

It sounds strange. A keyboard is just an input device — why would it have its own computer? But inside a keyboard there is usually a small controller chip, holding processor logic, a little memory, and the keyboard's firmware. Its job is to detect key presses and turn them into input data that means something to the computer.

In many keyboards the keys are arranged as a matrix — each key sits at the intersection of a row and a column. The controller keeps scanning that matrix to see which key's electrical state changed. No separate wire has to run to every key; the meeting point of a row and a column is what identifies the key.

As long as no key is pressed, nothing shows up on any column. But the moment a key goes down, two metal contacts under that key touch, completing the circuit between that row and that column, and the chip sees voltage on that column.

**[DIAGRAM · scan cycle]**

```text
Keyboard matrix
      ↓
controller scans
      ↓
which key changed?
      ↓
input report / usage code
```

Say the 'A' key press is detected. On a USB keyboard the controller typically sends an input report to the host using the **[HOVER: USB HID]** (Human Interface Device) protocol. That report can carry a specific usage code for the 'A' key — in the USB HID Usage Tables, `0x04` is "Keyboard a and A".

Note what that `0x04` is not: it isn't the ASCII code for the character 'A'. It is a code for which key on the keyboard is being talked about. Turning it into a character happens later, at the OS level — change the layout and the same key can become a different letter.

So before the laptop's main CPU knows anything at all, the keyboard's own controller has already done a complete piece of work. An electrical change was read, a decision was made, digital input information was produced.

And that little controller's processor runs by the same rules we've seen throughout this series — fetch, decode, execute. Just at a much smaller scale.

**[WIDGET · KeyMatrixScan]** — press a key to watch the scan cycle.

---

## 02 — Interrupt: telling the CPU

The keyboard's input information reached the laptop over USB. The USB controller sitting on the motherboard received it — a separate chip, outside the CPU, whose job is talking to USB devices.

The data has arrived, but the CPU may be busy with something else right now — running some Chrome JavaScript, decoding a video. It has to be told that a hardware event happened.

One mechanism for telling it is an **[HOVER: interrupt]**. The USB subsystem signals the host CPU that new data has arrived, and the CPU moves from a suitable point in its current execution into interrupt handling.

Before that, the CPU has to preserve enough state to be able to return to the previous execution afterwards. Then privileged OS code handles the interrupt's work.

An important distinction here: **an interrupt arriving does not mean a context switch.** After handling the interrupt, the CPU can go straight back to what it was doing. Or, if the interrupt handling made some task runnable, the scheduler may later run a different task on the CPU.

**[DIAGRAM · interrupt handling]**

```text
current execution
       ↓
   interrupt
       ↓
OS interrupt handling
       ↓
resume previous work
        or
scheduler runs another task
```

So an interrupt is essentially one message — "CPU, an event happened in hardware; handle it."

---

## 03 — Inside the OS: who is this event for?

The interrupt handler starts running. What is this handler, exactly? It's a piece of the Linux or Windows kernel that some developer wrote years ago. That code was then compiled into machine code, and when your laptop booted, that machine code was loaded into memory. Right now, that very old compiled code is what's running.

Then the OS's keyboard driver reads that input data and works out which key was pressed. From there the OS builds a keyboard event and passes it up to its own higher layers.

Now the question — which application is this event for? Plenty of programs are running on your laptop at this moment, and a key press is usually not sent to all of them.

The desktop's input/window system knows which window is focused right now. Say that's VS Code. Then the event is delivered for that application.

If that application isn't running on the CPU at this moment, it can be made runnable. The scheduler, following its policy, later gives it a turn on the CPU.

**[DIAGRAM · event delivery]**

```text
keyboard event
      ↓
OS input handling
      ↓
application becomes runnable
      ↓
scheduler
      ↓
application runs
```

Keep the earlier distinction in mind here too — **an event arriving and a context switch are not the same event.** The application may already be on the CPU; then no separate context switch is necessarily needed.

And if execution really does move from another process's thread to VS Code's thread, then their execution state and virtual memory context change as needed — exactly as we saw in Article 6.

---

## 04 — The app wakes up

Say you're typing in a text editor — that's the focused application right now. The event reaches it, and a handler inside the application works out that the user pressed a key.

The event usually doesn't barge in and stop the app mid-work, though. The app has its own loop, taking one event after another. Our keypress went and sat in that queue, and the app picked it up once it got its turn on the CPU.

**[DIAGRAM · the app loop]**

```text
event waiting in the queue
          ↓
app takes the next event
          ↓
    update state
          ↓
mark the UI as needing a redraw
          ↓
  wait for the next event
```

And what does "updating state" mean here? To the editor, your file is a data structure in memory — roughly a list of characters. As we saw in Article 2, every character sits in memory as a number. So the actual work is this: put that number in where the cursor is, and move the cursor one step along.

And a single keypress usually sets off more than that. An entry goes into the undo history, so Ctrl+Z will work. Syntax highlighting gets recomputed. Autocomplete may start looking for fresh suggestions. Type one character and several small jobs wake up inside the editor together.

But notice — the app hasn't drawn anything on the screen. It only changed its own state and decided which part of the UI needs redrawing. The drawing is the next step.

And "drawing" means placing pixels on the screen. Who decides which pixel gets what colour?

---

## 05 — From character to pixel

This is where the font system comes in. The font you're using in your editor — Consolas, Fira Code, whatever it is — may already have its data in system or application memory or cache. If not, it gets loaded as needed.

A font file contains a shape description for every character. In most modern fonts, that description is in vector form — the shape of the letter is described mathematically with curves. The advantage is that scaling to any size keeps the letter crisp.

But a display ultimately needs pixels. So that shape has to be laid onto a pixel grid according to your current font size. That process is called **[HOVER: rasterization]**.

**[DIAGRAM · rasterization]**

```text
'A' character
      ↓
  font shape
      ↓
 rasterization
      ↓
pixel information
```

Now 'A' is no longer just a character. Its shape has become pixel information for a small region of the screen, where every pixel needs brightness or colour information. In Article 2 we saw how an image's pixel values end up represented as bits — the same idea has come back here. An abstract character is moving, step by step, toward a physical image on screen.

**[WIDGET · Rasterize]** — watch a vector become pixels.

---

## 06 — From frame to light

Now the application's updated UI has to become one final image for the screen. A **[HOVER: window compositor]** can combine the content of the visible windows into the screen's final frame — it knows where each window sits.

The graphics/display pipeline then prepares that frame in a **[HOVER: display buffer]**, from which the display hardware can send it toward the monitor.

**[DIAGRAM · display path]**

```text
Application UI
      ↓
  rendering
      ↓
  compositor
      ↓
  final frame
      ↓
 display buffer
      ↓
   monitor
```

On a 60 Hz display the screen runs 60 refresh cycles per second — roughly 16.67 milliseconds each. But that does not mean the GPU flings the whole picture down the cable once every 16.67 ms; the display system scans out the frame data continuously.

Through an HDMI or DisplayPort cable that digital information travels as electrical signals, carrying pixel data and display control information to the monitor.

Which brings us back to the electrical signals we started from in the very first article of this series.

The display electronics inside the monitor drive the panel according to that data. In an LCD, liquid crystal decides how much of the backlight passes through each pixel; in OLED, each pixel generates its own light.

The pixels matching the shape of 'A' produced the right light. Photons left the glass and hit your eye.

You saw 'A' on the screen.

---

## 07 — How many layers in one keypress

The whole thing felt instant to you. One press of a finger, and immediately a letter.

**[WIDGET · FullRelay]** — step (or run) the full relay, from keypress to light in your eye.

But inside that small event, we got to see a lot of layers:

**[DIAGRAM · the whole chain]**

```text
Finger
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
Your eye
```

Each layer has a different job. The keyboard doesn't know how VS Code edits text. The OS doesn't know what the glyph for 'A' looks like. The font system doesn't know how the event arrived from the keyboard. The display hardware doesn't know which editor you're using.

And yet they work with one another. Why?

Because between each layer there is a defined interface — what kind of information one layer hands over, how the next one interprets it, and what comes back out.

That idea is **[HOVER: abstraction]**. You can use a layer's interface without knowing what's inside it.

Which is why the engineer writing a keyboard's firmware doesn't have to understand VS Code's code. And a VS Code developer doesn't have to understand the liquid-crystal physics of an LCD panel to write a keypress handler.

That is one of the biggest tricks for handling the sheer complexity of modern computing — every layer does its own job and talks to the others through a defined interface.

---

## What this article covered

- A keyboard has its own controller inside — it scans a row/column matrix, builds an input report, and sends it over USB HID.
- An interrupt is one mechanism for telling the CPU about a hardware event — and an interrupt arriving does not mean a context switch.
- The OS's input machinery builds an event and delivers it for the focused application; where needed, the scheduler gives that app the CPU.
- The application handles the event and changes its own state; the font system rasterizes the letter's shape into pixel information.
- Compositor → final frame → display buffer → cable → the monitor's pixels emit light. Back to the electrical signals we began with.
- Every layer does its own job and talks to the next through a defined interface — that's abstraction.

---

## 08 — At the end of the series

Eight articles ago we started with a simple question — when you write `x = 5`, where does that 5 go inside the computer?

Finding that answer took us a long way. From transistors to logic gates, gates to latches, latches to registers. Then binary representation, the ALU and datapath inside a CPU, the endless cycle of fetch-decode-execute. Then memory hierarchy, the cleverness of caches, the beauty of locality. Then the operating system — processes, scheduling, virtual memory, system calls. And finally compilers, interpreters, bytecode, VMs and JITs — how source code moves toward execution.

And last of all, the whole journey from a letter on the keyboard to a letter on the screen, seen in one piece.

Reading this series won't let you design a new CPU. That was never the goal. The goal was to build a mental map.

Every day we use tools whose inner layers we never think about. We write React without thinking about the browser's rendering system. We run Docker without knowing what happens beneath a container. That's not a bad thing — the whole point of abstraction is to spare you from holding every layer in your head at once.

But when something breaks, being able to look a little way under that abstraction helps. When an app is slow, you can now at least ask — computation, memory, I/O, scheduling, rendering, or some other layer? When there's a memory problem, heaps and virtual memory come to mind. When input or display misbehaves, this whole chain from keyboard to screen is there to think through.

Most of all, the machine won't feel as mysterious anymore. The hood has been opened once and the engine has been looked at. There's no magic inside — just electrical signals, logic, software, interfaces, and a lot of clever abstractions built by people.

Knowing that much is enough.

*Thank you for reading. Take care.*

---

## 09 — If you want to go deeper

This series was a bird's-eye view. Each topic is a world of its own. If one of the layers caught your interest, here's where to start. Most of these are free.

**Starting from the beginning**

- **Crash Course Computer Science** — a 40-episode YouTube series, 10-15 minutes each. Introduces a lot of computing ideas simply, from transistors to AI. A good overview to start with.
- **Ben Eater** — a YouTube channel. Built a complete 8-bit computer on breadboards with wires, explaining every step on camera.
- **Nand2Tetris** (nand2tetris.org) — starts with a single NAND gate and walks you up through a complete computer system and its software hierarchy. Lectures, project materials and tools are free on the official site; the Coursera version is a paid course.

**Hardware and CPUs**

- **Computer Systems: A Programmer's Perspective** — Bryant and O'Hallaron. Written from a programmer's perspective; the deep version of Articles 3, 4 and 5.
- **Computer Organization and Design** — Patterson and Hennessy. The classic computer architecture textbook.
- **Inside the Machine** — Jon Stokes. Explains modern processors with illustrations.

**Memory and performance**

- **What Every Programmer Should Know About Memory** — a long paper by Ulrich Drepper, freely available. The complete version of Article 5.
- **Latency Numbers Every Programmer Should Know** — a short table originally by Jeff Dean; a mental model for how long operations take.

**Operating systems**

- **Operating Systems: Three Easy Pieces** (ostep.org) — completely free. Every topic from Article 6 in full detail.
- **Linux Kernel Development** — Robert Love.

**Compilers and languages**

- **Crafting Interpreters** (craftinginterpreters.com) — free to read on the site; teaches by having you build two interpreters by hand.
- **V8 blog** (v8.dev/blog) — what happens inside a JavaScript engine, written by the engineers themselves.

**Learning by doing**

- **nandgame.com** — a browser game that walks you from a NAND gate up to a computer.
- **CS50** (Harvard) — available on YouTube and edX; the current CS50x materials are also available free as OpenCourseWare.

A confession, too — I haven't worked through every resource on this list myself. I went digging around the internet and collected everything related in one place, as much for my own use as for yours, so that any of us can come back later and explore further, understand things better, and patch the gaps in what we know.

One last thing — don't be overwhelmed by this list. You don't need to read all of it. Start with the one thing that made you curious. The rest will come when it comes.

**Hover terms used** (definitions live in `glossary.ts`): `hid`, `interrupt`, `rasterization`, `compositor`, `framebuffer`, `abstraction`
