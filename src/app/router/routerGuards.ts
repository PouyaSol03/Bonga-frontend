import { selectedCityStorageKeys } from '../../shared/lib/selectedCityStorage'
import { DASHBOARD_PATH, LEGACY_DASHBOARD_PATH } from './types'

export function normalizePathname(pathname: string): string {
  const normalized = pathname.replace(/\/{2,}/g, '/')
  if (normalized === '/') return '/'
  return normalized.replace(/\/+$/, '') || '/'
}

export function hasStoredCity(): boolean {
  return Boolean(
    window.localStorage.getItem(selectedCityStorageKeys.name)?.trim(),
  )
}

export function getCanonicalDashboardPath(path: string): string {
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

export function getLoginRequiredPath(returnTo: string): string {
  const params = new URLSearchParams({ returnTo })
  return `/login-required?${params.toString()}`
}

export function isLoginFlowPath(path: string): boolean {
  return (
    path === '/login' ||
    path === '/login-required' ||
    path === '/login/phone' ||
    path === '/login/verify'
  )
}

export function shouldRequireIdentityForPath(path: string): boolean {
  if (
    path.startsWith('/new-ad') &&
    new URLSearchParams(window.location.search).get('editSource') === 'crm'
  ) {
    return false
  }

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
