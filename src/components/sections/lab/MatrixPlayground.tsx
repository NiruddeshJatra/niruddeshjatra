import { useEffect, useRef, useState } from "react";

const KATAKANA = Array.from({ length: 59 }, (_, i) =>
  String.fromCodePoint(0xff65 + i)
);
const DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
const LATIN = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

type CharSet = "katakana" | "digits" | "latin" | "mixed";

const buildChars = (set: CharSet): string[] => {
  switch (set) {
    case "katakana":
      return KATAKANA;
    case "digits":
      return DIGITS;
    case "latin":
      return LATIN;
    default:
      return [...KATAKANA, ...DIGITS];
  }
};

interface Drop {
  y: number;
  speed: number;
}

const MatrixPlayground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [speed, setSpeed] = useState(50);
  const [density, setDensity] = useState(1);
  const [mirror, setMirror] = useState(true);
  const [charSet, setCharSet] = useState<CharSet>("mixed");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const cssW = canvas.clientWidth;
    const cssH = canvas.clientHeight;
    canvas.width = cssW * dpr;
    canvas.height = cssH * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const fontSize = 14;
    const chars = buildChars(charSet);
    const columns = Math.floor((cssW / fontSize) * density);
    const drops: Drop[] = Array.from({ length: columns }, () => ({
      y: Math.random() * -40,
      speed: 0.5 + Math.random() * 1,
    }));

    let raf = 0;
    let last = 0;
    const frameDelay = Math.max(16, 120 - speed);

    const draw = (t: number) => {
      if (t - last < frameDelay) {
        raf = requestAnimationFrame(draw);
        return;
      }
      last = t;

      ctx.fillStyle = "rgba(10, 14, 10, 0.1)";
      ctx.fillRect(0, 0, cssW, cssH);
      ctx.font = `${fontSize}px "JetBrains Mono", monospace`;
      ctx.textBaseline = "top";

      for (let i = 0; i < drops.length; i++) {
        const d = drops[i];
        const x = i * fontSize;
        const y = d.y * fontSize;
        const ch = chars[Math.floor(Math.random() * chars.length)];

        ctx.fillStyle = "#CFFFCF";
        if (mirror) {
          ctx.save();
          ctx.scale(-1, 1);
          ctx.fillText(ch, -x - fontSize, y);
          ctx.restore();
        } else {
          ctx.fillText(ch, x, y);
        }

        for (let j = 1; j < 8; j++) {
          const ty = y - j * fontSize;
          if (ty < 0) break;
          const a = Math.max(0, 0.8 - j * 0.1);
          ctx.fillStyle = `rgba(0, 255, 102, ${a})`;
          const tch = chars[Math.floor(Math.random() * chars.length)];
          if (mirror) {
            ctx.save();
            ctx.scale(-1, 1);
            ctx.fillText(tch, -x - fontSize, ty);
            ctx.restore();
          } else {
            ctx.fillText(tch, x, ty);
          }
        }

        d.y += d.speed;
        if (d.y * fontSize > cssH + 40) {
          d.y = Math.random() * -10;
          d.speed = 0.5 + Math.random() * 1;
        }
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => cancelAnimationFrame(raf);
  }, [speed, density, mirror, charSet]);

  return (
    <div className="space-y-3 border border-border rounded-lg p-4 bg-card/30">
      <div className="flex items-center justify-between">
        <div className="text-phosphor text-sm font-semibold">matrix-playground.tsx</div>
        <span className="text-[10px] text-muted-foreground">live canvas</span>
      </div>

      <canvas
        ref={canvasRef}
        className="w-full h-48 bg-black rounded border border-border"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        <label className="flex flex-col gap-1">
          <span className="text-muted-foreground">
            speed: <span className="text-phosphor">{speed}</span>
          </span>
          <input
            type="range"
            min={10}
            max={100}
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="accent-green-500"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-muted-foreground">
            density: <span className="text-phosphor">{density.toFixed(2)}</span>
          </span>
          <input
            type="range"
            min={0.3}
            max={2}
            step={0.05}
            value={density}
            onChange={(e) => setDensity(Number(e.target.value))}
            className="accent-green-500"
          />
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={mirror}
            onChange={(e) => setMirror(e.target.checked)}
            className="accent-green-500"
          />
          <span className="text-muted-foreground">mirror glyphs (film-accurate)</span>
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-muted-foreground">character set</span>
          <select
            value={charSet}
            onChange={(e) => setCharSet(e.target.value as CharSet)}
            className="bg-black/60 border border-border rounded px-2 py-1 font-mono text-xs"
          >
            <option value="mixed">mixed (katakana + digits)</option>
            <option value="katakana">katakana</option>
            <option value="digits">digits</option>
            <option value="latin">latin uppercase</option>
          </select>
        </label>
      </div>
    </div>
  );
};

export default MatrixPlayground;
