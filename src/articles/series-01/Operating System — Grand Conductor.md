# অপারেটিং সিস্টেম: মহাব্যবস্থাপক

## এতগুলো program একসাথে চলে কীভাবে?

> *`[DIAGRAM · …]` blocks render through the `<Diagram>` primitive. `[WIDGET · …]` marks an interactive instrument, `[DEEPER · …]` a collapsible toggle. Hover definitions live only in `src/articles/glossary.ts`.*

আপনার laptop-এ এই মুহূর্তে কতগুলো program চলছে?

সহজে যা মনে পড়ে — browser, code editor, terminal, Spotify। কিন্তু task manager বা system monitor খুলে দেখলে দেখা যায়, এর বাইরেও অনেক process আর background task চলছে। System service, background sync, notification handler — সব।

কিন্তু laptop-এ কি ততগুলো CPU core আছে? না। হাতে গোনা কয়েকটা। আর প্রতিটা core একই সময়ে সীমিত সংখ্যক instruction stream চালাতে পারে।

তাহলে এতগুলো program একসাথে চলে কীভাবে?

মূল কৌশলের নাম **concurrency**। CPU খুব দ্রুত বিভিন্ন runnable কাজের মধ্যে সময় ভাগ করে দেয় — এত দ্রুত যে আপনার চোখে "একসাথে" মনে হয়। আর একাধিক core থাকলে কিছু কাজ সত্যিই একই সময়ে চলে।

এই ভাগাভাগির পুরো ব্যবস্থাপনা যে করে, সে আপনার laptop-এর সবচেয়ে গুরুত্বপূর্ণ software — **Operating System**। আর সে শুধু CPU ভাগ করে না। Memory, file, device, network access, permission — এসবও application-গুলোর মধ্যে managed আর isolated রাখে।

আজকের গল্প OS-কে ঘিরে।

> **// একটা কথা আগে বলে রাখি**
>
> এই সিরিজে এতদিন সব কথা ছিল hardware নিয়ে। Transistor, gate, CPU, register, cache, RAM। আজ প্রথম software-এর দুনিয়ায় পা রাখা।
>
> কিন্তু এই software সাধারণ কোনো app না। Operating System এমন একটা system software, যেটা hardware-এর resource পরিচালনা করে আর application-কে সেগুলো ব্যবহারের জন্য abstraction ও controlled access দেয়। Linux, Windows, macOS, Android, iOS — এদের implementation আলাদা, কিন্তু কাজের তালিকা মোটামুটি একই: process আর thread management, memory management, device management, filesystem, networking, protection।

আজকে যেসব প্রশ্নের উত্তর খুঁজব:

- অনেকগুলো program বা thread কীভাবে সীমিত CPU resource ভাগ করে নেয়?
- একটা program-এর memory অন্য program থেকে আলাদা থাকে কীভাবে?
- আপনার লেখা app hardware-এ সরাসরি access পায় না, তাহলে file বা network ব্যবহার করে কীভাবে?

---

## ০১ — Program আর Process এক জিনিস না

শুরুতেই একটা distinction পরিষ্কার করে নেওয়া দরকার। এই দুইটা শব্দ প্রায়ই মিশিয়ে ব্যবহার হয়, কিন্তু আসলে দুই জিনিস।

**Program** হলো instruction আর data-র একটা নিষ্ক্রিয় বর্ণনা — যেমন disk-এ পড়ে থাকা একটা executable file বা program image। এই মুহূর্তে সে কিছুই করছে না। শুধু বসে আছে।

**[HOVER: Process]** হলো সেই program-এর একটা *running instance* — চলতে থাকা কাজটা, আর তার জন্য যা যা state ও resource লাগে সেগুলো সহ।

সহজ কথায় — একটা recipe (program) আর সেই recipe দেখে করা রান্না (process) দুই জিনিস। একই recipe দিয়ে দশজন রাঁধুনি দশটা আলাদা রান্না করতে পারেন; ঠিক তেমনি একই program থেকে একাধিক process চলতে পারে।

তবে browser নিয়ে একটা সতর্কতা:

> **"একটা tab = একটা process" — এমন কোনো বাঁধা নিয়ম নেই।** Modern browser একাধিক ধরনের process ব্যবহার করে — browser/UI process, renderer process, GPU-related process। কোন page কোন process-এ বসবে, সেটা browser-এর architecture আর তার resource ও security policy-র ওপর নির্ভর করে।

---

## ০২ — একটা process-এর ভেতরে কী থাকে?

OS যখন একটা process তৈরি করে, তখন শুধু program-এর code memory-তে তুলে দেয় না। Process-এর সঙ্গে তার execution আর resource নিয়ে বেশ কিছু state জড়িয়ে থাকে:

**PID (Process ID):** Process-কে চিহ্নিত করার একটা identifier — যাতে OS বুঝতে পারে কোন process-এর কথা বলা হচ্ছে।

**Memory space:** Process-এর একটা virtual address space থাকে, যেখানে তার code, data, stack, heap আর অন্যান্য mapped region বসে। এই এলাকা কীভাবে "নিজস্ব" হয়, সেটা একটু পরের section-এর গল্প।

সেই address space-এর ভেতরে কয়েকটা গুরুত্বপূর্ণ অংশ:

**Code section:** Program-এর executable instruction-গুলো সাধারণত এখানে থাকে। সাধারণ protection-এর অধীনে এই অংশ read-only হিসেবে map করা হতে পারে, যাতে চলতি code সহজে নিজেকে পাল্টে ফেলতে না পারে।

**Data section:** Global আর static variable-এর মতো data এখানে থাকে। যেমন C-তে function-এর বাইরে declare করা `int counter = 0;` — এই ধরনের global variable এখানে বসে থাকে। Program যতক্ষণ চলবে, ততক্ষণ এই variable-ও থাকবে।

