import { lazy, memo, Suspense, useState } from "react";
import type { ComponentType, SVGProps } from "react";
import { getStoredAuthSession, setStoredActiveRole, storeLoginRedirectPath } from "../../shared/auth/auth-storage";
import { RouteLink } from "../../shared/navigation/RouteLink";
import LinearAddCircle from "../../shared/icons/LinearAddCircle";
import LinearChat from "../../shared/icons/LinearChat";
import LinearHome3 from "../../shared/icons/LinearHome3";
import LinearSearch from "../../shared/icons/LinearSearch";
import LinearUserSolid from "../../shared/icons/LinearUserSolid";
import { Typography } from "../../shared/ui/Typography";

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

const CreateAdBottomSheet = lazy(() =>
  import("../../features/advertisements/components/CreateAdBottomSheet").then(
    (module) => ({ default: module.CreateAdBottomSheet }),
  ),
);

const BottomNavigationUnreadChatBadge = lazy(() =>
  import("../../features/chat/components/BottomNavigationUnreadChatBadge").then(
    (module) => ({ default: module.BottomNavigationUnreadChatBadge }),
  ),
);

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
  const [hasLoadedCreateAdSheet, setHasLoadedCreateAdSheet] = useState(false);
  const hasAuthSession = Boolean(getStoredAuthSession());

  const resolvedActiveKey = isCreateAdOpen ? "new-ad" : activeKey;

  return (
    <>
      <nav
        className="sticky bottom-0 z-10 h-16 shrink-0 bg-white shadow-[0_-4px_12px_rgba(26,26,26,0.08)]"
        aria-label="ناوبری اصلی"
      >
        <div className="grid h-full w-full grid-cols-5 px-1 [direction:rtl]">
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

                  setHasLoadedCreateAdSheet(true);
                  setIsCreateAdOpen(true);
                }}
                className={`flex min-w-0 flex-col items-center justify-center whitespace-nowrap text-center focus-visible:outline-3 focus-visible:outline-offset-[-3px] focus-visible:outline-[#0048c440] gap-1 py-2
                  ${isActive ? "text-[#0048c4]" : "text-[#999999]"}`}
              >
                <Typography as="p" variant="body" size="small" weight="medium" className="relative grid h-6 w-6 shrink-0 place-items-center">
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

                  {item.key === "chat" && hasAuthSession ? (
                    <Suspense fallback={null}>
                      <BottomNavigationUnreadChatBadge activeKey={activeKey} />
                    </Suspense>
                  ) : null}
                </Typography>

                <Typography as="span" variant="body" size="small" weight="medium" className="max-w-full overflow-hidden text-ellipsis">
                  {item.label}
                </Typography>
              </RouteLink>
            );
          })}
        </div>
      </nav>

      {hasLoadedCreateAdSheet ? (
        <Suspense fallback={null}>
          <CreateAdBottomSheet
            isOpen={isCreateAdOpen}
            onClose={() => setIsCreateAdOpen(false)}
            onSelect={(option) => {
              setIsCreateAdOpen(false);
              setStoredActiveRole(option.senderRole);

              if (option.id === "personal") {
                navigateTo("/new-ad/personal?registrantType=personal");
                return;
              }

              if (option.id === "independent-consultant") {
                navigateTo("/new-ad/independent-consultant?registrantType=personal");
                return;
              }

              if (option.id === "agency-manager") {
                navigateTo("/new-ad/agency?registrantType=personal");
                return;
              }

              navigateTo("/new-ad/agency-consultant?registrantType=personal");
            }}
          />
        </Suspense>
      ) : null}
    </>
  );
}

export const BottomNavigation = memo(BottomNavigationComponent);
