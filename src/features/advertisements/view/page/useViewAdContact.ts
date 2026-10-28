import { useEffect, useRef, useState } from "react";
import {
  reportAdvertisementEngagement,
  type AdvertisementItem,
} from "../../api/advertisement.service";
import { isPublishedAdvertisement } from "./advertisementStatus";

type Props = {
  ad?: AdvertisementItem;
  adId: string | null;
  isPreview: boolean;
  isLoading: boolean;
  isError: boolean;
};

export function useViewAdContact({ ad, adId, isPreview, isLoading, isError }: Props) {
  const [isContactSheetOpen, setIsContactSheetOpen] = useState(false);
  const [isAgencyContactSheetOpen, setIsAgencyContactSheetOpen] = useState(false);
  const [isOwnerContactSheetOpen, setIsOwnerContactSheetOpen] = useState(false);
  const reportedImpressionAdIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (isPreview || isLoading || isError || !ad?.id) return;
    if (!isPublishedAdvertisement(ad)) return;
    const currentAdId = String(ad.id).trim();
    if (!/^[1-9]\d*$/.test(currentAdId)) return;
    if (reportedImpressionAdIdRef.current === currentAdId) return;

    reportedImpressionAdIdRef.current = currentAdId;
    void reportAdvertisementEngagement(currentAdId, "impression");
  }, [isPreview, isLoading, isError, ad]);

  const handleOpenContactInfo = (type: "contact" | "agency" | "owner") => {
    if (!isPreview && isPublishedAdvertisement(ad)) {
      const targetAdId = ad?.id ? String(ad.id).trim() : adId ? String(adId).trim() : "";
      if (targetAdId && /^[1-9]\d*$/.test(targetAdId)) {
        void reportAdvertisementEngagement(targetAdId, "call");
      }
    }
    if (type === "contact") setIsContactSheetOpen(true);
    if (type === "agency") setIsAgencyContactSheetOpen(true);
    if (type === "owner") setIsOwnerContactSheetOpen(true);
  };

  return {
    isContactSheetOpen,
    isAgencyContactSheetOpen,
    isOwnerContactSheetOpen,
    open: handleOpenContactInfo,
    closeContact: () => setIsContactSheetOpen(false),
    closeAgency: () => setIsAgencyContactSheetOpen(false),
    closeOwner: () => setIsOwnerContactSheetOpen(false),
  };
}
