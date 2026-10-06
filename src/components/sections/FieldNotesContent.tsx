import SEO from "../SEO";

type FieldNote = {
  date: string;
  title: string;
  body: React.ReactNode;
};

// newest-first
const notes: FieldNote[] = [
  {
    date: "2026-10-02",
    title: "thirty-five",
    body: (
      <>
        <p className="mb-3">
          ran 35 kilometres today. the longest i've ever run in training.
        </p>
        <p className="mb-3">
          the first twenty went the way long runs go. the last stretch was mostly negotiation. i got home weaker than i expected to be.
        </p>
        <p className="mb-3">
          two weeks to a marathon. this was supposed to be the confidence run. it turned out to be the honest one: the distance is there. the margin isn't yet. taper starts now.
        </p>
      </>
    ),
  },
  {
    date: "2026-08-11",
    title: "results day",
    body: (
      <>
        <p className="mb-3">
          the ssc results came out yesterday. i'd built a site that ranks the chattogram board's results, and last night was the only night it mattered.
        </p>
        <p className="mb-3">
          ran the scrape, checked a sample by hand, then published. by this morning students i've never met were looking up where they stood.
        </p>
        <p className="mb-3">
          it's the least glamorous thing i've built and the most useful one to strangers. no login, no design award. just a number someone was waiting for.
        </p>
      </>
    ),
  },
  {
    date: "2026-08-07",
    title: "the race i didn't start",
    body: (
      <>
        <p className="mb-3">
          the sylhet marathon is tomorrow. i'm not going.
        </p>
        <p className="mb-3">
          a week ago, with the toe still sore from football in taper week, i wrote down — in advance, while calm — the conditions under which i wouldn't start. yesterday they came true.
        </p>
        <p className="mb-3">
          every other time i've written a rule like that, i broke it the day it cost something. this is the first one that held. the trip went with it.
        </p>
        <p className="mb-3">
          still annoyed. but the 100k is in december, and i'd like to reach it on two working feet.
        </p>
      </>
    ),
  },
  {
    date: "2026-09-09",
    title: "eight of eight",
    body: (
      <>
        <p className="mb-3">
          the last article went up today. keyboard to screen — one keystroke
          followed all the way from a switch closing under a finger to photons
          leaving the glass. the series is finished.
        </p>
        <p className="mb-3">
          seven weeks ago i wrote in this same field-notes file that all eight
          were done on paper and i was scared to publish them. that entry is
          still below this one. i left it there on purpose.
        </p>
        <p className="mb-3">
          what i got wrong back then: i thought the articles needed to be
          finished before they could go up. they weren't finished. i corrected
          a scheduler that linux replaced in 2023, a dram refresh interval,
          an l1 latency figure, and — in this last one — a claim that a keyboard
          reads all 104 keys on 104 wires. it doesn't. it scans a grid. that
          correction came after publishing, not before, and the article is
          better for it.
        </p>
        <p className="mb-3">
          the thing i was afraid of — being wrong in public — happened, several
          times, and the cost was an afternoon of edits each time. the cost of
          waiting would have been the whole series sitting unread in a folder.
        </p>
        <p className="mb-3">
          i don't think i know computer science now. i know where the map is.
          that was the whole point.
        </p>
      </>
    ),
  },
  {
    date: "2026-07-23",
    title: "the paper oscilloscope, half-published",
    body: (
      <>
        <p className="mb-3">
          the series is done on paper. all eight articles written, most of
          them sitting in the code quietly — not linked anywhere, not visible
          to anyone.
        </p>
        <p className="mb-3">
          only the intro and article 1 are live. the rest exist but i'm not
          sure they're ready. or i'm not ready. or i don't want to release
          something and then have to live with it being wrong in public.
        </p>
        <p className="mb-3">
          i don't know if staggered publishing is discipline or cowardice.
          maybe both. maybe the distinction doesn't matter if the articles
          actually get better while i wait.
        </p>
        <p className="mb-3">
          the paper oscilloscope is what i'm calling it — warm aged-paper
          aesthetic, bangla-first. the first honest thing i've written about
          what computer science actually is, from someone still inside the
          confusion of learning it.
        </p>
      </>
    ),
  },
  {
    date: "2026-07-03",
    title: "catching fajr, missing it",
    body: (
      <>
        <p className="mb-3">
          the tuitions moved to 7am this month. which means waking at 4:30,
          4:45. which means fajr is no longer a prayer i choose to get up for
          — it's just there, at the edge of waking, unavoidable now.
        </p>
        <p className="mb-3">
          i thought this would fix my namaj problem. for months my record was
          bad, more missed than kept. now i catch fajr almost every day. the
          getting-up is solved.
        </p>
        <p className="mb-3">
          but i stand in it half-asleep, reciting on autopilot, my mind already
          on the 7am student. i catch the prayer and miss the prayer at the same
          time. presence turns out to be a separate problem from attendance. i
          solved the easy one and called it the hard one.
        </p>
        <p className="mb-3">
          no clean lesson here. just noticing that showing up and being there
          are not the same thing, and i only fixed the first.
        </p>
      </>
    ),
  },
  {
    date: "2026-06-25",
    title: "the correction list",
    body: (
      <>
        <p className="mb-3">
          finished my first paid website this month. a real client, a real
          event. i poured more into it than the fee justified — made it as
          premium as i could, because i couldn't help it.
        </p>
        <p className="mb-3">
          someone outside the project saw it and called it premium, amazing.
          an hour later the client sent a list of corrections. no thank-you
          first, just the list. it landed like a verdict on the whole thing.
        </p>
        <p className="mb-3">
          it wasn't. the list was four small items, most of them fair. but for
          an hour i couldn't tell the difference between "here are some changes"
          and "you failed." that gap — between what the work is and what one
          blunt message makes it feel like — is the actual job. not the code.
        </p>
        <p className="mb-3">
          the work was good and the work needed changes. both true at once.
          learning to hold both without the second erasing the first is the
          thing i'm actually practicing now.
        </p>
      </>
    ),
  },
  {
    date: "2026-06-19",
    title: "dhaka 25k, even splits",
    body: (
      <>
        <p className="mb-3">
          2:32:40. six-oh-seven per kilometer. 68th overall out of 942. my
          first 25k back after the injury months, and somehow my most even
          race — the second half almost exactly the first.
        </p>
        <p className="mb-3">
          it fell apart in one specific place. right glute gave out around
          km 18 to 20, and everything downstream started compensating. i
          finished on borrowed mechanics. the time held; the body filed a
          complaint.
        </p>
        <p className="mb-3">
          the even splits felt like discipline while i ran them and like luck
          when i looked back. maybe they're the same thing at this distance —
          holding a pace you're not sure you can hold, and being wrong about
          the doubt.
        </p>
      </>
    ),
  },
  {
    date: "2026-05-08",
    title: "heat sickness, then a run",
    body: (
      <>
        <p className="mb-3">
          woke up feeling like fever. body weak. it was a long-run day,
          but i decided to skip the morning and rest. tuitions all afternoon.
          the heat outside was worse than my head, somehow.
        </p>
        <p className="mb-3">
          at 7pm i went out anyway. ten kilometers, slow as i could run.
          the weather was hell — humid, still warm. but i finished, no pain,
          just sweated through everything.
        </p>
        <p className="mb-3">
          the lesson, maybe: my body lies to me about what it can do.
          the fever-feeling in the morning was real, but it wasn't a
          no-running signal. it was a be-careful signal. those are different.
        </p>
      </>
    ),
  },
  {
    date: "2026-05-05",
    title: "no morning run",
    body: (
      <>
        <p className="mb-3">
          today was a running day. but relatives stayed at our place,
          and a 5am dawn run would have raised questions. why is he
          out so early? where is he going? what is this?
        </p>
        <p className="mb-3">
          the answer "i'm running a marathon next month" doesn't fit
          into the kind of conversation a relative wants to have at
          6am tea. so i skipped.
        </p>
        <p className="mb-3">
          this is what order-vs-truth looks like in practice. not big
          philosophical decisions about disclosure — just small ones.
          the run is moved to tomorrow. the relatives don't know.
          the order holds.
        </p>
      </>
    ),
  },
  {
    date: "2026-05-01",
    title: "forgiveness, between tuitions",
    body: (
      <>
        <p className="mb-3">
          i listen to podcasts on my phone in the traffic between
          tuitions. usually background. occasionally a line catches.
        </p>
        <p className="mb-3">
          today, ramjan bhai on a podcast with sadman sadik:
        </p>
        <blockquote
          lang="bn"
          className="my-3 pl-4 border-l-2 border-phosphor-dim/40 italic text-foreground/85"
        >
          আমি তাদের ক্ষমা করে দিতে চাই, কারণ আমি চাই আল্লাহও আমাকে ক্ষমা করে দিক।
        </blockquote>
        <p className="italic text-foreground/70 mb-3">
          i want to forgive them because i want allah to forgive me.
        </p>
        <p className="mb-3">
          played it back three times. it shifted something. forgiving
          the people who've wronged me has always felt like a transaction
          i wasn't getting anything back from. this reframes it: i forgive
          not for them, but for the kind of person i want to be received as.
        </p>
        <p className="mb-3">
          simpler now. less argued with.
        </p>
      </>
    ),
  },
];

