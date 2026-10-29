import type { ReactNode } from "react";
import { ChoiceIndicator } from "../../../../shared/ui/Choice";
import { Button } from "../../../../shared/ui/Button";
import { Typography } from "../../../../shared/ui/Typography";

export function BusinessTypeCard({
  badge,
  icon,
  isSelected,
  label,
  onClick,
}: {
  badge?: string;
  icon: ReactNode;
  isSelected: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <Button
      unstyled
      aria-pressed={isSelected}
      className={`flex h-[76px] w-full items-center rounded-2xl border px-4 text-right transition-colors ${
        isSelected
          ? "border-primary bg-primary-container text-primary"
          : "border-outline-var bg-surface-container-lowest text-on-surface-var"
      }`}
      onClick={onClick}
      type="button"
    >
      <ChoiceIndicator checked={isSelected} className="h-[18px] w-[18px]" type="radio" />
      <span
        aria-hidden="true"
        className={`mx-4 h-10 w-px shrink-0 ${isSelected ? "bg-primary-container" : "bg-outline-var"}`}
      />
      <span className="flex min-w-0 flex-1 items-center gap-2">
        {icon}
        <Typography
          as="span"
          variant="label"
          size="large"
          weight="medium"
          className={`min-w-0 truncate ${isSelected ? "text-primary" : "text-on-surface"}`}
        >
          {label}
        </Typography>
        {badge ? (
          <Typography
            as="span"
            variant="label"
            size="small"
            weight="medium"
            className="border-tertiary bg-tertiary-container/30 text-tertiary shrink-0 rounded-md border px-2 py-1"
          >
            {badge}
          </Typography>
        ) : null}
      </span>
    </Button>
  );
}
