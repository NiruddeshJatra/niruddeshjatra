import { useEffect, useRef, useState } from "react";

const PROMPTS = [
  "the editor is not a world until the terminal does real work.",
  "ship early. ship honestly. iterate in public.",
  "const answer = 42; return answer;",
  "matrix rain is just for-loops with vibes.",
  "a portfolio is a conversation, not a resume.",
];

interface Result {
  wpm: number;
  accuracy: number;
  seconds: number;
}

const TypingChallenge = () => {
  const [prompt, setPrompt] = useState(
    () => PROMPTS[Math.floor(Math.random() * PROMPTS.length)]
  );
  const [typed, setTyped] = useState("");
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typed.length === 1 && startedAt === null) {
      setStartedAt(Date.now());
    }
    if (typed.length >= prompt.length) {
      finish();
    }
  }, [typed]); // eslint-disable-line react-hooks/exhaustive-deps

  const finish = () => {
    if (startedAt === null) return;
    const seconds = Math.max(0.5, (Date.now() - startedAt) / 1000);
    const words = prompt.trim().split(/\s+/).length;
    const wpm = Math.round((words / seconds) * 60);
    let correct = 0;
    for (let i = 0; i < prompt.length; i++) {
      if (typed[i] === prompt[i]) correct++;
    }
    const accuracy = Math.round((correct / prompt.length) * 100);
    setResult({ wpm, accuracy, seconds: Math.round(seconds * 10) / 10 });
  };

  const reset = () => {
    setPrompt(PROMPTS[Math.floor(Math.random() * PROMPTS.length)]);
    setTyped("");
    setStartedAt(null);
    setResult(null);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const renderPrompt = () => (
    <div className="font-mono text-sm leading-relaxed whitespace-pre-wrap break-words">
      {prompt.split("").map((ch, i) => {
        const t = typed[i];
        let cls = "text-muted-foreground";
        if (t !== undefined) {
          cls = t === ch ? "text-phosphor" : "text-red-400 bg-red-950/40";
        }
        if (i === typed.length) cls += " underline decoration-green-400";
        return (
          <span key={i} className={cls}>
            {ch}
          </span>
        );
      })}
    </div>
  );

  return (
    <div className="space-y-3 border border-border rounded-lg p-4 bg-card/30">
      <div className="flex items-center justify-between">
        <div className="text-phosphor text-sm font-semibold">typing-challenge.ts</div>
        <span className="text-[10px] text-muted-foreground">WPM + accuracy</span>
      </div>

      <div className="bg-black/40 border border-border rounded p-3">
        {renderPrompt()}
      </div>

      <input
        ref={inputRef}
        type="text"
        value={typed}
        onChange={(e) => !result && setTyped(e.target.value)}
        className="w-full bg-black/60 border border-border rounded px-3 py-2 font-mono text-sm outline-none focus:border-green-500"
        placeholder="start typing..."
        autoFocus
        disabled={!!result}
      />

      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-4">
          {result ? (
            <>
              <span className="text-phosphor">wpm: {result.wpm}</span>
              <span className="text-muted-foreground">
                accuracy: <span className="text-phosphor">{result.accuracy}%</span>
              </span>
              <span className="text-muted-foreground">
                time: <span className="text-phosphor">{result.seconds}s</span>
              </span>
            </>
          ) : (
            <span className="text-muted-foreground">
              progress: <span className="text-phosphor">{typed.length}</span> / {prompt.length}
            </span>
          )}
        </div>
        <button
          onClick={reset}
          className="px-3 py-1 rounded border border-border hover:border-green-500 hover:text-green-400 transition-colors font-mono text-xs"
        >
          $ reset
        </button>
      </div>
    </div>
  );
};

export default TypingChallenge;
