import type { SearchFilterChip } from "../searchMapData";

type SearchMapFilterChipsProps = {
  chips: SearchFilterChip[];
  onChipClick?: (chip: SearchFilterChip) => void;
};

export function SearchMapFilterChips({
  chips,
  onChipClick,
}: SearchMapFilterChipsProps) {
  return (
    <section
      className="overflow-x-auto px-4 py-3"
      aria-label="فیلترهای جستجو"
      dir="rtl"
    >
      <div className="flex w-max min-w-full items-center gap-2">
        {[...chips].map((chip) => (
          <button
            key={chip.id}
            dir="rtl"
            className={`inline-flex h-9 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-[10px] border px-2 text-sm font-medium leading-5 focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#0048c440] ${
              chip.isActive
                ? "border-[#0048c4] bg-[#dbe8ff] text-[#0048c4]"
                : "border-[#cccccc] bg-white text-[#1a1a1a]"
            }`}
            type="button"
            onClick={() => onChipClick?.(chip)}
          >
            {chip.id === "filters" ? <FilterSlidersIcon /> : null}

            <span className="whitespace-nowrap">{chip.label}</span>

            {chip.removable ? (
              <span
                className="relative h-4 w-4 shrink-0"
                aria-hidden="true"
              >
                <span className="absolute left-1/2 top-1/2 h-3 w-0.5 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-full bg-current" />
                <span className="absolute left-1/2 top-1/2 h-3 w-0.5 -translate-x-1/2 -translate-y-1/2 -rotate-45 rounded-full bg-current" />
              </span>
            ) : null}
          </button>
        ))}
      </div>
    </section>
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
