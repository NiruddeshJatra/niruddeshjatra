interface ArchivedContentProps {
  variant: 'experience' | 'education' | 'projects' | 'skills';
}

const CONTENT: Record<Exclude<ArchivedContentProps['variant'], 'skills'>, string[]> = {
  experience: [
    "this used to be my job-hunting résumé.",
    "i'm out of that line. don't give a fuck about jobs anymore.",
    "the work happened. the framing was fake.",
    "moving on.",
  ],
  education: [
    "a degree i never cherished.",
    "in year one, i understood — institutional learning was about grades, not understanding.",
    "spent four years reading whatever i wanted instead.",
    "no regrets, no cgpa.",
  ],
  projects: [
    "old projects, framed as résumé bullets.",
    "the work was real. the framing was for hiring managers.",
    "new section forming. wait for it.",
  ],
};

const SkillsJson = () => (
  <div className="space-y-1 text-sm">
    <div><span className="terminal-yellow">{"{"}</span></div>
    <div className="pl-6 space-y-1">
      <div>
        <span className="terminal-blue">"note"</span>
        <span className="text-muted-foreground">: </span>
        <span className="terminal-orange">"i used to inventory myself like a stack of buzzwords."</span>
        <span className="text-muted-foreground">,</span>
      </div>
      {(["django", "mern", "aws"] as const).map(k => (
        <div key={k}>
          <span className="terminal-blue">"{k}"</span>
          <span className="text-muted-foreground">: </span>
          <span className="terminal-orange">"yeah"</span>
          <span className="text-muted-foreground">,</span>
        </div>
      ))}
      <div>
        <span className="terminal-blue">"the_actual_point"</span>
        <span className="text-muted-foreground">: </span>
        <span className="terminal-orange">"skills aren't a list. they're whatever i ship next."</span>
      </div>
    </div>
    <div><span className="terminal-yellow">{"}"}</span></div>
  </div>
);

const ArchivedContent = ({ variant }: ArchivedContentProps) => {
  const lines = variant !== 'skills' ? CONTENT[variant] : [];

  return (
    <div className="animate-fade-in font-mono text-sm leading-relaxed max-w-2xl mx-auto px-4 py-6">
      {variant === 'skills' ? (
        <SkillsJson />
      ) : (
        <div className="space-y-3 text-foreground/80">
          {lines.map((line, i) => (
            <p key={i}>
              <span className="terminal-green">&gt; </span>
              {line}
            </p>
          ))}
        </div>
      )}
      <p className="mt-8 text-xs text-muted-foreground">
        <span className="terminal-green">// </span>archived — no longer maintained
      </p>
    </div>
  );
};

export default ArchivedContent;
