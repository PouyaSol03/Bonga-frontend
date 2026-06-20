import {
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  type RefObject,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
} from "react";

import {
  AdCardAlbumIcon,
  AdCardAreaIcon,
  AdCardRoomsIcon,
  AdCardYearIcon,
} from "../../../components/AdCardIcons";
import { RouteLink } from "../../../routes/RouteLink";
import type { SearchMapListing, SearchMapListingId } from "../searchMapData";
import { SEARCH_MAP_DEMO_PHOTO } from "../searchMapData";

type SearchMapListingSliderProps = {
  isLoading?: boolean;
  isOpen: boolean;
  listings: SearchMapListing[];
  selectedListingId: SearchMapListingId | null;
  onActiveListingChange?: (listing: SearchMapListing) => void;
};

export function SearchMapListingSlider({
  isLoading = false,
  isOpen,
  listings,
  selectedListingId,
  onActiveListingChange,
}: SearchMapListingSliderProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const dragScrollHandlers = useDragScroll(scrollRef);

  const syncActiveCardFromScroll = useCallback(() => {
    if (!isOpen || isLoading) return;

    const scrollEl = scrollRef.current;
    if (!scrollEl) return;

    const cards = Array.from(
      scrollEl.querySelectorAll<HTMLElement>("[data-map-slider-card]"),
    );

    if (cards.length === 0) return;

    const scrollRect = scrollEl.getBoundingClientRect();
    const scrollCenter = scrollRect.left + scrollRect.width / 2;
    const activeCard = cards.reduce((closest, card) => {
      const closestRect = closest.getBoundingClientRect();
      const cardRect = card.getBoundingClientRect();
      const closestDistance = Math.abs(
        closestRect.left + closestRect.width / 2 - scrollCenter,
      );
      const cardDistance = Math.abs(cardRect.left + cardRect.width / 2 - scrollCenter);

      return cardDistance < closestDistance ? card : closest;
    });
    const activeId = activeCard.dataset.mapSliderCard;
    const activeListing = listings.find((listing) => String(listing.id) === activeId);

    if (activeListing) {
      onActiveListingChange?.(activeListing);
    }
  }, [isLoading, isOpen, listings, onActiveListingChange]);

  useEffect(() => {
    if (!isOpen) return;

    const scrollEl = scrollRef.current;
    if (!scrollEl) return;

    let frameId = 0;
    const handleScroll = () => {
      window.cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(syncActiveCardFromScroll);
    };

    scrollEl.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.cancelAnimationFrame(frameId);
      scrollEl.removeEventListener("scroll", handleScroll);
    };
  }, [isOpen, listings.length, syncActiveCardFromScroll]);

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
      className={`absolute inset-x-0 bottom-4 z-500 bg-transparent transition duration-200 ${
        isOpen
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-8 opacity-0"
      }`}
      aria-label="آگهی‌های روی نقشه"
      dir="rtl"
    >
      <div
        ref={scrollRef}
        className="flex cursor-grab select-none snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain bg-transparent px-4 pb-0 pt-1 touch-pan-x scrollbar-none [scroll-padding-inline:16px] [-ms-overflow-style:none] active:cursor-grabbing [&::-webkit-scrollbar]:hidden"
        {...dragScrollHandlers}
      >
        {isLoading
          ? Array.from({ length: 2 }).map((_, index) => (
              <MapAdCardSkeleton key={index} />
            ))
          : listings.map((listing) => (
              <MapAdCard
                key={listing.id}
                listing={listing}
                isSelected={String(listing.id) === String(selectedListingId)}
              />
            ))}
      </div>
    </section>
  );
}

function mapCardPriceDisplay(priceValue: string) {
  return priceValue.replace(/[٫.]/g, "/");
}

function toFaCount(n: number) {
  return String(Math.max(1, n)).replace(/\d/g, (digit) => "۰۱۲۳۴۵۶۷۸۹"[Number(digit)] ?? digit);
}

