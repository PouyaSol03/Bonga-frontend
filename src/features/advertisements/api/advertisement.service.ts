import { v7 as uuidv7 } from "uuid";
import { ApiError, api, apiV2, baseUrl, publicApi } from "../../../shared/api/api";
import { formatCardPrice } from "../../../shared/lib/MoneyHandler";
import { buildAdvertisementMapRequestPath } from "./advertisement-map-query";
import { getAdvertisementImageUrls } from "../utils/advertisement-images";
import {
  createV2Advertisement,
  createV2Draft,
  getV2Checkout,
  getV2Preview,
  getV2AdvertisementPayments,
  submitV2Checkout,
  updateV2Advertisement,
  updateV2Draft,
  updateV2OwnerContact,
} from "./v2";

export type AdvertisementStatus =
  | "wait_for_payment"
  | "wait_for_admin"
  | "wait_for_agency"
  | "accepted"
  | "needs_edit"
  | "rejected"
  | "deleted"
  | "expired";

export type AdvertisementFeature = {
  key?: string;
  label: string;
  value: unknown;
};

export type AdvertisementImage = {
  // Detail endpoints usually normalize to url/is_main. Legacy serializers may
  // still expose path/src, and the shared image normalizer supports all of them.
  is_main?: boolean;
  path?: string;
  src?: string;
  url?: string;
};

export type AdvertisementLocationEntity = {
  id?: number | string;
  name?: string;
};

export type AdvertisementAgency = {
  _id?: number | string;
  id?: number | string;
  location?: string;
  logo?: string | null;
  name?: string;
  rank?: number | string | null;
  rating_score?: number | string | null;
};

export type AdvertisementAgent = {
  _id?: number | string;
  agency_id?: number | string | null;
  agency_name?: string;
  avatar?: string;
  id?: number | string;
  img?: string;
  logo?: string;
  name?: string;
  rank?: number | string | null;
  rating_score?: number | string | null;
};

export type AdvertisementContacts = {
  chat?: boolean;
  instagram?: string;
  phone?: string;
  telegram?: string;
  whatsapp?: string;
};

export type AdvertisementSocial = {
  instagram?: string;
  telegram?: string;
  whatsapp?: string;
};

export type AdvertisementItem = Record<string, unknown> & {
  _id?: string;
  agency?: AdvertisementAgency | string | null;
  agency_id?: number | string | null;
  agent?: AdvertisementAgent | null;
  agent_id?: number | string | null;
  area?: string | number;
  badges?: string[];
  city?: AdvertisementLocationEntity | null;
  city_id?: number | string | null;
  city_name?: string;
  category_neighborhood?: string | null;
  contact_type?: string[];
  contacts?: AdvertisementContacts | null;
  created_at?: string;
  description?: string;
  district?: AdvertisementLocationEntity | null;
  district_name?: string;
  features?: AdvertisementFeature[];
  form_code?: string;
  form_neighborhood_title?: string | null;
  id?: string | number;
  image?: string;
  images?: AdvertisementImage[];
  is_bookmarked?: boolean;
  is_mine?: boolean;
  label?: string;
  lat?: number | string | null;
  lng?: number | string | null;
  loan?: {
    amount?: string | number | null;
    installment?: string | number | null;
  } | null;
  location_label?: string | null;
  neighborhood?: AdvertisementLocationEntity | null;
  neighborhood_id?: number | string | null;
  neighborhood_name?: string;
  owner_contact_name?: string | null;
  owner_contact_phone?: string | null;
  owner_contact_address?: string | null;
  owner_type?: string;
  publisher_type?: "user" | "agency" | "agent" | string;
  publisher_user_id?: number | string | null;
  publisher_agency_id?: number | string | null;
  publisher_agent_id?: number | string | null;
  price?: string | number;
  price_label?: string;
  published_days?: string | number | null;
  published_date?: string | number | null;
  published_time_ago?: string | number;
  rooms?: string | number;
  short_description?: string;
  social?: AdvertisementSocial | null;
  status?: AdvertisementStatus | string;
  status_code?: number;
  status_label?: string;
  sub_neighborhood?: AdvertisementLocationEntity | null;
  sub_neighborhood_id?: number | string | null;
  title?: string;
  updated_at?: string;
  video?: string | null;
  virtual_tour_link?: string | null;
  year?: string | number;
};

type PaginationMeta = {
  current_page?: number;
  last_page?: number;
  page?: number;
  per_page?: number;
  total?: number;
  total_pages?: number;
};

type AdvertisementListResponse =
  | {
    data?: AdvertisementItem[];
    has_more?: boolean;
    meta?: PaginationMeta;
    page?: number;
    pagination?: PaginationMeta;
    per_page?: number;
    status?: boolean;
    total?: number;
  }
  | AdvertisementItem[];

type TopViewedAdvertisementsResponse =
  | {
    data?: AdvertisementItem[];
    status?: boolean;
  }
  | AdvertisementItem[];

type AdvertisementShowResponse = {
  data: AdvertisementItem;
  status: boolean;
};

export type AdvertisementDailyViewPoint = {
  count: number;
  date: string;
};

export type AdvertisementDailyViews = {
  data: AdvertisementDailyViewPoint[];
  totalView: number;
};

export type AdvertisementPayment = Record<string, unknown> & {
  amount?: number | string;
  created_at?: string;
  id?: number | string;
  items?: string[];
  method?: string;
  payment_id?: number | string | null;
  payment_method?: string;
  payment_status?: number | string;
  price?: number | string;
  status?: number | string;
};


type AdvertisementDailyViewsResponse = {
  data?: Array<{
    count?: number | string;
    date?: string;
  }>;
  status?: boolean;
  total_view?: number | string;
};

type AdvertisementAccountShowResponse =
  | {
    advertise?: AdvertisementItem;
    category?: string;
    data?: AdvertisementItem;
    status?: boolean;
  }
  | AdvertisementItem;

type AdvertisementCreateResponse =
  | {
    advertise?: AdvertisementItem;
    data?: AdvertisementItem;
    result?: AdvertisementItem;
    status?: boolean;
  }
  | AdvertisementItem;

export type AdvertiseFormOption = {
  label: string;
  value: boolean | number | string;
};

export type AdvertiseFormField = {
  dependsOn?: string;
  key: string;
  label: string;
  options: AdvertiseFormOption[];
  optionsEndpoint?: string;
  required: boolean;
  type: string;
  unit: string;
};

