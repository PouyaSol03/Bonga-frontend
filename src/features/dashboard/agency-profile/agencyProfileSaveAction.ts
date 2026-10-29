import { getApiErrorMessage } from "../../../shared/api/api";
import type { useUpdateMyAgencyProfileMutation } from "../../account/api/account.hooks";
import type { NeighborhoodDto } from "../../locations/api/neighborhood.service";
import {
  getNeighborhoodId,
  normalizeOptionalText,
} from "./agencyProfileHelpers";
import type { AgencyProfileMapCenter, AgencyProfileToast, SelectedNeighborhood } from "./types";

export type SaveAgencyProfileParams = {
  aboutUs: string;
  address: string;
  agencyName: string;
  agencyType: number;
  instagram: string;
  isRealEstateManager: boolean;
  logoFile: File | null;
  mapCenter: AgencyProfileMapCenter;
  neighborhoods: NeighborhoodDto[];
  phone1: string;
  phone2: string;
  phone3: string;
  selectedActivityAreas: SelectedNeighborhood[];
  selectedNeighborhood: SelectedNeighborhood | null;
  showToast: (message: string, title?: string, variant?: AgencyProfileToast["variant"]) => void;
  telegram: string;
  updateMutation: ReturnType<typeof useUpdateMyAgencyProfileMutation>;
  whatsapp: string;
  workingHours: string;
};

export async function executeSaveAgencyProfile(params: SaveAgencyProfileParams): Promise<boolean> {
  const {
    aboutUs,
    address,
    agencyName,
    agencyType,
    instagram,
    isRealEstateManager,
    logoFile,
    mapCenter,
    neighborhoods,
    phone1,
    phone2,
    phone3,
    selectedActivityAreas,
    selectedNeighborhood,
    showToast,
    telegram,
    updateMutation,
    whatsapp,
    workingHours,
  } = params;

  if (!isRealEstateManager) {
    showToast("ویرایش مشخصات آژانس فقط برای نقش مدیر آژانس فعال است.", "خطا", "error");
    return false;
  }

  const trimmedAgencyName = agencyName.trim();
  const selectedActivityAreaIds = selectedActivityAreas.map((area) => area.id).filter(Boolean);

  const validationError = !trimmedAgencyName
    ? "نام آژانس الزامی است."
    : selectedActivityAreaIds.length === 0
      ? "انتخاب محدوده فعالیت الزامی است."
      : null;

  if (validationError) {
    showToast(validationError, "خطا", "error");
    return false;
  }

  const validNeighborhoodIds = new Set(neighborhoods.map((n) => getNeighborhoodId(n)));
  if (selectedNeighborhood?.id && !validNeighborhoodIds.has(selectedNeighborhood.id)) {
    showToast("محله انتخاب‌شده معتبر نیست.", "خطا", "error");
    return false;
  }

  const invalidArea = selectedActivityAreas.find((area) => !validNeighborhoodIds.has(area.id));
  if (invalidArea) {
    showToast(`محدوده فعالیت "${invalidArea.name}" معتبر نیست.`, "خطا", "error");
    return false;
  }

  const neighborhoodIds = Array.from(
    new Set([
      ...(selectedNeighborhood?.id ? [selectedNeighborhood.id] : []),
      ...selectedActivityAreaIds,
    ]),
  );

  try {
    await updateMutation.mutateAsync({
      about_us: normalizeOptionalText(aboutUs),
      address: normalizeOptionalText(address),
      agency_type: agencyType,
      lat: mapCenter.lat,
      lng: mapCenter.lng,
      logo: logoFile,
      name: trimmedAgencyName,
      neighborhood_id: selectedNeighborhood?.id ?? null,
      neighborhood_ids: neighborhoodIds,
      phone1: normalizeOptionalText(phone1),
      phone2: normalizeOptionalText(phone2),
      phone3: normalizeOptionalText(phone3),
      telegram: normalizeOptionalText(telegram),
      whatsapp: normalizeOptionalText(whatsapp),
      instagram: normalizeOptionalText(instagram),
      working_hours: normalizeOptionalText(workingHours),
    });
    showToast("اطلاعات آژانس ذخیره شد.");
    return true;
  } catch (error) {
    showToast(getApiErrorMessage(error, "ذخیره اطلاعات آژانس با خطا مواجه شد."), "خطا", "error");
    return false;
  }
}
