import { useHomeStatsQuery } from "../api/home-stats.hooks";
import LinearAnalystic from "../../../shared/icons/LinearAnalystic";
import { Typography } from "../../../shared/ui/Typography";

function formatCount(value: number | undefined, withPlus = false) {
  if (value === undefined) return "—";

  const formatted = new Intl.NumberFormat("en-US").format(value);
  return withPlus ? `+${formatted}` : formatted;
}

function StatsPieIcon() {
  return (
    <div
      aria-hidden="true"
      className="bg-secondary/8 text-secondary grid h-10 w-10 shrink-0 place-items-center rounded-lg"
    >
      <LinearAnalystic className="h-8 w-8" />
    </div>
  );
}

export function HomeStatsSection() {
  const { data, isLoading } = useHomeStatsQuery();
  const stats = [
    { value: formatCount(data?.activeAdvertises, true), label: "آگهی فعال" },
    { value: formatCount(data?.searchesThisMonth, true), label: "جستجو در ماه" },
    { value: formatCount(data?.approvedAgencies), label: "آژانس عضو" },
    { value: formatCount(data?.approvedAgents), label: "مشاور فعال" },
  ];

  return (
    <section
      className="home-content-visibility border-surface-container bg-surface-container-lowest border-t-[16px] px-4 py-4"
      aria-labelledby="home-stats-title"
      dir="rtl"
    >
      <div className="flex h-10 items-start gap-2">
        <StatsPieIcon />

        <div className="min-w-0 flex-1 text-right">
          <Typography
            as="h2"
            id="home-stats-title"
            variant="title"
            size="medium"
            weight="semibold"
            className="text-on-surface m-0"
          >
            آمار و ارقام سامانه
          </Typography>

          <Typography
            as="p"
            variant="body"
            size="small"
            weight="regular"
            className="text-on-surface-var m-0"
          >
            نمایی از رشد و اعتماد کاربران به ما
          </Typography>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="border-surface-container-low from-surface-container-lowest to-surface-container-low flex h-[78px] min-w-0 flex-col items-center justify-center rounded-2xl border bg-linear-to-b text-center transition-all duration-200 ease-out select-none"
          >
            {isLoading ? (
              <div className="bg-surface-container mb-1.5 h-6 w-20 animate-pulse rounded-md" />
            ) : (
              <Typography
                as="p"
                variant="title"
                size="large"
                weight="semibold"
                className="text-on-surface m-0"
              >
                <bdi dir="ltr">{stat.value}</bdi>
              </Typography>
            )}

            <Typography
              as="p"
              variant="label"
              size="small"
              weight="medium"
              className="text-outline m-0"
            >
              {stat.label}
            </Typography>
          </div>
        ))}
      </div>
    </section>
  );
}
