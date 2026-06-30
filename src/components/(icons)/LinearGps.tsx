import React from 'react';

interface LinearGpsProps extends React.SVGProps<SVGSVGElement> {}

const LinearGps: React.FC<LinearGpsProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    

    <path xmlns="http://www.w3.org/2000/svg" d="M19.2 12C19.2 15.9765 15.9765 19.2 12 19.2M19.2 12C19.2 8.02355 15.9765 4.8 12 4.8M19.2 12H21M12 19.2C8.02355 19.2 4.8 15.9765 4.8 12M12 19.2V21M4.8 12C4.8 8.02355 8.02355 4.8 12 4.8M4.8 12H3M12 4.8V3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    

    <path xmlns="http://www.w3.org/2000/svg" d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z" fill="currentColor"/>
    

  </svg>
);

export default LinearGps;
