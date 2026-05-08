import { CHANGELOG } from "@/constants/changelog";

const Changelog = () => (
  <div className="pl-2 font-mono text-xs">
    {CHANGELOG.map((entry, i) => (
      <div key={i} className="grid grid-cols-[7ch_7ch_1fr] gap-x-4 mb-1">
        <span className={entry.hash === "HEAD" ? "text-phosphor" : "text-phosphor-dim"}>
          {entry.hash}
        </span>
        <span className="text-phosphor-dim">{entry.date}</span>
        <span className="text-foreground/85">{entry.message}</span>
      </div>
    ))}
  </div>
);

export default Changelog;
