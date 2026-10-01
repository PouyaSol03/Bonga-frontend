import { RouteLink } from "../../../../shared/navigation/RouteLink";
import LinearArrowLeft1 from "../../../../shared/icons/LinearArrowLeft1";
import { toPersianNumber } from "../../../../shared/lib/numberUtils";
import type { AgencyTaskItem } from "../types";

export interface AgencyTasksCardProps {
  totalCount?: number;
  items?: AgencyTaskItem[];
}

const defaultItems: AgencyTaskItem[] = [
  { id: "leads", count: 3, label: "پیگیری سرنخ", to: "/account/dashboard/requests" },
  { id: "visits", count: 12, label: "بازدید امروز", to: "/account/dashboard/requests" },
  { id: "pro_ads", count: 20, label: "آگهی تخصصی", to: "/account/manage-ads" },
  { id: "others", count: 11, label: "سایر موارد", to: "/account/dashboard/requests" },
];

export function AgencyTasksCard({
  totalCount = 46,
  items = defaultItems,
}: AgencyTasksCardProps) {
  return (
    <section className="w-full overflow-hidden rounded-[16px] bg-gradient-to-b from-[#5A82E2] to-[#456DCF] p-4 text-white shadow-sm [direction:rtl]">
      {/* Header */}
      <h2 className="mb-3 text-[14px] font-bold text-white">
        <span>کارهای امروز: </span>
        <span className="text-[#FFD13B] font-extrabold">{toPersianNumber(totalCount)}</span>
        <span> کار برای انجام داری</span>
      </h2>

      {/* Task Rows */}
      <div className="flex flex-col">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          const content = (
            <div
              className={`flex items-center justify-between py-2.5 transition active:opacity-80 ${
                !isLast ? "border-b border-white/15" : ""
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="min-w-[20px] text-[14px] font-bold text-[#FFD13B]">
                  {toPersianNumber(item.count)}
                </span>
                <span className="text-[13px] font-medium text-white">
                  {item.label}
                </span>
              </div>
              <LinearArrowLeft1 className="h-4 w-4 text-white/80" />
            </div>
          );

          if (item.to) {
            return (
              <RouteLink key={item.id} className="no-underline" to={item.to}>
                {content}
              </RouteLink>
            );
          }

          return (
            <button
              key={item.id}
              className="w-full text-right cursor-pointer bg-transparent border-none p-0"
              onClick={item.onClick}
              type="button"
            >
              {content}
            </button>
          );
        })}
      </div>
    </section>
  );
}
