import type { SVGProps } from "react";

type NavIconProps = SVGProps<SVGSVGElement> & {
  active?: boolean;
  duotoneOpacity?: number | string;
  size?: number | string;
  strokeWidth?: number | string;
};

export default function NavChatIcon({
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
          d="M12 21C16.9705 21 21 16.9705 21 12C21 7.02944 16.9705 3 12 3C7.02944 3 3 7.02944 3 12C3 13.4183 3.36192 14.6471 3.95775 15.8021C4.19141 16.2551 4.2664 16.7786 4.11994 17.2669L3.48028 19.3991C3.27432 20.0856 3.91442 20.7257 4.60094 20.5198L6.73315 19.88C7.22132 19.7336 7.74486 19.8086 8.19782 20.0422C9.35291 20.6381 10.5817 21 12 21Z"
          fill={color}
          fillOpacity={duotoneOpacity}
        />
      ) : null}
      <path
        d="M11.9959 12H12.0041M15.5919 12H15.6M8.4 12H8.40807M12 21C16.9705 21 21 16.9705 21 12C21 7.02944 16.9705 3 12 3C7.02944 3 3 7.02944 3 12C3 13.4183 3.36192 14.6471 3.95775 15.8021C4.19141 16.2551 4.2664 16.7786 4.11994 17.2669L3.48028 19.3991C3.27432 20.0856 3.91442 20.7257 4.60094 20.5198L6.73315 19.88C7.22132 19.7336 7.74486 19.8086 8.19782 20.0422C9.35291 20.6381 10.5817 21 12 21Z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
      />
    </svg>
  );
}
