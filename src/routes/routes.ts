import type { ComponentType } from 'react'
import { NewAdComingSoonPage } from '../pages/ComingSoonPage'
import { HomePage } from '../pages/HomePage'
import { LoginPhonePage } from '../pages/LoginPhonePage'
import { LoginVerifyPage } from '../pages/LoginVerifyPage'
import { MyAccountPage } from '../pages/MyAccountPage'
import { NewAdCategoryPage } from '../pages/newAd/NewAdCategoryPage'
import { PublicLandingPage } from '../pages/PublicLandingPage'
import {
  AccountAboutPage,
  AccountBookmarksPage,
  AccountIdentityPage,
  AccountMyAdsEmptyPage,
  AccountMyAdsPage,
  AccountNotesPage,
  AccountProfilePage,
  AccountRecentViewsPage,
  AccountRequestsPage,
  AccountWalletHistoryPage,
  AccountWalletPage,
} from '../pages/account/AccountSubPages'
import { IndependentConsultantDashboardPage } from '../pages/account/IndependentConsultantDashboardPage'
import { IndependentConsultantRankingPage } from '../pages/account/IndependentConsultantRankingPage'
import { IndependentConsultantRankingLevelsPage } from '../pages/account/IndependentConsultantRankingLevelsPage'
import { IndependentConsultantBadgesGuidePage } from '../pages/account/IndependentConsultantBadgesGuidePage'
import {
  IndependentConsultantFileBadgePage,
  IndependentConsultantMagnetBadgePage,
  IndependentConsultantResponseBadgePage,
  IndependentConsultantTimeBadgePage,
} from '../pages/account/IndependentConsultantBadgeDetailsPage'
import { IndependentConsultantAdManagementPage } from '../pages/account/IndependentConsultantAdManagementPage'
import { IndependentConsultantAdAllocationPage } from '../pages/account/adManagement/IndependentConsultantAdAllocationPage'
import { IndependentConsultantAdEditPage } from '../pages/account/adManagement/IndependentConsultantAdEditPage'
import { IndependentConsultantAdFilterPage } from '../pages/account/adManagement/IndependentConsultantAdFilterPage'
import { IndependentConsultantAdPaymentPage } from '../pages/account/adManagement/IndependentConsultantAdPaymentPage'
import { IndependentConsultantAdPublishedPage } from '../pages/account/adManagement/IndependentConsultantAdPublishedPage'
import { IndependentConsultantAdSearchPage } from '../pages/account/adManagement/IndependentConsultantAdSearchPage'
import { IndependentConsultantAdStatisticsDetailsPage } from '../pages/account/adManagement/IndependentConsultantAdStatisticsDetailsPage'
import { IndependentConsultantAdStatisticsPage } from '../pages/account/adManagement/IndependentConsultantAdStatisticsPage'
import {
  IndependentConsultantCreditPackagesPage,
  IndependentConsultantPanelCreditBonusPage,
  IndependentConsultantPanelCreditPage,
} from '../pages/account/credit/IndependentConsultantCreditPage'
import { IndependentConsultantCreditHistoryPage } from '../pages/account/credit/IndependentConsultantCreditHistoryPage'
import { SearchMapPage } from '../pages/search/SearchMapPage'
import { SearchMapFilterPage } from '../pages/search/SearchMapFilterPage'
import { UserChatDetailPage, UserChatHomePage } from '../pages/UserChatHomePage'

export type AppRoute = {
  path: string
  title: string
  Component: ComponentType
}

