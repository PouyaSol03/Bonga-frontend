import { useMemo, useState } from "react";
import { SwitchButton } from "../../components/SwitchButton";
import { SearchEmptyState } from "../../components/SearchEmptyState";
import { RouteLink } from "../../routes/RouteLink";
import { AnalyticsIcon, FilterIcon, SearchIcon } from "../account/adManagement/AdManagementIcons";
import { DashboardAdCard } from "./DashboardAdCard";
import { useMyAdsInfiniteQuery } from "../../hooks/account.hooks";
import { mapAdvertisementToAdCard } from "../../services/advertisement.service";
import { getMyAdStatusInfo } from "../account/myAdsStatus";
import { Typography } from "../../components/ui/Typography";
import { Button } from "../../components/ui/Button";

type DashboardAdsTab = "active" | "specialty" | "status";

const dashboardAdsTabs: { id: DashboardAdsTab; label: string }[] = [
  { id: "active", label: "آگهی‌های فعال" },
  { id: "specialty", label: "آگهی‌های تخصصی" },
  { id: "status", label: "وضعیت آگهی‌ها" },
];

export function DashboardAdsPage() {
  const [activeTab, setActiveTab] = useState<DashboardAdsTab>("active");
  const [showMineOnly, setShowMineOnly] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const adsQuery = useMyAdsInfiniteQuery({
    perPage: 100,
    type: activeTab === "status" ? "all" : "active",
  });

  const visibleAds = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const sourceAds = adsQuery.data?.pages.flatMap((page) => page.data) ?? [];

    return sourceAds
      .filter((sourceAd) => {
        if (showMineOnly && sourceAd.is_mine === false) return false;

        const card = mapAdvertisementToAdCard(sourceAd, 0);
        if (activeTab === "specialty" && card.badges.length === 0) return false;

        if (!normalizedSearch) return true;

        return [
          card.title,
          card.agency,
          card.pricePrimary,
          card.area,
          card.rooms,
          card.year,
          card.timeAndLocation,
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalizedSearch);
      })
      .map((sourceAd, index) => ({
        ...mapAdvertisementToAdCard(sourceAd, index),
        status: getMyAdStatusInfo(sourceAd).label,
      }));
  }, [activeTab, adsQuery.data, searchTerm, showMineOnly]);

  return (
    <section className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl bg-white px-6 pb-6 pt-3 text-[#1a1a1a] [direction:rtl]">
      <div className="shrink-0">
        <nav aria-label="بخش‌های مدیریت آگهی‌ها" className="flex justify-end">
          <div className="inline-flex items-center gap-12">
            {dashboardAdsTabs.map((tab) => {
              const isActive = activeTab === tab.id;

              return (
                <Button unstyled
                  aria-current={isActive ? "page" : undefined}
                  className={`relative h-10 whitespace-nowrap border-0 bg-transparent px-0 text-sm font-semibold transition ${isActive ? "text-[#0048c4]" : "text-[#666666] hover:text-[#303030]"
                    }`}
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  type="button"
                >
                  {tab.label}
                  {isActive ? (
                    <Typography as="span" variant="body" size="medium" weight="regular" className="absolute -bottom-px right-0 h-0.5 w-full rounded-full bg-[#0048c4]" />
                  ) : null}
                </Button>
              );
            })}
          </div>
        </nav>

        <div className="mt-9 flex items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <Button unstyled
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#cccccc] bg-white px-4 text-sm font-semibold text-[#1a1a1a] transition hover:border-[#0048c4] hover:text-[#0048c4]"
              type="button"
            >
              <FilterIcon className="h-5 w-5" />
              <Typography as="span" variant="body" size="medium" weight="regular">فیلترها</Typography>
            </Button>

            <label className="relative block h-10 w-[360px]">
              <SearchIcon className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-[#4d4d4d]" />
              <input
                className="h-full w-full rounded-xl border border-[#cccccc] bg-white pr-4 pl-12 text-right text-sm font-medium text-[#303030] outline-none transition placeholder:text-[#999999] focus:border-[#0048c4]"
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="جستجو"
                type="search"
                value={searchTerm}
              />
            </label>
          </div>

          <div className="flex items-center gap-4">
            <RouteLink
              className="inline-flex h-10 items-center gap-2 rounded-xl px-2 text-sm font-semibold text-[#1a1a1a] no-underline transition hover:bg-[#f5f5f5]"
              to="/account/ad-management/statistics"
            >
              <AnalyticsIcon className="h-5 w-5 text-[#4d4d4d]" />
              <Typography as="span" variant="body" size="medium" weight="regular" dir="rtl">آمار آگهی‌ها</Typography>
            </RouteLink>

            <Typography as="span" variant="body" size="medium" weight="regular" className="h-8 w-px bg-[#cccccc]" />

            <label className="inline-flex h-10 items-center gap-3 text-sm font-semibold text-[#1a1a1a]">
              <Typography as="span" variant="body" size="medium" weight="regular" dir="rtl">آگهی‌های من</Typography>
              <SwitchButton
                ariaLabel="نمایش آگهی های من"
                checked={showMineOnly}
                onChange={setShowMineOnly}
              />
            </label>
          </div>
        </div>
      </div>

      <div className="mt-6 min-h-0 flex-1 overflow-y-auto overflow-x-hidden pl-1">
        {adsQuery.isPending ? (
          <div className="grid h-full place-items-center text-sm text-[#808080]">
            در حال دریافت آگهی‌ها...
          </div>
        ) : visibleAds.length > 0 ? (
          <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2 xl:grid-cols-3">
            {visibleAds.map((ad) => (
              <DashboardAdCard ad={ad} key={ad.id} />
            ))}
          </div>
        ) : (
          <SearchEmptyState />
        )}
      </div>
    </section>
  );
}
