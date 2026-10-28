import LinearTooman from "../../../../shared/icons/LinearTooman";
import { Typography } from "../../../../shared/ui/Typography";
export function SummaryRow({
  iconClassName = "mr-0.5 h-5 w-5 text-on-surface-var",
  label,
  labelClassName = "text-right font-medium text-on-surface-var",
  value,
  valueClassName = "font-medium text-on-surface",
}: {
  iconClassName?: string;
  label: string;
  labelClassName?: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex min-h-8 items-center justify-between gap-4 text-sm leading-5 [direction:ltr]">
      <Typography
        as="span"
        variant="body"
        size="medium"
        weight="regular"
        className={`flex items-center text-left [direction:rtl] ${valueClassName}`}
      >
        {value}
        <LinearTooman className={iconClassName} />
      </Typography>
      <Typography
        as="span"
        variant="body"
        size="medium"
        weight="regular"
        className={`[direction:rtl] ${labelClassName}`}
      >
        {label}
      </Typography>
    </div>
  );
}
