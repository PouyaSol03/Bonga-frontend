import { Link } from "react-router";
import { Typography } from "../../../shared/ui/Typography";
import { RequestErrorState } from "../../../shared/components/ErrorState";
import { getApiErrorMessage } from "../../../shared/api/api";
import PricingCard from "../components/addWallet/PricingCard";
import { PackagePaymentPage } from "../../packages/components/PackagePaymentPage";
import type { PackageItem } from "../../packages/api/package.service";
import { mapBundlePlan, mapPanelPlan } from "./paymentPlanHelpers";
import { EmptyPackagesState, PricingCardsSkeleton } from "./components/PaymentFeedbackComponents";
import { useDashboardPaymentFlow } from "./useDashboardPaymentFlow";

export function DashboardPaymentDesktopPage({
  error,
  isError,
  isLoading,
  packages,
  refetch,
}: {
  error: unknown;
  isError: boolean;
  isLoading: boolean;
  packages: PackageItem[];
  refetch: () => void;
}) {
  const flow = useDashboardPaymentFlow({
    packages,
    returnTo: "/account/dashboard/payments",
  });

  const panelCreditPlans = packages
    .filter((plan) => plan.kind === "panel_subscription")
    .map(mapPanelPlan);
  const packagePlans = packages.filter((plan) => plan.kind === "credit_bundle").map(mapBundlePlan);

  if (flow.selectedPackage) {
    return (
      <div className="mx-auto max-w-xl p-4 md:p-6" dir="rtl">
        <PackagePaymentPage
          isPending={flow.packagePaymentMutation.isPending}
          onBack={flow.handlePaymentBack}
          onSubmit={flow.handleSubmitPayment}
          packageItem={flow.selectedPackage}
          walletCredit={flow.walletQuery.data?.credit}
          walletError={
            flow.walletQuery.isError
              ? getApiErrorMessage(flow.walletQuery.error, "دریافت موجودی کیف پول با خطا مواجه شد.")
              : null
          }
          walletLoading={flow.walletQuery.isLoading}
        />
      </div>
    );
  }

  return (
    <div dir="rtl" className="bg-surface-container-lowest rounded-xl p-6">
      <div className="border-outline-var mb-6 flex items-center justify-between border-b border-dashed pb-5">
        <div className="flex items-center gap-2">
          <Typography
            as="span"
            variant="body"
            size="medium"
            weight="regular"
            className="bg-primary-container grid h-9 w-9 place-items-center rounded-full"
          >
            <img className="h-5 w-5" src="/icons/walletPlus.svg" alt="" />
          </Typography>

          <Typography
            as="h1"
            variant="display"
            size="large"
            className="text-on-surface text-[22px] font-medium"
          >
            افزایش اعتبار
          </Typography>
        </div>

        <Link
          className="text-primary inline-flex h-12 items-center px-3 text-sm leading-5 font-medium no-underline"
          to="/account/credit/history"
        >
          تاریخچه پرداخت
        </Link>
      </div>

      {isError ? (
        <RequestErrorState error={error} className="min-h-[420px]" onRetry={() => void refetch()} />
      ) : null}

      {!isError ? (
        <>
          <section>
            <Typography
              as="h2"
              variant="title"
              size="large"
              weight="medium"
              className="text-on-surface mb-4 text-[22px] font-medium"
            >
              اعتبار پنل
            </Typography>

            {isLoading ? <PricingCardsSkeleton /> : null}

            {!isLoading && panelCreditPlans.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {panelCreditPlans.map((plan) => (
                  <PricingCard
                    key={plan.id}
                    title={plan.title}
                    price={plan.price}
                    discount={plan.discount}
                    priceAfterDiscount={plan.priceAfterDiscount}
                    onPay={() => flow.handlePay(plan.id)}
                  />
                ))}
              </div>
            ) : null}

            {!isLoading && panelCreditPlans.length === 0 ? <EmptyPackagesState /> : null}
          </section>

          <section className="mt-10">
            <Typography
              as="h2"
              variant="title"
              size="medium"
              weight="semibold"
              className="text-on-surface mb-4 text-right text-base font-semibold"
            >
              بسته‌ها
            </Typography>

            {isLoading ? <PricingCardsSkeleton count={2} /> : null}

            {!isLoading && packagePlans.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {packagePlans.map((plan) => (
                  <PricingCard
                    key={plan.id}
                    title={plan.title}
                    price={plan.price}
                    discount={plan.discount}
                    priceAfterDiscount={plan.priceAfterDiscount}
                    items={plan.items}
                    onPay={() => flow.handlePay(plan.id)}
                  />
                ))}
              </div>
            ) : null}

            {!isLoading && packagePlans.length === 0 ? <EmptyPackagesState /> : null}
          </section>
        </>
      ) : null}
    </div>
  );
}
