import { api, ApiError, getApiErrorMessage, publicApi } from "../api/api";
import {
  clearPendingOtpState,
  clearStoredAuthSession,
  setStoredAuthSession,
  startOtpResendCooldown,
  storePendingOtpMobile,
  type AuthRole,
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
  role: string;
  roles: AuthRole[];
  token: string;
  tokens: {
    access_token: string;
  };
};

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

  setStoredAuthSession({
    accessToken,
    accountType: response.account_type,
    expiresAt: response.expires_in
      ? Date.now() + response.expires_in * 1000
      : null,
    mobile,
    role: response.role,
    roles: response.roles,
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
