import React, { Suspense, lazy, useState, useEffect, useRef } from "react";
import { FileCode, FileText, FileJson, Mail, ChevronUp } from "lucide-react";
import MatrixBackground from "./MatrixBackground";
import Changelog from "./sections/Changelog";
import { useViewport } from "../hooks/useViewport";

const AboutContent = lazy(() => import("./sections/AboutContent"));
const BlogContent = lazy(() => import("./sections/BlogContent"));
const ContactContent = lazy(() => import("./sections/ContactContent"));
const NowContent = lazy(() => import("./sections/NowContent"));
const LabContent = lazy(() => import("./sections/LabContent"));
const NotesContent = lazy(() => import("./sections/NotesContent"));
const GamesContent = lazy(() => import("./sections/GamesContent"));
const ArchivedContent = lazy(() => import("./sections/ArchivedContent"));
const SoonContent = lazy(() => import("./sections/SoonContent"));

const LineSkeleton = ({ rows = 4 }: { rows?: number }) => (
  <div className="animate-pulse space-y-3 p-4">
    <div className="h-4 bg-muted/40 rounded w-1/3 mb-5" />
    {Array.from({ length: rows }, (_, i) => (
      <div key={i} className={`h-3 bg-muted/30 rounded ${i === rows - 1 ? 'w-2/3' : 'w-full'}`} />
    ))}
  </div>
);

const ProjectsSkeleton = () => (
  <div className="animate-pulse p-4 grid grid-cols-2 gap-4">
    {Array.from({ length: 4 }, (_, i) => (
      <div key={i} className="bg-muted/20 rounded-lg p-4 space-y-2 border border-border/30">
        <div className="h-3 bg-muted/40 rounded w-3/4" />
        <div className="h-2 bg-muted/30 rounded w-full" />
        <div className="h-2 bg-muted/30 rounded w-5/6" />
        <div className="flex gap-1 mt-2">
          {Array.from({ length: 3 }, (_, j) => (
            <div key={j} className="h-4 w-12 bg-muted/40 rounded-full" />
          ))}
        </div>
      </div>
    ))}
  </div>
);

const ListSkeleton = () => (
  <div className="animate-pulse p-4 space-y-4">
    <div className="h-4 bg-muted/40 rounded w-1/4 mb-5" />
    {Array.from({ length: 4 }, (_, i) => (
      <div key={i} className="space-y-1.5">
        <div className="h-3 bg-muted/40 rounded w-1/2" />
        <div className="h-2 bg-muted/30 rounded w-3/4" />
        <div className="flex gap-1">
          <div className="h-4 w-10 bg-muted/30 rounded-full" />
          <div className="h-4 w-14 bg-muted/30 rounded-full" />
        </div>
      </div>
    ))}
  </div>
);

const getSectionSkeleton = (section: string) => {
  switch (section) {
    case 'notes':
    case 'blog': return <ListSkeleton />;
    case 'archived-skills': return <LineSkeleton rows={6} />;
    default: return <LineSkeleton />;
  }
};
import { getResponsiveFontSize, getResponsivePadding } from "../utils/responsive";
import "./Editor.css";

interface EditorProps {
  currentSection: string;
}

// Responsive Code Block Component
const ResponsiveCodeBlock = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const { isMobile } = useViewport();
  
  return (
    <div className={`editor-code-block overflow-x-auto ${className}`}>
      <pre className={`${isMobile ? 'text-xs' : 'text-sm'} whitespace-pre font-mono`}>
        {children}
      </pre>
    </div>
  );
};

// Responsive Image Component
const ResponsiveImage = ({ src, alt, className = "" }: { src: string; alt: string; className?: string }) => {
  const { isMobile, width } = useViewport();
  
  return (
    <div className={`overflow-hidden rounded-lg ${className}`}>
      <img 
        src={src} 
        alt={alt}
        className={`w-full h-auto object-contain ${isMobile ? 'max-h-48' : 'max-h-96'}`}
        style={{
          maxWidth: isMobile ? '100%' : `${Math.min(width * 0.8, 800)}px`
        }}
      />
    </div>
  );
};

// Responsive Text Container
const ResponsiveTextContainer = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const { isMobile } = useViewport();
  
  return (
    <div className={`${isMobile ? 'text-xs leading-relaxed' : 'text-sm leading-normal'} ${className}`}>
      {children}
    </div>
  );
};

