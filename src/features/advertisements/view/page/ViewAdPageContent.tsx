import type { AdvertisementItem } from "../../api/advertisement.service";
import { SEO } from "../../../../shared/components/SEO";
import { ViewAdTopBar } from "../viewAdComponents";
import type { IconName } from "../viewAdTypes";
import { ViewAdContent } from "./ViewAdContent";
import type { ViewAdPresentation } from "./viewAdPresentation";

type Props = {
  ad: AdvertisementItem;
  adId: string;
  isPreview: boolean;
  presentation: ViewAdPresentation;
  bookmarked: boolean;
  onAction: (icon: IconName) => void;
  onBack: () => void;
  onRowAction: (label: string) => void;
  onOpenAlbum: (initialIndex?: number) => void;
};

export function ViewAdPageContent({
  ad,
  adId,
  isPreview,
  presentation,
  bookmarked: isBookmarked,
  onAction,
  onBack,
  onRowAction,
  onOpenAlbum,
}: Props) {
  const {
    details,
    mediaItems,
    isAdPublished,
    usesPublicAdPresentation,
    resolvedHasTour3d,
    resolvedTour3dUrl,
    mapPosition,
  } = presentation;
  return (
    <>
      <SEO
        title={details.title || details.headline || "آگهی املاک"}
        description={details.description}
        ogImage={mediaItems.find((item) => item.type === "image")?.src}
        twitterCard="summary_large_image"
      />
      <h1 className="sr-only">{details.title || details.headline || "آگهی املاک"}</h1>
      <ViewAdTopBar
        actionIcons={
          isPreview
            ? isAdPublished
              ? ["share"]
              : []
            : usesPublicAdPresentation
              ? undefined
              : ["share"]
        }
        backTo={
          isPreview && adId
            ? `/account/manage-ads/${encodeURIComponent(String(adId))}/state-ad`
            : "/home"
        }
        bookmarked={isBookmarked}
        onAction={onAction}
        onBack={onBack}
      />

      <main className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain bg-[#F0F0F0]">
        <ViewAdContent
          adId={adId}
          ad={ad}
          details={details}
          hasTour3d={resolvedHasTour3d}
          hideRestrictedActions={!usesPublicAdPresentation}
          isPreview={isPreview}
          mediaItems={mediaItems}
          mapPosition={mapPosition}
          onOpenAlbum={onOpenAlbum}
          onRowAction={onRowAction}
          tour3dUrl={resolvedTour3dUrl}
        />
      </main>
    </>
  );
}
