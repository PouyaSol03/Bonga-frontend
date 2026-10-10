import { useEffect, useMemo, useState } from "react";

import { getApiErrorMessage } from "../../../shared/api/api";
import { PageFrame } from "../../../shared/layout/PageFrame";
import { TopBar } from "../../../shared/components/TopBar";
import { ChoiceIndicator } from "../../../shared/ui/Choice";
import { Button } from "../../../shared/ui/Button";
import { Typography } from "../../../shared/ui/Typography";
import LinearTooman from "../../../shared/icons/LinearTooman";
import { PaymentOptionIcon } from "../../account/adManagement/AdManagementIcons";
import { formatTariffToman } from "../../account/adManagement/AdTariffOptionsView";
import { useChargeWalletMutation } from "../../account/api/account.hooks";
import { storePaymentReturnTarget } from "../../../shared/utils/payment-return";
import {
  validateDiscountCode,
  type ValidateDiscountCodeResult,
} from "../../crm/api/crm-discount.service";
import type { PackageItem, PackagePaymentType } from "../api/package.service";

export type PackagePaymentPageProps = {
  isPending: boolean;
  onBack: () => void;
  onSubmit: (paymentType: PackagePaymentType, discountCode?: string) => void;
  packageItem: PackageItem;
  walletCredit?: number | string;
  walletError?: string | null;
  walletLoading?: boolean;
};

function toAmount(value: number | string | undefined) {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
}

export function formatShortPayment(value: number) {
  if (value === 0) return "رایگان";
  if (value >= 1_000_000) {
    const millions = value / 1_000_000;
    const formatted = new Intl.NumberFormat("fa-IR", {
      maximumFractionDigits: millions % 1 === 0 ? 0 : 2,
    }).format(millions);
    return `${formatted} میلیون تومان`;
  }
  if (value % 1000 === 0) {
    return `${new Intl.NumberFormat("fa-IR").format(value / 1000)} هزار تومان`;
  }
  return `${formatTariffToman(value)} تومان`;
}

function SummaryRow({
  iconClassName = "mr-0.5 h-5 w-5 text-on-surface-var",
  label,
  labelClassName = "text-right font-medium text-on-surface-var",
  value,
  valueClassName = "font-medium text-on-surface",
  showTooman = true,
}: {
  iconClassName?: string;
  label: string;
  labelClassName?: string;
  value: string;
  valueClassName?: string;
  showTooman?: boolean;
}) {
  return (
    <div className="flex min-h-8 items-center justify-between gap-4 text-sm leading-5 [direction:ltr]">
      <Typography
        as="span"
        variant="body"
        size="medium"
        weight="regular"
        className={`flex items-center text-left [direction:rtl] ${valueClassName}`}
      >
        {value}
        {showTooman ? <LinearTooman className={iconClassName} /> : null}
      </Typography>
      <Typography
        as="span"
        variant="body"
        size="medium"
        weight="regular"
        className={`[direction:rtl] ${labelClassName}`}
      >
        {label}
      </Typography>
    </div>
  );
}

function PaymentMethodOption({
  active,
  disabled = false,
  icon,
  label,
  onClick,
  subLabel,
  subLabelClassName = "text-outline",
}: {
  active: boolean;
  disabled?: boolean;
  icon: "consultant" | "credit" | "online" | "wallet";
  label: string;
  onClick: () => void;
  subLabel: string;
  subLabelClassName?: string;
}) {
  return (
    <Button
      unstyled
      aria-pressed={active}
      className={`flex h-[72px] w-full items-center justify-between border-0 bg-surface-container-lowest px-4 text-inherit [direction:ltr] ${
        disabled ? "cursor-not-allowed opacity-50" : ""
      }`}
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      <ChoiceIndicator
        checked={active}
        className={`ml-1 ${!active && !disabled ? "!border-outline-var" : ""}`}
        disabled={disabled}
        type="radio"
      />
      <Typography
        as="span"
        variant="body"
        size="medium"
        weight="regular"
        className="inline-flex items-center gap-2 text-right [direction:rtl]"
      >
        <PaymentOptionIcon
          className="h-6 w-6 shrink-0 text-on-surface-var"
          icon={icon}
        />
        <Typography
          as="span"
          variant="body"
          size="medium"
          weight="regular"
          className="block"
        >
          <strong className="block text-base font-normal leading-6 text-on-surface">
            {label}
          </strong>
          <Typography
            as="span"
            variant="body"
            size="medium"
            weight="regular"
            className={`block text-sm font-normal leading-5 ${subLabelClassName}`}
          >
            {subLabel}
          </Typography>
        </Typography>
      </Typography>
    </Button>
  );
}

