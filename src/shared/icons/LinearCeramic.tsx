import React from 'react';

interface LinearCeramicProps extends React.SVGProps<SVGSVGElement> {}

const LinearCeramic: React.FC<LinearCeramicProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    

    <path xmlns="http://www.w3.org/2000/svg" d="M20.25 12.7549H12.75V18.25H20C20.1381 18.25 20.25 18.1381 20.25 18V12.7549ZM3.75 18C3.75 18.1381 3.86193 18.25 4 18.25H11.25V12.7549H3.75V18ZM20.25 6C20.25 5.86193 20.1381 5.75 20 5.75H12.75V11.2549H20.25V6ZM3.75 11.2549H11.25V5.75H4C3.86193 5.75 3.75 5.86193 3.75 6V11.2549ZM21.75 18C21.75 18.9665 20.9665 19.75 20 19.75H4C3.0335 19.75 2.25 18.9665 2.25 18V6C2.25 5.0335 3.0335 4.25 4 4.25H20C20.9665 4.25 21.75 5.0335 21.75 6V18Z" fill="currentColor"/>
    

  </svg>
);

export default LinearCeramic;
