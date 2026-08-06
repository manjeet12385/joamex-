import React from 'react';

export const SubcategoryIcons = {
  cctv: () => (
    <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="cctvGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#718096" />
          <stop offset="100%" stopColor="#2d3748" />
        </linearGradient>
        <linearGradient id="cctvBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e2e8f0" />
          <stop offset="100%" stopColor="#cbd5e0" />
        </linearGradient>
      </defs>
      {/* Wall mount bracket */}
      <rect x="42" y="18" width="16" height="8" rx="3" fill="#4a5568" />
      <rect x="47" y="26" width="6" height="10" fill="#4a5568" />
      {/* Camera arm */}
      <rect x="30" y="33" width="40" height="8" rx="4" fill="url(#cctvGrad)" />
      {/* Dome housing */}
      <ellipse cx="50" cy="55" rx="28" ry="18" fill="url(#cctvBg)" stroke="#4a5568" strokeWidth="2" />
      {/* Dome dark glass */}
      <ellipse cx="50" cy="55" rx="20" ry="13" fill="#2d3748" opacity="0.85" />
      {/* Camera lens inside dome */}
      <circle cx="50" cy="55" r="8" fill="#1a202c" />
      <circle cx="50" cy="55" r="5" fill="#2b6cb0" />
      <circle cx="50" cy="55" r="2.5" fill="#bee3f8" />
      <circle cx="48" cy="53" r="1" fill="white" opacity="0.6" />
      {/* Status LED */}
      <circle cx="65" cy="48" r="2.5" fill="#fc8181" />
      {/* Mounting screw dots */}
      <circle cx="26" cy="37" r="2" fill="#a0aec0" />
      <circle cx="74" cy="37" r="2" fill="#a0aec0" />
    </svg>
  ),
  smart_locks: () => (
    <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="lockGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f6ad55" />
          <stop offset="100%" stopColor="#dd6b20" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="45" fill="url(#lockGrad)" opacity="0.15" />
      <rect x="35" y="45" width="30" height="35" rx="6" fill="url(#lockGrad)" stroke="#dd6b20" strokeWidth="3" />
      <path d="M42 45V32C42 27.5 45.5 24 50 24C54.5 24 58 27.5 58 32V45" stroke="#dd6b20" strokeWidth="4" strokeLinecap="round" />
      <circle cx="50" cy="60" r="5" fill="#fff" />
      <path d="M50 65V72" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
    </svg>
  ),
  home_automation: () => (
    <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="autoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#63b3ed" />
          <stop offset="100%" stopColor="#3182ce" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="45" fill="url(#autoGrad)" opacity="0.15" />
      <path d="M50 22L25 45H35V75H65V45H75L50 22Z" fill="url(#autoGrad)" stroke="#3182ce" strokeWidth="3" strokeLinejoin="round" />
      <circle cx="50" cy="55" r="8" fill="#fff" stroke="#3182ce" strokeWidth="2" />
      <path d="M47 55H53M50 52V58" stroke="#3182ce" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  salon_at_home: () => (
    <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="salonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbb6ce" />
          <stop offset="100%" stopColor="#d53f8c" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="45" fill="url(#salonGrad)" opacity="0.15" />
      <path d="M50 25C40 25 32 33 32 43C32 50 35 55 40 58V72C40 75 42 77 45 77H55C58 77 60 75 60 72V58C65 55 68 50 68 43C68 33 60 25 50 25Z" fill="url(#salonGrad)" opacity="0.8" />
      <circle cx="50" cy="42" r="6" fill="#fff" />
      <path d="M38 77H62" stroke="#d53f8c" strokeWidth="4" strokeLinecap="round" />
    </svg>
  ),
  spa_services: () => (
    <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="spaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#81e6d9" />
          <stop offset="100%" stopColor="#319795" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="45" fill="url(#spaGrad)" opacity="0.15" />
      <path d="M50 25C50 25 32 45 32 58C32 68 40 76 50 76C60 76 68 68 68 58C68 45 50 25 50 25Z" fill="url(#spaGrad)" stroke="#319795" strokeWidth="3" />
      <circle cx="50" cy="58" r="8" fill="#fff" opacity="0.9" />
    </svg>
  ),
  bridal_makeup: () => (
    <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bridalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbb6ce" />
          <stop offset="100%" stopColor="#e53e3e" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="45" fill="url(#bridalGrad)" opacity="0.15" />
      <rect x="38" y="28" width="24" height="36" rx="12" fill="url(#bridalGrad)" stroke="#e53e3e" strokeWidth="3" />
      <path d="M38 46H62" stroke="#e53e3e" strokeWidth="2" />
      <rect x="46" y="64" width="8" height="12" fill="#e53e3e" />
      <path d="M32 76H68" stroke="#e53e3e" strokeWidth="4" strokeLinecap="round" />
    </svg>
  ),
  hair_styling: () => (
    <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="hairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ed64a6" />
          <stop offset="100%" stopColor="#805ad5" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="45" fill="url(#hairGrad)" opacity="0.15" />
      <path d="M40 30L60 70M60 30L40 70" stroke="#805ad5" strokeWidth="5" strokeLinecap="round" />
      <circle cx="40" cy="74" r="6" stroke="#805ad5" strokeWidth="4" />
      <circle cx="60" cy="74" r="6" stroke="#805ad5" strokeWidth="4" />
    </svg>
  ),
  facial: () => (
    <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="facialGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#b7791f" />
          <stop offset="100%" stopColor="#d69e2e" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="45" fill="url(#facialGrad)" opacity="0.15" />
      <path d="M50 25C36 25 32 35 32 48C32 62 40 75 50 75C60 75 68 62 68 48C68 35 64 25 50 25Z" fill="url(#facialGrad)" opacity="0.8" />
      <path d="M38 48C38 48 42 42 50 42C58 42 62 48 62 48" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
      <path d="M45 60C48 62 52 62 55 60" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
    </svg>
  ),
  pest_control: () => (
    <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="pestGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#68d391" />
          <stop offset="100%" stopColor="#276749" />
        </linearGradient>
        <linearGradient id="pestTank" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f6e05e" />
          <stop offset="100%" stopColor="#d69e2e" />
        </linearGradient>
      </defs>
      {/* Main tank body */}
      <rect x="30" y="25" width="28" height="48" rx="10" fill="url(#pestTank)" stroke="#d69e2e" strokeWidth="2" />
      {/* Tank top cap */}
      <rect x="38" y="18" width="12" height="10" rx="4" fill="#276749" />
      {/* Pressure gauge */}
      <circle cx="44" cy="40" r="7" fill="white" stroke="#276749" strokeWidth="2" />
      <path d="M44 40L44 34" stroke="#e53e3e" strokeWidth="2" strokeLinecap="round" />
      <path d="M44 40L49 42" stroke="#276749" strokeWidth="1.5" strokeLinecap="round" />
      {/* Label stripe */}
      <rect x="30" y="52" width="28" height="10" rx="2" fill="#276749" opacity="0.3" />
      {/* Hose connection */}
      <path d="M58 55 Q72 55 72 65" stroke="#2d6a4f" strokeWidth="4" strokeLinecap="round" fill="none" />
      {/* Spray wand */}
      <rect x="68" y="63" width="4" height="20" rx="2" fill="#2d6a4f" transform="rotate(-30 68 63)" />
      {/* Spray nozzle tip */}
      <path d="M72 80 L76 77" stroke="#2d6a4f" strokeWidth="3" strokeLinecap="round" />
      {/* Spray mist drops */}
      <path d="M78 72 L84 68M79 76 L86 76M78 80 L84 84" stroke="#68d391" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />
      {/* Pump handle */}
      <rect x="52" y="20" width="6" height="18" rx="3" fill="#276749" />
      <rect x="49" y="18" width="12" height="5" rx="2" fill="#276749" />
    </svg>
  )
};
