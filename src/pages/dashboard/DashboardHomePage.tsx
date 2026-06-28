import DashboardAgencyEditPage from "./DashboardAgencyEditPage";
import DashboardPaymentPage from "./DashboardPaymenPage";
import DashboardChatPage from "./DashboardChatPage";

const creditCards = [
  {
    accent: "bg-[#f1f1fb] text-[#4b5680]",
    label: "مانده اعتبار آگهی",
    trend: "۴۴٪ افزایش استفاده در دو فصل",
    trendClassName: "text-[#11a366]",
    value: "۳۴",
  },
  {
    accent: "bg-[#eaf8f3] text-[#287d64]",
    label: "مانده بروزرسانی",
    trend: "۵۵٪ افزایش استفاده در دو فصل",
    trendClassName: "text-[#11a366]",
    value: "۳۳",
  },
  {
    accent: "bg-[#fff3e8] text-[#9a6634]",
    label: "مانده ویژه",
    trend: "۱۶٪ کاهش استفاده در دو فصل",
    trendClassName: "text-[#c11004]",
    value: "۱۱",
  },
  {
    accent: "bg-[#f0f1f6] text-[#4b5680]",
    label: "مانده اعتبار پنل",
    trend: "۱۶ روز تا پایان اعتبار",
    trendClassName: "text-[#808080]",
    value: "۱۶۲ روز",
  },
];

const consultantBars = [
  { ad: 60, name: "عبادی", update: 52, special: 8 },
  { ad: 80, name: "اشرفی", update: 30, special: 45 },
  { ad: 52, name: "مطهری", update: 48, special: 12 },
  { ad: 10, name: "رفیعی", update: 38, special: 4 },
  { ad: 100, name: "زکی", update: 30, special: 60 },
  { ad: 70, name: "محمدی", update: 60, special: 32 },
  { ad: 50, name: "علیراده", update: 40, special: 8 },
];

const months = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
];

