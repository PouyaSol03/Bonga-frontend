import { useState, useRef } from "react";
import { Typography } from "../../../shared/ui/Typography";
import { RouteLink } from "../../../shared/navigation/RouteLink";
import LinearArrowLeft1 from "../../../shared/icons/LinearArrowLeft1";
import type { AdCardData } from "../../advertisements/components/AdCard";
import { AdCardSkeleton } from "../../advertisements/components/AdCardSkeleton";
import { DashboardAdCard } from "../DashboardAdCard";

export type DashboardRecentAdItem = AdCardData;

export interface DashboardRecentAdsCardProps {
  ads?: AdCardData[];
  ad?: AdCardData;
  isLoading?: boolean;
  viewAllTo?: string;
  title?: string;
}

export function DashboardRecentAdsCard({
  ads,
  ad,
  isLoading = false,
  viewAllTo = "/account/manage-ads",
  title = "آخرین آگهی‌ها",
}: DashboardRecentAdsCardProps) {
  const adList = Array.isArray(ads) && ads.length > 0 ? ads : ad ? [ad] : [];
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const children = Array.from(container.children) as HTMLElement[];
    if (!children.length) return;
    const containerCenter = container.getBoundingClientRect().left + container.clientWidth / 2;
    let closestIndex = 0;
    let minDiff = Infinity;
    children.forEach((child, idx) => {
      const rect = child.getBoundingClientRect();
      const childCenter = rect.left + rect.width / 2;
      const diff = Math.abs(containerCenter - childCenter);
      if (diff < minDiff) {
        minDiff = diff;
        closestIndex = idx;
      }
    });
    if (closestIndex !== activeIndex) {
      setActiveIndex(closestIndex);
    }
  };

  const scrollToSlide = (index: number) => {
    if (!scrollerRef.current) return;
    const slide = scrollerRef.current.children[index] as HTMLElement | undefined;
    if (slide) {
      slide.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
    setActiveIndex(index);
  };

  return (
    <section className="w-full rounded-[16px] bg-surface-container-lowest p-4 shadow-sm [direction:rtl]">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <Typography as="h2" variant="title" size="small" weight="semibold" className="text-on-surface">
          {title}
        </Typography>
        <RouteLink className="flex items-center gap-1 text-primary" to={viewAllTo}>
          <Typography as="span" variant="label" size="small" weight="medium" className="text-primary">
            مشاهده همه
          </Typography>
          <LinearArrowLeft1 className="h-3.5 w-3.5" />
        </RouteLink>
      </div>

      {isLoading ? (
        <div className="w-full">
          <AdCardSkeleton variant="dashboard" />
        </div>
      ) : adList.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <Typography
            as="p"
            variant="body"
            size="medium"
            weight="medium"
            className="text-on-surface-var text-sm"
          >
            آگهی اخیری برای نمایش وجود ندارد
          </Typography>
        </div>
      ) : (
        <>
          {/* Working Slider */}
          <div
            ref={scrollerRef}
            onScroll={handleScroll}
            className="flex w-full overflow-x-auto snap-x snap-mandatory scrollbar-none [direction:rtl]"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {adList.map((item) => (
              <div key={item.id} className="w-full shrink-0 snap-center min-w-full">
                <DashboardAdCard ad={item} returnTo={viewAllTo} />
              </div>
            ))}
          </div>

          {/* Pagination Indicator Dots */}
          {adList.length > 1 && (
            <div className="mt-3 flex items-center justify-center gap-1.5" aria-label="انتخاب اسلاید آگهی">
              {adList.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => scrollToSlide(idx)}
                  aria-label={`اسلاید ${idx + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 border-none p-0 cursor-pointer ${
                    idx === activeIndex
                      ? "w-4 bg-on-surface"
                      : "w-1.5 bg-surface-container-highest"
                  }`}
                />
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}
