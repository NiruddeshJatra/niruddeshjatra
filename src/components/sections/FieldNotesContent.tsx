const FieldNotesContent = () => (
  <div className="animate-fade-in font-mono max-w-xl mx-auto px-4 py-6 text-foreground/85">
    <div className="pl-2 mb-6">
      <p className="mb-1"><span className="text-phosphor">&gt; </span>short observations from the body, the road, the day.</p>
      <p className="mb-1"><span className="text-phosphor">&gt; </span>dated. mostly unedited.</p>
    </div>

    <div className="mt-10">

      <article className="mb-12">
        <div className="flex items-baseline gap-3 mb-3 text-xs">
          <span className="text-phosphor-dim font-mono">2026-05-08</span>
          <span className="text-phosphor-dim">·</span>
          <h3 className="text-foreground/85 font-mono uppercase tracking-[0.15em]">heat sickness, then a run</h3>
        </div>

        <div className="pl-0 text-[15px] leading-[1.7]">
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
        </div>

        <div className="mt-8 border-b border-border/30" />
      </article>

      <article className="mb-12">
        <div className="flex items-baseline gap-3 mb-3 text-xs">
          <span className="text-phosphor-dim font-mono">2026-05-05</span>
          <span className="text-phosphor-dim">·</span>
          <h3 className="text-foreground/85 font-mono uppercase tracking-[0.15em]">no morning run</h3>
        </div>

        <div className="pl-0 text-[15px] leading-[1.7]">
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
        </div>

        <div className="mt-8 border-b border-border/30" />
      </article>

      <article className="mb-12">
        <div className="flex items-baseline gap-3 mb-3 text-xs">
          <span className="text-phosphor-dim font-mono">2026-05-01</span>
          <span className="text-phosphor-dim">·</span>
          <h3 className="text-foreground/85 font-mono uppercase tracking-[0.15em]">forgiveness, between tuitions</h3>
        </div>

        <div className="pl-0 text-[15px] leading-[1.7]">
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
        </div>
      </article>

    </div>

    <div className="mt-12 pt-3 border-t border-border/40 text-[10px] text-phosphor-dim font-mono">
      — nj · 3 notes · 2026-05 · more as they come
    </div>
  </div>
);

export default FieldNotesContent;
