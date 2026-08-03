import { useWalletPaymentsQuery } from "../../../core/hooks/account.hooks";
import { getApiErrorMessage } from "../../../core/api/api";
import { AccountLoadingState, AccountPageShell, AccountRetryState, PaymentHistoryCard } from "../accountPageViews";
import { Typography } from "../../../shared/ui/Typography";

export function AccountWalletHistoryPage() {
  const { data: wallet, error, isError, isLoading, refetch } = useWalletPaymentsQuery();
  const payments = wallet?.payments ?? [];
  const isEmpty = !isLoading && !isError && payments.length === 0;

  return (
    <AccountPageShell title="تاریخچه پرداخت کیف پول">
      <main
        className={`min-h-0 flex-1 flex flex-col gap-2 overflow-y-auto overflow-x-hidden ${
          isEmpty ? "bg-white" : "bg-[#F0F0F0]"
        }`}
      >
        {isLoading ? <AccountLoadingState text="در حال دریافت تاریخچه پرداخت..." /> : null}

        {isError ? (
          <AccountRetryState
            error={error}
            message={getApiErrorMessage(error, "دریافت تاریخچه پرداخت با خطا مواجه شد.")}
            onRetry={() => void refetch()}
          />
        ) : null}

        {!isLoading && !isError && payments.map((payment, index) => (
          <PaymentHistoryCard
            key={String(payment.id ?? index)}
            payment={payment}
          />
        ))}

        {isEmpty ? <WalletHistoryEmptyState /> : null}
      </main>
    </AccountPageShell>
  );
}

function WalletHistoryEmptyState() {
  return (
    <section className="mx-auto flex min-h-0 w-full flex-1 flex-col items-center justify-center bg-white px-6 text-center">
      <img
        alt=""
        aria-hidden="true"
        className="h-[72px] w-[72px] object-contain"
        src="/vectors/NoPaymentHistory.svg"
      />

      <Typography
        as="h2"
        variant="title"
        size="medium"
        weight="semibold"
        className="m-0 mt-4 text-base font-semibold leading-6 text-[#1a1a1a]"
      >
        هیچ تراکنشی برای نمایش وجود ندارد!
      </Typography>

      <Typography
        as="p"
        variant="body"
        size="small"
        weight="regular"
        className="m-0 mt-2 max-w-[290px] text-xs font-normal leading-5 text-[#4d4d4d]"
      >
        پس از اولین پرداخت، سوابق تراکنش‌های شما در این بخش نمایش داده خواهد شد.
      </Typography>
    </section>
  );
}
