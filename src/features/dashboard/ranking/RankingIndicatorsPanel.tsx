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
    <section className="rounded-2xl bg-surface-container-lowest p-4" aria-label="شاخص‌های رتبه‌بندی">
      <div className="flex h-7 items-center justify-between [direction:ltr]">
        <Button
          unstyled
          className="inline-flex h-7 items-center gap-2 rounded-lg px-1 text-xs font-medium leading-4 text-on-surface transition active:bg-surface-container"
          onClick={() => setPeriod(period === "هفته" ? "ماه" : "هفته")}
          type="button"
        >
          <LinearArrowDown1 className="h-4 w-4 text-on-surface-var" />
          <Typography as="span" variant="body" size="medium" weight="regular" className="[direction:rtl]">
            {period}
          </Typography>
        </Button>
        <Typography as="h2" variant="title" size="medium" weight="semibold" className="m-0 text-base font-semibold leading-6 [direction:rtl]">
          شاخص‌های رتبه‌بندی
        </Typography>
      </div>
      <div className="mt-6 space-y-4">
        {indicators.map((indicator) => {
          const Icon = indicator.Icon;
          return (
            <div
              className="flex min-h-20 items-center gap-3 rounded-lg border border-outline-var px-4 py-3 [direction:ltr]"
              key={indicator.id}
            >
              <strong className="w-12 shrink-0 text-left text-base font-semibold leading-6 text-primary [direction:rtl]">
                {indicator.value}
              </strong>
              <Typography as="span" variant="label" size="medium" weight="semibold" className="min-w-0 flex-1 px-2 text-right text-sm font-semibold leading-5 text-on-surface-var [direction:rtl]">
                {indicator.label}
              </Typography>
              <Typography as="span" variant="body" size="medium" weight="regular" className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary-container text-primary">
                <Icon className="h-6 w-6" />
              </Typography>
            </div>
          );
        })}
      </div>
    </section>
  );
}
