import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export type PortalDestination =
  | "> arczero standby"
  | "> entering the workshop"
  | "> entering the writing"
  | "> entering the journal";

interface Props {
  destination: PortalDestination;
  onComplete: () => void;
}

// Scramble charset — terminal/cipher/unicode aesthetic (user-extended)
const SCRAMBLE_CHARS =
  "!<>-_\\/[]{}—=+*^?#@%&ｱｲｳｴｵｶｷｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾝΔΘΛΞΣΦΨΩДЖЗИЙЛФЦЧШЫЭЮЯ⸘⸮ʁяƨꙅᗡᗺⱰ⠁⠃∑∏∞≈≠≡";
const pickChar = () =>
  SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];

// Timeline: 3.0s scramble + 0.6s hold + 0.8s cloud-veil + 2.0s dissolve = ~6.0s

const PortalLoader = ({ destination, onComplete }: Props) => {
  const { prefersReducedMotion } = useReducedMotion();
  const overlayRef = useRef<HTMLDivElement>(null);
  const cloudRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const skipRef = useRef<(() => void) | null>(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion) {
      const id = setTimeout(onComplete, 0);
      return () => clearTimeout(id);
    }

    const ctx = gsap.context(() => {
      // Pre-populate with scrambled chars before first paint — no empty-text frame
      if (textRef.current) {
        textRef.current.textContent = Array.from(destination, (ch) =>
          ch === " " ? " " : pickChar()
        ).join("");
      }

      const tracker = { progress: 0 };
      // Scramble reveal constants
      const REVEAL_START = 0.4; // first 40% = pure cycling, next 60% = left-to-right lock-in
      const CYCLE_MS = 120;      // ms between char cycles — controls rotation speed
      const cycleState = { lastTime: 0, chars: [] as string[] };

      const tl = gsap.timeline({ onComplete });
      tlRef.current = tl;

      // Phase 1 (3s): scramble reveal — overlay renders opaque (radial-gradient bg), no fade-in needed
      // - 0–40% progress: all chars cycle randomly every CYCLE_MS
      // - 40–100% progress: lock letters left-to-right; spaces preserved throughout
      tl.to(tracker, {
        progress: 1,
        duration: 3,
        ease: "none",
        onUpdate() {
          if (!textRef.current) return;
          const now = performance.now();
          const revealProgress =
            tracker.progress < REVEAL_START
              ? 0
              : (tracker.progress - REVEAL_START) / (1 - REVEAL_START);
          const locked = Math.floor(revealProgress * destination.length);
          const remaining = destination.length - locked;

          // Only regenerate random chars every CYCLE_MS — slows visible rotation speed
          if (
            now - cycleState.lastTime > CYCLE_MS ||
            cycleState.chars.length !== remaining
          ) {
            cycleState.chars = Array.from({ length: remaining }, (_, j) => {
              const ch = destination[locked + j];
              return ch === " " ? " " : pickChar();
            });
            cycleState.lastTime = now;
          }

          textRef.current.textContent =
            destination.slice(0, locked) + cycleState.chars.join("");
        },
        onComplete() {
          if (textRef.current) textRef.current.textContent = destination;
        },
      });

      // Phase 2 (0.6s gap): hold phrase visible
      // Phase 3 (0.8s): phosphor-green cloud veil rises before dissolve
      tl.to(
        cloudRef.current,
        { opacity: 0.65, duration: 0.8, ease: "power2.inOut" },
        "+=0.6"
      );
      // Phase 4 (2s + 1.5s): overlay dissolves (starts 0.4s into veil); text drifts outward
      tl.to(
        overlayRef.current,
        { autoAlpha: 0, duration: 2, ease: "power2.inOut" },
        "<0.4"
      );
      tl.to(
        textRef.current,
        { scale: 1.15, duration: 1.5, ease: "power2.inOut" },
        "<" // simultaneous with overlay dissolve
      );

      // Phase 5: onComplete fires via timeline onComplete
    }, overlayRef);

    skipRef.current = () => {
      if (tlRef.current) tlRef.current.kill();
      gsap.to(overlayRef.current, {
        autoAlpha: 0,
        duration: 1,
        ease: "power2.out",
        onComplete,
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
  }, [destination, prefersReducedMotion]); // onComplete is stable dismissPortal

  if (prefersReducedMotion) return null;

  return (
    <>
      {/* sr-only readable phrase — outside aria-hidden so screen readers announce it */}
      <span className="sr-only" aria-live="polite">
        {destination}
      </span>

      {/* No initial hidden style — overlay renders opaque, matching Suspense fallback.
          Eliminates the one-frame flash between fallback unmount and GSAP setup. */}
      <div
        ref={overlayRef}
        aria-hidden="true"
        className="fixed inset-0 z-[9999] flex items-center justify-center cursor-pointer"
        style={{
          background:
            "radial-gradient(ellipse at center, hsl(var(--background)) 60%, hsl(120 4% 3%) 100%)",
        }}
        onClick={() => skipRef.current?.()}
      >
        {/* Cloud veil — phosphor-green fog that rises before dissolve */}
        <div
          ref={cloudRef}
          className="absolute inset-0"
          style={{ opacity: 0, backgroundColor: "hsl(155 50% 14%)" }}
        />
        {/* Empty span — GSAP sets textContent before first paint via useLayoutEffect */}
        <span
          ref={textRef}
          className="relative z-10 font-mono text-3xl md:text-4xl text-phosphor tracking-wider select-none"
          style={{
            textShadow:
              "0 0 16px hsl(var(--accent) / 0.5), 0 0 32px hsl(var(--accent) / 0.25)",
          }}
        />
      </div>
    </>
  );
};

export default PortalLoader;
