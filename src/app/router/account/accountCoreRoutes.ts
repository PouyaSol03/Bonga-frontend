import { lazyNamed, type AppRoute } from "../types";

const MyAccountPage = lazyNamed(
  () => import("../../../features/account/MyAccountPage"),
  "MyAccountPage",
);
const AccountProfilePage = lazyNamed(
  () => import("../../../features/account/routes/AccountProfilePage"),
  "AccountProfilePage",
);
const AccountIdentityPage = lazyNamed(
  () => import("../../../features/account/routes/AccountIdentityPage"),
  "AccountIdentityPage",
);
const AccountAboutPage = lazyNamed(
  () => import("../../../features/account/routes/AccountAboutPage"),
  "AccountAboutPage",
);
const AccountDeleteUserPage = lazyNamed(
  () => import("../../../features/account/AccountDeleteUserPage"),
  "AccountDeleteUserPage",
);
const AccountBookmarksPage = lazyNamed(
  () => import("../../../features/account/routes/AccountBookmarksPage"),
  "AccountBookmarksPage",
);
const AccountNotesPage = lazyNamed(
  () => import("../../../features/account/routes/AccountNotesPage"),
  "AccountNotesPage",
);
const AccountRecentViewsPage = lazyNamed(
  () => import("../../../features/account/routes/AccountRecentViewsPage"),
  "AccountRecentViewsPage",
);
const AccountRequestsPage = lazyNamed(
  () => import("../../../features/account/routes/AccountRequestsPage"),
  "AccountRequestsPage",
);
const AccountWalletPage = lazyNamed(
  () => import("../../../features/account/routes/AccountWalletPage"),
  "AccountWalletPage",
);
const AccountWalletHistoryPage = lazyNamed(
  () => import("../../../features/account/routes/AccountWalletHistoryPage"),
  "AccountWalletHistoryPage",
);

export const accountCoreRoutes: AppRoute[] = [
  { path: "/account", title: "حساب کاربری", Component: MyAccountPage },
  {
    path: "/account/profile",
    title: "ویرایش مشخصات فردی",
    Component: AccountProfilePage,
    requiresAuth: true,
  },
  {
    path: "/account/identity",
    title: "احراز هویت",
    Component: AccountIdentityPage,
    requiresAuth: true,
  },
  { path: "/account/about", title: "درباره ما", Component: AccountAboutPage },
  {
    path: "/account/delete-user",
    title: "حذف حساب کاربری",
    Component: AccountDeleteUserPage,
    requiresAuth: true,
  },
  {
    path: "/account/bookmarks",
    title: "نشان‌ها",
    Component: AccountBookmarksPage,
    requiresAuth: true,
  },
  { path: "/account/notes", title: "یادداشت‌ها", Component: AccountNotesPage, requiresAuth: true },
  {
    path: "/account/recent-views",
    title: "بازدیدهای اخیر",
    Component: AccountRecentViewsPage,
    requiresAuth: true,
  },
  {
    path: "/account/requests",
    title: "درخواست‌های ملکی من",
    Component: AccountRequestsPage,
    requiresAuth: true,
  },
  { path: "/account/wallet", title: "کیف پول", Component: AccountWalletPage, requiresAuth: true },
  {
    path: "/account/wallet/history",
    title: "تاریخچه کیف پول",
    Component: AccountWalletHistoryPage,
    requiresAuth: true,
  },
];
