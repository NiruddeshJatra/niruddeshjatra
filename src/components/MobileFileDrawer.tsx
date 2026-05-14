import { useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import FileExplorer from './FileExplorer';
import { useTouchGestures } from '../hooks/useTouchGestures';

interface MobileFileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentSection: string;
  onSectionChange: (section: string) => void;
}

const MobileFileDrawer: React.FC<MobileFileDrawerProps> = ({
  isOpen,
  onClose,
  currentSection,
  onSectionChange,
}) => {
  const drawerRef = useRef<HTMLElement>(null);

  useTouchGestures(drawerRef, {
    onSwipeLeft: () => { if (isOpen) onClose(); },
  });

  // Escape to close + body scroll lock (restores previous overflow on cleanup)
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    if (isOpen) {
      const previousOverflow = document.body.style.overflow;
      document.addEventListener('keydown', handleKey);
      document.body.style.overflow = 'hidden';
      return () => {
        document.removeEventListener('keydown', handleKey);
        document.body.style.overflow = previousOverflow;
      };
    }
    return () => {
      document.removeEventListener('keydown', handleKey);
    };
  }, [isOpen, onClose]);

  const handleSectionChange = (section: string) => {
    onSectionChange(section);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`
          fixed inset-0 z-40 bg-black/60 backdrop-blur-sm
          transition-opacity duration-200
          ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
        onClick={onClose}
        aria-hidden={!isOpen}
      />

      {/* Drawer */}
      <nav
        ref={drawerRef}
        className={`
          fixed top-0 bottom-0 left-0 z-50
          w-72 bg-black/95 backdrop-blur-sm border-r border-border
          transform transition-transform duration-200 ease-out flex flex-col
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        aria-label="File navigation"
        aria-hidden={!isOpen}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-foreground/70 hover:text-foreground transition-colors"
          aria-label="Close file menu"
          type="button"
        >
          <X className="w-4 h-4" />
        </button>

        {/* FileExplorer — same tree as desktop */}
        <div className="h-full overflow-y-auto pt-3">
          <FileExplorer
            currentSection={currentSection}
            onSectionChange={handleSectionChange}
          />
        </div>
      </nav>
    </>
  );
};

export default MobileFileDrawer;