export const routes: AppRoute[] = [
  {
    path: '/',
    title: 'بنگاه',
    Component: PublicLandingPage,
  },
  {
    path: '/login',
    title: 'حساب من',
    Component: MyAccountPage,
  },
  {
    path: '/login/phone',
    title: 'ورود به حساب کاربری',
    Component: LoginPhonePage,
  },
  {
    path: '/login/verify',
    title: 'ورود به حساب کاربری',
    Component: LoginVerifyPage,
  },
  {
    path: '/account/profile',
    title: 'مشخصات من',
    Component: AccountProfilePage,
  },
  {
    path: '/account/identity',
    title: 'تایید هویت',
    Component: AccountIdentityPage,
  },
  {
    path: '/account/my-ads',
    title: 'آگهی‌های من',
    Component: AccountMyAdsPage,
  },
  {
    path: '/account/my-ads/empty',
    title: 'آگهی‌های من',
    Component: AccountMyAdsEmptyPage,
  },
  {
    path: '/account/wallet',
    title: 'کیف پول',
    Component: AccountWalletPage,
  },
  {
    path: '/account/wallet/history',
    title: 'تاریخچه پرداخت کیف پول',
    Component: AccountWalletHistoryPage,
  },
  {
    path: '/account/notes',
    title: 'یادداشت‌ها',
    Component: AccountNotesPage,
  },
  {
    path: '/account/bookmarks',
    title: 'نشان‌ها',
    Component: AccountBookmarksPage,
  },
  {
    path: '/account/recent-views',
    title: 'بازدیدهای اخیر',
    Component: AccountRecentViewsPage,
  },
  {
    path: '/account/requests',
    title: 'درخواست‌ها',
    Component: AccountRequestsPage,
  },
  {
    path: '/account/about',
    title: 'درباره ما',
    Component: AccountAboutPage,
  },
  {
    path: '/account/dashboard',
    title: 'داشبورد',
    Component: IndependentConsultantDashboardPage,
  },
  {
    path: '/account/ranking',
    title: 'نشان‌ها و رتبه',
    Component: IndependentConsultantRankingPage,
  },
  {
    path: '/account/ranking/levels',
    title: 'سطح پیشرفت مشاور',
    Component: IndependentConsultantRankingLevelsPage,
  },
  {
    path: '/account/ranking/badges/guide',
    title: 'راهنمای نشان‌ها',
    Component: IndependentConsultantBadgesGuidePage,
  },
  {
    path: '/account/ranking/badges/file',
    title: 'جزئیات نشان',
    Component: IndependentConsultantFileBadgePage,
  },
  {
    path: '/account/ranking/badges/magnet',
    title: 'جزئیات نشان',
    Component: IndependentConsultantMagnetBadgePage,
  },
  {
    path: '/account/ranking/badges/response',
    title: 'جزئیات نشان',
    Component: IndependentConsultantResponseBadgePage,
  },
  {
    path: '/account/ranking/badges/time',
    title: 'جزئیات نشان',
    Component: IndependentConsultantTimeBadgePage,
  },
  {
    path: '/account/ad-management',
    title: 'مدیریت آگهی‌ها',
    Component: IndependentConsultantAdManagementPage,
  },
  {
    path: '/account/ad-management/filter',
    title: 'فیلتر',
    Component: IndependentConsultantAdFilterPage,
  },
  {
    path: '/account/ad-management/search',
    title: 'جستجوی آگهی',
    Component: IndependentConsultantAdSearchPage,
  },
  {
    path: '/account/ad-management/allocation',
    title: 'انتشار آگهی',
    Component: IndependentConsultantAdAllocationPage,
  },
  {
    path: '/account/ad-management/payment',
    title: 'انتشار آگهی',
    Component: IndependentConsultantAdPaymentPage,
  },
  {
    path: '/account/ad-management/published',
    title: 'مدیریت آگهی',
    Component: IndependentConsultantAdPublishedPage,
  },
  {
    path: '/account/ad-management/published/edit',
    title: 'ثبت آگهی',
    Component: IndependentConsultantAdEditPage,
  },
  {
    path: '/account/ad-management/statistics',
    title: 'آمار آگهی‌ها',
    Component: IndependentConsultantAdStatisticsPage,
  },
  {
    path: '/account/ad-management/statistics/details',
    title: 'جزئیات آمار آگهی',
    Component: IndependentConsultantAdStatisticsDetailsPage,
  },
  {
    path: '/account/credit/panel',
    title: 'افزایش اعتبار',
    Component: IndependentConsultantPanelCreditPage,
  },
  {
    path: '/account/credit/panel/bonus',
    title: 'افزایش اعتبار',
    Component: IndependentConsultantPanelCreditBonusPage,
  },
  {
    path: '/account/credit/packages',
    title: 'افزایش اعتبار',
    Component: IndependentConsultantCreditPackagesPage,
  },
  {
    path: '/account/credit/history',
    title: 'تاریخچه پرداخت',
    Component: IndependentConsultantCreditHistoryPage,
  },
  {
    path: '/home',
    title: 'خانه',
    Component: HomePage,
  },
  {
    path: "/search",
    title: "جستجو",
    Component: SearchMapPage,
  },
  {
    path: "/search/filter",
    title: "فیلترها",
    Component: SearchMapFilterPage,
  },
  {
    path: "/new-ad",
    title: "ثبت آگهی",
    Component: NewAdComingSoonPage,
  },
  {
    path: "/new-ad/category",
    title: "دسته‌بندی آگهی",
    Component: NewAdCategoryPage,
  },
  {
    path: "/new-ad/personal",
    title: "دسته‌بندی آگهی",
    Component: NewAdCategoryPage,
  },
  {
    path: "/new-ad/category/next",
    title: "ثبت آگهی",
    Component: NewAdComingSoonPage,
  },
  {
    path: "/new-ad/independent-consultant",
    title: "ثبت آگهی",
    Component: NewAdComingSoonPage,
  },
  {
    path: "/new-ad/jaliliyan-agency",
    title: "ثبت آگهی",
    Component: NewAdComingSoonPage,
  },
  {
    path: "/chat",
    title: "چت و اعلان‌ها",
    Component: UserChatHomePage,
  },
  {
    path: "/chat/1",
    title: "چت",
    Component: UserChatDetailPage,
  },
  {
    path: "/chat/2",
    title: "چت",
    Component: UserChatDetailPage,
  },
  {
    path: "/chat/3",
    title: "چت",
    Component: UserChatDetailPage,
  },
  {
    path: "/chat/4",
    title: "چت",
    Component: UserChatDetailPage,
  },
  {
    path: "/chat/5",
    title: "چت",
    Component: UserChatDetailPage,
  },
]
