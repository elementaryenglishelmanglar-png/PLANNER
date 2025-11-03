import React from 'react';

// A simplified representation of the owl logo
export const ProfePlannerIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="200" height="200" rx="40" fill="#f0f7e8"/>
    <path d="M100 40C66.86 40 40 66.86 40 100C40 133.14 66.86 160 100 160C133.14 160 160 133.14 160 100C160 66.86 133.14 40 100 40Z" fill="#78ac40"/>
    <path d="M100 70C113.81 70 125 81.19 125 95V130H75V95C75 81.19 86.19 70 100 70Z" fill="#F9FAFB"/>
    <circle cx="85" cy="95" r="10" fill="#78ac40"/>
    <circle cx="115" cy="95" r="10" fill="#78ac40"/>
    <path d="M100 105L105 115H95L100 105Z" fill="#fadb16"/>
  </svg>
);