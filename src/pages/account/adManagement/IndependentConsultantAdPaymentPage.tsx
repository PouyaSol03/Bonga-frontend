import { useState } from "react";
import { PageFrame } from "../../../app/PageFrame";
import { TopBar } from "../../../components/TopBar";
import { RouteLink } from "../../../routes/RouteLink";
import { PaymentOptionIcon, TagIcon } from "./AdManagementIcons";
import { adManagementPaths, getSelectedConsultantAd } from "./adManagementData";

type PaymentMethod = "credit" | "online" | "wallet";
type UpgradeOption = "refresh" | "special";

export function IndependentConsultantAdPaymentPage() {
  const ad = getSelectedConsultantAd();
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
      <TopBar
        backState={{ ad }}
        backTo={adManagementPaths.allocation}
        className="[&_a]:text-[#1a1a1a]"
        title="انتشار آگهی"
      />

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
        <RouteLink
          className="inline-flex h-10 w-full items-center justify-center rounded-lg bg-[#0048c4] text-sm font-medium leading-5 text-white no-underline"
          state={{ ad, showPaymentSuccess: true }}
          to={adManagementPaths.published}
        >
          {usesCredit
            ? `پرداخت ${totalCredits} اعتبار`
            : `پرداخت ${totalToman / 1000} هزار تومان`}
        </RouteLink>
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
