import { useMemo, useState } from "react";

import { PageFrame } from "../../../app/PageFrame";
import { SearchEmptyState } from "../../../components/SearchEmptyState";
import { TopBar } from "../../../components/TopBar";
import { SearchInputBar } from "../../../components/ui/SearchBar";
import { useMyAdsInfiniteQuery } from "../../../hooks/account.hooks";
import { useAgencyAdvertiseAssignmentsInfiniteQuery } from "../../../hooks/agency-advertise-assignment.hooks";
import { mapAdvertisementToAdCard } from "../../../services/advertisement.service";
import { ConsultantAdCard } from "./ConsultantAdCard";
import { adManagementPaths, getAdManagementRouteState } from "./adManagementData";

export function IndependentConsultantAdSearchPage() {
  const tab = getAdManagementRouteState().tab ?? "active";
  const isAssignedTab = tab === "status";
  const activeAdsQuery = useMyAdsInfiniteQuery({ perPage: 100, type: "active" });
  const assignmentsQuery = useAgencyAdvertiseAssignmentsInfiniteQuery({
    enabled: isAssignedTab,
    perPage: 100,
    status: "pending",
  });
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim();
  const ads = useMemo(() => {
    if (isAssignedTab) {
      return (assignmentsQuery.data?.pages ?? [])
        .flatMap((page) => page.data)
        .flatMap((assignment, index) =>
          assignment.advertise
            ? [
                {
                  ...mapAdvertisementToAdCard(assignment.advertise, index),
                  id: assignment.advertiseId,
                },
              ]
            : [],
        );
    }

    return (activeAdsQuery.data?.pages ?? [])
      .flatMap((page) => page.data)
      .map((ad, index) => mapAdvertisementToAdCard(ad, index));
  }, [activeAdsQuery.data, assignmentsQuery.data, isAssignedTab]);
  const matchedAds =
    normalizedQuery.length === 0
      ? []
      : ads.filter((ad) =>
          [ad.title, ad.area, ad.rooms, ad.year, ad.timeAndLocation]
            .join(" ")
            .includes(normalizedQuery),
        );
  const isLoading = isAssignedTab
    ? assignmentsQuery.isLoading
    : activeAdsQuery.isLoading;
  const isError = isAssignedTab
    ? assignmentsQuery.isError
    : activeAdsQuery.isError;

  return (
    <PageFrame className="relative flex min-h-0 flex-col overflow-hidden bg-white" variant="flush">
      <TopBar
        backState={{ tab }}
        backTo={adManagementPaths.root}
        className="[&_a]:text-[#4d4d4d]"
        centerSlot={
          <SearchInputBar
            aria-label="جستجوی آگهی"
            autoFocus
            compact
            containerClassName="border-0 bg-transparent px-0"
            inputClassName="text-base font-semibold caret-[#0048c4]"
            inputMode="search"
            onValueChange={setQuery}
            showSearchIcon={false}
            type="search"
            value={query}
          />
        }
      />

      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-[#f0f0f0]">
        {normalizedQuery.length > 0 ? (
          isLoading ? (
            <div className="px-4 py-8 text-center text-sm text-[#808080]">
              در حال دریافت آگهی‌ها...
            </div>
          ) : isError ? (
            <div className="px-4 py-8 text-center text-sm text-[#808080]">
              دریافت آگهی‌ها با خطا مواجه شد.
            </div>
          ) : matchedAds.length > 0 ? (
            <div className="space-y-2">
              {matchedAds.map((ad, index) => (
                <ConsultantAdCard ad={ad} key={`${ad.id}-${index}`} />
              ))}
            </div>
          ) : (
            <SearchEmptyState />
          )
        ) : null}
      </main>
    </PageFrame>
  );
}
