import type { MyAgencyProfile } from "../../account/api/account.service";
import { toPersianDigits as toPersianNumber } from "../../../shared/lib/numberUtils";
import { type AgencyPreviewContactInfo } from "./types";
import { getPreviewSearchParam } from "./urlHelpers";

export function getProfileNeighborhoodIds(profile?: MyAgencyProfile | null) {
  if (!profile) return [];
  return Array.from(
    new Set(
      (profile.neighborhood_ids ?? [])
        .flatMap((value) => String(value).split(","))
        .map((value) => value.trim())
        .filter(Boolean),
    ),
  );
}

export function toPersianDigits(value: number | string | null | undefined) {
  if (value === null || value === undefined || value === "") return "—";
  return toPersianNumber(value) || "—";
}

export function toOptionalCoordinate(value: number | string | null | undefined) {
  if (typeof value === "number") return Number.isFinite(value) ? value : undefined;
  if (typeof value !== "string" || !value.trim()) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function getAgencyConsultantRoleLabel(role: string) {
  switch (role.trim().toLowerCase()) {
    case "owner":
      return "مدیر آژانس";
    case "manager":
      return "مدیر";
    case "consultant":
    case "member":
      return "مشاور املاک";
    default:
      return role.trim() || "مشاور املاک";
  }
}

export function readAgencyProfileSocialValue(
  profile: MyAgencyProfile | null | undefined,
  key: "instagram" | "telegram" | "whatsapp",
) {
  if (!profile) return "";
  const record = profile as unknown as Record<string, unknown>;
  const directValue = record[key];
  if (typeof directValue === "string" && directValue.trim()) return directValue.trim();

  for (const sourceKey of ["social", "contact_social", "contacts"]) {
    const source = record[sourceKey];
    if (!source || typeof source !== "object" || Array.isArray(source)) continue;
    const value = (source as Record<string, unknown>)[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
}

export function resolvePreviewContactInfo(
  profile: MyAgencyProfile | null | undefined,
  isPublicPreview: boolean,
): AgencyPreviewContactInfo {
  if (!profile) {
    return {
      phone: isPublicPreview ? getPreviewSearchParam("phone1") : "",
      secondPhone: isPublicPreview ? getPreviewSearchParam("phone2") : "",
      landline: isPublicPreview ? getPreviewSearchParam("phone3") : "",
      whatsapp: "",
      telegram: "",
      instagram: "",
      lat: undefined,
      lng: undefined,
    };
  }

  return {
    phone: profile.phone1?.trim() ?? "",
    secondPhone: profile.phone2?.trim() ?? "",
    landline: profile.phone3?.trim() ?? "",
    whatsapp: readAgencyProfileSocialValue(profile, "whatsapp"),
    telegram: readAgencyProfileSocialValue(profile, "telegram"),
    instagram: readAgencyProfileSocialValue(profile, "instagram"),
    lat: toOptionalCoordinate(profile.lat),
    lng: toOptionalCoordinate(profile.lng),
  };
}
