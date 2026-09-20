import React from 'react';

interface LinearConstructionProps extends React.SVGProps<SVGSVGElement> {}

const LinearConstruction: React.FC<LinearConstructionProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M3 21h18" />
    <path d="M5 21V7l7-4 7 4v14" />
    <path d="M9 21v-4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4" />
    <path d="M9 9h1" />
    <path d="M14 9h1" />
    <path d="M9 13h1" />
    <path d="M14 13h1" />
  </svg>
);

export default LinearConstruction;
