import { Typography } from "../../../../shared/ui/Typography";
import { Link } from "react-router";
import type { AdCardData } from "./types";
import { resolveAdCategory } from "./category";
import { truncateAdCardText } from "./text";
import { AdCardBadges } from "./AdCardBadges";
import { AdCardPriceRow } from "./AdCardPriceRow";
import { MapPreviewImages } from "./MapPreviewImages";
import { PropertyRow } from "./PropertyRow";

export function MapPreviewCard({
  ad,
  mapPreviewImages,
  isSelected,
  className,
  mapSliderCardId,
  linkState,
  to,
  hasSecondaryPrice,
  showBadges = true,
}: {
  ad: AdCardData;
  mapPreviewImages: string[];
  isSelected: boolean;
  className: string;
  mapSliderCardId?: number | string;
  linkState: unknown;
  to: string;
  hasSecondaryPrice: boolean;
  showBadges?: boolean;
}) {
  const images =
    mapPreviewImages.length > 0 ? mapPreviewImages : ad.imageUrl ? [ad.imageUrl] : [];
  const hasVisibleBadges = showBadges && Array.isArray(ad.badges) && ad.badges.length > 0;

  return (
    <Link
      aria-current={isSelected ? "true" : undefined}
      className={`bg-surface-container-lowest flex min-h-[244px] w-[min(360px,calc(100vw-28px))] shrink-0 snap-center flex-col overflow-hidden rounded-2xl p-3 text-right no-underline shadow-[0_4px_16px_rgba(0,0,0,0.10)] ${className}`}
      data-map-slider-card={mapSliderCardId === undefined ? undefined : String(mapSliderCardId)}
      dir="rtl"
      state={linkState}
      to={to}
    >
      <MapPreviewImages images={images} title={ad.title} />

      <div className="mt-2 flex min-h-6 items-center justify-start [direction:rtl]">
        <AdCardPriceRow
          ad={ad}
          category={resolveAdCategory(ad)}
          hasSecondaryPrice={hasSecondaryPrice}
        />
      </div>

      <PropertyRow className="mt-1.5 min-h-6 flex-wrap gap-3 text-[13px]" ad={ad} />

      <Typography
        as="p"
        variant="body"
        size="medium"
        weight="medium"
        className="text-on-surface mt-1.5 truncate text-right font-semibold"
      >
        {truncateAdCardText(ad.title)}
      </Typography>

      <div className="mt-2.5 flex items-center justify-start gap-2">
        {hasVisibleBadges ? (
          <>
            <AdCardBadges badges={ad.badges} />
            <span className="bg-outline-var h-4 w-px shrink-0" aria-hidden="true" />
          </>
        ) : null}
        <Typography
          as="span"
          variant="body"
          size="medium"
          weight="regular"
          className="text-outline truncate"
        >
          {ad.timeAndLocation}
        </Typography>
      </div>
    </Link>
  );
}
