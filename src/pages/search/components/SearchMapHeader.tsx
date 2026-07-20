import { memo } from "react";
import type { SearchFilterChip } from "../searchMapData";

import { TopBar } from "../../../components/TopBar";
import { SearchMapFilterChips } from "./SearchMapFilterChips";

type SearchMapHeaderProps = {
  queryLabel?: string;
  savedCount?: number;
  isCurrentSearchSaved?: boolean;
  isSavingSearch?: boolean;
  isSaveSearchDisabled?: boolean;
  chips: SearchFilterChip[];
  onChipClick?: (chip: SearchFilterChip) => void;
  onChipRemove?: (chip: SearchFilterChip) => void;
  onSearchClick?: () => void;
  onSavedClick?: () => void;
  onBack?: () => void;
};

function SearchMapHeaderComponent({
  queryLabel = "جستجو در آگهی‌ها",
  savedCount = 0,
  isCurrentSearchSaved = false,
  isSavingSearch = false,
  isSaveSearchDisabled = false,
  chips,
  onChipClick,
  onChipRemove,
  onSearchClick,
  onSavedClick,
  onBack,
}: SearchMapHeaderProps) {
  return (
    <header className="absolute inset-x-0 top-0 z-[500] bg-[#f0f0f0]">
      <TopBar
        backTo="/home"
        onBack={onBack}
        contentClassName="px-2"
        heightClassName="h-16"
        search={{
          label: queryLabel,
          onClick: onSearchClick,
          onSavedClick,
          isSaved: isCurrentSearchSaved,
          isSaving: isSavingSearch,
          isSavedDisabled: isSaveSearchDisabled,
          savedCount,
          savedLabel: isCurrentSearchSaved
            ? "نمایش جستجوهای ذخیره شده"
            : "ذخیره جستجوی فعلی",
        }}
      />

      <SearchMapFilterChips chips={chips} onChipClick={onChipClick} onChipRemove={onChipRemove} />
    </header>
  );
}

export const SearchMapHeader = memo(SearchMapHeaderComponent);
