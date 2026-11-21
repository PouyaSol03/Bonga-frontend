import { Link } from "react-router";
import LinearBuilding3 from "../../../../shared/icons/LinearBuilding3";
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
  const ratingScore =
    preview.ratingScore ??
    (agency && agency.score !== undefined && agency.score !== null
      ? toPersianDigits(agency.score)
      : undefined);
  const rawAgencyRank = agency?.rank;
  const rank =
    preview.rank ??
    (rawAgencyRank !== undefined && rawAgencyRank !== null && rawAgencyRank > 0
      ? toPersianDigits(rawAgencyRank)
      : undefined);
  const ranked = rank !== undefined ? true : preview.ranked;
  const resolvedPreview: AdvertiserPreview = {
    ...preview,
    location,
    rank,
    ratingScore,
    ranked,
  };

  return (
    <section className="border-surface-container bg-surface-container-lowest border-t-8 text-center">
      <Link
        className="active:bg-surface-container focus-visible:outline-inset focus-visible:outline-primary/40 block px-4 pt-4 pb-3 text-inherit no-underline transition focus-visible:outline-3"
        to={preview.href}
      >
        <div className="bg-surface-container-lowest mx-auto grid h-20 w-20 place-items-center overflow-hidden rounded-full">
          {logoUrl ? (
            <img alt={preview.name} className="h-full w-full object-cover rounded-full" src={logoUrl} />
          ) : (
            <div className="border-outline-var bg-surface-container text-outline grid h-full w-full place-items-center rounded-full border">
              <LinearBuilding3 className="h-10 w-10 text-outline" />
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
