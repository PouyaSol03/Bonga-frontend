import type { NeighborhoodDto } from "../../locations/api/neighborhood.service";
import type { BusinessType } from "./types";

export function getNeighborhoodId(neighborhood: NeighborhoodDto) {
  return String(neighborhood.id ?? neighborhood._id ?? neighborhood.name);
}

export function normalizePhoneDigits(value: string) {
  return value
    .replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)))
    .replace(/\s+/g, "")
    .trim();
}

export function getBusinessTypePath(type: BusinessType) {
  return type === "agency"
    ? "/account/business/create/agency"
    : "/account/business/create/consultant";
}

export function getBusinessInfoPath(type: BusinessType) {
  return `/account/business/create/info?type=${type}`;
}

export function getBusinessTypeFromSearch(): BusinessType {
  const type = new URLSearchParams(window.location.search).get("type");

  return type === "independent-consultant" ? "independent-consultant" : "agency";
}
