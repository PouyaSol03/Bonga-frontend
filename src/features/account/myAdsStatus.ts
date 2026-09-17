export type MyAdStatusKey =
  | "archived"
  | "deleted"
  | "expired"
  | "incomplete"
  | "incomplete_deleted"
  | "needs_edit"
  | "pending"
  | "published"
  | "rejected_by_agency"
  | "unknown"
  | "wait_for_agency"
  | "wait_for_deal_confirmation"
  | "wait_for_payment"
  | "wait_for_repost"
  | "wait_for_stop";

export type MyAdStatusInfo = {
  badgeClassName: string;
  key: MyAdStatusKey;
  label: string;
};

export const myAdStatusConfig: Record<MyAdStatusKey, MyAdStatusInfo> = {
  unknown: {
    badgeClassName: "bg-surface-container text-outline",
    key: "unknown",
    label: "وضعیت نامشخص",
  },
  published: {
    badgeClassName: "bg-tertiary-container/40 text-tertiary",
    key: "published",
    label: "منتشر شده",
  },
  deleted: {
    badgeClassName: "bg-error-container/40 text-error",
    key: "deleted",
    label: "حذف شده",
  },
  expired: {
    badgeClassName: "bg-error-container/40 text-error",
    key: "expired",
    label: "منقضی شده",
  },
  incomplete: {
    badgeClassName: "bg-warning-container/40 text-warning",
    key: "incomplete",
    label: "نیمه کاره",
  },
  incomplete_deleted: {
    badgeClassName: "bg-error-container/40 text-error",
    key: "incomplete_deleted",
    label: "نیمه کاره حذف شده",
  },
  wait_for_payment: {
    badgeClassName: "bg-warning-container/40 text-warning",
    key: "wait_for_payment",
    label: "در انتظار پرداخت",
  },
  pending: {
    badgeClassName: "bg-warning-container/40 text-warning",
    key: "pending",
    label: "در انتظار تایید انتشار",
  },
  wait_for_agency: {
    badgeClassName: "bg-warning-container/40 text-warning",
    key: "wait_for_agency",
    label: "در انتظار تأیید آژانس",
  },
  wait_for_repost: {
    badgeClassName: "bg-warning-container/40 text-warning",
    key: "wait_for_repost",
    label: "در انتظار ثبت مجدد",
  },
  archived: {
    badgeClassName: "bg-surface-container text-outline",
    key: "archived",
    label: "بایگانی‌شده",
  },
  rejected_by_agency: {
    badgeClassName: "bg-error-container/40 text-error",
    key: "rejected_by_agency",
    label: "رد شده توسط آژانس",
  },
  wait_for_stop: {
    badgeClassName: "bg-warning-container/40 text-warning",
    key: "wait_for_stop",
    label: "در انتظار توقف انتشار",
  },
  wait_for_deal_confirmation: {
    badgeClassName: "bg-warning-container/40 text-warning",
    key: "wait_for_deal_confirmation",
    label: "در انتظار تأیید نتیجه معامله",
  },
  needs_edit: {
    badgeClassName: "bg-warning-container/40 text-warning",
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
  const record = source && typeof source === "object" ? (source as Record<string, unknown>) : undefined;
  const deleteReason = (record?.delete_reason ?? record?.deleteReason) as Record<string, unknown> | undefined;
  const assignmentStatus = String(record?.assignment_status ?? record?.assignmentStatus ?? "").toLowerCase();

  if (
    deleteReason?.status === "pending_user_confirmation" ||
    status === "wait-for-deal-confirmation" ||
    status === "wait_for_deal_confirmation" ||
    status.includes("تایید نتیجه") ||
    status.includes("تأیید نتیجه")
  ) {
    return myAdStatusConfig.wait_for_deal_confirmation;
  }

  if (
    (record?.stop_request as { status?: string } | undefined)?.status === "pending" ||
    Boolean(record?.pending_stop_request) ||
    Boolean(record?.has_pending_stop_request) ||
    status === "wait-for-stop" ||
    status === "wait_for_stop" ||
    status === "stop_requested" ||
    status.includes("توقف انتشار")
  ) {
    return myAdStatusConfig.wait_for_stop;
  }

  if (
    assignmentStatus === "rejected" ||
    deleteReason?.source === "agency_rejected" ||
    status === "rejected-by-agency" ||
    status === "rejected_by_agency" ||
    status.includes("رد شده توسط آژانس") ||
    status.includes("رد آژانس")
  ) {
    return myAdStatusConfig.rejected_by_agency;
  }

  if (
    assignmentStatus === "cancelled" ||
    deleteReason?.source === "assignment_cancelled" ||
    status === "wait-for-repost" ||
    status === "wait_for_repost" ||
    status.includes("ثبت مجدد")
  ) {
    const repostDeadline = deleteReason?.repost_deadline ? Date.parse(String(deleteReason.repost_deadline)) : NaN;
    const archiveDeadline = deleteReason?.archive_deadline ? Date.parse(String(deleteReason.archive_deadline)) : NaN;
    if (!Number.isNaN(repostDeadline)) {
      if (Date.now() <= repostDeadline) {
        return myAdStatusConfig.wait_for_repost;
      } else if (!Number.isNaN(archiveDeadline) && Date.now() <= archiveDeadline) {
        return myAdStatusConfig.archived;
      } else {
        return myAdStatusConfig.deleted;
      }
    }
    return myAdStatusConfig.wait_for_repost;
  }

  if (status === "archived" || status.includes("بایگانی")) {
    return myAdStatusConfig.archived;
  }

  if (
    ["-6", "incomplete-deleted", "incomplete_deleted"].includes(status) ||
    (status.includes("نیمه کاره") && (status.includes("حذف") || status.includes("پاک")))
  ) {
    return myAdStatusConfig.incomplete_deleted;
  }

  if (
    ["-5", "incomplete", "draft"].includes(status) ||
    (status.includes("نیمه کاره") && !status.includes("حذف") && !status.includes("پاک"))
  ) {
    return myAdStatusConfig.incomplete;
  }

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

function isAssignedAd(source: unknown): boolean {
  if (!source || typeof source !== "object") return false;
  const record = source as Record<string, unknown>;
  return Boolean(
    record.assignment_id ||
    record.assignmentId ||
    record.assigned_agency_id ||
    record.assignedAgencyId ||
    record.assignment ||
    record.is_assigned ||
    record.isAssigned,
  );
}

  if (
    ["0", "wait-for-payment", "wait_for_payment", "payment"].includes(status) ||
    (status.includes("پرداخت") && !status.includes("پرداخت شده")) ||
    status.includes("انتظار پرداخت")
  ) {
    if (isAssignedAd(source)) {
      return myAdStatusConfig.wait_for_payment;
    }
    return myAdStatusConfig.incomplete;
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
