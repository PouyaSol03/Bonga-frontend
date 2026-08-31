import { lazy, Suspense, useEffect, useState } from "react";
import "./homeArtwork.css";


import type { CategoryOption, QuickAction } from "./homeTypes";
import ArrowDown from "../../shared/assets/icons/ArrowDown";
import ShenasaVector from "../../shared/assets/icons/ShenasaVector";
import IranShenasaTypo from "../../shared/assets/icons/IranShenasaTypo";
import { BusinessFeatureSection } from "./components/BusinessFeatureSection";
import { HomeStatsSection } from "./components/HomeStatsSection";
import { TrustedPartnersSection } from "./components/TrustedPartnersSection";
import { PopularAdsSection } from "./components/PopularAdsSection";

import { getStoredAuthSession } from "../../shared/auth/auth-storage";
import { readStoredSelectedCity } from "../../shared/lib/selectedCityStorage";

import SaleCategoryIcon from "../../shared/assets/icons/SaleCategoryIcon.svg";
import RentCategoryIcon from "../../shared/assets/icons/RentCategoryIcon.svg";
import ProjectCategoryIcon from "../../shared/assets/icons/ProjectCategoryIcon.svg";
import ConsultantCategoryIcon from "../../shared/assets/icons/ConsultantCategoryIcon.svg";
import LinearNotification from "../../shared/icons/LinearNotification";
import LinearSearch from "../../shared/icons/LinearSearch";
import { Typography } from "../../shared/ui/Typography";
import { Button } from "../../shared/ui/Button";
import { pushRoute } from "../../shared/navigation/navigation";
import { SEO } from "../../shared/components/SEO";

const UnreadNotificationBadge = lazy(() =>
  import("../notifications/components/UnreadNotificationBadge").then((module) => ({
    default: module.UnreadNotificationBadge,
  })),
);

const CategoryBottomSheet = lazy(() =>
  import("./components/CategoryBottomSheet").then((module) => ({
    default: module.CategoryBottomSheet,
  })),
);

const HomeSearchScreen = lazy(() =>
  import("./components/HomeSearchScreen").then((module) => ({
    default: module.HomeSearchScreen,
  })),
);

import {
  categoryGroupsByTransaction,
  categoryLabels,
  getAdvertiseFormCode,
  type CategoryKey,
  type TransactionType,
} from "../search/SearchMapFilterPage";

function getCategorySelectionFormCode(category: CategoryOption | QuickAction | undefined, parent: QuickAction | null) {
  if (category?.formCode) return category.formCode;
  if (!category || !parent) return "";
  const transaction = (parent.code ?? "sale") as TransactionType;
  const categoryKey = (category.code ?? category.id) as CategoryKey;
  if (["sale", "rent", "project"].includes(transaction) && categoryKey) {
    return getAdvertiseFormCode(transaction, categoryKey);
  }
  return "";
}

function isConsultantsCategory(item: QuickAction) {
  return item.code === "consultants" || item.label.includes("مشاور");
}

const consultantCategory: QuickAction = {
  code: "consultants",
  icon: ConsultantCategoryIcon,
  label: "مشاورین",
  options: [
    { code: "agency", label: "آژانس" },
    { code: "consultant", label: "مشاور" },
  ],
};

const defaultQuickActions: QuickAction[] = [
  {
    code: "sale",
    formCode: "",
    id: "sale",
    label: "فروش",
    icon: SaleCategoryIcon,
    options: categoryGroupsByTransaction.sale.map((group) => ({
      id: group.title,
      label: group.title,
      children: group.items.map((key) => ({
        id: key,
        label: categoryLabels[key],
        code: key,
        formCode: getAdvertiseFormCode("sale", key),
      })),
    })),
  },
  {
    code: "rent",
    formCode: "",
    id: "rent",
    label: "اجاره",
    icon: RentCategoryIcon,
    options: categoryGroupsByTransaction.rent.map((group) => ({
      id: group.title,
      label: group.title,
      children: group.items.map((key) => ({
        id: key,
        label: categoryLabels[key],
        code: key,
        formCode: getAdvertiseFormCode("rent", key),
      })),
    })),
  },
  {
    code: "project",
    formCode: "",
    id: "project",
    label: "پروژه",
    icon: ProjectCategoryIcon,
    options: categoryGroupsByTransaction.project.flatMap((group) =>
      group.items.map((key) => ({
        id: key,
        label: categoryLabels[key],
        code: key,
        formCode: getAdvertiseFormCode("project", key),
      })),
    ),
  },
  consultantCategory,
];

