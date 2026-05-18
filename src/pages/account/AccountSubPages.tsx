import { PageFrame } from "../../app/PageFrame";
import { RouteLink } from "../../routes/RouteLink";

type TopBarProps = {
  action?: React.ReactNode;
  title: string;
};

const adFilters = ["همه", "فعال", "در انتظار", "نیمه کاره", "غیر فعال"];
const paymentRows = [
  { id: "65415489", status: "پرداخت شده", statusColor: "#11a366" },
  { id: "-", status: "ناموفق", statusColor: "#ee3623" },
  { id: "65415489", status: "پرداخت شده", statusColor: "#11a366" },
];

export function AccountProfilePage() {
  return (
    <AccountPageShell title="مشخصات من">
      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-white pb-24">
        <section className="flex flex-col items-center px-4 pt-4">
          <div className="relative grid h-[100px] w-[100px] place-items-center rounded-full bg-[#e0e0e0] text-[#808080]">
            <UserIcon className="h-10 w-10" />
            <button
              aria-label="ویرایش تصویر"
              className="absolute bottom-1 right-1 grid h-9 w-9 place-items-center rounded-full border-4 border-white bg-[#0048c4] text-white"
              type="button"
            >
              <EditIcon className="h-4 w-4" />
            </button>
          </div>
        </section>

        <section className="mt-4 space-y-6 px-4">
          <ReadonlyField label="شماره همراه" value="09155214062" />
          <ReadonlyField label="کد ملی" value="0705688456" />
        </section>

        <div className="mt-4 h-4 bg-[#f0f0f0]" />

        <section className="space-y-6 px-4 pt-4">
          <TextField placeholder="نام خود را وارد کنید" />
          <TextField placeholder="نام خانوادگی خود را وارد کنید" />
          <TextField placeholder="پست الکترونیکی" />
        </section>
      </main>

      <div className="absolute inset-x-0 bottom-0 bg-white px-4 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] pt-4 shadow-[0_-8px_24px_rgba(26,26,26,0.08)]">
        <button
          className="h-10 w-full rounded-lg bg-[#0048c4] text-sm font-medium leading-5 text-white"
          type="button"
        >
          ثبت
        </button>
      </div>
    </AccountPageShell>
  );
}

export function AccountMyAdsPage() {
  return (
    <AccountPageShell
      action={
        <button className="grid h-12 w-12 place-items-center text-[#1a1a1a]" type="button">
          <MapIcon className="h-6 w-6" />
        </button>
      }
      title="آگهی‌های من"
    >
      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-[#f0f0f0]">
        <AdFilterTabs />
        <div className="space-y-2 bg-[#f0f0f0] pt-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <MyAdCard key={index} />
          ))}
        </div>
      </main>
    </AccountPageShell>
  );
}

export function AccountMyAdsEmptyPage() {
  return (
    <AccountPageShell
      action={
        <button className="grid h-12 w-12 place-items-center text-[#1a1a1a]" type="button">
          <MapIcon className="h-6 w-6" />
        </button>
      }
      title="آگهی‌های من"
    >
      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-white">
        <AdFilterTabs />
        <section className="flex min-h-[560px] flex-col items-center justify-center px-10 text-center">
          <div className="relative mb-6 grid h-[74px] w-[74px] place-items-center text-[#dfe3eb]">
            <DocumentSadIcon className="h-[68px] w-[68px]" />
            <span className="absolute bottom-1 right-2 grid h-7 w-7 place-items-center rounded-full bg-[#ffb100] text-base font-bold leading-none text-white">
              !
            </span>
          </div>
          <h2 className="m-0 text-base font-bold leading-6 text-[#1a1a1a]">
            هیچ آگهی‌ای برای نمایش وجود ندارد!
          </h2>
          <p className="m-0 mt-2 text-sm font-normal leading-6 text-[#4d4d4d]">
            می‌توانید آگهی‌های خود را ثبت کرده و در این بخش مشاهده کنید.
          </p>
          <RouteLink
            className="mt-5 inline-flex h-10 items-center gap-2 rounded-lg bg-[#0048c4] px-4 text-sm font-medium leading-5 text-white"
            to="/new-ad"
          >
            <PlusIcon className="h-5 w-5" />
            ثبت آگهی
          </RouteLink>
        </section>
      </main>
    </AccountPageShell>
  );
}

