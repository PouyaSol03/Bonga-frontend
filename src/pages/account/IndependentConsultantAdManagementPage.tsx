import { useState } from "react";
import { PageFrame } from "../../app/PageFrame";
import { BottomSheet } from "../../components/BottomSheet";
import { TopBar } from "../../components/TopBar";

type ConsultantAd = {
  actions?: boolean;
  area: string;
  image: string;
  prices: Array<{
    label?: string;
    value: string;
  }>;
  rooms: string;
  time: string;
  title: string;
  year: string;
};

type AdsTab = "active" | "status";
type ManagementScreen = "ads" | "allocation" | "filter" | "payment" | "published" | "search";
type PaymentMethod = "credit" | "online" | "wallet";
type UpgradeOption = "refresh" | "special";

const consultantAds: ConsultantAd[] = [
  {
    area: "۱۱۰ متر",
    image: "/figma/account/consultant-ad-card-1.png",
    prices: [{ value: "۳٫۸۵۰ میلیارد" }],
    rooms: "۲ اتاق",
    time: "۱ ساعت پیش در الهیه",
    title: "اپارتمان۱۱۰متری شمال تک واحدی سنداردر رحیمی",
    year: "۱۴۰۰",
  },
  {
    area: "۱۷۰ متر",
    image: "/figma/account/consultant-ad-card-2.png",
    prices: [
      { label: "اجاره:", value: "۷٫۵ میلیون" },
      { label: "رهن:", value: "۱٫۱ میلیارد" },
    ],
    rooms: "۳ اتاق",
    time: "۱ روز پیش در الهیه",
    title: "اجاره آپارتمان ابتدای هاشمیه طبقه اول ۱۷۰ متری",
    year: "۱۳۹۰",
  },
  {
    area: "۸۰۰ متر",
    image: "/figma/account/consultant-ad-card-1.png",
    prices: [
      { label: "از:", value: "۲ میلیون" },
      { label: "تا:", value: "۴ میلیون" },
    ],
    rooms: "۳ اتاق",
    time: "یک هفته پیش در شاندیز",
    title: "اجاره باغ ویلادوبلکس۳خواب استخرجکوزی شاندیز",
    year: "تا ۱۰ نفر",
  },
  {
    area: "۱۱۰ متر",
    image: "/figma/account/consultant-ad-card-1.png",
    prices: [{ value: "۳٫۸۵۰ میلیارد" }],
    rooms: "۲ اتاق",
    time: "۱ ساعت پیش در الهیه",
    title: "اپارتمان۱۱۰متری شمال تک واحدی سنداردر رحیمی",
    year: "۱۴۰۰",
  },
];

const consultantStatusAds: ConsultantAd[] = [
  {
    actions: true,
    area: "۱۱۰ متر",
    image: "/figma/account/consultant-status-card-1.png",
    prices: [{ value: "۳٫۸۵۰ میلیارد" }],
    rooms: "۲ اتاق",
    time: "۱ ساعت پیش در الهیه",
    title: "اپارتمان۱۱۰متری شمال تک واحدی سنداردر رحیمی",
    year: "۱۴۰۰",
  },
  {
    actions: true,
    area: "۱۷۰ متر",
    image: "/figma/account/consultant-status-card-2.png",
    prices: [
      { label: "اجاره:", value: "۳۵ میلیون" },
      { label: "رهن:", value: "۳٫۸۵۰ میلیارد" },
    ],
    rooms: "۳ اتاق",
    time: "۱ ساعت پیش در الهیه",
    title: "اجاره آپارتمان ابتدای هاشمیه طبقه اول ۱۷۰ متری",
    year: "۱۳۹۶",
  },
  {
    actions: true,
    area: "۱۱۰ متر",
    image: "/figma/account/consultant-status-card-1.png",
    prices: [{ value: "۳٫۸۵۰ میلیارد" }],
    rooms: "۲ اتاق",
    time: "۱ ساعت پیش در الهیه",
    title: "اپارتمان۱۱۰متری شمال تک واحدی سنداردر رحیمی",
    year: "۱۴۰۰",
  },
];

