import { getCrmRecordId } from "../api/crm.service";
import type { CrmPackagePayload, CrmRecord, PackageDraft } from "./types";

export function text(record: CrmRecord, keys: string[], fallback = ""): string {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" || typeof value === "number") return String(value);
  }
  return fallback;
}

export function visibleNumberText(record: CrmRecord, key: string): string {
  const value = record[key];
  const parsed = Number(value);
  return value !== null && value !== undefined && Number.isFinite(parsed) && parsed !== 0
    ? String(value)
    : "";
}

export function packageRecordId(item: CrmRecord): string {
  return getCrmRecordId(item) || text(item, ["slug"]);
}

export function draftFromPackage(item: CrmRecord): PackageDraft {
  return {
    adCredit: visibleNumberText(item, "ad_credit"),
    discountPercent: visibleNumberText(item, "discount_percent"),
    durationDays: visibleNumberText(item, "duration_days"),
    isActive: item.is_active !== false,
    kind: item.kind === "credit_bundle" ? "credit_bundle" : "panel_subscription",
    realPrice: visibleNumberText(item, "real_price"),
    renewCredit: visibleNumberText(item, "renew_credit"),
    slug: text(item, ["slug"]),
    sortOrder: visibleNumberText(item, "sort_order"),
    specialCredit: visibleNumberText(item, "special_credit"),
    title: text(item, ["title"]),
  };
}

function parseNonNegativeNumber(value: string, label: string): number {
  const clean = value.replace(/,/g, "").trim();
  if (!clean) return 0;
  const parsed = Number(clean);
  if (!Number.isFinite(parsed) || parsed < 0) {
    throw new Error(`${label} باید عدد صفر یا بزرگ‌تر باشد.`);
  }
  return parsed;
}

function parseDiscountPercent(value: string): number {
  const clean = value.replace(/,/g, "").trim();
  if (!clean) return 0;
  const parsed = Number(clean);
  if (!Number.isFinite(parsed) || parsed < 0 || parsed > 100) {
    throw new Error("درصد تخفیف باید عددی بین ۰ تا ۱۰۰ باشد.");
  }
  return parsed;
}

function parseInteger(value: string, label: string, min = 0): number {
  const clean = value.replace(/,/g, "").trim();
  if (!clean) return 0;
  const parsed = Number(clean);
  if (!Number.isInteger(parsed) || parsed < min) {
    throw new Error(`${label} باید عدد صحیح حداقل ${min} باشد.`);
  }
  return parsed;
}

export function buildPackagePayload(
  draft: PackageDraft,
  existingId?: string | null,
): CrmPackagePayload {
  const slug = draft.slug.trim();
  const title = draft.title.trim();

  if (!slug) throw new Error("اسلاگ بسته الزامی است.");
  if (!title) throw new Error("عنوان بسته الزامی است.");

  const isPanelSubscription = draft.kind === "panel_subscription";

  return {
    id: existingId?.trim() || slug,
    slug,
    kind: draft.kind,
    title,
    real_price: parseNonNegativeNumber(draft.realPrice, "قیمت"),
    discount_percent: parseDiscountPercent(draft.discountPercent),
    duration_days: isPanelSubscription
      ? parseInteger(draft.durationDays, "مدت بسته", 1)
      : parseInteger(draft.durationDays, "مدت بسته", 0),
    ad_credit: parseInteger(draft.adCredit, "اعتبار آگهی", 0),
    special_credit: parseInteger(draft.specialCredit, "اعتبار ویژه", 0),
    renew_credit: parseInteger(draft.renewCredit, "اعتبار بروزرسانی", 0),
    sort_order: parseInteger(draft.sortOrder, "ترتیب نمایش", 0),
    is_active: draft.isActive,
  };
}

export function packageToPayload(
  item: CrmRecord,
  nextActive?: boolean,
): CrmPackagePayload {
  const id = packageRecordId(item);
  return {
    id,
    slug: text(item, ["slug"]),
    kind: item.kind === "credit_bundle" ? "credit_bundle" : "panel_subscription",
    title: text(item, ["title"]),
    real_price: Number(item.real_price ?? 0),
    discount_percent: Number(item.discount_percent ?? 0),
    duration_days: Number(item.duration_days ?? 0),
    ad_credit: Number(item.ad_credit ?? 0),
    special_credit: Number(item.special_credit ?? 0),
    renew_credit: Number(item.renew_credit ?? 0),
    sort_order: Number(item.sort_order ?? 0),
    is_active: nextActive !== undefined ? nextActive : item.is_active !== false,
  };
}
