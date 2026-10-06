import { useNavigate } from "react-router-dom";
import SEO from "../SEO";
import { firePortal } from "@/hooks/useLoader";
import { SERIES_HUB_PATH, SERIES_TITLE } from "@/articles/manifest";
import { lastRace, nextRace, upcomingRaces, formatRaceDate, formatRaceMonth, displayName } from "@/constants/races";

const NowContent = () => {
  const navigate = useNavigate();
  const goSeries = () => {
    firePortal({ destination: '> Entering the tech world', onComplete: () => navigate(SERIES_HUB_PATH) });
  };

  return (
    <>
      <SEO
        title="now — niruddeshjatra"
        description="what i'm doing this month — marathon taper, tutoring, networking from scratch, chess. updates whenever life shifts."
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
            {displayName(nextRace)} on {formatRaceDate(nextRace.date)} is the next start line, so this is taper — less volume, more rest, trying not to fill the space with something new. On October 2 I ran 35 kilometres, the longest training run I've done. In {formatRaceMonth(lastRace.date)}: a {lastRace.dist} in {lastRace.time}, my best at that distance. Full calendar's on the running page.
          </p>
        </div>

        <div>
          <div className="text-phosphor-dim text-sm mt-8 mb-2 font-mono">// races</div>
          <p>
            After that the autumn gets crowded: {upcomingRaces.map((r) => `${displayName(r)} (${formatRaceMonth(r.date)})`).join(", ")}. Not all of them will happen; each one gets decided two weeks out. The one that matters is the Coastal Ultra on December 18 — the 100K, if I get in.
          </p>
        </div>

        <div>
          <div className="text-phosphor-dim text-sm mt-8 mb-2 font-mono">// learning</div>
          <p>
            Networking, from the ground up — how a request actually crosses the wire. The test at the end is an HTTP server written on a raw socket, without AI. And chess, properly this time: started in September, first one-day tournament on October 24.
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
            is finished: eight articles, in Bangla and English. The registration portal I built for Triathlon Bangladesh now runs two events. The{" "}
            <a
              href="https://boardexamrankings.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-phosphor hover:underline"
            >
              board-exam rankings site
            </a>{" "}
            served the SSC results in August, and a lot of students checked where they stood on it. ArcZero is still live. From here it's one thing at a time.
          </p>
        </div>
      </div>
      <div className="mt-12 pt-3 border-t border-border/40 text-[10px] text-phosphor-dim font-mono">
        — nj · 2026-10 · this changes often
      </div>
    </div>
    </>
  );
};

export default NowContent;
