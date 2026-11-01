import LinearCity from "../../../../shared/icons/LinearCity";
import LinearDelete from "../../../../shared/icons/LinearDelete";
import { Button } from "../../../../shared/ui/Button";
import { Typography } from "../../../../shared/ui/Typography";
import { toPersianDigits, type PropertySearchRequest } from "../../api/property-request.service";
import {
  formatReceivedRequestDate,
  getReceivedRequestDetails,
} from "../requestHelpers";

export function ReceivedRequestCard({
  isNew,
  onDelete,
  request,
}: {
  isNew: boolean;
  onDelete: () => void;
  request: PropertySearchRequest;
}) {
  const { hiddenCount, visibleDetails } = getReceivedRequestDetails(request, 6);
  const requestDate = formatReceivedRequestDate(request);

  return (
    <article className="border-surface-container bg-surface-container-lowest relative border-b-8 px-4 pt-7 pb-6 text-right">
      {isNew ? (
        <Typography
          as="span"
          variant="label"
          size="small"
          weight="medium"
          className="bg-error text-on-error absolute top-2 left-4 inline-flex h-6 items-center rounded-full px-2.5 text-xs leading-6 font-medium"
        >
          جدید
        </Typography>
      ) : null}

      <div className="flex items-start justify-between gap-4 [direction:ltr]">
        <Button
          unstyled
          aria-label={`حذف ${request.title}`}
          className="text-on-surface-var focus-visible:outline-primary/40 active:bg-surface-container grid h-10 w-10 shrink-0 place-items-center rounded-lg transition focus-visible:outline-3 focus-visible:outline-offset-[-3px]"
          onClick={onDelete}
          type="button"
        >
          <LinearDelete className="h-6 w-6" />
        </Button>

        <div className="min-w-0 flex-1 [direction:rtl]">
          <div className="flex min-h-10 flex-wrap items-center gap-2">
            <LinearCity className="text-on-surface-var h-6 w-6 shrink-0" />
            <Typography
              as="h2"
              variant="title"
              size="medium"
              weight="semibold"
              className="text-on-surface m-0 min-w-0 text-[17px] leading-7 font-bold"
            >
              {request.title}
            </Typography>
            {requestDate ? (
              <time
                className="bg-surface-container text-on-surface inline-flex h-8 shrink-0 items-center rounded-[10px] px-3 text-xs leading-5 font-normal"
                dateTime={request.createdAt}
              >
                {requestDate}
              </time>
            ) : null}
          </div>

          {visibleDetails.length ? (
            <div className="mt-3 flex flex-wrap justify-start gap-2 [direction:rtl]">
              {visibleDetails.map((detail) => (
                <Typography
                  as="span"
                  variant="label"
                  size="medium"
                  weight="semibold"
                  className="border-outline-var bg-surface-container-lowest text-on-surface-var inline-flex max-w-full items-center rounded-[9px] border px-2.5 py-1.5 text-sm leading-5 font-semibold"
                  key={detail}
                  title={detail}
                >
                  {detail}
                </Typography>
              ))}
              {hiddenCount > 0 ? (
                <Typography
                  as="span"
                  variant="label"
                  size="small"
                  weight="medium"
                  className="border-outline-var bg-surface-container text-on-surface-var inline-flex items-center rounded-[9px] border px-2.5 py-1.5 text-xs leading-5 font-medium"
                >
                  و {toPersianDigits(hiddenCount)} مورد بیشتر
                </Typography>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}
