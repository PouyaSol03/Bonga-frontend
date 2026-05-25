import { useState } from "react";

import { PageFrame } from "../app/PageFrame";
import { AdCard } from "../components/AdCard";
import { BottomNavigation } from "../components/BottomNavigation";

import { CategoryBottomSheet } from "./home/components/CategoryBottomSheet";
import { CitySelectionScreen } from "./home/components/CitySelectionScreen";
import { HomeSearchScreen } from "./home/components/HomeSearchScreen";
import { latestMashhadAds, quickActions } from "./home/homeData";
import type { QuickAction } from "./home/homeTypes";
import NotificationIcon from "../assets/icons/NotificationIcon";
import ArrowDown from "../assets/icons/ArrowDown";
import ShenasaVector from "../assets/icons/ShenasaVector";
import IranShenasaTypo from "../assets/icons/IranShenasaTypo";
import { BusinessBanner } from "./home/components/BusinessBanner";

const businessBannerSlides = [
  {
    eyebrow: "سامانه کسب و کار",
    title: "آژانس‌های املاک",
    buttonText: "بیشتر بدانید",
    to: "/account/about",
  },
  {
    eyebrow: "سامانه کسب و کار",
    title: "مشاوران مستقل",
    buttonText: "بیشتر بدانید",
    to: "/account/dashboard",
  },
  {
    eyebrow: "سامانه کسب و کار",
    title: "مدیریت آگهی‌ها",
    buttonText: "بیشتر بدانید",
    to: "/account/ad-management",
  },
];

export function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<QuickAction | null>(
    null,
  );
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCityOpen, setIsCityOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState(
    () => window.sessionStorage.getItem("bonga-selected-city") ?? "مشهد",
  );

  const isCategorySheetOpen = selectedCategory !== null;

  const navigateToSearch = () => {
    setIsSearchOpen(false);
    setSelectedCategory(null);
    window.history.pushState({}, "", "/search");
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  const navigateToChat = () => {
    window.history.pushState({}, "", "/chat");
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  return (
    <PageFrame
      className="relative flex h-full min-h-0 w-full flex-col overflow-hidden bg-[#f0f0f0] text-[#1a1a1a] [direction:rtl]"
      variant="flush"
    >
      <header className="shrink-0 bg-white">
        <section
          className="flex min-h-14 w-full min-w-0 items-center justify-between gap-2 bg-white px-3 py-2 [direction:ltr] min-[390px]:min-h-16 min-[390px]:px-4"
          aria-label="سربرگ"
        >
          <div className="flex items-center justify-center gap-2">
            <button
              aria-label="اعلان‌ها"
              className="grid h-10 w-10 place-items-center rounded-full text-[#1a1a1a] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#0048c440]"
              onClick={navigateToChat}
              type="button"
            >
              <NotificationIcon />
            </button>

            <button
              className="flex items-center justify-center gap-1 rounded-[10px] border border-[#0048C4] px-2 py-2 text-sm font-medium leading-5 text-[#0048C4] min-[390px]:py-2.5 min-[390px]:text-base min-[390px]:leading-6"
              type="button"
              onClick={() => setIsCityOpen(true)}
            >
              <ArrowDown size={20} />
              <span>{selectedCity}</span>
            </button>
          </div>

          <div
            className="flex items-end justify-start gap-2 pr-1 min-[390px]:gap-3"
            aria-label="ایران شناسا"
          >
            <IranShenasaTypo />
            <ShenasaVector />
          </div>
        </section>
      </header>

      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-[#f0f0f0]">
        <section
          className="flex w-full flex-col gap-5 bg-white px-4 pb-5 pt-2 min-[390px]:gap-7 min-[390px]:pb-6"
          aria-label="جستجوی ملک"
        >
          <label
            className="relative flex h-12 items-center rounded-xl bg-[#f0f0f0]"
            onClick={() => setIsSearchOpen(true)}
            onPointerDown={(event) => {
              event.preventDefault();
              setIsSearchOpen(true);
            }}
          >
            <input
              className="h-full w-full rounded-[inherit] border-0 bg-transparent py-0 pl-12 pr-4 text-right text-sm font-normal leading-5 text-[#1a1a1a] outline-none placeholder:text-[#808080] min-[390px]:text-base min-[390px]:leading-6"
              type="search"
              placeholder="جستجو در آگهی‌ها"
              onFocus={() => setIsSearchOpen(true)}
              onClick={() => setIsSearchOpen(true)}
              readOnly
            />
            <span className="home-search-icon" aria-hidden="true" />
          </label>

          <div
            className="home-quick-actions grid grid-cols-4 gap-3 [direction:rtl] min-[390px]:gap-4"
            aria-label="دسته‌بندی‌ها"
          >
            {quickActions.map((item) => (
              <button
                className="flex min-h-[58px] min-w-0 cursor-pointer flex-col items-center justify-start gap-1.5 bg-white p-0 text-[11px] font-medium leading-4 text-[#1a1a1a] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#0048c440] min-[390px]:min-h-[70px] min-[390px]:gap-[7px] min-[390px]:text-xs"
                key={item.label}
                type="button"
                onClick={() => setSelectedCategory(item)}
              >
                <img
                  src={item.icon}
                  alt=""
                  className="h-8 w-8 shrink-0 min-[390px]:h-10 min-[390px]:w-10"
                  aria-hidden="true"
                />

                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </section>

        <BusinessBanner slides={businessBannerSlides} />

        <section
          className="flex flex-col gap-4 border-t-[16px] border-[#f0f0f0] bg-white pt-4"
          aria-labelledby="latest-mashhad-title"
        >
          <div className="flex items-center justify-start px-4">
            <h2
              className="m-0 text-right text-sm font-bold leading-5 text-[#1a1a1a] min-[390px]:text-base min-[390px]:leading-6"
              id="latest-mashhad-title"
            >
              آخرین آگهی‌های مشهد
            </h2>
          </div>

          <div className="flex flex-col bg-[#f0f0f0] gap-3 ">
            {latestMashhadAds.map((ad) => (
              <AdCard ad={ad} key={ad.id} />
            ))}
          </div>
        </section>
      </main>

      <BottomNavigation activeKey="home" />

      <CategoryBottomSheet
        isOpen={isCategorySheetOpen}
        selectedCategory={selectedCategory}
        onClose={() => setSelectedCategory(null)}
        onSelectCategory={navigateToSearch}
      />

      <HomeSearchScreen
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectResult={navigateToSearch}
      />

      <CitySelectionScreen
        currentCity={selectedCity}
        isOpen={isCityOpen}
        onClose={() => setIsCityOpen(false)}
        onConfirm={(city) => {
          setSelectedCity(city);
          window.sessionStorage.setItem("bonga-selected-city", city);
          setIsCityOpen(false);
        }}
      />
    </PageFrame>
  );
}
