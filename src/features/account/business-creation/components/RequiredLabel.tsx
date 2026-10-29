import type { ReactNode } from "react";
import { Typography } from "../../../../shared/ui/Typography";

export function RequiredLabel({ children }: { children: ReactNode }) {
  return (
    <label className="text-on-surface block text-right text-base leading-6 font-semibold">
      {children}
      <Typography
        as="span"
        variant="body"
        size="medium"
        weight="regular"
        className="text-error mr-1"
      >
        *
      </Typography>
    </label>
  );
}
