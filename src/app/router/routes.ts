import { createElement, lazy, useEffect, type ComponentType, type LazyExoticComponent } from 'react'
import {
  CRM_ADVERTISE_ROLES,
  CRM_FINANCE_ROLES,
  CRM_PANEL_ROLES,
  CRM_SUPPORT_ROLES,
  DASHBOARD_ROLES,
  INDEPENDENT_CONSULTANT,
  REAL_ESTATE_CONSULTANT,
  REAL_ESTATE_MANAGER,
  SUPER_ADMIN,
} from '../../shared/constants/roles.constants'
import { normalizeAuthRoleSlug, type AuthSession } from '../../core/auth/auth-storage'

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

const HomePage = lazyNamed(() => import('../../pages/home/HomePage'), 'HomePage')
const LoginPhonePage = lazyNamed(() => import('../../pages/auth/LoginPhonePage'), 'LoginPhonePage')
const LoginRequiredPage = lazyNamed(() => import('../../pages/auth/LoginRequiredPage'), 'LoginRequiredPage')
const LoginVerifyPage = lazyNamed(() => import('../../pages/auth/LoginVerifyPage'), 'LoginVerifyPage')
const PaymentVerifyPage = lazyNamed(() => import('../../pages/payment/PaymentVerifyPage'), 'PaymentVerifyPage')
const AccessDeniedPage = lazyNamed(() => import('../../pages/system/AccessDeniedPage'), 'AccessDeniedPage')
const MyAccountPage = lazyNamed(() => import('../../pages/account/MyAccountPage'), 'MyAccountPage')
const NewAdCategoryPage = lazyNamed(() => import('../../pages/newAd/NewAdCategoryPage'), 'NewAdCategoryPage')
const NewAdFlowPage = lazyNamed(() => import('../../pages/newAd/NewAdFlowPage'), 'NewAdFlowPage')
const NewAdLocationPage = lazyNamed(() => import('../../pages/newAd/NewAdFlowPage'), 'NewAdLocationPage')
const PublicLandingPage = lazyNamed(() => import('../../pages/publicLanding/PublicLandingPage'), 'PublicLandingPage')
const CrmOverviewPage = lazyNamed(() => import('../../pages/crm/routes/CrmOverviewPage'), 'CrmOverviewPage')
const CrmAdvertisesPage = lazyNamed(() => import('../../pages/crm/routes/CrmAdvertisesPage'), 'CrmAdvertisesPage')
const CrmUsersPage = lazyNamed(() => import('../../pages/crm/routes/CrmUsersPage'), 'CrmUsersPage')
const CrmConsultantsPage = lazyNamed(() => import('../../pages/crm/routes/CrmConsultantsPage'), 'CrmConsultantsPage')
const CrmAgenciesPage = lazyNamed(() => import('../../pages/crm/routes/CrmAgenciesPage'), 'CrmAgenciesPage')
const CrmCategoriesPage = lazyNamed(() => import('../../pages/crm/routes/CrmCategoriesPage'), 'CrmCategoriesPage')
const CrmLocationsPage = lazyNamed(() => import('../../pages/crm/routes/CrmLocationsPage'), 'CrmLocationsPage')
const CrmLocationMapPage = lazyNamed(() => import('../../pages/crm/routes/CrmLocationMapPage'), 'CrmLocationMapPage')
const CrmFormsPage = lazyNamed(() => import('../../pages/crm/routes/CrmFormsPage'), 'CrmFormsPage')
const CrmPackagesPage = lazyNamed(() => import('../../pages/crm/routes/CrmPackagesPage'), 'CrmPackagesPage')
const CrmPaymentsPage = lazyNamed(() => import('../../pages/crm/routes/CrmPaymentsPage'), 'CrmPaymentsPage')
const CrmCostsPage = lazyNamed(() => import('../../pages/crm/routes/CrmCostsPage'), 'CrmCostsPage')
const CrmReportsPage = lazyNamed(() => import('../../pages/crm/routes/CrmReportsPage'), 'CrmReportsPage')
const CrmSupportRequestsPage = lazyNamed(() => import('../../pages/crm/routes/CrmSupportRequestsPage'), 'CrmSupportRequestsPage')
const CrmPropertyRequestsPage = lazyNamed(() => import('../../pages/crm/routes/CrmPropertyRequestsPage'), 'CrmPropertyRequestsPage')
const CrmSupportPage = lazyNamed(() => import('../../pages/crm/routes/CrmSupportPage'), 'CrmSupportPage')
const NotificationsPage = lazyNamed(() => import('../../pages/notifications/NotificationsPage'), 'NotificationsPage')
const NotificationManagementPage = lazyNamed(() => import('../../pages/notifications/NotificationsPage'), 'NotificationManagementPage')
const AccountAboutPage = lazyNamed(() => import('../../pages/account/routes/AccountAboutPage'), 'AccountAboutPage')
const AccountBookmarksPage = lazyNamed(() => import('../../pages/account/routes/AccountBookmarksPage'), 'AccountBookmarksPage')
const AccountDeleteUserPage = lazyNamed(() => import('../../pages/account/AccountDeleteUserPage'), 'AccountDeleteUserPage')
const AccountIdentityPage = lazyNamed(() => import('../../pages/account/routes/AccountIdentityPage'), 'AccountIdentityPage')
const AccountMyAdsEmptyPage = lazyNamed(() => import('../../pages/account/routes/AccountMyAdsEmptyPage'), 'AccountMyAdsEmptyPage')
const AccountMyAdsPage = lazyNamed(() => import('../../pages/account/routes/AccountMyAdsPage'), 'AccountMyAdsPage')
const AccountNotesPage = lazyNamed(() => import('../../pages/account/routes/AccountNotesPage'), 'AccountNotesPage')
const AccountProfilePage = lazyNamed(() => import('../../pages/account/routes/AccountProfilePage'), 'AccountProfilePage')
const AccountRecentViewsPage = lazyNamed(() => import('../../pages/account/routes/AccountRecentViewsPage'), 'AccountRecentViewsPage')
const AccountRequestsPage = lazyNamed(() => import('../../pages/account/routes/AccountRequestsPage'), 'AccountRequestsPage')
const AccountSupportPage = lazyNamed(() => import('../../pages/account/routes/AccountSupportPage'), 'AccountSupportPage')
const AccountSupportChatPage = lazyNamed(() => import('../../pages/account/routes/AccountSupportChatPage'), 'AccountSupportChatPage')
const AccountSupportNewChatPage = lazyNamed(() => import('../../pages/account/routes/AccountSupportNewChatPage'), 'AccountSupportNewChatPage')
const AccountSupportRequestsPage = lazyNamed(() => import('../../pages/account/routes/AccountSupportRequestsPage'), 'AccountSupportRequestsPage')
const AccountSupportNewRequestPage = lazyNamed(() => import('../../pages/account/routes/AccountSupportNewRequestPage'), 'AccountSupportNewRequestPage')
const AccountSupportFaqPage = lazyNamed(() => import('../../pages/account/AccountSupportFaqPage'), 'AccountSupportFaqPage')
const AccountWalletHistoryPage = lazyNamed(() => import('../../pages/account/routes/AccountWalletHistoryPage'), 'AccountWalletHistoryPage')
const AccountWalletPage = lazyNamed(() => import('../../pages/account/routes/AccountWalletPage'), 'AccountWalletPage')
const IndependentConsultantRankingPage = lazyNamed(() => import('../../pages/account/IndependentConsultantRankingPage'), 'IndependentConsultantRankingPage')
const IndependentConsultantRankingLevelsPage = lazyNamed(() => import('../../pages/account/IndependentConsultantRankingLevelsPage'), 'IndependentConsultantRankingLevelsPage')
const IndependentConsultantBadgesGuidePage = lazyNamed(() => import('../../pages/account/IndependentConsultantBadgesGuidePage'), 'IndependentConsultantBadgesGuidePage')
const IndependentConsultantFileBadgePage = lazyNamed(() => import('../../pages/account/routes/IndependentConsultantFileBadgePage'), 'IndependentConsultantFileBadgePage')
const IndependentConsultantMagnetBadgePage = lazyNamed(() => import('../../pages/account/routes/IndependentConsultantMagnetBadgePage'), 'IndependentConsultantMagnetBadgePage')
const IndependentConsultantResponseBadgePage = lazyNamed(() => import('../../pages/account/routes/IndependentConsultantResponseBadgePage'), 'IndependentConsultantResponseBadgePage')
const IndependentConsultantTimeBadgePage = lazyNamed(() => import('../../pages/account/routes/IndependentConsultantTimeBadgePage'), 'IndependentConsultantTimeBadgePage')
const IndependentConsultantAdManagementPage = lazyNamed(() => import('../../pages/account/IndependentConsultantAdManagementPage'), 'IndependentConsultantAdManagementPage')
const DashboardAdsPage = lazyNamed(() => import('../../pages/dashboard/DashboardAdsPage'), 'DashboardAdsPage')
const IndependentConsultantAdAllocationPage = lazyNamed(() => import('../../pages/account/adManagement/IndependentConsultantAdAllocationPage'), 'IndependentConsultantAdAllocationPage')
const IndependentConsultantAdAllocationReviewPage = lazyNamed(() => import('../../pages/account/adManagement/IndependentConsultantAdAllocationReviewPage'), 'IndependentConsultantAdAllocationReviewPage')
const IndependentConsultantAdFilterPage = lazyNamed(() => import('../../pages/account/adManagement/IndependentConsultantAdFilterPage'), 'IndependentConsultantAdFilterPage')
const IndependentConsultantAdPaymentPage = lazyNamed(() => import('../../pages/account/adManagement/IndependentConsultantAdPaymentPage'), 'IndependentConsultantAdPaymentPage')
const IndependentConsultantAdPublishedPage = lazyNamed(() => import('../../pages/account/adManagement/IndependentConsultantAdPublishedPage'), 'IndependentConsultantAdPublishedPage')
const AdDeleteReasonPage = lazyNamed(() => import('../../pages/account/adManagement/AdDeleteReasonPage'), 'AdDeleteReasonPage')
const IndependentConsultantAdSearchPage = lazyNamed(() => import('../../pages/account/adManagement/IndependentConsultantAdSearchPage'), 'IndependentConsultantAdSearchPage')
const IndependentConsultantAdStatisticsDetailsPage = lazyNamed(() => import('../../pages/account/adManagement/IndependentConsultantAdStatisticsDetailsPage'), 'IndependentConsultantAdStatisticsDetailsPage')
const IndependentConsultantAdStatisticsPage = lazyNamed(() => import('../../pages/account/adManagement/IndependentConsultantAdStatisticsPage'), 'IndependentConsultantAdStatisticsPage')
const IndependentConsultantCreditPackagesPage = lazyNamed(() => import('../../pages/account/routes/IndependentConsultantCreditPackagesPage'), 'IndependentConsultantCreditPackagesPage')
const IndependentConsultantPanelCreditBonusPage = lazyNamed(() => import('../../pages/account/routes/IndependentConsultantPanelCreditBonusPage'), 'IndependentConsultantPanelCreditBonusPage')
const IndependentConsultantPanelCreditPage = lazyNamed(() => import('../../pages/account/routes/IndependentConsultantPanelCreditPage'), 'IndependentConsultantPanelCreditPage')
const IndependentConsultantCreditHistoryPage = lazyNamed(() => import('../../pages/account/credit/IndependentConsultantCreditHistoryPage'), 'IndependentConsultantCreditHistoryPage')
const DashboardAgencyPage = lazyNamed(() => import('../../pages/dashboard/DashboardHomePage'), 'DashboardAgencyPage')
const DashboardAgentPage = lazyNamed(() => import('../../pages/dashboard/AgentProfilePage'), 'AgentProfilePage')
const DashboardAgencyPreviewPage = lazyNamed(() => import('../../pages/dashboard/AgencyPreviewPage'), 'AgencyPreviewPage')
const DashboardAgencyQrCodePage = lazyNamed(() => import('../../pages/dashboard/AgencyPreviewPage'), 'AgencyQrCodePage')
const DashboardAddConsultantPage = lazyNamed(() => import('../../pages/dashboard/DashboardHomePage'), 'DashboardAddConsultantPage')
const DashboardConsultantEditPage = lazyNamed(() => import('../../pages/dashboard/DashboardHomePage'), 'DashboardConsultantEditPage')
const DashboardConsultantInfoPage = lazyNamed(() => import('../../pages/dashboard/DashboardHomePage'), 'DashboardConsultantInfoPage')
const DashboardConsultantRemovePage = lazyNamed(() => import('../../pages/dashboard/DashboardHomePage'), 'DashboardConsultantRemovePage')
const DashboardHomePage = lazyNamed(() => import('../../pages/dashboard/DashboardHomePage'), 'DashboardHomePage')
const DashboardPaymentsPage = lazyNamed(() => import('../../pages/dashboard/DashboardHomePage'), 'DashboardPaymentsPage')
const DashboardRankingPage = lazyNamed(() => import('../../pages/dashboard/DashboardRankingPage'), 'DashboardRankingPage')
const DashboardBadgesGuidePage = lazyNamed(() => import('../../pages/dashboard/DashboardBadgesGuidePage'), 'DashboardBadgesGuidePage')
const DashboardRankingLevelsGuidePage = lazyNamed(() => import('../../pages/dashboard/DashboardRankingLevelsGuidePage'), 'DashboardRankingLevelsGuidePage')
const DashboardRecordHolderBadgePage = lazyNamed(() => import('../../pages/dashboard/DashboardBadgeDetailsPage'), 'DashboardRecordHolderBadgePage')
const DashboardGoldenTeamBadgePage = lazyNamed(() => import('../../pages/dashboard/DashboardBadgeDetailsPage'), 'DashboardGoldenTeamBadgePage')
const DashboardPopularBadgePage = lazyNamed(() => import('../../pages/dashboard/DashboardBadgeDetailsPage'), 'DashboardPopularBadgePage')
const DashboardFastTeamBadgePage = lazyNamed(() => import('../../pages/dashboard/DashboardBadgeDetailsPage'), 'DashboardFastTeamBadgePage')
const DashboardRequestsPage = lazyNamed(() => import('../../pages/dashboard/DashboardHomePage'), 'DashboardRequestsPage')
const DashboardTeamPage = lazyNamed(() => import('../../pages/dashboard/DashboardHomePage'), 'DashboardTeamPage')
const SearchMapPage = lazyNamed(() => import('../../pages/search/SearchMapPage'), 'SearchMapPage')
const SearchMapFilterPage = lazyNamed(() => import('../../pages/search/SearchMapFilterPage'), 'SearchMapFilterPage')
const UserChatDetailPage = lazyNamed(() => import('../../pages/chat/UserChatHomePage'), 'UserChatDetailPage')
const UserChatHomePage = lazyNamed(() => import('../../pages/chat/UserChatHomePage'), 'UserChatHomePage')
const UserChatBulkDeletePage = lazyNamed(() => import('../../pages/chat/UserChatHomePage'), 'UserChatBulkDeletePage')
const UserChatResponseTimePage = lazyNamed(() => import('../../pages/chat/UserChatHomePage'), 'UserChatResponseTimePage')
const UserChatRenamePage = lazyNamed(() => import('../../pages/chat/UserChatHomePage'), 'UserChatRenamePage')
const ConsultantsDirectoryPage = lazyNamed(() => import('../../pages/consultants/ConsultantsDirectoryPage'), 'ConsultantsDirectoryPage')
const ConsultantsNeighborhoodPage = lazyNamed(
  () => import('../../pages/consultants/ConsultantsNeighborhoodPage'),
  'ConsultantsNeighborhoodPage',
)
const AgencyBusinessCreationPage = lazyNamed(() => import('../../pages/account/routes/AgencyBusinessCreationPage'), 'AgencyBusinessCreationPage')
const AgencyNeighborhoodSelectionPage = lazyNamed(() => import('../../pages/account/routes/AgencyNeighborhoodSelectionPage'), 'AgencyNeighborhoodSelectionPage')
const BusinessCreationPage = lazyNamed(() => import('../../pages/account/routes/BusinessCreationPage'), 'BusinessCreationPage')
const BusinessInfoPage = lazyNamed(() => import('../../pages/account/routes/BusinessInfoPage'), 'BusinessInfoPage')
const IndependentConsultantBusinessCreationPage = lazyNamed(() => import('../../pages/account/routes/IndependentConsultantBusinessCreationPage'), 'IndependentConsultantBusinessCreationPage')

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
  crmSection?: 'overview' | 'advertises' | 'users' | 'consultants' | 'agencies' | 'categories' | 'locations' | 'forms' | 'packages' | 'payments' | 'costs' | 'reports' | 'requests' | 'propertyRequests' | 'support'
  layout?: 'crm' | 'dashboard'
  path: string
  placeholderNote?: string
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
    if (route.layout === 'dashboard' || route.path.startsWith(`${DASHBOARD_PATH}/`)) {
      return route.authority.includes(activeRole)
    }

    const sessionRoles = getSessionRoleSlugs(session)
    return route.authority.some((role) => sessionRoles.includes(role))
  }

  return true
}

