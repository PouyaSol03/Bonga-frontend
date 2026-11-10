import { HorizontalFilterBar } from "../../../../shared/components/HorizontalFilterBar";
import LinearArrowDown1 from "../../../../shared/icons/LinearArrowDown1";
import { Button } from "../../../../shared/ui/Button";
import { Typography } from "../../../../shared/ui/Typography";
import type { PropertySearchRequest } from "../../api/property-request.service";
import type { RequestFilterId } from "../types";

export function RequestResultsFilterBar({
  activeFilterId,
  activeFilterTitle,
  isFilterSheetOpen,
  isPersonal,
  onOpenFilterSheet,
  onSelectFilter,
  requests,
}: {
  activeFilterId: RequestFilterId;
  activeFilterTitle: string;
  isFilterSheetOpen: boolean;
  isPersonal: boolean;
  onOpenFilterSheet: () => void;
  onSelectFilter: (id: RequestFilterId) => void;
  requests: PropertySearchRequest[];
}) {
  if (requests.length === 0) return null;

  if (isPersonal) {
    return (
      <HorizontalFilterBar
        ariaLabel="فیلتر نتایج بر اساس درخواست"
        className="border-outline-var bg-surface-container-lowest border-t py-2"
      >
        <Button
          unstyled
          className={`focus-visible:outline-primary/40 inline-flex shrink-0 cursor-pointer items-center justify-center rounded-[10px] border px-3 py-1.5 text-sm leading-5 font-medium transition focus-visible:outline-[3px] focus-visible:outline-offset-2 ${
            activeFilterId === "all"
              ? "border-primary bg-primary/16 text-primary"
              : "border-outline-var bg-surface-container-lowest text-on-surface"
          }`}
          onClick={() => onSelectFilter("all")}
          type="button"
        >
          <Typography as="span" variant="label" size="medium" weight="medium">
            همه
          </Typography>
        </Button>
        {requests.map((request) => {
          const isSelected = activeFilterId === request.id;
          return (
            <Button
              unstyled
              key={request.id}
              className={`focus-visible:outline-primary/40 inline-flex max-w-[200px] shrink-0 cursor-pointer items-center justify-center rounded-[10px] border px-3 py-1.5 text-sm leading-5 font-medium transition focus-visible:outline-[3px] focus-visible:outline-offset-2 ${
                isSelected
                  ? "border-primary bg-primary/16 text-primary"
                  : "border-outline-var bg-surface-container-lowest text-on-surface"
              }`}
              onClick={() => onSelectFilter(request.id)}
              type="button"
            >
              <Typography
                as="span"
                variant="label"
                size="medium"
                weight="medium"
                className="truncate"
              >
                {request.title}
              </Typography>
            </Button>
          );
        })}
      </HorizontalFilterBar>
    );
  }

  return (
    <div className="bg-surface-container-lowest px-4 py-2 shadow-[0_4px_16px_rgba(26,26,26,0.08)]">
      <Button
        unstyled
        aria-label="انتخاب درخواست"
        aria-haspopup="dialog"
        aria-expanded={isFilterSheetOpen}
        onClick={onOpenFilterSheet}
        className="border-outline-var text-on-surface focus-visible:outline-primary flex h-10 w-full items-center justify-between gap-3 rounded-xl border px-3 [direction:rtl] focus-visible:outline-2"
        type="button"
      >
        <Typography
          as="span"
          variant="body"
          size="medium"
          weight="regular"
          className="min-w-0 truncate"
        >
          {activeFilterId === "all" ? "همه" : activeFilterTitle}
        </Typography>
        <LinearArrowDown1
          aria-hidden="true"
          className="text-on-surface-var h-6 w-6 shrink-0 opacity-40"
        />
      </Button>
    </div>
  );
}
