import LinearCancelSmall from "../../../components/(icons)/LinearCancelSmall";
import LinearFilterHorizontal from "../../../components/(icons)/LinearFilterHorizontal";
import { HorizontalFilterBar } from "../../../components/HorizontalFilterBar";
import type { SearchFilterChip } from "../searchMapData";
import { Typography } from "../../../components/ui/Typography";
import { Button } from "../../../components/ui/Button";

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
        <Button unstyled
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

          <Typography as="span" variant="label" size="medium" weight="medium" className="whitespace-nowrap text-sm font-medium">{chip.label}</Typography>

          {chip.removable ? (
            <Typography as="span" variant="body" size="medium" weight="regular"
              className="relative h-5 w-5 shrink-0"
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
            </Typography>
          ) : null}
        </Button>
      ))}
    </HorizontalFilterBar>
  );
}
