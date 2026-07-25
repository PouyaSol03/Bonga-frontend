import { useWalletPaymentsQuery } from "../../../hooks/account.hooks";
import { getApiErrorMessage } from "../../../api/api";
import { AccountLoadingState, AccountPageShell, AccountRetryState, EmptyMessage, PaymentHistoryCard } from "../accountPageViews";

export function AccountWalletHistoryPage() {
  const { data: wallet, error, isError, isLoading, refetch } = useWalletPaymentsQuery();
  const payments = wallet?.payments ?? [];
  const showEmptyState = !isLoading && !isError && payments.length === 0;

  return (
    <AccountPageShell title="تاریخچه پرداخت کیف پول">
      <main
        className={`min-h-0 flex flex-1 flex-col overflow-x-hidden ${
          showEmptyState
            ? "overflow-hidden bg-white"
            : "gap-2 overflow-y-auto bg-[#F0F0F0]"
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

        {showEmptyState ? (
          <EmptyMessage text="تاریخچه پرداختی وجود ندارد" />
        ) : null}
      </main>
    </AccountPageShell>
  );
}
