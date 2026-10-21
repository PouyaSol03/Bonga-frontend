import { lazyNamed, type AppRoute } from "./types";

// Core Account
const MyAccountPage = lazyNamed(
  () => import("../../features/account/MyAccountPage"),
  "MyAccountPage",
);
const AccountProfilePage = lazyNamed(
  () => import("../../features/account/routes/AccountProfilePage"),
  "AccountProfilePage",
);
const AccountIdentityPage = lazyNamed(
  () => import("../../features/account/routes/AccountIdentityPage"),
  "AccountIdentityPage",
);
const AccountAboutPage = lazyNamed(
  () => import("../../features/account/routes/AccountAboutPage"),
  "AccountAboutPage",
);
const AccountDeleteUserPage = lazyNamed(
  () => import("../../features/account/AccountDeleteUserPage"),
  "AccountDeleteUserPage",
);
const AccountBookmarksPage = lazyNamed(
  () => import("../../features/account/routes/AccountBookmarksPage"),
  "AccountBookmarksPage",
);
const AccountNotesPage = lazyNamed(
  () => import("../../features/account/routes/AccountNotesPage"),
  "AccountNotesPage",
);
const AccountRecentViewsPage = lazyNamed(
  () => import("../../features/account/routes/AccountRecentViewsPage"),
  "AccountRecentViewsPage",
);
const AccountRequestsPage = lazyNamed(
  () => import("../../features/account/routes/AccountRequestsPage"),
  "AccountRequestsPage",
);
const AccountWalletPage = lazyNamed(
  () => import("../../features/account/routes/AccountWalletPage"),
  "AccountWalletPage",
);
const AccountWalletHistoryPage = lazyNamed(
  () => import("../../features/account/routes/AccountWalletHistoryPage"),
  "AccountWalletHistoryPage",
);

// Support & Notifications
const AccountSupportPage = lazyNamed(
  () => import("../../features/account/routes/AccountSupportPage"),
  "AccountSupportPage",
);
const AccountSupportChatPage = lazyNamed(
  () => import("../../features/account/routes/AccountSupportChatPage"),
  "AccountSupportChatPage",
);
const AccountSupportNewChatPage = lazyNamed(
  () => import("../../features/account/routes/AccountSupportNewChatPage"),
  "AccountSupportNewChatPage",
);
const AccountSupportRequestsPage = lazyNamed(
  () => import("../../features/account/routes/AccountSupportRequestsPage"),
  "AccountSupportRequestsPage",
);
const AccountSupportNewRequestPage = lazyNamed(
  () => import("../../features/account/routes/AccountSupportNewRequestPage"),
  "AccountSupportNewRequestPage",
);
const AccountSupportFaqPage = lazyNamed(
  () => import("../../features/account/AccountSupportFaqPage"),
  "AccountSupportFaqPage",
);
const NotificationsPage = lazyNamed(
  () => import("../../features/notifications/NotificationsPage"),
  "NotificationsPage",
);
const NotificationManagementPage = lazyNamed(
  () => import("../../features/notifications/NotificationsPage"),
  "NotificationManagementPage",
);

// Chat
const UserChatHomePage = lazyNamed(
  () => import("../../features/chat/UserChatHomePage"),
  "UserChatHomePage",
);
const UserChatDetailPage = lazyNamed(
  () => import("../../features/chat/UserChatHomePage"),
  "UserChatDetailPage",
);
const UserChatBulkDeletePage = lazyNamed(
  () => import("../../features/chat/UserChatHomePage"),
  "UserChatBulkDeletePage",
);
const UserChatResponseTimePage = lazyNamed(
  () => import("../../features/chat/UserChatHomePage"),
  "UserChatResponseTimePage",
);
const UserChatRenamePage = lazyNamed(
  () => import("../../features/chat/UserChatHomePage"),
  "UserChatRenamePage",
);
const ChatReportPage = lazyNamed(
  () => import("../../features/chat/ChatReportPage"),
  "ChatReportPage",
);

