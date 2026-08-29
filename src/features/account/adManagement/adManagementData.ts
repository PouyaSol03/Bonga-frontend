import type { AdCardData } from "../../advertisements/components/AdCard";
import type { AgencyAdvertiseAssignmentDto } from "../../advertisements/api/agency-advertise-assignment.service";
import { mapAdvertisementToAdCard } from "../../advertisements/api/advertisement.service";

export type ConsultantAd = AdCardData;

export type AdManagementPublisherOption = {
  id: string;
  image: string;
  name: string;
};

export const adManagementPublisherOptions: AdManagementPublisherOption[] = [
  { id: "owner", image: "", name: "مالک" },
];

export type AdsTab = "active" | "status";

export type AdManagementSelectedNeighborhood = {
  id: string;
  name: string;
};

export type AdManagementTransaction = "sale" | "rent" | "project";

export type AdManagementPropertyType =
  | "apartment"
  | "villa-house"
  | "garden-villa"
  | "land"
  | "office"
  | "commercial-unit"
  | "warehouse"
  | "hotel-apartment"
  | "factory-workshop"
  | "daily-apartment-suite"
  | "daily-garden-villa"
  | "daily-hotel-apartment"
  | "daily-workspace"
  | "project-presale"
  | "project-partnership";

export type AdManagementFilters = {
  propertyType?: AdManagementPropertyType;
  propertyTypes?: AdManagementPropertyType[];
  neighborhoods: AdManagementSelectedNeighborhood[];
  publisher?: string;
  status?: string;
  transaction?: AdManagementTransaction;
};

export const adManagementTransactionOptions: {
  id: AdManagementTransaction;
  label: string;
}[] = [
  { id: "sale", label: "فروش" },
  { id: "rent", label: "اجاره" },
  { id: "project", label: "پروژه" },
];

export const adManagementPropertyTypeLabels: Record<AdManagementPropertyType, string> = {
  apartment: "آپارتمان",
  "villa-house": "خانه، ویلا",
  "garden-villa": "ویلا، باغ",
  land: "زمین، ملک کلنگی",
  office: "اداری",
  "commercial-unit": "تجاری",
  warehouse: "انبار، سوله",
  "hotel-apartment": "هتل، اقامتگاه",
  "factory-workshop": "صنعتی",
  "daily-apartment-suite": "آپارتمان، سوئیت",
  "daily-garden-villa": "ویلا، باغ",
  "daily-hotel-apartment": "هتل، اقامتگاه",
  "daily-workspace": "دفترکار، غرفه",
  "project-presale": "پروژه",
  "project-partnership": "مشارکت",
};

export const adManagementPropertyGroupsByTransaction: Record<
  AdManagementTransaction,
  { title: string; items: AdManagementPropertyType[] }[]
> = {
  sale: [
    {
      title: "مسکونی",
      items: ["apartment", "land", "villa-house"],
    },
    {
      title: "اداری، تجاری، صنعتی، اقامتی",
      items: ["office", "commercial-unit", "factory-workshop", "hotel-apartment"],
    },
  ],

  rent: [
    {
      title: "مسکونی",
      items: ["apartment", "villa-house"],
    },
    {
      title: "روزانه",
      items: ["daily-apartment-suite", "daily-garden-villa", "daily-hotel-apartment", "daily-workspace"],
    },
    {
      title: "اداری، تجاری، صنعتی، اقامتی",
      items: ["office", "commercial-unit", "factory-workshop", "hotel-apartment"],
    },
  ],

  project: [
    {
      title: "اداری، تجاری، صنعتی، اقامتی",
      items: ["project-presale", "project-partnership"],
    },
  ],
};


export type StatisticsAd = Pick<
  AdCardData,
  "id" | "imageClassName" | "imageUrl" | "timeAndLocation" | "title"
>;

export type AdManagementRouteState = {
  ad?: ConsultantAd;
  assignment?: AgencyAdvertiseAssignmentDto;
  assignmentId?: number | string;
  consultantId?: number | string;
  publisherType?: "agency" | "consultant";
  hasFreeAdTariff?: boolean;
  paymentFlow?: "agency-allocation" | "new-ad" | "upgrade";
  paymentStep?: "options" | "checkout";
  paymentHistoryReturnTo?: string;
  previewFlow?: "agency-allocation";
  returnTo?: string;
  visitStatisticsReturnTo?: string;
  showPaymentSuccess?: boolean;
  statisticsAd?: StatisticsAd;
  card?: ConsultantAd;
  editReturnTo?: string;
  isEditMode?: boolean;
  filters?: AdManagementFilters;
  onlyMine?: boolean;
  tab?: AdsTab;
};

export const adManagementPaths = {
  allocation: "/account/ad-management/allocation",
  allocationReview: "/account/ad-management/allocation-review",
  delete: "/account/ad-management/delete",
  edit: "/account/ad-management/published/edit",
  filter: "/account/ad-management/filter",
  payment: "/account/ad-management/payment",
  paymentHistory: "/account/ad-management/payment-history",
  published: "/account/ad-management/published",
  root: "/account/manage-ads",
  search: "/account/ad-management/search",
  statistics: "/account/ad-management/statistics",
  statisticsDetails: "/account/ad-management/statistics/details",
} as const;