export function getSessionRoleSlugs(session: AuthSession | null) {
  if (!session) return []

  const roles: string[] = [
    normalizeAuthRoleSlug(session.activeRole ?? session.role),
    normalizeAuthRoleSlug(session.role),
    ...session.roles.map((role) => normalizeAuthRoleSlug(role.slug ?? role.name)),
  ]

  return Array.from(new Set(roles))
}

export function getDefaultCrmPath(session: AuthSession | null) {
  if (!session) return CRM_PATH

  const priorityPaths = [
    `${CRM_PATH}/advertises`,
    `${CRM_PATH}/payments`,
    `${CRM_PATH}/requests`,
  ]
  const priorityRoute = priorityPaths
    .map((path) => routes.find((candidate) => candidate.path === path))
    .find((candidate): candidate is AppRoute =>
      Boolean(candidate && canAccessRoute(candidate, session)),
    )
  const route = priorityRoute ?? routes.find(
    (candidate) =>
      candidate.layout === 'crm' &&
      candidate.path !== CRM_PATH &&
      canAccessRoute(candidate, session),
  )

  return route?.path ?? CRM_PATH
}

const dashboardHomePlaceholderNote = 'Intentional dashboard placeholder: route currently reuses DashboardHomePage until a dedicated dashboard screen is implemented.'

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
    path: '/403',
    title: 'دسترسی غیرمجاز',
    Component: AccessDeniedPage,
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
    path: '/support/chat',
    title: 'گفتگو با پشتیبانی',
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
    path: '/account/business/create/agency/neighborhoods',
    title: 'انتخاب محدوده فعالیت',
    Component: AgencyNeighborhoodSelectionPage,
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
    Component: CrmOverviewPage,
    crmSection: 'overview',
    authority: CRM_PANEL_ROLES,
    layout: 'crm',
    requiresAuth: true,
  },
  {
    path: `${CRM_PATH}/advertises`,
    title: 'مدیریت آگهی‌ها',
    Component: CrmAdvertisesPage,
    crmSection: 'advertises',
    authority: CRM_ADVERTISE_ROLES,
    layout: 'crm',
    requiresAuth: true,
  },
  {
    path: `${CRM_PATH}/users`,
    title: 'مدیریت کاربران',
    Component: CrmUsersPage,
    crmSection: 'users',
    authority: [SUPER_ADMIN],
    layout: 'crm',
    requiresAuth: true,
  },
  {
    path: `${CRM_PATH}/consultants`,
    title: 'مدیریت مشاورین',
    Component: CrmConsultantsPage,
    crmSection: 'consultants',
    authority: [SUPER_ADMIN],
    layout: 'crm',
    requiresAuth: true,
  },
  {
    path: `${CRM_PATH}/agencies`,
    title: 'مدیریت آژانس‌ها',
    Component: CrmAgenciesPage,
    crmSection: 'agencies',
    authority: [SUPER_ADMIN],
    layout: 'crm',
    requiresAuth: true,
  },
  {
    path: `${CRM_PATH}/categories`,
    title: 'دسته‌بندی‌ها',
    Component: CrmCategoriesPage,
    crmSection: 'categories',
    authority: [SUPER_ADMIN],
    layout: 'crm',
    requiresAuth: true,
  },
  {
    path: `${CRM_PATH}/locations`,
    title: 'مدیریت موقعیت‌ها',
    Component: CrmLocationsPage,
    crmSection: 'locations',
    authority: [SUPER_ADMIN],
    layout: 'crm',
    requiresAuth: true,
  },
  {
    path: `${CRM_PATH}/locations/map`,
    title: 'نقشه مرزبندی موقعیت‌ها',
    Component: CrmLocationMapPage,
    crmSection: 'locations',
    authority: [SUPER_ADMIN],
    layout: 'crm',
    requiresAuth: true,
  },
  {
    path: `${CRM_PATH}/forms`,
    title: 'فرم‌های آگهی',
    Component: CrmFormsPage,
    crmSection: 'forms',
    authority: [SUPER_ADMIN],
    layout: 'crm',
    requiresAuth: true,
  },
  {
    path: `${CRM_PATH}/packages`,
    title: 'بسته‌ها و اعتبار پنل',
    Component: CrmPackagesPage,
    crmSection: 'packages',
    authority: CRM_FINANCE_ROLES,
    layout: 'crm',
    requiresAuth: true,
  },
  {
    path: `${CRM_PATH}/payments`,
    title: 'تاریخچه پرداخت‌ها',
    Component: CrmPaymentsPage,
    crmSection: 'payments',
    authority: CRM_FINANCE_ROLES,
    layout: 'crm',
    requiresAuth: true,
  },
  {
    path: `${CRM_PATH}/costs`,
    title: 'مدیریت هزینه‌ها',
    Component: CrmCostsPage,
    crmSection: 'costs',
    authority: CRM_FINANCE_ROLES,
    layout: 'crm',
    requiresAuth: true,
  },
  {
    path: `${CRM_PATH}/reports`,
    title: 'گزارش‌های تخلف',
    Component: CrmReportsPage,
    crmSection: 'reports',
    authority: [SUPER_ADMIN],
    layout: 'crm',
    requiresAuth: true,
  },
  {
    path: `${CRM_PATH}/requests`,
    title: 'درخواست‌های پشتیبانی',
    Component: CrmSupportRequestsPage,
    crmSection: 'requests',
    authority: [SUPER_ADMIN],
    layout: 'crm',
    requiresAuth: true,
  },
  {
    path: `${CRM_PATH}/property-requests`,
    title: 'درخواست‌های یافتن آگهی',
    Component: CrmPropertyRequestsPage,
    crmSection: 'propertyRequests',
    authority: [SUPER_ADMIN],
    layout: 'crm',
    requiresAuth: true,
  },
  {
    path: `${CRM_PATH}/support`,
    title: 'پشتیبانی',
    Component: CrmSupportPage,
    crmSection: 'support',
    authority: CRM_SUPPORT_ROLES,
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
    placeholderNote: dashboardHomePlaceholderNote,
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
    authority: [REAL_ESTATE_MANAGER],
    requiresAuth: true,
    requiresNonUser: true,
  },
  {
    path: `${DASHBOARD_PATH}/agency/preview/qr-code`,
    title: 'کیوآرکد آژانس',
    Component: DashboardAgencyQrCodePage,
    authority: [REAL_ESTATE_MANAGER],
    requiresAuth: true,
    requiresNonUser: true,
  },
  {
    path: `${DASHBOARD_PATH}/agency/preview/filter`,
    title: 'فیلتر آگهی‌ها',
    Component: SearchMapFilterPage,
    authority: [REAL_ESTATE_MANAGER],
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
    placeholderNote: dashboardHomePlaceholderNote,
    requiresAuth: true,
    requiresNonUser: true,
  },
  {
    path: `${DASHBOARD_PATH}/team`,
    title: 'مدیریت مشاورین',
    Component: DashboardTeamPage,
    authority: ['real_estate_manager'],
    layout: 'dashboard',
    placeholderNote: dashboardHomePlaceholderNote,
    requiresAuth: true,
    requiresNonUser: true,
  },
  {
    path: `${DASHBOARD_PATH}/team/add-consultant`,
    title: 'انتخاب مشاور',
    Component: DashboardAddConsultantPage,
    authority: ['real_estate_manager'],
    layout: 'dashboard',
    placeholderNote: dashboardHomePlaceholderNote,
    requiresAuth: true,
    requiresNonUser: true,
  },
  {
    path: `${DASHBOARD_PATH}/team/info`,
    title: 'اطلاعات مشاور',
    Component: DashboardConsultantInfoPage,
    authority: ['real_estate_manager'],
    layout: 'dashboard',
    placeholderNote: dashboardHomePlaceholderNote,
    requiresAuth: true,
    requiresNonUser: true,
  },
  {
    path: `${DASHBOARD_PATH}/team/edit`,
    title: 'ویرایش اطلاعات',
    Component: DashboardConsultantEditPage,
    authority: ['real_estate_manager'],
    layout: 'dashboard',
    placeholderNote: dashboardHomePlaceholderNote,
    requiresAuth: true,
    requiresNonUser: true,
  },
  {
    path: `${DASHBOARD_PATH}/team/remove`,
    title: 'حذف مشاور',
    Component: DashboardConsultantRemovePage,
    authority: ['real_estate_manager'],
    layout: 'dashboard',
    placeholderNote: dashboardHomePlaceholderNote,
    requiresAuth: true,
    requiresNonUser: true,
  },
  {
    path: `${DASHBOARD_PATH}/payments`,
    title: 'پرداخت‌ها',
    Component: DashboardPaymentsPage,
    layout: 'dashboard',
    placeholderNote: dashboardHomePlaceholderNote,
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
    authority: [REAL_ESTATE_CONSULTANT, INDEPENDENT_CONSULTANT],
    requiresAuth: true,
  },
  {
    path: '/account/ranking/levels',
    title: 'سطح پیشرفت مشاور',
    Component: IndependentConsultantRankingLevelsPage,
    authority: [REAL_ESTATE_CONSULTANT, INDEPENDENT_CONSULTANT],
    requiresAuth: true,
  },
  {
    path: '/account/ranking/badges/guide',
    title: 'راهنمای نشان‌ها',
    Component: IndependentConsultantBadgesGuidePage,
    authority: [REAL_ESTATE_CONSULTANT, INDEPENDENT_CONSULTANT],
    requiresAuth: true,
  },
  {
    path: '/account/ranking/badges/file',
    title: 'جزئیات نشان',
    Component: IndependentConsultantFileBadgePage,
    authority: [REAL_ESTATE_CONSULTANT, INDEPENDENT_CONSULTANT],
    requiresAuth: true,
  },
  {
    path: '/account/ranking/badges/magnet',
    title: 'جزئیات نشان',
    Component: IndependentConsultantMagnetBadgePage,
    authority: [REAL_ESTATE_CONSULTANT, INDEPENDENT_CONSULTANT],
    requiresAuth: true,
  },
  {
    path: '/account/ranking/badges/response',
    title: 'جزئیات نشان',
    Component: IndependentConsultantResponseBadgePage,
    authority: [REAL_ESTATE_CONSULTANT, INDEPENDENT_CONSULTANT],
    requiresAuth: true,
  },
  {
    path: '/account/ranking/badges/time',
    title: 'جزئیات نشان',
    Component: IndependentConsultantTimeBadgePage,
    authority: [REAL_ESTATE_CONSULTANT, INDEPENDENT_CONSULTANT],
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
    authority: [REAL_ESTATE_MANAGER, REAL_ESTATE_CONSULTANT],
    requiresAuth: true,
  },
  {
    path: '/account/ad-management/allocation-review',
    title: 'بررسی و تخصیص',
    Component: IndependentConsultantAdAllocationReviewPage,
    authority: [REAL_ESTATE_MANAGER, REAL_ESTATE_CONSULTANT],
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
    path: "/consultants/neighborhood",
    title: "انتخاب محله",
    Component: ConsultantsNeighborhoodPage,
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
    path: "/notifications/settings",
    title: "مدیریت اعلان‌ها",
    Component: NotificationManagementPage,
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
