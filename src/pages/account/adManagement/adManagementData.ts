import type { AdCardData } from "../../../components/AdCard";
import { latestMashhadAds } from "../../home/homeData";

export type ConsultantAd = AdCardData;

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

export const adManagementTransactionTabs: {
  label: string;
  value: AdManagementTransaction;
}[] = adManagementTransactionOptions.map((option) => ({
  label: option.label,
  value: option.id,
}));

export const adManagementPropertyTypeLabels: Record<AdManagementPropertyType, string> = {
  apartment: "آپارتمان",
  "villa-house": "خانه ویلایی",
  "garden-villa": "باغ، ویلا",
  land: "زمین",
  office: "واحد اداری",
  "commercial-unit": "واحد تجاری",
  warehouse: "انبار، سوله",
  "hotel-apartment": "هتل، هتل آپارتمان",
  "factory-workshop": "کارخانه، کارگاه",
  "daily-apartment-suite": "آپارتمان، سوئیت",
  "daily-garden-villa": "باغ، ویلا",
  "daily-hotel-apartment": "هتل، هتل آپارتمان",
  "daily-workspace": "دفاتر کار، غرفه، نمایشگاه",
  "project-presale": "پیش فروش، فروش پروژه",
  "project-partnership": "مشارکت",
};

export const adManagementPropertyGroupsByTransaction: Record<
  AdManagementTransaction,
  { title: string; items: AdManagementPropertyType[] }[]
> = {
  sale: [
    {
      title: "مسکونی",
      items: ["apartment", "land", "villa-house", "garden-villa"],
    },
    {
      title: "اداری، تجاری، صنعتی، اقامتی",
      items: ["office", "commercial-unit", "warehouse", "hotel-apartment", "factory-workshop"],
    },
  ],

  rent: [
    {
      title: "مسکونی",
      items: ["apartment", "villa-house", "garden-villa"],
    },
    {
      title: "روزانه",
      items: ["daily-apartment-suite", "daily-garden-villa", "daily-hotel-apartment", "daily-workspace"],
    },
    {
      title: "اداری، تجاری، صنعتی، اقامتی",
      items: ["office", "commercial-unit", "warehouse", "hotel-apartment", "factory-workshop"],
    },
  ],

  project: [
    {
      title: "اداری، تجاری، صنعتی، اقامتی",
      items: ["project-presale", "project-partnership"],
    },
  ],
};


export type AdManagementPublisherOption = {
  id: string;
  image: string;
  name: string;
};

export const adManagementPublisherOptions: AdManagementPublisherOption[] = [
  {
    id: "jalilian-real-estate",
    image: "/figma/ad-management/publisher-0.png",
    name: "املاک جلیلیان",
  },
  {
    id: "hossein-rafiei",
    image: "/figma/ad-management/publisher-1.jpg",
    name: "حسین رفیعی",
  },
  {
    id: "hossein-abedi",
    image: "/figma/ad-management/publisher-2.jpg",
    name: "حسین عابدی",
  },
  {
    id: "hossein-ali-abadi",
    image: "/figma/ad-management/publisher-3.jpg",
    name: "حسین علی آبادی",
  },
  {
    id: "hossein-mohammadi",
    image: "/figma/ad-management/publisher-4.jpg",
    name: "حسین محمدی",
  },
];

export type StatisticsAd = Pick<
  AdCardData,
  "imageClassName" | "timeAndLocation" | "title"
>;

export type AdManagementRouteState = {
  ad?: ConsultantAd;
  hasFreeAdTariff?: boolean;
  paymentFlow?: "new-ad" | "upgrade";
  paymentStep?: "options" | "checkout";
  showPaymentSuccess?: boolean;
  statisticsAd?: StatisticsAd;
  filters?: AdManagementFilters;
  onlyMine?: boolean;
  tab?: AdsTab;
};

export const adManagementPaths = {
  allocation: "/account/ad-management/allocation",
  allocationReview: "/account/ad-management/allocation-review",
  edit: "/account/ad-management/published/edit",
  filter: "/account/ad-management/filter",
  payment: "/account/ad-management/payment",
  published: "/account/ad-management/published",
  root: "/account/manage-ads",
  search: "/account/ad-management/search",
  statistics: "/account/ad-management/statistics",
  statisticsDetails: "/account/ad-management/statistics/details",
} as const;

export function getAllocationReviewPath(adId: ConsultantAd["id"]) {
  return `${adManagementPaths.allocationReview}/${adId}`;
}

export const consultantAds: ConsultantAd[] = latestMashhadAds;

export const consultantStatusAds: ConsultantAd[] = latestMashhadAds
  .slice(0, 3)
  .map((ad) => ({
    ...ad,
    badges: ["فوری", "بروزرسانی"],
  }));

export const statisticsAds: StatisticsAd[] = latestMashhadAds
  .slice(0, 3)
  .map(({ imageClassName, timeAndLocation, title }) => ({
    imageClassName,
    timeAndLocation,
    title,
  }));

export function getAdsForTab(tab: AdsTab) {
  return tab === "active" ? consultantAds : consultantStatusAds;
}

export function getAdManagementRouteState(): AdManagementRouteState {
  return (window.history.state as AdManagementRouteState | null) ?? {};
}

function getAdIdFromPath() {
  const match = window.location.pathname.match(/\/account\/ad-management\/allocation-review\/([^/]+)\/?$/);

  return match?.[1];
}

export function getConsultantAdById(adId?: ConsultantAd["id"] | string) {
  if (adId === undefined || adId === null || adId === "") return undefined;

  const normalizedAdId = String(adId);

  return consultantAds.find((ad) => String(ad.id) === normalizedAdId);
}

export function getSelectedConsultantAd(adId?: ConsultantAd["id"] | string) {
  const routeState = getAdManagementRouteState();
  const selectedAdId = adId ?? getAdIdFromPath();
  const routeAdMatchesPath =
    routeState.ad && selectedAdId !== undefined
      ? String(routeState.ad.id) === String(selectedAdId)
      : Boolean(routeState.ad);

  if (routeState.ad && routeAdMatchesPath) return routeState.ad;

  return getConsultantAdById(selectedAdId) ?? routeState.ad ?? consultantStatusAds[0];
}

export function getSelectedStatisticsAd() {
  return getAdManagementRouteState().statisticsAd ?? statisticsAds[0];
}
