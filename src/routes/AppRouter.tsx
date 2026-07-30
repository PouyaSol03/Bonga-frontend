import type { ComponentType, ReactNode } from 'react'
import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import { getStoredAuthSession, storeLoginRedirectPath } from '../auth/auth-storage'
import { MobileAppShell } from '../app/MobileAppShell'
import { PageFrame } from '../app/PageFrame'
import { BottomNavigation } from '../components/BottomNavigation'
import { AccessDeniedState, NoConnectionState, NotFoundErrorState } from '../components/ErrorState'
import LinearNotification from '../components/(icons)/LinearNotification'
import { TopBar, TopBarLayoutProvider } from '../components/TopBar'
import { Typography } from '../components/ui/Typography'
import { CRM_ADVERTISE_ROLES } from '../constants/roles.constants'
import { isUserIdentityVerified } from "../services/account.service";
import { useMyProfileQuery } from '../hooks/account.hooks'
import { useNotificationUnreadCountQuery } from '../hooks/notification.hooks'
import {
  canAccessRoute,
  CRM_PATH,
  DASHBOARD_PATH,
  getDefaultCrmPath,
  LEGACY_DASHBOARD_PATH,
  routes,
  type AppRoute,
} from './routes'
import LinearUserAccount from '../components/(icons)/LinearUserAccount'
import type { CrmRoutePageProps } from '../pages/crm/CrmLayout'
import { replaceRoute } from './navigation'
import { getAppChromeConfig } from './routeChrome'
import { Button } from "../components/ui/Button";


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

const AccountMyAdStatePage = lazyNamed(
  () => import('../pages/account/AccountMyAdStatePage'),
  'AccountMyAdStatePage',
)
const CrmLayout = lazyNamed(() => import('../pages/crm/CrmLayout'), 'CrmLayout')
const CrmAdvertiseDetailPage = lazyNamed(
  () => import('../pages/crm/routes/CrmAdvertiseDetailPage'),
  'CrmAdvertiseDetailPage',
)
const AdPaymentHistoryPage = lazyNamed(
  () => import('../pages/account/adManagement/AdPaymentHistoryPage'),
  'AdPaymentHistoryPage',
)
const AdIncreaseVisitsPage = lazyNamed(
  () => import('../pages/account/adManagement/AdIncreaseVisitsPage'),
  'AdIncreaseVisitsPage',
)
const AdVisitStatisticsPage = lazyNamed(
  () => import('../pages/account/adManagement/AdVisitStatisticsPage'),
  'AdVisitStatisticsPage',
)
const AdCloseResultPage = lazyNamed(
  () => import('../pages/account/adManagement/AdCloseResultPage'),
  'AdCloseResultPage',
)
const UserChatDetailPage = lazyNamed(
  () => import('../pages/UserChatHomePage'),
  'UserChatDetailPage',
)
const UserChatBulkDeletePage = lazyNamed(
  () => import('../pages/UserChatHomePage'),
  'UserChatBulkDeletePage',
)
const ChatReportPage = lazyNamed(
  () => import('../pages/chat/ChatReportPage'),
  'ChatReportPage',
)
const ViewAdPage = lazyNamed(() => import('../pages/ViewAdPage'), 'ViewAdPage')
const ViewAdPropertyInfoPage = lazyNamed(
  () => import('../pages/viewAd/pages/ViewAdPropertyInfoPage'),
  'ViewAdPropertyInfoPage',
)
const ViewAdEquipmentFacilitiesPage = lazyNamed(
  () => import('../pages/viewAd/pages/ViewAdEquipmentFacilitiesPage'),
  'ViewAdEquipmentFacilitiesPage',
)
const PublicAgencyPreviewPage = lazyNamed(() => import('../pages/dashboard/AgencyPreviewPage'), 'AgencyPreviewPage')
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
    window.localStorage.getItem('bonga-selected-city-id') ||
      window.localStorage.getItem('bonga-selected-city'),
  )
}

function NotificationTopBarIcon() {
  const { data: unreadNotificationsCount = 0 } = useNotificationUnreadCountQuery({
    enabled: Boolean(getStoredAuthSession()),
  })

  return (
    <Typography as="span" variant="body" size="medium" weight="regular" className="relative grid h-6 w-6 place-items-center">
      <LinearNotification className="h-6 w-6" />
      {unreadNotificationsCount > 0 ? (
        <Typography as="span" variant="body" size="medium" weight="regular"
          aria-hidden="true"
          className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-[#ef1f1f] ring-2 ring-[#f0f0f0]"
        />
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

function IdentityRequiredIcon() {
  return (
    <div className="relative mb-6 grid h-16.5 w-16.5 place-items-center">
      <img src="/vectors/NotAuthorize.svg" alt="" />
    </div>
  )
}

function IdentityRequiredPage({ title }: { title: string }) {
  return (
    <PageFrame
      className="relative flex min-h-0 flex-col overflow-hidden bg-white text-[#1a1a1a] [direction:rtl]"
      variant="flush"
    >
      <TopBar backTo="/account" title={title} />
      <main className="flex min-h-0 flex-1 flex-col items-center justify-center bg-white px-6 pb-20 text-center">
        <IdentityRequiredIcon />
        <Typography as="h2" variant="title" size="medium" weight="semibold" className="m-0 text-base font-bold leading-6 text-[#1a1a1a]">
          احراز هویت مورد نیاز است!
        </Typography>
        <Typography as="p" variant="body" size="medium" weight="regular" className="m-0 mt-2 max-w-[310px] text-sm font-normal leading-6 text-[#4d4d4d]">
          برای دسترسی به این بخش، ابتدا باید احراز هویت خود را تکمیل کنید. احراز هویت به افزایش امنیت حساب کاربری و فعال‌سازی امکانات سامانه کمک می‌کند.
        </Typography>
        <Button unstyled
          className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#0048c4] px-4 text-sm font-semibold leading-5 text-white"
          onClick={() => navigateTo('/account/identity?required=1')}
          type="button"
        >
          <LinearUserAccount className='w-5 h-5'/>
          <Typography as="span" variant="body" size="medium" weight="regular">تکمیل احراز هویت</Typography>
        </Button>
      </main>
    </PageFrame>
  )
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
  const session = getStoredAuthSession()
  const route = getRoute(path)

  if (path !== browserPath) {
    window.history.replaceState(
      window.history.state ?? {},
      '',
      `${path}${window.location.search}${window.location.hash}`,
    )
  }

  if (path === '/' && hasStoredCity()) {
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
  const { data: profile, isLoading: isProfileLoading } = useMyProfileQuery({
    enabled: requiresIdentity,
  })

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
    function handleNavigation() {
      setPath(getResolvedPath())
      window.scrollTo({ top: 0 })
    }

    window.addEventListener('popstate', handleNavigation)

    return () => {
      window.removeEventListener('popstate', handleNavigation)
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

  const isIdentityVerified = isUserIdentityVerified(profile)
  const page = requiresIdentity && isProfileLoading ? (
    <IdentityGateLoadingPage title={route.title} />
  ) : requiresIdentity && !isIdentityVerified ? (
    <IdentityRequiredPage title={route.title} />
  ) : (
    <Suspense fallback={<div className="min-h-0 flex-1 bg-[#f0f0f0]" />}>
      <ActivePage />
    </Suspense>
  )

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
