import { ReactNode } from "react";
import { Link } from "react-router-dom";

interface EssayContentProps {
  title: string;
  subtitle?: string;
  currentLang: "en" | "bn";
  alternateLangPath: string;
  alternateLang: "en" | "bn";
  readTime: string;
  wordCount: string;
  lastUpdated: string;
  children: ReactNode;
}

const EssayContent = ({
  title,
  subtitle,
  currentLang,
  alternateLangPath,
  readTime,
  wordCount,
  lastUpdated,
  children,
}: EssayContentProps) => (
  <div
    className="animate-fade-in font-mono max-w-2xl mx-auto px-4 py-6 text-base leading-[1.8] text-foreground/85"
    {...(currentLang === "bn" ? { lang: "bn" } : {})}
  >
    <div className="flex justify-end gap-3 mb-6 text-xs font-mono">
      <span className={currentLang === "en" ? "text-phosphor" : "text-phosphor-dim hover:text-phosphor"}>
        {currentLang === "en" ? "[en]" : <Link to={alternateLangPath}>[en]</Link>}
      </span>
      <span className={currentLang === "bn" ? "text-phosphor" : "text-phosphor-dim hover:text-phosphor"}>
        {currentLang === "bn" ? "[bn]" : <Link to={alternateLangPath}>[bn]</Link>}
      </span>
    </div>

    <div className="mb-2">
      {currentLang === 'bn' ? (
        <h1 className="text-xl tracking-[0.1em] mb-1 text-foreground">{title}</h1>
      ) : (
        <h1 className="text-xl tracking-[0.15em] uppercase mb-1 text-foreground">{title}</h1>
      )}
      {subtitle && <p className="text-xs text-foreground/45 mb-8">{subtitle}</p>}
    </div>

    {children}

    <div className="mt-12 pt-3 border-t border-border/40 text-[10px] text-phosphor-dim font-mono">
      — nj · {lastUpdated} · {wordCount} · {readTime}
    </div>
  </div>
);

export default EssayContent;
