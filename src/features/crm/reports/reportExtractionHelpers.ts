import type { CrmRecord, CrmReportKind } from "../api/crm.service";

export function text(record: CrmRecord, keys: string[], fallback = "") {
  for (const key of keys) {
    const value = record[key];

    if (typeof value === "string" || typeof value === "number") {
      const normalized = String(value).trim();
      if (normalized) return normalized;
    }
  }

  return fallback;
}

export function nestedRecord(record: CrmRecord, keys: string[]) {
  for (const key of keys) {
    const value = record[key];

    if (value && typeof value === "object" && !Array.isArray(value)) {
      return value as CrmRecord;
    }
  }

  return {};
}

export function firstNestedRecord(record: CrmRecord, groups: string[][]) {
  for (const keys of groups) {
    const value = nestedRecord(record, keys);
    if (Object.keys(value).length > 0) return value;
  }

  return {};
}

export function fullName(record: CrmRecord, fallback = "-") {
  const direct = text(record, ["full_name", "fullname", "display_name"]);
  if (direct) return direct;

  const name = [text(record, ["name", "first_name"]), text(record, ["family", "last_name"])]
    .filter(Boolean)
    .join(" ")
    .trim();

  return name || fallback;
}

export function reportReason(report: CrmRecord) {
  const reason = firstNestedRecord(report, [
    ["report_reason", "reportReason"],
    ["reason_detail", "reasonDetail"],
    ["reason"],
  ]);

  return text(
    reason,
    ["name", "title", "label"],
    text(report, ["reason", "reason_name", "report_reason_name"], "بدون عنوان"),
  );
}

export function reportDescription(report: CrmRecord) {
  return text(
    report,
    ["description", "message", "details", "note", "comment"],
    "توضیحی ثبت نشده است.",
  );
}

export function reportReporter(report: CrmRecord) {
  return firstNestedRecord(report, [
    ["reporter", "reported_by", "reportedBy"],
    ["creator", "created_by", "createdBy"],
    ["user", "sender"],
  ]);
}

export function reportTarget(report: CrmRecord, kind: CrmReportKind) {
  if (kind === "advertise") {
    return firstNestedRecord(report, [
      ["advertise", "advertisement", "ad"],
      ["target", "reported_advertise", "reportedAdvertise"],
    ]);
  }

  return firstNestedRecord(report, [
    ["reported_user", "reportedUser", "target_user", "targetUser"],
    ["participant", "receiver", "target"],
    ["user"],
  ]);
}

export function reportThread(report: CrmRecord) {
  return firstNestedRecord(report, [["thread", "chat", "conversation"]]);
}
