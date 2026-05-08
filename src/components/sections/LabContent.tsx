import { FlaskConical } from "lucide-react";
import MatrixPlayground from "./lab/MatrixPlayground";
import TypingChallenge from "./lab/TypingChallenge";

const LabContent = () => {
  return (
    <div className="space-y-6 animate-fade-in font-mono text-sm">
      <div>
        <div>
          <span className="text-phosphor">const</span>{" "}
          <span className="text-phosphor">lab</span> ={" "}
          <span className="text-phosphor">{"["}</span>
        </div>
        <p className="text-[11px] text-muted-foreground pl-4 pt-1">
          // experiments — half-baked, pinned here when interesting
        </p>
      </div>

      <div className="pl-4 space-y-6">
        <div className="flex items-start gap-2 text-xs text-muted-foreground">
          <FlaskConical className="w-4 h-4 text-phosphor flex-shrink-0 mt-0.5" />
          <p>
            Nothing here is production-grade. Polished stuff lives in{" "}
            <span className="text-phosphor">projects.txt</span>.
          </p>
        </div>

        <MatrixPlayground />
        <TypingChallenge />
      </div>

      <div>
        <span className="text-phosphor">{"];"}</span>
      </div>
    </div>
  );
};

export default LabContent;
