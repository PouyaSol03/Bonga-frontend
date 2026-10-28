import { type ReactNode } from "react";
import { Typography } from "../../../shared/ui/Typography";

export function FilterField({
  children,
  className = "",
  label,
}: {
  children: ReactNode;
  className?: string;
  label: string;
}) {
  return (
    <label className={`min-w-[190px] ${className}`}>
      <Typography
        as="span"
        variant="label"
        size="medium"
        weight="medium"
        className="mb-1.5 block text-sm font-medium text-[#4d4d4d]"
      >
        {label}
      </Typography>
      {children}
    </label>
  );
}
