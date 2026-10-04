import { AdCard, type AdCardData } from "../../../../advertisements/components/AdCard";
import { Typography } from "../../../../../shared/ui/Typography";

export function ConsultantAdsTab({ ads }: { ads: AdCardData[] }) {
  return (
    <div className="flex flex-col bg-surface-container">
      {ads.length > 0 ? (
        ads.map((ad) => (
          <AdCard
            className="shrink-0 border-b-[12px] border-surface-container last:border-b-0"
            key={ad.id}
            ad={ad}
            to={`/ads/${ad.id}`}
          />
        ))
      ) : (
        <div className="flex flex-col items-center justify-center bg-surface-container-lowest px-4 py-12 text-center">
          <Typography
            variant="body"
            size="medium"
            weight="medium"
            className="text-outline"
          >
            هیچ آگهی فعالی برای این مشاور یافت نشد.
          </Typography>
        </div>
      )}
    </div>
  );
}
