import type {
  DashboardBalanceDelta,
  DashboardRankingEntity,
  DashboardTaskItemPayload,
  DashboardUrgentActionItem,
  DashboardUsage,
  RawRecord,
} from "./dashboard.types";

export function asRecord(value: unknown): RawRecord {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as RawRecord) : {};
}

export function toNumber(value: unknown, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function toNullableNumber(value: unknown) {
  if (value === null || value === undefined || value === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export function toText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export function toStringValue(value: unknown, fallback = ""): string {
  if (value === null || value === undefined) return fallback;
  const str = String(value).trim();
  return str || fallback;
}

export function toNumberOrUndefined(value: unknown): number | undefined {
  if (value === null || value === undefined || value === "") return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function normalizeDelta(value: unknown): DashboardBalanceDelta {
  const delta = asRecord(value);

  return {
    change: toNumber(delta.change),
    current: toNumber(delta.current),
    percent: toNullableNumber(delta.percent),
    previous: toNumber(delta.previous),
  };
}

export const normalizeBalanceDelta = normalizeDelta;

export function normalizeUsage(value: unknown): DashboardUsage {
  const usage = asRecord(value);

  return {
    current: Math.max(0, toNumber(usage.current)),
    previous: Math.max(0, toNumber(usage.previous)),
    totalAvailable: Math.max(0, toNumber(usage.total_available)),
  };
}

export function normalizeRankingEntity(
  value: unknown,
  fallbackRank: number | null = null,
): DashboardRankingEntity {
  const entity = asRecord(value);
  const entityId = String(
    entity.agency_id ?? entity.agent_id ?? entity.id ?? entity._id ?? entity.user_id ?? "",
  ).trim();

  return {
    entityId,
    levelSlug: toText(entity.level_slug),
    levelTitle: toText(entity.level_title),
    name:
      toText(entity.agency_name) ||
      toText(entity.agent_name) ||
      toText(entity.name) ||
      toText(entity.title) ||
      "—",
    rank: toNullableNumber(entity.rank ?? entity.position) ?? fallbackRank,
    totalScore: toNumber(entity.total_score ?? entity.score),
  };
}

export function normalizePublishedAdvertises(value: unknown) {
  const publishedAdvertises = asRecord(value);
  const rawBreakdown = Array.isArray(publishedAdvertises.breakdown)
    ? publishedAdvertises.breakdown
    : [];

  return {
    breakdown: rawBreakdown.map((item) => {
      const breakdownItem = asRecord(item);
      const categoryId = breakdownItem.category_id;

      return {
        categoryId: categoryId === null || categoryId === undefined ? null : String(categoryId),
        count: Math.max(0, toNumber(breakdownItem.count)),
        label: toText(breakdownItem.label),
        percent: Math.max(0, toNumber(breakdownItem.percent)),
        type: toText(breakdownItem.type),
      };
    }),
    total: Math.max(0, toNumber(publishedAdvertises.total)),
  };
}

export function normalizeBalances(value: unknown) {
  const balances = asRecord(value);

  return {
    adCreditBalance: Math.max(0, toNumber(balances.ad_credit_balance)),
    unassignedAdCreditBalance:
      balances.unassigned_ad_credit_balance !== undefined
        ? Math.max(0, toNumber(balances.unassigned_ad_credit_balance))
        : Math.max(0, toNumber(balances.ad_credit_balance)),
    panelDaysRemaining: Math.max(0, toNumber(balances.panel_days_remaining)),
    panelExpiresAt: toText(balances.panel_expires_at) || null,
    renewCreditBalance: Math.max(0, toNumber(balances.renew_credit_balance)),
    unassignedRenewCreditBalance:
      balances.unassigned_renew_credit_balance !== undefined
        ? Math.max(0, toNumber(balances.unassigned_renew_credit_balance))
        : Math.max(0, toNumber(balances.renew_credit_balance)),
    specialCreditBalance: Math.max(0, toNumber(balances.special_credit_balance)),
    unassignedSpecialCreditBalance:
      balances.unassigned_special_credit_balance !== undefined
        ? Math.max(0, toNumber(balances.unassigned_special_credit_balance))
        : Math.max(0, toNumber(balances.special_credit_balance)),
  };
}

export function normalizeBalanceDeltas(value: unknown) {
  const deltas = asRecord(value);

  return {
    adCreditUsed: normalizeDelta(deltas.ad_credit_used),
    renewCreditUsed: normalizeDelta(deltas.renew_credit_used),
    specialCreditUsed: normalizeDelta(deltas.special_credit_used),
  };
}

export function normalizeUrgentActions(value: unknown): DashboardUrgentActionItem[] {
  if (!Array.isArray(value)) return [];

  return value.map((item, index) => {
    const rec = asRecord(item);
    const priority =
      rec.priority === "critical" || rec.priority === "high" || rec.priority === "medium"
        ? rec.priority
        : "medium";

    return {
      id: String(rec.id ?? `urgent_${index}`),
      count: Math.max(0, toNumber(rec.count)),
      title: toText(rec.title) || "اقدام فوری",
      description: toText(rec.description),
      priority,
      priorityLabel:
        toText(rec.priority_label) ||
        (priority === "critical" ? "خیلی بالا" : priority === "high" ? "بالا" : "متوسط"),
      to: toText(rec.to) || "/account/dashboard",
    };
  });
}

export function normalizeTasks(value: unknown): DashboardTaskItemPayload[] {
  if (!Array.isArray(value)) return [];

  return value.map((item, index) => {
    const rec = asRecord(item);
    return {
      id: String(rec.id ?? `task_${index}`),
      count: Math.max(0, toNumber(rec.count)),
      label: toText(rec.label) || "مورد",
      to: toText(rec.to) || "/account/manage-ads",
    };
  });
}
