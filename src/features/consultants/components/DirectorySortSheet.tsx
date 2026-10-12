import { BottomSheet } from "../../../shared/components/BottomSheet";
import { RadioIndicator } from "../../../shared/components/RadioIndicator";
import { Button } from "../../../shared/ui/Button";
import { Typography } from "../../../shared/ui/Typography";
import { SORT_OPTIONS } from "../constants";
import type { SortOptionId } from "../types";

export function DirectorySortSheet({
  isOpen,
  onClose,
  onSelectSort,
  selectedSort,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSelectSort: (sort: SortOptionId) => void;
  selectedSort: SortOptionId | null;
}) {
  return (
    <BottomSheet
      ariaLabel="مرتب سازی"
      className="rounded-t-[20px]"
      isOpen={isOpen}
      onClose={onClose}
      title="مرتب سازی بر اساس"
    >
      <div dir="rtl">
        {SORT_OPTIONS.map((option) => {
          const checked = selectedSort === option.id;

          return (
            <Button
              unstyled
              aria-pressed={checked}
              className={`flex w-full items-center justify-between py-6 px-4 text-right text-sm font-medium leading-5 ${
                checked
                  ? "bg-surface-container-lowest text-primary"
                  : "bg-surface-container-lowest text-on-surface"
              }`}
              key={option.id}
              onClick={() => onSelectSort(option.id)}
              type="button"
            >
              <Typography as="span" variant="body" size="medium" weight="regular">
                {option.label}
              </Typography>
              <RadioIndicator checked={checked} />
            </Button>
          );
        })}
      </div>
    </BottomSheet>
  );
}
