import { useState, useEffect } from "react";
import { getApiAssetUrl } from "../../../shared/api/api";
import type { MyAgencyProfile } from "../../account/api/account.service";
import type { NeighborhoodDto } from "../../locations/api/neighborhood.service";
import {
  getInitialAgencyProfileMapCenter,
  normalizeProfileCoordinate,
  normalizeProfileText,
  resolveNeighborhoodById,
  resolveProfileNeighborhoodIds,
  selectedCityMapZoom,
} from "./agencyProfileHelpers";
import type { AgencyProfileMapCenter, SelectedNeighborhood } from "./types";

export function useAgencyProfileFields({
  neighborhoods,
  profile,
  setLogoFile,
  setLogoPreviewUrl,
  setLogoUrl,
  setMapCenter,
}: {
  neighborhoods: NeighborhoodDto[];
  profile: MyAgencyProfile | undefined;
  setLogoFile: (file: File | null) => void;
  setLogoPreviewUrl: (url: string | null) => void;
  setLogoUrl: (url: string | null) => void;
  setMapCenter: (center: AgencyProfileMapCenter) => void;
}) {
  const [agencyName, setAgencyName] = useState("");
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<SelectedNeighborhood | null>(null);
  const [selectedActivityAreas, setSelectedActivityAreas] = useState<SelectedNeighborhood[]>([]);
  const [activePicker, setActivePicker] = useState<"neighborhood" | "activity" | null>(null);
  const [phone1, setPhone1] = useState("");
  const [phone2, setPhone2] = useState("");
  const [phone3, setPhone3] = useState("");
  const [telegram, setTelegram] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [instagram, setInstagram] = useState("");
  const [workingHours, setWorkingHours] = useState("");
  const [address, setAddress] = useState("");
  const [aboutUs, setAboutUs] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    if (!profile) return;

    setAgencyName(normalizeProfileText(profile.name));
    setPhone1(normalizeProfileText(profile.phone1));
    setPhone2(normalizeProfileText(profile.phone2));
    setPhone3(normalizeProfileText(profile.phone3));
    setTelegram(normalizeProfileText(profile.telegram));
    setWhatsapp(normalizeProfileText(profile.whatsapp));
    setInstagram(normalizeProfileText(profile.instagram));
    setWorkingHours(normalizeProfileText(profile.working_hours));
    setAddress(normalizeProfileText(profile.address));
    setAboutUs(normalizeProfileText(profile.about_us));
    setLogoFile(null);
    setLogoPreviewUrl(null);
    setLogoUrl(profile.logo ? getApiAssetUrl(profile.logo) : null);

    const profileNeighborhoodIds = resolveProfileNeighborhoodIds(profile);
    const neighborhoodId = profile.neighborhood_id
      ? String(profile.neighborhood_id)
      : (profileNeighborhoodIds[0] ?? null);
    setSelectedNeighborhood(resolveNeighborhoodById(neighborhoodId, neighborhoods));
    setSelectedActivityAreas(
      profileNeighborhoodIds
        .map((id) => resolveNeighborhoodById(id, neighborhoods))
        .filter((item): item is SelectedNeighborhood => Boolean(item)),
    );

    const lat = normalizeProfileCoordinate(profile.lat);
    const lng = normalizeProfileCoordinate(profile.lng);

    if (lat !== null && lng !== null) {
      setMapCenter({ lat, lng, zoom: selectedCityMapZoom });
    } else {
      setMapCenter(getInitialAgencyProfileMapCenter());
    }
  }, [profile, neighborhoods, setLogoFile, setLogoPreviewUrl, setLogoUrl, setMapCenter]);

  return {
    aboutUs,
    activePicker,
    address,
    agencyName,
    hasSubmitted,
    instagram,
    phone1,
    phone2,
    phone3,
    selectedActivityAreas,
    selectedNeighborhood,
    setActivePicker,
    setAboutUs,
    setAddress,
    setAgencyName,
    setHasSubmitted,
    setInstagram,
    setPhone1,
    setPhone2,
    setPhone3,
    setSelectedActivityAreas,
    setSelectedNeighborhood,
    setTelegram,
    setWhatsapp,
    setWorkingHours,
    telegram,
    whatsapp,
    workingHours,
  };
}
