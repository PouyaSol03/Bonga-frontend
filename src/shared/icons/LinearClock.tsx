import React from 'react';

interface LinearClockProps extends React.SVGProps<SVGSVGElement> {}

const LinearClock: React.FC<LinearClockProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    

    <path xmlns="http://www.w3.org/2000/svg" d="M20.25 12C20.25 7.44365 16.5563 3.75 12 3.75C7.44365 3.75 3.75 7.44365 3.75 12C3.75 16.5563 7.44365 20.25 12 20.25C16.5563 20.25 20.25 16.5563 20.25 12ZM11.25 8.40039C11.25 7.98618 11.5858 7.65039 12 7.65039C12.4142 7.65039 12.75 7.98618 12.75 8.40039V11.6895L14.3301 13.2695C14.623 13.5624 14.623 14.0372 14.3301 14.3301C14.0372 14.623 13.5624 14.623 13.2695 14.3301L11.4697 12.5303C11.3291 12.3896 11.25 12.1989 11.25 12V8.40039ZM21.75 12C21.75 17.3847 17.3847 21.75 12 21.75C6.61522 21.75 2.25 17.3847 2.25 12C2.25 6.61522 6.61522 2.25 12 2.25C17.3847 2.25 21.75 6.61522 21.75 12Z" fill="currentColor"/>
    

  </svg>
);

export default LinearClock;
