const ContactContent = () => {
  return (
    <div className="animate-fade-in font-mono text-sm leading-relaxed max-w-2xl mx-auto px-4 py-6">
      <div className="space-y-3 text-foreground/80">
        <p><span className="terminal-green">&gt; </span>the door's open.</p>
        <p>
          <span className="terminal-green">&gt; </span>
          mail:{" "}
          <a
            href="mailto:nasifulalam1212@gmail.com"
            className="terminal-cyan hover:underline"
          >
            nasifulalam1212@gmail.com
          </a>
        </p>
        <p><span className="terminal-green">&gt; </span>i'll add other ways to reach me when i feel like it.</p>
      </div>
    </div>
  );
};

export default ContactContent;
