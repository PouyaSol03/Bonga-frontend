import type { UseFormReturn } from "react-hook-form";
import type { useNewAdStepActions } from "../hooks/useNewAdStepActions";
import { AgencySelectionStep } from "../steps/AgencySelectionStep";
import { DetailsStep } from "../steps/DetailsStep";
import { MediaStep } from "../steps/MediaStep";
import { MoreFeaturesStep } from "../steps/MoreFeaturesStep";
import { ProjectDetailsStep } from "../steps/project/ProjectDetailsStep";
import { PublisherSelectionStep } from "../steps/PublisherSelectionStep";
import type { FlowStep, NewAdFieldErrorKey, NewAdFieldErrors, NewAdFormValues } from "../types";

interface NewAdStepRendererProps {
  actions: ReturnType<typeof useNewAdStepActions>;
  canChangePublisher: boolean;
  clearFieldError: (key: NewAdFieldErrorKey) => void;
  createAdvertisementPending: boolean;
  crmSavePending: boolean;
  editAdIsLoading: boolean;
  fieldErrors: NewAdFieldErrors;
  isAssigned: boolean;
  isCrmEditMode: boolean;
  isEditMode: boolean;
  isEditingIncomplete: boolean;
  label: string;
  methods: UseFormReturn<NewAdFormValues>;
  saveDraftPending: boolean;
  setStep: (step: FlowStep) => void;
  step: FlowStep;
  submitLockRef: React.MutableRefObject<boolean>;
  updateAdvertisementPending: boolean;
}

export function NewAdStepRenderer({
  actions,
  canChangePublisher,
  clearFieldError,
  createAdvertisementPending,
  crmSavePending,
  editAdIsLoading,
  fieldErrors,
  isAssigned,
  isCrmEditMode,
  isEditMode,
  isEditingIncomplete,
  label,
  methods,
  saveDraftPending,
  setStep,
  step,
  submitLockRef,
  updateAdvertisementPending,
}: NewAdStepRendererProps) {
  if (isCrmEditMode && editAdIsLoading) {
    return (
      <div className="grid min-h-0 flex-1 place-items-center bg-surface-container text-sm font-medium text-on-surface-var">
        در حال دریافت اطلاعات آگهی...
      </div>
    );
  }

  if (step === "details") {
    return (
      <DetailsStep
        errors={fieldErrors}
        isPending={saveDraftPending}
        label={label}
        onBack={isCrmEditMode ? actions.leaveCrmEditor : isEditMode ? actions.handleEditBack : undefined}
        onClearError={clearFieldError}
        onMoreFeatures={() => setStep("moreFeatures")}
        onNext={actions.goToMedia}
        onProjectDetails={() => setStep("projectDetails")}
      />
    );
  }

  if (step === "moreFeatures") {
    return <MoreFeaturesStep onCancel={actions.goToDetails} onConfirm={actions.goToDetails} />;
  }

  if (step === "projectDetails") {
    return <ProjectDetailsStep onBack={actions.goToDetails} />;
  }

  if (step === "agencySelection") {
    return (
      <AgencySelectionStep
        onBack={() => setStep("media")}
        onConfirm={actions.confirmAgency}
        onSelect={actions.selectAgency}
        selectedAgencyId={methods.watch("agencyId")}
        selectedAgencyName={methods.watch("publisherName")}
        submitDisabled={createAdvertisementPending || submitLockRef.current}
      />
    );
  }

  if (step === "publisherSelection" && canChangePublisher) {
    return <PublisherSelectionStep onBack={() => setStep("media")} onConfirm={actions.confirmPublisher} />;
  }

  return (
    <MediaStep
      errors={fieldErrors}
      forceFullEditFields={isEditMode && !isEditingIncomplete}
      isAssigned={isAssigned}
      label={label}
      onBack={actions.goToDetails}
      onChangePublisher={canChangePublisher ? () => setStep("publisherSelection") : undefined}
      onClearError={clearFieldError}
      onSubmit={actions.handleMediaPrimary}
      submitDisabled={
        createAdvertisementPending ||
        updateAdvertisementPending ||
        crmSavePending ||
        (isEditMode && editAdIsLoading)
      }
    />
  );
}
