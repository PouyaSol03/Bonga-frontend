import LinearCancel from "../../../../shared/icons/LinearCancel";
import LinearEdit2 from "../../../../shared/icons/LinearEdit2";
import { Button } from "../../../../shared/ui/Button";
import { Typography } from "../../../../shared/ui/Typography";
import {
  getCollapsedPropertyRequestDetails,
  toPersianDigits,
  type PropertySearchRequest,
} from "../../api/property-request.service";

export function CriteriaRequestCard({
  onCancel,
  onEdit,
  request,
}: {
  onCancel: () => void;
  onEdit: () => void;
  request: PropertySearchRequest;
}) {
  const { hiddenCount, visibleDetails } = getCollapsedPropertyRequestDetails(request, 6);

  return (
    <article className="bg-surface-container-lowest min-h-[148px] overflow-hidden p-4 text-right">
      <div className="flex min-h-7 items-center justify-between gap-3 [direction:ltr]">
        <Button
          unstyled
          className="text-error focus-visible:outline-error/40 active:bg-error-container/30 inline-flex h-7 shrink-0 items-center justify-center gap-1 rounded-lg px-0.5 leading-4 font-medium focus-visible:outline-3 focus-visible:outline-offset-[-3px]"
          onClick={onCancel}
          type="button"
        >
          <Typography as="span" variant="label" size="medium" weight="medium">
            لغو
          </Typography>
          <LinearCancel className="text-on-surface-var h-5 w-5" />
        </Button>

        <Button
          unstyled
          aria-label={`ویرایش ${request.title}`}
          className="focus-visible:outline-primary/40 flex min-w-0 flex-1 items-center justify-end gap-1.5 rounded-lg text-right [direction:ltr] focus-visible:outline-3 focus-visible:outline-offset-4"
          onClick={onEdit}
          type="button"
        >
          <LinearEdit2 className="text-on-surface-var h-4 w-4" />
          <Typography
            as="span"
            variant="title"
            size="medium"
            weight="semibold"
            className="text-on-surface text-right [direction:rtl]"
          >
            {request.title}
          </Typography>
        </Button>
      </div>

      {visibleDetails.length ? (
        <div className="mt-3 flex flex-wrap justify-start gap-2 [direction:rtl]">
          {visibleDetails.map((detail) => (
            <Typography
              as="span"
              variant="label"
              size="medium"
              weight="semibold"
              className="border-outline-var bg-surface-container-lowest text-on-surface-var inline-flex max-w-full items-center rounded-lg border text-sm leading-4 font-semibold"
              title={detail}
              key={detail}
            >
              <Typography
                as="span"
                variant="label"
                size="medium"
                weight="semibold"
                className="px-2 py-1.5"
              >
                {detail}
              </Typography>
            </Typography>
          ))}
          {hiddenCount > 0 ? (
            <Typography
              as="span"
              variant="label"
              size="small"
              weight="medium"
              className="border-outline-var bg-surface-container text-on-surface-var inline-flex h-[25px] items-center rounded-[7px] border px-2 text-[11px] leading-4 font-medium"
            >
              و {toPersianDigits(hiddenCount)} مورد بیشتر
            </Typography>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}
