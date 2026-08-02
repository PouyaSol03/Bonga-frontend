import type { SVGProps } from "react";

type NavIconProps = SVGProps<SVGSVGElement> & {
  active?: boolean;
  duotoneOpacity?: number | string;
  size?: number | string;
  strokeWidth?: number | string;
};

export default function NavAddIcon({
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
        <path
          d="M21 12C21 7.02943 16.9705 3 12 3C7.02943 3 3 7.02943 3 12C3 16.9705 7.02943 21 12 21C16.9705 21 21 16.9705 21 12Z"
          fill={color}
          fillOpacity={duotoneOpacity}
        />
      ) : null}
      <path
        d="M12 8.4V15.6M15.6 12H8.4M21 12C21 7.02943 16.9705 3 12 3C7.02943 3 3 7.02943 3 12C3 16.9705 7.02943 21 12 21C16.9705 21 21 16.9705 21 12Z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
      />
    </svg>
  );
}