const latestStamp = notes[0].date.slice(0, 7);

const FieldNotesContent = () => (
  <>
    <SEO
      title="field notes — niruddeshjatra"
      description="short observations from the body, the road, the day. dated. mostly unedited."
      path="/field-notes"
    />
  <div className="animate-fade-in font-mono max-w-xl mx-auto px-4 py-6 text-foreground/85">
    <div className="pl-2 mb-6">
      <p className="mb-1"><span className="text-phosphor">&gt; </span>short observations from the body, the road, the day.</p>
      <p className="mb-1"><span className="text-phosphor">&gt; </span>dated. mostly unedited.</p>
    </div>

    <div className="mt-10">
      {notes.map((note, i) => (
        <article key={note.date} className="mb-12">
          <div className="flex items-baseline gap-3 mb-3 text-xs">
            <span className="text-phosphor-dim font-mono">{note.date}</span>
            <span className="text-phosphor-dim">·</span>
            <h3 className="text-foreground/85 font-mono uppercase tracking-[0.15em]">{note.title}</h3>
          </div>

          <div className="pl-0 text-[15px] leading-[1.7]">
            {note.body}
          </div>

          {i < notes.length - 1 && <div className="mt-8 border-b border-border/30" />}
        </article>
      ))}
    </div>

    <div className="mt-12 pt-3 border-t border-border/40 text-[10px] text-phosphor-dim font-mono">
      — nj · {notes.length} notes · {latestStamp} · more as they come
    </div>
  </div>
  </>
);

export default FieldNotesContent;
