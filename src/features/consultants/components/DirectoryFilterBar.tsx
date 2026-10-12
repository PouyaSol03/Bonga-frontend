import { HorizontalFilterBar } from "../../../shared/components/HorizontalFilterBar";
import LinearArrowDown1 from "../../../shared/icons/LinearArrowDown1";
import LinearCancelSmall from "../../../shared/icons/LinearCancelSmall";
import LinearLocation from "../../../shared/icons/LinearLocation";
import { Button } from "../../../shared/ui/Button";
import { Typography } from "../../../shared/ui/Typography";
import type { DirectoryMode, SortOption } from "../types";

function SortIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M7.70833 14.5833C7.70833 14.0626 7.70782 13.7093 7.68555 13.4367C7.66389 13.1718 7.625 13.0381 7.57813 12.946C7.46325 12.7205 7.27939 12.5367 7.05404 12.4219C6.96189 12.375 6.82816 12.3361 6.56331 12.3145C6.29069 12.2922 5.93744 12.2917 5.41667 12.2917C4.89589 12.2917 4.54264 12.2922 4.27002 12.3145C4.00518 12.3361 3.87144 12.375 3.7793 12.4219C3.55395 12.5367 3.37008 12.7205 3.25521 12.946C3.20833 13.0381 3.16945 13.1718 3.14779 13.4367C3.12551 13.7093 3.125 14.0626 3.125 14.5833C3.125 15.1041 3.12551 15.4574 3.14779 15.73C3.16945 15.9949 3.20833 16.1286 3.25521 16.2207C3.37008 16.4461 3.55395 16.63 3.7793 16.7448C3.87144 16.7917 4.00518 16.8306 4.27002 16.8522C4.54264 16.8745 4.89589 16.875 5.41667 16.875C5.93744 16.875 6.29069 16.8745 6.56331 16.8522C6.82816 16.8306 6.96189 16.7917 7.05404 16.7448C7.27938 16.63 7.46325 16.4461 7.57813 16.2207C7.625 16.1286 7.66389 15.9949 7.68555 15.73C7.70782 15.4574 7.70833 15.1041 7.70833 14.5833ZM14.375 12.1151C14.375 10.1975 14.3619 9.42933 14.0584 8.76058C13.7549 8.09181 13.1854 7.57614 11.7424 6.31348L11.2549 5.88705L11.2093 5.84229C10.9932 5.61065 10.9832 5.24841 11.1963 5.00488C11.4094 4.76149 11.7698 4.7231 12.028 4.90641L12.0785 4.94629L12.5659 5.37272C13.9242 6.56118 14.7556 7.27143 15.1969 8.24382C15.6382 9.21624 15.625 10.3102 15.625 12.1151V14.6712C15.6985 14.5948 15.7813 14.5101 15.8724 14.4141L17.0467 13.1755L17.0923 13.1315C17.3323 12.9245 17.6947 12.9292 17.9297 13.1519C18.1802 13.3893 18.1907 13.7851 17.9533 14.0356L16.7798 15.2743C16.4797 15.5909 16.2114 15.8751 15.966 16.0726C15.7077 16.2805 15.3963 16.4583 15 16.4583C14.6037 16.4583 14.2923 16.2805 14.034 16.0726C13.7886 15.8751 13.5203 15.5909 13.2202 15.2743L12.0467 14.0356L12.0044 13.9868C11.8109 13.7361 11.8355 13.3744 12.0703 13.1519C12.3208 12.9146 12.7159 12.9251 12.9533 13.1755L14.1276 14.4141C14.2187 14.5101 14.3015 14.5948 14.375 14.6712V12.1151ZM7.70833 5.41667C7.70833 4.89589 7.70782 4.54264 7.68555 4.27002C7.66389 4.00517 7.62501 3.87144 7.57813 3.7793C7.46325 3.55395 7.27939 3.37008 7.05404 3.25521C6.96189 3.20833 6.82816 3.16945 6.56331 3.14779C6.29069 3.12551 5.93744 3.125 5.41667 3.125C4.89589 3.125 4.54264 3.12551 4.27002 3.14779C4.00518 3.16945 3.87144 3.20833 3.7793 3.25521C3.55395 3.37008 3.37008 3.55395 3.25521 3.7793C3.20833 3.87144 3.16945 4.00517 3.14779 4.27002C3.12551 4.54264 3.125 4.89589 3.125 5.41667C3.125 5.93744 3.12551 6.29069 3.14779 6.56331C3.16945 6.82816 3.20833 6.96189 3.25521 7.05404C3.37008 7.27939 3.55395 7.46325 3.7793 7.57813C3.87144 7.625 4.00518 7.66389 4.27002 7.68555C4.54264 7.70782 4.89589 7.70833 5.41667 7.70833C5.93744 7.70833 6.29069 7.70782 6.56331 7.68555C6.82816 7.66389 6.96189 7.625 7.05404 7.57813C7.27938 7.46325 7.46325 7.27939 7.57813 7.05404C7.625 6.96189 7.66389 6.82816 7.68555 6.56331C7.70782 6.29069 7.70833 5.93744 7.70833 5.41667Z"
        fill="currentColor"
      />
    </svg>
  );
}

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
      <SortIcon />
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
