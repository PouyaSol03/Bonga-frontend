import { useState } from "react";
import { PageFrame } from "../../../../shared/layout/PageFrame";
import { TopBar } from "../../../../shared/components/TopBar";
import { Typography } from "../../../../shared/ui/Typography";
import { toPersianNumber as toPersianDigits } from "../../../../shared/lib/numberUtils";
import LinearCall from "../../../../shared/icons/LinearCall";
import LinearChat from "../../../../shared/icons/LinearChat";
import LinearCalendar from "../../../../shared/icons/LinearCalendar";
import LinearClock from "../../../../shared/icons/LinearClock";
import LinearArrowDown1 from "../../../../shared/icons/LinearArrowDown1";
import LinearCancelSmall from "../../../../shared/icons/LinearCancelSmall";
import LinearNoteAdd from "../../../../shared/icons/LinearNoteAdd";
import {
  type ViewAdLeadItem,
  MOCK_VIEW_AD_LEADS,
} from "./ViewAdLeadCard";

export interface ViewAdLeadDetailsPageProps {
  lead?: ViewAdLeadItem;
  adId?: string;
  backTo?: string;
}

interface ActivityLogItem {
  id: string;
  time: string;
  description: string;
}

const DEFAULT_ACTIVITIES: ActivityLogItem[] = [
  {
    id: "act-1",
    time: "دیروز ۱۲:۲۰",
    description: "بازدید در ۱۲ اسفند ۱۴۰۴ و در ساعت ۱۸:۰۰ انجام شد.",
  },
  {
    id: "act-2",
    time: "دیروز ۱۲:۲۰",
    description: "ساعت بازدید در ۱۲ اسفند ۱۴۰۴ و در ساعت ۱۸:۰۰ تنظیم شد.",
  },
];

const STATUS_OPTIONS = ["بازدید", "پیگیری", "انصراف"] as const;

function readLeadIdFromUrl(): string | undefined {
  if (typeof window === "undefined") return undefined;
  return new URLSearchParams(window.location.search).get("leadId") ?? undefined;
}

function readRouteState(): Record<string, unknown> {
  if (typeof window === "undefined") return {};
  const state = window.history.state;
  return state && typeof state === "object" ? (state as Record<string, unknown>) : {};
}

function readAdIdFromPathname(): string | undefined {
  if (typeof window === "undefined") return undefined;
  const match = window.location.pathname.match(/\/account\/my-ads\/([^/]+)/);
  return match?.[1] ? decodeURIComponent(match[1]) : undefined;
}

