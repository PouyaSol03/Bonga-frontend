import {
  finalizeV2Draft,
  createV2Advertisement,
  updateV2Draft,
  createV2Draft,
  updateV2Advertisement,
} from "../v2/advertisement-v2-lifecycle.service";
import { type AdvertisementCreateResponse } from "./detail-types";
import { type AdvertisementItem } from "./item-types";

export async function createAdvertisement(
  arg: FormData | { payload: FormData; draftId?: string | number | null },
) {
  let payload: FormData;
  let draftId: string | number | null | undefined;

  if (arg instanceof FormData) {
    payload = arg;
    const rawId = arg.get("id");
    if (rawId !== null && rawId !== undefined && String(rawId).trim() !== "") {
      draftId = String(rawId).trim();
    }
  } else {
    payload = arg.payload;
    draftId = arg.draftId;
    if (!draftId) {
      const rawId = arg.payload.get("id");
      if (
        rawId !== null &&
        rawId !== undefined &&
        String(rawId).trim() !== ""
      ) {
        draftId = String(rawId).trim();
      }
    }
  }

  const response = (
    draftId
      ? await finalizeV2Draft(draftId, payload)
      : await createV2Advertisement(payload)
  ) as AdvertisementCreateResponse;

  const createdAdvertise =
    "data" in response && response.data
      ? (response.data as AdvertisementItem)
      : "result" in response && response.result
        ? (response.result as AdvertisementItem)
        : "advertise" in response && response.advertise
          ? (response.advertise as AdvertisementItem)
          : (response as AdvertisementItem);

  return createdAdvertise;
}

export async function saveAdvertiseDraft(
  arg:
    | FormData
    | Record<string, unknown>
    | {
        payload: FormData | Record<string, unknown>;
        draftId?: string | number | null;
      },
) {
  let payload: FormData | Record<string, unknown>;
  let draftId: string | number | null | undefined;

  if (arg && !(arg instanceof FormData) && "payload" in arg) {
    payload = (arg as { payload: FormData | Record<string, unknown> }).payload;
    draftId = (arg as { draftId?: string | number | null }).draftId;
  } else {
    payload = arg as FormData | Record<string, unknown>;
  }

  if (payload instanceof FormData) {
    payload.delete("label");
    payload.delete("description");
    if (!draftId) {
      draftId = (payload.get("id") as string | null) ?? undefined;
    }
    payload.delete("id");
  } else if (payload && typeof payload === "object") {
    delete (payload as Record<string, unknown>).label;
    delete (payload as Record<string, unknown>).description;
    if (!draftId) {
      draftId =
        ((payload as Record<string, unknown>).id as string | number | null) ??
        undefined;
    }
    delete (payload as Record<string, unknown>).id;
  }

  const response = (
    draftId
      ? await updateV2Draft(String(draftId), payload)
      : await createV2Draft(payload)
  ) as AdvertisementCreateResponse;

  const draftAdvertise =
    "data" in response && response.data
      ? (response.data as AdvertisementItem)
      : "result" in response && response.result
        ? (response.result as AdvertisementItem)
        : "advertise" in response && response.advertise
          ? (response.advertise as AdvertisementItem)
          : (response as AdvertisementItem);

  return draftAdvertise;
}

export async function updateAdvertisement({
  advertiseId,
  payload,
}: {
  advertiseId: string;
  payload: FormData;
}) {
  const response = (await updateV2Advertisement(
    advertiseId,
    payload,
  )) as AdvertisementCreateResponse;

  const updatedAdvertise =
    "data" in response && response.data
      ? (response.data as AdvertisementItem)
      : "result" in response && response.result
        ? (response.result as AdvertisementItem)
        : "advertise" in response && response.advertise
          ? (response.advertise as AdvertisementItem)
          : (response as AdvertisementItem);

  return updatedAdvertise;
}
