import { ApiError, apiV2, getActiveV2Role, type V2RoleSegment } from "../../../shared/api/api";
import type {
  AgentEntitlements,
  AgentEntitlementLedgerItem,
  AgentEntitlementLedgerPage,
} from "./package-types";

type ApiRecord = Record<string, unknown>;

function asRecord(value: unknown): ApiRecord | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as ApiRecord)
    : null;
}

function toNumber(value: unknown, fallback = 0): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function toNullableText(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function unwrapDataRecord(value: unknown): ApiRecord {
  const root = asRecord(value) ?? {};
  return asRecord(root.data) ?? root;
}

export async function getAgentEntitlements(context: V2RoleSegment = getActiveV2Role()): Promise<AgentEntitlements> {
  const response = await apiV2.get(`${context}/entitlements`).json<unknown>();
  const root = unwrapDataRecord(response);
  const data = asRecord(root.entitlement) ?? asRecord(root.balances) ?? root;
  const expectedFields = [
    "ad_credit", "renew_credit", "special_credit", "panel_days", "expires_at",
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
    throw new ApiError(500, "ساختار اعتبار از سرور قابل تشخیص نیست.");
  }

  return {
    adCreditBalance: Math.max(0, toNumber(data.ad_credit_balance ?? data.adCreditBalance ?? data.ad_credit)),
    panelDaysRemaining: Math.max(0, toNumber(data.panel_days_remaining ?? data.panelDaysRemaining ?? data.panel_days)),
    panelExpiresAt: toNullableText(data.panel_expires_at ?? data.panelExpiresAt ?? data.expires_at),
    renewCreditBalance: Math.max(0, toNumber(data.renew_credit_balance ?? data.renewCreditBalance ?? data.renew_credit)),
    specialCreditBalance: Math.max(0, toNumber(data.special_credit_balance ?? data.specialCreditBalance ?? data.special_credit)),
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

function readPaginationNumber(records: Array<ApiRecord | null>, keys: string[]): number | undefined {
  for (const record of records) {
    if (!record) continue;
    for (const key of keys) {
      const rawValue = record[key];
      if (rawValue === null || rawValue === undefined || rawValue === "") continue;
      const value = Number(rawValue);
      if (Number.isFinite(value)) return value;
    }
  }
  return undefined;
}

export async function getAgentEntitlementLedger({
  page = 1,
  perPage = 20,
  context = getActiveV2Role(),
}: {
  page?: number;
  perPage?: number;
  context?: V2RoleSegment;
} = {}): Promise<AgentEntitlementLedgerPage> {
  const response = await apiV2
    .get(`${context}/entitlements/ledger`, {
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
  const currentPage = readPaginationNumber([meta, dataRecord, root], ["current_page", "page"]) ?? page;
  const resolvedPerPage = readPaginationNumber([meta, dataRecord, root], ["per_page", "perPage"]) ?? perPage;
  const reportedTotal = readPaginationNumber([meta, dataRecord, root], ["total"]);
  const lastPage = readPaginationNumber([meta, dataRecord, root], ["last_page", "lastPage", "total_pages"]);

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
