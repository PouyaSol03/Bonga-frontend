import { api } from "../../../../shared/api/api";
import type { ApiDataResponse } from "../../../../shared/api/response";
import type { UserProfile } from "../account-profile.types";
import type {
  AuthorizePayload,
  TransferSimOwnershipPayload,
  UpdateProfilePayload,
} from "./account.types";

export function isUserIdentityVerified(profile?: UserProfile | null) {
  const authorizedValue = profile?.authorized;
  const isAuthorized =
    authorizedValue === 1 ||
    String(authorizedValue ?? "").trim() === "1" ||
    String(authorizedValue ?? "")
      .toLowerCase()
      .trim() === "true";

  return isAuthorized;
}

export function updateMyProfile(payload: UpdateProfilePayload) {
  const { avatar, neighborhood_ids, ...profileFields } = payload;
  const normalizedProfileFields = {
    ...profileFields,
    ...(neighborhood_ids
      ? {
          neighborhood_ids: Array.from(
            new Set(neighborhood_ids.map((item) => item.trim()).filter(Boolean)),
          ).join(","),
        }
      : {}),
  };

  if (avatar) {
    const formData = new FormData();

    Object.entries(normalizedProfileFields).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, String(value));
      }
    });

    formData.append("avatar", avatar);

    return api.post("me/update/profile", { body: formData }).json<ApiDataResponse<UserProfile>>();
  }

  return api
    .post("me/update/profile", { json: normalizedProfileFields })
    .json<ApiDataResponse<UserProfile>>();
}

export function authorizeMe(payload: AuthorizePayload) {
  return api.post("me/authorize", { json: payload }).json<ApiDataResponse<unknown>>();
}

export function transferSimOwnership(payload?: TransferSimOwnershipPayload) {
  return api
    .post("me/sim-card-ownership/transfer", {
      json: payload ?? {
        reason: "sim_ownership_changed",
        description: "تغییر مالکیت سیم‌کارت و حذف حساب کاربری",
      },
    })
    .json<{ success: boolean; message: string }>();
}
