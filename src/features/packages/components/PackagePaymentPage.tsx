import { useEffect, useMemo, useState } from "react";

import { getApiErrorMessage } from "../../../shared/api/api";
import { PageFrame } from "../../../shared/layout/PageFrame";
import { TopBar } from "../../../shared/components/TopBar";
import { Button } from "../../../shared/ui/Button";
import { Typography } from "../../../shared/ui/Typography";
import LinearTooman from "../../../shared/icons/LinearTooman";
import { PaymentMethodOption } from "../../payments/components/PaymentMethodOption";
import { formatShortPayment } from "../../payments/components/formatShortPayment";
import { formatTariffToman } from "../../account/adManagement/AdTariffOptionsView";
import { useChargeWalletMutation } from "../../account/api/account.hooks";
import { storePaymentReturnTarget } from "../../../shared/utils/payment-return";
import {
  validateDiscountCode,
  type ValidateDiscountCodeResult,
} from "../../crm/api/crm-discount.service";
import type { PackageItem, PackagePaymentType } from "../api/package.service";

type PackagePaymentPageProps = {
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
          className="flex shrink-0 items-center justify-center gap-1.5 rounded-lg bg-[#00966D] px-3.5 py-2 text-xs leading-5 font-semibold text-white shadow-xs transition-colors disabled:opacity-60"
          disabled={isCharging}
          onClick={onCharge}
          type="button"
        >
          <span className="text-sm leading-none font-bold select-none">+</span>
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
          className="text-on-surface text-right text-sm leading-5 font-medium [direction:rtl]"
        >
          کسری: {formatTariffToman(deficit)} تومان
        </Typography>
      </div>
      {errorMessage ? <p className="text-error mt-1 text-right text-xs">{errorMessage}</p> : null}
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
  const [appliedDiscount, setAppliedDiscount] = useState<ValidateDiscountCodeResult | null>(null);
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
  const isFree = Boolean(
    appliedDiscount?.is_free || appliedDiscount?.disable_gateway || finalPayable === 0,
  );
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
    paymentType === 1 ? walletSupported && walletSufficient : !isGatewayDisabled;

  const chargeWalletMutation = useChargeWalletMutation();
  const [chargeErrorMessage, setChargeErrorMessage] = useState("");

  function handleChargeWallet() {
    if (chargeWalletMutation.isPending || walletDeficit <= 0) return;

    setChargeErrorMessage("");
    chargeWalletMutation.mutate(
      { price: Math.ceil(walletDeficit) },
      {
        onError: (error: unknown) => {
          setChargeErrorMessage(getApiErrorMessage(error, "شارژ کیف پول با خطا مواجه شد."));
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
      className="bg-surface-container text-on-surface relative flex min-h-0 flex-col overflow-hidden [direction:rtl]"
      variant="flush"
    >
      <TopBar className="[&_button]:text-on-surface" onBack={onBack} title="پرداخت" />

      <main className="bg-surface-container min-h-0 flex-1 overflow-x-hidden overflow-y-auto pb-[84px]">
        {/* Package Card */}
        <section className="bg-surface-container-lowest px-4 py-4" aria-label="مشخصات بسته">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-right">
              <Typography
                as="h2"
                variant="title"
                size="medium"
                weight="semibold"
                className="text-on-surface m-0 text-base font-bold"
              >
                {packageItem.title}
              </Typography>
              <span className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs font-medium">
                {isPanel ? "اشتراک پنل" : "بسته اعتباری"}
              </span>
            </div>

            <div className="shrink-0 text-left">
              <span className="text-primary text-base font-bold">
                {isFree ? "رایگان" : `${formatTariffToman(finalPayable)} تومان`}
              </span>
            </div>
          </div>
        </section>

        {/* Payment Method Section */}
        <section
          className="bg-surface-container-lowest mt-2 px-4 pt-5 pb-4"
          aria-label="روش پرداخت"
        >
          <Typography
            as="h2"
            variant="title"
            size="medium"
            weight="semibold"
            className="m-0 mb-4 text-right text-base leading-6 font-semibold"
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

          <div className="border-outline-var mt-2 border-t pt-2">
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
        <section className="bg-surface-container-lowest mt-2 px-4 py-4" aria-label="کد تخفیف">
          <Typography
            as="h2"
            variant="title"
            size="medium"
            weight="semibold"
            className="m-0 mb-3 text-right text-base leading-6 font-semibold"
          >
            کد تخفیف
          </Typography>

          {appliedDiscount ? (
            <div className="border-primary/30 bg-primary-container/20 text-primary flex items-center justify-between rounded-xl border px-4 py-3 text-sm">
              <span className="font-semibold">
                {appliedDiscount.code} ({appliedDiscount.discount_percent}٪ تخفیف)
              </span>
              <button
                type="button"
                onClick={handleRemoveDiscount}
                className="text-error cursor-pointer text-xs font-semibold"
              >
                حذف کد
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 [direction:ltr]">
              <Button
                unstyled
                className="bg-primary text-on-primary disabled:bg-surface-container-high disabled:text-outline h-12 shrink-0 rounded-xl px-5 text-sm leading-5 font-semibold shadow-xs transition-colors disabled:cursor-not-allowed"
                disabled={discountLoading || !discountInput.trim()}
                onClick={handleApplyDiscount}
                type="button"
              >
                {discountLoading ? "در حال بررسی..." : "اعمال"}
              </Button>
              <label className="min-w-0 flex-1">
                <input
                  className="border-outline-var bg-surface-container-lowest text-on-surface placeholder:text-outline focus:border-primary h-12 w-full rounded-xl border px-4 text-right text-sm leading-5 font-normal outline-none"
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
            <p className="text-error m-0 mt-2 text-right text-xs">{discountError}</p>
          ) : null}
        </section>

        {/* Summary Section */}
        <section
          className="bg-surface-container-lowest mt-2 px-4 pt-5 pb-6"
          aria-label="خلاصه پرداخت"
        >
          <Typography
            as="h2"
            variant="title"
            size="medium"
            weight="semibold"
            className="m-0 mb-4 text-right text-base leading-6 font-semibold"
          >
            خلاصه پرداخت
          </Typography>
          <SummaryRow label="قیمت" value={formatTariffToman(basePrice)} />
          <SummaryRow label="تخفیف" value={formatTariffToman(totalDiscount)} />
          <div className="border-outline-var my-4 border-t border-dashed" aria-hidden="true" />
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
      <footer className="bg-surface-container-lowest absolute inset-x-0 bottom-0 px-4 pt-3 pb-3 shadow-sm">
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
            buttonLabel = paymentType === 0 ? "در حال اتصال به درگاه..." : "در حال پرداخت...";
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
              className="bg-primary text-on-primary inline-flex h-11 w-full items-center justify-center rounded-lg text-sm leading-5 font-medium shadow-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50"
              disabled={
                isButtonBusy ||
                (!isFree && paymentType === 0 && isGatewayDisabled) ||
                (!isFree && paymentType === 1 && (!walletSupported || walletDeficit > 0))
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
