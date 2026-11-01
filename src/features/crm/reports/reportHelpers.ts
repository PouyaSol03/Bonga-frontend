import { getCrmRecordId, type CrmRecord, type CrmReportKind } from "../api/crm.service";
import {
  fullName,
  reportReporter,
  reportTarget,
  text,
} from "./reportExtractionHelpers";
import type { ReportStatusTone } from "./types";

export * from "./reportExtractionHelpers";

export function reporterName(report: CrmRecord) {
  const reporter = reportReporter(report);
  return fullName(
    reporter,
    text(report, ["reporter_name", "user_name", "sender_name"], "کاربر ناشناس"),
  );
}

export function reporterMobile(report: CrmRecord) {
  const reporter = reportReporter(report);
  return text(
    reporter,
    ["mobile", "phone", "phone_number"],
    text(report, ["reporter_mobile", "user_mobile"], "-"),
  );
}

export function targetTitle(report: CrmRecord, kind: CrmReportKind) {
  const target = reportTarget(report, kind);

  if (kind === "advertise") {
    return text(
      target,
      ["title", "name"],
      text(report, ["advertise_title", "ad_title"], "آگهی بدون عنوان"),
    );
  }

  return fullName(
    target,
    text(report, ["reported_user_name", "target_user_name"], "کاربر بدون نام"),
  );
}

export function targetSecondary(report: CrmRecord, kind: CrmReportKind) {
  const target = reportTarget(report, kind);

  if (kind === "advertise") {
    const trackCode = text(
      target,
      ["track_code", "tracking_code"],
      text(report, ["track_code", "advertise_track_code"]),
    );
    return trackCode ? `کد پیگیری: ${trackCode}` : "کد پیگیری ثبت نشده";
  }

  return text(
    target,
    ["mobile", "phone", "phone_number"],
    text(report, ["reported_user_mobile", "target_user_mobile"], "شماره تماس ثبت نشده"),
  );
}

export function targetId(report: CrmRecord, kind: CrmReportKind) {
  const target = reportTarget(report, kind);
  return (
    getCrmRecordId(target) ||
    text(
      report,
      kind === "advertise" ? ["advertise_id", "ad_id"] : ["reported_user_id", "target_user_id"],
    )
  );
}

export function reportCode(report: CrmRecord) {
  return text(report, ["code", "report_code", "tracking_code"], getCrmRecordId(report) || "-");
}

export function reportDate(report: CrmRecord) {
  const raw = text(report, ["created_at", "createdAt", "date", "reported_at", "reportedAt"]);
  if (!raw) return "زمان ثبت نشده";

  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return raw;

  return new Intl.DateTimeFormat("fa-IR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function reportStatus(report: CrmRecord): { label: string; tone: ReportStatusTone } {
  const raw = text(report, ["status", "state", "review_status"]).toLowerCase();

  if (["", "0", "new", "open", "pending", "جدید", "باز", "در انتظار"].includes(raw)) {
    return { label: "جدید", tone: "warning" };
  }

  if (["1", "review", "reviewing", "in_progress", "processing", "در حال بررسی"].includes(raw)) {
    return { label: "در حال بررسی", tone: "info" };
  }

  if (["2", "resolved", "closed", "done", "completed", "بررسی شده", "بسته شده"].includes(raw)) {
    return { label: "بررسی شده", tone: "success" };
  }

  if (["-1", "rejected", "dismissed", "رد شده"].includes(raw)) {
    return { label: "رد شده", tone: "danger" };
  }

  return { label: raw || "نامشخص", tone: "neutral" };
}

export function formatCount(value: number) {
  return new Intl.NumberFormat("fa-IR").format(value);
}

export function hasMeaningfulValue(value: string) {
  return Boolean(
    value && value !== "-" && value !== "زمان ثبت نشده" && value !== "توضیحی ثبت نشده است.",
  );
}
