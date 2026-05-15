import { useEffect, useState } from 'react'
import { MobileAppShell } from '../app/MobileAppShell'
import { routes } from './routes'

function getCurrentPath() {
  return window.location.pathname || '/'
}

function getRoute(path: string) {
  return routes.find((route) => route.path === path) ?? routes[0]
}

export function AppRouter() {
  const [path, setPath] = useState(getCurrentPath)
  const route = getRoute(path)
  const ActivePage = route.Component

  useEffect(() => {
    document.title = `Bonga | ${route.title}`
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
