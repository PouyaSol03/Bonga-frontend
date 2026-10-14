import { useEffect, useMemo, useState, type ReactNode } from "react";

import type { PackagePaymentType } from "../api/package.service";
import {
  validateDiscountCode,
  type ValidateDiscountCodeResult,
} from "../../crm/api/crm-discount.service";
import LinearPayment from "../../../shared/icons/LinearPayment";
import LinearWallet2 from "../../../shared/icons/LinearWallet2";
import { BottomSheet } from "../../../shared/components/BottomSheet";
import { Link } from "react-router";
import { Button } from "../../../shared/ui/Button";
import { Typography } from "../../../shared/ui/Typography";
import { ChoiceIndicator } from "../../../shared/ui/Choice";

type PackagePaymentMethodSheetProps = {
  isOpen: boolean;
  isPending: boolean;
  onClose: () => void;
  onSubmit: (paymentType: PackagePaymentType, discountCode?: string) => void;
  packageKind?: "panel_subscription" | "credit_bundle" | string;
  packagePrice: number;
  packageTitle: string;
  walletCredit?: number | string;
  walletError?: string | null;
  walletLoading?: boolean;
};

function toAmount(value: number | string | undefined) {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
}

function formatMoney(value: number) {
  return new Intl.NumberFormat("fa-IR").format(Math.max(0, value));
}

