import { Typography } from "../../../../shared/ui/Typography";
import { DashboardChartEmptyState } from "./DashboardChartEmptyState";
import { toPersianNumber } from "../../../../shared/lib/numberUtils";

export interface FunnelStage {
  id: string;
  label: string;
  value?: string;
  count?: number;
  badgeText?: string;
  percentage?: number;
  badgeColor?: string;
  pathD?: string;
  viewBox?: string;
  width?: number;
  height?: number;
  isCheckmark?: boolean;
  checkmarkPath?: string;
  isValueGreen?: boolean;
}

export interface DashboardConversionFunnelCardProps {
  stages?: FunnelStage[];
  isLoading?: boolean;
}

const DEFAULT_FUNNEL_COLORS = [
  "#0048C4",
  "#2563EB",
  "#3B82F6",
  "#60A5FA",
  "#10B981",
];

function getTrapezoidShape(index: number, total: number) {
  const topW = Math.max(38, Math.round(96 - index * (52 / Math.max(1, total - 1))));
  const bottomW = Math.max(30, Math.round(topW - 6));
  const h = 20;
  const x1 = (96 - topW) / 2;
  const x2 = x1 + topW;
  const x3 = (96 - bottomW) / 2 + bottomW;
  const x4 = (96 - bottomW) / 2;
  return {
    width: 96,
    height: h,
    viewBox: "0 0 96 20",
    pathD: `M${x1} 0 L${x2} 0 L${x3} ${h} L${x4} ${h} Z`,
  };
}

export function DashboardConversionFunnelCard({
  stages,
  isLoading = false,
}: DashboardConversionFunnelCardProps) {
  const currentStages = stages && stages.length > 0 ? stages : [];

  return (
    <section className="w-full bg-surface-container-lowest p-4 [direction:rtl]">
      <Typography
        as="h2"
        variant="title"
        size="small"
        weight="semibold"
        className="mb-3 text-on-surface font-bold"
      >
        نرخ تبدیل آگهی‌ها
      </Typography>

      {isLoading ? (
        <div className="flex flex-col gap-2 py-4">
          <div className="h-4 w-full animate-pulse rounded bg-surface-container" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-surface-container" />
          <div className="h-4 w-4/6 animate-pulse rounded bg-surface-container" />
        </div>
      ) : currentStages.length === 0 ? (
        <DashboardChartEmptyState
          title="داده‌ای برای نمایش نرخ تبدیل وجود ندارد"
          description="با پیگیری سرنخ‌ها و ثبت معامله آگهی‌ها، مراحل تبدیل در این بخش تحلیل می‌شوند."
        />
      ) : (
        <div className="flex flex-col gap-1">
          {currentStages.map((st, idx) => {
            const fallbackShape = getTrapezoidShape(idx, currentStages.length);
            const pathD = st.pathD || fallbackShape.pathD;
            const viewBox = st.viewBox || fallbackShape.viewBox;
            const width = st.width || fallbackShape.width;
            const height = st.height || fallbackShape.height;
            const badgeColor = st.badgeColor || DEFAULT_FUNNEL_COLORS[idx % DEFAULT_FUNNEL_COLORS.length];
            const badgeText =
              st.badgeText ||
              (st.percentage != null ? `${toPersianNumber(st.percentage)}٪` : "");
            const displayValue = st.value ?? (st.count != null ? String(st.count) : "");

            return (
              <div
                key={st.id}
                className="flex h-5 items-center justify-between"
              >
                {/* Right: Funnel Trapezoid SVG */}
                <div className="flex w-[100px] shrink-0 items-center justify-center">
                  <div className="relative flex items-center justify-center">
                    <svg
                      width={width}
                      height={height}
                      viewBox={viewBox}
                      className="block overflow-visible"
                    >
                      <path d={pathD} fill={badgeColor} />
                      {st.isCheckmark ? (
                        <path
                          d={
                            st.checkmarkPath ||
                            "M282.808 200.732L280.208 203.332L279.192 202.315C278.932 202.055 278.508 202.055 278.248 202.315C277.988 202.575 277.988 203 278.248 203.26L279.736 204.747C279.866 204.877 279.996 204.942 280.208 204.942C280.42 204.942 280.55 204.877 280.68 204.747L283.752 201.675C284.012 201.415 284.012 200.99 283.752 200.73C283.492 200.47 283.068 200.47 282.808 200.732Z"
                          }
                          fill="white"
                        />
                      ) : null}
                    </svg>
                    {!st.isCheckmark ? (
                      <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white leading-none [direction:rtl]">
                        {badgeText}
                      </span>
                    ) : null}
                  </div>
                </div>

                {/* Middle: Stage Label */}
                <div className="flex-1 px-3 text-right">
                  <Typography
                    as="span"
                    variant="body"
                    size="small"
                    weight="regular"
                    className="text-on-surface-var"
                  >
                    {st.label}
                  </Typography>
                </div>

                {/* Left: Value */}
                <div className="text-left shrink-0 [direction:ltr]">
                  <Typography
                    as="span"
                    variant="body"
                    size="small"
                    weight="medium"
                    className={`text-xs ${
                      st.isValueGreen ? "font-bold text-tertiary" : "font-medium text-on-surface-var"
                    }`}
                  >
                    {displayValue}
                  </Typography>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