// Business Creation
const BusinessCreationPage = lazyNamed(
  () => import("../../features/account/routes/BusinessCreationPage"),
  "BusinessCreationPage",
);
const BusinessInfoPage = lazyNamed(
  () => import("../../features/account/routes/BusinessInfoPage"),
  "BusinessInfoPage",
);
const AgencyBusinessCreationPage = lazyNamed(
  () => import("../../features/account/routes/AgencyBusinessCreationPage"),
  "AgencyBusinessCreationPage",
);
const AgencyNeighborhoodSelectionPage = lazyNamed(
  () => import("../../features/account/routes/AgencyNeighborhoodSelectionPage"),
  "AgencyNeighborhoodSelectionPage",
);
const IndependentConsultantBusinessCreationPage = lazyNamed(
  () => import("../../features/account/routes/IndependentConsultantBusinessCreationPage"),
  "IndependentConsultantBusinessCreationPage",
);

// Ad Management & My Ads
const ManageAdsPage = lazyNamed(
  () => import("../../features/account/manage-ads/ManageAdsPage"),
  "ManageAdsPage",
);
const AccountMyAdStatePage = lazyNamed(
  () => import("../../features/account/AccountMyAdStatePage"),
  "AccountMyAdStatePage",
);
const ViewAdLeadDetailsPage = lazyNamed(
  () => import("../../features/advertisements/view/components/ViewAdLeadDetailsPage"),
  "ViewAdLeadDetailsPage",
);
const AdPaymentHistoryPage = lazyNamed(
  () => import("../../features/account/adManagement/AdPaymentHistoryPage"),
  "AdPaymentHistoryPage",
);
const AdIncreaseVisitsPage = lazyNamed(
  () => import("../../features/account/adManagement/AdIncreaseVisitsPage"),
  "AdIncreaseVisitsPage",
);
const AdVisitStatisticsPage = lazyNamed(
  () => import("../../features/account/adManagement/AdVisitStatisticsPage"),
  "AdVisitStatisticsPage",
);
const AdCloseResultPage = lazyNamed(
  () => import("../../features/account/adManagement/AdCloseResultPage"),
  "AdCloseResultPage",
);
const AgencyStopPublishPage = lazyNamed(
  () => import("../../features/account/components/AgencyStopPublishPage"),
  "AgencyStopPublishPage",
);
const AgencyDealResultPage = lazyNamed(
  () => import("../../features/account/components/AgencyDealResultPage"),
  "AgencyDealResultPage",
);
const IndependentConsultantAdAllocationPage = lazyNamed(
  () => import("../../features/account/adManagement/IndependentConsultantAdAllocationPage"),
  "IndependentConsultantAdAllocationPage",
);
const IndependentConsultantAdAllocationReviewPage = lazyNamed(
  () => import("../../features/account/adManagement/IndependentConsultantAdAllocationReviewPage"),
  "IndependentConsultantAdAllocationReviewPage",
);
const IndependentConsultantAdRejectPage = lazyNamed(
  () => import("../../features/account/adManagement/IndependentConsultantAdRejectPage"),
  "IndependentConsultantAdRejectPage",
);
const AgencyAdStatusDeskPage = lazyNamed(
  () => import("../../features/account/adManagement/AgencyAdStatusDeskPage"),
  "AgencyAdStatusDeskPage",
);
const IndependentConsultantAdPaymentPage = lazyNamed(
  () => import("../../features/account/adManagement/IndependentConsultantAdPaymentPage"),
  "IndependentConsultantAdPaymentPage",
);
const IndependentConsultantAdPublishedPage = lazyNamed(
  () => import("../../features/account/adManagement/IndependentConsultantAdPublishedPage"),
  "IndependentConsultantAdPublishedPage",
);
const AdDeleteReasonPage = lazyNamed(
  () => import("../../features/account/adManagement/AdDeleteReasonPage"),
  "AdDeleteReasonPage",
);
const NewAdFlowPage = lazyNamed(
  () => import("../../features/advertisements/create/NewAdFlowPage"),
  "NewAdFlowPage",
);
const IndependentConsultantAdSearchPage = lazyNamed(
  () => import("../../features/account/adManagement/IndependentConsultantAdSearchPage"),
  "IndependentConsultantAdSearchPage",
);
const IndependentConsultantAdFilterPage = lazyNamed(
  () => import("../../features/account/adManagement/IndependentConsultantAdFilterPage"),
  "IndependentConsultantAdFilterPage",
);
const IndependentConsultantAdStatisticsPage = lazyNamed(
  () => import("../../features/account/adManagement/IndependentConsultantAdStatisticsPage"),
  "IndependentConsultantAdStatisticsPage",
);
const IndependentConsultantAdStatisticsDetailsPage = lazyNamed(
  () => import("../../features/account/adManagement/IndependentConsultantAdStatisticsDetailsPage"),
  "IndependentConsultantAdStatisticsDetailsPage",
);