export type AdvertiseFormDefinition = {
  code: string;
  fields: AdvertiseFormField[];
  title?: string;
};

export type AdvertisementCheckoutItem = {
  credit_cost?: number;
  credit_requirements?: Array<{
    amount?: number;
    credit_type?: "ad_credit" | "special_credit" | "renew_credit" | string;
  }>;
  description?: string | null;
  duration_days?: number | null;
  duration_months?: number | null;
  free_quota?: {
    available?: boolean;
    remaining?: number;
  } | null;
  price?: number;
  product: string;
  title?: string;
  required?: boolean;
  selected?: boolean;
};

export type AdvertisementCheckoutPaymentMethod = {
  action?: string | null;
  balances?: {
    ad_credit?: number;
    special_credit?: number;
    renew_credit?: number;
  };
  required_by_type?: {
    ad_credit?: number;
    special_credit?: number;
    renew_credit?: number;
  };
  shortage_by_type?: {
    ad_credit?: number;
    special_credit?: number;
    renew_credit?: number;
  };
  available?: boolean;
  balance?: number;
  method: string;
  remaining?: number;
  required?: number;
  shortage?: number;
};

export type AdvertisementCheckout = {
  advertise_id: number | string;
  context?: {
    advertise_status?: number | string;
    agency_id?: number | string | null;
    roles?: string[];
    user_id?: number | string;
  };
  items: AdvertisementCheckoutItem[];
  payment_methods: AdvertisementCheckoutPaymentMethod[];
  state?: string;
  status?: boolean;
  summary: {
    credit_cost?: number;
    items_count?: number;
    payable_amount?: number;
    total_price?: number;
  };
};

type AdvertisementCheckoutResponse =
  | AdvertisementCheckout
  | {
    data?: AdvertisementCheckout;
    result?: AdvertisementCheckout;
    status?: boolean;
  };

export type AdvertisementCheckoutPaymentMethodCode =
  | "free_quota"
  | "gateway"
  | "package_credit"
  | "wallet";

export type AgencyAdvertisementCheckoutPaymentMethodCode =
  | "ad_credit"
  | "by_consultant"
  | "free_quota"
  | "gateway"
  | "wallet";

export type SubmitAdvertisementCheckoutPayload = {
  advertiseId: string;
  discount_code?: string;
  items: string[];
  paymentMethod: AdvertisementCheckoutPaymentMethodCode;
};

export type SubmitAdvertisementCheckoutResult = {
  paymentUrl: string | null;
  response: unknown;
};

export type SubmitAgencyAdvertisementCheckoutPayload = {
  advertiseId: string;
  consultantId?: string;
  discount_code?: string;
  items: string[];
  paymentMethod: AgencyAdvertisementCheckoutPaymentMethodCode;
};

type ApiMutationResponse<T = unknown> = {
  data?: T;
  message?: string;
  status?: boolean;
};

export type AdvertisementMapBounds = {
  east: number;
  north: number;
  south: number;
  west: number;
};

export type AdvertisementMapParams = AdvertisementMapBounds & {
  cityId?: string;
  filters?: AdvertisementSearchFilters;
  geofence?: string;
  limit?: number;
};

type AdvertisementMapResponse =
  | {
    advertises?: AdvertisementItem[];
    data?: unknown;
    items?: AdvertisementItem[];
    list?: AdvertisementItem[];
    result?: unknown;
    results?: AdvertisementItem[];
    status?: boolean;
  }
  | AdvertisementItem[];

export type AdvertiseFeedbackPayload = {
  response_speed: boolean;
  area_knowledge: boolean;
  honesty: boolean;
  effective_followup: boolean;
  ads_are_updated: boolean;
};

export type SubmitAdvertiseFeedbackPayload = {
  advertiseId: string;
  feedback: AdvertiseFeedbackPayload;
};

export type AdvertiseReportReason = {
  created_at?: string;
  id: string;
  name: string;
  updated_at?: string;
};

type AdvertiseReportReasonsResponse =
  | {
    data?: AdvertiseReportReason[];
    list?: AdvertiseReportReason[];
    status?: boolean;
  }
  | AdvertiseReportReason[];

export type SubmitAdvertiseReportPayload = {
  advertiseId: string;
  description: string;
  reportReasonId: string;
};

export type AdvertisementListParams = {
  cityId?: string;
  filters?: AdvertisementSearchFilters;
  page?: number;
  perPage?: number;
};

export type AdvertisementSearchFilters = {
  areaMax?: string | number;
  areaMin?: string | number;
  buildingAge?: string;
  categoryId?: string;
  floor?: string;
  formCode?: string;
  hasImage?: boolean | string;
  hasVideo?: boolean | string;
  isSpecial?: boolean | string;
  neighborhoodId?: string;
  priceMax?: string | number;
  priceMin?: string | number;
  publishedAt?: string;
  query?: string;
  rooms?: string;
  featureFilters?: Record<string, boolean | number | string>;
};

export type AdvertisementPage = {
  data: AdvertisementItem[];
  hasNextPage: boolean;
  page: number;
  total: number;
};

export type AdvertisementCardData = {
  id: number | string;
  title: string;
  agency: string;
  status: string;
  imageCount: string;
  priceLabelPrimary: string;
  pricePrimary: string;
  priceLabelSecondary: string;
  priceSecondary: string;
  area: string;
  rooms: string;
  year: string;
  landArea?: string;
  documentType?: string;
  commercialPosition?: string;
  landPosition?: string;
  floor?: string;
  buildingArea?: string;
  capacity?: string;
  stars?: string;
  rentalPeriod?: string;
  projectType?: string;
  totalFloors?: string;
  totalUnits?: string;
  builderShare?: string;
  currentStatus?: string;
  category?: string;
  formCode?: string;
  timeAndLocation: string;
  imageClassName: string;
  imageUrl?: string;
  badges: string[];
};

const defaultPerPage = 10;

type SearchParamValue = boolean | number | string;

function compactSearchParams(params: Record<string, unknown>): Record<string, SearchParamValue> {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => {
      if (value === undefined || value === null) return false;
      if (typeof value === "string") return value.trim().length > 0;
      if (typeof value === "boolean" || typeof value === "number") return true;

      return false;
    }),
  ) as Record<string, SearchParamValue>;
}

