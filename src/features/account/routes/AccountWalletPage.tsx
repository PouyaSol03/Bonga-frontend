import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useChargeWalletMutation, useWalletQuery } from "../api/account.hooks";
import { getApiErrorMessage } from "../../../shared/api/api";
import { AdCardTomanIcon } from "../../advertisements/components/AdCardIcons";
import { formatPrice, formatBigNumber } from "../../../shared/lib/MoneyHandler";
import { Link } from "react-router";
import { storePaymentReturnTarget } from "../../../shared/utils/payment-return";
import { useToast } from "../../../shared/hooks/useToast";
import {
  AccountPageShell,
  AccountRetryState,
  ChevronLeftIcon,
  PlusIcon,
  WalletPageSkeleton,
  formatMoney,
  normalizeWalletAmount,
} from "../accountPageViews";
import { Typography } from "../../../shared/ui/Typography";
import { Button } from "../../../shared/ui/Button";
import { TextField } from "../../../shared/ui/TextField";

export function AccountWalletPage() {
  const [amount, setAmount] = useState("");
  const { showToast } = useToast();
  const showError = (message: string) => showToast(message, "خطا", "error");
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
      <main className="bg-surface-container-lowest min-h-0 flex-1 overflow-x-hidden overflow-y-auto pb-24">
        {isLoading ? <WalletPageSkeleton /> : null}

        {isError ? (
          <AccountRetryState
            error={error}
            message={getApiErrorMessage(error, "دریافت اطلاعات کیف پول با خطا مواجه شد.")}
            onRetry={() => void refetch()}
          />
        ) : null}

        {!isLoading && !isError ? (
          <section className="px-3 pt-4 text-right">
            <div className="border-primary/8 bg-primary-container flex items-center justify-between rounded-xl border p-4 [direction:rtl]">
              <div>
                <Typography
                  as="p"
                  variant="label"
                  size="small"
                  weight="medium"
                  className="text-on-surface-var m-0 text-xs leading-5 font-medium"
                >
                  اعتبار قابل استفاده:
                </Typography>

                <div className="text-on-primary-container mt-2 flex items-center gap-1">
                  <strong className="text-2xl leading-7 font-bold">
                    {formatMoney(wallet?.credit ?? 0)}
                  </strong>
                  <AdCardTomanIcon className="text-on-primary-container h-6 w-6 shrink-0" />
                </div>
              </div>

              <div className="bg-primary/8 text-on-primary-container grid shrink-0 place-items-center rounded-full p-4">
                <img src="/icons/walletPlus.svg" alt="" />
              </div>
            </div>

            <div className="border-outline-var -mx-3 mt-5 border-t" />

            <div className="text-on-surface mt-5 flex items-center gap-2">
              <PlusIcon className="h-5 w-5" />
              <Typography
                as="h2"
                variant="title"
                size="medium"
                weight="medium"
                className="m-0 text-base leading-6 font-medium"
              >
                افزایش اعتبار
              </Typography>
            </div>

            <TextField
              badge="تومان"
              className="text-sm leading-5 font-normal"
              containerClassName="mt-4"
              inputMode="numeric"
              label="مبلغ اعتبار دلخواه"
              placeholder="مبلغ اعتبار دلخواه"
              value={amount && amount !== "0" ? formatPrice(Number(amount.replace(/,/g, ""))) : ""}
              onChange={(event) => {
                setAmount(normalizeWalletAmount(event.target.value));
              }}
            />
            <AnimatePresence mode="wait">
              {Number(amount) > 0 && (
                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  initial={{ opacity: 0, y: -4 }}
                  key={amount}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                >
                  <Typography
                    as="p"
                    variant="body"
                    size="small"
                    weight="regular"
                    className="text-outline px-4 pt-1 text-xs"
                  >
                    {formatBigNumber(Number(amount))} تومان
                  </Typography>
                </motion.div>
              )}
            </AnimatePresence>

            <Typography
              as="h3"
              variant="title"
              size="small"
              weight="medium"
              className="text-on-surface m-0 mt-6 text-sm leading-5 font-medium"
            >
              مبالغ پیشنهادی
            </Typography>

            <div className="mt-3 grid grid-cols-3 gap-3 [direction:rtl]">
              {suggestedAmounts.map((amountOption) => {
                const isActive = amount === amountOption.value;

                return (
                  <motion.div
                    key={amountOption.value}
                    transition={{ duration: 0.1 }}
                    whileTap={{ scale: 0.94 }}
                  >
                    <Button
                      className={`w-full transition-all duration-200 ${isActive ? "text-primary" : "text-on-surface"}`}
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
                  </motion.div>
                );
              })}
            </div>

            <Link
              className="border-outline-var bg-surface-container-lowest text-on-surface relative mt-8 flex w-full items-center justify-center gap-2 rounded-xl border p-4 px-4 text-sm leading-5 font-medium no-underline"
              to="/account/wallet/history"
            >
              <img src="/icons/walletHistory.svg" alt="" />
              <Typography
                as="span"
                variant="body"
                size="large"
                weight="regular"
                className="flex-1 text-base"
              >
                تاریخچه پرداخت
              </Typography>
              <ChevronLeftIcon className="text-on-surface-var h-4 w-4" />
            </Link>
          </section>
        ) : null}
      </main>

      <div className="bg-surface-container-lowest absolute inset-x-0 bottom-0 px-3 pt-3 pb-[max(0.5rem,env(safe-area-inset-bottom,0px))] shadow-[0_-8px_24px_rgba(26,26,26,0.08)]">
        <Button
          disabled={!canCharge || chargeWalletMutation.isPending}
          fullWidth
          loading={chargeWalletMutation.isPending}
          onClick={() => {
            if (!canCharge) return;

            chargeWalletMutation.mutate(
              { price: numericAmount },
              {
                onError: (chargeRequestError) => {
                  showError(
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
