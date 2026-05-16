import type { SearchFilterChip } from "../searchMapData";

import { RouteLink } from "../../../routes/RouteLink";
import ArrowRight from "../../../assets/icons/ArrowRight";
import { SearchMapFilterChips } from "./SearchMapFilterChips";

type SearchMapHeaderProps = {
  queryLabel: string;
  savedCount?: number;
  chips: SearchFilterChip[];
  onChipClick?: (chip: SearchFilterChip) => void;
};

export function SearchMapHeader({
  queryLabel,
  savedCount = 0,
  chips,
  onChipClick,
}: SearchMapHeaderProps) {
  return (
    <header className="absolute inset-x-0 top-0 z-[500] bg-white px-3 pb-2 pt-[max(12px,env(safe-area-inset-top))] shadow-[0_4px_18px_rgba(26,26,26,0.08)] sm:px-4 sm:pb-3 sm:pt-4">
      <div className="flex min-w-0 items-center [direction:rtl]">
        <RouteLink
          className="flex h-10 w-10 shrink-0 items-center justify-center text-[#4d4d4d] focus-visible:outline-[3px] focus-visible:outline-offset-[-3px] focus-visible:outline-[#0048c440] sm:h-12 sm:w-12"
          to="/home"
          aria-label="بازگشت"
        >
          <ArrowRight />
        </RouteLink>

        <button
          className="relative flex h-10 min-w-0 flex-1 items-center rounded-xl border border-[#808080] bg-white px-2.5 text-right text-sm font-normal leading-5 text-[#a6a6a6] focus-visible:outline-[3px] focus-visible:outline-offset-[-3px] focus-visible:outline-[#0048c440] sm:h-12 sm:px-3 sm:text-base sm:leading-6"
          type="button"
          aria-label="جستجو در آگهی‌ها"
        >
          <span
            className="h-5 w-4 shrink-0 bg-[#808080] sm:h-6 sm:w-5"
            style={{
              WebkitMask:
                "url(/figma/account/bookmark.svg) center / contain no-repeat",
              mask: "url(/figma/account/bookmark.svg) center / contain no-repeat",
            }}
            aria-hidden="true"
          />

          <span
            className="mx-2 h-5 w-px shrink-0 bg-[#cccccc] sm:mx-3 sm:h-6"
            aria-hidden="true"
          />

          <span className="min-w-0 flex-1 truncate">{queryLabel}</span>

          {savedCount > 0 ? (
            <span className="sr-only">{savedCount} آگهی ذخیره شده</span>
          ) : null}
        </button>
      </div>

      <SearchMapFilterChips chips={chips} onChipClick={onChipClick} />
    </header>
  );
}
