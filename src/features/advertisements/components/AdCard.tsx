import "./AdCard.css";
import { Link } from "react-router";
import type { AdCardProps } from "./card/types";
import { getAdNavigationState } from "./card/navigation";
import { AdCardBody } from "./card/AdCardBody";
import { AdCardImage } from "./card/AdCardImage";
import { MapPreviewCard } from "./card/MapPreviewCard";
import { RequestResultCard } from "./card/RequestResultCard";

export type { AdCardData } from "./card/types";
export { truncateAdCardText } from "./card/text";
export { AdCardBody } from "./card/AdCardBody";

export function AdCard({
  ad,
  ariaLabel,
  className = "",
  imageAction,
  imageMeta,
  imageLoading = "eager",
  isSelected = false,
  mapPreviewImages = [],
  mapSliderCardId,
  showAgency = true,
  showBadges = true,
  showImageCount = true,
  showStatusBadge = false,
  state,
  to = `/ads/${ad.id}`,
  topBadge,
  variant = "standard",
  onDeleteIncomplete,
}: AdCardProps) {
  const hasSecondaryPrice = Boolean(ad.priceSecondary && ad.priceSecondary.trim() !== "");
  const linkState = getAdNavigationState(to, state);

  if (variant === "mapPreview") {
    return (
      <MapPreviewCard
        ad={ad}
        mapPreviewImages={mapPreviewImages}
        isSelected={isSelected}
        className={className}
        mapSliderCardId={mapSliderCardId}
        linkState={linkState}
        to={to}
        hasSecondaryPrice={hasSecondaryPrice}
      />
    );
  }

  if (variant === "requestResult") {
    return (
      <RequestResultCard
        ad={ad}
        ariaLabel={ariaLabel}
        className={className}
        topBadge={topBadge}
        linkState={linkState}
        to={to}
        imageMeta={imageMeta}
        imageLoading={imageLoading}
        showAgency={showAgency}
        imageAction={imageAction}
        hasSecondaryPrice={hasSecondaryPrice}
        showBadges={showBadges}
      />
    );
  }

  const isDashboard = variant === "dashboard";
  const isCarousel = variant === "carousel";

  return (
    <Link
      aria-label={ariaLabel ?? `مشاهده آگهی ${ad.title}`}
      className={`focus-visible:outline-inset focus-visible:outline-primary/25 block text-inherit no-underline focus-visible:outline-3 ${isDashboard ? "min-w-0" : ""} ${className}`}
      state={linkState}
      to={to}
    >
      <article
        className={
          isDashboard
            ? "flex min-w-0 flex-col gap-4 text-right"
            : isCarousel
              ? "flex min-w-0 flex-col text-right [direction:rtl]"
              : "bg-surface-container-lowest flex flex-col px-4 py-4 text-right [direction:rtl]"
        }
      >
        <AdCardImage
          ad={ad}
          className={isDashboard ? "h-[224px] w-auto" : undefined}
          imageLoading={imageLoading}
          showAgency={showAgency}
          showImageCount={showImageCount}
          showStatusBadge={showStatusBadge}
          onDeleteIncomplete={onDeleteIncomplete}
        />

        <AdCardBody
          ad={ad}
          className={isDashboard ? "gap-2.5 pt-0" : undefined}
          hasSecondaryPrice={hasSecondaryPrice}
          showBadges={showBadges}
        />
      </article>
    </Link>
  );
}
