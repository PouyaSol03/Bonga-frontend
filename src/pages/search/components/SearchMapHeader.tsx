import { memo } from "react";
import type { SearchFilterChip } from "../searchMapData";

import { TopBar } from "../../../components/TopBar";
import { SearchMapFilterChips } from "./SearchMapFilterChips";

type SearchMapHeaderProps = {
  queryLabel?: string;
  savedCount?: number;
  chips: SearchFilterChip[];
  onChipClick?: (chip: SearchFilterChip) => void;
  onChipRemove?: (chip: SearchFilterChip) => void;
  onSearchClick?: () => void;
  onSavedClick?: () => void;
};

function SearchMapHeaderComponent({
  queryLabel = "جستجو در آگهی‌ها",
  savedCount = 0,
  chips,
  onChipClick,
  onChipRemove,
  onSearchClick,
  onSavedClick,
}: SearchMapHeaderProps) {
  return (
    <header className="absolute inset-x-0 top-0 z-500 bg-[#f0f0f0]">
      <TopBar
        backTo="/home"
        contentClassName="px-2"
        heightClassName="h-16"
        search={{
          label: queryLabel,
          onClick: onSearchClick,
          onSavedClick,
          savedCount,
          savedLabel: "جستجوی ذخیره شده",
        }}
      />

      <SearchMapFilterChips chips={chips} onChipClick={onChipClick} onChipRemove={onChipRemove} />
    </header>
  );
}

export const SearchMapHeader = memo(SearchMapHeaderComponent);
