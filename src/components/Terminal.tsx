import { useState, useEffect, useRef } from "react";
import { Terminal as TerminalIcon, ChevronRight, GitBranch, Clock } from "lucide-react";
import { emitMatrix } from "@/lib/matrixSignals";
import { SECTION_ALIASES } from "@/constants/sections";
import { verifyPassphrase, unlockVault } from "@/lib/vault";

interface TerminalProps {
  onCommand: (command: string) => void;
  currentSection: string;
  onThemeChange?: (theme: { name: string; bg: string; accent: string }) => void;
  isFocused?: boolean;
  onFocusChange?: (focused: boolean) => void;
}

const COMMANDS = [
  "help",
  "whoami",
  "ls",
  "cat about.md",
  "cat now.md",
  "cat blog.md",
  "cd lab",
  "cd notes",
  "cd /",
  "open about",
  "open now",
  "games",
  "games arczero",
  "contact",
  "clear",
  "github",
  "linkedin",
  "secrets",
  "theme matrix",
  "vault",
];


const FORTUNES = [
  'The best code is the code you don\'t have to write.',
  'Ship early. Ship honestly. Iterate in public.',
  'Matrix rain is just for-loops with vibes.',
  'A portfolio is a conversation, not a résumé.',
  'Legibility is a feature. Ship boring APIs.',
  'The map is not the terminal.',
];

const GIT_LOG_TIMELINE = [
  'commit a1b2c3d  2026-04  site: rewriting myself in public',
  'commit 9f8e7d6  2026-04  workshop: arczero ready to ship',
  'commit 7c5d3a2  2026-04  meta: resigned. no more jobs.',
  'commit 4e2b1a0  2025-09  body: started training for 100k',
  'commit 2x1y0z3  2022-01  brain: returned to cs on my own terms',
  'commit 0000000  2018-01  road: dropped cuet year one, started reading',
];

const EASTER_EGGS: { [key: string]: string[] } = {
  'whoami --deep': [
    'hi, i\'m nasif, expressively nj.',
    'i make things. i think about things. i write some of it down.',
    'i tutor for a living, run long distance, and try to explore whatever I find interesting.',
    'the rest of the story is on the public pages — me/about.md is the right place to start.',
    '',
  ],
  'fortune': [],
  'git log --author=nasif': GIT_LOG_TIMELINE.concat(''),
  'about nasif': [
    '> cat me/about.md',
    "nj's full name is nasiful alam.",
    "he doesn't lead with it. read me/about.md if you want the rest.",
    '',
  ],
  'sudo sudo': [
    'With great privilege comes great responsibility.',
    'Permission denied on philosophy.',
    '',
  ],
};

