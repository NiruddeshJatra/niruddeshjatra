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
  const sheetRef = useRef<HTMLDivElement>(null);

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

  return (
    <div
      ref={sheetRef}
      className={`
        fixed bottom-0 left-0 right-0 z-50
        bg-black/95 backdrop-blur-sm border-t border-border
        transition-all duration-200 ease-out
        ${isExpanded ? 'h-[60vh]' : 'h-11'}
      `}
      data-mobile-terminal-sheet
    >
      {isExpanded ? (
        <>
          {/* Drag handle / collapse affordance */}
          <div
            className="h-8 flex items-center justify-center border-b border-border/40 cursor-pointer shrink-0"
            onClick={() => setIsExpanded(false)}
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
              />
            </Suspense>
          </div>
        </>
      ) : (
        <button
          onClick={() => setIsExpanded(true)}
          className="w-full h-full flex items-center px-4 text-phosphor font-mono text-sm"
          aria-label="Open terminal"
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
