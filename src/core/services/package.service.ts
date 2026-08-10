import { ApiError, api, publicApi } from "../api/api";
import {
  getActiveAuthRole,
  getStoredAuthSession,
} from "../auth/auth-storage";
import {
  INDEPENDENT_CONSULTANT,
  REAL_ESTATE_CONSULTANT,
  REAL_ESTATE_MANAGER,
} from "../../shared/constants/roles.constants";

export type PackageKind = "panel_subscription" | "credit_bundle";

export type PackageItem = {
  ad_credit: number;
  created_at: string;
  discount_percent: number;
  duration_days: number;
  final_price: number;
  id: string;
  is_active: boolean;
  kind: PackageKind;
  real_price: number;
  renew_credit: number;
  slug: string;
  sort_order: number;
  special_credit: number;
  title: string;
  updated_at: string;
};

type PackagesResponse = {
  list?: PackageItem[];
  status?: boolean;
};

export async function getPackages() {
  const response = await publicApi.get("public/package").json<PackagesResponse>();

  return Array.isArray(response.list)
    ? response.list
        .filter((item) => item.is_active)
        .sort((first, second) => first.sort_order - second.sort_order)
    : [];
}

export type PackagePaymentType = 0 | 1;
export type PackagePaymentScope = "agency" | "agent";

export type PackagePaymentPayload = {
  packageId: string;
  paymentType: PackagePaymentType;
  scope?: PackagePaymentScope;
};

export type PackagePaymentResult = {
  authority?: string;
  paymentId?: number | string;
  paymentType: PackagePaymentType;
  paymentUrl?: string;
  scope: PackagePaymentScope;
};

type ApiRecord = Record<string, unknown>;

function asRecord(value: unknown): ApiRecord | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as ApiRecord)
    : null;
}

function getPackagePaymentScope(): PackagePaymentScope {
  const activeRole = getActiveAuthRole(getStoredAuthSession());

  if (activeRole === REAL_ESTATE_MANAGER) return "agency";

  if (
    activeRole === REAL_ESTATE_CONSULTANT ||
    activeRole === INDEPENDENT_CONSULTANT
  ) {
    return "agent";
  }

  throw new ApiError(403, "خرید بسته برای نقش فعال شما در دسترس نیست.");
}

function getPaymentResponseRecord(response: ApiRecord) {
  return asRecord(response.data) ?? response;
}

function readPackagePaymentUrl(response: ApiRecord) {
  const data = getPaymentResponseRecord(response);
  const value = data.payment_url ?? response.payment_url;

  if (typeof value !== "string" || !value.trim()) return null;

  try {
    const url = new URL(value);

    if (url.protocol !== "http:" && url.protocol !== "https:") return null;

    return url.toString();
  } catch {
    return null;
  }
}

