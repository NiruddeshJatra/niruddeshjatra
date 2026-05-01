interface SoonContentProps {
  message?: string;
}

const SoonContent = ({ message = "not yet written.\nyou'll know soon enough." }: SoonContentProps) => {
  return (
    <div className="animate-fade-in font-mono text-sm leading-relaxed max-w-2xl mx-auto px-4 py-6">
      <div className="space-y-2 text-foreground/70">
        {message.split('\n').map((line, i) => (
          <p key={i}>
            <span className="terminal-green">&gt; </span>
            {line}
          </p>
        ))}
      </div>
    </div>
  );
};

export default SoonContent;
