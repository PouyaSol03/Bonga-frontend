import { useNavigate } from "react-router";
import { getApiErrorCode, getApiErrorMessage } from "../../../../shared/api/api";
import { useToast } from "../../../../shared/hooks/useToast";
import { storePaymentReturnTarget } from "../../../../shared/utils/payment-return";
import type {
  AdvertisementCheckoutPaymentMethodCode,
  AgencyAdvertisementCheckoutPaymentMethodCode,
  SubmitAdvertisementCheckoutResult,
} from "../../../advertisements/api/advertisement.service";
import { type ValidateDiscountCodeResult } from "../../../crm/api/crm-discount.service";
import { clearAgencyAllocationCheckout, clearNewAdCheckout } from ".././adManagementData";
import { checkoutItems } from "./checkoutUpgrades";
import type { CheckoutContext } from "./useCheckoutContext";
import type { CheckoutNavigation } from "./useCheckoutNavigation";
import type { CheckoutResources } from "./useCheckoutResources";
export function useCheckoutSubmission(
  advertiseId: string,
  {
    checkoutPending,
    personalCheckoutMutation,
    agencyCheckoutMutation,
    consultantCheckoutMutation,
  }: CheckoutResources,
  {
    routeState,
    adsHomePath,
    isAgencyCheckout,
    isConsultantCheckout,
    isAgencyAllocationCheckout,
    isNewAdCheckout,
  }: CheckoutContext,
  { publishState, stateAdPath }: CheckoutNavigation,
  targetConsultantId: unknown,
  appliedDiscount: ValidateDiscountCodeResult | null,
) {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const showError = (message: string) => showToast(message, "خطا", "error");
  function finishCheckout(
    paymentMethod:
      AdvertisementCheckoutPaymentMethodCode | AgencyAdvertisementCheckoutPaymentMethodCode,
    extraItems: string[] = [],
  ) {
    if (checkoutPending) return;

    const mutationOptions = {
      onError: (error: unknown) => {
        if (getApiErrorCode(error) === "AD_WAITING_FOR_AGENCY") {
          navigate(stateAdPath, {
            replace: true,
            state: {
              returnTo: adsHomePath,
              status: "wait_for_agency",
              tab: "status",
            },
          });
          return;
        }

        showError(getApiErrorMessage(error, "پرداخت و انتشار آگهی با خطا مواجه شد."));
      },
      onSuccess: ({ paymentUrl }: SubmitAdvertisementCheckoutResult) => {
        if (isAgencyAllocationCheckout) {
          clearAgencyAllocationCheckout(advertiseId);
        }
        if (isNewAdCheckout) {
          clearNewAdCheckout(advertiseId);
        }

        if (paymentMethod === "by_consultant") {
          navigate(adsHomePath, { replace: true, state: { tab: "status" } });
          return;
        }

        if (paymentMethod === "gateway") {
          if (!paymentUrl) {
            showError("آدرس درگاه پرداخت از سرور دریافت نشد.");
            return;
          }

          storePaymentReturnTarget({
            label: "بازگشت به وضعیت آگهی",
            path: stateAdPath,
          });
          window.location.assign(paymentUrl);
          return;
        }

        navigate(stateAdPath, { replace: true, state: publishState });
      },
    };

    if (isAgencyCheckout) {
      agencyCheckoutMutation.mutate(
        {
          advertiseId,
          consultantId:
            paymentMethod === "by_consultant"
              ? String(targetConsultantId || routeState.consultantId || "")
              : undefined,
          discount_code: appliedDiscount?.code,
          items: Array.from(new Set([...checkoutItems, ...extraItems])),
          paymentMethod: paymentMethod as AgencyAdvertisementCheckoutPaymentMethodCode,
        },
        mutationOptions,
      );
      return;
    }

    if (isConsultantCheckout) {
      consultantCheckoutMutation.mutate(
        {
          advertiseId,
          discount_code: appliedDiscount?.code,
          items: Array.from(new Set([...checkoutItems, ...extraItems])),
          paymentMethod: paymentMethod as AdvertisementCheckoutPaymentMethodCode,
        },
        mutationOptions,
      );
      return;
    }

    personalCheckoutMutation.mutate(
      {
        advertiseId,
        discount_code: appliedDiscount?.code,
        items: Array.from(new Set([...checkoutItems, ...extraItems])),
        paymentMethod: paymentMethod as AdvertisementCheckoutPaymentMethodCode,
      },
      mutationOptions,
    );
  }
  return finishCheckout;
}
