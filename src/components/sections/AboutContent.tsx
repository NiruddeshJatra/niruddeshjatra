import { useState } from "react";

const UNLOCK_KEY = 'ncs_about_unlocked';

const isUnlocked = (): boolean => {
  if (typeof window === 'undefined') return false;
  if (new URLSearchParams(window.location.search).get('draft') === '1') return true;
  return localStorage.getItem(UNLOCK_KEY) === 'true';
};

const LockedAbout = () => (
  <div className="animate-fade-in font-mono text-sm leading-relaxed max-w-2xl mx-auto px-4 py-6">
    <p className="text-foreground/60">
      this is being written. ask if you actually want to read it.
    </p>
  </div>
);

const DraftAbout = () => (
  <div className="animate-fade-in font-mono text-sm leading-relaxed max-w-2xl mx-auto px-4 py-6">
    <div className="mb-1">
      <span className="terminal-purple">const </span>
      <span className="terminal-cyan">me</span>
      <span className="text-foreground"> = </span>
      <span className="terminal-yellow">{"{"}</span>
    </div>

    <div className="pl-6 space-y-5">

      <div className="space-y-1">
        <div className="terminal-green text-xs">// who</div>
        <div>
          <span className="terminal-blue">name</span>
          <span className="text-muted-foreground">: </span>
          <span className="terminal-orange">"Nasiful Alam"</span>
          <span className="text-muted-foreground">,</span>
        </div>
        <div>
          <span className="terminal-blue">based_in</span>
          <span className="text-muted-foreground">: </span>
          <span className="terminal-orange">"Chattogram, Bangladesh"</span>
          <span className="text-muted-foreground">,</span>
        </div>
      </div>

      <div className="space-y-1">
        <div className="terminal-green text-xs">// what I do</div>
        <div>
          <span className="terminal-blue">engineer</span>
          <span className="text-muted-foreground">: </span>
          <span className="terminal-orange">"full-stack — Django, MERN, AWS"</span>
          <span className="text-muted-foreground">,</span>
        </div>
        <div>
          <span className="terminal-blue">also</span>
          <span className="text-muted-foreground">: [</span>
          <span className="terminal-orange">"write"</span>
          <span className="text-muted-foreground">, </span>
          <span className="terminal-orange">"make 2d arcade games"</span>
          <span className="text-muted-foreground">],</span>
        </div>
      </div>

      <div className="space-y-1">
        <div className="terminal-green text-xs">// now</div>
        <div>
          <span className="terminal-blue">shipping</span>
          <span className="text-muted-foreground">: </span>
          <span className="terminal-orange">"arczero — first game out of the workshop"</span>
          <span className="text-muted-foreground">,</span>
        </div>
        <div>
          <span className="terminal-blue">learning</span>
          <span className="text-muted-foreground">: </span>
          <span className="terminal-orange">"what i actually want to make"</span>
          <span className="text-muted-foreground">,</span>
        </div>
      </div>

    </div>

    <div className="mt-1">
      <span className="terminal-yellow">{"}"}</span>
      <span className="text-muted-foreground">;</span>
    </div>

    <div className="mt-6 text-xs">
      <span className="terminal-purple">export default </span>
      <span className="terminal-cyan">me</span>
      <span className="text-muted-foreground">;</span>
    </div>

    <div className="mt-8 pt-4 border-t border-border text-xs text-muted-foreground">
      <span className="terminal-green">// </span>
      contact →{" "}
      <span className="terminal-cyan">contact.md</span>
    </div>
  </div>
);

const AboutContent = () => {
  const [unlocked] = useState(() => isUnlocked());
  return unlocked ? <DraftAbout /> : <LockedAbout />;
};

export default AboutContent;