export function AccountWalletPage() {
  return (
    <AccountPageShell
      action={
        <RouteLink
          aria-label="تاریخچه پرداخت"
          className="grid h-12 w-12 place-items-center text-[#1a1a1a]"
          to="/account/wallet/history"
        >
          <WalletHistoryIcon className="h-6 w-6" />
        </RouteLink>
      }
      title="کیف پول"
    >
      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-white pb-24">
        <section className="flex h-[178px] flex-col items-center justify-center">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-[#0048c4] text-white">
            <WalletIcon className="h-8 w-8" />
          </div>
          <p className="m-0 mt-5 text-sm font-medium leading-5 text-[#4d4d4d]">
            اعتبار فعلی:
          </p>
          <div className="mt-2 rounded-lg bg-[#0048c414] px-4 py-1 text-center text-base font-semibold leading-6 text-[#0048c4]">
            ۲ میلیون تومان
          </div>
        </section>

        <div className="h-2 bg-[#f0f0f0]" />

        <section className="px-4 pt-6 text-right">
          <div className="flex items-center justify-end gap-2 text-[#1a1a1a]">
            <h2 className="m-0 text-base font-medium leading-6">افزایش اعتبار</h2>
            <WalletAddIcon className="h-6 w-6 text-[#4d4d4d]" />
          </div>
          <p className="m-0 mt-3 text-sm font-normal leading-5 text-[#1a1a1a]">
            مبلغ مورد نظر را برای افزایش اعتبار وارد کنید.
          </p>
          <label className="mt-6 flex h-14 items-center rounded-xl border border-[#cccccc] px-4 [direction:ltr]">
            <span className="text-sm font-normal leading-5 text-[#a6a6a6]">تومان</span>
            <input
              className="min-w-0 flex-1 border-0 bg-transparent text-right text-sm font-normal leading-5 text-[#1a1a1a] outline-none placeholder:text-[#a6a6a6] [direction:rtl]"
              placeholder="مبلغ اعتبار"
            />
          </label>
          <div className="mt-6 grid grid-cols-3 gap-4">
            {["۱۰۰ هزار", "۲۰۰ هزار", "۳۰۰ هزار"].map((amount) => (
              <button
                className="h-8 rounded-lg bg-[#e8e9ee] text-xs font-medium leading-4 text-[#1a1a1a]"
                key={amount}
                type="button"
              >
                {amount}
              </button>
            ))}
          </div>
        </section>
      </main>

      <div className="absolute inset-x-0 bottom-0 bg-white px-4 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] pt-4 shadow-[0_-8px_24px_rgba(26,26,26,0.08)]">
        <button className="h-10 w-full rounded-lg bg-[#0048c4] text-sm font-medium leading-5 text-white" type="button">
          پرداخت
        </button>
      </div>
    </AccountPageShell>
  );
}

export function AccountWalletHistoryPage() {
  return (
    <AccountPageShell title="تاریخچه پرداخت کیف پول">
      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-[#f0f0f0]">
        {paymentRows.map((row) => (
          <section className="mb-2 bg-white px-4 py-5" key={`${row.id}-${row.status}`}>
            <PaymentInfoRow label="وضعیت" value={row.status} valueColor={row.statusColor} />
            <PaymentInfoRow label="هزینه" value="۳۰,۰۰۰ تومان" />
            <PaymentInfoRow label="زمان پرداخت" value="۰۱ خرداد ۱۴۰۳" />
            <PaymentInfoRow label="شناسه پرداخت" value={row.id} />
          </section>
        ))}
      </main>
    </AccountPageShell>
  );
}

function AccountPageShell({ action, children, title }: React.PropsWithChildren<TopBarProps>) {
  return (
    <PageFrame
      className="relative flex min-h-0 flex-col overflow-hidden bg-[#f0f0f0] text-[#1a1a1a] [direction:rtl]"
      variant="flush"
    >
      <header className="h-14 shrink-0 bg-[#f0f0f0]">
        <div className="flex h-full items-center px-1 [direction:ltr]">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center">
            {action}
          </div>
          <h1 className="m-0 min-w-0 flex-1 truncate px-2 text-right text-base font-semibold leading-6 text-[#1a1a1a] [direction:rtl]">
            {title}
          </h1>
          <RouteLink
            aria-label="بازگشت"
            className="grid h-12 w-12 shrink-0 place-items-center text-[#1a1a1a]"
            to="/login"
          >
            <ArrowRightIcon className="h-6 w-6" />
          </RouteLink>
        </div>
      </header>
      {children}
    </PageFrame>
  );
}

function AdFilterTabs() {
  return (
    <section className="h-[52px] overflow-hidden bg-[#f0f0f0] px-4 py-2">
      <div className="flex h-9 gap-2 overflow-x-auto [direction:rtl] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {adFilters.map((filter, index) => (
          <button
            className={`h-9 shrink-0 rounded-lg border px-3 text-sm font-medium leading-5 ${
              index === 0
                ? "border-[#0048c4] bg-[#0048c414] text-[#0048c4]"
                : "border-[#cccccc] bg-white text-[#1a1a1a]"
            }`}
            key={filter}
            type="button"
          >
            {filter}
          </button>
        ))}
      </div>
    </section>
  );
}

