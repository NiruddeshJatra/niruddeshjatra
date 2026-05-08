interface SoonContentProps {
  message?: string;
}

const SoonContent = ({ message = "not yet written.\nyou'll know soon enough." }: SoonContentProps) => {
  const isEventually = message === "eventually.";
  const sig = isEventually
    ? { date: "eventually", bytes: 12 }
    : { date: "pending", bytes: 37 };

  return (
    <div className="animate-fade-in font-mono text-sm leading-relaxed max-w-xl mx-auto px-4 py-6">
      <div className="space-y-2 text-foreground/70">
        {message.split('\n').map((line, i) => (
          <p key={i}>
            <span className="text-phosphor">&gt; </span>
            {line}
          </p>
        ))}
      </div>
      <div className="mt-12 pt-3 border-t border-border/40 text-[10px] text-phosphor-dim font-mono">
        — nj · {sig.date} · {sig.bytes} bytes
      </div>
    </div>
  );
};

export default SoonContent;
