import React from 'react';

export const LogoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M2 22h20"/>
    <path d="M4 18v-2h16v2"/>
    <path d="M12 2c-3.31 0-6 2.69-6 6v4h12v-4c0-3.31-2.69-6-6-6Z"/>
    <path d="M12 18v4"/>
    <path d="M6 18v4"/>
    <path d="M18 18v4"/>
  </svg>
);
