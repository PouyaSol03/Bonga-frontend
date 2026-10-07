import { ApiError, apiV2, getActiveV2Role, publicApi } from "../../../shared/api/api";
import type {
  PackageItem,
  PackagePaymentPayload,
  PackagePaymentResult,
  PackagePaymentScope,
  PackageQueryParams,
  PackagesApiResponse,
} from "./package-types";

export * from "./package-types";
export * from "./package-entitlement.service";

type ApiRecord = Record<string, unknown>;

function asRecord(value: unknown): ApiRecord | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as ApiRecord)
    : null;
}

export function resolvePackageRoleSegment(
  role?: string,
  scope?: PackagePaymentScope,
): string {
  if (role?.trim()) return role.trim();
  if (scope === "agency") return "agency";
  if (scope === "agent" || scope === "independent-consultant") {
    return "independent-consultant";
  }
  return getActiveV2Role();
}

export function buildPackageEndpoint(
  packageId?: string | number,
  subPath?: string,
  role?: string,
  scope?: PackagePaymentScope,
): string {
  const rolePrefix = role || scope ? resolvePackageRoleSegment(role, scope) : "";
  const base = rolePrefix ? `${rolePrefix}/packages` : "packages";
  if (packageId === undefined) return base;
  const withId = `${base}/${encodeURIComponent(String(packageId))}`;
  return subPath ? `${withId}/${subPath}` : withId;
}

export async function getPackages({
  role,
  scope,
}: PackageQueryParams = {}): Promise<PackageItem[]> {
  const endpoint = buildPackageEndpoint(undefined, undefined, role, scope);
  try {
    const response = await apiV2.get(endpoint).json<PackagesApiResponse>();
    const list = Array.isArray(response.list) ? response.list : [];
    return list
      .filter((item) => item.is_active)
      .sort((a, b) => a.sort_order - b.sort_order);
  } catch (err) {
    if (role || scope) throw err;
    const fallbackResponse = await publicApi.get("public/package").json<PackagesApiResponse>();
    const fallbackList = Array.isArray(fallbackResponse.list) ? fallbackResponse.list : [];
    return fallbackList
      .filter((item) => item.is_active)
      .sort((a, b) => a.sort_order - b.sort_order);
  }
}

function readPackagePaymentUrl(response: ApiRecord): string | null {
  const data = asRecord(response.data) ?? response;
  const value = data.payment_url ?? response.payment_url ?? data.url ?? response.url;
  if (typeof value !== "string" || !value.trim()) return null;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

function readOptionalString(response: ApiRecord, key: string): string | undefined {
  const data = asRecord(response.data) ?? response;
  const value = data[key] ?? response[key];
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function readOptionalId(response: ApiRecord, key: string): number | string | undefined {
  const data = asRecord(response.data) ?? response;
  const value = data[key] ?? response[key];
  return typeof value === "number" || typeof value === "string" ? value : undefined;
}

export async function payPackage({
  discountCode,
  packageId,
  paymentType,
  role,
  scope,
}: PackagePaymentPayload): Promise<PackagePaymentResult> {
  const normalizedPackageId = String(packageId ?? "").trim();
  if (!normalizedPackageId) {
    throw new ApiError(400, "شناسه بسته معتبر نیست.");
  }

  const endpoint = buildPackageEndpoint(normalizedPackageId, "pay", role, scope);
  const body: Record<string, string | number> = { payment_type: paymentType };
  const searchParams: Record<string, string | number> = { payment_type: paymentType };
  if (discountCode?.trim()) {
    body.discount_code = discountCode.trim();
    searchParams.discount_code = discountCode.trim();
  }

  const rawResponse = await apiV2
    .post(endpoint, {
      json: body,
      searchParams,
    })
    .json<unknown>();
  const response = asRecord(rawResponse) ?? {};
  const responseData = asRecord(response.data) ?? response;

  if (response.status === false || responseData.status === false) {
    throw new ApiError(400, "ایجاد درخواست پرداخت بسته با خطا مواجه شد.");
  }

  const paymentUrl = readPackagePaymentUrl(response);
  const paid = Boolean(responseData.paid ?? response.paid);

  if (paymentType === 0 && !paymentUrl && !paid) {
    throw new ApiError(500, "آدرس درگاه پرداخت از سرور دریافت نشد.");
  }

  const resolvedScope = (scope ?? (resolvePackageRoleSegment(role, scope) === "agency" ? "agency" : "independent-consultant")) as PackagePaymentScope;

  return {
    authority: readOptionalString(response, "authority"),
    paid,
    paymentId: readOptionalId(response, "payment_id"),
    paymentType,
    paymentUrl: paymentUrl ?? undefined,
    scope: resolvedScope,
  };
}

export function payAgencyPackage(
  packageId: string | number,
  paymentType: PackagePaymentPayload["paymentType"] = 0,
  discountCode?: string,
) {
  return payPackage({ discountCode, packageId, paymentType, scope: "agency" });
}

export function payAgentPackage(
  packageId: string | number,
  paymentType: PackagePaymentPayload["paymentType"] = 0,
  discountCode?: string,
) {
  return payPackage({ discountCode, packageId, paymentType, scope: "independent-consultant" });
}


