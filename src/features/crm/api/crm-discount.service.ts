import { api, publicApi } from "../../../shared/api/api";

export type CrmDiscountServiceType = "advertise" | "package" | "panel";

export type CrmDiscountCode = {
  id: number;
  code: string;
  discount_percent: number;
  services: CrmDiscountServiceType[];
  max_discount_amount: number | null;
  usage_limit: number | null;
  used_count: number;
  is_active: boolean;
  expire_at: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
};

export type CrmDiscountCodePayload = {
  code: string;
  discount_percent: number;
  services: CrmDiscountServiceType[];
  max_discount_amount?: number | null;
  usage_limit?: number | null;
  expire_at?: string | null;
  description?: string | null;
  is_active?: boolean;
};

export type ValidateDiscountCodeResult = {
  valid: boolean;
  code: string;
  discount_percent: number;
  discount_amount: number;
  final_price: number;
  is_free: boolean;
  disable_gateway: boolean;
  message: string;
};

export async function listCrmDiscountCodes(): Promise<CrmDiscountCode[]> {
  try {
    const res = await api.get("panel/discount-codes").json<any>();
    if (Array.isArray(res)) return res;
    if (Array.isArray(res?.data)) return res.data;
    if (Array.isArray(res?.list)) return res.list;
    return [];
  } catch (error) {
    console.error("Error fetching discount codes:", error);
    return [];
  }
}

export async function createCrmDiscountCode(
  payload: CrmDiscountCodePayload,
): Promise<CrmDiscountCode> {
  return api.post("panel/discount-codes", { json: payload }).json<CrmDiscountCode>();
}

export async function updateCrmDiscountCode(
  id: number,
  payload: Partial<CrmDiscountCodePayload>,
): Promise<CrmDiscountCode> {
  return api.patch(`panel/discount-codes/${id}`, { json: payload }).json<CrmDiscountCode>();
}

export async function toggleCrmDiscountCodeStatus(id: number): Promise<CrmDiscountCode> {
  return api.patch(`panel/discount-codes/${id}/status`).json<CrmDiscountCode>();
}

export async function deleteCrmDiscountCode(
  id: number,
): Promise<{ success: boolean; message: string }> {
  return api.delete(`panel/discount-codes/${id}`).json<{ success: boolean; message: string }>();
}

export async function validateDiscountCode(input: {
  code: string;
  service: CrmDiscountServiceType;
  price?: number;
}): Promise<ValidateDiscountCodeResult> {
  return publicApi.post("public/discount-codes/validate", { json: input }).json<ValidateDiscountCodeResult>();
}
