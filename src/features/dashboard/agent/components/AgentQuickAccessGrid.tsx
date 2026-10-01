import type { ComponentType } from "react";
import { RouteLink } from "../../../../shared/navigation/RouteLink";
import LinearTag from "../../../../shared/icons/LinearTag";
import LinearEditUser from "../../../../shared/icons/LinearEditUser";
import LinearDocument from "../../../../shared/icons/LinearDocument";
import LinearWalletAdd from "../../../../shared/icons/LinearWalletAdd";
import type { AgentRoleType } from "../types";

interface QuickActionItem {
  id: string;
  label: string;
  to: string;
  icon: ComponentType<{ className?: string }>;
  roleSpecific?: "real_estate_only";
}

const allActions: QuickActionItem[] = [
  { id: "ads", label: "آگهی‌ها", to: "/account/manage-ads", icon: LinearTag },
  {
    id: "consultants",
    label: "مشاورین",
    to: "/account/dashboard/team",
    icon: LinearEditUser,
    roleSpecific: "real_estate_only",
  },
  { id: "requests", label: "درخواست", to: "/account/dashboard/requests", icon: LinearDocument },
  { id: "credits", label: "اعتبار", to: "/account/dashboard/payments", icon: LinearWalletAdd },
];

export interface AgentQuickAccessGridProps {
  role?: AgentRoleType;
}

export function AgentQuickAccessGrid({
  role = "REAL_ESTATE_CONSULTANT",
}: AgentQuickAccessGridProps) {
  const isIndependent = role === "INDEPENDENT_CONSULTANT";
  const actions = isIndependent
    ? allActions.filter((a) => a.roleSpecific !== "real_estate_only")
    : allActions;

  return (
    <div
      className={`grid gap-3 [direction:rtl] ${
        isIndependent ? "grid-cols-3" : "grid-cols-4"
      }`}
    >
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <RouteLink
            key={action.id}
            className="flex h-[64px] flex-col items-center justify-center gap-1 rounded-[12px] bg-white shadow-sm transition hover:bg-neutral-50 active:scale-95 no-underline"
            to={action.to}
          >
            <Icon className="h-5 w-5 text-[#0048C4]" />
            <span className="text-[12px] font-semibold text-[#1A1A1A]">
              {action.label}
            </span>
          </RouteLink>
        );
      })}
    </div>
  );
}
