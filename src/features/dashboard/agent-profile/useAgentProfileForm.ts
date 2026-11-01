import { useEffect, useMemo, useRef, useState } from "react";
import { getApiAssetUrl, getApiErrorMessage } from "../../../shared/api/api";
import { useToast } from "../../../shared/hooks/useToast";
import { readStoredSelectedCity } from "../../../shared/lib/selectedCityStorage";
import {
  useConsultantProfileQuery,
  useUpdateConsultantProfileMutation,
  useUpdateMyProfileMutation,
} from "../../account/api/account.hooks";
import type { UpdateConsultantProfilePayload } from "../../account/api/account.service";
import { useNeighborhoodListQuery } from "../../locations/api/neighborhood.hooks";
import {
  getNeighborhoodId,
  normalizeOptionalText,
  splitProfileName,
} from "./agentProfileHelpers";
import type { SelectedNeighborhood } from "./types";
import { useAgentActivityAreaSync } from "./useAgentActivityAreaSync";
import { useAgentAvatarUpload } from "./useAgentAvatarUpload";

export function useAgentProfileForm() {
  const selectedCity = readStoredSelectedCity();
  const profileQuery = useConsultantProfileQuery();
  const updateProfileMutation = useUpdateConsultantProfileMutation();
  const updateMyProfileMutation = useUpdateMyProfileMutation();
  const cityId = selectedCity?.id ?? "";
  const neighborhoodsQuery = useNeighborhoodListQuery({
    cityId,
    enabled: Boolean(cityId),
    page: 1,
    perPage: 200,
    q: "",
  });
  const neighborhoods = useMemo(() => neighborhoodsQuery.data ?? [], [neighborhoodsQuery.data]);
  const neighborhoodNameById = useMemo(
    () => new Map(neighborhoods.map((item) => [getNeighborhoodId(item), item.name])),
    [neighborhoods],
  );
  const initializedProfileIdRef = useRef<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [telegram, setTelegram] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [instagram, setInstagram] = useState("");
  const [selectedActivityAreas, setSelectedActivityAreas] = useState<SelectedNeighborhood[]>([]);
  const [isNeighborhoodPickerOpen, setIsNeighborhoodPickerOpen] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const { showToast } = useToast();

  const {
    avatarFile,
    avatarPreviewUrl,
    avatarUrl,
    handleAvatarChange,
    setAvatarFile,
    setAvatarPreviewUrl,
    setAvatarUrl,
  } = useAgentAvatarUpload();

  useAgentActivityAreaSync({
    neighborhoodNameById,
    neighborhoodsCount: neighborhoods.length,
    selectedActivityAreas,
    setSelectedActivityAreas,
  });

  const trimmedName = name.trim();
  const nameError = hasSubmitted && !trimmedName ? "نام مشاور الزامی است." : null;
  const activityAreasError =
    hasSubmitted && selectedActivityAreas.length === 0 ? "انتخاب محدوده فعالیت الزامی است." : null;

  useEffect(() => {
    if (!profileQuery.isError) return;
    showToast(
      getApiErrorMessage(profileQuery.error, "دریافت اطلاعات مشاور با خطا مواجه شد."),
      "خطا",
      "error",
    );
  }, [profileQuery.error, profileQuery.isError, showToast]);

  useEffect(() => {
    const profile = profileQuery.data;
    if (!profile?.data) return;

    const user = profile.data.user;
    const consultant = profile.data.consultant;

    const profileId = String(
      consultant?.id ?? user?.id ?? user?.mobile ?? consultant?.phone ?? "current-consultant",
    );
    if (initializedProfileIdRef.current === profileId) return;
    initializedProfileIdRef.current = profileId;

    const fullName = [user?.name, user?.family].filter(Boolean).join(" ").trim();
    setName(fullName || (typeof user?.name === "string" ? user.name : ""));
    setEmail(typeof user?.email === "string" ? user.email : "");
    setPhone(consultant?.phone ?? user?.mobile ?? "");
    setTelegram(consultant?.telegram ?? "");
    setWhatsapp(consultant?.whatsapp ?? "");
    setInstagram(consultant?.instagram ?? "");
    setAvatarFile(null);
    setAvatarPreviewUrl(null);
    setAvatarUrl(user?.avatar ? getApiAssetUrl(user.avatar) : null);

    const rawNeighborhoodIds = Array.isArray(consultant?.neighborhood_ids)
      ? consultant.neighborhood_ids.map(String).filter(Boolean)
      : [];

    setSelectedActivityAreas(
      rawNeighborhoodIds.map((id) => ({
        id,
        name: neighborhoodNameById.get(id) ?? id,
      })),
    );
  }, [neighborhoodNameById, profileQuery.data, setAvatarFile, setAvatarPreviewUrl, setAvatarUrl]);

  const handleSave = async () => {
    setHasSubmitted(true);

    if (!trimmedName) {
      showToast("نام مشاور الزامی است.", "خطا", "error");
      return;
    }

    if (selectedActivityAreas.length === 0) {
      showToast("انتخاب محدوده فعالیت الزامی است.", "خطا", "error");
      return;
    }

    const validNeighborhoodIds = new Set(neighborhoods.map((n) => getNeighborhoodId(n)));
    const invalidArea = selectedActivityAreas.find((area) => !validNeighborhoodIds.has(area.id));
    if (invalidArea) {
      showToast(`محدوده فعالیت "${invalidArea.name}" معتبر نیست.`, "خطا", "error");
      return;
    }

    try {
      const profileName = splitProfileName(trimmedName);

      const payload: UpdateConsultantProfilePayload = {
        name: profileName.name,
        family: profileName.family,
        email: normalizeOptionalText(email),
        phone: normalizeOptionalText(phone),
        telegram: normalizeOptionalText(telegram),
        whatsapp: normalizeOptionalText(whatsapp),
        instagram: normalizeOptionalText(instagram),
        neighborhood_ids: selectedActivityAreas
          .map((area) => Number(area.id))
          .filter((id) => !Number.isNaN(id)),
      };

      await updateProfileMutation.mutateAsync(payload);

      if (avatarFile) {
        await updateMyProfileMutation.mutateAsync({
          avatar: avatarFile,
        });
      }

      showToast("اطلاعات مشاور ذخیره شد.");
    } catch (error) {
      showToast(getApiErrorMessage(error, "ذخیره اطلاعات مشاور با خطا مواجه شد."), "خطا", "error");
    }
  };

  return {
    activityAreas: selectedActivityAreas,
    activityAreasError,
    avatarPreviewUrl,
    avatarUrl,
    cityId,
    cityName: selectedCity?.name ?? "",
    email,
    handleAvatarChange,
    handleSave,
    instagram,
    isLoading: profileQuery.isLoading,
    isNeighborhoodPickerOpen,
    isSaving: updateProfileMutation.isPending || updateMyProfileMutation.isPending,
    name,
    nameError,
    phone,
    setEmail,
    setInstagram,
    setIsNeighborhoodPickerOpen,
    setName,
    setPhone,
    setSelectedActivityAreas,
    setTelegram,
    setWhatsapp,
    telegram,
    whatsapp,
  };
}
