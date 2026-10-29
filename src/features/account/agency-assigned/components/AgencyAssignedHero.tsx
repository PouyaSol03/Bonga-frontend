import type { AdCardData } from "../../../advertisements/components/AdCard";
import { Typography } from "../../../../shared/ui/Typography";
import LinearClock from "../../../../shared/icons/LinearClock";
import { renderDateWithRelative } from "../dateHelpers";

export function AgencyAssignedHero({
  card,
  categoryBreadcrumb,
  expirationDateText,
  isArchived,
  isDeleted,
  isPublished,
  isWaitForAdmin,
  isWaitForAgency,
  isWaitForDeal,
  isWaitForRepost,
  isWaitForStop,
  publishedDateText,
}: {
  card: AdCardData;
  categoryBreadcrumb: string;
  expirationDateText: string;
  isArchived: boolean;
  isDeleted: boolean;
  isPublished: boolean;
  isWaitForAdmin: boolean;
  isWaitForAgency: boolean;
  isWaitForDeal: boolean;
  isWaitForRepost: boolean;
  isWaitForStop: boolean;
  publishedDateText: string;
}) {
  return (
    <section className="bg-surface-container-lowest px-4 pt-4 pb-4">
      {/* Status Badge */}
      <div className="flex justify-start">
        {isPublished && (
          <span className="bg-tertiary-container/30 text-tertiary inline-flex h-10 items-center rounded-lg px-4 text-sm font-medium">
            منتشر شده
          </span>
        )}
        {isWaitForAdmin && (
          <span className="bg-warning-container text-on-warning-container inline-flex h-10 items-center rounded-lg px-4 text-sm font-medium">
            در انتظار تایید انتشار
          </span>
        )}
        {isWaitForAgency && (
          <span className="bg-warning-container text-on-warning-container inline-flex h-10 items-center rounded-lg px-4 text-sm font-medium">
            در انتظار تایید آژانس
          </span>
        )}
        {isWaitForRepost && (
          <span className="bg-warning-container text-on-warning-container inline-flex h-10 items-center rounded-lg px-4 text-sm font-medium">
            در انتظار ثبت مجدد
          </span>
        )}
        {isArchived && (
          <span className="bg-surface-container-high text-on-surface-var inline-flex h-10 items-center rounded-lg px-4 text-sm font-medium">
            بایگانی شده
          </span>
        )}
        {(isDeleted || isWaitForDeal || isWaitForStop) && (
          <span className="bg-error-container/40 text-error inline-flex h-10 items-center rounded-lg px-4 text-sm font-medium">
            حذف شده
          </span>
        )}
      </div>

      {/* Ad Summary Card: Image FIRST (on right in RTL), Infos text to the LEFT */}
      <div className="border-surface-container-high bg-surface-container-low mt-4 flex h-[79px] items-center gap-3 rounded-2xl border px-4 [direction:rtl]">
        {/* 1. Image first: renders on the RIGHT in RTL */}
        <div
          aria-hidden="true"
          className="h-[52px] w-[70px] shrink-0 rounded-lg bg-cover bg-center"
          style={
            card.imageUrl
              ? { backgroundImage: `url(${card.imageUrl})` }
              : { backgroundColor: "#E0E0E0" }
          }
        />

        {/* 2. Infos text: renders to the LEFT of image */}
        <div className="min-w-0 flex-1 text-right">
          <Typography
            as="p"
            variant="body"
            size="small"
            weight="regular"
            className="text-on-surface-var m-0 truncate text-xs"
          >
            {categoryBreadcrumb}
          </Typography>
          <Typography
            as="h2"
            variant="title"
            size="small"
            weight="medium"
            className="text-on-surface m-0 mt-1 truncate text-sm font-semibold"
          >
            {card.title}
          </Typography>
        </div>
      </div>

      {/* Metadata for Published state: Title on RIGHT, Value on LEFT */}
      {isPublished && (
        <div className="mt-4 text-sm leading-5 font-medium">
          <div className="flex h-11 items-center justify-between [direction:rtl]">
            <span className="text-on-surface-var text-sm">انتشار</span>
            {renderDateWithRelative(publishedDateText)}
          </div>
          <div className="border-outline-var/30 border-t border-dashed" />
          <div className="flex h-11 items-center justify-between [direction:rtl]">
            <span className="text-on-surface-var text-sm">انقضا</span>
            {renderDateWithRelative(expirationDateText)}
          </div>
        </div>
      )}

      {/* Notice for Pending Admin Review */}
      {isWaitForAdmin && (
        <div className="border-warning bg-warning-container mt-4 rounded-lg border px-4 py-3 text-right">
          <Typography
            as="p"
            variant="body"
            size="medium"
            weight="regular"
            className="text-on-surface m-0 text-sm leading-7 font-normal"
          >
            این آگهی در صف بررسی سامانه قرار دارد.
          </Typography>
          <Typography as="p" variant="body" size="medium" weight="regular">
            پس از تایید، آگهی به صورت خودکار منتشر می‌شود.
          </Typography>

          <div className="border-outline-var mt-3 border-t border-dashed pt-3">
            <div className="flex h-6 items-center justify-between gap-4 text-xs leading-4 font-normal [direction:ltr]">
              <Typography
                as="span"
                variant="body"
                size="medium"
                weight="regular"
                className="text-on-surface [direction:rtl]"
              >
                بین ۱ تا ۶ ساعت
              </Typography>
              <Typography
                as="span"
                variant="body"
                size="medium"
                weight="regular"
                className="text-on-surface-var inline-flex items-center gap-2 [direction:rtl]"
              >
                <LinearClock className="h-5 w-5" />
                زمان تقریبی بررسی:
              </Typography>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
