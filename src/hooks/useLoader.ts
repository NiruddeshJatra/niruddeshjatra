import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { PortalDestination } from "@/components/PortalLoader";

interface AreaInfo {
  dest: PortalDestination;
  checkKeys: string[];
  setKeys: string[];
}

function getArea(pathname: string): AreaInfo | null {
  if (pathname.startsWith("/games/arczero")) {
    return {
      dest: "> arczero standby",
      checkKeys: ["ncs_portal_seen_arczero"],
      setKeys: ["ncs_portal_seen_arczero"],
    };
  }
  return null;
}

// ─── IntroLoader hook ────────────────────────────────────────────────────────
// Fires once per browser session (sessionStorage, resets on tab close).

export function useIntroLoader() {
  const { prefersReducedMotion } = useReducedMotion();

  const [shouldShow, setShouldShow] = useState(() => {
    try {
      return sessionStorage.getItem("ncs_intro_seen") !== "true";
    } catch {
      return false;
    }
  });

  const dismiss = useCallback(() => {
    try {
      sessionStorage.setItem("ncs_intro_seen", "true");
    } catch {
      // storage unavailable
    }
    setShouldShow(false);
  }, []);

  // Reduced motion: set flag immediately, never show
  useEffect(() => {
    if (prefersReducedMotion && shouldShow) {
      dismiss();
    }
  }, [prefersReducedMotion, shouldShow, dismiss]);

  return { shouldShow: shouldShow && !prefersReducedMotion, dismiss };
}

// ─── PortalLoader hook ───────────────────────────────────────────────────────
// Fires once per area per session. Per-area flags reset on tab close.

export function usePortalLoader() {
  const { prefersReducedMotion } = useReducedMotion();
  const location = useLocation();
  const [shouldShow, setShouldShow] = useState(false);
  const [destination, setDestination] = useState<PortalDestination | null>(null);
  const currentAreaRef = useRef<AreaInfo | null>(null);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const area = getArea(location.pathname);
    if (!area) return;

    // If any gate key already set, skip (covers "navigating within same area" case)
    const alreadySeen = area.checkKeys.some((k) => {
      try {
        return sessionStorage.getItem(k) === "true";
      } catch {
        return true;
      }
    });
    if (alreadySeen) return;

    currentAreaRef.current = area;
    setDestination(area.dest);
    setShouldShow(true);
  }, [location.pathname, prefersReducedMotion]);

  const onCompleteRef = useRef<(() => void) | null>(null);

  const dismiss = useCallback(() => {
    const area = currentAreaRef.current;
    if (area) {
      area.setKeys.forEach((k) => {
        try {
          sessionStorage.setItem(k, "true");
        } catch {
          // storage unavailable
        }
      });
      currentAreaRef.current = null;
    }
    setShouldShow(false);
    setDestination(null);

    const onComplete = onCompleteRef.current;
    onCompleteRef.current = null;
    if (onComplete) onComplete();
  }, []);

  const triggerPortal = useCallback((config: {
    destination: PortalDestination;
    sessionKey?: string;
    onComplete?: () => void;
  }) => {
    if (prefersReducedMotion) {
      if (config.onComplete) config.onComplete();
      return;
    }
    onCompleteRef.current = config.onComplete ?? null;
    currentAreaRef.current = null;
    setDestination(config.destination);
    setShouldShow(true);
  }, [prefersReducedMotion]);

  return { shouldShow, destination, dismiss, triggerPortal };
}
