import { lazyNamed, type AppRoute } from "../types";

const IndependentConsultantCreditPackagesPage = lazyNamed(
  () => import("../../../features/account/routes/IndependentConsultantCreditPackagesPage"),
  "IndependentConsultantCreditPackagesPage",
);
const IndependentConsultantPanelCreditBonusPage = lazyNamed(
  () => import("../../../features/account/routes/IndependentConsultantPanelCreditBonusPage"),
  "IndependentConsultantPanelCreditBonusPage",
);
const IndependentConsultantPanelCreditPage = lazyNamed(
  () => import("../../../features/account/routes/IndependentConsultantPanelCreditPage"),
  "IndependentConsultantPanelCreditPage",
);
const IndependentConsultantCreditHistoryPage = lazyNamed(
  () => import("../../../features/account/credit/IndependentConsultantCreditHistoryPage"),
  "IndependentConsultantCreditHistoryPage",
);
const IndependentConsultantRankingPage = lazyNamed(
  () => import("../../../features/account/IndependentConsultantRankingPage"),
  "IndependentConsultantRankingPage",
);
const IndependentConsultantRankingLevelsPage = lazyNamed(
  () => import("../../../features/account/IndependentConsultantRankingLevelsPage"),
  "IndependentConsultantRankingLevelsPage",
);
const IndependentConsultantBadgesGuidePage = lazyNamed(
  () => import("../../../features/account/IndependentConsultantBadgesGuidePage"),
  "IndependentConsultantBadgesGuidePage",
);
const IndependentConsultantFileBadgePage = lazyNamed(
  () => import("../../../features/account/routes/IndependentConsultantFileBadgePage"),
  "IndependentConsultantFileBadgePage",
);
const IndependentConsultantMagnetBadgePage = lazyNamed(
  () => import("../../../features/account/routes/IndependentConsultantMagnetBadgePage"),
  "IndependentConsultantMagnetBadgePage",
);
const IndependentConsultantResponseBadgePage = lazyNamed(
  () => import("../../../features/account/routes/IndependentConsultantResponseBadgePage"),
  "IndependentConsultantResponseBadgePage",
);
const IndependentConsultantTimeBadgePage = lazyNamed(
  () => import("../../../features/account/routes/IndependentConsultantTimeBadgePage"),
  "IndependentConsultantTimeBadgePage",
);

export const accountCreditAndRankingRoutes: AppRoute[] = [
  {
    path: "/account/credit/packages",
    title: "خرید بسته اعتباری",
    Component: IndependentConsultantCreditPackagesPage,
    requiresAuth: true,
  },
  {
    path: "/account/credit/bonus",
    title: "جوایز و پاداش‌ها",
    Component: IndependentConsultantPanelCreditBonusPage,
    requiresAuth: true,
  },
  {
    path: "/account/credit/panel/bonus",
    title: "جوایز و پاداش‌ها",
    Component: IndependentConsultantPanelCreditBonusPage,
    requiresAuth: true,
  },
  {
    path: "/account/credit/panel",
    title: "پنل مدیریت اعتبار",
    Component: IndependentConsultantPanelCreditPage,
    requiresAuth: true,
  },
  {
    path: "/account/credit/history",
    title: "گردش حساب و تراکنش‌ها",
    Component: IndependentConsultantCreditHistoryPage,
    requiresAuth: true,
  },
  {
    path: "/account/ranking",
    title: "رتبه بندی",
    Component: IndependentConsultantRankingPage,
    requiresAuth: true,
  },
  {
    path: "/account/ranking/levels",
    title: "سطوح رتبه‌بندی",
    Component: IndependentConsultantRankingLevelsPage,
    requiresAuth: true,
  },
  {
    path: "/account/ranking/badges/guide",
    title: "راهنمای نشان‌ها",
    Component: IndependentConsultantBadgesGuidePage,
    requiresAuth: true,
  },
  {
    path: "/account/ranking/badges/file",
    title: "نشان فایلینگ",
    Component: IndependentConsultantFileBadgePage,
    requiresAuth: true,
  },
  {
    path: "/account/ranking/badges/magnet",
    title: "نشان مگنت",
    Component: IndependentConsultantMagnetBadgePage,
    requiresAuth: true,
  },
  {
    path: "/account/ranking/badges/response",
    title: "نشان پاسخگویی",
    Component: IndependentConsultantResponseBadgePage,
    requiresAuth: true,
  },
  {
    path: "/account/ranking/badges/time",
    title: "نشان تایم",
    Component: IndependentConsultantTimeBadgePage,
    requiresAuth: true,
  },
];
