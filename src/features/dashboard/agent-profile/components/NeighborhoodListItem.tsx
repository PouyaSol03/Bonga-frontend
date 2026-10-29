import { SelectionCheckIndicator } from "../../../../shared/components/SelectionCheckIndicator";
import { Button } from "../../../../shared/ui/Button";
import { Typography } from "../../../../shared/ui/Typography";
import {
  getNeighborhoodHierarchyDescription,
  type NeighborhoodDto,
} from "../../../locations/api/neighborhood.service";
import { getNeighborhoodId } from "../agentProfileHelpers";

export function NeighborhoodListItem({
  cityName,
  isSelected,
  neighborhood,
  onToggle,
}: {
  cityName: string;
  isSelected: boolean;
  neighborhood: NeighborhoodDto;
  onToggle: (neighborhood: NeighborhoodDto) => void;
}) {
  const neighborhoodId = getNeighborhoodId(neighborhood);

  return (
    <Button
      unstyled
      aria-pressed={isSelected}
      className={`bg-surface-container-lowest active:bg-primary/5 flex min-h-[64px] w-full items-center justify-between gap-4 rounded-[10px] py-2 pr-0 pl-3 text-right transition-colors [direction:ltr] ${isSelected ? "text-primary" : "text-on-surface"}`}
      key={neighborhoodId}
      onClick={() => onToggle(neighborhood)}
      type="button"
    >
      <SelectionCheckIndicator checked={isSelected} />
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
          className="text-outline mt-1 block text-xs leading-5 font-normal"
        >
          {getNeighborhoodHierarchyDescription(neighborhood) || cityName || "شهر انتخاب‌شده"}
        </Typography>
      </Typography>
    </Button>
  );
}
