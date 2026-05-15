import React, { Suspense, lazy, useState, useEffect, useRef } from "react";
import { FileCode, FileText, FileJson, Mail, ChevronUp } from "lucide-react";
import MatrixBackground from "./MatrixBackground";
import Changelog from "./sections/Changelog";
import { useViewport } from "../hooks/useViewport";
import { Link, useLocation } from "react-router-dom";
import { getTodaysQuote } from "../lib/quotes";
import { getTodaysOpenerLine } from "../lib/openerLines";

const AboutContent = lazy(() => import("./sections/AboutContent"));
const JourneyContent = lazy(() => import("./sections/JourneyContent"));
const RunningContent = lazy(() => import("./sections/RunningContent"));
const ContactContent = lazy(() => import("./sections/ContactContent"));
const NowContent = lazy(() => import("./sections/NowContent"));
const LabContent = lazy(() => import("./sections/LabContent"));
const GamesContent = lazy(() => import("./sections/GamesContent"));
const NotFoundContent = lazy(() => import("./sections/NotFoundContent"));
const ArchivedContent = lazy(() => import("./sections/ArchivedContent"));
const SoonContent = lazy(() => import("./sections/SoonContent"));
const WritingContent = lazy(() => import("./sections/WritingContent"));
const OnRunningForNothingContent = lazy(() => import("./sections/OnRunningForNothingContent"));
const OnRunningForNothingBnContent = lazy(() => import("./sections/OnRunningForNothingBnContent"));
const OnStayingSmallContent = lazy(() => import("./sections/OnStayingSmallContent"));
const OnStayingSmallBnContent = lazy(() => import("./sections/OnStayingSmallBnContent"));
const OnForgettingContent = lazy(() => import("./sections/OnForgettingContent"));
const OnForgettingBnContent = lazy(() => import("./sections/OnForgettingBnContent"));
const VaultEntryContent = lazy(() => import("./sections/VaultEntryContent"));
const VaultContent = lazy(() => import("./sections/VaultContent"));
const FieldNotesContent = lazy(() => import("./sections/FieldNotesContent"));

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


const getSectionSkeleton = (section: string) => {
  switch (section) {
    case 'archived-skills': return <LineSkeleton rows={6} />;
    default: return <LineSkeleton />;
  }
};
import { getResponsiveFontSize, getResponsivePadding } from "../utils/responsive";
import "./Editor.css";

interface EditorProps {
  currentSection: string;
}

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
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: isMobile ? 'none' : 'thin',
          msOverflowStyle: isMobile ? 'none' : 'auto'
        }}
      >
        {children}
      </div>
    );
  }
);

const getFileIcon = (section: string) => {
  switch (section) {
    case "about": return <FileText className="w-4 h-4 text-phosphor-dim" />;
    case "archived-skills": return <FileJson className="w-4 h-4 text-phosphor-dim" />;
    case "contact": return <Mail className="w-4 h-4 text-phosphor-dim" />;
    default: return <FileCode className="w-4 h-4 text-phosphor-dim" />;
  }
};

const getFileName = (section: string) => {
  switch (section) {
    case "about": return "me/about.md";
    case "games": return "games/";
    case "writing": return "writing/";
    case "writing-essays-on-running-for-nothing": return "writing/essays/on-running-for-nothing.md";
    case "writing-essays-on-running-for-nothing-bn": return "writing/essays/on-running-for-nothing.bn.md";
    case "writing-essays-on-staying-small": return "writing/essays/on-staying-small.md";
    case "writing-essays-on-staying-small-bn": return "writing/essays/on-staying-small.bn.md";
    case "writing-essays-on-forgetting": return "writing/essays/on-forgetting.md";
    case "writing-essays-on-forgetting-bn": return "writing/essays/on-forgetting.bn.md";
    case "journey": return "journey/";
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
    case "vault": return "vault/";
    case "vault-content": return "vault/the-real-story.md";
    default: return "welcome.txt";
  }
};

