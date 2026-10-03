import { useState } from "react";
import { BottomSheet } from "../../../../shared/components/BottomSheet";
import { Typography } from "../../../../shared/ui/Typography";
import { toPersianNumber as toPersianDigits } from "../../../../shared/lib/numberUtils";
import LinearCall from "../../../../shared/icons/LinearCall";
import LinearChat from "../../../../shared/icons/LinearChat";
import LinearCalendar from "../../../../shared/icons/LinearCalendar";
import LinearClock from "../../../../shared/icons/LinearClock";
import LinearArrowDown1 from "../../../../shared/icons/LinearArrowDown1";
import LinearCancelSmall from "../../../../shared/icons/LinearCancelSmall";
import LinearNoteAdd from "../../../../shared/icons/LinearNoteAdd";
import type { ViewAdLeadItem } from "./ViewAdLeadCard";

export interface ViewAdLeadDetailsBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  lead: ViewAdLeadItem | null;
  onStatusChange?: (leadId: string, newStatus: string) => void;
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

export function ViewAdLeadDetailsBottomSheet({
  isOpen,
  onClose,
  lead,
  onStatusChange,
}: ViewAdLeadDetailsBottomSheetProps) {
  const [selectedStatus, setSelectedStatus] = useState<string>(
    lead?.status || "بازدید"
  );
  const [visitDate, setVisitDate] = useState("۱۲ اسفند ۱۴۰۴");
  const [visitTime] = useState("۱۸:۰۰");
  const [isVisited, setIsVisited] = useState(false);
  const [note, setNote] = useState("");
  const [activities, setActivities] = useState<ActivityLogItem[]>(DEFAULT_ACTIVITIES);

  if (!lead) return null;

  const phoneDisplay = lead.phone ? toPersianDigits(lead.phone) : "";

  const handleStatusSelect = (status: string) => {
    setSelectedStatus(status);
    onStatusChange?.(lead.id, status);
  };

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
    <BottomSheet
      ariaLabel="جزئیات سرنخ"
      title="جزئیات سرنخ"
      isOpen={isOpen}
      onClose={onClose}
      showHandle={true}
      showHeader={true}
      heightClassName="h-[92svh] max-h-[92svh] flex flex-col"
      panelPaddingClassName="pt-2 flex flex-col"
      contentClassName="overflow-y-auto flex-1 min-h-0 bg-surface-container [direction:rtl]"
    >
      <div className="flex flex-col bg-surface-container pb-8 [direction:rtl]">
        {/* Section 1: Lead Card Header matching Capture / Main Container */}
        <section className="bg-surface-container-lowest p-4">
          <div className="flex items-start justify-between gap-3">
            {/* Avatar & User Details */}
            <div className="flex items-start gap-3">
              {lead.avatarUrl ? (
                <img
                  src={lead.avatarUrl}
                  alt={lead.name}
                  className="h-14 w-14 rounded-full object-cover border border-outline-variant/60 shrink-0"
                />
              ) : (
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-base border border-outline-variant/60">
                  {lead.name.slice(0, 1)}
                </div>
              )}

              <div className="flex flex-col gap-1">
                <Typography
                  as="h3"
                  variant="title"
                  size="small"
                  weight="semibold"
                  className="text-sm font-bold text-on-surface"
                >
                  {lead.name}
                </Typography>

                <Typography
                  as="p"
                  variant="body"
                  size="small"
                  weight="regular"
                  className="text-xs text-on-surface-variant [direction:ltr] text-right"
                >
                  {phoneDisplay}
                </Typography>

                {/* Call & Chat Pills */}
                <div className="mt-1 flex items-center gap-2">
                  <div className="flex items-center gap-1 rounded-md border border-outline-variant/60 bg-surface-container-lowest px-2 py-0.5 text-xs text-on-surface">
                    <LinearCall className="h-3.5 w-3.5 text-on-surface-variant" />
                    <span className="text-[11px] font-medium">
                      {toPersianDigits(lead.callCount)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 rounded-md border border-outline-variant/60 bg-surface-container-lowest px-2 py-0.5 text-xs text-on-surface">
                    <LinearChat className="h-3.5 w-3.5 text-on-surface-variant" />
                    <span className="text-[11px] font-medium">
                      {toPersianDigits(lead.chatCount)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Left Column: Status Badge, Date & Time */}
            <div className="flex flex-col items-end gap-1.5 shrink-0">
              <span className="rounded-lg bg-[#E8F5E9] px-3 py-1 text-xs font-semibold text-[#2E7D32]">
                {lead.status}
              </span>

              {lead.date && (
                <div className="flex items-center gap-1 text-[11px] text-on-surface-variant">
                  <span className="leading-tight">{lead.date}</span>
                  <LinearCalendar className="h-3.5 w-3.5 text-on-surface-variant" />
                </div>
              )}

              {lead.time && (
                <div className="flex items-center gap-1 text-[11px] text-on-surface-variant">
                  <span className="leading-tight">{toPersianDigits(lead.time)}</span>
                  <LinearClock className="h-3.5 w-3.5 text-on-surface-variant" />
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
            as="h4"
            variant="title"
            size="small"
            weight="semibold"
            className="text-sm font-bold text-on-surface"
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
                  onClick={() => handleStatusSelect(status)}
                  className={`flex-1 rounded-xl py-2 px-3 text-xs font-medium transition cursor-pointer border text-center ${
                    isSelected
                      ? "border-primary bg-primary/10 text-primary font-semibold"
                      : "border-outline-variant/70 bg-surface-container-lowest text-on-surface-variant hover:border-outline-variant"
                  }`}
                >
                  {status}
                </button>
              );
            })}
          </div>

          {/* Sub-card: تاریخ و ساعت بازدید */}
          <div className="rounded-2xl border border-outline-variant/60 bg-surface-container-lowest p-4 flex flex-col gap-3.5 shadow-2xs">
            <div className="flex items-center gap-2 text-on-surface">
              <LinearCalendar className="h-4 w-4 text-on-surface" />
              <Typography
                as="span"
                variant="label"
                size="medium"
                weight="semibold"
                className="text-xs font-bold text-on-surface"
              >
                تاریخ و ساعت بازدید
              </Typography>
            </div>

            {/* Date Input */}
            <div className="relative flex items-center justify-between rounded-xl border border-outline-variant/80 bg-surface-container-lowest px-3 py-2">
              <div className="flex flex-col">
                <span className="text-[10px] text-on-surface-variant">
                  تاریخ بازدید *
                </span>
                <span className="text-xs font-medium text-on-surface mt-0.5">
                  {visitDate}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setVisitDate("")}
                className="text-on-surface-variant hover:text-on-surface transition cursor-pointer"
                title="پاک کردن"
              >
                <LinearCancelSmall className="h-4 w-4" />
              </button>
            </div>

            {/* Time Input */}
            <div className="relative flex items-center justify-between rounded-xl border border-outline-variant/80 bg-surface-container-lowest px-3 py-2.5">
              <span className="text-xs text-on-surface-variant">
                ساعت بازدید *
              </span>
              <LinearArrowDown1 className="h-4 w-4 text-on-surface-variant" />
            </div>

            {/* Action Row */}
            <div className="flex items-center justify-between gap-3 pt-1">
              <button
                type="button"
                onClick={handleVisitedClick}
                className={`rounded-xl border border-primary px-4 py-2 text-xs font-semibold transition cursor-pointer shrink-0 ${
                  isVisited
                    ? "bg-primary text-on-primary border-primary"
                    : "bg-surface-container-lowest text-primary hover:bg-primary/5 active:scale-[0.99]"
                }`}
              >
                {isVisited ? "بازدید شد ✓" : "بازدید شد"}
              </button>

              <Typography
                as="p"
                variant="body"
                size="small"
                weight="regular"
                className="text-[11px] text-on-surface-variant leading-tight"
              >
                درصورتی که بازدید را انجام دادید دکمه "بازدید شد" را بفشارید
              </Typography>
            </div>
          </div>
        </section>

        {/* 16px Surface-container gap */}
        <div className="h-4 bg-surface-container" />

        {/* Section 3: یادداشت */}
        <section className="bg-surface-container-lowest p-4 flex flex-col gap-3">
          <div className="flex items-center gap-2 text-on-surface">
            <LinearNoteAdd className="h-4 w-4 text-on-surface" />
            <Typography
              as="h4"
              variant="title"
              size="small"
              weight="semibold"
              className="text-xs font-bold text-on-surface"
            >
              یادداشت
            </Typography>
          </div>

          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="اطلاعات بیشتر را وارد کنید..."
            rows={3}
            className="w-full rounded-xl border border-outline-variant/80 p-3 bg-surface-container-lowest text-xs text-on-surface placeholder:text-outline focus:border-primary focus:outline-none min-h-[90px] resize-none"
          />
        </section>

        {/* 16px Surface-container gap */}
        <div className="h-4 bg-surface-container" />

        {/* Section 4: آخرین تغییرات */}
        <section className="bg-surface-container-lowest p-4 flex flex-col gap-3">
          <div className="flex items-center gap-2 text-on-surface">
            <LinearClock className="h-4 w-4 text-on-surface" />
            <Typography
              as="h4"
              variant="title"
              size="small"
              weight="semibold"
              className="text-xs font-bold text-on-surface"
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
                    <span>{act.time}</span>
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
                  <div className="h-px bg-outline-variant/60 my-1" />
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </BottomSheet>
  );
}

export default ViewAdLeadDetailsBottomSheet;