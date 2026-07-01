import { useState } from "react";

import { PageFrame } from "../../app/PageFrame";
import { SwitchButton } from "../../components/SwitchButton";
import { TopBar } from "../../components/TopBar";
import { FilterIcon, SearchIcon } from "./adManagement/AdManagementIcons";
import { ConsultantAdCard } from "./adManagement/ConsultantAdCard";
import {
  getAdManagementRouteState,
  getAdsForTab,
  type AdsTab,
} from "./adManagement/adManagementData";
import LinearFilterHorizontal from "../../components/(icons)/LinearFilterHorizontal";

const adStatusLabels = ["در انتظار انتشار", "منتشر شده", "در انتظار انتشار", "منتشر شده"];

export function IndependentConsultantAdManagementPage() {
  const [activeTab, setActiveTab] = useState<AdsTab>(
    getAdManagementRouteState().tab ?? "active",
  );
  const [showMineOnly, setShowMineOnly] = useState(false);
  const ads = getAdsForTab(activeTab).map((ad, index) => ({
    ...ad,
    status: adStatusLabels[index % adStatusLabels.length],
  }));

  return (
    <PageFrame
      className="relative flex min-h-0 flex-col overflow-hidden bg-[#f0f0f0] text-[#1a1a1a] [direction:rtl]"
      variant="flush"
    >
      <TopBar
        backTo="/account"
        centerClassName="px-0"
        centerSlot={
          <h1 className="m-0 truncate text-center text-base font-semibold leading-6 text-[#1a1a1a]">
            مدیریت آگهی‌ها
          </h1>
        }
        className="bg-[#f0f0f0]"
        startSlot={
          <button
            aria-label="جستجو"
            className="grid h-12 w-12 place-items-center rounded-full text-[#1a1a1a] focus-visible:outline-3 focus-visible:outline-offset-[-3px] focus-visible:outline-[#0048c440]"
            type="button"
          >
            <SearchIcon className="h-6 w-6" />
          </button>
        }
      />

      <section className="shrink-0 bg-[#f0f0f0] px-4 py-2" aria-label="بخش‌های مدیریت آگهی">
        <div className="grid h-10 grid-cols-2 overflow-hidden rounded-xl border border-[#808080] bg-white [direction:rtl]">
          <button
            aria-current={activeTab === "active" ? "page" : undefined}
            className={`text-base font-medium leading-6 [direction:rtl] ${
              activeTab === "active" ? "bg-[#0048c41f] text-[#002099]" : "text-[#4d4d4d]"
            }`}
            onClick={() => setActiveTab("active")}
            type="button"
          >
            آگهی‌ها
          </button>
          <button
            aria-current={activeTab === "status" ? "page" : undefined}
            className={`text-base font-medium leading-6 [direction:rtl] ${
              activeTab === "status" ? "bg-[#0048c41f] text-[#002099]" : "text-[#4d4d4d]"
            }`}
            onClick={() => setActiveTab("status")}
            type="button"
          >
            تخصصی
          </button>
        </div>
      </section>

      <section
        aria-label="فیلترهای مدیریت آگهی"
        className="flex h-14 shrink-0 items-center justify-between bg-white px-4 [direction:ltr]"
      >
        <div className="flex items-center gap-2 [direction:rtl]">
          <span className="h-6 w-px bg-[#cccccc]" aria-hidden="true" />
          <span className="text-sm font-medium leading-5 text-[#4d4d4d]">آگهی من</span>
          <SwitchButton
            ariaLabel="نمایش آگهی‌های من"
            checked={showMineOnly}
            onChange={setShowMineOnly}
          />
        </div>

        <button
          className="inline-flex items-center gap-1 rounded-lg border border-[#cccccc] bg-white p-2 text-sm font-normal text-[#4d4d4d]"
          type="button"
        >
          <span>فیلتر</span>
          <LinearFilterHorizontal className="h-5 w-5"/>
        </button>
      </section>

      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-[#f0f0f0] pt-4">
        <div className="space-y-2">
          {ads.map((ad, index) => (
            <ConsultantAdCard
              ad={ad}
              key={`${ad.title}-${index}`}
              showStatusBadge
              state={{ ad }}
            />
          ))}
        </div>
      </main>
    </PageFrame>
  );
}
