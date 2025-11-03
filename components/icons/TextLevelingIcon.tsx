import React from 'react';

export const TextLevelingIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M3 8h18M3 12h18M3 16h18M3 20h18" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 4v16m8-16v16M4 8h4m8 0h4m-4 8h4M4 16h4" />
    </svg>
);