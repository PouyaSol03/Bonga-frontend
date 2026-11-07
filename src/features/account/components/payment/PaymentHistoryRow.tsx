import type { ReactNode } from "react";
import { Typography } from "../../../../shared/ui/Typography";

export type PaymentHistoryRowProps = {
  icon?: ReactNode;
  label: string;
  value: ReactNode;
  valueClassName?: string;
  valueColor?: string;
};

export function PaymentHistoryRow({
  icon,
  label,
  value,
  valueClassName = "text-on-surface",
  valueColor,
}: PaymentHistoryRowProps) {
  return (
    <div className="flex shrink-0 items-center justify-between py-2 [direction:ltr]">
      <Typography
        as="span"
        variant="label"
        size="large"
        weight="medium"
        className={`flex min-w-0 items-center gap-1 text-left ${valueClassName}`}
        style={valueColor ? { color: valueColor } : undefined}
      >
        {value}
        {icon}
      </Typography>
      <Typography
        as="span"
        variant="label"
        size="large"
        weight="medium"
        className="text-outline shrink-0 text-right [direction:rtl]"
      >
        {label}
      </Typography>
    </div>
  );
}
