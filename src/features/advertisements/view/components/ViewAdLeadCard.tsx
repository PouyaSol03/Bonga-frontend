import { Typography } from "../../../../shared/ui/Typography";
import { RouteLink } from "../../../../shared/navigation/RouteLink";
import LinearCall from "../../../../shared/icons/LinearCall";
import LinearBubbleChat from "../../../../shared/icons/LinearBubbleChat";
import LinearCalendar from "../../../../shared/icons/LinearCalendar";
import LinearClock from "../../../../shared/icons/LinearClock";
import LinearArrowLeft1 from "../../../../shared/icons/LinearArrowLeft1";
import { toPersianNumber as toPersianDigits } from "../../../../shared/lib/numberUtils";

export interface ViewAdLeadItem {
  id: string;
  name: string;
  phone: string;
  avatarUrl?: string;
  status: string;
  statusType?: "success" | "info" | "warning";
  date: string;
  time: string;
  chatCount: number;
  callCount: number;
  detailsUrl?: string;
}

export interface ViewAdLeadCardProps {
  lead: ViewAdLeadItem;
  onChatClick?: (lead: ViewAdLeadItem) => void;
  className?: string;
}

export function ViewAdLeadCard({
  lead,
  onChatClick,
  className = "",
}: ViewAdLeadCardProps) {
  const detailsHref = lead.detailsUrl || `/account/dashboard/lead-followup`;

  return (
    <article
      aria-label={`سرنخ ${lead.name}`}
      className={`w-full bg-surface-container-lowest p-4 text-right [direction:rtl] ${className}`}
    >
      {/* Top Section: Avatar + Client Info (Right) & Status + Schedule (Left) */}
      <div className="flex items-start justify-between gap-3">
        {/* Right side: Avatar + Info */}
        <div className="flex items-center gap-3 min-w-0">
          {lead.avatarUrl ? (
            <img
              src={lead.avatarUrl}
              alt={lead.name}
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
              {lead.name.slice(0, 1)}
            </div>
          )}

          <div className="flex flex-col min-w-0">
            <Typography
              as="h4"
              variant="title"
              size="small"
              weight="semibold"
              className="truncate text-sm text-on-surface font-semibold"
            >
              {lead.name}
            </Typography>

            <Typography
              as="span"
              variant="body"
              size="small"
              weight="regular"
              className="mt-0.5 text-xs text-on-surface-variant"
            >
              {toPersianDigits(lead.phone)}
            </Typography>

            {/* Interaction Chips: Call count first, then Chat count */}
            <div className="mt-2 flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1 h-[22px] px-2 rounded-md border border-outline-variant bg-surface-container-lowest text-on-surface-variant">
                <LinearCall className="h-3 w-3 text-on-surface-variant" />
                <Typography
                  as="span"
                  variant="label"
                  size="small"
                  weight="medium"
                  className="text-[11px] text-on-surface-variant leading-none"
                >
                  {toPersianDigits(lead.callCount)}
                </Typography>
              </span>

              <span className="inline-flex items-center gap-1 h-[22px] px-2 rounded-md border border-outline-variant bg-surface-container-lowest text-on-surface-variant">
                <LinearBubbleChat className="h-3 w-3 text-on-surface-variant" />
                <Typography
                  as="span"
                  variant="label"
                  size="small"
                  weight="medium"
                  className="text-[11px] text-on-surface-variant leading-none"
                >
                  {toPersianDigits(lead.chatCount)}
                </Typography>
              </span>
            </div>
          </div>
        </div>

        {/* Left side: Status badge + Date & Time */}
        <div className="flex flex-col items-end shrink-0 gap-1.5">
          <span className="inline-flex items-center justify-center h-6 px-2.5 rounded-lg bg-[#11A366]/10 text-[#11A366]">
            <Typography
              as="span"
              variant="label"
              size="small"
              weight="medium"
              className="text-xs text-[#11A366] font-medium leading-none"
            >
              {lead.status}
            </Typography>
          </span>

          <div className="flex items-center gap-1 text-on-surface-variant text-xs mt-1">
            <LinearCalendar className="h-3.5 w-3.5 text-on-surface-variant shrink-0" />
            <Typography
              as="span"
              variant="body"
              size="small"
              weight="regular"
              className="text-xs text-on-surface-variant leading-none"
            >
              {lead.date}
            </Typography>
          </div>

          <div className="flex items-center gap-1 text-on-surface-variant text-xs">
            <LinearClock className="h-3.5 w-3.5 text-on-surface-variant shrink-0" />
            <Typography
              as="span"
              variant="body"
              size="small"
              weight="regular"
              className="text-xs text-on-surface-variant leading-none"
            >
              {toPersianDigits(lead.time)}
            </Typography>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="my-3 w-full border-b border-outline-variant/60" />

      {/* Bottom Action Bar: Call (left) + Chat (mid) + Details Button (right) */}
      <div className="flex items-center gap-2">
        <RouteLink
          to={detailsHref}
          className="flex-1 h-10 rounded-xl border border-primary text-primary flex items-center justify-center gap-1.5 text-xs font-semibold hover:bg-primary/5 transition no-underline active:scale-[0.99]"
        >
          <Typography
            as="span"
            variant="label"
            size="small"
            weight="semibold"
            className="text-xs text-primary font-semibold"
          >
            جزییات
          </Typography>
          <LinearArrowLeft1 className="h-4 w-4 text-primary" />
        </RouteLink>

        <button
          type="button"
          onClick={() => onChatClick?.(lead)}
          aria-label={`ارسال پیام به ${lead.name}`}
          className="h-10 w-10 shrink-0 rounded-full bg-primary/10 text-primary flex items-center justify-center transition hover:bg-primary/20 active:scale-95"
        >
          <LinearBubbleChat className="h-5 w-5 text-primary" />
        </button>

        <a
          href={`tel:${lead.phone}`}
          aria-label={`تماس تلفنی با ${lead.name}`}
          className="h-10 w-10 shrink-0 rounded-full bg-[#11A366]/10 text-[#11A366] flex items-center justify-center transition hover:bg-[#11A366]/20 active:scale-95"
        >
          <LinearCall className="h-5 w-5 text-[#11A366]" />
        </a>
      </div>
    </article>
  );
}

