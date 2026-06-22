import type { ComponentType, ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { getStoredAuthSession, storeLoginRedirectPath } from '../auth/auth-storage'
import { MobileAppShell } from '../app/MobileAppShell'
import { PageFrame } from '../app/PageFrame'
import { BottomNavigation } from '../components/BottomNavigation'
import { TopBar } from '../components/TopBar'
import { ViewAdPage } from '../pages/ViewAdPage'
import { routes } from './routes'

function getCurrentPath() {
  return window.location.pathname || '/'
}

function hasStoredCity() {
  return Boolean(
    window.localStorage.getItem('bonga-selected-city-id') ||
      window.localStorage.getItem('bonga-selected-city'),
  )
}

function getResolvedPath() {
  const path = getCurrentPath()

  if (path === '/' && hasStoredCity()) {
    window.history.replaceState({}, '', '/home')
    return '/home'
  }

  if (path.startsWith('/account') && path !== '/account' && !getStoredAuthSession()) {
    storeLoginRedirectPath(path)
    window.history.replaceState({}, '', '/login/phone')
    return '/login/phone'
  }

  return path
}

type ResolvedRoute = {
  path: string
  title: string
  Component: ComponentType
}

type AppChromeConfig = {
  bottomNavigationKey?: string
  contentClassName?: string
  frameClassName?: string
  header?: ReactNode
  wrapInShell: boolean
}

function NotificationIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <path d="M17.5 10a5.5 5.5 0 0 0-11 0v3.5l-1.5 2h14l-1.5-2V10Z" />
      <path d="M9.75 18a2.35 2.35 0 0 0 4.5 0" />
    </svg>
  )
}

function getBottomNavigationKey(path: string) {
  if (path === '/home') return 'home'
  if (path.startsWith('/search')) return 'search'
  if (path === '/chat') return 'chat'
  if (
    path === '/account/ad-management/allocation' ||
    path === '/account/ad-management/payment' ||
    path.startsWith('/account/ad-management/published')
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
            icon: <NotificationIcon className="h-6 w-6" />,
            id: "notifications",
            label: "Ø§Ø¹Ù„Ø§Ù†â€ŒÙ‡Ø§",
            to: "/chat",
          },
        ]}
        backTo="/login"
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

  return {
    bottomNavigationKey,
    contentClassName: 'min-h-0 flex-1 overflow-hidden',
    frameClassName: 'relative flex min-h-0 flex-col overflow-hidden bg-[#f0f0f0] text-[#1a1a1a] [direction:rtl]',
    header,
    wrapInShell: true,
  }
}

function getRoute(path: string): ResolvedRoute {
  if (/^\/ads\/[^/]+\/equipment-facilities\/?$/.test(path)) {
    return { path, title: 'تجهیزات و امکانات', Component: ViewAdPage }
  }

  if (/^\/ads\/[^/]+\/property-info\/?$/.test(path)) {
    return { path, title: 'اطلاعات ملک', Component: ViewAdPage }
  }

  if (/^\/ads\/[^/]+\/?$/.test(path)) {
    return { path, title: 'آگهی', Component: ViewAdPage }
  }

  return routes.find((route) => route.path === path) ?? routes[0]
}

export function AppRouter() {
  const [path, setPath] = useState(getResolvedPath)
  const route = getRoute(path)
  const ActivePage = route.Component
  const chromeConfig = getAppChromeConfig(route.path, route.title)

  useEffect(() => {
    document.title = `بنگاه | ${route.title}`
  }, [route.title])

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

  const page = <ActivePage />
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
