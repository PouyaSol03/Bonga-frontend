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
      className="-mx-3 mt-3 overflow-x-auto px-3 sm:-mx-4 sm:mt-4 sm:px-4"
      aria-label="فیلترهای جستجو"
      dir="rtl"
    >
      <div className="flex w-max min-w-full items-center gap-1 pb-1 sm:gap-2">
        {chips.map((chip) => (
          <button
            key={chip.id}
            className={`inline-flex h-9 shrink-0 cursor-pointer items-center justify-center gap-1 rounded-lg border px-2.5 text-xs font-medium leading-4 shadow-sm transition-colors focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#0048c440] sm:h-10 sm:gap-1.5 sm:px-3 sm:text-sm sm:leading-5 ${
              chip.isActive
                ? "border-[#0048c4] bg-[#e8eef9] text-[#0048c4]"
                : "border-[#cccccc] bg-white text-[#1a1a1a]"
            }`}
            type="button"
            onClick={() => onChipClick?.(chip)}
          >
            <span className="whitespace-nowrap">{chip.label}</span>

            {chip.removable ? (
              <span
                className="relative h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4"
                aria-hidden="true"
              >
                <span className="absolute left-1/2 top-1/2 h-2.5 w-0.5 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-full bg-current sm:h-3" />
                <span className="absolute left-1/2 top-1/2 h-2.5 w-0.5 -translate-x-1/2 -translate-y-1/2 -rotate-45 rounded-full bg-current sm:h-3" />
              </span>
            ) : null}
          </button>
        ))}
      </div>
    </section>
  );
}
