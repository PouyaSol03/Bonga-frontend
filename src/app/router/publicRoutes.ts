import { lazyNamed, type AppRoute } from './types'

const HomePage = lazyNamed(() => import('../../features/home/HomePage'), 'HomePage')
const OnboardingPage = lazyNamed(() => import('../../features/onboarding/OnboardingPage'), 'OnboardingPage')
const SearchMapPage = lazyNamed(() => import('../../features/search/SearchMapPage'), 'SearchMapPage')
const SearchMapFilterPage = lazyNamed(() => import('../../features/search/SearchMapFilterPage'), 'SearchMapFilterPage')
const ConsultantsDirectoryPage = lazyNamed(() => import('../../features/consultants/ConsultantsDirectoryPage'), 'ConsultantsDirectoryPage')
const ConsultantsNeighborhoodPage = lazyNamed(() => import('../../features/consultants/ConsultantsNeighborhoodPage'), 'ConsultantsNeighborhoodPage')

const ViewAdPage = lazyNamed(() => import('../../features/advertisements/view/ViewAdPage'), 'ViewAdPage')
const ViewAdPropertyInfoPage = lazyNamed(() => import('../../features/advertisements/view/pages/ViewAdPropertyInfoPage'), 'ViewAdPropertyInfoPage')
const ViewAdEquipmentFacilitiesPage = lazyNamed(() => import('../../features/advertisements/view/pages/ViewAdEquipmentFacilitiesPage'), 'ViewAdEquipmentFacilitiesPage')
const ViewAdHotelRoomsPage = lazyNamed(() => import('../../features/advertisements/view/pages/ViewAdHotelRoomsPage'), 'ViewAdHotelRoomsPage')
const ViewAdProjectDetailsPage = lazyNamed(() => import('../../features/advertisements/view/pages/ViewAdProjectDetailsPage'), 'ViewAdProjectDetailsPage')

const PublicAgencyPreviewPage = lazyNamed(() => import('../../features/dashboard/AgencyPreviewPage'), 'AgencyPreviewPage')
const AgencyQrCodePage = lazyNamed(() => import('../../features/dashboard/AgencyPreviewPage'), 'AgencyQrCodePage')

export const publicRoutes: AppRoute[] = [
  { path: '/', title: 'بنگاه', Component: OnboardingPage },
  { path: '/home', title: 'خانه', Component: HomePage },
  { path: '/search', title: 'جستجو', Component: SearchMapPage },
  { path: '/search/filter', title: 'فیلتر جستجو', Component: SearchMapFilterPage },
  { path: '/consultants', title: 'بانک مشاورین', Component: ConsultantsDirectoryPage },
  { path: '/consultants/neighborhood', title: 'محله‌های مشاور', Component: ConsultantsNeighborhoodPage },

  // Public Agencies and Consultants
  { path: '/agencies/:id', title: 'صفحه آژانس', Component: PublicAgencyPreviewPage },
  { path: '/agents/:id', title: 'صفحه مشاور', Component: PublicAgencyPreviewPage },
  { path: '/agencies/:id/qr-code', title: 'کیوآرکد آژانس', Component: AgencyQrCodePage },
  { path: '/agents/:id/qr-code', title: 'کیوآرکد مشاور', Component: AgencyQrCodePage },

  // Public Advertisements
  { path: '/ads/:id', title: 'آگهی', Component: ViewAdPage },
  { path: '/ads/:id/property-info', title: 'اطلاعات ملک', Component: ViewAdPropertyInfoPage },
  { path: '/ads/:id/equipment-facilities', title: 'تجهیزات و امکانات', Component: ViewAdEquipmentFacilitiesPage },
  { path: '/ads/:id/hotel-rooms', title: 'اطلاعات هتل', Component: ViewAdHotelRoomsPage },
  { path: '/ads/:id/project-details', title: 'اطلاعات پروژه', Component: ViewAdProjectDetailsPage },

  // Preview Ad (authenticated ad review preview)
  { path: '/preview-ad/:id', title: 'پیش‌نمایش آگهی', Component: ViewAdPage, requiresAuth: true },
  { path: '/preview-ad/:id/property-info', title: 'پیش‌نمایش اطلاعات ملک', Component: ViewAdPropertyInfoPage, requiresAuth: true },
  { path: '/preview-ad/:id/equipment-facilities', title: 'پیش‌نمایش تجهیزات و امکانات', Component: ViewAdEquipmentFacilitiesPage, requiresAuth: true },
  { path: '/preview-ad/:id/hotel-rooms', title: 'پیش‌نمایش اطلاعات هتل', Component: ViewAdHotelRoomsPage, requiresAuth: true },
  { path: '/preview-ad/:id/project-details', title: 'پیش‌نمایش اطلاعات پروژه', Component: ViewAdProjectDetailsPage, requiresAuth: true },
]
