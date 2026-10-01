import { Typography } from "../../../../shared/ui/Typography";

export interface FunnelStage {
  id: string;
  label: string;
  value: string;
  badgeText: string;
  badgeColor: string;
  pathD: string;
  viewBox: string;
  width: number;
  height: number;
  isCheckmark?: boolean;
  isValueGreen?: boolean;
}

export interface DashboardConversionFunnelCardProps {
  stages?: FunnelStage[];
}

export function DashboardConversionFunnelCard({
  stages,
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

      {currentStages.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Typography
            as="p"
            variant="body"
            size="medium"
            weight="medium"
            className="text-on-surface-var"
          >
            داده‌ای برای نمایش نرخ تبدیل وجود ندارد
          </Typography>
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          {currentStages.map((st) => (
            <div
              key={st.id}
              className="flex h-5 items-center justify-between"
            >
            {/* Right: Funnel Trapezoid SVG with exact bezier curves and rounded corners */}
            <div className="flex w-[100px] shrink-0 items-center justify-center">
              <div className="relative flex items-center justify-center">
                <svg
                  width={st.width}
                  height={st.height}
                  viewBox={st.viewBox}
                  className="block overflow-visible"
                >
                  <path d={st.pathD} fill={st.badgeColor} />
                  {st.isCheckmark ? (
                    <path
                      d="M282.808 200.732L280.208 203.332L279.192 202.315C278.932 202.055 278.508 202.055 278.248 202.315C277.988 202.575 277.988 203 278.248 203.26L279.736 204.747C279.866 204.877 279.996 204.942 280.208 204.942C280.42 204.942 280.55 204.877 280.68 204.747L283.752 201.675C284.012 201.415 284.012 200.99 283.752 200.73C283.492 200.47 283.068 200.47 282.808 200.732Z"
                      fill="white"
                    />
                  ) : null}
                </svg>
                {!st.isCheckmark ? (
                  <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white leading-none [direction:rtl]">
                    {st.badgeText}
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
                {st.value}
              </Typography>
            </div>
          </div>
        ))}
      </div>
      )}
    </section>
  );
}
