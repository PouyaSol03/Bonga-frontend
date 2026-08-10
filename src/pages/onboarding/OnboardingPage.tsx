import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { useCitySearchQuery, useMostVisitedCityListQuery } from "../../core/hooks/city.hooks";
import { useDebouncedValue } from "../../core/hooks/useDebouncedValue";
import type { CityDto } from "../../core/services/city.service";
import LinearArrowLeft1 from "../../shared/icons/LinearArrowLeft1";
import LinearCancel from "../../shared/icons/LinearCancel";
import LinearSearch from "../../shared/icons/LinearSearch";
import {
  saveSelectedCity,
  type StoredSelectedCity,
} from "../../shared/lib/selectedCityStorage";
import { Button } from "../../shared/ui/Button";
import { Typography } from "../../shared/ui/Typography";
import LinearArrowRight2 from "../../shared/icons/LinearArrowRight2";

const onboardingSteps = [
  {
    image: "/images/onboarding/first_image.png",
    eyebrow: "همه‌چیز برای",
    title: "خرید، فروش و اجاره ملک",
    description:
      "هزاران آگهی به‌روز را جستجو کنید، با آگهی‌دهندگان گفتگو کنید و ملک مناسب خود را سریع‌تر پیدا کنید.",
  },
  {
    image: "/images/onboarding/second_image.png",
    eyebrow: "آگهی خود را",
    title: "رایگان منتشر کنید",
    description:
      "ملک خود را مستقیماً ثبت کنید یا انتشار آن را به یک آژانس حرفه‌ای بسپارید.",
  },
  {
    image: "/images/onboarding/third_image.png",
    eyebrow: "با مشاوران و",
    title: "آژانس‌های معتبر در ارتباط باشید",
    description:
      "مشاوران و آژانس‌ها را مقایسه کنید، امتیازها و نشان‌های آن‌ها را ببینید و با اطمینان انتخاب کنید.",
  },
  {
    image: "/images/onboarding/fourth_image.png",
    eyebrow: "سامانه هوشمند",
    title: "کسب‌و‌کار املاک",
    description:
      "اگر مشاور یا آژانس هستید، آگهی‌ها، مشتریان، فایل‌ها، معاملات و تیم خود را در یک پنل حرفه‌ای مدیریت کنید.",
  },
  {
    image: "/images/onboarding/fifth_image.png",
    eyebrow: "همه ابزارهای موردنیاز",
    title: "در یک سامانه متمرکز",
    description:
      "چت، کیف پول، گزارش‌های آماری، درخواست‌های ملکی، مدیریت فایل‌ها و ده‌ها قابلیت دیگر، همه در کنار هم.",
  },
] as const;

const ONBOARDING_STEP_COUNT = onboardingSteps.length;
const citySelectionImage = "/images/onboarding/sixth_image.png";
const ONBOARDING_STACK_SIZE = 3;
const ONBOARDING_LAYER_OFFSET = 40;
const ONBOARDING_LAYER_WIDTHS = [100, 92, 84] as const;
const onboardingDeckImages = [
  ...onboardingSteps.map((step) => step.image),
  citySelectionImage,
] as const;

type OnboardingDeckCard = {
  depth: number;
  imageIndex: number;
  key: string;
  src: string;
};

function getOnboardingDeckCards(stepIndex: number): OnboardingDeckCard[] {
  const lastImageIndex = onboardingDeckImages.length - 1;

  return Array.from({ length: ONBOARDING_STACK_SIZE }, (_, depth) => {
    const requestedImageIndex = stepIndex + depth;
    const imageIndex = Math.min(requestedImageIndex, lastImageIndex);

    return {
      depth,
      imageIndex,
      key:
        requestedImageIndex <= lastImageIndex
          ? `onboarding-card-${imageIndex}`
          : `onboarding-tail-${requestedImageIndex}`,
      src: onboardingDeckImages[imageIndex],
    };
  });
}

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

function goHome() {
  window.history.replaceState(window.history.state ?? {}, "", "/home");
  window.dispatchEvent(new PopStateEvent("popstate"));
}

