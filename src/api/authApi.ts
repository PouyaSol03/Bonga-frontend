import { ApiError, apiRequest, getApiErrorMessage } from "./apiClient";
import {
  clearAuthSession,
  clearPendingOtpState,
  startOtpResendCooldown,
  storeAuthSession,
  storePendingOtpMobile,
} from "./authSession";

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
  roles: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
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
    await apiRequest<RequestOtpResponse>("/public/auth/request-otp", {
      authenticated: false,
      body: JSON.stringify({ mobile }),
      method: "POST",
    }),
  );

  storePendingOtpMobile(mobile);
  startOtpResendCooldown();

  return response;
}

export async function verifyOtp({ mobile, code }: VerifyOtpPayload) {
  const response = requireSuccess(
    await apiRequest<VerifyOtpResponse>("/public/auth/verify-otp", {
      authenticated: false,
      body: JSON.stringify({ mobile, code }),
      method: "POST",
    }),
  );
  const accessToken =
    response.access_token || response.tokens?.access_token || response.token;

  if (!accessToken) {
    throw new ApiError(200, "توکن ورود از سرور دریافت نشد.");
  }

  storeAuthSession({
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
    await apiRequest<RequestOtpResponse>("/public/auth/resend-otp", {
      authenticated: false,
      body: JSON.stringify({ mobile }),
      method: "POST",
    }),
  );

  startOtpResendCooldown();

  return response;
}

export function getAuthenticatedUser<T = unknown>() {
  return apiRequest<T>("/me/auth/me", { method: "GET" });
}

export async function logout() {
  try {
    return await apiRequest<StatusResponse>("/me/auth/logout", { method: "GET" });
  } finally {
    clearAuthSession();
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

export function getAuthErrorMessage(error: unknown, fallback: string) {
  return getApiErrorMessage(error, fallback);
}
