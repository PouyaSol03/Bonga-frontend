import type { AdvertisementItem } from "../../api/advertisement.service";
import type { ViewAdDetails } from "../viewAdTypes";
import { formatDetailPrice as formatPrice } from "../../../../shared/lib/MoneyHandler";
import { toPersianNumber as toPersianDigits } from "../../../../shared/lib/numberUtils";
import {
  parseDailyHotelRooms,
  parseProjectDetails,
} from "./hotelAndProjectDetails";
import { buildFacilityItems } from "./facilityItemsBuilder";
import {
  resolvePricePresentation,
  buildCategoryNeighborhoodLabel,
  readRentConvertible,
  parseHotelStarCount,
} from "./advertiserAndPricing";
import { toBooleanLike } from "./detailFormatters";
import { formatPublishedAge } from "./adMedia";
import {
  buildPropertyInfoItems,
  buildPropertyInfoPreviewItems,
} from "./propertyInfoItemBuilders";
import {
  getResolvedAdvertisementFeatures,
  buildAdvertisementFeatureMap,
  getFeatureValue,
} from "./adFeatureResolution";
import { toNumber, toText } from "./detailCore";

export function mapAdToDetails(ad: AdvertisementItem): ViewAdDetails {
  const features = getResolvedAdvertisementFeatures(ad);
  const featureMap = buildAdvertisementFeatureMap(ad);
  const formCode = toText(ad.form_code ?? featureMap.form_code);
  const isRentalForm = formCode.startsWith("rent-") || formCode.startsWith("daily-");
  const propertyInfoRows = (features.length > 0 ? buildPropertyInfoItems(features) : [])
    .filter((item) => !(isRentalForm && item.label === "وام"))
    .filter(
      (item) =>
        !(
          isRentalForm &&
          ["رهن", "اجاره", "تبدیل رهن و اجاره", "قابل معاوضه با"].includes(item.label)
        ),
    );
  const propertyInfoPreview = features.length > 0 ? buildPropertyInfoPreviewItems(features) : [];
  const facilities =
    features.length > 0 || ad.facilities !== undefined ? buildFacilityItems(ad, features) : [];
  const age = formatPublishedAge(ad, features);
  const meterArea = featureMap.area ?? featureMap.land_area ?? featureMap.building_area ?? ad.area;
  const dailyHotelRooms = parseDailyHotelRooms(ad, features, featureMap, formCode);
  const projectDetails = parseProjectDetails(ad, features, featureMap, formCode);
  const pricePresentation = resolvePricePresentation(
    formCode,
    featureMap,
    ad.price,
    meterArea,
    dailyHotelRooms,
  );
  const description = ad.description ?? ad.short_description;
  const title = toText(ad.title ?? ad.label);
  const cityName = toText(ad.city?.name ?? ad.city_name);
  const neighborhoodName = toText(ad.neighborhood?.name ?? ad.neighborhood_name);
  const subNeighborhoodName = toText(ad.sub_neighborhood?.name);
  const normalizedLocation = [cityName, neighborhoodName, subNeighborhoodName]
    .filter(Boolean)
    .join("، ");
  const locationTitle = toText(
    ad.location_label,
    normalizedLocation || toText(ad.form_neighborhood_title, neighborhoodName || title),
  );
  const ownerType = String(ad.publisher_type ?? ad.owner_type ?? "").toLowerCase();
  const agencyLocation =
    ownerType === "agency" && ad.agency && typeof ad.agency === "object"
      ? toText(ad.agency.location, locationTitle)
      : ownerType === "agent" && ad.agent && typeof ad.agent === "object"
        ? toText(ad.agent.agency_name, locationTitle)
        : locationTitle;

  return {
    adCode: toPersianDigits(ad.track_code ?? ad.id ?? ad._id ?? ""),
    agency:
      ownerType === "agency" && ad.agency && typeof ad.agency === "object"
        ? toText(ad.agency.name)
        : ownerType === "agent" && ad.agent && typeof ad.agent === "object"
          ? toText(ad.agent.agency_name)
          : toText(featureMap.advertiser_type),
    agencyLocation,
    age,
    categoryNeighborhood: toText(
      ad.category_neighborhood,
      buildCategoryNeighborhoodLabel(formCode, neighborhoodName, locationTitle),
    ),
    description: toText(description),
    equipmentSections: [],
    features: facilities,
    formCode,
    headline: title,
    locationTitle,
    pricePerMeter: pricePresentation.secondaryValue,
    pricePrimaryLabel: pricePresentation.primaryLabel,
    priceSecondaryLabel: pricePresentation.secondaryLabel,
    rentConversionPolicy: toText(
      featureMap.rent_conversion_policy ??
        featureMap.rent_convertibility ??
        featureMap.conversion_policy,
    ),
    rentMortgagePriceRaw: toNumber(featureMap.mortgage_price ?? ad.mortgage_price),
    rentMonthlyPriceRaw: toNumber(featureMap.rent_price ?? ad.rent_price),
    rentConversionMortgagePriceRaw: toNumber(
      featureMap.rent_conversion_mortgage_price ??
        featureMap.rent_conversion_mortgage ??
        ad.rent_conversion_mortgage_price ??
        ad.rent_conversion_mortgage,
    ),
    rentConvertible: readRentConvertible(featureMap, ad, formCode),
    hotelStars: parseHotelStarCount(featureMap.hotel_stars ?? ad.hotel_stars),
    normalDailyPrice: formatPrice(featureMap.normal_daily_price ?? ad.normal_daily_price),
    weekendDailyPrice: formatPrice(featureMap.weekend_daily_price ?? ad.weekend_daily_price),
    specialDailyPrice: formatPrice(featureMap.special_daily_price ?? ad.special_daily_price),
    extraPersonPrice: formatPrice(featureMap.extra_person_price ?? ad.extra_person_price),
    propertyInfoPreview,
    propertyInfoRows,
    rows: [
      { icon: "addToList", label: "ثبت بازخورد" },
      { icon: "apartment", label: "آژانس‌های محله" },
      { icon: "informationDiamond", label: "گزارش تخلف آگهی" },
    ],
    status: toText(ad.status_label ?? ad.status),
    title,
    totalPrice: pricePresentation.primaryValue,
    imagesNotBelongToAd:
      toBooleanLike(
        ad.images_not_belong_to_ad ??
          ad.imagesNotBelongToAd ??
          featureMap.images_not_belong_to_ad ??
          getFeatureValue(features, "images_not_belong_to_ad"),
      ) === true,
    isSpecial:
      toBooleanLike(
        ad.is_special ??
          ad.special ??
          featureMap.is_special ??
          getFeatureValue(features, "is_special"),
      ) === true,
    isLadder:
      toBooleanLike(
        ad.is_ladder ?? ad.ladder ?? featureMap.is_ladder ?? getFeatureValue(features, "is_ladder"),
      ) === true,
    dailyHotelRooms,
    projectDetails,
  };
}

