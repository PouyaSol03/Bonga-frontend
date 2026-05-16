import type { SVGProps } from "react";

type HandDrawIconProps = SVGProps<SVGSVGElement> & {
  size?: number | string;
  strokeWidth?: number | string;
};

export default function HandDrawIcon({
  size = 20,
  stroke = "#4D4D4D",
  strokeWidth = 1.5,
  ...props
}: HandDrawIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M12.9173 17.5V15.1488L13.7496 13.7486C14.2407 12.6964 14.9126 10.6372 13.9736 9.66762C12.4934 8.13916 10.3536 7.99138 9.16732 8.04546V3.867C9.16732 3.17834 8.5885 2.61346 7.91732 2.61346C7.24614 2.61346 6.66732 3.17834 6.66732 3.867V10.9704L5.26691 9.46063C4.76411 9.00446 4.00426 9.08006 3.59057 9.62736C3.24638 10.0827 3.2487 10.7305 3.59614 11.1831L6.66732 15.1488V17.5M11.6673 3.02027C14.1673 5.91629 14.1673 0.951777 16.6673 3.02033"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}