export type AuthRoleSlug =
  | "user"
  | "real_estate_manager"
  | "real_estate_consultant"
  | "independent_consultant";

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
];

export type AuthSession = {
  accessToken: string;
  accountType: string;
  expiresAt: number | null;
  mobile: string;
  role: AuthRoleSlug;
  roles: AuthRole[];
};

const authSessionKey = "bonga-auth-session";
const pendingMobileKey = "bonga-pending-mobile";
const otpResendAtKey = "bonga-otp-resend-at";
const loginRedirectPathKey = "bonga-login-redirect-path";

export const otpResendCooldownMilliseconds = 60_000;

export function setStoredAuthSession(session: AuthSession) {
  window.localStorage.setItem(authSessionKey, JSON.stringify(session));
}

export function getStoredAuthSession() {
  const value = window.localStorage.getItem(authSessionKey);

  if (!value) return null;

  try {
    const session = JSON.parse(value) as AuthSession;

    if (session.expiresAt !== null && session.expiresAt <= Date.now()) {
      clearStoredAuthSession();
      return null;
    }

    return session;
  } catch {
    clearStoredAuthSession();
    return null;
  }
}

export function clearStoredAuthSession() {
  window.localStorage.removeItem(authSessionKey);
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