**Stack:** Function call-এর সময় parameter, local variable আর return information-এর জন্য জায়গা লাগে; সেটা আসে stack থেকে।

কল্পনা করুন একটা tray-তে একের পর এক কাগজ রাখছেন — সবশেষ কাগজটাই সবার ওপরে, সেটাই আগে সরাতে হবে। Function call-ও তেমনই: যে function সবশেষ call হয়েছে, সে-ই আগে শেষ হয়। এই "শেষে এসে আগে যায়" pattern-এর নামই stack।

**Heap:** Program চলার সময় dynamically allocate করা memory-র জন্য heap ব্যবহার হয়। C-তে `malloc()` করলে বা JavaScript runtime-এ `new Array(1000)` লিখলে memory আসে এখান থেকেই।

**File descriptors:** Process কোনো file, socket, pipe বা অন্য OS resource ব্যবহার করলে OS তাকে একটা handle দেয়। Unix-এর মতো system-এ সেই handle একটা ছোট integer — file descriptor। ওই নম্বর দেখিয়েই process বলে, "এই resource-টার সাথে কাজ করো।"

**Execution state:** এই process যখন CPU-তে চলছিল, তখন CPU-র register-এর মান, program counter — এই ধরনের execution state লাগে। কেন এটা track করে রাখতে হয়? কারণ context switch-এর সময় এই state সংরক্ষণ করে পরে আবার restore করা যায়। Context Switching নিয়ে আমরা একটু পরে জানবো।

> **Process হলো address space আর resource-এর একটা context; CPU-তে যে execution state save আর restore হয়, সেটা মূলত thread-এর সঙ্গে জড়িত।** এক process-এ একাধিক thread থাকলে address space এক, কিন্তু register state আর stack প্রত্যেকের নিজের।

এই সব তথ্য kernel তার নিজের data structure-এ track করে। Classic OS বইয়ে প্রতি process-এর এই record-টাকে বলা হয় **[HOVER: PCB]** (Process Control Block) — তবে বাস্তব kernel-এ এটা একটামাত্র literal "central table" হতেই হবে এমন নয়।

নিচের যন্ত্রে process-এর memory কীভাবে সাজানো থাকে, তার একটা conceptual ছবি:

**[WIDGET · ProcessAnatomy]**

একটা কথা মনে রাখবেন — এটা একটা conceptual layout। Exact বিন্যাস architecture, OS, executable format আর runtime-এর ওপর নির্ভর করে; "stack সবসময় নিচের দিকে নামে, heap উপরে ওঠে" কোনো universal physical নিয়ম নয়।

---

## ০৩ — এক CPU-তে অনেক কাজ: পালা-বদলের গল্প

এবার আসল প্রশ্ন। CPU core সীমিত, কিন্তু runnable process আর thread অনেকগুলো। তাহলে?

OS-এর scheduler ঠিক করে দেয় কোন runnable thread কোন core-এ কখন চলার সুযোগ পাবে। একটা thread কিছুক্ষণ চলে; তারপর হয় preemption-এর কারণে তাকে সরে যেতে হয়, নয়তো সে নিজেই অপেক্ষায় চলে যায় — যেমন কোনো I/O শেষ হওয়ার অপেক্ষায়।

এই execution context বদলে যাওয়ার ঘটনার নাম **context switch**।

কল্পনা করুন আপনি ৫টা আলাদা subject-এ homework করছেন — গণিত, বাংলা, ইংরেজি, বিজ্ঞান, সমাজ। একসাথে পাঁচটা খাতায় লেখা যায় না। তাই একটা করে করছেন। কিন্তু একটা ছেড়ে আরেকটায় যাওয়ার আগে কয়েকটা কাজ করতে হয়:

- এখন যে subject-এ আছেন, সেটার page কোথায় ছিল তা bookmark দিয়ে রাখা।
- কোন চিন্তা কোথায় ছিল, রাফখাতায় টুকে রাখা।
- বই বন্ধ করা।
- পরের subject-এর বই বের করা।
- আগেরবার যে page-এ থেমেছিলেন সেখানে ফেরত যাওয়া।
- কোথায় কী ভাবছিলেন, মনে করা।

তারপরই কাজ শুরু করা যায়।

CPU-তেও ধারণাটা একই:

**[DIAGRAM · context switch]**

```text
current thread's execution state
              ↓
            saved
              ↓
other thread's saved state
              ↓
           restored
              ↓
       execution resumes
```

Save করা state-এর মধ্যে থাকে register-এর মান, program counter — এই ধরনের execution information। পরে সেই state আবার restore করলে কাজটা মোটামুটি যেখানে থেমেছিল সেখান থেকেই এগোতে পারে।

> **Context switch মানেই পুরো process বদলে যাওয়া নয়** — একই process-এর দুইটা thread-এর মধ্যেও context switch হতে পারে।

CPU নিজে ঠিক করে না এখন কোন application "গুরুত্বপূর্ণ"। সে শুধু তার সামনে থাকা instruction চালিয়ে যায়। OS-এর scheduler runnable কাজের তথ্য আর নিজের policy দেখে পরেরজনকে বেছে নেয়। নিচে এক ধাপ এক ধাপ করে switch-টা ঘটিয়ে দেখুন:

**[WIDGET · ContextSwitch]**

এই পালা-বদলের একটা দাম আছে। প্রতিবার save আর restore-এ কিছু সময় যায় — অর্থাৎ switch যত ঘনঘন হবে, CPU-র কিছুটা সময় ততই bookkeeping-এ খরচ হবে। তাই OS-কে একটা balance খুঁজতে হয়: এত ঘনঘন নয় যে overhead-ই বড় হয়ে ওঠে, আবার এত কম নয় যে user "hang" টের পায়।

