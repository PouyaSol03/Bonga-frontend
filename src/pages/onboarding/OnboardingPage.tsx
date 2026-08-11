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
// Decorative layers behind the active onboarding image.
// They are intentionally plain colors — no future-step images are rendered here.
const ONBOARDING_SECOND_LAYER = "#c5d6f2"; // Primary / 16%
const ONBOARDING_THIRD_LAYER = "#ebf1fa"; // Primary / 8%

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

  if (isCityStep) {
    return <OnboardingCitySelectionPage />;
  }

  return (
    <section className="flex h-full min-h-0 flex-col overflow-hidden bg-white text-[#1a1a1a] [direction:rtl]">
      <main className="min-h-0 flex-1 overflow-hidden px-4">
        <div className="mx-auto flex h-full w-full max-w-[500px] flex-col items-center">
          <div className="relative mt-0 h-[min(46dvh,390px)] min-h-[260px] w-full shrink-0">
            {/*
              The front card stays in normal flow so its image defines the stack height.
              The two colored cards copy that exact height and are translated down
              by 10px and 20px. No shared bottom edge, so both offsets stay visible.
            */}
            <div className="relative w-full">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-[8%] right-[8%] z-0 translate-y-[20px] rounded-3xl"
                style={{ backgroundColor: ONBOARDING_THIRD_LAYER }}
              />
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-[4%] right-[4%] z-10 translate-y-[10px] rounded-3xl"
                style={{ backgroundColor: ONBOARDING_SECOND_LAYER }}
              />

              {/*
                Only the active/front card contains an image. On every page change
                the new card starts exactly where the Primary/16 layer sits
                (92% width + 10px lower), then grows/moves into the front position.
                This makes it feel like the next card is physically coming from behind.
              */}
              <AnimatePresence initial={false} mode="wait">
                <motion.div
                  key={stepIndex}
                  aria-hidden="true"
                  className="relative z-20 w-full origin-top overflow-hidden rounded-3xl bg-white [backface-visibility:hidden] will-change-[transform,opacity]"
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
                    className={
                      onboardingSteps[stepIndex].image.includes("third_image.png")
                        ? "block h-auto w-full origin-top object-contain object-top"
                        : "block h-auto w-full object-contain object-top"
                    }
                    decoding="async"
                    draggable={false}
                    src={onboardingSteps[stepIndex].image}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
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
            className="mt-[40px] mb-5 flex h-6 items-center justify-center gap-2 [direction:ltr]"
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
                      ? "h-2 cursor-pointer rounded-full border-0 bg-[#0048c4] p-0 outline-none focus-visible:ring-2 focus-visible:ring-[#0048c4]/30 focus-visible:ring-offset-2"
                      : "h-2 cursor-pointer rounded-full border-0 bg-[#d8e3f7] p-0 outline-none focus-visible:ring-2 focus-visible:ring-[#0048c4]/30 focus-visible:ring-offset-2"
                  }
                  animate={{ width: isActive ? 24 : 8 }}
                  whileHover={shouldReduceMotion ? undefined : { scale: 1.12 }}
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

      <footer className="shrink-0 bg-white px-4 pb-4 pt-3">
        <div className="mx-auto flex w-full max-w-[328px] gap-4 [direction:rtl]">
          <Button
            className="h-10 flex-1 rounded-[10px]"
            onClick={goToNextStep}
            onMouseDown={(event) => {
              // Prevent mouse clicks from leaving the button in its focus background state.
              // Keyboard focus is unaffected because this only runs for mouse interaction.
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
            <div className="relative w-full">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-[8%] right-[8%] z-0 translate-y-[20px] rounded-3xl"
                style={{ backgroundColor: ONBOARDING_THIRD_LAYER }}
              />
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-[4%] right-[4%] z-10 translate-y-[10px] rounded-3xl"
                style={{ backgroundColor: ONBOARDING_SECOND_LAYER }}
              />

              <div
                aria-hidden="true"
                className="relative z-20 w-full overflow-hidden rounded-3xl bg-white"
              >
                <img
                  alt=""
                  className="block h-auto w-full object-contain object-top"
                  decoding="async"
                  draggable={false}
                  src={citySelectionImage}
                />
              </div>
            </div>
          </div>

          <div className="mt-18 w-full max-w-[328px] text-center">
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
          leadingIcon={<LinearArrowRight2 className="h-5 w-5" />}
          type="button"
          variant="primary"
        >
          شروع کنید
        </Button>
      </footer>
    </section>
  );
}