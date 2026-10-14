import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { PageFrame } from "../../shared/layout/PageFrame";
import { useNavigate } from "react-router";

import { useCitySearchQuery, useMostVisitedCityListQuery } from "../cities/api/city.hooks";
import { useDebouncedValue } from "../../shared/hooks/useDebouncedValue";
import type { CityDto } from "../cities/api/city.service";
import LinearCancel from "../../shared/icons/LinearCancel";
import LinearSearch from "../../shared/icons/LinearSearch";
import {
  readStoredSelectedCity,
  saveSelectedCity,
  selectedCityStorageKeys,
  type StoredSelectedCity,
} from "../../shared/lib/selectedCityStorage";
import { Button } from "../../shared/ui/Button";
import { Typography } from "../../shared/ui/Typography";
import LinearArrowRight2 from "../../shared/icons/LinearArrowRight2";
import { useFcm } from "../notifications/useFcm";

const onboardingSteps = [
  {
    image: "/images/onboarding/first_image.webp",
    eyebrow: "همه‌چیز برای",
    title: "خرید، فروش و اجاره ملک",
    description:
      "هزاران آگهی به‌روز را جستجو کنید، با آگهی‌دهندگان گفتگو کنید و ملک مناسب خود را سریع‌تر پیدا کنید.",
  },
  {
    image: "/images/onboarding/second_image.webp",
    eyebrow: "آگهی خود را",
    title: "رایگان منتشر کنید",
    description: "ملک خود را مستقیماً ثبت کنید یا انتشار آن را به یک آژانس حرفه‌ای بسپارید.",
  },
  {
    image: "/images/onboarding/third_image.webp",
    eyebrow: "با مشاوران و",
    title: "آژانس‌های معتبر در ارتباط باشید",
    description:
      "مشاوران و آژانس‌ها را مقایسه کنید، امتیازها و نشان‌های آن‌ها را ببینید و با اطمینان انتخاب کنید.",
  },
  {
    image: "/images/onboarding/fourth_image.webp",
    eyebrow: "سامانه هوشمند",
    title: "کسب‌و‌کار املاک",
    description:
      "اگر مشاور یا آژانس هستید، آگهی‌ها، مشتریان، فایل‌ها، معاملات و تیم خود را در یک پنل حرفه‌ای مدیریت کنید.",
  },
  {
    image: "/images/onboarding/fifth_image.webp",
    eyebrow: "همه ابزارهای موردنیاز",
    title: "در یک سامانه متمرکز",
    description:
      "چت، کیف پول، گزارش‌های آماری، درخواست‌های ملکی، مدیریت فایل‌ها و ده‌ها قابلیت دیگر، همه در کنار هم.",
  },
] as const;

const ONBOARDING_STEP_COUNT = onboardingSteps.length;
const citySelectionImage = "/images/onboarding/sixth_image.webp";
const ONBOARDING_SECOND_LAYER = "var(--color-primary-container)";
const ONBOARDING_THIRD_LAYER = "var(--color-surface-container-high)";

type SelectableCity = StoredSelectedCity & {
  key: string;
};

function mapCity(city: CityDto): SelectableCity | null {
  const id = String(city.id ?? city._id ?? "").trim();
  const name = city.name?.trim();

  if (!name) return null;

  return {
    id: id || undefined,
    key: id || name,
    latitude: city.lat,
    longitude: city.lng,
    name,
  };
}

function dedupeCities(cities: CityDto[]) {
  const unique = new Map<string, SelectableCity>();

  cities.forEach((city) => {
    const mappedCity = mapCity(city);
    if (!mappedCity) return;

    unique.set(mappedCity.key, mappedCity);
  });

  return Array.from(unique.values());
}

function readExplicitlyStoredCity() {
  const storedName = window.localStorage.getItem(selectedCityStorageKeys.name)?.trim();

  return storedName ? readStoredSelectedCity() : null;
}

