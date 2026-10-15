import { useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { PageFrame } from "../../../shared/layout/PageFrame";
import { getCategoryList } from "../../categories/api/category.service";
import { useAdvertiseFormDefinitionQuery } from "../api/advertisement.hooks";
import { NewAdFlowHeader } from "./components/NewAdFlowHeader";
import { NewAdStepRenderer } from "./components/NewAdStepRenderer";
import { getEditAdId, isCrmAdvertiseSource } from "./edit-mapping/editRouteParams";
import { useInitialAdValues } from "./hooks/useInitialAdValues";
import { useNewAdDraftSync } from "./hooks/useNewAdDraftSync";
import { useNewAdEditSync } from "./hooks/useNewAdEditSync";
import { useNewAdPermissions } from "./hooks/useNewAdPermissions";
import { useNewAdStepActions } from "./hooks/useNewAdStepActions";
import { useNewAdSubmit } from "./hooks/useNewAdSubmit";
import { NewAdDesktopLayoutContext } from "./NewAdLayoutContext";
import { getEditAdRouteState } from "./routeState";
import type { FlowStep, NewAdFieldErrorKey, NewAdFieldErrors, NewAdFormValues } from "./types";
import { getAdvertiseFormCode, getParams, useRequireAuth } from "./utils";

export { NewAdLocationPage } from "./NewAdLocationPage";

export function NewAdFlowPage() {
  const routeParams = getParams();
  const editAdState = getEditAdRouteState();
  const isEditMode = editAdState.isEditMode === true;
  const editAdId = getEditAdId(editAdState);
  const isCrmSource = isCrmAdvertiseSource();
  const isCrmEditMode = isEditMode && isCrmSource;

  const { initialDraftAdId, initialEditValuesRef, initialStep, initialValues, restoredSession } =
    useInitialAdValues(editAdState, editAdId);

  const [step, setStep] = useState<FlowStep>(initialStep);
  const [draftAdId, setDraftAdId] = useState<string | null>(initialDraftAdId);
  const [fieldErrors, setFieldErrors] = useState<NewAdFieldErrors>({});
  const [submitError, setSubmitError] = useState("");
  const submitLockRef = useRef(false);

  const methods = useForm<NewAdFormValues>({ defaultValues: initialValues, mode: "onChange" });
  useRequireAuth();

  const permissions = useNewAdPermissions(editAdState);
  const { activeRole, canChangePublisher, isAssigned } = permissions;

  const currentFormCode = getAdvertiseFormCode(routeParams.transaction, routeParams.category);
  const advertiseFormQuery = useAdvertiseFormDefinitionQuery(!isCrmSource ? currentFormCode : null);
  const categoriesQuery = useQuery({
    enabled: isCrmSource || !isEditMode,
    queryFn: getCategoryList,
    queryKey: ["categories", "list"],
  });

  const { crmEditRecord, editAdData, editAdIsLoading, isEditingIncomplete } = useNewAdEditSync({
    activeRole,
    editAdId,
    editAdState,
    isCrmEditMode,
    isCrmSource,
    isEditMode,
    methods,
    restoredValues: restoredSession?.values,
    setSubmitError,
  });

  useNewAdDraftSync({ draftAdId, fieldErrors, isEditMode, methods, step });

  const clearFieldError = (key: NewAdFieldErrorKey) => {
    setFieldErrors((curr) => {
      if (!curr[key]) return curr;
      const next = { ...curr };
      delete next[key];
      return next;
    });
  };

  const { createAdvertisement, crmSaveMutation, saveDraftMutation, submit, updateAdvertisement } =
    useNewAdSubmit({
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
    });

  const actions = useNewAdStepActions({
    advertiseFormQuery,
    categoriesQuery,
    clearFieldError,
    createAdvertisementPending: createAdvertisement.isPending,
    currentFormCode,
    draftAdId,
    editAdId,
    editAdState,
    isAssigned,
    isCrmEditMode,
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
  });

  return (
    <PageFrame
      className="bg-surface-container-lowest text-on-surface relative flex h-full min-h-0 flex-col overflow-hidden [direction:rtl]"
      variant="flush"
    >
      <FormProvider {...methods}>
        <NewAdDesktopLayoutContext.Provider value={isCrmSource}>
          <div className="contents">
            <NewAdFlowHeader
              goToDetails={actions.goToDetails}
              handleEditBack={actions.handleEditBack}
              isCrmEditMode={isCrmEditMode}
              isEditMode={isEditMode}
              leaveCrmEditor={actions.leaveCrmEditor}
              step={step}
            />

            {submitError ? (
              <div className="border-error/30 bg-error-container text-error mx-4 mt-2 flex items-center justify-between rounded-lg border p-3 text-right text-sm">
                <span>{submitError}</span>
                <button
                  type="button"
                  onClick={() => setSubmitError("")}
                  className="text-error mr-2 text-xs font-bold"
                >
                  ✕
                </button>
              </div>
            ) : null}

            <NewAdStepRenderer
              actions={actions}
              canChangePublisher={canChangePublisher}
              clearFieldError={clearFieldError}
              createAdvertisementPending={createAdvertisement.isPending}
              crmSavePending={crmSaveMutation.isPending}
              editAdIsLoading={editAdIsLoading}
              fieldErrors={fieldErrors}
              isAssigned={isAssigned}
              isCrmEditMode={isCrmEditMode}
              isEditMode={isEditMode}
              isEditingIncomplete={isEditingIncomplete}
              label={routeParams.label}
              methods={methods}
              saveDraftPending={saveDraftMutation.isPending}
              setStep={setStep}
              step={step}
              updateAdvertisementPending={updateAdvertisement.isPending}
            />
          </div>
        </NewAdDesktopLayoutContext.Provider>
      </FormProvider>
    </PageFrame>
  );
}
