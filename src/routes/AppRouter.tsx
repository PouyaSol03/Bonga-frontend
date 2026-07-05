import type { ComponentType, ReactNode } from 'react'
import { lazy, Suspense, useEffect, useState } from 'react'
import { getActiveAuthRole, getStoredAuthSession, storeLoginRedirectPath } from '../auth/auth-storage'
import { MobileAppShell } from '../app/MobileAppShell'
import { PageFrame } from '../app/PageFrame'
import { BottomNavigation } from '../components/BottomNavigation'
import LinearNotification from '../components/(icons)/LinearNotification'
import { TopBar } from '../components/TopBar'
import { USER } from '../constants/roles.constants'
import { DashboardLayout } from '../dashboard/DashboardLayout'
import { useNotificationUnreadCountQuery } from '../hooks/notification.hooks'
import {
  canAccessRoute,
  DASHBOARD_PATH,
  LEGACY_DASHBOARD_PATH,
  routes,
  type AppRoute,
} from './routes'

const desktopDashboardMediaQuery = '(min-width: 501px)'

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
const UserChatDetailPage = lazyNamed(
  () => import('../pages/UserChatHomePage'),
  'UserChatDetailPage',
)
const ViewAdPage = lazyNamed(() => import('../pages/ViewAdPage'), 'ViewAdPage')

function getCurrentPath() {
  return window.location.pathname || '/'
}

function hasStoredCity() {
  return Boolean(
    window.localStorage.getItem('bonga-selected-city-id') ||
      window.localStorage.getItem('bonga-selected-city'),
  )
}

function isDesktopDashboardViewport() {
  return window.matchMedia(desktopDashboardMediaQuery).matches
}

function shouldUseDesktopDashboard(session: ReturnType<typeof getStoredAuthSession>) {
  return Boolean(session && getActiveAuthRole(session) !== USER && isDesktopDashboardViewport())
}

