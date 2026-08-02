import React from 'react';

interface LinearTickProps extends React.SVGProps<SVGSVGElement> {}

const LinearTick: React.FC<LinearTickProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    

    <path xmlns="http://www.w3.org/2000/svg" d="M17.4805 6.4844C17.7665 6.18353 18.2437 6.17041 18.546 6.4551C18.8483 6.7398 18.8614 7.21478 18.5754 7.51565L10.0191 16.5157C9.88073 16.6611 9.68955 16.7457 9.48833 16.75C9.33748 16.7533 9.1906 16.7108 9.06547 16.6309L8.94774 16.5391L5.4481 13.1641C5.14934 12.876 5.14127 12.4011 5.43044 12.1035C5.71987 11.8062 6.19702 11.7981 6.49593 12.086L9.44909 14.9326L17.4805 6.4844Z" fill="currentColor"/>
    

  </svg>
);

export default LinearTick;
