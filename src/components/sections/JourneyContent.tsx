import { Link } from "react-router-dom";
import IndexRow from "./IndexRow";

const pages = [
  {
    name: "running/",
    link: "/journey-running",
    description: "the race log, the training, the next 100K",
    dim: false,
  },
  {
    name: "hiking/",
    link: null,
    description: "bandarban, mountains of bangladesh — soon",
    dim: true,
  },
  {
    name: "mountains/",
    link: null,
    description: "eventually",
    dim: true,
  },
];

const JourneyContent = () => (
  <div className="animate-fade-in font-mono max-w-xl mx-auto px-4 py-6 text-foreground/85">
    <div className="pl-2 mb-6">
      <p className="mb-1"><span className="text-phosphor">&gt; </span>a body project.</p>
      <p className="mb-1"><span className="text-phosphor">&gt; </span>running, hiking, eventually mountains.</p>
      <p className="mb-1"><span className="text-phosphor">&gt; </span>running's the page that's real. the others are coming.</p>
    </div>

    <div className="text-phosphor-dim text-sm mt-10 mb-3 font-mono">// pages</div>

    <div className="pl-2 space-y-4 sm:space-y-1">
      {pages.map((page) => (
        <IndexRow
          key={page.name}
          name={
            page.link
              ? <Link to={page.link} className="text-phosphor hover:underline">{page.name}</Link>
              : <span className="text-phosphor-dim">{page.name}</span>
          }
          description={page.description}
          descriptionClass={`${page.dim ? "text-phosphor-dim" : "text-foreground/85"} mt-1 sm:mt-0 text-sm`}
        />
      ))}
    </div>

    <div className="mt-12 pt-3 border-t border-border/40 text-[10px] text-phosphor-dim font-mono">
      — nj · 2026-05 · this is a placeholder
    </div>
  </div>
);

export default JourneyContent;
