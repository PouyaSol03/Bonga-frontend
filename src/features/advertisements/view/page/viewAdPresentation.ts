import type { AdvertisementItem } from "../../api/advertisement.service";
import {
  buildGalleryMediaItems,
  getMapPosition,
  getVirtualTourUrl,
  hasTour3d,
  isOwnAdvertisement,
  mapAdToDetails,
} from "../viewAdDetails";
import type { AgencyUserContactData } from "../components/AgencyUserContactBottomSheet";
import { getPublisherContactActions } from "../details/adContactActions";
import { isPublishedAdvertisement } from "./advertisementStatus";
import { readContactInfo } from "./contactInfo";
import { readAgencyUserContact } from "./agencyUserContact";

export function buildViewAdPresentation(
  resolvedAd: AdvertisementItem,
  isPreview: boolean,
  isPersonalPreview: boolean,
) {
  const details = mapAdToDetails(resolvedAd);
  const isOwnAd = isOwnAdvertisement(resolvedAd);
  const usesPublicAdPresentation = isPreview ? !isPersonalPreview : !isOwnAd;
  const isAdPublished = isPublishedAdvertisement(resolvedAd);
  const contactInfo = readContactInfo(resolvedAd);
  const publisherContact = getPublisherContactActions(resolvedAd);
  const agencyUserContact = readAgencyUserContact(
    resolvedAd,
    details,
    (window.history.state as Record<string, unknown> | null)?.userContact as
      AgencyUserContactData | undefined,
  );
  const hasContactSheetData = Boolean(
    contactInfo.phone || contactInfo.instagram || contactInfo.telegram || contactInfo.whatsapp,
  );
  const hasChatContact = usesPublicAdPresentation && contactInfo.chat;
  const contactActionCount = isPersonalPreview
    ? 0
    : Number(hasContactSheetData) + Number(hasChatContact);
  const contactActionsGridClassName = contactActionCount === 1 ? "grid-cols-1" : "grid-cols-2";
  const mediaItems = buildGalleryMediaItems(resolvedAd);
  const resolvedTour3dUrl = getVirtualTourUrl(resolvedAd);
  const resolvedHasTour3d = hasTour3d(resolvedAd);

  return {
    details,
    usesPublicAdPresentation,
    isAdPublished,
    contactInfo,
    publisherContact,
    agencyUserContact,
    hasContactSheetData,
    hasChatContact,
    contactActionCount,
    contactActionsGridClassName,
    mediaItems,
    resolvedTour3dUrl,
    resolvedHasTour3d,
    mapPosition: getMapPosition(resolvedAd),
  };
}

export type ViewAdPresentation = ReturnType<typeof buildViewAdPresentation>;
