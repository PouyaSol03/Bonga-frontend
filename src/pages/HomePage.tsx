import { useCallback, useMemo, useRef, useState } from "react";
import "./home/homeArtwork.css";

import { AdCard } from "../components/AdCard";

import { CategoryBottomSheet } from "./home/components/CategoryBottomSheet";
import { CitySelectionScreen } from "./home/components/CitySelectionScreen";
import { HomeSearchScreen } from "./home/components/HomeSearchScreen";
import type { CategoryOption, QuickAction } from "./home/homeTypes";
import ArrowDown from "../assets/icons/ArrowDown";
import ShenasaVector from "../assets/icons/ShenasaVector";
import IranShenasaTypo from "../assets/icons/IranShenasaTypo";
import { BusinessBanner } from "./home/components/BusinessBanner";

import { getApiErrorMessage } from "../api/api";
import { useAdvertisementInfiniteQuery } from "../hooks/advertisement.hooks";
import { useCategoryListQuery } from "../hooks/category.hooks";
import { useNotificationUnreadCountQuery } from "../hooks/notification.hooks";
import {
  mapAdvertisementToAdCard,
} from "../services/advertisement.service";
import type { CategoryItem } from "../services/category.service";
import { getRequestErrorState } from "../components/ErrorState";
import { getStoredAuthSession } from "../auth/auth-storage";
import { readStoredSelectedCity } from "../lib/selectedCityStorage";

import SaleCategoryIcon from "../assets/icons/SaleCategoryIcon.svg";
import RentCategoryIcon from "../assets/icons/RentCategoryIcon.svg";
import ProjectCategoryIcon from "../assets/icons/ProjectCategoryIcon.svg";
import ConsultantCategoryIcon from "../assets/icons/ConsultantCategoryIcon.svg";
import LinearNotification from "../components/(icons)/LinearNotification";
import LinearSearch from "../components/(icons)/LinearSearch";
import { Typography } from "../components/ui/Typography";
import { Button } from "../components/ui/Button";

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
    to: "/account/manage-ads",
  },
];

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

function HomeAdCardSkeleton() {
  return (
    <article className="overflow-hidden bg-white">
      <div className="p-4 pb-3">
        <div className="aspect-[328/219] w-full rounded-2xl bg-[#f0f0f0]" />

        <div className="mt-3 flex">
          <div className="h-6 w-44 rounded-full bg-[#f0f0f0]" />
        </div>

        <div className="mt-3 flex items-center justify-start gap-7">
          <div className="h-5 w-20 rounded-full bg-[#f0f0f0]" />
          <div className="h-5 w-20 rounded-full bg-[#f0f0f0]" />
          <div className="h-5 w-20 rounded-full bg-[#f0f0f0]" />
        </div>

        <div className="mt-4 h-5 w-full rounded-full bg-[#f0f0f0]" />

        <div className="mt-4 flex justify-start">
          <div className="h-6 w-44 rounded-full bg-[#f0f0f0]" />
        </div>
      </div>
    </article>
  );
}

