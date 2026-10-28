import {
  mapAdvertisementToAdCard,
  type AdvertisementItem,
} from "../../advertisements/api/advertisement.service";
import type { SearchMapListing } from "../searchMapData";
import { getAdMapPosition } from "./coordinateHelpers";
import {
  readBadges,
  readFeature,
  readFeatureRaw,
  readImageSources,
  readNestedText,
  toText,
} from "./featureHelpers";
import { resolveListingPricing } from "./listingPricingHelpers";

export function mapAdvertisementToSearchListing(
  item: AdvertisementItem,
  index: number,
): SearchMapListing | null {
  const position = getAdMapPosition(item);

  if (!position) return null;

  const images = readImageSources(item);
  const locationLabel = readNestedText(item, [
    "neighborhood",
    "neighborhood_name",
    "district",
    "district_name",
    "city",
    "city_name",
  ]);
  const description = toText(item.short_description ?? item.description);
  const id = item.id ?? item._id ?? `map-ad-${index + 1}`;
  const formCode = toText(item.form_code ?? readFeatureRaw(item, ["form_code"]), "");
  const category = toText(
    item.category ??
      item.category_name ??
      item.category_title ??
      readFeatureRaw(item, ["category", "دسته بندی"]),
    "",
  );

  const pricing = resolveListingPricing(item, formCode, category);

  return {
    id,
    agencyName: toText(
      item.agency ??
        item.agency_name ??
        item.advertiser_name ??
        readFeatureRaw(item, ["advertiser_type"]),
    ),
    area: readFeature(
      item,
      ["area", "meterage", "building_area", "land_area", "متراژ", "buildingArea", "landArea"],
      item.area ? `${toText(item.area)} متر` : "-",
    ),
    badges: readBadges(item),
    dotId: `dot-${id}`,
    imageClassName: "",
    imageSrc: images[0],
    images,
    latitude: position.latitude,
    locationLabel,
    longitude: position.longitude,
    postedAt: description,
    priceLabel: pricing.priceLabel,
    priceValue: pricing.priceValue,
    rooms: readFeature(
      item,
      ["rooms", "room", "bedroom", "bedrooms", "اتاق", "خواب"],
      item.rooms ? `${toText(item.rooms)} اتاق` : "-",
    ),
    showPriceMarker: true,
    title: toText(item.title ?? item.label, "آگهی ملک"),
    year: readFeature(item, ["building_age", "age", "year", "سال ساخت"], toText(item.year, "-")),
    landArea: readFeature(
      item,
      ["land_area", "landArea", "متراژ زمین"],
      item.land_area ? `${toText(item.land_area)} متر` : undefined,
    ),
    documentType: readFeature(
      item,
      ["document_type", "documentType", "نوع سند", "سند"],
      toText(item.document_type ?? item.documentType, ""),
    ),
    commercialPosition: readFeature(
      item,
      ["commercial_position", "commercialPosition", "موقعیت تجاری"],
      toText(item.commercial_position ?? item.commercialPosition, ""),
    ),
    landPosition: readFeature(
      item,
      ["land_position", "landPosition", "موقعیت زمین", "position"],
      toText(item.land_position ?? item.landPosition, ""),
    ),
    floor: readFeature(
      item,
      ["floor", "طبقه", "طبقه واحد", "طبقه آپارتمان"],
      toText(item.floor, ""),
    ),
    buildingArea: readFeature(
      item,
      ["building_area", "buildingArea", "زیربنا", "متراژ بنا"],
      item.building_area ? `${toText(item.building_area)} متر` : undefined,
    ),
    capacity: pricing.capacity,
    stars: readFeature(
      item,
      ["hotel_stars", "hotelStars", "ستاره", "رتبه بندی اقامتگاه"],
      toText(item.hotel_stars, ""),
    ),
    rentalPeriod: readFeature(
      item,
      ["rental_period", "rentalPeriod", "دوره اجاره"],
      toText(item.rental_period, ""),
    ),
    projectType: pricing.projectType,
    totalFloors: pricing.totalFloors,
    totalUnits: pricing.totalUnits,
    builderShare: pricing.builderShare,
    currentStatus: pricing.currentStatus,
    priceSecondary: pricing.priceSecondary,
    category,
    formCode,
    adCard: mapAdvertisementToAdCard(item, index),
  };
}

export function filterListings(listings: SearchMapListing[]) {
  return listings;
}
