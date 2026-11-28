import { useCallback, useEffect, useRef, type UIEvent } from "react";
import LinearMapsLocation from "../../../shared/icons/LinearMapsLocation";
import { AdCard, type AdCardData } from "../../advertisements/components/AdCard";
import { AdCardSkeleton } from "../../advertisements/components/AdCardSkeleton";
import { SearchNoResultsRequestCard } from "./SearchNoResultsRequestCard";
import type { SearchMapListing } from "../searchMapData";
import { Typography } from "../../../shared/ui/Typography";
import { Button } from "../../../shared/ui/Button";
import { toPersianDigits } from "../../../shared/lib/numberUtils";

type SearchMapListViewProps = {
  hasEmptyResults?: boolean;
  hasNextPage?: boolean;
  isFetchNextPageError?: boolean;
  isFetchingNextPage?: boolean;
  isLoading?: boolean;
  listings: SearchMapListing[];
  onFetchNextPage?: () => void;
  onMapClick: () => void;
  onRequestSubmit?: (title: string) => void;
};

function toFaCount(n: number): string {
  return toPersianDigits(Math.max(0, Math.floor(n)));
}

function searchMapListingToAdCardData(listing: SearchMapListing): AdCardData {
  if (listing.adCard) return listing.adCard;

  const imageCount = listing.images?.length ?? 0;

  return {
    id: listing.id,
    agency: listing.agencyName,
    status: "",
    imageCount: toFaCount(imageCount),
    priceLabelPrimary: listing.priceLabel || "",
    pricePrimary: listing.priceValue.replace(/[٫.]/g, "/"),
    priceLabelSecondary: listing.priceSecondary ? "رهن:" : "",
    priceSecondary: listing.priceSecondary ? listing.priceSecondary.replace(/[٫.]/g, "/") : "",
    area: listing.area,
    rooms: listing.rooms,
    year: listing.year,
    landArea: listing.landArea,
    documentType: listing.documentType,
    commercialPosition: listing.commercialPosition,
    landPosition: listing.landPosition,
    floor: listing.floor,
    buildingArea: listing.buildingArea,
    capacity: listing.capacity,
    stars: listing.stars,
    rentalPeriod: listing.rentalPeriod,
    category: listing.category,
    formCode: listing.formCode,
    projectType: listing.projectType,
    totalFloors: listing.totalFloors,
    totalUnits: listing.totalUnits,
    builderShare: listing.builderShare,
    currentStatus: listing.currentStatus,
    title: listing.title,
    timeAndLocation:
      listing.postedAt || (listing.locationLabel ? `در ${listing.locationLabel}` : ""),
    imageClassName: listing.imageClassName ?? "",
    imageUrl: listing.imageSrc,
    badges: listing.badges ?? [],
  };
}

