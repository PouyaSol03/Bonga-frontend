import { useState, useMemo } from "react";
import { PageFrame } from "../../shared/layout/PageFrame";
import { TopBar } from "../../shared/components/TopBar";
import { Typography } from "../../shared/ui/Typography";
import { Chip } from "../../shared/ui/Chip";
import { RouteLink } from "../../shared/navigation/RouteLink";
import LinearArrowLeft1 from "../../shared/icons/LinearArrowLeft1";
import { toPersianNumber } from "../../shared/lib/numberUtils";
import { cn } from "../../design-system/classes";

export type UrgentPriority = "critical" | "high" | "medium";

export interface UrgentActionPageItem {
  id: string;
  count: number;
  title: string;
  description: string;
  priority: UrgentPriority;
  priorityLabel: string;
  to: string;
}

const urgentActionsList: UrgentActionPageItem[] = [
  {
    id: "lead_followup",
    count: 5,
    title: "پیگیری سرنخ",
    description: "پیگیری‌های سررسید شده امروز",
    priority: "critical",
    priorityLabel: "خیلی بالا",
    to: "/account/dashboard/lead-followup",
  },
  {
    id: "upcoming_visit",
    count: 2,
    title: "بازدید نزدیک",
    description: "۳ ساعت تا اولین بازدید",
    priority: "critical",
    priorityLabel: "خیلی بالا",
    to: "/account/dashboard/requests",
  },
  {
    id: "waiting_client",
    count: 2,
    title: "مشتری منتظر پاسخ",
    description: "بیش از چند ساعت منتظر پاسخ‌اند",
    priority: "critical",
    priorityLabel: "خیلی بالا",
    to: "/account/dashboard/requests",
  },
  {
    id: "expiring_ad",
    count: 3,
    title: "آگهی در آستانه انقضا",
    description: "امروز منقضی می‌شوند",
    priority: "high",
    priorityLabel: "بالا",
    to: "/account/dashboard/expiring-ads",
  },
  {
    id: "failed_payment",
    count: 1,
    title: "پرداخت ناموفق",
    description: "پرداخت تمدید آگهی ناموفق بود",
    priority: "medium",
    priorityLabel: "متوسط",
    to: "/account/dashboard/payments",
  },
];

const priorityStyles: Record<
  UrgentPriority,
  {
    cardBg: string;
    cardBorder: string;
    badgeBg: string;
    badgeText: string;
  }
> = {
  critical: {
    cardBg: "bg-[#C11004]/[0.08]",
    cardBorder: "border-[#C11004]/[0.12]",
    badgeBg: "bg-[#DD2B1E]/[0.12]",
    badgeText: "text-[#DD2B1E]",
  },
  high: {
    cardBg: "bg-[#FF6D00]/[0.08]",
    cardBorder: "border-[#FF6D00]/[0.12]",
    badgeBg: "bg-[#FF8D00]/[0.12]",
    badgeText: "text-[#FF6D00]",
  },
  medium: {
    cardBg: "bg-[#FFB100]/[0.08]",
    cardBorder: "border-[#FFB100]/[0.12]",
    badgeBg: "bg-[#FFBF00]/[0.12]",
    badgeText: "text-[#FFB100]",
  },
};

export function DashboardUrgentActionsPage() {
  const [selectedPriority, setSelectedPriority] = useState<string | null>(null);

  const priorityCounts = useMemo(() => {
    return {
      critical: urgentActionsList
        .filter((item) => item.priority === "critical")
        .reduce((sum, item) => sum + item.count, 0),
      high: urgentActionsList
        .filter((item) => item.priority === "high")
        .reduce((sum, item) => sum + item.count, 0),
      medium: urgentActionsList
        .filter((item) => item.priority === "medium")
        .reduce((sum, item) => sum + item.count, 0),
    };
  }, []);

  const filterChips: { id: UrgentPriority; label: string; count: number }[] = [
    { id: "critical", label: "خیلی بالا", count: priorityCounts.critical },
    { id: "high", label: "بالا", count: priorityCounts.high },
    { id: "medium", label: "متوسط", count: priorityCounts.medium },
  ];

  const filteredItems = selectedPriority
    ? urgentActionsList.filter((item) => item.priority === selectedPriority)
    : urgentActionsList;

  return (
    <PageFrame
      className="relative mx-auto flex h-full min-h-0 w-full max-w-[500px] flex-col overflow-hidden bg-surface-container-lowest text-on-surface [direction:rtl]"
      variant="flush"
    >
      <TopBar
        backTo="/account/dashboard"
        backIconDirection="right"
        className="bg-surface-container-lowest"
        contentClassName="px-3"
        title="اقدامات فوری"
      />

      {/* Filter Bar - No dividers, uses Chip component with count badge */}
      <div className="flex items-center gap-2 bg-surface-container-lowest px-4 py-2">
        <Typography
          as="span"
          variant="label"
          size="small"
          weight="medium"
          className="text-on-surface-var whitespace-nowrap"
        >
          اولویت:
        </Typography>

        <div className="flex items-center gap-2 overflow-x-auto">
          {filterChips.map((chip) => {
            const isSelected = selectedPriority === chip.id;
            return (
              <Chip
                key={chip.id}
                selected={isSelected}
                onClick={() =>
                  setSelectedPriority((prev) => (prev === chip.id ? null : chip.id))
                }
                className="h-8 gap-1.5 rounded-full px-3 py-1 text-xs"
              >
                <span>{chip.label}</span>
                <span
                  className={cn(
                    "flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold",
                    isSelected
                      ? "bg-primary text-on-primary"
                      : "bg-surface-container-high text-on-surface-var",
                  )}
                >
                  {toPersianNumber(chip.count)}
                </span>
              </Chip>
            );
          })}
        </div>
      </div>

      {/* Content List */}
      <main className="min-h-0 flex-1 overflow-y-auto p-4 bg-surface-container-lowest">
        <div className="flex flex-col gap-3">
          {filteredItems.map((item) => {
            const styles = priorityStyles[item.priority];

            return (
              <RouteLink
                key={item.id}
                to={item.to}
                className={`flex h-[60px] items-center justify-between rounded-[12px] border px-3 transition-transform active:scale-[0.99] ${styles.cardBg} ${styles.cardBorder}`}
              >
                {/* Right: Badge Circle with Count + Title & Desc */}
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-bold text-sm ${styles.badgeBg} ${styles.badgeText}`}
                  >
                    {toPersianNumber(item.count)}
                  </div>

                  <div className="flex flex-col text-right truncate">
                    <Typography
                      as="span"
                      variant="label"
                      size="medium"
                      weight="semibold"
                      className="text-[#1A1A1A] font-bold text-sm truncate"
                    >
                      {item.title}
                    </Typography>
                    <Typography
                      as="span"
                      variant="label"
                      size="small"
                      weight="medium"
                      className="text-[#808080] text-[11px] truncate mt-0.5"
                    >
                      {item.description}
                    </Typography>
                  </div>
                </div>

                {/* Left: Arrow icon */}
                <LinearArrowLeft1 className="h-4 w-4 shrink-0 text-[#808080]" />
              </RouteLink>
            );
          })}
        </div>
      </main>
    </PageFrame>
  );
}
export default DashboardUrgentActionsPage;
