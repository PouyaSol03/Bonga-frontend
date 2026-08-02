import type { SVGProps } from "react";

type CreateAdBuildingIconProps = SVGProps<SVGSVGElement> & {
  agency?: boolean;
};

export default function CreateAdBuildingIcon({
  agency = false,
  ...props
}: CreateAdBuildingIconProps) {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" {...props}>
      <path
        d="M5 21V4l10 3v14"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path
        d="M15 11h4v10"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path
        d="M8 8h3M8 12h3M8 16h3"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      {agency ? (
        <path
          d="M3 21h18"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.8"
        />
      ) : null}
    </svg>
  );
}
