import { useState } from "react";
import { useChargeWalletMutation, useWalletQuery } from "../../../core/hooks/account.hooks";
import { getApiErrorMessage } from "../../../core/api/api";
import { AdCardTomanIcon } from "../../../shared/components/AdCardIcons";
import { formatPrice, formatBigNumber } from "../../../shared/lib/MoneyHandler";
import { RouteLink } from "../../../app/router/RouteLink";
import { storePaymentReturnTarget } from "../../../shared/utils/payment-return";
import { AccountLoadingState, AccountPageShell, AccountRetryState, ChevronLeftIcon, PlusIcon, formatMoney, normalizeWalletAmount } from "../accountPageViews";
import { Typography } from "../../../shared/ui/Typography";
import { Button } from "../../../shared/ui/Button";
import { TextField } from "../../../shared/ui/TextField";

export function AccountWalletPage() {
  const [amount, setAmount] = useState("");
  const [, setChargeError] = useState<string | null>(null);
  const chargeWalletMutation = useChargeWalletMutation();
  const { data: wallet, error, isError, isLoading, refetch } = useWalletQuery();
  const numericAmount = Number(amount);
  const canCharge = Number.isSafeInteger(numericAmount) && numericAmount > 0;

  const suggestedAmounts = [
    { label: "۱۰۰ هزار تومان", value: "100000" },
    { label: "۲۰۰ هزار تومان", value: "200000" },
    { label: "۳۰۰ هزار تومان", value: "300000" },
    { label: "۵۰۰ هزار تومان", value: "500000" },
    { label: "۱ میلیون تومان", value: "1000000" },
    { label: "۲ میلیون تومان", value: "2000000" },
  ];

  return (
    <AccountPageShell title="کیف پول">
      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-white pb-24">
        {isLoading ? <AccountLoadingState text="در حال دریافت اعتبار..." /> : null}

        {isError ? (
          <AccountRetryState
            error={error}
            message={getApiErrorMessage(error, "دریافت اطلاعات کیف پول با خطا مواجه شد.")}
            onRetry={() => void refetch()}
          />
        ) : null}

        {!isLoading && !isError ? (
          <section className="px-3 pt-4 text-right">
            <div className="flex items-center justify-between rounded-xl border border-primary/8 bg-primary-container p-4 [direction:rtl]">
              <div>
                <Typography as="p" variant="label" size="small" weight="medium" className="m-0 text-xs font-medium leading-5 text-on-surface-var">
                  اعتبار قابل استفاده:
                </Typography>

                <div className="mt-2 flex items-center gap-1 text-on-primary-container">
                  <strong className="text-2xl font-bold leading-7">
                    {formatMoney(wallet?.credit ?? 0)}
                  </strong>
                  <AdCardTomanIcon className="h-6 w-6 shrink-0 text-on-primary-container" />
                </div>
              </div>

              <div className="grid p-4 shrink-0 place-items-center rounded-full bg-primary/8 text-[#002099]">
                <img src="/icons/walletPlus.svg" alt="" />
              </div>
            </div>

            <div className="-mx-3 mt-5 border-t border-[#f0f0f0]" />

            <div className="mt-5 flex items-center gap-2 text-[#1a1a1a]">
              <PlusIcon className="h-5 w-5" />
              <Typography as="h2" variant="title" size="medium" weight="medium" className="m-0 text-base font-medium leading-6">
                افزایش اعتبار
              </Typography>
            </div>

            <TextField
              badge="تومان"
              className="text-sm font-normal leading-5"
              containerClassName="mt-4"
              inputMode="numeric"
              label="مبلغ اعتبار دلخواه"
              placeholder="مبلغ اعتبار دلخواه"
              value={amount && amount !== "0" ? formatPrice(Number(amount.replace(/,/g, ""))) : ""}
              onChange={(event) => {
                setAmount(normalizeWalletAmount(event.target.value));
              }}
            />
            {Number(amount) > 0 && (
              <Typography as="p" variant="body" size="small" weight="regular" className="px-4 pt-1 text-xs text-[#808080]">
                {formatBigNumber(Number(amount))} تومان
              </Typography>
            )}

            <Typography as="h3" variant="title" size="small" weight="medium" className="m-0 mt-6 text-sm font-medium leading-5 text-[#1a1a1a]">
              مبالغ پیشنهادی
            </Typography>

            <div className="mt-3 grid grid-cols-3 gap-3 [direction:rtl]">
              {suggestedAmounts.map((amountOption) => {
                const isActive = amount === amountOption.value;

                return (
                  <Button
                    className={isActive ? "text-primary" : "text-on-surface"}
                    key={amountOption.value}
                    onClick={() => setAmount(amountOption.value)}
                    radius="small"
                    size="small"
                    type="button"
                    variant={isActive ? "secondary" : "neutral-outline"}
                  >
                    <Typography variant="label" size="small" weight="medium">
                      {amountOption.label}
                    </Typography>
                  </Button>
                );
              })}
            </div>

            <RouteLink
              className="relative mt-8 flex gap-2 p-4 w-full items-center justify-center rounded-xl border border-[#cccccc] bg-white px-4 text-sm font-medium leading-5 text-[#1a1a1a] no-underline"
              to="/account/wallet/history"
            >
              <img src="/icons/walletHistory.svg" alt="" />
              <Typography as="span" variant="body" size="large" weight="regular" className="text-base flex-1">تاریخچه پرداخت</Typography>
              <ChevronLeftIcon className="h-4 w-4 text-[#4d4d4d]" />
            </RouteLink>
          </section>
        ) : null}
      </main>

      <div className="absolute inset-x-0 bottom-0 bg-white px-3 pb-[max(0.5rem,env(safe-area-inset-bottom,0px))] pt-3 shadow-[0_-8px_24px_rgba(26,26,26,0.08)]">
        <Button
          disabled={!canCharge || chargeWalletMutation.isPending}
          fullWidth
          loading={chargeWalletMutation.isPending}
          onClick={() => {
            if (!canCharge) return;

            setChargeError(null);
            chargeWalletMutation.mutate(
              { price: numericAmount },
              {
                onError: (chargeRequestError) => {
                  setChargeError(
                    getApiErrorMessage(
                      chargeRequestError,
                      "اتصال به درگاه پرداخت با خطا مواجه شد.",
                    ),
                  );
                },
                onSuccess: ({ paymentUrl }) => {
                  storePaymentReturnTarget({
                    label: "بازگشت به کیف پول",
                    path: "/account/wallet",
                  });
                  window.location.assign(paymentUrl);
                },
              },
            );
          }}
          radius="small"
          size="x-medium"
          type="button"
          variant="primary"
        >
          {chargeWalletMutation.isPending ? "در حال اتصال به درگاه..." : "شارژ کیف پول"}
        </Button>
      </div>

    </AccountPageShell>
  );
}
