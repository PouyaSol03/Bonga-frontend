import { ViewAdIcon } from ".././ViewAdIcon";
import { type AdvertiserPreview } from ".././viewAdDetails";
import { Typography } from "../../../../shared/ui/Typography";

export function AdvertiserMetrics({
  agencyStyle = false,
  preview,
}: {
  agencyStyle?: boolean;
  preview: AdvertiserPreview;
}) {
  if (!preview.ratingScore && !preview.rank) return null;

  if (agencyStyle) {
    return (
      <div className="text-on-surface-var mx-auto mt-4 flex items-center justify-center gap-4 [direction:rtl]">
        {preview.ratingScore ? (
          <div className="flex items-center gap-1 [direction:rtl]">
            <ViewAdIcon className="text-on-surface-var h-4 w-4" name="star" />
            <Typography as="span" variant="body" size="small" weight="medium">
              امتیاز
            </Typography>
            <Typography
              as="span"
              variant="title"
              size="small"
              weight="semibold"
              className="text-tertiary mr-2"
            >
              {preview.ratingScore}
            </Typography>
          </div>
        ) : null}

        {preview.ratingScore && preview.rank ? (
          <div className="bg-outline-var h-5 w-px rounded-full" />
        ) : null}

        {preview.rank ? (
          <div className="flex items-center gap-1 [direction:rtl]">
            <ViewAdIcon className="text-on-surface-var h-4 w-4" name="ranking" />
            <Typography as="span" variant="body" size="small" weight="medium">
              رتبه
            </Typography>
            <Typography
              as="span"
              variant="title"
              size="small"
              weight="semibold"
              className="text-tertiary mr-2"
            >
              {preview.rank}
            </Typography>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="text-on-surface-var mx-auto mt-4 flex max-w-[220px] items-center justify-between text-xs leading-4 font-medium [direction:ltr]">
      {preview.ratingScore ? (
        <div className="flex items-center gap-1">
          <Typography
            as="span"
            variant="body"
            size="medium"
            weight="regular"
            className="text-tertiary"
          >
            {preview.ratingScore}
          </Typography>
          <Typography as="span" variant="body" size="medium" weight="regular">
            امتیاز
          </Typography>
          <img
            alt=""
            aria-hidden="true"
            className="h-4 w-4 shrink-0 object-contain"
            src="/icons/star.svg"
          />
        </div>
      ) : (
        <span />
      )}
      {preview.ratingScore && preview.rank ? <div className="bg-outline-var h-4 w-px" /> : null}
      {preview.rank ? (
        <div className="flex items-center gap-1">
          <Typography
            as="span"
            variant="body"
            size="medium"
            weight="regular"
            className="text-tertiary"
          >
            {preview.rank}
          </Typography>
          <Typography as="span" variant="body" size="medium" weight="regular">
            رتبه
          </Typography>
          <img
            alt=""
            aria-hidden="true"
            className="h-4 w-4 shrink-0 object-contain"
            src="/icons/ranking.svg"
          />
        </div>
      ) : (
        <span />
      )}
    </div>
  );
}