export function OnboardingPage() {
  const [stepIndex, setStepIndex] = useState(0);
  const [isCityStep, setIsCityStep] = useState(
    () => new URLSearchParams(window.location.search).get("city") === "1",
  );
  const shouldReduceMotion = useReducedMotion();
  const { requestToken, permission, isSupported } = useFcm();

  useEffect(() => {
    // Directly request notification permission right upon entering onboarding
    if (isSupported && permission === "default") {
      void requestToken().catch(() => undefined);
    }
  }, [isSupported, permission, requestToken]);

  useEffect(() => {
    const sources = [...onboardingSteps.map((step) => step.image), citySelectionImage];

    sources.forEach((src) => {
      const image = new Image();
      image.src = src;

      if (typeof image.decode === "function") {
        void image.decode().catch(() => undefined);
      }
    });
  }, []);

  const showCityStep = () => setIsCityStep(true);

  const goToStep = (nextStepIndex: number) => {
    if (nextStepIndex === stepIndex) return;
    if (nextStepIndex < 0 || nextStepIndex >= ONBOARDING_STEP_COUNT) return;

    setStepIndex(nextStepIndex);
  };

  const goToNextStep = () => {
    if (stepIndex >= ONBOARDING_STEP_COUNT - 1) {
      showCityStep();
      return;
    }

    goToStep(stepIndex + 1);
  };

  const goToPrevStep = () => {
    if (stepIndex > 0) {
      goToStep(stepIndex - 1);
    }
  };

  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);

  const handleTouchStart = (event: React.TouchEvent) => {
    const touch = event.touches[0];
    if (!touch) return;
    touchStartXRef.current = touch.clientX;
    touchStartYRef.current = touch.clientY;
  };

  const handleTouchEnd = (event: React.TouchEvent) => {
    if (touchStartXRef.current === null || touchStartYRef.current === null) return;
    const touch = event.changedTouches[0];
    if (!touch) return;

    const diffX = touch.clientX - touchStartXRef.current;
    const diffY = touch.clientY - touchStartYRef.current;

    touchStartXRef.current = null;
    touchStartYRef.current = null;

    if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX < -40) {
        goToNextStep();
      } else if (diffX > 40) {
        goToPrevStep();
      }
    }
  };

  if (isCityStep) {
    return <OnboardingCitySelectionPage />;
  }

  return (
    <PageFrame
      className="bg-surface-container-lowest text-on-surface relative flex h-full min-h-0 flex-col overflow-hidden"
      dir="rtl"
      variant="flush"
    >
      <main
        className="min-h-0 flex-1 touch-pan-y overflow-x-hidden overflow-y-auto px-4 pt-0 select-none"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="mx-auto flex min-h-full w-full max-w-[500px] flex-col items-center pt-0 pb-2">
          <div className="relative w-full shrink-0 pt-0 pb-5">
            <div className="relative aspect-[328/360] w-full">
              <div
                aria-hidden="true"
                className="absolute inset-x-[8%] top-[20px] bottom-[-20px] z-0 rounded-3xl"
                style={{ backgroundColor: ONBOARDING_THIRD_LAYER }}
              />
              <div
                aria-hidden="true"
                className="absolute inset-x-[4%] top-[10px] bottom-[-10px] z-10 rounded-3xl"
                style={{ backgroundColor: ONBOARDING_SECOND_LAYER }}
              />

              <AnimatePresence initial={false} mode="wait">
                <motion.div
                  key={stepIndex}
                  aria-hidden="true"
                  className="bg-surface-container-lowest relative z-20 h-full w-full origin-top overflow-hidden rounded-3xl will-change-[transform,opacity] [backface-visibility:hidden]"
                  initial={
                    shouldReduceMotion
                      ? false
                      : {
                          opacity: 0.72,
                          y: 10,
                          scaleX: 0.92,
                          scaleY: 0.985,
                        }
                  }
                  animate={{
                    opacity: 1,
                    y: 0,
                    scaleX: 1,
                    scaleY: 1,
                  }}
                  exit={
                    shouldReduceMotion
                      ? { opacity: 0 }
                      : {
                          opacity: 0,
                          y: -18,
                          scaleX: 1.015,
                          scaleY: 1.005,
                        }
                  }
                  transition={{
                    duration: shouldReduceMotion ? 0.01 : 0.34,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <img
                    alt=""
                    className="block h-full w-full object-cover object-top"
                    decoding="async"
                    draggable={false}
                    src={onboardingSteps[stepIndex].image}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="my-auto flex min-h-[168px] w-full max-w-[328px] items-center justify-center text-center">
            <AnimatePresence initial={false} mode="wait">
              <motion.div
                key={stepIndex}
                initial={
                  shouldReduceMotion
                    ? false
                    : {
                        opacity: 0,
                        y: 12,
                      }
                }
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={
                  shouldReduceMotion
                    ? { opacity: 0 }
                    : {
                        opacity: 0,
                        y: -12,
                      }
                }
                transition={{
                  duration: shouldReduceMotion ? 0.01 : 0.24,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="flex w-full [transform:translateZ(0)] flex-col items-center will-change-[transform,opacity] [backface-visibility:hidden]"
              >
                <Typography
                  as="p"
                  className="text-on-surface m-0"
                  variant="title"
                  size="medium"
                  weight="semibold"
                >
                  {onboardingSteps[stepIndex].eyebrow}
                </Typography>

                <Typography
                  as="h1"
                  className="text-primary m-0 mt-1.5"
                  variant="title"
                  size="large"
                  weight="semibold"
                >
                  {onboardingSteps[stepIndex].title}
                </Typography>

                <Typography
                  as="p"
                  className="text-outline m-0 mt-3 px-4 text-center"
                  variant="body"
                  size="medium"
                  weight="regular"
                >
                  {onboardingSteps[stepIndex].description}
                </Typography>
              </motion.div>
            </AnimatePresence>
          </div>

          <div
            className="mt-6 mb-4 flex h-6 shrink-0 items-center justify-center gap-2 [direction:ltr]"
            aria-label={`مرحله ${stepIndex + 1} از ${ONBOARDING_STEP_COUNT}`}
            role="group"
          >
            {Array.from({ length: ONBOARDING_STEP_COUNT }).map((_, index) => {
              const isActive = index === stepIndex;

              return (
                <motion.button
                  aria-label={`رفتن به مرحله ${index + 1}`}
                  aria-current={isActive ? "step" : undefined}
                  className={
                    isActive
                      ? "bg-primary focus-visible:ring-primary/30 h-2 cursor-pointer rounded-full border-0 p-0 outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                      : "bg-primary-container focus-visible:ring-primary/30 h-2 cursor-pointer rounded-full border-0 p-0 outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                  }
                  animate={{ width: isActive ? 24 : 8 }}
                  whileTap={shouldReduceMotion ? undefined : { scale: 0.92 }}
                  transition={{ duration: shouldReduceMotion ? 0.01 : 0.2 }}
                  key={index}
                  onClick={() => goToStep(index)}
                  type="button"
                />
              );
            })}
          </div>
        </div>
      </main>

      <footer className="border-outline-var bg-surface-container-lowest shrink-0 border-t px-4 pt-3 pb-4">
        <div className="mx-auto flex w-full max-w-[500px] justify-center">
          <div className="flex w-full gap-4 [direction:rtl]">
            <Button
              className="h-10 flex-1 rounded-[10px]"
              onClick={goToNextStep}
              onMouseDown={(event) => {
                event.preventDefault();
              }}
              size="x-medium"
              leadingIcon={<LinearArrowRight2 className="h-5 w-5" />}
              type="button"
              variant="secondary"
            >
              بعدی
            </Button>

            <Button
              className="text-outline border-outline-var h-10 flex-1 rounded-[10px]"
              trailingIcon={<LinearCancel className="h-5 w-5" />}
              onClick={showCityStep}
              size="x-medium"
              type="button"
              variant="neutral-outline"
            >
              رد کردن
            </Button>
          </div>
        </div>
      </footer>
    </PageFrame>
  );
}

function OnboardingCitySelectionPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState<StoredSelectedCity | null>(
    readExplicitlyStoredCity,
  );
  const [hasExplicitCitySelection, setHasExplicitCitySelection] = useState(() =>
    Boolean(readExplicitlyStoredCity()),
  );
  const debouncedQuery = useDebouncedValue(query.trim(), 250);

  const { data: popularCityDtos = [], isLoading: isPopularCitiesLoading } =
    useMostVisitedCityListQuery();
  const { data: searchedCityDtos = [], isFetching: isSearchingCities } = useCitySearchQuery({
    enabled: debouncedQuery.length > 0,
    q: debouncedQuery,
  });

  const popularCities = useMemo(() => dedupeCities(popularCityDtos).slice(0, 6), [popularCityDtos]);
  const searchedCities = useMemo(
    () => dedupeCities(searchedCityDtos).slice(0, 6),
    [searchedCityDtos],
  );

  const isSearching = query.trim().length > 0;
  const visibleCities = isSearching ? searchedCities : popularCities;
  const isCityListLoading = isSearching ? isSearchingCities : isPopularCitiesLoading;

  const selectCity = (city: SelectableCity) => {
    setHasExplicitCitySelection(true);
    setSelectedCity({
      id: city.id,
      latitude: city.latitude,
      longitude: city.longitude,
      name: city.name,
    });
  };

  const start = () => {
    if (!hasExplicitCitySelection || !selectedCity) return;

    saveSelectedCity(selectedCity);
    navigate("/home", { replace: true });
  };

  return (
    <PageFrame
      className="bg-surface-container-lowest text-on-surface relative flex h-full min-h-0 flex-col overflow-hidden"
      dir="rtl"
      variant="flush"
    >
      <main className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto px-4 pt-0">
        <div className="mx-auto flex w-full max-w-[500px] flex-col items-center pt-0 pb-6">
          <div className="relative w-full shrink-0 pt-0 pb-5">
            <div className="relative aspect-[328/360] w-full">
              <div
                aria-hidden="true"
                className="absolute inset-x-[8%] top-[20px] bottom-[-20px] z-0 rounded-3xl"
                style={{ backgroundColor: ONBOARDING_THIRD_LAYER }}
              />
              <div
                aria-hidden="true"
                className="absolute inset-x-[4%] top-[10px] bottom-[-10px] z-10 rounded-3xl"
                style={{ backgroundColor: ONBOARDING_SECOND_LAYER }}
              />

              <div
                aria-hidden="true"
                className="bg-surface-container-lowest relative z-20 h-full w-full overflow-hidden rounded-3xl"
              >
                <img
                  alt=""
                  className="block h-full w-full object-cover object-top"
                  decoding="async"
                  draggable={false}
                  src={citySelectionImage}
                />
              </div>
            </div>
          </div>

          <div className="my-6 w-full text-center">
            <Typography
              as="h1"
              className="text-on-surface m-0"
              size="large"
              variant="label"
              weight="semibold"
            >
              شهر خود را انتخاب کنید
            </Typography>
            <Typography
              as="p"
              className="text-outline m-0 mt-2"
              size="medium"
              variant="body"
              weight="regular"
            >
              برای نمایش آگهی‌ها، آژانس‌ها و مشاوران نزدیک شما،
              <br />
              شهر محل فعالیت یا سکونت خود را انتخاب کنید.
            </Typography>
          </div>

          <label className="relative mt-4 block h-12 w-full">
            <Typography as="span" className="sr-only" size="small" variant="body" weight="regular">
              جستجوی شهر
            </Typography>
            <input
              autoComplete="off"
              className="bg-surface-container text-on-surface placeholder:text-outline focus:ring-primary/20 h-12 w-full rounded-[12px] border-0 py-0 pr-4 pl-12 text-right outline-none focus:ring-2"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="جستجوی شهر..."
              type="search"
              value={query}
            />
            <LinearSearch className="text-on-surface pointer-events-none absolute top-1/2 left-3.5 h-6 w-6 -translate-y-1/2" />
          </label>

          <div className="mt-8 w-full">
            <Typography
              as="h2"
              className="text-on-surface m-0 text-right"
              size="medium"
              variant="label"
              weight="medium"
            >
              {isSearching ? "نتایج جستجو" : "شهرهای پرکاربرد"}
            </Typography>

            <div className="mt-2 grid grid-cols-3 gap-2">
              {isCityListLoading
                ? Array.from({ length: 6 }).map((_, index) => (
                    <span
                      className="bg-surface-container h-9 animate-pulse rounded-[8px]"
                      key={index}
                    />
                  ))
                : visibleCities.map((city) => {
                    const isSelected = Boolean(
                      hasExplicitCitySelection &&
                      selectedCity &&
                      city.name === selectedCity.name &&
                      (!city.id || city.id === selectedCity.id),
                    );

                    return (
                      <Button
                        unstyled
                        aria-pressed={isSelected}
                        className={
                          isSelected
                            ? "border-primary bg-primary/10 text-primary flex h-9 min-w-0 items-center justify-center rounded-[8px] border px-2"
                            : "border-outline-var bg-surface-container-lowest text-on-surface-var flex h-9 min-w-0 items-center justify-center rounded-[8px] border px-2"
                        }
                        key={city.key}
                        onClick={() => selectCity(city)}
                        type="button"
                      >
                        <Typography
                          as="span"
                          className="truncate"
                          size="medium"
                          variant="body"
                          weight="regular"
                        >
                          {city.name}
                        </Typography>
                      </Button>
                    );
                  })}
            </div>

            {!isCityListLoading && visibleCities.length === 0 ? (
              <Typography
                as="p"
                className="text-outline m-0 mt-4 text-center"
                size="small"
                variant="body"
                weight="regular"
              >
                شهری پیدا نشد.
              </Typography>
            ) : null}
          </div>
        </div>
      </main>

      <footer className="border-outline-var bg-surface-container-lowest shrink-0 border-t px-4 pt-3 pb-4">
        <div className="mx-auto flex w-full max-w-[500px] justify-center">
          <Button
            className="h-10 w-full rounded-[10px]"
            disabled={!hasExplicitCitySelection || !selectedCity}
            onClick={start}
            size="x-medium"
            leadingIcon={<LinearArrowRight2 className="h-5 w-5" />}
            type="button"
            variant="primary"
          >
            شروع کنید
          </Button>
        </div>
      </footer>
    </PageFrame>
  );
}
