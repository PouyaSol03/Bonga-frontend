import type { ReactNode } from "react";

import type { TopBarProps } from "../components/TopBar";

export type AppChromeConfig = {
  bottomNavigationKey?: string;
  contentClassName?: string;
  frameClassName?: string;
  topBar?: TopBarProps;
  wrapInShell: boolean;
};

export function getBottomNavigationKey(path: string) {
  if (path.startsWith("/account/support")) return undefined;
  if (path === "/home") return "home";
  if (path.startsWith("/search")) return "search";
  if (path === "/chat") return "chat";
  if (
    path.startsWith("/account/business/create") ||
    path === "/account/delete-user" ||
    path === "/account/ad-management/allocation" ||
    path.startsWith("/account/ad-management/allocation-review") ||
    path === "/account/ad-management/payment" ||
    /^\/account\/ad-management\/payment\/[^/]+\/?$/.test(path) ||
    path === "/account/ad-management/delete" ||
    /^\/account\/my-ads\/[^/]+\/payment-history\/?$/.test(path) ||
    /^\/account\/my-ads\/[^/]+\/increase-visits\/?$/.test(path) ||
    /^\/account\/my-ads\/[^/]+\/visit-statistics\/?$/.test(path) ||
    /^\/account\/my-ads\/[^/]+\/close-result\/?$/.test(path) ||
    path === "/account/ad-management/filter" ||
    path === "/account/credit/history" ||
    path === "/account/wallet/history" ||
    path.startsWith("/account/dashboard/payments") ||
    path.startsWith("/account/dashboard/ranking") ||
    path.startsWith("/account/dashboard/agency") ||
    path.startsWith("/account/dashboard/agent") ||
    path.startsWith("/account/dashboard/requests") ||
    path.startsWith("/account/dashboard/team") ||
    path.startsWith("/account/ad-management/published") ||
    /^\/account\/my-ads\/[^/]+\/state-ad\/?$/.test(path)
  ) {
    return undefined;
  }
  if (path === "/login" || path.startsWith("/account")) return "account";

  return undefined;
}

export function getAccountFallbackBackTo(path: string) {
  if (path === "/account") return "/home";
  if (path === "/account/support/chat/new") return "/account/support/chat";
  if (path === "/account/support/requests/new") return "/account/support/requests";
  if (
    path === "/account/support/chat" ||
    path === "/account/support/requests" ||
    path === "/account/support/faq"
  ) return "/account/support";
  if (path === "/account/support") return "/account";
  if (path === "/account/wallet/history") return "/account/wallet";
  if (path.startsWith("/account/ranking/badges")) return "/account/ranking";
  if (path === "/account/ranking/levels") return "/account/ranking";
  if (path === "/account/credit/history") return "/account/credit/panel";
  if (path.startsWith("/account/credit/")) return "/account";
  if (path === "/account/ad-management/statistics/details") return "/account/ad-management/statistics";
  if (path.startsWith("/account/ad-management/")) return "/account/ad-management";

  const myAdActionMatch = path.match(/^\/account\/my-ads\/([^/]+)\/(payment-history|increase-visits|visit-statistics|close-result|state-ad)\/?$/);

  if (myAdActionMatch?.[1] && myAdActionMatch[2] !== "state-ad") {
    return `/account/my-ads/${myAdActionMatch[1]}/state-ad`;
  }

  if (myAdActionMatch?.[2] === "state-ad") return "/account/my-ads";

  if (path.startsWith("/account/dashboard/")) {
    const dashboardSection = path.split("/")[3];

    if (dashboardSection) return `/account/dashboard/${dashboardSection}`;

    return "/account/dashboard";
  }

  if (path === "/account/dashboard") return "/account";

  return "/account";
}

export function getRouteTopBar(
  path: string,
  title: string,
  notificationIcon?: ReactNode,
): TopBarProps | undefined {
  if (path === "/login") {
    return { showBack: false, title };
  }

  if (path === "/chat" || path === "/search") {
    return { backTo: "/home", title };
  }

  if (path === "/account/dashboard") {
    return {
      actions: notificationIcon
        ? [
            {
              icon: notificationIcon,
              id: "notifications",
              label: "اعلان‌ها",
              to: "/notifications",
            },
          ]
        : undefined,
      backTo: "/account",
      title,
    };
  }

  if (path.startsWith("/new-ad")) {
    return {
      backTo: "/home",
      title,
    };
  }

  if (path === "/notifications") {
    return {
      backTo: "/account",
      title,
    };
  }

  if (path === "/account" || path.startsWith("/account/")) {
    return {
      backTo: getAccountFallbackBackTo(path),
      title,
    };
  }

  return undefined;
}

export function getAppChromeConfig(
  path: string,
  title: string,
  notificationIcon?: ReactNode,
): AppChromeConfig {
  const bottomNavigationKey = getBottomNavigationKey(path);
  const topBar = getRouteTopBar(path, title, notificationIcon);

  if (!bottomNavigationKey) {
    return topBar
      ? {
          contentClassName: "min-h-0 flex-1 overflow-hidden",
          frameClassName: "relative flex min-h-0 flex-col overflow-hidden bg-[#f0f0f0] text-[#1a1a1a] [direction:rtl]",
          topBar,
          wrapInShell: true,
        }
      : { wrapInShell: false };
  }

  if (path === "/search") {
    return {
      bottomNavigationKey,
      contentClassName: "min-h-0 flex-1 overflow-hidden",
      frameClassName: "relative flex min-h-0 flex-col overflow-hidden bg-[#f0f0f0] text-[#1a1a1a]",
      topBar,
      wrapInShell: true,
    };
  }

  if (path === "/account/dashboard") {
    return {
      bottomNavigationKey,
      contentClassName: "min-h-0 flex-1 overflow-y-auto overflow-x-hidden",
      frameClassName: "relative flex min-h-0 flex-col overflow-hidden bg-[#f0f0f0] text-[#1a1a1a] [direction:rtl]",
      topBar,
      wrapInShell: true,
    };
  }

  return {
    bottomNavigationKey,
    contentClassName: "min-h-0 flex-1 overflow-hidden",
    frameClassName: "relative flex min-h-0 flex-col overflow-hidden bg-[#f0f0f0] text-[#1a1a1a] [direction:rtl]",
    topBar,
    wrapInShell: true,
  };
}