function buildAdvertiseSearchParams(filters?: AdvertisementSearchFilters) {
  if (!filters) return {};

  return compactSearchParams({
    area_max: filters.areaMax,
    area_min: filters.areaMin,
    building_age: filters.buildingAge,
    category_id: filters.categoryId,
    floor: filters.floor,
    form_code: filters.formCode,
    from_code: filters.formCode,
    has_image: filters.hasImage,
    has_video: filters.hasVideo,
    is_special: filters.isSpecial,
    neighborhood_id: filters.neighborhoodId,
    neighborhoods: filters.neighborhoodId,
    price_max: filters.priceMax,
    price_min: filters.priceMin,
    published_at: filters.publishedAt,
    query: filters.query,
    rooms: filters.rooms,
    ...(filters.featureFilters ?? {}),
  });
}

function toText(value: unknown, fallback = "") {
  if (typeof value === "string" && value.trim()) return value;
  if (typeof value === "number") return String(value);

  return fallback;
}

function readRecordText(record: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }

  return "";
}

export function getAdvertisementPublisherName(item: AdvertisementItem) {
  const publisherType = String(item.publisher_type ?? item.owner_type ?? "user").toLowerCase();
  const record = item as Record<string, unknown>;

  if (publisherType === "agent") {
    if (item.agent?.name?.trim()) return item.agent.name.trim();

    return readRecordText(record, [
      "agent_name",
      "consultant_name",
      "publisher_agent_name",
    ]);
  }

  if (publisherType === "agency") {
    if (typeof item.agency === "string" && item.agency.trim()) return item.agency.trim();
    if (item.agency && typeof item.agency === "object" && item.agency.name?.trim()) {
      return item.agency.name.trim();
    }

    return readRecordText(record, [
      "agency_name",
      "publisher_agency_name",
    ]);
  }

  return readRecordText(record, [
    "owner_name",
    "advertiser_name",
    "user_name",
    "publisher_user_name",
  ]);
}

function formatPrice(value: unknown) {
  return formatCardPrice(value);
}

function readFeatureValue(item: AdvertisementItem, labels: string[]) {
  const rawFeatures = Array.isArray(item.features) ? item.features : [];
  const dynamicFields = Array.isArray((item as Record<string, unknown>).dynamicFields)
    ? ((item as Record<string, unknown>).dynamicFields as AdvertisementFeature[])
    : [];
  const features = [...rawFeatures, ...dynamicFields];

  for (const label of labels) {
    const directVal = item[label];
    if (directVal !== undefined && directVal !== null && directVal !== "") {
      return directVal;
    }
    const lower = label.toLowerCase();
    const feature = features.find((candidate) => {
      const candidateLabel = String(candidate.label ?? candidate.key ?? "").toLowerCase();
      return candidateLabel === lower;
    });
    if (feature?.value !== undefined && feature.value !== null && feature.value !== "") {
      return feature.value;
    }
  }

  return undefined;
}

function formatFeatureUnit(value: unknown, unit: string, fallback = "-") {
  const text = toText(value);

  return text ? `${text} ${unit}` : fallback;
}

function formatBuildingAge(value: unknown, fallback = "-") {
  let text = toText(value);

  if (!text) return fallback;
  text = text.replace(/ساخت/g, "").trim();
  if (text.includes("سال") || text.includes("نوساز")) return text;

  return `${text} سال`;
}

function readNestedText(item: AdvertisementItem, keys: string[]) {
  for (const key of keys) {
    const value = item[key];

    if (typeof value === "string" && value.trim()) return value;

    if (value && typeof value === "object" && "name" in value) {
      const name = (value as { name?: unknown }).name;

      if (typeof name === "string" && name.trim()) return name;
    }
  }

  return "";
}

