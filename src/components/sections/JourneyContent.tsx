import { Link } from "react-router-dom";

const JourneyContent = () => (
  <div className="animate-fade-in font-mono max-w-xl mx-auto px-4 py-6 text-foreground/85">
    <div className="pl-2 mb-6">
      <p className="mb-1"><span className="text-phosphor">&gt; </span>a body project.</p>
      <p className="mb-1"><span className="text-phosphor">&gt; </span>running, hiking, eventually mountains.</p>
      <p className="mb-1"><span className="text-phosphor">&gt; </span>running's the page that's real. the others are coming.</p>
    </div>

    <div className="text-phosphor-dim text-sm mt-10 mb-3 font-mono">// pages</div>

    <div className="pl-2 space-y-4 sm:space-y-1">
      <div className="sm:grid sm:grid-cols-[auto_1fr] sm:gap-x-6 sm:items-baseline">
        <div className="font-mono"><Link to="/journey-running" className="text-phosphor hover:underline">running/</Link></div>
        <div className="text-foreground/85 mt-1 sm:mt-0 text-sm">the race log, the training, the next 100K</div>
      </div>
      <div className="sm:grid sm:grid-cols-[auto_1fr] sm:gap-x-6 sm:items-baseline">
        <div className="font-mono"><span className="text-phosphor-dim">hiking/</span></div>
        <div className="text-phosphor-dim mt-1 sm:mt-0 text-sm">bandarban, mountains of bangladesh — soon</div>
      </div>
      <div className="sm:grid sm:grid-cols-[auto_1fr] sm:gap-x-6 sm:items-baseline">
        <div className="font-mono"><span className="text-phosphor-dim">mountains/</span></div>
        <div className="text-phosphor-dim mt-1 sm:mt-0 text-sm">eventually</div>
      </div>
    </div>

    <div className="mt-12 pt-3 border-t border-border/40 text-[10px] text-phosphor-dim font-mono">
      — nj · 2026-05 · this is a placeholder
    </div>
  </div>
);

export default JourneyContent;
