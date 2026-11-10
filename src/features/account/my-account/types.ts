import type { ComponentType, SVGProps } from "react";
import type { AuthRoleSlug } from "../../../shared/auth/auth-storage";

export type AccountAction = {
  activeRole?: AuthRoleSlug;
  badge?: string;
  disabled?: boolean;
  icon: AccountIconName;
  label: string;
  tone?: "default" | "danger" | "warning";
  onClick?: () => void;
  requiresAuth?: boolean;
  to?: string;
};

export type AccountIconName =
  | "agency"
  | "headphone"
  | "bookmark"
  | "building"
  | "dashboard"
  | "eye"
  | "identity"
  | "info"
  | "legal"
  | "lock"
  | "log_out"
  | "message"
  | "note"
  | "plus"
  | "ranking"
  | "request"
  | "setting"
  | "tag"
  | "team"
  | "trash"
  | "user"
  | "wallet"
  | "wallet-add";

export type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;