---

## ০৪ — Scheduling: কার পালা এখন?

আরেকটা প্রশ্ন। যদি একই সময়ে অনেকগুলো thread runnable থাকে, OS কীভাবে ঠিক করে পরের বার CPU কে পাবে?

এই সিদ্ধান্ত নেওয়ার নাম **scheduling**, আর যে নেয় তার নাম **scheduler**।

Scheduler-কে একসাথে কয়েকটা জিনিস সামলাতে হয় — সবাই যেন fair chance পায়, জরুরি কাজ যেন সময়মতো হয়, system যেন responsive থাকে। এই তিনটা একসাথে মেলানো কঠিন, তাই ইতিহাসে আর বিভিন্ন system-এ নানা algorithm ব্যবহার হয়েছে:

- **Round-Robin:** runnable কাজগুলোকে পালা করে সময় দাও। ক্লাসে teacher যেমন সবাইকে পালা করে বলার সুযোগ দেন। সরল আর fair — কিন্তু এখানে কোন কাজটা বেশি জরুরি, সেই পার্থক্য ধরা পড়ে না।
- **Priority-based:** কিছু কাজকে বেশি priority দেওয়া যায়, যাতে তারা আগে CPU পায়। এখানে ঝুঁকি একটাই — কোনো low-priority কাজ দীর্ঘ সময় CPU না-ও পেতে পারে। একে বলে **starvation**।
- **Fair-share scheduling:** যে এখন পর্যন্ত সবচেয়ে কম CPU time পেয়েছে, পরের সুযোগটা তার। Linux বহু বছর এই ধারায় **CFS (Completely Fair Scheduler)** ব্যবহার করেছে; kernel 6.6 থেকে সেই জায়গায় এসেছে **EEVDF**, যেটা virtual runtime-এর পাশাপাশি deadline-ও হিসাব করে — যাতে latency-sensitive কাজ শুধু fairly নয়, সময়মতোও চলে।

সব algorithm-এর ভেতরের হিসাব জানার দরকার নেই। এতটুকু মনে রাখলেই চলবে:

> **Scheduler হলো OS-এর সেই রেফারি, যে ঠিক করে runnable কাজগুলোর মধ্যে CPU time কীভাবে বণ্টন হবে।**



**[WIDGET · Scheduler]** — round-robin / priority / fair-share।

## ০৫ — Virtual Memory: প্রতিটা process-এর নিজস্ব address space

Multitasking-এর আরেকটা বড় সমস্যা — memory isolation।

আপনার laptop-এ এখন Chrome, VS Code, Spotify — সবাই একই physical RAM ব্যবহার করছে। একটা program যেন ইচ্ছামতো আরেকটার private memory পড়তে বা লিখতে না পারে, সেটা নিশ্চিত হয় কীভাবে?

এখানেই আসে **virtual memory**। সহজ কথায়: প্রতিটা process পায় নিজের একটা আলাদা **virtual address space**।

Program যখন কোনো memory address ব্যবহার করে, সেটাকে সরাসরি physical RAM-এর ঘর ভাবার দরকার নেই। সেটা একটা virtual address। Hardware-এর MMU (Memory Management Unit) আর OS-এর তৈরি mapping information মিলে সেই virtual address-কে corresponding physical location-এর সঙ্গে মিলিয়ে দেয়।

**[DIAGRAM · address mapping]**

```text
Process A
virtual address 100
        ↓
physical location X

Process B
virtual address 100
        ↓
physical location Y
```

দুই process একই virtual address number ব্যবহার করতে পারে, কিন্তু তাদের address space আলাদা বলে physical mapping আলাদা হয়। কেউ কারো এলাকায় ঢুকছে না।

এই mapping-এর তথ্য **page table**-এর মতো data structure-এ থাকে, আর MMU সেটা ব্যবহার করে translation সেরে ফেলে। নিচে দুই process টগল করে দেখুন একই virtual address কীভাবে ভিন্ন জায়গায় যায়:

**[WIDGET · MMUTranslator]**

### Isolation

একটা সাধারণ user process নিজের অনুমোদিত virtual memory-র বাইরে গিয়ে অন্য process-এর private memory সরাসরি পড়তে বা লিখতে পারে না। আধুনিক system security-র একটা বড় ভিত্তি এটাই।

এটাকে এভাবে ভাবতে পারেন — একই শহরে ৫০ জন থাকছে, কিন্তু প্রত্যেকের হাতে আলাদা মানচিত্র। কারো মানচিত্রে অন্যের ঘরের রাস্তাটা আঁকাই নেই।

### Virtual memory আর swap এক জিনিস না

এই পার্থক্যটা জরুরি।

**Virtual memory** হলো address space abstraction, protection আর virtual-to-physical mapping-এর পুরো ব্যবস্থাটা।

**Swap** হলো সেই ব্যবস্থার ভেতরের একটা mechanism, যেখানে memory-র কিছু content RAM থেকে সরিয়ে secondary storage-এ রাখা হতে পারে, যাতে RAM অন্য কাজে লাগে। সেই page পরে আবার দরকার হলে storage থেকে ফিরিয়ে আনতে হয় — আর তখন **[HOVER: page fault]**-এর মধ্য দিয়ে সেই কাজটা হয়।

**[DIAGRAM · virtual memory vs swap]**

```text
Virtual Memory
├── address space abstraction
├── protection / isolation
├── virtual → physical mapping
└── other mechanisms

Swap
└── one mechanism: move memory contents
    out to secondary storage
```

তাই virtual memory-কে শুধু "RAM-এর চেয়ে বেশি memory পাওয়ার কৌশল" ভাবা ঠিক নয়। Swap ছাড়াও virtual memory থাকে।

