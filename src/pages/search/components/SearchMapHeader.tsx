import type { SearchFilterChip } from "../searchMapData";

import { RouteLink } from "../../../routes/RouteLink";
import ArrowRight from "../../../assets/icons/ArrowRight";
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
      <div className="relative flex h-14 min-w-0 items-center pl-4 pr-16" dir="rtl">
        <RouteLink
          className="absolute right-0 top-1 flex h-12 w-12 shrink-0 items-center justify-center text-[#4d4d4d] focus-visible:outline-[3px] focus-visible:outline-offset-[-3px] focus-visible:outline-[#0048c440]"
          to="/home"
          aria-label="بازگشت"
        >
          <ArrowRight />
        </RouteLink>

        <button
          className="relative flex h-12 min-w-0 flex-1 items-center rounded-2xl border border-[#808080] bg-white px-3 text-right text-base font-normal leading-6 text-[#a6a6a6] focus-visible:outline-[3px] focus-visible:outline-offset-[-3px] focus-visible:outline-[#0048c440]"
          type="button"
          aria-label="جستجو در آگهی‌ها"
        >
          <span
            className="h-5 w-4 shrink-0 bg-[#808080]"
            style={{
              WebkitMask:
                "url(/figma/account/bookmark.svg) center / contain no-repeat",
              mask: "url(/figma/account/bookmark.svg) center / contain no-repeat",
            }}
            aria-hidden="true"
          />

          <span
            className="mx-3 h-6 w-px shrink-0 bg-[#cccccc]"
            aria-hidden="true"
          />

          <span className="min-w-0 flex-1 truncate text-center">
            {queryLabel}
          </span>

          {savedCount > 0 ? (
            <span className="sr-only">{savedCount} آگهی ذخیره شده</span>
          ) : null}
        </button>
      </div>

      <SearchMapFilterChips chips={chips} onChipClick={onChipClick} />
    </header>
  );
}
