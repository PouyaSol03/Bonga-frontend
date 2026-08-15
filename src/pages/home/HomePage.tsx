import { useMemo, useState } from "react";
import "./homeArtwork.css";


import { CategoryBottomSheet } from "./components/CategoryBottomSheet";
import { HomeSearchScreen } from "./components/HomeSearchScreen";
import type { CategoryOption, QuickAction } from "./homeTypes";
import ArrowDown from "../../shared/assets/icons/ArrowDown";
import ShenasaVector from "../../shared/assets/icons/ShenasaVector";
import IranShenasaTypo from "../../shared/assets/icons/IranShenasaTypo";
import { BusinessFeatureSection } from "./components/BusinessFeatureSection";
import { HomeStatsSection } from "./components/HomeStatsSection";
import { TrustedPartnersSection } from "./components/TrustedPartnersSection";
import { PopularAdsSection } from "./components/PopularAdsSection";

import { getApiErrorMessage } from "../../core/api/api";
import { useCategoryListQuery } from "../../core/hooks/category.hooks";
import { useNotificationUnreadCountQuery } from "../../core/hooks/notification.hooks";
import type { CategoryItem } from "../../core/services/category.service";
import { getRequestErrorState } from "../../shared/components/ErrorState";
import { getStoredAuthSession } from "../../core/auth/auth-storage";
import { readStoredSelectedCity } from "../../shared/lib/selectedCityStorage";

import SaleCategoryIcon from "../../shared/assets/icons/SaleCategoryIcon.svg";
import RentCategoryIcon from "../../shared/assets/icons/RentCategoryIcon.svg";
import ProjectCategoryIcon from "../../shared/assets/icons/ProjectCategoryIcon.svg";
import ConsultantCategoryIcon from "../../shared/assets/icons/ConsultantCategoryIcon.svg";
import LinearNotification from "../../shared/icons/LinearNotification";
import LinearSearch from "../../shared/icons/LinearSearch";
import { Typography } from "../../shared/ui/Typography";
import { Button } from "../../shared/ui/Button";
import { pushRoute } from "../../app/router/navigation";
import { SEO } from "../../shared/components/SEO";

const categoryIconMap: Record<string, string> = {
  sale: SaleCategoryIcon,
  rent: RentCategoryIcon,
  project: ProjectCategoryIcon,
  consultants: ConsultantCategoryIcon,
};

const categoryFormCodeLabelMap: Record<string, string> = {
  "فروش:آپارتمان": "sale-apartment",
  "فروش:خانه ویلایی": "sale-villa-house",
  "فروش:زمین": "sale-land",
  "فروش:باغ، ویلا": "sale-garden-villa",
  "فروش:دفتر کار، اتاق اداری و مطب": "sale-office",
  "فروش:واحد اداری": "sale-office",
  "فروش:مغازه و غرفه": "sale-commercial",
  "فروش:واحد تجاری": "sale-commercial",
  "فروش:صنعتی، کشاورزی و تجاری": "sale-warehouse",
  "فروش:انبار، سوله": "sale-warehouse",
  "فروش:کارخانه، کارگاه": "sale-factory",
  "فروش:اقامتگاه و هتل": "sale-hotel",
  "فروش:هتل، هتل آپارتمان": "sale-hotel",
  "اجاره:آپارتمان": "rent-apartment",
  "اجاره:خانه ویلایی": "rent-villa-house",
  "اجاره:باغ، ویلا": "rent-garden-villa",
  "اجاره:اتاق و سوییت": "daily-apartment-suite",
  "اجاره:آپارتمان، سوئیت": "daily-apartment-suite",
  "اجاره:دفتر کار، اتاق اداری و مطب": "rent-office",
  "اجاره:واحد اداری": "rent-office",
  "اجاره:مغازه و غرفه": "rent-commercial",
  "اجاره:واحد تجاری": "rent-commercial",
  "اجاره:انبار و کارگاه": "rent-warehouse",
  "اجاره:انبار، سوله": "rent-warehouse",
  "اجاره:کارخانه، کارگاه": "rent-factory-workshop",
  "اجاره:اقامتگاه و هتل": "rent-hotel",
  "اجاره:هتل، هتل آپارتمان": "rent-hotel",
  "پروژه:مسکونی": "presale-special",
  "پروژه:اداری و تجاری": "presale-special",
  "پروژه:ویلایی": "presale-special",
  "پروژه:زمین": "partnership",
  "پروژه:پیش فروش، فروش پروژه": "presale-special",
  "پروژه:مشارکت": "partnership",
};

