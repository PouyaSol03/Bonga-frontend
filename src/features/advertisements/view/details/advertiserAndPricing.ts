import { getApiAssetUrl } from "../../../../shared/api/api";
import { formatDetailPrice as formatPrice } from "../../../../shared/lib/MoneyHandler";
import { toPersianNumber as toPersianDigits } from "../../../../shared/lib/numberUtils";
import type { AdvertisementItem } from "../../api/advertisement.service";
import type { ViewAdDailyHotelRoom, ViewAdDetails } from "../viewAdTypes";
import { type AdvertiserPreview, toNumber, toText } from "./detailCore";
import { type AdvertisementFeatureMap } from "./adFeatureResolution";
import { toBooleanLike } from "./detailFormatters";

export function formatPricePerMeter(totalPrice: unknown, area: unknown) {
  const numericPrice = toNumber(totalPrice);
  const numericArea = toNumber(area);

  if (numericPrice === undefined || numericArea === undefined || numericArea <= 0) {
    return "—";
  }

  return formatPrice(numericPrice / numericArea);
}

export function resolvePricePresentation(
  formCode: string,
  featureMap: AdvertisementFeatureMap,
  rootPrice: unknown,
  area: unknown,
  dailyHotelRooms?: ViewAdDailyHotelRoom[],
) {
  if (formCode.startsWith("rent-")) {
    return {
      primaryLabel: "رهن",
      primaryValue: formatPrice(featureMap.mortgage_price),
      secondaryLabel: "اجاره ماهیانه",
      secondaryValue: formatPrice(featureMap.rent_price),
    };
  }

  if (formCode.startsWith("daily-")) {
    let minPrice = featureMap.min_price ?? featureMap.daily_price ?? featureMap.normal_daily_price;
    let maxPrice =
      featureMap.max_price ?? featureMap.special_daily_price ?? featureMap.weekend_daily_price;

    if (
      formCode === "daily-hotel" &&
      (!minPrice || !maxPrice) &&
      dailyHotelRooms &&
      dailyHotelRooms.length > 0
    ) {
      const prices: number[] = [];
      for (const room of dailyHotelRooms) {
        const p = toNumber(room.normalPrice);
        if (p && p > 0) prices.push(p);
        const w = toNumber(room.weekendPrice);
        if (w && w > 0) prices.push(w);
        const s = toNumber(room.specialPrice);
        if (s && s > 0) prices.push(s);
      }
      if (prices.length > 0) {
        if (!minPrice) minPrice = Math.min(...prices);
        if (!maxPrice) maxPrice = Math.max(...prices);
      }
    }

    if (!minPrice && !maxPrice) {
      if (rootPrice) {
        minPrice = rootPrice;
      }
    }

    const resolvedMin = minPrice ?? 1_500_000;
    const resolvedMax = maxPrice ?? (minPrice ? Number(minPrice) * 2 : 10_000_000);

    return {
      primaryLabel: "حداقل قیمت اقامت",
      primaryValue: formatPrice(resolvedMin),
      secondaryLabel: "حداکثر قیمت اقامت",
      secondaryValue: formatPrice(resolvedMax),
    };
  }

  if (formCode === "presale-special") {
    const minPrice =
      featureMap.min_meter_price ??
      featureMap.min_price ??
      featureMap.meter_price ??
      rootPrice ??
      50_000_000;
    const maxPrice =
      featureMap.max_meter_price ??
      featureMap.max_price ??
      (minPrice ? Number(minPrice) * 1.2 : 60_000_000);

    return {
      primaryLabel: "حداقل قیمت متری",
      primaryValue: formatPrice(minPrice),
      secondaryLabel: "حداکثر قیمت متری",
      secondaryValue: formatPrice(maxPrice),
    };
  }

  const totalPrice = rootPrice ?? featureMap.price;

  return {
    primaryLabel: "قیمت کل",
    primaryValue: formatPrice(totalPrice),
    secondaryLabel: "قیمت هر متر",
    secondaryValue: formatPricePerMeter(totalPrice, area),
  };
}

export function getMapPosition(ad: AdvertisementItem) {
  const lat = toNumber(ad.lat);
  const lng = toNumber(ad.lng);

  if (lat === undefined || lng === undefined) {
    return null;
  }

  return { latitude: lat, longitude: lng };
}

function readMetric(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return toPersianDigits(value);
  }

  if (typeof value === "string" && value.trim()) {
    return toPersianDigits(value.trim());
  }

  return undefined;
}