export function ViewAdLeadDetailsPage(props?: ViewAdLeadDetailsPageProps) {
  const routeState = readRouteState() as Record<string, unknown> | null;
  const leadIdQuery = readLeadIdFromUrl();
  const currentAdId = props?.adId ?? (routeState?.adId as string) ?? readAdIdFromPathname();

  const resolvedLead: ViewAdLeadItem =
    props?.lead ??
    (routeState?.lead as ViewAdLeadItem) ??
    (leadIdQuery
      ? MOCK_VIEW_AD_LEADS.find((l) => l.id === leadIdQuery) ?? MOCK_VIEW_AD_LEADS[0]
      : MOCK_VIEW_AD_LEADS[0]);

  const defaultBackPath = currentAdId
    ? `/account/my-ads/${encodeURIComponent(currentAdId)}/state-ad`
    : "/account/my-ads";
  const backTo = props?.backTo ?? (routeState?.returnTo as string) ?? defaultBackPath;

  const [selectedStatus, setSelectedStatus] = useState<string>(
    resolvedLead.status || "بازدید"
  );
  const [visitDate, setVisitDate] = useState("۱۲ اسفند ۱۴۰۴");
  const [visitTime] = useState("۱۸:۰۰");
  const [isVisited, setIsVisited] = useState(false);
  const [note, setNote] = useState("");
  const [activities, setActivities] = useState<ActivityLogItem[]>(DEFAULT_ACTIVITIES);

  const handleVisitedClick = () => {
    if (isVisited) return;
    setIsVisited(true);
    const newLog: ActivityLogItem = {
      id: `act-${Date.now()}`,
      time: "هم‌اکنون",
      description: `بازدید در ${visitDate} و در ساعت ${visitTime} به عنوان انجام‌شده ثبت شد.`,
    };
    setActivities((prev) => [newLog, ...prev]);
  };

  return (
    <PageFrame
      className="relative flex min-h-0 flex-col overflow-hidden bg-surface-container text-on-surface [direction:rtl]"
      variant="flush"
    >
      <TopBar
        backTo={backTo}
        className="[&_a]:text-on-surface"
        title="جزئیات سرنخ"
      />

      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-surface-container pb-16">
        {/* Section 1: User Card matching state-ad page typography, fonts, positions */}
        <section
          aria-label={`اطلاعات سرنخ ${resolvedLead.name}`}
          className="w-full bg-surface-container-lowest p-4 text-right [direction:rtl]"
        >
          <div className="flex items-start gap-2">
            {/* Right side: Avatar + Info */}
            <div className="flex gap-3">
              {resolvedLead.avatarUrl ? (
                <img
                  src={resolvedLead.avatarUrl}
                  alt={resolvedLead.name}
                  className="h-14 w-14 shrink-0 rounded-full object-cover bg-surface-container border border-outline-variant"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
              ) : (
                <div
                  aria-hidden="true"
                  className="h-14 w-14 shrink-0 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-base border border-primary/20"
                >
                  {resolvedLead.name.slice(0, 1)}
                </div>
              )}

              <div className="flex flex-col min-w-31.5">
                <Typography
                  as="h4"
                  variant="label"
                  size="large"
                  weight="medium"
                  className="text-on-surface"
                >
                  {resolvedLead.name}
                </Typography>

                <Typography
                  as="span"
                  variant="body"
                  size="small"
                  weight="medium"
                  className="mt-2 text-outline"
                >
                  {toPersianDigits(resolvedLead.phone)}
                </Typography>

                {/* Interaction Chips: Call count first, then Chat count */}
                <div className="mt-2 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 py-0.5 px-1.5 rounded-md border border-surface-container">
                    <LinearCall className="h-4 w-4 text-outline" />
                    <Typography
                      as="span"
                      variant="body"
                      size="small"
                      weight="medium"
                      className="text-on-surface"
                    >
                      {toPersianDigits(resolvedLead.callCount)}
                    </Typography>
                  </span>

                  <span className="inline-flex items-center gap-1 py-0.5 px-1.5 rounded-md border border-surface-container">
                    <LinearChat className="h-4 w-4 text-outline" />
                    <Typography
                      as="span"
                      variant="body"
                      size="small"
                      weight="medium"
                      className="text-on-surface"
                    >
                      {toPersianDigits(resolvedLead.chatCount)}
                    </Typography>
                  </span>
                </div>
              </div>
            </div>

            {/* Left side: Status badge + Date & Time */}
            <div className="flex-1 flex flex-col items-start">
              <span
                className={`inline-flex items-center justify-center rounded-lg px-3 py-1 text-xs font-semibold ${
                  resolvedLead.status === "بازدید"
                    ? "bg-tertiary/8 text-tertiary"
                    : resolvedLead.statusType === "info"
                    ? "bg-info/10 text-info"
                    : "bg-warning/10 text-warning"
                }`}
              >
                {resolvedLead.status}
              </span>

              {resolvedLead.date && (
                <div className="mt-2 flex items-center gap-1">
                  <LinearCalendar className="h-4 w-4 text-outline" />
                  <Typography
                    as="span"
                    variant="body"
                    size="small"
                    weight="medium"
                    className="text-outline"
                  >
                    {resolvedLead.date}
                  </Typography>
                </div>
              )}

              {resolvedLead.time && (
                <div className="mt-2 flex items-center gap-1">
                  <LinearClock className="h-4 w-4 text-outline" />
                  <Typography
                    as="span"
                    variant="body"
                    size="small"
                    weight="medium"
                    className="text-outline"
                  >
                    {toPersianDigits(resolvedLead.time)}
                  </Typography>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 16px Surface-container gap */}
        <div className="h-4 bg-surface-container" />

        {/* Section 2: انتخاب وضعیت سرنخ */}
        <section className="bg-surface-container-lowest p-4 flex flex-col gap-4">
          <Typography
            as="h3"
            variant="label"
            size="large"
            weight="medium"
            className="text-on-surface"
          >
            انتخاب وضعیت سرنخ
          </Typography>

          {/* Status Selection Pills */}
          <div className="flex items-center gap-2">
            {STATUS_OPTIONS.map((status) => {
              const isSelected = selectedStatus === status;
              return (
                <button
                  key={status}
                  type="button"
                  onClick={() => setSelectedStatus(status)}
                  className={`flex-1 rounded-xl py-2 px-3 text-xs font-medium transition cursor-pointer border text-center ${
                    isSelected
                      ? "border-primary bg-primary/15 text-primary font-semibold shadow-2xs"
                      : "border-surface-container bg-surface-container-lowest text-outline hover:border-outline-variant"
                  }`}
                >
                  {status}
                </button>
              );
            })}
          </div>

          {/* Sub-card: تاریخ و ساعت بازدید */}
          <div className="rounded-2xl border border-surface-container bg-surface-container-lowest p-4 flex flex-col gap-3.5 shadow-2xs">
            <div className="flex items-center gap-2 text-on-surface">
              <LinearCalendar className="h-4 w-4 text-outline" />
              <Typography
                as="span"
                variant="label"
                size="medium"
                weight="medium"
                className="text-xs font-semibold text-on-surface"
              >
                تاریخ و ساعت بازدید
              </Typography>
            </div>

            {/* Date Input */}
            <div className="relative flex items-center justify-between rounded-xl border border-surface-container bg-surface-container-lowest px-3 py-2">
              <div className="flex flex-col">
                <Typography
                  as="span"
                  variant="body"
                  size="small"
                  weight="regular"
                  className="text-[10px] text-outline"
                >
                  تاریخ بازدید *
                </Typography>
                <Typography
                  as="span"
                  variant="body"
                  size="small"
                  weight="medium"
                  className="text-xs text-on-surface mt-0.5"
                >
                  {visitDate}
                </Typography>
              </div>
              <button
                type="button"
                onClick={() => setVisitDate("")}
                className="text-outline hover:text-on-surface transition cursor-pointer"
                title="پاک کردن"
              >
                <LinearCancelSmall className="h-4 w-4" />
              </button>
            </div>

            {/* Time Input */}
            <div className="relative flex items-center justify-between rounded-xl border border-surface-container bg-surface-container-lowest px-3 py-2.5">
              <Typography
                as="span"
                variant="body"
                size="small"
                weight="regular"
                className="text-xs text-outline"
              >
                ساعت بازدید *
              </Typography>
              <LinearArrowDown1 className="h-4 w-4 text-outline" />
            </div>

            {/* Action Row */}
            <div className="flex items-center justify-between gap-3 pt-1">
              <button
                type="button"
                onClick={handleVisitedClick}
                className={`rounded-xl px-4 py-2 text-xs font-semibold transition cursor-pointer shrink-0 ${
                  isVisited
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 active:scale-[0.98]"
                }`}
              >
                {isVisited ? "بازدید شد ✓" : "بازدید شد"}
              </button>

              <Typography
                as="p"
                variant="body"
                size="small"
                weight="regular"
                className="text-[11px] text-outline leading-5 flex-1"
              >
                درصورتی که بازدید را انجام دادید دکمه «بازدید شد» را بفشارید
              </Typography>
            </div>
          </div>
        </section>

        {/* 16px Surface-container gap */}
        <div className="h-4 bg-surface-container" />

        {/* Section 3: یادداشت */}
        <section className="bg-surface-container-lowest p-4 flex flex-col gap-3">
          <div className="flex items-center gap-2 text-on-surface">
            <LinearNoteAdd className="h-4 w-4 text-outline" />
            <Typography
              as="h3"
              variant="title"
              size="small"
              weight="medium"
              className="text-xs font-semibold text-on-surface"
            >
              یادداشت
            </Typography>
          </div>

          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="اطلاعات بیشتر را وارد کنید..."
            rows={3}
            className="w-full rounded-xl border border-surface-container p-3 bg-surface-container-lowest text-xs text-on-surface placeholder:text-outline focus:border-primary focus:outline-none min-h-[90px] resize-none"
          />
        </section>

        {/* 16px Surface-container gap */}
        <div className="h-4 bg-surface-container" />

        {/* Section 4: آخرین تغییرات */}
        <section className="bg-surface-container-lowest p-4 flex flex-col gap-3">
          <div className="flex items-center gap-2 text-on-surface">
            <LinearClock className="h-4 w-4 text-outline" />
            <Typography
              as="h3"
              variant="title"
              size="small"
              weight="medium"
              className="text-xs font-semibold text-on-surface"
            >
              آخرین تغییرات
            </Typography>
          </div>

          <div className="flex flex-col">
            {activities.map((act, index) => (
              <div key={act.id} className="flex flex-col">
                <div className="flex flex-col gap-1 py-2">
                  <div className="flex items-center gap-1.5 text-outline text-[11px]">
                    <LinearClock className="h-3.5 w-3.5 text-outline" />
                    <Typography
                      as="span"
                      variant="body"
                      size="small"
                      weight="regular"
                      className="text-[11px] text-outline"
                    >
                      {act.time}
                    </Typography>
                  </div>
                  <Typography
                    as="p"
                    variant="body"
                    size="small"
                    weight="regular"
                    className="text-xs text-on-surface leading-relaxed mt-0.5"
                  >
                    {act.description}
                  </Typography>
                </div>
                {index < activities.length - 1 && (
                  <div className="h-px bg-surface-container my-1" />
                )}
              </div>
            ))}
          </div>
        </section>
      </main>
    </PageFrame>
  );
}

export default ViewAdLeadDetailsPage;