import type { SVGProps } from "react";

type ListIconProps = SVGProps<SVGSVGElement> & {
  size?: number | string;
  strokeWidth?: number | string;
};

export default function ListIcon({
  size = 24,
  stroke = "#FAFAFA",
  strokeWidth = 1.5,
  ...props
}: ListIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M4 5H15.9933M4 12H15.9933M4 19H15.9933M19.991 5H20M19.991 12H20M19.991 19H20"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}