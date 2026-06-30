import React from 'react';

interface LinearUserSolidProps extends React.SVGProps<SVGSVGElement> {}

const LinearUserSolid: React.FC<LinearUserSolidProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    

    <path xmlns="http://www.w3.org/2000/svg" d="M13 13.25C17.2802 13.25 20.75 16.7198 20.75 21C20.75 21.4142 20.4142 21.75 20 21.75H4C3.58579 21.75 3.25 21.4142 3.25 21C3.25 16.7198 6.7198 13.25 11 13.25H13ZM11 14.75C7.80214 14.75 5.16751 17.152 4.79688 20.25H19.2031C18.8325 17.152 16.1979 14.75 13 14.75H11ZM15.25 7C15.25 5.20507 13.7949 3.75 12 3.75C10.2051 3.75 8.75 5.20507 8.75 7C8.75 8.79493 10.2051 10.25 12 10.25C13.7949 10.25 15.25 8.79493 15.25 7ZM16.75 7C16.75 9.62335 14.6234 11.75 12 11.75C9.37665 11.75 7.25 9.62335 7.25 7C7.25 4.37665 9.37665 2.25 12 2.25C14.6234 2.25 16.75 4.37665 16.75 7Z" fill="currentColor"/>
    

  </svg>
);

export default LinearUserSolid;
