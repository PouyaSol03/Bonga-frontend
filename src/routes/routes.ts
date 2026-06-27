import { createElement, useEffect, type ComponentType } from 'react'
import { USER } from '../constants/roles.constants'
import { getStoredAuthSession, type AuthSession } from '../auth/auth-storage'
import { HomePage } from '../pages/HomePage'
import { LoginPhonePage } from '../pages/LoginPhonePage'
import { LoginVerifyPage } from '../pages/LoginVerifyPage'
import { MyAccountPage } from '../pages/MyAccountPage'
import { NewAdCategoryPage } from '../pages/newAd/NewAdCategoryPage'
import { NewAdFlowPage, NewAdLocationPage } from '../pages/newAd/NewAdFlowPage'
import { PublicLandingPage } from '../pages/PublicLandingPage'
import { NotificationsPage } from '../pages/NotificationsPage'
import {
  AccountAboutPage,
  AccountBookmarksPage,
  AccountIdentityPage,
  AccountMyAdsEmptyPage,
  AccountMyAdsPage,
  AccountNotesPage,
  AccountProfilePage,
  AccountRecentViewsPage,
  AccountRequestsPage,
  AccountWalletHistoryPage,
  AccountWalletPage,
} from '../pages/account/AccountSubPages'
import { IndependentConsultantRankingPage } from '../pages/account/IndependentConsultantRankingPage'
import { IndependentConsultantRankingLevelsPage } from '../pages/account/IndependentConsultantRankingLevelsPage'
import { IndependentConsultantBadgesGuidePage } from '../pages/account/IndependentConsultantBadgesGuidePage'
import {
  IndependentConsultantFileBadgePage,
  IndependentConsultantMagnetBadgePage,
  IndependentConsultantResponseBadgePage,
  IndependentConsultantTimeBadgePage,
} from '../pages/account/IndependentConsultantBadgeDetailsPage'
import { IndependentConsultantAdManagementPage } from '../pages/account/IndependentConsultantAdManagementPage'
import { DashboardAdsPage } from '../pages/dashboard/DashboardAdsPage'
import { IndependentConsultantAdAllocationPage } from '../pages/account/adManagement/IndependentConsultantAdAllocationPage'
import { IndependentConsultantAdEditPage } from '../pages/account/adManagement/IndependentConsultantAdEditPage'
import { IndependentConsultantAdFilterPage } from '../pages/account/adManagement/IndependentConsultantAdFilterPage'
import { IndependentConsultantAdPaymentPage } from '../pages/account/adManagement/IndependentConsultantAdPaymentPage'
import { IndependentConsultantAdPublishedPage } from '../pages/account/adManagement/IndependentConsultantAdPublishedPage'
import { IndependentConsultantAdSearchPage } from '../pages/account/adManagement/IndependentConsultantAdSearchPage'
import { IndependentConsultantAdStatisticsDetailsPage } from '../pages/account/adManagement/IndependentConsultantAdStatisticsDetailsPage'
import { IndependentConsultantAdStatisticsPage } from '../pages/account/adManagement/IndependentConsultantAdStatisticsPage'
import {
  IndependentConsultantCreditPackagesPage,
  IndependentConsultantPanelCreditBonusPage,
  IndependentConsultantPanelCreditPage,
} from '../pages/account/credit/IndependentConsultantCreditPage'
import { IndependentConsultantCreditHistoryPage } from '../pages/account/credit/IndependentConsultantCreditHistoryPage'
import {
  DashboardAgencyPage,
  DashboardHomePage,
  DashboardMessagesPage,
  DashboardPaymentsPage,
  DashboardRankingPage,
  DashboardRequestsPage,
  DashboardTeamPage,
} from '../pages/dashboard/DashboardHomePage'
import { SearchMapPage } from '../pages/search/SearchMapPage'
import { SearchMapFilterPage } from '../pages/search/SearchMapFilterPage'
import { UserChatDetailPage, UserChatHomePage, UserChatResponseTimePage } from '../pages/UserChatHomePage'

export const LOGIN_PATH = '/login/phone'
export const DASHBOARD_PATH = '/dashboard'

function AccountRoleRedirect() {
  const session = getStoredAuthSession()
  const role = session?.role ?? null

  useEffect(() => {
    if (role && role !== USER) {
      window.history.replaceState({}, '', DASHBOARD_PATH)
      window.dispatchEvent(new PopStateEvent('popstate'))
    }
  }, [role])

  if (!role) {
    return createElement(MyAccountPage)
  }

  if (role === USER) return createElement(MyAccountPage)

  return null
}

