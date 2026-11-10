import { useCallback, useMemo, useRef, useState } from "react";
import { getApiErrorMessage } from "../../../shared/api/api";
import { useToast } from "../../../shared/hooks/useToast";
import { useDeleteAdvertisementMutation } from "../../advertisements/api/advertisement.hooks";
import {
  mapAdvertisementToAdCard,
  type AdvertisementItem,
} from "../../advertisements/api/advertisement.service";
import type { AdCardData } from "../../advertisements/components/AdCard";
import { useMyAdsInfiniteQuery } from "../api/account.hooks";
import type { MyAdsType } from "../api/account.service";
import { getMyAdStatusInfo } from "../myAdsStatus";

export type PersonalAdFilter = {
  label: string;
  type: MyAdsType;
};

export const personalAdFilters: PersonalAdFilter[] = [
  { label: "همه", type: "all" },
  { label: "در انتظار", type: "pending" },
  { label: "فعال", type: "active" },
  { label: "غیر فعال", type: "deactive" },
  { label: "نیمه کاره", type: "incomplete" },
];

function isMatchingPersonalStatus(statusKey: string, filterType: MyAdsType): boolean {
  if (filterType === "all") return true;
  if (filterType === "pending") {
    return (
      statusKey === "pending" ||
      statusKey === "wait_for_payment" ||
      statusKey === "wait_for_agency" ||
      statusKey === "wait_for_repost" ||
      statusKey === "wait_for_stop" ||
      statusKey === "wait_for_deal_confirmation"
    );
  }
  if (filterType === "active") {
    return statusKey === "published" || statusKey === "deal_success";
  }
  if (filterType === "deactive") {
    return (
      statusKey === "expired" ||
      statusKey === "deleted" ||
      statusKey === "deal_unsuccessful" ||
      statusKey === "rejected_by_agency" ||
      statusKey === "archived" ||
      statusKey === "incomplete_deleted"
    );
  }
  if (filterType === "incomplete") {
    return statusKey === "incomplete";
  }
  return true;
}

export function usePersonalMyAds() {
  const [activeFilter, setActiveFilter] = useState<PersonalAdFilter>(personalAdFilters[0]);
  const [deletingAdId, setDeletingAdId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { showToast } = useToast();
  const loadMoreObserverRef = useRef<IntersectionObserver | null>(null);
  const deleteMutation = useDeleteAdvertisementMutation();

  const handleOpenDelete = useCallback((targetAdId: string, event?: React.MouseEvent) => {
    event?.preventDefault();
    event?.stopPropagation();
    setDeletingAdId(targetAdId);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!deletingAdId) return;
    setIsDeleting(true);
    try {
      await deleteMutation.mutateAsync({
        advertiseId: deletingAdId,
        deleteReasonId: "other",
        description: "حذف آگهی نیمه کاره",
      });
      showToast("آگهی با موفقیت حذف شد.", undefined, "success");
      setDeletingAdId(null);
    } catch (err) {
      showToast(getApiErrorMessage(err, "حذف آگهی با خطا مواجه شد."), "خطا", "error");
    } finally {
      setIsDeleting(false);
    }
  }, [deletingAdId, deleteMutation, showToast]);

  const {
    data: adsPages,
    error,
    fetchNextPage,
    hasNextPage,
    isError,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useMyAdsInfiniteQuery({
    type: activeFilter.type,
  });

  const ads = useMemo(() => {
    const rawAds: Array<{ ad: AdvertisementItem; card: AdCardData }> =
      adsPages?.pages.flatMap((page, pageIndex) =>
        page.data.map((ad, adIndex) => ({
          ad,
          card: mapAdvertisementToAdCard(ad, pageIndex * page.perPage + adIndex),
        })),
      ) ?? [];

    if (!activeFilter || activeFilter.type === "all") {
      return rawAds;
    }

    return rawAds.filter(({ ad }) => {
      const statusKey = getMyAdStatusInfo(ad).key;
      return isMatchingPersonalStatus(statusKey, activeFilter.type);
    });
  }, [adsPages, activeFilter]);

  const loadMoreTriggerIndex = Math.max(ads.length - 3, 0);

  const loadMoreSentinelRef = useCallback(
    (node: HTMLDivElement | null) => {
      loadMoreObserverRef.current?.disconnect();
      loadMoreObserverRef.current = null;
      if (!node || !hasNextPage || isFetchingNextPage) return;

      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
            void fetchNextPage();
          }
        },
        { root: null, rootMargin: "240px 0px", threshold: 0 },
      );
      observer.observe(node);
      loadMoreObserverRef.current = observer;
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage],
  );

  return {
    activeFilter,
    ads,
    deletingAdId,
    error,
    handleConfirmDelete,
    handleOpenDelete,
    isDeleting,
    isError,
    isFetchingNextPage,
    isLoading,
    loadMoreSentinelRef,
    loadMoreTriggerIndex,
    refetch,
    setActiveFilter,
    setDeletingAdId,
    hasNextPage,
  };
}
