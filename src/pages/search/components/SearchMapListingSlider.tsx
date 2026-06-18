import {
  type PointerEvent as ReactPointerEvent,
  useLayoutEffect,
  useRef,
} from "react";
import type { SearchMapListing, SearchMapListingId } from "../searchMapData";
import {
  SEARCH_MAP_DEMO_PHOTO,
  searchMapCardDemoImages,
} from "../searchMapData";

type SearchMapListingSliderProps = {
  isOpen: boolean;
  listings: SearchMapListing[];
  selectedListingId: SearchMapListingId | null;
  onSelectListing: (listing: SearchMapListing) => void;
};

export function SearchMapListingSlider({
  isOpen,
  listings,
  selectedListingId,
  onSelectListing,
}: SearchMapListingSliderProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const dragScrollHandlers = useDragScroll(scrollRef);

  useLayoutEffect(() => {
    if (!isOpen || selectedListingId == null) return;

    const scrollEl = scrollRef.current;
    if (!scrollEl) return;

    const card = Array.from(
      scrollEl.querySelectorAll<HTMLElement>("[data-map-slider-card]"),
    ).find(
      (candidate) =>
        candidate.dataset.mapSliderCard === String(selectedListingId),
    );
    if (!card) return;

    const run = () => {
      card.scrollIntoView({
        behavior: "auto",
        block: "nearest",
        inline: "center",
      });
    };

    requestAnimationFrame(() => {
      requestAnimationFrame(run);
    });
  }, [isOpen, selectedListingId, listings]);

  return (
    <section
      className={`absolute inset-x-0 bottom-[max(76px,calc(env(safe-area-inset-bottom)+76px))] z-500 bg-transparent ${
        isOpen
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-8 opacity-0"
      }`}
      aria-label="آگهی‌های روی نقشه"
      dir="rtl"
    >
      <div
        ref={scrollRef}
        className="flex cursor-grab select-none snap-x snap-proximity gap-4 overflow-x-auto overscroll-x-contain bg-transparent px-[30px] pb-3 pt-1 touch-pan-x scrollbar-none [scroll-padding-inline:30px] [-ms-overflow-style:none] active:cursor-grabbing [&::-webkit-scrollbar]:hidden"
        {...dragScrollHandlers}
      >
        {listings.map((listing) => (
          <MapAdCard
            key={listing.id}
            listing={listing}
            isSelected={listing.id === selectedListingId}
            onClick={() => onSelectListing(listing)}
          />
        ))}
      </div>
    </section>
  );
}

function mapCardPriceDisplay(priceValue: string) {
  return priceValue.replace(/[٫.]/g, "/");
}

function MapAdCard({
  listing,
  isSelected,
  onClick,
}: {
  listing: SearchMapListing;
  isSelected: boolean;
  onClick: () => void;
}) {
  const raw =
    listing.images?.length > 0 ? listing.images : searchMapCardDemoImages;

  const images =
    raw.length >= 4
      ? raw.slice(0, 4)
      : [...raw, ...searchMapCardDemoImages].slice(0, 4);

  return (
    <button
      data-map-slider-card={String(listing.id)}
      aria-current={isSelected ? "true" : undefined}
      className="flex w-[calc(100%_-_60px)] shrink-0 snap-center flex-col overflow-hidden rounded-2xl bg-white p-4 text-right"
      type="button"
      onClick={onClick}
      dir="rtl"
    >
      <ImageSlider images={images} />

      <div className="mt-2 flex min-h-5 flex-wrap items-baseline justify-start gap-1.5 [direction:rtl]">
        {listing.priceLabel ? (
          <span className="text-xs font-medium leading-5 text-[#808080]">
            {listing.priceLabel}:
          </span>
        ) : null}
        <strong className="text-sm font-semibold leading-5 text-[#0048c4]">
          {mapCardPriceDisplay(listing.priceValue)}
        </strong>
      </div>

      <div className="mt-2 flex min-h-5 flex-wrap items-center justify-start gap-2.5 text-xs font-medium leading-5 text-[#1a1a1a] [direction:rtl]">
        <PropertyMeta
          className="ad-card__property--area"
          label={listing.area}
        />
        <PropertyMeta
          className="ad-card__property--rooms"
          label={listing.rooms}
        />
        <PropertyMeta
          className="ad-card__property--year"
          label={listing.year}
        />
      </div>

      <h3 className="mt-2 truncate text-right text-sm font-medium leading-5 text-[#1a1a1a]">
        {listing.title}
      </h3>

      <div className="mt-2 flex min-h-5 flex-row flex-wrap items-center justify-start gap-2 [direction:rtl]">
        <div className="ad-card__badges inline-flex items-center gap-1">
          <span className="whitespace-nowrap rounded-lg border border-[#ff6d00] px-1.5 py-px text-xs font-medium leading-4 text-[#ff6d00]">
            فوری
          </span>
        </div>

        <span className="min-w-0 truncate text-xs font-normal leading-5 text-[#808080]">
          {listing.postedAt} در {listing.locationLabel}
        </span>
      </div>
    </button>
  );
}

