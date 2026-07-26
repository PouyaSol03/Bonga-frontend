import React from "react";

interface LinearSearchProps extends React.SVGProps<SVGSVGElement> {
  active?: boolean;
  size?: number | string;
  solidColor?: string;
  solidOpacity?: number;
}

const LinearSearch: React.FC<LinearSearchProps> = ({
  active: _active,
  size,
  solidColor,
  solidOpacity = 0.16,
  width,
  height,
  ...props
}) => {
  const isSolid = Boolean(solidColor);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      width={width ?? size}
      height={height ?? size}
      {...props}
    >
      {isSolid ? (
        <>
          <circle
            cx="11"
            cy="11"
            r="8"
            fill={solidColor}
            fillOpacity={solidOpacity}
          />

          <path
            d="M16.95 16.95L21 21M19.2 11.1C19.2 6.6265 15.5735 3 11.1 3C6.6265 3 3 6.6265 3 11.1C3 15.5735 6.6265 19.2 11.1 19.2C15.5735 19.2 19.2 15.5735 19.2 11.1Z"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      ) : (
        <path
          d="M18.4502 11.0996C18.45 7.0405 15.1588 3.75 11.0996 3.75C7.04063 3.75021 3.75021 7.04063 3.75 11.0996C3.75 15.1588 7.0405 18.45 11.0996 18.4502C15.1589 18.4502 18.4502 15.1589 18.4502 11.0996ZM19.9502 11.0996C19.9502 13.2734 19.1646 15.2632 17.8643 16.8037L21.5303 20.4697C21.8232 20.7626 21.8232 21.2374 21.5303 21.5303C21.2374 21.8232 20.7626 21.8232 20.4697 21.5303L16.8037 17.8643C15.2632 19.1646 13.2734 19.9502 11.0996 19.9502C6.21207 19.95 2.25 15.9872 2.25 11.0996C2.25021 6.2122 6.2122 2.25021 11.0996 2.25C15.9872 2.25 19.95 6.21207 19.9502 11.0996Z"
          fill="currentColor"
        />
      )}
    </svg>
  );
};

export default LinearSearch;