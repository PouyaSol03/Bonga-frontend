import LinearArrowLeft1 from "../../../../shared/icons/LinearArrowLeft1";
import { FormChoiceChip } from "../../../../shared/form/FormControls";
import { Button } from "../../../../shared/ui/Button";
import { Typography } from "../../../../shared/ui/Typography";
import type { SelectedNeighborhood } from "../types";
import { FieldError, Section } from "./ProfileFields";

export function ActivityAreaSection({
  activityAreas,
  error,
  onOpenPicker,
  onRemoveActivityArea,
}: {
  activityAreas: SelectedNeighborhood[];
  error: string | null;
  onOpenPicker: () => void;
  onRemoveActivityArea: (id: string) => void;
}) {
  return (
    <Section>
      <div className="flex items-center justify-between gap-3">
        <Typography
          as="h2"
          variant="title"
          size="medium"
          weight="semibold"
          className="m-0 text-right text-base leading-6 font-semibold"
        >
          محدوده فعالیت
        </Typography>
        <Button
          unstyled
          className="text-primary inline-flex h-8 shrink-0 items-center gap-1.5 text-sm leading-5 font-semibold"
          onClick={onOpenPicker}
          type="button"
        >
          {activityAreas.length ? `${activityAreas.length} انتخاب` : "انتخاب"}
          <LinearArrowLeft1 className="text-on-surface-var h-5 w-5" />
        </Button>
      </div>

      {activityAreas.length > 0 ? (
        <div className="mt-3 flex flex-wrap justify-start gap-2" dir="rtl">
          {activityAreas.map((area) => (
            <FormChoiceChip
              key={area.id}
              label={area.name}
              onClick={() => onRemoveActivityArea(area.id)}
              removable
              selected
            />
          ))}
        </div>
      ) : (
        <Typography
          as="p"
          variant="body"
          size="medium"
          weight="regular"
          className="text-outline m-0 mt-3 text-right text-sm leading-6 font-normal"
        >
          محله‌های محدوده فعالیت مشاور را انتخاب کنید.
        </Typography>
      )}
      {error ? <FieldError message={error} /> : null}
    </Section>
  );
}
