import { BottomSheet } from "../../../shared/components/BottomSheet";
import { RadioIndicator } from "../../../shared/components/RadioIndicator";
import { Button } from "../../../shared/ui/Button";
import { Typography } from "../../../shared/ui/Typography";
import type { DirectoryMode } from "../types";

const MODE_OPTIONS: { id: DirectoryMode; label: string }[] = [
  { id: "agency", label: "آژانس" },
  { id: "consultant", label: "مشاور" },
];

export function DirectoryModeSheet({
  isOpen,
  mode,
  onClose,
  onSelectMode,
}: {
  isOpen: boolean;
  mode: DirectoryMode;
  onClose: () => void;
  onSelectMode: (mode: DirectoryMode) => void;
}) {
  return (
    <BottomSheet
      ariaLabel="انتخاب نوع نمایش"
      className="rounded-t-[20px]"
      isOpen={isOpen}
      onClose={onClose}
      title="نمایش مشاورین"
    >
      <div className="pt-2" dir="rtl">
        {MODE_OPTIONS.map((option) => {
          const checked = mode === option.id;

          return (
            <Button
              unstyled
              aria-pressed={checked}
              className={`flex w-full px-4 py-6 items-center justify-between text-right font-medium leading-5 ${
                checked
                  ? "bg-surface-container-lowest text-primary"
                  : "bg-surface-container-lowest text-on-surface"
              }`}
              key={option.id}
              onClick={() => onSelectMode(option.id)}
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
