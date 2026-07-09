/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showText?: boolean;
  textClassName?: string;
  horizontal?: boolean;
}

export default function PakSpaceLogo({ size = 'md', showText = true, textClassName = '', horizontal = false }: LogoProps) {
  const iconSizeClass = {
    sm: 'w-7 h-7',
    md: 'w-11 h-11',
    lg: 'w-18 h-18',
    xl: 'w-24 h-24',
    '2xl': 'w-32 h-32'
  }[size];

  const textSizeClass = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
    '2xl': 'text-4xl'
  }[size];

  return (
    <div className={`flex select-none items-center ${horizontal ? 'flex-row gap-2.5' : 'flex-col justify-center text-center'}`}>
      <div className="relative flex items-center justify-center shrink-0">
        {/* Flat 2D square brand mark: a raw, spray-painted "P" with no interior gaps */}
        <svg
          className={`${iconSizeClass} transition-transform duration-500 hover:scale-105`}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Flat square backdrop */}
          <rect x="4" y="4" width="92" height="92" rx="14" fill="#FFD400" />

          {/* Raw spray-can "P" - built from solid, slightly irregular blobs so the
              bowl of the letter has no punched-out negative space, like a single
              can-painted stroke. A faint rotation keeps it graffiti-loose rather
              than a clean geometric glyph. */}
          <g transform="rotate(-4 50 50)">
            {/* stem */}
            <path
              d="M32 24
                 C31 24 30 25 30 27
                 L29 74
                 C29 76 30.5 77.5 32.5 77.5
                 L40 77.5
                 C42 77.5 43 76 43 74
                 L43.5 30
                 C43.6 27 42.5 24.5 39.5 24.2
                 Z"
              fill="#1440FF"
            />
            {/* solid bowl, fused directly onto the stem so there is no enclosed hole */}
            <path
              d="M38 24
                 C52 22 68 26 71 39
                 C73.5 49.5 65 58.5 52 59.5
                 C46 60 40.5 59 37 57
                 C35 51 35 30 38 24 Z"
              fill="#1440FF"
            />
            {/* spray drips for a raw painted texture */}
            <path d="M33 77 C33 80.5 32 84 31.3 86.5 C31 87.6 32.6 88 33 87 C34 84 34.3 80 34 77 Z" fill="#1440FF" />
            <path d="M63 58.5 C64 61.5 64.6 64 63.8 66 C63.4 67 61.9 66.8 62 65.6 C62.2 63 62 60.5 61.3 58.6 Z" fill="#1440FF" />
            {/* a couple of stray spray specks */}
            <circle cx="76" cy="46" r="1.8" fill="#1440FF" />
            <circle cx="27" cy="66" r="1.3" fill="#1440FF" />
          </g>
        </svg>
      </div>

      {showText && (
        <div className={`font-serif tracking-tight font-bold ${horizontal ? '' : 'mt-2'} ${textSizeClass} ${textClassName}`}>
          <span className="text-[#1440FF]">PakSpace</span>
        </div>
      )}
    </div>
  );
}