function ImageSlider({ images }: { images: string[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const dragScrollHandlers = useDragScroll(scrollRef);

  return (
    <div className="h-20 w-full overflow-hidden" dir="rtl">
      <div
        ref={scrollRef}
        className="
          flex h-20 w-full cursor-grab snap-x snap-proximity gap-2.5 overflow-x-auto overscroll-x-contain touch-pan-x scrollbar-none
          [-ms-overflow-style:none] active:cursor-grabbing [&::-webkit-scrollbar]:hidden
        "
        onClick={(event) => {
          event.stopPropagation();
        }}
        onPointerDownCapture={(event) => {
          if (event.pointerType === "mouse") {
            event.stopPropagation();
          }
        }}
        {...dragScrollHandlers}
      >
        {images.map((src, imageIndex) => (
          <img
            key={`${src}-${imageIndex}`}
            className="h-20 w-[120px] shrink-0 snap-start rounded-xl object-cover"
            src={src}
            alt=""
            draggable={false}
            loading={imageIndex < 2 ? "eager" : "lazy"}
            onError={(event) => {
              const target = event.currentTarget;

              if (target.dataset.fallback === "1") return;

              target.dataset.fallback = "1";
              target.src = SEARCH_MAP_DEMO_PHOTO;
            }}
          />
        ))}
      </div>
    </div>
  );
}

function useDragScroll(scrollRef: React.RefObject<HTMLDivElement | null>) {
  const dragStateRef = useRef({
    didDrag: false,
    isDragging: false,
    pointerId: -1,
    startScrollLeft: 0,
    startX: 0,
  });

  const endDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;

    const state = dragStateRef.current;
    if (!state.isDragging || state.pointerId !== event.pointerId) return;

    state.isDragging = false;
    event.currentTarget.releasePointerCapture(event.pointerId);
  };

  return {
    onClickCapture(event: React.MouseEvent<HTMLDivElement>) {
      if (!dragStateRef.current.didDrag) return;

      event.preventDefault();
      event.stopPropagation();
      dragStateRef.current.didDrag = false;
    },
    onPointerCancel: endDrag,
    onPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
      if (event.pointerType !== "mouse" || event.button !== 0) return;

      const scrollEl = scrollRef.current;
      if (!scrollEl) return;

      dragStateRef.current = {
        didDrag: false,
        isDragging: true,
        pointerId: event.pointerId,
        startScrollLeft: scrollEl.scrollLeft,
        startX: event.clientX,
      };
      event.currentTarget.setPointerCapture(event.pointerId);
    },
    onPointerLeave: endDrag,
    onPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
      if (event.pointerType !== "mouse") return;

      const state = dragStateRef.current;
      const scrollEl = scrollRef.current;
      if (!state.isDragging || state.pointerId !== event.pointerId || !scrollEl) {
        return;
      }

      const deltaX = event.clientX - state.startX;
      if (Math.abs(deltaX) > 4) {
        state.didDrag = true;
        event.preventDefault();
      }

      const isRtl = getComputedStyle(scrollEl).direction === "rtl";
      scrollEl.scrollLeft = isRtl
        ? state.startScrollLeft + deltaX
        : state.startScrollLeft - deltaX;
    },
    onPointerUp: endDrag,
  };
}

function PropertyMeta({
  className,
  label,
}: {
  className: string;
  label: string;
}) {
  return (
    <span className={`ad-card__property text-[#4d4d4d] ${className}`}>
      {label}
    </span>
  );
}
