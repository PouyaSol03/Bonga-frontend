import { publicApi } from "../api/api";

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
