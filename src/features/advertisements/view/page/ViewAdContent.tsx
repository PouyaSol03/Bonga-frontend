import { type AdvertisementItem } from "../../api/advertisement.service";
import type { ViewAdDetails } from ".././viewAdTypes";
import { getAdvertiserPreview, type AlbumMediaItem } from ".././viewAdDetails";
import { PreSaleViewContent } from ".././PreSaleViewContent";
import { AdvertiserCard } from "./AdvertiserCard";
import { AdvertisementSummary } from "./AdvertisementSummary";
import { PropertyOverview } from "./PropertyOverview";
import { FacilitiesSection } from "./FacilitiesSection";
import { DescriptionSection } from "./DescriptionSection";
import { AdvertisementActionRows } from "./AdvertisementActionRows";

export function ViewAdContent({
  adId,
  ad,
  details,
  hasTour3d,
  hideRestrictedActions,
  isPreview = false,
  mediaItems,
  mapPosition,
  onOpenAlbum,
  onRowAction,
  tour3dUrl,
}: {
  adId: string;
  ad: AdvertisementItem;
  details: ViewAdDetails;
  hasTour3d: boolean;
  hideRestrictedActions: boolean;
  isPreview?: boolean;
  mediaItems: AlbumMediaItem[];
  mapPosition: { latitude: number; longitude: number } | null;
  onOpenAlbum: (initialIndex?: number) => void;
  onRowAction: (label: string) => void;
  tour3dUrl: string;
}) {
  const advertiserPreview = getAdvertiserPreview(ad, details);
  return (<>
    <AdvertisementSummary details={details} hasTour3d={hasTour3d} mediaItems={mediaItems} onOpenAlbum={onOpenAlbum} tour3dUrl={tour3dUrl} />
    {details.formCode === "presale-special" ? (
      <PreSaleViewContent adId={adId} details={details} />
    ) : (<>
      <PropertyOverview adId={adId} details={details} />
      <FacilitiesSection details={details} />
      <DescriptionSection details={details} mapPosition={mapPosition} />
    </>)}
    {advertiserPreview ? <AdvertiserCard preview={advertiserPreview} /> : null}
    <AdvertisementActionRows ad={ad} details={details} isPreview={isPreview} hideRestrictedActions={hideRestrictedActions} onRowAction={onRowAction} />
  </>);
}
