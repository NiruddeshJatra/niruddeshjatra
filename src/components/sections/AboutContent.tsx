const DraftAbout = () => (
  <div className="animate-fade-in font-mono max-w-2xl mx-auto px-4 py-6 text-[15px] leading-[1.7] text-foreground/85">

    <p className="mb-1"><span className="text-phosphor">&gt; </span>i make things. i think about things. i write some of it down.</p>
    <p className="mb-4"><span className="text-phosphor">&gt; </span>i don't think well sitting still.</p>

    <div className="text-phosphor-dim text-sm mt-10 mb-3 font-mono">// on forgetting</div>
    <p className="mb-4">i forget most of what i read. my students call me a brainy goldfish. what stays isn't the details — it's the structure of how things work. when i need a detail, i re-derive it from the structure. so far that's been enough.</p>
    <p className="mb-4">i go too deep when i should be going wide. i know this about myself. i try to compensate. it doesn't always work.</p>

    <div className="text-phosphor-dim text-sm mt-10 mb-3 font-mono">// on the work i won't do</div>
    <p className="mb-1"><span className="text-phosphor">&gt; </span>i tried the institutional path. it didn't fit.</p>
    <p className="mb-4"><span className="text-phosphor">&gt; </span>i tried a job, working under someone else's vision. it didn't last.</p>
    <p className="mb-4">i tutor for a living. people told me i should scale it. i still haven't. selling a path to better marks would mean joining the system that didn't fit me in the first place.</p>
    <p className="mb-4">i'd rather build something that doesn't already exist than scale something i don't believe in.</p>

    <div className="text-phosphor-dim text-sm mt-10 mb-3 font-mono">// on hard things</div>
    <p className="mb-1"><span className="text-phosphor">&gt; </span>i was a weak kid. people called me a farm chicken.</p>
    <p className="mb-4"><span className="text-phosphor">&gt; </span>i wanted a different story so i started writing one.</p>
    <p className="mb-4">i run long distance. two 52k ultras done, a 100k coming this year. i hike mountains in bandarban. tents, jungles, occasionally life-threatening. mountaineering, eventually.</p>
    <p className="mb-1"><span className="text-phosphor">&gt; </span>i pick the longer distance, not the faster one.</p>
    <p className="mb-1"><span className="text-phosphor">&gt; </span>the slow part is the point.</p>
    <p className="mb-4"><span className="text-phosphor">&gt; </span>i'd rather finish broken than win unbroken.</p>

    <div className="text-phosphor-dim text-sm mt-10 mb-3 font-mono">// what this site is</div>
    <p className="mb-4">a place to keep the work and the arguments. games i'm building. things i'm writing. trips i'm taking. slow to fill. honest while it does.</p>
    <p className="mb-1"><span className="text-phosphor">&gt; </span>this is one angle. there are others.</p>
    <p className="mb-4"><span className="text-phosphor">&gt; </span>i'm an explorer. that part i'm sure of.</p>

    <div className="mt-12 pt-3 border-t border-border/40 text-[10px] text-phosphor-dim font-mono">
      — nj · 2026-05 · 1247 bytes
    </div>

  </div>
);

import SEO from "../SEO";
import { personSchema } from "../../lib/structuredData";

const AboutContent = () => (
  <>
    <SEO
      title="about — niruddeshjatra"
      description="who i am, what i make, and how to find me. by nj."
      path="/about"
      structuredData={personSchema()}
    />
    <DraftAbout />
  </>
);

export default AboutContent;
