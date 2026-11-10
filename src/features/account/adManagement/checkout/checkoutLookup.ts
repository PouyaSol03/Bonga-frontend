import type {
  AdvertisementCheckout,
  AdvertisementCheckoutItem,
} from "../../../advertisements/api/advertisement.service";
import { toSafeNumber } from "./checkoutNumbers";
export function readCheckoutAdvertiseId() {
  const match = window.location.pathname.match(
    /^\/(?:account\/)?ad-management\/payment\/([^/]+)\/?$/,
  );

  return match?.[1] ? decodeURIComponent(match[1]) : null;
}

export function getCheckoutItem(checkout: AdvertisementCheckout, product: string) {
  return checkout.items.find((item) => item.product === product);
}

export function getCheckoutMethod(checkout: AdvertisementCheckout, method: string) {
  return checkout.payment_methods.find((item) => item.method === method);
}

export function getFreeQuotaRemaining(
  checkout: AdvertisementCheckout,
  publishItem: AdvertisementCheckoutItem | undefined,
) {
  const freeQuotaMethod = getCheckoutMethod(checkout, "free_quota");

  return Math.max(
    toSafeNumber(freeQuotaMethod?.remaining),
    toSafeNumber(publishItem?.free_quota?.remaining),
    0,
  );
}
