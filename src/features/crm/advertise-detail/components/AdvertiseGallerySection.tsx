import { useState } from "react";
import LinearClock from "../../../../shared/icons/LinearClock";
import LinearImage from "../../../../shared/icons/LinearImage";
import LinearLocation from "../../../../shared/icons/LinearLocation";
import LinearHouseDimensions from "../../../../shared/icons/LinearHouseDimensions";
import LinearHome2 from "../../../../shared/icons/LinearHome2";
import LinearApartment from "../../../../shared/icons/LinearApartment";
import LinearGps from "../../../../shared/icons/LinearGps";
import LinearVideo from "../../../../shared/icons/LinearVideo";
import { Typography } from "../../../../shared/ui/Typography";
import { ViewAdAlbumPage } from "../../../advertisements/view/pages/ViewAdAlbumPage";
import type { AlbumMediaItem } from "../../../advertisements/view/details/adMedia";
import { formatArea } from "../formatters";
import { getFormName } from "../helpers";

export function AdvertiseGallerySection({
  age,
  area,
  coverImage,
  createdAt,
  floor,
  formCode,
  hasVideo,
  images,
  locationTitle,
  pricePresentation,
  rooms,
  title,
  trackCode,
  videos = [],
  virtualTourLink,
}: {
  age?: unknown;
  area?: unknown;
  coverImage?: string;
  createdAt: string;
  floor?: unknown;
  formCode?: string;
  hasVideo?: boolean;
  images: string[];
  locationTitle: string;
  pricePresentation: {
    primaryLabel: string;
    primaryValue: string;
    secondaryLabel: string;
    secondaryValue: string;
  };
  rooms?: unknown;
  title: string;
  trackCode: string;
  videos?: string[];
  virtualTourLink?: string;
}) {
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
  const [isAlbumOpen, setIsAlbumOpen] = useState(false);

  const displayImages = images.length > 0 ? images : coverImage ? [coverImage] : [];
  const mediaItems: AlbumMediaItem[] = [
    ...videos.map((src): AlbumMediaItem => ({ src, type: "video" })),
    ...displayImages.map((src): AlbumMediaItem => ({ src, type: "image" })),
  ];
  const safeIndex = Math.min(selectedMediaIndex, Math.max(0, mediaItems.length - 1));
  const activeMedia = mediaItems[safeIndex];
  const resolvedHasVideo = Boolean(hasVideo || videos.length > 0);
  const hasTour3d = Boolean(virtualTourLink?.trim());

  return (
    <section className="rounded-2xl border border-[#f0f0f0] bg-white p-5 shadow-xs sm:p-6">
      {/* Gallery Box (Videos first, then Images) */}
      {mediaItems.length > 0 && activeMedia ? (
        <div className="space-y-3">
          <div className="group relative aspect-[16/10] max-h-[460px] w-full overflow-hidden rounded-2xl bg-[#f0f4f8]">
            {activeMedia.type === "video" ? (
              <video
                className="h-full w-full bg-black object-contain"
                controls
                playsInline
                preload="metadata"
                src={activeMedia.src}
              />
            ) : (
              <button
                aria-label="مشاهده تمام تصاویر"
                className="block h-full w-full cursor-zoom-in border-0 bg-transparent p-0"
                onClick={() => setIsAlbumOpen(true)}
                type="button"
              >
                <img
                  alt={title}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.01]"
                  src={activeMedia.src}
                />
              </button>
            )}

            {/* Media Count Pill */}
            <Typography
              as="span"
              variant="label"
              size="medium"
              weight="medium"
              className="pointer-events-none absolute bottom-4 left-4 inline-flex h-9 items-center gap-1.5 rounded-xl bg-black/65 px-3.5 text-xs font-semibold text-white backdrop-blur-md"
            >
              {activeMedia.type === "video" ? (
                <LinearVideo className="h-4 w-4" />
              ) : (
                <LinearImage className="h-4 w-4" />
              )}
              {activeMedia.type === "video" ? "ویدیو" : "تصویر"}{" "}
              {new Intl.NumberFormat("fa-IR").format(safeIndex + 1)} از{" "}
              {new Intl.NumberFormat("fa-IR").format(mediaItems.length)}
            </Typography>

            {/* Virtual Tour Pill */}
            {virtualTourLink ? (
              <a
                href={virtualTourLink}
                target="_blank"
                rel="noreferrer"
                className="absolute top-4 left-4 inline-flex h-9 items-center gap-1.5 rounded-xl bg-[#0048c4] px-3.5 text-xs font-semibold text-white shadow-md transition hover:bg-[#003ca4]"
              >
                <LinearGps className="h-4 w-4" />
                مشاهده تور مجازی ۳D
              </a>
            ) : null}
          </div>

          {/* Thumbnails row if more than 1 media item */}
          {mediaItems.length > 1 ? (
            <div className="flex gap-2.5 overflow-x-auto pb-1.5 pt-0.5">
              {mediaItems.map((item, idx) => (
                <button
                  key={`${item.src}-${item.type}-${idx}`}
                  type="button"
                  onClick={() => setSelectedMediaIndex(idx)}
                  className={`relative h-18 w-24 shrink-0 cursor-pointer overflow-hidden rounded-xl border-2 transition ${
                    safeIndex === idx
                      ? "border-[#0048c4] ring-2 ring-[#0048c4]/30"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  {item.type === "video" ? (
                    <div className="relative flex h-full w-full items-center justify-center bg-[#0f172a] text-white">
                      <video
                        className="h-full w-full object-cover opacity-70"
                        muted
                        playsInline
                        preload="metadata"
                        src={item.src}
                      />
                      <span className="absolute inset-0 grid place-items-center bg-black/35">
                        <LinearVideo className="h-6 w-6 text-white" />
                      </span>
                    </div>
                  ) : (
                    <img alt="" className="h-full w-full object-cover" src={item.src} />
                  )}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      ) : (
        <div className="flex h-56 w-full flex-col items-center justify-center rounded-2xl border border-dashed border-[#d9e2f2] bg-[#f8fafc] text-[#8ea7cf]">
          <LinearImage className="h-12 w-12" />
          <Typography
            as="span"
            variant="label"
            size="medium"
            weight="medium"
            className="mt-2 block text-sm font-medium text-[#64748b]"
          >
            این آگهی بدون تصویر است
          </Typography>
        </div>
      )}

      {/* Media icons (only when present) & Persian form name below image on the left */}
      {resolvedHasVideo || hasTour3d || formCode ? (
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            {resolvedHasVideo ? (
              <span
                aria-label="دارای ویدیو"
                title="دارای ویدیو"
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#eef4ff] text-[#0048c4]"
              >
                <LinearVideo className="h-4.5 w-4.5" />
              </span>
            ) : null}
            {hasTour3d ? (
              <a
                aria-label="دارای تور مجازی ۳D"
                title="دارای تور مجازی ۳D"
                href={virtualTourLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-8 items-center gap-1 rounded-lg bg-[#eef4ff] px-2 font-semibold text-[#0048c4] transition hover:bg-[#dce8ff]"
              >
                <LinearGps className="h-4 w-4" />
                <span>3D</span>
              </a>
            ) : null}
          </div>

          {formCode ? (
            <span className="rounded-lg bg-[#f0f4f8] px-2.5 py-1 text-xs font-semibold text-[#334155]">
              {getFormName(formCode)}
            </span>
          ) : null}
        </div>
      ) : null}

      {isAlbumOpen ? (
        <div className="fixed inset-0 z-[70]">
          <ViewAdAlbumPage
            initialIndex={safeIndex}
            mediaItems={mediaItems}
            onClose={() => setIsAlbumOpen(false)}
          />
        </div>
      ) : null}

      {/* Header Info */}
      <div className="pt-6">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-[#666666]">
          <div className="flex items-center gap-2">
            <Typography
              as="span"
              variant="body"
              size="medium"
              weight="regular"
              className="inline-flex items-center gap-1.5"
            >
              <LinearClock className="h-4 w-4 text-[#808080]" />
              {createdAt}
            </Typography>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-lg bg-[#f0f4f8] px-2.5 py-1 font-mono text-xs font-semibold text-[#334155]">
              کد پیگیری: {trackCode}
            </span>
          </div>
        </div>

        {/* Location Row */}
        <Typography
          as="p"
          variant="body"
          size="medium"
          weight="regular"
          className="m-0 mt-3.5 flex items-center gap-1.5 text-sm font-medium text-[#0048c4]"
        >
          <LinearLocation className="h-4.5 w-4.5 shrink-0" />
          {locationTitle || "موقعیت ثبت نشده"}
        </Typography>

        {/* Title */}
        <Typography
          as="h1"
          variant="headline"
          size="small"
          className="m-0 mt-2 text-xl font-bold leading-9 text-[#1a1a1a] sm:text-2xl"
        >
          {title}
        </Typography>

        {/* Key Highlights Grid */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {/* Price Card */}
          <div className="rounded-xl border border-[#0048c4]/15 bg-[#eef4ff]/60 p-3.5 sm:col-span-2">
            <Typography
              as="span"
              variant="label"
              size="small"
              weight="medium"
              className="block text-xs font-medium text-[#0048c4]"
            >
              {pricePresentation.primaryLabel}
            </Typography>
            <strong className="mt-1 block text-lg font-bold text-[#1a1a1a]">
              {pricePresentation.primaryValue}
            </strong>
            {pricePresentation.secondaryValue && pricePresentation.secondaryValue !== "-" ? (
              <span className="mt-1 block text-xs text-[#666666]">
                {pricePresentation.secondaryLabel}: {pricePresentation.secondaryValue}
              </span>
            ) : null}
          </div>

          {/* Area Card */}
          <div className="rounded-xl border border-[#f0f0f0] bg-[#fafafa] p-3.5">
            <div className="flex items-center gap-1.5 text-xs text-[#808080]">
              <LinearHouseDimensions className="h-4 w-4 text-[#0048c4]" />
              <span>متراژ</span>
            </div>
            <strong className="mt-1 block text-base font-bold text-[#1a1a1a]">
              {formatArea(area)}
            </strong>
          </div>

          {/* Rooms Card */}
          <div className="rounded-xl border border-[#f0f0f0] bg-[#fafafa] p-3.5">
            <div className="flex items-center gap-1.5 text-xs text-[#808080]">
              <LinearHome2 className="h-4 w-4 text-[#0048c4]" />
              <span>تعداد اتاق</span>
            </div>
            <strong className="mt-1 block text-base font-bold text-[#1a1a1a]">
              {rooms ? `${rooms} اتاق` : "ثبت نشده"}
            </strong>
          </div>

          {/* Floor / Age Card */}
          {floor !== undefined && floor !== null && floor !== "" ? (
            <div className="rounded-xl border border-[#f0f0f0] bg-[#fafafa] p-3.5">
              <div className="flex items-center gap-1.5 text-xs text-[#808080]">
                <LinearApartment className="h-4 w-4 text-[#0048c4]" />
                <span>طبقه</span>
              </div>
              <strong className="mt-1 block text-base font-bold text-[#1a1a1a]">
                {String(floor)}
              </strong>
            </div>
          ) : null}

          {age !== undefined && age !== null && age !== "" ? (
            <div className="rounded-xl border border-[#f0f0f0] bg-[#fafafa] p-3.5">
              <div className="flex items-center gap-1.5 text-xs text-[#808080]">
                <LinearClock className="h-4 w-4 text-[#0048c4]" />
                <span>سن بنا</span>
              </div>
              <strong className="mt-1 block text-base font-bold text-[#1a1a1a]">
                {String(age)}
              </strong>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
