import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { ProjectDetailsStep } from "./steps/project/ProjectDetailsStep";
import { PageFrame } from "../../app/PageFrame";
import { Header } from "./components/NewAdControls";
import { NewAdPageState } from "./components/NewAdPageState";
import { draftKey, locationKey } from "./data";
import { DetailsStep } from "./steps/DetailsStep";
import { MediaStep } from "./steps/MediaStep";
import { MoreFeaturesStep } from "./steps/MoreFeaturesStep";
import type { FlowStep, NewAdFormValues } from "./types";
import { buildNewAdFormData, buildPayload, getDefaultValues, getParams, navigateTo, useRequireAuth } from "./utils";
export { NewAdLocationPage } from "./NewAdLocationPage";

export function NewAdFlowPage() {
  const { label } = getParams();
  const [step, setStep] = useState<FlowStep>("details");
  const methods = useForm<NewAdFormValues>({ defaultValues: getDefaultValues(), mode: "onChange" });

  useRequireAuth();

  useEffect(() => {
    const subscription = methods.watch((values) => {
      const safeDraft = {
        ...values,
        photos: [],
        video: null,
      };

      window.localStorage.setItem(draftKey, JSON.stringify(safeDraft));
    });

    return () => subscription.unsubscribe();
  }, [methods]);

  const submit = methods.handleSubmit((values) => {
    const payload = buildPayload(values);
    const formData = buildNewAdFormData(values);

    console.log("new-ad payload", payload);

    console.log(
      "new-ad formData",
      Array.from(formData.entries()).map(([key, value]) => {
        if (value instanceof File) {
          return [
            key,
            {
              name: value.name,
              size: value.size,
              type: value.type,
            },
          ];
        }

        return [key, value];
      }),
    );

    window.localStorage.removeItem(draftKey);
    window.localStorage.removeItem(locationKey);
    navigateTo("/account/ad-management/published");
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

        <NewAdPageState>
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
            />
          )}
        </NewAdPageState>
      </FormProvider>
    </PageFrame>
  );
}

