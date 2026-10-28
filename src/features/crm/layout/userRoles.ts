import type { CrmRecord } from "../api/crm.service";
import { readText } from "./recordFormatters";

export function normalizeCrmUserRoleSlug(value: string) {
  const normalized = value.trim().toLowerCase();

  if (
    normalized === "super-admin" ||
    normalized === "super_admin" ||
    normalized === "super admin" ||
    normalized === "superadmin"
  ) {
    return "superadmin";
  }

  return normalized;
}

export function userRoleSlugs(user: CrmRecord) {
  if (Array.isArray(user.roles)) {
    const slugs = user.roles
      .map((role) => {
        if (typeof role === "string") return role;
        if (role && typeof role === "object" && typeof (role as CrmRecord).slug === "string") {
          return String((role as CrmRecord).slug);
        }

        return "";
      })
      .map(normalizeCrmUserRoleSlug)
      .filter(Boolean);

    return Array.from(new Set(slugs));
  }

  const roleSlugs = Array.isArray(user.role_slugs)
    ? user.role_slugs.filter(
        (role): role is string => typeof role === "string" && Boolean(role.trim()),
      )
    : [];
  const fallback =
    roleSlugs.length > 0 ? roleSlugs : [readText(user, ["role"], "")].filter(Boolean);

  return Array.from(new Set(fallback.map(normalizeCrmUserRoleSlug)));
}
