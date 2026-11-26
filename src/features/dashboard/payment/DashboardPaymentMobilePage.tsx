import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import { getActiveAuthRole, getStoredAuthSession } from "../../../shared/auth/auth-storage";
import {
  INDEPENDENT_CONSULTANT,
  REAL_ESTATE_CONSULTANT,
} from "../../../shared/constants/roles.constants";
import { PageFrame } from "../../../shared/layout/PageFrame";
import { TopBar } from "../../../shared/components/TopBar";
import { RequestErrorState } from "../../../shared/components/ErrorState";
import { getApiErrorMessage } from "../../../shared/api/api";
import { PackagePaymentPage } from "../../packages/components/PackagePaymentPage";
import type { PackageItem } from "../../packages/api/package.service";
import type { MobilePaymentTab } from "./types";
import { mapMobilePackagePlan, mapMobilePanelPlan } from "./paymentPlanHelpers";
import { MobileCreditTabs } from "./components/MobileCreditTabs";
import { MobilePlanCard, MobilePlansSkeleton } from "./components/MobilePlanCard";
import { EmptyPackagesState } from "./components/PaymentFeedbackComponents";
import { useDashboardPaymentFlow } from "./useDashboardPaymentFlow";

export function DashboardPaymentMobilePage({
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
  const navigate = useNavigate();
  const returnTo =
    window.history.state?.returnTo ||
    (typeof window !== "undefined" ? sessionStorage.getItem("bonga:paymentReturnTo") : null) ||
    undefined;
  const session = getStoredAuthSession();
  const activeRole = getActiveAuthRole(session);
  const isConsultant =
    activeRole === REAL_ESTATE_CONSULTANT || activeRole === INDEPENDENT_CONSULTANT;

  const initialPaymentTab =
    isConsultant || window.history.state?.initialPaymentTab === "packages" ? "packages" : "panel";
  const [activeTab, setActiveTab] = useState<MobilePaymentTab>(initialPaymentTab);
  const effectiveTab = isConsultant ? "packages" : activeTab;

  const flow = useDashboardPaymentFlow({
    onSuccessMessage: "بسته با موفقیت خریداری و فعال شد.",
    packages,
    returnTo,
  });

  const showGift = effectiveTab === "panel";

  const shownPlans = useMemo(() => {
    if (effectiveTab === "panel" && !isConsultant) {
      return packages
        .filter((plan) => plan.kind === "panel_subscription")
        .map((plan, index) => mapMobilePanelPlan(plan, index, true));
    }

    return packages
      .filter((plan) => plan.kind === "credit_bundle")
      .map((plan, index) => mapMobilePackagePlan(plan, index));
  }, [effectiveTab, isConsultant, packages]);

  if (flow.selectedPackage) {
    return (
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
    );
  }

  return (
    <PageFrame
      className="bg-surface-container-lowest text-on-surface flex min-h-0 flex-col overflow-hidden [direction:rtl]"
      variant="flush"
    >
      <TopBar
        backTo={returnTo ?? "/account/dashboard"}
        onBack={() => {
          if (returnTo) {
            try {
              sessionStorage.removeItem("bonga:paymentReturnTo");
            } catch {
              // ignore
            }
            navigate(returnTo, { replace: true });
            return;
          }

          if (window.history.state?.idx > 0) {
            navigate(-1);
            return;
          }

          navigate("/account/dashboard", { replace: true });
        }}
        startSlot={
          <Link
            className="text-primary inline-flex h-12 items-center px-3 text-sm leading-5 font-medium no-underline"
            to="/account/credit/history"
          >
            تاریخچه پرداخت
          </Link>
        }
        title="افزایش اعتبار"
      />
      {!isConsultant ? (
        <MobileCreditTabs activeTab={activeTab} onChange={setActiveTab} />
      ) : null}

      <main
        className={`bg-surface-container-lowest min-h-0 flex-1 overflow-x-hidden overflow-y-auto px-4 pb-4 ${
          isConsultant ? "pt-4" : ""
        }`}
      >
        {isError ? (
          <RequestErrorState error={error} className="min-h-[420px]" onRetry={() => void refetch()} />
        ) : null}

        {!isError && isLoading ? <MobilePlansSkeleton showGift={showGift} /> : null}

        {!isError && !isLoading && shownPlans.length > 0 ? (
          <div className="space-y-4">
            {shownPlans.map((plan) => (
              <MobilePlanCard
                isPackage={activeTab === "packages"}
                key={plan.id}
                onPay={() => flow.handlePay(plan.id)}
                paymentPending={flow.packagePaymentMutation.isPending && flow.selectedPackageId === plan.id}
                plan={plan}
                showGift={showGift}
              />
            ))}
          </div>
        ) : null}

        {!isError && !isLoading && shownPlans.length === 0 ? (
          <EmptyPackagesState className="mt-2" />
        ) : null}
      </main>
    </PageFrame>
  );
}
