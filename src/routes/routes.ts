import { createElement, lazy, useEffect, type ComponentType, type LazyExoticComponent } from 'react'
import {
  DASHBOARD_ROLES,
  INDEPENDENT_CONSULTANT,
  REAL_ESTATE_CONSULTANT,
  REAL_ESTATE_MANAGER,
  SUPER_ADMIN,
} from '../constants/roles.constants'
import { normalizeAuthRoleSlug, type AuthSession } from '../auth/auth-storage'

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
const PaymentVerifyPage = lazyNamed(() => import('../pages/PaymentVerifyPage'), 'PaymentVerifyPage')
const MyAccountPage = lazyNamed(() => import('../pages/MyAccountPage'), 'MyAccountPage')
const NewAdCategoryPage = lazyNamed(() => import('../pages/newAd/NewAdCategoryPage'), 'NewAdCategoryPage')
const NewAdFlowPage = lazyNamed(() => import('../pages/newAd/NewAdFlowPage'), 'NewAdFlowPage')
const NewAdLocationPage = lazyNamed(() => import('../pages/newAd/NewAdFlowPage'), 'NewAdLocationPage')
const PublicLandingPage = lazyNamed(() => import('../pages/PublicLandingPage'), 'PublicLandingPage')
const CrmPage = lazyNamed(() => import('../pages/crm/CrmPage'), 'CrmPage')
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
const AccountSupportPage = lazyNamed(() => import('../pages/account/AccountSupportPage'), 'AccountSupportPage')
const AccountSupportChatPage = lazyNamed(() => import('../pages/account/AccountSupportPage'), 'AccountSupportChatPage')
const AccountSupportNewChatPage = lazyNamed(() => import('../pages/account/AccountSupportPage'), 'AccountSupportNewChatPage')
const AccountSupportRequestsPage = lazyNamed(() => import('../pages/account/AccountSupportRequestsPage'), 'AccountSupportRequestsPage')
const AccountSupportNewRequestPage = lazyNamed(() => import('../pages/account/AccountSupportRequestsPage'), 'AccountSupportNewRequestPage')
const AccountSupportFaqPage = lazyNamed(() => import('../pages/account/AccountSupportFaqPage'), 'AccountSupportFaqPage')
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
const IndependentConsultantAdFilterPage = lazyNamed(() => import('../pages/account/adManagement/IndependentConsultantAdFilterPage'), 'IndependentConsultantAdFilterPage')
const IndependentConsultantAdPaymentPage = lazyNamed(() => import('../pages/account/adManagement/IndependentConsultantAdPaymentPage'), 'IndependentConsultantAdPaymentPage')
const IndependentConsultantAdPublishedPage = lazyNamed(() => import('../pages/account/adManagement/IndependentConsultantAdPublishedPage'), 'IndependentConsultantAdPublishedPage')
const AdDeleteReasonPage = lazyNamed(() => import('../pages/account/adManagement/AdDeleteReasonPage'), 'AdDeleteReasonPage')
const IndependentConsultantAdSearchPage = lazyNamed(() => import('../pages/account/adManagement/IndependentConsultantAdSearchPage'), 'IndependentConsultantAdSearchPage')
const IndependentConsultantAdStatisticsDetailsPage = lazyNamed(() => import('../pages/account/adManagement/IndependentConsultantAdStatisticsDetailsPage'), 'IndependentConsultantAdStatisticsDetailsPage')
const IndependentConsultantAdStatisticsPage = lazyNamed(() => import('../pages/account/adManagement/IndependentConsultantAdStatisticsPage'), 'IndependentConsultantAdStatisticsPage')
const IndependentConsultantCreditPackagesPage = lazyNamed(() => import('../pages/account/credit/IndependentConsultantCreditPage'), 'IndependentConsultantCreditPackagesPage')
const IndependentConsultantPanelCreditBonusPage = lazyNamed(() => import('../pages/account/credit/IndependentConsultantCreditPage'), 'IndependentConsultantPanelCreditBonusPage')
const IndependentConsultantPanelCreditPage = lazyNamed(() => import('../pages/account/credit/IndependentConsultantCreditPage'), 'IndependentConsultantPanelCreditPage')
const IndependentConsultantCreditHistoryPage = lazyNamed(() => import('../pages/account/credit/IndependentConsultantCreditHistoryPage'), 'IndependentConsultantCreditHistoryPage')
const DashboardAgencyPage = lazyNamed(() => import('../pages/dashboard/DashboardHomePage'), 'DashboardAgencyPage')
const DashboardAgentPage = lazyNamed(() => import('../pages/dashboard/AgentProfilePage'), 'AgentProfilePage')
const DashboardAgencyPreviewPage = lazyNamed(() => import('../pages/dashboard/AgencyPreviewPage'), 'AgencyPreviewPage')
const DashboardAgencyQrCodePage = lazyNamed(() => import('../pages/dashboard/AgencyPreviewPage'), 'AgencyQrCodePage')
const DashboardAddConsultantPage = lazyNamed(() => import('../pages/dashboard/DashboardHomePage'), 'DashboardAddConsultantPage')
const DashboardConsultantEditPage = lazyNamed(() => import('../pages/dashboard/DashboardHomePage'), 'DashboardConsultantEditPage')
const DashboardConsultantInfoPage = lazyNamed(() => import('../pages/dashboard/DashboardHomePage'), 'DashboardConsultantInfoPage')
const DashboardConsultantRemovePage = lazyNamed(() => import('../pages/dashboard/DashboardHomePage'), 'DashboardConsultantRemovePage')
const DashboardHomePage = lazyNamed(() => import('../pages/dashboard/DashboardHomePage'), 'DashboardHomePage')
const DashboardPaymentsPage = lazyNamed(() => import('../pages/dashboard/DashboardHomePage'), 'DashboardPaymentsPage')
const DashboardRankingPage = lazyNamed(() => import('../pages/dashboard/DashboardRankingPage'), 'DashboardRankingPage')
const DashboardBadgesGuidePage = lazyNamed(() => import('../pages/dashboard/DashboardBadgesGuidePage'), 'DashboardBadgesGuidePage')
const DashboardRankingLevelsGuidePage = lazyNamed(() => import('../pages/dashboard/DashboardRankingLevelsGuidePage'), 'DashboardRankingLevelsGuidePage')
const DashboardRecordHolderBadgePage = lazyNamed(() => import('../pages/dashboard/DashboardBadgeDetailsPage'), 'DashboardRecordHolderBadgePage')
const DashboardGoldenTeamBadgePage = lazyNamed(() => import('../pages/dashboard/DashboardBadgeDetailsPage'), 'DashboardGoldenTeamBadgePage')
const DashboardPopularBadgePage = lazyNamed(() => import('../pages/dashboard/DashboardBadgeDetailsPage'), 'DashboardPopularBadgePage')
const DashboardFastTeamBadgePage = lazyNamed(() => import('../pages/dashboard/DashboardBadgeDetailsPage'), 'DashboardFastTeamBadgePage')
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
export const CRM_PATH = '/crm'
export const LEGACY_DASHBOARD_PATH = '/dashboard'

