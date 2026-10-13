import { getApiErrorMessage } from "../../../../../shared/api/api";
import { findCategoryId } from "../../edit-mapping/crmEditNormalizer";
import { saveNewAdFlowSession } from "../../session";
import type { FlowStep, NewAdFormValues } from "../../types";
import { buildNewAdFormData } from "../../utils";

interface SaveDraftBeforeMediaParams {
  advertiseFormQuery: any;
  categoriesQuery: any;
  currentFormCode: string;
  draftAdId: string | null;
  editAdId: string | null;
  isEditMode: boolean;
  routeParams: { category: string };
  saveDraftMutation: any;
  setDraftAdId: (id: string | null) => void;
  setFieldErrors: (errors: any) => void;
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
    dynamicFieldKeys: advertiseFormQuery.data?.fields?.map((field: any) => field.key),
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
    onSuccess: (savedAd: any) => {
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
