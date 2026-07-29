import type { SVGProps } from "react";

type NavIconProps = SVGProps<SVGSVGElement> & {
  active?: boolean;
  duotoneOpacity?: number | string;
  size?: number | string;
  strokeWidth?: number | string;
};

export default function NavHomeIcon({
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
          clipRule="evenodd"
          d="M11.4092 4.92154C11.7911 4.67635 12.3037 4.69408 12.667 4.97427L18.4512 9.43423V18.2643C18.4511 18.7828 18.007 19.2494 17.4014 19.2497H6.60059C6.03279 19.2495 5.60676 18.8395 5.55566 18.361L5.55078 18.2643V9.43423L11.335 4.97427L11.4092 4.92154Z"
          fill={color}
          fillOpacity={duotoneOpacity}
          fillRule="evenodd"
        />
      ) : null}
      <path
        d="M3 10.4549L4.8 9.0665M4.8 9.0665L10.8755 4.3803C11.5329 3.87323 12.4671 3.87323 13.1245 4.3803L19.2 9.0665L21 10.4549M12 16.529V17.3968M19.2 9.0665V18.2645C19.2 19.223 18.3941 20 17.4 20H6.6C5.60589 20 4.8 19.223 4.8 18.2645L4.8 9.0665"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
      />
    </svg>
  );
}
