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
