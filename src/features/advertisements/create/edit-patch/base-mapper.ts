import type { NewAdFormValues } from "../types";
import type { PatchAppender } from "./types";
import {
  locationKey,
  locationLatKey,
  locationLngKey,
  neighborhoodIdKey,
  subNeighborhoodIdKey,
} from "../data";
import {
  canonicalizeMediaPath,
  getStoredNewAdLocationNumber,
  mediaSource,
  trimFormValues,
} from "../utils";

export function mapChangedBaseFields(
  values: NewAdFormValues,
  changed: Set<keyof NewAdFormValues>,
  appender: PatchAppender,
): void {
  const clean = trimFormValues(values);

  if (changed.has("title")) appender.appendBase("title", clean.title);
  if (changed.has("description")) appender.appendBase("description", clean.description);

  if (changed.has("location") || changed.has("neighborhoodId") || changed.has("subNeighborhoodId")) {
    const nId = clean.neighborhoodId || window.localStorage.getItem(neighborhoodIdKey) || "";
    const subNId = clean.subNeighborhoodId || window.localStorage.getItem(subNeighborhoodIdKey) || "";
    appender.appendBase("neighborhood_id", nId);
    appender.appendBase("sub_neighborhood_id", subNId);
    appender.appendBase("lat", getStoredNewAdLocationNumber(locationLatKey));
    appender.appendBase("lng", getStoredNewAdLocationNumber(locationLngKey));
    appender.appendBase("location_label", clean.location || window.localStorage.getItem(locationKey) || "");
  }

  if (changed.has("virtualTourLink") || changed.has("hasVirtualTour")) {
    appender.appendBase("virtual_tour_link", clean.hasVirtualTour ? clean.virtualTourLink.trim() : "");
  }

  if (changed.has("agencyId")) {
    appender.appendBase("agency_id", clean.registrantType === "agency" ? clean.agencyId.trim() : "");
  }

  if (changed.has("consultantId")) {
    const cId = clean.consultantId ? clean.consultantId.trim() : "";
    appender.appendBase("consultant_id", cId);
  }

  // Edit Mode Policy: NEVER send owner_name; send owner_contact_name like owner_contact_phone
  if (changed.has("ownerFullName")) {
    appender.appendBase("owner_contact_name", clean.ownerFullName);
  }
  if (changed.has("ownerPhone")) {
    appender.appendBase("owner_contact_phone", clean.ownerPhone);
  }
  if (changed.has("ownerExactAddress")) {
    appender.appendBase("owner_contact_address", clean.ownerExactAddress);
  }
  if (changed.has("phoneNumber")) {
    appender.appendBase("owner_phone", clean.phoneNumber);
  }

  if (changed.has("telegram")) appender.appendBase("telegram", clean.telegram);
  if (changed.has("whatsapp")) appender.appendBase("whatsapp", clean.whatsapp);

  if (changed.has("chatEnabled") || changed.has("phoneEnabled")) {
    const contactTypes = [clean.chatEnabled ? "chat" : null, clean.phoneEnabled ? "phone" : null].filter(Boolean);
    contactTypes.forEach((t) => appender.formData.append("contact_type[]", String(t)));
  }

  mapChangedMedia(clean, changed, appender);
}

function mapChangedMedia(
  clean: NewAdFormValues,
  changed: Set<keyof NewAdFormValues>,
  appender: PatchAppender,
): void {
  if (changed.has("photos")) {
    const seenUploaded = new Set<string>();
    const seenCanonical = new Set<string>();

    clean.photos.forEach((photo) => {
      if (photo.file) {
        const key = `${photo.file.name}_${photo.file.size}`;
        if (!seenUploaded.has(key)) {
          seenUploaded.add(key);
          appender.formData.append("images", photo.file, photo.file.name);
        }
      } else {
        const source = mediaSource(photo.existingValue || photo.previewUrl);
        if (source) {
          const canonical = canonicalizeMediaPath(source);
          if (canonical && !seenCanonical.has(canonical)) {
            seenCanonical.add(canonical);
            appender.formData.append("existing_images", canonical);
          }
        }
      }
    });
    appender.appendDynamic("has_image", clean.photos.length > 0);
  }

  if (changed.has("video")) {
    if (clean.video?.file) {
      appender.formData.append("video", clean.video.file);
    } else if (clean.video?.existingValue || clean.video?.previewUrl) {
      const source = mediaSource(clean.video.existingValue || clean.video.previewUrl);
      const canonical = source ? canonicalizeMediaPath(source) : "";
      if (canonical) {
        appender.formData.append("existing_video", canonical);
      }
    } else {
      appender.formData.append("videos", "[]");
    }
    appender.appendDynamic("has_video", Boolean(clean.video));
  }
}
