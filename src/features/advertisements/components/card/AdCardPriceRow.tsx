import { Typography } from "../../../../shared/ui/Typography";
import type { AdCardData, AdCategoryType } from "./types";
import { AdCardTomanIcon } from "../AdCardIcons";
import { isDailyRentCategory } from "./category";
import { getPartnershipShare, getPriceLabels } from "./priceFormatters";
import { PriceItem } from "./PriceItem";
import { PriceRange } from "./PriceRange";

export function AdCardPriceRow({
  ad,
  hasSecondaryPrice,
  category,
}: {
  ad: AdCardData;
  hasSecondaryPrice: boolean;
  category: AdCategoryType;
}) {
  if (category === "sale-apartment") {
    return (
      <div className="flex h-6 items-center justify-start gap-1 [direction:rtl]">
        <Typography
          as="p"
          variant="title"
          size="medium"
          weight="semibold"
          className="text-primary whitespace-nowrap"
        >
          {ad.pricePrimary}
        </Typography>
        <AdCardTomanIcon className="text-primary h-5 w-5 shrink-0" />
      </div>
    );
  }

  if (category === "project-partnership") {
    const shareText = getPartnershipShare(ad);

    return (
      <div className="flex h-6 items-center justify-start gap-1 [direction:rtl]">
        <Typography
          as="span"
          variant="label"
          size="medium"
          weight="medium"
          className="text-outline text-sm leading-5 font-medium"
        >
          درصد مشارکت:
        </Typography>
        <Typography
          as="p"
          variant="title"
          size="medium"
          weight="semibold"
          className="text-primary whitespace-nowrap"
        >
          {shareText}
        </Typography>
      </div>
    );
  }

  if (category === "project-presale" || isDailyRentCategory(category)) {
    return (
      <PriceRange
        label={ad.priceLabelPrimary || (category === "project-presale" ? "قیمت متری:" : "قیمت")}
        primary={ad.pricePrimary}
        secondary={ad.priceSecondary}
        hasSecondaryPrice={hasSecondaryPrice}
      />
    );
  }

  const { primaryLabel, secondaryLabel } = getPriceLabels(ad, category, hasSecondaryPrice);

  return (
    <div className="flex h-6 items-center justify-start gap-2 [direction:rtl]">
      <PriceItem label={primaryLabel} price={ad.pricePrimary} />
      {hasSecondaryPrice ? (
        <Typography
          as="span"
          variant="body"
          size="medium"
          weight="regular"
          className="bg-outline-var h-6 w-px"
          aria-hidden="true"
        />
      ) : null}
      {hasSecondaryPrice ? <PriceItem label={secondaryLabel} price={ad.priceSecondary} /> : null}
    </div>
  );
}