আর একটা কথা — program physical location জানে না ঠিকই, কিন্তু swap হলে সে টের পায় না তা নয়। Performance-এ সেটা স্পষ্ট ধরা পড়ে।

> **Physical RAM সবাই মিলে ভাগ করে, কিন্তু প্রতিটা process দেখে নিজের আলাদা virtual address space।**

---

## ০৬ — Kernel Mode আর User Mode: দুই স্তরের দরজা

আরেকটা fundamental separation আছে — এবার privilege আর security-র দিক থেকে।

Windows-এ Admin account আর regular user account-এর পার্থক্যটা মনে করুন। Admin সব করতে পারে — settings বদলানো, software install, system file edit। Regular user restricted — নিজের কাজ করতে পারে, কিন্তু system ভাঙতে পারে না।

CPU-র execution-কেও একটা simplified model হিসেবে দুই ধরনের privilege level-এ ভাবা যায়:

**Kernel Mode:** এখানে চলা kernel code privileged operation করতে পারে — memory-management configuration, কিছু hardware-related control, এই ধরনের কাজ।

**User Mode:** সাধারণ application এই restricted mode-এ চলে। privileged operation তারা সরাসরি করতে পারে না — আপনার browser, editor, game, সবাই এখানেই।

বাস্তব CPU architecture-এ privilege mechanism-এর implementation ভিন্ন হতে পারে; কোথাও দুইয়ের বেশি level-ও থাকে। এই article-এর জন্য মূল কথাটা এইটুকু:

> **Application code আর trusted OS code একই privilege level-এ চলে না।**

কোনো application যদি এমন কিছু করতে যায় যার অনুমতি তার নেই, CPU সেটা নিঃশব্দে হতে দেয় না — একটা exception বা trap ঘটে, আর নিয়ন্ত্রণ চলে যায় kernel-এর হাতে। এরপর কী হবে (process terminate, signal, error return) সেটা OS ঠিক করে।

কেন এই বিভাজন? সহজ কারণ — প্রতিটা app যদি যা খুশি করতে পারত, একটা খারাপ app পুরো system-এ ছড়িয়ে পড়তে পারত।

কিন্তু app-এর তো file পড়তে হবে, network ব্যবহার করতে হবে, নতুন process বানাতে হবে। তাহলে সে করে কীভাবে? OS-এর কাছে অনুরোধ করে — আর সেই অনুরোধের রাস্তার নাম system call।

---

## ০৭ — System Call: OS-এর কাছে অনুরোধের দরজা

**[HOVER: System call]** হলো user mode-এ থাকা application আর kernel-এর মধ্যে একটা controlled interface। Application নিজে privileged কাজটা না করে OS-কে বলে — "আমার হয়ে এই কাজটা করে দাও।"

C-তে একটা সহজ উদাহরণ:

```c
#include <fcntl.h>
#include <unistd.h>

int main() {
  int fd = open("file.txt", O_RDONLY);  // library wrapper → syscall
  char buffer[100];
  read(fd, buffer, 100);                // library wrapper → syscall
  close(fd);                            // library wrapper → syscall
  return 0;
}
```

একটা সূক্ষ্ম কিন্তু গুরুত্বপূর্ণ কথা: `open()`, `read()`, `close()` নিজেরা system call নয় — এরা library/API function। Linux-এ C library-র এই wrapper-গুলো প্রয়োজন হলে kernel-এর system call interface ব্যবহার করে। x86-64 Linux-এ সেই কাজটা হয় `syscall` instruction দিয়ে, যা user mode থেকে kernel-এর নির্ধারিত entry point-এ নিয়ে যায়।

**[DIAGRAM · request path]**

```text
Application
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
Application
```

পুরো ব্যাপারটা সংক্ষেপে:

1. Application system call-এর argument গুলো নির্দিষ্ট জায়গায় প্রস্তুত করে।
2. System call mechanism ব্যবহার করে kernel-এ entry নেওয়া হয়।
3. CPU privilege transition করে kernel-এর নির্দিষ্ট entry point-এ যায়।
4. Kernel অনুরোধটা যাচাই করে আর কাজটা করে।
5. Result বা error information ফেরত বসানো হয়।
6. Execution আবার user mode-এ ফিরে আসে।

OS-এর প্রায় সব service-এর জন্যই এমন system call আছে:

- **File:** `open()`, `read()`, `write()`, `close()`
- **Network:** `socket()`, `send()`, `recv()`
- **Process:** `fork()` (নতুন process), `exit()` (শেষ করা)
- **Memory:** `mmap()` (address space-এ region map করা)

> **প্রতিটা high-level function call কিন্তু system call নয়।** অনেক library function পুরো কাজটাই user space-এ সেরে ফেলতে পারে; দরকার হলে তবেই kernel-এ যায়।

এই kernel transition-এর একটা overhead আছে। তাই performance-sensitive code অপ্রয়োজনে বারবার kernel-এ যাওয়া এড়ায়। নিচের যন্ত্রে দরজাটা এক ধাপ এক ধাপে পার হয়ে দেখুন:

**[WIDGET · SyscallDoorway]**

---

## ০৮ — Thread: এক process-এর ভেতরে অনেক execution path

এতক্ষণ process-এর কথা বললাম। এবার thread।

একটা process-এর ভেতরে একাধিক **[HOVER: thread]** থাকতে পারে। তারা একই process-এর virtual address space আর অনেক process-level resource share করে, কিন্তু প্রত্যেকের নিজের stack আর নিজের execution state থাকে।

Process যদি একটা কারখানা হয়, thread হলো সেই কারখানার শ্রমিক। এক কারখানায় অনেক শ্রমিক একসাথে কাজ করে, একই মেশিন আর একই কাঁচামাল ব্যবহার করে — কিন্তু প্রত্যেকের নিজের কাজের ধারা আছে।

