import type { ComponentType } from 'react'
import { useEffect, useState } from 'react'
import { MobileAppShell } from '../app/MobileAppShell'
import { EquipmentFacilitiesPage } from '../pages/EquipmentFacilitiesPage'
import { PropertyInfoPage } from '../pages/PropertyInfoPage'
import { ViewAdPage } from '../pages/ViewAdPage'
import { routes } from './routes'

function getCurrentPath() {
  return window.location.pathname || '/'
}

type ResolvedRoute = {
  path: string
  title: string
  Component: ComponentType
}

function getRoute(path: string): ResolvedRoute {
  if (/^\/ads\/\d+\/equipment-facilities\/?$/.test(path)) {
    return { path, title: 'تجهیزات و امکانات', Component: EquipmentFacilitiesPage }
  }

  if (/^\/ads\/\d+\/property-info\/?$/.test(path)) {
    return { path, title: 'اطلاعات ملک', Component: PropertyInfoPage }
  }

  if (/^\/ads\/\d+\/?$/.test(path)) {
    return { path, title: 'آگهی', Component: ViewAdPage }
  }

  return routes.find((route) => route.path === path) ?? routes[0]
}

export function AppRouter() {
  const [path, setPath] = useState(getCurrentPath)
  const route = getRoute(path)
  const ActivePage = route.Component

  useEffect(() => {
    document.title = `بونگا | ${route.title}`
  }, [route.title])

  useEffect(() => {
    function handleNavigation() {
      setPath(getCurrentPath())
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