// Smooth Scroll Container for Editor Content
const SmoothScrollContainer = React.forwardRef<HTMLDivElement, { children: React.ReactNode; className?: string }>(
  ({ children, className = "" }, ref) => {
    const { isMobile } = useViewport();
    
    return (
      <div 
        ref={ref}
        className={`
          editor-smooth-scroll
          overflow-y-auto overflow-x-hidden
          ${isMobile ? 'scroll-smooth' : 'custom-scrollbar'}
          ${className}
        `}
        style={{
          scrollBehavior: 'smooth',
          WebkitOverflowScrolling: 'touch', // iOS momentum scrolling
          scrollbarWidth: isMobile ? 'none' : 'thin', // Firefox
          msOverflowStyle: isMobile ? 'none' : 'auto' // IE/Edge
        }}
      >
        {children}
      </div>
    );
  }
);

const getFileIcon = (section: string) => {
  switch (section) {
    case "about": return <FileText className="w-4 h-4 terminal-blue" />;
    case "archived-skills": return <FileJson className="w-4 h-4 terminal-yellow" />;
    case "contact": return <Mail className="w-4 h-4 terminal-orange" />;
    default: return <FileCode className="w-4 h-4 terminal-cyan" />;
  }
};

const getFileName = (section: string) => {
  switch (section) {
    case "about": return "me/about.md";
    case "games": return "games/";
    case "blog": return "writing/blog.md";
    case "notes": return "writing/notes/";
    case "journey-running": return "journey/running.md";
    case "journey-hiking": return "journey/hiking.md";
    case "field-notes": return "field-notes/";
    case "photos": return "photos/";
    case "archived-experience": return "archived/experience.txt";
    case "archived-education": return "archived/education.txt";
    case "archived-projects": return "archived/projects.txt";
    case "archived-skills": return "archived/skills.json";
    case "contact": return "contact.md";
    case "now": return "now.md";
    case "lab": return "lab/";
    default: return "welcome.txt";
  }
};