export function IndependentConsultantAdManagementPage() {
  const [activeTab, setActiveTab] = useState<AdsTab>("active");
  const [screen, setScreen] = useState<ManagementScreen>("ads");
  const [selectedAd, setSelectedAd] = useState<ConsultantAd>(consultantStatusAds[0]);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const ads = activeTab === "active" ? consultantAds : consultantStatusAds;

  if (screen === "allocation") {
    return (
      <ConsultantAdAllocationScreen
        ad={selectedAd}
        onBack={() => setScreen("ads")}
        onComplete={() => setScreen("payment")}
      />
    );
  }

  if (screen === "payment") {
    return (
      <ConsultantAdPaymentScreen
        onBack={() => setScreen("allocation")}
        onPaid={() => {
          setShowPaymentSuccess(true);
          setScreen("published");
        }}
      />
    );
  }

  if (screen === "published") {
    return (
      <ConsultantAdPublishedScreen
        ad={selectedAd}
        isSuccessOpen={showPaymentSuccess}
        onBack={() => {
          setShowPaymentSuccess(false);
          setScreen("ads");
        }}
        onCloseSuccess={() => setShowPaymentSuccess(false)}
      />
    );
  }

  if (screen === "filter") {
    return <ConsultantAdFilterScreen onBack={() => setScreen("ads")} />;
  }

  if (screen === "search") {
    return <ConsultantAdSearchScreen ads={ads} onBack={() => setScreen("ads")} />;
  }

  return (
    <PageFrame
      className="relative flex min-h-0 flex-col overflow-hidden bg-[#f0f0f0] text-[#1a1a1a] [direction:rtl]"
      variant="flush"
    >
      <TopBar
        actions={[
          {
            icon: <FilterIcon className="h-6 w-6" />,
            id: "filters",
            label: "فیلتر",
            onClick: () => setScreen("filter"),
          },
          {
            icon: <SearchIcon className="h-6 w-6" />,
            id: "search",
            label: "جستجو",
            onClick: () => setScreen("search"),
          },
        ]}
        backTo="/login"
        className="[&_a]:text-[#1a1a1a]"
        title="مدیریت آگهی‌ها"
      />

      <section className="shrink-0 bg-[#f0f0f0] px-4 py-2" aria-label="وضعیت آگهی">
        <div className="grid h-10 grid-cols-2 overflow-hidden rounded-2xl border border-[#808080] bg-white [direction:ltr]">
          <button
            aria-current={activeTab === "status" ? "page" : undefined}
            className={`text-base font-medium leading-6 [direction:rtl] ${
              activeTab === "status" ? "bg-[#0048c41f] text-[#002099]" : "text-[#4d4d4d]"
            }`}
            onClick={() => setActiveTab("status")}
            type="button"
          >
            وضعیت آگهی
          </button>
          <button
            aria-current={activeTab === "active" ? "page" : undefined}
            className={`text-base font-medium leading-6 [direction:rtl] ${
              activeTab === "active" ? "bg-[#0048c41f] text-[#002099]" : "text-[#4d4d4d]"
            }`}
            onClick={() => setActiveTab("active")}
            type="button"
          >
            فعال
          </button>
        </div>
      </section>

      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-[#f0f0f0]">
        <div className="space-y-2">
          {ads.map((ad, index) => (
            <ConsultantAdCard
              ad={ad}
              key={`${ad.title}-${index}`}
              onClick={
                activeTab === "status"
                  ? () => {
                      setSelectedAd(ad);
                      setScreen("allocation");
                    }
                  : undefined
              }
            />
          ))}
        </div>
      </main>

      {activeTab === "status" ? <AdsAnalyticsButton /> : null}
    </PageFrame>
  );
}

function ConsultantAdCard({
  ad,
  onClick,
}: {
  ad: ConsultantAd;
  onClick?: () => void;
}) {
  const card = (
    <article className="bg-white px-4 py-4">
      <div className="relative aspect-[328/219.3] overflow-hidden rounded-2xl bg-[#ebebeb]">
        <img
          alt=""
          className="absolute inset-x-0 top-0 w-full max-w-none"
          src={ad.image}
        />
      </div>

      <div className="pt-3 text-right [direction:rtl]">
        <PriceRow prices={ad.prices} />

        <div className="mt-3 flex items-center justify-end gap-[22px] [direction:ltr]">
          <PropertyMetric icon="year" label={ad.year} />
          <PropertyMetric icon="rooms" label={ad.rooms} />
          <PropertyMetric icon="area" label={ad.area} />
        </div>

        <h2 className="m-0 mt-3 text-right text-sm font-medium leading-5 text-[#1a1a1a]">
          {ad.title}
        </h2>

        {ad.actions ? (
          <div className="mt-3 flex h-6 items-center justify-start gap-2 [direction:rtl]">
            <span className="text-sm font-normal leading-5 text-[#808080]">{ad.time}</span>
            <span className="h-6 w-px bg-[#cccccc]" aria-hidden="true" />
            <span
              className="h-6 rounded-lg border border-[#11a366] px-2 text-xs font-medium leading-4 text-[#11a366]"
            >
              بروزرسانی
            </span>
            <span
              className="h-6 rounded-lg border border-[#ff6d00] px-2 text-xs font-medium leading-4 text-[#ff6d00]"
            >
              فوری
            </span>
          </div>
        ) : (
          <p className="m-0 mt-3 flex h-6 items-center justify-start text-right text-sm font-normal leading-5 text-[#808080]">
            {ad.time}
          </p>
        )}
      </div>
    </article>
  );

  if (!onClick) {
    return card;
  }

  return (
    <button
      aria-label={`انتشار آگهی ${ad.title}`}
      className="block w-full border-0 bg-transparent p-0 text-inherit"
      onClick={onClick}
      type="button"
    >
      {card}
    </button>
  );
}

function AdsAnalyticsButton() {
  return (
    <button
      className="absolute bottom-3 left-1/2 z-10 inline-flex h-10 -translate-x-1/2 items-center gap-2 rounded-xl bg-[#0048c4] px-4 text-sm font-medium leading-5 text-white shadow-[0_4px_10px_rgba(0,72,196,0.2)]"
      type="button"
    >
      <span>آمار آگهی‌ها</span>
      <AnalyticsIcon className="h-5 w-5" />
    </button>
  );
}

function ConsultantAdFilterScreen({ onBack }: { onBack: () => void }) {
  return (
    <PageFrame
      className="relative flex min-h-0 flex-col overflow-hidden bg-white text-[#1a1a1a] [direction:rtl]"
      variant="flush"
    >
      <TopBar className="[&_button]:text-[#1a1a1a]" onBack={onBack} title="فیلتر" />

      <main className="min-h-0 flex-1 overflow-y-auto bg-white px-4 pt-4">
        <section className="flex h-14 items-center justify-between [direction:ltr]" aria-label="نمایش آگهی های من">
          <FilterToggle />
          <h2 className="m-0 text-base font-medium leading-6 text-[#1a1a1a] [direction:rtl]">
            آگهی‌های من
          </h2>
        </section>

        <div className="mt-4 space-y-6">
          {["شهر", "محله", "وضعیت آگهی", "نوع معامله"].map((label) => (
            <FilterSelect key={label} label={label} />
          ))}
        </div>
      </main>

      <footer className="shrink-0 bg-white px-4 pb-3 pt-4 shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
        <div className="grid grid-cols-2 gap-4 [direction:ltr]">
          <button
            className="h-10 rounded-lg border border-[#0048c4] bg-white text-sm font-medium leading-5 text-[#0048c4]"
            type="button"
          >
            حذف فیلتر
          </button>
          <button
            className="h-10 rounded-lg bg-[#0048c4] text-sm font-medium leading-5 text-white"
            onClick={onBack}
            type="button"
          >
            اعمال
          </button>
        </div>
      </footer>
    </PageFrame>
  );
}

function ConsultantAdSearchScreen({
  ads,
  onBack,
}: {
  ads: ConsultantAd[];
  onBack: () => void;
}) {
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim();
  const matchedAds =
    normalizedQuery.length === 0
      ? []
      : ads.filter((ad) =>
          [ad.title, ad.area, ad.rooms, ad.year, ad.time]
            .join(" ")
            .includes(normalizedQuery),
        );

  return (
    <PageFrame className="relative flex min-h-0 flex-col overflow-hidden bg-white" variant="flush">
      <TopBar
        className="[&_button]:text-[#4d4d4d]"
        centerSlot={
          <input
            aria-label="جستجوی آگهی"
            autoFocus
            className="h-12 w-full border-0 bg-transparent px-0 text-right text-base font-semibold leading-6 text-[#1a1a1a] caret-[#0048c4] outline-none placeholder:text-[#a6a6a6]"
            dir="rtl"
            inputMode="search"
            onChange={(event) => setQuery(event.target.value)}
            type="search"
            value={query}
          />
        }
        onBack={onBack}
      />

      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-[#f0f0f0]">
        {normalizedQuery.length > 0 ? (
          matchedAds.length > 0 ? (
            <div className="space-y-2">
              {matchedAds.map((ad, index) => (
                <ConsultantAdCard ad={ad} key={`${ad.title}-${index}`} />
              ))}
            </div>
          ) : (
            <p className="m-0 bg-white px-4 py-6 text-right text-sm font-normal leading-5 text-[#808080]">
              آگهی‌ای یافت نشد
            </p>
          )
        ) : null}
      </main>
    </PageFrame>
  );
}

function ConsultantAdAllocationScreen({
  ad,
  onBack,
  onComplete,
}: {
  ad: ConsultantAd;
  onBack: () => void;
  onComplete: () => void;
}) {
  return (
    <PageFrame
      className="relative flex min-h-0 flex-col overflow-hidden bg-white text-[#1a1a1a] [direction:rtl]"
      variant="flush"
    >
      <TopBar className="[&_button]:text-[#1a1a1a]" onBack={onBack} title="انتشار آگهی" />

      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-white pt-6">
        <div className="px-4">
          <div className="flex justify-start">
            <span className="inline-flex h-9 items-center rounded-lg bg-[#0048c414] px-2 text-sm font-medium leading-5 text-[#0048c4]">
              در انتظار پرداخت
            </span>
          </div>

          <section className="mt-4 flex h-[68px] items-center justify-between gap-2 [direction:ltr]" aria-label={ad.title}>
            <div className="min-w-0 flex-1 text-right [direction:rtl]">
              <h2 className="m-0 truncate text-base font-medium leading-6 text-[#1a1a1a]">
                {ad.title}
              </h2>
              <p className="m-0 mt-1 text-xs font-medium leading-4 text-[#808080]">
                {ad.time}
              </p>
            </div>
            <img
              alt=""
              className="h-[68px] w-[102px] shrink-0 rounded-xl object-cover"
              src="/figma/account/consultant-allocation-thumbnail.png"
            />
          </section>

          <div className="mt-4 h-px bg-[#cccccc]" aria-hidden="true" />
          <AllocationAction icon="preview" label="پیش نمایش" />
          <div className="h-px bg-[#cccccc]" aria-hidden="true" />
          <AllocationAction icon="edit" label="ویرایش" />
        </div>
      </main>

      <footer className="shrink-0 bg-white px-4 pb-3 pt-4 shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
        <button
          className="h-10 w-full rounded-lg bg-[#0048c4] text-sm font-medium leading-5 text-white"
          onClick={onComplete}
          type="button"
        >
          تکمیل پرداخت
        </button>
      </footer>
    </PageFrame>
  );
}

function ConsultantAdPaymentScreen({
  onBack,
  onPaid,
}: {
  onBack: () => void;
  onPaid: () => void;
}) {
  const [method, setMethod] = useState<PaymentMethod>("credit");
  const [upgrades, setUpgrades] = useState<UpgradeOption[]>(["refresh"]);
  const usesCredit = method === "credit";
  const selectedUpgradeCount = upgrades.length;
  const totalCredits = 1 + selectedUpgradeCount;
  const totalToman = 40000 * (1 + selectedUpgradeCount);

  function toggleUpgrade(option: UpgradeOption) {
    setUpgrades((selected) =>
      selected.includes(option)
        ? selected.filter((item) => item !== option)
        : [...selected, option],
    );
  }

  return (
    <PageFrame
      className="relative flex min-h-0 flex-col overflow-hidden bg-[#f0f0f0] text-[#1a1a1a] [direction:rtl]"
      variant="flush"
    >
      <TopBar className="[&_button]:text-[#1a1a1a]" onBack={onBack} title="انتشار آگهی" />

      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden pb-[72px]">
        <section className="bg-white px-4 pb-4 pt-7" aria-label="تعرفه آگهی">
          <PaymentFeeCard
            amount={usesCredit ? "1 اعتبار" : "40,000 تومان"}
            checked
            description="برای ارسال هر آگهی باید هزینه ثبت آن را پرداخت نمایید."
            title="تعرفه آگهی"
          />
          {usesCredit ? (
            <p className="m-0 mt-4 flex min-h-[36px] items-center gap-2 rounded-lg bg-[#0048c414] px-3 py-2 text-sm font-medium leading-5 text-[#0048c4]">
              <TagIcon className="h-5 w-5 shrink-0" />
              <span>اعتبار باقیمانده تعرفه آگهی شما: 34 اعتبار</span>
            </p>
          ) : null}
        </section>

        <section className="mt-2 bg-white px-4 pb-4 pt-7" aria-label="روش پرداخت">
          <h2 className="m-0 mb-4 text-right text-base font-semibold leading-6">روش پرداخت</h2>
          <PaymentMethodOption
            active={method === "credit"}
            icon="credit"
            label="اعتبار آگهی"
            onClick={() => setMethod("credit")}
            subLabel="در اجاره آپارتمان"
          />
          <PaymentMethodOption
            active={method === "wallet"}
            icon="wallet"
            label="کیف پول"
            onClick={() => setMethod("wallet")}
            subLabel="مانده: 1,250,000 تومان"
            subLabelClassName="text-[#11a366]"
          />
          <PaymentMethodOption
            active={method === "online"}
            icon="online"
            label="پرداخت آنلاین"
            onClick={() => setMethod("online")}
            subLabel="بانک ملت"
          />
        </section>

        <section className="mt-2 bg-white px-4 pb-8 pt-7" aria-label="ارتقا آگهی">
          <h2 className="m-0 mb-5 text-center text-base font-semibold leading-6">ارتقا آگهی</h2>
          <UpgradeOptionCard
            amount={usesCredit ? "1 اعتبار" : "40,000 تومان"}
            checked={upgrades.includes("refresh")}
            description="آگهی شما تا زمان دریافت آگهی تازه‌تر در همان دسته‌بندی و شهر، به عنوان اولین آگهی نمایش داده می‌شود."
            onClick={() => toggleUpgrade("refresh")}
            title="بروزرسانی"
          />
          <div className="my-4 h-px bg-[#cccccc]" aria-hidden="true" />
          <UpgradeOptionCard
            amount={usesCredit ? "1 اعتبار" : "40,000 تومان"}
            checked={upgrades.includes("special")}
            description="آگهی شما به مدت ۳ روز با برچسب فوری نشان داده می‌شود. این امکان علاوه بر ایجاد تمایز ظاهری و جلب توجه بیشتر برای آگهی شما، شرایط نمایش در دسته بندی فوری را فراهم می‌سازد."
            onClick={() => toggleUpgrade("special")}
            title="ویژه"
          />
        </section>
      </main>

      <footer className="absolute inset-x-0 bottom-0 bg-white px-4 pb-3 pt-4 shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
        <button
          className="h-10 w-full rounded-lg bg-[#0048c4] text-sm font-medium leading-5 text-white"
          onClick={onPaid}
          type="button"
        >
          {usesCredit
            ? `پرداخت ${totalCredits} اعتبار`
            : `پرداخت ${totalToman / 1000} هزار تومان`}
        </button>
      </footer>
    </PageFrame>
  );
}

function PaymentFeeCard({
  amount,
  checked,
  description,
  title,
}: {
  amount: string;
  checked: boolean;
  description: string;
  title: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between [direction:ltr]">
        <strong className="text-base font-semibold leading-6 text-[#0048c4] [direction:rtl]">
          {amount}
        </strong>
        <span className="inline-flex items-center gap-2 text-base font-semibold leading-6 text-[#4d4d4d] [direction:rtl]">
          <SelectionBox checked={checked} disabled />
          {title}
        </span>
      </div>
      <p className="m-0 mt-6 text-right text-sm font-normal leading-6 text-[#4d4d4d]">
        {description}
      </p>
    </div>
  );
}

function PaymentMethodOption({
  active,
  icon,
  label,
  onClick,
  subLabel,
  subLabelClassName = "text-[#a6a6a6]",
}: {
  active: boolean;
  icon: "credit" | "online" | "wallet";
  label: string;
  onClick: () => void;
  subLabel: string;
  subLabelClassName?: string;
}) {
  return (
    <button
      aria-pressed={active}
      className={`flex h-[72px] w-full items-center justify-between rounded-2xl px-5 [direction:ltr] ${
        active ? "bg-[#0048c414]" : "bg-white"
      }`}
      onClick={onClick}
      type="button"
    >
      <RadioIndicator active={active} />
      <span className="inline-flex items-center gap-3 text-right [direction:rtl]">
        <PaymentOptionIcon className="h-7 w-7 shrink-0" icon={icon} />
        <span className="block">
          <strong className="block text-base font-normal leading-6 text-[#1a1a1a]">
            {label}
          </strong>
          <span className={`block text-sm font-normal leading-5 ${subLabelClassName}`}>
            {subLabel}
          </span>
        </span>
      </span>
    </button>
  );
}

function UpgradeOptionCard({
  amount,
  checked,
  description,
  onClick,
  title,
}: {
  amount: string;
  checked: boolean;
  description: string;
  onClick: () => void;
  title: string;
}) {
  return (
    <button
      aria-pressed={checked}
      className="block w-full border-0 bg-white p-0 text-inherit"
      onClick={onClick}
      type="button"
    >
      <span className="flex items-center justify-between [direction:ltr]">
        <strong className="text-base font-semibold leading-6 text-[#0048c4] [direction:rtl]">
          {amount}
        </strong>
        <span className="inline-flex items-center gap-2 text-base font-semibold leading-6 [direction:rtl]">
          <SelectionBox checked={checked} />
          {title}
        </span>
      </span>
      <span className="mt-5 block text-right text-sm font-normal leading-6 text-[#4d4d4d]">
        {description}
      </span>
    </button>
  );
}

function ConsultantAdPublishedScreen({
  ad,
  isSuccessOpen,
  onBack,
  onCloseSuccess,
}: {
  ad: ConsultantAd;
  isSuccessOpen: boolean;
  onBack: () => void;
  onCloseSuccess: () => void;
}) {
  return (
    <PageFrame
      className="relative flex min-h-0 flex-col overflow-hidden bg-white text-[#1a1a1a] [direction:rtl]"
      variant="flush"
    >
      <TopBar
        className="[&_button]:text-[#1a1a1a]"
        onBack={onBack}
        title={isSuccessOpen ? "وضعیت آگهی" : "مدیریت آگهی"}
      />

      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-white">
        <section className="px-4 pb-4 pt-4" aria-label={ad.title}>
          <div className="flex justify-start">
            <span className="inline-flex h-9 items-center rounded-lg bg-[#11a36614] px-3 text-sm font-medium leading-5 text-[#11a366]">
              منتشر شده
            </span>
          </div>

          <div className="mt-4 flex h-[68px] items-center justify-between gap-2 [direction:ltr]">
            <div className="min-w-0 flex-1 text-right [direction:rtl]">
              <h2 className="m-0 truncate text-base font-medium leading-6">{ad.title}</h2>
              <p className="m-0 mt-1 text-xs font-medium leading-4 text-[#808080]">{ad.time}</p>
            </div>
            <img
              alt=""
              className="h-[68px] w-[102px] shrink-0 rounded-xl object-cover"
              src="/figma/account/consultant-published-thumbnail.png"
            />
          </div>

          <div className="mt-5 flex items-center justify-between text-sm font-medium leading-5 [direction:ltr]">
            <span className="[direction:rtl]">12 بهمن (12 روز دیگر)</span>
            <span className="text-[#808080] [direction:rtl]">انقضا</span>
          </div>
        </section>

        <div className="h-2 bg-[#f0f0f0]" aria-hidden="true" />
        <div className="px-4">
          <PublishedAction icon="preview" label="پیش‌نمایش" />
          <PublishedAction icon="edit" label="ویرایش" />
          <PublishedAction icon="delete" label="حذف" />
          <PublishedAction icon="upgrade" label="ارتقاء آگهی" />
          <PublishedAction icon="history" label="تاریخچه پرداخت" />
        </div>
      </main>

      <BottomSheet
        ariaLabel="نتیجه پرداخت"
        contentClassName="px-4 pt-5 text-center"
        heightClassName="h-[315px]"
        isOpen={isSuccessOpen}
        onBack={onCloseSuccess}
        onClose={onCloseSuccess}
        title="نتیجه پرداخت"
      >
        <img
          alt=""
          className="mx-auto h-[104px] w-[104px] object-contain"
          src="/figma/account/consultant-payment-success.png"
        />
        <h3 className="m-0 mt-3 text-base font-semibold leading-6 text-[#11a366]">
          پرداخت موفق
        </h3>
        <p className="m-0 mt-5 text-sm font-normal leading-5 text-[#4d4d4d]">
          پرداخت موفق و آگهی منتشر شد
        </p>
      </BottomSheet>
    </PageFrame>
  );
}

function PublishedAction({
  icon,
  label,
}: {
  icon: "delete" | "edit" | "history" | "preview" | "upgrade";
  label: string;
}) {
  return (
    <button
      className="flex h-[61px] w-full items-center justify-between border-b border-[#cccccc] text-[#1a1a1a] last:border-b-0 [direction:ltr]"
      type="button"
    >
      <ChevronLeftIcon className="h-5 w-5 text-[#4d4d4d]" />
      <span className="inline-flex items-center gap-2 text-base font-medium leading-6 [direction:rtl]">
        <PublishedActionIcon className="h-6 w-6 text-[#4d4d4d]" icon={icon} />
        {label}
      </span>
    </button>
  );
}

function AllocationAction({
  icon,
  label,
}: {
  icon: "edit" | "preview";
  label: string;
}) {
  return (
    <button
      className="flex h-[60px] w-full items-center justify-between text-[#1a1a1a] [direction:ltr]"
      type="button"
    >
      <ChevronLeftIcon className="h-5 w-5 text-[#4d4d4d]" />
      <span className="inline-flex items-center gap-2 text-base font-medium leading-6 [direction:rtl]">
        <AllocationIcon className="h-6 w-6 text-[#4d4d4d]" icon={icon} />
        {label}
      </span>
    </button>
  );
}

function SelectionBox({
  checked,
  disabled = false,
}: {
  checked: boolean;
  disabled?: boolean;
}) {
  return (
    <span
      aria-hidden="true"
      className={`grid h-5 w-5 place-items-center rounded-md ${
        checked
          ? disabled
            ? "bg-[#b8b8b8] text-white"
            : "bg-[#0048c4] text-white"
          : "border border-[#808080] bg-white text-transparent"
      }`}
    >
      <svg className="h-4 w-4" fill="none" viewBox="0 0 16 16">
        <path
          d="m3.5 8.5 3 3 6-7"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </svg>
    </span>
  );
}

function RadioIndicator({ active }: { active: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`grid h-5 w-5 place-items-center rounded-full border-2 ${
        active ? "border-[#0057d9] bg-[#0057d9]" : "border-[#808080] bg-white"
      }`}
    >
      {active ? <span className="h-2 w-2 rounded-full bg-white" /> : null}
    </span>
  );
}

function TagIcon({ className = "" }: { className?: string }) {
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
      <path d="M3.5 12.5 12 4h7.5v7.5L11 20 3.5 12.5Z" />
      <circle cx="16" cy="8" r="1.5" />
    </svg>
  );
}

