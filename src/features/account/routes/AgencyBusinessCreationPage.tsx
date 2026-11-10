import { useState, useMemo, useEffect } from "react";
import type { NeighborhoodDto } from "../../locations/api/neighborhood.service";
import { useCreateMyAgencyMutation, useMyProfileQuery } from "../api/account.hooks";
import { getApiErrorMessage } from "../../../shared/api/api";
import { useNavigate } from "react-router";
import { useToast } from "../../../shared/hooks/useToast";
import { AgencyFields, BusinessFormPage, getNeighborhoodId, type BusinessToast  } from "../businessCreationShared";

import {
  clearAgencyCreationDraft,
  readAgencyCreationDraft,
  writeAgencyCreationDraft,
} from "../agencyCreationDraft";

export function AgencyBusinessCreationPage() {
  const navigate = useNavigate();
  const { showToast: showGlobalToast } = useToast();
  const { data: profile } = useMyProfileQuery();
  const isAgencyPending = Boolean(
    profile?.agency_id &&
    (profile?.agency_status === 0 ||
      profile?.agency_status === "0" ||
      profile?.agency_status === "wait" ||
      String(profile?.agency_status).toLowerCase() === "wait"),
  );
  const initialDraft = useMemo(() => readAgencyCreationDraft(), []);
  const [agencyName, setAgencyName] = useState(initialDraft.agencyName);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [selectedNeighborhoods, setSelectedNeighborhoods] = useState<NeighborhoodDto[]>(
    initialDraft.selectedNeighborhoods,
  );
  const [toast, setToast] = useState<BusinessToast | null>(null);
  const createAgencyMutation = useCreateMyAgencyMutation();
  const neighborhoodIds = useMemo(
    () => selectedNeighborhoods.map(getNeighborhoodId).filter(Boolean),
    [selectedNeighborhoods],
  );
  const trimmedAgencyName = agencyName.trim();
  const agencyNameError = hasSubmitted && !trimmedAgencyName ? "نام آژانس املاک الزامی است." : null;
  const neighborhoodsError =
    hasSubmitted && neighborhoodIds.length === 0 ? "انتخاب محدوده فعالیت الزامی است." : null;
  useEffect(() => {
    if (!toast) return;

    const timer = window.setTimeout(() => setToast(null), 3200);

    return () => window.clearTimeout(timer);
  }, [toast]);

  const showToast = (
    message: string,
    title = "خطا",
    variant: "error" | "success" | "info" | "warning" = "error",
  ) => {
    setToast({ message, title, variant });
    showGlobalToast(message, title, variant);
  };

  const handleSubmitAgency = async () => {
    setHasSubmitted(true);
    createAgencyMutation.reset();

    const validationError = !trimmedAgencyName
      ? "نام آژانس املاک الزامی است."
      : neighborhoodIds.length === 0
        ? "انتخاب محدوده فعالیت الزامی است."
        : null;

    if (validationError) {
      showToast(validationError);
      return false;
    }

    try {
      await createAgencyMutation.mutateAsync({
        name: trimmedAgencyName,
        neighborhood_ids: neighborhoodIds,
      });

      clearAgencyCreationDraft();
      showToast("اطلاعات آژانس با موفقیت ثبت شد و در انتظار تایید است.", "موفقیت", "success");
      return true;
    } catch (error) {
      showToast(getApiErrorMessage(error, "ایجاد کسب و کار با خطا مواجه شد."));
      return false;
    }
  };

  return (
    <BusinessFormPage
      businessType="agency"
      disabledSubmit={isAgencyPending}
      fields={
        <AgencyFields
          agencyName={agencyName}
          agencyNameError={agencyNameError}
          neighborhoodsError={neighborhoodsError}
          onOpenNeighborhoods={() => {
            writeAgencyCreationDraft({ agencyName, selectedNeighborhoods });
            navigate("/account/business/create/agency/neighborhoods");
          }}
          selectedNeighborhoods={selectedNeighborhoods}
          setAgencyName={setAgencyName}
          setSelectedNeighborhoods={setSelectedNeighborhoods}
        />
      }
      isSubmitting={createAgencyMutation.isPending}
      lockedMessage={isAgencyPending ? "در انتظار ادمین برای تایید کسب و کار شما" : undefined}
      onDismissToast={() => setToast(null)}
      onSubmit={handleSubmitAgency}
      toast={toast}
    />
  );
}
