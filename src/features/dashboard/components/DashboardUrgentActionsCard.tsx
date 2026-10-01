import { Typography } from "../../../shared/ui/Typography";
import { RouteLink } from "../../../shared/navigation/RouteLink";
import LinearArrowLeft1 from "../../../shared/icons/LinearArrowLeft1";
import LinearTick from "../../../shared/icons/LinearTick";
import { toPersianNumber } from "../../../shared/lib/numberUtils";

export interface DashboardUrgentActionItem {
  id: string;
  count: number;
  title: string;
  description: string;
  urgency?: "critical" | "warning" | "caution";
  priority?: "critical" | "high" | "medium";
  priorityLabel?: string;
  to: string;
}

export interface DashboardUrgentActionsCardProps {
  items?: DashboardUrgentActionItem[];
  viewAllTo?: string;
  title?: string;
}

export const defaultUrgentActions: DashboardUrgentActionItem[] = [
  {
    id: "lead_followup",
    count: 5,
    title: "پیگیری سرنخ",
    description: "پیگیری‌های سررسید شده امروز",
    urgency: "critical",
    to: "/account/dashboard/lead-followup",
  },
  {
    id: "upcoming_visit",
    count: 2,
    title: "بازدید نزدیک",
    description: "۳ ساعت تا اولین بازدید",
    urgency: "critical",
    to: "/account/dashboard/requests",
  },
  {
    id: "waiting_client",
    count: 2,
    title: "مشتری منتظر پاسخ",
    description: "بیش از چند ساعت منتظر پاسخ‌اند",
    urgency: "critical",
    to: "/account/dashboard/requests",
  },
  {
    id: "expiring_ad",
    count: 3,
    title: "آگهی در آستانه انقضا",
    description: "امروز منقضی می‌شوند",
    urgency: "warning",
    to: "/account/manage-ads",
  },
  {
    id: "failed_payment",
    count: 1,
    title: "پرداخت ناموفق",
    description: "پرداخت تمدید آگهی ناموفق بود",
    urgency: "caution",
    to: "/account/dashboard/payments",
  },
];

const urgencyStyles = {
  critical: {
    bg: "bg-[#C11004]/[0.08]",
    border: "border-[#C11004]/[0.12]",
    badgeBg: "bg-[#DD2B1E]/[0.12]",
    badgeText: "text-[#C11004]",
  },
  warning: {
    bg: "bg-[#FF8D00]/[0.08]",
    border: "border-[#FF8D00]/[0.12]",
    badgeBg: "bg-[#FF8D00]/[0.12]",
    badgeText: "text-[#FF8D00]",
  },
  caution: {
    bg: "bg-[#FFBF00]/[0.08]",
    border: "border-[#FFBF00]/[0.12]",
    badgeBg: "bg-[#FFBF00]/[0.12]",
    badgeText: "text-[#FFB100]",
  },
};

export function DashboardUrgentActionsCard({
  items = [],
  viewAllTo = "/account/dashboard/urgent-actions",
  title = "اقدامات فوری",
}: DashboardUrgentActionsCardProps) {
  return (
    <section className="w-full rounded-[16px] bg-surface-container-lowest p-4 shadow-sm [direction:rtl]">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <Typography
          as="h2"
          variant="title"
          size="small"
          weight="semibold"
          className="text-on-surface"
        >
          {title}
        </Typography>
        {items.length > 0 && (
          <RouteLink
            className="flex items-center gap-1 text-primary hover:underline"
            to={viewAllTo}
          >
            <Typography
              as="span"
              variant="label"
              size="small"
              weight="medium"
              className="text-primary"
            >
              مشاهده همه
            </Typography>
            <LinearArrowLeft1 className="h-3.5 w-3.5" />
          </RouteLink>
        )}
      </div>

      {/* Action items list or empty state */}
      {!items || items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-full bg-success-container/40 text-success">
            <LinearTick className="h-6 w-6" />
          </div>
          <Typography
            as="p"
            variant="label"
            size="medium"
            weight="medium"
            className="text-on-surface"
          >
            اقدام فوری وجود ندارد
          </Typography>
          <Typography
            as="p"
            variant="body"
            size="small"
            weight="regular"
            className="mt-0.5 text-on-surface-var"
          >
            همه موارد تحت کنترل است
          </Typography>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {items.map((item) => {
            const urgencyKey =
              item.urgency ??
              (item.priority === "critical"
                ? "critical"
                : item.priority === "high"
                  ? "warning"
                  : "caution");
            const style = urgencyStyles[urgencyKey] ?? urgencyStyles.caution;
            return (
              <RouteLink
                key={item.id}
                to={item.to || "#"}
                className={`flex items-center justify-between rounded-[12px] border ${style.border} ${style.bg} p-2.5 transition hover:opacity-90 active:scale-[0.99] no-underline`}
              >
                <div className="flex items-center gap-3">
                  {/* Number Badge */}
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${style.badgeBg}`}
                  >
                    <Typography
                      as="span"
                      variant="label"
                      size="small"
                      weight="semibold"
                      className={style.badgeText}
                    >
                      {toPersianNumber(item.count)}
                    </Typography>
                  </div>

                  {/* Texts */}
                  <div className="flex flex-col text-right">
                    <Typography
                      as="span"
                      variant="label"
                      size="medium"
                      weight="semibold"
                      className="text-on-surface"
                    >
                      {item.title}
                    </Typography>
                    <Typography
                      as="span"
                      variant="body"
                      size="small"
                      weight="regular"
                      className="text-on-surface-var"
                    >
                      {item.description}
                    </Typography>
                  </div>
                </div>

                <LinearArrowLeft1 className="h-4 w-4 text-on-surface-var" />
              </RouteLink>
            );
          })}
        </div>
      )}
    </section>
  );
}
