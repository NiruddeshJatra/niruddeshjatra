import { Link } from "react-router-dom";

const SectionHeader = ({ label }: { label: string }) => (
  <div className="text-phosphor-dim text-sm mt-10 mb-3 font-mono">// {label}</div>
);

const HScrollTable = ({ children, className = "my-6" }: { children: React.ReactNode; className?: string }) => (
  <>
    <div className="sm:hidden text-[10px] text-phosphor-dim font-mono mb-2 pl-2">← swipe to scroll →</div>
    <div className={`${className} overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0`}>
      <div className="font-mono text-xs min-w-[640px] sm:min-w-0">
        {children}
      </div>
    </div>
  </>
);

type RaceEntry = {
  date: string;
  dist: string;
  event: string;
  time: string;
  note?: string;
  flag?: boolean;
  skip?: boolean;
};

const races: RaceEntry[] = [
  {
    date: "2023-01-20", dist: "21.1K", event: "Bangabandhu International Marathon", time: "2h 07m",
    note: "got to the race point 5 minutes late, still managed\na better-than-expected time. nobody knew i was running.",
  },
  {
    date: "2023-02-23", dist: "25K", event: "Run Bangladesh CU", time: "2h 53m",
    note: "misty winter morning. ran the first 30 minutes chatting\nwith a foreign participant. cramped a few times.\nmy father came to watch.",
  },
  {
    date: "2023-03-17", dist: "21.1K", event: "Rajshahi Half Marathon", time: "2h 04m",
    note: "first time in rajshahi. saw the padma. my father ran\na 3K event with me — first time we raced together.",
  },
  {
    date: "2023-09-29", dist: "10K", event: "Mirpur 10K", time: "1h 02m",
    flag: true,
    note: "restart event after a gap. walked dhaka for 4 hours\nafterwards — left foot started hurting.\nbecame an injury later.",
  },
  {
    date: "2023-10-04", dist: "21.1K", event: "UCR Half Marathon", time: "2h 45m",
    flag: true,
    note: "ran injured. pain hit at 7K. finished anyway.",
  },
  {
    date: "2023-10-20", dist: "21.1K", event: "Sunamganj Half Marathon", time: "2h 20m",
    note: "first time in sunamganj. stayed two days. tanguar haor,\nniladri lake. wanted a better timing, didn't get it.",
  },
  {
    date: "2023-11-02", dist: "25K", event: "Run Bangladesh Sylhet", time: "3h 10m",
    note: "family trip to sylhet. cramped hard near the end.",
  },
  {
    date: "2023-11-17", dist: "10K", event: "CR 10K", time: "57m",
    note: "hometown race in chattogram. finished strong.\nmy friend also participated for the first time.",
  },
  {
    date: "2024-01-10", dist: "42.2K", event: "Bangabandhu International Marathon", time: "5h 30m",
    note: "first full marathon. cramps everywhere.\nwent to dhaka with the friend who ran 21.1K in that event.",
  },
  {
    date: "2024-02-24", dist: "52K", event: "Vertical Dreamers Ultra (bandarban)", time: "8h 20m",
    flag: true,
    note: "first hill ultra. ~1000m elevation gain.\nat the end i wished i'd stopped. didn't.",
  },
  {
    date: "2024-03-07", dist: "25K", event: "Run Bangladesh Dhaka", time: "2h 36m",
    note: "reached late, missed the baggage drop, ran the first\n5K carrying my bag. still my strongest, fastest finish.",
  },
];

const racesAfterGap: RaceEntry[] = [
  {
    date: "2025-10-18", dist: "21.1K", event: "Bandarban Hill Half Marathon", time: "2h 30m",
    note: "back on track. tough. no injury.",
  },
  {
    date: "2025-11-01", dist: "42.2K", event: "Cox's Bazar Full Marathon", time: "5h 30m",
    note: "family came on the trip. roamed the seabeach.\nran sick, finished strong. foot injury appeared after.",
  },
  {
    date: "2025-11-08", dist: "42.2K", event: "Comilla Full Marathon", time: "6h 20m",
    flag: true,
    note: "back-to-back full a week later. shouldn't have run.\nwent anyway. first time in comilla. finished slow.\ninjury kept worsening.",
  },
  {
    date: "2025-12-05", dist: "52K", event: "Vertical Dreamers Ultra (bandarban)", time: "~9h 00m",
    flag: true,
    note: "the toughest event i've run. side tendons blew at\n26K. walked the rest with a stick. 6h for the last 26K.\nfinished.",
  },
  {
    date: "2026-01-03", dist: "21.1K", event: "Bhatiyari Half Marathon", time: "3h 05m",
    flag: true,
    note: "walked most of it. running triggered the injury.",
  },
];

