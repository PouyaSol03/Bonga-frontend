import { type ReactNode } from "react";
import { Typography } from "../../../shared/ui/Typography";

export function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-xl bg-white p-6 ${className}`}>{children}</section>;
}

export function PanelHeader({
  action,
  subtitle,
  title,
}: {
  action?: ReactNode;
  subtitle?: string;
  title: string;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="min-w-0">
        <Typography
          as="h2"
          variant="title"
          size="medium"
          weight="semibold"
          className="m-0 text-base leading-7 font-semibold text-[#1a1a1a]"
        >
          {title}
        </Typography>
        {subtitle ? (
          <Typography
            as="p"
            variant="body"
            size="medium"
            weight="regular"
            className="m-0 mt-1 text-sm leading-6 font-normal text-[#808080]"
          >
            {subtitle}
          </Typography>
        ) : null}
      </div>
      {action}
    </div>
  );
}
