import { DetailSection, MoreLink } from ".././viewAdComponents";
import type { ViewAdProjectDetailVariant } from ".././viewAdTypes";
import { getCurrentViewAdBasePath } from ".././viewAdDetails";
import { Typography } from "../../../../shared/ui/Typography";

export function ProjectUnitDetailsSection({
  details,
  adId,
}: {
  details: ViewAdProjectDetailVariant[];
  adId: string;
}) {
  if (!details || details.length === 0) return null;

  const displayedVariants = details.slice(0, 1);

  return (
    <DetailSection icon="apartment" title="جزئیات پروژه">
      <div className="mt-4 space-y-4">
        {displayedVariants.map((variant) => (
          <div
            key={variant.id}
            className="border-outline-var bg-surface-container-lowest rounded-2xl border p-4 [direction:rtl]"
          >
            <Typography
              as="h3"
              variant="title"
              size="medium"
              weight="semibold"
              className="text-on-surface mb-4 text-right text-base font-semibold"
            >
              {variant.meterageTitle}
            </Typography>

            {variant.floors.length > 0 ? (
              <div className="flex items-start gap-3 [direction:rtl]">
                <Typography
                  as="span"
                  variant="label"
                  size="medium"
                  weight="medium"
                  className="text-on-surface-var shrink-0 pt-1 text-sm font-medium"
                >
                  موجود در طبقات:
                </Typography>
                <div className="flex flex-wrap items-center gap-2">
                  {variant.floors.map((floor, i) => (
                    <span
                      key={`${floor}-${i}`}
                      className="bg-surface-container-high text-on-surface inline-flex h-8 min-w-8 items-center justify-center rounded-[8px] px-2.5 text-sm font-medium"
                    >
                      {floor}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            {variant.floors.length > 0 && (variant.roomLabel || variant.positions.length > 0) ? (
              <div className="border-outline-var my-3.5 border-b border-dashed" />
            ) : null}

            {variant.roomLabel ? (
              <div className="flex items-center gap-3 [direction:rtl]">
                <Typography
                  as="span"
                  variant="label"
                  size="medium"
                  weight="medium"
                  className="text-on-surface-var shrink-0 text-sm font-medium"
                >
                  تنوع اتاق:
                </Typography>
                <span className="bg-surface-container-high text-on-surface inline-flex h-8 items-center justify-center rounded-[8px] px-3 text-sm font-medium">
                  {variant.roomLabel}
                </span>
              </div>
            ) : null}

            {variant.roomLabel && variant.positions.length > 0 ? (
              <div className="border-outline-var my-3.5 border-b border-dashed" />
            ) : null}

            {variant.positions.length > 0 ? (
              <div className="flex items-center gap-3 [direction:rtl]">
                <Typography
                  as="span"
                  variant="label"
                  size="medium"
                  weight="medium"
                  className="text-on-surface-var shrink-0 text-sm font-medium"
                >
                  تنوع موقعیت:
                </Typography>
                <div className="flex flex-wrap items-center gap-2">
                  {variant.positions.map((pos, i) => (
                    <span
                      key={`${pos}-${i}`}
                      className="bg-surface-container-high text-on-surface inline-flex h-8 items-center justify-center rounded-[8px] px-3 text-sm font-medium"
                    >
                      {pos}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        ))}

        <MoreLink to={`${getCurrentViewAdBasePath(adId)}/project-details`}>اطلاعات بیشتر</MoreLink>
      </div>
    </DetailSection>
  );
}
