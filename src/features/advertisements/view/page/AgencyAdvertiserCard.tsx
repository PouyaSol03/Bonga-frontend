import { Link } from "react-router";
import { usePublicAgencyDetailQuery } from "../../../agencies/api/agency.hooks";
import { ViewAdIcon } from ".././ViewAdIcon";
import { toPersianNumber as toPersianDigits } from "../../../../shared/lib/numberUtils";
import { type AdvertiserPreview } from ".././viewAdDetails";
import { Typography } from "../../../../shared/ui/Typography";
import { AdvertiserMetrics } from "./AdvertiserMetrics";

export function AgencyAdvertiserCard({ preview }: { preview: AdvertiserPreview }) {
  const agencyQuery = usePublicAgencyDetailQuery({
    enabled: !preview.logoUrl || !preview.ratingScore || !preview.rank,
    id: preview.id,
  });
  const agency = agencyQuery.data;
  const logoUrl = preview.logoUrl ?? agency?.logo;
  const location = preview.location || agency?.address || "";
  const ratingScore = preview.ratingScore ?? (agency ? toPersianDigits(agency.score) : undefined);
  const rank = preview.rank ?? (agency ? toPersianDigits(agency.rank) : undefined);
  const initial = preview.name.trim().charAt(0) || "آ";
  const resolvedPreview = {
    ...preview,
    location,
    rank,
    ratingScore,
  };

  return (
    <section className="border-surface-container bg-surface-container-lowest border-t-8 text-center">
      <Link
        className="active:bg-surface-container focus-visible:outline-inset focus-visible:outline-primary/40 block px-4 pt-4 pb-3 text-inherit no-underline transition focus-visible:outline-3"
        to={preview.href}
      >
        <div className="bg-surface-container-lowest mx-auto grid h-20 w-20 place-items-center overflow-hidden rounded-lg">
          {logoUrl ? (
            <img alt={preview.name} className="h-full w-full object-contain" src={logoUrl} />
          ) : (
            <div className="border-outline-var bg-surface-container-lowest grid h-full w-full place-items-center rounded-lg border">
              <Typography as="span" variant="headline" size="small" className="text-warning">
                {initial}
              </Typography>
            </div>
          )}
        </div>

        <Typography
          as="h2"
          variant="title"
          size="medium"
          weight="medium"
          className="text-on-surface-var mt-2"
        >
          {preview.name}
        </Typography>

        {location ? (
          <div className="mt-1 flex items-center justify-center gap-1">
            <ViewAdIcon className="text-on-surface-var h-4 w-4" name="location" />
            <Typography
              as="span"
              variant="body"
              size="small"
              weight="medium"
              className="text-primary"
            >
              {location}
            </Typography>
          </div>
        ) : null}

        <AdvertiserMetrics preview={resolvedPreview} agencyStyle />
      </Link>
    </section>
  );
}