export function PackagePaymentMethodSheet({
  isOpen,
  isPending,
  onClose,
  onSubmit,
  packageKind,
  packagePrice,
  packageTitle,
  walletCredit,
  walletError,
  walletLoading = false,
}: PackagePaymentMethodSheetProps) {
  const [paymentType, setPaymentType] = useState<PackagePaymentType>(0);
  const [discountInput, setDiscountInput] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<ValidateDiscountCodeResult | null>(null);
  const [discountLoading, setDiscountLoading] = useState(false);
  const [discountError, setDiscountError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setPaymentType(0);
      setDiscountInput("");
      setAppliedDiscount(null);
      setDiscountError(null);
      setDiscountLoading(false);
    }
  }, [isOpen, packageTitle]);

  async function handleApplyDiscount() {
    const code = discountInput.trim();
    if (!code) return;
    setDiscountLoading(true);
    setDiscountError(null);
    try {
      const service = packageKind === "panel_subscription" ? "panel" : "package";
      const result = await validateDiscountCode({
        code,
        price: packagePrice,
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

  const finalPrice = appliedDiscount ? appliedDiscount.final_price : packagePrice;
  const isFree = Boolean(
    appliedDiscount?.is_free || appliedDiscount?.disable_gateway || finalPrice === 0,
  );
  const isGatewayDisabled = Boolean(appliedDiscount?.disable_gateway || isFree);

  const normalizedWalletCredit = toAmount(walletCredit);
  const walletShortage = useMemo(
    () => Math.max(finalPrice - normalizedWalletCredit, 0),
    [normalizedWalletCredit, finalPrice],
  );
  const walletReady = !walletLoading && !walletError;
  const canPayWithWallet = walletReady && (isFree || walletShortage <= 0);
  const canSubmit = isFree ? true : paymentType === 0 || canPayWithWallet;

  return (
    <BottomSheet
      ariaLabel="انتخاب روش پرداخت بسته"
      isOpen={isOpen}
      onClose={onClose}
      showBackButton={false}
      title="روش پرداخت"
      variant="form"
    >
      <div className="px-4 pt-4 pb-4">
        {/* Package summary card */}
        <div className="bg-surface-container rounded-xl px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <Typography
              as="span"
              variant="body"
              size="medium"
              weight="regular"
              className="text-on-surface-var min-w-0 flex-1 truncate text-right"
            >
              {packageTitle}
            </Typography>
            <div className="shrink-0 text-left">
              {appliedDiscount ? (
                <div className="flex flex-col items-end">
                  <span className="text-outline text-xs line-through">
                    {formatMoney(packagePrice)} تومان
                  </span>
                  <span className="text-primary text-sm font-semibold">
                    {finalPrice === 0 ? "رایگان" : `${formatMoney(finalPrice)} تومان`}
                  </span>
                </div>
              ) : (
                <Typography
                  as="span"
                  variant="label"
                  size="medium"
                  weight="semibold"
                  className="text-on-surface shrink-0"
                >
                  {formatMoney(packagePrice)} تومان
                </Typography>
              )}
            </div>
          </div>
        </div>

        {/* Discount code section */}
        <div className="border-outline-var bg-surface-container-lowest mt-3 rounded-xl border p-3">
          <Typography
            as="span"
            variant="label"
            size="small"
            weight="medium"
            className="text-on-surface mb-2 block text-right"
          >
            کد تخفیف
          </Typography>
          {appliedDiscount ? (
            <div className="bg-primary-container/30 text-primary flex items-center justify-between rounded-lg px-3 py-2 text-sm">
              <span className="font-semibold">
                {appliedDiscount.code} ({appliedDiscount.discount_percent}٪ تخفیف)
              </span>
              <button
                type="button"
                onClick={handleRemoveDiscount}
                className="text-error cursor-pointer text-xs font-medium"
              >
                حذف کد
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 [direction:ltr]">
              <Button
                disabled={discountLoading || !discountInput.trim()}
                loading={discountLoading}
                onClick={handleApplyDiscount}
                radius="small"
                size="small"
                type="button"
                variant="primary"
              >
                اعمال
              </Button>
              <input
                className="border-outline-var focus:border-primary h-10 w-full rounded-lg border bg-white px-3 text-right text-sm outline-none"
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
            </div>
          )}
          {discountError ? (
            <p className="text-error m-0 mt-1.5 text-right text-xs">{discountError}</p>
          ) : null}
        </div>

        {/* Payment options */}
        <div className="border-outline-var bg-surface-container-lowest mt-4 overflow-hidden rounded-xl border">
          <PaymentMethodRow
            active={paymentType === 1}
            description={
              walletLoading
                ? "در حال دریافت موجودی کیف پول..."
                : walletError
                  ? "دریافت موجودی کیف پول با خطا مواجه شد."
                  : `موجودی: ${formatMoney(normalizedWalletCredit)} تومان`
            }
            icon={<LinearWallet2 className="h-6 w-6" />}
            label="کیف پول"
            onClick={() => setPaymentType(1)}
          />

          <div className="bg-outline-var mx-4 h-px" />

          <PaymentMethodRow
            active={paymentType === 0}
            disabled={isGatewayDisabled}
            description={
              isGatewayDisabled
                ? "درگاه پرداخت برای تخفیف ۱۰۰٪ غیرفعال است (خرید از طریق کیف پول انجام می‌شود)"
                : "درگاه بانکی زرین‌پال"
            }
            icon={<LinearPayment className="h-6 w-6" />}
            label="پرداخت آنلاین"
            onClick={() => {
              if (!isGatewayDisabled) setPaymentType(0);
            }}
          />
        </div>

        {paymentType === 1 && !isFree && walletReady && walletShortage > 0 ? (
          <div className="border-error/30 bg-error-container/30 mt-3 rounded-xl border px-4 py-3 text-right">
            <Typography
              as="p"
              variant="body"
              size="small"
              weight="regular"
              className="text-error m-0"
            >
              موجودی کیف پول برای این خرید {formatMoney(walletShortage)} تومان کم است.
            </Typography>
            <Link
              className="text-primary mt-2 inline-flex text-sm font-medium no-underline"
              to="/account/wallet"
            >
              شارژ کیف پول
            </Link>
          </div>
        ) : null}

        <Button
          className="mt-5"
          disabled={!canSubmit || isPending}
          fullWidth
          loading={isPending}
          onClick={() => onSubmit(paymentType, appliedDiscount?.code)}
          radius="small"
          size="x-medium"
          type="button"
          variant="primary"
        >
          {isPending
            ? paymentType === 0
              ? "در حال اتصال به درگاه..."
              : "در حال پرداخت..."
            : isFree
              ? "تأیید و پرداخت (رایگان)"
              : "پرداخت"}
        </Button>
      </div>
    </BottomSheet>
  );
}

function PaymentMethodRow({
  active,
  description,
  disabled = false,
  icon,
  label,
  onClick,
}: {
  active: boolean;
  description: string;
  disabled?: boolean;
  icon: ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <Button
      unstyled
      aria-pressed={active}
      disabled={disabled}
      className={`flex min-h-[72px] w-full items-center justify-between gap-3 px-4 py-3 text-right transition [direction:ltr] ${
        disabled ? "bg-surface-container/30 cursor-not-allowed opacity-50" : "cursor-pointer"
      }`}
      onClick={disabled ? undefined : onClick}
      type="button"
    >
      <ChoiceIndicator checked={active} disabled={disabled} type="radio" />

      <span className="inline-flex min-w-0 flex-1 items-center justify-end gap-3 [direction:rtl]">
        <span className="bg-surface-container text-on-surface-var grid h-10 w-10 shrink-0 place-items-center rounded-full">
          {icon}
        </span>

        <span className="min-w-0 flex-1">
          <Typography
            as="span"
            variant="body"
            size="medium"
            weight="medium"
            className="text-on-surface block"
          >
            {label}
          </Typography>
          <Typography
            as="span"
            variant="body"
            size="small"
            weight="regular"
            className="text-outline mt-1 block text-xs"
          >
            {description}
          </Typography>
        </span>
      </span>
    </Button>
  );
}
