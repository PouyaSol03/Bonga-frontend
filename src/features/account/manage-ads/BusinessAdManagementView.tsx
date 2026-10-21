import { Link, useNavigate } from "react-router";
import { PageFrame } from "../../../shared/layout/PageFrame";
import { TopBar } from "../../../shared/components/TopBar";
import { Typography } from "../../../shared/ui/Typography";
import { Button } from "../../../shared/ui/Button";
import { SwitchButton } from "../../../shared/components/SwitchButton";
import LinearCancelCircle from "../../../shared/icons/LinearCancelCircle";
import LinearFilterHorizontal from "../../../shared/icons/LinearFilterHorizontal";
import {
  REAL_ESTATE_CONSULTANT,
  REAL_ESTATE_MANAGER,
} from "../../../shared/constants/roles.constants";
import { AdCardSkeleton } from "../../advertisements/components/AdCardSkeleton";
import { SearchIcon } from "../adManagement/AdManagementIcons";
import { ConsultantAdCard } from "../adManagement/ConsultantAdCard";
import {
  adManagementPaths,
  adManagementPropertyTypeLabels,
  getAdEditPath,
  getAdStatePath,
} from "../adManagement/adManagementData";
import { AccountMyAdsEmptyState } from "../accountPageViews";
import { DeleteAdBottomSheet } from "../components/DeleteAdBottomSheet";
import { AssignedConsultantAdCard } from "./AssignedConsultantAdCard";
import {
  getAssignmentCountdown,
  getFilterPropertyTypes,
  getTransactionLabel,
} from "./businessAdFilters";
import { useBusinessAdManagement } from "./useBusinessAdManagement";

