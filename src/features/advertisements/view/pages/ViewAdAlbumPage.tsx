import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperInstance } from "swiper";

import "swiper/css";
import { Button } from "../../../../shared/ui/Button";

export type ViewAdAlbumMediaItem = {
  src: string;
  type: "image" | "video";
};

function AlbumCloseIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

function getAlbumDotSize(index: number, activeIndex: number, total: number) {
  if (index === activeIndex) return 24;
  if (total >= 7 && index === total - 1) return 4;
  if (total >= 6 && index === total - 2) return 6;
  return 8;
}

export function ViewAdAlbumPage({
  initialIndex = 0,
  mediaItems,
  onClose,
}: {
  initialIndex?: number;
  mediaItems: ViewAdAlbumMediaItem[];
  onClose: () => void;
}) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const swiperRef = useRef<SwiperInstance | null>(null);
  const dotSizes = mediaItems.map((_, index) => getAlbumDotSize(index, activeIndex, mediaItems.length));

  return (
    <div className="absolute inset-0 z-[60] flex flex-col overflow-hidden bg-black text-white">
      <header className="flex h-14 shrink-0 items-center justify-between bg-black px-1 [direction:ltr]">
        <div className="h-12 w-40 shrink-0" />
        <div className="min-w-0 flex-1" />
        <Button unstyled
          aria-label="بستن آلبوم"
          className="grid h-12 w-12 shrink-0 place-items-center rounded-full text-white focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-white/40"
          onClick={onClose}
          type="button"
        >
          <AlbumCloseIcon />
        </Button>
      </header>

      <main className="relative min-h-0 flex-1 overflow-hidden bg-black">
        <Swiper
          className="h-full w-full"
          dir="rtl"
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
            swiper.slideTo(initialIndex, 0);
          }}
          slidesPerView={1}
        >
          {mediaItems.map((item, index) => (
            <SwiperSlide key={`${item.src}-${item.type}-${index}`}>
              <div className="flex h-full w-full items-center justify-center p-2">
                {item.type === "video" ? (
                  <video
                    className="max-h-full max-w-full bg-black object-contain"
                    controls
                    playsInline
                    preload="metadata"
                    src={item.src}
                  />
                ) : (
                  <img
                    alt=""
                    className="max-h-full max-w-full object-contain"
                    src={item.src}
                  />
                )}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Indicator pill container */}
        <div className="pointer-events-none absolute bottom-13 left-0 right-0 z-10 flex justify-center">
          <div
            aria-label={`رسانه ${activeIndex + 1} از ${mediaItems.length}`}
            className="pointer-events-auto flex h-6 items-center justify-center rounded-full bg-black/40 px-3 backdrop-blur-sm"
            role="img"
          >
            <div className="flex h-2 items-center gap-2">
              {mediaItems.map((item, index) => (
                <Button unstyled
                  aria-label={`نمایش رسانه ${index + 1}`}
                  className={`block h-2 rounded-full transition-all ${index === activeIndex ? "bg-white" : "bg-white/40"}`}
                  key={`${item.src}-${item.type}-${index}`}
                  onClick={() => swiperRef.current?.slideTo(index)}
                  style={{ width: dotSizes[index] }}
                  type="button"
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
