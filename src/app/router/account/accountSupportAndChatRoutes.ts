import { lazyNamed, type AppRoute } from "../types";

// Support & Notifications
const AccountSupportPage = lazyNamed(
  () => import("../../../features/account/routes/AccountSupportPage"),
  "AccountSupportPage",
);
const AccountSupportChatPage = lazyNamed(
  () => import("../../../features/account/routes/AccountSupportChatPage"),
  "AccountSupportChatPage",
);
const AccountSupportNewChatPage = lazyNamed(
  () => import("../../../features/account/routes/AccountSupportNewChatPage"),
  "AccountSupportNewChatPage",
);
const AccountSupportRequestsPage = lazyNamed(
  () => import("../../../features/account/routes/AccountSupportRequestsPage"),
  "AccountSupportRequestsPage",
);
const AccountSupportNewRequestPage = lazyNamed(
  () => import("../../../features/account/routes/AccountSupportNewRequestPage"),
  "AccountSupportNewRequestPage",
);
const AccountSupportFaqPage = lazyNamed(
  () => import("../../../features/account/AccountSupportFaqPage"),
  "AccountSupportFaqPage",
);
const NotificationsPage = lazyNamed(
  () => import("../../../features/notifications/NotificationsPage"),
  "NotificationsPage",
);
const NotificationManagementPage = lazyNamed(
  () => import("../../../features/notifications/NotificationsPage"),
  "NotificationManagementPage",
);

// Chat
const UserChatHomePage = lazyNamed(
  () => import("../../../features/chat/UserChatHomePage"),
  "UserChatHomePage",
);
const UserChatDetailPage = lazyNamed(
  () => import("../../../features/chat/UserChatHomePage"),
  "UserChatDetailPage",
);
const UserChatBulkDeletePage = lazyNamed(
  () => import("../../../features/chat/UserChatHomePage"),
  "UserChatBulkDeletePage",
);
const UserChatResponseTimePage = lazyNamed(
  () => import("../../../features/chat/UserChatHomePage"),
  "UserChatResponseTimePage",
);
const UserChatRenamePage = lazyNamed(
  () => import("../../../features/chat/UserChatHomePage"),
  "UserChatRenamePage",
);
const ChatReportPage = lazyNamed(
  () => import("../../../features/chat/ChatReportPage"),
  "ChatReportPage",
);

export const accountSupportAndChatRoutes: AppRoute[] = [
  // Support
  { path: "/account/support", title: "پشتیبانی", Component: AccountSupportPage },
  { path: "/account/support/chat", title: "پشتیبانی آنلاین", Component: AccountSupportChatPage },
  {
    path: "/account/support/chat/new",
    title: "پشتیبانی آنلاین",
    Component: AccountSupportNewChatPage,
  },
  {
    path: "/account/support/requests",
    title: "ثبت و پیگیری تیکت",
    Component: AccountSupportRequestsPage,
  },
  {
    path: "/account/support/requests/new",
    title: "ثبت و پیگیری تیکت",
    Component: AccountSupportNewRequestPage,
  },
  { path: "/account/support/faq", title: "سوالات متداول", Component: AccountSupportFaqPage },

  // Notifications & Chat
  { path: "/notifications", title: "اعلان‌ها", Component: NotificationsPage, requiresAuth: true },
  {
    path: "/notifications/settings",
    title: "مدیریت اعلان‌ها",
    Component: NotificationManagementPage,
    requiresAuth: true,
  },
  { path: "/chat", title: "چت", Component: UserChatHomePage, requiresAuth: true },
  {
    path: "/chat/response-time",
    title: "ساعت پاسخگویی",
    Component: UserChatResponseTimePage,
    requiresAuth: true,
  },
  {
    path: "/chat/rename",
    title: "تغییر نام چت",
    Component: UserChatRenamePage,
    requiresAuth: true,
  },
  {
    path: "/chat/bulk-delete",
    title: "حذف گروهی گفتگوها",
    Component: UserChatBulkDeletePage,
    requiresAuth: true,
  },
  { path: "/chat/:id/report", title: "گزارش تخلف", Component: ChatReportPage, requiresAuth: true },
  { path: "/chat/:id", title: "چت", Component: UserChatDetailPage, requiresAuth: true },
];
