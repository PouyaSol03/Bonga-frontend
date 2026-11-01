import { useEffect, useMemo } from "react";
import { getApiErrorMessage } from "../../../shared/api/api";
import { getActiveAuthRole, getStoredAuthSession } from "../../../shared/auth/auth-storage";
import { REAL_ESTATE_MANAGER } from "../../../shared/constants/roles.constants";
import {
  useMyAgencyProfileQuery,
  useUpdateMyAgencyProfileMutation,
} from "../../account/api/account.hooks";
import { useNeighborhoodListQuery } from "../../locations/api/neighborhood.hooks";
import { readStoredSelectedCity } from "../../../shared/lib/selectedCityStorage";
import { resolveProfileNeighborhoodIds } from "./agencyProfileHelpers";
import { executeSaveAgencyProfile } from "./agencyProfileSaveAction";
import { useAgencyLogoUpload } from "./useAgencyLogoUpload";
import { useAgencyProfileFields } from "./useAgencyProfileFields";
import { useAgencyProfileLocationSync } from "./useAgencyProfileLocationSync";
import { useAgencyProfileNotifications } from "./useAgencyProfileNotifications";

export function useAgencyProfileForm() {
  const { setToast, showToast, toast } = useAgencyProfileNotifications();
  const {
    handleLogoChange,
    logoFile,
    logoPreviewUrl,
    logoUrl,
    setLogoFile,
    setLogoPreviewUrl,
    setLogoUrl,
  } = useAgencyLogoUpload(showToast);

  const selectedCity = readStoredSelectedCity();
  const cityId = selectedCity?.id ?? "";
  const isRealEstateManager = getActiveAuthRole(getStoredAuthSession()) === REAL_ESTATE_MANAGER;
  const agencyProfileQuery = useMyAgencyProfileQuery({ enabled: isRealEstateManager });
  const updateAgencyProfileMutation = useUpdateMyAgencyProfileMutation();
  const neighborhoodListQuery = useNeighborhoodListQuery({
    cityId,
    enabled: Boolean(cityId),
    page: 1,
    perPage: 200,
    q: "",
  });
  const neighborhoods = useMemo(
    () => neighborhoodListQuery.data ?? [],
    [neighborhoodListQuery.data],
  );

  const fields = useAgencyProfileFields({
    neighborhoods,
    profile: agencyProfileQuery.data,
    setLogoFile,
    setLogoPreviewUrl,
    setLogoUrl,
    setMapCenter: (center) => locationSync.setMapCenter(center),
  });

  const locationSync = useAgencyProfileLocationSync({
    cityId,
    neighborhoods,
    setSelectedNeighborhood: fields.setSelectedNeighborhood,
  });

  const selectedActivityAreaIds = useMemo(
    () => fields.selectedActivityAreas.map((area) => area.id).filter(Boolean),
    [fields.selectedActivityAreas],
  );
  const trimmedAgencyName = fields.agencyName.trim();
  const agencyNameError = fields.hasSubmitted && !trimmedAgencyName ? "نام آژانس الزامی است." : null;
  const activityAreasError =
    fields.hasSubmitted && selectedActivityAreaIds.length === 0
      ? "انتخاب محدوده فعالیت الزامی است."
      : null;

  useEffect(() => {
    if (!agencyProfileQuery.isError) return;
    setToast({
      message: getApiErrorMessage(
        agencyProfileQuery.error,
        "دریافت اطلاعات آژانس با خطا مواجه شد.",
      ),
      title: "خطا",
      variant: "error",
    });
  }, [agencyProfileQuery.error, agencyProfileQuery.isError, setToast]);

  const removeActivityArea = (id: string) => {
    fields.setSelectedActivityAreas((current) => current.filter((item) => item.id !== id));
  };

  const handleSave = async () => {
    fields.setHasSubmitted(true);
    updateAgencyProfileMutation.reset();

    await executeSaveAgencyProfile({
      aboutUs: fields.aboutUs,
      address: fields.address,
      agencyName: fields.agencyName,
      agencyType: agencyProfileQuery.data?.agency_type ?? 0,
      instagram: fields.instagram,
      isRealEstateManager,
      logoFile,
      mapCenter: locationSync.mapCenter,
      neighborhoods,
      phone1: fields.phone1,
      phone2: fields.phone2,
      phone3: fields.phone3,
      selectedActivityAreas: fields.selectedActivityAreas,
      selectedNeighborhood: fields.selectedNeighborhood,
      showToast,
      telegram: fields.telegram,
      updateMutation: updateAgencyProfileMutation,
      whatsapp: fields.whatsapp,
      workingHours: fields.workingHours,
    });
  };

  const isNeighborhoodResolving =
    Boolean(
      agencyProfileQuery.data?.neighborhood_id ||
      resolveProfileNeighborhoodIds(agencyProfileQuery.data ?? {}).length,
    ) && neighborhoodListQuery.isLoading;

  return {
    ...fields,
    ...locationSync,
    activityAreasError,
    agencyNameError,
    handleLogoChange,
    handleSave,
    isAgencyLoading: agencyProfileQuery.isLoading,
    isNeighborhoodResolving,
    isSaving: updateAgencyProfileMutation.isPending,
    logoPreviewUrl,
    logoUrl,
    removeActivityArea,
    setToast,
    toast,
  };
}
