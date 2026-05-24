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
import { UserChatDetailPage, UserChatHomePage } from '../pages/UserChatHomePage'

export type AppRoute = {
  path: string
  title: string
  Component: ComponentType
}

export const routes: AppRoute[] = [
  {
    path: '/',
    title: 'Landing',
    Component: PublicLandingPage,
  },
  {
    path: '/login',
    title: 'My Account',
    Component: MyAccountPage,
  },
  {
    path: '/login/phone',
    title: 'Login',
    Component: LoginPhonePage,
  },
  {
    path: '/login/verify',
    title: 'Verify Login',
    Component: LoginVerifyPage,
  },
  {
    path: '/account/profile',
    title: 'My Profile',
    Component: AccountProfilePage,
  },
  {
    path: '/account/identity',
    title: 'Identity Verification',
    Component: AccountIdentityPage,
  },
  {
    path: '/account/my-ads',
    title: 'My Ads',
    Component: AccountMyAdsPage,
  },
  {
    path: '/account/my-ads/empty',
    title: 'My Ads Empty',
    Component: AccountMyAdsEmptyPage,
  },
  {
    path: '/account/wallet',
    title: 'Wallet',
    Component: AccountWalletPage,
  },
  {
    path: '/account/wallet/history',
    title: 'Wallet History',
    Component: AccountWalletHistoryPage,
  },
  {
    path: '/account/notes',
    title: 'Notes',
    Component: AccountNotesPage,
  },
  {
    path: '/account/bookmarks',
    title: 'Bookmarks',
    Component: AccountBookmarksPage,
  },
  {
    path: '/account/recent-views',
    title: 'Recent Views',
    Component: AccountRecentViewsPage,
  },
  {
    path: '/account/requests',
    title: 'Requests',
    Component: AccountRequestsPage,
  },
  {
    path: '/account/about',
    title: 'About Us',
    Component: AccountAboutPage,
  },
  {
    path: '/account/dashboard',
    title: 'Dashboard',
    Component: IndependentConsultantDashboardPage,
  },
  {
    path: '/account/ranking',
    title: 'Consultant Ranking',
    Component: IndependentConsultantRankingPage,
  },
  {
    path: '/account/ranking/levels',
    title: 'Consultant Ranking Levels',
    Component: IndependentConsultantRankingLevelsPage,
  },
  {
    path: '/account/ranking/badges/guide',
    title: 'Consultant Badges Guide',
    Component: IndependentConsultantBadgesGuidePage,
  },
  {
    path: '/account/ranking/badges/file',
    title: 'Consultant File Badge',
    Component: IndependentConsultantFileBadgePage,
  },
  {
    path: '/account/ranking/badges/magnet',
    title: 'Consultant Magnet Badge',
    Component: IndependentConsultantMagnetBadgePage,
  },
  {
    path: '/account/ranking/badges/response',
    title: 'Consultant Response Badge',
    Component: IndependentConsultantResponseBadgePage,
  },
  {
    path: '/account/ranking/badges/time',
    title: 'Consultant Time Badge',
    Component: IndependentConsultantTimeBadgePage,
  },
  {
    path: '/account/ad-management',
    title: 'Ad Management',
    Component: IndependentConsultantAdManagementPage,
  },
  {
    path: '/account/ad-management/filter',
    title: 'Ad Management Filters',
    Component: IndependentConsultantAdFilterPage,
  },
  {
    path: '/account/ad-management/search',
    title: 'Ad Management Search',
    Component: IndependentConsultantAdSearchPage,
  },
  {
    path: '/account/ad-management/allocation',
    title: 'Ad Allocation',
    Component: IndependentConsultantAdAllocationPage,
  },
  {
    path: '/account/ad-management/payment',
    title: 'Ad Payment',
    Component: IndependentConsultantAdPaymentPage,
  },
  {
    path: '/account/ad-management/published',
    title: 'Published Ad',
    Component: IndependentConsultantAdPublishedPage,
  },
  {
    path: '/account/ad-management/published/edit',
    title: 'Edit Published Ad',
    Component: IndependentConsultantAdEditPage,
  },
  {
    path: '/account/ad-management/statistics',
    title: 'Ad Statistics',
    Component: IndependentConsultantAdStatisticsPage,
  },
  {
    path: '/account/ad-management/statistics/details',
    title: 'Ad Statistics Details',
    Component: IndependentConsultantAdStatisticsDetailsPage,
  },
  {
    path: '/account/credit/panel',
    title: 'Consultant Panel Credit',
    Component: IndependentConsultantPanelCreditPage,
  },
  {
    path: '/account/credit/panel/bonus',
    title: 'Consultant Panel Credit Benefits',
    Component: IndependentConsultantPanelCreditBonusPage,
  },
  {
    path: '/account/credit/packages',
    title: 'Consultant Credit Packages',
    Component: IndependentConsultantCreditPackagesPage,
  },
  {
    path: '/account/credit/history',
    title: 'Consultant Credit Payment History',
    Component: IndependentConsultantCreditHistoryPage,
  },
  {
    path: '/home',
    title: 'Home',
    Component: HomePage,
  },
  {
    path: "/search",
    title: "Search",
    Component: SearchMapPage,
  },
  {
    path: "/new-ad",
    title: "New Ad",
    Component: NewAdComingSoonPage,
  },
  {
    path: "/new-ad/category",
    title: "New Ad Category",
    Component: NewAdCategoryPage,
  },
  {
    path: "/new-ad/personal",
    title: "New Ad Category",
    Component: NewAdCategoryPage,
  },
  {
    path: "/new-ad/category/next",
    title: "New Ad",
    Component: NewAdComingSoonPage,
  },
  {
    path: "/new-ad/independent-consultant",
    title: "New Ad",
    Component: NewAdComingSoonPage,
  },
  {
    path: "/new-ad/jaliliyan-agency",
    title: "New Ad",
    Component: NewAdComingSoonPage,
  },
  {
    path: "/chat",
    title: "Chat",
    Component: UserChatHomePage,
  },
  {
    path: "/chat/1",
    title: "Chat Detail",
    Component: UserChatDetailPage,
  },
  {
    path: "/chat/2",
    title: "Chat Detail",
    Component: UserChatDetailPage,
  },
  {
    path: "/chat/3",
    title: "Chat Detail",
    Component: UserChatDetailPage,
  },
  {
    path: "/chat/4",
    title: "Chat Detail",
    Component: UserChatDetailPage,
  },
  {
    path: "/chat/5",
    title: "Chat Detail",
    Component: UserChatDetailPage,
  },
]
