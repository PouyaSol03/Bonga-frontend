import { api } from "../../../../shared/api/api";
import { normalizeRows, unwrapRecord } from "./crmBase";

export type CrmPackageKind = "panel_subscription" | "credit_bundle";

export type CrmPackagePayload = {
  id?: string;
  slug: string;
  kind: CrmPackageKind;
  title: string;
  real_price: number;
  discount_percent: number;
  duration_days: number;
  ad_credit: number;
  special_credit: number;
  renew_credit: number;
  sort_order: number;
  is_active: boolean;
};

export type CrmCheckoutProductPayload = {
  title: string;
  description: string;
  price: number;
  credit_cost: number;
  duration_days: number | null;
  duration_months: number | null;
  is_active: boolean;
  sort_order: number;
  metadata: Record<string, unknown>;
};

export async function listCrmPackages() {
  return normalizeRows(await api.get("panel/packages").json<unknown>());
}

export async function getCrmPackage(id: string) {
  return unwrapRecord(await api.get(`panel/packages/${encodeURIComponent(id)}`).json<unknown>(), [
    "package",
    "data",
    "result",
  ]);
}

export async function updateCrmPackage(id: string, payload: CrmPackagePayload) {
  return unwrapRecord(
    await api.patch(`panel/packages/${encodeURIComponent(id)}`, { json: payload }).json<unknown>(),
    ["package", "data", "result"],
  );
}

export async function createCrmPackage(payload: CrmPackagePayload) {
  return unwrapRecord(await api.post("panel/packages", { json: payload }).json<unknown>(), [
    "package",
    "data",
    "result",
  ]);
}

export function deleteCrmPackage(id: string) {
  return api.delete(`panel/packages/${encodeURIComponent(id)}`).json<unknown>();
}

export async function listCrmCheckoutProducts() {
  return normalizeRows(await api.get("panel/advertise-checkout-products").json<unknown>());
}

export async function updateCrmCheckoutProduct(slug: string, payload: CrmCheckoutProductPayload) {
  return unwrapRecord(
    await api.patch(`panel/advertise-checkout-products/${slug}`, { json: payload }).json<unknown>(),
    ["product", "data"],
  );
}

export async function updateCrmCheckoutProductStatus(slug: string, isActive: boolean) {
  return unwrapRecord(
    await api
      .patch(`panel/advertise-checkout-products/${slug}/status`, {
        json: { is_active: isActive },
      })
      .json<unknown>(),
    ["product", "data"],
  );
}
