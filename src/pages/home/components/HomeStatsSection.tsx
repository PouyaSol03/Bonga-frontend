import { Typography } from "../../../shared/ui/Typography";

const stats = [
  { value: "+12,500", label: "آگهی فعال" },
  { value: "+100,000", label: "جستجو در ماه" },
  { value: "493", label: "آژانس عضو" },
  { value: "3548", label: "مشاور فعال" },
] as const;

function StatsPieIcon() {
  return (
    <div
      aria-hidden="true"
      className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-secondary/8 text-on-surface-var"
    >
      <svg
        className="h-8 w-8"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M16.046 8.6667C11.361 10.301 8 14.7579 8 20C8 26.6274 13.373 32 20 32C25.225 32 29.67 28.6608 31.317 24M20 8C26.627 8 32 13.3726 32 20H20V8Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

export function HomeStatsSection() {
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