export function OnboardingPage() {
  const [stepIndex, setStepIndex] = useState(0);
  const [isCityStep, setIsCityStep] = useState(false);
  const shouldReduceMotion = useReducedMotion();

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

  const goToNextStep = () => {
    if (stepIndex >= ONBOARDING_STEP_COUNT - 1) {
      showCityStep();
      return;
    }

    setStepIndex((currentStep) => currentStep + 1);
  };

  if (isCityStep) {
    return <OnboardingCitySelectionPage />;
  }

  const visibleCards = getOnboardingDeckCards(stepIndex);

  return (
    <section className="flex h-full min-h-0 flex-col overflow-hidden bg-white text-[#1a1a1a] [direction:rtl]">
      <main className="min-h-0 flex-1 overflow-hidden px-4">
        <div className="mx-auto flex h-full w-full max-w-[500px] flex-col items-center">
          <div className="relative mt-0 h-[min(46dvh,390px)] min-h-[260px] w-full shrink-0">
            <AnimatePresence initial={false}>
              {[...visibleCards].reverse().map((card) => {
                const isCurrent = card.depth === 0;
                const targetY = card.depth * ONBOARDING_LAYER_OFFSET;
                const targetWidth = ONBOARDING_LAYER_WIDTHS[card.depth];
                const targetInset = (100 - targetWidth) / 2;
                const enteringDepth = Math.min(card.depth + 1, ONBOARDING_STACK_SIZE - 1);
                const enteringWidth = ONBOARDING_LAYER_WIDTHS[enteringDepth];
                const enteringInset = (100 - enteringWidth) / 2;

                return (
                  <motion.div
                    key={card.key}
                    aria-hidden="true"
                    className="absolute top-0 [backface-visibility:hidden] will-change-[transform,opacity,left,right]"
                    initial={
                      shouldReduceMotion || card.depth < ONBOARDING_STACK_SIZE - 1
                        ? false
                        : {
                            left: `${enteringInset}%`,
                            right: `${enteringInset}%`,
                            opacity: 0,
                            y: targetY + ONBOARDING_LAYER_OFFSET,
                          }
                    }
                    animate={{
                      left: `${targetInset}%`,
                      right: `${targetInset}%`,
                      opacity: 1,
                      y: targetY,
                    }}
                    exit={
                      shouldReduceMotion
                        ? { opacity: 0 }
                        : { opacity: 0, y: -6 }
                    }
                    transition={{
                      duration: shouldReduceMotion ? 0.01 : isCurrent ? 0.24 : 0.3,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    style={{ zIndex: 100 - card.depth }}
                  >
                    <img
                      alt=""
                      className="block h-auto w-full object-contain object-top"
                      decoding="async"
                      draggable={false}
                      src={card.src}
                    />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          <div className="relative mt-6 min-h-[150px] w-full max-w-[328px] text-center">
            <AnimatePresence initial={false}>
              <motion.div
                key={stepIndex}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -4 }}
                transition={{
                  duration: shouldReduceMotion ? 0.01 : 0.18,
                  ease: [0.25, 0.8, 0.25, 1],
                }}
                className="absolute inset-x-0 top-0 flex w-full flex-col items-center [backface-visibility:hidden] [transform:translateZ(0)] will-change-[transform,opacity]"
              >
                <Typography
                  as="p"
                  className="m-0 text-[#1a1a1a]"
                  variant="title"
                  size="medium"
                  weight="semibold"
                >
                  {onboardingSteps[stepIndex].eyebrow}
                </Typography>

                <Typography
                  as="h1"
                  className="m-0 mt-1.5 text-[#0048c4]"
                  variant="title"
                  size="large"
                  weight="semibold"
                >
                  {onboardingSteps[stepIndex].title}
                </Typography>

                <Typography
                  as="p"
                  className="m-0 mt-3 max-w-[328px] text-center text-outline px-4"
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
            className="mt-auto mb-5 flex h-2 items-center justify-center gap-2 [direction:ltr]"
            aria-label={`مرحله ${stepIndex + 1} از ${ONBOARDING_STEP_COUNT}`}
          >
            {Array.from({ length: ONBOARDING_STEP_COUNT }).map((_, index) => (
              <motion.span
                aria-hidden="true"
                className={
                  index === stepIndex
                    ? "h-2 rounded-full bg-[#0048c4]"
                    : "h-2 rounded-full bg-[#d8e3f7]"
                }
                animate={{ width: index === stepIndex ? 24 : 8 }}
                transition={{ duration: shouldReduceMotion ? 0.01 : 0.2 }}
                key={index}
              />
            ))}
          </div>
        </div>
      </main>

      <footer className="shrink-0 bg-white px-4 pb-4 pt-3">
        <div className="mx-auto flex w-full max-w-[328px] gap-4 [direction:rtl]">
          <Button
            className="h-10 flex-1 rounded-[10px]"
            onClick={goToNextStep}
            size="x-medium"
            leadingIcon={<LinearArrowRight2 className="h-5 w-5" />}
            type="button"
            variant="secondary"
          >
            بعدی
          </Button>

          <Button
            className="h-10 flex-1 rounded-[10px] text-outline border-outline-var"
            trailingIcon={<LinearCancel className="h-5 w-5" />}
            onClick={showCityStep}
            size="x-medium"
            type="button"
            variant="neutral-outline"
          >
            رد کردن
          </Button>
        </div>
      </footer>
    </section>
  );
}

function OnboardingCitySelectionPage() {
  const [query, setQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState<StoredSelectedCity | null>(null);
  const [hasExplicitCitySelection, setHasExplicitCitySelection] = useState(false);
  const debouncedQuery = useDebouncedValue(query.trim(), 250);

  const {
    data: popularCityDtos = [],
    isLoading: isPopularCitiesLoading,
  } = useMostVisitedCityListQuery();
  const {
    data: searchedCityDtos = [],
    isFetching: isSearchingCities,
  } = useCitySearchQuery({
    enabled: debouncedQuery.length > 0,
    q: debouncedQuery,
  });

  const popularCities = useMemo(
    () => dedupeCities(popularCityDtos).slice(0, 6),
    [popularCityDtos],
  );
  const searchedCities = useMemo(
    () => dedupeCities(searchedCityDtos).slice(0, 6),
    [searchedCityDtos],
  );

  useEffect(() => {
    if (selectedCity || popularCities.length === 0) return;

    const initialCity = popularCities.find((city) => city.name === "مشهد") ?? popularCities[0];

    if (initialCity) {
      setSelectedCity({
        id: initialCity.id,
        latitude: initialCity.latitude,
        longitude: initialCity.longitude,
        name: initialCity.name,
      });
    }
  }, [popularCities, selectedCity]);

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
    if (!selectedCity) return;

    saveSelectedCity(selectedCity);
    goHome();
  };

  return (
    <section className="flex h-full min-h-0 flex-col overflow-hidden bg-white text-[#1a1a1a] [direction:rtl]">
      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-4 pt-0">
        <div className="mx-auto flex w-full max-w-[500px] flex-col items-center">
          <div className="relative h-[min(42dvh,360px)] min-h-[250px] w-full shrink-0">
            <div
              aria-hidden="true"
              className="absolute bottom-0 left-[8%] right-[8%] h-[165px] rounded-3xl bg-[#0048c4]/8"
            />
            <div
              aria-hidden="true"
              className="absolute bottom-2.5 left-[4%] right-[4%] h-[165px] rounded-3xl bg-[#0048c4]/16"
            />
            <img
              alt=""
              aria-hidden="true"
              className="absolute inset-x-0 top-0 block h-auto w-full object-contain object-top"
              decoding="async"
              draggable={false}
              src={citySelectionImage}
            />
          </div>

          <div className="mt-8 w-full max-w-[328px] text-center">
            <Typography
              as="h1"
              className="m-0 text-[#1a1a1a]"
              size="large"
              variant="label"
              weight="semibold"
            >
              شهر خود را انتخاب کنید
            </Typography>
            <Typography
              as="p"
              className="m-0 mt-2 text-[#808080]"
              size="medium"
              variant="body"
              weight="regular"
            >
              برای نمایش آگهی‌ها، آژانس‌ها و مشاوران نزدیک شما،
              <br />
              شهر محل فعالیت یا سکونت خود را انتخاب کنید.
            </Typography>
          </div>

          <label className="relative mt-4 block h-12 w-full max-w-[328px]">
            <Typography as="span" className="sr-only" size="small" variant="body" weight="regular">
              جستجوی شهر
            </Typography>
            <input
              autoComplete="off"
              className="h-12 w-full rounded-[12px] border-0 bg-[#f0f0f0] py-0 pl-12 pr-4 text-right text-[#1a1a1a] outline-none placeholder:text-[#808080] focus:ring-2 focus:ring-[#0048c429]"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="جستجوی شهر..."
              type="search"
              value={query}
            />
            <LinearSearch className="pointer-events-none absolute left-3.5 top-1/2 h-6 w-6 -translate-y-1/2 text-[#1a1a1a]" />
          </label>

          <div className="mt-8 w-full max-w-[328px]">
            <Typography
              as="h2"
              className="m-0 text-right text-[#1a1a1a]"
              size="medium"
              variant="label"
              weight="medium"
            >
              {isSearching ? "نتایج جستجو" : "شهرهای پرکاربرد"}
            </Typography>

            <div className="mt-2 grid grid-cols-3 gap-2">
              {isCityListLoading
                ? Array.from({ length: 6 }).map((_, index) => (
                  <span className="h-9 animate-pulse rounded-[8px] bg-[#f0f0f0]" key={index} />
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
                          ? "flex h-9 min-w-0 items-center justify-center rounded-[8px] border border-[#0048c4] bg-[#0048c40a] px-2 text-[#0048c4]"
                          : "flex h-9 min-w-0 items-center justify-center rounded-[8px] border border-[#cccccc] bg-white px-2 text-[#4d4d4d]"
                      }
                      key={city.key}
                      onClick={() => selectCity(city)}
                      type="button"
                    >
                      <Typography as="span" className="truncate" size="medium" variant="body" weight="regular">
                        {city.name}
                      </Typography>
                    </Button>
                  );
                })}
            </div>

            {!isCityListLoading && visibleCities.length === 0 ? (
              <Typography
                as="p"
                className="m-0 mt-4 text-center text-[#808080]"
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

      <footer className="shrink-0 bg-white px-4 pb-4 pt-3">
        <Button
          className="mx-auto h-10 w-full max-w-[328px] rounded-[10px]"
          disabled={!selectedCity}
          onClick={start}
          size="x-medium"
          leadingIcon={<LinearArrowLeft1 className="h-5 w-5" />}
          type="button"
          variant="primary"
        >
          شروع کنید
        </Button>
      </footer>
    </section>
  );
}
