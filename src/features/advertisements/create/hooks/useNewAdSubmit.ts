import type { MutableRefObject } from "react";
import type { UseFormReturn } from "react-hook-form";
import { useNavigate } from "react-router";
import { getApiErrorMessage } from "../../../../shared/api/api";
import type { CrmRecord } from "../../../crm/api/crm.service";
import {
  useCreateAdvertisementMutation,
  useSaveAdvertiseDraftMutation,
  useUpdateAdvertisementMutation,
} from "../../api/advertisement.hooks";
import type { AdvertisementItem } from "../../api/advertisement.service";
import { findCategoryId } from "../edit-mapping/crmEditNormalizer";
import { getEditAdRouteState } from "../routeState";
import type { FlowStep, NewAdFieldErrors, NewAdFormValues } from "../types";
import { buildNewAdFormData, trimFormValues } from "../utils";
import { validateNewAd } from "../validation";
import { handleValidationFailure, scrollToFirstError } from "../validationScroll";
import { submitCreateAdvertise } from "./submit/submitCreateAdvertise";
import { submitCrmAdvertise } from "./submit/submitCrmAdvertise";
import { submitEditPatch } from "./submit/submitEditPatch";
import { useCrmSaveMutation } from "./submit/useCrmSaveMutation";

interface UseNewAdSubmitProps {
  activeRole: string;
  advertiseFormQuery: any;
  categoriesQuery: any;
  crmEditRecord?: CrmRecord;
  currentFormCode: string;
  draftAdId: string | null;
  editAdData?: AdvertisementItem;
  editAdId: string | null;
  editAdState: ReturnType<typeof getEditAdRouteState>;
  initialEditValuesRef: MutableRefObject<NewAdFormValues | null>;
  isCrmSource: boolean;
  isEditMode: boolean;
  isEditingIncomplete: boolean;
  methods: UseFormReturn<NewAdFormValues>;
  routeParams: { category: string; publisherType?: string };
  setFieldErrors: React.Dispatch<React.SetStateAction<NewAdFieldErrors>>;
  setStep: (step: FlowStep) => void;
  setSubmitError: (error: string) => void;
  submitLockRef: MutableRefObject<boolean>;
}

export function useNewAdSubmit({
  activeRole,
  advertiseFormQuery,
  categoriesQuery,
  crmEditRecord,
  currentFormCode,
  draftAdId,
  editAdData,
  editAdId,
  editAdState,
  initialEditValuesRef,
  isCrmSource,
  isEditMode,
  isEditingIncomplete,
  methods,
  routeParams,
  setFieldErrors,
  setStep,
  setSubmitError,
  submitLockRef,
}: UseNewAdSubmitProps) {
  const navigate = useNavigate();
  const createAdvertisement = useCreateAdvertisementMutation();
  const updateAdvertisement = useUpdateAdvertisementMutation();
  const saveDraftMutation = useSaveAdvertiseDraftMutation();
  const crmSaveMutation = useCrmSaveMutation();

  const submit = methods.handleSubmit((rawValues) => {
    const values = trimFormValues(rawValues);
    if (
      submitLockRef.current ||
      createAdvertisement.isPending ||
      updateAdvertisement.isPending ||
      crmSaveMutation.isPending
    ) {
      return;
    }

    const validation = validateNewAd(values, { forceFullEditFields: isEditMode });
    if (validation) {
      setFieldErrors(validation.errors);
      setSubmitError("");
      setStep(validation.step);
      handleValidationFailure(validation.errors, methods.setValue, methods.getValues);
      return;
    }

    if (!isEditMode && !isCrmSource && values.registrantType === "agency" && !values.agencyId.trim()) {
      setSubmitError("لطفا آژانس مورد نظر را انتخاب کنید.");
      setStep("agencySelection");
      return;
    }

    if (isCrmSource) {
      submitCrmAdvertise({
        crmEditRecord,
        crmSaveMutation,
        editAdId,
        editAdState,
        isEditMode,
        navigate,
        setFieldErrors,
        setSubmitError,
        submitLockRef,
        values,
      });
      return;
    }

    if (!advertiseFormQuery.data) {
      setSubmitError(
        advertiseFormQuery.isError
          ? getApiErrorMessage(advertiseFormQuery.error, isEditMode ? "دریافت ساختار فرم ویرایش آگهی با خطا مواجه شد." : "دریافت ساختار فرم ثبت آگهی با خطا مواجه شد.")
          : isEditMode ? "در حال دریافت ساختار فرم ویرایش آگهی هستیم. لطفا دوباره تلاش کنید." : "در حال دریافت ساختار فرم ثبت آگهی هستیم. لطفا دوباره تلاش کنید.",
      );
      return;
    }

    const categoryId = findCategoryId(categoriesQuery.data ?? [], routeParams.category);
    const resolvedFormCode = advertiseFormQuery.data.code?.trim() || currentFormCode;
    if (!resolvedFormCode) {
      setSubmitError("کد فرم آگهی مشخص نیست. لطفا دسته‌بندی را دوباره انتخاب کنید.");
      return;
    }

    if (isEditMode && !isEditingIncomplete) {
      submitEditPatch({
        activeRole,
        categoryId,
        currentAd: editAdData,
        dynamicFieldKeys: advertiseFormQuery.data.fields.map((field: any) => field.key),
        editAdId,
        editAdState,
        formCode: resolvedFormCode,
        initialEditValuesRef,
        navigate,
        setFieldErrors,
        setSubmitError,
        submitLockRef,
        updateAdvertisement,
        values,
      });
      return;
    }

    const formData = buildNewAdFormData(values, {
      categoryId,
      dynamicFieldKeys: advertiseFormQuery.data.fields.map((field: any) => field.key),
      formCode: resolvedFormCode,
      isEdit: isEditMode,
    });

    const hasNewImages = formData.getAll("images").length > 0;
    const hasExistingImages = formData.getAll("existing_images").length > 0;
    const hasPhotos = Array.isArray(values.photos) && values.photos.length > 0;

    if (!hasNewImages && !hasExistingImages && !hasPhotos) {
      setFieldErrors((curr) => ({
        ...curr,
        photos: "لطفا حداقل یک عکس معتبر برای آگهی انتخاب کنید.",
      }));
      setSubmitError("");
      setStep("media");
      scrollToFirstError({ photos: "لطفا حداقل یک عکس معتبر برای آگهی انتخاب کنید." });
      return;
    }

    submitCreateAdvertise({
      activeAdId: draftAdId,
      activeRole,
      createAdvertisement,
      formData,
      navigate,
      routeParams,
      setFieldErrors,
      setStep,
      setSubmitError,
      submitLockRef,
      values,
    });
  });

  return {
    createAdvertisement,
    crmSaveMutation,
    saveDraftMutation,
    submit,
    updateAdvertisement,
  };
}
