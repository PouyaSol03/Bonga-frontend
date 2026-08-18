import { useMemo, useRef, useState, type UIEvent } from "react";

import { useTopViewedAdvertisementsQuery } from "../../advertisements/api/advertisement.hooks";
import { mapAdvertisementToAdCard } from "../../advertisements/api/advertisement.service";
import { AdCard } from "../../advertisements/components/AdCard";
import { Button } from "../../../shared/ui/Button";
import { Typography } from "../../../shared/ui/Typography";
import LinearAnalytics from "../../../shared/icons/LinearAnalytics";

const MAX_POPULAR_ADS = 10;

function PopularAdsIcon() {
  return (
    <div
      aria-hidden="true"
      className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-secondary/8"
    >
      <LinearAnalytics className="w-8 h-8 text-secondary" />
    </div>
  );
}

function PopularAdCardSkeleton() {
  return (
    <div
      className="w-[300px] shrink-0"
      aria-hidden="true"
    >
      <div className="aspect-[328/219.3] w-full rounded-2xl bg-surface-container-low" />
      <div className="mt-3 h-6 w-40 rounded-full bg-surface-container-low" />
      <div className="mt-3 flex gap-[22px]">
        <div className="h-5 w-16 rounded-full bg-surface-container-low" />
        <div className="h-5 w-16 rounded-full bg-surface-container-low" />
        <div className="h-5 w-16 rounded-full bg-surface-container-low" />
      </div>
      <div className="mt-3 h-5 w-56 rounded-full bg-surface-container-low" />
      <div className="mt-3 h-6 w-44 rounded-full bg-surface-container-low" />
    </div>
  );
}

type PopularAdsSectionProps = {
  cityId?: string;
};

export function PopularAdsSection({ cityId: _cityId }: PopularAdsSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const advertisementsQuery = useTopViewedAdvertisementsQuery();

  const advertisements = useMemo(
    () =>
      (advertisementsQuery.data ?? [])
        .map((ad, index) => mapAdvertisementToAdCard(ad, index))
        .slice(0, MAX_POPULAR_ADS),
    [advertisementsQuery.data],
  );

  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    const viewport = event.currentTarget;
    const viewportCenter =
      viewport.getBoundingClientRect().left + viewport.clientWidth / 2;
    const slides = Array.from(
      viewport.querySelectorAll<HTMLElement>("[data-popular-ad-slide]"),
    );

    if (!slides.length) return;

    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;

    slides.forEach((slide, index) => {
      const rect = slide.getBoundingClientRect();
      const slideCenter = rect.left + rect.width / 2;
      const distance = Math.abs(slideCenter - viewportCenter);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    setActiveIndex(closestIndex);
  };

  const scrollToAdvertisement = (index: number) => {
    const slide = scrollerRef.current?.querySelectorAll<HTMLElement>(
      "[data-popular-ad-slide]",
    )[index];

    slide?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "end",
    });
  };

  return (
    <section
      className="home-content-visibility border-t-[16px] border-surface-container bg-surface-container-lowest pb-6 pt-6"
      aria-labelledby="popular-ads-title"
      dir="rtl"
    >
      <div className="flex h-10 items-start gap-2 px-4">
        <PopularAdsIcon />

        <div className="min-w-0 flex-1 text-right">
          <Typography
            as="h2"
            id="popular-ads-title"
            variant="title"
            size="medium"
            weight="semibold"
            className="m-0 text-on-surface"
          >
            پربازدیدترین آگهی‌ها
          </Typography>

          <Typography
            as="p"
            variant="body"
            size="small"
            weight="regular"
            className="m-0 text-on-surface-var"
          >
            محبوب‌ترین ملک‌های این هفته
          </Typography>
        </div>
      </div>

      <div
        ref={scrollerRef}
        className="mt-6 snap-x snap-mandatory scroll-px-4 overflow-x-auto scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        onScroll={handleScroll}
      >
        <div className="flex w-max min-w-full gap-4 px-4">
          {advertisementsQuery.isLoading
            ? Array.from({ length: 2 }).map((_, index) => (
                <div
                  key={index}
                  data-popular-ad-slide
                  className="w-[300px] shrink-0 snap-end"
                >
                  <PopularAdCardSkeleton />
                </div>
              ))
            : advertisements.map((ad) => (
                <div
                  key={ad.id}
                  data-popular-ad-slide
                  className="w-[300px] shrink-0 snap-end"
                >
                  <AdCard
                    ad={ad}
                    className="w-[300px]"
                    showAgency={false}
                    imageLoading="lazy"
                    variant="carousel"
                  />
                </div>
              ))}
        </div>
      </div>

      {advertisementsQuery.isError ? (
        <div className="px-4 pt-5 text-center">
          <Typography
            as="p"
            variant="body"
            size="small"
            weight="regular"
            className="m-0 text-outline"
          >
            دریافت آگهی‌ها با خطا مواجه شد.
          </Typography>
          <Button
            type="button"
            variant="text"
            size="sm"
            className="mt-1"
            onClick={() => void advertisementsQuery.refetch()}
          >
            تلاش دوباره
          </Button>
        </div>
      ) : null}

      {!advertisementsQuery.isLoading &&
      !advertisementsQuery.isError &&
      advertisements.length === 0 ? (
        <Typography
          as="p"
          variant="body"
          size="small"
          weight="regular"
          className="m-0 px-4 pt-6 text-center text-outline"
        >
          آگهی‌ای برای نمایش وجود ندارد.
        </Typography>
      ) : null}

      {!advertisementsQuery.isLoading &&
      !advertisementsQuery.isError &&
      advertisements.length > 1 ? (
        <div
          className="mt-6 flex h-2 items-center justify-center gap-2 [direction:ltr]"
          aria-label="صفحات پربازدیدترین آگهی‌ها"
        >
          {advertisements.map((ad, index) => {
            const distanceFromActive = Math.abs(index - activeIndex);
            const sizeClass =
              index === activeIndex
                ? "h-2 w-6"
                : distanceFromActive >= 6
                  ? "h-1 w-1"
                  : distanceFromActive === 5
                    ? "h-1.5 w-1.5"
                    : "h-2 w-2";

            return (
              <Button
                unstyled
                type="button"
                key={ad.id}
                aria-label={`نمایش آگهی ${index + 1}`}
                aria-current={index === activeIndex ? "true" : undefined}
                className={`${sizeClass} shrink-0 rounded-full ${
                  index === activeIndex
                    ? "bg-on-surface-var"
                    : "bg-on-surface-var/16"
                }`}
                onClick={() => scrollToAdvertisement(index)}
              />
            );
          })}
        </div>
      ) : null}
    </section>
  );
}
