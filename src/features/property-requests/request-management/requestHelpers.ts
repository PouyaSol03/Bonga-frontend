import {
  getPropertyRequestDetails,
  toPersianDigits,
  type PropertySearchRequest,
} from "../api/property-request.service";
import type { RequestManagementTab, RequestTabItem } from "./types";

export function getRequestCreatedAt(request: PropertySearchRequest): Date | null {
  const createdAt = new Date(request.createdAt);
  return Number.isNaN(createdAt.getTime()) ? null : createdAt;
}

export function isReceivedRequestNew(request: PropertySearchRequest): boolean {
  if (request.isNew) return true;

  const createdAt = getRequestCreatedAt(request);
  if (!createdAt) return false;

  const age = Date.now() - createdAt.getTime();
  return age >= 0 && age < 24 * 60 * 60 * 1000;
}

export function formatReceivedRequestDate(request: PropertySearchRequest): string {
  const createdAt = getRequestCreatedAt(request);
  if (!createdAt) return "";

  const age = Math.max(0, Date.now() - createdAt.getTime());
  const hours = Math.floor(age / (60 * 60 * 1000));
  const days = Math.floor(age / (24 * 60 * 60 * 1000));

  if (hours < 1) return "امروز";
  if (hours < 24) return `${toPersianDigits(hours)} ساعت پیش`;
  if (days < 7) return `${toPersianDigits(days)} روز پیش`;
  if (days < 14) return "هفته پیش";

  return new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
    .format(createdAt)
    .replace(/[\u200e\u200f]/g, "");
}

export function getReceivedRequestDetailPriority(detail: string): number {
  if (detail.includes("خوابه") || detail === "بدون اتاق") return 0;
  if (detail.startsWith("سال ساخت")) return 1;
  if (detail.startsWith("قیمت") || detail.startsWith("رهن") || detail.startsWith("اجاره")) {
    return 2;
  }
  if (detail.startsWith("متراژ")) return 3;
  if (detail.startsWith("محله")) return 4;
  return 5;
}

export function getReceivedRequestDetails(
  request: PropertySearchRequest,
  maxVisibleItems = 6,
): { hiddenCount: number; visibleDetails: string[] } {
  const details = getPropertyRequestDetails(request)
    .map((detail, index) => ({ detail, index }))
    .sort(
      (left, right) =>
        getReceivedRequestDetailPriority(left.detail) -
          getReceivedRequestDetailPriority(right.detail) || left.index - right.index,
    )
    .map(({ detail }) => detail);
  const safeMaxVisibleItems = Math.max(1, Math.floor(maxVisibleItems));

  if (details.length <= safeMaxVisibleItems) {
    return { hiddenCount: 0, visibleDetails: details };
  }

  const visibleDetailCount = Math.max(0, safeMaxVisibleItems - 1);

  return {
    hiddenCount: details.length - visibleDetailCount,
    visibleDetails: details.slice(0, visibleDetailCount),
  };
}

export function getTabs(showReceivedTab: boolean): RequestTabItem[] {
  return showReceivedTab
    ? [
        { id: "results", label: "نتایج" },
        { id: "requests", label: "درخواست‌ها" },
        { id: "received", label: "دریافتی‌ها" },
      ]
    : [
        { id: "results", label: "نتایج" },
        { id: "requests", label: "درخواست‌ها" },
      ];
}

export function getInitialRequestTab(showReceivedTab: boolean): RequestManagementTab {
  const requestedTab = new URLSearchParams(window.location.search).get("tab");

  if (requestedTab === "results" || requestedTab === "requests") {
    return requestedTab;
  }
  if (requestedTab === "received" && showReceivedTab) return "received";

  return showReceivedTab ? "results" : "requests";
}