export function BusinessAdManagementView() {
  const {
    activeAdvertisements,
    activeFiltersPresent,
    activeRole,
    activeTab,
    assignedAdvertisements,
    assignedTab,
    assignmentsQuery,
    canAccessAssignments,
    deletingAdId,
    filters,
    handleConfirmDelete,
    handleOpenDelete,
    isDeleting,
    isSearching,
    loadMoreRef,
    preloadIndex,
    scopedFilters,
    searchQuery,
    setActiveTab,
    setDeletingAdId,
    setIsSearching,
    setSearchQuery,
    setShowMineOnly,
    showMineOnly,
    adsQuery,
  } = useBusinessAdManagement();

  const navigate = useNavigate();
  const filterLabel = activeFiltersPresent ? "فیلترها" : "فیلتر";

  return (
    <PageFrame
      className="bg-surface-container text-on-surface relative flex min-h-0 flex-col overflow-hidden [direction:rtl]"
      variant="flush"
    >
      <TopBar
        backTo={isSearching ? undefined : "/account"}
        onBack={
          isSearching
            ? () => {
                setIsSearching(false);
                setSearchQuery("");
              }
            : () => navigate("/account", { replace: true })
        }
        centerClassName="px-0"
        centerSlot={
          isSearching ? (
            <div className="border-outline bg-surface-container-lowest flex h-10 w-full items-center rounded-xl border px-3 [direction:rtl]">
              <input
                autoFocus
                className="text-on-surface placeholder:text-outline min-w-0 flex-1 border-0 bg-transparent p-0 text-right text-sm font-normal outline-none"
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="جستجو در آگهی‌ها..."
                type="search"
                value={searchQuery}
              />
              {searchQuery ? (
                <Button unstyled aria-label="پاک کردن" className="text-outline grid h-6 w-6 shrink-0 place-items-center" onClick={() => setSearchQuery("")} type="button">
                  <LinearCancelCircle className="h-5 w-5" />
                </Button>
              ) : null}
            </div>
          ) : (
            <Typography as="h1" variant="title" size="medium" weight="semibold" className="text-on-surface m-0 truncate text-right text-base leading-6 font-semibold">
              مدیریت آگهی‌ها
            </Typography>
          )
        }
        className="bg-surface-container"
        startSlot={
          isSearching ? undefined : (
            <Button unstyled aria-label="جستجو" className="text-on-surface focus-visible:outline-primary/40 grid h-12 w-12 place-items-center rounded-full" onClick={() => setIsSearching(true)} type="button">
              <SearchIcon className="h-6 w-6" />
            </Button>
          )
        }
      />

      {canAccessAssignments ? (
        <section className="bg-surface-container shrink-0 px-4 py-2" aria-label="بخش‌های مدیریت آگهی">
          <div className="border-outline bg-surface-container-lowest grid h-10 grid-cols-2 overflow-hidden rounded-xl border [direction:rtl]">
            <Button unstyled className={`text-base leading-6 font-medium ${activeTab === "active" ? "bg-primary-container text-primary font-semibold" : "text-on-surface-var"}`} onClick={() => setActiveTab("active")} type="button">
              آگهی‌ها
            </Button>
            <Button unstyled className={`text-base leading-6 font-medium ${activeTab === "status" ? "bg-primary-container text-primary font-semibold" : "text-on-surface-var"}`} onClick={() => setActiveTab("status")} type="button">
              تخصیصی‌ها
            </Button>
          </div>
        </section>
      ) : null}

      <section aria-label="فیلترهای مدیریت آگهی" className={`bg-surface-container-lowest flex h-14 shrink-0 items-center px-4 [direction:ltr] ${assignedTab ? "justify-end" : "justify-between"}`}>
        {!assignedTab ? (
          <div className="flex items-center gap-2 [direction:rtl]">
            <Typography as="span" variant="body" size="medium" weight="regular" className="bg-outline-var h-6 w-px" aria-hidden="true" />
            <Typography as="span" variant="label" size="medium" weight="medium" className="text-on-surface-var text-sm leading-5 font-medium">
              آگهی من
            </Typography>
            <SwitchButton ariaLabel="نمایش آگهی‌های من" checked={showMineOnly} onChange={setShowMineOnly} />
          </div>
        ) : null}

        <Link
          className={`relative inline-flex items-center gap-1 rounded-lg border p-2 text-sm font-normal no-underline ${activeFiltersPresent ? "border-primary bg-primary-container text-primary" : "border-outline-var bg-surface-container-lowest text-on-surface-var"}`}
          state={{ filters: scopedFilters, onlyMine: assignedTab ? false : showMineOnly, tab: activeTab }}
          to={adManagementPaths.filter}
        >
          <Typography as="span" variant="body" size="medium" weight="regular">{filterLabel}</Typography>
          <LinearFilterHorizontal className="h-5 w-5" />
          {activeFiltersPresent ? <span className="bg-primary ring-surface-container-lowest absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full ring-2" /> : null}
        </Link>
      </section>

      {activeFiltersPresent ? (
        <section className="bg-surface-container-lowest flex shrink-0 gap-2 overflow-x-auto px-4 pb-3 [direction:rtl]">
          {scopedFilters.neighborhoods.map((n) => <span key={n.id} className="border-primary bg-primary-container text-primary inline-flex h-8 shrink-0 items-center rounded-lg border px-2 text-xs font-medium">{n.name}</span>)}
          {scopedFilters.transaction ? <span className="border-primary bg-primary-container text-primary inline-flex h-8 shrink-0 items-center rounded-lg border px-2 text-xs font-medium">{getTransactionLabel(scopedFilters.transaction)}</span> : null}
          {getFilterPropertyTypes(scopedFilters).map((pt) => <span key={pt} className="border-primary bg-primary-container text-primary inline-flex h-8 shrink-0 items-center rounded-lg border px-2 text-xs font-medium">{adManagementPropertyTypeLabels[pt]}</span>)}
          {!assignedTab && filters.status ? <span className="border-primary bg-primary-container text-primary inline-flex h-8 shrink-0 items-center rounded-lg border px-2 text-xs font-medium">{filters.status}</span> : null}
          {!assignedTab && filters.publisher ? <span className="border-primary bg-primary-container text-primary inline-flex h-8 shrink-0 items-center rounded-lg border px-2 text-xs font-medium">{filters.publisher}</span> : null}
        </section>
      ) : null}

      <main className={`flex min-h-0 flex-1 flex-col overflow-x-hidden overflow-y-auto ${(assignedTab ? !assignmentsQuery.isLoading && !assignmentsQuery.isError && assignedAdvertisements.length === 0 : !adsQuery.isLoading && !adsQuery.isError && activeAdvertisements.length === 0) ? "bg-surface-container-lowest" : "bg-surface-container pb-4"}`}>
        <div className={(assignedTab ? !assignmentsQuery.isLoading && !assignmentsQuery.isError && assignedAdvertisements.length === 0 : !adsQuery.isLoading && !adsQuery.isError && activeAdvertisements.length === 0) ? "bg-surface-container-lowest flex min-h-0 flex-1 flex-col" : assignedTab ? "space-y-3 pb-4" : "space-y-2"}>
          {assignedTab ? (
            assignmentsQuery.isLoading ? (
              <>{Array.from({ length: 3 }).map((_, i) => <AdCardSkeleton key={i} variant="assigned" />)}</>
            ) : assignmentsQuery.isError ? (
              <div className="bg-surface-container-lowest text-outline mx-4 rounded-2xl px-4 py-8 text-center text-sm leading-6">دریافت آگهی‌های تخصیصی با خطا مواجه شد.</div>
            ) : assignedAdvertisements.length > 0 ? (
              assignedAdvertisements.map(({ ad, assignment }, i) => (
                <AssignedConsultantAdCard ad={ad} assignment={assignment} countdown={getAssignmentCountdown(assignment)} key={assignment.id} loadMoreRef={i === preloadIndex ? loadMoreRef : undefined} />
              ))
            ) : (
              <AccountMyAdsEmptyState filterLabel="همه" mode="compact" />
            )
          ) : adsQuery.isLoading ? (
            <>{Array.from({ length: 3 }).map((_, i) => <AdCardSkeleton key={i} variant="management" />)}</>
          ) : adsQuery.isError ? (
            <div className="bg-surface-container-lowest text-outline mx-4 rounded-2xl px-4 py-8 text-center text-sm leading-6">دریافت آگهی‌ها با خطا مواجه شد.</div>
          ) : activeAdvertisements.length > 0 ? (
            activeAdvertisements.map(({ card, sourceAd, statusInfo }, i) => {
              const isIncomplete = statusInfo.key === "incomplete";
              const dest = isIncomplete ? getAdEditPath(card.id, adManagementPaths.root) : getAdStatePath(card.id);
              const destState = isIncomplete ? { card, ad: sourceAd, editReturnTo: adManagementPaths.root, isEditMode: true, returnTo: adManagementPaths.root, tab: "active" as const } : { card, ad: sourceAd, returnTo: adManagementPaths.root, tab: "active" as const };
              const roleType = activeRole === REAL_ESTATE_MANAGER ? "agency" : activeRole === REAL_ESTATE_CONSULTANT ? "agent_in_agency" : "agent";
              return (
                <div key={String(sourceAd.id ?? sourceAd._id ?? card.id)} ref={i === preloadIndex ? loadMoreRef : undefined}>
                  <ConsultantAdCard ad={card} onDeleteIncomplete={isIncomplete ? (e) => handleOpenDelete(String(sourceAd.id ?? sourceAd._id ?? card.id), e) : undefined} roleType={roleType} showStatusBadge sourceAd={sourceAd} state={destState} statusKey={statusInfo.key} statusLabel={statusInfo.label} to={dest} />
                </div>
              );
            })
          ) : (
            <AccountMyAdsEmptyState filterLabel="همه" mode="compact" />
          )}
          {(assignedTab ? assignmentsQuery.isFetchingNextPage : adsQuery.isFetchingNextPage) ? <AdCardSkeleton variant={assignedTab ? "assigned" : "management"} /> : null}
        </div>
      </main>

      <DeleteAdBottomSheet isDeleting={isDeleting} isOpen={Boolean(deletingAdId)} onClose={() => !isDeleting && setDeletingAdId(null)} onConfirm={handleConfirmDelete} />
    </PageFrame>
  );
}
