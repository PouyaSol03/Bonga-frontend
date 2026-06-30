import React from 'react';

interface LinearDiamondProps extends React.SVGProps<SVGSVGElement> {}

const LinearDiamond: React.FC<LinearDiamondProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    

    <path xmlns="http://www.w3.org/2000/svg" d="M10.082 3.04488C11.1413 1.98552 12.8587 1.98554 13.918 3.04488L20.9551 10.082C22.0144 11.1413 22.0144 12.8586 20.9551 13.9179L13.918 20.955C12.8587 22.0143 11.1413 22.0143 10.082 20.955L3.04492 13.9179C1.98556 12.8586 1.98559 11.1413 3.04492 10.082L10.082 3.04488ZM12.8574 4.10542C12.3839 3.6319 11.6161 3.6319 11.1426 4.10542L4.10547 11.1425C3.63195 11.616 3.63195 12.3839 4.10547 12.8574L11.1426 19.8945C11.6161 20.368 12.3839 20.368 12.8574 19.8945L19.8945 12.8574C20.368 12.3839 20.368 11.616 19.8945 11.1425L12.8574 4.10542Z" fill="currentColor"/>
    

  </svg>
);

export default LinearDiamond;
