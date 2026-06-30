import React from 'react';

interface LinearUploadProps extends React.SVGProps<SVGSVGElement> {}

const LinearUpload: React.FC<LinearUploadProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    

    <path xmlns="http://www.w3.org/2000/svg" d="M19 18.25C19.4142 18.25 19.75 18.5858 19.75 19C19.75 19.4142 19.4142 19.75 19 19.75H5C4.58579 19.75 4.25 19.4142 4.25 19C4.25 18.5858 4.58579 18.25 5 18.25H19ZM11.25 15V6.81054L10.0303 8.03027C9.73738 8.32316 9.26262 8.32316 8.96973 8.03027C8.67683 7.73738 8.67683 7.26261 8.96973 6.96972L11.4697 4.46972L11.5264 4.41796C11.8209 4.17765 12.2557 4.19512 12.5303 4.46972L15.0303 6.96972C15.3232 7.26261 15.3232 7.73738 15.0303 8.03027C14.7374 8.32316 14.2626 8.32316 13.9697 8.03027L12.75 6.81054V15C12.75 15.4142 12.4142 15.75 12 15.75C11.5858 15.75 11.25 15.4142 11.25 15Z" fill="currentColor"/>
    

  </svg>
);

export default LinearUpload;
