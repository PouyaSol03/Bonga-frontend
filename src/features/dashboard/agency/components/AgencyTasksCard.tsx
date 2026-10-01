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
    <section className="relative w-full overflow-hidden rounded-[16px] border border-[#0048C4]/40 bg-white p-4 shadow-sm [direction:rtl]">
      {/* Gradient from bottom (Schemes/On Primery Container) to top (Schemes/Primery) over Schemes/Surface Container Lowest base */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "linear-gradient(to top, var(--on-primary-container, #002099), var(--primary, #0048C4))",
        }}
      />

      <div className="relative z-10 flex flex-col">
        {/* Header */}
        <div className="mb-3 flex items-center gap-2 text-white">
          <span className="text-[16px] font-medium leading-[24px]">
            کار های امروز :
          </span>
          <span className="text-[16px] font-semibold leading-[24px] text-[#FFB100]">
            {toPersianNumber(totalCount)}
          </span>
          <span className="text-[14px] font-normal leading-[20px] text-white">
            کار برای انجام داری
          </span>
        </div>

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
                  <span className="min-w-[20px] text-[16px] font-semibold leading-[24px] text-[#FFB100]">
                    {toPersianNumber(item.count)}
                  </span>
                  <span className="text-[14px] font-normal leading-[20px] text-white">
                    {item.label}
                  </span>
                </div>
                <LinearArrowLeft1 className="h-6 w-6 shrink-0 text-white" />
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
      </div>
    </section>
  );
}