function MapAdCard({
  listing,
  isSelected,
}: {
  listing: SearchMapListing;
  isSelected: boolean;
}) {
  const images = listing.images?.length > 0 ? listing.images : [SEARCH_MAP_DEMO_PHOTO];
  const previewImages = images.length > 1 ? images.slice(0, 2) : [images[0]];

  return (
    <RouteLink
      data-map-slider-card={String(listing.id)}
      aria-current={isSelected ? "true" : undefined}
      aria-label={`مشاهده آگهی ${listing.title}`}
      className={`block w-[calc(100%_-_32px)] min-w-[260px] max-w-[360px] shrink-0 snap-center overflow-hidden rounded-2xl bg-white p-3 text-right text-inherit no-underline transition-shadow [direction:rtl] ${
        isSelected
          ? "shadow-[0_0_0_2px_rgba(0,72,196,0.18),0_10px_28px_rgba(26,26,26,0.12)]"
          : "shadow-[0_8px_24px_rgba(26,26,26,0.08)]"
      }`}
      to={`/public/advertise/${listing.id}`}
      dir="rtl"
    >
      <div className="relative grid h-[58px] grid-cols-[repeat(auto-fit,minmax(0,1fr))] gap-2 overflow-hidden rounded-xl">
        {previewImages.map((src, imageIndex) => (
          <img
            key={`${src}-${imageIndex}`}
            className="h-[58px] min-w-0 rounded-xl object-cover"
            src={src}
            alt=""
            draggable={false}
            loading={imageIndex === 0 ? "eager" : "lazy"}
            onError={(event) => {
              const target = event.currentTarget;

              if (target.dataset.fallback === "1") return;

              target.dataset.fallback = "1";
              target.src = SEARCH_MAP_DEMO_PHOTO;
            }}
          />
        ))}

        <div className="absolute right-2 top-2 z-2 inline-flex h-6 items-center gap-1 rounded-lg bg-[#1a1a1a99] px-1.5 text-xs font-medium leading-4 text-[#fafafa]">
          <AdCardAlbumIcon className="h-4 w-4 shrink-0" />
          <span>{toFaCount(images.length)}</span>
        </div>
      </div>

      <div className="mt-2 flex min-h-5 items-center justify-start gap-1 [direction:rtl]">
        {listing.priceLabel ? (
          <span className="text-xs font-medium leading-5 text-[#808080]">
            {listing.priceLabel}:
          </span>
        ) : null}
        <strong className="truncate text-sm font-semibold leading-5 text-[#0048c4]">
          {mapCardPriceDisplay(listing.priceValue)}
        </strong>
      </div>

      <div className="mt-1 flex min-h-5 items-center justify-start gap-3 overflow-hidden text-xs font-medium leading-5 text-[#1a1a1a] [direction:rtl]">
        <PropertyMeta icon={<AdCardAreaIcon className="h-4 w-4" />} label={listing.area} />
        <PropertyMeta icon={<AdCardRoomsIcon className="h-4 w-4" />} label={listing.rooms} />
        <PropertyMeta icon={<AdCardYearIcon className="h-4 w-4" />} label={listing.year} />
      </div>

      <h3 className="mt-1 truncate text-right text-xs font-medium leading-5 text-[#1a1a1a]">
        {listing.title}
      </h3>
    </RouteLink>
  );
}

function MapAdCardSkeleton() {
  return (
    <article className="w-[calc(100%_-_32px)] min-w-[260px] max-w-[360px] shrink-0 snap-center overflow-hidden rounded-2xl bg-white p-3 shadow-[0_8px_24px_rgba(26,26,26,0.08)]">
      <div className="h-[58px] rounded-xl bg-[#f0f0f0]" />
      <div className="mt-2 h-5 w-32 rounded-full bg-[#f0f0f0]" />
      <div className="mt-2 flex items-center gap-3">
        <div className="h-4 w-14 rounded-full bg-[#f0f0f0]" />
        <div className="h-4 w-14 rounded-full bg-[#f0f0f0]" />
        <div className="h-4 w-14 rounded-full bg-[#f0f0f0]" />
      </div>
      <div className="mt-2 h-4 w-full rounded-full bg-[#f0f0f0]" />
    </article>
  );
}

function useDragScroll(scrollRef: RefObject<HTMLDivElement | null>) {
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
    onClickCapture(event: ReactMouseEvent<HTMLDivElement>) {
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
  icon,
  label,
}: {
  icon: ReactNode;
  label: string;
}) {
  return (
    <span className="inline-flex min-w-0 items-center gap-1 whitespace-nowrap text-[#4d4d4d]">
      {icon}
      <span className="truncate text-[#1a1a1a]">{label}</span>
    </span>
  );
}
