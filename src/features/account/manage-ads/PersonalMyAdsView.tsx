import { Link, useNavigate } from "react-router";
import { getApiErrorMessage } from "../../../shared/api/api";
import { AdCard, type AdCardData } from "../../advertisements/components/AdCard";
import { AdCardSkeleton } from "../../advertisements/components/AdCardSkeleton";
import {
  AccountMyAdsEmptyState,
  AccountPageShell,
  AccountRetryState,
} from "../accountPageViews";
import {
  adManagementPaths,
  getAdEditPath,
} from "../adManagement/adManagementData";
import { DeleteAdBottomSheet } from "../components/DeleteAdBottomSheet";
import { getMyAdStatusInfo } from "../myAdsStatus";
import { PersonalAdFilterTabs } from "./PersonalAdFilterTabs";
import { personalAdFilters, usePersonalMyAds } from "./usePersonalMyAds";

export function PersonalMyAdsView({ emptyMode = "compact" }: { emptyMode?: "compact" | "full" }) {
  const {
    activeFilter,
    ads,
    deletingAdId,
    error,
    handleConfirmDelete,
    handleOpenDelete,
    hasNextPage,
    isDeleting,
    isError,
    isFetchingNextPage,
    isLoading,
    loadMoreSentinelRef,
    loadMoreTriggerIndex,
    refetch,
    setActiveFilter,
    setDeletingAdId,
  } = usePersonalMyAds();

  const navigate = useNavigate();
  const hasAds = ads.length > 0;
  const showEmptyState = !isLoading && !isError && !hasAds;

  return (
    <AccountPageShell
      action={<Link className="text-on-surface grid h-12 w-12 place-items-center" to="/search" />}
      onBack={() => navigate("/account", { replace: true })}
      title="آگهی‌های من"
    >
      <main
        className={`flex min-h-0 flex-1 flex-col overflow-x-hidden overflow-y-auto ${
          showEmptyState ? "bg-surface-container-lowest" : "bg-surface-container"
        }`}
      >
        <PersonalAdFilterTabs
          activeFilter={activeFilter}
          filters={personalAdFilters}
          onSelect={setActiveFilter}
        />

        <div
          className={`${
            showEmptyState
              ? "bg-surface-container-lowest flex min-h-0 flex-1 flex-col"
              : "bg-surface-container space-y-2"
          }`}
        >
          {isLoading ? (
            <>
              {Array.from({ length: 3 }).map((_, index) => (
                <AdCardSkeleton key={index} />
              ))}
            </>
          ) : null}

          {isError ? (
            <AccountRetryState
              error={error}
              message={getApiErrorMessage(error, "دریافت آگهی‌ها با خطا مواجه شد.")}
              onRetry={() => void refetch()}
            />
          ) : null}

          {!isLoading &&
            !isError &&
            ads.map(({ ad, card }, index) => {
              const shouldAttachLoadMore =
                index === loadMoreTriggerIndex && hasNextPage && !isFetchingNextPage;
              const statusInfo = getMyAdStatusInfo(ad);
              const adId = String(ad.id ?? ad._id ?? card.id);
              const cardWithStatus: AdCardData = {
                ...card,
                status: statusInfo.label,
                statusBadgeClassName: statusInfo.badgeClassName,
              };
              const isIncomplete = statusInfo.key === "incomplete";
              const destination = isIncomplete
                ? getAdEditPath(adId, adManagementPaths.root)
                : `${adManagementPaths.root}/${encodeURIComponent(adId)}/state-ad`;
              const destinationState = isIncomplete
                ? {
                    ad,
                    card: cardWithStatus,
                    editReturnTo: adManagementPaths.root,
                    isEditMode: true,
                    status: statusInfo.key,
                    tab: "status",
                  }
                : { ad, card: cardWithStatus, status: statusInfo.key };

              return (
                <div key={adId} ref={shouldAttachLoadMore ? loadMoreSentinelRef : undefined}>
                  <AdCard
                    ad={cardWithStatus}
                    onDeleteIncomplete={isIncomplete ? (e) => handleOpenDelete(adId, e) : undefined}
                    showStatusBadge
                    state={destinationState}
                    to={destination}
                  />
                </div>
              );
            })}

          {isFetchingNextPage ? (
            <>
              {Array.from({ length: 2 }).map((_, index) => (
                <AdCardSkeleton key={index} />
              ))}
            </>
          ) : null}

          {showEmptyState ? (
            <AccountMyAdsEmptyState filterLabel={activeFilter.label} mode={emptyMode} />
          ) : null}
        </div>

        <DeleteAdBottomSheet
          isDeleting={isDeleting}
          isOpen={Boolean(deletingAdId)}
          onClose={() => !isDeleting && setDeletingAdId(null)}
          onConfirm={handleConfirmDelete}
        />
      </main>
    </AccountPageShell>
  );
}
