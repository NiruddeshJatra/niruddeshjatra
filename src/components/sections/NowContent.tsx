import { useNavigate } from "react-router-dom";
import SEO from "../SEO";
import { firePortal } from "@/hooks/useLoader";
import { SERIES_HUB_PATH, SERIES_TITLE } from "@/articles/manifest";
import { upcomingRaces, formatRaceMonth, displayName } from "@/constants/races";

const NowContent = () => {
  const navigate = useNavigate();
  const goSeries = () => {
    firePortal({ destination: '> Entering the tech world', onComplete: () => navigate(SERIES_HUB_PATH) });
  };

  return (
    <>
      <SEO
        title="now — niruddeshjatra"
        description="what i'm doing this month — resting after a marathon, networking, chess, doing less on purpose. updates whenever life shifts."
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
            The marathon on October 16 went better than I had any right to expect: 4:58, my first under five hours, 32 minutes off my best. Since then the body has asked for a break, and I'm trying to actually give it one. The Comilla 50K on November 6 gets decided the day before, against a list I wrote while calm. Two November races were postponed by their organisers, which made the month quieter than planned.
          </p>
        </div>

        <div>
          <div className="text-phosphor-dim text-sm mt-8 mb-2 font-mono">// races</div>
          <p>
            What's left: {upcomingRaces.map((r) => `${displayName(r)} (${formatRaceMonth(r.date)})`).join(", ")}. The one that matters is the Coastal Ultra on December 18 — the 100K, if I'm selected. Full calendar's on the running page.
          </p>
        </div>

        <div>
          <div className="text-phosphor-dim text-sm mt-8 mb-2 font-mono">// learning</div>
          <p>
            Module two: networking, from the wire up. About halfway — TCP and TLS right now. It closes by the end of November, and the test is an HTTP server written on a raw socket, without AI. Chess: my first tournament was on October 24 — eight games, 29th of 212. Now it's puzzles or one game a day.
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
            Doing less, on purpose. One focused task at a time. The phone goes away after the last tuition. Fewer races, more reading.
          </p>
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