function LoginRedirect() {
  useEffect(() => {
    window.history.replaceState({}, '', LOGIN_PATH)
    window.dispatchEvent(new PopStateEvent('popstate'))
  }, [])

  return null
}

function DashboardMessagesRedirect() {
  useEffect(() => {
    window.history.replaceState({}, '', '/chat')
    window.dispatchEvent(new PopStateEvent('popstate'))
  }, [])

  return null
}

function AccountRoleRedirect() {
  return createElement(MyAccountPage)
}

export type AppRoute = {
  authority?: string[]
  layout?: 'crm' | 'dashboard'
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

  if (!session) return false

  const activeRole = normalizeAuthRoleSlug(session.activeRole ?? session.role)

  if (route.requiresNonUser && !DASHBOARD_ROLES.some((role) => role === activeRole)) {
    return false
  }

  if (route.authority?.length) {
    if (route.layout === 'crm' && route.authority.includes(SUPER_ADMIN)) {
      return (
        activeRole === SUPER_ADMIN ||
        session.roles.some((role) => normalizeAuthRoleSlug(role.slug ?? role.name) === SUPER_ADMIN)
      )
    }

    return route.authority.includes(activeRole)
  }

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
    path: '/verify',
    title: 'نتیجه پرداخت',
    Component: PaymentVerifyPage,
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
    title: 'تاریخچه پرداخت',
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
    path: '/account/support',
    title: 'پشتیبانی',
    Component: AccountSupportPage,
    requiresAuth: true,
  },
  {
    path: '/account/support/chat',
    title: 'گفتگو با پشتیبانی',
    Component: AccountSupportChatPage,
    requiresAuth: true,
  },
  {
    path: '/account/support/chat/new',
    title: 'شروع گفتگوی جدید',
    Component: AccountSupportNewChatPage,
    requiresAuth: true,
  },
  {
    path: '/account/support/requests',
    title: 'درخواست‌های من',
    Component: AccountSupportRequestsPage,
    requiresAuth: true,
  },
  {
    path: '/account/support/requests/new',
    title: 'ایجاد درخواست',
    Component: AccountSupportNewRequestPage,
    requiresAuth: true,
  },
  {
    path: '/account/support/faq',
    title: 'سوالات متداول',
    Component: AccountSupportFaqPage,
    requiresAuth: true,
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
    requiresAuth: true,
  },
  {
    path: '/account/business/create/agency',
    title: 'ایجاد کسب و کار',
    Component: AgencyBusinessCreationPage,
    requiresAuth: true,
  },
  {
    path: '/account/business/create/consultant',
    title: 'ایجاد کسب و کار',
    Component: IndependentConsultantBusinessCreationPage,
    requiresAuth: true,
  },
  {
    path: '/account/business/create/info',
    title: 'معرفی کسب و کار',
    Component: BusinessInfoPage,
    requiresAuth: true,
  },
  {
    path: CRM_PATH,
    title: 'مرکز مدیریت کل',
    Component: CrmPage,
    authority: [SUPER_ADMIN],
    layout: 'crm',
    requiresAuth: true,
  },
  {
    path: `${CRM_PATH}/advertises`,
    title: 'مدیریت آگهی‌ها',
    Component: CrmPage,
    authority: [SUPER_ADMIN],
    layout: 'crm',
    requiresAuth: true,
  },
  {
    path: `${CRM_PATH}/users`,
    title: 'مدیریت کاربران',
    Component: CrmPage,
    authority: [SUPER_ADMIN],
    layout: 'crm',
    requiresAuth: true,
  },
  {
    path: `${CRM_PATH}/consultants`,
    title: 'مدیریت مشاورین',
    Component: CrmPage,
    authority: [SUPER_ADMIN],
    layout: 'crm',
    requiresAuth: true,
  },
  {
    path: `${CRM_PATH}/agencies`,
    title: 'مدیریت آژانس‌ها',
    Component: CrmPage,
    authority: [SUPER_ADMIN],
    layout: 'crm',
    requiresAuth: true,
  },
  {
    path: `${CRM_PATH}/categories`,
    title: 'دسته‌بندی‌ها',
    Component: CrmPage,
    authority: [SUPER_ADMIN],
    layout: 'crm',
    requiresAuth: true,
  },
  {
    path: `${CRM_PATH}/locations`,
    title: 'مدیریت موقعیت‌ها',
    Component: CrmPage,
    authority: [SUPER_ADMIN],
    layout: 'crm',
    requiresAuth: true,
  },
  {
    path: `${CRM_PATH}/forms`,
    title: 'فرم‌های آگهی',
    Component: CrmPage,
    authority: [SUPER_ADMIN],
    layout: 'crm',
    requiresAuth: true,
  },
  {
    path: `${CRM_PATH}/packages`,
    title: 'بسته‌ها و اعتبار پنل',
    Component: CrmPage,
    authority: [SUPER_ADMIN],
    layout: 'crm',
    requiresAuth: true,
  },
  {
    path: `${CRM_PATH}/payments`,
    title: 'تاریخچه پرداخت‌ها',
    Component: CrmPage,
    authority: [SUPER_ADMIN],
    layout: 'crm',
    requiresAuth: true,
  },
  {
    path: `${CRM_PATH}/costs`,
    title: 'مدیریت هزینه‌ها',
    Component: CrmPage,
    authority: [SUPER_ADMIN],
    layout: 'crm',
    requiresAuth: true,
  },
  {
    path: `${CRM_PATH}/reports`,
    title: 'گزارش‌های تخلف',
    Component: CrmPage,
    authority: [SUPER_ADMIN],
    layout: 'crm',
    requiresAuth: true,
  },
  {
    path: `${CRM_PATH}/requests`,
    title: 'درخواست‌های پشتیبانی',
    Component: CrmPage,
    authority: [SUPER_ADMIN],
    layout: 'crm',
    requiresAuth: true,
  },
  {
    path: `${CRM_PATH}/property-requests`,
    title: 'درخواست‌های یافتن آگهی',
    Component: CrmPage,
    authority: [SUPER_ADMIN],
    layout: 'crm',
    requiresAuth: true,
  },
  {
    path: `${CRM_PATH}/support`,
    title: 'پشتیبانی',
    Component: CrmPage,
    authority: [SUPER_ADMIN],
    layout: 'crm',
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
    title: 'نشان‌ها و رتبه',
    Component: DashboardRankingPage,
    layout: 'dashboard',
    requiresAuth: true,
    requiresNonUser: true,
  },
  {
    path: `${DASHBOARD_PATH}/ranking/levels/guide`,
    title: 'سطح پیشرفت آژانس',
    Component: DashboardRankingLevelsGuidePage,
    layout: 'dashboard',
    requiresAuth: true,
    requiresNonUser: true,
  },
  {
    path: `${DASHBOARD_PATH}/ranking/badges/guide`,
    title: 'راهنمای نشان‌ها',
    Component: DashboardBadgesGuidePage,
    layout: 'dashboard',
    requiresAuth: true,
    requiresNonUser: true,
  },
  {
    path: `${DASHBOARD_PATH}/ranking/badges/record-holder`,
    title: 'جزئیات نشان',
    Component: DashboardRecordHolderBadgePage,
    layout: 'dashboard',
    requiresAuth: true,
    requiresNonUser: true,
  },
  {
    path: `${DASHBOARD_PATH}/ranking/badges/golden-team`,
    title: 'جزئیات نشان',
    Component: DashboardGoldenTeamBadgePage,
    layout: 'dashboard',
    requiresAuth: true,
    requiresNonUser: true,
  },
  {
    path: `${DASHBOARD_PATH}/ranking/badges/popular`,
    title: 'جزئیات نشان',
    Component: DashboardPopularBadgePage,
    layout: 'dashboard',
    requiresAuth: true,
    requiresNonUser: true,
  },
  {
    path: `${DASHBOARD_PATH}/ranking/badges/fast-team`,
    title: 'جزئیات نشان',
    Component: DashboardFastTeamBadgePage,
    layout: 'dashboard',
    requiresAuth: true,
    requiresNonUser: true,
  },
  {
    path: `${DASHBOARD_PATH}/agency`,
    title: 'صفحه آژانس',
    Component: DashboardAgencyPage,
    authority: [REAL_ESTATE_MANAGER],
    layout: 'dashboard',
    requiresAuth: true,
    requiresNonUser: true,
  },
  {
    path: `${DASHBOARD_PATH}/agent`,
    title: 'صفحه مشاور',
    Component: DashboardAgentPage,
    authority: [REAL_ESTATE_CONSULTANT, INDEPENDENT_CONSULTANT],
    layout: 'dashboard',
    requiresAuth: true,
    requiresNonUser: true,
  },
  {
    path: `${DASHBOARD_PATH}/agency/preview`,
    title: 'صفحه آژانس',
    Component: DashboardAgencyPreviewPage,
    requiresAuth: true,
    requiresNonUser: true,
  },
  {
    path: `${DASHBOARD_PATH}/agency/preview/qr-code`,
    title: 'کیوآرکد آژانس',
    Component: DashboardAgencyQrCodePage,
    requiresAuth: true,
    requiresNonUser: true,
  },
  {
    path: `${DASHBOARD_PATH}/agency/preview/filter`,
    title: 'فیلتر آگهی‌ها',
    Component: SearchMapFilterPage,
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
    path: `${DASHBOARD_PATH}/team/info`,
    title: 'اطلاعات مشاور',
    Component: DashboardConsultantInfoPage,
    authority: ['real_estate_manager'],
    layout: 'dashboard',
    requiresAuth: true,
    requiresNonUser: true,
  },
  {
    path: `${DASHBOARD_PATH}/team/edit`,
    title: 'ویرایش اطلاعات',
    Component: DashboardConsultantEditPage,
    authority: ['real_estate_manager'],
    layout: 'dashboard',
    requiresAuth: true,
    requiresNonUser: true,
  },
  {
    path: `${DASHBOARD_PATH}/team/remove`,
    title: 'حذف مشاور',
    Component: DashboardConsultantRemovePage,
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
    Component: DashboardMessagesRedirect,
    layout: 'dashboard',
    requiresAuth: true,
    requiresNonUser: true,
  },
  {
    path: '/account/ranking',
    title: 'نشان‌ها و رتبه',
    Component: IndependentConsultantRankingPage,
    authority: [INDEPENDENT_CONSULTANT],
    requiresAuth: true,
  },
  {
    path: '/account/ranking/levels',
    title: 'سطح پیشرفت مشاور',
    Component: IndependentConsultantRankingLevelsPage,
    authority: [INDEPENDENT_CONSULTANT],
    requiresAuth: true,
  },
  {
    path: '/account/ranking/badges/guide',
    title: 'راهنمای نشان‌ها',
    Component: IndependentConsultantBadgesGuidePage,
    authority: [INDEPENDENT_CONSULTANT],
    requiresAuth: true,
  },
  {
    path: '/account/ranking/badges/file',
    title: 'جزئیات نشان',
    Component: IndependentConsultantFileBadgePage,
    authority: [INDEPENDENT_CONSULTANT],
    requiresAuth: true,
  },
  {
    path: '/account/ranking/badges/magnet',
    title: 'جزئیات نشان',
    Component: IndependentConsultantMagnetBadgePage,
    authority: [INDEPENDENT_CONSULTANT],
    requiresAuth: true,
  },
  {
    path: '/account/ranking/badges/response',
    title: 'جزئیات نشان',
    Component: IndependentConsultantResponseBadgePage,
    authority: [INDEPENDENT_CONSULTANT],
    requiresAuth: true,
  },
  {
    path: '/account/ranking/badges/time',
    title: 'جزئیات نشان',
    Component: IndependentConsultantTimeBadgePage,
    authority: [INDEPENDENT_CONSULTANT],
    requiresAuth: true,
  },
  {
    path: '/account/manage-ads',
    title: 'مدیریت آگهی‌ها',
    Component: IndependentConsultantAdManagementPage,
    authority: DASHBOARD_ROLES,
    requiresAuth: true,
  },
  {
    path: '/account/ad-management',
    title: 'مدیریت آگهی‌ها',
    Component: IndependentConsultantAdManagementPage,
    authority: DASHBOARD_ROLES,
    requiresAuth: true,
  },
  {
    path: '/account/ad-management/filter',
    title: 'فیلتر',
    Component: IndependentConsultantAdFilterPage,
    authority: DASHBOARD_ROLES,
    requiresAuth: true,
  },
  {
    path: '/account/ad-management/search',
    title: 'جستجوی آگهی',
    Component: IndependentConsultantAdSearchPage,
    authority: DASHBOARD_ROLES,
    requiresAuth: true,
  },
  {
    path: '/account/ad-management/allocation',
    title: 'انتشار آگهی',
    Component: IndependentConsultantAdAllocationPage,
    authority: DASHBOARD_ROLES,
    requiresAuth: true,
  },
  {
    path: '/account/ad-management/allocation-review',
    title: 'بررسی و تخصیص',
    Component: IndependentConsultantAdAllocationReviewPage,
    authority: DASHBOARD_ROLES,
    requiresAuth: true,
  },
  {
    path: '/account/ad-management/payment',
    title: 'انتشار آگهی',
    Component: IndependentConsultantAdPaymentPage,
    authority: DASHBOARD_ROLES,
    requiresAuth: true,
  },
  {
    path: '/account/ad-management/published',
    title: 'مدیریت آگهی',
    Component: IndependentConsultantAdPublishedPage,
    authority: DASHBOARD_ROLES,
    requiresAuth: true,
  },
  {
    path: '/account/ad-management/published/edit',
    title: 'ویرایش آگهی',
    Component: NewAdFlowPage,
    requiresAuth: true,
  },
  {
    path: '/account/ad-management/delete',
    title: 'حذف آگهی',
    Component: AdDeleteReasonPage,
    requiresAuth: true,
  },
  {
    path: '/account/ad-management/statistics',
    title: 'آمار آگهی‌ها',
    Component: IndependentConsultantAdStatisticsPage,
    authority: DASHBOARD_ROLES,
    requiresAuth: true,
  },
  {
    path: '/account/ad-management/statistics/details',
    title: 'جزئیات آمار آگهی',
    Component: IndependentConsultantAdStatisticsDetailsPage,
    authority: DASHBOARD_ROLES,
    requiresAuth: true,
  },
  {
    path: '/account/credit/panel',
    title: 'افزایش اعتبار',
    Component: IndependentConsultantPanelCreditPage,
    authority: DASHBOARD_ROLES,
    requiresAuth: true,
  },
  {
    path: '/account/credit/panel/bonus',
    title: 'افزایش اعتبار',
    Component: IndependentConsultantPanelCreditBonusPage,
    authority: [REAL_ESTATE_MANAGER],
    requiresAuth: true,
  },
  {
    path: '/account/credit/packages',
    title: 'افزایش اعتبار',
    Component: IndependentConsultantCreditPackagesPage,
    authority: DASHBOARD_ROLES,
    requiresAuth: true,
  },
  {
    path: '/account/credit/history',
    title: 'تاریخچه پرداخت',
    Component: IndependentConsultantCreditHistoryPage,
    authority: DASHBOARD_ROLES,
    requiresAuth: true,
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
