import { useCallback, useEffect, useRef } from "react";
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
    if (!hasNextPage || isFetchingNextPage || !onFetchNextPage) return;
    onFetchNextPage();
  }, [hasNextPage, isFetchingNextPage, onFetchNextPage]);

  const prefetchTriggerRef = useCallback(
    (node: HTMLDivElement | null) => {
      prefetchObserverRef.current?.disconnect();
      prefetchObserverRef.current = null;
      if (!node || !hasNextPage || isFetchingNextPage) return;

      if (typeof IntersectionObserver === "undefined") return;

      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
            handleFetchNext();
          }
        },
        { root: null, rootMargin: "350px 0px", threshold: 0 },
      );
      observer.observe(node);
      prefetchObserverRef.current = observer;
    },
    [handleFetchNext, hasNextPage, isFetchingNextPage],
  );

  const bottomSentinelRef = useCallback(
    (node: HTMLDivElement | null) => {
      bottomObserverRef.current?.disconnect();
      bottomObserverRef.current = null;
      if (!node || !hasNextPage || isFetchingNextPage) return;

      if (typeof IntersectionObserver === "undefined") return;

      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
            handleFetchNext();
          }
        },
        { root: null, rootMargin: "400px 0px", threshold: 0 },
      );
      observer.observe(node);
      bottomObserverRef.current = observer;
    },
    [handleFetchNext, hasNextPage, isFetchingNextPage],
  );

  useEffect(() => {
    return () => {
      prefetchObserverRef.current?.disconnect();
      bottomObserverRef.current?.disconnect();
    };
  }, []);

  const handleScroll = useCallback(() => {
    if (!hasNextPage || isFetchingNextPage) return;

    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    if (scrollHeight - (scrollTop + clientHeight) <= 600) {
      handleFetchNext();
    }
  }, [handleFetchNext, hasNextPage, isFetchingNextPage]);

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
              {hasNextPage ? (
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
