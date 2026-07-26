import LinearCancelSmall from "../../../components/(icons)/LinearCancelSmall";
import LinearFilterHorizontal from "../../../components/(icons)/LinearFilterHorizontal";
import { HorizontalFilterBar } from "../../../components/HorizontalFilterBar";
import type { SearchFilterChip } from "../searchMapData";

type SearchMapFilterChipsProps = {
  chips: SearchFilterChip[];
  onChipClick?: (chip: SearchFilterChip) => void;
  onChipRemove?: (chip: SearchFilterChip) => void;
};

export function SearchMapFilterChips({
  chips,
  onChipClick,
  onChipRemove,
}: SearchMapFilterChipsProps) {
  return (
    <HorizontalFilterBar ariaLabel="فیلترهای جستجو">
      {[...chips].map((chip) => (
        <button
          key={chip.id}
          dir="rtl"
          className={`inline-flex shrink-0 cursor-pointer items-center justify-center gap-1 rounded-[10px] border p-2 text-sm font-medium leading-5 focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#0048c440] ${
            chip.isActive
              ? "border-[#0048c4] bg-[#dbe8ff] text-[#0048c4]"
              : "border-[#cccccc] bg-white text-[#1a1a1a]"
          }`}
          type="button"
          onClick={() => onChipClick?.(chip)}
        >
          {chip.id === "filters" ? <LinearFilterHorizontal className="w-5 h-5"/> : null}

          <span className="whitespace-nowrap text-sm font-medium">{chip.label}</span>

          {chip.removable ? (
            <span
              className="relative h-4 w-4 shrink-0"
              aria-label={`حذف فیلتر ${chip.label}`}
              role="button"
              tabIndex={0}
              onClick={(event) => {
                event.stopPropagation();
                onChipRemove?.(chip);
              }}
              onKeyDown={(event) => {
                if (event.key !== "Enter" && event.key !== " ") return;

                event.preventDefault();
                event.stopPropagation();
                onChipRemove?.(chip);
              }}
            >
              <LinearCancelSmall className="w-5 h-5"/>
            </span>
          ) : null}
        </button>
      ))}
    </HorizontalFilterBar>
  );
}

function FilterSlidersIcon() {
  return (
    <svg
      className="h-5 w-5 shrink-0"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3 5h8M15 5h2M3 10h2M9 10h8M3 15h8M15 15h2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M11 3.25h4v3.5h-4v-3.5ZM5 8.25h4v3.5H5v-3.5ZM11 13.25h4v3.5h-4v-3.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}