export function HomePage() {
  const hasAuthSession = Boolean(getStoredAuthSession());
  const [selectedCategory, setSelectedCategory] = useState<QuickAction | null>(
    null,
  );
  const [selectedFormCode, setSelectedFormCode] = useState("");

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCityOpen, setIsCityOpen] = useState(false);

  const [selectedCity, setSelectedCity] = useState(getStoredCity);
  const loadMoreObserverRef = useRef<IntersectionObserver | null>(null);
  const {
    data: categories = [],
    error: categoryError,
    isError: isCategoryError,
    isLoading: isCategoryLoading,
    refetch: refetchCategories,
  } = useCategoryListQuery();
  const {
    data: advertisementPages,
    error: advertisementError,
    fetchNextPage,
    hasNextPage,
    isError: isAdvertisementError,
    isFetchingNextPage,
    isLoading: isAdvertisementLoading,
    refetch: refetchAdvertisements,
  } = useAdvertisementInfiniteQuery({
    cityId: selectedCity.id,
    filters: selectedFormCode ? { formCode: selectedFormCode } : undefined,
    perPage: 10,
  });
  const { data: unreadNotificationsCount = 0 } = useNotificationUnreadCountQuery({
    enabled: hasAuthSession,
  });

  const quickActions = useMemo(
    () => categories.map(mapCategoryToQuickAction),
    [categories],
  );
  const advertisements = useMemo(
    () =>
      advertisementPages?.pages.flatMap((page, pageIndex) =>
        page.data.map((ad, adIndex) =>
          mapAdvertisementToAdCard(ad, pageIndex * 10 + adIndex),
        ),
      ) ?? [],
    [advertisementPages],
  );

  const loadMoreTriggerIndex = Math.max(advertisements.length - 3, 0);

  const isCategorySheetOpen = selectedCategory !== null;
  const pageError = categoryError ?? advertisementError;
  const PageErrorState = getRequestErrorState(pageError);

  const loadMoreSentinelRef = useCallback(
    (node: HTMLDivElement | null) => {
      loadMoreObserverRef.current?.disconnect();
      loadMoreObserverRef.current = null;

      if (!node || !hasNextPage || isFetchingNextPage) {
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
            void fetchNextPage();
          }
        },
        { root: null, rootMargin: "240px 0px", threshold: 0 },
      );

      observer.observe(node);
      loadMoreObserverRef.current = observer;
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage],
  );

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
    window.history.pushState({}, "", queryString ? `/search?${queryString}` : "/search");
    window.dispatchEvent(new PopStateEvent("popstate"));
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

  if (isCategoryError || isAdvertisementError) {
    return (
      <div className="fixed inset-0 z-[999] bg-white">
        <PageErrorState
          className="h-full"
          onRetry={async () => {
            await Promise.all([
              isCategoryError ? refetchCategories() : Promise.resolve(),
              isAdvertisementError ? refetchAdvertisements() : Promise.resolve(),
            ]);
          }}
        />
      </div>
    );
  }

  return (
    <div className="flex h-[100dvh] min-h-0 flex-col overflow-hidden bg-[#f0f0f0]" dir="rtl">
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
              onClick={() => setIsCityOpen(true)}
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

      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-[#f0f0f0] pb-[96px] [-webkit-overflow-scrolling:touch]">
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

        <BusinessBanner slides={businessBannerSlides} />

        <section
          className="flex flex-col gap-4 border-t-[16px] border-[#f0f0f0] bg-white pt-4"
          aria-labelledby="latest-mashhad-title"
        >
          <div className="flex items-center justify-start px-4">
            <Typography as="h2" variant="title" size="medium" weight="semibold"
              className="m-0 text-right text-sm font-bold leading-5 text-[#1a1a1a] min-[390px]:text-base min-[390px]:leading-6"
              id="latest-mashhad-title"
            >
              آخرین آگهی‌های {selectedCity.name}
            </Typography>
          </div>

          <div className="flex flex-col gap-3 bg-[#f0f0f0]">
            {isAdvertisementLoading &&
              Array.from({ length: 3 }).map((_, index) => (
                <HomeAdCardSkeleton key={index} />
              ))}

            {!isAdvertisementLoading &&
              advertisements.map((ad, index) => {
                const shouldAttachLoadMoreRef =
                  index === loadMoreTriggerIndex &&
                  hasNextPage &&
                  !isFetchingNextPage;

                return (
                  <div
                    key={ad.id}
                    ref={shouldAttachLoadMoreRef ? loadMoreSentinelRef : undefined}
                  >
                    <AdCard ad={ad} />
                  </div>
                );
              })}

            {false && (
              <>
                <PageErrorState
                  className="min-h-[420px]"
                  onRetry={() => undefined}
                />
                <Typography as="p" variant="body" size="medium" weight="regular" className="sr-only">
                  {getApiErrorMessage(advertisementError, "دریافت آگهی‌ها با خطا مواجه شد.")}
                </Typography>
              </>
            )}

            {!isAdvertisementLoading && !isAdvertisementError && advertisements.length === 0 && (
              <div className="bg-white px-4 py-8 text-center text-sm font-medium text-[#808080]">
                آگهی‌ای برای این شهر یافت نشد.
              </div>
            )}

            {false && (
              <div className="bg-white px-4 py-4 text-right text-xs font-medium text-red-600">
                {getApiErrorMessage(advertisementError, "دریافت آگهی‌ها با خطا مواجه شد.")}
              </div>
            )}


            {isFetchingNextPage &&
              Array.from({ length: 2 }).map((_, index) => (
                <HomeAdCardSkeleton key={`next-page-skeleton-${index}`} />
              ))}
          </div>
        </section>
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

          setSelectedFormCode(formCode);
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

      <CitySelectionScreen
        currentCity={selectedCity.name}
        isOpen={isCityOpen}
        onClose={() => setIsCityOpen(false)}
        onConfirm={(city) => {
          setSelectedCity(city);
          window.sessionStorage.setItem("bonga-selected-city", city.name);
          setIsCityOpen(false);
        }}
      />
    </div>
  );
}
