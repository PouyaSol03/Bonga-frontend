import React from 'react';

interface LinearSendCommentProps extends React.SVGProps<SVGSVGElement> {}

const LinearSendComment: React.FC<LinearSendCommentProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    

    <path xmlns="http://www.w3.org/2000/svg" d="M13 3H5C4 3 3 4.01433 3 5.02867V16C3 17.0143 4 18 5 18H7V20.2437C7 21.0276 7.87203 21.2119 8.5 20.7508L12 18H19C20 18 21 17.0143 21 16V10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    

    <path xmlns="http://www.w3.org/2000/svg" d="M8.40771 10.25C8.82193 10.25 9.15771 10.5858 9.15771 11C9.15771 11.4142 8.82193 11.75 8.40771 11.75H8.3999C7.98569 11.75 7.6499 11.4142 7.6499 11C7.6499 10.5858 7.98569 10.25 8.3999 10.25H8.40771ZM12.0044 10.25C12.4184 10.2502 12.7544 10.5859 12.7544 11C12.7544 11.4141 12.4184 11.7498 12.0044 11.75H11.9956C11.5815 11.7499 11.2456 11.4141 11.2456 11C11.2456 10.5859 11.5815 10.2501 11.9956 10.25H12.0044Z" fill="currentColor"/>
    

    <path xmlns="http://www.w3.org/2000/svg" d="M18.5 8L21 5.5L18.5 3M21 5.5L15 5.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    

  </svg>
);

export default LinearSendComment;
