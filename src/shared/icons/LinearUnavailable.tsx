import React from 'react';

interface LinearUnavailableProps extends React.SVGProps<SVGSVGElement> {}

const LinearUnavailable: React.FC<LinearUnavailableProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    

    <path xmlns="http://www.w3.org/2000/svg" d="M20.2501 12C20.2501 7.44365 16.5564 3.75 12.0001 3.75C9.99197 3.75 8.15145 4.46755 6.72083 5.66016L18.339 17.2783C19.5316 15.8477 20.2501 14.0081 20.2501 12ZM3.75012 12C3.75012 16.5563 7.44377 20.25 12.0001 20.25C14.0082 20.25 15.8478 19.5314 17.2784 18.3389L5.66028 6.7207C4.46767 8.15133 3.75012 9.99185 3.75012 12ZM21.7501 12C21.7501 17.3847 17.3849 21.75 12.0001 21.75C6.61534 21.75 2.25012 17.3847 2.25012 12C2.25012 6.61522 6.61534 2.25 12.0001 2.25C17.3849 2.25 21.7501 6.61522 21.7501 12Z" fill="currentColor"/>
    

  </svg>
);

export default LinearUnavailable;
