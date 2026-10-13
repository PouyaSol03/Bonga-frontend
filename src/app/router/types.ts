import { lazy, type ComponentType, type LazyExoticComponent } from 'react'
import {
  DASHBOARD_ROLES,
  REAL_ESTATE_CONSULTANT,
  REAL_ESTATE_MANAGER,
} from '../../shared/constants/roles.constants'
import { normalizeAuthRoleSlug, type AuthSession } from '../../shared/auth/auth-storage'

export type RouteComponent = ComponentType<any> | LazyExoticComponent<ComponentType<any>>

export function lazyNamed<TModule extends Record<string, unknown>>(
  loader: () => Promise<TModule>,
  exportName: keyof TModule,
) {
  let loadPromise: Promise<{ default: ComponentType<any> }> | null = null
  const load = () => {
    if (!loadPromise) {
      loadPromise = loader().then((module) => ({
        default: module[exportName] as ComponentType<any>,
      }))
    }
    return loadPromise
  }
  const LazyComponent = lazy(load)
  ;(LazyComponent as any).preload = load
  return LazyComponent
}

export type AppRoute = {
  authority?: string[]
  crmSection?:
    | 'overview'
    | 'advertises'
    | 'users'
    | 'consultants'
    | 'agencies'
    | 'categories'
    | 'locations'
    | 'forms'
    | 'packages'
    | 'payments'
    | 'costs'
    | 'reports'
    | 'requests'
    | 'propertyRequests'
    | 'support'
    | 'discounts'
    | 'feedback'
  layout?: 'crm' | 'dashboard'
  path: string
  placeholderNote?: string
  requiresAuth?: boolean
  requiresNonUser?: boolean
  title: string
  Component: RouteComponent
}

export const LOGIN_PATH = '/login/phone'
export const DASHBOARD_PATH = '/account/dashboard'
export const CRM_PATH = '/crm'
export const LEGACY_DASHBOARD_PATH = '/dashboard'

export function getSessionRoleSlugs(session: AuthSession | null): string[] {
  if (!session) return []

  const roles: string[] = [
    normalizeAuthRoleSlug(session.activeRole ?? session.role),
    normalizeAuthRoleSlug(session.role),
    ...session.roles.map((role) => normalizeAuthRoleSlug(role.slug ?? role.name)),
  ]

  return Array.from(new Set(roles))
}

export function canAccessRoute(route: AppRoute, session: AuthSession | null): boolean {
  if (!route.requiresAuth && !route.authority?.length && !route.requiresNonUser) {
    return true
  }

  if (!session) return false

  const activeRole = normalizeAuthRoleSlug(session.activeRole ?? session.role)
  const sessionRoles = getSessionRoleSlugs(session)

  if (
    route.requiresNonUser &&
    route.path !== '/account/dashboard' &&
    !sessionRoles.some((role) => DASHBOARD_ROLES.includes(role as any))
  ) {
    return false
  }

  if (
    route.path === '/manage-ads' ||
    route.path === '/account/manage-ads' ||
    route.path.startsWith('/account/ad-management')
  ) {
    return true
  }

  if (route.path === `${DASHBOARD_PATH}/ads`) {
    if (session.managerPermissions?.manage_advertises === false) {
      return false
    }
    return true
  }

  if (activeRole === REAL_ESTATE_CONSULTANT) {
    const permissions = session.managerPermissions ?? {}
    if (route.path.startsWith(`${DASHBOARD_PATH}/requests`)) {
      return Boolean(permissions.manage_requests)
    }
    if (route.path.startsWith(`${DASHBOARD_PATH}/team`) && permissions.manage_consultants) {
      return true
    }
    if (route.path.startsWith(`${DASHBOARD_PATH}/payments`) && permissions.manage_credits) {
      return true
    }
  }

  if (activeRole === REAL_ESTATE_MANAGER && session.managerPermissions) {
    const permissions = session.managerPermissions
    if (route.path.startsWith(`${DASHBOARD_PATH}/team`) && !permissions.manage_consultants) {
      return false
    }
    if (route.path.startsWith(`${DASHBOARD_PATH}/requests`) && !permissions.manage_requests) {
      return false
    }
    if (route.path.startsWith(`${DASHBOARD_PATH}/payments`) && !permissions.manage_credits) {
      return false
    }
  }

  if (route.authority?.length) {
    if (route.layout === 'dashboard' || route.path.startsWith(`${DASHBOARD_PATH}/`)) {
      return route.authority.includes(activeRole)
    }
    return route.authority.some((role) => sessionRoles.includes(role))
  }

  return true
}
