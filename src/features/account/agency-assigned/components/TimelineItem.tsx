import type { ReactNode } from "react";
import { Typography } from "../../../../shared/ui/Typography";
import LinearClock from "../../../../shared/icons/LinearClock";

export function TimelineItem({
  time,
  title,
  description,
}: {
  time: string;
  title?: string;
  description: ReactNode;
}) {
  return (
    <div className="py-3.5 text-right">
      <div className="text-on-surface-var flex items-center gap-1.5 text-xs">
        <LinearClock className="text-outline h-4 w-4 shrink-0" />
        <span>{time}</span>
      </div>
      {title && (
        <Typography
          as="h4"
          variant="title"
          size="small"
          weight="semibold"
          className="text-on-surface m-0 mt-2 text-sm font-semibold"
        >
          {title}
        </Typography>
      )}
      <div className="text-on-surface-var mt-1.5 text-xs leading-5">{description}</div>
    </div>
  );
}