**[DIAGRAM · inside a process]**

```text
Process
├── Thread A → own stack + execution state
├── Thread B → own stack + execution state
└── Thread C → own stack + execution state

shared between them:
virtual address space
files and other process resources
```

একই process-এর দুইটা thread একই memory access করতে পারে — এতে data ভাগাভাগি সহজ হয়, আবার coordination-এর দায়িত্বও এসে পড়ে। কে কখন কী লিখছে সেটা ঠিকঠাক না সামলালে ফল অনিশ্চিত হয়ে যেতে পারে।

### Concurrency ≠ parallelism

**Concurrency** মানে একাধিক কাজের অগ্রগতি overlap করা। **Parallelism** মানে একাধিক কাজ সত্যিই একই সময়ে আলাদা core-এ চলা। Single-core CPU-তেও concurrency সম্ভব; একাধিক core থাকলে কিছু thread সত্যিই parallel-এ চলতে পারে।

| দিক | Process | Thread |
| --- | --- | --- |
| Address space | সাধারণত আলাদা | process-এর মধ্যে share করে |
| Execution state | process context | নিজের register state আর stack |
| Resource sharing | বেশি isolated | বেশি shared |
| Context switch | বেশি state জড়িত | একই process হলে কিছু state shared |
| Crash হলে | অন্য process সাধারণত বেঁচে থাকে | fatal হলে পুরো process যেতে পারে |

বাস্তব software-এ process আর thread — দুটোই একসাথে ব্যবহার হয়। যেমন একটা modern browser একাধিক process ব্যবহার করে (UI, renderer, GPU), আর সেই process-গুলোর ভেতরেও একাধিক thread চলে।

---

## ০৯ — পুরো ছবিটা একবার: keyboard-এর 'A' screen-এ যাওয়ার গল্প

এবার সব একসাথে। ধরুন আপনি keyboard-এ 'A' চাপলেন।

নিচের পথটা একটা simplified conceptual model — ভিন্ন operating system, input stack, window system আর graphics architecture-এ আসল ধাপগুলো আলাদা হতে পারে।

**[DIAGRAM · conceptual path]**

```text
Keyboard
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
display
```

ধাপে ধাপে ধারণাটা:

1. Keyboard hardware থেকে input-এর signal বা data তৈরি হয়।
2. Hardware-এর মাধ্যমে CPU-কে জানানো হয় যে input এসেছে।
3. OS-এর privileged code আর device driver সেই input process করে।
4. Input subsystem সেটাকে একটা higher-level input event হিসেবে প্রকাশ করে।
5. Window system বা application সেই event পায়।
6. Application নিজের state update করে — যেমন text field-এ 'A' যোগ করা।
7. UI আবার render করতে হয়।
8. Rendering আর display pipeline-এর মধ্য দিয়ে পরিবর্তনটা শেষ পর্যন্ত screen-এ পৌঁছায়।

নিচের যন্ত্রে step চেপে পুরো relay-টা দেখুন:

**[WIDGET · KeypressRelay]**

শুধু একটা keypress-এর জন্য এতগুলো ধাপ, কয়েকটা privilege transition, কয়েকটা component-এর হাতবদল। আর মাঝখানে OS scheduling, protection, device access আর এই সব component-এর মধ্যে coordination সামলাচ্ছে।

এই কারণেই OS-কে "Grand Conductor" বলা — hardware আর application-এর মাঝখানে বসে পুরো orchestra-টা চালানো।

> তবে মনে রাখবেন — **এটা একটা conceptual flow, কোনো নির্দিষ্ট OS-এর exact instruction-by-instruction sequence নয়।** বাস্তবে interrupt handling, driver, event queue, window system, rendering আর GPU pipeline অনেক বেশি জটিল।

---

## এই আর্টিকেলে কী শিখলাম

- **Program আর process এক জিনিস না।** Program হলো instruction আর data-র নিষ্ক্রিয় বর্ণনা; process হলো তার একটা running execution context।
- **অনেক runnable thread সীমিত CPU resource ভাগ করে নেয়।** Scheduler ঠিক করে কে কখন CPU time পাবে।
- **Context switch-এ execution state save আর restore হয়** — একই process-এর দুই thread-এর মধ্যেও সেটা ঘটতে পারে।
- **Virtual memory প্রতিটা process-কে আলাদা virtual address space দেয়।** Hardware আর OS-এর mapping ও protection mechanism মিলে physical memory access নিয়ন্ত্রণ করে — আর virtual memory মানেই swap নয়।
- **Kernel mode আর user mode privilege আলাদা রাখে।** সাধারণ application privileged operation সরাসরি করতে পারে না; চেষ্টা করলে trap হয়।
- **System call হলো kernel service ব্যবহারের controlled interface** — তবে প্রতিটা library function call system call নয়।
- **Thread হলো process-এর ভেতরের আলাদা execution path।** Memory আর resource shared, কিন্তু stack আর execution state যার যার নিজের।

---

## পরের article-এ: কোড থেকে মেশিন কোড

Hardware দেখা হলো। OS দেখা হলো। কিন্তু আপনি যে code লেখেন — JavaScript, Python, Go, C — সেটা তো CPU-র নিজের ভাষা না। CPU শেষ পর্যন্ত machine instruction চালায়; সেগুলো memory-তে থাকে binary bit pattern হিসেবে, আর আমরা মানুষ সুবিধার জন্য সেগুলোকে প্রায়ই hexadecimal-এ লিখি। তাহলে আপনার লেখা text file কীভাবে সেই machine instruction হয়ে ওঠে? কখন compiler লাগে, interpreter কী করে, আর JavaScript-এর মতো ভাষায় JIT কোথায় এসে দাঁড়ায়? সেই গল্প পরের আর্টিকেলে।

