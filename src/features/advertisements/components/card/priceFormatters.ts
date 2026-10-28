import type { AdCardData, AdCategoryType } from "./types";

export function getPartnershipShare(ad: AdCardData) {
  let shareText = "توافقی";
  if (ad.builderShare) {
    const cleanShare = ad.builderShare.replace(/[%٪]/g, "").trim();
    shareText = cleanShare.endsWith("درصد") ? cleanShare : `${cleanShare} درصد`;
  } else if (ad.pricePrimary && ad.pricePrimary !== "توافقی") {
    const cleanPrice = ad.pricePrimary.replace(/[%٪]/g, "").trim();
    shareText = cleanPrice.endsWith("درصد") ? cleanPrice : `${cleanPrice} درصد`;
  }
  return shareText;
}

export function getPriceLabels(ad: AdCardData, category: AdCategoryType, hasSecondaryPrice: boolean) {
  const isRentApartment = category === "rent-apartment";
  let primaryLabel = ad.priceLabelPrimary || (isRentApartment && hasSecondaryPrice ? "اجاره:" : "");
  let secondaryLabel = ad.priceLabelSecondary || (isRentApartment ? "رهن:" : "");

  if (category.startsWith("rent-")) {
    if (!primaryLabel && hasSecondaryPrice) primaryLabel = "اجاره:";
    if (!secondaryLabel && hasSecondaryPrice) secondaryLabel = "رهن:";
    if (secondaryLabel.includes("ودیعه")) secondaryLabel = "رهن:";
    if (primaryLabel.includes("ودیعه")) primaryLabel = "رهن:";
  }

  if (primaryLabel === "قیمت کل" || primaryLabel === "قیمت کل:") {
    primaryLabel = "";
  }

  return { primaryLabel, secondaryLabel };
}
