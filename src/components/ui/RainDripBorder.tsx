import React, { useState } from 'react';

interface RainDripBorderProps {
  className?: string;
  side?: 'left' | 'right' | 'both';
}

export const RainDripBorder: React.FC<RainDripBorderProps> = ({ className = '', side = 'both' }) => {
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 overflow-visible rounded-[inherit] z-20 ${className}`}>
      {(side === 'left' || side === 'both') && (
        <div className="absolute left-0 top-0 bottom-0 w-[2px]">
          {/* Main water drop trickling down left border */}
          <div className="animate-rain-drop-1 absolute -left-[2.5px] h-3.5 w-1.5 rounded-full bg-gradient-to-b from-sky-200/90 via-emerald-300/80 to-teal-500/90 shadow-[0_0_10px_rgba(52,211,153,0.9)] backdrop-blur-xs" />
          <div className="animate-rain-drop-2 absolute -left-[2.5px] h-2.5 w-1 rounded-full bg-gradient-to-b from-emerald-200/80 to-teal-400/70 shadow-[0_0_6px_rgba(167,243,208,0.7)]" />
        </div>
      )}

      {(side === 'right' || side === 'both') && (
        <div className="absolute right-0 top-0 bottom-0 w-[2px]">
          {/* Main water drop trickling down right border */}
          <div className="animate-rain-drop-3 absolute -right-[2.5px] h-4 w-1.5 rounded-full bg-gradient-to-b from-lime-200/90 via-emerald-300/90 to-teal-500/80 shadow-[0_0_10px_rgba(163,230,53,0.8)] backdrop-blur-xs" />
          <div className="animate-rain-drop-1 absolute -right-[2.5px] h-2.5 w-1 rounded-full bg-gradient-to-b from-teal-200/80 to-emerald-400/70 shadow-[0_0_6px_rgba(52,211,153,0.6)]" />
        </div>
      )}
    </div>
  );
};

interface RestingLeafProps {
  position?: 'top-left' | 'top-right' | 'bottom-right' | 'top-center' | 'header-inline';
  className?: string;
}

export const RestingLeaf: React.FC<RestingLeafProps> = ({ position = 'top-right', className = '' }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFluttering, setIsFluttering] = useState(false);

  const getPosClass = () => {
    switch (position) {
      case 'top-left':
        return 'top-2 left-4 -rotate-6';
      case 'top-right':
        return 'top-2 right-4 rotate-6';
      case 'bottom-right':
        return 'bottom-2 right-4 rotate-12';
      case 'top-center':
        return 'top-2 left-1/2 -translate-x-1/2 -rotate-3';
      case 'header-inline':
        return 'relative inline-flex align-middle mx-1.5';
    }
  };

  const handleInteraction = () => {
    setIsFluttering(true);
    setTimeout(() => setIsFluttering(false), 900);
  };

  return (
    <div
      onMouseEnter={() => {
        setIsHovered(true);
        handleInteraction();
      }}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleInteraction}
      className={`group absolute z-30 flex items-center justify-center cursor-pointer transition-all duration-300 ${getPosClass()} ${className}`}
      title="Living fallen leaf - Hover or click to flutter in breeze"
    >
      <div className={`relative flex items-center justify-center transition-transform duration-500 ${
        isFluttering ? '-translate-y-4 rotate-18 scale-125' : isHovered ? '-translate-y-1.5 scale-110' : 'animate-leaf-sway'
      }`}>
        {/* Soft Glow Shadow behind leaf */}
        <div className="absolute inset-0 rounded-full bg-emerald-400/25 blur-md group-hover:bg-emerald-400/45 transition-colors" />

        <svg viewBox="0 0 44 44" className="h-10 w-10 relative z-10 drop-shadow-[0_4px_10px_rgba(13,92,70,0.35)]">
          {/* Leaf Outer Blade */}
          <path
            d="M22 3C30 9 36 19 22 38C8 19 14 9 22 3Z"
            fill="url(#livingLeafGrad)"
          />
          {/* Leaf Inner Accent Highlight */}
          <path
            d="M22 6C27 11 31 18 22 33C17 24 18 13 22 6Z"
            fill="url(#livingLeafHighlight)"
            opacity="0.45"
          />
          {/* Central Stem Rib */}
          <path d="M22 6V37" stroke="rgba(255,255,255,0.75)" strokeWidth="1.4" strokeLinecap="round" />
          {/* Branching Veinlets */}
          <path d="M22 14L28 10M22 21L29 17M22 28L27 24M22 14L16 10M22 21L15 17M22 28L17 24" stroke="rgba(255,255,255,0.4)" strokeWidth="0.9" strokeLinecap="round" />

          {/* Glistening Dew Drop on Leaf */}
          <circle cx="25" cy="19" r="2.4" fill="rgba(255,255,255,0.92)" className="animate-pulse" />
          <circle cx="25.6" cy="18.4" r="0.9" fill="#ffffff" />

          <defs>
            <linearGradient id="livingLeafGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#34D399" />
              <stop offset="40%" stopColor="#10B981" />
              <stop offset="85%" stopColor="#059669" />
              <stop offset="100%" stopColor="#0D5C46" />
            </linearGradient>
            <linearGradient id="livingLeafHighlight" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#A3E635" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
};

