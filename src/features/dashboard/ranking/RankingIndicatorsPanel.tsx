import LinearArrowDown1 from "../../../shared/icons/LinearArrowDown1";
import { Button } from "../../../shared/ui/Button";
import { Typography } from "../../../shared/ui/Typography";

export type RankingPeriod = "ماه" | "هفته";

export interface AgencyIndicator {
  Icon: React.ComponentType<{ className?: string }>;
  id: string;
  label: string;
  value: string;
}

interface RankingIndicatorsPanelProps {
  indicators: AgencyIndicator[];
  period: RankingPeriod;
  setPeriod: (period: RankingPeriod) => void;
}

export function RankingIndicatorsPanel({
  indicators,
  period,
  setPeriod,
}: RankingIndicatorsPanelProps) {
  return (
    <section
      className="bg-surface-container-lowest rounded-2xl p-4"
      aria-label="شاخص‌های رتبه‌بندی"
    >
      <div className="flex h-7 items-center justify-between [direction:ltr]">
        <Button
          unstyled
          className="text-on-surface active:bg-surface-container inline-flex h-7 items-center gap-2 rounded-lg px-1 text-xs leading-4 font-medium transition"
          onClick={() => setPeriod(period === "هفته" ? "ماه" : "هفته")}
          type="button"
        >
          <LinearArrowDown1 className="text-on-surface-var h-4 w-4" />
          <Typography
            as="span"
            variant="body"
            size="medium"
            weight="regular"
            className="[direction:rtl]"
          >
            {period}
          </Typography>
        </Button>
        <Typography
          as="h2"
          variant="title"
          size="medium"
          weight="semibold"
          className="m-0 text-base leading-6 font-semibold [direction:rtl]"
        >
          شاخص‌های رتبه‌بندی
        </Typography>
      </div>
      <div className="mt-6 space-y-4">
        {indicators.map((indicator) => {
          const Icon = indicator.Icon;
          return (
            <div
              className="border-outline-var flex min-h-20 items-center gap-3 rounded-lg border px-4 py-3 [direction:ltr]"
              key={indicator.id}
            >
              <strong className="text-primary w-12 shrink-0 text-left text-base leading-6 font-semibold [direction:rtl]">
                {indicator.value}
              </strong>
              <Typography
                as="span"
                variant="label"
                size="medium"
                weight="semibold"
                className="text-on-surface-var min-w-0 flex-1 px-2 text-right text-sm leading-5 font-semibold [direction:rtl]"
              >
                {indicator.label}
              </Typography>
              <Typography
                as="span"
                variant="body"
                size="medium"
                weight="regular"
                className="bg-primary-container text-primary grid h-12 w-12 shrink-0 place-items-center rounded-2xl"
              >
                <Icon className="h-6 w-6" />
              </Typography>
            </div>
          );
        })}
      </div>
    </section>
  );
}
