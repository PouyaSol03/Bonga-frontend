import type { ComponentType, ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { getStoredAuthSession } from '../auth/auth-storage'
import { MobileAppShell } from '../app/MobileAppShell'
import { PageFrame } from '../app/PageFrame'
import { BottomNavigation } from '../components/BottomNavigation'
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

  if (path.startsWith('/account') && !getStoredAuthSession()) {
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
  wrapInShell: boolean
}

function getBottomNavigationKey(path: string) {
  if (path === '/home') return 'home'
  if (path.startsWith('/search')) return 'search'
  if (path === '/chat') return 'chat'
  if (path === '/login' || path.startsWith('/account')) return 'account'

  return undefined
}

function getAppChromeConfig(path: string): AppChromeConfig {
  const bottomNavigationKey = getBottomNavigationKey(path)

  if (!bottomNavigationKey) {
    return { wrapInShell: false }
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
  const chromeConfig = getAppChromeConfig(route.path)

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
