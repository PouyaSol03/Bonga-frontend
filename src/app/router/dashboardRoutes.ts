import { createElement } from "react";
import { Navigate } from "react-router";
import {
  INDEPENDENT_CONSULTANT,
  REAL_ESTATE_CONSULTANT,
  REAL_ESTATE_MANAGER,
} from "../../shared/constants/roles.constants";
import { lazyNamed, type AppRoute, DASHBOARD_PATH } from "./types";

const DashboardHomePage = lazyNamed(
  () => import("../../features/dashboard/DashboardHomePage"),
  "DashboardHomePage",
);
const DashboardAgencyPage = lazyNamed(
  () => import("../../features/dashboard/DashboardHomePage"),
  "DashboardAgencyPage",
);
const DashboardAgentPage = lazyNamed(
  () => import("../../features/dashboard/AgentProfilePage"),
  "AgentProfilePage",
);
const ViewAdLeadDetailsPage = lazyNamed(
  () => import("../../features/advertisements/view/components/ViewAdLeadDetailsPage"),
  "ViewAdLeadDetailsPage",
);

// Team & Requests & Payments placeholders from DashboardHomePage
const DashboardTeamPage = lazyNamed(
  () => import("../../features/dashboard/DashboardHomePage"),
  "DashboardTeamPage",
);
const DashboardAddConsultantPage = lazyNamed(
  () => import("../../features/dashboard/DashboardHomePage"),
  "DashboardAddConsultantPage",
);
const DashboardConsultantInfoPage = lazyNamed(
  () => import("../../features/dashboard/DashboardHomePage"),
  "DashboardConsultantInfoPage",
);
const DashboardConsultantEditPage = lazyNamed(
  () => import("../../features/dashboard/DashboardHomePage"),
  "DashboardConsultantEditPage",
);
const DashboardConsultantRemovePage = lazyNamed(
  () => import("../../features/dashboard/DashboardHomePage"),
  "DashboardConsultantRemovePage",
);
const DashboardRequestsPage = lazyNamed(
  () => import("../../features/dashboard/DashboardHomePage"),
  "DashboardRequestsPage",
);
const DashboardPaymentsPage = lazyNamed(
  () => import("../../features/dashboard/DashboardHomePage"),
  "DashboardPaymentsPage",
);

// Detailed dashboard screens
const DashboardRankingPage = lazyNamed(
  () => import("../../features/dashboard/DashboardRankingPage"),
  "DashboardRankingPage",
);
const DashboardBadgesGuidePage = lazyNamed(
  () => import("../../features/dashboard/DashboardBadgesGuidePage"),
  "DashboardBadgesGuidePage",
);
const DashboardRankingLevelsGuidePage = lazyNamed(
  () => import("../../features/dashboard/DashboardRankingLevelsGuidePage"),
  "DashboardRankingLevelsGuidePage",
);
const DashboardRecordHolderBadgePage = lazyNamed(
  () => import("../../features/dashboard/DashboardBadgeDetailsPage"),
  "DashboardRecordHolderBadgePage",
);
const DashboardGoldenTeamBadgePage = lazyNamed(
  () => import("../../features/dashboard/DashboardBadgeDetailsPage"),
  "DashboardGoldenTeamBadgePage",
);
const DashboardPopularBadgePage = lazyNamed(
  () => import("../../features/dashboard/DashboardBadgeDetailsPage"),
  "DashboardPopularBadgePage",
);
const DashboardFastTeamBadgePage = lazyNamed(
  () => import("../../features/dashboard/DashboardBadgeDetailsPage"),
  "DashboardFastTeamBadgePage",
);
const DashboardUrgentActionsPage = lazyNamed(
  () => import("../../features/dashboard/DashboardUrgentActionsPage"),
  "DashboardUrgentActionsPage",
);
const DashboardLeadFollowupPage = lazyNamed(
  () => import("../../features/dashboard/DashboardLeadFollowupPage"),
  "DashboardLeadFollowupPage",
);
const DashboardInactiveConsultantsPage = lazyNamed(
  () => import("../../features/dashboard/DashboardInactiveConsultantsPage"),
  "DashboardInactiveConsultantsPage",
);
const DashboardExpiringAdsPage = lazyNamed(
  () => import("../../features/dashboard/DashboardExpiringAdsPage"),
  "DashboardExpiringAdsPage",
);
const SearchMapFilterPage = lazyNamed(
  () => import("../../features/search/SearchMapFilterPage"),
  "SearchMapFilterPage",
);
const DashboardAgencyPreviewPage = lazyNamed(
  () => import("../../features/dashboard/AgencyPreviewPage"),
  "AgencyPreviewPage",
);
const DashboardAgencyQrCodePage = lazyNamed(
  () => import("../../features/dashboard/AgencyPreviewPage"),
  "AgencyQrCodePage",
);
const DashboardMessagesPage = lazyNamed(
  () => import("../../features/chat/UserChatHomePage"),
  "UserChatHomePage",
);

