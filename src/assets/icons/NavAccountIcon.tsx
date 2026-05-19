import type { SVGProps } from "react";

type NavIconProps = SVGProps<SVGSVGElement> & {
  active?: boolean;
  duotoneOpacity?: number | string;
  size?: number | string;
  strokeWidth?: number | string;
};

export default function NavAccountIcon({
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
        <>
          <path
            d="M13 14H11C7.13401 14 4 17.134 4 21H20C20 17.134 16.866 14 13 14Z"
            fill={color}
            fillOpacity={duotoneOpacity}
          />
          <path
            d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
            fill={color}
            fillOpacity={duotoneOpacity}
          />
        </>
      ) : null}
      <path
        d="M13 14H11C7.13401 14 4 17.134 4 21H20C20 17.134 16.866 14 13 14Z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
      />
      <path
        d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
      />
    </svg>
  );
}
