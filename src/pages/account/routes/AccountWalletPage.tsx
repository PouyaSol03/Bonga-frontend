import { useState } from "react";
import { useChargeWalletMutation, useWalletQuery } from "../../../hooks/account.hooks";
import { getApiErrorMessage } from "../../../api/api";
import { AdCardTomanIcon } from "../../../components/AdCardIcons";
import { formatPrice, formatBigNumber } from "../../../lib/MoneyHandler";
import { RouteLink } from "../../../routes/RouteLink";
import { storePaymentReturnTarget } from "../../../utils/payment-return";
import { Snackbar } from "../../../components/Snackbar";
import { AccountLoadingState, AccountPageShell, AccountRetryState, ChevronLeftIcon, PlusIcon, formatMoney, normalizeWalletAmount } from "../accountPageViews";

export function AccountWalletPage() {
  const [amount, setAmount] = useState("");
  const [chargeError, setChargeError] = useState<string | null>(null);
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
            <div className="flex items-center justify-between rounded-xl border border-[#d6e1ff] bg-[#0048c414] p-4 [direction:rtl]">
              <div>
                <p className="m-0 text-xs font-medium leading-5 text-[#4D4D4D]">
                  اعتبار قابل استفاده:
                </p>

                <div className="mt-2 flex items-end gap-1 text-[#0048c4]">
                  <strong className="text-2xl font-bold leading-7">
                    {formatMoney(wallet?.credit ?? 0)}
                  </strong>
                  <AdCardTomanIcon className="h-5 w-5 shrink-0 text-[#0048c4]" />
                </div>
              </div>

              <div className="grid p-4 shrink-0 place-items-center rounded-full bg-[#dbe6ff] text-[#002099]">
                <img src="/icons/walletPlus.svg" alt="" />
              </div>
            </div>

            <div className="mt-5 pt-5 flex items-center gap-2 text-[#1a1a1a]">
              <PlusIcon className="h-5 w-5" />
              <h2 className="m-0 text-base font-medium leading-6">
                افزایش اعتبار
              </h2>
            </div>

            <label className="mt-4 flex py-3 items-center rounded-xl border border-[#cccccc] bg-white px-4 [direction:ltr]">
              <span className="text-xs font-normal leading-4 text-[#808080]">
                تومان
              </span>

              <input
                className="min-w-0 flex-1 border-0 bg-transparent text-right text-sm font-normal leading-5 text-[#1a1a1a] outline-none placeholder:text-[#a6a6a6] placeholder:text-sm [direction:rtl]"
                inputMode="numeric"
                placeholder="مبلغ اعتبار دلخواه"
                value={amount && amount !== "0" ? formatPrice(Number(amount.replace(/,/g, ""))) : ""}
                onChange={(event) => {
                  setAmount(normalizeWalletAmount(event.target.value));
                }}
              />
            </label>
            {Number(amount) > 0 && (
              <p className="px-4 pt-1 text-xs text-[#808080]">
                {formatBigNumber(Number(amount))} تومان
              </p>
            )}

            <h3 className="m-0 mt-6 text-sm font-medium leading-5 text-[#1a1a1a]">
              مبالغ پیشنهادی
            </h3>

            <div className="mt-3 grid grid-cols-3 gap-3 [direction:rtl]">
              {suggestedAmounts.map((amountOption) => {
                const isActive = amount === amountOption.value;

                return (
                  <button
                    className={`rounded-xl border py-1.5 !text-xs !font-medium leading-4 ${isActive
                      ? "border-[#0048c4] bg-[#0048c414] text-[#0048c4]"
                      : "border-[#cccccc] bg-white text-[#1a1a1a]"
                      }`}
                    key={amountOption.value}
                    onClick={() => setAmount(amountOption.value)}
                    type="button"
                  >
                    {amountOption.label}
                  </button>
                );
              })}
            </div>

            <RouteLink
              className="relative mt-8 flex gap-2 p-4 w-full items-center justify-center rounded-xl border border-[#cccccc] bg-white px-4 text-sm font-medium leading-5 text-[#1a1a1a] no-underline"
              to="/account/wallet/history"
            >
              <img src="/icons/walletHistory.svg" alt="" />
              <span className="text-base flex-1">تاریخچه پرداخت</span>
              <ChevronLeftIcon className="h-4 w-4 text-[#4d4d4d]" />
            </RouteLink>
          </section>
        ) : null}
      </main>

      <div className="absolute inset-x-0 bottom-0 bg-white px-3 pb-[max(0.5rem,env(safe-area-inset-bottom,0px))] pt-3 shadow-[0_-8px_24px_rgba(26,26,26,0.08)]">
        <button
          className="h-10 w-full rounded-lg bg-[#0048c4] text-sm font-medium leading-5 text-white disabled:opacity-50"
          disabled={!canCharge || chargeWalletMutation.isPending}
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
          type="button"
        >
          {chargeWalletMutation.isPending ? "در حال اتصال به درگاه..." : "شارژ کیف پول"}
        </button>
      </div>

      {chargeError ? (
        <Snackbar
          className="bottom-20"
          message={chargeError}
          onDismiss={() => setChargeError(null)}
          title="خطا در پرداخت"
          variant="error"
        />
      ) : null}
    </AccountPageShell>
  );
}
