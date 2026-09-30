import { BottomSheet } from "../../../shared/components/BottomSheet";
import { Button } from "../../../shared/ui/Button";
import { Typography } from "../../../shared/ui/Typography";
import type { NotificationCategory } from "../api/notification.service";
import { notificationFilterOptions } from "../types";

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2.5"
      viewBox="0 0 24 24"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export function NotificationFilterSheet({
  isOpen,
  onClose,
  onToggle,
  selectedFilterIds,
}: {
  isOpen: boolean;
  onClose: () => void;
  onToggle: (id: NotificationCategory) => void;
  selectedFilterIds: Set<NotificationCategory>;
}) {
  return (
    <BottomSheet
      ariaLabel="فیلتر اعلان‌ها"
      className="rounded-t-[22px]"
      contentClassName="mt-4"
      heightClassName="h-[400px]"
      isOpen={isOpen}
      onClose={onClose}
      panelPaddingClassName="pt-3"
      scrimClassName="bg-black/60"
      title="فیلتر"
      showHeaderDivider={false}
    >
      <div className="px-4 pb-5">
        {notificationFilterOptions.map((option) => {
          const isSelected = selectedFilterIds.has(option.id);

          return (
            <Button
              unstyled
              aria-pressed={isSelected}
              className="flex h-[64px] w-full items-center justify-between text-right text-base font-medium leading-6 text-on-surface focus-visible:outline-3 focus-visible:outline-inset focus-visible:outline-primary/40"
              key={option.id}
              onClick={() => onToggle(option.id)}
              type="button"
            >
              <Typography as="span" variant="body" size="medium" weight="regular">
                {option.label}
              </Typography>
              <Typography
                as="span"
                variant="body"
                size="medium"
                weight="regular"
                className={`grid h-[18px] w-[18px] place-items-center rounded border ${
                  isSelected
                    ? "border-primary bg-primary text-on-primary"
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
