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

const SIGNATURES: Record<ArchivedContentProps['variant'], { bytes: number }> = {
  experience: { bytes: 178 },
  education:  { bytes: 196 },
  projects:   { bytes: 142 },
  skills:     { bytes: 213 },
};

const SkillsJson = () => (
  <div className="space-y-1 text-sm">
    <div><span className="text-phosphor">{"{"}</span></div>
    <div className="pl-6 space-y-1">
      <div>
        <span className="text-phosphor/70">"note"</span>
        <span className="text-muted-foreground">: </span>
        <span className="text-phosphor-soft">"i used to inventory myself like a stack of buzzwords."</span>
        <span className="text-muted-foreground">,</span>
      </div>
      {(["django", "mern", "aws"] as const).map(k => (
        <div key={k}>
          <span className="text-phosphor/70">"{k}"</span>
          <span className="text-muted-foreground">: </span>
          <span className="text-phosphor-soft">"yeah"</span>
          <span className="text-muted-foreground">,</span>
        </div>
      ))}
      <div>
        <span className="text-phosphor/70">"the_actual_point"</span>
        <span className="text-muted-foreground">: </span>
        <span className="text-phosphor-soft">"skills aren't a list. they're whatever i ship next."</span>
      </div>
    </div>
    <div><span className="text-phosphor">{"}"}</span></div>
  </div>
);

const ArchivedContent = ({ variant }: ArchivedContentProps) => {
  const lines = variant !== 'skills' ? CONTENT[variant] : [];
  const { bytes } = SIGNATURES[variant];

  return (
    <div className="animate-fade-in font-mono text-sm leading-relaxed max-w-xl mx-auto px-4 py-6">
      {variant === 'skills' ? (
        <SkillsJson />
      ) : (
        <div className="space-y-3 text-foreground/80">
          {lines.map((line, i) => (
            <p key={i}>
              <span className="text-phosphor">&gt; </span>
              {line}
            </p>
          ))}
        </div>
      )}
      <p className="mt-8 text-xs text-muted-foreground">
        <span className="text-phosphor-dim">// </span>archived — no longer maintained
      </p>
      <div className="mt-12 pt-3 border-t border-border/40 text-[10px] text-phosphor-dim font-mono">
        — nj · archived · {bytes} bytes
      </div>
    </div>
  );
};

export default ArchivedContent;
