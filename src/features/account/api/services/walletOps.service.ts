import { ApiError, api } from "../../../../shared/api/api";
import type { ApiDataResponse } from "../../../../shared/api/response";
import type {
  AccountCreditHistoryPage,
  ChargeWalletPayload,
  ChargeWalletResult,
  PaymentCallbackPayload,
  PaymentCallbackResult,
  WalletPayment,
  WalletPaymentsResult,
  WalletResult,
} from "./wallet.types";
import {
  asPaginationRecord,
  readFiniteNumber,
  readPaymentHistoryItems,
  readPaymentUrl,
} from "./walletPaymentHelpers";

export async function getWallet(): Promise<WalletResult> {
  const response = await api.get("me/wallet").json<ApiDataResponse<WalletResult> | WalletResult>();
  const record = response as Record<string, unknown>;
  const data =
    record.data && typeof record.data === "object"
      ? (record.data as Record<string, unknown>)
      : record;

  return { credit: (data.credit as number | string | undefined) ?? 0 };
}

export async function getAccountCreditHistory({
  page = 1,
  perPage = 20,
}: {
  page?: number;
  perPage?: number;
} = {}): Promise<AccountCreditHistoryPage> {
  const response = await api
    .get("me/account/credit/history", {
      searchParams: { page, per_page: perPage },
    })
    .json<unknown>();
  const root = asPaginationRecord(response);
  const nestedData = asPaginationRecord(root?.data);
  const meta =
    asPaginationRecord(root?.meta) ??
    asPaginationRecord(root?.pagination) ??
    asPaginationRecord(nestedData?.meta) ??
    asPaginationRecord(nestedData?.pagination);
  const data = readPaymentHistoryItems(response);
  const currentPage =
    readFiniteNumber(
      meta?.current_page ??
        meta?.page ??
        nestedData?.current_page ??
        nestedData?.page ??
        root?.current_page ??
        root?.page,
    ) ?? page;
  const resolvedPerPage =
    readFiniteNumber(
      meta?.per_page ??
        meta?.perPage ??
        nestedData?.per_page ??
        nestedData?.perPage ??
        root?.per_page ??
        root?.perPage,
    ) ?? perPage;
  const reportedTotal = readFiniteNumber(meta?.total ?? nestedData?.total ?? root?.total);
  const total = reportedTotal ?? data.length;
  const lastPage = readFiniteNumber(
    meta?.last_page ??
      meta?.lastPage ??
      meta?.total_pages ??
      nestedData?.last_page ??
      nestedData?.lastPage ??
      nestedData?.total_pages ??
      root?.last_page ??
      root?.lastPage ??
      root?.total_pages,
  );

  return {
    data,
    hasNextPage:
      lastPage !== undefined
        ? currentPage < lastPage
        : reportedTotal !== undefined
          ? currentPage * resolvedPerPage < reportedTotal
          : data.length >= resolvedPerPage,
    page: currentPage,
    perPage: resolvedPerPage,
    total,
  };
}

export async function getWalletPayments(page = 1): Promise<WalletPaymentsResult> {
  const response = await api
    .get("me/wallet/payments", {
      searchParams: { page },
    })
    .json<
      | ApiDataResponse<WalletPayment[]>
      | { page?: number; payments?: WalletPayment[]; per_page?: number; total?: number }
      | WalletPayment[]
    >();
  const source = Array.isArray(response) ? { payments: response } : response;
  const sourceRecord = source as Record<string, unknown>;
  const data =
    sourceRecord.data && typeof sourceRecord.data === "object"
      ? (sourceRecord.data as Record<string, unknown>)
      : sourceRecord;

  if (Array.isArray(data)) {
    return { page, payments: data, perPage: data.length, total: data.length };
  }

  return {
    page: typeof data.page === "number" ? data.page : page,
    perPage: typeof data.per_page === "number" ? data.per_page : 20,
    payments: Array.isArray(data.payments) ? (data.payments as WalletPayment[]) : [],
    total: typeof data.total === "number" ? data.total : 0,
  };
}

export async function chargeWallet(payload: ChargeWalletPayload): Promise<ChargeWalletResult> {
  if (!Number.isSafeInteger(payload.price) || payload.price <= 0) {
    throw new ApiError(400, "مبلغ واردشده معتبر نیست.");
  }

  const response = await api.post("me/charge/wallet", { json: payload }).json<
    Record<string, unknown> & {
      authority?: string;
      payment_id?: string;
      payment_url?: string;
      status?: boolean;
      url?: string;
    }
  >();

  if (response.status === false) {
    throw new ApiError(400, "ایجاد درخواست پرداخت با خطا مواجه شد.");
  }

  const paymentUrl = readPaymentUrl(response);
  if (!paymentUrl) {
    throw new ApiError(500, "آدرس درگاه پرداخت از سرور دریافت نشد.");
  }

  return {
    authority: typeof response.authority === "string" ? response.authority : undefined,
    paymentId: typeof response.payment_id === "string" ? response.payment_id : undefined,
    paymentUrl,
  };
}

const paymentCallbackRequests = new Map<string, Promise<PaymentCallbackResult>>();

export function verifyPaymentCallback(
  payload: PaymentCallbackPayload,
): Promise<PaymentCallbackResult> {
  const requestKey = `${payload.Authority}:${payload.Status.toUpperCase()}`;
  const existingRequest = paymentCallbackRequests.get(requestKey);

  if (existingRequest) return existingRequest;

  const request = api
    .post("me/payment/callback", {
      context: { allowNonJsonResponse: true },
      headers: { Accept: "*/*" },
      json: payload,
      redirect: "follow",
    })
    .then((response) => ({
      redirectUrl: response.url,
      success: payload.Status.trim().toUpperCase() === "OK",
    }));

  paymentCallbackRequests.set(requestKey, request);
  void request.then(
    () => paymentCallbackRequests.delete(requestKey),
    () => paymentCallbackRequests.delete(requestKey),
  );

  return request;
}