function ApiWalletDeficitBox({
  deficit,
  errorMessage,
  isCharging,
  onCharge,
}: {
  deficit: number;
  errorMessage?: string;
  isCharging?: boolean;
  onCharge: () => void;
}) {
  return (
    <div>
      <div className="flex h-[56px] items-center justify-between rounded-xl border border-[#FFE8CC] bg-[#FFF8EE] px-4 [direction:ltr]">
        <Button
          unstyled
          className="flex shrink-0 items-center justify-center gap-1.5 rounded-lg bg-[#00966D] px-3.5 py-2 text-xs font-semibold leading-5 text-white shadow-xs transition-colors disabled:opacity-60"
          disabled={isCharging}
          onClick={onCharge}
          type="button"
        >
          <span className="text-sm font-bold leading-none select-none">+</span>
          <Typography
            as="span"
            variant="label"
            size="small"
            weight="semibold"
            className="text-white"
          >
            {isCharging ? "در حال اتصال..." : "افزایش موجودی"}
          </Typography>
        </Button>

        <Typography
          as="span"
          variant="label"
          size="medium"
          weight="medium"
          className="text-right text-sm font-medium leading-5 text-on-surface [direction:rtl]"
        >
          کسری: {formatTariffToman(deficit)} تومان
        </Typography>
      </div>
      {errorMessage ? (
        <p className="mt-1 text-right text-xs text-error">{errorMessage}</p>
      ) : null}
    </div>
  );
}

