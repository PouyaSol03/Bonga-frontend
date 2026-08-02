import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import LinearCalendar from "../../components/(icons)/LinearCalendar";
import LinearPropertySearch from "../../components/(icons)/LinearPropertySearch";
import LinearRefresh from "../../components/(icons)/LinearRefresh";
import LinearRequestList from "../../components/(icons)/LinearRequestList";
import LinearSearch from "../../components/(icons)/LinearSearch";
import { SearchEmptyState } from "../../components/SearchEmptyState";
import {
  formatPropertyRequestValue,
  getCollapsedPropertyRequestDetails,
  propertyRequestFilterLabels,
  toPersianDigits,
  type PropertySearchRequest,
} from "../../services/property-request.service";
import { PropertyRequestResults } from "../requests/PropertyRequestResults";
import { Typography } from "../../components/ui/Typography";
import { Button } from "../../components/ui/Button";

type CrmPropertyRequestsViewProps = {
  notify: (message: string, tone?: "error" | "success") => void;
};

function formatPersianDate(value: string) {
  if (!value) return "زمان ثبت نشده";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    month: "long",
    timeZone: "Asia/Tehran",
    year: "numeric",
  }).format(date);
}

function formatCount(value: number) {
  return new Intl.NumberFormat("fa-IR").format(value);
}

function PropertyRequestCard({
  index,
  prefersReducedMotion,
  request,
}: {
  index: number;
  prefersReducedMotion: boolean;
  request: PropertySearchRequest;
}) {
  const { hiddenCount, visibleDetails } = getCollapsedPropertyRequestDetails(
    request,
    6,
  );

  return (
    <motion.article
      animate={{ opacity: 1, y: 0 }}
      className="flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-[#e1e5eb] bg-white text-right shadow-[0_4px_18px_rgba(31,48,74,0.05)]"
      exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
      initial={
        prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 12 }
      }
      layout
      transition={{
        delay: prefersReducedMotion ? 0 : Math.min(index * 0.035, 0.2),
        duration: prefersReducedMotion ? 0 : 0.2,
      }}
    >
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex min-w-0 items-center gap-2">
              <LinearRequestList className="h-5 w-5 shrink-0 text-[#4d4d4d]" />
              <Typography as="h2" variant="title" size="medium" weight="semibold" className="m-0 truncate text-base font-bold leading-7 text-[#1a1a1a]">
                {request.title}
              </Typography>
            </div>
            <Typography as="p" variant="body" size="small" weight="medium" className="m-0 mt-1 text-xs font-medium text-[#808080]">
              ثبت‌شده توسط {request.senderLabel}
            </Typography>
          </div>

          <Typography as="span" variant="label" size="small" weight="semibold" className="inline-flex h-7 shrink-0 items-center rounded-lg bg-[#eef4ff] px-2.5 text-[11px] font-semibold text-[#0048c4]">
            {formatCount(Object.keys(request.filters).length)} معیار
          </Typography>
        </div>

        {visibleDetails.length ? (
          <div className="mt-4 grid min-h-[108px] grid-cols-2 content-start gap-2">
            {visibleDetails.map((detail) => (
              <Typography as="span" variant="label" size="small" weight="medium"
                className="min-w-0 truncate whitespace-nowrap rounded-lg border border-[#cccccc] bg-white px-2.5 py-1.5 text-xs font-medium leading-5 text-[#303030]"
                key={detail}
                title={detail}
              >
                {detail}
              </Typography>
            ))}
            {hiddenCount > 0 ? (
              <Typography as="span" variant="label" size="small" weight="semibold" className="min-w-0 truncate whitespace-nowrap rounded-lg border border-[#cccccc] bg-[#f7f7f7] px-2.5 py-1.5 text-xs font-semibold leading-5 text-[#4d4d4d]">
                و {toPersianDigits(hiddenCount)} مورد بیشتر
              </Typography>
            ) : null}
          </div>
        ) : (
          <Typography as="p" variant="body" size="small" weight="medium" className="m-0 mt-4 min-h-[108px] rounded-xl bg-[#f7f7f7] px-3 py-3 text-xs font-medium leading-6 text-[#808080]">
            اطلاعاتی برای این درخواست ثبت نشده است.
          </Typography>
        )}

        <div className="mt-auto flex items-center justify-between gap-3 pt-4 text-[11px] font-medium text-[#808080]">
          <Typography as="span" variant="body" size="medium" weight="regular" className="flex min-w-0 items-center gap-1.5 truncate">
            <LinearCalendar className="h-4 w-4 shrink-0" />
            <Typography as="span" variant="body" size="medium" weight="regular" className="truncate">{formatPersianDate(request.createdAt)}</Typography>
          </Typography>
          <Typography as="span" variant="body" size="medium" weight="regular" className="shrink-0 rounded-md bg-[#f3f4f6] px-2 py-1">
            {request.id.replace("search-request-", "#")}
          </Typography>
        </div>
      </div>

      <div className="border-t border-[#eeeeee] bg-[#fafafa] p-3">
        <PropertyRequestResults
          bare
          className="overflow-hidden rounded-2xl bg-white"
          compact
          maxResults={1}
          request={request}
          resultSource="search"
          showHeading={false}
        />
      </div>
    </motion.article>
  );
}

