import React from 'react';

export const FlagIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
    <line x1="4" y1="22" x2="4" y2="15"></line>
  </svg>
);

export const WarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13.4 2.6L12 2l-1.4 1.4-1.4-1.4L7.8 2.6 6.4 4 5 2.6 3.6 4 2.2 2.6 3.6 4 5 5.4 3.6 6.8 5 8.2l-1.4 1.4L5 11l1.4 1.4L5 13.8l1.4 1.4L5 16.6l1.4 1.4L5 19.4l1.4 1.4L7.8 22l1.4-1.4 1.4 1.4 1.4-1.4 1.4 1.4 1.4-1.4 1.4 1.4 1.4-1.4 1.4 1.4-1.4-1.4 1.4-1.4-1.4-1.4 1.4-1.4-1.4-1.4 1.4-1.4-1.4-1.4 1.4-1.4-1.4-1.4 1.4-1.4 1.4-1.4z"></path>
  </svg>
);

export const AtomIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="1"></circle>
    <path d="M20.2 20.2c2.04-2.03.02-7.36-4.5-11.9-4.54-4.52-9.87-6.54-11.9-4.5-2.04 2.03-.02 7.36 4.5 11.9 4.54 4.52 9.87 6.54 11.9 4.5z"></path>
    <path d="M3.8 20.2c-2.04-2.03-.02-7.36 4.5-11.9 4.54-4.52 9.87-6.54 11.9-4.5 2.04 2.03.02 7.36-4.5 11.9-4.54 4.52-9.87-6.54-11.9 4.5z"></path>
  </svg>
);

export const BalanceIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2l-8 4 8 4 8-4-8-4z"></path>
    <path d="M4 10v6c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-6"></path>
    <path d="M12 12v10"></path>
  </svg>
);

export const BuildingIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
    <line x1="9" y1="9" x2="15" y2="15"></line>
    <line x1="15" y1="9" x2="9" y2="15"></line>
  </svg>
);
