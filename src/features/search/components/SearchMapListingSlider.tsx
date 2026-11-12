import {
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
} from "react";

import { AdCardSkeleton } from "../../advertisements/components/AdCardSkeleton";
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

function scrollCardToCenter(
  scrollEl: HTMLElement,
  card: HTMLElement,
  behavior: ScrollBehavior = "auto",
) {
  const scrollRect = scrollEl.getBoundingClientRect();
  const cardRect = card.getBoundingClientRect();
  const currentCenter = cardRect.left + cardRect.width / 2;
  const targetCenter = scrollRect.left + scrollRect.width / 2;
  const diff = currentCenter - targetCenter;

  if (Math.abs(diff) > 1) {
    scrollEl.scrollBy({
      left: diff,
      behavior,
    });
  }
}

function SearchMapListingSliderComponent({
  isLoading = false,
  isOpen,
  listings,
  onActiveListingChange,
  selectedListingId,
}: SearchMapListingSliderProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isProgrammaticScrollRef = useRef(false);
  const isUserInteractingRef = useRef(false);
  const pendingSmoothScrollIdRef = useRef<string | null>(null);
  const programmaticScrollTimerRef = useRef<number | null>(null);
  const userScrollSettledTimerRef = useRef<number | null>(null);
  const lastActiveIdRef = useRef<SearchMapListingId | null>(selectedListingId);

  const markUserInteraction = useCallback(() => {
    isProgrammaticScrollRef.current = false;
    isUserInteractingRef.current = true;
  }, []);

  const dragScrollHandlers = useDragScroll(scrollRef, markUserInteraction);

  const syncActiveCard = useCallback(() => {
    if (!isOpen || isProgrammaticScrollRef.current) return;

    const scrollEl = scrollRef.current;
    if (!scrollEl || listings.length === 0) return;

    const activeId = findCenteredCardId(scrollEl);
    if (activeId == null || String(activeId) === String(lastActiveIdRef.current)) {
      return;
    }

    const activeListing = listings.find((listing) => String(listing.id) === String(activeId));

    if (!activeListing) return;

    lastActiveIdRef.current = activeListing.id;
    onActiveListingChange?.(activeListing);
  }, [isOpen, listings, onActiveListingChange]);

  const handleScroll = useCallback(() => {
    if (isProgrammaticScrollRef.current) return;
    if (!isUserInteractingRef.current) return;

    if (userScrollSettledTimerRef.current !== null) {
      window.clearTimeout(userScrollSettledTimerRef.current);
    }

    userScrollSettledTimerRef.current = window.setTimeout(() => {
      syncActiveCard();
      isUserInteractingRef.current = false;
      userScrollSettledTimerRef.current = null;
    }, 120);
  }, [syncActiveCard]);

  useLayoutEffect(() => {
    if (!isOpen || selectedListingId == null) return;

    const scrollEl = scrollRef.current;
    if (!scrollEl) return;

    const card = getSliderCardById(scrollEl, selectedListingId);
    if (!card) return;

    const isSmoothFromCardClick =
      pendingSmoothScrollIdRef.current === String(selectedListingId);
    pendingSmoothScrollIdRef.current = null;

    lastActiveIdRef.current = selectedListingId;
    isProgrammaticScrollRef.current = true;
    isUserInteractingRef.current = false;

    if (programmaticScrollTimerRef.current !== null) {
      window.clearTimeout(programmaticScrollTimerRef.current);
    }

    if (!isSmoothFromCardClick) {
      scrollCardToCenter(scrollEl, card, "auto");
    }

    const frameId = isSmoothFromCardClick
      ? null
      : window.requestAnimationFrame(() => {
          const activeCard = getSliderCardById(scrollEl, selectedListingId);
          if (activeCard) {
            scrollCardToCenter(scrollEl, activeCard, "auto");
          }
        });

    programmaticScrollTimerRef.current = window.setTimeout(() => {
      isProgrammaticScrollRef.current = false;
      programmaticScrollTimerRef.current = null;
    }, isSmoothFromCardClick ? 450 : 300);

    return () => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, [isOpen, selectedListingId, listings]);

  const handleSliderClick = useCallback(
    (event: ReactMouseEvent<HTMLDivElement>) => {
      const scrollEl = scrollRef.current;
      if (!scrollEl) return;

      const target = event.target;
      if (!(target instanceof Element)) return;

      const card = target.closest<HTMLElement>("[data-map-slider-card]");
      if (!card) return;

      const clickedId = card.dataset.mapSliderCard;
      if (!clickedId) return;

      const activeId =
        selectedListingId != null ? String(selectedListingId) : findCenteredCardId(scrollEl);

      // Clicking the centered/active card allows its Link to open the listing.
      if (activeId != null && clickedId === activeId) {
        return;
      }

      event.preventDefault();

      const clickedListing = listings.find((listing) => String(listing.id) === clickedId);
      if (!clickedListing) return;

      if (programmaticScrollTimerRef.current !== null) {
        window.clearTimeout(programmaticScrollTimerRef.current);
      }

      pendingSmoothScrollIdRef.current = clickedId;
      lastActiveIdRef.current = clickedListing.id;
      isProgrammaticScrollRef.current = true;
      isUserInteractingRef.current = false;

      scrollCardToCenter(scrollEl, card, "smooth");
      onActiveListingChange?.(clickedListing);

      programmaticScrollTimerRef.current = window.setTimeout(() => {
        isProgrammaticScrollRef.current = false;
        programmaticScrollTimerRef.current = null;
      }, 450);
    },
    [listings, onActiveListingChange, selectedListingId],
  );

  const handleClickCapture = useCallback(
    (event: ReactMouseEvent<HTMLDivElement>) => {
      dragScrollHandlers.onClickCapture(event);
      if (event.defaultPrevented) return;
      handleSliderClick(event);
    },
    [dragScrollHandlers, handleSliderClick],
  );

  useEffect(() => {
    lastActiveIdRef.current = selectedListingId;
  }, [selectedListingId]);

  useEffect(() => {
    return () => {
      if (programmaticScrollTimerRef.current !== null) {
        window.clearTimeout(programmaticScrollTimerRef.current);
      }
      if (userScrollSettledTimerRef.current !== null) {
        window.clearTimeout(userScrollSettledTimerRef.current);
      }
    };
  }, []);

  return (
    <section
      className={`absolute inset-x-0 bottom-3 z-[500] bg-transparent ${
        isOpen ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-8 opacity-0"
      }`}
      aria-label="آگهی‌های روی نقشه"
      dir="rtl"
    >
      <div
        ref={scrollRef}
        className="flex h-[216px] cursor-grab touch-pan-x snap-x snap-mandatory scrollbar-none gap-3 overflow-x-auto overscroll-x-contain bg-transparent py-0 select-none [-ms-overflow-style:none] active:cursor-grabbing [&::-webkit-scrollbar]:hidden"
        style={{
          paddingInline: `max(8px, calc((100% - ${previewCardWidth}) / 2))`,
          scrollPaddingInline: `max(8px, calc((100% - ${previewCardWidth}) / 2))`,
        }}
        onTouchStart={markUserInteraction}
        onWheel={markUserInteraction}
        onScroll={handleScroll}
        {...dragScrollHandlers}
        onClickCapture={handleClickCapture}
      >
        {isLoading
          ? Array.from({ length: 2 }).map((_, index) => (
              <AdCardSkeleton key={index} className="mx-0 snap-center" variant="mapPreview" />
            ))
          : listings.map((listing) => (
              <SearchMapPreviewCard
                key={listing.id}
                listing={listing}
                isSelected={
                  selectedListingId != null && String(listing.id) === String(selectedListingId)
                }
              />
            ))}
      </div>
    </section>
  );
}

export const SearchMapListingSlider = memo(SearchMapListingSliderComponent);

function getSliderCardById(scrollEl: HTMLDivElement, listingId: SearchMapListingId) {
  return Array.from(scrollEl.querySelectorAll<HTMLElement>("[data-map-slider-card]")).find(
    (candidate) => candidate.dataset.mapSliderCard === String(listingId),
  );
}

function findCenteredCardId(scrollEl: HTMLDivElement) {
  const cards = Array.from(scrollEl.querySelectorAll<HTMLElement>("[data-map-slider-card]"));

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

function useDragScroll(scrollRef: RefObject<HTMLDivElement | null>, onDragStart?: () => void) {
  const dragStateRef = useRef({
    didDrag: false,
    hasCaptured: false,
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
    if (state.hasCaptured) {
      state.hasCaptured = false;
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
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

      onDragStart?.();

      dragStateRef.current = {
        didDrag: false,
        hasCaptured: false,
        isDragging: true,
        pointerId: event.pointerId,
        startScrollLeft: scrollEl.scrollLeft,
        startX: event.clientX,
      };
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
        if (!state.hasCaptured) {
          state.hasCaptured = true;
          event.currentTarget.setPointerCapture(event.pointerId);
        }
        event.preventDefault();
      }

      const isRtl = getComputedStyle(scrollEl).direction === "rtl";
      scrollEl.scrollLeft = isRtl ? state.startScrollLeft + deltaX : state.startScrollLeft - deltaX;
    },
    onPointerUp: endDrag,
  };
}
