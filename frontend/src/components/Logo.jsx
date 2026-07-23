import React from 'react';

const Logo = () => {
  return (
    <svg 
      className="logo-svg" 
      width="44" 
      height="44" 
      viewBox="0 0 44 44" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background circle */}
      <circle cx="22" cy="22" r="20" fill="#1a2a4a" stroke="#f59e0b" strokeWidth="2"/>
      
      {/* Truck cab */}
      <rect x="8" y="26" width="28" height="10" rx="2" fill="#f59e0b"/>
      <rect x="24" y="20" width="12" height="8" rx="1" fill="#fbbf24"/>
      
      {/* Windshield */}
      <rect x="26" y="22" width="8" height="4" rx="0.5" fill="#0a1628" opacity="0.6"/>
      
      {/* Headlight */}
      <circle cx="36" cy="30" r="2" fill="#fbbf24"/>
      
      {/* Wheels */}
      <circle cx="14" cy="36" r="4" fill="#1e293b" stroke="#475569" strokeWidth="1"/>
      <circle cx="14" cy="36" r="2" fill="#64748b"/>
      <circle cx="30" cy="36" r="4" fill="#1e293b" stroke="#475569" strokeWidth="1"/>
      <circle cx="30" cy="36" r="2" fill="#64748b"/>
      
      {/* Road line */}
      <line x1="4" y1="40" x2="40" y2="40" stroke="#475569" strokeWidth="1" strokeDasharray="2 2"/>
      
      {/* Exhaust */}
      <rect x="18" y="18" width="2" height="4" rx="1" fill="#94a3b8"/>
      
      {/* Star - indicating quality */}
      <path 
        d="M40 8 L41.5 11 L45 11.5 L42.5 14 L43 17.5 L40 15.5 L37 17.5 L37.5 14 L35 11.5 L38.5 11 L40 8Z" 
        fill="#f59e0b"
      />
    </svg>
  );
};

export default Logo;