import {
  getV2Checkout,
  submitV2Checkout,
} from "../v2/advertisement-v2-lifecycle.service";
import { type AdvertisementCheckoutResponse } from "./checkout-types";
import { ApiError, getActiveV2Role, apiV2 } from "../../../../shared/api/api";
import {
  unwrapAdvertisementCheckoutResponse,
  findCheckoutPaymentUrl,
} from "./checkout-response";
import {
  type SubmitAdvertisementCheckoutPayload,
  type SubmitAdvertisementCheckoutResult,
} from "./checkout-payloads";

export async function getAdvertisementCheckout(advertiseId: string) {
  const response = (await getV2Checkout(
    advertiseId,
  )) as AdvertisementCheckoutResponse;

  if (response && typeof response === "object" && !Array.isArray(response)) {
    const record = response as Record<string, unknown>;
    if (record.status === false) {
      throw new ApiError(
        400,
        typeof record.message === "string" && record.message.trim()
          ? record.message
          : "دریافت اطلاعات پرداخت آگهی با خطا مواجه شد.",
        undefined,
        { code: typeof record.code === "string" ? record.code : undefined },
      );
    }
  }

  return unwrapAdvertisementCheckoutResponse(response);
}

export async function getAgencyAdvertisementCheckout(advertiseId: string) {
  const context =
    getActiveV2Role() === "agency-consultant" ? "agency-consultant" : "agency";
  const response = (await apiV2
    .get(`${context}/advertise/${encodeURIComponent(advertiseId)}/checkout`)
    .json()) as AdvertisementCheckoutResponse;

  if (response && typeof response === "object" && !Array.isArray(response)) {
    const record = response as Record<string, unknown>;
    if (record.status === false) {
      throw new ApiError(
        400,
        typeof record.message === "string" && record.message.trim()
          ? record.message
          : "دریافت اطلاعات پرداخت آگهی با خطا مواجه شد.",
        undefined,
        { code: typeof record.code === "string" ? record.code : undefined },
      );
    }
  }

  return unwrapAdvertisementCheckoutResponse(response);
}

export async function getConsultantAdvertisementCheckout(advertiseId: string) {
  return getAdvertisementCheckout(advertiseId);
}

export async function submitAdvertisementCheckout({
  advertiseId,
  discount_code,
  items,
  paymentMethod,
}: SubmitAdvertisementCheckoutPayload): Promise<SubmitAdvertisementCheckoutResult> {
  const response = await submitV2Checkout(advertiseId, {
    ...(discount_code ? { discount_code } : {}),
    items,
    payment_method: paymentMethod,
  });

  if (response && typeof response === "object" && !Array.isArray(response)) {
    const record = response as Record<string, unknown>;

    if (record.status === false) {
      throw new ApiError(
        400,
        typeof record.message === "string" && record.message.trim()
          ? record.message
          : "پرداخت آگهی با خطا مواجه شد.",
        undefined,
        { code: typeof record.code === "string" ? record.code : undefined },
      );
    }
  }

  return {
    paymentUrl: findCheckoutPaymentUrl(response),
    response,
  };
}

export async function submitConsultantAdvertisementCheckout(
  payload: SubmitAdvertisementCheckoutPayload,
): Promise<SubmitAdvertisementCheckoutResult> {
  return submitAdvertisementCheckout(payload);
}
