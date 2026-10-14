import { Typography } from "../../../shared/ui/Typography";
import type { DashboardRankingEntity } from "../api/dashboard.service";

function formatOptionalNumber(value: number | null | undefined) {
  return value === null || value === undefined
    ? "—"
    : new Intl.NumberFormat("fa-IR", { maximumFractionDigits: 2 }).format(value);
}

interface TopAgenciesPanelProps {
  agencies: DashboardRankingEntity[];
  isLoading: boolean;
}

export function TopAgenciesPanel({ agencies, isLoading }: TopAgenciesPanelProps) {
  return (
    <section className="bg-surface-container-lowest rounded-2xl p-4" aria-label="۱۰ آژانس برتر">
      <Typography
        as="h2"
        variant="title"
        size="medium"
        weight="semibold"
        className="m-0 text-right text-base leading-6 font-semibold"
      >
        ۱۰ آژانس برتر
      </Typography>

      <div className="mt-4">
        <div className="text-outline grid h-7 grid-cols-[56px_1fr] items-center px-2 text-sm leading-5 font-normal [direction:ltr]">
          <Typography
            as="span"
            variant="body"
            size="medium"
            weight="regular"
            className="text-center [direction:rtl]"
          >
            امتیاز
          </Typography>
          <Typography
            as="span"
            variant="body"
            size="medium"
            weight="regular"
            className="text-right [direction:rtl]"
          >
            ۱۰ آژانس برتر
          </Typography>
        </div>

        <div className="bg-outline-var h-px" aria-hidden="true" />

        {isLoading ? (
          <div className="animate-pulse space-y-2 py-2">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-surface-container-high/40 h-9 w-full rounded-lg" />
            ))}
          </div>
        ) : (
          agencies.map((agency, index) => (
            <div
              className={`grid h-10 grid-cols-[56px_1fr] items-center rounded-lg px-2 text-sm leading-5 [direction:ltr] ${
                index % 2 === 1 ? "bg-surface-container/50" : ""
              }`}
              key={agency.entityId || `${agency.name}-${index}`}
            >
              <Typography
                as="span"
                variant="label"
                size="medium"
                weight="semibold"
                className="text-center font-semibold [direction:rtl]"
              >
                {formatOptionalNumber(agency.totalScore)}
              </Typography>

              <Typography
                as="span"
                variant="label"
                size="medium"
                weight="semibold"
                className="text-on-surface-var text-right font-semibold [direction:rtl]"
              >
                {formatOptionalNumber(agency.rank)}. {agency.name}
              </Typography>
            </div>
          ))
        )}

        {!isLoading && agencies.length === 0 ? (
          <Typography
            as="p"
            variant="body"
            size="small"
            weight="regular"
            className="text-outline m-0 mx-auto w-full py-6 text-center"
          >
            اطلاعات آژانس‌های برتر از سرور دریافت نشده است.
          </Typography>
        ) : null}
      </div>
    </section>
  );
}
