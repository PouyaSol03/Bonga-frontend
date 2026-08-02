import { ApiError, api, publicApi } from "../api/api";

export type PackageKind = "panel_subscription" | "credit_bundle";

export type PackageItem = {
  ad_credit: number;
  created_at: string;
  discount_percent: number;
  duration_days: number;
  final_price: number;
  id: string;
  is_active: boolean;
  kind: PackageKind;
  real_price: number;
  renew_credit: number;
  slug: string;
  sort_order: number;
  special_credit: number;
  title: string;
  updated_at: string;
};

type PackagesResponse = {
  list?: PackageItem[];
  status?: boolean;
};

export async function getPackages() {
  const response = await publicApi.get("public/package").json<PackagesResponse>();

  return Array.isArray(response.list)
    ? response.list
        .filter((item) => item.is_active)
        .sort((first, second) => first.sort_order - second.sort_order)
    : [];
}


export type AgencyPackagePaymentResult = {
  authority?: string;
  paymentId?: number | string;
  paymentUrl: string;
};

function readAgencyPackagePaymentUrl(response: Record<string, unknown>) {
  const value = response.payment_url;

  if (typeof value !== "string" || !value.trim()) return null;

  try {
    const url = new URL(value);

    if (url.protocol !== "http:" && url.protocol !== "https:") return null;

    return url.toString();
  } catch {
    return null;
  }
}

export async function payAgencyPackage(
  packageId: string,
): Promise<AgencyPackagePaymentResult> {
  const normalizedPackageId = packageId.trim();

  if (!normalizedPackageId) {
    throw new ApiError(400, "شناسه بسته معتبر نیست.");
  }

  const response = await api
    .post(`me/agency/packages/${encodeURIComponent(normalizedPackageId)}/pay`, {
      searchParams: { payment_type: 0 },
    })
    .json<
      Record<string, unknown> & {
        authority?: string;
        payment_id?: number | string;
        payment_url?: string;
        status?: boolean;
      }
    >();

  if (response.status === false) {
    throw new ApiError(400, "ایجاد درخواست پرداخت بسته با خطا مواجه شد.");
  }

  const paymentUrl = readAgencyPackagePaymentUrl(response);

  if (!paymentUrl) {
    throw new ApiError(500, "آدرس درگاه پرداخت از سرور دریافت نشد.");
  }

  return {
    authority: typeof response.authority === "string" ? response.authority : undefined,
    paymentId:
      typeof response.payment_id === "number" || typeof response.payment_id === "string"
        ? response.payment_id
        : undefined,
    paymentUrl,
  };
}
