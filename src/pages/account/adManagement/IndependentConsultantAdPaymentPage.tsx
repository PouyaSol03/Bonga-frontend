import { useMemo, useState } from "react";

import { PageFrame } from "../../../app/PageFrame";
import { TopBar } from "../../../components/TopBar";
import { RouteLink } from "../../../routes/RouteLink";
import { PaymentOptionIcon } from "./AdManagementIcons";
import {
  AdCardTomanIcon,
  AdTariffOptionsList,
  createAdTariffOptions,
  formatTariffToman,
  getTariffTotal,
  type AdTariffOptionId,
} from "./AdTariffOptionsView";
import {
  adManagementPaths,
  getAdManagementRouteState,
  getSelectedConsultantAd,
} from "./adManagementData";

export type PaymentMethod = "online" | "wallet";
type PaymentStep = "options" | "checkout";

const upgradePrice = 40_000;
const unavailableRenewWarning = "۹ روز و ۱۲ ساعت تا فعال شدن امکان تمدید آگهی مانده است.";

function navigateTo(path: string, state?: unknown) {
  window.history.pushState(state ?? {}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

function formatShortPayment(value: number) {
  if (value % 1000 === 0) {
    return `${new Intl.NumberFormat("fa-IR").format(value / 1000)} هزار تومان`;
  }

  return formatTariffToman(value);
}

export function IndependentConsultantAdPaymentPage() {
  const routeState = getAdManagementRouteState();
  const ad = getSelectedConsultantAd();
  const isNewAdFlow = routeState.paymentFlow === "new-ad";
  const backTo = routeState.paymentHistoryReturnTo ?? (isNewAdFlow ? "/new-ad" : adManagementPaths.allocation);
  const [step, setStep] = useState<PaymentStep>(routeState.paymentStep ?? "options");
  const [method, setMethod] = useState<PaymentMethod>("online");
  const [selectedTariffs, setSelectedTariffs] = useState<AdTariffOptionId[]>(["renew"]);
  const tariffOptions = useMemo(
    () =>
      createAdTariffOptions({
        disabledIds: ["refresh", "special", "refreshSpecial"],
        price: upgradePrice,
        warning: unavailableRenewWarning,
      }),
    [],
  );
  const payableAmount = getTariffTotal(tariffOptions, selectedTariffs);
  const publishState = useMemo(
    () => ({
      ad,
      showPaymentSuccess: true,
      tab: "status" as const,
    }),
    [ad],
  );

  function toggleTariff(optionId: AdTariffOptionId) {
    setSelectedTariffs((selected) =>
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
      className="relative flex min-h-0 flex-col overflow-hidden bg-white text-[#1a1a1a] [direction:rtl]"
      variant="flush"
    >
      <TopBar
        backState={{ ad, card: routeState.card, tab: routeState.tab }}
        backTo={backTo}
        className="bg-[#f0f0f0] [&_a]:text-[#1a1a1a]"
        title="هزینه ثبت آگهی"
      />

      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-white pb-[76px]">
        <AdTariffOptionsList
          onToggle={toggleTariff}
          options={tariffOptions}
          selectedIds={selectedTariffs}
        />
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

export function PaymentCheckoutView({
  completeLabelPrefix = "پرداخت و انتشار",
  completeState,
  completeTo = adManagementPaths.published,
  method,
  onBack,
  onMethodChange,
  publishState,
  total,
}: {
  completeLabelPrefix?: string;
  completeState?: unknown;
  completeTo?: string;
  method: PaymentMethod;
  onBack: () => void;
  onMethodChange: (method: PaymentMethod) => void;
  publishState: unknown;
  total: number;
}) {
  const walletBalance = 10_000;
  const walletDeficit = Math.max(total - walletBalance, 0);
  const finalState = completeState ?? publishState;

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
            subLabel={`مانده: ${formatTariffToman(walletBalance)} تومان`}
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
          <SummaryRow label="قیمت" value={formatTariffToman(total)} />
          <SummaryRow label="تخفیف" value={formatTariffToman(0)} />
          <div className="my-4 border-t border-dashed border-[#cccccc]" aria-hidden="true" />
          <SummaryRow
            label="جمع پرداختی"
            value={formatTariffToman(total)}
            valueClassName="text-[#0048c4] font-semibold text-base"
            labelClassName="text-right font-semibold text-[#4d4d4d] text-base"
            iconClassName="w-7 h-7"
          />
        </section>
      </main>

      <footer className="absolute inset-x-0 bottom-0 bg-white px-4 pb-3 pt-3 shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
        <RouteLink
          className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-[#0048c4] text-sm font-medium leading-5 text-white no-underline shadow-[0_4px_10px_rgba(0,72,196,0.22)]"
          state={finalState}
          to={completeTo}
        >
          {`${completeLabelPrefix} - ${formatShortPayment(total)}`}
        </RouteLink>
      </footer>
    </PageFrame>
  );
}

function WalletDeficitBox({ deficit }: { deficit: number }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-[#ffd7ad] bg-[#fff7ed] px-4 py-3 [direction:ltr]">
      <button
        className="flex shrink-0 items-center justify-center gap-1 rounded-lg bg-[#ff6a00] px-4 py-1.5 text-xs font-semibold leading-5 text-white"
        type="button"
      >
        افزایش موجودی
        <span className="flex text-base leading-none">+</span>
      </button>

      <span className="text-right text-sm font-medium leading-5 text-[#1a1a1a] [direction:rtl]">
        کسری: {formatTariffToman(deficit)} تومان
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
  iconClassName = "h-5 w-5 text-[#4d4d4d] mr-0.5",
  label,
  labelClassName = "text-right font-medium text-[#4d4d4d]",
  value,
  valueClassName = "text-[#1A1A1A] font-medium",
}: {
  iconClassName?: string;
  label: string;
  labelClassName?: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex min-h-8 items-center justify-between gap-4 text-sm leading-5 [direction:ltr]">
      <span className={`flex items-center text-left [direction:rtl] ${valueClassName}`}>
        {value}
        <AdCardTomanIcon className={iconClassName} />
      </span>
      <span className={`[direction:rtl] ${labelClassName}`}>
        {label}
      </span>
    </div>
  );
}

function RadioIndicator({ active }: { active: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 ${
        active ? "border-[#0057d9]" : "border-[#808080]"
      }`}
    >
      {active ? <span className="h-2.5 w-2.5 rounded-full bg-[#0057d9]" /> : null}
    </span>
  );
}
