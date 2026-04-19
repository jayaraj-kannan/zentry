import React from 'react';

const Logo = ({ size = 'medium', showText = true }) => {
  const dimensions = {
    small: { w: 120, h: 40, iconSize: 30 },
    medium: { w: 180, h: 60, iconSize: 40 },
    large: { w: 320, h: 100, iconSize: 80 }
  };
  
  const { w, h } = dimensions[size];

  return (
    <svg width={w} height={h} viewBox="0 0 320 100" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
      <defs>
        <linearGradient id="gradZ" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#00c6ff', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#7b2ff7', stopOpacity: 1 }} />
        </linearGradient>
      </defs>

      {/* Z Icon */}
      <polygon 
        points="20,20 80,20 40,50 100,50 80,80 20,80 60,50 20,50"
        fill="url(#gradZ)" 
      />

      {showText && (
        <>
          {/* Brand Name */}
          <text x="120" y="60" fontFamily="Outfit, Helvetica, sans-serif" 
                fontSize="38" fill="#ffffff" fontWeight="bold">
            Zentry
          </text>

          {/* Tagline */}
          <text x="120" y="80" fontFamily="Outfit, Helvetica, sans-serif" 
                fontSize="14" fill="rgba(255,255,255,0.6)">
            Smart Event Experience
          </text>
        </>
      )}
    </svg>
  );
};

export default Logo;