function DashboardRedirect() {
  useEffect(() => {
    window.history.replaceState({}, '', DASHBOARD_PATH)
    window.dispatchEvent(new PopStateEvent('popstate'))
  }, [])

  return null
}

export type AppRoute = {
  authority?: string[]
  layout?: 'dashboard'
  path: string
  requiresAuth?: boolean
  requiresNonUser?: boolean
  title: string
  Component: ComponentType
}

export function canAccessRoute(route: AppRoute, session: AuthSession | null) {
  if (!route.requiresAuth && !route.authority?.length && !route.requiresNonUser) {
    return true
  }

  const role = session?.role ?? null

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
    Component: MyAccountPage,
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
    path: '/account/dashboard',
    title: 'داشبورد',
    Component: DashboardRedirect,
  },
  {
    path: DASHBOARD_PATH,
    title: 'داشبورد',
    Component: DashboardHomePage,
    layout: 'dashboard',
    requiresAuth: true,
    requiresNonUser: true,
  },
  {
    path: '/dashboard/ranking',
    title: 'شناساها و رتبه',
    Component: DashboardRankingPage,
    layout: 'dashboard',
    requiresAuth: true,
    requiresNonUser: true,
  },
  {
    path: '/dashboard/agency',
    title: 'صفحه آژانس',
    Component: DashboardAgencyPage,
    layout: 'dashboard',
    requiresAuth: true,
    requiresNonUser: true,
  },
  {
    path: '/dashboard/ads',
    title: 'مدیریت آگهی‌ها',
    Component: DashboardAdsPage,
    layout: 'dashboard',
    requiresAuth: true,
    requiresNonUser: true,
  },
  {
    path: '/dashboard/requests',
    title: 'درخواست‌ها',
    Component: DashboardRequestsPage,
    authority: ['real_estate_manager', 'independent_consultant'],
    layout: 'dashboard',
    requiresAuth: true,
    requiresNonUser: true,
  },
  {
    path: '/dashboard/team',
    title: 'تیم و مشاوران',
    Component: DashboardTeamPage,
    authority: ['real_estate_manager'],
    layout: 'dashboard',
    requiresAuth: true,
    requiresNonUser: true,
  },
  {
    path: '/dashboard/payments',
    title: 'پرداخت‌ها',
    Component: DashboardPaymentsPage,
    layout: 'dashboard',
    requiresAuth: true,
    requiresNonUser: true,
  },
  {
    path: '/dashboard/messages',
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
  },
  {
    path: "/new-ad/category",
    title: "دسته‌بندی آگهی",
    Component: NewAdCategoryPage,
  },
  {
    path: "/new-ad/personal",
    title: "دسته‌بندی آگهی",
    Component: NewAdCategoryPage,
  },
  {
    path: "/new-ad/category/next",
    title: "ثبت آگهی",
    Component: NewAdFlowPage,
  },
  {
    path: "/new-ad/details",
    title: "ثبت آگهی",
    Component: NewAdFlowPage,
  },
  {
    path: "/new-ad/location",
    title: "موقعیت ملک",
    Component: NewAdLocationPage,
  },
  {
    path: "/new-ad/independent-consultant",
    title: "ثبت آگهی",
    Component: NewAdCategoryPage,
  },
  {
    path: "/new-ad/jaliliyan-agency",
    title: "ثبت آگهی",
    Component: NewAdCategoryPage,
  },
  {
    path: "/notifications",
    title: "اعلان‌ها",
    Component: NotificationsPage,
  },
  {
    path: "/chat",
    title: "چت",
    Component: UserChatHomePage,
  },
  {
    path: "/chat/response-time",
    title: "ساعت پاسخگویی",
    Component: UserChatResponseTimePage,
  },
  {
    path: "/chat/1",
    title: "چت",
    Component: UserChatDetailPage,
  },
  {
    path: "/chat/2",
    title: "چت",
    Component: UserChatDetailPage,
  },
  {
    path: "/chat/3",
    title: "چت",
    Component: UserChatDetailPage,
  },
  {
    path: "/chat/4",
    title: "چت",
    Component: UserChatDetailPage,
  },
  {
    path: "/chat/5",
    title: "چت",
    Component: UserChatDetailPage,
  },
]
