import { Button } from "../../../../shared/ui/Button";
import { Typography } from "../../../../shared/ui/Typography";
import type { ApiPaymentCheckoutProps } from "./paymentCheckoutTypes";
export function PaymentDiscountSection({
  appliedDiscount,
  discountError,
  discountInput = "",
  discountLoading,
  onApplyDiscount,
  onDiscountInputChange,
  onRemoveDiscount,
}: Pick<
  ApiPaymentCheckoutProps,
  | "appliedDiscount"
  | "discountError"
  | "discountInput"
  | "discountLoading"
  | "onApplyDiscount"
  | "onDiscountInputChange"
  | "onRemoveDiscount"
>) {
  return (
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
            onClick={onRemoveDiscount}
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
            disabled={discountLoading || !discountInput.trim() || !onApplyDiscount}
            onClick={onApplyDiscount}
            type="button"
          >
            {discountLoading ? "در حال بررسی..." : "اعمال"}
          </Button>
          <label className="min-w-0 flex-1">
            <Typography as="span" variant="body" size="medium" weight="regular" className="sr-only">
              کد تخفیف
            </Typography>
            <input
              className="border-outline-var bg-surface-container-lowest text-on-surface placeholder:text-outline focus:border-primary h-12 w-full rounded-xl border px-4 text-right text-sm leading-5 font-normal outline-none"
              disabled={discountLoading || !onApplyDiscount}
              onChange={(e) => {
                onDiscountInputChange?.(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  onApplyDiscount?.();
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
  );
}
