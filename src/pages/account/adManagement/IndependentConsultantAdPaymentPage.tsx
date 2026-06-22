import { useMemo, useState } from "react";
import { PageFrame } from "../../../app/PageFrame";
import { TopBar } from "../../../components/TopBar";
import { RouteLink } from "../../../routes/RouteLink";
import { PaymentOptionIcon, TagIcon } from "./AdManagementIcons";
import {
  adManagementPaths,
  getAdManagementRouteState,
  getSelectedConsultantAd,
} from "./adManagementData";

type PaymentMethod = "online" | "wallet";
type PaymentStep = "options" | "checkout";
type UpgradeOptionId = "refresh" | "special" | "renew" | "refreshSpecial";

type UpgradeOption = {
  description: string;
  id: UpgradeOptionId;
  title: string;
};

const registrationFee = 40_000;
const freeTariffCount = 34;
const upgradePrice = 40_000;
const upgradeOptions: UpgradeOption[] = [
  {
    description:
      "آگهی شما به مدت ۳ روز، هر ۶ ساعت در اولویت نمایش قرار می‌گیرد.",
    id: "refresh",
    title: "بروزرسانی",
  },
  {
    description:
      "آگهی شما به مدت ۳ روز با برچسب ویژه، برای جلب توجه بیشتر و دیده شدن بهتر نمایش داده می‌شود.",
    id: "special",
    title: "ویژه",
  },
  {
    description:
      "آگهی شما پیش از انقضا، برای یک ماه دیگر تمدید می‌شود.",
    id: "renew",
    title: "تمدید",
  },
  {
    description:
      "آگهی بروزرسانی و ویژه به صورت همزمان فعال می‌شود.",
    id: "refreshSpecial",
    title: "بروزرسانی و ویژه",
  },
];

