import { apiV2 } from "../../../../shared/api/api";
import type {
  AdvertisementV2CheckoutPayload,
  AdvertisementV2DealResultPayload,
  AdvertisementV2LifecycleEligibility,
  AdvertisementV2OwnerContact,
} from "./advertisement-v2.types";

const enc = (id: string | number) => encodeURIComponent(String(id));

// Lifecycle & Actions
export const getV2ArchiveEligibility = (id: string | number) =>
  apiV2.get(`advertise/${enc(id)}/archive`).json<AdvertisementV2LifecycleEligibility>();

export const restoreV2Archive = (id: string | number, note?: string) =>
  apiV2.post(`advertise/${enc(id)}/archive/restore`, { json: { note: note || "درخواست کاربر" } }).json();

export const getV2ReRegisterEligibility = (id: string | number) =>
  apiV2.get(`advertise/${enc(id)}/re-registration`).json<AdvertisementV2LifecycleEligibility>();

export const reRegisterV2 = (id: string | number, note?: string) =>
  apiV2.post(`advertise/${enc(id)}/re-registration`, { json: { note: note || "درخواست کاربر" } }).json();

export const getV2History = (id: string | number) =>
  apiV2.get(`advertise/${enc(id)}/history`).json<{ status?: boolean; data?: unknown[] }>();

export const getV2DealResultEligibility = (id: string | number) =>
  apiV2.get(`advertise/${enc(id)}/result`).json<AdvertisementV2LifecycleEligibility>();

export const submitV2DealResult = (id: string | number, payload: AdvertisementV2DealResultPayload) =>
  apiV2.post(`advertise/${enc(id)}/result`, { json: payload }).json();

export const confirmV2DealResult = (id: string | number, confirmed: boolean) =>
  apiV2.post(`advertise/${enc(id)}/result/confirm`, { json: { confirmed } }).json();

// Checkout
export const getV2Checkout = (id: string | number) =>
  apiV2.get(`advertise/${enc(id)}/checkout`).json();

export const submitV2Checkout = (id: string | number, payload: AdvertisementV2CheckoutPayload) =>
  apiV2.post(`advertise/${enc(id)}/checkout`, { json: payload }).json();

// Overview, Edit, Preview
export const getV2Overview = (id: string | number) =>
  apiV2.get(`advertise/${enc(id)}/overview`).json();

export const getV2Edit = (id: string | number) =>
  apiV2.get(`advertise/${enc(id)}/edit`).json();

export const getV2Preview = (id: string | number) =>
  apiV2.get(`advertise/${enc(id)}/preview`).json();

// Drafts & Registration
export const createV2Draft = (body?: FormData | Record<string, unknown>) => {
  const options = body instanceof FormData ? { body } : { json: body ?? {} };
  return apiV2.post("advertise/draft", options).json();
};

export const updateV2Draft = (id: string | number, body: FormData | Record<string, unknown>) => {
  const options = body instanceof FormData ? { body } : { json: body };
  return apiV2.patch(`advertise/${enc(id)}/draft`, options).json();
};

export const createV2Advertisement = (body: FormData | Record<string, unknown>) => {
  const options = body instanceof FormData ? { body } : { json: body };
  return apiV2.post("advertise", options).json();
};

export const updateV2Advertisement = (id: string | number, body: FormData | Record<string, unknown>) => {
  const options = body instanceof FormData ? { body } : { json: body };
  return apiV2.patch(`advertise/${enc(id)}`, options).json();
};

export const updateV2OwnerContact = (id: string | number, payload: AdvertisementV2OwnerContact) =>
  apiV2.patch(`advertise/${enc(id)}/owner-contact`, { json: payload }).json();
