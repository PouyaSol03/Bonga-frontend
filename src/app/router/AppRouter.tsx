import type { ComponentType, ReactNode } from 'react'
import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { getActiveAuthRole, getStoredAuthSession, storeLoginRedirectPath } from '../../shared/auth/auth-storage'
import { MobileAppShell } from '../layout/MobileAppShell'
import { PageFrame } from '../../shared/layout/PageFrame'
import { BottomNavigation } from '../layout/BottomNavigation'
import { AccessDeniedState, NoConnectionState, NotFoundErrorState } from '../../shared/components/ErrorState'
import LinearNotification from '../../shared/icons/LinearNotification'
import { TopBar, TopBarLayoutProvider } from '../../shared/components/TopBar'
import { Typography } from '../../shared/ui/Typography'
import {
  CRM_ADVERTISE_ROLES,
  INDEPENDENT_CONSULTANT,
  REAL_ESTATE_CONSULTANT,
  REAL_ESTATE_MANAGER,
} from '../../shared/constants/roles.constants'
import {
  canAccessRoute,
  CRM_PATH,
  DASHBOARD_PATH,
  getDefaultCrmPath,
  LEGACY_DASHBOARD_PATH,
  routes,
  type AppRoute,
} from './routes'
import type { CrmRoutePageProps } from '../../features/crm/CrmLayout'
import { historyRouteChangeEvent, installHistoryNavigationBridge, replaceRoute } from '../../shared/navigation/navigation'
import { getAppChromeConfig } from './routeChrome'
import { selectedCityStorageKeys } from '../../shared/lib/selectedCityStorage'

installHistoryNavigationBridge();


function RouteNotFoundPage() {
  return <NotFoundErrorState />
}

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

const UnreadNotificationBadge = lazyNamed(
  () => import('../../features/notifications/components/UnreadNotificationBadge'),
  'UnreadNotificationBadge',
)
const IdentityGate = lazyNamed(
  () => import('../../features/account/components/IdentityGate'),
  'IdentityGate',
)
const AccountMyAdStatePage = lazyNamed(
  () => import('../../features/account/AccountMyAdStatePage'),
  'AccountMyAdStatePage',
)
const CrmLayout = lazyNamed(() => import('../../features/crm/CrmLayout'), 'CrmLayout')
const CrmAdvertiseDetailPage = lazyNamed(
  () => import('../../features/crm/routes/CrmAdvertiseDetailPage'),
  'CrmAdvertiseDetailPage',
)
const AdPaymentHistoryPage = lazyNamed(
  () => import('../../features/account/adManagement/AdPaymentHistoryPage'),
  'AdPaymentHistoryPage',
)
const AdIncreaseVisitsPage = lazyNamed(
  () => import('../../features/account/adManagement/AdIncreaseVisitsPage'),
  'AdIncreaseVisitsPage',
)
const AdVisitStatisticsPage = lazyNamed(
  () => import('../../features/account/adManagement/AdVisitStatisticsPage'),
  'AdVisitStatisticsPage',
)
const AdCloseResultPage = lazyNamed(
  () => import('../../features/account/adManagement/AdCloseResultPage'),
  'AdCloseResultPage',
)
const IndependentConsultantAdRejectPage = lazyNamed(
  () => import('../../features/account/adManagement/IndependentConsultantAdRejectPage'),
  'IndependentConsultantAdRejectPage',
)
const UserChatDetailPage = lazyNamed(
  () => import('../../features/chat/UserChatHomePage'),
  'UserChatDetailPage',
)
const UserChatBulkDeletePage = lazyNamed(
  () => import('../../features/chat/UserChatHomePage'),
  'UserChatBulkDeletePage',
)
const ChatReportPage = lazyNamed(
  () => import('../../features/chat/ChatReportPage'),
  'ChatReportPage',
)
const ViewAdPage = lazyNamed(() => import('../../features/advertisements/view/ViewAdPage'), 'ViewAdPage')
const ViewAdPropertyInfoPage = lazyNamed(
  () => import('../../features/advertisements/view/pages/ViewAdPropertyInfoPage'),
  'ViewAdPropertyInfoPage',
)
const ViewAdEquipmentFacilitiesPage = lazyNamed(
  () => import('../../features/advertisements/view/pages/ViewAdEquipmentFacilitiesPage'),
  'ViewAdEquipmentFacilitiesPage',
)
const PublicAgencyPreviewPage = lazyNamed(() => import('../../features/dashboard/AgencyPreviewPage'), 'AgencyPreviewPage')
const AgentPreviewPage = PublicAgencyPreviewPage

