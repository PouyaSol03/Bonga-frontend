import type { SVGProps } from "react";

type NavIconProps = SVGProps<SVGSVGElement> & {
  active?: boolean;
  duotoneOpacity?: number | string;
  size?: number | string;
  strokeWidth?: number | string;
};

export default function NavCreateIcon({
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
      {active ? <circle cx="12" cy="12" fill={color} fillOpacity={duotoneOpacity} r="8.25" /> : null}
      <path
        d="M12 7.5V16.5M16.5 12H7.5M21 12C21 16.9705 16.9705 21 12 21C7.02944 21 3 16.9705 3 12C3 7.02944 7.02944 3 12 3C16.9705 3 21 7.02944 21 12Z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
      />
    </svg>
  );
}
