import type { AdCardData } from "../../advertisements/components/AdCard";

export function resolveAgencyName(ad?: Record<string, unknown>, card?: AdCardData): string {
  return (
    (ad?.agency_name as string) ||
    (ad?.agencyName as string) ||
    (ad?.assigned_agency_name as string) ||
    (ad?.assignedAgencyName as string) ||
    (typeof ad?.agency === "object" && ad?.agency && "name" in ad.agency
      ? String((ad.agency as { name?: unknown }).name ?? "")
      : "") ||
    (typeof ad?.agency === "string" ? ad.agency : "") ||
    (card?.agency ? card.agency : "") ||
    "آژانس املاک"
  );
}

export function resolveCategoryBreadcrumb(ad?: Record<string, unknown>): string {
  return (
    (ad?.category as string) ||
    (ad?.category_title as string) ||
    (ad?.categoryTitle as string) ||
    (ad?.category_name as string) ||
    (ad?.categoryName as string) ||
    (typeof ad?.category_object === "object" &&
    ad?.category_object &&
    "title" in ad.category_object
      ? String((ad.category_object as { title?: unknown }).title ?? "")
      : "") ||
    "—"
  );
}
