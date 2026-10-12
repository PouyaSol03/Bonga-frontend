import { HorizontalFilterBar } from "../../../shared/components/HorizontalFilterBar";
import LinearArrowDown1 from "../../../shared/icons/LinearArrowDown1";
import LinearCancelSmall from "../../../shared/icons/LinearCancelSmall";
import LinearLocation from "../../../shared/icons/LinearLocation";
import { Button } from "../../../shared/ui/Button";
import { Typography } from "../../../shared/ui/Typography";
import type { DirectoryMode, SortOption } from "../types";
import { SortIcon } from "./DirectoryIcons";

function FilterChip({
  active = false,
  icon,
  label,
  onClick,
  onRemove,
}: {
  active?: boolean;
  icon?: "chevron" | "location" | "sort";
  label: string;
  onClick?: () => void;
  onRemove?: () => void;
}) {
  const chipIcon =
    icon === "chevron" ? (
      <LinearArrowDown1 className="w-5 h-5" />
    ) : icon === "location" ? (
      <LinearLocation className="h-5 w-5" />
    ) : icon === "sort" ? (
      <SortIcon className="h-5 w-5 shrink-0" />
    ) : null;

  const chipContent = (
    <>
      {icon !== "chevron" && chipIcon}
      <Typography
        as="span"
        variant="body"
        size="medium"
        weight="regular"
        className={onRemove ? "max-w-[92px] truncate" : undefined}
      >
        {label}
      </Typography>
      {icon === "chevron" && chipIcon}
    </>
  );

  const chipClassName = `inline-flex items-center justify-center gap-1 rounded-lg border p-2 text-sm! font-medium! transition-colors ${
    active
      ? "border-primary bg-primary/10 text-primary"
      : "border-outline-var bg-surface-container-lowest text-on-surface-var"
  }`;

  if (onRemove) {
    return (
      <Typography
        as="span"
        variant="body"
        size="medium"
        weight="regular"
        className={`${chipClassName} overflow-hidden p-2`}
        dir="rtl"
      >
        <Button
          unstyled
          className="inline-flex h-full min-w-0 items-center justify-center gap-1 text-inherit"
          onClick={onClick}
          type="button"
        >
          {chipContent}
        </Button>
        <Button
          unstyled
          aria-label={`حذف ${label}`}
          className="grid h-full shrink-0 place-items-center text-inherit active:bg-primary/10"
          onClick={onRemove}
          type="button"
        >
          <LinearCancelSmall className="w-5 h-5" />
        </Button>
      </Typography>
    );
  }

  return (
    <Button unstyled className={chipClassName} dir="rtl" onClick={onClick} type="button">
      {chipContent}
    </Button>
  );
}

export function DirectoryFilterBar({
  mode,
  neighborhoodChipLabel,
  onClearNeighborhood,
  onOpenModeSheet,
  onOpenNeighborhoodSelect,
  onOpenSortSheet,
  selectedNeighborhood,
  selectedSortOption,
}: {
  mode: DirectoryMode;
  neighborhoodChipLabel: string;
  onClearNeighborhood: () => void;
  onOpenModeSheet: () => void;
  onOpenNeighborhoodSelect: () => void;
  onOpenSortSheet: () => void;
  selectedNeighborhood: unknown;
  selectedSortOption?: SortOption;
}) {
  return (
    <HorizontalFilterBar ariaLabel="فیلتر مشاورین" className="h-[53px] py-0 pt-2">
      <FilterChip
        icon="chevron"
        label={mode === "consultant" ? "مشاور" : "آژانس"}
        onClick={onOpenModeSheet}
      />
      {mode === "agency" ? (
        <FilterChip
          active={Boolean(selectedNeighborhood)}
          icon="location"
          label={neighborhoodChipLabel}
          onClick={onOpenNeighborhoodSelect}
          onRemove={selectedNeighborhood ? onClearNeighborhood : undefined}
        />
      ) : null}
      <FilterChip
        active={Boolean(selectedSortOption)}
        icon="sort"
        label={selectedSortOption?.label ?? "مرتب سازی"}
        onClick={onOpenSortSheet}
      />
    </HorizontalFilterBar>
  );
}