export const dashboardRoutes: AppRoute[] = [
  {
    path: DASHBOARD_PATH,
    title: "داشبورد",
    Component: DashboardHomePage,
    layout: "dashboard",
    requiresAuth: true,
    requiresNonUser: true,
  },
  {
    path: `${DASHBOARD_PATH}/agency`,
    title: "صفحه آژانس",
    Component: DashboardAgencyPage,
    authority: [REAL_ESTATE_MANAGER],
    layout: "dashboard",
    requiresAuth: true,
    requiresNonUser: true,
  },
  {
    path: `${DASHBOARD_PATH}/agent`,
    title: "صفحه مشاور",
    Component: DashboardAgentPage,
    authority: [REAL_ESTATE_CONSULTANT, INDEPENDENT_CONSULTANT],
    layout: "dashboard",
    requiresAuth: true,
    requiresNonUser: true,
  },
  {
    path: `${DASHBOARD_PATH}/ads`,
    title: "مدیریت آگهی‌ها",
    Component: () => createElement(Navigate, { to: "/account/manage-ads", replace: true }),
    requiresAuth: true,
  },
  {
    path: `${DASHBOARD_PATH}/lead-details`,
    title: "جزئیات سرنخ",
    Component: ViewAdLeadDetailsPage,
    layout: "dashboard",
    requiresAuth: true,
  },

  // Team
  {
    path: `${DASHBOARD_PATH}/team`,
    title: "مدیریت مشاورین",
    Component: DashboardTeamPage,
    authority: ["real_estate_manager"],
    layout: "dashboard",
    requiresAuth: true,
    requiresNonUser: true,
  },
  {
    path: `${DASHBOARD_PATH}/team/add-consultant`,
    title: "انتخاب مشاور",
    Component: DashboardAddConsultantPage,
    authority: ["real_estate_manager"],
    layout: "dashboard",
    requiresAuth: true,
    requiresNonUser: true,
  },
  {
    path: `${DASHBOARD_PATH}/team/info`,
    title: "اطلاعات مشاور",
    Component: DashboardConsultantInfoPage,
    authority: ["real_estate_manager", "real_estate_consultant"],
    layout: "dashboard",
    requiresAuth: true,
    requiresNonUser: true,
  },
  {
    path: `${DASHBOARD_PATH}/team/info/:id`,
    title: "اطلاعات مشاور",
    Component: DashboardConsultantInfoPage,
    authority: ["real_estate_manager", "real_estate_consultant"],
    layout: "dashboard",
    requiresAuth: true,
    requiresNonUser: true,
  },
  {
    path: `${DASHBOARD_PATH}/team/edit`,
    title: "ویرایش اطلاعات",
    Component: DashboardConsultantEditPage,
    authority: ["real_estate_manager", "real_estate_consultant"],
    layout: "dashboard",
    requiresAuth: true,
    requiresNonUser: true,
  },
  {
    path: `${DASHBOARD_PATH}/team/edit/:id`,
    title: "ویرایش اطلاعات",
    Component: DashboardConsultantEditPage,
    authority: ["real_estate_manager", "real_estate_consultant"],
    layout: "dashboard",
    requiresAuth: true,
    requiresNonUser: true,
  },
  {
    path: `${DASHBOARD_PATH}/team/remove`,
    title: "حذف مشاور",
    Component: DashboardConsultantRemovePage,
    authority: ["real_estate_manager", "real_estate_consultant"],
    layout: "dashboard",
    requiresAuth: true,
    requiresNonUser: true,
  },
  {
    path: `${DASHBOARD_PATH}/team/remove/:id`,
    title: "حذف مشاور",
    Component: DashboardConsultantRemovePage,
    authority: ["real_estate_manager", "real_estate_consultant"],
    layout: "dashboard",
    requiresAuth: true,
    requiresNonUser: true,
  },

  // Requests & Payments
  {
    path: `${DASHBOARD_PATH}/requests`,
    title: "درخواست‌ها",
    Component: DashboardRequestsPage,
    authority: ["real_estate_manager", "independent_consultant"],
    layout: "dashboard",
    requiresAuth: true,
    requiresNonUser: true,
  },
  {
    path: `${DASHBOARD_PATH}/payments`,
    title: "پرداخت‌ها",
    Component: DashboardPaymentsPage,
    layout: "dashboard",
    requiresAuth: true,
    requiresNonUser: true,
  },

  // Ranking & Badges
  {
    path: `${DASHBOARD_PATH}/ranking`,
    title: "نشان‌ها و رتبه",
    Component: DashboardRankingPage,
    layout: "dashboard",
    requiresAuth: true,
    requiresNonUser: true,
  },
  {
    path: `${DASHBOARD_PATH}/ranking/levels/guide`,
    title: "سطح پیشرفت آژانس",
    Component: DashboardRankingLevelsGuidePage,
    layout: "dashboard",
    requiresAuth: true,
    requiresNonUser: true,
  },
  {
    path: `${DASHBOARD_PATH}/ranking/badges/guide`,
    title: "راهنمای نشان‌ها",
    Component: DashboardBadgesGuidePage,
    layout: "dashboard",
    requiresAuth: true,
    requiresNonUser: true,
  },
  {
    path: `${DASHBOARD_PATH}/ranking/badges/record-holder`,
    title: "جزئیات نشان",
    Component: DashboardRecordHolderBadgePage,
    layout: "dashboard",
    requiresAuth: true,
    requiresNonUser: true,
  },
  {
    path: `${DASHBOARD_PATH}/ranking/badges/golden-team`,
    title: "جزئیات نشان",
    Component: DashboardGoldenTeamBadgePage,
    layout: "dashboard",
    requiresAuth: true,
    requiresNonUser: true,
  },
  {
    path: `${DASHBOARD_PATH}/ranking/badges/popular`,
    title: "جزئیات نشان",
    Component: DashboardPopularBadgePage,
    layout: "dashboard",
    requiresAuth: true,
    requiresNonUser: true,
  },
  {
    path: `${DASHBOARD_PATH}/ranking/badges/fast-team`,
    title: "جزئیات نشان",
    Component: DashboardFastTeamBadgePage,
    layout: "dashboard",
    requiresAuth: true,
    requiresNonUser: true,
  },

  // Urgents & Followups
  {
    path: `${DASHBOARD_PATH}/urgent-actions`,
    title: "اقدامات فوری",
    Component: DashboardUrgentActionsPage,
    layout: "dashboard",
    requiresAuth: true,
    requiresNonUser: true,
  },
  {
    path: `${DASHBOARD_PATH}/lead-followup`,
    title: "پیگیری سرنخ",
    Component: DashboardLeadFollowupPage,
    layout: "dashboard",
    requiresAuth: true,
    requiresNonUser: true,
  },
  {
    path: `${DASHBOARD_PATH}/inactive-consultants`,
    title: "مشاور بدون فعالیت",
    Component: DashboardInactiveConsultantsPage,
    layout: "dashboard",
    requiresAuth: true,
    requiresNonUser: true,
  },
  {
    path: `${DASHBOARD_PATH}/expiring-ads`,
    title: "آگهی در آستانه انقضا",
    Component: DashboardExpiringAdsPage,
    layout: "dashboard",
    requiresAuth: true,
    requiresNonUser: true,
  },
  {
    path: `${DASHBOARD_PATH}/agency/preview/filter`,
    title: "فیلتر آگهی‌ها",
    Component: SearchMapFilterPage,
    authority: [REAL_ESTATE_MANAGER],
    requiresAuth: true,
    requiresNonUser: true,
  },
  {
    path: `${DASHBOARD_PATH}/agency/preview`,
    title: "صفحه آژانس",
    Component: DashboardAgencyPreviewPage,
    authority: [REAL_ESTATE_MANAGER],
    requiresAuth: true,
    requiresNonUser: true,
  },
  {
    path: `${DASHBOARD_PATH}/agency/preview/qr-code`,
    title: "کیوآرکد آژانس",
    Component: DashboardAgencyQrCodePage,
    authority: [REAL_ESTATE_MANAGER],
    requiresAuth: true,
    requiresNonUser: true,
  },
  {
    path: `${DASHBOARD_PATH}/messages`,
    title: "پیام‌ها",
    Component: DashboardMessagesPage,
    layout: "dashboard",
    requiresAuth: true,
    requiresNonUser: true,
  },
];
