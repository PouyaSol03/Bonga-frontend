import { BottomSheet } from "../../../shared/components/BottomSheet";
import { Button } from "../../../shared/ui/Button";
import { Typography } from "../../../shared/ui/Typography";
import { type ChatDayOfWeek } from "../api/chat.service";
import { CheckIcon } from "./listIcons";
import { responseWeekDays } from "./responseAvailability";

export function ResponseTimeDaysSheet({
  isOpen,
  onClose,
  onToggleDay,
  selectedDays,
}: {
  isOpen: boolean;
  onClose: () => void;
  onToggleDay: (day: ChatDayOfWeek) => void;
  selectedDays: ChatDayOfWeek[];
}) {
  return (
    <BottomSheet
      ariaLabel="انتخاب روزهای هفته"
      className="rounded-t-[18px]"
      contentClassName="mt-5"
      heightClassName="h-[560px]"
      isOpen={isOpen}
      onClose={onClose}
      panelPaddingClassName="pt-3"
      scrimClassName="bg-black/60"
      title="انتخاب روزهای هفته"
      zIndexClassName="z-[60]"
    >
      <div className="space-y-2 px-4">
        {responseWeekDays.map((day) => {
          const isSelected = selectedDays.includes(day.value);

          return (
            <Button
              unstyled
              className="text-on-surface focus-visible:outline-primary/40 flex h-[54px] w-full items-center justify-between text-right text-sm leading-5 focus-visible:outline-3 focus-visible:outline-offset-2"
              key={day.value}
              onClick={() => onToggleDay(day.value)}
              type="button"
            >
              <Typography as="span" variant="body" size="medium" weight="regular">
                {day.label}
              </Typography>
              <Typography
                as="span"
                variant="body"
                size="medium"
                weight="regular"
                className={`grid h-[18px] w-[18px] place-items-center rounded border ${
                  isSelected
                    ? "border-primary bg-primary text-white"
                    : "border-outline bg-surface-container-lowest text-transparent"
                }`}
              >
                <CheckIcon className="h-[14px] w-[14px]" />
              </Typography>
            </Button>
          );
        })}
      </div>
    </BottomSheet>
  );
}
