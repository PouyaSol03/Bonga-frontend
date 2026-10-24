import { ApiError, apiV2, getActiveV2Role, type V2RoleSegment } from "../../../shared/api/api";
import type { AgentEntitlements } from "./package-types";

type ApiRecord = Record<string, unknown>;

function asRecord(value: unknown): ApiRecord | null {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as ApiRecord) : null;
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

export async function getAgentEntitlements(
  context: V2RoleSegment = getActiveV2Role(),
): Promise<AgentEntitlements> {
  const response = await apiV2.get(`${context}/entitlements`).json<unknown>();
  const root = unwrapDataRecord(response);
  const data = asRecord(root.entitlement) ?? asRecord(root.balances) ?? root;
  const expectedFields = [
    "ad_credit",
    "renew_credit",
    "special_credit",
    "panel_days",
    "expires_at",
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
    adCreditBalance: Math.max(
      0,
      toNumber(data.ad_credit_balance ?? data.adCreditBalance ?? data.ad_credit),
    ),
    panelDaysRemaining: Math.max(
      0,
      toNumber(data.panel_days_remaining ?? data.panelDaysRemaining ?? data.panel_days),
    ),
    panelExpiresAt: toNullableText(data.panel_expires_at ?? data.panelExpiresAt ?? data.expires_at),
    renewCreditBalance: Math.max(
      0,
      toNumber(data.renew_credit_balance ?? data.renewCreditBalance ?? data.renew_credit),
    ),
    specialCreditBalance: Math.max(
      0,
      toNumber(data.special_credit_balance ?? data.specialCreditBalance ?? data.special_credit),
    ),
  };
}