const skipped: RaceEntry[] = [
  {
    date: "2025-12-25", dist: "6h", event: "Stadium Run", time: "did not run",
    note: "knee hadn't recovered. consulted a doctor. wasn't\ngoing to make 6 hours. one of my dream events.",
  },
  {
    date: "2026-02-05", dist: "50K", event: "Bhawal Ultra Marathon", time: "did not run",
    note: "registered months ahead. by the date, i knew the leg\nwouldn't finish. didn't go.",
  },
];

const RaceRow = ({ entry }: { entry: RaceEntry }) => (
  <div className="mb-3">
    <div className="flex flex-wrap gap-x-3 gap-y-0.5 items-baseline">
      <span className="text-phosphor-dim shrink-0 w-[10ch]">{entry.date}</span>
      <span className="shrink-0 w-[5ch]">{entry.dist}</span>
      <span className="flex-1 min-w-0">
        {entry.flag && <span className="text-phosphor mr-1">▲</span>}
        {entry.event}
      </span>
      <span className={`shrink-0 ${entry.skip ? "text-phosphor-dim" : "text-phosphor"}`}>{entry.time}</span>
    </div>
    {entry.note && (
      <div className="pl-[15ch] text-foreground/60 leading-relaxed whitespace-pre-line">{entry.note}</div>
    )}
  </div>
);

type CalEntry = { date: string; dist: string; event: string; weight: "phosphor" | "body" | "dim" };

const cal: CalEntry[] = [
  { date: "2026-06-19",  dist: "25K",                event: "Dhaka Run 25K",                       weight: "phosphor" },
  { date: "2026-07-03",  dist: "50K",               event: "Fuel Xtream Ultra 2026 Edition 2",    weight: "body" },
  { date: "2026-07-10",  dist: "21.1K",              event: "Chatto Metro Half Marathon 2026",     weight: "body" },
  { date: "2026-08-08",  dist: "42.2K",                event: "Sylhet International Marathon 2026", weight: "phosphor" },
  { date: "2026-08-21",  dist: "30K",                event: "Sylhet Summer 30K Challenge 2026",    weight: "body" },
  { date: "2026-09-04",  dist: "50K",                event: "Hatirjheel Ultra 2026",               weight: "body" },
  { date: "2026-10-09",  dist: "42.2K",              event: "Raipura Marathon 2026",               weight: "dim"  },
  { date: "2026-10-16",  dist: "42.2K / 21.1K",      event: "Active Pulse Chattogram Marathon",    weight: "body" },
  { date: "2026-10-30",  dist: "100K / 50K / 33K",   event: "Albatross Ultrail 2026",              weight: "phosphor" },
  { date: "2026-11-13",  dist: "100K / 50K / 30K",   event: "The Athlete X Ultra 2026",            weight: "phosphor" },
  { date: "2026-11-27",  dist: "42.2K / 21.1K",      event: "Jolshiri Runbangla Marathon",         weight: "dim"  },
  { date: "2026-12-11",  dist: "161K / 100K / 50K",  event: "Costral Ultra 2026",                  weight: "phosphor" },
  { date: "2026-12-11",  dist: "21.1K",              event: "MSDO Satkania Half Marathon 2026",    weight: "dim"  },
  { date: "2026-12-17",  dist: "42.2K / 21.1K",      event: "Northern Marathon",                   weight: "body" },
  { date: "2027-01-08",  dist: "21.1K",              event: "Moheshkhali Island Half Marathon",    weight: "dim"  },
  { date: "2027-01-22",  dist: "50K",                event: "Bhawal Ultra Marathon 2027",          weight: "body" },
];

const weightClass: Record<CalEntry["weight"], string> = {
  phosphor: "text-phosphor",
  body: "text-foreground/85",
  dim: "text-phosphor-dim",
};

