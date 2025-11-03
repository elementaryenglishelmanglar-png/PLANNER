import React from 'react';

export const ConceptMapIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 12a4 4 0 108 0 4 4 0 00-8 0zm12 0a4 4 0 108 0 4 4 0 00-8 0z" />
    </svg>
);