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
      checkKeys: ["ncs_portal_seen_games", "ncs_portal_seen_arczero"],
      setKeys: ["ncs_portal_seen_games", "ncs_portal_seen_arczero"],
    };
  }
  if (pathname.startsWith("/games")) {
    return {
      dest: "> entering the workshop",
      checkKeys: ["ncs_portal_seen_games"],
      setKeys: ["ncs_portal_seen_games"],
    };
  }
  if (pathname.startsWith("/writing")) {
    return {
      dest: "> entering the writing",
      checkKeys: ["ncs_portal_seen_writing"],
      setKeys: ["ncs_portal_seen_writing"],
    };
  }
  if (pathname.startsWith("/blog")) {
    return {
      dest: "> entering the journal",
      checkKeys: ["ncs_portal_seen_blog"],
      setKeys: ["ncs_portal_seen_blog"],
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
  }, []);

  return { shouldShow, destination, dismiss };
}
