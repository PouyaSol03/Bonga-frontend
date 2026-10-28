import { Typography } from "../../../../shared/ui/Typography";
import type { ReactNode } from "react";
import type { AdCardData } from "./types";
import LinearImage from "../../../../shared/icons/LinearImage";
import LinearDelete from "../../../../shared/icons/LinearDelete";
import { AdCardAlbumIcon, AdCardOwnerIcon } from "../AdCardIcons";
import { getStatusBadgeClassName } from "./status";

export function AdCardImage({
  ad,
  className = "",
  imageMeta,
  imageLoading,
  showAgency = true,
  showImageCount,
  showStatusBadge,
  onDeleteIncomplete,
}: {
  ad: AdCardData;
  className?: string;
  imageMeta?: ReactNode;
  imageLoading?: "eager" | "lazy";
  showAgency?: boolean;
  showImageCount: boolean;
  showStatusBadge: boolean;
  onDeleteIncomplete?: (event: React.MouseEvent) => void;
}) {
  const isIncomplete =
    Boolean(onDeleteIncomplete) ||
    /نیمه[\s\u200c]*کاره|incomplete|draft/i.test(ad.status) ||
    ad.status === "-5";

  return (
    <div
      className={`ad-card__image bg-primary-container relative aspect-[328/219.3] shrink-0 overflow-hidden rounded-2xl bg-cover bg-center ${ad.imageClassName} ${className}`}
    >
      <div className="text-outline absolute inset-0 grid place-items-center" aria-hidden="true">
        <LinearImage className="h-12 w-12" />
      </div>
      {ad.imageUrl ? (
        <img
          src={ad.imageUrl}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center"
          draggable={false}
          loading={imageLoading}
          decoding="async"
          fetchPriority={imageLoading === "lazy" ? "low" : undefined}
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />
      ) : null}
      {!isIncomplete && imageMeta}
      {showImageCount && !isIncomplete ? (
        <div
          className="absolute top-2 right-2 z-2 inline-flex h-7 items-center gap-1.5 rounded-lg bg-black/60 px-2 text-sm leading-5 font-medium text-white"
          aria-label={`${ad.imageCount} تصویر`}
        >
          <AdCardAlbumIcon className="h-5 w-5 shrink-0" />
          <Typography as="span" variant="body" size="medium" weight="regular">
            {ad.imageCount}
          </Typography>
        </div>
      ) : null}
      {showStatusBadge && ad.status ? (
        <Typography
          as="span"
          variant="label"
          size="small"
          weight="medium"
          className={`absolute top-2 left-2 z-2 inline-flex h-7 items-center rounded-lg px-4 py-1.5 text-xs font-medium ${ad.statusBadgeClassName ?? getStatusBadgeClassName(ad.status)}`}
        >
          <Typography as="span" variant="label" size="small" weight="medium" className="">
            {ad.status}
          </Typography>
        </Typography>
      ) : null}
      {showAgency && ad.agency && ad.agency.trim() !== "شخصی" ? (
        <div className="absolute right-2 bottom-2 z-[1] inline-flex h-7 max-w-[calc(100%-16px)] items-center gap-2 rounded-lg bg-black/60 px-2 text-sm leading-5 font-medium text-white">
          <AdCardOwnerIcon className="h-5 w-5 shrink-0" />
          <Typography as="span" variant="body" size="medium" weight="regular" className="truncate">
            {ad.agency}
          </Typography>
        </div>
      ) : null}
      {onDeleteIncomplete ? (
        <button
          type="button"
          aria-label="حذف آگهی نیمه کاره"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onDeleteIncomplete(event);
          }}
          className="bg-on-primary text-on-surface-var absolute bottom-2 left-2 z-2 inline-flex h-10 w-10 items-center justify-center rounded-lg transition-colors"
        >
          <LinearDelete className="h-6 w-6" />
        </button>
      ) : null}
    </div>
  );
}