function normalizePathname(pathname: string) {
  const normalizedPath = pathname.replace(/\/{2,}/g, '/')

  if (normalizedPath === '/') {
    return '/'
  }

  return normalizedPath.replace(/\/+$/, '') || '/'
}

function getCurrentPath() {
  return normalizePathname(window.location.pathname || '/')
}

function hasStoredCity() {
  return Boolean(
    window.localStorage.getItem(selectedCityStorageKeys.name)?.trim(),
  )
}

function NotificationTopBarIcon() {
  const hasAuthSession = Boolean(getStoredAuthSession())

  return (
    <Typography as="span" variant="body" size="medium" weight="regular" className="relative grid h-6 w-6 place-items-center">
      <LinearNotification className="h-6 w-6" />
      {hasAuthSession ? (
        <Suspense fallback={null}>
          <UnreadNotificationBadge
            className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-[#ef1f1f] ring-2 ring-[#f0f0f0]"
          />
        </Suspense>
      ) : null}
    </Typography>
  )
}

function getCanonicalDashboardPath(path: string) {
  if (path === '/ad-management/payment' || path.startsWith('/ad-management/payment/')) {
    return `/account${path}`
  }

  if (path === LEGACY_DASHBOARD_PATH) {
    return DASHBOARD_PATH
  }

  if (path.startsWith(`${LEGACY_DASHBOARD_PATH}/`)) {
    return `${DASHBOARD_PATH}${path.slice(LEGACY_DASHBOARD_PATH.length)}`
  }

  return path
}

function getLoginRequiredPath(returnTo: string) {
  const params = new URLSearchParams({ returnTo })

  return `/login-required?${params.toString()}`
}

function isLoginFlowPath(path: string) {
  return (
    path === '/login' ||
    path === '/login-required' ||
    path === '/login/phone' ||
    path === '/login/verify'
  )
}

function shouldRequireIdentityForPath(path: string) {
  if (
    path.startsWith('/new-ad') &&
    new URLSearchParams(window.location.search).get('editSource') === 'crm'
  ) return false

  if (path === '/account') return false
  if (path === '/account/profile') return false
  if (path === '/account/identity') return false
  if (path === '/account/about') return false
  if (path.startsWith('/account/support')) return false
  if (path === '/login' || path.startsWith('/login/')) return false

  return (
    path.startsWith('/account/') ||
    path.startsWith('/new-ad') ||
    path.startsWith('/notifications') ||
    path.startsWith('/chat')
  )
}

function navigateTo(path: string) {
  window.history.pushState({}, '', path)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

function IdentityGateLoadingPage({ title }: { title: string }) {
  return (
    <PageFrame
      className="relative flex min-h-0 flex-col overflow-hidden bg-white text-[#1a1a1a] [direction:rtl]"
      variant="flush"
    >
      <TopBar backTo="/account" title={title} />
      <main className="flex min-h-0 flex-1 items-center justify-center bg-white px-6 pb-20 text-center text-sm font-medium text-[#808080]">
        در حال بررسی وضعیت احراز هویت...
      </main>
    </PageFrame>
  )
}

function getResolvedPath() {
  const browserPath = window.location.pathname || '/'
  const currentPath = getCurrentPath()
  const path = getCanonicalDashboardPath(currentPath)
  const returnTo = `${path}${window.location.search}`
  const hasCity = hasStoredCity()
  const isOnboardingCitySelection =
    path === '/' && new URLSearchParams(window.location.search).get('city') === '1'

  if (!hasCity) {
    if (path !== '/' || window.location.search || window.location.hash) {
      window.history.replaceState({}, '', '/')
    }

    return '/'
  }

  const session = getStoredAuthSession()

  // Authenticated users must never land back inside the login/OTP flow.
  // This also catches browser Back/Forward entries left in history after login.
  if (session && isLoginFlowPath(path)) {
    window.history.replaceState(window.history.state ?? {}, '', '/account')
    return '/account'
  }

  const route = getRoute(path)

  if (path !== browserPath) {
    window.history.replaceState(
      window.history.state ?? {},
      '',
      `${path}${window.location.search}${window.location.hash}`,
    )
  }

  if (path === '/' && !isOnboardingCitySelection) {
    window.history.replaceState({}, '', '/home')
    return '/home'
  }

  if (
    route.Component !== RouteNotFoundPage &&
    path.startsWith('/account') &&
    path !== '/account' &&
    !getStoredAuthSession()
  ) {
    storeLoginRedirectPath(returnTo)
    const loginRequiredPath = getLoginRequiredPath(returnTo)
    window.history.replaceState({}, '', loginRequiredPath)
    return '/login-required'
  }

  if (!canAccessRoute(route, session)) {
    if (!session) {
      storeLoginRedirectPath(returnTo)
      const loginRequiredPath = getLoginRequiredPath(returnTo)
      window.history.replaceState({}, '', loginRequiredPath)
      return '/login-required'
    }

    if (path === CRM_PATH || path.startsWith(`${CRM_PATH}/`)) {
      window.history.replaceState({}, '', '/403')
      return '/403'
    }
  }

  if (path === CRM_PATH && session) {
    const defaultCrmPath = getDefaultCrmPath(session)
    if (defaultCrmPath !== CRM_PATH) {
      window.history.replaceState(window.history.state ?? {}, '', defaultCrmPath)
      return defaultCrmPath
    }
  }

  return path
}

function getRoute(path: string): AppRoute {
  if (
    path.startsWith('/new-ad') &&
    new URLSearchParams(window.location.search).get('editSource') === 'crm'
  ) {
    const newAdRoute = routes.find((route) => route.path === path)

    if (newAdRoute) {
      return {
        ...newAdRoute,
        authority: CRM_ADVERTISE_ROLES,
        requiresAuth: true,
      }
    }
  }

  if (/^\/crm\/advertises\/[^/]+\/?$/.test(path)) {
    const crmRoute = routes.find((route) => route.path === `${CRM_PATH}/advertises`)

    return {
      ...(crmRoute ?? routes[0]),
      Component: CrmAdvertiseDetailPage,
      crmSection: 'advertises',
      path,
      title: 'جزئیات آگهی',
    }
  }

  if (/^\/account\/ad-management\/payment\/[^/]+\/?$/.test(path)) {
    const paymentRoute = routes.find(
      (route) => route.path === '/account/ad-management/payment',
    )

    return {
      ...(paymentRoute ?? routes[0]),
      authority: undefined,
      path,
      requiresAuth: true,
      title: 'هزینه ثبت آگهی',
    }
  }

  if (/^\/account\/my-ads\/[^/]+\/state-ad\/?$/.test(path)) {
    return { path, title: 'مدیریت آگهی', Component: AccountMyAdStatePage, requiresAuth: true }
  }

  if (/^\/account\/my-ads\/[^/]+\/payment-history\/?$/.test(path)) {
    return { path, title: 'تاریخچه پرداخت', Component: AdPaymentHistoryPage, requiresAuth: true }
  }

  if (/^\/account\/my-ads\/[^/]+\/increase-visits\/?$/.test(path)) {
    return { path, title: 'افزایش بازدید', Component: AdIncreaseVisitsPage, requiresAuth: true }
  }

  if (/^\/account\/my-ads\/[^/]+\/visit-statistics\/?$/.test(path)) {
    return { path, title: 'آمار بازدید', Component: AdVisitStatisticsPage, requiresAuth: true }
  }

  if (/^\/account\/my-ads\/[^/]+\/close-result\/?$/.test(path)) {
    return { path, title: 'ثبت نتیجه آگهی', Component: AdCloseResultPage, requiresAuth: true }
  }

  if (/^\/account\/ad-management\/allocation-review\/[^/]+\/reject\/?$/.test(path)) {
    const allocationReviewRoute = routes.find(
      (route) => route.path === '/account/ad-management/allocation-review',
    )

    return {
      ...(allocationReviewRoute ?? routes[0]),
      Component: IndependentConsultantAdRejectPage,
      path,
      title: 'رد ثبت آگهی',
    }
  }

  if (/^\/account\/ad-management\/allocation-review\/[^/]+\/?$/.test(path)) {
    const allocationReviewRoute = routes.find(
      (route) => route.path === '/account/ad-management/allocation-review',
    )

    return {
      ...(allocationReviewRoute ?? routes[0]),
      path,
      title: allocationReviewRoute?.title ?? 'بررسی و تخصیص',
    }
  }

  if (/^\/agencies\/[^/]+\/?$/.test(path)) {
    return { path, title: 'صفحه آژانس', Component: PublicAgencyPreviewPage }
  }

  if (/^\/agents\/[^/]+\/?$/.test(path)) {
    return { path, title: 'صفحه مشاور', Component: AgentPreviewPage }
  }

  if (/^\/ads\/[^/]+\/equipment-facilities\/?$/.test(path)) {
    return { path, title: 'تجهیزات و امکانات', Component: ViewAdEquipmentFacilitiesPage }
  }

  if (/^\/ads\/[^/]+\/property-info\/?$/.test(path)) {
    return { path, title: 'اطلاعات ملک', Component: ViewAdPropertyInfoPage }
  }

  if (/^\/ads\/[^/]+\/?$/.test(path)) {
    return { path, title: 'آگهی', Component: ViewAdPage }
  }

  if (/^\/preview-ad\/[^/]+\/?$/.test(path)) {
    return { path, title: 'پیش‌نمایش آگهی', Component: ViewAdPage, requiresAuth: true }
  }

  if (/^\/preview-ad\/[^/]+\/property-info\/?$/.test(path)) {
    return { path, title: 'پیش‌نمایش اطلاعات ملک', Component: ViewAdPropertyInfoPage, requiresAuth: true }
  }

  if (/^\/preview-ad\/[^/]+\/equipment-facilities\/?$/.test(path)) {
    return { path, title: 'پیش‌نمایش تجهیزات و امکانات', Component: ViewAdEquipmentFacilitiesPage, requiresAuth: true }
  }

  if (/^\/chat\/[^/]+\/report\/?$/.test(path)) {
    return {
      path,
      title: 'گزارش تخلف',
      Component: ChatReportPage,
      requiresAuth: true,
    }
  }

  if (path === '/chat/bulk-delete') {
    return {
      path,
      title: 'حذف گروهی گفتگوها',
      Component: UserChatBulkDeletePage,
      requiresAuth: true,
    }
  }

  if (
    /^\/chat\/[^/]+\/?$/.test(path) &&
    path !== '/chat/response-time' &&
    path !== '/chat/rename'
  ) {
    const chatRoute = routes.find((route) => route.path === '/chat')

    return {
      path,
      title: chatRoute?.title ?? 'Chat',
      Component: UserChatDetailPage,
      requiresAuth: true,
    }
  }

  if (/^\/account\/dashboard\/team\/info\/[^/]+\/?$/.test(path)) {
    const infoRoute = routes.find((route) => route.path === `${DASHBOARD_PATH}/team/info`)

    return {
      ...(infoRoute ?? routes[0]),
      path,
    }
  }

  if (/^\/account\/dashboard\/team\/edit\/[^/]+\/?$/.test(path)) {
    const editRoute = routes.find((route) => route.path === `${DASHBOARD_PATH}/team/edit`)

    return {
      ...(editRoute ?? routes[0]),
      path,
    }
  }

  if (/^\/account\/dashboard\/team\/remove\/[^/]+\/?$/.test(path)) {
    const removeRoute = routes.find((route) => route.path === `${DASHBOARD_PATH}/team/remove`)

    return {
      ...(removeRoute ?? routes[0]),
      path,
    }
  }

  if (path === CRM_PATH || path.startsWith(`${CRM_PATH}/`)) {
    const crmRoute = routes.find((route) => route.path === CRM_PATH)

    return routes.find((route) => route.path === path) ?? {
      ...(crmRoute ?? routes[0]),
      path,
      title: 'صفحه پیدا نشد',
      Component: RouteNotFoundPage,
    }
  }

  if (path === DASHBOARD_PATH || path.startsWith(`${DASHBOARD_PATH}/`)) {
    const dashboardRoute = routes.find((route) => route.path === DASHBOARD_PATH)

    return routes.find((route) => route.path === path) ?? {
      ...(dashboardRoute ?? routes[0]),
      path,
      title: 'صفحه پیدا نشد',
      Component: RouteNotFoundPage,
    }
  }

  return routes.find((route) => route.path === path) ?? {
    path,
    title: 'صفحه پیدا نشد',
    Component: RouteNotFoundPage,
  }
}

export function AppRouter() {
  const [path, setPath] = useState(getResolvedPath)
  const pathRef = useRef(path)
  const [isOffline, setIsOffline] = useState(() => !window.navigator.onLine)
  const route = useMemo(() => getRoute(path), [path])
  const ActivePage = route.Component
  const chromeConfig = useMemo(
    () => getAppChromeConfig(route.path, route.title, <NotificationTopBarIcon />),
    [route.path, route.title],
  )
  const authSession = getStoredAuthSession()
  const isAccessDenied = Boolean(
    authSession && !canAccessRoute(route, authSession),
  )
  const requiresIdentity = Boolean(
    authSession &&
    !isAccessDenied &&
    route.Component !== RouteNotFoundPage &&
    shouldRequireIdentityForPath(route.path),
  )

  useEffect(() => {
    document.title = `بنگاه | ${route.title}`
  }, [route.title])

  useEffect(() => {
    if (
      !isAccessDenied ||
      (!route.path.startsWith(`${CRM_PATH}/`) && route.path !== CRM_PATH)
    ) {
      return;
    }

    replaceRoute('/403', undefined, { rememberCurrent: false })
  }, [isAccessDenied, route.path])

  useEffect(() => {
    if (!isAccessDenied || !route.path.startsWith(`${DASHBOARD_PATH}/`)) {
      return
    }

    const activeRole = getActiveAuthRole(authSession)
    const fallbackPath = activeRole === REAL_ESTATE_MANAGER
      ? `${DASHBOARD_PATH}/agency`
      : activeRole === REAL_ESTATE_CONSULTANT || activeRole === INDEPENDENT_CONSULTANT
        ? `${DASHBOARD_PATH}/agent`
        : '/account'

    if (fallbackPath !== route.path) {
      replaceRoute(fallbackPath, undefined, { rememberCurrent: false })
    }
  }, [authSession, isAccessDenied, route.path])

  useEffect(() => {
    function handleNavigation() {
      const nextPath = getResolvedPath()

      if (nextPath === pathRef.current) return

      pathRef.current = nextPath
      setPath(nextPath)
      window.scrollTo({ top: 0 })
    }

    window.addEventListener('popstate', handleNavigation)
    window.addEventListener(historyRouteChangeEvent, handleNavigation)

    return () => {
      window.removeEventListener('popstate', handleNavigation)
      window.removeEventListener(historyRouteChangeEvent, handleNavigation)
    }
  }, [])

  useEffect(() => {
    function handleOnline() {
      setIsOffline(false)
    }

    function handleOffline() {
      setIsOffline(true)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (isOffline) {
    return (
      <MobileAppShell>
        <NoConnectionState onRetry={() => setIsOffline(!window.navigator.onLine)} />
      </MobileAppShell>
    )
  }

  if (isAccessDenied) {
    return (
      <MobileAppShell>
        <AccessDeniedState onBack={() => navigateTo('/account')} />
      </MobileAppShell>
    )
  }

  const activePage = (
    <Suspense fallback={<div className="min-h-0 flex-1 bg-[#f0f0f0]" />}>
      <ActivePage />
    </Suspense>
  )
  const page = requiresIdentity ? (
    <Suspense fallback={<IdentityGateLoadingPage title={route.title} />}>
      <IdentityGate
        loadingFallback={<IdentityGateLoadingPage title={route.title} />}
        title={route.title}
      >
        {activePage}
      </IdentityGate>
    </Suspense>
  ) : activePage

  if (route.layout === 'crm') {
    return (
      <Suspense fallback={<div className="h-screen w-full bg-[#f3f3f3]" />}>
        <CrmLayout
          contentKey={route.path}
          renderContent={(viewProps: CrmRoutePageProps) => (
            <Suspense fallback={<div className="h-full min-h-80 rounded-xl bg-white" />}>
              <ActivePage {...viewProps} />
            </Suspense>
          )}
          section={route.crmSection ?? 'overview'}
        />
      </Suspense>
    )
  }

  const isCrmAdvertiseFlowRoute =
    route.path.startsWith('/new-ad') &&
    new URLSearchParams(window.location.search).get('editSource') === 'crm'

  if (isCrmAdvertiseFlowRoute) {
    return (
      <Suspense fallback={<div className="h-screen w-full bg-[#f3f3f3]" />}>
        <CrmLayout embeddedContent={page} section="advertises" />
      </Suspense>
    )
  }

  let content: ReactNode = page

  if (chromeConfig.wrapInShell) {
    content = (
      <PageFrame
        className={chromeConfig.frameClassName}
        variant="flush"
      >
        {chromeConfig.topBar ? (
          <TopBarLayoutProvider defaultTopBar={chromeConfig.topBar} resetKey={path}>
            <div className={chromeConfig.contentClassName ?? 'min-h-0 flex-1 overflow-hidden'}>
              {page}
            </div>
          </TopBarLayoutProvider>
        ) : (
          <div className={chromeConfig.contentClassName ?? 'min-h-0 flex-1 overflow-hidden'}>
            {page}
          </div>
        )}
        {chromeConfig.bottomNavigationKey ? (
          <BottomNavigation activeKey={chromeConfig.bottomNavigationKey} />
        ) : null}
      </PageFrame>
    )
  }

  return <MobileAppShell>{content}</MobileAppShell>
}
