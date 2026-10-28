import { type SelectHTMLAttributes } from "react";
import { Typography } from "../../../shared/ui/Typography";

export function CrmSelect({
  children,
  className = "",
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <Typography
      as="span"
      variant="body"
      size="medium"
      weight="regular"
      className="relative block w-full"
    >
      <select className={`${className} appearance-none pl-10`} {...props}>
        {children}
      </select>
      <Typography
        as="span"
        variant="body"
        size="medium"
        weight="regular"
        className="pointer-events-none absolute top-1/2 left-3 grid -translate-y-1/2 place-items-center text-[#687386]"
        aria-hidden="true"
      >
        <svg
          fill="none"
          height="16"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          width="16"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </Typography>
    </Typography>
  );
}
