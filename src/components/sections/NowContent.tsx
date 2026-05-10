const NowContent = () => {
  return (
    <div className="animate-fade-in font-mono text-sm leading-relaxed max-w-xl mx-auto px-4 py-6">
      <div className="space-y-4 text-foreground/80">
        <p><span className="text-phosphor">&gt; </span>what i'm doing this month, in plain language. updates whenever life shifts.</p>

        <div>
          <div className="text-phosphor-dim text-sm mt-8 mb-2 font-mono">// tutoring</div>
          <p>
            Lately, tutoring has taken over most of my schedule. I picked up a couple of new ones this month too. Most mornings, afternoons and even late evenings are gone now, and the gaps in between are used for catching up with everything else. It’s financially necessary right now, but it’s cutting into the time I want for training, studying, and the website.
          </p>
        </div>

        <div>
          <div className="text-phosphor-dim text-sm mt-8 mb-2 font-mono">// training</div>
          <p>
            Training has finally become structured again after a long inconsistent stretch. Right now it’s a mix of running, strength work, and swimming. Still trying to rebuild rhythm and consistency. The heat knocked me off balance for a few days last week, so the body feels a bit rusty at the moment, but things are moving again.
          </p>
        </div>

        <div>
          <div className="text-phosphor-dim text-sm mt-8 mb-2 font-mono">// races</div>
          <p>
            registered for dhaka run 25k on june 19. first race back. not 
            pushing for a time — just want to finish without re-aggravating 
            anything. the calendar after that is in the running page.
          </p>
        </div>

        <div>
          <div className="text-phosphor-dim text-sm mt-8 mb-2 font-mono">// building</div>
          <p>
            this site, mostly. arczero shipped, second game is in head only. 
            reading nexus when i can. the cs course on the side has slowed 
            down. priority right now is income and the body.
          </p>
        </div>
      </div>
      <div className="mt-12 pt-3 border-t border-border/40 text-[10px] text-phosphor-dim font-mono">
        — nj · 2026-05 · this changes often
      </div>
    </div>
  );
};

export default NowContent;
