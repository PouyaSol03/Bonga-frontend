import { useState } from "react";
import { PageFrame } from "../../../app/PageFrame";
import { TopBar } from "../../../components/TopBar";
import { EmptyState } from "../../../components/EmptyState";
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
  const showEmptyState = normalizedQuery.length > 0 && matchedAds.length === 0;

  return (
    <PageFrame className="relative flex min-h-0 flex-col overflow-hidden bg-white" variant="flush">
      <TopBar
        backState={{ tab }}
        backTo={adManagementPaths.root}
        className="[&_a]:text-[#4d4d4d]"
        centerSlot={
          <input
            aria-label="جستجوی آگهی"
            autoFocus
            className="h-12 w-full border-0 bg-transparent px-0 text-right text-base font-semibold leading-6 text-[#1a1a1a] caret-[#0048c4] outline-none placeholder:text-[#a6a6a6]"
            dir="rtl"
            inputMode="search"
            onChange={(event) => setQuery(event.target.value)}
            type="search"
            value={query}
          />
        }
      />

      <main
        className={`min-h-0 flex-1 overflow-x-hidden ${
          showEmptyState ? "overflow-hidden bg-white" : "overflow-y-auto bg-[#f0f0f0]"
        }`}
      >
        {normalizedQuery.length > 0 ? (
          matchedAds.length > 0 ? (
            <div className="space-y-2">
              {matchedAds.map((ad, index) => (
                <ConsultantAdCard ad={ad} key={`${ad.title}-${index}`} />
              ))}
            </div>
          ) : (
            <EmptyState
              description="عبارت جستجو را تغییر دهید و دوباره تلاش کنید."
              iconSrc="/vectors/NotFoundSearch.svg"
              title="آگهی‌ای یافت نشد"
            />
          )
        ) : null}
      </main>
    </PageFrame>
  );
}
