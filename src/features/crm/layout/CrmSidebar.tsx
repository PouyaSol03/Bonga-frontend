import { Link } from "react-router";
import { Button } from "../../../shared/ui/Button";
import { Typography } from "../../../shared/ui/Typography";
import { ChevronIcon } from "./ChevronIcon";
import { CrmIcon } from "./CrmIcon";
import { navigationItems, primaryCrmRoleLabel, sectionMeta } from "./navigation";
import type { CrmSection } from "./types";
type Props = {
  isSidebarCollapsed: boolean;
  onToggle: () => void;
  roleLabel: ReturnType<typeof primaryCrmRoleLabel>;
  visibleNavigationItems: typeof navigationItems;
  section: CrmSection;
  pendingCounts: Partial<Record<CrmSection, number>>;
};
export function CrmSidebar({
  isSidebarCollapsed,
  onToggle,
  roleLabel,
  visibleNavigationItems,
  section,
  pendingCounts,
}: Props) {
  return (
    <aside
      className={`flex h-full shrink-0 flex-col gap-6 rounded-xl bg-white p-4 transition-[width] duration-300 ${
        isSidebarCollapsed ? "w-[80px]" : "w-[264px]"
      }`}
    >
      <div
        className={`flex items-center ${isSidebarCollapsed ? "justify-center" : "justify-between"}`}
      >
        {!isSidebarCollapsed ? (
          <div>
            <Typography
              as="p"
              variant="body"
              size="medium"
              weight="medium"
              className="m-0 text-sm font-semibold text-[#1a1a1a]"
            >
              مرکز مدیریت
            </Typography>
            <Typography
              as="p"
              variant="body"
              size="small"
              weight="medium"
              className="m-0 mt-1 text-xs font-medium text-[#808080]"
            >
              مدیریت کل سامانه
            </Typography>
          </div>
        ) : null}

        <Button
          unstyled
          aria-label={isSidebarCollapsed ? "باز کردن منو" : "جمع کردن منو"}
          className="grid h-10 w-10 place-items-center rounded-lg bg-[#e9eaee] text-[#4d4d4d] transition hover:bg-[#dfe1e6]"
          onClick={onToggle}
          type="button"
        >
          <Typography
            as="span"
            variant="body"
            size="medium"
            weight="regular"
            className={isSidebarCollapsed ? "rotate-180" : ""}
          >
            <ChevronIcon />
          </Typography>
        </Button>
      </div>

      {!isSidebarCollapsed ? (
        <div className="flex min-h-16 items-center gap-3 rounded-xl border border-[#f0f0f0] px-3">
          <Typography
            as="span"
            variant="body"
            size="medium"
            weight="regular"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#0048c414] text-[#0048c4]"
          >
            <CrmIcon name="home" size={20} />
          </Typography>
          <div className="min-w-0">
            <strong className="block truncate text-sm font-semibold text-[#303030]">
              {roleLabel.title}
            </strong>
            <Typography
              as="span"
              variant="body"
              size="small"
              weight="regular"
              className="mt-1 block truncate text-xs text-[#808080]"
            >
              {roleLabel.subtitle}
            </Typography>
          </div>
        </div>
      ) : null}

      <nav className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto" aria-label="منوی مدیریت">
        {visibleNavigationItems.map((item) => {
          const itemMeta = sectionMeta[item.section];
          const isActive = section === item.section;
          const pendingCount = pendingCounts[item.section] ?? 0;

          return (
            <Link
              aria-current={isActive ? "page" : undefined}
              className={`relative flex h-10 items-center rounded-xl text-sm no-underline transition ${
                isActive ? "bg-[#0048c414] text-[#0048c4]" : "text-[#303030] hover:bg-[#f5f7fb]"
              } ${isSidebarCollapsed ? "justify-center px-0" : "gap-2 px-3"}`}
              key={item.section}
              title={isSidebarCollapsed ? itemMeta.title : undefined}
              to={itemMeta.path}
            >
              <span className="relative flex shrink-0 items-center justify-center">
                <CrmIcon name={item.icon} />
                {isSidebarCollapsed && pendingCount > 0 ? (
                  <span className="absolute -top-1.5 -left-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#e53935] px-1 text-[10px] font-bold text-white shadow-sm">
                    {pendingCount > 99 ? "+99" : pendingCount}
                  </span>
                ) : null}
              </span>
              {!isSidebarCollapsed ? (
                <div className="flex min-w-0 flex-1 items-center justify-between">
                  <Typography
                    as="span"
                    variant="label"
                    size="medium"
                    weight="semibold"
                    className={`truncate ${isActive ? "font-bold" : "font-medium"}`}
                  >
                    {itemMeta.title}
                  </Typography>
                  {pendingCount > 0 ? (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#e53935] px-1.5 text-xs font-bold text-white shadow-sm">
                      {pendingCount > 99 ? "+99" : pendingCount}
                    </span>
                  ) : null}
                </div>
              ) : isActive ? (
                <Typography
                  as="span"
                  variant="body"
                  size="medium"
                  weight="regular"
                  className="absolute mt-8 h-1 w-1 rounded-full bg-[#0048c4]"
                />
              ) : null}
            </Link>
          );
        })}
      </nav>

      <Link
        className={`flex h-10 items-center rounded-xl border border-[#f0f0f0] text-sm text-[#4d4d4d] no-underline transition hover:bg-[#f5f7fb] ${
          isSidebarCollapsed ? "justify-center" : "gap-2 px-3"
        }`}
        title={isSidebarCollapsed ? "حساب کاربری" : undefined}
        to="/account"
      >
        <CrmIcon name="account" />
        {!isSidebarCollapsed ? (
          <Typography
            as="span"
            variant="label"
            size="medium"
            weight="medium"
            className="font-medium"
          >
            حساب کاربری
          </Typography>
        ) : null}
      </Link>
    </aside>
  );
}