function extractAdvertisementItems(payload: unknown): AdvertisementItem[] {
  if (Array.isArray(payload)) return payload as AdvertisementItem[];

  if (!payload || typeof payload !== "object") return [];

  const response = payload as {
    advertises?: unknown;
    data?: unknown;
    items?: unknown;
    list?: unknown;
    result?: unknown;
    results?: unknown;
  };

  const directCandidates = [
    response.advertises,
    response.list,
    response.items,
    response.results,
    response.data,
  ];

  for (const candidate of directCandidates) {
    if (Array.isArray(candidate)) return candidate as AdvertisementItem[];
  }

  for (const candidate of [response.data, response.result]) {
    const nestedItems = extractAdvertisementItems(candidate);

    if (nestedItems.length > 0) return nestedItems;
  }

  return [];
}


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
  const area = readFeatureValue(item, ["area", "meterage", "building_area", "land_area", "متراژ", "buildingArea", "landArea"]) ?? item.area;
  const rooms = readFeatureValue(item, ["rooms", "اتاق", "خواب"]) ?? item.rooms;
  const buildingAge = readFeatureValue(item, ["building_age", "سال ساخت", "age", "year"]) ?? item.year;
  const landArea = readFeatureValue(item, ["land_area", "landArea", "متراژ زمین"]) ?? item.land_area;
  const documentType = readFeatureValue(item, ["document_type", "documentType", "نوع سند", "سند"]) ?? item.document_type ?? item.documentType;
  const commercialPosition = readFeatureValue(item, ["commercial_position", "commercialPosition", "موقعیت تجاری"]) ?? item.commercial_position ?? item.commercialPosition;
  const landPosition = readFeatureValue(item, ["land_position", "landPosition", "موقعیت زمین", "position"]) ?? item.land_position ?? item.landPosition;
  const category = toText(
    item.category ?? item.category_name ?? item.category_title ?? readFeatureValue(item, ["category", "دسته بندی"]),
  );
  const formCode = toText(
    item.form_code ?? readFeatureValue(item, ["form_code"]),
  );
  const projectMinMeterPrice = readFeatureValue(item, [
    "min_meter_price",
    "min_price",
    "meter_price",
  ]);
  const projectMaxMeterPrice = readFeatureValue(item, [
    "max_meter_price",
    "max_price",
  ]);
  const floorRaw = readFeatureValue(item, ["floor", "طبقه", "طبقه واحد", "طبقه آپارتمان"]);
  const floor = floorRaw !== undefined && floorRaw !== null && floorRaw !== ""
    ? (typeof floorRaw === "number" || /^\d+$/.test(String(floorRaw).trim()) ? `طبقه ${toText(floorRaw)}` : toText(floorRaw))
    : undefined;
  const buildingAreaRaw = readFeatureValue(item, ["building_area", "buildingArea", "زیربنا", "متراژ بنا"]);
  const buildingArea = buildingAreaRaw !== undefined && buildingAreaRaw !== null && buildingAreaRaw !== ""
    ? formatFeatureUnit(buildingAreaRaw, "متر مربع", "")
    : undefined;
  const capacityRaw = readFeatureValue(item, [
    "capacity",
    "standard_capacity",
    "standardCapacity",
    "ظرفیت استاندارد",
    "ظرفیت",
  ]);
  const capacity = capacityRaw !== undefined && capacityRaw !== null && capacityRaw !== ""
    ? (String(capacityRaw).includes("نفر") ? toText(capacityRaw) : `${toText(capacityRaw)} نفر`)
    : undefined;
  const starsRaw = readFeatureValue(item, ["hotel_stars", "hotelStars", "ستاره", "رتبه بندی اقامتگاه"]);
  const stars = starsRaw !== undefined && starsRaw !== null && starsRaw !== ""
    ? (String(starsRaw).includes("ستاره") ? toText(starsRaw) : `${toText(starsRaw)} ستاره`)
    : undefined;
  const rentalPeriodRaw = readFeatureValue(item, ["rental_period", "rentalPeriod", "دوره اجاره"]);
  const rentalPeriod = rentalPeriodRaw !== undefined && rentalPeriodRaw !== null && rentalPeriodRaw !== ""
    ? toText(rentalPeriodRaw)
    : undefined;

  const projectTypeRaw = readFeatureValue(item, ["project_type", "projectType", "نوع پروژه"]);
  const projectType = projectTypeRaw !== undefined && projectTypeRaw !== null && projectTypeRaw !== ""
    ? toText(projectTypeRaw)
    : undefined;

  const totalFloorsRaw = readFeatureValue(item, [
    "project_total_floors",
    "projectTotalFloors",
    "total_floors",
    "totalFloors",
    "تعداد کل طبقات",
    "تعداد طبقات",
  ]);
  const totalFloors = totalFloorsRaw !== undefined && totalFloorsRaw !== null && totalFloorsRaw !== ""
    ? (String(totalFloorsRaw).includes("طبقه") ? toText(totalFloorsRaw) : `${toText(totalFloorsRaw)} طبقه`)
    : undefined;

  const totalUnitsRaw = readFeatureValue(item, [
    "project_total_units",
    "projectTotalUnits",
    "total_units",
    "totalUnits",
    "تعداد کل واحد ها",
    "تعداد کل واحدها",
    "تعداد واحدها",
    "تعداد واحد",
  ]);
  const totalUnits = totalUnitsRaw !== undefined && totalUnitsRaw !== null && totalUnitsRaw !== ""
    ? (String(totalUnitsRaw).includes("واحد") ? toText(totalUnitsRaw) : `${toText(totalUnitsRaw)} واحد`)
    : undefined;

  const builderShareRaw = readFeatureValue(item, [
    "builder_share",
    "builderShare",
    "builder_share_percent",
    "builderSharePercent",
    "درصد مشارکت",
    "درصد سهم",
    "سهم سازنده",
    "partnership_percent",
  ]);
  const builderShare = builderShareRaw !== undefined && builderShareRaw !== null && builderShareRaw !== ""
    ? (String(builderShareRaw).includes("٪") || String(builderShareRaw).includes("%") ? toText(builderShareRaw) : `${toText(builderShareRaw)}٪`)
    : undefined;

  const currentStatusRaw = readFeatureValue(item, [
    "current_status",
    "currentStatus",
    "وضعیت فعلی ملک",
    "وضعیت ملک",
    "وضعیت فعلی",
  ]);
  const currentStatus = currentStatusRaw !== undefined && currentStatusRaw !== null && currentStatusRaw !== ""
    ? toText(currentStatusRaw)
    : undefined;

  const rentPrice = readFeatureValue(item, ["rent_price", "rentPrice", "اجاره", "اجاره ماهانه"]) ?? item.rent_price;
  const mortgagePrice = readFeatureValue(item, ["mortgage_price", "mortgagePrice", "رهن", "ودیعه"]) ?? item.mortgage_price;
  const minPrice = readFeatureValue(item, ["min_price", "minPrice", "حداقل قیمت"]);
  const maxPrice = readFeatureValue(item, ["max_price", "maxPrice", "حداکثر قیمت"]);
  const normalDailyPrice = readFeatureValue(item, [
    "normal_daily_price",
    "normalDailyPrice",
    "قیمت عادی روزانه",
    "daily_price",
    "dailyPrice",
  ]) ?? item.normal_daily_price ?? minPrice;
  const weekendDailyPrice = readFeatureValue(item, [
    "weekend_daily_price",
    "weekendDailyPrice",
    "قیمت آخر هفته",
  ]) ?? maxPrice;

  const isRentForm = formCode.startsWith("rent-") || category.includes("اجاره");
  const isDailyForm = formCode.startsWith("daily-") || category.includes("روزانه");
  const isPartnership = formCode.includes("partnership") || category.includes("مشارکت");
  const isPresale = formCode.includes("presale") || formCode === "presale-special" || category.includes("پیش فروش") || category.includes("پیشفروش") || category.includes("project-presale");

  let pricePrimary = formatPrice(
    isPresale ? projectMinMeterPrice ?? item.price : item.price,
  );
  let priceSecondary =
    isPresale && projectMaxMeterPrice !== undefined
      ? formatPrice(projectMaxMeterPrice)
      : "";
  let priceLabelPrimary = isPresale ? "قیمت متری:" : toText(item.price_label);
  let priceLabelSecondary =
    isPresale && projectMaxMeterPrice !== undefined ? "حداکثر قیمت متری" : "";

  if (isPartnership) {
    priceLabelPrimary = "درصد مشارکت:";
    const cleanShare = (builderShare || "").replace(/[%٪]/g, "").trim();
    pricePrimary = cleanShare ? (cleanShare.endsWith("درصد") ? cleanShare : `${cleanShare} درصد`) : (item.price ? formatPrice(item.price) : "توافقی");
    priceSecondary = "";
  } else if (isPresale) {
    priceLabelPrimary = "قیمت متری:";
    pricePrimary = formatPrice(projectMinMeterPrice ?? item.price);
    if (projectMaxMeterPrice !== undefined && String(projectMaxMeterPrice) !== String(projectMinMeterPrice ?? item.price)) {
      priceSecondary = formatPrice(projectMaxMeterPrice);
    }
  } else if (isDailyForm && (normalDailyPrice || weekendDailyPrice || item.price)) {
    priceLabelPrimary = "قیمت";
    const startPrice = normalDailyPrice || item.price;
    const endPrice = weekendDailyPrice;
    pricePrimary = formatPrice(startPrice);
    if (endPrice && String(endPrice) !== String(startPrice)) {
      priceSecondary = formatPrice(endPrice);
    }
  } else if (isRentForm && (rentPrice || mortgagePrice)) {
    priceLabelPrimary = "اجاره:";
    pricePrimary = formatPrice(rentPrice || 0);
    priceLabelSecondary = "رهن:";
    priceSecondary = formatPrice(mortgagePrice || 0);
  }

  const timeAgo =
    toText(item.published_time_ago) ||
    toText(item.time_ago) ||
    (item.published_days !== undefined && item.published_days !== null
      ? `${toText(item.published_days)} روز پیش`
      : "") ||
    toText(readFeatureValue(item, ["published_at", "published_time_ago", "time_ago"]));

  const locationText = location ? `در ${location}` : "";
  const timeAndLocation = timeAgo && locationText
    ? `${timeAgo} ${locationText}`
    : timeAgo || locationText || (description ? description.slice(0, 40) : "");

  return {
    id: item.id ?? item._id ?? index + 1,
    agency: getAdvertisementPublisherName(item),
    area: formatFeatureUnit(area, "متر مربع"),
    badges: Array.isArray(item.badges) ? item.badges : [],
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
    landArea: landArea !== undefined && landArea !== null && landArea !== "" ? formatFeatureUnit(landArea, "متر مربع", "") : undefined,
    documentType: documentType !== undefined && documentType !== null && documentType !== "" ? toText(documentType) : undefined,
    commercialPosition: commercialPosition !== undefined && commercialPosition !== null && commercialPosition !== "" ? toText(commercialPosition) : undefined,
    landPosition: landPosition !== undefined && landPosition !== null && landPosition !== "" ? toText(landPosition) : undefined,
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

export async function getTopViewedAdvertisements(): Promise<AdvertisementItem[]> {
  const response = await publicApi
    .get("public/advertise/top-viewed")
    .json<TopViewedAdvertisementsResponse>();

  return Array.isArray(response) ? response : response.data ?? [];
}

export async function getAdvertisementList({
  cityId,
  filters,
  page = 1,
  perPage = defaultPerPage,
}: AdvertisementListParams) {
  const response = await publicApi
    .get("public/advertise", {
      searchParams: compactSearchParams({
        ...buildAdvertiseSearchParams(filters),
        city_id: cityId,
        page,
        per_page: perPage,
      }),
    })
    .json<AdvertisementListResponse>();
  const rawResponse = Array.isArray(response) ? undefined : response;
  const data = Array.isArray(response) ? response : response.data ?? [];
  const meta = rawResponse?.meta ?? rawResponse?.pagination;
  const currentPage = rawResponse?.page ?? meta?.current_page ?? meta?.page ?? page;
  const lastPage = meta?.last_page ?? meta?.total_pages;
  const rawTotal = rawResponse?.total ?? meta?.total;
  const total = typeof rawTotal === "number" ? rawTotal : data.length;
  const resolvedPerPage = rawResponse?.per_page ?? meta?.per_page ?? perPage;

  return {
    data,
    hasNextPage:
      typeof rawResponse?.has_more === "boolean"
        ? rawResponse.has_more
        : typeof lastPage === "number"
          ? currentPage < lastPage
          : typeof total === "number"
            ? currentPage * resolvedPerPage < total
            : data.length >= perPage,
    page: currentPage,
    total,
  } satisfies AdvertisementPage;
}

function extractLoanFromFeatures(
  features?: AdvertisementFeature[],
): AdvertisementItem["loan"] {
  if (!Array.isArray(features)) return undefined;

  const findValue = (keys: string[]) =>
    features.find((f) => keys.includes(f.label ?? "") || keys.includes(f.key ?? ""))?.value;

  const amount = findValue(["loan_amount", "mortgage_amount", "loan_price", "loan_value"]);
  const installment = findValue([
    "loan_installment",
    "installment_amount",
    "loan_payment",
    "monthly_installment",
  ]);

  if (amount !== undefined || installment !== undefined) {
    return {
      amount: (amount ?? null) as string | number | null,
      installment: (installment ?? null) as string | number | null,
    };
  }
  return undefined;
}

export function normalizeAdvertisementLoan(item: AdvertisementItem): AdvertisementItem {
  if (!item || typeof item !== "object") return item;

  const loanFromFeatures = extractLoanFromFeatures(item.features);
  if (loanFromFeatures) {
    item.loan = {
      amount: item.loan?.amount ?? loanFromFeatures.amount,
      installment: item.loan?.installment ?? loanFromFeatures.installment,
    };
  }

  return item;
}

function unwrapAdvertisementShowResponse(
  response: AdvertisementShowResponse,
): AdvertisementItem {
  if (response?.data && typeof response.data === "object") {
    return normalizeAdvertisementLoan(response.data);
  }

  throw new ApiError(500, "ساختار اطلاعات آگهی از سرور قابل استفاده نیست.");
}

export async function getAdvertisementDetail(id: string): Promise<AdvertisementItem> {
  // Use the authenticated client even for the public endpoint. When a token is
  // present it is sent so backend can calculate is_mine/is_bookmarked; without
  // a token this still behaves as a normal public request.
  const response = await api
    .get(`public/advertise/${encodeURIComponent(id)}`)
    .json<AdvertisementShowResponse>();

  return unwrapAdvertisementShowResponse(response);
}

export async function getAdvertisementDailyViews(id: string): Promise<AdvertisementDailyViews> {
  const response = await publicApi
    .get(`public/advertise/view/preview-chart/${encodeURIComponent(id)}`)
    .json<AdvertisementDailyViewsResponse>();
  const data = Array.isArray(response.data)
    ? response.data
        .map((item) => {
          const count = Number(item.count ?? 0);
          const date = typeof item.date === "string" ? item.date.trim() : "";

          if (!date || !Number.isFinite(count)) return null;

          return {
            count: Math.max(0, count),
            date,
          } satisfies AdvertisementDailyViewPoint;
        })
        .filter((item): item is AdvertisementDailyViewPoint => item !== null)
    : [];
  const totalView = Number(response.total_view ?? 0);

  return {
    data,
    totalView: Number.isFinite(totalView) ? Math.max(0, totalView) : 0,
  };
}

export async function getAdvertisementPayments(id: string): Promise<AdvertisementPayment[]> {
  const response = await getV2AdvertisementPayments(id);
  return response.data;
}

export async function getAdvertisementPreview(id: string): Promise<AdvertisementItem> {
  const response = await getV2Preview(id);
  return unwrapAdvertisementShowResponse(response as AdvertisementShowResponse);
}

export async function getAgencyAdvertisementPreview(id: string): Promise<AdvertisementItem> {
  const response = await getV2Preview(id);
  return unwrapAdvertisementShowResponse(response as AdvertisementShowResponse);
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : null;
}

function normalizeAdvertiseFormOption(value: unknown): AdvertiseFormOption | null {
  const record = asRecord(value);
  if (!record) return null;

  const optionValue = record.value;
  if (typeof optionValue !== "string" && typeof optionValue !== "number" && typeof optionValue !== "boolean") {
    return null;
  }

  const label = typeof record.label === "string" && record.label.trim()
    ? record.label.trim()
    : String(optionValue);

  return { label, value: optionValue };
}

function normalizeAdvertiseFormField(value: unknown): AdvertiseFormField | null {
  const record = asRecord(value);
  if (!record) return null;

  const key = typeof record.key === "string" ? record.key.trim() : "";
  if (!key) return null;

  const options = Array.isArray(record.options)
    ? record.options
        .map(normalizeAdvertiseFormOption)
        .filter((item): item is AdvertiseFormOption => item !== null)
    : [];

  return {
    dependsOn: typeof record.dependsOn === "string" ? record.dependsOn : undefined,
    key,
    label: typeof record.label === "string" ? record.label : key,
    options,
    optionsEndpoint: typeof record.optionsEndpoint === "string" ? record.optionsEndpoint : undefined,
    required: record.required === true,
    type: typeof record.type === "string" ? record.type : "",
    unit: typeof record.unit === "string" ? record.unit : "",
  };
}

function normalizeAdvertiseFormDefinition(value: unknown, requestedCode = ""): AdvertiseFormDefinition | null {
  const record = asRecord(value);
  if (!record) return null;

  const fieldsValue = record.fields ?? record.inputs ?? record.dynamic_fields ?? record.dynamicFields;
  if (!Array.isArray(fieldsValue)) return null;

  const fields = fieldsValue
    .map(normalizeAdvertiseFormField)
    .filter((item): item is AdvertiseFormField => item !== null);
  const codeCandidates = [record.code, record.form_code, record.formCode, record.slug];
  const code = codeCandidates.find((item): item is string => typeof item === "string" && item.trim().length > 0)?.trim() ?? requestedCode;

  return {
    code,
    fields,
    title: typeof record.title === "string" ? record.title : undefined,
  };
}

function unwrapAdvertiseFormDefinition(response: unknown, requestedCode: string): AdvertiseFormDefinition {
  const direct = normalizeAdvertiseFormDefinition(response, requestedCode);
  if (direct) return direct;

  if (Array.isArray(response)) {
    const fields = response
      .map(normalizeAdvertiseFormField)
      .filter((item): item is AdvertiseFormField => item !== null);

    if (fields.length === response.length && fields.length > 0) {
      return { code: requestedCode, fields };
    }

    for (const item of response) {
      const form = normalizeAdvertiseFormDefinition(item, requestedCode);
      if (form && (!requestedCode || form.code === requestedCode)) return form;
    }
  }

  const record = asRecord(response);
  const candidates = record ? [record.data, record.result, record.form, record.advertise_form] : [];

  for (const candidate of candidates) {
    const normalized = normalizeAdvertiseFormDefinition(candidate, requestedCode);
    if (normalized) return normalized;

    if (Array.isArray(candidate)) {
      for (const item of candidate) {
        const form = normalizeAdvertiseFormDefinition(item, requestedCode);
        if (form && (!requestedCode || form.code === requestedCode)) return form;
      }
    }
  }

  throw new ApiError(500, "ساختار فرم ثبت آگهی از سرور قابل استفاده نیست.");
}

export async function getAdvertiseFormDefinition(formCode: string) {
  const normalizedCode = formCode.trim();
  if (!normalizedCode) throw new ApiError(400, "کد فرم آگهی مشخص نیست.");

  const response = await publicApi
    .get(`public/advertise-form/${encodeURIComponent(normalizedCode)}`)
    .json<unknown>();

  return unwrapAdvertiseFormDefinition(response, normalizedCode);
}

export async function getMyAdvertisementDetail(id: string): Promise<AdvertisementItem> {
  const response = await api
    .get(`me/advertise/get/${encodeURIComponent(id)}`)
    .json<AdvertisementAccountShowResponse>();

  const advertise = "advertise" in response
    ? asRecord(response.advertise) as AdvertisementItem | null
    : null;
  if (advertise) {
    const normalized = normalizeAdvertisementLoan(advertise);
    const category = typeof response.category === "string" ? response.category.trim() : "";

    return category
      ? {
          ...normalized,
          category,
          category_title: normalized.category_title ?? category,
        }
      : normalized;
  }

  if ("data" in response && response.data) return normalizeAdvertisementLoan(response.data as AdvertisementItem);
  return normalizeAdvertisementLoan(response as AdvertisementItem);
}

export async function createAdvertisement(payload: FormData) {
  const response = (await createV2Advertisement(payload)) as AdvertisementCreateResponse;

  const createdAdvertise = "data" in response && response.data
    ? response.data as AdvertisementItem
    : "result" in response && response.result
      ? response.result as AdvertisementItem
      : "advertise" in response && response.advertise
        ? response.advertise as AdvertisementItem
        : response as AdvertisementItem;

  return createdAdvertise;
}

export async function saveAdvertiseDraft(
  arg:
    | FormData
    | Record<string, unknown>
    | { payload: FormData | Record<string, unknown>; draftId?: string | number | null },
) {
  let payload: FormData | Record<string, unknown>;
  let draftId: string | number | null | undefined;

  if (arg && !(arg instanceof FormData) && "payload" in arg) {
    payload = (arg as { payload: FormData | Record<string, unknown> }).payload;
    draftId = (arg as { draftId?: string | number | null }).draftId;
  } else {
    payload = arg as FormData | Record<string, unknown>;
  }

  if (payload instanceof FormData) {
    payload.delete("label");
    payload.delete("description");
    if (!draftId) {
      draftId = (payload.get("id") as string | null) ?? undefined;
    }
    payload.delete("id");
  } else if (payload && typeof payload === "object") {
    delete (payload as Record<string, unknown>).label;
    delete (payload as Record<string, unknown>).description;
    if (!draftId) {
      draftId = ((payload as Record<string, unknown>).id as string | number | null) ?? undefined;
    }
    delete (payload as Record<string, unknown>).id;
  }

  const response = (draftId
    ? await updateV2Draft(String(draftId), payload)
    : await createV2Draft(payload)) as AdvertisementCreateResponse;

  const draftAdvertise = "data" in response && response.data
    ? response.data as AdvertisementItem
    : "result" in response && response.result
      ? response.result as AdvertisementItem
      : "advertise" in response && response.advertise
        ? response.advertise as AdvertisementItem
        : response as AdvertisementItem;

  return draftAdvertise;
}

export async function updateAdvertisement({
  advertiseId,
  payload,
}: {
  advertiseId: string;
  payload: FormData;
}) {
  const response = (await updateV2Advertisement(
    advertiseId,
    payload,
  )) as AdvertisementCreateResponse;

  const updatedAdvertise = "data" in response && response.data
    ? response.data as AdvertisementItem
    : "result" in response && response.result
      ? response.result as AdvertisementItem
      : "advertise" in response && response.advertise
        ? response.advertise as AdvertisementItem
        : response as AdvertisementItem;

  return updatedAdvertise;
}

export async function updateOwnerContact({
  advertiseId,
  ownerContactName,
  ownerContactPhone,
  ownerContactAddress,
}: {
  advertiseId: string;
  ownerContactName?: string;
  ownerContactPhone?: string;
  ownerContactAddress?: string;
}) {
  const jsonBody: Record<string, string> = {};
  if (ownerContactName !== undefined) {
    jsonBody.owner_contact_name = ownerContactName;
  }
  if (ownerContactPhone !== undefined) {
    jsonBody.owner_contact_phone = ownerContactPhone;
  }
  if (ownerContactAddress !== undefined) {
    jsonBody.owner_contact_address = ownerContactAddress;
  }

  const response = await updateV2OwnerContact(advertiseId, jsonBody);
  return ((response as Record<string, unknown>)?.data ?? (response as Record<string, unknown>)?.result ?? response) as AdvertisementItem;
}

export async function deleteAdvertisement({
  advertiseId,
  deleteReasonId,
  description,
}: {
  advertiseId: string | number;
  deleteReasonId?: string;
  description?: string;
}) {
  const response = await api
    .post(`me/advertise/delete/${encodeURIComponent(String(advertiseId))}`, {
      json: {
        delete_reason_id: deleteReasonId,
        description,
      },
    })
    .json();

  return response;
}

function unwrapAdvertisementCheckoutResponse(
  response: AdvertisementCheckoutResponse,
): AdvertisementCheckout {
  if ("items" in response && Array.isArray(response.items)) {
    return response;
  }

  if ("data" in response && response.data && Array.isArray(response.data.items)) {
    return response.data;
  }

  if ("result" in response && response.result && Array.isArray(response.result.items)) {
    return response.result;
  }

  throw new ApiError(500, "اطلاعات پرداخت آگهی از سرور دریافت نشد.");
}

function normalizeCheckoutUrl(value: unknown) {
  if (typeof value !== "string" || !value.trim()) return null;

  const normalizedValue = value.trim();

  if (!/^https?:\/\//i.test(normalizedValue) && !normalizedValue.startsWith("/")) {
    return null;
  }

  try {
    const fallbackOrigin =
      typeof window !== "undefined" ? window.location.origin : "http://localhost";
    const resolvedBaseUrl = baseUrl
      ? new URL(baseUrl, fallbackOrigin).toString()
      : fallbackOrigin;
    const url = new URL(normalizedValue, resolvedBaseUrl);

    if (url.protocol !== "http:" && url.protocol !== "https:") return null;

    return url.toString();
  } catch {
    return null;
  }
}

function findCheckoutPaymentUrl(value: unknown, depth = 0): string | null {
  if (depth > 4) return null;

  const directUrl = normalizeCheckoutUrl(value);

  if (directUrl) return directUrl;
  if (!value || typeof value !== "object") return null;

  const record = value as Record<string, unknown>;

  for (const key of [
    "payment_url",
    "paymentUrl",
    "gateway_url",
    "gatewayUrl",
    "redirect_url",
    "redirectUrl",
    "url",
  ]) {
    const url = normalizeCheckoutUrl(record[key]);

    if (url) return url;
  }

  for (const key of ["data", "result", "payment", "intent", "gateway"]) {
    const nestedUrl = findCheckoutPaymentUrl(record[key], depth + 1);

    if (nestedUrl) return nestedUrl;
  }

  return null;
}

export async function getAdvertisementCheckout(advertiseId: string) {
  const response = (await getV2Checkout(advertiseId)) as AdvertisementCheckoutResponse;

  if (response && typeof response === "object" && !Array.isArray(response)) {
    const record = response as Record<string, unknown>;
    if (record.status === false) {
      throw new ApiError(
        400,
        typeof record.message === "string" && record.message.trim()
          ? record.message
          : "دریافت اطلاعات پرداخت آگهی با خطا مواجه شد.",
        undefined,
        { code: typeof record.code === "string" ? record.code : undefined },
      );
    }
  }

  return unwrapAdvertisementCheckoutResponse(response);
}

export async function getAgencyAdvertisementCheckout(advertiseId: string) {
  const response = (await apiV2
    .get(`agency/advertise/${encodeURIComponent(advertiseId)}/checkout`)
    .json()) as AdvertisementCheckoutResponse;

  if (response && typeof response === "object" && !Array.isArray(response)) {
    const record = response as Record<string, unknown>;
    if (record.status === false) {
      throw new ApiError(
        400,
        typeof record.message === "string" && record.message.trim()
          ? record.message
          : "دریافت اطلاعات پرداخت آگهی با خطا مواجه شد.",
        undefined,
        { code: typeof record.code === "string" ? record.code : undefined },
      );
    }
  }

  return unwrapAdvertisementCheckoutResponse(response);
}

export async function getConsultantAdvertisementCheckout(advertiseId: string) {
  return getAdvertisementCheckout(advertiseId);
}

export async function submitAdvertisementCheckout({
  advertiseId,
  discount_code,
  items,
  paymentMethod,
}: SubmitAdvertisementCheckoutPayload): Promise<SubmitAdvertisementCheckoutResult> {
  const response = await submitV2Checkout(advertiseId, {
    ...(discount_code ? { discount_code } : {}),
    items,
    payment_method: paymentMethod,
  });

  if (response && typeof response === "object" && !Array.isArray(response)) {
    const record = response as Record<string, unknown>;

    if (record.status === false) {
      throw new ApiError(
        400,
        typeof record.message === "string" && record.message.trim()
          ? record.message
          : "پرداخت آگهی با خطا مواجه شد.",
        undefined,
        { code: typeof record.code === "string" ? record.code : undefined },
      );
    }
  }

  return {
    paymentUrl: findCheckoutPaymentUrl(response),
    response,
  };
}

export const submitPersonalAdvertisementCheckout = submitAdvertisementCheckout;

export async function submitConsultantAdvertisementCheckout(
  payload: SubmitAdvertisementCheckoutPayload,
): Promise<SubmitAdvertisementCheckoutResult> {
  return submitAdvertisementCheckout(payload);
}

export async function submitAgencyAdvertisementCheckout({
  advertiseId,
  consultantId,
  discount_code,
  items,
  paymentMethod,
}: SubmitAgencyAdvertisementCheckoutPayload): Promise<SubmitAdvertisementCheckoutResult> {
  const numericConsultantId =
    consultantId !== undefined &&
    consultantId !== null &&
    String(consultantId).trim() !== "" &&
    !Number.isNaN(Number(consultantId))
      ? Number(consultantId)
      : undefined;

  let response: unknown;
  if (paymentMethod === "by_consultant") {
    response = await apiV2
      .post(`agency/advertise/${encodeURIComponent(advertiseId)}/checkout`, {
        json: {
          payment_method: "by_consultant",
          ...(numericConsultantId !== undefined ? { consultant_id: numericConsultantId } : {}),
        },
      })
      .json();
  } else {
    response = await apiV2
      .post(`agency/advertise/${encodeURIComponent(advertiseId)}/checkout`, {
        json: {
          ...(numericConsultantId !== undefined ? { consultant_id: numericConsultantId } : {}),
          ...(discount_code ? { discount_code } : {}),
          items,
          payment_method: paymentMethod,
        },
      })
      .json();
  }

  if (response && typeof response === "object" && !Array.isArray(response)) {
    const record = response as Record<string, unknown>;

    if (record.status === false) {
      throw new ApiError(
        400,
        typeof record.message === "string" && record.message.trim()
          ? record.message
          : "پرداخت آگهی تخصیصی با خطا مواجه شد.",
        undefined,
        { code: typeof record.code === "string" ? record.code : undefined },
      );
    }
  }

  return {
    paymentUrl: findCheckoutPaymentUrl(response),
    response,
  };
}

export async function getAdvertisementMap({
  cityId,
  east,
  filters,
  geofence,
  limit = 100,
  north,
  south,
  west,
}: AdvertisementMapParams) {
  const searchParams = compactSearchParams({
    ...buildAdvertiseSearchParams(filters),
    ...(cityId ? { city_id: cityId } : {}),
    east,
    geofence,
    limit,
    north,
    south,
    west,
  });
  const response = await publicApi
    .get(buildAdvertisementMapRequestPath(searchParams))
    .json<AdvertisementMapResponse>();

  return extractAdvertisementItems(response);
}

export function submitAdvertiseFeedback({
  advertiseId,
  feedback,
}: SubmitAdvertiseFeedbackPayload) {
  return api
    .post(`me/advertise/feedback/${advertiseId}`, { json: feedback })
    .json<ApiMutationResponse>();
}

export async function getAdvertiseReportReasons() {
  const response = await apiV2
    .get("advertise/report-reasons")
    .json<AdvertiseReportReasonsResponse>();

  if (Array.isArray(response)) return response;

  if (Array.isArray(response.list)) return response.list;
  if (Array.isArray(response.data)) return response.data;

  return [];
}

export function submitAdvertiseReport({
  advertiseId,
  description,
  reportReasonId,
}: SubmitAdvertiseReportPayload) {
  return apiV2
    .post(`advertise/report/${encodeURIComponent(String(advertiseId))}`, {
      json: {
        description: description?.trim() || "",
        report_reason_id: Number(reportReasonId),
      },
    })
    .json<ApiMutationResponse>();
}

export interface AgencyRemoveAdPayload {
  reason?: "deal_done" | "no_longer_want_publish" | "other" | string;
  description?: string;
}

export async function removeAgencyAdvertisement(
  advertiseId: string | number,
  payload: AgencyRemoveAdPayload = {
    reason: "other",
    description: "حذف توسط آژانس",
  },
) {
  const response = await api
    .post(`me/agency/advertise/stop-requests/${encodeURIComponent(String(advertiseId))}/remove`, {
      json: payload,
    })
    .json<Record<string, unknown>>();

  return response;
}

export type AdvertisementEngagementEventType = "impression" | "call";

export interface AdvertisementEngagementPayload {
  event_type: AdvertisementEngagementEventType;
  idempotency_key: string;
}

export async function reportAdvertisementEngagement(
  adId: string | number,
  eventType: AdvertisementEngagementEventType,
): Promise<void> {
  const cleanId = String(adId).trim();
  if (!cleanId || !/^[1-9]\d*$/.test(cleanId)) return;

  try {
    await api.post(`advertisements/${encodeURIComponent(cleanId)}/engagement`, {
      json: {
        event_type: eventType,
        idempotency_key: uuidv7(),
      },
    });
  } catch {
    // Telemetry errors must never disrupt user experience.
  }
}


