import type { SVGProps } from "react";

type UserSolidProps = SVGProps<SVGSVGElement> & {
  size?: number | string;
  strokeWidth?: number | string;
};

export default function UserSolid({
  size = 20,
  stroke = "white",
  strokeWidth = 1.5,
  ...props
}: UserSolidProps) {
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
        d="M10.834 11.6667H9.16732C5.94566 11.6667 3.33398 14.2783 3.33398 17.5H16.6673C16.6673 14.2783 14.0557 11.6667 10.834 11.6667Z"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.0007 9.16667C11.8416 9.16667 13.334 7.67428 13.334 5.83333C13.334 3.99238 11.8416 2.5 10.0007 2.5C8.1597 2.5 6.66732 3.99238 6.66732 5.83333C6.66732 7.67428 8.1597 9.16667 10.0007 9.16667Z"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
