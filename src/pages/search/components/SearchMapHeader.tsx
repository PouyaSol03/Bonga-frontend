import type { SearchFilterChip } from "../searchMapData";

import { TopBar } from "../../../components/TopBar";
import { SearchMapFilterChips } from "./SearchMapFilterChips";

type SearchMapHeaderProps = {
  queryLabel?: string;
  savedCount?: number;
  chips: SearchFilterChip[];
  onChipClick?: (chip: SearchFilterChip) => void;
};

export function SearchMapHeader({
  queryLabel = "جستجو در آگهی‌ها",
  savedCount = 0,
  chips,
  onChipClick,
}: SearchMapHeaderProps) {
  return (
    <header className="absolute inset-x-0 top-0 z-500 bg-[#f0f0f0]">
      <TopBar
        backTo="/home"
        search={{
          label: queryLabel,
          savedCount,
        }}
      />

      <SearchMapFilterChips chips={chips} onChipClick={onChipClick} />
    </header>
  );
}
