import { Typography } from "../../../../shared/ui/Typography";
import { Link } from "react-router";
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
  adId?: string | number;
  onChatClick?: (lead: ViewAdLeadItem) => void;
  onDetailsClick?: (lead: ViewAdLeadItem) => void;
  className?: string;
}

export function ViewAdLeadCard({
  lead,
  adId,
  onChatClick,
  onDetailsClick,
  className = "",
}: ViewAdLeadCardProps) {
  const detailsHref = adId
    ? `/account/my-ads/${encodeURIComponent(String(adId))}/lead-details?leadId=${encodeURIComponent(lead.id)}`
    : lead.detailsUrl || `/account/my-ads/lead-details?leadId=${encodeURIComponent(lead.id)}`;

  return (
    <article
      aria-label={`سرنخ ${lead.name}`}
      className={`bg-surface-container-lowest w-full p-4 text-right [direction:rtl] ${className}`}
    >
      <div className="flex items-start gap-2">
        <div className="flex gap-3">
          {lead.avatarUrl ? (
            <img
              src={lead.avatarUrl}
              alt={lead.name}
              className="bg-surface-container border-outline-variant h-14 w-14 shrink-0 rounded-full border object-cover"
              onError={(e) => {
                (e.target as HTMLElement).style.display = "none";
              }}
            />
          ) : (
            <div
              aria-hidden="true"
              className="bg-primary/10 text-primary border-primary/20 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border text-base font-bold"
            >
              {lead.name.slice(0, 1)}
            </div>
          )}

          <div className="flex min-w-31.5 flex-col">
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
              className="text-outline mt-2"
            >
              {toPersianDigits(lead.phone)}
            </Typography>

            <div className="mt-2 flex items-center gap-2">
              <span className="border-surface-container inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5">
                <LinearCall className="text-outline h-4 w-4" />
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

              <span className="border-surface-container inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5">
                <LinearChat className="text-outline h-4 w-4" />
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

        <div className="flex shrink-0 flex-col items-start gap-2">
          <span className="bg-tertiary/8 text-tertiary inline-flex h-6 items-center justify-center rounded-lg px-2.5">
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

          <div className="mt-1 flex items-center gap-1">
            <LinearCalendar className="text-outline h-4 w-4" />
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
            <LinearClock className="text-outline h-4 w-4" />
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

      <div className="border-outline-variant/60 my-4 w-full border-b" />

      <div className="flex items-center gap-2">
        <Link
          to={detailsHref}
          state={{ lead, adId }}
          onClick={() => onDetailsClick?.(lead)}
          className="border-primary text-primary flex h-10 flex-1 items-center justify-center gap-1.5 rounded-xl border text-xs font-semibold no-underline transition active:scale-[0.99]"
        >
          <Typography
            as="span"
            variant="label"
            size="small"
            weight="semibold"
            className="text-primary text-xs font-semibold"
          >
            جزییات
          </Typography>
          <LinearArrowLeft1 className="text-primary h-4 w-4" />
        </Link>

        <button
          type="button"
          onClick={() => onChatClick?.(lead)}
          aria-label={`ارسال پیام به ${lead.name}`}
          className="bg-primary/8 flex h-10 w-10 shrink-0 items-center justify-center rounded-full active:scale-95"
        >
          <LinearChat className="text-primary h-6 w-6" />
        </button>

        <a
          href={`tel:${lead.phone}`}
          aria-label={`تماس تلفنی با ${lead.name}`}
          className="bg-tertiary/8 flex h-10 w-10 shrink-0 items-center justify-center rounded-full active:scale-95"
        >
          <LinearCall className="text-tertiary h-6 w-6" />
        </a>
      </div>
    </article>
  );
}

export { MOCK_VIEW_AD_LEADS } from "./viewAdLeadMockData";
