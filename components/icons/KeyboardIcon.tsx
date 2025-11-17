import React from 'react';

const KeyboardIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 6h18v12H3z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8 18V6 M16 18V6"
    />
    <path
      fill="currentColor"
      strokeWidth="0"
      d="M6 6h2v7H6z M10 6h2v7h-2z M14 6h2v7h-2z"
    />
  </svg>
);

export default KeyboardIcon;
