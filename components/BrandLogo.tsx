
import React from 'react';

interface BrandLogoProps {
  variant?: 'dark' | 'light'; // dark = dark text (for light bg), light = white text (for dark bg)
  className?: string;
}

const BrandLogo: React.FC<BrandLogoProps> = ({ variant = 'dark', className = '' }) => {
  const mainColor = variant === 'dark' ? '#0f172a' : '#ffffff'; // slate-900 or white
  const accentColor = '#f97316'; // orange-500

  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 520 140" 
      className={className} 
      fill="none"
      aria-label="Lead More - Institute of future skills"
    >
      {/* 
         GRAPHIC ICON
         Style: Continuous orange line forming 3 ascending loops with dots floating above.
      */}
      
      <g transform="translate(10, 20)">
        {/* The Orange Pulse Line - Matching the image's flow with better curves */}
        <path 
          d="M 0 65 
             C 10 65 15 65 20 65
             C 25 65 25 40 35 40
             C 45 40 45 65 50 65
             C 55 65 55 90 65 90
             C 75 90 75 25 85 25
             C 95 25 95 105 105 105
             C 115 105 115 10 125 10
             C 135 10 135 75 145 75
             L 175 75" 
          stroke={accentColor} 
          strokeWidth="7" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          fill="none"
        />
        
        {/* Arrow Head */}
        <path 
          d="M 168 67 L 178 75 L 168 83" 
          stroke={accentColor} 
          strokeWidth="7" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />

        {/* Floating Dots - White rings with dark centers */}
        {/* Dot 1 */}
        <circle cx="35" cy="25" r="7" fill="white" />
        <circle cx="35" cy="25" r="3" fill="#0f172a" />
        
        {/* Dot 2 */}
        <circle cx="85" cy="10" r="7" fill="white" />
        <circle cx="85" cy="10" r="3" fill="#0f172a" />
        
        {/* Dot 3 */}
        <circle cx="125" cy="-5" r="7" fill="white" />
        <circle cx="125" cy="-5" r="3" fill="#0f172a" />
      </g>

      {/* TEXT SECTION */}
      <g transform="translate(195, 25)">
        {/* Main Title "Lead More" */}
        <text x="0" y="45" fontFamily="'Inter', sans-serif" fontWeight="700" fontSize="52" fill={mainColor} letterSpacing="-1px">Lead</text>
        <text x="125" y="45" fontFamily="'Inter', sans-serif" fontWeight="700" fontSize="52" fill={accentColor} letterSpacing="-1px">More</text>

        {/* Subtitle "Institute of future skills" - Serif, Italic */}
        <text x="45" y="75" fontFamily="'Times New Roman', serif" fontStyle="italic" fontWeight="600" fontSize="24" fill={mainColor}>
          Institute of future skills
        </text>

        {/* Tagline "Planning • integrity • Teamwork" */}
        <text x="55" y="95" fontFamily="'Inter', sans-serif" fontWeight="700" fontSize="14" fill={mainColor} letterSpacing="0.5px">
          Planning <tspan fill={accentColor} fontSize="18" dx="2" dy="1">•</tspan><tspan dx="2" dy="-1">integrity</tspan> <tspan fill={accentColor} fontSize="18" dx="2" dy="1">•</tspan><tspan dx="2" dy="-1">Teamwork</tspan>
        </text>
      </g>
    </svg>
  );
};

export default BrandLogo;
