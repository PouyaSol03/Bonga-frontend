import { createElement, lazy, useEffect, type ComponentType, type LazyExoticComponent } from 'react'
import {
  INDEPENDENT_CONSULTANT,
  REAL_ESTATE_CONSULTANT,
  REAL_ESTATE_MANAGER,
  USER,
} from '../constants/roles.constants'
import { getActiveAuthRole, type AuthSession } from '../auth/auth-storage'

type RouteComponent = ComponentType<any> | LazyExoticComponent<ComponentType<any>>

function lazyNamed<TModule extends Record<string, unknown>>(
  loader: () => Promise<TModule>,
  exportName: keyof TModule,
) {
  return lazy(() =>
    loader().then((module) => ({
      default: module[exportName] as ComponentType<any>,
    })),
  )
}

const HomePage = lazyNamed(() => import('../pages/HomePage'), 'HomePage')
const LoginPhonePage = lazyNamed(() => import('../pages/LoginPhonePage'), 'LoginPhonePage')
const LoginRequiredPage = lazyNamed(() => import('../pages/LoginRequiredPage'), 'LoginRequiredPage')
const LoginVerifyPage = lazyNamed(() => import('../pages/LoginVerifyPage'), 'LoginVerifyPage')
const MyAccountPage = lazyNamed(() => import('../pages/MyAccountPage'), 'MyAccountPage')
const NewAdCategoryPage = lazyNamed(() => import('../pages/newAd/NewAdCategoryPage'), 'NewAdCategoryPage')
const NewAdFlowPage = lazyNamed(() => import('../pages/newAd/NewAdFlowPage'), 'NewAdFlowPage')
const NewAdLocationPage = lazyNamed(() => import('../pages/newAd/NewAdFlowPage'), 'NewAdLocationPage')
const PublicLandingPage = lazyNamed(() => import('../pages/PublicLandingPage'), 'PublicLandingPage')
const NotificationsPage = lazyNamed(() => import('../pages/NotificationsPage'), 'NotificationsPage')
const AccountAboutPage = lazyNamed(() => import('../pages/account/AccountSubPages'), 'AccountAboutPage')
const AccountBookmarksPage = lazyNamed(() => import('../pages/account/AccountSubPages'), 'AccountBookmarksPage')
const AccountDeleteUserPage = lazyNamed(() => import('../pages/account/AccountDeleteUserPage'), 'AccountDeleteUserPage')
const AccountIdentityPage = lazyNamed(() => import('../pages/account/AccountSubPages'), 'AccountIdentityPage')
const AccountMyAdsEmptyPage = lazyNamed(() => import('../pages/account/AccountSubPages'), 'AccountMyAdsEmptyPage')
const AccountMyAdsPage = lazyNamed(() => import('../pages/account/AccountSubPages'), 'AccountMyAdsPage')
const AccountNotesPage = lazyNamed(() => import('../pages/account/AccountSubPages'), 'AccountNotesPage')
const AccountProfilePage = lazyNamed(() => import('../pages/account/AccountSubPages'), 'AccountProfilePage')
const AccountRecentViewsPage = lazyNamed(() => import('../pages/account/AccountSubPages'), 'AccountRecentViewsPage')
const AccountRequestsPage = lazyNamed(() => import('../pages/account/AccountSubPages'), 'AccountRequestsPage')
const AccountWalletHistoryPage = lazyNamed(() => import('../pages/account/AccountSubPages'), 'AccountWalletHistoryPage')
const AccountWalletPage = lazyNamed(() => import('../pages/account/AccountSubPages'), 'AccountWalletPage')
const IndependentConsultantRankingPage = lazyNamed(() => import('../pages/account/IndependentConsultantRankingPage'), 'IndependentConsultantRankingPage')
const IndependentConsultantRankingLevelsPage = lazyNamed(() => import('../pages/account/IndependentConsultantRankingLevelsPage'), 'IndependentConsultantRankingLevelsPage')
const IndependentConsultantBadgesGuidePage = lazyNamed(() => import('../pages/account/IndependentConsultantBadgesGuidePage'), 'IndependentConsultantBadgesGuidePage')
const IndependentConsultantFileBadgePage = lazyNamed(() => import('../pages/account/IndependentConsultantBadgeDetailsPage'), 'IndependentConsultantFileBadgePage')
const IndependentConsultantMagnetBadgePage = lazyNamed(() => import('../pages/account/IndependentConsultantBadgeDetailsPage'), 'IndependentConsultantMagnetBadgePage')
const IndependentConsultantResponseBadgePage = lazyNamed(() => import('../pages/account/IndependentConsultantBadgeDetailsPage'), 'IndependentConsultantResponseBadgePage')
const IndependentConsultantTimeBadgePage = lazyNamed(() => import('../pages/account/IndependentConsultantBadgeDetailsPage'), 'IndependentConsultantTimeBadgePage')
const IndependentConsultantAdManagementPage = lazyNamed(() => import('../pages/account/IndependentConsultantAdManagementPage'), 'IndependentConsultantAdManagementPage')
const DashboardAdsPage = lazyNamed(() => import('../pages/dashboard/DashboardAdsPage'), 'DashboardAdsPage')
const IndependentConsultantAdAllocationPage = lazyNamed(() => import('../pages/account/adManagement/IndependentConsultantAdAllocationPage'), 'IndependentConsultantAdAllocationPage')
const IndependentConsultantAdAllocationReviewPage = lazyNamed(() => import('../pages/account/adManagement/IndependentConsultantAdAllocationReviewPage'), 'IndependentConsultantAdAllocationReviewPage')
const IndependentConsultantAdEditPage = lazyNamed(() => import('../pages/account/adManagement/IndependentConsultantAdEditPage'), 'IndependentConsultantAdEditPage')
const IndependentConsultantAdFilterPage = lazyNamed(() => import('../pages/account/adManagement/IndependentConsultantAdFilterPage'), 'IndependentConsultantAdFilterPage')
const IndependentConsultantAdPaymentPage = lazyNamed(() => import('../pages/account/adManagement/IndependentConsultantAdPaymentPage'), 'IndependentConsultantAdPaymentPage')
const IndependentConsultantAdPublishedPage = lazyNamed(() => import('../pages/account/adManagement/IndependentConsultantAdPublishedPage'), 'IndependentConsultantAdPublishedPage')
const IndependentConsultantAdSearchPage = lazyNamed(() => import('../pages/account/adManagement/IndependentConsultantAdSearchPage'), 'IndependentConsultantAdSearchPage')
const IndependentConsultantAdStatisticsDetailsPage = lazyNamed(() => import('../pages/account/adManagement/IndependentConsultantAdStatisticsDetailsPage'), 'IndependentConsultantAdStatisticsDetailsPage')
const IndependentConsultantAdStatisticsPage = lazyNamed(() => import('../pages/account/adManagement/IndependentConsultantAdStatisticsPage'), 'IndependentConsultantAdStatisticsPage')
const IndependentConsultantCreditPackagesPage = lazyNamed(() => import('../pages/account/credit/IndependentConsultantCreditPage'), 'IndependentConsultantCreditPackagesPage')
const IndependentConsultantPanelCreditBonusPage = lazyNamed(() => import('../pages/account/credit/IndependentConsultantCreditPage'), 'IndependentConsultantPanelCreditBonusPage')
const IndependentConsultantPanelCreditPage = lazyNamed(() => import('../pages/account/credit/IndependentConsultantCreditPage'), 'IndependentConsultantPanelCreditPage')
const IndependentConsultantCreditHistoryPage = lazyNamed(() => import('../pages/account/credit/IndependentConsultantCreditHistoryPage'), 'IndependentConsultantCreditHistoryPage')
const DashboardAgencyPage = lazyNamed(() => import('../pages/dashboard/DashboardHomePage'), 'DashboardAgencyPage')
const DashboardAddConsultantPage = lazyNamed(() => import('../pages/dashboard/DashboardHomePage'), 'DashboardAddConsultantPage')
const DashboardHomePage = lazyNamed(() => import('../pages/dashboard/DashboardHomePage'), 'DashboardHomePage')
const DashboardMessagesPage = lazyNamed(() => import('../pages/dashboard/DashboardHomePage'), 'DashboardMessagesPage')
const DashboardPaymentsPage = lazyNamed(() => import('../pages/dashboard/DashboardHomePage'), 'DashboardPaymentsPage')
const DashboardRankingPage = lazyNamed(() => import('../pages/dashboard/DashboardHomePage'), 'DashboardRankingPage')
const DashboardRequestsPage = lazyNamed(() => import('../pages/dashboard/DashboardHomePage'), 'DashboardRequestsPage')
const DashboardTeamPage = lazyNamed(() => import('../pages/dashboard/DashboardHomePage'), 'DashboardTeamPage')
const SearchMapPage = lazyNamed(() => import('../pages/search/SearchMapPage'), 'SearchMapPage')
const SearchMapFilterPage = lazyNamed(() => import('../pages/search/SearchMapFilterPage'), 'SearchMapFilterPage')
const UserChatDetailPage = lazyNamed(() => import('../pages/UserChatHomePage'), 'UserChatDetailPage')
const UserChatHomePage = lazyNamed(() => import('../pages/UserChatHomePage'), 'UserChatHomePage')
const UserChatResponseTimePage = lazyNamed(() => import('../pages/UserChatHomePage'), 'UserChatResponseTimePage')
const ConsultantsDirectoryPage = lazyNamed(() => import('../pages/ConsultantsDirectoryPage'), 'ConsultantsDirectoryPage')
const AgencyBusinessCreationPage = lazyNamed(() => import('../pages/account/BusinessCreationPage'), 'AgencyBusinessCreationPage')
const BusinessCreationPage = lazyNamed(() => import('../pages/account/BusinessCreationPage'), 'BusinessCreationPage')
const BusinessInfoPage = lazyNamed(() => import('../pages/account/BusinessCreationPage'), 'BusinessInfoPage')
const IndependentConsultantBusinessCreationPage = lazyNamed(() => import('../pages/account/BusinessCreationPage'), 'IndependentConsultantBusinessCreationPage')

