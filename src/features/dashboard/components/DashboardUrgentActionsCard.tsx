import { Typography } from "../../../shared/ui/Typography";
import { RouteLink } from "../../../shared/navigation/RouteLink";
import LinearArrowLeft1 from "../../../shared/icons/LinearArrowLeft1";
import { toPersianNumber } from "../../../shared/lib/numberUtils";

export interface DashboardUrgentActionItem {
  id: string;
  count: number;
  title: string;
  description: string;
  urgency: "critical" | "warning" | "caution";
  to: string;
}

export interface DashboardUrgentActionsCardProps {
  items?: DashboardUrgentActionItem[];
  viewAllTo?: string;
  title?: string;
}

const defaultUrgentActions: DashboardUrgentActionItem[] = [
  {
    id: "lead_followup",
    count: 5,
    title: "پیگیری سرنخ",
    description: "پیگیری‌های سررسید شده امروز",
    urgency: "critical",
    to: "/account/dashboard/requests",
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
    bg: "bg-error-container/40",
    border: "border-error/30",
    badgeBg: "bg-error-container",
    badgeText: "text-error",
  },
  warning: {
    bg: "bg-warning-container/40",
    border: "border-warning/30",
    badgeBg: "bg-warning-container",
    badgeText: "text-warning",
  },
  caution: {
    bg: "bg-warning-container/20",
    border: "border-warning/20",
    badgeBg: "bg-warning-container/50",
    badgeText: "text-warning",
  },
};

export function DashboardUrgentActionsCard({
  items = defaultUrgentActions,
  viewAllTo = "/account/dashboard/requests",
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
      </div>

      {/* Action items list */}
      <div className="flex flex-col gap-2.5">
        {items.map((item) => {
          const style = urgencyStyles[item.urgency];
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

              <LinearArrowLeft1 className="h-4 w-4 text-outline" />
            </RouteLink>
          );
        })}
      </div>
    </section>
  );
}
