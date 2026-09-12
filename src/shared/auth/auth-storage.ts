export type AuthRoleSlug =
  | "user"
  | "real_estate_manager"
  | "real_estate_consultant"
  | "independent_consultant"
  | "super-admin"
  | "crm_advertise_manager"
  | "crm_finance_manager"
  | "support";

export type AuthRole = {
  id: string;
  name: string;
  slug: AuthRoleSlug;
};

export const authRoleSlugs: AuthRoleSlug[] = [
  "user",
  "real_estate_manager",
  "real_estate_consultant",
  "independent_consultant",
  "super-admin",
  "crm_advertise_manager",
  "crm_finance_manager",
  "support",
];

export function normalizeAuthRoleSlug(value: unknown): AuthRoleSlug {
  const normalized = typeof value === "string" ? value.trim().toLowerCase() : "";

  if (
    normalized === "superadmin" ||
    normalized === "super admin" ||
    normalized === "super-admin" ||
    normalized === "super_admin"
  ) {
    return "super-admin";
  }

  const underscored = normalized.replace(/-/g, "_");

  if (authRoleSlugs.includes(underscored as AuthRoleSlug)) {
    return underscored as AuthRoleSlug;
  }

  return "user";
}

export type AuthSession = {
  accessToken: string;
  accountType: string;
  activeRole?: AuthRoleSlug;
  expiresAt: number | null;
  mobile: string;
  role: AuthRoleSlug;
  roles: AuthRole[];
  userId?: string;
};

const authSessionKey = "bonga-auth-session";
const authSessionChangedEvent = "bonga-auth-session-changed";
const pendingMobileKey = "bonga-pending-mobile";
const otpResendAtKey = "bonga-otp-resend-at";
const loginRedirectPathKey = "bonga-login-redirect-path";

export const otpResendCooldownMilliseconds = 60_000;
export const authSessionChangedEventName = authSessionChangedEvent;

export function setStoredAuthSession(session: AuthSession) {
  const role = normalizeAuthRoleSlug(session.role);
  const activeRole = normalizeAuthRoleSlug(session.activeRole ?? role);
  const roles = ((Array.isArray(session.roles) ? session.roles : []) as AuthRole[])
    .map((item, index): AuthRole => ({
      id: String(item.id ?? index + 1),
      name: item.name || normalizeAuthRoleSlug(item.slug),
      slug: normalizeAuthRoleSlug(item.slug),
    }))
    .filter((item, index, items) =>
      items.findIndex((candidate) => candidate.slug === item.slug) === index,
    );

  if (!roles.some((item) => item.slug === activeRole)) {
    roles.push({ id: activeRole, name: activeRole, slug: activeRole });
  }

  const normalizedSession: AuthSession = {
    accessToken: session.accessToken ?? "",
    accountType: String(session.accountType ?? role),
    activeRole,
    expiresAt: typeof session.expiresAt === "number" ? session.expiresAt : null,
    mobile: String(session.mobile ?? ""),
    role,
    roles,
    userId: session.userId ? String(session.userId) : undefined,
  };

  window.localStorage.setItem(authSessionKey, JSON.stringify(normalizedSession));
  window.dispatchEvent(new CustomEvent(authSessionChangedEvent));
}

export function getStoredAuthSession() {
  const value = window.localStorage.getItem(authSessionKey);

  if (!value) return null;

  try {
    const parsed = JSON.parse(value) as AuthSession;

    if (parsed.expiresAt !== null && parsed.expiresAt <= Date.now()) {
      clearStoredAuthSession();
      return null;
    }

    if (!parsed.accessToken || typeof parsed.accessToken !== "string" || !parsed.accessToken.trim()) {
      clearStoredAuthSession();
      return null;
    }

    const role = normalizeAuthRoleSlug(parsed.role);
    const activeRole = normalizeAuthRoleSlug(parsed.activeRole ?? role);
    const roles = (Array.isArray(parsed.roles) ? parsed.roles : [])
      .map((item, index): AuthRole | null => {
        if (typeof item === "string") {
          const slug = normalizeAuthRoleSlug(item);
          return { id: String(index + 1), name: slug, slug };
        }

        if (!item || typeof item !== "object") return null;

        const slug = normalizeAuthRoleSlug(item.slug ?? item.name);
        return {
          id: String(item.id ?? index + 1),
          name: item.name || slug,
          slug,
        };
      })
      .filter((item): item is AuthRole => item !== null)
      .filter((item, index, items) =>
        items.findIndex((candidate) => candidate.slug === item.slug) === index,
      );

    if (!roles.some((item) => item.slug === activeRole)) {
      roles.push({ id: activeRole, name: activeRole, slug: activeRole });
    }

    const session: AuthSession = {
      accessToken: String(parsed.accessToken ?? ""),
      accountType: String(parsed.accountType ?? role),
      activeRole,
      expiresAt: typeof parsed.expiresAt === "number" ? parsed.expiresAt : null,
      mobile: String(parsed.mobile ?? ""),
      role,
      roles,
      userId: parsed.userId ? String(parsed.userId) : undefined,
    };

    if (JSON.stringify(parsed) !== JSON.stringify(session)) {
      window.localStorage.setItem(authSessionKey, JSON.stringify(session));
    }

    return session;
  } catch {
    clearStoredAuthSession();
    return null;
  }
}

export function getActiveAuthRole(session: AuthSession | null) {
  if (!session) return null;

  return normalizeAuthRoleSlug(session.activeRole ?? session.role);
}

export function setStoredActiveRole(activeRole: AuthRoleSlug) {
  const session = getStoredAuthSession();

  if (!session) return;

  const roles =
    activeRole === "user" && !session.roles.some((role) => role.slug === "user")
      ? [{ id: "user", name: "کاربر", slug: "user" as const }, ...session.roles]
      : session.roles;

  setStoredAuthSession({
    ...session,
    activeRole,
    roles,
  });
}

export function clearStoredAuthSession() {
  window.localStorage.removeItem(authSessionKey);
  window.dispatchEvent(new CustomEvent(authSessionChangedEvent));
}

export function getStoredAccessToken() {
  return getStoredAuthSession()?.accessToken ?? "";
}

export function storePendingOtpMobile(mobile: string) {
  window.sessionStorage.setItem(pendingMobileKey, mobile);
}

export function getPendingOtpMobile() {
  return window.sessionStorage.getItem(pendingMobileKey) ?? "";
}

export function startOtpResendCooldown() {
  window.sessionStorage.setItem(
    otpResendAtKey,
    String(Date.now() + otpResendCooldownMilliseconds),
  );
}

export function getOtpResendSecondsRemaining() {
  const resendAt = Number(window.sessionStorage.getItem(otpResendAtKey));

  if (!Number.isFinite(resendAt)) return 0;

  return Math.max(0, Math.ceil((resendAt - Date.now()) / 1000));
}

export function clearPendingOtpState() {
  window.sessionStorage.removeItem(pendingMobileKey);
  window.sessionStorage.removeItem(otpResendAtKey);
}


export function storeLoginRedirectPath(path: string) {
  window.sessionStorage.setItem(loginRedirectPathKey, path);
}

export function consumeLoginRedirectPath() {
  const path = window.sessionStorage.getItem(loginRedirectPathKey);
  window.sessionStorage.removeItem(loginRedirectPathKey);
  return path || "";
}
