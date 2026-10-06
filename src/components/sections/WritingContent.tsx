import { useNavigate } from "react-router-dom";
import { firePortal } from "@/hooks/useLoader";
import IndexRow from "./IndexRow";
import SEO from "../SEO";
import { SERIES_HUB_PATH, SERIES_TITLE } from "@/articles/manifest";

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

const techArticles = [
  {
    title: "the machine beneath your code",
    path: "/writing/the-machine-beneath-your-code",
    description: "intro · hardware & OS from ground up",
  },
  {
    title: "what's inside a bit?",
    path: "/writing/whats-inside-a-bit",
    description: "part 01 · transistors, voltage, memory",
  },
  {
    title: "how does anything become 0s and 1s?",
    path: "/writing/how-does-anything-become-bits",
    description: "part 02 · encoding, numbers, text",
  },
  {
    title: "the cpu's blueprint",
    path: "/writing/cpu-blueprint",
    description: "part 03 · ALU, register, bus, clock",
  },
  {
    title: "heartbeat: fetch-decode-execute",
    path: "/writing/heartbeat-fde",
    description: "part 04 · program counter, IR, control unit",
  },
  {
    title: "the memory hierarchy",
    path: "/writing/memory-hierarchy",
    description: "part 05 · cache, locality, SRAM vs DRAM",
  },
  {
    title: "operating system — the grand conductor",
    path: "/writing/os-grand-conductor",
    description: "part 06 · processes, scheduling, virtual memory",
  },
  {
    title: "from code to machine code",
    path: "/writing/code-to-machine-code",
    description: "part 07 · compiler, interpreter, bytecode, JIT",
  },
  {
    title: "from the keyboard's 'a' to the screen's 'a'",
    path: "/writing/from-keypress-to-screen",
    description: "part 08 · the whole relay, end to end",
  },
];

const WritingContent = () => {
  const navigate = useNavigate();

  const goArticle = (path: string) => {
    firePortal({ destination: '> Entering the tech world', onComplete: () => navigate(path) });
  };

  return (
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
              name={<a href={essay.path} className="text-phosphor hover:underline cursor-pointer">{essay.title}</a>}
              description={<>
                {essay.description} · <span className="text-phosphor-dim">[en]</span>{" "}
                <a href={essay.bnPath} className="text-phosphor-dim hover:text-phosphor">[bn]</a>
              </>}
            />
          ))}
        </div>

        <div className="text-phosphor-dim text-sm mt-10 mb-3 font-mono">// tech articles</div>

        <div className="pl-2 space-y-4 sm:space-y-1">
          <IndexRow
            name={
              <button
                onClick={() => goArticle(SERIES_HUB_PATH)}
                className="text-phosphor hover:underline cursor-pointer bg-transparent border-none p-0 font-mono text-left"
              >
                {SERIES_TITLE}
              </button>
            }
            description={<>a complete 8-part series on how computers actually work, from voltage to pixels</>}
          />
          <div className="pl-4 space-y-2 sm:space-y-1">
            {techArticles.map((a) => (
              <IndexRow
                key={a.path}
                name={
                  <button
                    onClick={() => goArticle(a.path)}
                    className="text-phosphor-soft hover:underline cursor-pointer bg-transparent border-none p-0 font-mono text-sm text-left"
                  >
                    {a.title}
                  </button>
                }
                description={<span className="text-xs">{a.description}</span>}
              />
            ))}
          </div>
        </div>

        <div className="mt-12 pt-3 border-t border-border/40 text-[10px] text-phosphor-dim font-mono">
          — nj · 2026-10 · this index will grow
        </div>
      </div>
    </>
  );
};

export default WritingContent;
