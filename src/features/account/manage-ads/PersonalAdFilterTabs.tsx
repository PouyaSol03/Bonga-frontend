import { HorizontalFilterBar } from "../../../shared/components/HorizontalFilterBar";
import { Chip } from "../../../shared/ui/Chip";
import type { PersonalAdFilter } from "./usePersonalMyAds";

type PersonalAdFilterTabsProps = {
  activeFilter: PersonalAdFilter;
  filters: PersonalAdFilter[];
  onSelect: (filter: PersonalAdFilter) => void;
};

export function PersonalAdFilterTabs({
  activeFilter,
  filters,
  onSelect,
}: PersonalAdFilterTabsProps) {
  return (
    <HorizontalFilterBar
      ariaLabel="فیلتر آگهی‌های من"
      className="bg-surface-container h-[52px]"
      contentClassName="h-9"
    >
      {filters.map((filter) => {
        const isActive = activeFilter.label === filter.label;
        return (
          <Chip key={filter.label} onClick={() => onSelect(filter)} selected={isActive}>
            {filter.label}
          </Chip>
        );
      })}
    </HorizontalFilterBar>
  );
}
