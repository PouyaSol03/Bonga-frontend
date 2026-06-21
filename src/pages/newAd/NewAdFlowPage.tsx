import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { ProjectDetailsStep } from "./steps/project/ProjectDetailsStep";
import { PageFrame } from "../../app/PageFrame";
import { getApiErrorMessage } from "../../api/api";
import { mapAdvertisementToAdCard } from "../../services/advertisement.service";
import { Snackbar } from "../../components/Snackbar";
import { useCreateAdvertisementMutation } from "../../hooks/advertisement.hooks";
import { Header } from "./components/NewAdControls";
import { adManagementPaths } from "../account/adManagement/adManagementData";
import { draftKey } from "./data";
import { DetailsStep } from "./steps/DetailsStep";
import { MediaStep } from "./steps/MediaStep";
import { MoreFeaturesStep } from "./steps/MoreFeaturesStep";
import type { FlowStep, NewAdFormValues } from "./types";
import { buildNewAdFormData, clearNewAdDraftStorage, getDefaultValues, getParams, navigateTo, useRequireAuth } from "./utils";
export { NewAdLocationPage } from "./NewAdLocationPage";

export function NewAdFlowPage() {
  const { label } = getParams();
  const [step, setStep] = useState<FlowStep>("details");
  const [submitError, setSubmitError] = useState("");
  const methods = useForm<NewAdFormValues>({ defaultValues: getDefaultValues(), mode: "onChange" });
  const createAdvertisement = useCreateAdvertisementMutation();

  useRequireAuth();

  useEffect(() => {
    const subscription = methods.watch((values) => {
      const safeDraft = {
        ...values,
        hasVideo: false,
        photos: [],
        video: null,
      };

      window.localStorage.setItem(draftKey, JSON.stringify(safeDraft));
    });

    return () => subscription.unsubscribe();
  }, [methods]);

  useEffect(() => {
    const clearOnExit = () => {
      if (window.location.pathname.startsWith("/new-ad")) return;

      clearNewAdDraftStorage();
    };
    const clearOnPageHide = () => clearNewAdDraftStorage();

    window.addEventListener("popstate", clearOnExit);
    window.addEventListener("pagehide", clearOnPageHide);

    return () => {
      window.removeEventListener("popstate", clearOnExit);
      window.removeEventListener("pagehide", clearOnPageHide);
    };
  }, []);

  const submit = methods.handleSubmit((values) => {
    if (createAdvertisement.isPending) return;

    const formData = buildNewAdFormData(values);

    setSubmitError("");
    createAdvertisement.mutate(formData, {
      onError: (error) => {
        setSubmitError(getApiErrorMessage(error, "ثبت آگهی با خطا مواجه شد."));
      },
      onSuccess: (createdAd) => {
        clearNewAdDraftStorage();
        navigateTo(adManagementPaths.payment, {
          ad: mapAdvertisementToAdCard(createdAd, 0),
          hasFreeAdTariff: true,
          paymentFlow: "new-ad",
          tab: "status",
        });
      },
    });
  });

  const goToDetails = () => setStep("details");
  const headerTitle =
    step === "moreFeatures"
      ? "ویژگی‌های بیشتر"
      : step === "projectDetails"
        ? "جزئیات پروژه"
        : "ثبت آگهی";

  return (
    <PageFrame className="relative flex h-full min-h-0 flex-col overflow-hidden bg-white text-[#1a1a1a] [direction:rtl]" variant="flush">
      <FormProvider {...methods}>
        <Header
          title={headerTitle}
          onBack={step === "moreFeatures" || step === "projectDetails" ? goToDetails : undefined}
        />

        {submitError ? (
          <Snackbar
            message={submitError}
            onDismiss={() => setSubmitError("")}
            title="خطا"
          />
        ) : null}

        {step === "details" ? (
          <DetailsStep
            label={label}
            onMoreFeatures={() => setStep("moreFeatures")}
            onProjectDetails={() => setStep("projectDetails")}
            onNext={() => setStep("media")}
          />
        ) : step === "moreFeatures" ? (
          <MoreFeaturesStep
            onCancel={goToDetails}
            onConfirm={goToDetails}
          />
        ) : step === "projectDetails" ? (
          <ProjectDetailsStep
            onBack={goToDetails}
          />
        ) : (
          <MediaStep
            label={label}
            onBack={goToDetails}
            onSubmit={submit}
            submitDisabled={createAdvertisement.isPending}
          />
        )}
      </FormProvider>
    </PageFrame>
  );
}