// Credit & Badges
const IndependentConsultantCreditPackagesPage = lazyNamed(
  () => import("../../features/account/routes/IndependentConsultantCreditPackagesPage"),
  "IndependentConsultantCreditPackagesPage",
);
const IndependentConsultantPanelCreditBonusPage = lazyNamed(
  () => import("../../features/account/routes/IndependentConsultantPanelCreditBonusPage"),
  "IndependentConsultantPanelCreditBonusPage",
);
const IndependentConsultantPanelCreditPage = lazyNamed(
  () => import("../../features/account/routes/IndependentConsultantPanelCreditPage"),
  "IndependentConsultantPanelCreditPage",
);
const IndependentConsultantCreditHistoryPage = lazyNamed(
  () => import("../../features/account/credit/IndependentConsultantCreditHistoryPage"),
  "IndependentConsultantCreditHistoryPage",
);
const IndependentConsultantRankingPage = lazyNamed(
  () => import("../../features/account/IndependentConsultantRankingPage"),
  "IndependentConsultantRankingPage",
);
const IndependentConsultantRankingLevelsPage = lazyNamed(
  () => import("../../features/account/IndependentConsultantRankingLevelsPage"),
  "IndependentConsultantRankingLevelsPage",
);
const IndependentConsultantBadgesGuidePage = lazyNamed(
  () => import("../../features/account/IndependentConsultantBadgesGuidePage"),
  "IndependentConsultantBadgesGuidePage",
);
const IndependentConsultantFileBadgePage = lazyNamed(
  () => import("../../features/account/routes/IndependentConsultantFileBadgePage"),
  "IndependentConsultantFileBadgePage",
);
const IndependentConsultantMagnetBadgePage = lazyNamed(
  () => import("../../features/account/routes/IndependentConsultantMagnetBadgePage"),
  "IndependentConsultantMagnetBadgePage",
);
const IndependentConsultantResponseBadgePage = lazyNamed(
  () => import("../../features/account/routes/IndependentConsultantResponseBadgePage"),
  "IndependentConsultantResponseBadgePage",
);
const IndependentConsultantTimeBadgePage = lazyNamed(
  () => import("../../features/account/routes/IndependentConsultantTimeBadgePage"),
  "IndependentConsultantTimeBadgePage",
);

