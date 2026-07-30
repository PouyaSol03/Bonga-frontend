import { useMemo, useState } from "react";
import { SwitchButton } from "../../components/SwitchButton";
import { SearchEmptyState } from "../../components/SearchEmptyState";
import { RouteLink } from "../../routes/RouteLink";
import { AnalyticsIcon, FilterIcon, SearchIcon } from "../account/adManagement/AdManagementIcons";
import { DashboardAdCard, type DashboardAd } from "./DashboardAdCard";
import { Typography } from "../../components/ui/Typography";
import { Button } from "../../components/ui/Button";

type DashboardAdsTab = "active" | "specialty" | "status";

const dashboardAdsTabs: { id: DashboardAdsTab; label: string }[] = [
  { id: "active", label: "آگهی‌های فعال" },
  { id: "specialty", label: "آگهی‌های تخصصی" },
  { id: "status", label: "وضعیت آگهی‌ها" },
];

const dashboardAds: DashboardAd[] = [
  {
    id: 101,
    area: "۸۰ متر",
    badges: ["ویژه"],
    imageCount: "۵",
    imageUrl: "/figma/dashboard/dashboard-kitchen.png",
    isMine: true,
    owner: "حسین عبادی",
    price: "۴/۵۰۰ میلیارد",
    rooms: "۱ اتاق",
    timeAndLocation: "۳ ساعت پیش در صیاد شیرازی",
    title: "صیاد ۲۳ فول ۸۰ متر دو خواب لوکس",
    year: "۱۳۹۰",
  },
  {
    id: 102,
    area: "۷۴ متر",
    badges: ["ویژه"],
    imageCount: "۲",
    imageUrl: "/figma/dashboard/dashboard-patio.png",
    isMine: true,
    owner: "آژانس",
    price: "۳/۰۹۷ میلیارد",
    rooms: "۲ اتاق",
    timeAndLocation: "۲ ساعت پیش در صیاد شیرازی",
    title: "فروش آپارتمان ۷۴متری ابتدای صیادشیرازی/اقدسیه مترو",
    year: "۱۳۸۸",
  },
  {
    id: 103,
    area: "۱۴۰ متر",
    badges: [],
    imageCount: "۴",
    imageUrl: "/figma/dashboard/dashboard-living-fireplace.png",
    isMine: true,
    owner: "ناصر اشرفی",
    price: "۷/۶۵۰ میلیارد",
    rooms: "۳ اتاق",
    timeAndLocation: "۱ ساعت پیش در صیاد شیرازی",
    title: "۱۴۰متر تک‌واحدی ابتدای صیاد*فول امکانات",
    year: "۱۳۹۵",
  },
  {
    id: 104,
    area: "۱۰۹ متر",
    badges: [],
    imageCount: "۳",
    imageUrl: "/figma/dashboard/dashboard-living.png",
    isMine: true,
    owner: "محمد دارایی",
    price: "۵ میلیارد",
    rooms: "۲ اتاق",
    timeAndLocation: "۱ ساعت پیش در صیاد شیرازی",
    title: "آپارتمان ۱۰۹ متری خوش‌نقشه نزدیک مترو",
    year: "۱۳۹۸",
  },
  {
    id: 105,
    area: "۱۶۷ متر",
    badges: [],
    imageCount: "۲",
    imageUrl: "/figma/dashboard/dashboard-patio.png",
    isMine: true,
    owner: "رسول قاسمیان",
    price: "۳/۸۵۰ میلیارد",
    rooms: "۳ اتاق",
    timeAndLocation: "۲ ساعت پیش در صیاد شیرازی",
    title: "واحد ۱۶۷ متری تراس بزرگ و نورگیر عالی",
    year: "۱۴۰۲",
  },
  {
    id: 106,
    area: "۱۴۰ متر",
    badges: [],
    imageCount: "۱",
    imageUrl: "/figma/dashboard/dashboard-patio.png",
    isMine: true,
    owner: "ادریس زیرک",
    price: "۵/۵۰۰ میلیارد",
    rooms: "۲ اتاق",
    timeAndLocation: "۱ ساعت پیش در صیاد شیرازی",
    title: "ویلای ۱۴۰ متری مدرن با دسترسی عالی",
    year: "۱۳۸۵",
  },
];

export function DashboardAdsPage() {
  const [activeTab, setActiveTab] = useState<DashboardAdsTab>("active");
  const [showMineOnly, setShowMineOnly] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const visibleAds = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return dashboardAds.filter((ad, index) => {
      if (showMineOnly && !ad.isMine) return false;
      if (activeTab === "specialty" && index % 2 !== 0) return false;
      if (activeTab === "status" && !ad.badges.length) return false;

      if (!normalizedSearch) return true;

      return [ad.title, ad.owner, ad.price, ad.area, ad.rooms, ad.year, ad.timeAndLocation]
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearch);
    });
  }, [activeTab, searchTerm, showMineOnly]);

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
        {visibleAds.length > 0 ? (
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
