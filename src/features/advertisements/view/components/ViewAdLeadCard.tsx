import { Typography } from "../../../../shared/ui/Typography";
import { RouteLink } from "../../../../shared/navigation/RouteLink";
import LinearCall from "../../../../shared/icons/LinearCall";
import LinearCalendar from "../../../../shared/icons/LinearCalendar";
import LinearClock from "../../../../shared/icons/LinearClock";
import LinearArrowLeft1 from "../../../../shared/icons/LinearArrowLeft1";
import { toPersianNumber as toPersianDigits } from "../../../../shared/lib/numberUtils";
import LinearChat from "../../../../shared/icons/LinearChat";

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
  onDetailsClick?: (lead: ViewAdLeadItem) => void;
  className?: string;
}

export function ViewAdLeadCard({
  lead,
  onChatClick,
  onDetailsClick,
  className = "",
}: ViewAdLeadCardProps) {
  const detailsHref = lead.detailsUrl || `/account/dashboard/lead-followup`;

  return (
    <article
      aria-label={`سرنخ ${lead.name}`}
      className={`w-full bg-surface-container-lowest p-4 text-right [direction:rtl] ${className}`}
    >
      {/* Top Section: Avatar + Client Info (Right) & Status + Schedule (Left) */}
      <div className="flex items-start gap-2">
        {/* Right side: Avatar + Info */}
        <div className="flex gap-3">
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

          <div className="flex flex-col min-w-31.5">
            <Typography
              as="h4"
              variant="label"
              size="large"
              weight="medium"
              className="text-on-surface"
            >
              {lead.name}
            </Typography>

            <Typography
              as="span"
              variant="body"
              size="small"
              weight="medium"
              className="mt-2 text-outline"
            >
              {toPersianDigits(lead.phone)}
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
                  {toPersianDigits(lead.callCount)}
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
                  {toPersianDigits(lead.chatCount)}
                </Typography>
              </span>
            </div>
          </div>
        </div>

        {/* Left side: Status badge + Date & Time */}
        <div className="flex flex-col items-start shrink-0 gap-2">
          <span className="inline-flex items-center justify-center h-6 px-2.5 rounded-lg bg-tertiary/8 text-tertiary">
            <Typography
              as="span"
              variant="label"
              size="small"
              weight="medium"
              className="text-tertiary"
            >
              {lead.status}
            </Typography>
          </span>

          <div className="flex items-center gap-1 mt-1">
            <LinearCalendar className="h-4 w-4 text-outline" />
            <Typography
              as="span"
              variant="body"
              size="small"
              weight="medium"
              className="text-outline"
            >
              {lead.date}
            </Typography>
          </div>

          <div className="flex items-center gap-1">
            <LinearClock className="h-4 w-4 text-outline" />
            <Typography
              as="span"
              variant="body"
              size="small"
              weight="regular"
              className="text-outline"
            >
              {toPersianDigits(lead.time)}
            </Typography>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="my-4 w-full border-b border-outline-variant/60" />

      {/* Bottom Action Bar: Call (left) + Chat (mid) + Details Button (right) */}
      <div className="flex items-center gap-2">
        {onDetailsClick ? (
          <button
            type="button"
            onClick={() => onDetailsClick(lead)}
            className="flex-1 h-10 rounded-xl border border-primary text-primary flex items-center justify-center gap-1.5 text-xs font-semibold hover:bg-primary/5 transition active:scale-[0.99] cursor-pointer"
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
          </button>
        ) : (
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
        )}

        <button
          type="button"
          onClick={() => onChatClick?.(lead)}
          aria-label={`ارسال پیام به ${lead.name}`}
          className="h-10 w-10 shrink-0 rounded-full bg-primary/8 flex items-center justify-center active:scale-95"
        >
          <LinearChat className="h-6 w-6 text-primary" />
        </button>

        <a
          href={`tel:${lead.phone}`}
          aria-label={`تماس تلفنی با ${lead.name}`}
          className="h-10 w-10 shrink-0 rounded-full bg-tertiary/8 flex items-center justify-center active:scale-95"
        >
          <LinearCall className="h-6 w-6 text-tertiary" />
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
