import type { ChatMessage } from "../../chat/api/chat.service";
import type { PanelSupportRequestStatus } from "../../support/api/panel-support.service";
import type { SupportRequestItem } from "../../support/api/support-request.service";
import { readChatPathText } from "../../account/accountSupportViews";
import type { CrmSupportRequest } from "./types";

export function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

export function normalizeStatus(value: unknown): PanelSupportRequestStatus {
  const status = String(value ?? "").toLowerCase();
  if (status === "closed") return "closed";
  if (status === "reviewing" || status === "in_progress" || status === "in-progress") {
    return "reviewing";
  }
  return "open";
}

export function formatDate(value: unknown) {
  if (typeof value !== "string" || !value.trim()) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    month: "long",
    timeZone: "Asia/Tehran",
    year: "numeric",
  }).format(date);
}

export function readAttachmentName(item: SupportRequestItem) {
  const record = asRecord(item);
  const direct = readChatPathText(record, [
    "attachment_name",
    "attachment.file_name",
    "attachment.name",
    "file_name",
  ]);
  if (direct) return direct;

  const attachments = record.attachments;
  if (!Array.isArray(attachments) || attachments.length === 0) return undefined;
  return readChatPathText(attachments[0], ["file_name", "name", "title"]) || undefined;
}

export function firstNonEmptyRecord(...values: unknown[]) {
  for (const value of values) {
    const record = asRecord(value);
    if (Object.keys(record).length > 0) return record;
  }
  return {};
}

export function mapRequest(item: SupportRequestItem): CrmSupportRequest {
  const itemRecord = asRecord(item);
  const user = firstNonEmptyRecord(item.user, itemRecord.requester, itemRecord.customer);
  const assignedSupport = firstNonEmptyRecord(
    item.assigned_support,
    itemRecord.assignedSupport,
    itemRecord.assignee,
  );
  const firstName = readChatPathText(user, ["name", "first_name", "firstName"]);
  const family = readChatPathText(user, ["family", "last_name", "lastName"]);
  const id = readChatPathText(item, ["id", "_id", "request_id", "requestId"]);
  const threadId = readChatPathText(item, [
    "thread_id",
    "threadId",
    "chat_thread_id",
    "chatThreadId",
    "thread.id",
    "thread._id",
    "chat.id",
    "chat._id",
  ]);

  return {
    assignedSupportId:
      readChatPathText(item, ["assigned_support_id", "assignedSupportId", "support_user_id"]) ||
      readChatPathText(assignedSupport, ["id", "_id", "user_id", "userId"]),
    attachmentName: readAttachmentName(item),
    category:
      readChatPathText(item, [
        "category_label",
        "categoryLabel",
        "category.name",
        "category.title",
        "category",
      ]) || "پشتیبانی",
    createdAt: formatDate(readChatPathText(item, ["created_at", "createdAt"])),
    customerMobile:
      readChatPathText(user, ["mobile", "phone", "phone_number", "phoneNumber"]) ||
      "شماره تماس ثبت نشده",
    customerName:
      readChatPathText(user, ["full_name", "fullName"]) ||
      `${firstName} ${family}`.trim() ||
      "کاربر ناشناس",
    description:
      readChatPathText(item, ["description", "body", "message"]) ||
      "توضیحی برای این درخواست ثبت نشده است.",
    id: id || threadId,
    priority: readChatPathText(item, ["priority"]) || "normal",
    requestNumber: `#${id || "-"}`,
    status: normalizeStatus(asRecord(item).status),
    threadId,
    title: readChatPathText(item, ["subject", "title"]) || "درخواست پشتیبانی",
  };
}

export function normalizeSearch(value: string) {
  return value.trim().toLocaleLowerCase("fa-IR");
}

export function formatCount(value: number) {
  return new Intl.NumberFormat("fa-IR").format(value);
}

export function priorityLabel(priority: string) {
  if (priority === "urgent" || priority === "فوری") return "فوری";
  if (priority === "important" || priority === "مهم") return "مهم";
  return "عادی";
}

export function messageTimestamp(message: ChatMessage) {
  const value = readChatPathText(message, ["created_at", "createdAt", "sent_at", "sentAt"]);
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? timestamp : 0;
}
