import { Link } from "react-router-dom";
import SEO from "../SEO";
import { races, racesAfterGap, skipped, cal, type RaceEntry, type CalEntry } from "@/constants/races";

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

const weightClass: Record<CalEntry["weight"], string> = {
  phosphor: "text-phosphor",
  body: "text-foreground/85",
  dim: "text-phosphor-dim",
};

const RunningContent = () => (
  <>
    <SEO
      title="running — niruddeshjatra"
      description="my race log, training notes, and targets. half marathons, ultras, and the road to 100K."
      path="/journey-running"
    />
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

    <p className="mb-4">longest training run so far: 35 km, october 2026.</p>

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

    <p className="mb-4">races i'm entered in or watching. each one is decided two weeks out. not all of these will happen.</p>

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
      — nj · last updated 2026-10 · still going
    </div>
  </div>
  </>
);

export default RunningContent;
