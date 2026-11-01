import { useEffect } from "react";
import { useNavigate } from "react-router";
import { getStoredAuthSession, storeLoginRedirectPath } from "../../../../shared/auth/auth-storage";
import { clearAtomicDraft } from "../draft/adDraftStore";
import { clearNewAdFlowSession } from "../session";
import { draftKey } from "../data";
import type { NewAdFormValues } from "../types";
import type { AdvertisementItem } from "../../api/advertisement.service";

export type EditAdCard = Partial<{
  agency: string;
  area: string;
  id: number | string;
  priceLabelPrimary: string;
  priceLabelSecondary: string;
  pricePrimary: string;
  priceSecondary: string;
  rooms: string;
  timeAndLocation: string;
  title: string;
  year: string;
  owner_contact_phone: string;
  owner_contact_name: string;
  owner_name: string;
  owner_contact_address: string;
  owner_address: string;
  floor: number | string;
}>;

export type EditAdRouteState = {
  ad?: AdvertisementItem;
  assigned_agency_id?: number | string | null;
  assignment_status?: string | number | null;
  card?: EditAdCard & { isAssigned?: boolean };
  editReturnTo?: string;
  isAssigned?: boolean;
  isEditMode?: boolean;
  returnTo?: string;
  status?: string | number;
  tab?: string;
};

export function readRouteState(): EditAdRouteState {
  const state = window.history.state;

  if (!state || typeof state !== "object") return {};

  const usr = (state as { usr?: unknown }).usr;
  if (usr && typeof usr === "object") {
    return { ...state, ...(usr as EditAdRouteState) };
  }

  return state as EditAdRouteState;
}

export function getEditAdRouteState(): EditAdRouteState {
  const params = new URLSearchParams(window.location.search);
  const routeState = readRouteState();
  const isEditRoute =
    params.get("edit") === "true" ||
    routeState.isEditMode === true ||
    window.location.pathname.includes("/published/edit");

  const returnTo = routeState.returnTo ?? params.get("returnTo") ?? undefined;
  const editReturnTo = routeState.editReturnTo ?? params.get("editReturnTo") ?? returnTo;

  return {
    ...routeState,
    editReturnTo,
    returnTo,
    isEditMode: isEditRoute,
  };
}

export function getParams(): {
  category: string;
  label: string;
  publisherType?: string;
  registrantType: NewAdFormValues["registrantType"];
  transaction: string;
} {
  const params = new URLSearchParams(window.location.search);
  const registrantType = params.get("registrantType");
  const publisherType = params.get("publisherType") ?? undefined;

  return {
    category: params.get("category") ?? "",
    label: params.get("label") ?? "آگهی ملک",
    publisherType,
    registrantType:
      registrantType === "personal" || registrantType === "agency" ? registrantType : "",
    transaction: params.get("transaction") ?? "",
  };
}

export function clearNewAdDraftStorage(): void {
  clearNewAdFlowSession();
  clearAtomicDraft();
}

export function getDraft(): Partial<NewAdFormValues> {
  try {
    return JSON.parse(window.localStorage.getItem(draftKey) ?? "{}") as Partial<NewAdFormValues>;
  } catch {
    window.localStorage.removeItem(draftKey);
    return {};
  }
}

export function normalizeDraftStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((item) => String(item ?? "").trim()).filter(Boolean);
  }

  if (typeof value === "string" && value.trim()) {
    return value
      .split(/[،,]/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

export function getLoginRequiredPath(returnTo: string): string {
  const params = new URLSearchParams({ returnTo });
  return `/login-required?${params.toString()}`;
}

export function useRequireAuth(): void {
  const navigate = useNavigate();

  useEffect(() => {
    if (getStoredAuthSession()) return;
    const returnTo = `${window.location.pathname}${window.location.search}`;
    storeLoginRedirectPath(returnTo);
    navigate(getLoginRequiredPath(returnTo), { replace: true });
  }, [navigate]);
}
