import React from 'react';

export const UserCogIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    {...props}
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <circle cx="19" cy="11" r="2"></circle>
    <path d="m19 8-1.3 1.3"></path>
    <path d="M22.7 12.3 21.4 11"></path>
    <path d="m19 14 1.3-1.3"></path>
    <path d="m15.3 12.3-1.4-1.4"></path>
  </svg>
);