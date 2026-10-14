import { lazy, memo, Suspense, useState, type ComponentType, type SVGProps  } from "react";

import { Link, useNavigate } from "react-router";
import {
  getStoredAuthSession,
  setStoredActiveRole,
  storeLoginRedirectPath,
} from "../../shared/auth/auth-storage";
import { clearNewAdDraftStorage } from "../../features/advertisements/create/utils";
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
  import("../../features/advertisements/components/CreateAdBottomSheet").then((module) => ({
    default: module.CreateAdBottomSheet,
  })),
);

const BottomNavigationUnreadChatBadge = lazy(() =>
  import("../../features/chat/components/BottomNavigationUnreadChatBadge").then((module) => ({
    default: module.BottomNavigationUnreadChatBadge,
  })),
);

function getLoginRequiredPath(returnTo: string) {
  const params = new URLSearchParams({ returnTo });

  return `/login-required?${params.toString()}`;
}

function BottomNavigationComponent({ activeKey = "account" }: { activeKey?: string }) {
  const navigate = useNavigate();
  const [isCreateAdOpen, setIsCreateAdOpen] = useState(false);
  const [hasLoadedCreateAdSheet, setHasLoadedCreateAdSheet] = useState(false);
  const hasAuthSession = Boolean(getStoredAuthSession());

  const resolvedActiveKey = isCreateAdOpen ? "new-ad" : activeKey;

  return (
    <>
      <nav
        className="bg-surface-container-lowest sticky bottom-0 z-10 h-16 shrink-0 shadow-[0_-4px_12px_rgba(26,26,26,0.08)]"
        aria-label="ناوبری اصلی"
      >
        <div className="grid h-full w-full grid-cols-5 px-1 [direction:rtl]">
          {navigationItems.map((item) => {
            const isActive = item.key === resolvedActiveKey;
            const isNewAd = item.key === "new-ad";
            const Icon = item.Icon;

            return (
              <Link
                key={item.key}
                to={item.to}
                aria-current={isActive ? "page" : undefined}
                onClick={(event) => {
                  if (!isNewAd) return;

                  event.preventDefault();

                  const session = getStoredAuthSession();

                  if (!session) {
                    storeLoginRedirectPath("/new-ad/category");
                    navigate(getLoginRequiredPath("/new-ad/category"));
                    return;
                  }

                  setHasLoadedCreateAdSheet(true);
                  setIsCreateAdOpen(true);
                }}
                className={`focus-visible:outline-primary/25 flex min-w-0 flex-col items-center justify-center gap-1 py-2 text-center whitespace-nowrap focus-visible:outline-3 focus-visible:outline-offset-[-3px] ${isActive ? "text-primary" : "text-outline"}`}
              >
                <Typography
                  as="p"
                  variant="body"
                  size="small"
                  weight="medium"
                  className="relative grid h-6 w-6 shrink-0 place-items-center"
                >
                  <Icon
                    active={isActive}
                    aria-hidden="true"
                    className="h-6 w-6 shrink-0"
                    size={24}
                    color={isActive ? "var(--primary)" : "var(--outline)"}
                    {...(isNewAd
                      ? {}
                      : {
                          solidColor: isActive ? "var(--primary)" : undefined,
                          solidOpacity: 0.16,
                        })}
                  />

                  {item.key === "chat" && hasAuthSession ? (
                    <Suspense fallback={null}>
                      <BottomNavigationUnreadChatBadge activeKey={activeKey} />
                    </Suspense>
                  ) : null}
                </Typography>

                <Typography
                  as="span"
                  variant="body"
                  size="small"
                  weight="medium"
                  className="max-w-full overflow-hidden text-ellipsis"
                >
                  {item.label}
                </Typography>
              </Link>
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
              clearNewAdDraftStorage();

              if (option.id === "personal") {
                navigate("/new-ad/personal?registrantType=personal&context=personal");
                return;
              }

              if (option.id === "independent-consultant") {
                navigate(
                  "/new-ad/independent-consultant?registrantType=personal&context=independent-consultant",
                );
                return;
              }

              if (option.id === "agency-manager") {
                navigate(
                  "/new-ad/agency?registrantType=personal&publisherType=agency&context=agency",
                );
                return;
              }

              navigate(
                "/new-ad/agency-consultant?registrantType=personal&publisherType=agent&context=agency-consultant",
              );
            }}
          />
        </Suspense>
      ) : null}
    </>
  );
}

export const BottomNavigation = memo(BottomNavigationComponent);
