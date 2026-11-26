import { Typography } from "../../../../shared/ui/Typography";
import type { AdCardData } from "./types";
import { resolveAdCategory } from "./category";
import { truncateAdCardText } from "./text";
import { AdCardBadges } from "./AdCardBadges";
import { AdCardPriceRow } from "./AdCardPriceRow";
import { PropertyRow } from "./PropertyRow";

export function AdCardBody({
  ad,
  className = "",
  hasSecondaryPrice,
  showBadges,
}: {
  ad: AdCardData;
  className?: string;
  hasSecondaryPrice: boolean;
  showBadges: boolean;
}) {
  const category = resolveAdCategory(ad);

  return (
    <div className={`flex flex-col pt-3 ${className}`}>
      <AdCardPriceRow ad={ad} hasSecondaryPrice={hasSecondaryPrice} category={category} />

      <PropertyRow className="mt-3 h-5 gap-[22px] text-sm" ad={ad} />

      <Typography
        as="p"
        variant="body"
        size="medium"
        weight="medium"
        className="text-on-surface mt-3 truncate font-semibold"
      >
        {truncateAdCardText(ad.title)}
      </Typography>

      <div className="mt-2.5 flex items-center justify-between gap-2">
        <Typography
          as="span"
          variant="body"
          size="medium"
          weight="regular"
          className="text-outline truncate"
        >
          {ad.timeAndLocation}
        </Typography>
        {showBadges ? <AdCardBadges badges={ad.badges} /> : null}
      </div>
    </div>
  );
}
