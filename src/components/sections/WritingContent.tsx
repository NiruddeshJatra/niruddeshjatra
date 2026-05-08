import { Link } from "react-router-dom";

const WritingContent = () => (
  <div className="animate-fade-in font-mono max-w-xl mx-auto px-4 py-6 text-foreground/85">
    <div className="pl-2 mb-6">
      <p className="mb-1"><span className="text-phosphor">&gt; </span>a place for things i write down.</p>
      <p className="mb-1"><span className="text-phosphor">&gt; </span>essays, guides, field notes — eventually.</p>
      <p className="mb-1"><span className="text-phosphor">&gt; </span>one essay so far.</p>
    </div>

    <div className="text-phosphor-dim text-sm mt-10 mb-3 font-mono">// essays</div>

    <div className="pl-2 grid grid-cols-[auto_1fr] gap-x-6 gap-y-1">
      <Link to="/writing/on-running-for-nothing" className="text-phosphor hover:underline">
        on running for nothing
      </Link>
      <span className="text-foreground/85">
        why I run when there's no career outcome ·{" "}
        <span className="text-phosphor-dim">[en]</span>{" "}
        <Link to="/writing/on-running-for-nothing-bn" className="text-phosphor-dim hover:text-phosphor">
          [bn]
        </Link>
      </span>
    </div>

    <div className="mt-12 pt-3 border-t border-border/40 text-[10px] text-phosphor-dim font-mono">
      — nj · 2026-05 · this index will grow
    </div>
  </div>
);

export default WritingContent;
