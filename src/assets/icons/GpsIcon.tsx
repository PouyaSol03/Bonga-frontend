import type { SVGProps } from "react";

type GpsIconProps = SVGProps<SVGSVGElement> & {
  size?: number | string;
  strokeWidth?: number | string;
  circleFill?: string;
};

export default function GpsIcon({
  size = 20,
  stroke = "#4D4D4D",
  strokeWidth = 1.5,
  circleFill = "#4D4D4D",
  ...props
}: GpsIconProps) {
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
        d="M16 10C16 13.3137 13.3137 16 10 16M16 10C16 6.68629 13.3137 4 10 4M16 10H17.5M10 16C6.68629 16 4 13.3137 4 10M10 16V17.5M4 10C4 6.68629 6.68629 4 10 4M4 10H2.5M10 4V2.5"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="10" r="2.5" fill={circleFill} />
    </svg>
  );
}