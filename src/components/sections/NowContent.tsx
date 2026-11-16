import { useNavigate } from "react-router-dom";
import SEO from "../SEO";
import { firePortal } from "@/hooks/useLoader";
import { SERIES_HUB_PATH, SERIES_TITLE } from "@/articles/manifest";
import { upcomingRaces, formatRaceMonth, displayName } from "@/constants/races";
import { nowArchive } from "@/constants/nowArchive";

const NowContent = () => {
  const navigate = useNavigate();
  const goSeries = () => {
    firePortal({ destination: '> Entering the tech world', onComplete: () => navigate(SERIES_HUB_PATH) });
  };

  return (
    <>
      <SEO
        title="now — niruddeshjatra"
        description="what i'm doing this month — a 50k in december, module two, the phone in the almirah. updates whenever life shifts."
        path="/now"
      />
    <div className="animate-fade-in font-mono text-sm leading-relaxed max-w-xl mx-auto px-4 py-6">
      <div className="space-y-4 text-foreground/80">
        <p><span className="text-phosphor">&gt; </span>what i'm doing this month, in plain language. updates whenever life shifts.</p>

        <div>
          <div className="text-phosphor-dim text-sm mt-8 mb-2 font-mono">// tutoring</div>
          <p>
            Tutoring still pays the bills. It's the ground everything else stands on, so it stays.
          </p>
        </div>

        <div>
          <div className="text-phosphor-dim text-sm mt-8 mb-2 font-mono">// training</div>
          <p>
            Comilla on November 6 went better than any number I'd written down: 5:40 on a trail 50K, fourth place, on two hours of sleep. Then the Coastal Ultra list came out, and I got the 50K, not the 100K I'd been aiming at all year. So the 50K is the race now. Five weeks of a plain block: easy runs, one long run a week, football on Tuesdays, and a plan that mostly stops me from doing more.
          </p>
        </div>

        <div>
          <div className="text-phosphor-dim text-sm mt-8 mb-2 font-mono">// races</div>
          <p>
            What's left: {upcomingRaces.map((r) => `${displayName(r)} (${formatRaceMonth(r.date)})`).join(", ")}. The one that matters is the Coastal 50K on December 18, Inani to Teknaf along the beach. The Satkania half on December 4 is the dress rehearsal. Full calendar's on the running page.
          </p>
        </div>

        <div>
          <div className="text-phosphor-dim text-sm mt-8 mb-2 font-mono">// learning</div>
          <p>
            Module two: networking, from the wire up. It slipped a week. This week is the oral checkpoint and the start of the HTTP server, written on a raw socket without AI; the exam is the last weekend of November. Chess: puzzles or one game a day. Planning to properly sit and study modern scandinavian, stonewall dutch and jobava london.
          </p>
        </div>

        <div>
          <div className="text-phosphor-dim text-sm mt-8 mb-2 font-mono">// building</div>
          <p>
            <button
              onClick={goSeries}
              className="text-phosphor hover:underline cursor-pointer bg-transparent border-none p-0 font-mono"
            >
              {SERIES_TITLE}
            </button>{" "}
            is finished and out in the world: eight articles, in Bangla and English. The{" "}
            <a
              href="https://boardexamrankings.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-phosphor hover:underline"
            >
              board-exam rankings site
            </a>{" "}
            was updated for the HSC 2026 results on October 31. The registration portal I built for Triathlon Bangladesh runs two events. ArcZero is still live.
          </p>
        </div>

        <div>
          <div className="text-phosphor-dim text-sm mt-8 mb-2 font-mono">// this month</div>
          <p>
            The phone still goes into the almirah after the last tuition. The nights it does, I read four pages of the Quran and sleep better. The nights it doesn't, I don't. That's the whole finding so far.
          </p>
        </div>

        <div>
          <div className="text-phosphor-dim text-sm mt-8 mb-2 font-mono">// earlier</div>
          <p>what this page said before, kept as it was.</p>
          {nowArchive.map((snap) => (
            <details key={snap.date} className="mt-4">
              <summary className="text-phosphor-dim cursor-pointer font-mono">{snap.date}</summary>
              <div className="space-y-4 mt-4">
                {snap.sections.map((sec) => (
                  <p key={sec.label}>
                    <span className="text-phosphor-dim">// {sec.label}</span> {sec.text}
                  </p>
                ))}
              </div>
            </details>
          ))}
        </div>
      </div>
      <div className="mt-12 pt-3 border-t border-border/40 text-[10px] text-phosphor-dim font-mono">
        — nj · 2026-11 · this changes often
      </div>
    </div>
    </>
  );
};

export default NowContent;
