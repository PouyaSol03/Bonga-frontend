import { RouteLink } from "../../../../shared/navigation/RouteLink";
import LinearArrowLeft1 from "../../../../shared/icons/LinearArrowLeft1";
import { toPersianNumber } from "../../../../shared/lib/numberUtils";
import type { AgentRoleType } from "../types";

export interface AgentTaskItemData {
  id: string;
  count: number;
  label: string;
  to: string;
}

export interface AgentTasksCardProps {
  role?: AgentRoleType;
  totalCount?: number;
  items?: AgentTaskItemData[];
}

export function AgentTasksCard({
  role = "REAL_ESTATE_CONSULTANT",
  totalCount = 46,
  items,
}: AgentTasksCardProps) {
  const isIndependent = role === "INDEPENDENT_CONSULTANT";

  const defaultItems: AgentTaskItemData[] = [
    { id: "leads", count: 3, label: "پیگیری سرنخ", to: "/account/dashboard/requests" },
    { id: "visits", count: 12, label: "بازدید امروز", to: "/account/dashboard/requests" },
    {
      id: "ads",
      count: 20,
      label: isIndependent ? "آگهی تخصصی" : "آگهی تخصیصی",
      to: "/account/manage-ads",
    },
    { id: "others", count: 11, label: "سایر موارد", to: "/account/dashboard/requests" },
  ];

  const taskList = items ?? defaultItems;

  return (
    <section className="w-full rounded-[16px] bg-gradient-to-r from-[#5A82E2] to-[#456DCF] p-4 text-white shadow-sm [direction:rtl]">
      {/* Title */}
      <h2 className="mb-3 text-[14px] font-bold text-white">
        <span>کارهای امروز: </span>
        <span className="text-[#FFD13B] font-extrabold">{toPersianNumber(totalCount)}</span>
        <span> کار برای انجام داری</span>
      </h2>

      {/* Task Rows */}
      <div className="flex flex-col">
        {taskList.map((item, idx) => {
          const isLast = idx === taskList.length - 1;
          return (
            <RouteLink
              key={item.id}
              to={item.to}
              className={`flex items-center justify-between py-2.5 transition active:opacity-80 no-underline ${
                !isLast ? "border-b border-white/15" : ""
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="min-w-[20px] text-[14px] font-bold text-[#FFD13B]">
                  {toPersianNumber(item.count)}
                </span>
                <span className="text-[12px] font-normal text-white">
                  {item.label}
                </span>
              </div>
              <LinearArrowLeft1 className="h-3.5 w-3.5 text-white/70" />
            </RouteLink>
          );
        })}
      </div>
    </section>
  );
}