const knownAdvertiseFormCodes = new Set(Object.values(categoryFormCodeLabelMap));

function normalizeCategoryCodeAsFormCode(code?: string) {
  if (!code) return "";
  if (knownAdvertiseFormCodes.has(code)) return code;
  if (/^(sale|rent|daily)-/.test(code) || code === "partnership" || code === "presale-special") return code;

  return "";
}

function getCategorySelectionFormCode(category: CategoryOption | QuickAction | undefined, parent: QuickAction | null) {
  const directFormCode = normalizeCategoryCodeAsFormCode(category?.formCode ?? category?.code);

  if (directFormCode) return directFormCode;

  if (!category || !parent) return "";

  return categoryFormCodeLabelMap[`${parent.label}:${category.label}`] ?? "";
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

type SelectedCity = {
  id?: string;
  name: string;
};

function mapCategoryToQuickAction(category: CategoryItem): QuickAction {
  return {
    code: category.code,
    formCode: normalizeCategoryCodeAsFormCode(category.code),
    id: category.id,
    label: category.name,
    icon: categoryIconMap[category.code] ?? SaleCategoryIcon,
    options: category.children?.map(mapCategoryToOption) ?? [],
  };
}

function mapCategoryToOption(category: CategoryItem): CategoryOption {
  return {
    code: category.code,
    formCode: normalizeCategoryCodeAsFormCode(category.code),
    id: category.id,
    label: category.name,
    children: category.children?.map(mapCategoryToOption) ?? [],
  };
}

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
  const [selectedCity] = useState(getStoredCity);
  const {
    data: categories = [],
    error: categoryError,
    isError: isCategoryError,
    isLoading: isCategoryLoading,
    refetch: refetchCategories,
  } = useCategoryListQuery();
  const { data: unreadNotificationsCount = 0 } = useNotificationUnreadCountQuery({
    enabled: hasAuthSession,
  });

  const quickActions = useMemo(() => {
    const apiCategories = categories
      .map(mapCategoryToQuickAction)
      .filter((item) => !isConsultantsCategory(item));

    return [...apiCategories, consultantCategory];
  }, [categories]);
  const isCategorySheetOpen = selectedCategory !== null;
  const PageErrorState = getRequestErrorState(categoryError);

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

  if (isCategoryError) {
    return (
      <div className="fixed inset-0 z-[999] bg-white">
        <PageErrorState
          className="h-full"
          onRetry={async () => {
            await refetchCategories();
          }}
        />
      </div>
    );
  }

  return (
    <div className="flex h-[100dvh] min-h-0 flex-col overflow-hidden bg-[#f0f0f0]" dir="rtl">
      <SEO 
        title="خرید، فروش، رهن و اجاره آپارتمان و خانه | سامانه املاک بنگاه" 
        description="سامانه هوشمند املاک بنگاه؛ مرجع تخصصی خرید، فروش، رهن و اجاره آپارتمان، خانه ویلایی، زمین و مغازه. جدیدترین آگهی‌های املاک را در بنگاه جستجو کنید."
        keywords="خرید آپارتمان, فروش آپارتمان, رهن و اجاره خانه, خرید زمین, قیمت آپارتمان, مشاور املاک, سامانه املاک بنگاه"
      />
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
              {unreadNotificationsCount > 0 ? (
                <Typography as="span" variant="body" size="medium" weight="regular"
                  aria-hidden="true"
                  className="absolute right-3.5 top-3 h-2 w-2 rounded-full bg-[#ef1f1f] ring-2 ring-white"
                />
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
            {isCategoryLoading &&
              Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="flex min-h-[58px] flex-col items-center justify-start gap-1.5 bg-white p-0 min-[390px]:min-h-[70px] min-[390px]:gap-[7px]"
                >
                  <div className="h-8 w-8 rounded-full bg-[#f0f0f0] min-[390px]:h-10 min-[390px]:w-10" />
                  <div className="h-3 w-10 rounded bg-[#f0f0f0]" />
                </div>
              ))}

            {!isCategoryLoading &&
              quickActions.map((item) => (
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

          {categoryError && (
            <div className="rounded-lg bg-red-50 px-3 py-2 text-right text-xs font-medium text-red-600">
              {getApiErrorMessage(categoryError, "دریافت دسته‌بندی‌ها با خطا مواجه شد.")}
            </div>
          )}
        </section>

        <BusinessFeatureSection />

        <HomeStatsSection />

        <TrustedPartnersSection />

        <PopularAdsSection cityId={selectedCity.id} />
      </main>

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

    </div>
  );
}
