export type AuthRole = {
  id: string;
  name: string;
  slug: string;
};

export type AuthSession = {
  accessToken: string;
  accountType: string;
  expiresAt: number | null;
  mobile: string;
  role: string;
  roles: AuthRole[];
};

const authSessionKey = "bonga-auth-session";
const pendingMobileKey = "bonga-pending-mobile";
const otpResendAtKey = "bonga-otp-resend-at";

export const otpResendCooldownMilliseconds = 60_000;

export function storeAuthSession(session: AuthSession) {
  window.localStorage.setItem(authSessionKey, JSON.stringify(session));
}

export function getStoredAuthSession() {
  const value = window.localStorage.getItem(authSessionKey);

  if (!value) {
    return null;
  }

  try {
    const session = JSON.parse(value) as AuthSession;

    if (session.expiresAt !== null && session.expiresAt <= Date.now()) {
      clearAuthSession();
      return null;
    }

    return session;
  } catch {
    clearAuthSession();
    return null;
  }
}

export function clearAuthSession() {
  window.localStorage.removeItem(authSessionKey);
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

  if (!Number.isFinite(resendAt)) {
    return 0;
  }

  return Math.max(0, Math.ceil((resendAt - Date.now()) / 1000));
}

export function clearPendingOtpState() {
  window.sessionStorage.removeItem(pendingMobileKey);
  window.sessionStorage.removeItem(otpResendAtKey);
}

export function formatMobileForDisplay(mobile: string) {
  return mobile.replace(/^(\d{4})(\d{3})(\d{4})$/, "$1 $2 $3");
}
