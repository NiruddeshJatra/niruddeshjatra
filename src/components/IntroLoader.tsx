import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const LINES = [
  "$ initializing niruddeshjatra.space",
  "$ loading: matrix rain... ok",
  "$ loading: editor shell... ok",
];

// Timeline: 3×1.0 typing + 2×0.6 pauses + 0.7 hold + 1.0 fade-out = 5.9s
const LINE_DURATION = 1;
const PAUSE_BETWEEN = 0.6;
const HOLD_AFTER = 0.7;
const FADE_OUT = 1;

interface Props {
  onComplete: () => void;
  onSkip: () => void;
}

const IntroLoader = ({ onComplete, onSkip }: Props) => {
  const { prefersReducedMotion } = useReducedMotion();
  const overlayRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const skipRef = useRef<(() => void) | null>(null);
  const [activeLine, setActiveLine] = useState<number>(-1);

  useEffect(() => {
    if (prefersReducedMotion) {
      onSkip();
      return;
    }

    const ctx = gsap.context(() => {
      // No gsap.set needed — overlay renders opaque (bg-background), matching Suspense fallback.
      const tl = gsap.timeline();
      tlRef.current = tl;

      // Type each line sequentially: 1.0s per line, 0.6s pause between
      LINES.forEach((line, i) => {
        const lineText = line.slice(2); // strip "$ " prefix
        const tracker = { chars: 0 };
        const position = i === 0 ? ">" : `+=${PAUSE_BETWEEN}`;

        tl.call(() => setActiveLine(i), undefined, position);

        tl.to(tracker, {
          chars: lineText.length,
          duration: LINE_DURATION,
          ease: "none",
          onUpdate() {
            const el = lineRefs.current[i];
            if (el) el.textContent = lineText.slice(0, Math.round(tracker.chars));
          },
          onComplete() {
            const el = lineRefs.current[i];
            if (el) el.textContent = lineText;
          },
        });
      });

      // Hold 0.7s with cursor on last line, then fade out 1.0s
      // onStart removes cursor exactly when fade begins
      tl.to(overlayRef.current, {
        autoAlpha: 0,
        duration: FADE_OUT,
        ease: "power2.inOut",
        onStart() { setActiveLine(-1); },
        onComplete,
      }, `+=${HOLD_AFTER}`);

    }, overlayRef);

    skipRef.current = () => {
      if (tlRef.current) tlRef.current.kill();
      gsap.to(overlayRef.current, {
        autoAlpha: 0,
        duration: 0.2,
        ease: "power2.out",
        onComplete: onSkip,
      });
    };

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") skipRef.current?.();
    };
    window.addEventListener("keydown", handleKey);

    return () => {
      ctx.revert();
      window.removeEventListener("keydown", handleKey);
    };
  }, [prefersReducedMotion]); // onComplete/onSkip are stable dismissIntro callbacks

  if (prefersReducedMotion) return null;

  return (
    // No initial hidden style — overlay renders opaque, visually identical to Suspense fallback.
    // This eliminates the one-frame flash between fallback unmount and GSAP setup.
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9999] bg-background flex items-center justify-center"
      onClick={() => skipRef.current?.()}
    >
      {/* Terminal block — stop propagation so inner clicks don't skip */}
      <div
        className="font-mono text-sm leading-loose max-w-[560px] w-full px-8"
        onClick={(e) => e.stopPropagation()}
      >
        {LINES.map((_line, i) => (
          <div key={i} className="flex items-baseline">
            <span className="text-phosphor select-none">{"$ "}</span>
            <span
              ref={(el) => { lineRefs.current[i] = el; }}
              className="text-phosphor-soft"
            />
            {activeLine === i && (
              <span className="text-phosphor animate-blink ml-px select-none">▋</span>
            )}
          </div>
        ))}
      </div>

      <button
        className="absolute bottom-6 right-6 text-phosphor-dim hover:text-phosphor text-sm font-mono transition-colors"
        onClick={(e) => { e.stopPropagation(); skipRef.current?.(); }}
        aria-label="Skip intro"
      >
        skip [esc]
      </button>
    </div>
  );
};

export default IntroLoader;
