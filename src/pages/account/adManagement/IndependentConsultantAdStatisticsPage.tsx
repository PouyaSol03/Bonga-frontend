import { PageFrame } from "../../../app/PageFrame";
import { TopBar } from "../../../components/TopBar";
import { RouteLink } from "../../../routes/RouteLink";
import { ChevronLeftIcon, StatisticsIcon } from "./AdManagementIcons";
import { adManagementPaths, statisticsAds, type StatisticsAd } from "./adManagementData";

export function IndependentConsultantAdStatisticsPage() {
  return (
    <PageFrame
      className="flex min-h-0 flex-col overflow-hidden bg-[#f0f0f0] text-[#1a1a1a] [direction:rtl]"
      variant="flush"
    >
      <TopBar
        backState={{ tab: "status" }}
        backTo={adManagementPaths.root}
        className="[&_a]:text-[#1a1a1a]"
        startSlot={<StatisticsTodayToggle />}
        title="آمار آگهی‌ها"
      />

      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-[#f0f0f0]">
        <div className="space-y-2">
          {statisticsAds.map((ad) => (
            <StatisticsAdCard ad={ad} key={ad.title} />
          ))}
        </div>
      </main>
    </PageFrame>
  );
}

function StatisticsTodayToggle() {
  return (
    <label className="flex h-12 w-[134px] cursor-pointer items-center gap-4 pl-3 [direction:ltr]">
      <input defaultChecked className="peer sr-only" type="checkbox" />
      <span className="flex h-6 w-11 shrink-0 items-center justify-end rounded-full bg-[#0048c4] px-1 peer-checked:bg-[#0048c4]">
        <span className="h-4 w-4 rounded-full bg-white" />
      </span>
      <span className="whitespace-nowrap text-base font-medium leading-6 [direction:rtl]">آمار امروز</span>
    </label>
  );
}

function StatisticsAdCard({ ad }: { ad: StatisticsAd }) {
  return (
    <article className="h-[284px] bg-white px-4 py-4">
      <div className="flex h-[72px] items-center justify-between gap-4 [direction:ltr]">
        <div className="min-w-0 flex-1 text-right [direction:rtl]">
          <h2 className="m-0 truncate text-sm font-medium leading-5">{ad.title}</h2>
          <p className="m-0 mt-2 text-xs font-normal leading-4 text-[#808080]">{ad.timeAndLocation}</p>
        </div>
        <div
          aria-hidden="true"
          className={`ad-card__image ${ad.imageClassName} h-[72px] w-[108px] shrink-0 rounded-xl bg-cover`}
        />
      </div>

      <div className="mt-4 grid h-[108px] grid-cols-4 [direction:ltr]">
        <StatisticsMetric icon="chat" label="چت" value="۶" />
        <StatisticsMetric icon="call" label="تماس" value="۵" />
        <StatisticsMetric icon="display" label="نمایش" value="۲۶۵" />
        <StatisticsMetric icon="view" label="بازدید" value="۱۸۵۶" />
      </div>

      <RouteLink
        className="mr-auto mt-4 inline-flex h-10 w-[156px] items-center justify-center gap-2 rounded-[10px] border border-[#0048c4] text-sm font-medium leading-5 text-[#0048c4] no-underline [direction:ltr]"
        state={{ statisticsAd: ad }}
        to={adManagementPaths.statisticsDetails}
      >
        <ChevronLeftIcon className="h-5 w-5" />
        <span className="[direction:rtl]">جزییات آمار آگهی</span>
      </RouteLink>
    </article>
  );
}

function StatisticsMetric({
  icon,
  label,
  value,
}: {
  icon: "call" | "chat" | "display" | "view";
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col items-center text-[#4d4d4d]">
      <StatisticsIcon className="h-6 w-6" icon={icon} />
      <strong className="mt-1 text-base font-semibold leading-6 text-[#1a1a1a]">{value}</strong>
      <span className="mt-1 text-sm font-normal leading-5">{label}</span>
    </div>
  );
}
