import React from 'react';

interface LinearCoinBagProps extends React.SVGProps<SVGSVGElement> {}

const LinearCoinBag: React.FC<LinearCoinBagProps> = (props) => (
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
    <path d="M12 3v3" />
    <path d="M8.5 6h7" />
    <path d="M6 9a4 4 0 0 1 4-3h4a4 4 0 0 1 4 3v2a8 8 0 1 1-12 0V9z" />
    <path d="M12 12v4" />
    <path d="M10 14h4" />
  </svg>
);

export default LinearCoinBag;
