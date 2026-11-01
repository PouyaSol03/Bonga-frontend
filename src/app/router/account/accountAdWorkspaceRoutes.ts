import { lazyNamed, type AppRoute } from "../types";

const ManageAdsPage = lazyNamed(
  () => import("../../../features/account/manage-ads/ManageAdsPage"),
  "ManageAdsPage",
);
const IndependentConsultantAdAllocationPage = lazyNamed(
  () => import("../../../features/account/adManagement/IndependentConsultantAdAllocationPage"),
  "IndependentConsultantAdAllocationPage",
);
const IndependentConsultantAdAllocationReviewPage = lazyNamed(
  () => import("../../../features/account/adManagement/IndependentConsultantAdAllocationReviewPage"),
  "IndependentConsultantAdAllocationReviewPage",
);
const IndependentConsultantAdRejectPage = lazyNamed(
  () => import("../../../features/account/adManagement/IndependentConsultantAdRejectPage"),
  "IndependentConsultantAdRejectPage",
);
const AgencyAdStatusDeskPage = lazyNamed(
  () => import("../../../features/account/adManagement/AgencyAdStatusDeskPage"),
  "AgencyAdStatusDeskPage",
);
const IndependentConsultantAdPaymentPage = lazyNamed(
  () => import("../../../features/account/adManagement/IndependentConsultantAdPaymentPage"),
  "IndependentConsultantAdPaymentPage",
);
const IndependentConsultantAdPublishedPage = lazyNamed(
  () => import("../../../features/account/adManagement/IndependentConsultantAdPublishedPage"),
  "IndependentConsultantAdPublishedPage",
);
const NewAdFlowPage = lazyNamed(
  () => import("../../../features/advertisements/create/NewAdFlowPage"),
  "NewAdFlowPage",
);
const AdDeleteReasonPage = lazyNamed(
  () => import("../../../features/account/adManagement/AdDeleteReasonPage"),
  "AdDeleteReasonPage",
);
const IndependentConsultantAdSearchPage = lazyNamed(
  () => import("../../../features/account/adManagement/IndependentConsultantAdSearchPage"),
  "IndependentConsultantAdSearchPage",
);
const IndependentConsultantAdFilterPage = lazyNamed(
  () => import("../../../features/account/adManagement/IndependentConsultantAdFilterPage"),
  "IndependentConsultantAdFilterPage",
);
const IndependentConsultantAdStatisticsPage = lazyNamed(
  () => import("../../../features/account/adManagement/IndependentConsultantAdStatisticsPage"),
  "IndependentConsultantAdStatisticsPage",
);
const IndependentConsultantAdStatisticsDetailsPage = lazyNamed(
  () => import("../../../features/account/adManagement/IndependentConsultantAdStatisticsDetailsPage"),
  "IndependentConsultantAdStatisticsDetailsPage",
);

export const accountAdWorkspaceRoutes: AppRoute[] = [
  {
    path: "/account/ad-management",
    title: "مدیریت آگهی‌ها",
    Component: ManageAdsPage,
    requiresAuth: true,
  },
  {
    path: "/account/ad-management/allocation",
    title: "تخصیص آگهی",
    Component: IndependentConsultantAdAllocationPage,
    requiresAuth: true,
  },
  {
    path: "/account/ad-management/allocation-review",
    title: "بررسی و تخصیص",
    Component: IndependentConsultantAdAllocationReviewPage,
    requiresAuth: true,
  },
  {
    path: "/account/ad-management/allocation-review/:id",
    title: "بررسی و تخصیص",
    Component: IndependentConsultantAdAllocationReviewPage,
    requiresAuth: true,
  },
  {
    path: "/account/ad-management/allocation-review/:id/reject",
    title: "رد ثبت آگهی",
    Component: IndependentConsultantAdRejectPage,
    requiresAuth: true,
  },
  {
    path: "/account/ad-management/review/:id",
    title: "بررسی و تخصیص",
    Component: IndependentConsultantAdAllocationReviewPage,
    requiresAuth: true,
  },
  {
    path: "/account/ad-management/review/:id/reject",
    title: "رد ثبت آگهی",
    Component: IndependentConsultantAdRejectPage,
    requiresAuth: true,
  },
  {
    path: "/account/ad-management/status-desk",
    title: "میز کار آگهی",
    Component: AgencyAdStatusDeskPage,
    requiresAuth: true,
  },
  {
    path: "/account/ad-management/status-desk/:id",
    title: "میز کار آگهی",
    Component: AgencyAdStatusDeskPage,
    requiresAuth: true,
  },
  {
    path: "/account/ad-management/payment",
    title: "هزینه ثبت آگهی",
    Component: IndependentConsultantAdPaymentPage,
    requiresAuth: true,
  },
  {
    path: "/account/ad-management/payment/:id",
    title: "هزینه ثبت آگهی",
    Component: IndependentConsultantAdPaymentPage,
    requiresAuth: true,
  },
  {
    path: "/account/ad-management/published",
    title: "آگهی‌های منتشر شده",
    Component: IndependentConsultantAdPublishedPage,
    requiresAuth: true,
  },
  {
    path: "/account/ad-management/published/edit",
    title: "ویرایش آگهی",
    Component: NewAdFlowPage,
    requiresAuth: true,
  },
  {
    path: "/account/ad-management/delete",
    title: "دلایل حذف",
    Component: AdDeleteReasonPage,
    requiresAuth: true,
  },
  {
    path: "/account/ad-management/search",
    title: "جستجو آگهی",
    Component: IndependentConsultantAdSearchPage,
    requiresAuth: true,
  },
  {
    path: "/account/ad-management/filter",
    title: "فیلتر آگهی",
    Component: IndependentConsultantAdFilterPage,
    requiresAuth: true,
  },
  {
    path: "/account/ad-management/statistics",
    title: "آمار آگهی",
    Component: IndependentConsultantAdStatisticsPage,
    requiresAuth: true,
  },
  {
    path: "/account/ad-management/statistics/details",
    title: "جزئیات آمار آگهی",
    Component: IndependentConsultantAdStatisticsDetailsPage,
    requiresAuth: true,
  },
];
