import { memo, useMemo } from "react";
import { HorizontalFilterBar } from "../../../shared/components/HorizontalFilterBar";
import { Chip } from "../../../shared/ui/Chip";
import { type ChatFilter } from "../api/chat.service";

export const filters: Array<{ label: string; value: ChatFilter }> = [
  { label: "خوانده نشده", value: "not_read" },
  { label: "آگهی‌های من", value: "my_ads" },
  { label: "آگهی‌های دیگران", value: "others_ads" },
];

export const FilterTabs = memo(function FilterTabs({
  activeFilter,
  onSelect,
  showSupportFilter = false,
}: {
  activeFilter: ChatFilter | null;
  onSelect: (filter: ChatFilter) => void;
  showSupportFilter?: boolean;
}) {
  const visibleFilters = useMemo(() => {
    if (showSupportFilter) {
      return [{ label: "پشتیبانی", value: "support" as ChatFilter }, ...filters];
    }
    return filters;
  }, [showSupportFilter]);

  return (
    <HorizontalFilterBar
      ariaLabel="فیلتر چت‌ها"
      className="bg-surface-container h-[52px]"
      contentClassName="h-9"
    >
      {visibleFilters.map((filter) => (
        <Chip
          key={filter.value}
          onClick={() => onSelect(filter.value)}
          selected={activeFilter === filter.value}
        >
          {filter.label}
        </Chip>
      ))}
    </HorizontalFilterBar>
  );
});