function PaymentOptionIcon({
  className = "",
  icon,
}: {
  className?: string;
  icon: "credit" | "online" | "wallet";
}) {
  if (icon === "online") {
    return (
      <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 28 28">
        <path d="M5 8 14 3l9 5v11l-9 5-9-5V8Z" fill="#eb3455" />
        <path d="M14 6v16M8 10l6 3 6-3M8 18l6-3 6 3" stroke="#ffffff" strokeWidth="1.5" />
        <circle cx="14" cy="14" fill="#f7a800" r="3.5" />
      </svg>
    );
  }

  return (
    <svg
      aria-hidden="true"
      className={`${className} text-[#4d4d4d]`}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.7"
      viewBox="0 0 28 28"
    >
      {icon === "credit" ? (
        <>
          <path d="M4 10h19a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h14" />
          <path d="M19 6v4M19 6l-9 4M20 16h2" />
        </>
      ) : (
        <>
          <path d="M6 10h17a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h13" />
          <path d="M19 6v4M19 6l-9 4M20 16h2" />
        </>
      )}
    </svg>
  );
}

function PublishedActionIcon({
  className = "",
  icon,
}: {
  className?: string;
  icon: "delete" | "edit" | "history" | "preview" | "upgrade";
}) {
  if (icon === "delete") {
    return (
      <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
        <path d="M5 7h14M9 7V4h6v3M7 7l1 13h8l1-13M10 10v7M14 10v7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (icon === "upgrade") {
    return (
      <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="m5 16 6-6 4 4 5-7M15 7h5v5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (icon === "history") {
    return (
      <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
        <path d="M7 3h10v18l-5-2.5L7 21V3Z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M13.8 9.2c-.4-.5-1-.7-1.8-.7-.9 0-1.6.5-1.6 1.2 0 1.8 3.5.8 3.5 2.8 0 .7-.7 1.2-1.7 1.2-.8 0-1.5-.3-2-.8M12.1 7.4v7.4" strokeLinecap="round" />
      </svg>
    );
  }

  return <AllocationIcon className={className} icon={icon} />;
}

function FilterToggle() {
  return (
    <button
      aria-label="نمایش آگهی های من"
      aria-pressed="false"
      className="flex h-6 w-11 items-center rounded-full bg-[#0048c41f] px-1 [direction:ltr]"
      type="button"
    >
      <span className="block h-4 w-4 rounded-full bg-[#808080]" />
    </button>
  );
}

function FilterSelect({ label }: { label: string }) {
  return (
    <button
      className="flex h-14 w-full items-center justify-between rounded-xl border border-[#cccccc] bg-white px-4 [direction:ltr]"
      type="button"
    >
      <ChevronDownIcon className="h-5 w-5 text-[#4d4d4d]" />
      <span className="text-sm font-normal leading-5 text-[#a6a6a6] [direction:rtl]">{label}</span>
    </button>
  );
}

function PriceRow({ prices }: { prices: ConsultantAd["prices"] }) {
  return (
    <div className="flex h-6 items-center justify-start gap-2 [direction:rtl]">
      {prices.map((price, index) => (
        <div className="contents" key={`${price.label ?? "price"}-${price.value}`}>
          {index > 0 ? <span className="h-6 w-px bg-[#cccccc]" aria-hidden="true" /> : null}
          <span className="inline-flex items-center gap-0.5 [direction:rtl]">
            {price.label ? (
              <span className="text-sm font-medium leading-5 text-[#808080]">{price.label}</span>
            ) : null}
            <strong className="font-semibold text-base leading-6 text-[#0048c4]">
              {price.value}
            </strong>
            <CardSpriteIcon icon="tooman" />
          </span>
        </div>
      ))}
    </div>
  );
}

function PropertyMetric({
  icon,
  label,
}: {
  icon: "area" | "rooms" | "year";
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 text-sm font-medium leading-5 text-[#1a1a1a] [direction:ltr]">
      <span dir="rtl">{label}</span>
      <CardSpriteIcon icon={icon} />
    </span>
  );
}

function FilterIcon({ className = "" }: { className?: string }) {
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
      <path d="M4 7h5M15 7h5M4 17h11M19 17h1" />
      <rect height="6" rx="1.5" width="6" x="9" y="4" />
      <rect height="6" rx="1.5" width="4" x="15" y="14" />
    </svg>
  );
}

function SearchIcon({ className = "" }: { className?: string }) {
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
      <path d="m20 20-4.5-4.5" />
      <circle cx="10.5" cy="10.5" r="7" />
    </svg>
  );
}

function AnalyticsIcon({ className = "" }: { className?: string }) {
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
      <rect height="17" rx="2" width="16" x="4" y="3" />
      <path d="M8 16V12M12 16V8M16 16v-5M7 18h10" />
    </svg>
  );
}