const Terminal = ({ onCommand, currentSection, onThemeChange, isFocused = false, onFocusChange }: TerminalProps) => {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([
    "$ welcome to niruddeshjatra.space",
    "$ type 'help' for commands, or click a file in the sidebar",
    "$ tab = autocomplete · ↑/↓ = recall · 'secrets' = hidden commands",
    "",
  ]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [time, setTime] = useState(new Date());
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  useEffect(() => {
    if (input) {
      const filtered = COMMANDS.filter((cmd) =>
        cmd.toLowerCase().startsWith(input.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [input]);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCommand = async (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    const newHistory = [...history, `$ ${cmd}`];

    if (trimmedCmd === "fortune") {
      const quote = FORTUNES[Math.floor(Math.random() * FORTUNES.length)];
      newHistory.push(`> ${quote}`, "");
    } else if (EASTER_EGGS[trimmedCmd]) {
      newHistory.push(...EASTER_EGGS[trimmedCmd]);
    } else if (trimmedCmd === "secrets" || trimmedCmd === "easter eggs") {
      newHistory.push(
        "• Hidden commands:",
        "  whoami --deep              - the lighter version of who i am",
        "  git log --author=nasif     - rolling micro-timeline",
        "  fortune                    - rotating quote from my notes",
        "  about nasif                - alias for cat about.md",
        "  unlock <passphrase>        - if you know, you know",
        "  vault                      - if you've already unlocked, jump there",
        "  sudo sudo                  - recursion warning",
        ""
      );
    } else if (trimmedCmd === "help") {
      newHistory.push(
        "Available commands:",
        "  whoami           - Display information about me",
        "  ls               - List all sections",
        "  cat <file>       - Display content (about.md, now.md, blog.md)",
        "  cd <section>     - Navigate (about, lab, notes, now, or '/')",
        "  open <file>      - Alias for cat/cd",
        "  games            - Open games index",
        "  games arczero    - Navigate to ArcZero",
        "  contact          - Show contact information",
        "  github           - Open GitHub profile",
        "  linkedin         - Open LinkedIn profile",
        "  theme matrix     - Change to matrix theme",
        "  secrets          - Show hidden commands",
        "  clear            - Clear terminal",
        ""
      );
    } else if (trimmedCmd === "whoami") {
      newHistory.push(
        "nj. they call me niruddeshjatra online.",
        "chattogram, bangladesh.",
        "i tutor. i make games. i run.",
        "no longer for hire.",
        "mail: nasifulalam1212@gmail.com",
        ""
      );
    } else if (trimmedCmd === "ls") {
      newHistory.push(
        "me/about.md",
        "games/",
        "writing/blog.md",
        "writing/notes/",
        "journey/running.md",
        "journey/hiking.md",
        "field-notes/",
        "photos/",
        "archived/",
        "now.md",
        "contact.md",
        ""
      );
    } else if (trimmedCmd.startsWith("cd ") || trimmedCmd === "cd") {
      const target = trimmedCmd === "cd" ? "~" : trimmedCmd.substring(3).trim();
      const section = SECTION_ALIASES[target];
      if (section) {
        onCommand(section);
        newHistory.push(
          section === "welcome" ? "> /" : `> cd /${section}`,
          ""
        );
      } else {
        newHistory.push(`! cd: ${target}: No such directory`, "");
      }
    } else if (trimmedCmd.startsWith("open ")) {
      const target = trimmedCmd.substring(5).trim();
      const section = SECTION_ALIASES[target];
      if (section) {
        onCommand(section);
        newHistory.push(`> opening ${target}…`, "");
      } else {
        newHistory.push(`! open: ${target}: No such file`, "");
      }
    } else if (trimmedCmd === "clear") {
      setHistory([]);
      setInput("");
      return;
    } else if (trimmedCmd === "github") {
      newHistory.push("Opening GitHub profile...", "");
      window.open("https://github.com/niruddeshjatra", "_blank");
    } else if (trimmedCmd === "linkedin") {
      newHistory.push("Opening LinkedIn profile...", "");
      window.open("https://www.linkedin.com/in/nasiful-alam", "_blank");
    } else if (trimmedCmd.startsWith("theme ")) {
      const themeName = trimmedCmd.substring(6).trim();
      const matrixTheme = { name: 'matrix', bg: '#0d0d0d', accent: '#00ff00' };

      if (themeName === 'matrix' && onThemeChange) {
        onThemeChange(matrixTheme);
        newHistory.push(`ok · theme: ${themeName}`, "");
      } else {
        newHistory.push(`! unknown theme: ${themeName}`, "available: matrix", "");
      }
    } else if (trimmedCmd.startsWith("cat ")) {
      const file = trimmedCmd.substring(4).trim();
      const section = SECTION_ALIASES[file];
      const isDirSection = section === "lab" || section === "notes" || section === "games" || section === "field-notes" || section === "photos";
      if (section && section !== "welcome" && !isDirSection) {
        onCommand(section);
        newHistory.push(`> loading ${file}…`, "");
      } else if (isDirSection) {
        newHistory.push(`! cat: ${file}: is a directory — try 'cd ${section}'`, "");
      } else {
        newHistory.push(`! cat: ${file}: no such file or directory`, "");
      }
    } else if (trimmedCmd === "games arczero") {
      newHistory.push("> launching arczero…", "");
      window.location.href = "/games/arczero/";
    } else if (trimmedCmd === "games") {
      onCommand("games");
      newHistory.push("> opening games…", "");
    } else if (trimmedCmd === "contact") {
      onCommand("contact");
      newHistory.push("> opening contact…", "");
    } else if (trimmedCmd.startsWith("unlock ")) {
      const passphrase = cmd.substring(7).trim();
      const isValid = await verifyPassphrase(passphrase);
      if (isValid) {
        unlockVault();
        newHistory.push("ok · vault unlocked", "");
        setHistory(newHistory);
        setCommandHistory([...commandHistory, cmd]);
        setHistoryIndex(-1);
        setInput("");
        window.location.href = "/vault/the-real-story";
        return;
      } else {
        newHistory.push("! incorrect", "");
      }
    } else if (trimmedCmd === "vault") {
      newHistory.push("> opening vault…", "");
      window.location.href = "/vault";
    } else if (trimmedCmd === "coffee") {
      newHistory.push("> ☕ no coffee. only chai.", "");
    } else if (trimmedCmd !== "") {
      newHistory.push(`! command not found: ${trimmedCmd}`, "type 'help' for available commands", "");
    }

    setHistory(newHistory);
    setCommandHistory([...commandHistory, cmd]);
    setHistoryIndex(-1);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleCommand(input);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex =
          historyIndex === -1
            ? commandHistory.length - 1
            : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setInput("");
        } else {
          setHistoryIndex(newIndex);
          setInput(commandHistory[newIndex]);
        }
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      if (suggestions.length > 0) {
        setInput(suggestions[0]);
      }
    } else if (e.key === "Escape") {
      (e.target as HTMLInputElement).blur();
    }
  };

  const stats = [
    { icon: GitBranch, label: 'Branch', value: 'main', color: 'text-phosphor' },
  ];

  return (
    <div className="h-full flex flex-col bg-black/90 backdrop-blur-sm overflow-hidden">
      {/* Header bar */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-black/80 shrink-0">
        <TerminalIcon className="w-4 h-4 text-phosphor" />
        <span className="text-xs font-semibold uppercase tracking-wide">Terminal</span>
        <div className="ml-auto flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] text-muted-foreground">bash</span>
        </div>
      </div>

      {/* Input prompt — sits below header, always visible in collapsed state */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-border/40 bg-black/90 shrink-0 relative">
        <ChevronRight className="w-4 h-4 text-phosphor flex-shrink-0 animate-pulse" />
        <div className="relative flex-1 flex items-center font-mono overflow-hidden">
          <span className="text-gray-100 whitespace-pre">{input}</span>
          <span className="cursor-blink text-phosphor font-bold ml-0.5">▋</span>
          {!input && (
            <span className="absolute left-0 text-gray-600 pointer-events-none">Type 'help' for commands...</span>
          )}
          <input
            ref={inputRef}
            id="terminal-input"
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              emitMatrix("type");
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => { emitMatrix("focus-on"); onFocusChange?.(true); }}
            onBlur={() => { emitMatrix("focus-off"); onFocusChange?.(false); }}
            className="absolute inset-0 opacity-0 cursor-text text-transparent bg-transparent border-none outline-none w-full h-full"
            autoFocus
          />
        </div>
        {suggestions.length > 0 && input && (
          <span className="text-muted-foreground text-xs shrink-0">
            <span className="text-phosphor/70 font-semibold">→</span> {suggestions[0]}
          </span>
        )}
      </div>

      {/* History — clipped by outer container when collapsed */}
      <div
        ref={terminalRef}
        className="flex-1 overflow-y-auto px-4 pt-3 pb-2 space-y-1 text-sm custom-scrollbar"
      >
        {history.map((line, index) => (
          <div key={index} className="whitespace-pre-wrap font-mono animate-fade-in">
            {line.startsWith("$") ? (
              <span className="text-phosphor font-semibold">{line}</span>
            ) : line.includes("Loading") || line.includes("Opening") || line.includes("loading") || line.includes("opening") || line.includes("launching") ? (
              <span className="text-phosphor">{line}</span>
            ) : line.startsWith("!") || line.includes("not found") || line.includes("No such") ? (
              <span className="text-danger">{line}</span>
            ) : line.startsWith("ok") ? (
              <span className="text-phosphor">{line}</span>
            ) : (
              <span className="text-foreground">{line}</span>
            )}
          </div>
        ))}
      </div>

      {/* Stats + Tips — only visible when expanded */}
      {isFocused && (
        <div className="px-4 py-1 border-t border-border bg-black/80 backdrop-blur-sm shrink-0">
          <div className="flex items-center justify-between text-xs mb-2">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-phosphor">
                <Clock className="w-3 h-3" />
                <span>{time.toLocaleTimeString()}</span>
              </div>
              {stats.map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <div key={i} className={`flex items-center gap-1.5 ${stat.color}`}>
                    <Icon className="w-3 h-3" />
                    <span>{stat.label}: {stat.value}</span>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-phosphor">💡 Tip:</span>
              <span>Tab for autocomplete • ↑↓ for history • Try 'secrets' for fun</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Terminal;
