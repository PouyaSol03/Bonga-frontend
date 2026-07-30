import { useEffect, useMemo, useState } from "react";

import LinearAdvertisiment from "../../components/(icons)/LinearAdvertisiment";
import LinearDelete from "../../components/(icons)/LinearDelete";
import LinearRefresh from "../../components/(icons)/LinearRefresh";
import { AdCard } from "../../components/AdCard";
import { useAdvertisementListQuery } from "../../hooks/advertisement.hooks";
import { usePropertyRequestMatchesQuery } from "../../hooks/property-request.hooks";
import { mapAdvertisementToAdCard } from "../../services/advertisement.service";
import {
  createPropertyRequestAdvertisementParams,
  type PropertySearchRequest,
} from "../../services/property-request.service";
import { RequestResultImageMeta } from "./RequestResultImageMeta";
import { Typography } from "../../components/ui/Typography";
import { Button } from "../../components/ui/Button";

export type PropertyRequestResultsStatus = {
  isError: boolean;
  isLoading: boolean;
  requestId: string;
  visibleCount: number;
};

type PropertyRequestResultsProps = {
  bare?: boolean;
  className?: string;
  compact?: boolean;
  hideWhenEmpty?: boolean;
  maxResults?: number;
  onStatusChange?: (status: PropertyRequestResultsStatus) => void;
  request: PropertySearchRequest;
  resultSource?: "matches" | "search";
  showDismissAction?: boolean;
  showHeading?: boolean;
};

export function PropertyRequestResults({
  bare = false,
  className = "",
  compact = false,
  hideWhenEmpty = false,
  maxResults = 4,
  onStatusChange,
  request,
  resultSource = "matches",
  showDismissAction = false,
  showHeading = true,
}: PropertyRequestResultsProps) {
  const useMatchesEndpoint = resultSource === "matches";
  const searchParams = useMemo(
    () =>
      useMatchesEndpoint
        ? null
        : createPropertyRequestAdvertisementParams(request, maxResults),
    [maxResults, request, useMatchesEndpoint],
  );
  const searchQuery = useAdvertisementListQuery(searchParams);
  const matchesQuery = usePropertyRequestMatchesQuery(
    request.id,
    1,
    maxResults,
    useMatchesEndpoint,
  );
  const query = useMatchesEndpoint ? matchesQuery : searchQuery;
  const resultItems = useMatchesEndpoint
    ? matchesQuery.data?.data
    : searchQuery.data?.data;
  const ads = useMemo(
    () =>
      (resultItems ?? [])
        .slice(0, maxResults)
        .map((item, index) => mapAdvertisementToAdCard(item, index)),
    [maxResults, resultItems],
  );
  const [dismissedAdIds, setDismissedAdIds] = useState<Set<string>>(
    () => new Set(),
  );
  const visibleAds = useMemo(
    () => ads.filter((ad) => !dismissedAdIds.has(String(ad.id))),
    [ads, dismissedAdIds],
  );

  useEffect(() => {
    onStatusChange?.({
      isError: query.isError,
      isLoading: query.isLoading,
      requestId: request.id,
      visibleCount: visibleAds.length,
    });
  }, [onStatusChange, query.isError, query.isLoading, request.id, visibleAds.length]);

  if (hideWhenEmpty && !query.isLoading && !query.isError && visibleAds.length === 0) {
    return null;
  }

  return (
    <section
      className={`${bare ? "" : compact ? "border-t border-[#eeeeee] pt-3" : "rounded-2xl border border-[#e8e8e8] bg-white p-4"} ${className}`}
      aria-label={`نتایج درخواست ${request.title}`}
    >
      {showHeading ? (
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2 text-[#303030]">
            <LinearAdvertisiment className="h-5 w-5 shrink-0 text-[#0048c4]" />
            <Typography as="h2" variant="title" size="small" weight="semibold" className="m-0 truncate text-sm font-bold">نتیجه درخواست</Typography>
          </div>

          {!query.isLoading && !query.isError ? (
            <Typography as="span" variant="label" size="small" weight="medium"
              className={`inline-flex h-6 shrink-0 items-center rounded-md px-2 text-[11px] font-medium ${
                visibleAds.length
                  ? "bg-[#e6f8ef] text-[#079455]"
                  : "bg-[#f1f1f1] text-[#808080]"
              }`}
            >
              {visibleAds.length ? "نتیجه یافت شد" : "بدون نتیجه"}
            </Typography>
          ) : null}
        </div>
      ) : null}

      {query.isLoading ? (
        <div className="mt-3 space-y-2" aria-live="polite">
          <div className="h-4 w-36 animate-pulse rounded bg-[#eeeeee]" />
          <div className="h-28 animate-pulse rounded-2xl bg-[#f1f1f1]" />
        </div>
      ) : null}

      {query.isError ? (
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[#fff4f3] px-3 py-3 text-sm text-[#b42318]">
          <Typography as="span" variant="body" size="medium" weight="regular">بررسی نتیجه این درخواست با خطا مواجه شد.</Typography>
          <Button unstyled
            className="inline-flex h-8 items-center gap-1 rounded-lg border border-[#f3b8b3] bg-white px-2 text-xs font-semibold transition hover:bg-[#fff8f7]"
            onClick={() => void query.refetch()}
            type="button"
          >
            <LinearRefresh className="h-4 w-4" />
            تلاش دوباره
          </Button>
        </div>
      ) : null}

      {!query.isLoading && !query.isError && visibleAds.length === 0 ? (
        <Typography as="p" variant="body" size="medium" weight="medium" className="m-0 mt-3 rounded-xl bg-[#f7f7f7] px-4 py-4 text-center text-sm font-medium leading-6 text-[#808080]">
          نتیجه ای برای این درخواست وجود ندارد
        </Typography>
      ) : null}

      {!query.isLoading && !query.isError && visibleAds.length > 0 ? (
        <div
          className={`${showHeading ? "mt-3" : ""} grid gap-2 bg-[#f5f5f5] ${
            compact
              ? "grid-cols-1"
              : "grid-cols-1 xl:grid-cols-2"
          }`}
        >
          {visibleAds.map((ad) => (
            <AdCard
              ad={ad}
              className="overflow-hidden bg-white"
              imageAction={
                showDismissAction ? (
                  <Button unstyled
                    aria-label={`حذف ${ad.title} از نتایج`}
                    className="absolute left-2 top-2 z-3 grid h-9 w-9 place-items-center rounded-lg bg-white text-[#4d4d4d] shadow-[0_4px_14px_rgba(0,0,0,0.14)] focus-visible:outline-3 focus-visible:outline-offset-[-3px] focus-visible:outline-[#0048c440] active:bg-[#f5f5f5]"
                    onClick={() =>
                      setDismissedAdIds((current) => {
                        const next = new Set(current);
                        next.add(String(ad.id));
                        return next;
                      })
                    }
                    type="button"
                  >
                    <LinearDelete className="h-5 w-5" />
                  </Button>
                ) : undefined
              }
              imageMeta={<RequestResultImageMeta imageCount={ad.imageCount} />}
              key={ad.id}
              showAgency={false}
              showBadges={false}
              to={`/ads/${ad.id}`}
              variant="requestResult"
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