function ChevronDownIcon({ className = "" }: { className?: string }) {
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
      <path d="m8 10 4 4 4-4" />
    </svg>
  );
}

function ChevronLeftIcon({ className = "" }: { className?: string }) {
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
      <path d="m14 7-5 5 5 5" />
    </svg>
  );
}

function AllocationIcon({
  className = "",
  icon,
}: {
  className?: string;
  icon: "edit" | "preview";
}) {
  if (icon === "preview") {
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
        <rect height="13" rx="1.5" width="17" x="3.5" y="4" />
        <path d="m8 11 2 2 5-5M12 17v3M8.5 20h7" />
      </svg>
    );
  }

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
      <path d="M4.5 19.5h4l10-10a2.1 2.1 0 0 0-4-4l-10 10v4ZM13.5 6.5l4 4M19 15v5H4" />
    </svg>
  );
}

function CardSpriteIcon({ icon }: { icon: "area" | "rooms" | "tooman" | "year" }) {
  const positions = {
    area: "-308px -267.302px",
    rooms: "-222px -267.302px",
    tooman: "-212px -233.302px",
    year: "-140px -267.302px",
  };

  return (
    <span
      aria-hidden="true"
      className="inline-block h-5 w-5 shrink-0 bg-no-repeat"
      style={{
        backgroundImage: "url('/figma/account/consultant-ad-card-1.png')",
        backgroundPosition: positions[icon],
        backgroundSize: "328px 355.302px",
      }}
    />
  );
}