export const accountRoutes: AppRoute[] = [
  { path: "/account", title: "حساب کاربری", Component: MyAccountPage },
  {
    path: "/account/profile",
    title: "ویرایش مشخصات فردی",
    Component: AccountProfilePage,
    requiresAuth: true,
  },
  {
    path: "/account/identity",
    title: "احراز هویت",
    Component: AccountIdentityPage,
    requiresAuth: true,
  },
  { path: "/account/about", title: "درباره ما", Component: AccountAboutPage },
  {
    path: "/account/delete-user",
    title: "حذف حساب کاربری",
    Component: AccountDeleteUserPage,
    requiresAuth: true,
  },
  {
    path: "/account/bookmarks",
    title: "نشان‌ها",
    Component: AccountBookmarksPage,
    requiresAuth: true,
  },
  { path: "/account/notes", title: "یادداشت‌ها", Component: AccountNotesPage, requiresAuth: true },
  {
    path: "/account/recent-views",
    title: "بازدیدهای اخیر",
    Component: AccountRecentViewsPage,
    requiresAuth: true,
  },
  {
    path: "/account/requests",
    title: "درخواست‌های ملکی من",
    Component: AccountRequestsPage,
    requiresAuth: true,
  },
  { path: "/account/wallet", title: "کیف پول", Component: AccountWalletPage, requiresAuth: true },
  {
    path: "/account/wallet/history",
    title: "تاریخچه کیف پول",
    Component: AccountWalletHistoryPage,
    requiresAuth: true,
  },

  // Support
  { path: "/account/support", title: "پشتیبانی", Component: AccountSupportPage },
  { path: "/account/support/chat", title: "پشتیبانی آنلاین", Component: AccountSupportChatPage },
  {
    path: "/account/support/chat/new",
    title: "پشتیبانی آنلاین",
    Component: AccountSupportNewChatPage,
  },
  {
    path: "/account/support/requests",
    title: "ثبت و پیگیری تیکت",
    Component: AccountSupportRequestsPage,
  },
  {
    path: "/account/support/requests/new",
    title: "ثبت و پیگیری تیکت",
    Component: AccountSupportNewRequestPage,
  },
  { path: "/account/support/faq", title: "سوالات متداول", Component: AccountSupportFaqPage },

  // Notifications & Chat
  { path: "/notifications", title: "اعلان‌ها", Component: NotificationsPage, requiresAuth: true },
  {
    path: "/notifications/settings",
    title: "مدیریت اعلان‌ها",
    Component: NotificationManagementPage,
    requiresAuth: true,
  },
  { path: "/chat", title: "چت", Component: UserChatHomePage, requiresAuth: true },
  {
    path: "/chat/response-time",
    title: "ساعت پاسخگویی",
    Component: UserChatResponseTimePage,
    requiresAuth: true,
  },
  {
    path: "/chat/rename",
    title: "تغییر نام چت",
    Component: UserChatRenamePage,
    requiresAuth: true,
  },
  {
    path: "/chat/bulk-delete",
    title: "حذف گروهی گفتگوها",
    Component: UserChatBulkDeletePage,
    requiresAuth: true,
  },
  { path: "/chat/:id/report", title: "گزارش تخلف", Component: ChatReportPage, requiresAuth: true },
  { path: "/chat/:id", title: "چت", Component: UserChatDetailPage, requiresAuth: true },

  // Business Creation
  {
    path: "/account/business/create",
    title: "انتخاب نوع کسب‌وکار",
    Component: BusinessCreationPage,
    requiresAuth: true,
  },
  {
    path: "/account/business/info",
    title: "اطلاعات کسب و کار",
    Component: BusinessInfoPage,
    requiresAuth: true,
  },
  {
    path: "/account/business/create/info",
    title: "اطلاعات کسب و کار",
    Component: BusinessInfoPage,
    requiresAuth: true,
  },
  {
    path: "/account/business/create/agency",
    title: "اطلاعات آژانس املاک",
    Component: AgencyBusinessCreationPage,
    requiresAuth: true,
  },
  {
    path: "/account/business/create/agency/neighborhood",
    title: "انتخاب محله",
    Component: AgencyNeighborhoodSelectionPage,
    requiresAuth: true,
  },
  {
    path: "/account/business/create/agency/neighborhoods",
    title: "انتخاب محله",
    Component: AgencyNeighborhoodSelectionPage,
    requiresAuth: true,
  },
  {
    path: "/account/business/create/consultant",
    title: "اطلاعات مشاور مستقل",
    Component: IndependentConsultantBusinessCreationPage,
    requiresAuth: true,
  },

  // Manage Ads & Ad State Management
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

  // Consultant / Agency Ad Workspace
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

  // Consultant Credit & Rankings
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