type SelectedCity = {
  id?: string;
  name: string;
};

function getStoredCity(): SelectedCity {
  const storedCity = readStoredSelectedCity();

  if (storedCity) {
    return {
      id: storedCity.id,
      name: storedCity.name,
    };
  }

  return {
    id: window.localStorage.getItem("bonga-selected-city-id") ?? undefined,
    name:
      window.localStorage.getItem("bonga-selected-city") ??
      window.sessionStorage.getItem("bonga-selected-city") ??
      "مشهد",
  };
}

export function HomePage() {
  const hasAuthSession = Boolean(getStoredAuthSession());
  const [selectedCategory, setSelectedCategory] = useState<QuickAction | null>(
    null,
  );
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [hasLoadedCategorySheet, setHasLoadedCategorySheet] = useState(false);
  const [hasLoadedSearchScreen, setHasLoadedSearchScreen] = useState(false);
  const [selectedCity] = useState(getStoredCity);
  const quickActions = defaultQuickActions;
  const isCategorySheetOpen = selectedCategory !== null;

  useEffect(() => {
    if (isCategorySheetOpen) setHasLoadedCategorySheet(true);
  }, [isCategorySheetOpen]);

  useEffect(() => {
    if (isSearchOpen) setHasLoadedSearchScreen(true);
  }, [isSearchOpen]);

  const navigateToSearch = (options: { formCode?: string; query?: string } = {}) => {
    const params = new URLSearchParams();
    const cityId =
      selectedCity.id ?? window.localStorage.getItem("bonga-selected-city-id") ?? "";

    if (cityId) {
      params.set("city_id", cityId);
    }

    if (options.formCode) {
      params.set("form_code", options.formCode);
      params.set("from_code", options.formCode);
      params.set("view", "list");
    }

    if (options.query) {
      params.set("query", options.query);
    }

    const queryString = params.toString();

    setIsSearchOpen(false);
    setSelectedCategory(null);
    pushRoute(queryString ? `/search?${queryString}` : "/search");
  };

  const navigateToNotifications = () => {
    window.history.pushState({}, "", "/notifications");
    window.dispatchEvent(new PopStateEvent("popstate"));
  };


  const navigateToConsultants = (mode: "agency" | "consultant" = "agency") => {
    setSelectedCategory(null);
    const nextPath =
      mode === "consultant" ? "/consultants?type=consultant" : "/consultants";

    window.history.pushState({}, "", nextPath);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  return (
    <div className="flex h-[100dvh] min-h-0 flex-col overflow-hidden bg-[#f0f0f0]" dir="rtl">
      <SEO 
        title="خرید، فروش، رهن و اجاره آپارتمان و خانه | سامانه املاک بنگاه" 
        description="سامانه هوشمند املاک بنگاه؛ مرجع تخصصی خرید، فروش، رهن و اجاره آپارتمان، خانه ویلایی، زمین و مغازه. جدیدترین آگهی‌های املاک را در بنگاه جستجو کنید."
        keywords="خرید آپارتمان, فروش آپارتمان, رهن و اجاره خانه, خرید زمین, قیمت آپارتمان, مشاور املاک, سامانه املاک بنگاه"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "بنگاه",
          inLanguage: "fa-IR",
          description: "سامانه هوشمند املاک بنگاه برای خرید، فروش، رهن و اجاره ملک",
        }}
      />
      <h1 className="sr-only">سامانه هوشمند املاک بنگاه برای خرید، فروش، رهن و اجاره ملک</h1>
      <header className="shrink-0 bg-white">
        <section
          className="flex min-h-14 w-full min-w-0 items-center justify-between gap-2 bg-white px-3 py-2 [direction:ltr] min-[390px]:min-h-16 min-[390px]:px-4"
          aria-label="سربرگ"
        >
          <div className="flex items-center justify-center gap-2">
            <Button unstyled
              aria-label="اعلان‌ها"
              className="relative grid h-12 w-12 place-items-center rounded-full text-[#1a1a1a] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#0048c440]"
              onClick={navigateToNotifications}
              type="button"
            >
              <LinearNotification className="h-6 w-6" />
              {hasAuthSession ? (
                <Suspense fallback={null}>
                  <UnreadNotificationBadge
                    className="absolute right-3.5 top-3 h-2 w-2 rounded-full bg-[#ef1f1f] ring-2 ring-white"
                  />
                </Suspense>
              ) : null}
            </Button>

            <Button unstyled
              className="flex items-center justify-center gap-1 rounded-[10px] border border-[#0048C4] px-2 py-2.5 h-10 text-sm font-medium leading-5! text-[#0048C4]"
              type="button"
              onClick={() => pushRoute("/?city=1")}
            >
              <ArrowDown size={20} />
              <Typography as="span" variant="body" size="medium" weight="regular">{selectedCity.name}</Typography>
            </Button>
          </div>

          <div
            className="flex items-end justify-start gap-2 pr-1 min-[390px]:gap-3"
            aria-label="ایران شناسا"
            role="img"
          >
            <IranShenasaTypo />
            <ShenasaVector />
          </div>
        </section>
      </header>

      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-[#f0f0f0] pb-[64px] [-webkit-overflow-scrolling:touch]">
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
              className="h-full w-full rounded-[inherit] border-0 bg-transparent py-0 pr-4 text-right text-sm font-normal leading-5 text-[#1a1a1a] outline-none placeholder:text-[#808080] "
              type="search"
              placeholder="جستجو در آگهی‌ها"
              onFocus={() => setIsSearchOpen(true)}
              onClick={() => setIsSearchOpen(true)}
              readOnly
            />
            <LinearSearch className="h-6 w-6 text-[#4d4d4d] ml-3"/>
          </label>

          <div
            className="home-quick-actions grid grid-cols-4 gap-3 [direction:rtl] min-[390px]:gap-4"
            aria-label="دسته‌بندی‌ها"
          >
            {quickActions.map((item) => (
              <Button unstyled
                className="flex min-h-[58px] min-w-0 cursor-pointer flex-col items-center justify-start gap-0.5 bg-white p-0 text-xs! font-medium! leading-4 text-[#1a1a1a] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#0048c440]"
                key={item.label}
                type="button"
                onClick={() => {
                  if (isConsultantsCategory(item)) {
                    setSelectedCategory({
                      ...consultantCategory,
                      icon: item.icon,
                      label: item.label,
                    });
                    return;
                  }

                  setSelectedCategory(item);
                }}
              >
                <img
                  src={item.icon}
                  alt=""
                  className="h-8 w-8 shrink-0"
                  aria-hidden="true"
                />

                <Typography as="span" variant="body" size="medium" weight="regular">{item.label}</Typography>
              </Button>
            ))}
          </div>
        </section>

        <BusinessFeatureSection />

        <HomeStatsSection />

        <TrustedPartnersSection />

        <PopularAdsSection cityId={selectedCity.id} />
      </main>

      {hasLoadedCategorySheet || isCategorySheetOpen ? (
        <Suspense fallback={null}>
          <CategoryBottomSheet
            isOpen={isCategorySheetOpen}
            selectedCategory={selectedCategory}
            onClose={() => setSelectedCategory(null)}
            onSelectCategory={(category) => {
              if (category?.code === "agency" || category?.code === "consultant") {
                navigateToConsultants(category.code);
                return;
              }

              const formCode = getCategorySelectionFormCode(category, selectedCategory);

              navigateToSearch({ formCode });
            }}
          />
        </Suspense>
      ) : null}

      {hasLoadedSearchScreen || isSearchOpen ? (
        <Suspense fallback={null}>
          <HomeSearchScreen
            isOpen={isSearchOpen}
            onClose={() => setIsSearchOpen(false)}
            onSelectResult={(item) =>
              navigateToSearch({
                formCode: item.formCode,
                query: item.title,
              })
            }
          />
        </Suspense>
      ) : null}
    </div>
  );
}
