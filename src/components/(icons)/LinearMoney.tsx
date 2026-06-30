import React from 'react';

interface LinearMoneyProps extends React.SVGProps<SVGSVGElement> {}

const LinearMoney: React.FC<LinearMoneyProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    

    <path xmlns="http://www.w3.org/2000/svg" d="M16 5.00098C18.7632 5.00098 20.572 5.47818 21.4264 5.77328C21.7844 5.89694 22 6.24024 22 6.61901V17.4923C22 18.2357 21.1888 18.7806 20.4671 18.6022C19.4672 18.3549 17.9782 18.1104 16 18.1104C11.1629 18.1104 10.0694 19.9822 2.75993 18.2933C2.31284 18.19 2 17.7884 2 17.3296V6.28175C2 5.63118 2.61507 5.15578 3.25078 5.29404C10.1213 6.78833 11.2733 5.00098 16 5.00098Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    

    <path xmlns="http://www.w3.org/2000/svg" d="M14.5 12.001C14.5 13.3817 13.3807 14.501 12 14.501C10.6193 14.501 9.5 13.3817 9.5 12.001C9.5 10.6203 10.6193 9.50098 12 9.50098C13.3807 9.50098 14.5 10.6203 14.5 12.001Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    

    <path xmlns="http://www.w3.org/2000/svg" d="M4.5 12.4998V12.49C4.5 11.9377 4.94772 11.49 5.5 11.49C6.05228 11.49 6.5 11.9377 6.5 12.49V12.4998C6.5 13.052 6.05228 13.4998 5.5 13.4998C4.94772 13.4998 4.5 13.052 4.5 12.4998ZM17.5 11.4998V11.49C17.5 10.9377 17.9477 10.49 18.5 10.49C19.0523 10.49 19.5 10.9377 19.5 11.49V11.4998C19.5 12.052 19.0523 12.4998 18.5 12.4998C17.9477 12.4998 17.5 12.052 17.5 11.4998Z" fill="currentColor"/>
    

  </svg>
);

export default LinearMoney;
