import { Link } from "react-router-dom";
import IndexRow from "./IndexRow";
import SEO from "../SEO";

const essays = [
  {
    title: "on forgetting",
    path: "/writing/essays/on-forgetting",
    bnPath: "/writing/essays/on-forgetting-bn",
    description: "why the mind forgets, and why that's mercy",
  },
  {
    title: "on staying small",
    path: "/writing/essays/on-staying-small",
    bnPath: "/writing/essays/on-staying-small-bn",
    description: "why i won't scale my teaching",
  },
  {
    title: "on running for nothing",
    path: "/writing/essays/on-running-for-nothing",
    bnPath: "/writing/essays/on-running-for-nothing-bn",
    description: "why I run when there's no career outcome",
  },
];

const WritingContent = () => (
  <>
    <SEO
      title="writing — niruddeshjatra"
      description="essays and tech articles by nj. mostly about running, teaching, and how i think."
      path="/writing"
    />
  <div className="animate-fade-in font-mono max-w-xl mx-auto px-4 py-6 text-foreground/85">
    <div className="pl-2 mb-6">
      <p className="mb-1"><span className="text-phosphor">&gt; </span>a place for things i write down.</p>
      <p className="mb-1"><span className="text-phosphor">&gt; </span>essays and tech articles, mostly.</p>
      <p className="mb-1"><span className="text-phosphor">&gt; </span>more coming.</p>
    </div>

    <div className="text-phosphor-dim text-sm mt-10 mb-3 font-mono">// essays</div>

    <div className="pl-2 space-y-4 sm:space-y-1">
      {essays.map((essay) => (
        <IndexRow
          key={essay.path}
          name={<Link to={essay.path} className="text-phosphor hover:underline">{essay.title}</Link>}
          description={<>
            {essay.description} · <span className="text-phosphor-dim">[en]</span>{" "}
            <Link to={essay.bnPath} className="text-phosphor-dim hover:text-phosphor">[bn]</Link>
          </>}
        />
      ))}
    </div>

    <div className="text-phosphor-dim text-sm mt-10 mb-3 font-mono">// tech articles</div>

    <div className="pl-2">
      <p className="text-phosphor-dim italic">[ no tech articles yet — one in progress ]</p>
    </div>

    <div className="mt-12 pt-3 border-t border-border/40 text-[10px] text-phosphor-dim font-mono">
      — nj · 2026-05 · this index will grow
    </div>
  </div>
  </>
);

export default WritingContent;
