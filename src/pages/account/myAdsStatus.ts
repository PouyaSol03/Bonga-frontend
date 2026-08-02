export type MyAdStatusKey = "deleted" | "expired" | "needs_edit" | "pending" | "published" | "unknown";

export type MyAdStatusInfo = {
  badgeClassName: string;
  key: MyAdStatusKey;
  label: string;
};

export const myAdStatusConfig: Record<MyAdStatusKey, MyAdStatusInfo> = {
  unknown: {
    badgeClassName: "bg-[#f0f0f0] text-[#808080]",
    key: "unknown",
    label: "وضعیت نامشخص",
  },
  published: {
    badgeClassName: "bg-[#11a36614] text-[#11a366]",
    key: "published",
    label: "منتشر شده",
  },
  deleted: {
    badgeClassName: "bg-[#ee362314] text-[#d22335]",
    key: "deleted",
    label: "حذف شده",
  },
  expired: {
    badgeClassName: "bg-[#ee362314] text-[#ee3623]",
    key: "expired",
    label: "منقضی شده",
  },
  pending: {
    badgeClassName: "bg-[#ff6d0014] text-[#ff6d00]",
    key: "pending",
    label: "در انتظار تایید انتشار",
  },
  needs_edit: {
    badgeClassName: "bg-[#ff6d0014] text-[#ff6d00]",
    key: "needs_edit",
    label: "نیازمند ویرایش",
  },
};



function normalizeStatusText(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  if (typeof value !== "string") return "";

  return value
    .trim()
    .toLowerCase()
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/‌/g, " ")
    .replace(/_/g, "-");
}

function readCandidateStatus(source: unknown) {
  if (!source) return undefined;

  if (typeof source === "string" || typeof source === "number") return source;

  if (typeof source !== "object") return undefined;

  const record = source as Record<string, unknown>;
  const directCandidate =
    record.status_label ??
    record.statusLabel ??
    record.status_text ??
    record.statusText ??
    record.ad_status ??
    record.adStatus ??
    record.advertise_status ??
    record.advertiseStatus ??
    record.state ??
    record.status;

  return directCandidate;
}

export function getMyAdStatusInfo(source?: unknown): MyAdStatusInfo {
  const rawStatus = readCandidateStatus(source);
  const status = normalizeStatusText(rawStatus);

  if (["-2", "5", "delete", "deleted", "removed"].includes(status)) {
    return myAdStatusConfig.deleted;
  }

  if (status.includes("حذف") || status.includes("پاک")) {
    return myAdStatusConfig.deleted;
  }

  if (["-3", "4", "deactive", "disabled", "expire", "expired", "inactive"].includes(status)) {
    return myAdStatusConfig.expired;
  }

  if (status.includes("انقضا") || status.includes("منقض") || status.includes("غیر فعال") || status.includes("غیرفعال")) {
    return myAdStatusConfig.expired;
  }

  if (["-4", "-1", "edit", "need-edit", "needs-edit", "rejected", "stopped"].includes(status)) {
    return myAdStatusConfig.needs_edit;
  }

  if (
    status.includes("اصلاح") ||
    status.includes("ویرایش") ||
    status.includes("رد") ||
    status.includes("توقف") ||
    status.includes("مجاز نیست")
  ) {
    return myAdStatusConfig.needs_edit;
  }

  if ([
    "0",
    "1",
    "2",
    "pending",
    "review",
    "waiting",
    "in-review",
    "wait-for-payment",
    "wait-for-admin",
    "wait-for-agency",
  ].includes(status)) {
    return myAdStatusConfig.pending;
  }

  if (status.includes("انتظار") || status.includes("بررسی") || status.includes("تایید انتشار")) {
    return myAdStatusConfig.pending;
  }

  if (["3", "accepted", "active", "approved", "publish", "published", "success", "paid"].includes(status)) {
    return myAdStatusConfig.published;
  }

  if (
    status.includes("منتشر") ||
    status.includes("فعال") ||
    status.includes("تایید شده") ||
    status.includes("پرداخت شده")
  ) {
    return myAdStatusConfig.published;
  }

  return myAdStatusConfig.unknown;
}
