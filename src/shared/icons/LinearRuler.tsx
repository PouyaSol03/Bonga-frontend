import React from 'react';

interface LinearRulerProps extends React.SVGProps<SVGSVGElement> {}

const LinearRuler: React.FC<LinearRulerProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    

    <path xmlns="http://www.w3.org/2000/svg" d="M8.75 18V20.25H11.25V18H12.75V20.25H15.25V18H16.75V20.25H20C20.1381 20.25 20.25 20.1381 20.25 20V15C20.25 14.8619 20.1381 14.75 20 14.75H9.25V4C9.25 3.86193 9.13807 3.75 9 3.75H4C3.86193 3.75 3.75 3.86193 3.75 4V7.25H6V8.75H3.75V11.25H6V12.75H3.75V15.25H6V16.75H3.75V20C3.75 20.1381 3.86193 20.25 4 20.25H7.25V18H8.75ZM10.75 13.25H20C20.9665 13.25 21.75 14.0335 21.75 15V20C21.75 20.9665 20.9665 21.75 20 21.75H4C3.0335 21.75 2.25 20.9665 2.25 20V4C2.25 3.0335 3.0335 2.25 4 2.25H9C9.9665 2.25 10.75 3.0335 10.75 4V13.25Z" fill="currentColor"/>
    

  </svg>
);

export default LinearRuler;
