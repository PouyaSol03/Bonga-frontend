import { apiV2, getActiveV2Role, type V2RoleSegment } from "../../../../shared/api/api";
import { getStoredAuthSession } from "../../../../shared/auth/auth-storage";
import type { AdvertisementPayment } from "../advertisement.service";
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
  apiV2.post(`personal/advertise/${enc(id)}/result/confirm`, { json: { confirmed } }).json();

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

type RegistrationContext = Exclude<V2RoleSegment, "superadmin">;

function getRegistrationContext(): RegistrationContext {
  const selected = typeof window !== "undefined"
    ? new URLSearchParams(window.location.search).get("context")
    : null;
  if (
    selected === "personal" || selected === "agency" ||
    selected === "agency-consultant" || selected === "independent-consultant"
  ) return selected;

  const active = getActiveV2Role();
  return active === "superadmin" ? "personal" : active;
}

function registrationOptions(body?: FormData | Record<string, unknown>, isDraft = false) {
  const omittedKeys = new Set([
    "id", "advertiser_type",
    ...(isDraft ? ["images", "images[]", "existing_images", "existing_images[]", "contact_type", "contact_type[]", "consultant_id", "assigned_consultant_id"] : []),
  ]);
  const context = getRegistrationContext();
  if (context === "personal") {
    omittedKeys.add("consultant_id");
    omittedKeys.add("assigned_consultant_id");
  } else if (context === "agency" || context === "agency-consultant") {
    omittedKeys.add("agency_id");
    omittedKeys.add("assigned_consultant_id");
    const session = getStoredAuthSession();
    const role = context === "agency" ? "real_estate_manager" : "real_estate_consultant";
    const permissions = session?.contextPermissions?.[role] ??
      (getActiveV2Role() === context ? session?.managerPermissions : undefined);
    if ((permissions?.ad_management ?? permissions?.manage_advertises) !== true) {
      omittedKeys.add("consultant_id");
    }
  }
  const isEmptyAssignment = (key: string, value: unknown) =>
    ["agency_id", "consultant_id", "assigned_consultant_id"].includes(key) &&
    (value === null || value === undefined || String(value).trim() === "");
  if (body instanceof FormData) {
    const payload = new FormData();
    for (const [key, value] of body.entries()) {
      if (!omittedKeys.has(key) && !isEmptyAssignment(key, value)) payload.append(key, value);
    }
    return { body: payload };
  }
  const json = { ...body };
  for (const key of Object.keys(json)) {
    if (omittedKeys.has(key) || isEmptyAssignment(key, json[key])) delete json[key];
  }
  return { json };
}

// Drafts & Registration
export const createV2Draft = (body?: FormData | Record<string, unknown>) => {
  const options = registrationOptions(body, true);
  return apiV2.post(`${getRegistrationContext()}/advertise/draft`, options).json();
};

export const updateV2Draft = (id: string | number, body: FormData | Record<string, unknown>) => {
  const options = registrationOptions(body, true);
  return apiV2.patch(`${getRegistrationContext()}/advertise/${enc(id)}/draft`, options).json();
};

export const createV2Advertisement = (body: FormData | Record<string, unknown>) => {
  const options = registrationOptions(body);
  return apiV2.post(`${getRegistrationContext()}/advertise`, options).json();
};

export const updateV2Advertisement = (id: string | number, body: FormData | Record<string, unknown>) => {
  const options = registrationOptions(body);
  return apiV2.patch(`${getRegistrationContext()}/advertise/${enc(id)}`, options).json();
};

export const updateV2OwnerContact = (id: string | number, payload: AdvertisementV2OwnerContact) =>
  apiV2.patch(`advertise/${enc(id)}/owner-contact`, { json: payload }).json();

export const getV2AdvertisementPayments = (id: string | number) =>
  apiV2.get(`advertise/${enc(id)}/payments`).json<{ status: boolean; data: AdvertisementPayment[] }>();

export const changeV2AdvertiseConsultant = (
  id: string | number,
  consultantId: number | null,
) =>
  apiV2
    .patch(`advertise/${enc(id)}/consultant`, {
      json: {
        consultant_id: consultantId !== null && !Number.isNaN(Number(consultantId)) ? Number(consultantId) : null,
      },
    })
    .json();
