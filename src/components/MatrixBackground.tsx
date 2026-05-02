import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { onMatrix } from "@/lib/matrixSignals";

interface MatrixConfig {
  fontSize: number;
  animationSpeed: number;
  particleDensity: number;
  opacity: number;
}

const KATAKANA = Array.from({ length: 59 }, (_, i) =>
  String.fromCodePoint(0xff65 + i)
);
const DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
const CHARS: string[] = [...KATAKANA, ...DIGITS];

const HEAD_COLOR = "rgba(190, 255, 205, 0.58)";
const TRAIL_BRIGHT = { r: 0, g: 190, b: 82 };
const TRAIL_DIM = { r: 0, g: 51, b: 17 };
interface Drop {
  x: number;
  y: number;
  speed: number;
  length: number;
  phase: number;
}

const MatrixBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const { prefersReducedMotion } = useReducedMotion();
  const [config] = useState<MatrixConfig>({
    fontSize: 16,
    animationSpeed: 45,
    particleDensity: 0.6,
    opacity: 0.25,
  });
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const updateCanvasSize = () => {
      const dpr = window.devicePixelRatio || 1;
      const scrollContainer = container.closest(".editor-smooth-scroll");
      if (!scrollContainer) return;

      const scrollRect = scrollContainer.getBoundingClientRect();
      const canvasWidth = Math.ceil(Math.max(window.innerWidth, scrollRect.width));
      const canvasHeight = Math.ceil(Math.max(window.innerHeight, scrollContainer.scrollHeight));

      canvas.width = canvasWidth * dpr;
      canvas.height = canvasHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      canvas.style.width = `${canvasWidth}px`;
      canvas.style.height = `${canvasHeight}px`;

      setContentHeight(canvasHeight);
    };

    updateCanvasSize();

    const actualColumns = Math.floor(
      canvas.width / window.devicePixelRatio / config.fontSize
    );
    const maxDrops = Math.floor(actualColumns * config.particleDensity);
    const buildDrop = (index: number): Drop => {
      const colIndex = Math.floor((index / Math.max(1, maxDrops)) * actualColumns);
      const x = colIndex * config.fontSize;
      
      // Use overlapping sine waves to generate an 'aurora' landscape of peaks and valleys
      const wave1 = Math.sin(colIndex * 0.15) * 6;
      const wave2 = Math.sin(colIndex * 0.04 + 1) * 12;
      const wave3 = Math.sin(colIndex * 0.3) * 3;
      
      // Max possible sum is ~21. Peaks (wave heads) will have composite close to 21.
      const composite = wave1 + wave2 + wave3;
      
      // auroraCurve maps composite to a trailing distance. Peaks get 0 (start at top), valleys get up to 42 (trail behind)
      const auroraCurve = 21 - composite;
        
      return {
        x,
        // Start exactly at y=0 for the wave heads, minus the aurora curve and slight noise for natural feel
        y: 0 - auroraCurve - Math.random() * 1.5,
        speed: 0.12 + Math.random() * 0.03, // Tighter speed variance keeps the wavefronts cohesive longer
        length: 12 + Math.floor(Math.random() * 16),
        phase: composite * 0.1, // Tie the breathing phase to the aurora curve
      };
    };

    const drops: Drop[] = [];
    for (let i = 0; i < maxDrops; i++) {
      drops.push(buildDrop(i));
    }

    const pickChar = () => CHARS[Math.floor(Math.random() * CHARS.length)];

    // Reactive signals: decay values per frame
    let typeBoost = 0;      // 0..1, spikes on each keystroke then decays
    let focusBoost = 0;     // 0..1, eased toward 1 when terminal focused
    let focusTarget = 0;
    let scrollBoost = 0;    // 0..1, from scroll velocity
    let lastScrollTop = 0;
    let lastScrollTime = performance.now();

    const unsubType = onMatrix("type", () => {
      typeBoost = Math.min(1, typeBoost + 0.6);
    });
    const unsubFocusOn = onMatrix("focus-on", () => {
      focusTarget = 1;
    });
    const unsubFocusOff = onMatrix("focus-off", () => {
      focusTarget = 0;
    });

    const scrollEl = container.closest(".editor-smooth-scroll") as HTMLElement | null;
    const onScroll = () => {
      if (!scrollEl) return;
      const now = performance.now();
      const dt = Math.max(1, now - lastScrollTime);
      const dy = Math.abs(scrollEl.scrollTop - lastScrollTop);
      const velocity = dy / dt; // px per ms
      scrollBoost = Math.min(1, scrollBoost + velocity * 0.04);
      lastScrollTop = scrollEl.scrollTop;
      lastScrollTime = now;
    };
    scrollEl?.addEventListener("scroll", onScroll, { passive: true });

    const drawMirroredGlyph = (char: string, x: number, y: number) => {
      ctx.save();
      ctx.scale(-1, 1);
      ctx.fillText(char, -x - config.fontSize, y);
      ctx.restore();
    };

    let lastTime = 0;

    const draw = (currentTime: number) => {
      if (currentTime - lastTime < config.animationSpeed) {
        animationRef.current = requestAnimationFrame(draw);
        return;
      }
      lastTime = currentTime;

      // Decay reactive signals
      typeBoost = Math.max(0, typeBoost - 0.04);
      focusBoost += (focusTarget - focusBoost) * 0.08;
      scrollBoost = Math.max(0, scrollBoost - 0.05);

      const canvasWidth = canvas.width / window.devicePixelRatio;
      const canvasHeight = canvas.height / window.devicePixelRatio;

      // Typing & focus reduce fade alpha → denser trails
      const fadeAlpha = Math.max(0.11, 0.23 - typeBoost * 0.04 - focusBoost * 0.02);
      ctx.fillStyle = `rgba(10, 14, 10, ${fadeAlpha})`;
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      ctx.font = `${config.fontSize}px "JetBrains Mono", "Fira Code", monospace`;
      ctx.textBaseline = "top";

      // Focus → slight cyan-green shift on head glyph
      const headColor = focusBoost > 0.05
        ? `rgba(${Math.round(190 - focusBoost * 42)}, 255, ${Math.round(205 + focusBoost * 26)}, 0.66)`
        : HEAD_COLOR;

      const speedMul = 1 + scrollBoost * 0.65 + typeBoost * 0.18;
      const flickerProb = 0.995 - typeBoost * 0.02 - focusBoost * 0.006;
      for (let i = 0; i < drops.length; i++) {
        const drop = drops[i];
        const y = drop.y * config.fontSize;
        
        // Use phase and currentTime to create a dynamic wave effect on the speed
        const wave = 0.85 + Math.sin(currentTime * 0.0006 + drop.phase * Math.PI * 2) * 0.15;

        ctx.fillStyle = headColor;
        drawMirroredGlyph(pickChar(), drop.x, y);

        for (let j = 1; j < drop.length; j++) {
          const trailY = y - j * config.fontSize;
          if (trailY < 0) break;
          const t = j / drop.length;
          const r = Math.round(TRAIL_BRIGHT.r + (TRAIL_DIM.r - TRAIL_BRIGHT.r) * t);
          const g = Math.round(TRAIL_BRIGHT.g + (TRAIL_DIM.g - TRAIL_BRIGHT.g) * t);
          const b = Math.round(TRAIL_BRIGHT.b + (TRAIL_DIM.b - TRAIL_BRIGHT.b) * t);
          const a = Math.max(0, 0.45 - t * 0.45);
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
          drawMirroredGlyph(pickChar(), drop.x, trailY);
        }

        if (Math.random() > flickerProb && y > 0 && y < canvasHeight) {
          ctx.fillStyle = "rgba(0, 255, 102, 0.3)";
          const flickerY = y - Math.floor(Math.random() * Math.min(drop.length, 10)) * config.fontSize;
          drawMirroredGlyph(pickChar(), drop.x, flickerY);
        }

        drop.y += drop.speed * wave * speedMul;

        if (drop.y * config.fontSize > canvasHeight + drop.length * config.fontSize) {
          drops[i] = buildDrop(i);
        }
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    animationRef.current = requestAnimationFrame(draw);

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (
          entry.target === container ||
          entry.target.closest(".editor-smooth-scroll")
        ) {
          updateCanvasSize();
          const newActualColumns = Math.floor(
            canvas.width / window.devicePixelRatio / config.fontSize
          );
          const newMaxDrops = Math.floor(
            newActualColumns * config.particleDensity
          );
          while (drops.length < newMaxDrops) {
            drops.push(buildDrop(drops.length));
          }
          drops.length = newMaxDrops;
        }
      }
    });

    resizeObserver.observe(container);
    const scrollContainer = container.closest(".editor-smooth-scroll");
    if (scrollContainer) resizeObserver.observe(scrollContainer);
    window.addEventListener("resize", updateCanvasSize);

    const mutationObserver = new MutationObserver(() => updateCanvasSize());
    if (scrollContainer) {
      mutationObserver.observe(scrollContainer, {
        childList: true,
        subtree: true,
        characterData: true,
      });
    }

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      resizeObserver.disconnect();
      mutationObserver.disconnect();
      window.removeEventListener("resize", updateCanvasSize);
      scrollEl?.removeEventListener("scroll", onScroll);
      unsubType();
      unsubFocusOn();
      unsubFocusOff();
    };
  }, [config, prefersReducedMotion]);

  if (prefersReducedMotion) {
    return (
      <div
        className="fixed inset-0 pointer-events-none bg-gradient-to-b from-green-950/30 via-black to-black"
        aria-hidden="true"
      />
    );
  }

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ height: contentHeight || "100vh" }}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="block"
        style={{
          opacity: config.opacity,
          willChange: "transform",
          transform: "translate3d(0,0,0)",
          zIndex: 0,
        }}
      />
    </div>
  );
};

export default MatrixBackground;
