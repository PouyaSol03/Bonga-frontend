import {
  CRM_ADVERTISE_ROLES,
  CRM_FINANCE_ROLES,
  CRM_PANEL_ROLES,
  CRM_SUPPORT_ROLES,
  SUPER_ADMIN,
} from '../../shared/constants/roles.constants'
import {
  normalizeAuthRoleSlug,
  type AuthSession,
} from '../../shared/auth/auth-storage'
import { lazyNamed, type AppRoute, CRM_PATH } from './types'

const CrmOverviewPage = lazyNamed(() => import('../../features/crm/routes/CrmOverviewPage'), 'CrmOverviewPage')
const CrmAdvertisesPage = lazyNamed(() => import('../../features/crm/routes/CrmAdvertisesPage'), 'CrmAdvertisesPage')
const CrmAdvertiseDetailPage = lazyNamed(() => import('../../features/crm/routes/CrmAdvertiseDetailPage'), 'CrmAdvertiseDetailPage')
const CrmUsersPage = lazyNamed(() => import('../../features/crm/routes/CrmUsersPage'), 'CrmUsersPage')
const CrmConsultantsPage = lazyNamed(() => import('../../features/crm/routes/CrmConsultantsPage'), 'CrmConsultantsPage')
const CrmAgenciesPage = lazyNamed(() => import('../../features/crm/routes/CrmAgenciesPage'), 'CrmAgenciesPage')
const CrmCategoriesPage = lazyNamed(() => import('../../features/crm/routes/CrmCategoriesPage'), 'CrmCategoriesPage')
const CrmLocationsPage = lazyNamed(() => import('../../features/crm/routes/CrmLocationsPage'), 'CrmLocationsPage')
const CrmLocationMapPage = lazyNamed(() => import('../../features/crm/routes/CrmLocationMapPage'), 'CrmLocationMapPage')
const CrmFormsPage = lazyNamed(() => import('../../features/crm/routes/CrmFormsPage'), 'CrmFormsPage')
const CrmPackagesPage = lazyNamed(() => import('../../features/crm/routes/CrmPackagesPage'), 'CrmPackagesPage')
const CrmPaymentsPage = lazyNamed(() => import('../../features/crm/routes/CrmPaymentsPage'), 'CrmPaymentsPage')
const CrmCostsPage = lazyNamed(() => import('../../features/crm/routes/CrmCostsPage'), 'CrmCostsPage')
const CrmReportsPage = lazyNamed(() => import('../../features/crm/routes/CrmReportsPage'), 'CrmReportsPage')
const CrmSupportRequestsPage = lazyNamed(() => import('../../features/crm/routes/CrmSupportRequestsPage'), 'CrmSupportRequestsPage')
const CrmPropertyRequestsPage = lazyNamed(() => import('../../features/crm/routes/CrmPropertyRequestsPage'), 'CrmPropertyRequestsPage')
const CrmSupportPage = lazyNamed(() => import('../../features/crm/routes/CrmSupportPage'), 'CrmSupportPage')
const CrmDiscountsPage = lazyNamed(() => import('../../features/crm/routes/CrmDiscountsPage'), 'CrmDiscountsPage')
const CrmFeedbackPage = lazyNamed(() => import('../../features/crm/routes/CrmFeedbackPage'), 'CrmFeedbackPage')

export function getDefaultCrmPath(session: AuthSession | null): string {
  if (!session) return CRM_PATH

  const activeRole = normalizeAuthRoleSlug(session.activeRole ?? session.role)
  if (activeRole === SUPER_ADMIN) {
    return CRM_PATH
  }

  return `${CRM_PATH}/advertises`
}

