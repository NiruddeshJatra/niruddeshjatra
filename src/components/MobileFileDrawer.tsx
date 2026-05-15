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
          bg-black/95 backdrop-blur-sm border-r border-border
          transform transition-transform duration-200 ease-out flex flex-col
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        aria-label="File navigation"
        aria-hidden={!isOpen}
      >
        {/* FileExplorer — same tree as desktop, X replaces collapse chevron */}
        <div className="h-full overflow-y-auto">
          <FileExplorer
            currentSection={currentSection}
            onSectionChange={handleSectionChange}
            navClassName="!w-64"
            headerAction={
              <button
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close file menu"
                type="button"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            }
          />
        </div>
      </nav>
    </>
  );
};

export default MobileFileDrawer;