const RunningContent = () => (
  <div className="animate-fade-in font-mono max-w-2xl mx-auto px-4 py-6 text-[15px] leading-[1.7] text-foreground/85">

    <div className="pl-2 mb-6">
      <p className="mb-1"><span className="text-phosphor">&gt; </span>my students asked me why i ran races, since i wasn't a professional</p>
      <p className="mb-1"><span className="text-phosphor">&gt; </span>and wasn't going to be. one of them told me the medal was useless —</p>
      <p className="mb-1"><span className="text-phosphor">&gt; </span>that it can't get me a job. i didn't reply. i remember him to this day.</p>
    </div>

    <p className="mb-4 mt-4">i wrote the long answer separately. it lives <Link to="/writing/essays/on-running-for-nothing" className="text-phosphor underline hover:no-underline">here</Link>.</p>

    {/* ── race log ── */}
    <SectionHeader label="race log" />
    <p className="mb-4">chronological. dates, distances, times, conditions. ▲ flags rough ones.</p>

    <HScrollTable>
      {races.map((r) => <RaceRow key={r.date + r.event} entry={r} />)}
      <div className="my-3 text-phosphor-dim text-xs italic">
        ───  1.5 year gap  ───  trained briefly. stopped. money was tight.
      </div>
      {racesAfterGap.map((r) => <RaceRow key={r.date + r.event} entry={r} />)}
    </HScrollTable>

    {/* ── not a race, but ── */}
    <SectionHeader label="not a race, but" />

    <div className="pl-2 mb-4">
      <p className="mb-1"><span className="text-phosphor">&gt; </span>the most characteristic run i've done wasn't a race.</p>
      <p className="mb-1"><span className="text-phosphor">&gt; </span>no medal, no audience, no event.</p>
    </div>

    <p className="mb-4">
      on the third day of eid, april 2024, after a couple of weeks off, i
      wanted to shake something loose. so i went out at midnight and ran
      from my home to sitakundu, hiked a 1000-foot hill, and came back.
      fifty kilometers, ten hours, alone. didn't feel good. got sick afterwards.
      nobody knew i'd done it until later.
    </p>

    <div className="pl-2 mb-4">
      <p className="mb-1"><span className="text-phosphor">&gt; </span>this is the answer to the medal question, i think. or part of it.</p>
    </div>

    {/* ── races i didn't run ── */}
    <SectionHeader label="races i didn't run" />

    <p className="mb-4">every runner has these. mine:</p>

    <HScrollTable>
      {skipped.map((r) => <RaceRow key={r.date + r.event} entry={{ ...r, skip: true }} />)}
    </HScrollTable>

    <p className="mb-4">
      there are also events i wanted to register for and couldn't, mostly
      for timing or money. they happen often.
    </p>

    {/* ── training, briefly ── */}
    <SectionHeader label="training, briefly" />

    <p className="mb-4">
      three sessions a week. two short — five to ten kilometers — and one
      long run, mileage going up each week. strength work at home, no gym.
      no coach. no plan more sophisticated than "next week, a little further."
    </p>

    <p className="mb-4">i train in shoes that aren't actual running shoes. cost is real.</p>

    <p className="mb-4">
      things i'm bad at: load management, injury management, pacing.
      i sweat heavily — more than is normal. i don't yet know what
      a sustainable mileage curve looks like for my body. i'm working on it.
      that's part of why this site exists.
    </p>

    <p className="mb-4">
      activity log lives on strava:{" "}
      <a
        href="https://www.strava.com/athletes/102295099"
        target="_blank"
        rel="noopener noreferrer"
        className="text-phosphor underline hover:no-underline"
      >
        @nj on strava
      </a>.
    </p>

    {/* ── targets ── */}
    <SectionHeader label="targets" />

    <p className="mb-4">aspirational. not where i am.</p>

    <div className="pl-2 mb-4 font-mono grid grid-cols-[6ch_1fr] gap-x-4 gap-y-0.5">
      <span className="text-phosphor">&gt; 25K</span>    <span>in 2h 00m</span>
      <span className="text-phosphor">&gt; full</span>   <span>in 3h 30m</span>
      <span className="text-phosphor">&gt; 50K</span>    <span>in 4h 30m</span>
      <span className="text-phosphor">&gt; 100K</span>   <span>in 10h 00m</span>
    </div>

    {/* ── 2026 calendar ── */}
    <SectionHeader label="2026 calendar" />

    <p className="mb-4">races i'm watching. weighted by interest. not all of these will happen.</p>

    <HScrollTable className="my-4">
      {cal.map((c) => (
        <div key={c.date + c.event} className={`flex gap-x-4 mb-1 ${weightClass[c.weight]}`}>
          <span className="shrink-0 w-[10ch]">{c.date}</span>
          <span className="shrink-0 w-[18ch]">{c.dist}</span>
          <span>{c.event}</span>
        </div>
      ))}
    </HScrollTable>

    <div className="mt-12 pt-3 border-t border-border/40 text-[10px] text-phosphor-dim font-mono">
      — nj · last updated 2026-05 · still going
    </div>
  </div>
);

export default RunningContent;
