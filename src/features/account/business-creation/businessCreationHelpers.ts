import { getNeighborhoodId } from "../../locations/api/neighborhood.service";
import type { BusinessType } from "./types";
import { toEnglishDigits } from "../../../shared/lib/numberUtils";

export { getNeighborhoodId };

export function normalizePhoneDigits(value: string) {
  return toEnglishDigits(value).replace(/\s+/g, "").trim();
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
