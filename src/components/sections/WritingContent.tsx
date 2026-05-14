import { Link } from "react-router-dom";

const WritingContent = () => (
  <div className="animate-fade-in font-mono max-w-xl mx-auto px-4 py-6 text-foreground/85">
    <div className="pl-2 mb-6">
      <p className="mb-1"><span className="text-phosphor">&gt; </span>a place for things i write down.</p>
      <p className="mb-1"><span className="text-phosphor">&gt; </span>essays and tech articles, mostly.</p>
      <p className="mb-1"><span className="text-phosphor">&gt; </span>more coming.</p>
    </div>

    <div className="text-phosphor-dim text-sm mt-10 mb-3 font-mono">// essays</div>

    <div className="pl-2 grid grid-cols-[auto_1fr] gap-x-6 gap-y-1">
      <Link to="/writing/essays/on-forgetting" className="text-phosphor hover:underline">on forgetting</Link>
      <span className="text-foreground/85">why the mind forgets, and why that's mercy · <span className="text-phosphor-dim">[en]</span> <Link to="/writing/essays/on-forgetting-bn" className="text-phosphor-dim hover:text-phosphor">[bn]</Link></span>
      <Link to="/writing/essays/on-staying-small" className="text-phosphor hover:underline">on staying small</Link>
      <span className="text-foreground/85">why i won't scale my teaching · <span className="text-phosphor-dim">[en]</span> <Link to="/writing/essays/on-staying-small-bn" className="text-phosphor-dim hover:text-phosphor">[bn]</Link></span>
      <Link to="/writing/essays/on-running-for-nothing" className="text-phosphor hover:underline">on running for nothing</Link>
      <span className="text-foreground/85">why I run when there's no career outcome · <span className="text-phosphor-dim">[en]</span> <Link to="/writing/essays/on-running-for-nothing-bn" className="text-phosphor-dim hover:text-phosphor">[bn]</Link></span>
    </div>

    <div className="text-phosphor-dim text-sm mt-10 mb-3 font-mono">// tech articles</div>

    <div className="pl-2">
      <p className="text-phosphor-dim italic">[ no tech articles yet — one in progress ]</p>
    </div>

    <div className="mt-12 pt-3 border-t border-border/40 text-[10px] text-phosphor-dim font-mono">
      — nj · 2026-05 · this index will grow
    </div>
  </div>
);

export default WritingContent;
