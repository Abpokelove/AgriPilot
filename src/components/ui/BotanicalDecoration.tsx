import React from 'react';
import clsx from 'clsx';

type BotanicalVariant = 'leaf' | 'vine' | 'sprout' | 'flower' | 'contour';

interface BotanicalDecorationProps {
  variant: BotanicalVariant;
  className?: string;
}

export const BotanicalDecoration: React.FC<BotanicalDecorationProps> = ({ variant, className }) => {
  if (variant === 'contour') {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 400 180"
        className={clsx('pointer-events-none absolute inset-0 h-full w-full opacity-80', className)}
        fill="none"
      >
        <path d="M-20 132C48 96 90 100 146 82C194 66 248 26 336 48C360 54 382 64 410 84" stroke="rgba(255,255,255,0.32)" strokeWidth="2" />
        <path d="M-20 156C38 130 94 132 146 120C216 102 266 62 334 74C368 80 388 88 410 108" stroke="rgba(220,252,231,0.26)" strokeWidth="2" />
        <path d="M-20 166C36 154 90 156 140 144C208 128 266 92 332 104C362 110 386 122 410 138" stroke="rgba(134,239,172,0.18)" strokeWidth="1.5" />
      </svg>
    );
  }

  if (variant === 'flower') {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 120 120"
        className={clsx('pointer-events-none absolute h-28 w-28 opacity-80', className)}
        fill="none"
      >
        <circle cx="60" cy="60" r="9" fill="rgba(217,119,6,0.26)" />
        <ellipse cx="60" cy="28" rx="13" ry="20" fill="rgba(250,204,21,0.18)" />
        <ellipse cx="60" cy="92" rx="13" ry="20" fill="rgba(16,185,129,0.18)" />
        <ellipse cx="28" cy="60" rx="20" ry="13" fill="rgba(134,239,172,0.18)" />
        <ellipse cx="92" cy="60" rx="20" ry="13" fill="rgba(163,230,53,0.16)" />
      </svg>
    );
  }

  if (variant === 'sprout') {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 120 120"
        className={clsx('pointer-events-none absolute h-24 w-24 opacity-80', className)}
        fill="none"
      >
        <path d="M60 88V52" stroke="rgba(13,92,70,0.55)" strokeWidth="4" strokeLinecap="round" />
        <path d="M60 54C48 42 34 38 24 42C34 56 44 64 60 66" stroke="rgba(16,185,129,0.40)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M60 54C72 42 86 38 96 42C86 56 76 64 60 66" stroke="rgba(132,204,22,0.35)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="60" cy="90" r="8" fill="rgba(190,242,100,0.28)" />
      </svg>
    );
  }

  if (variant === 'vine') {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 180 120"
        className={clsx('pointer-events-none absolute h-24 w-36 opacity-80', className)}
        fill="none"
      >
        <path d="M8 88C32 48 72 38 112 54C130 62 144 76 172 30" stroke="rgba(13,92,70,0.36)" strokeWidth="3" strokeLinecap="round" />
        <path d="M36 72C42 62 50 58 60 60C58 72 50 80 38 82" fill="rgba(16,185,129,0.20)" />
        <path d="M78 58C84 48 92 44 102 46C100 58 92 66 80 68" fill="rgba(132,204,22,0.18)" />
        <path d="M126 42C132 32 140 28 150 30C148 42 140 50 128 52" fill="rgba(250,204,21,0.16)" />
      </svg>
    );
  }

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 120 120"
      className={clsx('pointer-events-none absolute h-24 w-24 opacity-80', className)}
      fill="none"
    >
      <path d="M60 92C60 72 60 48 60 28" stroke="rgba(13,92,70,0.48)" strokeWidth="4" strokeLinecap="round" />
      <path d="M60 54C48 44 36 42 26 46C36 58 46 64 60 66" stroke="rgba(16,185,129,0.44)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M60 54C72 44 84 42 94 46C84 58 74 64 60 66" stroke="rgba(132,204,22,0.36)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="60" cy="92" r="6" fill="rgba(217,119,6,0.24)" />
    </svg>
  );
};
