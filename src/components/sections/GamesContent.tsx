import { useState, useEffect } from "react";

const ARCZERO_PATH = "/games/arczero/";

const ArcZeroCard = () => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`
        border font-mono transition-all duration-200 max-w-sm
        ${hovered
          ? 'border-[#44aaff]/70 bg-[#44aaff]/5'
          : 'border-[#44aaff]/30 bg-black/40'
        }
      `}
      style={{ fontFamily: "'Courier New', Courier, monospace" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="px-5 py-4 border-b border-[#44aaff]/20">
        <div className="text-[10px] text-[#44aaff]/50 mb-1">// game_001</div>
        <div className="text-[#44aaff] text-base font-bold tracking-wider">ARCZERO</div>
        <div className="text-xs text-white/50 mt-0.5">2d arcade · canvas · vanilla js</div>
      </div>

      <div className="px-5 py-4 space-y-3">
        <p className="text-xs text-white/60 leading-relaxed">
          First game out of the workshop.
          Shoot things. Don't die. No tutorial.
        </p>

        <div className="flex gap-2 text-[10px]">
          {['keyboard', 'mouse', 'canvas'].map(tag => (
            <span key={tag} className="px-2 py-0.5 border border-[#44aaff]/25 text-[#44aaff]/60">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="px-5 pb-5">
        <a
          href={ARCZERO_PATH}
          className={`
            block w-full text-center text-xs font-bold tracking-widest py-2 border
            transition-all duration-150
            ${hovered
              ? 'bg-[#44aaff] border-[#44aaff] text-black'
              : 'border-[#44aaff]/50 text-[#44aaff] hover:bg-[#44aaff]/10'
            }
          `}
        >
          [ PLAY ]
        </a>
      </div>
    </div>
  );
};

const GamesContent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className={`
        font-mono max-w-2xl mx-auto px-4 py-6 transition-opacity duration-300
        ${visible ? 'opacity-100' : 'opacity-0'}
      `}
      style={{ fontFamily: "'Courier New', Courier, monospace" }}
    >
      <ArcZeroCard />

      <p className="mt-8 text-[10px] text-white/25">
        more slots pending. ship first.
      </p>
    </div>
  );
};

export default GamesContent;
