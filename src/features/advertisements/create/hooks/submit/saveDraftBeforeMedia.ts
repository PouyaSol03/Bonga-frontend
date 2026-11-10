import type { Dispatch, SetStateAction } from "react";
import type { UseMutationResult, UseQueryResult } from "@tanstack/react-query";
import { getApiErrorMessage } from "../../../../../shared/api/api";
import type { CategoryItem } from "../../../../categories/api/category.service";
import type {
  AdvertiseFormDefinition,
  AdvertisementItem,
  saveAdvertiseDraft,
} from "../../../api/advertisement.service";
import { findCategoryId } from "../../edit-mapping/crmEditNormalizer";
import { saveNewAdFlowSession } from "../../session";
import type { FlowStep, NewAdFormValues } from "../../types";
import { buildNewAdFormData } from "../../utils";

interface SaveDraftBeforeMediaParams {
  advertiseFormQuery: UseQueryResult<AdvertiseFormDefinition, Error>;
  categoriesQuery: UseQueryResult<CategoryItem[], Error>;
  currentFormCode: string;
  draftAdId: string | null;
  editAdId: string | null;
  isEditMode: boolean;
  routeParams: { category: string };
  saveDraftMutation: UseMutationResult<
    AdvertisementItem,
    Error,
    Parameters<typeof saveAdvertiseDraft>[0]
  >;
  setDraftAdId: (id: string | null) => void;
  setFieldErrors: Dispatch<SetStateAction<Record<string, string>>>;
  setStep: (step: FlowStep) => void;
  setSubmitError: (error: string) => void;
  values: NewAdFormValues;
}

export function saveDraftBeforeMedia({
  advertiseFormQuery,
  categoriesQuery,
  currentFormCode,
  draftAdId,
  editAdId,
  isEditMode,
  routeParams,
  saveDraftMutation,
  setDraftAdId,
  setFieldErrors,
  setStep,
  setSubmitError,
  values,
}: SaveDraftBeforeMediaParams) {
  const categoryId = findCategoryId(categoriesQuery.data ?? [], routeParams.category);
  const resolvedFormCode = advertiseFormQuery.data?.code?.trim() || currentFormCode;
  const formData = buildNewAdFormData(values, {
    categoryId,
    dynamicFieldKeys: advertiseFormQuery.data?.fields?.map((field) => field.key),
    formCode: resolvedFormCode,
    isDraft: true,
    isEdit: isEditMode,
  });

  formData.delete("label");
  formData.delete("description");

  const activeDraftId = draftAdId || editAdId;
  if (activeDraftId) {
    formData.append("id", activeDraftId);
  }

  saveDraftMutation.mutate(formData, {
    onError: (error: unknown) => {
      setSubmitError(getApiErrorMessage(error, "خطا در ذخیره پیش‌نویس آگهی"));
    },
    onSuccess: (savedAd: AdvertisementItem) => {
      const returnedId = savedAd?.id ?? savedAd?._id;
      if (returnedId) {
        const idStr = String(returnedId);
        setDraftAdId(idStr);
        saveNewAdFlowSession(values, "media", idStr);
      }
      setFieldErrors({});
      setSubmitError("");
      setStep("media");
    },
  });
}