**[পরের article: ০৭ — কোড থেকে মেশিন কোড]**

**Hover terms used** (definitions live in `glossary.ts`): `process`, `pcb`, `contextswitch`, `scheduler`, `virtualmem`, `pagefault`, `syscall`, `thread`, `concurrency`

---
---

# Operating System — The Grand Conductor

## How do this many programs run at once?

> *Blocks marked `[DIAGRAM · …]` render through the `<Diagram>` primitive. `[WIDGET · …]` marks an interactive instrument, `[DEEPER · …]` a collapsible toggle. Hover definitions live only in `src/articles/glossary.ts`.*

How many programs are running on your laptop right now?

The easy answer — browser, code editor, terminal, Spotify. But open a task manager or system monitor and you'll find many more processes and background tasks. System services, background sync, notification handlers — all of it.

But does your laptop have that many CPU cores? No. It has a handful. And each core can run only a limited number of instruction streams at any one moment.

So how do all these programs run at the same time?

The main trick is **concurrency**. The CPU divides its time among the runnable work, switching fast enough that it feels simultaneous to you. And with several cores, some of that work really does happen at the same time.

Managing all that sharing is the job of the most important software on your laptop — the **Operating System**. And it shares far more than the CPU: memory, files, devices, network access, permissions, all kept managed and isolated between applications.

That's today's story.

> **// the first software**
>
> Everything so far in this series has been about hardware. Transistors, gates, CPU, registers, cache, RAM. Today we step into the world of software for the first time.
>
> But this isn't ordinary software. An operating system is system software that manages the hardware's resources and gives applications an abstraction over them, plus controlled access to them. Linux, Windows, macOS, Android, iOS — the implementations differ, but the job list is broadly the same: process and thread management, memory management, device management, filesystems, networking, protection.

Today's questions:

- How do many programs and threads share a limited amount of CPU?
- How does one program's memory stay separate from another's?
- Why can't your app touch hardware directly, and how does it use files and the network then?

---

## 01 — Program vs Process — not the same thing

The distinction matters up front. These two words often get mixed up, but they mean different things.

A **program** is a passive description of instructions and data — an executable file or program image sitting on disk, say. Right now, it isn't doing anything. Just sitting there.

A **[HOVER: process]** is a *running instance* of that program — the work actually in progress, along with the state and resources it needs to keep going.

Simply put: a recipe (program) and someone actually cooking with it (process) are two different things. Ten cooks can make ten different meals from the same recipe; likewise, many processes can run from the same program.

One caution about browsers, though:

> **There's no fixed rule that one tab equals one process.** Modern browsers run several kinds of process — a browser/UI process, renderer processes, GPU-related processes. Which page ends up in which process depends on the browser's architecture and its resource and security policies.

---

## 02 — What lives inside a process?

When the OS creates a process, it doesn't just load the program's code into memory. A process carries a good deal of state about its execution and its resources.

**PID (Process ID):** an identifier for the process — so the OS knows which one is being talked about.

**Memory space:** a process has a virtual address space holding its code, data, stack, heap and other mapped regions. How that area becomes "its own" is the next section's story.

Inside that address space, a few important parts:

**Code section:** the program's executable instructions usually live here. Under normal protection this region may be mapped read-only, so running code can't casually rewrite itself.

**Data section:** globals and statics live here — something like `int counter = 0;` declared outside any function in C. Their lifetime is generally tied to the whole program execution.

**Stack:** function calls need room for parameters, local variables and return information; that comes from the stack.

Picture stacking papers into a tray, one after another — the last paper on top is the first one you take out. Function calls work the same way: the one called last finishes first. That "last-in, first-out" pattern is where the stack gets its name.

**Heap:** memory allocated dynamically while the program runs comes from the heap. `malloc()` in C, or `new Array(1000)` in a JavaScript runtime — that memory comes from here.

**File descriptors:** when a process uses a file, socket, pipe or other OS resource, the OS hands it a handle. On Unix-like systems that handle is a small integer — a file descriptor. The process shows that number to say "work with this resource."

**Execution state:** running the work on a CPU needs execution state — register values, the program counter. On a context switch this state can be saved and later restored.

> **A process is a context of address space and resources; the execution state saved and restored on the CPU belongs mainly to a thread.** Several threads in one process share the address space, but each has its own registers and stack.

The kernel tracks all of this in its own data structures. Classic OS textbooks call the per-process record a **[HOVER: PCB]** (Process Control Block) — though a real kernel needn't keep it all in one literal "central table."

The instrument below shows a conceptual picture of how a process's memory is laid out:

**[WIDGET · ProcessAnatomy]**

Keep in mind that this is a conceptual layout. The exact arrangement depends on the architecture, the OS, the executable format and the runtime; "the stack always grows down and the heap grows up" is not a universal physical law.

---

## 03 — Many tasks on one CPU: the turn-taking story

Now the real question. CPU cores are limited, but runnable processes and threads are many. So?

The OS's scheduler decides which runnable thread gets time on which core, and when. A thread runs for a while; then either preemption moves it aside, or it steps aside on its own — waiting for some I/O to finish, say.

That changing of the execution context is called a **[HOVER: context switch]**.

Imagine you're doing homework in 5 different subjects — math, Bangla, English, science, social studies. You can't write in five notebooks at once. So you do one at a time. But before switching from one to another, a few things have to happen:

- Bookmark the page in the current subject.
- Jot down whatever you were thinking about in a scratch pad.
- Close the book.
- Open the next subject's book.
- Go to the page where you last left off.
- Recall what you were thinking about last time.

Only then does work resume.

