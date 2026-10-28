import { type AdvertisementItem } from "./item-types";
import { type AdvertisementCardData } from "./listing-types";
import { getAdvertisementImageUrls } from "../../utils/advertisement-images";
import {
  readNestedText,
  toText,
  readFeatureValue,
  formatFeatureUnit,
  formatBuildingAge,
} from "./card-values";
import { readCardPropertyValues } from "./cardPropertyValues";
import { readCardProjectValues } from "./cardProjectValues";
import { readCardPricing } from "./cardPricing";
import { getAdvertisementPublisherName } from "./publisher";
import { resolveAdvertisementBadges } from "./card-badges";

export function mapAdvertisementToAdCard(
  item: AdvertisementItem,
  index: number,
): AdvertisementCardData {
  const images = getAdvertisementImageUrls(item);
  const location = readNestedText(item, [
    "neighborhood",
    "neighborhood_name",
    "district",
    "district_name",
    "city",
    "city_name",
  ]);
  const image = images[0] ?? "";
  const description = toText(item.short_description ?? item.description);
  const {
    area,
    rooms,
    buildingAge,
    landArea,
    documentType,
    commercialPosition,
    landPosition,
    category,
    formCode,
    projectMinMeterPrice,
    projectMaxMeterPrice,
    floor,
    buildingArea,
  } = readCardPropertyValues(item);
  const {
    capacity,
    stars,
    rentalPeriod,
    projectType,
    totalFloors,
    totalUnits,
    builderShare,
    currentStatus,
  } = readCardProjectValues(item);
  const { pricePrimary, priceSecondary, priceLabelPrimary, priceLabelSecondary } = readCardPricing(
    item,
    category,
    formCode,
    projectMinMeterPrice,
    projectMaxMeterPrice,
    builderShare,
  );

  const timeAgo =
    toText(item.published_time_ago) ||
    toText(item.time_ago) ||
    (item.published_days !== undefined && item.published_days !== null
      ? `${toText(item.published_days)} روز پیش`
      : "") ||
    toText(readFeatureValue(item, ["published_at", "published_time_ago", "time_ago"]));

  const locationText = location ? `در ${location}` : "";
  const timeAndLocation =
    timeAgo && locationText
      ? `${timeAgo} ${locationText}`
      : timeAgo || locationText || (description ? description.slice(0, 40) : "");

  return {
    id: item.id ?? item._id ?? index + 1,
    agency: getAdvertisementPublisherName(item),
    area: formatFeatureUnit(area, "متر مربع"),
    badges: resolveAdvertisementBadges(item),
    imageClassName: image ? "" : `ad-card__image--${(index % 4) + 1}`,
    imageCount: String(images.length || (image ? 1 : 0)),
    imageUrl: image || undefined,
    priceLabelPrimary,
    priceLabelSecondary,
    pricePrimary,
    priceSecondary,
    rooms: formatFeatureUnit(rooms, "اتاق"),
    status: "",
    timeAndLocation,
    title: toText(item.title ?? item.label, "آگهی ملک"),
    year: formatBuildingAge(buildingAge),
    landArea:
      landArea !== undefined && landArea !== null && landArea !== ""
        ? formatFeatureUnit(landArea, "متر مربع", "")
        : undefined,
    documentType:
      documentType !== undefined && documentType !== null && documentType !== ""
        ? toText(documentType)
        : undefined,
    commercialPosition:
      commercialPosition !== undefined && commercialPosition !== null && commercialPosition !== ""
        ? toText(commercialPosition)
        : undefined,
    landPosition:
      landPosition !== undefined && landPosition !== null && landPosition !== ""
        ? toText(landPosition)
        : undefined,
    floor,
    buildingArea,
    capacity,
    stars,
    rentalPeriod,
    projectType,
    totalFloors,
    totalUnits,
    builderShare,
    currentStatus,
    category: category || undefined,
    formCode: formCode || undefined,
  };
}
