import { useMemo } from "react";
import { Button } from "../../../../shared/ui/Button";
import { ChoiceIndicator } from "../../../../shared/ui/Choice";
import { FormChoiceChip } from "../../../../shared/form/FormControls";
import { SearchEmptyState } from "../../../../shared/components/SearchEmptyState";
import { Typography } from "../../../../shared/ui/Typography";
import {
  getNeighborhoodDescription,
  type NeighborhoodDto,
} from "../../../locations/api/neighborhood.service";
import { getNeighborhoodId } from "./quickFilterHelpers";

type NeighborhoodFilterSectionProps = {
  cityId: string;
  isError: boolean;
  isLoading: boolean;
  neighborhoodQuery: string;
  neighborhoods: NeighborhoodDto[];
  onNeighborhoodQueryChange: (query: string) => void;
  onRefetch: () => void;
  onRemoveNeighborhood: (id: string) => void;
  onToggleNeighborhood: (id: string) => void;
  selectedNeighborhoodIds: string[];
};

export function NeighborhoodFilterSection({
  cityId,
  isError,
  isLoading,
  neighborhoodQuery,
  neighborhoods,
  onNeighborhoodQueryChange,
  onRefetch,
  onRemoveNeighborhood,
  onToggleNeighborhood,
  selectedNeighborhoodIds,
}: NeighborhoodFilterSectionProps) {
  const selectedNeighborhoodSet = useMemo(
    () => new Set(selectedNeighborhoodIds),
    [selectedNeighborhoodIds],
  );

  return (
    <div className="flex min-h-full flex-col" dir="rtl">
      <label className="border-outline bg-surface-container-lowest focus-within:border-primary mb-3 flex h-12 shrink-0 items-center rounded-xl border px-4">
        <input
          className="text-on-surface placeholder:text-outline h-full min-w-0 flex-1 appearance-none border-0 bg-transparent p-0 text-right text-base leading-6 font-normal outline-none [&::-webkit-search-cancel-button]:hidden"
          onChange={(event) => onNeighborhoodQueryChange(event.target.value)}
          placeholder="جستجو محله"
          type="search"
          value={neighborhoodQuery}
        />
      </label>

      {selectedNeighborhoodIds.length > 0 ? (
        <div className="mb-3 flex flex-wrap justify-start gap-2">
          {selectedNeighborhoodIds.map((id) => {
            const neighborhood = neighborhoods.find((item) => getNeighborhoodId(item) === id);

            return (
              <FormChoiceChip
                key={id}
                label={neighborhood?.name ?? id}
                onClick={() => onRemoveNeighborhood(id)}
                removable
                selected
              />
            );
          })}
        </div>
      ) : null}

      {!cityId ? (
        <Typography
          as="p"
          variant="body"
          size="small"
          weight="regular"
          className="text-outline mx-auto w-full py-4 text-center"
        >
          برای انتخاب محله، ابتدا شهر را انتخاب کنید.
        </Typography>
      ) : isLoading ? (
        <div>
          {Array.from({ length: 5 }, (_, index) => (
            <div
              className="border-outline-var flex min-h-[72px] animate-pulse items-center justify-between gap-5 border-b py-3"
              key={index}
            >
              <div className="min-w-0 flex-1 space-y-2">
                <div className="bg-surface-container mr-auto h-5 w-28 rounded" />
                <div className="bg-surface-container-high mr-auto h-4 w-3/4 rounded" />
              </div>
              <div className="bg-surface-container-high h-[18px] w-[18px] rounded-sm" />
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="text-error mx-auto flex min-h-52 w-full flex-col items-center justify-center text-center text-sm leading-7">
          دریافت محله‌ها با خطا مواجه شد.
          <Button
            unstyled
            className="text-primary mt-2 font-semibold"
            onClick={onRefetch}
            type="button"
          >
            تلاش دوباره
          </Button>
        </div>
      ) : neighborhoods.length > 0 ? (
        <div>
          {neighborhoods.map((neighborhood) => {
            const id = getNeighborhoodId(neighborhood);
            const selected = selectedNeighborhoodSet.has(id);
            const description = getNeighborhoodDescription(neighborhood);

            return (
              <Button
                unstyled
                aria-pressed={selected}
                className="border-outline-var bg-surface-container-lowest flex min-h-[72px] w-full items-center justify-between gap-5 border-b py-3 text-right"
                key={id}
                onClick={() => onToggleNeighborhood(id)}
                type="button"
              >
                <span className="min-w-0 flex-1">
                  <Typography
                    as="span"
                    variant="body"
                    size="medium"
                    weight="regular"
                    className="text-on-surface block"
                  >
                    {neighborhood.name}
                  </Typography>
                  {description ? (
                    <Typography
                      as="span"
                      variant="body"
                      size="small"
                      weight="regular"
                      className="text-outline mt-0.5 line-clamp-1 block"
                    >
                      {description}
                    </Typography>
                  ) : null}
                </span>
                <ChoiceIndicator checked={selected} />
              </Button>
            );
          })}
        </div>
      ) : neighborhoodQuery.trim() ? (
        <SearchEmptyState compact />
      ) : (
        <Typography
          as="p"
          variant="body"
          size="small"
          weight="regular"
          className="text-outline mx-auto w-full py-4 text-center"
        >
          محله‌ای برای این شهر ثبت نشده است.
        </Typography>
      )}
    </div>
  );
}
