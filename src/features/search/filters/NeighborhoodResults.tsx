import {
  type NeighborhoodDto,
  getNeighborhoodDescription,
} from "../../locations/api/neighborhood.service";
import { Typography } from "../../../shared/ui/Typography";
import { Button } from "../../../shared/ui/Button";
import { getNeighborhoodOptionId } from "./neighborhoodValues";
import { ChoiceIndicator } from "../../../shared/ui/Choice";
import { SearchEmptyState } from "../../../shared/components/SearchEmptyState";

export function NeighborhoodResults({
  cityId,
  isLoading,
  isError,
  onRetry,
  neighborhoods,
  selectedIds,
  toggleNeighborhood,
  query,
}: {
  cityId: string;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  neighborhoods: NeighborhoodDto[];
  selectedIds: Set<string>;
  toggleNeighborhood: (neighborhood: NeighborhoodDto) => void;
  query: string;
}) {
  return !cityId ? (
    <Typography
      as="p"
      variant="body"
      size="small"
      weight="regular"
      className="text-outline m-0 mx-auto w-full px-2 py-4 text-center text-sm leading-6 font-normal"
    >
      برای انتخاب محله، ابتدا شهر را انتخاب کنید.
    </Typography>
  ) : isLoading ? (
    <div>
      {Array.from({ length: 7 }, (_, index) => (
        <div
          className="flex min-h-[88px] animate-pulse items-center justify-between gap-5 py-3"
          key={index}
        >
          <div className="min-w-0 flex-1 space-y-3">
            <div className="bg-surface-container mr-auto h-5 w-28 rounded" />
            <div className="bg-surface-container-high mr-auto h-4 w-4/5 rounded" />
          </div>
          <div className="bg-surface-container-high h-[18px] w-[18px] rounded-sm" />
        </div>
      ))}
    </div>
  ) : isError ? (
    <div className="text-error mx-auto flex min-h-[320px] w-full flex-col items-center justify-center px-8 text-center text-sm leading-7">
      دریافت محله‌ها با خطا مواجه شد.
      <Button
        unstyled
        className="text-primary mt-3 font-semibold"
        onClick={() => void onRetry()}
        type="button"
      >
        تلاش دوباره
      </Button>
    </div>
  ) : neighborhoods.length > 0 ? (
    <div>
      {neighborhoods.map((neighborhood) => {
        const neighborhoodId = getNeighborhoodOptionId(neighborhood);
        const description = getNeighborhoodDescription(neighborhood);
        const isSelected = selectedIds.has(neighborhoodId);

        return (
          <Button
            unstyled
            aria-pressed={isSelected}
            className="bg-surface-container-lowest text-on-surface flex min-h-[88px] w-full items-center justify-between gap-5 py-3 text-right outline-none [-webkit-tap-highlight-color:transparent]"
            key={neighborhoodId}
            onClick={() => toggleNeighborhood(neighborhood)}
            type="button"
          >
            <Typography
              as="span"
              variant="body"
              size="medium"
              weight="regular"
              className="min-w-0 flex-1"
            >
              <Typography
                as="span"
                variant="body"
                size="medium"
                weight="regular"
                className="text-on-surface block text-base leading-6 font-normal"
              >
                {neighborhood.name}
              </Typography>
              {description ? (
                <Typography
                  as="span"
                  variant="body"
                  size="small"
                  weight="regular"
                  className="text-outline mt-0.5 line-clamp-2 block text-sm leading-6 font-normal"
                >
                  {description}
                </Typography>
              ) : null}
            </Typography>
            <ChoiceIndicator checked={isSelected} />
          </Button>
        );
      })}
    </div>
  ) : query.trim() ? (
    <SearchEmptyState compact />
  ) : (
    <Typography
      as="p"
      variant="body"
      size="small"
      weight="regular"
      className="text-outline m-0 mx-auto w-full px-2 py-4 text-center text-sm leading-6 font-normal"
    >
      محله‌ای برای این شهر ثبت نشده است.
    </Typography>
  );
}
