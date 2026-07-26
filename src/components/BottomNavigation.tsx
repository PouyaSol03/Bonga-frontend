import { memo, useEffect, useState } from "react";
import type { ComponentType, SVGProps } from "react";
import { getStoredAuthSession, storeLoginRedirectPath } from "../auth/auth-storage";
import { useChatUnreadCountQuery } from "../hooks/chat.hooks";
import { RouteLink } from "../routes/RouteLink";
import { CreateAdBottomSheet } from "./CreateAdBottomSheet";
import LinearHome3 from "./(icons)/LinearHome3";
import LinearSearch from "./(icons)/LinearSearch";
import LinearAddCircle from "./(icons)/LinearAddCircle";
import LinearChat from "./(icons)/LinearChat";
import LinearUserSolid from "./(icons)/LinearUserSolid";

type BottomNavigationIconProps = SVGProps<SVGSVGElement> & {
  active?: boolean;
  size?: number | string;
  solidColor?: string;
  solidOpacity?: number;
};

type BottomNavigationItem = {
  key: string;
  label: string;
  Icon: ComponentType<BottomNavigationIconProps>;
  to: string;
};

const navigationItems: BottomNavigationItem[] = [
  {
    key: "home",
    label: "خانه",
    Icon: LinearHome3,
    to: "/home",
  },
  {
    key: "search",
    label: "جستجو",
    Icon: LinearSearch,
    to: "/search",
  },
  {
    key: "new-ad",
    label: "ثبت آگهی",
    Icon: LinearAddCircle,
    to: "/new-ad",
  },
  {
    key: "chat",
    label: "چت",
    Icon: LinearChat,
    to: "/chat",
  },
  {
    key: "account",
    label: "حساب من",
    Icon: LinearUserSolid,
    to: "/account",
  },
];

function navigateTo(path: string) {
  window.history.pushState({}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

function getLoginRequiredPath(returnTo: string) {
  const params = new URLSearchParams({ returnTo });

  return `/login-required?${params.toString()}`;
}

function BottomNavigationComponent({
  activeKey = "account",
}: {
  activeKey?: string;
}) {
  const [isCreateAdOpen, setIsCreateAdOpen] = useState(false);
  const hasAuthSession = Boolean(getStoredAuthSession());
  const { data: unreadChatsCount = 0, refetch: refetchUnreadChatsCount } =
    useChatUnreadCountQuery({
      enabled: hasAuthSession,
    });

  const resolvedActiveKey = isCreateAdOpen ? "new-ad" : activeKey;
  const hasUnreadChats = unreadChatsCount > 0;

  useEffect(() => {
    if (!hasAuthSession) return;

    void refetchUnreadChatsCount();
  }, [activeKey, hasAuthSession, refetchUnreadChatsCount]);

  useEffect(() => {
    if (!hasAuthSession) return;

    function handleRouteChange() {
      void refetchUnreadChatsCount();
    }

    window.addEventListener("popstate", handleRouteChange);

    return () => {
      window.removeEventListener("popstate", handleRouteChange);
    };
  }, [hasAuthSession, refetchUnreadChatsCount]);

  return (
    <>
      <nav
        className="sticky bottom-0 z-10 h-16 shrink-0 bg-white shadow-[0_-4px_12px_rgba(26,26,26,0.08)]"
        aria-label="ناوبری اصلی"
      >
        <div className="grid h-full w-full grid-cols-5 px-1 [direction:rtl] min-[390px]:px-2">
          {navigationItems.map((item) => {
            const isActive = item.key === resolvedActiveKey;
            const isNewAd = item.key === "new-ad";
            const Icon = item.Icon;

            return (
              <RouteLink
                key={item.key}
                to={item.to}
                aria-current={isActive ? "page" : undefined}
                onClick={(event) => {
                  if (!isNewAd) return;

                  event.preventDefault();

                  const session = getStoredAuthSession();

                  if (!session) {
                    storeLoginRedirectPath("/new-ad/category");
                    navigateTo(getLoginRequiredPath("/new-ad/category"));
                    return;
                  }

                  setIsCreateAdOpen(true);
                }}
                className={`flex min-w-0 flex-col items-center justify-center whitespace-nowrap text-center font-medium focus-visible:outline-3 focus-visible:outline-offset-[-3px] focus-visible:outline-[#0048c440]
        gap-1 py-2 text-xs font-medium
        ${isActive ? "text-[#0048c4]" : "text-[#999999]"}`}
              >
                <span className="relative grid h-6 w-6 shrink-0 place-items-center">
                  <Icon
                    active={isActive}
                    aria-hidden="true"
                    className="h-6 w-6 shrink-0"
                    size={24}
                    color={isActive ? "#0048c4" : "#999999"}
                    {...(isNewAd
                      ? {}
                      : {
                          solidColor: isActive ? "#0048c4" : undefined,
                          solidOpacity: 0.16,
                        })}
                  />

                  {item.key === "chat" && hasUnreadChats ? (
                    <span
                      aria-hidden="true"
                      className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-[#ef1f1f] ring-2 ring-white"
                    />
                  ) : null}
                </span>

                <span className="max-w-full overflow-hidden text-ellipsis">
                  {item.label}
                </span>
              </RouteLink>
            );
          })}
        </div>
      </nav>

      <CreateAdBottomSheet
        isOpen={isCreateAdOpen}
        onClose={() => setIsCreateAdOpen(false)}
        onSelect={(option) => {
          setIsCreateAdOpen(false);

          if (option.id === "personal") {
            navigateTo("/new-ad/personal?registrantType=personal");
          }

          if (option.id === "independent-consultant") {
            navigateTo("/new-ad/independent-consultant");
          }

          if (option.id === "jaliliyan-agency") {
            navigateTo("/new-ad/jaliliyan-agency?registrantType=agency");
          }
        }}
      />
    </>
  );
}

export const BottomNavigation = memo(BottomNavigationComponent);
