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
    className="animate-fade-in font-mono max-w-2xl mx-auto px-4 py-6 text-[13px] sm:text-[15px] leading-[1.7] sm:leading-[1.8] text-foreground/85"
    {...(currentLang === "bn" ? { lang: "bn" } : {})}
  >
    <div className="flex justify-end items-baseline gap-3 mb-6 text-xs font-mono">
      {currentLang === "en" ? (
        <span className="text-phosphor">[en]</span>
      ) : (
        <Link to={alternateLangPath} className="text-phosphor-dim hover:text-phosphor">[en]</Link>
      )}
      {currentLang === "bn" ? (
        <span className="text-phosphor">[bn]</span>
      ) : (
        <Link to={alternateLangPath} className="text-phosphor-dim hover:text-phosphor">[bn]</Link>
      )}
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