export const crmRoutes: AppRoute[] = [
  { path: CRM_PATH, title: 'مرکز مدیریت کل', Component: CrmOverviewPage, crmSection: 'overview', authority: CRM_PANEL_ROLES, layout: 'crm', requiresAuth: true },
  { path: `${CRM_PATH}/advertises`, title: 'مدیریت آگهی‌ها', Component: CrmAdvertisesPage, crmSection: 'advertises', authority: CRM_ADVERTISE_ROLES, layout: 'crm', requiresAuth: true },
  { path: `${CRM_PATH}/advertises/:id`, title: 'جزئیات آگهی', Component: CrmAdvertiseDetailPage, crmSection: 'advertises', authority: CRM_ADVERTISE_ROLES, layout: 'crm', requiresAuth: true },
  { path: `${CRM_PATH}/users`, title: 'مدیریت کاربران', Component: CrmUsersPage, crmSection: 'users', authority: [SUPER_ADMIN], layout: 'crm', requiresAuth: true },
  { path: `${CRM_PATH}/consultants`, title: 'مدیریت مشاورین', Component: CrmConsultantsPage, crmSection: 'consultants', authority: [SUPER_ADMIN], layout: 'crm', requiresAuth: true },
  { path: `${CRM_PATH}/agencies`, title: 'مدیریت آژانس‌ها', Component: CrmAgenciesPage, crmSection: 'agencies', authority: [SUPER_ADMIN], layout: 'crm', requiresAuth: true },
  { path: `${CRM_PATH}/categories`, title: 'دسته‌بندی‌ها', Component: CrmCategoriesPage, crmSection: 'categories', authority: [SUPER_ADMIN], layout: 'crm', requiresAuth: true },
  { path: `${CRM_PATH}/locations`, title: 'مدیریت موقعیت‌ها', Component: CrmLocationsPage, crmSection: 'locations', authority: [SUPER_ADMIN], layout: 'crm', requiresAuth: true },
  { path: `${CRM_PATH}/locations/map`, title: 'نقشه مرزبندی موقعیت‌ها', Component: CrmLocationMapPage, crmSection: 'locations', authority: [SUPER_ADMIN], layout: 'crm', requiresAuth: true },
  { path: `${CRM_PATH}/forms`, title: 'فرم‌های آگهی', Component: CrmFormsPage, crmSection: 'forms', authority: [SUPER_ADMIN], layout: 'crm', requiresAuth: true },
  { path: `${CRM_PATH}/packages`, title: 'بسته‌ها و اعتبار پنل', Component: CrmPackagesPage, crmSection: 'packages', authority: CRM_FINANCE_ROLES, layout: 'crm', requiresAuth: true },
  { path: `${CRM_PATH}/payments`, title: 'تاریخچه پرداخت‌ها', Component: CrmPaymentsPage, crmSection: 'payments', authority: CRM_FINANCE_ROLES, layout: 'crm', requiresAuth: true },
  { path: `${CRM_PATH}/costs`, title: 'مدیریت هزینه‌ها', Component: CrmCostsPage, crmSection: 'costs', authority: CRM_FINANCE_ROLES, layout: 'crm', requiresAuth: true },
  { path: `${CRM_PATH}/reports`, title: 'گزارش‌های تخلف', Component: CrmReportsPage, crmSection: 'reports', authority: [SUPER_ADMIN], layout: 'crm', requiresAuth: true },
  { path: `${CRM_PATH}/requests`, title: 'درخواست‌های پشتیبانی', Component: CrmSupportRequestsPage, crmSection: 'requests', authority: [SUPER_ADMIN], layout: 'crm', requiresAuth: true },
  { path: `${CRM_PATH}/property-requests`, title: 'درخواست‌های یافتن آگهی', Component: CrmPropertyRequestsPage, crmSection: 'propertyRequests', authority: [SUPER_ADMIN], layout: 'crm', requiresAuth: true },
  { path: `${CRM_PATH}/support`, title: 'پشتیبانی', Component: CrmSupportPage, crmSection: 'support', authority: CRM_SUPPORT_ROLES, layout: 'crm', requiresAuth: true },
  { path: `${CRM_PATH}/discounts`, title: 'مدیریت کدهای تخفیف', Component: CrmDiscountsPage, crmSection: 'discounts', authority: [SUPER_ADMIN], layout: 'crm', requiresAuth: true },
  { path: `${CRM_PATH}/feedback`, title: 'معیارهای بازخورد', Component: CrmFeedbackPage, crmSection: 'feedback', authority: [SUPER_ADMIN], layout: 'crm', requiresAuth: true },
]
