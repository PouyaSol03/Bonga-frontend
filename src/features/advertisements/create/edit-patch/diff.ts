import type { NewAdFormValues, UploadedMediaFile } from "../types";
import { canonicalizeMediaPath, mediaSource } from "../utils";

function isStringChanged(curr?: string, prev?: string): boolean {
  return (curr ?? "").trim() !== (prev ?? "").trim();
}

function isBooleanChanged(curr?: boolean, prev?: boolean): boolean {
  return Boolean(curr) !== Boolean(prev);
}

function isArrayChanged(curr?: string[], prev?: string[]): boolean {
  const c = (curr ?? []).map((x) => String(x).trim()).filter(Boolean);
  const p = (prev ?? []).map((x) => String(x).trim()).filter(Boolean);
  if (c.length !== p.length) return true;
  const setP = new Set(p);
  return c.some((item) => !setP.has(item));
}

export function arePhotosChanged(
  curr: UploadedMediaFile[] = [],
  prev: UploadedMediaFile[] = [],
): boolean {
  if (curr.some((photo) => photo.file)) return true;
  if (curr.length !== prev.length) return true;

  const currSources = curr
    .map((p) => canonicalizeMediaPath(mediaSource(p.existingValue || p.previewUrl) || ""))
    .filter(Boolean);
  const prevSources = prev
    .map((p) => canonicalizeMediaPath(mediaSource(p.existingValue || p.previewUrl) || ""))
    .filter(Boolean);

  if (currSources.length !== prevSources.length) return true;
  return currSources.some((src, index) => src !== prevSources[index]);
}

export function isVideoChanged(
  curr: UploadedMediaFile | null,
  prev: UploadedMediaFile | null,
): boolean {
  if (curr?.file) return true;
  const currSrc = curr
    ? canonicalizeMediaPath(mediaSource(curr.existingValue || curr.previewUrl) || "")
    : "";
  const prevSrc = prev
    ? canonicalizeMediaPath(mediaSource(prev.existingValue || prev.previewUrl) || "")
    : "";
  return currSrc !== prevSrc;
}

function areComplexObjectsChanged(curr: unknown, prev: unknown): boolean {
  try {
    return JSON.stringify(curr ?? null) !== JSON.stringify(prev ?? null);
  } catch {
    return true;
  }
}

export function getChangedFieldKeys(
  curr: NewAdFormValues,
  prev: NewAdFormValues,
): Set<keyof NewAdFormValues> {
  const changed = new Set<keyof NewAdFormValues>();

  const stringKeys: (keyof NewAdFormValues)[] = [
    "location", "meterage", "landArea", "buildingArea", "floor", "rooms", "age",
    "density", "landPosition", "documentType", "hotelStars", "accommodationType",
    "spaceType", "standardCapacity", "extraPeopleCapacity", "commercialLicense",
    "constructionLicense", "participationType", "builderCompanyName", "projectType",
    "projectTotalFloors", "projectTotalUnits", "projectStatus", "projectDeliveryDate",
    "saleTermsPercent", "saleTermsInstallmentMonths", "builderSharePercent",
    "totalFloors", "unitsPerFloor", "unitType", "unitPosition", "occupancyStatus",
    "kitchenType", "petPolicy", "readyDeliveryDate", "minContractMonths", "rentalPeriod",
    "viewType", "checkInTime", "checkOutTime", "minStayDays", "evacuationGuarantee",
    "facadeMaterial", "floorMaterial", "cabinetMaterial", "buildingType", "villaType",
    "commercialPosition", "ownershipStatus", "currentStatus", "industrialPropertyType",
    "accessType", "officePosition", "officeDocumentType", "landWidth", "streetWidth",
    "ceilingHeight", "openingCount", "elevatorCount", "parkingCount", "terraceCount",
    "singleRoomCount", "doubleRoomCount", "suiteCount", "price", "mortgagePrice",
    "rentPrice", "rentConversionMortgagePrice", "rentConversionPolicy", "minPrice",
    "maxPrice", "normalDailyPrice", "weekendDailyPrice", "specialDailyPrice",
    "extraPersonPrice", "loanAmount", "loanInstallment", "virtualTourLink",
    "publisherName", "agencyId", "consultantId", "phoneNumber", "ownerPhone",
    "ownerFullName", "ownerExactAddress", "telegram", "whatsapp", "title",
    "description", "neighborhoodId", "subNeighborhoodId", "targetOwnerId",
  ];

  for (const key of stringKeys) {
    if (isStringChanged(curr[key] as string | undefined, prev[key] as string | undefined)) {
      changed.add(key);
    }
  }

  const boolKeys: (keyof NewAdFormValues)[] = [
    "saleTermsEnabled", "renovated", "furnished", "hasDocument", "managementRoom",
    "conferenceRoom", "receptionHall", "signboard", "kitchen", "separateEntrance",
    "constructionPermit", "commercialPermit", "images_belong_to_ad",
    "rentConversionEnabled", "loanEnabled", "exchangeEnabled", "hasVideo",
    "hasVirtualTour", "chatEnabled", "phoneEnabled",
  ];

  for (const key of boolKeys) {
    if (isBooleanChanged(curr[key] as boolean | undefined, prev[key] as boolean | undefined)) {
      changed.add(key);
    }
  }

  const arrayKeys: (keyof NewAdFormValues)[] = [
    "usageType", "suitableFor", "selectedSpecs", "heatingCooling", "facilities", "exchangeTargets",
  ];

  for (const key of arrayKeys) {
    if (isArrayChanged(curr[key] as string[] | undefined, prev[key] as string[] | undefined)) {
      changed.add(key);
    }
  }

  if (curr.registrantType !== prev.registrantType) changed.add("registrantType");
  if (curr.targetOwnerType !== prev.targetOwnerType) changed.add("targetOwnerType");
  if (arePhotosChanged(curr.photos, prev.photos)) changed.add("photos");
  if (isVideoChanged(curr.video, prev.video)) changed.add("video");
  if (areComplexObjectsChanged(curr.projectDetails, prev.projectDetails)) changed.add("projectDetails");
  if (areComplexObjectsChanged(curr.dailyHotelRooms, prev.dailyHotelRooms)) changed.add("dailyHotelRooms");

  return changed;
}
