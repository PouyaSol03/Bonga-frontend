import type { ReactNode } from "react";
import { Link } from "react-router";
import type { AdCardData } from "./types";
import { AdCardBody } from "./AdCardBody";
import { AdCardImage } from "./AdCardImage";

export function RequestResultCard({
  ad,
  ariaLabel,
  className,
  topBadge,
  linkState,
  to,
  imageMeta,
  imageLoading,
  showAgency,
  imageAction,
  hasSecondaryPrice,
  showBadges,
}: {
  ad: AdCardData;
  ariaLabel?: string;
  className: string;
  topBadge?: ReactNode;
  linkState: unknown;
  to: string;
  imageMeta?: ReactNode;
  imageLoading: "eager" | "lazy";
  showAgency: boolean;
  imageAction?: ReactNode;
  hasSecondaryPrice: boolean;
  showBadges: boolean;
}) {
  return (
    <article
      className={`bg-surface-container-lowest relative px-4 pt-3 pb-4 text-right [direction:rtl] ${className}`}
    >
      {topBadge}

      <div className="relative">
        <Link
          aria-label={ariaLabel ?? `مشاهده آگهی ${ad.title}`}
          className="focus-visible:outline-inset focus-visible:outline-primary/25 block text-inherit no-underline focus-visible:outline-3"
          state={linkState}
          to={to}
        >
          <AdCardImage
            ad={ad}
            imageMeta={imageMeta}
            imageLoading={imageLoading}
            showAgency={showAgency}
            showImageCount={false}
            showStatusBadge={false}
          />
        </Link>

        {imageAction}
      </div>

      <Link
        aria-label={ariaLabel ?? `مشاهده آگهی ${ad.title}`}
        className="focus-visible:outline-inset focus-visible:outline-primary/25 block text-inherit no-underline focus-visible:outline-3"
        state={linkState}
        to={to}
      >
        <AdCardBody ad={ad} hasSecondaryPrice={hasSecondaryPrice} showBadges={showBadges} />
      </Link>
    </article>
  );
}
