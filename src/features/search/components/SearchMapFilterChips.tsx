import LinearCancelSmall from "../../../shared/icons/LinearCancelSmall";
import LinearFilterHorizontal from "../../../shared/icons/LinearFilterHorizontal";
import { HorizontalFilterBar } from "../../../shared/components/HorizontalFilterBar";
import type { SearchFilterChip } from "../searchMapData";
import { Typography } from "../../../shared/ui/Typography";
import { Button } from "../../../shared/ui/Button";

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
        <Button
          unstyled
          key={chip.id}
          dir="rtl"
          className={`focus-visible:outline-primary/25 inline-flex shrink-0 cursor-pointer items-center justify-center gap-1 rounded-[10px] border p-2 text-sm leading-5 font-medium focus-visible:outline-[3px] focus-visible:outline-offset-2 ${
            chip.isActive
              ? "border-primary bg-primary/16 text-primary"
              : "border-outline-var bg-surface-container-lowest text-on-surface"
          }`}
          type="button"
          onClick={() => onChipClick?.(chip)}
        >
          {chip.id === "filters" ? <LinearFilterHorizontal className="h-5 w-5" /> : null}

          <Typography
            as="span"
            variant="label"
            size="medium"
            weight="medium"
            className="text-sm font-medium whitespace-nowrap"
          >
            {chip.label}
          </Typography>

          {chip.removable ? (
            <Typography
              as="span"
              variant="body"
              size="medium"
              weight="regular"
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
              <LinearCancelSmall className="h-5 w-5" />
            </Typography>
          ) : null}
        </Button>
      ))}
    </HorizontalFilterBar>
  );
}
