import { FeatureIcon } from "../../advertisements/components/FeatureIcon";
import { cn } from "../../../design-system/classes";

export function FeatureChipIcon({
  className,
  label,
  selected = false,
}: {
  className?: string;
  label: string;
  selected?: boolean;
}) {
  return (
    <FeatureIcon
      feature={label}
      selected={selected}
      className={cn(
        "h-5 w-5 shrink-0 object-contain",
        selected ? "text-primary" : "text-on-surface-var",
        className,
      )}
    />
  );
}
