import { useEffect, useState } from "react";
import { useToast } from "../../../shared/hooks/useToast";
import { getApiErrorMessage } from "../../../shared/api/api";
import { storePaymentReturnTarget } from "../../../shared/utils/payment-return";
import { usePackagePaymentMutation } from "../../packages/api/package.hooks";
import { useWalletQuery } from "../../account/api/account.hooks";
import type { PackageItem, PackagePaymentType } from "../../packages/api/package.service";

type UseDashboardPaymentFlowProps = {
  onSuccessMessage?: string;
  packages: PackageItem[];
  returnTo?: string;
};

export function useDashboardPaymentFlow({
  onSuccessMessage,
  packages,
  returnTo,
}: UseDashboardPaymentFlowProps) {
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);
  const { showToast } = useToast();
  const walletQuery = useWalletQuery();
  const packagePaymentMutation = usePackagePaymentMutation();

  useEffect(() => {
    function handlePopState(e: PopStateEvent) {
      if (!e.state?.paymentPackageId) {
        setSelectedPackageId(null);
      } else {
        setSelectedPackageId(String(e.state.paymentPackageId));
      }
    }

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const selectedPackage = selectedPackageId
    ? (packages.find((p) => String(p.id) === String(selectedPackageId)) ?? null)
    : null;

  function handlePay(packageId: string | number) {
    if (packagePaymentMutation.isPending) return;
    const strId = String(packageId);
    window.history.pushState({ ...window.history.state, paymentPackageId: strId }, "");
    setSelectedPackageId(strId);
  }

  function handlePaymentBack() {
    if (packagePaymentMutation.isPending) return;
    if (window.history.state?.paymentPackageId) {
      window.history.back();
    } else {
      setSelectedPackageId(null);
    }
  }

  function handleSubmitPayment(paymentType: PackagePaymentType, discountCode?: string) {
    if (!selectedPackage || packagePaymentMutation.isPending) return;

    packagePaymentMutation.mutate(
      { discountCode, packageId: String(selectedPackage.id), paymentType },
      {
        onError: (requestError) => {
          showToast(
            getApiErrorMessage(
              requestError,
              paymentType === 1
                ? "پرداخت بسته از کیف پول با خطا مواجه شد."
                : "اتصال به درگاه پرداخت با خطا مواجه شد.",
            ),
            "خطا",
            "error",
          );
        },
        onSuccess: ({ paymentUrl }) => {
          if (paymentUrl) {
            storePaymentReturnTarget({
              kind: "package",
              label: "بازگشت به افزایش اعتبار",
              path: returnTo || "/account/dashboard/payments",
            });
            window.location.assign(paymentUrl);
            return;
          }

          if (window.history.state?.paymentPackageId) {
            window.history.back();
          } else {
            setSelectedPackageId(null);
          }
          if (onSuccessMessage) {
            showToast(onSuccessMessage);
          }
        },
      },
    );
  }

  return {
    handlePay,
    handlePaymentBack,
    handleSubmitPayment,
    packagePaymentMutation,
    selectedPackage,
    selectedPackageId,
    setSelectedPackageId,
    walletQuery,
  };
}