export const LOGIN_PATH = '/login/phone'
export const DASHBOARD_PATH = '/account/dashboard'
export const LEGACY_DASHBOARD_PATH = '/dashboard'

function LoginRedirect() {
  useEffect(() => {
    window.history.replaceState({}, '', LOGIN_PATH)
    window.dispatchEvent(new PopStateEvent('popstate'))
  }, [])

  return null
}

function AccountRoleRedirect() {
  return createElement(MyAccountPage)
}

export type AppRoute = {
  authority?: string[]
  layout?: 'dashboard'
  path: string
  requiresAuth?: boolean
  requiresNonUser?: boolean
  title: string
  Component: RouteComponent
}

export function canAccessRoute(route: AppRoute, session: AuthSession | null) {
  if (!route.requiresAuth && !route.authority?.length && !route.requiresNonUser) {
    return true
  }

  const role = getActiveAuthRole(session)

  if (!role) return false
  if (route.requiresNonUser && role === USER) return false
  if (route.authority?.length) return route.authority.includes(role)

  return true
}

export const routes: AppRoute[] = [
  {
    path: '/',
    title: 'بنگاه',
    Component: PublicLandingPage,
  },
  {
    path: '/login',
    title: 'حساب من',
    Component: LoginRedirect,
  },
  {
    path: '/account',
    title: 'حساب من',
    Component: AccountRoleRedirect,
  },
  {
    path: '/login/phone',
    title: 'ورود به حساب کاربری',
    Component: LoginPhonePage,
  },
  {
    path: '/login-required',
    title: 'ورود به حساب کاربری',
    Component: LoginRequiredPage,
  },
  {
    path: '/login/verify',
    title: 'ورود به حساب کاربری',
    Component: LoginVerifyPage,
  },
  {
    path: '/account/profile',
    title: 'مشخصات من',
    Component: AccountProfilePage,
  },
  {
    path: '/account/identity',
    title: 'تایید هویت',
    Component: AccountIdentityPage,
  },
  {
    path: '/account/my-ads',
    title: 'آگهی‌های من',
    Component: AccountMyAdsPage,
  },
  {
    path: '/account/my-ads/empty',
    title: 'آگهی‌های من',
    Component: AccountMyAdsEmptyPage,
  },
  {
    path: '/account/wallet',
    title: 'کیف پول',
    Component: AccountWalletPage,
  },
  {
    path: '/account/wallet/history',
    title: 'تاریخچه پرداخت کیف پول',
    Component: AccountWalletHistoryPage,
  },
  {
    path: '/account/notes',
    title: 'یادداشت‌ها',
    Component: AccountNotesPage,
  },
  {
    path: '/account/bookmarks',
    title: 'نشان‌ها',
    Component: AccountBookmarksPage,
  },
  {
    path: '/account/recent-views',
    title: 'بازدیدهای اخیر',
    Component: AccountRecentViewsPage,
  },
  {
    path: '/account/requests',
    title: 'درخواست‌ها',
    Component: AccountRequestsPage,
  },
  {
    path: '/account/about',
    title: 'درباره ما',
    Component: AccountAboutPage,
  },
  {
    path: '/account/delete-user',
    title: 'حذف حساب کاربری',
    Component: AccountDeleteUserPage,
    authority: [
      REAL_ESTATE_MANAGER,
      INDEPENDENT_CONSULTANT,
      REAL_ESTATE_CONSULTANT,
    ],
    requiresAuth: true,
  },
  {
    path: '/account/business/create',
    title: 'ایجاد کسب و کار',
    Component: BusinessCreationPage,
    authority: [USER],
    requiresAuth: true,
  },
  {
    path: '/account/business/create/agency',
    title: 'ایجاد کسب و کار',
    Component: AgencyBusinessCreationPage,
    authority: [USER],
    requiresAuth: true,
  },
  {
    path: '/account/business/create/consultant',
    title: 'ایجاد کسب و کار',
    Component: IndependentConsultantBusinessCreationPage,
    authority: [USER],
    requiresAuth: true,
  },
  {
    path: '/account/business/create/info',
    title: 'معرفی کسب و کار',
    Component: BusinessInfoPage,
    authority: [USER],
    requiresAuth: true,
  },
  {
    path: '/account/dashboard',
    title: 'داشبورد',
    Component: DashboardHomePage,
    layout: 'dashboard',
    requiresAuth: true,
    requiresNonUser: true,
  },
  {
    path: `${DASHBOARD_PATH}/ranking`,
    title: 'شناساها و رتبه',
    Component: DashboardRankingPage,
    layout: 'dashboard',
    requiresAuth: true,
    requiresNonUser: true,
  },
  {
    path: `${DASHBOARD_PATH}/agency`,
    title: 'صفحه آژانس',
    Component: DashboardAgencyPage,
    layout: 'dashboard',
    requiresAuth: true,
    requiresNonUser: true,
  },
  {
    path: `${DASHBOARD_PATH}/ads`,
    title: 'مدیریت آگهی‌ها',
    Component: DashboardAdsPage,
    layout: 'dashboard',
    requiresAuth: true,
    requiresNonUser: true,
  },
  {
    path: `${DASHBOARD_PATH}/requests`,
    title: 'درخواست‌ها',
    Component: DashboardRequestsPage,
    authority: ['real_estate_manager', 'independent_consultant'],
    layout: 'dashboard',
    requiresAuth: true,
    requiresNonUser: true,
  },
  {
    path: `${DASHBOARD_PATH}/team`,
    title: 'مدیریت مشاورین',
    Component: DashboardTeamPage,
    authority: ['real_estate_manager'],
    layout: 'dashboard',
    requiresAuth: true,
    requiresNonUser: true,
  },
  {
    path: `${DASHBOARD_PATH}/team/add-consultant`,
    title: 'انتخاب مشاور',
    Component: DashboardAddConsultantPage,
    authority: ['real_estate_manager'],
    layout: 'dashboard',
    requiresAuth: true,
    requiresNonUser: true,
  },
  {
    path: `${DASHBOARD_PATH}/payments`,
    title: 'پرداخت‌ها',
    Component: DashboardPaymentsPage,
    layout: 'dashboard',
    requiresAuth: true,
    requiresNonUser: true,
  },
  {
    path: `${DASHBOARD_PATH}/messages`,
    title: 'پیام‌ها',
    Component: DashboardMessagesPage,
    layout: 'dashboard',
    requiresAuth: true,
    requiresNonUser: true,
  },
  {
    path: '/account/ranking',
    title: 'نشان‌ها و رتبه',
    Component: IndependentConsultantRankingPage,
  },
  {
    path: '/account/ranking/levels',
    title: 'سطح پیشرفت مشاور',
    Component: IndependentConsultantRankingLevelsPage,
  },
  {
    path: '/account/ranking/badges/guide',
    title: 'راهنمای نشان‌ها',
    Component: IndependentConsultantBadgesGuidePage,
  },
  {
    path: '/account/ranking/badges/file',
    title: 'جزئیات نشان',
    Component: IndependentConsultantFileBadgePage,
  },
  {
    path: '/account/ranking/badges/magnet',
    title: 'جزئیات نشان',
    Component: IndependentConsultantMagnetBadgePage,
  },
  {
    path: '/account/ranking/badges/response',
    title: 'جزئیات نشان',
    Component: IndependentConsultantResponseBadgePage,
  },
  {
    path: '/account/ranking/badges/time',
    title: 'جزئیات نشان',
    Component: IndependentConsultantTimeBadgePage,
  },
  {
    path: '/account/manage-ads',
    title: 'مدیریت آگهی‌ها',
    Component: IndependentConsultantAdManagementPage,
  },
  {
    path: '/account/ad-management',
    title: 'مدیریت آگهی‌ها',
    Component: IndependentConsultantAdManagementPage,
  },
  {
    path: '/account/ad-management/filter',
    title: 'فیلتر',
    Component: IndependentConsultantAdFilterPage,
  },
  {
    path: '/account/ad-management/search',
    title: 'جستجوی آگهی',
    Component: IndependentConsultantAdSearchPage,
  },
  {
    path: '/account/ad-management/allocation',
    title: 'انتشار آگهی',
    Component: IndependentConsultantAdAllocationPage,
  },
  {
    path: '/account/ad-management/allocation-review',
    title: 'بررسی و تخصیص',
    Component: IndependentConsultantAdAllocationReviewPage,
  },
  {
    path: '/account/ad-management/payment',
    title: 'انتشار آگهی',
    Component: IndependentConsultantAdPaymentPage,
  },
  {
    path: '/account/ad-management/published',
    title: 'مدیریت آگهی',
    Component: IndependentConsultantAdPublishedPage,
  },
  {
    path: '/account/ad-management/published/edit',
    title: 'ثبت آگهی',
    Component: IndependentConsultantAdEditPage,
  },
  {
    path: '/account/ad-management/statistics',
    title: 'آمار آگهی‌ها',
    Component: IndependentConsultantAdStatisticsPage,
  },
  {
    path: '/account/ad-management/statistics/details',
    title: 'جزئیات آمار آگهی',
    Component: IndependentConsultantAdStatisticsDetailsPage,
  },
  {
    path: '/account/credit/panel',
    title: 'افزایش اعتبار',
    Component: IndependentConsultantPanelCreditPage,
  },
  {
    path: '/account/credit/panel/bonus',
    title: 'افزایش اعتبار',
    Component: IndependentConsultantPanelCreditBonusPage,
  },
  {
    path: '/account/credit/packages',
    title: 'افزایش اعتبار',
    Component: IndependentConsultantCreditPackagesPage,
  },
  {
    path: '/account/credit/history',
    title: 'تاریخچه پرداخت',
    Component: IndependentConsultantCreditHistoryPage,
  },
  {
    path: '/home',
    title: 'خانه',
    Component: HomePage,
  },
  {
    path: "/consultants",
    title: "مشاورین",
    Component: ConsultantsDirectoryPage,
  },
  {
    path: "/search",
    title: "جستجو",
    Component: SearchMapPage,
  },
  {
    path: "/search/filter",
    title: "فیلترها",
    Component: SearchMapFilterPage,
  },
  {
    path: "/new-ad",
    title: "ثبت آگهی",
    Component: NewAdCategoryPage,
    requiresAuth: true,
  },
  {
    path: "/new-ad/category",
    title: "دسته‌بندی آگهی",
    Component: NewAdCategoryPage,
    requiresAuth: true,
  },
  {
    path: "/new-ad/personal",
    title: "دسته‌بندی آگهی",
    Component: NewAdCategoryPage,
    requiresAuth: true,
  },
  {
    path: "/new-ad/category/next",
    title: "ثبت آگهی",
    Component: NewAdFlowPage,
    requiresAuth: true,
  },
  {
    path: "/new-ad/details",
    title: "ثبت آگهی",
    Component: NewAdFlowPage,
    requiresAuth: true,
  },
  {
    path: "/new-ad/location",
    title: "موقعیت ملک",
    Component: NewAdLocationPage,
    requiresAuth: true,
  },
  {
    path: "/new-ad/independent-consultant",
    title: "ثبت آگهی",
    Component: NewAdCategoryPage,
    requiresAuth: true,
  },
  {
    path: "/new-ad/jaliliyan-agency",
    title: "ثبت آگهی",
    Component: NewAdCategoryPage,
    requiresAuth: true,
  },
  {
    path: "/notifications",
    title: "اعلان‌ها",
    Component: NotificationsPage,
    requiresAuth: true,
  },
  {
    path: "/chat",
    title: "چت",
    Component: UserChatHomePage,
    requiresAuth: true,
  },
  {
    path: "/chat/response-time",
    title: "ساعت پاسخگویی",
    Component: UserChatResponseTimePage,
    requiresAuth: true,
  },
  {
    path: "/chat/1",
    title: "چت",
    Component: UserChatDetailPage,
    requiresAuth: true,
  },
  {
    path: "/chat/2",
    title: "چت",
    Component: UserChatDetailPage,
    requiresAuth: true,
  },
  {
    path: "/chat/3",
    title: "چت",
    Component: UserChatDetailPage,
    requiresAuth: true,
  },
  {
    path: "/chat/4",
    title: "چت",
    Component: UserChatDetailPage,
    requiresAuth: true,
  },
  {
    path: "/chat/5",
    title: "چت",
    Component: UserChatDetailPage,
    requiresAuth: true,
  },
]
