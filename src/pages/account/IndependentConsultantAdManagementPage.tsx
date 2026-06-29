import { useState } from "react";
import { PageFrame } from "../../app/PageFrame";
import { TopBar } from "../../components/TopBar";
import { RouteLink } from "../../routes/RouteLink";
import { AnalyticsIcon, FilterIcon, SearchIcon } from "./adManagement/AdManagementIcons";
import { ConsultantAdCard } from "./adManagement/ConsultantAdCard";
import {
  adManagementPaths,
  getAdManagementRouteState,
  getAdsForTab,
  type AdsTab,
} from "./adManagement/adManagementData";

export function IndependentConsultantAdManagementPage() {
  const [activeTab, setActiveTab] = useState<AdsTab>(
    getAdManagementRouteState().tab ?? "active",
  );
  const ads = getAdsForTab(activeTab);

  return (
    <PageFrame
      className="relative flex min-h-0 flex-col overflow-hidden bg-[#f0f0f0] text-[#1a1a1a] [direction:rtl]"
      variant="flush"
    >
      <TopBar
        actions={[
          {
            icon: <FilterIcon className="h-6 w-6" />,
            id: "filters",
            label: "فیلتر",
            state: { tab: activeTab },
            to: adManagementPaths.filter,
          },
          {
            icon: <SearchIcon className="h-6 w-6" />,
            id: "search",
            label: "جستجو",
            state: { tab: activeTab },
            to: adManagementPaths.search,
          },
        ]}
        backTo="/account"
        className="[&_a]:text-[#1a1a1a]"
        title="مدیریت آگهی‌ها"
      />

      <section className="shrink-0 bg-[#f0f0f0] px-4 py-2" aria-label="وضعیت آگهی">
        <div className="grid h-10 grid-cols-2 overflow-hidden rounded-2xl border border-[#808080] bg-white [direction:ltr]">
          <button
            aria-current={activeTab === "status" ? "page" : undefined}
            className={`text-base font-medium leading-6 [direction:rtl] ${
              activeTab === "status" ? "bg-[#0048c41f] text-[#002099]" : "text-[#4d4d4d]"
            }`}
            onClick={() => setActiveTab("status")}
            type="button"
          >
            وضعیت آگهی
          </button>
          <button
            aria-current={activeTab === "active" ? "page" : undefined}
            className={`text-base font-medium leading-6 [direction:rtl] ${
              activeTab === "active" ? "bg-[#0048c41f] text-[#002099]" : "text-[#4d4d4d]"
            }`}
            onClick={() => setActiveTab("active")}
            type="button"
          >
            فعال
          </button>
        </div>
      </section>

      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-[#f0f0f0]">
        <div className="space-y-2">
          {ads.map((ad, index) => (
            <ConsultantAdCard
              ad={ad}
              key={`${ad.title}-${index}`}
              state={activeTab === "status" ? { ad } : undefined}
              to={activeTab === "status" ? adManagementPaths.allocation : undefined}
            />
          ))}
        </div>
      </main>

      {activeTab === "status" ? (
        <RouteLink
          className="absolute bottom-3 left-1/2 z-10 inline-flex h-10 -translate-x-1/2 items-center gap-2 rounded-xl bg-[#0048c4] px-4 text-sm font-medium leading-5 text-white no-underline shadow-[0_4px_10px_rgba(0,72,196,0.2)]"
          state={{ tab: "status" }}
          to={adManagementPaths.statistics}
        >
          <span>آمار آگهی‌ها</span>
          <AnalyticsIcon className="h-5 w-5" />
        </RouteLink>
      ) : null}
    </PageFrame>
  );
}
