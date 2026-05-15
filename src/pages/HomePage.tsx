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

export function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<QuickAction | null>(
    null,
  );
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCityOpen, setIsCityOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState("مشهد");

  const isCategorySheetOpen = selectedCategory !== null;

  return (
    <PageFrame
      className="relative flex h-full min-h-0 w-full flex-col overflow-hidden bg-[#f0f0f0] text-[#1a1a1a] [direction:rtl]"
      variant="flush"
    >
      <header className="shrink-0 bg-white">
        <section
          className="flex min-h-16 w-full min-w-0 justify-between items-center  gap-2 bg-white px-4 py-2 [direction:ltr]"
          aria-label="سربرگ"
        >
          <div className="flex justify-center items-center gap-2">
            <NotificationIcon />

            <button
              className="flex justify-center items-center gap-1 border px-2 py-2.5 rounded-[10px] border-[#0048C4] text-[#0048C4]"
              type="button"
              onClick={() => setIsCityOpen(true)}
            >
              <ArrowDown size={24} />
              <span>{selectedCity}</span>
            </button>
          </div>

          <div
            className="flex justify-start items-end gap-3 pr-1"
            aria-label="ایران شناسا"
          >
            <IranShenasaTypo />
            <ShenasaVector />
          </div>
        </section>
      </header>

      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-[#f0f0f0]">
        <section
          className="flex w-full flex-col gap-7 bg-white px-4 pb-6 pt-2"
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
              className="h-full w-full rounded-[inherit] border-0 bg-transparent py-0 pl-12 pr-4 text-right text-base font-normal leading-6 text-[#1a1a1a] outline-none placeholder:text-[#808080]"
              type="search"
              placeholder="جستجو در آگهی‌ها"
              onFocus={() => setIsSearchOpen(true)}
              onClick={() => setIsSearchOpen(true)}
              readOnly
            />
            <span className="home-search-icon" aria-hidden="true" />
          </label>

          <div
            className="home-quick-actions grid grid-cols-4 gap-4 [direction:rtl]"
            aria-label="دسته‌بندی‌ها"
          >
            {quickActions.map((item) => (
              <button
                className="flex min-h-[70px] min-w-0 cursor-pointer flex-col items-center justify-start gap-[7px] bg-white p-0 text-xs font-medium leading-4 text-[#1a1a1a] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#0048c440]"
                key={item.label}
                type="button"
                onClick={() => setSelectedCategory(item)}
              >
                <img
                  src={item.icon}
                  alt=""
                  className="h-10 w-10 shrink-0"
                  aria-hidden="true"
                />

                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </section>

        <BusinessBanner
          eyebrow="سامانه کسب و کار"
          title="آژانس‌های املاک"
          buttonText="بیشتر بدانید"
          activeIndex={0}
          totalItems={3}
        />

        <section
          className="flex flex-col gap-4 border-t-[16px] border-[#f0f0f0] bg-white pt-4"
          aria-labelledby="latest-mashhad-title"
        >
          <div className="flex items-center justify-start px-4">
            <h2
              className="m-0 text-right text-base font-bold leading-6 text-[#1a1a1a]"
              id="latest-mashhad-title"
            >
              آخرین آگهی‌های مشهد
            </h2>
          </div>

          <div className="flex flex-col gap-2">
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
      />

      <HomeSearchScreen
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      <CitySelectionScreen
        currentCity={selectedCity}
        isOpen={isCityOpen}
        onClose={() => setIsCityOpen(false)}
        onConfirm={(city) => {
          setSelectedCity(city);
          setIsCityOpen(false);
        }}
      />
    </PageFrame>
  );
}
