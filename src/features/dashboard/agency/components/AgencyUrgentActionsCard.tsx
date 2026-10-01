import { RouteLink } from "../../../../shared/navigation/RouteLink";
import LinearArrowLeft1 from "../../../../shared/icons/LinearArrowLeft1";
import { toPersianNumber } from "../../../../shared/lib/numberUtils";
import type { AgencyUrgentAction } from "../types";

export interface AgencyUrgentActionsCardProps {
  items?: AgencyUrgentAction[];
  viewAllTo?: string;
}

const defaultUrgentActions: AgencyUrgentAction[] = [
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
    bg: "bg-[#FFF1F1]",
    border: "border-[#FCA5A5]/60",
    badgeBg: "bg-[#FCE7E7]",
    badgeText: "text-[#DC2626]",
  },
  warning: {
    bg: "bg-[#FFF7ED]",
    border: "border-[#FDBA74]/60",
    badgeBg: "bg-[#FFEDD5]",
    badgeText: "text-[#EA580C]",
  },
  caution: {
    bg: "bg-[#FEFCE8]",
    border: "border-[#FDE047]/60",
    badgeBg: "bg-[#FEF9C3]",
    badgeText: "text-[#CA8A04]",
  },
};

export function AgencyUrgentActionsCard({
  items = defaultUrgentActions,
  viewAllTo = "/account/dashboard/requests",
}: AgencyUrgentActionsCardProps) {
  return (
    <section className="w-full rounded-[16px] bg-white p-4 shadow-sm [direction:rtl]">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-[14px] font-bold text-[#1A1A1A]">اقدامات فوری</h2>
        <RouteLink
          className="flex items-center gap-1 text-[12px] font-medium text-[#0048C4] hover:underline"
          to={viewAllTo}
        >
          <span>مشاهده همه</span>
          <LinearArrowLeft1 className="h-3.5 w-3.5" />
        </RouteLink>
      </div>

      {/* Action Items List */}
      <div className="flex flex-col gap-2.5">
        {items.map((item) => {
          const st = urgencyStyles[item.urgency];
          return (
            <RouteLink
              key={item.id}
              className={`flex items-center justify-between rounded-[12px] border ${st.border} ${st.bg} p-2.5 transition hover:opacity-90 active:scale-[0.99] no-underline`}
              to={item.to || "#"}
            >
              <div className="flex items-center gap-3">
                {/* Number Badge */}
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${st.badgeBg} ${st.badgeText} text-[13px] font-bold`}
                >
                  {toPersianNumber(item.count)}
                </div>

                {/* Texts */}
                <div className="flex flex-col text-right">
                  <span className="text-[13px] font-bold text-[#1A1A1A]">
                    {item.title}
                  </span>
                  <span className="text-[11px] font-normal text-[#757575]">
                    {item.description}
                  </span>
                </div>
              </div>

              <LinearArrowLeft1 className="h-4 w-4 text-[#9CA3AF]" />
            </RouteLink>
          );
        })}
      </div>
    </section>
  );
}
