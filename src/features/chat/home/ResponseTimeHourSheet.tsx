import { BottomSheet } from "../../../shared/components/BottomSheet";
import { Button } from "../../../shared/ui/Button";
import { formatResponseTime, responseHourOptions } from "./responseAvailability";

export function ResponseTimeHourSheet({
  isOpen,
  onClose,
  onSelect,
  title,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (hour: string) => void;
  title: string;
}) {
  return (
    <BottomSheet
      ariaLabel={title}
      className="rounded-t-[18px]"
      contentClassName="mt-1 h-[calc(100%-76px)] overflow-y-auto"
      heightClassName="h-[560px]"
      isOpen={isOpen}
      onClose={onClose}
      panelPaddingClassName="pt-3"
      scrimClassName="bg-black/60"
      showHeaderDivider
      title={title}
      titleAlign="center"
      zIndexClassName="z-[60]"
    >
      <div className="px-4 py-2">
        {responseHourOptions.map((hour) => (
          <Button
            unstyled
            className="text-on-surface focus-visible:outline-primary/40 flex h-[70px] w-full items-center justify-center text-center text-base leading-6 focus-visible:outline-3 focus-visible:outline-offset-2"
            key={hour}
            onClick={() => {
              onSelect(hour);
              onClose();
            }}
            type="button"
          >
            {formatResponseTime(hour)}
          </Button>
        ))}
      </div>
    </BottomSheet>
  );
}
