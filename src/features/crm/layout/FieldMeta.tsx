import { type ReactNode } from "react";
import { Typography } from "../../../shared/ui/Typography";

export function FieldMeta({ children }: { children: ReactNode }) {
  return (
    <Typography
      as="span"
      variant="label"
      size="medium"
      weight="medium"
      className="rounded-full bg-[#f0f2f6] px-2 py-1 text-sm font-medium text-[#6d7788]"
    >
      {children}
    </Typography>
  );
}
