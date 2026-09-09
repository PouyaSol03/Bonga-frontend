export type MyAdStatusKey = "deleted" | "expired" | "needs_edit" | "pending" | "published" | "unknown" | "wait_for_agency" | "wait_for_payment";

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
    badgeClassName: "bg-[#E6F6ED] text-[#11A366]",
    key: "published",
    label: "منتشر شده",
  },
  deleted: {
    badgeClassName: "bg-[#FFEBED] text-[#EE3623]",
    key: "deleted",
    label: "حذف شده",
  },
  expired: {
    badgeClassName: "bg-[#FFEBED] text-[#EE3623]",
    key: "expired",
    label: "منقضی شده",
  },
  wait_for_payment: {
    badgeClassName: "bg-[#FFF8E1] text-[#FF6D00]",
    key: "wait_for_payment",
    label: "در انتظار پرداخت",
  },
  pending: {
    badgeClassName: "bg-[#FFF8E1] text-[#FF6D00]",
    key: "pending",
    label: "در انتظار تایید انتشار",
  },
  wait_for_agency: {
    badgeClassName: "bg-[#FFF8E1] text-[#FF6D00]",
    key: "wait_for_agency",
    label: "در انتظار آژانس",
  },
  needs_edit: {
    badgeClassName: "bg-[#FFF8E1] text-[#FF6D00]",
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
    record.status ??
    record.ad_status ??
    record.adStatus ??
    record.advertise_status ??
    record.advertiseStatus ??
    record.state ??
    record.status_code ??
    record.status_label ??
    record.statusLabel ??
    record.status_text ??
    record.statusText;

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

  if (
    ["0", "wait-for-payment", "wait_for_payment", "payment"].includes(status) ||
    (status.includes("پرداخت") && !status.includes("پرداخت شده")) ||
    status.includes("انتظار پرداخت")
  ) {
    return myAdStatusConfig.wait_for_payment;
  }

  if (["2", "wait-for-agency"].includes(status)) {
    return myAdStatusConfig.wait_for_agency;
  }

  if (status.includes("انتظار آژانس") || status.includes("تایید آژانس")) {
    return myAdStatusConfig.wait_for_agency;
  }

  if (["-4", "-1", "edit", "need-edit", "needs-edit", "rejected", "stopped"].includes(status)) {
    return myAdStatusConfig.needs_edit;
  }

  if (
    status.includes("اصلاح") ||
    status.includes("ویرایش") ||
    status.includes("رد شده") ||
    status.includes("ردشده") ||
    /(^|\s)رد(\s|$)/.test(status) ||
    status.includes("توقف") ||
    status.includes("مجاز نیست")
  ) {
    return myAdStatusConfig.needs_edit;
  }

  if ([
    "1",
    "pending",
    "review",
    "waiting",
    "in-review",
    "wait-for-admin",
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