function MyAdCard() {
  return (
    <article className="bg-white px-4 py-4">
      <div className="relative overflow-hidden rounded-xl bg-[#ebebeb]">
        <img
          alt=""
          className="aspect-[328/252] w-full object-cover"
          src="/figma/search/apartment-kitchen.png"
        />
        <span className="absolute right-3 top-3 rounded-lg bg-[#1a1a1acc] px-2 py-1 text-xs font-medium leading-4 text-white">
          ۵
        </span>
        <span className="absolute bottom-3 right-3 rounded-lg bg-[#1a1a1acc] px-2 py-1 text-sm font-medium leading-5 text-white">
          دفتر املاک شریعت زاده
        </span>
      </div>
      <div className="mt-3 text-right">
        <div className="flex items-center justify-end gap-1 text-[#0048c4]">
          <span className="text-base font-semibold leading-6">۳٫۸۵۰ میلیارد</span>
          <span className="text-sm font-semibold leading-5">تومان</span>
        </div>
        <div className="mt-2 flex justify-end gap-5 text-sm font-normal leading-5 text-[#1a1a1a]">
          <span>۱۴۰۰</span>
          <span>۲ اتاق</span>
          <span>۱۱۰ متر</span>
        </div>
        <h2 className="m-0 mt-2 text-base font-medium leading-6 text-[#1a1a1a]">
          آپارتمان۱۱۰متری شمال تک واحدی سنداردر رحیمی
        </h2>
        <div className="mt-2 flex items-center justify-end gap-2 text-sm font-normal leading-5">
          <span className="rounded-lg border border-[#ee3623] px-2 py-0.5 text-[#ee3623]">
            فوری
          </span>
          <span className="text-[#808080]">۱ ساعت پیش در الهیه</span>
        </div>
      </div>
    </article>
  );
}

function ReadonlyField({ label, value }: { label: string; value: string }) {
  return (
    <label className="block">
      <span className="mb-1 block pr-4 text-right text-xs font-normal leading-4 text-[#b3b3b3]">
        {label}
      </span>
      <input
        className="h-14 w-full rounded-xl border border-[#e0e0e0] bg-white px-4 text-right text-sm font-normal leading-5 text-[#b3b3b3] outline-none"
        readOnly
        value={value}
      />
    </label>
  );
}

function TextField({ placeholder }: { placeholder: string }) {
  return (
    <input
      className="h-14 w-full rounded-xl border border-[#cccccc] bg-white px-4 text-right text-sm font-normal leading-5 text-[#808080] outline-none placeholder:text-[#808080]"
      placeholder={placeholder}
    />
  );
}

function PaymentInfoRow({
  label,
  value,
  valueColor = "#1a1a1a",
}: {
  label: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <div className="mb-5 flex items-center justify-between last:mb-0 [direction:ltr]">
      <span className="text-left text-base font-medium leading-6" style={{ color: valueColor }}>
        {value}
      </span>
      <span className="text-right text-base font-medium leading-6 text-[#808080]">
        {label}
      </span>
    </div>
  );
}

function ArrowRightIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M19 12H5" />
      <path d="m12 5-7 7 7 7" />
    </svg>
  );
}

function DocumentSadIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 80 80">
      <path d="M24 12h28l12 12v40a4 4 0 0 1-4 4H24a4 4 0 0 1-4-4V16a4 4 0 0 1 4-4Z" fill="currentColor" opacity=".25" stroke="none" />
      <path d="M52 12v14h14" />
      <path d="M30 38h.01M50 38h.01M32 54c5-4 11-4 16 0M31 29l6 6M37 29l-6 6M47 29l6 6M53 29l-6 6" />
    </svg>
  );
}

function EditIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" />
    </svg>
  );
}

function MapIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6Z" />
      <path d="M9 3v15M15 6v15" />
    </svg>
  );
}

function PlusIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function UserIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
      <path d="M4.5 21a7.5 7.5 0 0 1 15 0" />
    </svg>
  );
}

function WalletAddIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M4 7.5A2.5 2.5 0 0 1 6.5 5H19v14H6.5A2.5 2.5 0 0 1 4 16.5v-9Z" />
      <path d="M17 12h3v4h-3a2 2 0 0 1 0-4ZM8 12h5M10.5 9.5v5" />
    </svg>
  );
}

function WalletHistoryIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M4 7.5A2.5 2.5 0 0 1 6.5 5H19v14H6.5A2.5 2.5 0 0 1 4 16.5v-9Z" />
      <path d="M17 12h3v4h-3a2 2 0 0 1 0-4ZM8 17a4 4 0 1 1 2.6-7M8 11v3h2" />
    </svg>
  );
}

function WalletIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M4 7.5A2.5 2.5 0 0 1 6.5 5H19v14H6.5A2.5 2.5 0 0 1 4 16.5v-9Z" />
      <path d="M17 12h3v4h-3a2 2 0 0 1 0-4Z" />
    </svg>
  );
}
