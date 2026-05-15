import { RouteLink } from "../routes/RouteLink";

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
    key: "new-listing",
    label: "ثبت آگهی",
    icon: "/figma/account/nav-add.svg",
    to: "/new-listing",
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
  return (
    <nav
      className="sticky bottom-0 z-10 h-[84px] shrink-0 bg-white shadow-[0_-4px_12px_rgba(26,26,26,0.08)]"
      aria-label="ناوبری اصلی"
    >
      <div className="grid h-full w-full grid-cols-5 px-4 [direction:rtl]">
        {navigationItems.map((item) => {
          const isActive = item.key === activeKey;

          return (
            <RouteLink
              className={`flex min-w-0 flex-col items-center justify-center gap-2 whitespace-nowrap text-center text-xs font-medium leading-4 transition-colors focus-visible:outline-3 focus-visible:outline-offset-[-3px] focus-visible:outline-[#0048c440] ${
                isActive ? "text-[#0048c4]" : "text-[#999999]"
              }`}
              key={item.key}
              to={item.to}
              aria-current={isActive ? "page" : undefined}
            >
              <span
                className="h-7 w-7 shrink-0 bg-current"
                style={{
                  WebkitMask: `url(${item.icon}) center / contain no-repeat`,
                  mask: `url(${item.icon}) center / contain no-repeat`,
                }}
                aria-hidden="true"
              />

              <span>{item.label}</span>
            </RouteLink>
          );
        })}
      </div>
    </nav>
  );
}
