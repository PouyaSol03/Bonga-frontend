import type { ReactNode } from "react";
import { Typography } from "../../../../shared/ui/Typography";
import type { PanelSupportRequestStatus } from "../../../support/api/panel-support.service";
import { statusPresentation } from "../types";
import { formatCount, priorityLabel } from "../supportHelpers";

export function StatusChip({ status }: { status: PanelSupportRequestStatus }) {
  const presentation = statusPresentation[status];
  return (
    <Typography
      as="span"
      variant="label"
      size="small"
      weight="medium"
      className={`inline-flex h-6 items-center rounded-md px-2 text-[11px] font-medium ${presentation.className}`}
    >
      {presentation.label}
    </Typography>
  );
}

export function PriorityChip({ priority }: { priority: string }) {
  const label = priorityLabel(priority);
  const className =
    label === "فوری"
      ? "bg-[#fff0ee] text-[#d92d20]"
      : label === "مهم"
        ? "bg-[#fff6e5] text-[#b54708]"
        : "bg-[#f1f1f1] text-[#666666]";

  return (
    <Typography
      as="span"
      variant="label"
      size="small"
      weight="medium"
      className={`inline-flex h-6 items-center rounded-md px-2 text-[11px] font-medium ${className}`}
    >
      {label}
    </Typography>
  );
}

export function SummaryCard({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="flex min-w-[155px] items-center gap-3 rounded-xl border border-[#eeeeee] bg-[#fafafa] px-4 py-3">
      <Typography
        as="span"
        variant="body"
        size="medium"
        weight="regular"
        className="grid h-9 w-9 place-items-center rounded-xl bg-white text-[#0048c4]"
      >
        {icon}
      </Typography>
      <Typography as="span" variant="body" size="medium" weight="regular">
        <strong className="block text-base font-bold text-[#1a1a1a]">{formatCount(value)}</strong>
        <Typography
          as="span"
          variant="body"
          size="small"
          weight="regular"
          className="mt-0.5 block text-xs text-[#808080]"
        >
          {label}
        </Typography>
      </Typography>
    </div>
  );
}

export function RequestMetaItem({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="flex min-w-0 items-center gap-2 rounded-xl bg-[#fafafa] px-3 py-2.5">
      <Typography
        as="span"
        variant="body"
        size="medium"
        weight="regular"
        className="shrink-0 text-[#808080]"
      >
        {icon}
      </Typography>
      <Typography as="span" variant="body" size="medium" weight="regular" className="min-w-0">
        <Typography
          as="span"
          variant="body"
          size="small"
          weight="regular"
          className="block text-[10px] text-[#999999]"
        >
          {label}
        </Typography>
        <Typography
          as="span"
          variant="label"
          size="small"
          weight="semibold"
          className="mt-1 block truncate text-xs font-semibold text-[#303030]"
        >
          {value}
        </Typography>
      </Typography>
    </div>
  );
}
