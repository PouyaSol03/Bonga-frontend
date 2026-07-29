import { useState } from "react";
import { PageFrame } from "../../../app/PageFrame";
import { TopBar } from "../../../components/TopBar";
import { SearchEmptyState } from "../../../components/SearchEmptyState";
import { SearchInputBar } from "../../../components/ui/SearchBar";
import { ConsultantAdCard } from "./ConsultantAdCard";
import { adManagementPaths, getAdManagementRouteState, getAdsForTab } from "./adManagementData";

export function IndependentConsultantAdSearchPage() {
  const tab = getAdManagementRouteState().tab ?? "active";
  const ads = getAdsForTab(tab);
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim();
  const matchedAds =
    normalizedQuery.length === 0
      ? []
      : ads.filter((ad) =>
          [ad.title, ad.area, ad.rooms, ad.year, ad.timeAndLocation]
            .join(" ")
            .includes(normalizedQuery),
        );

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
          matchedAds.length > 0 ? (
            <div className="space-y-2">
              {matchedAds.map((ad, index) => (
                <ConsultantAdCard ad={ad} key={`${ad.title}-${index}`} />
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
