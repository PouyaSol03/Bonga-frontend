import { useState } from "react";
import { RouteLink } from "../routes/RouteLink";
import { CreateAdBottomSheet } from "./CreateAdBottomSheet";

type BottomNavigationItem = {
  key: string;
  label: string;
  icon: string;
  to: string;
};

const navigationItems: BottomNavigationItem[] = [
  {
    key: "home",
    label: "خانه",
    icon: "/figma/account/nav-home.svg",
    to: "/home",
  },
  {
    key: "search",
    label: "جستجو",
    icon: "/figma/account/nav-search.svg",
    to: "/search",
  },
  {
    key: "new-ad",
    label: "ثبت آگهی",
    icon: "/figma/account/nav-add.svg",
    to: "/new-ad",
  },
  {
    key: "chat",
    label: "چت",
    icon: "/figma/account/nav-chat.svg",
    to: "/chat",
  },
  {
    key: "account",
    label: "حساب من",
    icon: "/figma/account/nav-account.svg",
    to: "/login",
  },
];

export function BottomNavigation({
  activeKey = "account",
}: {
  activeKey?: string;
}) {
  const [isCreateAdOpen, setIsCreateAdOpen] = useState(false);

  const resolvedActiveKey = isCreateAdOpen ? "new-ad" : activeKey;

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

            return (
              <RouteLink
                key={item.key}
                to={item.to}
                aria-current={isActive ? "page" : undefined}
                onClick={(event) => {
                  if (!isNewAd) return;

                  event.preventDefault();
                  setIsCreateAdOpen(true);
                }}
                className={`flex min-w-0 flex-col items-center justify-center whitespace-nowrap text-center font-medium transition-colors focus-visible:outline-3 focus-visible:outline-offset-[-3px] focus-visible:outline-[#0048c440]
                  gap-1 py-2 text-[10px] leading-3
                  min-[390px]:gap-1 min-[390px]:py-2 min-[390px]:text-xs min-[390px]:leading-4
                  ${isActive ? "text-[#0048c4]" : "text-[#999999]"}`}
              >
                <span
                  className="h-6 w-6 shrink-0 bg-current"
                  style={{
                    WebkitMask: `url(${item.icon}) center / contain no-repeat`,
                    mask: `url(${item.icon}) center / contain no-repeat`,
                  }}
                  aria-hidden="true"
                />

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
            window.location.href = "/new-ad/personal";
          }

          if (option.id === "independent-consultant") {
            window.location.href = "/new-ad/independent-consultant";
          }

          if (option.id === "jaliliyan-agency") {
            window.location.href = "/new-ad/jaliliyan-agency";
          }
        }}
      />
    </>
  );
}