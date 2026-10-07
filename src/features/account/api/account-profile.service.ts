import { apiV2 } from "../../../shared/api/api";
import {
  authRoleSlugs,
  getStoredAuthSession,
  setStoredAuthSession,
  type AuthRole,
  type AuthRoleSlug,
} from "../../../shared/auth/auth-storage";
import type {
  ProfileAccountItem,
  UserProfile,
  UserProfileV2Response,
} from "./account-profile.types";

function normalizeProfileRoleSlug(value: unknown): AuthRoleSlug | null {
  if (typeof value !== "string") return null;

  const normalized = value.trim().toLowerCase().replace(/_/g, "-");
  if (
    normalized === "superadmin" ||
    normalized === "super admin" ||
    normalized === "super-admin"
  ) {
    return "super-admin";
  }

  const slug = value.trim().toLowerCase().replace(/-/g, "_") as AuthRoleSlug;
  return authRoleSlugs.includes(slug) ? slug : null;
}

export function syncStoredRolesFromProfile(
  response: unknown,
  profile: UserProfile,
): void {
  const session = getStoredAuthSession();
  if (!session) return;

  const responseRecord = response as Record<string, unknown>;
  const responseUser = responseRecord.user as Record<string, unknown> | undefined;
  const responseData = responseRecord.data as Record<string, unknown> | undefined;
  const candidates = [
    responseRecord.accounts,
    responseRecord.contexts,
    responseRecord.roles,
    responseRecord.role_slugs,
    responseUser?.roles,
    responseUser?.role_slugs,
    responseData?.roles,
    responseData?.role_slugs,
    profile.accounts,
    profile.contexts,
    profile.roles,
    profile.role_slugs,
  ];

  const rolesFromAccounts: AuthRole[] = [];
  const accountsToScan = profile.accounts ?? profile.contexts;
  if (Array.isArray(accountsToScan)) {
    accountsToScan.forEach((item, index) => {
      const acc = item as ProfileAccountItem;
      let slug: AuthRoleSlug | null = null;
      if (
        acc.context === "personal" ||
        acc.role_slug === "user" ||
        acc.type === "user"
      ) {
        slug = "user";
      } else if (
        acc.context === "agency" ||
        acc.role_slug === "real_estate_manager" ||
        acc.type === "agency"
      ) {
        slug = "real_estate_manager";
      } else if (
        acc.context === "agency-consultant" ||
        acc.role_slug === "real_estate_consultant" ||
        (acc.type === "agent" && Boolean(acc.agency_id || acc.agency))
      ) {
        slug = "real_estate_consultant";
      } else if (
        acc.context === "independent-consultant" ||
        acc.role_slug === "independent_consultant" ||
        (acc.type === "agent" && !acc.agency_id && !acc.agency)
      ) {
        slug = "independent_consultant";
      } else if (
        acc.context === "superadmin" ||
        acc.role_slug === "superadmin" ||
        acc.type === "superadmin"
      ) {
        slug = "super-admin";
      }

      if (slug && !rolesFromAccounts.some((r) => r.slug === slug)) {
        rolesFromAccounts.push({
          id: String(acc.id ?? acc._id ?? index + 1),
          name: acc.name || slug,
          slug,
        });
      }
    });
  }

  const rawRoles = candidates.find(Array.isArray);
  const roles: AuthRole[] =
    rolesFromAccounts.length > 0 ? rolesFromAccounts : [];

  if (roles.length === 0 && Array.isArray(rawRoles)) {
    rawRoles
      .map((role, index): AuthRole | null => {
        const record =
          role && typeof role === "object"
            ? (role as Record<string, unknown>)
            : null;
        const slug = normalizeProfileRoleSlug(
          typeof role === "string" ? role : record?.slug ?? record?.name,
        );
        if (!slug) return null;

        return {
          id: String(record?.id ?? record?._id ?? index + 1),
          name: String(record?.name ?? slug),
          slug,
        };
      })
      .filter((role): role is AuthRole => role !== null)
      .forEach((role) => {
        if (!roles.some((r) => r.slug === role.slug)) {
          roles.push(role);
        }
      });
  }

  if (!roles.length) return;

  const activeRole: AuthRoleSlug = roles.some(
    (role) => role.slug === session.activeRole,
  )
    ? (session.activeRole as AuthRoleSlug)
    : roles.find((role) => role.slug === "user")?.slug ?? roles[0]!.slug;

  const consultantContext = Array.isArray(accountsToScan)
    ? (accountsToScan.find((item) => {
        const acc = item as ProfileAccountItem;
        return (
          acc.context === "agency-consultant" ||
          acc.role_slug === "real_estate_consultant" ||
          (acc.type === "agent" && Boolean(acc.agency_id || acc.agency))
        );
      }) as ProfileAccountItem | undefined)
    : undefined;

  const selectedContext = activeRole === "real_estate_manager"
    ? accountsToScan?.find(item => (item as ProfileAccountItem).context === "agency") as ProfileAccountItem | undefined
    : consultantContext;
  const managerPermissions = ["real_estate_consultant", "real_estate_manager"].includes(activeRole)
    ? selectedContext?.permissions
    : undefined;

  setStoredAuthSession({
    ...session,
    activeRole,
    accountType: activeRole,
    role: activeRole,
    roles,
    managerPermissions,
    contextIdentity: String(selectedContext?.agency?.id ?? selectedContext?.id ?? ""),
    contextPermissions: Object.fromEntries((accountsToScan ?? []).map(item => {
      const acc = item as ProfileAccountItem;
      const role = acc.context === "agency" ? "real_estate_manager" : acc.context === "agency-consultant" ? "real_estate_consultant" : "user";
      return [role, acc.permissions];
    })),
  });
}

export async function getMyProfile(): Promise<UserProfile> {
  const response = await apiV2.get("me/show").json<UserProfileV2Response | UserProfile>();
  const record = response as Record<string, unknown>;

  const profile: UserProfile =
    record.user && typeof record.user === "object"
      ? { ...(record.user as UserProfile) }
      : record.data && typeof record.data === "object"
        ? { ...(record.data as UserProfile) }
        : { ...(response as UserProfile) };

  const rawAccounts = record.accounts ?? record.contexts ?? (record.context ? [record.context] : undefined);
  if (Array.isArray(rawAccounts)) {
    profile.accounts = rawAccounts as ProfileAccountItem[];
  }
  if (Array.isArray(record.contexts)) {
    profile.contexts = record.contexts;
  }

  if (!profile.full_name) {
    const fullName = [profile.name, profile.family].filter(Boolean).join(" ");
    if (fullName) {
      profile.full_name = fullName;
    }
  }

  syncStoredRolesFromProfile(response, profile);
  return profile;
}
