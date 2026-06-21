import type { AdCardData } from "../../../components/AdCard";
import { latestMashhadAds } from "../../home/homeData";

export type ConsultantAd = AdCardData;

export type AdsTab = "active" | "status";

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
  tab?: AdsTab;
};

export const adManagementPaths = {
  allocation: "/account/ad-management/allocation",
  edit: "/account/ad-management/published/edit",
  filter: "/account/ad-management/filter",
  payment: "/account/ad-management/payment",
  published: "/account/ad-management/published",
  root: "/account/ad-management",
  search: "/account/ad-management/search",
  statistics: "/account/ad-management/statistics",
  statisticsDetails: "/account/ad-management/statistics/details",
} as const;

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

export function getSelectedConsultantAd() {
  return getAdManagementRouteState().ad ?? consultantStatusAds[0];
}

export function getSelectedStatisticsAd() {
  return getAdManagementRouteState().statisticsAd ?? statisticsAds[0];
}