function readOptionalString(response: ApiRecord, key: string) {
  const data = getPaymentResponseRecord(response);
  const value = data[key] ?? response[key];

  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function readOptionalId(response: ApiRecord, key: string) {
  const data = getPaymentResponseRecord(response);
  const value = data[key] ?? response[key];

  return typeof value === "number" || typeof value === "string"
    ? value
    : undefined;
}

export async function payPackage({
  packageId,
  paymentType,
  scope = getPackagePaymentScope(),
}: PackagePaymentPayload): Promise<PackagePaymentResult> {
  const normalizedPackageId = packageId.trim();

  if (!normalizedPackageId) {
    throw new ApiError(400, "شناسه بسته معتبر نیست.");
  }

  const rawResponse = await api
    .post(
      `me/${scope}/packages/${encodeURIComponent(normalizedPackageId)}/pay`,
      {
        searchParams: { payment_type: paymentType },
      },
    )
    .json<unknown>();
  const response = asRecord(rawResponse) ?? {};
  const responseData = getPaymentResponseRecord(response);

  if (response.status === false || responseData.status === false) {
    throw new ApiError(400, "ایجاد درخواست پرداخت بسته با خطا مواجه شد.");
  }

  const paymentUrl = readPackagePaymentUrl(response);

  if (paymentType === 0 && !paymentUrl) {
    throw new ApiError(500, "آدرس درگاه پرداخت از سرور دریافت نشد.");
  }

  return {
    authority: readOptionalString(response, "authority"),
    paymentId: readOptionalId(response, "payment_id"),
    paymentType,
    paymentUrl: paymentUrl ?? undefined,
    scope,
  };
}

export function payAgencyPackage(
  packageId: string,
  paymentType: PackagePaymentType = 0,
) {
  return payPackage({ packageId, paymentType, scope: "agency" });
}

export function payAgentPackage(
  packageId: string,
  paymentType: PackagePaymentType = 0,
) {
  return payPackage({ packageId, paymentType, scope: "agent" });
}

export type AgentEntitlements = {
  adCreditBalance: number;
  panelDaysRemaining: number;
  panelExpiresAt: string | null;
  renewCreditBalance: number;
  specialCreditBalance: number;
};

export type AgentEntitlementLedgerItem = ApiRecord;

export type AgentEntitlementLedgerPage = {
  data: AgentEntitlementLedgerItem[];
  hasNextPage: boolean;
  page: number;
  perPage: number;
  total: number;
};

function toNumber(value: unknown, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function toNullableText(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function unwrapDataRecord(value: unknown) {
  const root = asRecord(value) ?? {};
  return asRecord(root.data) ?? root;
}

export async function getAgentEntitlements(): Promise<AgentEntitlements> {
  const response = await api.get("me/agent/entitlements").json<unknown>();
  const root = unwrapDataRecord(response);
  const data =
    asRecord(root.entitlement) ?? asRecord(root.balances) ?? root;
  const expectedFields = [
    "ad_credit_balance",
    "adCreditBalance",
    "panel_days_remaining",
    "panelDaysRemaining",
    "panel_expires_at",
    "panelExpiresAt",
    "renew_credit_balance",
    "renewCreditBalance",
    "special_credit_balance",
    "specialCreditBalance",
  ];

  if (!expectedFields.some((key) => Object.prototype.hasOwnProperty.call(data, key))) {
    throw new ApiError(500, "ساختار اعتبار مشاور از سرور قابل تشخیص نیست.");
  }

  return {
    adCreditBalance: Math.max(
      0,
      toNumber(
        data.ad_credit_balance ?? data.adCreditBalance ?? data.ad_credit,
      ),
    ),
    panelDaysRemaining: Math.max(
      0,
      toNumber(
        data.panel_days_remaining ?? data.panelDaysRemaining ?? data.panel_days,
      ),
    ),
    panelExpiresAt: toNullableText(
      data.panel_expires_at ?? data.panelExpiresAt ?? data.expires_at,
    ),
    renewCreditBalance: Math.max(
      0,
      toNumber(
        data.renew_credit_balance ??
          data.renewCreditBalance ??
          data.renew_credit,
      ),
    ),
    specialCreditBalance: Math.max(
      0,
      toNumber(
        data.special_credit_balance ??
          data.specialCreditBalance ??
          data.special_credit,
      ),
    ),
  };
}

function readLedgerItems(value: unknown): AgentEntitlementLedgerItem[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is ApiRecord => asRecord(item) !== null);
  }

  const record = asRecord(value);
  if (!record) return [];

  for (const key of ["items", "list", "ledger", "history", "result"]) {
    if (Array.isArray(record[key])) return readLedgerItems(record[key]);
  }

  return readLedgerItems(record.data);
}

function readPaginationNumber(
  records: Array<ApiRecord | null>,
  keys: string[],
) {
  for (const record of records) {
    if (!record) continue;

    for (const key of keys) {
      const rawValue = record[key];

      if (rawValue === null || rawValue === undefined || rawValue === "") {
        continue;
      }

      const value = Number(rawValue);
      if (Number.isFinite(value)) return value;
    }
  }

  return undefined;
}

export async function getAgentEntitlementLedger({
  page = 1,
  perPage = 20,
}: {
  page?: number;
  perPage?: number;
} = {}): Promise<AgentEntitlementLedgerPage> {
  const response = await api
    .get("me/agent/entitlements/ledger", {
      searchParams: { page, per_page: perPage },
    })
    .json<unknown>();
  const root = asRecord(response);
  const dataRecord = asRecord(root?.data);
  const meta =
    asRecord(root?.meta) ??
    asRecord(root?.pagination) ??
    asRecord(dataRecord?.meta) ??
    asRecord(dataRecord?.pagination);
  const data = readLedgerItems(response);
  const currentPage =
    readPaginationNumber(
      [meta, dataRecord, root],
      ["current_page", "page"],
    ) ?? page;
  const resolvedPerPage =
    readPaginationNumber(
      [meta, dataRecord, root],
      ["per_page", "perPage"],
    ) ?? perPage;
  const reportedTotal = readPaginationNumber(
    [meta, dataRecord, root],
    ["total"],
  );
  const lastPage = readPaginationNumber(
    [meta, dataRecord, root],
    ["last_page", "lastPage", "total_pages"],
  );

  return {
    data,
    hasNextPage:
      lastPage !== undefined
        ? currentPage < lastPage
        : reportedTotal !== undefined
          ? currentPage * resolvedPerPage < reportedTotal
          : data.length >= resolvedPerPage,
    page: currentPage,
    perPage: resolvedPerPage,
    total: reportedTotal ?? data.length,
  };
}
