import { useMemo, useState } from "react";
import { AdCard, type AdCardData } from "../../../../advertisements/components/AdCard";
import { AdCardSkeleton } from "../../../../advertisements/components/AdCardSkeleton";
import { Typography } from "../../../../../shared/ui/Typography";
import { Chip } from "../../../../../shared/ui/Chip";
import LinearFilterHorizontal from "../../../../../shared/icons/LinearFilterHorizontal";
import { useAgencyConsultantAdvertisementsQuery } from "../../../../agencies/api/agency.hooks";
import { adManagementPropertyTypeLabels } from "../../../../account/adManagement/adManagementData";
import {
  emptyConsultantAdsFilterState,
  type ConsultantAdsFilterState,
} from "./consultantAdsFilterTypes";
import { filterConsultantAds } from "./consultantAdsFilterUtils";
import { ConsultantAdsFilterView } from "./ConsultantAdsFilterView";

export function ConsultantAdsTab({
  ads: propAds,
  agentId,
  filters: propFilters,
  onFiltersChange,
  onOpenFilter,
}: {
  ads?: AdCardData[];
  agentId?: number | string;
  filters?: ConsultantAdsFilterState;
  onFiltersChange?: (filters: ConsultantAdsFilterState) => void;
  onOpenFilter?: () => void;
}) {
  const [internalFilters, setInternalFilters] = useState<ConsultantAdsFilterState>(
    emptyConsultantAdsFilterState,
  );
  const [isInternalFilterOpen, setIsInternalFilterOpen] = useState(false);

  const filters = propFilters ?? internalFilters;
  const setFilters = onFiltersChange ?? setInternalFilters;

  const hasActiveFilters = Boolean(
    filters.neighborhoods.length > 0 ||
      filters.transaction ||
      filters.propertyTypes.length > 0 ||
      (filters.status && filters.status !== "همه"),
  );

  const apiStatus =
    filters.status === "فعال"
      ? "active"
      : filters.status === "منقضی شده"
        ? "expired"
        : "all";

  const adsQuery = useAgencyConsultantAdvertisementsQuery({
    agentId: agentId ?? "",
    enabled: Boolean(agentId),
    status: apiStatus,
  });

  const rawAds = propAds ?? adsQuery.data?.data ?? [];
  const isLoading = Boolean(agentId) && adsQuery.isLoading;

  const ads = useMemo(
    () => filterConsultantAds(rawAds, filters),
    [rawAds, filters],
  );

  const handleOpen = () => {
    if (onOpenFilter) {
      onOpenFilter();
    } else {
      setIsInternalFilterOpen(true);
    }
  };

  if (!onOpenFilter && isInternalFilterOpen) {
    return (
      <ConsultantAdsFilterView
        agentId={agentId}
        initialFilters={filters}
        onApply={(newFilters) => {
          setFilters(newFilters);
          setIsInternalFilterOpen(false);
        }}
        onBack={() => setIsInternalFilterOpen(false)}
      />
    );
  }

  return (
    <div className="flex flex-1 flex-col bg-surface-container">
      <div className="flex items-center justify-start gap-2 overflow-x-auto bg-surface-container-lowest px-4 pb-4 pt-6 no-scrollbar">
        <Chip
          icon={<LinearFilterHorizontal className="h-4 w-4" />}
          onClick={handleOpen}
          selected={hasActiveFilters}
        >
          فیلتر
        </Chip>

        {filters.neighborhoods.map((n) => (
          <Chip
            key={n.id}
            removable
            selected
            onClick={() =>
              setFilters({
                ...filters,
                neighborhoods: filters.neighborhoods.filter((item) => item.id !== n.id),
              })
            }
          >
            {n.name}
          </Chip>
        ))}

        {filters.transaction ? (
          <Chip
            removable
            selected
            onClick={() => setFilters({ ...filters, transaction: undefined })}
          >
            {filters.transaction === "sale"
              ? "فروش"
              : filters.transaction === "rent"
                ? "اجاره"
                : "پروژه"}
          </Chip>
        ) : null}

        {filters.propertyTypes.map((pt) => (
          <Chip
            key={pt}
            removable
            selected
            onClick={() =>
              setFilters({
                ...filters,
                propertyTypes: filters.propertyTypes.filter((item) => item !== pt),
              })
            }
          >
            {(adManagementPropertyTypeLabels as Record<string, string>)[pt] ?? pt}
          </Chip>
        ))}

        {filters.status && filters.status !== "همه" ? (
          <Chip
            removable
            selected
            onClick={() => setFilters({ ...filters, status: undefined })}
          >
            {filters.status}
          </Chip>
        ) : null}
      </div>

      {isLoading ? (
        <div className="space-y-3 p-4">
          <AdCardSkeleton />
          <AdCardSkeleton />
        </div>
      ) : ads.length > 0 ? (
        ads.map((ad) => (
          <AdCard
            className="shrink-0 border-b-[12px] border-surface-container last:border-b-0"
            key={ad.id}
            ad={ad}
            to={`/ads/${ad.id}`}
          />
        ))
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center bg-surface-container-lowest px-4 py-20 text-center">
          <img
            alt=""
            aria-hidden="true"
            className="mb-4 h-[66px] w-[66px] object-contain"
            src="/vectors/NoAdd.svg"
          />
          <Typography
            as="p"
            variant="body"
            size="medium"
            weight="medium"
            className="m-0 text-outline"
          >
            هیچ آگهی‌‎ای برای نمایش وجود ندارد؛
          </Typography>
        </div>
      )}
    </div>
  );
}
