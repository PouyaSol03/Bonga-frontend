import React from 'react';

interface LinearArrowTurnBackwardProps extends React.SVGProps<SVGSVGElement> {}

const LinearArrowTurnBackward: React.FC<LinearArrowTurnBackwardProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    

    <path xmlns="http://www.w3.org/2000/svg" d="M19.25 10.5C19.25 8.42893 17.5711 6.75 15.5 6.75H11C10.5858 6.75 10.25 6.41421 10.25 6C10.25 5.58579 10.5858 5.25 11 5.25H15.5C18.3995 5.25 20.75 7.60051 20.75 10.5C20.75 13.3995 18.3995 15.75 15.5 15.75H5.81055L7.53028 17.4697C7.82317 17.7626 7.82317 18.2374 7.53028 18.5303C7.23738 18.8232 6.76262 18.8232 6.46973 18.5303L3.46973 15.5303C3.17684 15.2374 3.17684 14.7626 3.46973 14.4697L6.46973 11.4697C6.76262 11.1768 7.23738 11.1768 7.53028 11.4697C7.82317 11.7626 7.82317 12.2374 7.53028 12.5303L5.81055 14.25H15.5C17.5711 14.25 19.25 12.5711 19.25 10.5Z" fill="currentColor"/>
    

  </svg>
);

export default LinearArrowTurnBackward;
