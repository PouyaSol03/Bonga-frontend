import type { NavigateFunction } from "react-router";
import { getApiErrorMessage, getApiFieldError } from "../../../../../shared/api/api";
import { USER } from "../../../../../shared/constants/roles.constants";
import { adManagementPaths,
  getAdPaymentPath,
  getAdStatePath,
  markNewAdCheckout } from "../../../../account/adManagement/adManagementData";
import { mapAdvertisementToAdCard } from "../../../api/advertisement.service";
import type { FlowStep, NewAdFormValues } from "../../types";
import { clearNewAdDraftStorage } from "../../utils";


interface SubmitCreateAdvertiseParams {
  activeAdId: string | null;
  activeRole: string;
  createAdvertisement: any;
  formData: FormData;
  navigate: NavigateFunction;
  routeParams: { category: string; publisherType?: string };
  setFieldErrors: (errors: any) => void;
  setStep: (step: FlowStep) => void;
  setSubmitError: (error: string) => void;
  submitLockRef: React.MutableRefObject<boolean>;
  values: NewAdFormValues;
}

export function submitCreateAdvertise({
  activeAdId,
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
}: SubmitCreateAdvertiseParams) {
  setFieldErrors({});
  setSubmitError("");
  submitLockRef.current = true;

  if (activeAdId) formData.set("id", String(activeAdId));
  else formData.delete("id");

  createAdvertisement.mutate(formData, {
    onError: (error: unknown) => {
      const agencyError = getApiFieldError(error, "agency_id");
      const errorMessage = getApiErrorMessage(error, "ثبت آگهی با خطا مواجه شد.");
      if (agencyError) {
        setFieldErrors((current: any) => ({ ...current, agencyId: agencyError }));
        setStep("agencySelection");
      }
      setSubmitError(agencyError ?? errorMessage);
      if (errorMessage.includes("صفحه آژانس")) window.location.assign("/dashboard/agency/profile");
      if (errorMessage.includes("صفحه مشاور")) window.location.assign("/dashboard/agent/profile");
    },
    onSettled: () => {
      submitLockRef.current = false;
    },
    onSuccess: (createdAd: any) => {
      const createdAdId = createdAd.id ?? createdAd._id ?? activeAdId;
      if (!createdAdId) {
        setSubmitError("شناسه آگهی ثبت‌شده از سرور دریافت نشد.");
        return;
      }
      const ad = mapAdvertisementToAdCard(createdAd, 0);
      const isWaitingForAgency =
        createdAd.status === "wait_for_agency" || Number(createdAd.status) === 2;
      const isAlreadyPublished =
        createdAd.status === "published" ||
        createdAd.status === "active" ||
        Number(createdAd.status) === 3;

      clearNewAdDraftStorage();

      if (isWaitingForAgency) {
        navigate(getAdStatePath(createdAdId), {
          replace: true,
          state: {
            ad: createdAd,
            card: ad,
            isAssigned: true,
            returnTo: "/account/my-ads",
            status: "wait_for_agency",
            tab: "status",
          },
        });
        return;
      }

      if (isAlreadyPublished) {
        navigate(getAdStatePath(createdAdId), {
          replace: true,
          state: {
            ad: createdAd,
            card: ad,
            returnTo:
              activeRole === USER || !activeRole ? "/account/my-ads" : adManagementPaths.root,
            status: "published",
            tab: "status",
          },
        });
        return;
      }

      const isAgencyPublisher =
        activeRole === "real_estate_manager" || routeParams.publisherType === "agency";
      const isConsultantPublisher =
        activeRole === "real_estate_consultant" ||
        routeParams.publisherType === "agent" ||
        routeParams.publisherType === "consultant";
      const effectivePublisherType = values.consultantId
        ? "consultant"
        : isAgencyPublisher
          ? "agency"
          : isConsultantPublisher
            ? "consultant"
            : (routeParams.publisherType ?? "user");

      markNewAdCheckout(createdAdId);
      navigate(getAdPaymentPath(createdAdId), {
        state: {
          ad: createdAd,
          card: ad,
          consultantAssignmentSelected: values.consultantAssignmentSelected,
          consultantChanged: Boolean(values.consultantId),
          consultantId: values.consultantId || undefined,
          isAgencyPublisher,
          paymentFlow: "new-ad",
          publisherType: effectivePublisherType,
          status: "wait_for_payment",
          tab: "status",
        },
      });
    },
  });
}