function navigateTo(path: string, state?: unknown) {
  window.history.pushState(state ?? {}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

export function AdCardTomanIcon({ className = '' }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 20 20">
      <path
        d="M16.844 10.742c.88 2.604 1.213 3.708-1.214 3.708h-1.214m0 0h-2.022c-2.185 0-1.455-3.131 0-3.131 1.454 0 1.86 1.071 2.022 3.131Zm0 0c.189 2.405-.809 2.473-3.398 3.05M5.678 13.461l1.861.989c1.294.688 2.114-2.22.81-2.884-1.1-.56-1.825.101-2.671 1.895Zm0 0c-.708 1.504-2.831 1.57-2.831-.247l-.162-4.12M7.62 2.5l.405 2.885c.323 1.648-.98 2.417-2.508 2.719-2.744.543-3.641-1.895-2.59-4.78M13.608 9.505h1.213m.81 0h1.213M4.708 2.5H5.92"
        stroke="currentColor"
        strokeWidth="1.3"
      />
    </svg>
  )
}

function formatToman(value: number) {
  return `${new Intl.NumberFormat("fa-IR").format(value)}`;
}

function formatShortPayment(value: number) {
  if (value % 1000 === 0) {
    return `${new Intl.NumberFormat("fa-IR").format(value / 1000)} هزار تومان`;
  }

  return formatToman(value);
}

export function IndependentConsultantAdPaymentPage() {
  const routeState = getAdManagementRouteState();
  const ad = getSelectedConsultantAd();
  const isNewAdFlow = routeState.paymentFlow === "new-ad";
  const hasFreeTariff = routeState.hasFreeAdTariff ?? isNewAdFlow;
  const [step, setStep] = useState<PaymentStep>(routeState.paymentStep ?? "options");
  const [method, setMethod] = useState<PaymentMethod>("online");
  const [selectedUpgrades, setSelectedUpgrades] = useState<UpgradeOptionId[]>([]);
  const adFee = hasFreeTariff ? 0 : registrationFee;
  const upgradesTotal = selectedUpgrades.length * upgradePrice;
  const payableAmount = adFee + upgradesTotal;
  const publishState = useMemo(
    () => ({
      ad,
      showPaymentSuccess: true,
      tab: "status" as const,
    }),
    [ad],
  );

  function toggleUpgrade(optionId: UpgradeOptionId) {
    setSelectedUpgrades((selected) =>
      selected.includes(optionId)
        ? selected.filter((item) => item !== optionId)
        : [...selected, optionId],
    );
  }

  function handleCompleteOptions() {
    if (payableAmount > 0) {
      setStep("checkout");
      return;
    }

    navigateTo(adManagementPaths.published, publishState);
  }

  if (step === "checkout") {
    return (
      <PaymentCheckoutView
        method={method}
        onBack={() => setStep("options")}
        onMethodChange={setMethod}
        publishState={publishState}
        total={payableAmount}
      />
    );
  }

  return (
    <PageFrame
      className="relative flex min-h-0 flex-col overflow-hidden bg-[#f0f0f0] text-[#1a1a1a] [direction:rtl]"
      variant="flush"
    >
      <TopBar
        backState={{ ad }}
        backTo={isNewAdFlow ? "/new-ad" : adManagementPaths.allocation}
        className="[&_a]:text-[#1a1a1a]"
        title="هزینه ثبت آگهی"
      />

      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-[#f0f0f0] pb-[76px]">
        <section className="bg-white px-4 pb-4 pt-6" aria-label="هزینه ثبت آگهی">
          <RegistrationFeeCard
            amount={hasFreeTariff ? "رایگان" : formatToman(registrationFee)}
            description="برای ارسال هر آگهی باید هزینه ثبت آن را پرداخت نمایید."
            checked
            showDescription={!hasFreeTariff}
            title="هزینه ثبت آگهی"
          />

          {hasFreeTariff ? (
            <InfoNotice tone="blue">
              {`${new Intl.NumberFormat("fa-IR").format(freeTariffCount)} تعرفه رایگان برای شما مانده است`}
            </InfoNotice>
          ) : null}
        </section>

        <section className="mt-2 bg-white px-4 pb-4 pt-6" aria-label="امکانات ارتقای آگهی">
          <h2 className="m-0 mb-3 flex items-center justify-right gap-1 text-base font-semibold leading-6 text-[#1a1a1a]">
            <UpgradeSparkIcon />
            امکانات ارتقای آگهی
          </h2>

          <div className="divide-y divide-[#f0f0f0]">
            {upgradeOptions.map((option) => (
              <UpgradeOptionCard
                checked={selectedUpgrades.includes(option.id)}
                description={option.description}
                key={option.id}
                onClick={() => toggleUpgrade(option.id)}
                price={formatToman(upgradePrice)}
                title={option.title}
                warning={
                  hasFreeTariff
                    ? "این قابلیت پس از انتشار آگهی فعال می‌شود."
                    : "پس از انتشار آگهی امکان فعال‌سازی این امکان وجود دارد."
                }
              />
            ))}
          </div>
        </section>
      </main>

      <footer className="absolute inset-x-0 bottom-0 bg-white px-4 pb-3 pt-3 shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
        <button
          className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-[#0048c4] text-sm font-medium leading-5 text-white shadow-[0_4px_10px_rgba(0,72,196,0.22)] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#0048c440]"
          onClick={handleCompleteOptions}
          type="button"
        >
          تکمیل خرید
        </button>
      </footer>
    </PageFrame>
  );
}

function PaymentCheckoutView({
  method,
  onBack,
  onMethodChange,
  publishState,
  total,
}: {
  method: PaymentMethod;
  onBack: () => void;
  onMethodChange: (method: PaymentMethod) => void;
  publishState: unknown;
  total: number;
}) {
  const walletBalance = 10_000;
  const walletDeficit = Math.max(total - walletBalance, 0);

  return (
    <PageFrame
      className="relative flex min-h-0 flex-col overflow-hidden bg-[#f0f0f0] text-[#1a1a1a] [direction:rtl]"
      variant="flush"
    >
      <TopBar
        className="[&_button]:text-[#1a1a1a]"
        onBack={onBack}
        title="پرداخت"
      />

      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-[#f0f0f0] pb-[76px]">
        <section className="bg-white px-4 pb-2 pt-6" aria-label="روش پرداخت">
          <h2 className="m-0 mb-4 text-right text-base font-semibold leading-6">روش پرداخت</h2>
          <PaymentMethodOption
            active={method === "wallet"}
            icon="wallet"
            label="کیف پول"
            onClick={() => onMethodChange("wallet")}
            subLabel={`مانده: ${formatToman(walletBalance)} تومان`}
            subLabelClassName={walletDeficit > 0 ? "text-[#e11900]" : "text-[#11a366]"}
          />

          {walletDeficit > 0 ? (
            <WalletDeficitBox deficit={walletDeficit} />
          ) : null}
          <PaymentMethodOption
            active={method === "online"}
            icon="online"
            label="پرداخت آنلاین"
            onClick={() => onMethodChange("online")}
            subLabel="بانک ملت"
          />
        </section>

        <section className="mt-2 bg-white px-4 py-4" aria-label="کد تخفیف">
          <div className="flex items-center gap-2 [direction:ltr]">
            <button
              className="h-12 shrink-0 rounded-xl bg-[#e5e5e5] px-4 text-sm font-medium leading-5 text-[#a6a6a6]"
              disabled
              type="button"
            >
              اعمال
            </button>
            <label className="min-w-0 flex-1">
              <span className="sr-only">کد تخفیف</span>
              <input
                className="h-12 w-full rounded-xl border border-[#cccccc] bg-white px-4 text-right text-sm font-normal leading-5 text-[#1a1a1a] outline-none placeholder:text-[#a6a6a6] focus:border-[#0048c4]"
                placeholder="کد تخفیف را وارد کنید"
                type="text"
              />
            </label>
          </div>
        </section>

        <section className="mt-2 bg-white px-4 pb-6 pt-5" aria-label="خلاصه پرداخت">
          <h2 className="m-0 mb-4 text-right text-base font-semibold leading-6">خلاصه پرداخت</h2>
          <SummaryRow label="قیمت" value={formatToman(total)} />
          <SummaryRow label="تخفیف" value={formatToman(0)} />
          <div className="my-4 border-t border-dashed border-[#cccccc]" aria-hidden="true" />
          <SummaryRow
            label="جمع پرداختی"
            value={formatToman(total)}
            valueClassName="text-[#0048c4] font-semibold text-base"
            labelClassName="text-right font-semibold text-[#4d4d4d] text-base"
            iconClassName="w-7 h-7"
          />
        </section>
      </main>

      <footer className="absolute inset-x-0 bottom-0 bg-white px-4 pb-3 pt-3 shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
        <RouteLink
          className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-[#0048c4] text-sm font-medium leading-5 text-white no-underline shadow-[0_4px_10px_rgba(0,72,196,0.22)]"
          state={publishState}
          to={adManagementPaths.published}
        >
          {`پرداخت و انتشار - ${formatShortPayment(total)}`}
        </RouteLink>
      </footer>
    </PageFrame>
  );
}

function RegistrationFeeCard({
  amount,
  checked,
  description,
  showDescription = true,
  title,
}: {
  amount: string;
  checked: boolean;
  description: string;
  showDescription?: boolean;
  title: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between [direction:ltr]">
        <strong className="text-base font-semibold leading-6 text-[#1a1a1a] [direction:rtl]">
          {amount}
        </strong>
        <span className="inline-flex items-center gap-2 text-base font-semibold leading-6 text-[#1a1a1a] [direction:rtl]">
          <SelectionBox checked={checked} disabled />
          {title}
        </span>
      </div>
      {showDescription ? (
        <p className="m-0 mt-5 text-right text-sm font-normal leading-6 text-[#4d4d4d]">
          {description}
        </p>
      ) : null}
    </div>
  );
}

function UpgradeOptionCard({
  checked,
  description,
  onClick,
  price,
  title,
  warning,
}: {
  checked: boolean;
  description: string;
  onClick: () => void;
  price: string;
  title: string;
  warning: string;
}) {
  return (
    <button
      aria-pressed={checked}
      className="block w-full border-0 bg-white py-4 text-inherit"
      onClick={onClick}
      type="button"
    >
      <span className="flex items-start justify-between gap-4 [direction:ltr]">
        <span className="shrink-0 pt-1 text-sm font-medium leading-5 text-[#a6a6a6] [direction:rtl]">
          {price}
        </span>
        <span className="min-w-0 flex-1 text-right [direction:rtl]">
          <span className="flex items-center justify-start gap-2 text-base font-semibold leading-6 text-[#4d4d4d]">
            <SelectionBox checked={checked} />
            {title}
          </span>
          <span className="mt-3 block text-sm font-normal leading-6 text-[#808080]">
            {description}
          </span>
        </span>
      </span>
      <InfoNotice tone="orange">{warning}</InfoNotice>
    </button>
  );
}

function WalletDeficitBox({ deficit }: { deficit: number }) {
  return (
    <div className="p-4 flex items-center justify-between rounded-lg border border-[#ffd7ad] bg-[#fff7ed] px-4 py-3 [direction:ltr]">
      <button
        className="flex py-1.5 px-4 shrink-0 items-center justify-center gap-1 rounded-lg bg-[#ff6a00] px-4 !text-xs font-semibold leading-5 text-white"
        type="button"
      >
        افزایش موجودی
        <span className="text-base leading-none flex">+</span>
      </button>

      <span className="text-right text-sm font-medium leading-5 text-[#1a1a1a] [direction:rtl]">
        کسری: {formatToman(deficit)} تومان
      </span>
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
  icon: "online" | "wallet";
  label: string;
  onClick: () => void;
  subLabel: string;
  subLabelClassName?: string;
}) {
  return (
    <button
      aria-pressed={active}
      className="flex h-[72px] w-full items-center justify-between border-0 bg-white px-0 text-inherit [direction:ltr]"
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

function SummaryRow({
  label,
  value,
  valueClassName = "text-[#1A1A1A] font-medium",
  labelClassName = "text-right font-medium text-[#4d4d4d]",
  iconClassName = "h-5 w-5 text-[#4d4d4d] mr-0.5"
}: {
  label: string;
  value: string;
  valueClassName?: string;
  labelClassName?: string;
  iconClassName?: string;
}) {
  return (
    <div className="flex min-h-8 items-center justify-between gap-4 text-sm leading-5 [direction:ltr]">
      <span className={`text-left [direction:rtl] flex items-center ${valueClassName}`}>
        {value}
        <AdCardTomanIcon className={`${iconClassName}`} />
      </span>
      <span className={`[direction:rtl] ${labelClassName}`}>
        {label}
      </span>
    </div>
  );
}

function InfoNotice({ children, tone }: { children: string; tone: "blue" | "orange" }) {
  const classes =
    tone === "blue"
      ? "bg-[#0048c414] text-[#0048c4]"
      : "bg-[#fff5db] text-[#ff8a00]";

  return (
    <p className={`m-0 mt-3 flex min-h-9 items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium leading-5 ${classes}`}>
      {tone === "blue" ? <TagIcon className="h-5 w-5 shrink-0" /> : <CircleInfoIcon className="h-5 w-5 shrink-0" />}
      <span>{children}</span>
    </p>
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
      className={`grid h-5 w-5 shrink-0 place-items-center rounded-[4px] ${checked
        ? disabled
          ? "bg-[#b8b8b8] text-white"
          : "bg-[#0048c4] text-white"
        : "border border-[#b8b8b8] bg-white text-transparent"
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
      className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 ${active ? "border-[#0057d9]" : "border-[#808080]"
        }`}
    >
      {active ? <span className="h-2.5 w-2.5 rounded-full bg-[#0057d9]" /> : null}
    </span>
  );
}

function UpgradeSparkIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M19.1249 12C19.1249 12.4142 18.7705 12.75 18.3333 12.75C17.896 12.75 17.5416 12.4142 17.5416 12V10.0713L13.6636 14.4805C13.5213 14.6422 13.3136 14.7394 13.0915 14.749C12.8693 14.7586 12.653 14.6793 12.4957 14.5303L9.95473 12.123L6.28499 16.4688C6.01185 16.7922 5.51312 16.8447 5.1717 16.5859C4.83028 16.3272 4.77486 15.8547 5.048 15.5312L9.27026 10.5312C9.41093 10.3647 9.62062 10.2628 9.84546 10.251C10.0701 10.2393 10.2894 10.319 10.4485 10.4697L13.0018 12.8887L16.6427 8.75H14.5337C14.0964 8.75 13.742 8.41421 13.742 8C13.742 7.58579 14.0964 7.25 14.5337 7.25H18.3333C18.7705 7.25 19.1249 7.58579 19.1249 8V12Z" fill="#4D4D4D" />
    </svg>
  );
}

function CircleInfoIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 20 20">
      <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.6" />
      <path d="M10 9.25v4.25" stroke="currentColor" strokeLinecap="round" strokeWidth="1.6" />
      <circle cx="10" cy="6.5" fill="currentColor" r="1" />
    </svg>
  );
}
