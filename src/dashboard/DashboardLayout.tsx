import { useMemo, useState, type ReactNode, memo } from "react";
import { getActiveAuthRole, type AuthSession } from "../auth/auth-storage";
import { getVisibleDashboardItems } from "./dashboardNavigation";
import { RouteLink } from "../routes/RouteLink";
import { DashboardHeader } from "./DashboardHeader";
import { Typography } from "../components/ui/Typography";
import { Button } from "../components/ui/Button";

type DashboardLayoutProps = {
  activePath: string;
  children: ReactNode;
  session: AuthSession;
  title: string;
};

const MemoSidebar = memo(function Sidebar({
  activePath,
  items,
  isCollapsed,
  onToggleCollapse,
}: {
  activePath: string;
  items: ReturnType<typeof getVisibleDashboardItems>;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}) {
  return (
    <div
      className={`h-full flex flex-col gap-6 bg-white rounded-xl p-4 transition-all duration-300 ${
        isCollapsed ? "w-[80px]" : "w-[264px]"
      }`}
    >
      <div
        className={`flex items-center ${
          isCollapsed ? "justify-center" : "justify-between"
        }`}
      >
        {!isCollapsed && (
          <Typography as="p" variant="body" size="medium" weight="medium" className="text-[#808080] font-medium">مرکز مدیریت</Typography>
        )}

        <Button unstyled
          type="button"
          onClick={onToggleCollapse}
          className="w-10 h-10 flex items-center justify-center bg-[#E9EAEE] rounded-lg transition"
          aria-label={isCollapsed ? "باز کردن سایدبار" : "بستن سایدبار"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            className={`transition-transform duration-300 ${
              isCollapsed ? "rotate-180" : ""
            }`}
          >
            <path
              d="M7.89107 6.22455C8.13514 5.98048 8.53078 5.98049 8.77486 6.22455L12.1082 9.55789C12.3523 9.80197 12.3523 10.1976 12.1082 10.4417L8.77486 13.775C8.53078 14.0191 8.13514 14.0191 7.89107 13.775C7.64699 13.5309 7.64699 13.1353 7.89107 12.8912L10.7825 9.99978L7.89107 7.10834C7.64701 6.86427 7.64701 6.46863 7.89107 6.22455Z"
              fill="#4D4D4D"
            />
          </svg>
        </Button>
      </div>

      {!isCollapsed && (
        <div className="px-2 h-[64px] border border-[#F0F0F0] rounded-[12px] flex gap-2 items-center">
          <img
            className="w-[50px] h-[56px]"
            src="/images/gifts/prize1.png"
            alt=""
          />
          <Typography as="p" variant="body" size="medium" weight="regular" className="bg-[#4D4D4D] text-center px-5 text-[#F5F5F5] rounded-md h-[24px]">
            آژانس برتر منطقه
          </Typography>
        </div>
      )}

      <div className="flex flex-col gap-2">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activePath === item.path || activePath.startsWith(`${item.path}/`);

          return (
            <RouteLink
              aria-current={isActive ? "page" : undefined}
              className={`flex h-10 items-center rounded-xl text-sm no-underline cursor-pointer transition ${
                isActive ? "bg-[#0048c414]" : "hover:bg-[#f5f7fb]"
              } ${isCollapsed ? "justify-center px-0" : "gap-2 px-3"}`}
              key={item.path}
              to={item.path}
            >
              {isCollapsed ? (
                <div className="flex flex-col items-center justify-center gap-1">
                  <Icon />

                  {isActive && (
                    <Typography as="span" variant="body" size="medium" weight="regular" className="h-1 w-1 rounded-full bg-[#0048c4]" />
                  )}
                </div>
              ) : (
                <>
                  <Icon />

                  <Typography as="span" variant="label" size="medium" weight="semibold"
                    className={
                      isActive
                        ? "font-bold text-[#0048c4]"
                        : "text-[#303030]"
                    }
                  >
                    {item.label}
                  </Typography>
                </>
              )}
            </RouteLink>
          );
        })}
      </div>
    </div>
  );
});

export function DashboardLayout({
  activePath,
  children,
  session,
}: DashboardLayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const activeRole = getActiveAuthRole(session);

  const visibleItems = useMemo(
    () => getVisibleDashboardItems(activeRole),
    [activeRole],
  );

  return (
    <div className="h-screen w-full flex flex-col bg-[#f3f3f3]" dir="rtl">
      <DashboardHeader />

      <div className="flex min-h-0 flex-1 gap-6 overflow-hidden p-6">
        <aside className="min-h-0 shrink-0">
          <MemoSidebar
            activePath={activePath}
            items={visibleItems}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={() =>
              setIsSidebarCollapsed((prev) => !prev)
            }
          />
        </aside>

        <main className="min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