The idea on a CPU is the same:

**[DIAGRAM · context switch]**

```text
current thread's execution state
              ↓
            saved
              ↓
other thread's saved state
              ↓
           restored
              ↓
       execution resumes
```

The saved state holds execution information such as register values and the program counter. Restore it later and the work can pick up roughly where it left off.

> **A context switch doesn't necessarily mean a whole new process** — two threads of the same process can switch between each other too.

The CPU itself doesn't decide which application matters right now. It just executes whatever is in front of it. The OS scheduler picks the next one using what it knows about the runnable work and its own policy. Step through one switch below:

**[WIDGET · ContextSwitch]**

This turn-taking has a cost. Every save and restore takes time — the more frequent the switches, the more CPU time goes into bookkeeping rather than work. So the OS has to find a balance: not so frequent that the overhead dominates, not so rare that users notice a "hang".

---

## 04 — Scheduling: whose turn is it now?

Another question. If many threads are runnable at once, how does the OS decide who goes next?

That decision is **[HOVER: scheduling]**, and the part of the OS that makes it is the **scheduler**.

A scheduler has to juggle several things at once — everyone gets a fair chance, urgent work happens in time, the system stays responsive. Satisfying all three together is hard, so many algorithms have been used over the years and across systems:

- **Round-Robin:** give the runnable tasks time in turn, like a teacher letting every student speak in order. Simple and fair — but it can't tell which work is more urgent.
- **Priority-based:** some tasks get higher priority so they reach the CPU sooner. The risk here is that a low-priority task may go a long time without any CPU at all — that's **starvation**.
- **Fair-share scheduling:** whoever has had the least CPU time so far goes next. Linux followed this line for years with **CFS (the Completely Fair Scheduler)**; since kernel 6.6 its place has been taken by **EEVDF**, which tracks virtual deadlines alongside virtual runtime — so latency-sensitive work runs not just fairly, but on time.

You don't need the internal math of any of these. This much is enough:

> **The scheduler is the OS's referee, deciding how CPU time gets divided among the runnable work.**

Run all three policies below — watch who keeps getting the CPU, and who starves:

**[WIDGET · Scheduler]** — round-robin / priority / fair-share.

## 05 — Virtual memory: every process gets its own address space

Another big problem in multitasking — memory isolation.

Chrome, VS Code and Spotify on your laptop are all using the same physical RAM. How do you make sure one program can't freely read or write another's private memory?

This is where **[HOVER: virtual memory]** comes in. Put simply: each process gets its own separate **virtual address space**.

When a program uses a memory address, that address needn't be thought of as a slot in physical RAM. It's a virtual address. The hardware's MMU (Memory Management Unit), together with mapping information the OS sets up, connects it to a corresponding physical location.

**[DIAGRAM · address mapping]**

```text
Process A
virtual address 100
        ↓
physical location X

Process B
virtual address 100
        ↓
physical location Y
```

Two processes can use the same virtual address number, but because their address spaces are separate, the physical mappings differ. Neither is stepping into the other's territory.

That mapping information lives in structures such as **page tables**, which the MMU uses to perform the translation. Toggle between two processes below and watch the same virtual address land in different places:

**[WIDGET · MMUTranslator]**

### Isolation

An ordinary user process cannot reach outside its own permitted virtual memory to read or write another process's private memory directly. That is one of the foundations of modern system security.

Think of it this way — fifty people live in the same city, but each holds a different map. Nobody's map has a road drawn to anyone else's room.

### Virtual memory is not swap

This distinction matters.

**Virtual memory** is the whole arrangement: the address space abstraction, protection, and virtual-to-physical mapping.

**Swap** is one mechanism inside that arrangement, where some memory contents may be moved out of RAM to secondary storage so the RAM can be used for something else. If that page is needed again it has to come back — which is what a **[HOVER: page fault]** sorts out.

**[DIAGRAM · virtual memory vs swap]**

```text
Virtual Memory
├── address space abstraction
├── protection / isolation
├── virtual → physical mapping
└── other mechanisms

Swap
└── one mechanism: move memory contents
    out to secondary storage
```

So virtual memory isn't just "a trick for having more memory than you have RAM." Virtual memory exists with or without swap.

And one more thing — a program doesn't know its physical location, but that doesn't mean swapping goes unnoticed. It shows up clearly in performance.

> **Physical RAM is shared by everyone, but every process sees its own separate virtual address space.**

---

## 06 — Kernel mode and user mode: two levels of doors

Another fundamental separation — this time about privilege and security.

Recall the difference between an Admin account and a regular user account on Windows. Admin can do everything — change settings, install software, edit system files. A regular user is restricted: they can do their own work, but can't break the system.

As a simplified model, CPU execution can be thought of in two privilege levels:

**Kernel Mode:** kernel code running here can perform privileged operations — memory-management configuration, certain hardware-related control, that sort of thing.

**User Mode:** ordinary applications run in this restricted mode and cannot perform privileged operations directly — your browser, editor, games, all of them live here.

Real CPU architectures implement privilege differently, and some have more than two levels. For this article, the core idea is enough:

> **Application code and trusted OS code do not run at the same privilege level.**

If an application attempts something it isn't allowed to do, the CPU doesn't quietly let it through — an exception or trap occurs and control passes to the kernel. What happens next (terminate the process, deliver a signal, return an error) is the OS's decision.

Why the split? Simple reason — if every app could do anything, one bad app could spread through the whole system.

But apps do need to read files, use the network, create processes. So how? They ask the OS — and the road that request travels is the system call.

---

## 07 — System call: the door for asking the OS

A **[HOVER: system call]** is a controlled interface between a user-mode application and the kernel. Instead of performing the privileged work itself, the application says — "please do this for me."

A simple example in C:

