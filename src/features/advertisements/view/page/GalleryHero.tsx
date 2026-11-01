import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperInstance } from "swiper";
import { type AlbumMediaItem } from ".././viewAdDetails";
import { Typography } from "../../../../shared/ui/Typography";
import { Button } from "../../../../shared/ui/Button";
import LinearInfoCircle from "../../../../shared/icons/LinearInfoCircle";
import LinearImage from "../../../../shared/icons/LinearImage";
import { GalleryMediaButton } from "./GalleryMediaButton";

export function GalleryHero({
  hasTour3d = false,
  imagesNotBelongToAd,
  mediaItems = [{ src: "/figma/view-ad-gallery.png", type: "image" }],
  onOpenAlbum,
  tour3dUrl = "",
}: {
  hasTour3d?: boolean;
  imagesNotBelongToAd?: boolean;
  mediaItems?: AlbumMediaItem[];
  onOpenAlbum: (initialIndex?: number) => void;
  tour3dUrl?: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef<SwiperInstance | null>(null);
  const galleryItems =
    mediaItems.length > 0 ? mediaItems : [{ src: "/figma/view-ad-gallery.png", type: "image" }];
  const videoIndex = galleryItems.findIndex((item) => item.type === "video");
  const hasVideo = videoIndex >= 0;
  const imageCount = galleryItems.filter((item) => item.type === "image").length;

  const selectGalleryKind = (kind: GalleryMediaKind) => {
    if (kind === "album") {
      swiperRef.current?.slideTo(0);
      setActiveIndex(0);
      return;
    }

    if (kind === "video") {
      if (!hasVideo) return;

      swiperRef.current?.slideTo(videoIndex);
      setActiveIndex(videoIndex);
      return;
    }

    if (tour3dUrl) {
      window.open(tour3dUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="px-4 pt-4">
      <div className="bg-surface-container focus-within:outline-primary/40 relative block w-full overflow-hidden rounded-2xl focus-within:outline-3 focus-within:outline-offset-2">
        <Swiper
          className="w-full"
          dir="rtl"
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          slidesPerView={1}
        >
          {galleryItems.map((item, index) => (
            <SwiperSlide key={`${item.src}-${item.type}-${index}`}>
              {item.type === "video" ? (
                <video
                  className="aspect-[328/219] w-full bg-black object-cover"
                  controls
                  playsInline
                  preload="metadata"
                  src={item.src}
                />
              ) : (
                <Button
                  unstyled
                  aria-label="باز کردن آلبوم تصاویر"
                  className="bg-surface-container relative block w-full"
                  onClick={() => onOpenAlbum(index)}
                  type="button"
                >
                  <img
                    alt=""
                    className="aspect-[328/219] w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      const fallback =
                        e.currentTarget.parentElement?.querySelector(".gallery-fallback-icon");
                      if (fallback) fallback.classList.remove("hidden");
                    }}
                    src={item.src}
                  />
                  <div className="gallery-fallback-icon text-outline grid hidden aspect-[328/219] w-full place-items-center">
                    <LinearImage className="h-12 w-12" />
                  </div>
                </Button>
              )}
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="absolute top-2 right-2 z-2 inline-flex items-center gap-1 rounded-lg bg-black/60 px-1 text-sm leading-5 font-medium text-white">
          <GalleryMediaButton
            iconSrc="/icons/iconAlbum.svg"
            isSelected={galleryItems[activeIndex]?.type === "image"}
            label="album"
            onClick={() => selectGalleryKind("album")}
          />
          <Typography as="span" variant="body" size="medium" weight="regular">
            {new Intl.NumberFormat("fa-IR").format(imageCount)}
          </Typography>
          {hasVideo ? (
            <GalleryMediaButton
              iconSrc="/icons/iconVideo.svg"
              isSelected={galleryItems[activeIndex]?.type === "video"}
              label="video"
              onClick={() => selectGalleryKind("video")}
            />
          ) : null}
          {hasTour3d ? (
            <GalleryMediaButton
              iconSrc="/icons/icon3d.svg"
              isSelected={false}
              label="3d"
              onClick={() => selectGalleryKind("tour3d")}
            />
          ) : null}
        </div>

        <div className="absolute right-0 bottom-3 left-0 z-10 flex justify-center">
          <div className="flex h-2 items-center gap-1.5">
            {galleryItems.slice(0, 4).map((item, index) => (
              <Button
                unstyled
                aria-label={`نمایش تصویر ${index + 1}`}
                className={
                  index === activeIndex
                    ? "h-1.5 w-5 rounded-full bg-white"
                    : "h-1.5 w-1.5 rounded-full bg-white/70"
                }
                key={`${item.src}-dot-${index}`}
                onClick={() => swiperRef.current?.slideTo(index)}
                type="button"
              />
            ))}
          </div>
        </div>
      </div>
      {imagesNotBelongToAd ? (
        <div className="mt-2.5 flex items-center gap-1.5 px-1 [direction:rtl]">
          <LinearInfoCircle className="text-outline h-4 w-4 shrink-0" />
          <Typography
            as="span"
            variant="body"
            size="small"
            weight="regular"
            className="text-outline"
          >
            عکس‌ها متعلق به این آگهی نیست
          </Typography>
        </div>
      ) : null}
    </div>
  );
}

export type GalleryMediaKind = "album" | "video" | "tour3d";
