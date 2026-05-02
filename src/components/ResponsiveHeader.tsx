import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Terminal as TerminalIcon, Mail, Github, Menu } from 'lucide-react';
import { useViewport } from '../hooks/useViewport';
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation';
import { MIN_TOUCH_TARGET_SIZE, announceToScreenReader } from '../utils/accessibility';

interface ResponsiveHeaderProps {
  onMenuToggle: () => void;
  currentSection: string;
}

const ResponsiveHeader: React.FC<ResponsiveHeaderProps> = ({
  onMenuToggle,
  currentSection
}) => {
  const { isMobile } = useViewport();
  const headerRef = useRef<HTMLElement>(null);

  // Handle keyboard shortcuts for header actions
  useKeyboardNavigation({
    onEnter: () => {
      // If focus is on the menu button, activate it
      if (document.activeElement?.getAttribute('aria-label')?.includes('navigation menu')) {
        onMenuToggle();
        announceToScreenReader('Navigation menu toggled', 'polite');
      }
    },
    enabled: true
  });

  return (
    <header
      ref={headerRef}
      className="bg-[#1e1e1e] border-b border-border relative z-10"
      role="banner"
    >
      {/* Skip to main content link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus-visible:focus-visible"
      >
        Skip to main content
      </a>

      <div className={`
        grid grid-cols-[auto_1fr_auto] items-center gap-2
        ${isMobile ? 'px-2 py-1' : 'px-3 py-1.5'}
        min-h-[40px]
      `}>
        {/* Left Section - Menu + Brand */}
        <div className="flex items-center gap-2 min-w-0">
          {/* Mobile hamburger menu */}
          {isMobile && (
            <button
              onClick={onMenuToggle}
              className={`p-2 rounded-md hover:bg-muted/50 focus-visible:focus-visible transition-colors min-h-[${MIN_TOUCH_TARGET_SIZE}px] min-w-[${MIN_TOUCH_TARGET_SIZE}px] flex items-center justify-center shrink-0`}
              aria-label="Open navigation menu"
              aria-expanded="false"
              aria-controls="mobile-navigation"
              type="button"
            >
              <Menu className="w-5 h-5" aria-hidden="true" />
            </button>
          )}

          <div className="flex items-center gap-2 min-w-0">
            <TerminalIcon
              className="text-phosphor shrink-0"
              size={18}
              aria-hidden="true"
            />
            <Link to="/" className={`font-bold truncate hover:opacity-80 transition-opacity ${isMobile ? 'text-sm' : 'text-base'}`}>
              niruddeshjatra
            </Link>
          </div>
        </div>

        {/* Center Section - Subtitle (desktop/tablet only) */}
        <div className="flex justify-center min-w-0">
          {!isMobile && (
            <p className="text-muted-foreground text-xs truncate" role="doc-subtitle">
              tutor · runner · maker
            </p>
          )}
        </div>

        {/* Right Section - Social Links */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Social Links */}
          <nav
            className={`flex items-center ${isMobile ? 'gap-1' : 'gap-3'}`}
            aria-label="Social media links"
          >
            <a
              href="mailto:nasifulalam1212@gmail.com"
              className={`
                hover:text-primary focus-visible:focus-visible transition rounded-md
                ${isMobile ? `min-h-[${MIN_TOUCH_TARGET_SIZE}px] min-w-[${MIN_TOUCH_TARGET_SIZE}px] flex items-center justify-center p-2` : 'p-1'}
              `}
              aria-label="Email nj"
            >
              <Mail size={isMobile ? 18 : 16} aria-hidden="true" />
            </a>
            <a
              href="https://github.com/niruddeshjatra"
              target="_blank"
              rel="noopener noreferrer"
              className={`
                hover:text-primary focus-visible:focus-visible transition rounded-md
                ${isMobile ? `min-h-[${MIN_TOUCH_TARGET_SIZE}px] min-w-[${MIN_TOUCH_TARGET_SIZE}px] flex items-center justify-center p-2` : 'p-1'}
              `}
              aria-label="GitHub (opens in new tab)"
            >
              <Github size={isMobile ? 18 : 16} aria-hidden="true" />
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default ResponsiveHeader;
