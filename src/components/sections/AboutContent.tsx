import { useState } from "react";

const UNLOCK_KEY = 'ncs_about_unlocked';

const isUnlocked = (): boolean => {
  if (typeof window === 'undefined') return false;
  if (new URLSearchParams(window.location.search).get('draft') === '1') return true;
  return localStorage.getItem(UNLOCK_KEY) === 'true';
};

const LockedAbout = () => (
  <div className="animate-fade-in font-mono text-sm leading-relaxed max-w-xl mx-auto px-4 py-6">
    <p className="text-foreground/60">
      this is being written. ask if you actually want to read it.
    </p>
  </div>
);

const DraftAbout = () => (
  <div className="animate-fade-in font-mono text-sm leading-relaxed max-w-2xl mx-auto px-4 py-6">
    <div className="mb-1">
      <span className="text-phosphor">const </span>
      <span className="text-phosphor">me</span>
      <span className="text-foreground"> = </span>
      <span className="text-phosphor">{"{"}</span>
    </div>

    <div className="pl-6 space-y-5">

      <div className="space-y-1">
        <div className="text-phosphor-dim text-xs">// who</div>
        <div>
          <span className="text-phosphor/70">name</span>
          <span className="text-muted-foreground">: </span>
          <span className="text-phosphor-soft">"Nasiful Alam"</span>
          <span className="text-muted-foreground">,</span>
        </div>
        <div>
          <span className="text-phosphor/70">based_in</span>
          <span className="text-muted-foreground">: </span>
          <span className="text-phosphor-soft">"Chattogram, Bangladesh"</span>
          <span className="text-muted-foreground">,</span>
        </div>
      </div>

      <div className="space-y-1">
        <div className="text-phosphor-dim text-xs">// what I do</div>
        <div>
          <span className="text-phosphor/70">engineer</span>
          <span className="text-muted-foreground">: </span>
          <span className="text-phosphor-soft">"full-stack — Django, MERN, AWS"</span>
          <span className="text-muted-foreground">,</span>
        </div>
        <div>
          <span className="text-phosphor/70">also</span>
          <span className="text-muted-foreground">: [</span>
          <span className="text-phosphor-soft">"write"</span>
          <span className="text-muted-foreground">, </span>
          <span className="text-phosphor-soft">"make 2d arcade games"</span>
          <span className="text-muted-foreground">],</span>
        </div>
      </div>

      <div className="space-y-1">
        <div className="text-phosphor-dim text-xs">// now</div>
        <div>
          <span className="text-phosphor/70">shipping</span>
          <span className="text-muted-foreground">: </span>
          <span className="text-phosphor-soft">"arczero — first game out of the workshop"</span>
          <span className="text-muted-foreground">,</span>
        </div>
        <div>
          <span className="text-phosphor/70">learning</span>
          <span className="text-muted-foreground">: </span>
          <span className="text-phosphor-soft">"what i actually want to make"</span>
          <span className="text-muted-foreground">,</span>
        </div>
      </div>

    </div>

    <div className="mt-1">
      <span className="text-phosphor">{"}"}</span>
      <span className="text-muted-foreground">;</span>
    </div>

    <div className="mt-6 text-xs">
      <span className="text-phosphor">export default </span>
      <span className="text-phosphor">me</span>
      <span className="text-muted-foreground">;</span>
    </div>

    <div className="mt-8 pt-4 border-t border-border text-xs text-muted-foreground">
      <span className="text-phosphor-dim">// </span>
      contact →{" "}
      <span className="text-phosphor">contact.md</span>
    </div>

    <div className="mt-12 pt-3 border-t border-border/40 text-[10px] text-phosphor-dim font-mono">
      — nj · 2026-04 · 412 bytes
    </div>
  </div>
);

const AboutContent = () => {
  const [unlocked] = useState(() => isUnlocked());
  return unlocked ? <DraftAbout /> : <LockedAbout />;
};

export default AboutContent;
