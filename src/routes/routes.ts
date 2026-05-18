import type { ComponentType } from 'react'
import { NewAdComingSoonPage } from '../pages/ComingSoonPage'
import { HomePage } from '../pages/HomePage'
import { LoginPhonePage } from '../pages/LoginPhonePage'
import { LoginVerifyPage } from '../pages/LoginVerifyPage'
import { MyAccountPage } from '../pages/MyAccountPage'
import { PublicLandingPage } from '../pages/PublicLandingPage'
import { SearchMapPage } from '../pages/search/SearchMapPage'
import { UserChatHomePage } from '../pages/UserChatHomePage'

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
    path: "/chat",
    title: "Chat",
    Component: UserChatHomePage,
  },
]
