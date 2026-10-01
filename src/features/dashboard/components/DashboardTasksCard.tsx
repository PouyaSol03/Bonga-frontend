import { Typography } from "../../../shared/ui/Typography";
import { RouteLink } from "../../../shared/navigation/RouteLink";
import LinearArrowLeft1 from "../../../shared/icons/LinearArrowLeft1";
import { toPersianNumber } from "../../../shared/lib/numberUtils";

export type DashboardTaskRole =
  | "REAL_ESTATE_MANAGER"
  | "REAL_ESTATE_CONSULTANT"
  | "INDEPENDENT_CONSULTANT";

export interface DashboardTaskItem {
  id: string;
  count: number;
  label: string;
  to?: string;
  onClick?: () => void;
}

export interface DashboardTasksCardProps {
  role?: DashboardTaskRole;
  totalCount?: number;
  items?: DashboardTaskItem[];
}

export function DashboardTasksCard({
  role = "REAL_ESTATE_CONSULTANT",
  totalCount = 46,
  items,
}: DashboardTasksCardProps) {
  const isAssigned = role === "REAL_ESTATE_CONSULTANT";

  const defaultItems: DashboardTaskItem[] = [
    { id: "leads", count: 3, label: "پیگیری سرنخ", to: "/account/dashboard/requests" },
    { id: "visits", count: 12, label: "بازدید امروز", to: "/account/dashboard/requests" },
    {
      id: "ads",
      count: 20,
      label: isAssigned ? "آگهی تخصیصی" : "آگهی تخصصی",
      to: "/account/manage-ads",
    },
    { id: "others", count: 11, label: "سایر موارد", to: "/account/dashboard/requests" },
  ];

  const taskList = items ?? defaultItems;

  return (
    <section
      className="relative w-full overflow-hidden rounded-[16px] border border-[#0048C4]/40 p-4 shadow-sm [direction:rtl]"
      style={{
        background:
          "linear-gradient(to left, var(--on-primary-container, #002099), var(--primary, #0048C4))",
      }}
    >
      <div className="relative z-10 flex flex-col">
        {/* Header */}
        <div className="mb-3 flex items-center gap-2 text-white">
          <Typography as="span" variant="label" size="large" weight="medium" className="text-white">
            کار های امروز :
          </Typography>
          <Typography as="span" variant="label" size="large" weight="semibold" className="text-[#FFB100]">
            {toPersianNumber(totalCount)}
          </Typography>
          <Typography as="span" variant="body" size="medium" weight="regular" className="text-white">
            کار برای انجام داری
          </Typography>
        </div>

        {/* Task Rows */}
        <div className="flex flex-col">
          {taskList.map((item, idx) => {
            const isLast = idx === taskList.length - 1;
            const content = (
              <div
                className={`flex items-center justify-between py-2.5 transition active:opacity-80 ${
                  !isLast ? "border-b border-white/15" : ""
                }`}
              >
                <div className="flex items-center gap-2">
                  <Typography
                    as="span"
                    variant="label"
                    size="large"
                    weight="semibold"
                    className="min-w-[20px] text-[#FFB100]"
                  >
                    {toPersianNumber(item.count)}
                  </Typography>
                  <Typography as="span" variant="body" size="medium" weight="regular" className="text-white">
                    {item.label}
                  </Typography>
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