export function PackagePaymentPage({
  isPending,
  onBack,
  onSubmit,
  packageItem,
  walletCredit,
  walletError,
  walletLoading = false,
}: PackagePaymentPageProps) {
  const [paymentType, setPaymentType] = useState<PackagePaymentType>(0);
  const [discountInput, setDiscountInput] = useState("");
  const [appliedDiscount, setAppliedDiscount] =
    useState<ValidateDiscountCodeResult | null>(null);
  const [discountLoading, setDiscountLoading] = useState(false);
  const [discountError, setDiscountError] = useState<string | null>(null);

  const basePrice = packageItem.final_price || packageItem.real_price || 0;
  const isPanel = packageItem.kind === "panel_subscription";

  // Discount validation
  async function handleApplyDiscount() {
    const code = discountInput.trim();
    if (!code) return;
    setDiscountLoading(true);
    setDiscountError(null);
    try {
      const service = isPanel ? "panel" : "package";
      const result = await validateDiscountCode({
        code,
        price: basePrice,
        service,
      });
      setAppliedDiscount(result);
      if (result.disable_gateway || result.is_free) {
        setPaymentType(1);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "کد تخفیف نامعتبر است";
      setDiscountError(msg);
      setAppliedDiscount(null);
    } finally {
      setDiscountLoading(false);
    }
  }

  function handleRemoveDiscount() {
    setAppliedDiscount(null);
    setDiscountInput("");
    setDiscountError(null);
  }

  const finalPayable = appliedDiscount ? appliedDiscount.final_price : basePrice;
  const isFree = Boolean(appliedDiscount?.is_free || appliedDiscount?.disable_gateway || finalPayable === 0);
  const isGatewayDisabled = Boolean(appliedDiscount?.disable_gateway || isFree);

  // If gateway gets disabled due to 100% discount, force wallet method
  useEffect(() => {
    if (isGatewayDisabled && paymentType === 0) {
      setPaymentType(1);
    }
  }, [isGatewayDisabled, paymentType]);

  const normalizedWalletCredit = toAmount(walletCredit);
  const walletDeficit = useMemo(
    () => (isFree ? 0 : Math.max(finalPayable - normalizedWalletCredit, 0)),
    [isFree, finalPayable, normalizedWalletCredit],
  );

  const walletSupported = !walletError;
  const walletSufficient = isFree || walletDeficit <= 0;
  const selectedMethodAvailable =
    paymentType === 1
      ? walletSupported && walletSufficient
      : !isGatewayDisabled;

  const chargeWalletMutation = useChargeWalletMutation();
  const [chargeErrorMessage, setChargeErrorMessage] = useState("");

  function handleChargeWallet() {
    if (chargeWalletMutation.isPending || walletDeficit <= 0) return;

    setChargeErrorMessage("");
    chargeWalletMutation.mutate(
      { price: Math.ceil(walletDeficit) },
      {
        onError: (error: unknown) => {
          setChargeErrorMessage(
            getApiErrorMessage(error, "شارژ کیف پول با خطا مواجه شد."),
          );
        },
        onSuccess: ({ paymentUrl }) => {
          storePaymentReturnTarget({
            label: "بازگشت به پرداخت بسته",
            path: window.location.pathname,
          });
          window.location.assign(paymentUrl);
        },
      },
    );
  }

  const totalDiscount = Math.max(basePrice - finalPayable, 0);

  function handleSubmit() {
    if (!selectedMethodAvailable || isPending) return;
    onSubmit(paymentType, appliedDiscount?.code);
  }

  return (
    <PageFrame
      className="relative flex min-h-0 flex-col overflow-hidden bg-surface-container text-on-surface [direction:rtl]"
      variant="flush"
    >
      <TopBar
        className="[&_button]:text-on-surface"
        onBack={onBack}
        title="پرداخت"
      />

      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-surface-container pb-[84px]">
        {/* Package Card */}
        <section className="bg-surface-container-lowest px-4 py-4" aria-label="مشخصات بسته">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-right">
              <Typography
                as="h2"
                variant="title"
                size="medium"
                weight="semibold"
                className="m-0 text-base font-bold text-on-surface"
              >
                {packageItem.title}
              </Typography>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                {isPanel ? "اشتراک پنل" : "بسته اعتباری"}
              </span>
            </div>

            <div className="shrink-0 text-left">
              <span className="text-base font-bold text-primary">
                {isFree ? "رایگان" : `${formatTariffToman(finalPayable)} تومان`}
              </span>
            </div>
          </div>
        </section>

        {/* Payment Method Section */}
        <section
          className="mt-2 bg-surface-container-lowest px-4 pb-4 pt-5"
          aria-label="روش پرداخت"
        >
          <Typography
            as="h2"
            variant="title"
            size="medium"
            weight="semibold"
            className="m-0 mb-4 text-right text-base font-semibold leading-6"
          >
            روش پرداخت
          </Typography>

          <PaymentMethodOption
            active={paymentType === 1}
            disabled={!walletSupported}
            icon="wallet"
            label="کیف پول"
            onClick={() => setPaymentType(1)}
            subLabel={
              walletLoading
                ? "در حال دریافت موجودی کیف پول..."
                : walletError
                  ? "دریافت موجودی با خطا مواجه شد"
                  : `مانده: ${formatTariffToman(normalizedWalletCredit)} تومان`
            }
            subLabelClassName={
              walletDeficit > 0 ? "text-error font-medium" : "text-tertiary font-medium"
            }
          />

          {walletSupported && walletDeficit > 0 && !isFree ? (
            <div className="mt-2.5 mb-2">
              <ApiWalletDeficitBox
                deficit={walletDeficit}
                errorMessage={chargeErrorMessage}
                isCharging={chargeWalletMutation.isPending}
                onCharge={handleChargeWallet}
              />
            </div>
          ) : null}

          <div className="mt-2 border-t border-outline-var pt-2">
            <PaymentMethodOption
              active={paymentType === 0}
              disabled={isGatewayDisabled}
              icon="online"
              label="پرداخت آنلاین"
              onClick={() => {
                if (!isGatewayDisabled) setPaymentType(0);
              }}
              subLabel={
                isGatewayDisabled
                  ? "درگاه پرداخت برای تخفیف ۱۰۰٪ غیرفعال است (خرید از طریق کیف پول انجام می‌شود)"
                  : "درگاه بانکی زرین‌پال"
              }
            />
          </div>
        </section>

        {/* Discount Code Section */}
        <section
          className="mt-2 bg-surface-container-lowest px-4 py-4"
          aria-label="کد تخفیف"
        >
          <Typography
            as="h2"
            variant="title"
            size="medium"
            weight="semibold"
            className="m-0 mb-3 text-right text-base font-semibold leading-6"
          >
            کد تخفیف
          </Typography>

          {appliedDiscount ? (
            <div className="flex items-center justify-between rounded-xl border border-primary/30 bg-primary-container/20 px-4 py-3 text-sm text-primary">
              <span className="font-semibold">
                {appliedDiscount.code} ({appliedDiscount.discount_percent}٪ تخفیف)
              </span>
              <button
                type="button"
                onClick={handleRemoveDiscount}
                className="cursor-pointer text-xs font-semibold text-error"
              >
                حذف کد
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 [direction:ltr]">
              <Button
                unstyled
                className="h-12 shrink-0 rounded-xl bg-primary px-5 text-sm font-semibold leading-5 text-on-primary shadow-xs transition-colors disabled:cursor-not-allowed disabled:bg-surface-container-high disabled:text-outline"
                disabled={discountLoading || !discountInput.trim()}
                onClick={handleApplyDiscount}
                type="button"
              >
                {discountLoading ? "در حال بررسی..." : "اعمال"}
              </Button>
              <label className="min-w-0 flex-1">
                <input
                  className="h-12 w-full rounded-xl border border-outline-var bg-surface-container-lowest px-4 text-right text-sm font-normal leading-5 text-on-surface outline-none placeholder:text-outline focus:border-primary"
                  disabled={discountLoading}
                  onChange={(e) => {
                    setDiscountInput(e.target.value);
                    if (discountError) setDiscountError(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      void handleApplyDiscount();
                    }
                  }}
                  placeholder="کد تخفیف را وارد کنید"
                  type="text"
                  value={discountInput}
                />
              </label>
            </div>
          )}

          {discountError ? (
            <p className="m-0 mt-2 text-right text-xs text-error">{discountError}</p>
          ) : null}
        </section>

        {/* Summary Section */}
        <section
          className="mt-2 bg-surface-container-lowest px-4 pb-6 pt-5"
          aria-label="خلاصه پرداخت"
        >
          <Typography
            as="h2"
            variant="title"
            size="medium"
            weight="semibold"
            className="m-0 mb-4 text-right text-base font-semibold leading-6"
          >
            خلاصه پرداخت
          </Typography>
          <SummaryRow label="قیمت" value={formatTariffToman(basePrice)} />
          <SummaryRow label="تخفیف" value={formatTariffToman(totalDiscount)} />
          <div
            className="my-4 border-t border-dashed border-outline-var"
            aria-hidden="true"
          />
          <SummaryRow
            iconClassName="h-6 w-6 text-primary"
            label="جمع پرداختی"
            labelClassName="text-right text-base font-semibold text-on-surface"
            showTooman={!isFree}
            value={isFree ? "رایگان" : formatTariffToman(finalPayable)}
            valueClassName="text-lg font-bold text-primary"
          />
        </section>
      </main>

      {/* Sticky Bottom Button */}
      <footer className="absolute inset-x-0 bottom-0 bg-surface-container-lowest px-4 pb-3 pt-3 shadow-sm">
        {(() => {
          const isWalletDeficit =
            paymentType === 1 && walletSupported && walletDeficit > 0 && !isFree;
          const isButtonBusy = isPending || chargeWalletMutation.isPending;

          function handleButtonClick() {
            if (isWalletDeficit) {
              handleChargeWallet();
              return;
            }
            handleSubmit();
          }

          let buttonLabel: string;
          if (isPending) {
            buttonLabel =
              paymentType === 0 ? "در حال اتصال به درگاه..." : "در حال پرداخت...";
          } else if (chargeWalletMutation.isPending) {
            buttonLabel = "در حال اتصال به درگاه جهت شارژ...";
          } else if (isFree) {
            buttonLabel = "تأیید و پرداخت (رایگان)";
          } else if (paymentType === 1) {
            buttonLabel = isWalletDeficit
              ? `شارژ کیف پول و پرداخت - ${formatShortPayment(walletDeficit)}`
              : `پرداخت از کیف پول - ${formatShortPayment(finalPayable)}`;
          } else {
            buttonLabel = `اتصال به درگاه پرداخت - ${formatShortPayment(finalPayable)}`;
          }

          return (
            <Button
              unstyled
              className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-primary text-sm font-medium leading-5 text-on-primary shadow-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50"
              disabled={
                isButtonBusy ||
                (paymentType === 0 && isGatewayDisabled) ||
                (paymentType === 1 && !walletSupported)
              }
              onClick={handleButtonClick}
              type="button"
            >
              {buttonLabel}
            </Button>
          );
        })()}
      </footer>
    </PageFrame>
  );
}
