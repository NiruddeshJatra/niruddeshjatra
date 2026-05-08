import { useEffect, useState } from "react";
import { GitBranch, Clock, Circle } from "lucide-react";

interface StatusBarProps {
  currentSection: string;
}

const getPath = (section: string): string => {
  switch (section) {
    case "welcome": return "~/niruddeshjatra";
    case "about": return "~/niruddeshjatra/me/about.md";
    case "games": return "~/niruddeshjatra/games/";
    case "blog": return "~/niruddeshjatra/writing/blog.md";
    case "notes": return "~/niruddeshjatra/writing/notes/";
    case "journey": return "~/niruddeshjatra/journey/";
    case "journey-running": return "~/niruddeshjatra/journey/running.md";
    case "journey-hiking": return "~/niruddeshjatra/journey/hiking.md";
    case "field-notes": return "~/niruddeshjatra/field-notes/";
    case "photos": return "~/niruddeshjatra/photos/";
    case "archived-experience": return "~/niruddeshjatra/archived/experience.txt";
    case "archived-education": return "~/niruddeshjatra/archived/education.txt";
    case "archived-projects": return "~/niruddeshjatra/archived/projects.txt";
    case "archived-skills": return "~/niruddeshjatra/archived/skills.json";
    case "now": return "~/niruddeshjatra/now.md";
    case "contact": return "~/niruddeshjatra/contact.md";
    case "lab": return "~/niruddeshjatra/lab/";
    case "writing": return "~/niruddeshjatra/writing/";
    case "writing/on-running-for-nothing": return "~/niruddeshjatra/writing/on-running-for-nothing.md";
    case "writing/on-running-for-nothing-bn": return "~/niruddeshjatra/writing/on-running-for-nothing.bn.md";
    default: return `~/niruddeshjatra/${section}`;
  }
};

const LAST_UPDATED: Record<string, string> = {
  welcome: "2026-04-29",
  about: "2026-04-29",
  games: "2026-04-29",
  now: "2026-04-29",
  contact: "2026-04-29",
  writing: "2026-05",
  "writing/on-running-for-nothing": "2026-05",
  "writing/on-running-for-nothing-bn": "2026-05",
  blog: "pending",
  notes: "pending",
  journey: "2026-05",
  "journey-running": "2026-05",
  "journey-hiking": "pending",
  "field-notes": "pending",
  photos: "eventually",
  "archived-experience": "archived",
  "archived-education": "archived",
  "archived-projects": "archived",
  "archived-skills": "archived",
  lab: "2026-04-20",
};

const StatusBar = ({ currentSection }: StatusBarProps) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const path = getPath(currentSection);
  const lastUpdated = LAST_UPDATED[currentSection] ?? "—";

  return (
    <div className="h-6 bg-primary/10 border-t border-border flex items-center justify-between px-3 text-[11px] font-mono">
      <div className="flex items-center gap-4 min-w-0">
        <div className="flex items-center gap-1.5 text-phosphor shrink-0">
          <GitBranch className="w-3 h-3" />
          <span>main</span>
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground truncate">
          <Circle className="w-2 h-2 fill-green-500 stroke-none shrink-0" />
          <span className="truncate">{path}</span>
        </div>
        <div className="hidden md:flex items-center gap-1.5 text-muted-foreground shrink-0">
          <span>updated:</span>
          <span>{lastUpdated}</span>
        </div>
      </div>

      <div className="flex items-center gap-3 text-muted-foreground shrink-0">
        <div className="hidden sm:flex items-center gap-1.5">
          <Clock className="w-3 h-3" />
          <span>{time.toLocaleTimeString([], { hour12: false })}</span>
        </div>
      </div>
    </div>
  );
};

export default StatusBar;
