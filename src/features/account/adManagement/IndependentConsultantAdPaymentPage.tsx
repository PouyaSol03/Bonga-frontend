import { adManagementPaths } from "./adManagementData";
import { AdvertisementCheckoutFlow } from "./checkout/AdvertisementCheckoutFlow";
import { readCheckoutAdvertiseId } from "./checkout/checkoutLookup";
import { CheckoutStatusPage } from "./checkout/CheckoutStatusPage";
export { ApiPaymentCheckoutView } from "./checkout/ApiPaymentCheckoutView";
export type { PaymentMethod } from "./checkout/checkoutTypes";

export function IndependentConsultantAdPaymentPage() {
  const advertiseId = readCheckoutAdvertiseId();
  const fallbackBackTo = adManagementPaths.root;

  if (advertiseId) {
    return <AdvertisementCheckoutFlow advertiseId={advertiseId} />;
  }

  return (
    <CheckoutStatusPage
      backTo={fallbackBackTo}
      message="شناسه آگهی برای دریافت تعرفه از سرور موجود نیست."
      title="هزینه ثبت آگهی"
    />
  );
}
