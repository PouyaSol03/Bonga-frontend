import { Button } from "../../../../shared/ui/Button";
import { Typography } from "../../../../shared/ui/Typography";
import { RadioIndicator } from "../../../../shared/components/RadioIndicator";
import { SelectionCheckIndicator } from "../../../../shared/components/SelectionCheckIndicator";
import {
  getNeighborhoodHierarchyDescription,
  type NeighborhoodDto,
} from "../../../locations/api/neighborhood.service";

export function NeighborhoodListItem({
  cityName,
  isSelected,
  mode,
  neighborhood,
  onToggle,
}: {
  cityName?: string;
  isSelected: boolean;
  mode: "single" | "multiple";
  neighborhood: NeighborhoodDto;
  onToggle: () => void;
}) {
  return (
    <Button
      unstyled
      aria-pressed={isSelected}
      className={`bg-surface-container-lowest active:bg-primary/5 flex min-h-[64px] w-full items-center justify-between gap-4 rounded-[10px] py-2 pr-0 pl-3 text-right transition-colors [direction:ltr] ${
        isSelected ? "text-primary" : "text-on-surface"
      }`}
      onClick={onToggle}
      type="button"
    >
      {mode === "single" ? (
        <RadioIndicator checked={isSelected} />
      ) : (
        <SelectionCheckIndicator checked={isSelected} />
      )}
      <Typography
        as="span"
        variant="body"
        size="medium"
        weight="regular"
        className="min-w-0 flex-1 [direction:rtl]"
      >
        <Typography
          as="span"
          variant="label"
          size="medium"
          weight="medium"
          className="block truncate text-sm leading-5 font-medium"
        >
          {neighborhood.name}
        </Typography>
        <Typography
          as="span"
          variant="body"
          size="small"
          weight="regular"
          className="text-outline mt-1 line-clamp-2 block text-xs leading-5 font-normal"
        >
          {getNeighborhoodHierarchyDescription(neighborhood) || cityName || "شهر انتخاب‌شده"}
        </Typography>
      </Typography>
    </Button>
  );
}

export function NeighborhoodSkeleton() {
  return (
    <div className="space-y-2">
      <div className="bg-surface-container-high h-12 rounded-[10px]" />
      <div className="bg-surface-container-high h-12 rounded-[10px]" />
      <div className="bg-surface-container-high h-12 rounded-[10px]" />
    </div>
  );
}
