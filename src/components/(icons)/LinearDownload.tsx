import React from 'react';

interface LinearDownloadProps extends React.SVGProps<SVGSVGElement> {}

const LinearDownload: React.FC<LinearDownloadProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    

    <path xmlns="http://www.w3.org/2000/svg" d="M19 18.25C19.4142 18.25 19.75 18.5858 19.75 19C19.75 19.4142 19.4142 19.75 19 19.75H5C4.58579 19.75 4.25 19.4142 4.25 19C4.25 18.5858 4.58579 18.25 5 18.25H19ZM11.25 5C11.25 4.58579 11.5858 4.25 12 4.25C12.4142 4.25 12.75 4.58579 12.75 5V13.1895L13.9697 11.9697C14.2626 11.6768 14.7374 11.6768 15.0303 11.9697C15.3232 12.2626 15.3232 12.7374 15.0303 13.0303L12.5303 15.5303C12.2374 15.8232 11.7626 15.8232 11.4697 15.5303L8.96973 13.0303C8.67683 12.7374 8.67683 12.2626 8.96973 11.9697C9.26262 11.6768 9.73738 11.6768 10.0303 11.9697L11.25 13.1895V5Z" fill="currentColor"/>
    

  </svg>
);

export default LinearDownload;
