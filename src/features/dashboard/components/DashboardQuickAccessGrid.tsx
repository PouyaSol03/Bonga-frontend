import type { ComponentType } from "react";
import { RouteLink } from "../../../shared/navigation/RouteLink";
import LinearTag from "../../../shared/icons/LinearTag";
import LinearEditUser from "../../../shared/icons/LinearEditUser";
import LinearDocument from "../../../shared/icons/LinearDocument";
import LinearWalletAdd from "../../../shared/icons/LinearWalletAdd";

export type DashboardRole =
  | "REAL_ESTATE_MANAGER"
  | "REAL_ESTATE_CONSULTANT"
  | "INDEPENDENT_CONSULTANT";

interface QuickActionItem {
  id: string;
  label: string;
  to: string;
  icon: ComponentType<{ className?: string }>;
  hideForIndependent?: boolean;
}

const allActions: QuickActionItem[] = [
  { id: "ads", label: "آگهی‌ها", to: "/account/manage-ads", icon: LinearTag },
  {
    id: "consultants",
    label: "مشاورین",
    to: "/account/dashboard/team",
    icon: LinearEditUser,
    hideForIndependent: true,
  },
  {
    id: "requests",
    label: "درخواست",
    to: "/account/dashboard/requests",
    icon: LinearDocument,
  },
  {
    id: "credits",
    label: "اعتبار",
    to: "/account/dashboard/payments",
    icon: LinearWalletAdd,
  },
];

export interface DashboardQuickAccessGridProps {
  role?: DashboardRole;
}

export function DashboardQuickAccessGrid({
  role = "REAL_ESTATE_MANAGER",
}: DashboardQuickAccessGridProps) {
  const isIndependent = role === "INDEPENDENT_CONSULTANT";
  const actions = isIndependent
    ? allActions.filter((a) => !a.hideForIndependent)
    : allActions;

  return (
    <div className="flex w-full items-center gap-4 [direction:rtl]">
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <RouteLink
            key={action.id}
            to={action.to}
            className="flex flex-1 flex-col items-center justify-center gap-2 rounded-[12px] bg-white py-2 shadow-sm transition hover:bg-neutral-50 active:scale-95 no-underline"
          >
            <Icon className="h-6 w-6 text-[#0048C4]" />
            <span className="text-[12px] font-semibold text-[#1A1A1A]">
              {action.label}
            </span>
          </RouteLink>
        );
      })}
    </div>
  );
}