function NotificationTopBarIcon() {
  const { data: unreadNotificationsCount = 0 } = useNotificationUnreadCountQuery({
    enabled: Boolean(getStoredAuthSession()),
  })

  return (
    <span className="relative grid h-6 w-6 place-items-center">
      <LinearNotification className="h-6 w-6" />
      {unreadNotificationsCount > 0 ? (
        <span
          aria-hidden="true"
          className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-[#ef1f1f] ring-2 ring-[#f0f0f0]"
        />
      ) : null}
    </span>
  )
}

function getCanonicalDashboardPath(path: string) {
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

function getResolvedPath() {
  const currentPath = getCurrentPath()
  const path = getCanonicalDashboardPath(currentPath)
  const returnTo = `${path}${window.location.search}`
  const session = getStoredAuthSession()

  if (path !== currentPath) {
    window.history.replaceState(window.history.state ?? {}, '', path)
  }

  if (path === '/' && hasStoredCity()) {
    window.history.replaceState({}, '', '/home')
    return '/home'
  }

  if (path.startsWith('/account') && path !== '/account' && !getStoredAuthSession()) {
    storeLoginRedirectPath(returnTo)
    const loginRequiredPath = getLoginRequiredPath(returnTo)
    window.history.replaceState({}, '', loginRequiredPath)
    return '/login-required'
  }

  const route = getRoute(path)

  if (path === '/account' && shouldUseDesktopDashboard(session)) {
    window.history.replaceState({}, '', DASHBOARD_PATH)
    return DASHBOARD_PATH
  }

  if (!canAccessRoute(route, session)) {
    if (!session) {
      storeLoginRedirectPath(returnTo)
      const loginRequiredPath = getLoginRequiredPath(returnTo)
      window.history.replaceState({}, '', loginRequiredPath)
      return '/login-required'
    }

    window.history.replaceState({}, '', '/account')
    return '/account'
  }

  return path
}

type AppChromeConfig = {
  bottomNavigationKey?: string
  contentClassName?: string
  frameClassName?: string
  header?: ReactNode
  wrapInShell: boolean
}

function getBottomNavigationKey(path: string) {
  if (path === '/home') return 'home'
  if (path.startsWith('/search')) return 'search'
  if (path === '/chat') return 'chat'
  if (
    path.startsWith('/account/business/create') ||
    path === '/account/delete-user' ||
    path === '/account/ad-management/allocation' ||
    path.startsWith('/account/ad-management/allocation-review') ||
    path === '/account/ad-management/payment' ||
    path === '/account/ad-management/filter' ||
    path.startsWith('/account/dashboard/agency') ||
    path.startsWith('/account/dashboard/team') ||
    path.startsWith('/account/ad-management/published') ||
    /^\/account\/my-ads\/[^/]+\/state-ad\/?$/.test(path)
  ) {
    return undefined
  }
  if (path === '/login' || path.startsWith('/account')) return 'account'

  return undefined
}

function getRouteHeader(path: string, title: string) {
  if (path === '/login') {
    return <TopBar showBack={false} title={title} />
  }

  if (path === '/account/dashboard') {
    return (
      <TopBar
        actions={[
          {
            icon: <NotificationTopBarIcon />,
            id: "notifications",
            label: "اعلان‌ها",
            to: "/notifications",
          },
        ]}
        backTo="/account"
        title={title}
      />
    )
  }

  return undefined
}

function getAppChromeConfig(path: string, title: string): AppChromeConfig {
  const bottomNavigationKey = getBottomNavigationKey(path)
  const header = getRouteHeader(path, title)

  if (!bottomNavigationKey) {
    return header
      ? {
          contentClassName: 'min-h-0 flex-1 overflow-hidden',
          frameClassName: 'relative flex min-h-0 flex-col overflow-hidden bg-[#f0f0f0] text-[#1a1a1a] [direction:rtl]',
          header,
          wrapInShell: true,
        }
      : { wrapInShell: false }
  }

  if (path === '/search') {
    return {
      bottomNavigationKey,
      frameClassName: 'relative flex min-h-0 flex-col overflow-hidden bg-[#f0f0f0] text-[#1a1a1a]',
      wrapInShell: true,
    }
  }

  if (path === '/account/dashboard') {
    return {
      bottomNavigationKey,
      contentClassName: 'min-h-0 flex-1 overflow-y-auto overflow-x-hidden',
      frameClassName: 'relative flex min-h-0 flex-col overflow-hidden bg-[#f0f0f0] text-[#1a1a1a] [direction:rtl]',
      header,
      wrapInShell: true,
    }
  }

  return {
    bottomNavigationKey,
    contentClassName: 'min-h-0 flex-1 overflow-hidden',
    frameClassName: 'relative flex min-h-0 flex-col overflow-hidden bg-[#f0f0f0] text-[#1a1a1a] [direction:rtl]',
    header,
    wrapInShell: true,
  }
}

function getRoute(path: string): AppRoute {
  if (/^\/account\/my-ads\/[^/]+\/state-ad\/?$/.test(path)) {
    return { path, title: 'مدیریت آگهی', Component: AccountMyAdStatePage }
  }

  if (/^\/account\/ad-management\/allocation-review\/[^/]+\/?$/.test(path)) {
    const allocationReviewRoute = routes.find(
      (route) => route.path === '/account/ad-management/allocation-review',
    )

    return {
      path,
      title: allocationReviewRoute?.title ?? 'بررسی و تخصیص',
      Component: allocationReviewRoute?.Component ?? routes[0].Component,
    }
  }

  if (/^\/ads\/[^/]+\/equipment-facilities\/?$/.test(path)) {
    return { path, title: 'تجهیزات و امکانات', Component: ViewAdPage }
  }

  if (/^\/ads\/[^/]+\/property-info\/?$/.test(path)) {
    return { path, title: 'اطلاعات ملک', Component: ViewAdPage }
  }

  if (/^\/ads\/[^/]+\/?$/.test(path)) {
    return { path, title: 'آگهی', Component: ViewAdPage }
  }

  if (/^\/chat\/[^/]+\/?$/.test(path) && path !== '/chat/response-time') {
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

  if (path === DASHBOARD_PATH || path.startsWith(`${DASHBOARD_PATH}/`)) {
    return routes.find((route) => route.path === path) ??
      routes.find((route) => route.path === DASHBOARD_PATH) ??
      routes[0]
  }

  return routes.find((route) => route.path === path) ?? routes[0]
}

export function AppRouter() {
  const [path, setPath] = useState(getResolvedPath)
  const route = getRoute(path)
  const ActivePage = route.Component
  const chromeConfig = getAppChromeConfig(route.path, route.title)
  const authSession = getStoredAuthSession()

  useEffect(() => {
    document.title = `بنگاه | ${route.title}`
  }, [route.title])

  useEffect(() => {
    function handleNavigation() {
      setPath(getResolvedPath())
      window.scrollTo({ top: 0 })
    }

    function handleViewportChange() {
      setPath(getResolvedPath())
    }

    const desktopDashboardMedia = window.matchMedia(desktopDashboardMediaQuery)

    window.addEventListener('popstate', handleNavigation)
    desktopDashboardMedia.addEventListener('change', handleViewportChange)

    return () => {
      window.removeEventListener('popstate', handleNavigation)
      desktopDashboardMedia.removeEventListener('change', handleViewportChange)
    }
  }, [])

  const page = (
    <Suspense fallback={<div className="min-h-0 flex-1 bg-[#f0f0f0]" />}>
      <ActivePage />
    </Suspense>
  )

  if (route.layout === 'dashboard' && authSession && isDesktopDashboardViewport()) {
    return (
      <DashboardLayout
        activePath={path}
        session={authSession}
        title={route.title}
      >
        {page}
      </DashboardLayout>
    )
  }

  let content: ReactNode = page

  if (chromeConfig.wrapInShell) {
    content = (
      <PageFrame
        className={chromeConfig.frameClassName}
        variant="flush"
      >
        {chromeConfig.header}
        <div className={chromeConfig.contentClassName ?? 'min-h-0 flex-1 overflow-hidden'}>
          {page}
        </div>
        {chromeConfig.bottomNavigationKey ? (
          <BottomNavigation activeKey={chromeConfig.bottomNavigationKey} />
        ) : null}
      </PageFrame>
    )
  }

  return <MobileAppShell>{content}</MobileAppShell>
}
