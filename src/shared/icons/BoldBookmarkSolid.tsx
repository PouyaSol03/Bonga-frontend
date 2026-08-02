import React from "react";

interface BoldBookmarkSolidProps extends React.SVGProps<SVGSVGElement> {}

const BoldBookmarkSolid: React.FC<BoldBookmarkSolidProps> = (props) => (
  <svg
    fill="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      clipRule="evenodd"
      d="M5 5.41463C5 4.08107 6.04467 3 7.33333 3H16.6667C17.9553 3 19 4.08107 19 5.41463V20.3415C19 20.5728 18.8827 20.7872 18.6911 20.9061C18.4994 21.0252 18.2614 21.0313 18.0642 20.9226L12 17.5756L5.93583 20.9226C5.7386 21.0313 5.50063 21.0252 5.30896 20.9061C5.11728 20.7872 5 20.5728 5 20.3415V5.41463Z"
      fill="currentColor"
      fillRule="evenodd"
    />
  </svg>
);

export default BoldBookmarkSolid;