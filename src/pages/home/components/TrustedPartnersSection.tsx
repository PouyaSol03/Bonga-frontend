import { useMemo, useRef, useState, type UIEvent } from "react";

import { pushRoute } from "../../../app/router/navigation";
import { useTrustedAgenciesQuery } from "../../../core/hooks/agency.hooks";
import { DirectoryCard, DirectoryCardSkeleton } from "../../consultants/components/DirectoryCard";
import { Button } from "../../../shared/ui/Button";
import { Typography } from "../../../shared/ui/Typography";
import LinearMedalFirst from "../../../shared/icons/LinearMedalFirst";

const persianDigits = "۰۱۲۳۴۵۶۷۸۹";

function toPersianNumber(value: number | string) {
  return String(value).replace(
    /\d/g,
    (digit) => persianDigits[Number(digit)] ?? digit,
  );
}

function TrustedBadgeIcon() {
  return (
    <div
      aria-hidden="true"
      className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-secondary/8 text-secondary"
    >
      <LinearMedalFirst className="w-8 h-8"/>
    </div>
  );
}

export function TrustedPartnersSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const agenciesQuery = useTrustedAgenciesQuery();

  const partners = useMemo(
    () => agenciesQuery.data ?? [],
    [agenciesQuery.data],
  );

  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    const viewport = event.currentTarget;
    const viewportCenter = viewport.getBoundingClientRect().left + viewport.clientWidth / 2;
    const slides = Array.from(
      viewport.querySelectorAll<HTMLElement>("[data-trusted-partner-slide]"),
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

  const scrollToPartner = (index: number) => {
    const slide = scrollerRef.current?.querySelectorAll<HTMLElement>(
      "[data-trusted-partner-slide]",
    )[index];

    slide?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "end" });
  };

  if (!agenciesQuery.isLoading && partners.length === 0) {
    return null;
  }

  return (
    <section
      className="border-t-[16px] border-surface-container bg-surface-container-lowest pb-6 pt-4"
      aria-labelledby="trusted-partners-title"
      dir="rtl"
    >
      <div className="flex h-10 items-start gap-2 px-4">
        <TrustedBadgeIcon />

        <div className="min-w-0 flex-1 text-right">
          <Typography
            as="h2"
            id="trusted-partners-title"
            variant="title"
            size="medium"
            weight="semibold"
            className="m-0 text-on-surface"
          >
            همراهان مورد اعتماد
          </Typography>

          <Typography
            as="p"
            variant="body"
            size="small"
            weight="regular"
            className="m-0 text-on-surface-var"
          >
            آژانس‌های برتر با عملکرد حرفه‌ای و رضایت کاربران
          </Typography>
        </div>
      </div>

      <div
        ref={scrollerRef}
        className="mt-6 snap-x snap-mandatory scroll-px-4 overflow-x-auto scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        onScroll={handleScroll}
      >
        <div className="flex w-max min-w-full gap-4 px-4">
          {agenciesQuery.isLoading ? (
            <DirectoryCardSkeleton layout="carousel" />
          ) : (
            partners.map((partner, index) => (
              <div
                key={partner.id}
                data-trusted-partner-slide
                className="shrink-0 snap-end"
              >
                <DirectoryCard
                  item={{
                    image: "logo" in partner ? partner.logo ?? undefined : undefined,
                    name: partner.name,
                    rank: toPersianNumber(partner.rank),
                    score: toPersianNumber(partner.score),
                  }}
                  layout="carousel"
                  mode="agency"
                  onClick={() => pushRoute(`/agencies/${encodeURIComponent(partner.id)}`)}
                />
              </div>
            ))
          )}
        </div>
      </div>

      {!agenciesQuery.isLoading && partners.length > 1 ? (
        <div
          className="mt-6 flex h-2 items-center justify-center gap-2 [direction:ltr]"
          aria-label="صفحات آژانس‌های برتر"
        >
          {partners.map((partner, index) => {
            const distanceFromActive = Math.abs(index - activeIndex);
            const sizeClass =
              index === activeIndex
                ? "h-2 w-6"
                : distanceFromActive >= 3
                  ? "h-1 w-1"
                  : distanceFromActive === 2
                    ? "h-1.5 w-1.5"
                    : "h-2 w-2";

            return (
              <Button
                unstyled
                type="button"
                key={partner.id}
                aria-label={`نمایش آژانس ${index + 1}`}
                aria-current={index === activeIndex ? "true" : undefined}
                className={`${sizeClass} shrink-0 rounded-full ${
                  index === activeIndex ? "bg-on-surface-var" : "bg-on-surface-var/16"
                }`}
                onClick={() => scrollToPartner(index)}
              />
            );
          })}
        </div>
      ) : null}
    </section>
  );
}
