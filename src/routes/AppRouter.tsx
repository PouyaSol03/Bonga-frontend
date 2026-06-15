import type { ComponentType } from 'react'
import { useEffect, useState } from 'react'
import { getStoredAuthSession } from '../auth/auth-storage'
import { MobileAppShell } from '../app/MobileAppShell'
import { EquipmentFacilitiesPage } from '../pages/EquipmentFacilitiesPage'
import { PropertyInfoPage } from '../pages/PropertyInfoPage'
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

function getRoute(path: string): ResolvedRoute {
  if (/^\/ads\/[^/]+\/equipment-facilities\/?$/.test(path)) {
    return { path, title: 'تجهیزات و امکانات', Component: EquipmentFacilitiesPage }
  }

  if (/^\/ads\/[^/]+\/property-info\/?$/.test(path)) {
    return { path, title: 'اطلاعات ملک', Component: PropertyInfoPage }
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

  return (
    <MobileAppShell>
      <ActivePage />
    </MobileAppShell>
  )
}
