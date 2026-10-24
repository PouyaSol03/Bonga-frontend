import { Typography } from "../../../../shared/ui/Typography";
import { toPersianNumber as toPersianDigits } from "../../../../shared/lib/numberUtils";
import LinearCall from "../../../../shared/icons/LinearCall";
import LinearChat from "../../../../shared/icons/LinearChat";
import LinearCalendar from "../../../../shared/icons/LinearCalendar";
import LinearClock from "../../../../shared/icons/LinearClock";
import type { ViewAdLeadItem } from "./ViewAdLeadCard";

interface ViewAdLeadProfileCardProps {
  lead: ViewAdLeadItem;
}

export function ViewAdLeadProfileCard({ lead }: ViewAdLeadProfileCardProps) {
  return (
    <section
      aria-label={`اطلاعات سرنخ ${lead.name}`}
      className="bg-surface-container-lowest w-full p-4 text-right [direction:rtl]"
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

        <div className="flex flex-1 flex-col items-start">
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
          )}

          {lead.time && (
            <div className="mt-2 flex items-center gap-1">
              <LinearClock className="text-outline h-4 w-4" />
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
