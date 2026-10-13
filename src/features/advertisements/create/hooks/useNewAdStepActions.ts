import type { UseQueryResult } from "@tanstack/react-query";
import type { MutableRefObject } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { PublicAgencyDto } from "../../../agencies/api/agency.service";
import type { CategoryItem } from "../../../categories/api/category.service";
import { getEditAdRouteState } from "../routeState";
import type { FlowStep, NewAdFieldErrorKey, NewAdFieldErrors, NewAdFormValues } from "../types";
import { trimFormValues } from "../utils";
import { validateNewAd, validateNewAdDetails } from "../validation";
import { handleValidationFailure } from "../validationScroll";
import { saveDraftBeforeMedia } from "./submit/saveDraftBeforeMedia";
import { useNewAdBackNavigation } from "./useNewAdBackNavigation";

interface UseNewAdStepActionsProps {
  advertiseFormQuery: UseQueryResult<any, Error>;
  categoriesQuery: UseQueryResult<CategoryItem[], Error>;
  clearFieldError: (key: NewAdFieldErrorKey) => void;
  createAdvertisementPending: boolean;
  currentFormCode: string;
  draftAdId: string | null;
  editAdId: string | null;
  editAdState: ReturnType<typeof getEditAdRouteState>;
  isAssigned?: boolean;
  isCrmEditMode?: boolean;
  isCrmSource: boolean;
  isEditMode: boolean;
  isEditingIncomplete: boolean;
  methods: UseFormReturn<NewAdFormValues>;
  routeParams: { category: string; publisherType?: string };
  saveDraftMutation: any;
  setDraftAdId: (id: string | null) => void;
  setFieldErrors: React.Dispatch<React.SetStateAction<NewAdFieldErrors>>;
  setStep: (step: FlowStep) => void;
  setSubmitError: (error: string) => void;
  submit: () => void;
  submitLockRef: MutableRefObject<boolean>;
}

export function useNewAdStepActions({
  advertiseFormQuery,
  categoriesQuery,
  clearFieldError,
  createAdvertisementPending,
  currentFormCode,
  draftAdId,
  editAdId,
  editAdState,
  isCrmSource,
  isEditMode,
  isEditingIncomplete,
  methods,
  routeParams,
  saveDraftMutation,
  setDraftAdId,
  setFieldErrors,
  setStep,
  setSubmitError,
  submit,
  submitLockRef,
}: UseNewAdStepActionsProps) {
  const goToDetails = () => setStep("details");

  const { handleEditBack, leaveCrmEditor } = useNewAdBackNavigation({
    editAdId,
    editAdState,
  });

  const goToAgencySelection = () => {
    const values = methods.getValues();
    const validation = validateNewAd(values, { forceFullEditFields: isEditMode && !isEditingIncomplete });

    if (validation) {
      setFieldErrors(validation.errors);
      setSubmitError("");
      setStep(validation.step);
      handleValidationFailure(validation.errors, methods.setValue, methods.getValues);
      return;
    }

    setFieldErrors({});
    setSubmitError("");
    setStep("agencySelection");
  };

  const handleMediaPrimary = () => {
    const values = methods.getValues();
    const shouldChooseAgency =
      (!isEditMode || isEditingIncomplete) &&
      !isCrmSource &&
      values.registrantType === "agency";

    if (shouldChooseAgency) {
      goToAgencySelection();
      return;
    }

    void submit();
  };

  const selectAgency = (agency: Pick<PublicAgencyDto, "id" | "name"> | null) => {
    methods.setValue("agencyId", agency?.id ?? "", { shouldDirty: true });
    methods.setValue("publisherName", agency?.name ?? "", { shouldDirty: true });

    if (agency) {
      setSubmitError("");
      clearFieldError("agencyId");
    }
  };

  const confirmAgency = (agency: Pick<PublicAgencyDto, "id" | "name">) => {
    if (submitLockRef.current || createAdvertisementPending) return;

    selectAgency(agency);
    window.queueMicrotask(() => void submit());
  };

  const confirmPublisher = (publisher: { id: string; name: string; type: "agency" | "consultant" }) => {
    methods.setValue("consultantAssignmentSelected", publisher.type === "consultant", { shouldDirty: true });
    methods.setValue("registrantType", "personal", { shouldDirty: true });
    methods.setValue("agencyId", "", { shouldDirty: true });
    methods.setValue("publisherName", publisher.name, { shouldDirty: true });
    methods.setValue(
      "consultantId",
      publisher.type === "consultant" ? publisher.id.replace("consultant:", "") : "",
      { shouldDirty: true },
    );
    setSubmitError("");
    clearFieldError("agencyId");
    setStep("media");
  };

  const goToMedia = () => {
    const values = trimFormValues(methods.getValues());
    const validation = validateNewAdDetails(values);

    if (validation) {
      setFieldErrors(validation.errors);
      setSubmitError("");
      handleValidationFailure(validation.errors, methods.setValue, methods.getValues);
      return;
    }

    setFieldErrors({});
    setSubmitError("");

    if (isCrmSource || (isEditMode && !isEditingIncomplete)) {
      setStep("media");
      return;
    }

    saveDraftBeforeMedia({
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
    });
  };

  return {
    confirmAgency,
    confirmPublisher,
    goToAgencySelection,
    goToDetails,
    goToMedia,
    handleEditBack,
    handleMediaPrimary,
    leaveCrmEditor,
    selectAgency,
  };
}
