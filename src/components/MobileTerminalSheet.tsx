import { useState, useEffect, useRef, lazy, Suspense } from 'react';

const LazyTerminal = lazy(() => import('./Terminal'));

interface Theme {
  name: string;
  bg: string;
  accent: string;
}

interface MobileTerminalSheetProps {
  currentSection: string;
  onCommand: (cmd: string) => void;
  onThemeChange?: (theme: Theme) => void;
}

const MobileTerminalSheet: React.FC<MobileTerminalSheetProps> = ({
  currentSection,
  onCommand,
  onThemeChange,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [keyboardOffset, setKeyboardOffset] = useState(0);
  const touchStartY = useRef<number | null>(null);
  const touchCurrentY = useRef<number | null>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  // Focus management: save focus on open, restore on close
  useEffect(() => {
    if (isExpanded) {
      previouslyFocusedRef.current = document.activeElement as HTMLElement | null;
      sheetRef.current?.focus();
    } else if (previouslyFocusedRef.current) {
      previouslyFocusedRef.current.focus();
      previouslyFocusedRef.current = null;
    }
  }, [isExpanded]);

  // Tap outside to close
  useEffect(() => {
    if (!isExpanded) return;
    const handler = (e: MouseEvent | TouchEvent) => {
      if (sheetRef.current && !sheetRef.current.contains(e.target as Node)) {
        setIsExpanded(false);
      }
    };
    document.addEventListener('touchstart', handler);
    document.addEventListener('mousedown', handler);
    return () => {
      document.removeEventListener('touchstart', handler);
      document.removeEventListener('mousedown', handler);
    };
  }, [isExpanded]);

  // Escape to close
  useEffect(() => {
    if (!isExpanded) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsExpanded(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isExpanded]);

  // Swipe-down to dismiss — refs avoid re-renders during drag
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    touchCurrentY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchCurrentY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = () => {
    if (touchStartY.current !== null && touchCurrentY.current !== null) {
      if (touchCurrentY.current - touchStartY.current > 50) {
        setIsExpanded(false);
      }
    }
    touchStartY.current = null;
    touchCurrentY.current = null;
  };

  // visualViewport keyboard offset
  useEffect(() => {
    if (!isExpanded) {
      setKeyboardOffset(0);
      return;
    }
    const handleViewportChange = () => {
      if (window.visualViewport) {
        const offset = window.innerHeight - window.visualViewport.height - window.visualViewport.offsetTop;
        setKeyboardOffset(Math.max(0, offset));
      }
    };
    handleViewportChange();
    window.visualViewport?.addEventListener('resize', handleViewportChange);
    window.visualViewport?.addEventListener('scroll', handleViewportChange);
    return () => {
      window.visualViewport?.removeEventListener('resize', handleViewportChange);
      window.visualViewport?.removeEventListener('scroll', handleViewportChange);
    };
  }, [isExpanded]);

  return (
    <div
      ref={sheetRef}
      id="mobile-terminal-sheet"
      role={isExpanded ? 'dialog' : undefined}
      aria-modal={isExpanded ? true : undefined}
      aria-label="Terminal"
      tabIndex={isExpanded ? -1 : undefined}
      className="fixed left-0 right-0 z-50 bg-black/95 backdrop-blur-sm border-t border-border transition-all duration-200 ease-out"
      style={{ bottom: keyboardOffset, height: isExpanded ? '60vh' : '44px' }}
      data-mobile-terminal-sheet
    >
      {isExpanded ? (
        <>
          {/* Drag handle / collapse affordance */}
          <div
            className="h-8 flex items-center justify-center border-b border-border/40 cursor-pointer shrink-0 touch-none"
            onClick={() => setIsExpanded(false)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            aria-label="Collapse terminal"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setIsExpanded(false); }}
          >
            <div className="w-12 h-1 bg-phosphor-dim rounded-full" />
          </div>
          {/* Terminal fills the rest */}
          <div className="h-[calc(60vh-2rem)] overflow-hidden">
            <Suspense fallback={
              <div className="h-full flex items-center justify-center">
                <span className="text-green-400 font-mono text-sm">Loading terminal...</span>
              </div>
            }>
              <LazyTerminal
                onCommand={onCommand}
                currentSection={currentSection}
                onThemeChange={onThemeChange}
                isFocused={true}
                onFocusChange={() => {}}
                hideStatusFooter={true}
              />
            </Suspense>
          </div>
        </>
      ) : (
        <button
          ref={triggerRef}
          onClick={() => setIsExpanded(true)}
          className="w-full h-full flex items-center px-4 text-phosphor font-mono text-sm"
          aria-label="Open terminal"
          aria-expanded={isExpanded}
          aria-controls="mobile-terminal-sheet"
          type="button"
        >
          <span className="text-phosphor mr-2">$</span>
          <span className="text-phosphor-dim">_</span>
        </button>
      )}
    </div>
  );
};

export default MobileTerminalSheet;