const Editor = ({ currentSection }: EditorProps) => {
  const { isMobile, isTablet, width } = useViewport();
  const location = useLocation();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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

  const scrollToTop = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

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
      case "journey": return <JourneyContent />;
      case "journey-running": return <RunningContent />;
      case "journey-hiking": return <SoonContent />;
      case "field-notes": return <FieldNotesContent />;
      case "photos": return <SoonContent message="eventually." />;
      case "archived-experience": return <ArchivedContent variant="experience" />;
      case "archived-education": return <ArchivedContent variant="education" />;
      case "archived-projects": return <ArchivedContent variant="projects" />;
      case "archived-skills": return <ArchivedContent variant="skills" />;
      case "contact": return <ContactContent />;
      case "now": return <NowContent />;
      case "lab": return <LabContent />;
      case "writing": return <WritingContent />;
      case "writing-essays-on-running-for-nothing": return <OnRunningForNothingContent />;
      case "writing-essays-on-running-for-nothing-bn": return <OnRunningForNothingBnContent />;
      case "writing-essays-on-staying-small": return <OnStayingSmallContent />;
      case "writing-essays-on-staying-small-bn": return <OnStayingSmallBnContent />;
      case "writing-essays-on-forgetting": return <OnForgettingContent />;
      case "writing-essays-on-forgetting-bn": return <OnForgettingBnContent />;
      case "vault": return <VaultEntryContent />;
      case "vault-content": return <VaultContent />;
      case "404": return <NotFoundContent />;
      default: return null;
    }
  };

  const renderContent = () => {
    const lazySection = renderSection();
    if (lazySection) {
      return <Suspense fallback={getSectionSkeleton(currentSection)}>{lazySection}</Suspense>;
    }
    if (currentSection !== "welcome") {
      return <Suspense fallback={<LineSkeleton />}><NotFoundContent /></Suspense>;
    }
    switch (currentSection) {
      default: {
        const quote = getTodaysQuote();
        const todaysLine = getTodaysOpenerLine();
        return (
          <div className="animate-fade-in font-mono text-sm leading-relaxed py-6 px-4">
            <div className="text-phosphor font-bold leading-tight mb-10">
              <pre className="text-[4px] sm:text-[8px] md:text-[10px] leading-none overflow-hidden whitespace-pre">{`███╗   ██╗██╗██████╗ ██╗   ██╗██████╗ ██████╗ ███████╗███████╗██╗  ██╗             ██╗ █████╗ ████████╗██████╗  █████╗
████╗  ██║██║██╔══██╗██║   ██║██╔══██╗██╔══██╗██╔════╝██╔════╝██║  ██║             ██║██╔══██╗╚══██╔══╝██╔══██╗██╔══██╗
██╔██╗ ██║██║██████╔╝██║   ██║██║  ██║██║  ██║█████╗  ███████╗███████║             ██║███████║   ██║   ██████╔╝███████║
██║╚██╗██║██║██╔══██╗██║   ██║██║  ██║██║  ██║██╔══╝  ╚════██║██╔══██║        ██   ██║██╔══██║   ██║   ██╔══██╗██╔══██║
██║ ╚████║██║██║  ██║╚██████╔╝██████╔╝██████╔╝███████╗███████║██║  ██║        ╚█████╔╝██║  ██║   ██║   ██║  ██║██║  ██║
╚═╝  ╚═══╝╚═╝╚═╝  ╚═╝ ╚═════╝ ╚═════╝ ╚═════╝ ╚══════╝╚══════╝╚═╝  ╚═╝         ╚════╝ ╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝`}</pre>
            </div>

            <div className="pl-2 mb-6">
              <p><span className="text-phosphor">&gt; </span>i'm nj. this is my workshop.</p>
              <p><span className="text-phosphor">&gt; </span>{todaysLine}</p>
              <p><span className="text-phosphor">&gt; </span>games i'm building, things i'm writing, trips i'm taking.</p>
              <p><span className="text-phosphor">&gt; </span>nothing is finished. that's fine.</p>
            </div>

            <div className="text-phosphor-dim text-sm mt-10 mb-3 font-mono">// where to go</div>
            <div className="pl-2 grid grid-cols-[auto_1fr] gap-x-6 gap-y-1">
              <Link to="/games" className="text-phosphor hover:underline">games/</Link>
              <span className="text-foreground/85">things i made to play</span>
              <Link to="/writing" className="text-phosphor hover:underline">writing/</Link>
              <span className="text-foreground/85">essays, guides, field notes</span>
              <Link to="/journey-running" className="text-phosphor hover:underline">journey/</Link>
              <span className="text-foreground/85">running, hiking, eventually mountains</span>
              <Link to="/about" className="text-phosphor hover:underline">me/</Link>
              <span className="text-foreground/85">about me, mostly</span>
              <Link to="/now" className="text-phosphor hover:underline">now/</Link>
              <span className="text-foreground/85">what i'm doing now</span>
            </div>

            <div className="text-phosphor-dim text-sm mt-10 mb-3 font-mono">// in my head today</div>
            <div className="text-center my-6 italic text-foreground/85">
              <p {...(quote.lang === "bn" ? { lang: "bn", className: "font-bengali" } : {})}>{quote.text}</p>
              {quote.attribution && <p className="mt-1 text-phosphor-dim text-xs not-italic">— {quote.attribution}</p>}
            </div>

            <div className="text-phosphor-dim text-sm mt-10 mb-3 font-mono">// the last few moves</div>
            <Changelog />

            <div className="text-phosphor-dim text-sm mt-10 mb-3 font-mono">// fine print</div>
            <div className="pl-2 mb-2">
              <p className="pr-12 sm:pr-0"><span className="text-phosphor">&gt; </span><span className="text-foreground/70">type 'help' in the terminal for commands, or just click around.</span></p>
            </div>

            <div className="h-12" />
          </div>
        );
      }
    }
  };

  return (
    <div className="h-full flex flex-col bg-transparent">
      {/* Header */}
      <div className={`flex items-center gap-2 ${isMobile ? 'px-2 py-1.5' : 'px-3 py-1.5'} border-b border-border bg-black/80 backdrop-blur-sm`}>
        {getFileIcon(currentSection)}
        <span className={`${isMobile ? 'text-[11px]' : 'text-xs'} font-medium truncate flex-1`}>{currentSection === "404" ? `${location.pathname}.404` : getFileName(currentSection)}</span>
      </div>

      {/* Content Area */}
      <SmoothScrollContainer className="flex-1 relative" ref={scrollContainerRef}>
        <div className="absolute inset-0 overflow-hidden">
          <MatrixBackground opacity={currentSection?.startsWith('writing') ? 0.08 : undefined} />
        </div>

        <div className="flex min-h-full relative z-10">
          {/* Content Container */}
          <div className={`
            editor-content
            flex-1
            ${responsiveClasses.padding}
            animate-fade-in
            transition-all duration-300 ease-out
            ${isMobile ? 'overflow-x-auto' : ''}
            bg-black/10
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
