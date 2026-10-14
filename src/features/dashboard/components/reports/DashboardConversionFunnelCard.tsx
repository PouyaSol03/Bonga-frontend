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

const PRESET_FUNNEL_SHAPES = [
  {
    pathD:
      "M232.348 709.035C231.668 706.494 233.582 704 236.212 704H325.785C328.416 704 330.33 706.496 329.649 709.037L326.429 721.037C325.96 722.785 324.376 724 322.566 724H239.426C237.616 724 236.031 722.784 235.562 721.035L232.348 709.035Z",
    viewBox: "231 704 100 20",
    width: 100,
    height: 20,
    badgeColor: "#0D50CE",
  },
  {
    pathD:
      "M238.777 733.034C238.096 730.494 240.011 728 242.64 728H319.357C321.988 728 323.902 730.495 323.221 733.036L320.003 745.036C319.534 746.784 317.949 748 316.139 748H245.853C244.042 748 242.458 746.784 241.989 745.034L238.777 733.034Z",
    viewBox: "231 728 100 20",
    width: 100,
    height: 20,
    badgeColor: "#6ECA9B",
  },
  {
    pathD:
      "M245.206 757.036C244.525 754.495 246.439 752 249.069 752H312.929C315.56 752 317.474 754.496 316.792 757.037L313.569 769.037C313.1 770.785 311.516 772 309.706 772H252.287C250.477 772 248.893 770.784 248.424 769.036L245.206 757.036Z",
    viewBox: "231 752 100 20",
    width: 100,
    height: 20,
    badgeColor: "#7F97EA",
  },
  {
    pathD:
      "M251.662 781.035C250.981 778.495 252.895 776 255.525 776L306.471 776C309.102 776 311.017 778.497 310.334 781.038L307.109 793.038C306.64 794.785 305.056 796 303.246 796H258.741C256.931 796 255.346 794.784 254.877 793.035L251.662 781.035Z",
    viewBox: "231 776 100 20",
    width: 100,
    height: 20,
    badgeColor: "#FFD44D",
  },
  {
    pathD:
      "M258.07 805.031C257.393 802.492 259.307 800 261.935 800H300.057C302.688 800 304.602 802.496 303.92 805.037L300.697 817.037C300.228 818.785 298.643 820 296.834 820H265.138C263.326 820 261.74 818.782 261.273 817.031L258.07 805.031Z",
    viewBox: "231 800 100 20",
    width: 100,
    height: 20,
    badgeColor: "#9AD8B7",
  },
  {
    pathD:
      "M264.481 829.03C263.804 826.491 265.718 824 268.346 824H293.64C296.272 824 298.187 826.499 297.502 829.04L294.269 841.04C293.799 842.787 292.215 844 290.407 844H271.545C269.733 844 268.147 842.782 267.68 841.03L264.481 829.03Z",
    viewBox: "231 824 100 20",
    width: 100,
    height: 20,
    badgeColor: "#1AB371",
  },
];

const DEFAULT_CHECKMARK_PATH =
  "M285.567 829.404C285.806 829.153 286.203 829.142 286.455 829.379C286.707 829.617 286.718 830.012 286.48 830.263L279.349 837.763C279.234 837.884 279.075 837.955 278.907 837.958C278.781 837.961 278.659 837.926 278.555 837.859L278.457 837.783L275.54 834.97C275.291 834.73 275.285 834.334 275.526 834.086C275.767 833.838 276.164 833.832 276.413 834.072L278.874 836.444L285.567 829.404Z";

function getTrapezoidShape(index: number) {
  if (index < PRESET_FUNNEL_SHAPES.length) {
    return PRESET_FUNNEL_SHAPES[index];
  }
  return PRESET_FUNNEL_SHAPES[PRESET_FUNNEL_SHAPES.length - 1];
}

export function DashboardConversionFunnelCard({
  stages,
  isLoading = false,
}: DashboardConversionFunnelCardProps) {
  const currentStages = stages && stages.length > 0 ? stages : [];

  return (
    <section className="bg-surface-container-lowest w-full p-4 [direction:rtl]">
      <Typography
        as="h2"
        variant="title"
        size="small"
        weight="semibold"
        className="text-on-surface mb-3 font-bold"
      >
        نرخ تبدیل آگهی‌ها
      </Typography>

      {isLoading ? (
        <div className="flex flex-col gap-2 py-4">
          <div className="bg-surface-container h-4 w-full animate-pulse rounded" />
          <div className="bg-surface-container h-4 w-5/6 animate-pulse rounded" />
          <div className="bg-surface-container h-4 w-4/6 animate-pulse rounded" />
        </div>
      ) : currentStages.length === 0 ? (
        <DashboardChartEmptyState
          title="داده‌ای برای نمایش نرخ تبدیل وجود ندارد"
          description="با پیگیری سرنخ‌ها و ثبت معامله آگهی‌ها، مراحل تبدیل در این بخش تحلیل می‌شوند."
        />
      ) : (
        <div className="flex flex-col gap-1">
          {currentStages.map((st, idx) => {
            const fallbackShape = getTrapezoidShape(idx);
            const pathD = st.pathD || fallbackShape.pathD;
            const viewBox = st.viewBox || fallbackShape.viewBox;
            const width = st.width || fallbackShape.width;
            const height = st.height || fallbackShape.height;
            const badgeColor = st.badgeColor || fallbackShape.badgeColor;
            const badgeText =
              st.badgeText || (st.percentage != null ? `${toPersianNumber(st.percentage)}٪` : "");
            const displayValue = st.value ?? (st.count != null ? String(st.count) : "");

            return (
              <div key={st.id} className="flex h-5 items-center justify-between">
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
                        <path d={st.checkmarkPath || DEFAULT_CHECKMARK_PATH} fill="white" />
                      ) : null}
                    </svg>
                    {!st.isCheckmark ? (
                      <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-[10px] leading-none font-bold text-white [direction:rtl]">
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
                <div className="shrink-0 text-left [direction:ltr]">
                  <Typography
                    as="span"
                    variant="body"
                    size="small"
                    weight="medium"
                    className={`text-xs ${
                      st.isValueGreen
                        ? "text-tertiary font-bold"
                        : "text-on-surface-var font-medium"
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
