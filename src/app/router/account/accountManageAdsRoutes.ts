import { lazyNamed, type AppRoute } from "../types";

const ManageAdsPage = lazyNamed(
  () => import("../../../features/account/manage-ads/ManageAdsPage"),
  "ManageAdsPage",
);
const AccountMyAdStatePage = lazyNamed(
  () => import("../../../features/account/AccountMyAdStatePage"),
  "AccountMyAdStatePage",
);
const ViewAdLeadDetailsPage = lazyNamed(
  () => import("../../../features/advertisements/view/components/ViewAdLeadDetailsPage"),
  "ViewAdLeadDetailsPage",
);
const AdPaymentHistoryPage = lazyNamed(
  () => import("../../../features/account/adManagement/AdPaymentHistoryPage"),
  "AdPaymentHistoryPage",
);
const AdIncreaseVisitsPage = lazyNamed(
  () => import("../../../features/account/adManagement/AdIncreaseVisitsPage"),
  "AdIncreaseVisitsPage",
);
const AdVisitStatisticsPage = lazyNamed(
  () => import("../../../features/account/adManagement/AdVisitStatisticsPage"),
  "AdVisitStatisticsPage",
);
const AdCloseResultPage = lazyNamed(
  () => import("../../../features/account/adManagement/AdCloseResultPage"),
  "AdCloseResultPage",
);
const AgencyStopPublishPage = lazyNamed(
  () => import("../../../features/account/components/AgencyStopPublishPage"),
  "AgencyStopPublishPage",
);
const AgencyDealResultPage = lazyNamed(
  () => import("../../../features/account/components/AgencyDealResultPage"),
  "AgencyDealResultPage",
);

export const accountManageAdsRoutes: AppRoute[] = [
  {
    path: "/account/manage-ads",
    title: "مدیریت آگهی‌ها",
    Component: ManageAdsPage,
    requiresAuth: true,
  },
  {
    path: "/manage-ads",
    title: "مدیریت آگهی‌ها",
    Component: ManageAdsPage,
    requiresAuth: true,
  },
  {
    path: "/account/my-ads",
    title: "مدیریت آگهی‌ها",
    Component: ManageAdsPage,
    requiresAuth: true,
  },
  {
    path: "/account/my-ads/empty",
    title: "مدیریت آگهی‌ها",
    Component: ManageAdsPage,
    requiresAuth: true,
  },
  {
    path: "/account/manage-ads/:id/state-ad",
    title: "مدیریت آگهی",
    Component: AccountMyAdStatePage,
    requiresAuth: true,
  },
  {
    path: "/account/manage-ads/:id/state-ads",
    title: "مدیریت آگهی",
    Component: AccountMyAdStatePage,
    requiresAuth: true,
  },
  {
    path: "/manage-ads/:id/state-ad",
    title: "مدیریت آگهی",
    Component: AccountMyAdStatePage,
    requiresAuth: true,
  },
  {
    path: "/manage-ads/:id/state-ads",
    title: "مدیریت آگهی",
    Component: AccountMyAdStatePage,
    requiresAuth: true,
  },
  {
    path: "/account/my-ads/:id/state-ad",
    title: "مدیریت آگهی",
    Component: AccountMyAdStatePage,
    requiresAuth: true,
  },
  {
    path: "/account/my-ads/:id/state-ads",
    title: "مدیریت آگهی",
    Component: AccountMyAdStatePage,
    requiresAuth: true,
  },
  {
    path: "/account/manage-ads/:id/lead-details",
    title: "جزئیات سرنخ",
    Component: ViewAdLeadDetailsPage,
    requiresAuth: true,
  },
  {
    path: "/account/manage-ads/lead-details",
    title: "جزئیات سرنخ",
    Component: ViewAdLeadDetailsPage,
    requiresAuth: true,
  },
  {
    path: "/account/manage-ads/:id/payment-history",
    title: "تاریخچه پرداخت",
    Component: AdPaymentHistoryPage,
    requiresAuth: true,
  },
  {
    path: "/account/manage-ads/:id/increase-visits",
    title: "افزایش بازدید",
    Component: AdIncreaseVisitsPage,
    requiresAuth: true,
  },
  {
    path: "/account/manage-ads/:id/visit-statistics",
    title: "آمار بازدید",
    Component: AdVisitStatisticsPage,
    requiresAuth: true,
  },
  {
    path: "/account/manage-ads/:id/close-result",
    title: "ثبت نتیجه آگهی",
    Component: AdCloseResultPage,
    requiresAuth: true,
  },
  {
    path: "/account/manage-ads/:id/stop-publish",
    title: "درخواست توقف انتشار",
    Component: AgencyStopPublishPage,
    requiresAuth: true,
  },
  {
    path: "/account/manage-ads/:id/deal-result",
    title: "نتیجه درخواست",
    Component: AgencyDealResultPage,
    requiresAuth: true,
  },
  {
    path: "/account/my-ads/:id/lead-details",
    title: "جزئیات سرنخ",
    Component: ViewAdLeadDetailsPage,
    requiresAuth: true,
  },
  {
    path: "/account/my-ads/lead-details",
    title: "جزئیات سرنخ",
    Component: ViewAdLeadDetailsPage,
    requiresAuth: true,
  },
  {
    path: "/account/my-ads/:id/payment-history",
    title: "تاریخچه پرداخت",
    Component: AdPaymentHistoryPage,
    requiresAuth: true,
  },
  {
    path: "/account/my-ads/:id/increase-visits",
    title: "افزایش بازدید",
    Component: AdIncreaseVisitsPage,
    requiresAuth: true,
  },
  {
    path: "/account/my-ads/:id/visit-statistics",
    title: "آمار بازدید",
    Component: AdVisitStatisticsPage,
    requiresAuth: true,
  },
  {
    path: "/account/my-ads/:id/close-result",
    title: "ثبت نتیجه آگهی",
    Component: AdCloseResultPage,
    requiresAuth: true,
  },
  {
    path: "/account/my-ads/:id/stop-publish",
    title: "درخواست توقف انتشار",
    Component: AgencyStopPublishPage,
    requiresAuth: true,
  },
  {
    path: "/account/my-ads/:id/deal-result",
    title: "نتیجه درخواست",
    Component: AgencyDealResultPage,
    requiresAuth: true,
  },
];
