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
        <svg 
          className={`${iconSizeClass} transition-transform duration-500 hover:scale-105`} 
          viewBox="0 0 100 100" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Main R-Portal Shape */}
          <path 
            d="M26 18H58C70 18 80 28 80 40C80 50 73 58.5 63.5 61L79 79H65.5L51.5 64.5H38V79H30C27.8 79 26 77.2 26 75V18ZM38 30V52.5H58C64.9 52.5 70 47.4 70 40.5C70 33.6 64.9 28.5 58 28.5H38V30Z" 
            fill="#10B981" 
          />
          {/* Inner Doorway and Pathway */}
          <rect x="45" y="34" width="8.5" height="15" fill="#34D399" rx="0.5" />
          <path d="M45 49H53.5L62 58.5H53.5L45 49Z" fill="#059669" />
        </svg>
      </div>
      
      {showText && (
        <div className={`font-serif tracking-tight font-semibold ${horizontal ? '' : 'mt-2'} ${textSizeClass} ${textClassName}`}>
          <span className="text-white">Pak</span>
          <span className="text-yellow-400">Space</span>
        </div>
      )}
    </div>
  );
}
