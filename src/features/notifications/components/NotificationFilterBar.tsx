import { HorizontalFilterBar } from "../../../shared/components/HorizontalFilterBar";
import { Button } from "../../../shared/ui/Button";
import { Typography } from "../../../shared/ui/Typography";
import type { NotificationCategory } from "../api/notification.service";
import type { NotificationFilterOption } from "../types";

function FilterSlidersIcon({ className = "" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="none">
      <path d="M14.6688 12.5002C14.6688 12.4183 14.5879 12.2918 14.4116 12.2918H10.8822C10.706 12.2919 10.625 12.4183 10.625 12.5002V15.8335C10.625 15.9154 10.706 16.0417 10.8822 16.0418H14.4116C14.5879 16.0418 14.6688 15.9154 14.6688 15.8335V12.5002ZM6.91162 13.5418C7.2568 13.5418 7.53662 13.8217 7.53662 14.1668C7.53662 14.512 7.2568 14.7918 6.91162 14.7918H2.5C2.15482 14.7918 1.875 14.512 1.875 14.1668C1.875 13.8217 2.15482 13.5418 2.5 13.5418H6.91162ZM9.375 4.16683C9.375 4.08497 9.29398 3.95859 9.11784 3.9585H5.58838C5.41211 3.9585 5.33122 4.08495 5.33122 4.16683V7.50016C5.33122 7.58204 5.41211 7.7085 5.58838 7.7085H9.11784C9.29398 7.7084 9.375 7.58202 9.375 7.50016V4.16683ZM17.5 5.2085C17.8452 5.2085 18.125 5.48832 18.125 5.8335C18.125 6.17867 17.8452 6.4585 17.5 6.4585H13.0884C12.7432 6.4585 12.4634 6.17867 12.4634 5.8335C12.4634 5.48832 12.7432 5.2085 13.0884 5.2085H17.5ZM15.9188 13.5418H17.5C17.8452 13.5418 18.125 13.8217 18.125 14.1668C18.125 14.512 17.8452 14.7918 17.5 14.7918H15.9188V15.8335C15.9188 16.6721 15.21 17.2918 14.4116 17.2918H10.8822C10.0839 17.2917 9.375 16.672 9.375 15.8335V12.5002C9.375 11.6616 10.0839 11.0419 10.8822 11.0418H14.4116C15.21 11.0418 15.9188 11.6616 15.9188 12.5002V13.5418ZM10.625 7.50016C10.625 8.33868 9.91613 8.9584 9.11784 8.9585H5.58838C4.79003 8.9585 4.08122 8.33875 4.08122 7.50016V6.4585H2.5C2.15482 6.4585 1.875 6.17867 1.875 5.8335C1.875 5.48832 2.15482 5.2085 2.5 5.2085H4.08122V4.16683C4.08122 3.32824 4.79003 2.7085 5.58838 2.7085H9.11784C9.91613 2.70859 10.625 3.32832 10.625 4.16683V7.50016Z" fill="currentColor" />
    </svg>
  );
}

function CloseIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 16 16">
      <path d="M4 12L12 4M4 4l8 8" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
    </svg>
  );
}

export function NotificationFilterButton({
  count,
  onClick,
}: {
  count: number;
  onClick: () => void;
}) {
  return (
    <Button
      unstyled
      className="relative flex shrink-0 items-center gap-1 rounded-xl border border-outline-var bg-surface-container-lowest px-2.5 py-2 text-sm font-medium leading-5 text-on-surface-var focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-primary/40 active:bg-surface-container"
      onClick={onClick}
      type="button"
    >
      <FilterSlidersIcon className="h-5 w-5" />
      <Typography as="span" variant="body" size="medium" weight="regular">
        فیلتر
      </Typography>
      {count > 0 ? (
        <Typography
          as="span"
          variant="label"
          size="small"
          weight="semibold"
          className="grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-xs font-semibold leading-5 text-on-primary"
        >
          {count}
        </Typography>
      ) : null}
    </Button>
  );
}

export function NotificationFilterBar({
  onOpenFilters,
  onRemoveFilter,
  selectedFilters,
}: {
  onOpenFilters: () => void;
  onRemoveFilter: (id: NotificationCategory) => void;
  selectedFilters: NotificationFilterOption[];
}) {
  return (
    <HorizontalFilterBar
      ariaLabel="فیلتر اعلان‌ها"
      className="bg-surface-container"
      contentClassName="min-h-10"
    >
      <NotificationFilterButton
        count={selectedFilters.length}
        onClick={onOpenFilters}
      />
      {selectedFilters.map((filter) => (
        <Button
          unstyled
          aria-label={`حذف فیلتر ${filter.label}`}
          className="flex h-10 shrink-0 items-center gap-2 rounded-xl border border-primary bg-primary/10 px-3 text-sm font-medium leading-5 text-primary transition-all duration-200 active:scale-[0.97] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-primary/40"
          key={filter.id}
          onClick={() => onRemoveFilter(filter.id)}
          type="button"
        >
          <Typography as="span" variant="body" size="medium" weight="regular">
            {filter.label}
          </Typography>
          <CloseIcon className="h-4 w-4" />
        </Button>
      ))}
    </HorizontalFilterBar>
  );
}