function EmptyState({ searchQuery }: { searchQuery: string }) {
  if (searchQuery.trim()) return <SearchEmptyState />;

  return (
    <div className="grid min-h-[380px] place-items-center rounded-2xl border border-dashed border-[#d7dde7] bg-white px-7 text-center">
      <div>
        <Typography as="span" variant="body" size="medium" weight="regular" className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[#eef4ff] text-[#0048c4]">
          <LinearPropertySearch className="h-8 w-8" />
        </Typography>
        <strong className="mt-4 block text-base font-bold text-[#303030]">
          {searchQuery ? "درخواستی پیدا نشد" : "سرویس درخواست‌های CRM متصل نیست"}
        </strong>
        <Typography as="p" variant="body" size="medium" weight="medium" className="m-0 mt-2 text-sm font-medium leading-7 text-[#8a919c]">
          {searchQuery
            ? "عبارت جستجو را تغییر دهید."
            : "در این پروژه API پنل CRM برای درخواست‌های یافتن آگهی پیاده‌سازی نشده است."}
        </Typography>
      </div>
    </div>
  );
}

export function CrmPropertyRequestsView({
  notify,
}: CrmPropertyRequestsViewProps) {
  const prefersReducedMotion = Boolean(useReducedMotion());
  const requests: PropertySearchRequest[] = [];
  const [searchQuery, setSearchQuery] = useState("");

  const normalizedSearch = searchQuery.trim().toLocaleLowerCase("fa-IR");
  const filteredRequests = useMemo(
    () =>
      requests.filter((request) => {
        if (!normalizedSearch) return true;

        return [
          request.title,
          request.id,
          request.senderLabel,
          ...Object.entries(request.filters).flatMap(([key, value]) => [
            propertyRequestFilterLabels[key] ?? key,
            formatPropertyRequestValue(value),
          ]),
        ].some((value) =>
          value.toLocaleLowerCase("fa-IR").includes(normalizedSearch),
        );
      }),
    [normalizedSearch, requests],
  );

  const refreshRequests = () => {
    notify("API درخواست‌های یافتن آگهی برای پنل CRM در این پروژه متصل نیست.", "error");
  };

  return (
    <section className="flex min-h-full flex-col gap-4" dir="rtl">
      <header className="rounded-2xl border border-[#e5e9f0] bg-white p-5 shadow-[0_2px_12px_rgba(31,48,74,0.04)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <Typography as="span" variant="body" size="medium" weight="regular" className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#eaf1ff] text-[#0048c4]">
              <LinearRequestList className="h-6 w-6" />
            </Typography>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <Typography as="h1" variant="title" size="medium" weight="semibold" className="m-0 text-lg font-bold text-[#1a1a1a]">
                  درخواست‌های یافتن آگهی
                </Typography>
                <Typography as="span" variant="label" size="small" weight="semibold" className="inline-flex h-6 items-center rounded-lg bg-[#f0f3f7] px-2 text-[11px] font-semibold text-[#687180]">
                  {formatCount(filteredRequests.length)} درخواست
                </Typography>
              </div>
              <Typography as="p" variant="body" size="medium" weight="medium" className="m-0 mt-1 text-sm font-medium text-[#808895]">
                اتصال API درخواست‌های یافتن آگهی برای پنل CRM در این پروژه در دسترس نیست.
              </Typography>
            </div>
          </div>

          <Button unstyled
            className="inline-flex h-10 shrink-0 items-center gap-2 rounded-xl border border-[#d9e0ea] bg-white px-4 text-sm font-semibold text-[#4d5560] transition hover:border-[#0048c4] hover:text-[#0048c4]"
            onClick={refreshRequests}
            type="button"
          >
            <LinearRefresh className="h-5 w-5" />
            بروزرسانی
          </Button>
        </div>

        <label className="relative mt-4 block max-w-xl">
          <Typography as="span" variant="body" size="medium" weight="regular" className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#838b97]">
            <LinearSearch className="h-5 w-5" />
          </Typography>
          <input
            className="h-11 w-full rounded-xl border border-[#d9dfe8] bg-[#fafbfc] pr-11 pl-4 text-sm font-medium text-[#303640] outline-none transition placeholder:text-[#959ca6] focus:border-[#0048c4] focus:bg-white focus:ring-3 focus:ring-[#0048c4]/10"
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="جستجو در نام درخواست، کاربر، شناسه یا معیارها"
            type="search"
            value={searchQuery}
          />
        </label>
      </header>

      {filteredRequests.length ? (
        <motion.div
          className="grid grid-cols-[repeat(auto-fit,minmax(340px,1fr))] items-stretch gap-4 pb-2"
          layout
        >
          <AnimatePresence initial={false} mode="popLayout">
            {filteredRequests.map((request, index) => (
              <PropertyRequestCard
                index={index}
                key={request.id}
                prefersReducedMotion={prefersReducedMotion}
                request={request}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <EmptyState searchQuery={searchQuery} />
      )}
    </section>
  );
}
