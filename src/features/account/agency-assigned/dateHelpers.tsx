import type { ReactNode } from "react";
import { toPersianNumber as toPersianDigits } from "../../../shared/lib/numberUtils";

export function formatHistoryDate(dateStr?: string): string {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const now = new Date();
    const isSameDay =
      d.getDate() === now.getDate() &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear();

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday =
      d.getDate() === yesterday.getDate() &&
      d.getMonth() === yesterday.getMonth() &&
      d.getFullYear() === yesterday.getFullYear();

    const timeFormatted = new Intl.DateTimeFormat("fa-IR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(d);

    if (isSameDay) {
      return `امروز ${timeFormatted}`;
    }
    if (isYesterday) {
      return `دیروز ${timeFormatted}`;
    }

    const dateFormatted = new Intl.DateTimeFormat("fa-IR", {
      month: "short",
      day: "numeric",
    }).format(d);
    return `${dateFormatted}، ${timeFormatted}`;
  } catch {
    return dateStr;
  }
}

export function formatExpireDuration(
  expire?: { hours?: number; minutes?: number; total_minutes?: number },
  expiresAt?: string | null,
  fallbackReason?: string,
): string {
  if (expire && (expire.hours !== undefined || expire.minutes !== undefined)) {
    const parts: string[] = [];
    if (expire.hours && expire.hours > 0) {
      parts.push(`${toPersianDigits(expire.hours)} ساعت`);
    }
    if (expire.minutes !== undefined && expire.minutes > 0) {
      parts.push(`${toPersianDigits(expire.minutes)} دقیقه`);
    }
    if (parts.length > 0) {
      return `تا ${parts.join(" و ")} دیگر مهلت دارید.`;
    }
  }

  if (expiresAt) {
    try {
      const d = new Date(expiresAt);
      if (!isNaN(d.getTime())) {
        const diffMs = d.getTime() - Date.now();
        if (diffMs > 0) {
          const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          if (days > 0) {
            return `تا ${toPersianDigits(days)} روز و ${toPersianDigits(hours)} ساعت دیگر فرصت دارید.`;
          }
          if (hours > 0) {
            return `تا ${toPersianDigits(hours)} ساعت دیگر فرصت دارید.`;
          }
        }
      }
    } catch {
      // ignore
    }
  }

  return fallbackReason || "امکان انجام عملیات تا پایان مهلت فراهم است.";
}

export function formatPersianDateNumber(d: Date): string {
  try {
    return new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(d);
  } catch {
    return "";
  }
}

export function renderDateWithRelative(text: string): ReactNode {
  if (!text) return null;

  const match1 = text.match(/^(.*?)\s*(\([0-9/\u06F0-\u06F9\-.]+\))$/);
  if (match1) {
    const relative = match1[1].trim();
    const date = match1[2].trim();
    return (
      <span className="inline-flex items-center gap-1.5 [direction:rtl]">
        <span className="text-outline text-sm font-medium">{relative}</span>
        <span className="text-on-surface text-sm font-medium">{date}</span>
      </span>
    );
  }

  const match2 = text.match(/^(.*?)\s*\((.*?(?:پیش|دیگر|مانده|قبل).*?)\)$/);
  if (match2) {
    const date = match2[1].trim();
    const relative = `(${match2[2].trim()})`;
    return (
      <span className="inline-flex items-center gap-1.5 [direction:rtl]">
        <span className="text-on-surface text-sm font-medium">{date}</span>
        <span className="text-outline text-sm font-medium">{relative}</span>
      </span>
    );
  }

  if (
    text.includes("پیش") ||
    text.includes("دیگر") ||
    text.includes("قبل") ||
    text.includes("مانده")
  ) {
    return <span className="text-outline text-sm font-medium">{text}</span>;
  }

  return <span className="text-on-surface text-sm font-medium">{text}</span>;
}
