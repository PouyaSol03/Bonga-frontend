import type { SVGProps } from "react";

type ArrowDownProps = SVGProps<SVGSVGElement> & {
  size?: number | string;
  strokeWidth?: number | string;
};

export default function ArrowDown({
  size = 20,
  stroke = "#0048C4",
  strokeWidth = 1.5,
  ...props
}: ArrowDownProps) {
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
        d="M6.66602 8.33334L9.99936 11.6666L13.3327 8.33331"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeMiterlimit={16}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