export function getAdPreviewPath(adId: ConsultantAd["id"] | string) {
  return `/preview-ad/${encodeURIComponent(String(adId))}`;
}

export function getAdEditPath(adId?: ConsultantAd["id"] | string) {
  const params = new URLSearchParams({
    category: "apartment",
    edit: "true",
    label: "آپارتمان",
    transaction: "sale",
  });

  if (adId !== undefined && adId !== null && adId !== "") {
    params.set("adId", String(adId));
  }

  return `${adManagementPaths.edit}?${params.toString()}`;
}

export function getAdPaymentPath(adId: ConsultantAd["id"] | string) {
  return `${adManagementPaths.payment}/${encodeURIComponent(String(adId))}`;
}

const agencyAllocationCheckoutStoragePrefix = "bonga:agency-allocation-checkout:";
const newAdCheckoutStoragePrefix = "bonga:new-ad-checkout:";

export function markAgencyAllocationCheckout(adId: ConsultantAd["id"] | string) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(
    `${agencyAllocationCheckoutStoragePrefix}${String(adId)}`,
    "1",
  );
}

export function clearAgencyAllocationCheckout(adId: ConsultantAd["id"] | string) {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(
    `${agencyAllocationCheckoutStoragePrefix}${String(adId)}`,
  );
}

export function hasAgencyAllocationCheckoutMarker(adId: ConsultantAd["id"] | string) {
  if (typeof window === "undefined") return false;
  return (
    window.sessionStorage.getItem(
      `${agencyAllocationCheckoutStoragePrefix}${String(adId)}`,
    ) === "1"
  );
}

export function markNewAdCheckout(adId: ConsultantAd["id"] | string) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(
    `${newAdCheckoutStoragePrefix}${String(adId)}`,
    "1",
  );
}

export function clearNewAdCheckout(adId: ConsultantAd["id"] | string) {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(
    `${newAdCheckoutStoragePrefix}${String(adId)}`,
  );
}

export function hasNewAdCheckoutMarker(adId: ConsultantAd["id"] | string) {
  if (typeof window === "undefined") return false;
  return (
    window.sessionStorage.getItem(
      `${newAdCheckoutStoragePrefix}${String(adId)}`,
    ) === "1"
  );
}

export function getAdStatePath(adId: ConsultantAd["id"] | string) {
  return `/account/my-ads/${encodeURIComponent(String(adId))}/state-ad`;
}

export function getAdPaymentHistoryPath(adId: ConsultantAd["id"] | string) {
  return `/account/my-ads/${encodeURIComponent(String(adId))}/payment-history`;
}

export function getAdIncreaseVisitsPath(adId: ConsultantAd["id"] | string) {
  return `/account/my-ads/${encodeURIComponent(String(adId))}/increase-visits`;
}

export function getAdVisitStatisticsPath(adId: ConsultantAd["id"] | string) {
  return `/account/my-ads/${encodeURIComponent(String(adId))}/visit-statistics`;
}

export function getAdCloseResultPath(adId: ConsultantAd["id"] | string) {
  return `/account/my-ads/${encodeURIComponent(String(adId))}/close-result`;
}

export function getAllocationReviewPath(adId: ConsultantAd["id"]) {
  return `${adManagementPaths.allocationReview}/${adId}`;
}

export function getAdManagementRouteState(): AdManagementRouteState {
  return (window.history.state as AdManagementRouteState | null) ?? {};
}

function getAdIdFromPath() {
  const match = window.location.pathname.match(/\/account\/ad-management\/allocation-review\/([^/]+)\/?$/);

  return match?.[1];
}

function createUnavailableConsultantAd(adId?: ConsultantAd["id"] | string): ConsultantAd {
  return {
    id: adId ?? "",
    title: "آگهی",
    agency: "",
    status: "",
    imageCount: "0",
    priceLabelPrimary: "",
    pricePrimary: "—",
    priceLabelSecondary: "",
    priceSecondary: "",
    area: "—",
    rooms: "—",
    year: "—",
    timeAndLocation: "",
    imageClassName: "",
    badges: [],
  };
}

export function getSelectedConsultantAd(adId?: ConsultantAd["id"] | string) {
  const routeState = getAdManagementRouteState();
  const selectedAdId = adId ?? getAdIdFromPath() ?? routeState.assignment?.advertiseId;
  const routeAdMatchesPath =
    routeState.ad && selectedAdId !== undefined
      ? String(routeState.ad.id) === String(selectedAdId)
      : Boolean(routeState.ad);

  if (routeState.ad && routeAdMatchesPath) return routeState.ad;
  if (routeState.card) return routeState.card;
  if (routeState.assignment?.advertise) {
    return mapAdvertisementToAdCard(routeState.assignment.advertise, 0);
  }

  return createUnavailableConsultantAd(selectedAdId);
}