export const MOCK_VIEW_AD_LEADS: ViewAdLeadItem[] = [
  {
    id: "lead-1",
    name: "ناصر اشرفی",
    phone: "09155214062",
    avatarUrl: "/mock/lead-avatar-sample.jpg",
    status: "بازدید",
    statusType: "success",
    date: "پنجشنبه ۳۱ تیر",
    time: "۱۸:۰۰",
    chatCount: 5,
    callCount: 2,
    detailsUrl: "/account/dashboard/lead-followup",
  },
  {
    id: "lead-2",
    name: "ناصر اشرفی",
    phone: "09155214062",
    avatarUrl: "/mock/lead-avatar-sample.jpg",
    status: "بازدید",
    statusType: "success",
    date: "پنجشنبه ۳۱ تیر",
    time: "۱۸:۰۰",
    chatCount: 5,
    callCount: 2,
    detailsUrl: "/account/dashboard/lead-followup",
  },
  {
    id: "lead-3",
    name: "ناصر اشرفی",
    phone: "09155214062",
    avatarUrl: "/mock/lead-avatar-sample.jpg",
    status: "بازدید",
    statusType: "success",
    date: "پنجشنبه ۳۱ تیر",
    time: "۱۸:۰۰",
    chatCount: 5,
    callCount: 2,
    detailsUrl: "/account/dashboard/lead-followup",
  },
  {
    id: "lead-4",
    name: "سارا محمدی",
    phone: "09123456789",
    status: "جدید",
    statusType: "info",
    date: "جمعه ۱ مرداد",
    time: "۱۰:۳۰",
    chatCount: 1,
    callCount: 0,
    detailsUrl: "/account/dashboard/lead-followup",
  },
  {
    id: "lead-5",
    name: "امیرحسین رضایی",
    phone: "09351234567",
    status: "پیگیری",
    statusType: "warning",
    date: "شنبه ۲ مرداد",
    time: "۱۵:۰۰",
    chatCount: 3,
    callCount: 1,
    detailsUrl: "/account/dashboard/lead-followup",
  },
  {
    id: "lead-6",
    name: "مهدی علیزاده",
    phone: "09191234567",
    status: "انصراف",
    statusType: "warning",
    date: "یکشنبه ۳ مرداد",
    time: "۱۴:۲۰",
    chatCount: 2,
    callCount: 1,
    detailsUrl: "/account/dashboard/lead-followup",
  },
];