export function SearchMapListView({
  hasEmptyResults = false,
  hasNextPage = false,
  isFetchNextPageError = false,
  isFetchingNextPage = false,
  isLoading = false,
  listings,
  onFetchNextPage,
  onMapClick,
  onRequestSubmit,
}: SearchMapListViewProps) {
  const scrollContainerRef = useRef<HTMLElement | null>(null);
  const prefetchObserverRef = useRef<IntersectionObserver | null>(null);
  const bottomObserverRef = useRef<IntersectionObserver | null>(null);

  const prefetchIndex = Math.max(0, listings.length - 10);

  const handleFetchNext = useCallback(() => {
    if (!hasNextPage || isFetchingNextPage || isFetchNextPageError || !onFetchNextPage) return;
    onFetchNextPage();
  }, [hasNextPage, isFetchNextPageError, isFetchingNextPage, onFetchNextPage]);

  const prefetchTriggerRef = useCallback(
    (node: HTMLDivElement | null) => {
      prefetchObserverRef.current?.disconnect();
      prefetchObserverRef.current = null;
      if (!node || !hasNextPage || isFetchingNextPage || isFetchNextPageError) return;

      if (typeof IntersectionObserver === "undefined") return;

      const observer = new IntersectionObserver(
        (entries) => {
          if (
            entries[0]?.isIntersecting &&
            hasNextPage &&
            !isFetchingNextPage &&
            !isFetchNextPageError
          ) {
            handleFetchNext();
          }
        },
        { root: null, rootMargin: "350px 0px", threshold: 0 },
      );
      observer.observe(node);
      prefetchObserverRef.current = observer;
    },
    [handleFetchNext, hasNextPage, isFetchNextPageError, isFetchingNextPage],
  );

  const bottomSentinelRef = useCallback(
    (node: HTMLDivElement | null) => {
      bottomObserverRef.current?.disconnect();
      bottomObserverRef.current = null;
      if (!node || !hasNextPage || isFetchingNextPage || isFetchNextPageError) return;

      if (typeof IntersectionObserver === "undefined") return;

      const observer = new IntersectionObserver(
        (entries) => {
          if (
            entries[0]?.isIntersecting &&
            hasNextPage &&
            !isFetchingNextPage &&
            !isFetchNextPageError
          ) {
            handleFetchNext();
          }
        },
        { root: null, rootMargin: "400px 0px", threshold: 0 },
      );
      observer.observe(node);
      bottomObserverRef.current = observer;
    },
    [handleFetchNext, hasNextPage, isFetchNextPageError, isFetchingNextPage],
  );

  useEffect(() => {
    return () => {
      prefetchObserverRef.current?.disconnect();
      bottomObserverRef.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    if (isLoading || listings.length === 0) return;

    const storageKey = `bonga_search_list_scroll_${window.location.search}`;
    const fallbackKey = "bonga_search_list_scroll";
    const saved =
      sessionStorage.getItem(storageKey) || sessionStorage.getItem(fallbackKey);
    if (!saved) return;

    const targetY = Number(saved);
    if (!Number.isFinite(targetY) || targetY <= 0) return;

    const el = scrollContainerRef.current;
    if (!el) return;

    el.scrollTop = targetY;

    const rafId = requestAnimationFrame(() => {
      if (scrollContainerRef.current && scrollContainerRef.current.scrollTop !== targetY) {
        scrollContainerRef.current.scrollTop = targetY;
      }
    });

    const timerId = setTimeout(() => {
      if (scrollContainerRef.current && scrollContainerRef.current.scrollTop !== targetY) {
        scrollContainerRef.current.scrollTop = targetY;
      }
    }, 80);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timerId);
    };
  }, [isLoading, listings.length]);

  useEffect(() => {
    const containerEl = scrollContainerRef.current;
    return () => {
      if (containerEl) {
        const top = containerEl.scrollTop;
        sessionStorage.setItem(`bonga_search_list_scroll_${window.location.search}`, String(top));
        sessionStorage.setItem("bonga_search_list_scroll", String(top));
      }
    };
  }, []);

  const handleScroll = useCallback(
    (e: UIEvent<HTMLElement>) => {
      const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
      sessionStorage.setItem(`bonga_search_list_scroll_${window.location.search}`, String(scrollTop));
      sessionStorage.setItem("bonga_search_list_scroll", String(scrollTop));

      if (!hasNextPage || isFetchingNextPage || isFetchNextPageError) return;
      if (scrollHeight - (scrollTop + clientHeight) <= 600) {
        handleFetchNext();
      }
    },
    [handleFetchNext, hasNextPage, isFetchNextPageError, isFetchingNextPage],
  );

  return (
    <>
      <main
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="bg-surface-container absolute inset-0 z-0 flex min-h-0 flex-col overflow-y-auto overscroll-contain pt-[60px] pb-20"
        aria-label="لیست آگهی‌ها"
        dir="rtl"
      >
        <div
          className={`flex min-h-full flex-col ${hasEmptyResults ? "bg-surface-container-lowest" : "bg-surface-container"}`}
        >
          {isLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <AdCardSkeleton
                className="border-surface-container shrink-0 border-b-[12px] last:border-b-0"
                key={index}
              />
            ))
          ) : hasEmptyResults ? (
            <div className="bg-surface-container-lowest flex flex-1 flex-col pt-3">
              <SearchNoResultsRequestCard className="mx-4" onSubmit={onRequestSubmit} />
            </div>
          ) : (
            <>
              {listings.map((listing, index) => {
                const isPrefetchTrigger = hasNextPage && index === prefetchIndex;
                return (
                  <div
                    key={`${listing.id}-${index}`}
                    ref={isPrefetchTrigger ? prefetchTriggerRef : undefined}
                    className="border-surface-container shrink-0 border-b-[12px] last:border-b-0"
                  >
                    <AdCard
                      ad={listing.adCard ?? searchMapListingToAdCardData(listing)}
                      to={`/ads/${listing.id}`}
                    />
                  </div>
                );
              })}
              {isFetchingNextPage ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <AdCardSkeleton
                    className="border-surface-container shrink-0 border-b-[12px]"
                    key={`loading-more-skeleton-${index}`}
                  />
                ))
              ) : null}
              {isFetchNextPageError && hasNextPage && !isFetchingNextPage ? (
                <div className="bg-surface-container-lowest flex flex-col items-center justify-center gap-2 px-4 py-4 text-center">
                  <Typography as="p" variant="body" size="small" className="text-error">
                    خطا در دریافت آگهی‌های بیشتر
                  </Typography>
                  <Button
                    type="button"
                    variant="secondary"
                    size="small"
                    onClick={() => onFetchNextPage?.()}
                  >
                    تلاش مجدد
                  </Button>
                </div>
              ) : null}
              {hasNextPage && !isFetchNextPageError ? (
                <div
                  ref={bottomSentinelRef}
                  className="h-4 w-full shrink-0"
                  aria-hidden="true"
                />
              ) : null}
            </>
          )}
        </div>
      </main>

      <Button
        unstyled
        className="bg-primary text-on-primary focus-visible:outline-primary/25 absolute bottom-4 left-1/2 z-[520] flex -translate-x-1/2 items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm leading-5 font-bold shadow-[0_10px_26px_rgba(0,72,196,0.24)] focus-visible:outline-[3px] focus-visible:outline-offset-2"
        type="button"
        onClick={onMapClick}
      >
        <LinearMapsLocation className="h-6 w-6" />
        <Typography as="span" variant="label" size="large" weight="medium">
          نقشه
        </Typography>
      </Button>
    </>
  );
}
