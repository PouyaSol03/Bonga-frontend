import {
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
} from "react";

import { AdCardSkeleton } from "../../../components/AdCardSkeleton";
import type { SearchMapListing, SearchMapListingId } from "../searchMapData";
import { SearchMapPreviewCard } from "./SearchMapPreviewCard";

type SearchMapListingSliderProps = {
  isLoading?: boolean;
  isOpen: boolean;
  listings: SearchMapListing[];
  onActiveListingChange?: (listing: SearchMapListing) => void;
  selectedListingId: SearchMapListingId | null;
};

const previewCardWidth = "min(360px, calc(100vw - 28px))";

export function SearchMapListingSlider({
  isLoading = false,
  isOpen,
  listings,
  onActiveListingChange,
  selectedListingId,
}: SearchMapListingSliderProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const dragScrollHandlers = useDragScroll(scrollRef);
  const lastActiveIdRef = useRef<SearchMapListingId | null>(selectedListingId);
  const scrollSyncedActiveIdRef = useRef<SearchMapListingId | null>(null);

  const syncActiveCard = useCallback(() => {
    if (!isOpen) return;

    const scrollEl = scrollRef.current;
    if (!scrollEl || listings.length === 0) return;

    const activeId = findCenteredCardId(scrollEl);
    if (activeId == null || String(activeId) === String(lastActiveIdRef.current)) {
      return;
    }

    const activeListing = listings.find(
      (listing) => String(listing.id) === String(activeId),
    );

    if (!activeListing) return;

    lastActiveIdRef.current = activeListing.id;
    scrollSyncedActiveIdRef.current = activeListing.id;
    onActiveListingChange?.(activeListing);
  }, [isOpen, listings, onActiveListingChange]);

  const scheduleActiveSync = useCallback(() => {
    if (rafRef.current !== null) return;

    rafRef.current = window.requestAnimationFrame(() => {
      rafRef.current = null;
      syncActiveCard();
    });
  }, [syncActiveCard]);

  useLayoutEffect(() => {
    if (!isOpen || selectedListingId == null) return;

    if (String(scrollSyncedActiveIdRef.current) === String(selectedListingId)) {
      scrollSyncedActiveIdRef.current = null;
      return;
    }

    const scrollEl = scrollRef.current;
    if (!scrollEl) return;

    const card = getSliderCardById(scrollEl, selectedListingId);
    if (!card) return;

    lastActiveIdRef.current = selectedListingId;

    card.scrollIntoView({
      behavior: "auto",
      block: "nearest",
      inline: "center",
    });
  }, [isOpen, selectedListingId, listings]);

  useEffect(() => {
    lastActiveIdRef.current = selectedListingId;
  }, [selectedListingId]);

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return (
    <section
      className={`absolute inset-x-0 bottom-3 z-500 bg-transparent ${
        isOpen
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-8 opacity-0"
      }`}
      aria-label="آگهی‌های روی نقشه"
      dir="rtl"
    >
      <div
        ref={scrollRef}
        className="flex h-[216px] cursor-grab select-none snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain bg-transparent py-0 touch-pan-x scrollbar-none [-ms-overflow-style:none] active:cursor-grabbing [&::-webkit-scrollbar]:hidden"
        style={{
          paddingInline: `max(8px, calc((100% - ${previewCardWidth}) / 2))`,
          scrollPaddingInline: `max(8px, calc((100% - ${previewCardWidth}) / 2))`,
        }}
        onScroll={scheduleActiveSync}
        {...dragScrollHandlers}
      >
        {isLoading
          ? Array.from({ length: 2 }).map((_, index) => (
              <AdCardSkeleton
                key={index}
                className="mx-0 h-[216px] w-[min(360px,calc(100vw-28px))] shrink-0 snap-center"
              />
            ))
          : listings.map((listing) => (
              <SearchMapPreviewCard
                key={listing.id}
                listing={listing}
                isSelected={
                  selectedListingId != null &&
                  String(listing.id) === String(selectedListingId)
                }
              />
            ))}
      </div>
    </section>
  );
}

function getSliderCardById(
  scrollEl: HTMLDivElement,
  listingId: SearchMapListingId,
) {
  return Array.from(
    scrollEl.querySelectorAll<HTMLElement>("[data-map-slider-card]"),
  ).find(
    (candidate) => candidate.dataset.mapSliderCard === String(listingId),
  );
}

function findCenteredCardId(scrollEl: HTMLDivElement) {
  const cards = Array.from(
    scrollEl.querySelectorAll<HTMLElement>("[data-map-slider-card]"),
  );

  if (cards.length === 0) return null;

  const scrollRect = scrollEl.getBoundingClientRect();
  const viewportCenter = scrollRect.left + scrollRect.width / 2;
  let nearestCard = cards[0];
  let nearestDistance = Number.POSITIVE_INFINITY;

  cards.forEach((card) => {
    const cardRect = card.getBoundingClientRect();
    const cardCenter = cardRect.left + cardRect.width / 2;
    const distance = Math.abs(cardCenter - viewportCenter);

    if (distance < nearestDistance) {
      nearestCard = card;
      nearestDistance = distance;
    }
  });

  return nearestCard.dataset.mapSliderCard ?? null;
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