const Editor = ({ currentSection }: EditorProps) => {
  const { isMobile, isTablet, width } = useViewport();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Handle scroll events for mobile scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        const scrollTop = scrollContainerRef.current.scrollTop;
        setShowScrollTop(scrollTop > 300);
      }
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true });
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };
  
  // Responsive classes based on viewport - Decreased font sizes
  const responsiveClasses = {
    fontSize: getResponsiveFontSize(isMobile, isTablet),
    padding: getResponsivePadding(isMobile),
    textSize: isMobile ? 'text-[11px]' : isTablet ? 'text-xs' : 'text-sm',
    headingSize: isMobile ? 'text-lg' : isTablet ? 'text-xl' : 'text-2xl',
    codeSize: isMobile ? 'text-[9px]' : 'text-[10px]',
    gridCols: isMobile ? 'grid-cols-1' : isTablet ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    spacing: isMobile ? 'space-y-3' : 'space-y-4'
  };
  const renderSection = () => {
    switch (currentSection) {
      case "about": return <AboutContent />;
      case "games": return <GamesContent />;
      case "blog": return <BlogContent />;
      case "notes": return <NotesContent />;
      case "journey-running":
      case "journey-hiking":
      case "field-notes": return <SoonContent />;
      case "photos": return <SoonContent message="eventually." />;
      case "archived-experience": return <ArchivedContent variant="experience" />;
      case "archived-education": return <ArchivedContent variant="education" />;
      case "archived-projects": return <ArchivedContent variant="projects" />;
      case "archived-skills": return <ArchivedContent variant="skills" />;
      case "contact": return <ContactContent />;
      case "now": return <NowContent />;
      case "lab": return <LabContent />;
      default: return null;
    }
  };

  const renderContent = () => {
    const lazySection = renderSection();
    if (lazySection) {
      return <Suspense fallback={getSectionSkeleton(currentSection)}>{lazySection}</Suspense>;
    }
    switch (currentSection) {
      default:
        return (
          <div className="animate-fade-in font-mono text-sm leading-relaxed px-4 py-6">
            {!isMobile && (
              <div className="terminal-cyan font-bold leading-tight mb-8">
                <pre className="text-[10px]">{`███╗   ██╗██╗██████╗ ██╗   ██╗██████╗ ██████╗ ███████╗███████╗██╗  ██╗             ██╗ █████╗ ████████╗██████╗  █████╗
████╗  ██║██║██╔══██╗██║   ██║██╔══██╗██╔══██╗██╔════╝██╔════╝██║  ██║             ██║██╔══██╗╚══██╔══╝██╔══██╗██╔══██╗
██╔██╗ ██║██║██████╔╝██║   ██║██║  ██║██║  ██║█████╗  ███████╗███████║             ██║███████║   ██║   ██████╔╝███████║
██║╚██╗██║██║██╔══██╗██║   ██║██║  ██║██║  ██║██╔══╝  ╚════██║██╔══██║        ██   ██║██╔══██║   ██║   ██╔══██╗██╔══██║
██║ ╚████║██║██║  ██║╚██████╔╝██████╔╝██████╔╝███████╗███████║██║  ██║        ╚█████╔╝██║  ██║   ██║   ██║  ██║██║  ██║
╚═╝  ╚═══╝╚═╝╚═╝  ╚═╝ ╚═════╝ ╚═════╝ ╚═════╝ ╚══════╝╚══════╝╚═╝  ╚═╝         ╚════╝ ╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝`}</pre>
              </div>
            )}

            <div className="max-w-2xl mx-auto space-y-3 text-foreground/80">
              <p><span className="terminal-green">$ </span>welcome to niruddeshjatra.space</p>
              <p><span className="terminal-green">&gt; </span>i'm nj.</p>
              <p><span className="terminal-green">&gt; </span>i make games. i write. i run.</p>
              <p><span className="terminal-green">&gt; </span>i tutor for a living. i'm not for hire.</p>
              <p><span className="terminal-green">&gt; </span>everything i'm working on lives here. nothing is finished.</p>
              <p><span className="terminal-green">&gt; </span>that's fine.</p>
            </div>

            <div className="max-w-2xl mx-auto mt-6 text-xs text-muted-foreground space-y-1">
              <p><span className="terminal-green">// </span>type 'help' in the terminal, or click a file.</p>
              <p><span className="terminal-green">// </span>start with games/ if you want something to play.</p>
            </div>

            <div className="max-w-2xl mx-auto mt-6 text-xs text-muted-foreground">
              <span className="terminal-green">// </span>recent
            </div>
            <div className="max-w-2xl mx-auto">
              <Changelog />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="h-full flex flex-col bg-transparent">
      {/* Header - Responsive */}
      <div className={`flex items-center gap-2 ${isMobile ? 'px-2 py-1.5' : 'px-3 py-1.5'} border-b border-border bg-black/80 backdrop-blur-sm`}>
        {getFileIcon(currentSection)}
        <span className={`${isMobile ? 'text-[11px]' : 'text-xs'} font-medium truncate flex-1`}>{getFileName(currentSection)}</span>
        {!isMobile && (
          <div className="ml-auto flex items-center gap-2 text-[10px] text-muted-foreground">
            <span>UTF-8</span>
            <span>•</span>
            <span>LF</span>
          </div>
        )}
      </div>

      {/* Content Area - Responsive with Smooth Scrolling */}
      <SmoothScrollContainer className="flex-1 relative" ref={scrollContainerRef}>
        {/* Matrix Background - Only in Editor */}
        <div className="absolute inset-0 overflow-hidden">
          <MatrixBackground />
        </div>
        
        <div className="flex min-h-full relative z-10">
          {/* Line Numbers - Responsive and Dynamic */}
          {!isMobile && (
            <div className={`
              editor-line-numbers
              ${isMobile ? 'w-8' : 'w-12'} 
              bg-[#0a0a0a]/80 text-right 
              ${isMobile ? 'pr-2' : 'pr-3'} 
              py-4 
              ${isMobile ? 'text-[10px]' : 'text-xs'} 
              text-muted-foreground/40 
              select-none 
              border-r border-border/30
              sticky top-0
              transition-all duration-200
              backdrop-blur-sm
            `}>
              {Array.from({ length: 100 }, (_, i) => (
                <div 
                  key={i} 
                  className={`
                    leading-6 
                    hover:text-muted-foreground 
                    transition-colors duration-150
                    ${isMobile ? 'py-1' : 'py-0'}
                  `}
                >
                  {i + 1}
                </div>
              ))}
            </div>
          )}
          
          {/* Content Container - Enhanced for mobile scrolling */}
          <div className={`
            editor-content
            flex-1 
            ${responsiveClasses.padding} 
            animate-fade-in 
            transition-all duration-300 ease-out
            ${isMobile ? 'overflow-x-auto' : ''}
            bg-black/10 backdrop-blur-sm
          `}>
            <div className="min-w-0 w-full">
              {renderContent()}
            </div>
          </div>
        </div>
      </SmoothScrollContainer>

      {/* Scroll to Top Button - Mobile Only */}
      {isMobile && showScrollTop && (
        <button
          onClick={scrollToTop}
          className="
            fixed bottom-20 right-4 z-50
            w-12 h-12
            bg-primary/90 hover:bg-primary
            text-primary-foreground
            rounded-full
            shadow-lg
            transition-all duration-200
            flex items-center justify-center
            backdrop-blur-sm
            border border-primary/20
          "
          aria-label="Scroll to top"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default Editor;
