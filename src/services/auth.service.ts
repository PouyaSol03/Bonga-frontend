import { api, ApiError, getApiErrorMessage, publicApi } from "../api/api";
import {
  clearPendingOtpState,
  clearStoredAuthSession,
  setStoredAuthSession,
  startOtpResendCooldown,
  storePendingOtpMobile,
  authRoleSlugs,
  type AuthRole,
  type AuthRoleSlug,
} from "../auth/auth-storage";

type AuthRequestPayload = {
  mobile: string;
};

type VerifyOtpPayload = AuthRequestPayload & {
  code: string;
};

type StatusResponse = {
  message: string;
  status: boolean;
};

export type RequestOtpResponse = StatusResponse & {
  has_city: boolean;
  smsRes: StatusResponse;
};

export type VerifyOtpResponse = StatusResponse & {
  access_token: string;
  account_type: string;
  expires_in: number;
  role?: string;
  roles?: Array<AuthRole | string>;
  token: string;
  tokens: {
    access_token: string;
  };
};


function normalizeAuthRoleSlug(value: unknown): AuthRoleSlug {
  const normalized = typeof value === "string" ? value.trim().toLowerCase() : "";

  if (
    normalized === "superadmin" ||
    normalized === "super admin" ||
    normalized === "super-admin" ||
    normalized === "super_admin"
  ) {
    return "super-admin";
  }

  if (typeof value === "string" && authRoleSlugs.includes(value as AuthRoleSlug)) {
    return value as AuthRoleSlug;
  }

  return "user";
}

function normalizeAuthRoles(response: VerifyOtpResponse): AuthRole[] {
  const rawRoles = Array.isArray(response.roles) ? response.roles : [];
  const normalizedRoles = rawRoles
    .map((role, index): AuthRole | null => {
      if (typeof role === "string") {
        const slug = normalizeAuthRoleSlug(role);
        return { id: String(index + 1), name: slug, slug };
      }

      if (role && typeof role === "object") {
        const slug = normalizeAuthRoleSlug(role.slug ?? role.name);
        return {
          id: String(role.id ?? index + 1),
          name: role.name || slug,
          slug,
        };
      }

      return null;
    })
    .filter((role): role is AuthRole => role !== null);

  if (normalizedRoles.length > 0) {
    return normalizedRoles;
  }

  const fallbackSlug = normalizeAuthRoleSlug(response.role ?? response.account_type);
  return [{ id: "1", name: fallbackSlug, slug: fallbackSlug }];
}

function requireSuccess<T extends StatusResponse>(response: T) {
  if (!response.status) {
    throw new ApiError(200, response.message || "درخواست با خطا مواجه شد.");
  }

  return response;
}

export async function requestOtp({ mobile }: AuthRequestPayload) {
  const response = requireSuccess(
    await publicApi
      .post("public/auth/request-otp", {
        json: { mobile },
      })
      .json<RequestOtpResponse>(),
  );

  storePendingOtpMobile(mobile);
  startOtpResendCooldown();

  return response;
}

export async function verifyOtp({ mobile, code }: VerifyOtpPayload) {
  const response = requireSuccess(
    await publicApi
      .post("public/auth/verify-otp", {
        json: { code, mobile },
      })
      .json<VerifyOtpResponse>(),
  );
  const accessToken =
    response.access_token || response.tokens?.access_token || response.token;

  if (!accessToken) {
    throw new ApiError(200, "توکن ورود از سرور دریافت نشد.");
  }

  const roles = normalizeAuthRoles(response);
  const role = normalizeAuthRoleSlug(response.role ?? roles[0]?.slug ?? response.account_type);

  setStoredAuthSession({
    accessToken,
    accountType: response.account_type ?? role,
    activeRole: role,
    expiresAt: response.expires_in
      ? Date.now() + response.expires_in * 1000
      : null,
    mobile,
    role,
    roles,
  });
  clearPendingOtpState();

  return response;
}

export async function resendOtp({ mobile }: AuthRequestPayload) {
  const response = requireSuccess(
    await publicApi
      .post("public/auth/resend-otp", {
        json: { mobile },
      })
      .json<RequestOtpResponse>(),
  );

  startOtpResendCooldown();

  return response;
}

export function getAuthenticatedUser<T = unknown>() {
  return api.get("me/auth/me").json<T>();
}

export async function logout() {
  try {
    return await api.get("me/auth/logout").json<StatusResponse>();
  } finally {
    clearStoredAuthSession();
  }
}

export function normalizeDigits(value: string) {
  return value
    .replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)));
}

export function normalizeMobile(value: string) {
  return normalizeDigits(value).replace(/\D/g, "").slice(0, 11);
}

export function formatMobileForDisplay(mobile: string) {
  return mobile.replace(/^(\d{4})(\d{3})(\d{4})$/, "$1 $2 $3");
}

export function getAuthErrorMessage(error: unknown, fallback: string) {
  return getApiErrorMessage(error, fallback);
}
