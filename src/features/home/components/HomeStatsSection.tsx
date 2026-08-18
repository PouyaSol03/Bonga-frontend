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
      className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-secondary/8 text-secondary"
    >
      <LinearAnalystic className="w-8 h-8"/>
    </div>
  );
}

export function HomeStatsSection() {
  const { data } = useHomeStatsQuery();
  const stats = [
    { value: formatCount(data?.activeAdvertises, true), label: "آگهی فعال" },
    { value: formatCount(data?.searchesThisMonth, true), label: "جستجو در ماه" },
    { value: formatCount(data?.approvedAgencies), label: "آژانس عضو" },
    { value: formatCount(data?.approvedAgents), label: "مشاور فعال" },
  ];

  return (
    <section
      className="border-t-[16px] border-surface-container bg-surface-container-lowest px-4 py-4"
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
            className="m-0 text-on-surface"
          >
            آمار و ارقام سامانه
          </Typography>

          <Typography
            as="p"
            variant="body"
            size="small"
            weight="regular"
            className="m-0 text-on-surface-var"
          >
            نمایی از رشد و اعتماد کاربران به ما
          </Typography>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex h-[78px] min-w-0 flex-col items-center justify-center rounded-2xl border border-surface-container-low bg-linear-to-b from-surface-container-lowest to-surface-container-low text-center"
          >
            <Typography
              as="p"
              variant="title"
              size="large"
              weight="semibold"
              className="m-0 text-on-surface"
            >
              <bdi dir="ltr">{stat.value}</bdi>
            </Typography>

            <Typography
              as="p"
              variant="label"
              size="small"
              weight="medium"
              className="m-0 text-outline"
            >
              {stat.label}
            </Typography>
          </div>
        ))}
      </div>
    </section>
  );
}