```c
#include <fcntl.h>
#include <unistd.h>

int main() {
  int fd = open("file.txt", O_RDONLY);  // library wrapper → syscall
  char buffer[100];
  read(fd, buffer, 100);                // library wrapper → syscall
  close(fd);                            // library wrapper → syscall
  return 0;
}
```

A subtle but important point: `open()`, `read()` and `close()` are not themselves system calls — they're library/API functions. On Linux these C library wrappers use the kernel's system call interface when they need to. On x86-64 Linux that happens through the `syscall` instruction, which moves execution from user mode to a defined kernel entry point.

**[DIAGRAM · request path]**

```text
Application
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
Application
```

The sequence, in short:

1. The application prepares the system call's arguments in the expected places.
2. The system call mechanism is used to enter the kernel.
3. The CPU performs a privilege transition into a defined kernel entry point.
4. The kernel validates the request and does the work.
5. A result or error is placed back for the caller.
6. Execution returns to user mode.

Nearly every OS service has system calls behind it:

- **Files:** `open()`, `read()`, `write()`, `close()`
- **Network:** `socket()`, `send()`, `recv()`
- **Processes:** `fork()` (a new process), `exit()` (end one)
- **Memory:** `mmap()` (map a region into the address space)

> **Not every high-level function call is a system call.** Plenty of library functions finish their work entirely in user space, and only enter the kernel when they actually have to.

That kernel transition carries overhead, so performance-sensitive code avoids crossing into the kernel more often than it needs to. Step through the doorway on the instrument below:

**[WIDGET · SyscallDoorway]**

---

## 08 — Threads: many execution paths inside one process

We've been talking about processes. Now threads.

A process can contain several **[HOVER: threads]**. They share the process's virtual address space and many of its resources, but each has its own stack and its own execution state.

If a process is a factory, a thread is one of its workers. Many workers can be at it at once, sharing the same machines and the same raw materials — but each follows its own line of work.

**[DIAGRAM · inside a process]**

```text
Process
├── Thread A → own stack + execution state
├── Thread B → own stack + execution state
└── Thread C → own stack + execution state

shared between them:
virtual address space
files and other process resources
```

Two threads in one process can reach the same memory — which makes sharing data easy, and makes coordination your problem. Get the "who writes what, when" wrong and the outcome stops being predictable.

### Concurrency ≠ parallelism

**[HOVER: Concurrency]** means the progress of several tasks overlaps. **Parallelism** means several tasks genuinely execute at the same instant on different cores. Concurrency is possible even on a single-core CPU; with several cores, some threads really do run in parallel.

| Aspect | Process | Thread |
| --- | --- | --- |
| Address space | usually separate | shared within the process |
| Execution state | process context | own register state and stack |
| Resource sharing | more isolated | more shared |
| Context switch | more state involved | some state shared within a process |
| Crash impact | other processes usually survive | a fatal one can take the process down |

Real software uses both together. A modern browser, for instance, runs several processes (UI, renderers, GPU) — and inside those processes, several threads.

---

## 09 — The whole picture: 'A' from keyboard to screen

Let's pull it all together. You press 'A' on your keyboard.

The path below is a simplified conceptual model — the actual steps differ across operating systems, input stacks, window systems and graphics architectures.

**[DIAGRAM · conceptual path]**

```text
Keyboard
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
display
```

Step by step, the idea:

1. The keyboard hardware produces a signal or data for the input.
2. Through the hardware, the CPU is notified that input has arrived.
3. The OS's privileged code and a device driver process that input.
4. The input subsystem turns it into a higher-level input event.
5. The window system or application receives that event.
6. The application updates its own state — adding 'A' to a text field, say.
7. The UI has to be rendered again.
8. Through the rendering and display pipeline, the change finally reaches the screen.

Step through the whole relay on the instrument below:

**[WIDGET · KeypressRelay]**

For one keypress: that many stages, several privilege transitions, several components handing work to each other. And through it all the OS is handling scheduling, protection, device access, and the coordination between those components.

Which is why the OS gets called the "Grand Conductor" — sitting between hardware and applications, running the whole orchestra.

> But keep in mind — **this is a conceptual flow, not any particular OS's exact instruction-by-instruction sequence.** In real systems the interrupt handling, drivers, event queues, window systems, rendering and GPU pipelines are far more complex.

---

## What this article covered

- **A program and a process aren't the same thing.** A program is a passive description of instructions and data; a process is a running execution context for it.
- **Many runnable threads share a limited amount of CPU.** The scheduler decides who gets CPU time and when.
- **A context switch saves and restores execution state** — and it can happen between two threads of the same process.
- **Virtual memory gives each process its own virtual address space.** Hardware and OS mapping and protection control physical memory access — and virtual memory is not the same thing as swap.
- **Kernel mode and user mode keep privilege separate.** Ordinary applications can't perform privileged operations directly; attempting one traps.
- **A system call is the controlled interface to kernel services** — though not every library function call is one.
- **Threads are separate execution paths inside a process.** Memory and resources are shared; the stack and execution state are each thread's own.

---

## Next article: From Code to Machine Code

Hardware — done. OS — done. But the code you write — JavaScript, Python, Go, C — isn't the CPU's own language. The CPU ultimately executes machine instructions; those sit in memory as binary bit patterns, and we humans just tend to write them out in hexadecimal for convenience. So how does the text file you write become those machine instructions? When is a compiler involved, what does an interpreter do, and where does JIT fit in for a language like JavaScript? That's the next article.

**[Next: 07 — From Code to Machine Code]**

**Hover terms used** (definitions live in `glossary.ts`): `process`, `pcb`, `contextswitch`, `scheduler`, `virtualmem`, `pagefault`, `syscall`, `thread`, `concurrency`
