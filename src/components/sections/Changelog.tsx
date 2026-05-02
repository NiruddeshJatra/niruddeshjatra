import { useNavigate } from "react-router-dom";
import { GitCommit } from "lucide-react";
import { CHANGELOG } from "@/constants/changelog";

const Changelog = () => {
  const navigate = useNavigate();

  return (
    <div className="mt-8 border border-border rounded-lg p-4 bg-card/30">
      <div className="flex items-center gap-2 mb-3">
        <GitCommit className="w-4 h-4 text-phosphor" />
        <div className="text-phosphor text-sm font-semibold">$ git log --recent</div>
        <span className="text-[10px] text-muted-foreground ml-auto">
          last {CHANGELOG.length} updates
        </span>
      </div>

      <ul className="space-y-2 font-mono text-xs">
        {CHANGELOG.map((entry, i) => {
          const body = (
            <>
              <span className="text-phosphor shrink-0">{entry.date}</span>
              <span className="text-phosphor shrink-0">[{entry.section}]</span>
              <span className="text-foreground/90">{entry.summary}</span>
            </>
          );

          if (entry.target) {
            const onClick = () => {
              if (entry.target!.startsWith("http")) {
                window.open(entry.target, "_blank");
              } else {
                navigate(entry.target!);
              }
            };
            return (
              <li key={i}>
                <button
                  onClick={onClick}
                  className="flex items-start gap-2 w-full text-left hover:text-foreground transition-colors group"
                >
                  <span className="text-phosphor shrink-0 group-hover:translate-x-0.5 transition-transform">
                    →
                  </span>
                  {body}
                </button>
              </li>
            );
          }

          return (
            <li key={i} className="flex items-start gap-2">
              <span className="text-muted-foreground/60 shrink-0">·</span>
              {body}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Changelog;
