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
          {/* Flat 2D square background matching concrete/cardboard grey-blue panel of reference */}
          <rect x="0" y="0" width="100" height="100" rx="8" fill="#CAD4DF" />
          
          {/* Ambient overspray shadow effect for the graffiti look */}
          <path 
            d="M 32 16 
               C 42 12, 65 14, 73 26 
               C 79 36, 76 50, 62 54 
               C 52 56, 43 54, 41 51 
               L 42 81 
               C 42 84, 37 84, 35 81 
               L 32 16 Z" 
            fill="#0047FF" 
            opacity="0.18"
            className="blur-[2px]"
          />

          {/* Solid raw blue graffiti "P" with no inner gaps or negative space inside the loop */}
          <path 
            d="M 32 16 
               C 42 12, 65 14, 73 26 
               C 79 36, 76 50, 62 54 
               C 52 56, 43 54, 41 51 
               L 42 81 
               C 42 84, 37 84, 35 81 
               L 32 16 Z" 
            fill="#0047FF" 
          />

          {/* Organic spray paint splatters and drips matching the reference */}
          <circle cx="30" cy="56" r="1.5" fill="#0047FF" />
          <circle cx="30" cy="62" r="1" fill="#0047FF" />
          <circle cx="31" cy="72" r="0.8" fill="#0047FF" />
          <circle cx="43" cy="85" r="1.1" fill="#0047FF" />
          <circle cx="58" cy="60" r="0.8" fill="#0047FF" />
          <circle cx="71" cy="18" r="0.7" fill="#0047FF" />
          <circle cx="28" cy="24" r="0.9" fill="#0047FF" />
          <circle cx="45" cy="11" r="0.6" fill="#0047FF" />
        </svg>
      </div>
      
      {showText && (
        <div className={`font-sans tracking-tight font-extrabold ${horizontal ? '' : 'mt-2'} ${textSizeClass} ${textClassName}`}>
          <span className="text-[#0047FF]">PakSpace</span>
        </div>
      )}
    </div>
  );
}
