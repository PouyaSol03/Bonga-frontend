import { getApiAssetUrl } from "../../../shared/api/api";
import type { StoredSelectedCity } from "../../../shared/lib/selectedCityStorage";
import type { MyAgencyProfile } from "../../account/api/account.service";
import type {
  PublicAgencyDetailDto,
  PublicAgentDetailDto,
} from "../../agencies/api/agency.service";
import { getProfileNeighborhoodIds } from "./profileHelpers";
import {
  getAgencyDisplayName,
  getAgencyLocationLabel,
  getPreviewNeighborhoodIds,
  getPreviewSearchParam,
  getPublicPreviewId,
} from "./urlHelpers";

interface ResolveEntityParams {
  isAgentPreview: boolean;
  isPublicPreview: boolean;
  profile?: MyAgencyProfile | null;
  publicAgency?: PublicAgencyDetailDto | null;
  publicAgent?: PublicAgentDetailDto | null;
  selectedCity: StoredSelectedCity | null;
}

export function resolvePreviewEntity({
  isAgentPreview,
  isPublicPreview,
  profile,
  publicAgency,
  publicAgent,
  selectedCity,
}: ResolveEntityParams) {
  const publicPreviewId = getPublicPreviewId();

  const entityId = isAgentPreview
    ? (publicAgent?.id ?? publicPreviewId)
    : (publicAgency?.id ?? String(profile?.id ?? profile?._id ?? "").trim());

  const entityName = isAgentPreview
    ? publicAgent?.name || getAgencyDisplayName() || "مشاور املاک"
    : publicAgency?.name || profile?.name?.trim() || getAgencyDisplayName() || "آژانس املاک";

  const cityId = String(
    profile?.city_id || getPreviewSearchParam("city_id") || selectedCity?.id || "",
  ).trim();
  const cityName =
    profile?.city_name?.trim() || getPreviewSearchParam("city_name") || selectedCity?.name || "";

  const entityLocation = isAgentPreview
    ? publicAgent?.agency?.address ||
      publicAgent?.agency?.name ||
      cityName ||
      getAgencyLocationLabel()
    : publicAgency?.address || profile?.address?.trim() || cityName || getAgencyLocationLabel();

  const entityLogo = isAgentPreview
    ? publicAgent?.avatar || getPreviewSearchParam("logo")
    : publicAgency?.logo ||
      publicAgency?.img ||
      (profile?.logo ? getApiAssetUrl(profile.logo) : "") ||
      getPreviewSearchParam("logo");

  const entityAbout = isAgentPreview
    ? publicAgent?.about_us || getPreviewSearchParam("about_us")
    : publicAgency?.about_us ||
      profile?.about_us?.trim() ||
      (isPublicPreview ? getPreviewSearchParam("about_us") : "");

  const activityAreaIds = isAgentPreview
    ? (publicAgent?.neighborhood_ids ?? getPreviewNeighborhoodIds())
    : (publicAgency?.neighborhood_ids ??
      (profile ? getProfileNeighborhoodIds(profile) : getPreviewNeighborhoodIds()));

  return {
    activityAreaIds,
    cityId,
    cityName,
    entityAbout,
    entityId,
    entityLocation,
    entityLogo,
    entityName,
  };
}
