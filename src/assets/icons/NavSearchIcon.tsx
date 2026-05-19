import type { SVGProps } from "react";

type NavIconProps = SVGProps<SVGSVGElement> & {
  active?: boolean;
  duotoneOpacity?: number | string;
  size?: number | string;
  strokeWidth?: number | string;
};

export default function NavSearchIcon({
  active = false,
  color = "currentColor",
  duotoneOpacity = 0.16,
  size = 24,
  strokeWidth = 1.5,
  ...props
}: NavIconProps) {
  return (
    <svg
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {active ? (
        <circle cx="11" cy="11" fill={color} fillOpacity={duotoneOpacity} r="8" />
      ) : null}
      <path
        d="M16.95 16.95L21 21M19.2 11.1C19.2 6.6265 15.5735 3 11.1 3C6.6265 3 3 6.6265 3 11.1C3 15.5735 6.6265 19.2 11.1 19.2C15.5735 19.2 19.2 15.5735 19.2 11.1Z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
      />
    </svg>
  );
}
