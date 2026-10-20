import type { Dispatch, SetStateAction } from "react";
import type { NavigateFunction } from "react-router";
import type { UseMutationResult } from "@tanstack/react-query";
import { getApiErrorMessage } from "../../../../../shared/api/api";
import { USER } from "../../../../../shared/constants/roles.constants";
import { adManagementPaths, getAdStatePath } from "../../../../account/adManagement/adManagementData";
import {
  mapAdvertisementToAdCard,
  updateAdvertisement as updateAdvertisementFn,
  type AdvertisementItem,
} from "../../../api/advertisement.service";

import { getMyAdStatusInfo } from "../../../../account/myAdsStatus";
import { getEditAdRouteState } from "../../routeState";
import type { NewAdFormValues } from "../../types";
import { clearNewAdDraftStorage, getDefaultValues } from "../../utils";
import { buildEditPatchFormData } from "../../edit-patch";

interface SubmitEditPatchParams {
  activeRole: string;
  categoryId: string | null;
  currentAd?: AdvertisementItem;
  dynamicFieldKeys: string[];
  editAdId: string | null;
  editAdState: ReturnType<typeof getEditAdRouteState>;
  formCode: string;
  initialEditValuesRef: React.MutableRefObject<NewAdFormValues | null>;
  navigate: NavigateFunction;
  setFieldErrors: Dispatch<SetStateAction<Record<string, string>>>;
  setSubmitError: (error: string) => void;
  submitLockRef: React.MutableRefObject<boolean>;
  updateAdvertisement: UseMutationResult<
    AdvertisementItem,
    Error,
    Parameters<typeof updateAdvertisementFn>[0]
  >;
  values: NewAdFormValues;
}

export function submitEditPatch({
  activeRole,
  categoryId,
  currentAd,
  dynamicFieldKeys,
  editAdId,
  editAdState,
  formCode,
  initialEditValuesRef,
  navigate,
  setFieldErrors,
  setSubmitError,
  submitLockRef,
  updateAdvertisement,
  values,
}: SubmitEditPatchParams) {
  if (!editAdId) {
    setSubmitError("شناسه آگهی برای ویرایش مشخص نیست.");
    return;
  }
  const baseline =
    initialEditValuesRef.current ?? getDefaultValues({ ...editAdState, isEditMode: true });
  const patchResult = buildEditPatchFormData(values, baseline, {
    categoryId,
    dynamicFieldKeys,
    formCode,
  });

  const resolvedAd = currentAd ?? editAdState.ad;
  const fallbackTarget = editAdId
    ? getAdStatePath(editAdId)
    : activeRole === USER || !activeRole
      ? "/account/my-ads"
      : adManagementPaths.root;
  const targetPath = editAdState.editReturnTo ?? editAdState.returnTo ?? fallbackTarget;

  if (!patchResult.hasChanges) {
    clearNewAdDraftStorage();
    const currentCard = resolvedAd ? mapAdvertisementToAdCard(resolvedAd, 0) : undefined;
    const statusInfo = resolvedAd ? getMyAdStatusInfo(resolvedAd) : { key: "status" };
    navigate(targetPath, {
      replace: true,
      state: {
        ad: resolvedAd,
        card: currentCard,
        isEditMode: true,
        returnTo: editAdState.returnTo,
        status: statusInfo.key,
        tab: editAdState.tab ?? "status",
      },
    });
    return;
  }

  setFieldErrors({});
  setSubmitError("");
  submitLockRef.current = true;
  updateAdvertisement.mutate(
    { advertiseId: editAdId, payload: patchResult.formData },
    {
      onError: (error: unknown) =>
        setSubmitError(getApiErrorMessage(error, "ویرایش آگهی با خطا مواجه شد.")),
      onSettled: () => {
        submitLockRef.current = false;
      },
      onSuccess: (updatedAd: AdvertisementItem) => {
        clearNewAdDraftStorage();
        const updatedCard = mapAdvertisementToAdCard(updatedAd, 0);
        const statusInfo = getMyAdStatusInfo(updatedAd);
        navigate(targetPath, {
          replace: true,
          state: {
            ad: updatedAd,
            card: updatedCard,
            isEditMode: true,
            returnTo: editAdState.returnTo,
            status: statusInfo.key,
            tab: editAdState.tab ?? "status",
          },
        });
      },
    },
  );
}
