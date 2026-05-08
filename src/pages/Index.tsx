import { useState, useEffect, useCallback, lazy, Suspense } from "react";
import { flushSync } from "react-dom";
import { useLocation, useNavigate } from "react-router-dom";
import ResponsiveLayout from "@/components/ResponsiveLayout";
import { MemoryManager } from "@/utils/memoryOptimization";
import { getPerformanceMonitor } from "@/utils/performance";
import { startViewTransition } from "@/lib/viewTransition";
import { useIntroLoader, usePortalLoader } from "@/hooks/useLoader";

const IntroLoader = lazy(() => import("@/components/IntroLoader"));
const PortalLoader = lazy(() => import("@/components/PortalLoader"));

interface Theme {
  name: string;
  bg: string;
  accent: string;
}

const pathToSection = (pathname: string): string => {
  const trimmed = pathname.replace(/^\/+|\/+$/g, "");
  return trimmed === "" ? "welcome" : trimmed;
};

interface IndexProps {
  forceSection?: string;
}

const Index = ({ forceSection }: IndexProps = {}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentSection = forceSection ?? pathToSection(location.pathname);

  const { shouldShow: showIntro, dismiss: dismissIntro } = useIntroLoader();
  const { shouldShow: showPortal, destination: portalDest, dismiss: dismissPortal } = usePortalLoader();

  const [theme, setTheme] = useState<Theme>({
    name: "matrix",
    bg: "#0d0d0d",
    accent: "#00ff00",
  });

  useEffect(() => {
    MemoryManager.init();
    const performanceMonitor = getPerformanceMonitor();
    return () => {
      performanceMonitor.destroy();
      MemoryManager.destroy();
    };
  }, []);

  const handleSectionChange = useCallback(
    (section: string) => {
      const target = section === "welcome" ? "/" : `/${section}`;
      if (location.pathname !== target) {
        startViewTransition(() => {
          flushSync(() => navigate(target));
        });
      }
    },
    [navigate, location.pathname]
  );

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  return (
    <div className="h-screen overflow-hidden relative">
      <ResponsiveLayout
        currentSection={currentSection}
        onSectionChange={handleSectionChange}
        theme={theme}
        onThemeChange={handleThemeChange}
      />
      {/* Black overlay shown immediately while lazy chunk loads — prevents website flash */}
      <Suspense fallback={showIntro ? <div className="fixed inset-0 z-[9999] bg-background" aria-hidden="true" /> : null}>
        {showIntro && (
          <IntroLoader onComplete={dismissIntro} onSkip={dismissIntro} />
        )}
      </Suspense>
      <Suspense fallback={showPortal ? <div className="fixed inset-0 z-[9999] bg-background" aria-hidden="true" /> : null}>
        {showPortal && portalDest && (
          <PortalLoader destination={portalDest} onComplete={dismissPortal} />
        )}
      </Suspense>
    </div>
  );
};

export default Index;
