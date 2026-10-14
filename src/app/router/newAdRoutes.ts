import { lazyNamed, type AppRoute } from './types'

const NewAdCategoryPage = lazyNamed(() => import('../../features/advertisements/create/NewAdCategoryPage'), 'NewAdCategoryPage')
const NewAdFlowPage = lazyNamed(() => import('../../features/advertisements/create/NewAdFlowPage'), 'NewAdFlowPage')
const NewAdLocationPage = lazyNamed(() => import('../../features/advertisements/create/NewAdLocationPage'), 'NewAdLocationPage')

export const newAdRoutes: AppRoute[] = [
  { path: '/new-ad', title: 'ثبت آگهی', Component: NewAdCategoryPage, requiresAuth: true },
  { path: '/new-ad/category', title: 'ثبت آگهی', Component: NewAdCategoryPage, requiresAuth: true },
  { path: '/new-ad/category/next', title: 'ثبت آگهی', Component: NewAdCategoryPage, requiresAuth: true },
  { path: '/new-ad/details', title: 'ثبت آگهی', Component: NewAdFlowPage, requiresAuth: true },
  { path: '/new-ad/location', title: 'موقعیت ملک', Component: NewAdLocationPage, requiresAuth: true },
  { path: '/new-ad/personal', title: 'ثبت آگهی', Component: NewAdCategoryPage, requiresAuth: true },
  { path: '/new-ad/independent-consultant', title: 'ثبت آگهی', Component: NewAdCategoryPage, requiresAuth: true },
  { path: '/new-ad/agency', title: 'ثبت آگهی', Component: NewAdCategoryPage, requiresAuth: true },
  { path: '/new-ad/agency-consultant', title: 'ثبت آگهی', Component: NewAdCategoryPage, requiresAuth: true },
  { path: '/new-ad/jaliliyan-agency', title: 'ثبت آگهی', Component: NewAdCategoryPage, requiresAuth: true },
]