export function getAdvertiserPreview(
  ad: AdvertisementItem,
  details: ViewAdDetails,
): AdvertiserPreview | null {
  const ownerType = String(ad.publisher_type ?? ad.owner_type ?? "").toLowerCase();

  if (ownerType === "agency") {
    const agency =
      ad.agency && typeof ad.agency === "object" && !Array.isArray(ad.agency) ? ad.agency : null;
    const id = agency?.id ?? ad.publisher_agency_id;

    if (id === undefined || id === null) return null;

    const name = toText(agency?.name, details.agency || "آژانس املاک");
    const location = toText(agency?.location, details.agencyLocation || details.locationTitle);
    const params = new URLSearchParams({ location, name });

    return {
      href: `/agencies/${encodeURIComponent(String(id))}?${params.toString()}`,
      id: String(id),
      kind: "agency",
      location,
      logoUrl:
        typeof agency?.logo === "string" && agency.logo.trim()
          ? getApiAssetUrl(agency.logo.trim())
          : undefined,
      name,
      rank: readMetric(agency?.rank),
      ratingScore: readMetric(agency?.rating_score),
      subtitle: "آژانس",
    };
  }

  if (ownerType === "agent") {
    const agent =
      ad.agent && typeof ad.agent === "object" && !Array.isArray(ad.agent) ? ad.agent : null;
    const id = agent?.id ?? ad.publisher_agent_id;

    if (id === undefined || id === null) return null;

    const name = toText(agent?.name, "مشاور املاک");
    const agencyName = toText(agent?.agency_name);
    const location = details.agencyLocation || details.locationTitle || "";
    const params = new URLSearchParams({ location, name });

    if (agencyName) params.set("agency", agencyName);

    const isAgencyAgent = Boolean(agencyName || agent?.agency_id || ad.agency);
    const subtitle = isAgencyAgent ? "مشاور آژانس" : "مشاور مستقل";
    const rawAvatar =
      (typeof agent?.avatar === "string" && agent.avatar.trim()) ||
      (typeof agent?.img === "string" && agent.img.trim()) ||
      (typeof agent?.logo === "string" && agent.logo.trim()) ||
      "";

    return {
      href: `/agents/${encodeURIComponent(String(id))}?${params.toString()}`,
      id: String(id),
      kind: "agent",
      location,
      logoUrl: rawAvatar ? getApiAssetUrl(rawAvatar) : undefined,
      name,
      rank: readMetric(agent?.rank),
      ratingScore: readMetric(agent?.rating_score),
      subtitle,
    };
  }

  return null;
}

const saleCategoryLabelByFormCode: Record<string, string> = {
  "sale-apartment": "فروش آپارتمان",
  "sale-villa-house": "فروش خانه، ویلا",
  "sale-garden-villa": "فروش باغ، ویلا",
  "sale-land": "فروش زمین، ملک کلنگی",
  "sale-office": "فروش واحد اداری",
  "sale-commercial": "فروش واحد تجاری",
  "sale-factory": "فروش واحد صنعتی",
  "sale-warehouse": "فروش انبار، سوله",
  "sale-hotel": "فروش هتل، اقامتگاه",
};

const rentCategoryLabelByFormCode: Record<string, string> = {
  "rent-apartment": "اجاره آپارتمان",
  "rent-villa-house": "اجاره خانه، ویلا",
  "rent-garden-villa": "اجاره باغ، ویلا",
  "rent-office": "اجاره واحد اداری",
  "rent-commercial": "اجاره واحد تجاری",
  "rent-factory-workshop": "اجاره واحد صنعتی",
  "rent-warehouse": "اجاره انبار، سوله",
  "rent-hotel": "اجاره هتل، اقامتگاه",
};

export function buildCategoryNeighborhoodLabel(
  formCode: string,
  neighborhoodName: string,
  fallback: string,
) {
  const listingCategory =
    saleCategoryLabelByFormCode[formCode] ?? rentCategoryLabelByFormCode[formCode];
  if (listingCategory && neighborhoodName) {
    return `${listingCategory} در محله ${neighborhoodName}`;
  }
  return listingCategory || fallback;
}

export function parseHotelStarCount(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value) && value > 0) {
    return Math.min(5, Math.max(1, Math.round(value)));
  }
  const text = toText(value);
  if (!text) return undefined;
  if (text.includes("★")) {
    const count = (text.match(/★/g) || []).length;
    if (count > 0) return Math.min(5, Math.max(1, count));
  }
  const english = text
    .replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)));
  const match = english.match(/\d+/);
  if (!match) return undefined;
  const valueNumber = Number(match[0]);
  if (!Number.isFinite(valueNumber) || valueNumber <= 0) return undefined;
  return Math.min(5, Math.max(1, Math.round(valueNumber)));
}

export function readRentConvertible(
  featureMap: AdvertisementFeatureMap,
  ad: AdvertisementItem,
  formCode: string,
) {
  const explicit = toBooleanLike(
    featureMap.rent_conversion_enabled ??
      featureMap.rent_convertible ??
      featureMap.is_rent_convertible ??
      ad.rent_conversion_enabled ??
      ad.rent_convertible ??
      ad.is_rent_convertible,
  );
  if (explicit !== undefined) return explicit;

  const policy = toText(
    featureMap.rent_conversion_policy ??
      featureMap.rent_convertibility ??
      featureMap.conversion_policy ??
      ad.rent_conversion_policy ??
      ad.rent_convertibility ??
      ad.conversion_policy,
  );
  if (policy) {
    if (policy.includes("نیست") || policy.includes("غیر قابل") || policy.includes("غیرقابل"))
      return false;
    if (policy.includes("قابل تبدیل") || policy.includes("تبدیل")) return true;
  }

  // The reference apartment UI exposes the conversion calculator whenever both
  // rent figures are present. This fallback also keeps old apartment ads useful
  // when older API payloads did not persist a dedicated conversion flag.
  if (formCode === "rent-apartment") {
    const mortgage = toNumber(featureMap.mortgage_price ?? ad.mortgage_price);
    const rent = toNumber(featureMap.rent_price ?? ad.rent_price);
    return Boolean((mortgage ?? 0) > 0 && (rent ?? 0) > 0);
  }

  return false;
}


