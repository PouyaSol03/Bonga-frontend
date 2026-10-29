import { getActiveV2Role } from "../../../../shared/api/api";
import type { NewAdFormValues } from "../types";
import { toNumber } from "./formatters";

export type NewAdFeatureValue = string | number | boolean | string[] | Record<string, unknown>[];

export type NewAdFeature = {
  key: string;
  value: NewAdFeatureValue;
};

export function hasFeatureValue(value: unknown): boolean {
  if (value === undefined || value === null) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
}

export function addFeature(features: NewAdFeature[], key: string, value: unknown): void {
  if (!hasFeatureValue(value)) return;

  const normalizedValue = typeof value === "string" ? value.trim() : value;
  if (typeof normalizedValue === "string" && !normalizedValue) return;

  features.push({
    key,
    value: normalizedValue as NewAdFeatureValue,
  });
}

export function buildProjectDetailFeatures(values: NewAdFormValues) {
  return values.projectDetails
    .map((item) => ({
      meterage: toNumber(item.meterage || item.minMeterage || ""),
      floors: item.floors,
      rooms: item.rooms,
      positions: item.positions,
    }))
    .filter((item) => Object.values(item).some((value) => hasFeatureValue(value)));
}

export function buildDailyHotelRoomFeatures(values: NewAdFormValues) {
  return values.dailyHotelRooms
    .map((room) => ({
      room_type: room.id,
      room_label: room.label,
      guest_count: toNumber(room.guestCount),
      extra_guest_count: toNumber(room.extraGuestCount),
      meal_plan: room.mealPlan || null,
      normal_price: toNumber(room.normalPrice),
      weekend_price: toNumber(room.weekendPrice),
      special_price: toNumber(room.specialPrice),
    }))
    .filter((room) => Object.values(room).some((value) => hasFeatureValue(value)));
}

export function getPriceValue(values: NewAdFormValues, transaction: string, category: string): number | null {
  if (transaction === "rent" && category.startsWith("daily-")) return toNumber(values.minPrice);
  if (transaction === "rent") return toNumber(values.rentPrice);
  if (transaction === "project") return toNumber(values.minPrice);

  return toNumber(values.price);
}

export function getAdvertiseFormCode(transaction: string, category: string): string {
  const formCodes: Record<string, string> = {
    "project:project-partnership": "partnership",
    "project:project-presale": "presale-special",
    "rent:commercial-unit": "rent-commercial",
    "rent:daily-apartment-suite": "daily-apartment-suite",
    "rent:daily-garden-villa": "daily-garden-villa",
    "rent:daily-hotel-apartment": "daily-hotel",
    "rent:daily-workspace": "daily-office-booth",
    "rent:factory-workshop": "rent-factory-workshop",
    "rent:hotel-apartment": "rent-hotel",
    "rent:warehouse": "rent-warehouse",
    "sale:commercial-unit": "sale-commercial",
    "sale:factory-workshop": "sale-factory",
    "sale:garden-villa": "sale-garden-villa",
    "sale:hotel-apartment": "sale-hotel",
    "sale:office": "sale-office",
    "sale:warehouse": "sale-warehouse",
  };

  return (
    formCodes[`${transaction}:${category}`] ?? [transaction, category].filter(Boolean).join("-")
  );
}

export function getStoredNewAdLocationNumber(key: string): number | null {
  const value = window.localStorage.getItem(key);
  const number = value ? Number(value) : Number.NaN;
  return Number.isFinite(number) ? number : null;
}

export function shouldOmitOwnerContactsOnAssignment(values: {
  registrantType?: string;
  agencyId?: string;
}): boolean {
  const isPersonalActiveAccount = getActiveV2Role() === "personal";
  const isAssigningToAgency =
    values.registrantType === "agency" || Boolean(values.agencyId?.trim());
  return isPersonalActiveAccount && isAssigningToAgency;
}

export const shouldOmitOwnerNameOnAssignment = shouldOmitOwnerContactsOnAssignment;

export function shouldSendConsultantAssignment(values: NewAdFormValues): boolean {
  const context = new URLSearchParams(window.location.search).get("context") ?? getActiveV2Role();
  return context !== "agency-consultant" || values.consultantAssignmentSelected === true;
}
