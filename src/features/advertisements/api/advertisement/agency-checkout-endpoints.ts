import {
  type SubmitAgencyAdvertisementCheckoutPayload,
  type SubmitAdvertisementCheckoutResult,
} from "./checkout-payloads";
import { getActiveV2Role, apiV2, ApiError } from "../../../../shared/api/api";
import { findCheckoutPaymentUrl } from "./checkout-response";

export async function submitAgencyAdvertisementCheckout({
  advertiseId,
  consultantId,
  discount_code,
  items,
  paymentMethod,
}: SubmitAgencyAdvertisementCheckoutPayload): Promise<SubmitAdvertisementCheckoutResult> {
  const numericConsultantId =
    consultantId !== undefined &&
    consultantId !== null &&
    String(consultantId).trim() !== "" &&
    !Number.isNaN(Number(consultantId))
      ? Number(consultantId)
      : undefined;

  let response: unknown;
  const context =
    getActiveV2Role() === "agency-consultant" ? "agency-consultant" : "agency";
  if (paymentMethod === "by_consultant") {
    response = await apiV2
      .post(
        `${context}/advertise/${encodeURIComponent(advertiseId)}/checkout`,
        {
          json: {
            payment_method: "by_consultant",
            ...(numericConsultantId !== undefined
              ? { consultant_id: numericConsultantId }
              : {}),
          },
        },
      )
      .json();
  } else {
    response = await apiV2
      .post(
        `${context}/advertise/${encodeURIComponent(advertiseId)}/checkout`,
        {
          json: {
            ...(numericConsultantId !== undefined
              ? { consultant_id: numericConsultantId }
              : {}),
            ...(discount_code ? { discount_code } : {}),
            items,
            payment_method: paymentMethod,
          },
        },
      )
      .json();
  }

  if (response && typeof response === "object" && !Array.isArray(response)) {
    const record = response as Record<string, unknown>;

    if (record.status === false) {
      throw new ApiError(
        400,
        typeof record.message === "string" && record.message.trim()
          ? record.message
          : "پرداخت آگهی تخصیصی با خطا مواجه شد.",
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
