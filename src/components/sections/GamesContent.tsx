import React from "react";
import { firePortal } from "@/hooks/useLoader";
import SEO from "../SEO";

const GamesContent = () => {
  const handlePlayClick = (e: React.MouseEvent) => {
    e.preventDefault();
    firePortal({
      destination: "> arczero standby",
      sessionKey: "ncs_portal_seen_arczero",
      onComplete: () => {
        window.location.href = "/games/arczero/";
      },
    });
  };

  return (
  <>
    <SEO
      title="games — niruddeshjatra"
      description="games i built. arczero is a physics-based missile interception puzzle. more on the way."
      path="/games"
    />
  <div className="animate-fade-in font-mono max-w-xl mx-auto px-4 py-6 pb-16 sm:pb-4 text-foreground/85">
    <div className="pl-2 mb-6">
      <p className="mb-1"><span className="text-phosphor">&gt; </span>games/</p>
      <p className="mb-1"><span className="text-phosphor">&gt; </span>things i made that you can play.</p>
      <p className="mb-1"><span className="text-phosphor">&gt; </span>each one is its own world, deployed separately.</p>
    </div>

    <div className="text-phosphor-dim text-sm mt-10 mb-4 font-mono">// deployed</div>

    <div
      className="font-mono p-6 sm:p-8 mb-6"
      style={{
        backgroundColor: 'rgba(10, 10, 15, 0.92)',
        border: '1px solid rgba(68, 170, 255, 0.4)',
        borderRadius: '4px',
      }}
    >

      <h3 style={{
        fontFamily: '"Courier New", monospace',
        color: '#44aaff',
        fontSize: 'clamp(2rem, 8vw, 2.5rem)',
        letterSpacing: '0.15em',
        marginBottom: '4px',
        fontWeight: 'normal',
      }}>
        ARCZERO
      </h3>

      <p style={{
        fontFamily: '"Courier New", monospace',
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 'clamp(0.7rem, 2.5vw, 0.9rem)',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        marginBottom: '20px',
      }}>
        PHYSICS-BASED MISSILE INTERCEPTION
      </p>

      <p style={{
        fontFamily: '"Courier New", monospace',
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 'clamp(0.8rem, 2.5vw, 0.9rem)',
        lineHeight: '1.6',
        marginBottom: '24px',
      }}>
        a two-minute physics puzzle disguised as an arcade reflex game.
        you read a falling parabola, launch a rising one, and meet them
        in the air — one shot at a time, one second of commitment at a time.
      </p>

      <p style={{
        fontFamily: '"Courier New", monospace',
        color: 'rgba(255, 255, 255, 0.5)',
        fontSize: '0.75rem',
        letterSpacing: '0.1em',
        marginBottom: '24px',
      }}>
        10 levels · daily challenge · leaderboards · endless mode
      </p>

      <a
        href="/games/arczero/"
        onClick={handlePlayClick}
        style={{
          fontFamily: '"Courier New", monospace',
          fontSize: '0.95rem',
          letterSpacing: '0.15em',
        }}
        className="inline-block text-[#44aaff] border border-[#44aaff] rounded-[2px] px-[28px] py-[10px] no-underline transition-colors duration-150 hover:bg-[rgba(68,170,255,0.12)] focus-visible:bg-[rgba(68,170,255,0.12)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#44aaff]"
      >
        ▶ PLAY
      </a>
    </div>

    <div className="text-phosphor-dim text-sm mt-10 mb-4 font-mono">// in development</div>

    <div className="pl-2 mb-4 opacity-70">
      <p className="text-phosphor-dim text-sm font-mono mb-1">
        word-grid (codename)
      </p>
      <p className="text-phosphor-dim text-xs font-mono leading-relaxed">
        a classic paper-and-pencil word game from childhood, redone.
        in head only for now.
      </p>
    </div>

    <div className="text-phosphor-dim text-sm mt-10 mb-3 font-mono">// the rule</div>

    <div className="pl-2">
      <p className="text-foreground/85 text-sm leading-relaxed mb-4 pr-12 sm:pr-2">
        every game is its own world. its own repo, its own deploy,
        its own visual language. this page is the doorway.
      </p>
    </div>
  </div>
  </>
  );
};

export default GamesContent;
