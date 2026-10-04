import { Typography } from "../../../../shared/ui/Typography";
import { toPersianNumber as toPersianDigits } from "../../../../shared/lib/numberUtils";
import LinearCall from "../../../../shared/icons/LinearCall";
import LinearChat from "../../../../shared/icons/LinearChat";
import LinearCalendar from "../../../../shared/icons/LinearCalendar";
import LinearClock from "../../../../shared/icons/LinearClock";
import type { ViewAdLeadItem } from "./ViewAdLeadCard";

export interface ViewAdLeadProfileCardProps {
  lead: ViewAdLeadItem;
}

export function ViewAdLeadProfileCard({ lead }: ViewAdLeadProfileCardProps) {
  return (
    <section
      aria-label={`اطلاعات سرنخ ${lead.name}`}
      className="w-full bg-surface-container-lowest p-4 text-right [direction:rtl]"
    >
      <div className="flex items-start gap-2">
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

        <div className="flex-1 flex flex-col items-start">
          <span
            className={`inline-flex items-center justify-center rounded-lg px-3 py-1 text-xs font-semibold ${
              lead.status === "بازدید"
                ? "bg-tertiary/8 text-tertiary"
                : lead.statusType === "info"
                ? "bg-info/10 text-info"
                : "bg-warning/10 text-warning"
            }`}
          >
            {lead.status}
          </span>

          {lead.date && (
            <div className="mt-2 flex items-center gap-1">
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
          )}

          {lead.time && (
            <div className="mt-2 flex items-center gap-1">
              <LinearClock className="h-4 w-4 text-outline" />
              <Typography
                as="span"
                variant="body"
                size="small"
                weight="medium"
                className="text-outline"
              >
                {toPersianDigits(lead.time)}
              </Typography>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
