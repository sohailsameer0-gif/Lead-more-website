
import React from 'react';

interface BrandLogoProps {
  variant?: 'dark' | 'light'; // dark = dark text (for light bg), light = white text (for dark bg)
  className?: string;
}

const BrandLogo: React.FC<BrandLogoProps> = ({ variant = 'dark', className = '' }) => {
  const mainColor = variant === 'dark' ? '#1e293b' : '#ffffff'; // slate-800 or white
  const accentColor = '#f97316'; // orange-500

  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 360 110" 
      className={className} 
      fill="none"
      aria-label="Lead More - Institute of Future Skills"
    >
      {/* 
         GRAPHIC ICON
         Style: Continuous orange line forming 3 ascending loops (bodies) with solid dots (heads) floating above.
      */}
      
      <g transform="translate(10, 15)">
        {/* The Orange Pulse Line */}
        <path 
          d="M 0 65 
             L 15 65 
             Q 20 65 20 60
             L 20 45 
             A 7 7 0 0 1 34 45 
             L 34 60
             Q 34 65 39 65
             L 44 65
             Q 49 65 49 60
             L 49 30
             A 7 7 0 0 1 63 30
             L 63 60
             Q 63 65 68 65
             L 73 65
             Q 78 65 78 60
             L 78 15
             A 7 7 0 0 1 92 15
             L 92 60
             Q 92 65 97 65
             L 115 65" 
          stroke={accentColor} 
          strokeWidth="6" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          fill="none"
        />
        
        {/* Arrow Head */}
        <path 
          d="M 108 58 L 116 65 L 108 72" 
          stroke={accentColor} 
          strokeWidth="6" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />

        {/* Solid Dots (Heads) floating above the peaks - Now FILLED */}
        {/* Peak 1 Center: x=27, Top y=38 -> Dot y=28 */}
        <circle cx="27" cy="28" r="5" fill={mainColor} />
        
        {/* Peak 2 Center: x=56, Top y=23 -> Dot y=13 */}
        <circle cx="56" cy="13" r="5" fill={mainColor} />
        
        {/* Peak 3 Center: x=85, Top y=8 -> Dot y=-2 */}
        <circle cx="85" cy="-2" r="5" fill={mainColor} />
      </g>

      {/* TEXT SECTION */}
      <g transform="translate(135, 0)">
        {/* Main Title "Lead More" */}
        <text x="0" y="60" fontFamily="'Inter', sans-serif" fontWeight="800" fontSize="44" fill={mainColor} letterSpacing="-1px">Lead</text>
        <text x="102" y="60" fontFamily="'Inter', sans-serif" fontWeight="800" fontSize="44" fill={accentColor} letterSpacing="-1px">More</text>

        {/* Subtitle "Institute of Future Skills" - Capitalized First Letters */}
        <text x="2" y="82" fontFamily="serif" fontStyle="italic" fontWeight="500" fontSize="18" fill={mainColor}>
          Institute of Future Skills
        </text>

        {/* Tagline "Planning • Integrity • Teamwork" - Capitalized */}
        <text x="5" y="100" fontFamily="'Inter', sans-serif" fontWeight="600" fontSize="11" fill={mainColor} letterSpacing="0.2px">
          Planning <tspan fill={accentColor} fontSize="14" dx="1" dy="1">•</tspan><tspan dx="1" dy="-1"> Integrity </tspan><tspan fill={accentColor} fontSize="14" dx="1" dy="1">•</tspan><tspan dx="1" dy="-1"> Teamwork</tspan>
        </text>
      </g>
    </svg>
  );
};

export default BrandLogo;
