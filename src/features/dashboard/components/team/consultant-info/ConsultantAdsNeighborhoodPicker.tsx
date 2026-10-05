import { useMemo, useState } from "react";
import LinearLocation from "../../../../../shared/icons/LinearLocation";
import LinearArrowLeft1 from "../../../../../shared/icons/LinearArrowLeft1";
import { Chip } from "../../../../../shared/ui/Chip";
import { Button } from "../../../../../shared/ui/Button";
import { Typography } from "../../../../../shared/ui/Typography";
import { toPersianNumber } from "../../../../../shared/lib/numberUtils";
import type { NeighborhoodDto } from "../../../../locations/api/neighborhood.service";
import type { AdManagementSelectedNeighborhood } from "../../../../account/adManagement/adManagementData";
import { ConsultantAdsNeighborhoodSheet } from "./ConsultantAdsNeighborhoodSheet";

export function ConsultantAdsNeighborhoodPicker({
  onChange,
  selectedNeighborhoods,
}: {
  onChange: (neighborhoods: AdManagementSelectedNeighborhood[]) => void;
  selectedNeighborhoods: AdManagementSelectedNeighborhood[];
}) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const selectedIds = useMemo(
    () => new Set(selectedNeighborhoods.map((n) => n.id)),
    [selectedNeighborhoods],
  );

  const toggleNeighborhood = (item: NeighborhoodDto) => {
    const id = String(item.id ?? item._id ?? item.name);
    if (selectedIds.has(id)) {
      onChange(selectedNeighborhoods.filter((n) => n.id !== id));
    } else {
      onChange([...selectedNeighborhoods, { id, name: item.name }]);
    }
  };

  const removeNeighborhood = (id: string) => {
    onChange(selectedNeighborhoods.filter((n) => n.id !== id));
  };

  const selectionLabel = selectedNeighborhoods.length
    ? `${toPersianNumber(selectedNeighborhoods.length)} انتخاب`
    : "انتخاب";

  return (
    <div>
      <Button
        unstyled
        className="flex h-14 w-full items-center justify-between text-right [direction:ltr]"
        onClick={() => setIsPickerOpen(true)}
        type="button"
      >
        <Typography
          as="span"
          variant="label"
          size="medium"
          weight="medium"
          className="flex items-center gap-1 text-primary font-medium"
        >
          <LinearArrowLeft1 className="h-5 w-5 text-on-surface-var" />
          <Typography as="span" variant="label" size="medium" weight="medium" className="text-primary font-medium">
            {selectionLabel}
          </Typography>
        </Typography>

        <Typography
          as="span"
          variant="label"
          size="large"
          weight="medium"
          className="flex items-center gap-2 text-on-surface"
        >
          <Typography as="span" variant="label" size="large" weight="medium">
            محله
          </Typography>
          <LinearLocation className="h-6 w-6 shrink-0 text-on-surface-var" />
        </Typography>
      </Button>

      {selectedNeighborhoods.length > 0 ? (
        <div className="mt-2 flex flex-wrap gap-2 pb-3" dir="rtl">
          {selectedNeighborhoods.map((n) => (
            <Chip
              key={n.id}
              removable
              selected
              onClick={() => removeNeighborhood(n.id)}
            >
              {n.name}
            </Chip>
          ))}
        </div>
      ) : null}

      <ConsultantAdsNeighborhoodSheet
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        onToggle={toggleNeighborhood}
        selectedIds={selectedIds}
      />
    </div>
  );
}
