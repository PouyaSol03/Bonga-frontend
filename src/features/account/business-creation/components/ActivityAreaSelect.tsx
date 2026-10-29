import LinearArrowLeft1 from "../../../../shared/icons/LinearArrowLeft1";
import LinearCancelSmall from "../../../../shared/icons/LinearCancelSmall";
import { Button } from "../../../../shared/ui/Button";
import { Typography } from "../../../../shared/ui/Typography";
import type { NeighborhoodDto } from "../../../locations/api/neighborhood.service";
import { getNeighborhoodId } from "../businessCreationHelpers";

export function ActivityAreaSelect({
  error,
  onClick,
  onRemove,
  placeholder,
  selectedNeighborhoods,
}: {
  error?: string | null;
  onClick: () => void;
  onRemove: (neighborhoodId: string) => void;
  placeholder: string;
  selectedNeighborhoods: NeighborhoodDto[];
}) {
  const hasValue = selectedNeighborhoods.length > 0;
  const visibleNeighborhoods = selectedNeighborhoods.slice(0, 2);

  return (
    <div
      aria-invalid={Boolean(error)}
      className={`bg-surface-container-lowest focus-within:border-primary focus-within:outline-primary/40 flex min-h-14 w-full cursor-pointer items-center gap-2 rounded-[16px] border py-3 pr-4 pl-3 text-base leading-6 font-normal transition focus-within:outline-3 focus-within:outline-offset-2 ${
        error ? "border-error" : "border-outline"
      }`}
      onClick={onClick}
      onKeyDown={(event) => {
        if (event.key !== "Enter" && event.key !== " ") return;

        event.preventDefault();
        onClick();
      }}
      role="button"
      tabIndex={0}
    >
      <div className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden [direction:rtl]">
        {hasValue ? (
          visibleNeighborhoods.map((neighborhood) => {
            const neighborhoodId = getNeighborhoodId(neighborhood);

            return (
              <Button
                unstyled
                aria-label={`حذف ${neighborhood.name}`}
                className="bg-primary-container text-primary active:bg-primary-container/80 inline-flex h-9 max-w-[132px] shrink-0 items-center gap-2 rounded-[8px] px-3 text-sm leading-5 font-semibold"
                key={neighborhoodId}
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  onRemove(neighborhoodId);
                }}
                type="button"
              >
                <Typography
                  as="span"
                  variant="body"
                  size="medium"
                  weight="regular"
                  className="min-w-0 truncate"
                >
                  {neighborhood.name}
                </Typography>
                <LinearCancelSmall className="text-on-surface-var h-5 w-5" />
              </Button>
            );
          })
        ) : (
          <Typography
            as="span"
            variant="body"
            size="medium"
            weight="regular"
            className="text-outline min-w-0 flex-1 truncate text-right"
          >
            {placeholder}
          </Typography>
        )}
      </div>

      {hasValue ? (
        <Typography
          as="span"
          variant="label"
          size="large"
          weight="semibold"
          className="bg-primary text-on-primary grid h-8 w-8 shrink-0 place-items-center rounded-[8px] text-base leading-6 font-semibold"
        >
          {selectedNeighborhoods.length}
        </Typography>
      ) : null}

      <Typography
        as="span"
        variant="body"
        size="medium"
        weight="regular"
        className="text-on-surface-var grid h-8 w-8 shrink-0 place-items-center"
      >
        <LinearArrowLeft1 className="h-5 w-5" />
      </Typography>
    </div>
  );
}