export function DashboardHomePage() {
  return (
    <div className="grid gap-5">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {creditCards.map((card) => (
          <article
            className="flex min-h-[136px] flex-col justify-between rounded-xl bg-white p-5"
            key={card.label}
          >
            <div className="flex items-start justify-between gap-3">
              <span
                className={`grid h-12 w-12 place-items-center rounded-xl ${card.accent}`}
              >
                <CreditIcon className="h-6 w-6" />
              </span>
              <div className="min-w-0 text-right">
                <p className="m-0 text-sm font-medium text-[#303030]">
                  {card.label}
                </p>
                <strong className="mt-2 block text-2xl font-black text-[#111111]">
                  {card.value}
                </strong>
              </div>
            </div>
            <p className={`m-0 text-xs font-medium ${card.trendClassName}`}>
              {card.trend}
            </p>
          </article>
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        <article className="rounded-xl bg-white p-5">
          <DashboardPanelHeader
            metric="۱۳۳ آگهی ثبت شده"
            title="آگهی منتشر شده در آژانس"
          />
          <div className="flex min-h-[230px] items-center justify-center gap-8">
            <PieChart />
            <div className="grid gap-4 text-sm">
              <ChartLegend color="#4168dd" label="فروش" value="۴۸٪" />
              <ChartLegend color="#7d94e8" label="اجاره" value="۴۰٪" />
              <ChartLegend color="#c3cdf8" label="پروژه و مشارکت" value="۱۲٪" />
            </div>
          </div>
        </article>

        <article className="rounded-xl bg-white p-5">
          <DashboardPanelHeader
            metric="۳۲۵ آگهی ثبت شده"
            title="فعالیت مشاورین"
          />
          <div className="mt-6 flex h-[230px] items-end justify-between gap-3 border-b border-dashed border-[#e6e6e6] pb-7">
            {consultantBars.map((item) => (
              <div
                className="flex min-w-0 flex-1 flex-col items-center gap-2"
                key={item.name}
              >
                <div className="flex h-36 items-end gap-1">
                  <span
                    className="w-1.5 rounded-t-sm bg-[#0048c4]"
                    style={{ height: `${item.ad}%` }}
                  />
                  <span
                    className="w-1.5 rounded-t-sm bg-[#11a366]"
                    style={{ height: `${item.update}%` }}
                  />
                  <span
                    className="w-1.5 rounded-t-sm bg-[#ffb100]"
                    style={{ height: `${item.special}%` }}
                  />
                </div>
                <span className="truncate text-[11px] text-[#303030]">
                  {item.name}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-end gap-4 text-xs text-[#666666]">
            <ChartLegend color="#0048c4" label="آگهی" />
            <ChartLegend color="#11a366" label="بروزرسانی" />
            <ChartLegend color="#ffb100" label="ویژه" />
          </div>
        </article>
      </section>

      <section className="rounded-xl bg-white p-5">
        <DashboardPanelHeader
          metric="۵۵٪ افزایش ثبت"
          title="نمودار پیشرفت ثبت آگهی"
        />
        <div className="mt-7 h-[260px]">
          <svg
            aria-label="نمودار پیشرفت ثبت آگهی"
            className="h-full w-full"
            preserveAspectRatio="none"
            viewBox="0 0 1000 260"
          >
            <defs>
              <linearGradient id="dashboardLineFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#0048c4" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#0048c4" stopOpacity="0.02" />
              </linearGradient>
            </defs>
            {[40, 80, 120, 160, 200].map((y) => (
              <line
                key={y}
                stroke="#e8e8e8"
                strokeDasharray="4 6"
                strokeWidth="1"
                x1="0"
                x2="1000"
                y1={y}
                y2={y}
              />
            ))}
            <path
              d="M0 170 C80 160 100 145 150 152 C210 162 220 100 270 102 C325 104 310 145 380 140 C455 135 465 185 530 175 C590 165 575 65 635 80 C700 96 660 130 740 122 C815 115 780 178 850 170 C920 162 905 80 1000 110 L1000 230 L0 230 Z"
              fill="url(#dashboardLineFill)"
            />
            <path
              d="M0 170 C80 160 100 145 150 152 C210 162 220 100 270 102 C325 104 310 145 380 140 C455 135 465 185 530 175 C590 165 575 65 635 80 C700 96 660 130 740 122 C815 115 780 178 850 170 C920 162 905 80 1000 110"
              fill="none"
              stroke="#0048c4"
              strokeLinecap="round"
              strokeWidth="3"
            />
            <line
              stroke="#8ba8ff"
              strokeDasharray="5 5"
              strokeWidth="2"
              x1="635"
              x2="635"
              y1="80"
              y2="240"
            />
            <circle cx="635" cy="80" fill="#ffffff" r="6" stroke="#0048c4" strokeWidth="3" />
          </svg>
          <div className="mt-3 grid grid-cols-12 text-center text-[11px] text-[#555555]">
            {months.map((month) => (
              <span className="truncate" key={month}>
                {month}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}


export function DashboardRequestsPage() {
  return <DashboardComingSoonPage title="مدیریت درخواست‌ها" />;
}

export function DashboardTeamPage() {
  return <DashboardComingSoonPage title="مدیریت مشاورین" />;
}

export function DashboardPaymentsPage() {
  return <DashboardPaymentPage />;
}

export function DashboardRankingPage() {
  return <DashboardComingSoonPage title="شناساها و رتبه" />;
}

export function DashboardAgencyPage() {
  return <DashboardAgencyEditPage />;
}

export function DashboardMessagesPage() {
  return <DashboardChatPage />;
}

function DashboardComingSoonPage({ title }: { title: string }) {
  return (
    <section className="grid h-full min-h-[360px] place-items-center rounded-xl bg-white p-6 text-center">
      <div className="grid max-w-[360px] gap-3">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#0048c414] text-[#0048c4]">
          <ClockIcon className="h-7 w-7" />
        </span>
        <h1 className="m-0 text-xl font-black text-[#111111]">{title}</h1>
        <p className="m-0 text-sm font-medium leading-6 text-[#666666]">
          این بخش به‌زودی آماده می‌شود.
        </p>
      </div>
    </section>
  );
}

function DashboardPanelHeader({
  metric,
  title,
}: {
  metric: string;
  title: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <button
        className="text-xs font-medium text-[#303030]"
        type="button"
      >
        در ماه
      </button>
      <div className="text-right">
        <h2 className="m-0 text-base font-bold text-[#111111]">{title}</h2>
        <p className="m-0 mt-2 text-sm font-semibold text-[#0048c4]">{metric}</p>
      </div>
    </div>
  );
}

function PieChart() {
  return (
    <div
      aria-label="نمودار نوع آگهی‌ها"
      className="h-40 w-40 rounded-full"
      style={{
        background:
          "conic-gradient(#4168dd 0 48%, #7d94e8 48% 88%, #c3cdf8 88% 100%)",
      }}
    />
  );
}

function ChartLegend({
  color,
  label,
  value,
}: {
  color: string;
  label: string;
  value?: string;
}) {
  return (
    <span className="inline-flex items-center gap-2">
      <span
        aria-hidden="true"
        className="h-2 w-2 rounded-full"
        style={{ backgroundColor: color }}
      />
      <span>{label}</span>
      {value ? <strong className="font-bold text-[#111111]">{value}</strong> : null}
    </span>
  );
}

function CreditIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.7"
      viewBox="0 0 24 24"
    >
      <path d="M4 7h16v11H4z" />
      <path d="M8 11h5M16 14v-4M14 12h4" />
    </svg>
  );
}

function ClockIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  );
}
