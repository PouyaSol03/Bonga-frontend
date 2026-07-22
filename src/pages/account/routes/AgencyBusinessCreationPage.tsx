import { useState, useMemo, useEffect } from "react";
import type { NeighborhoodDto } from "../../../services/neighborhood.service";
import { useCreateMyAgencyMutation } from "../../../hooks/account.hooks";
import type { SnackbarVariant } from "../../../components/Snackbar";
import { getApiErrorMessage } from "../../../api/api";
import { AgencyFields, BusinessFormPage, getNeighborhoodId } from "../businessCreationViews";
import type { BusinessToast } from "../businessCreationViews";

export function AgencyBusinessCreationPage() {
  const [agencyName, setAgencyName] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [selectedNeighborhoods, setSelectedNeighborhoods] = useState<NeighborhoodDto[]>([]);
  const [toast, setToast] = useState<BusinessToast | null>(null);
  const createAgencyMutation = useCreateMyAgencyMutation();
  const neighborhoodIds = useMemo(
    () => selectedNeighborhoods.map(getNeighborhoodId).filter(Boolean),
    [selectedNeighborhoods],
  );
  const trimmedAgencyName = agencyName.trim();
  const agencyNameError =
    hasSubmitted && !trimmedAgencyName ? "نام آژانس املاک الزامی است." : null;
  const neighborhoodsError =
    hasSubmitted && neighborhoodIds.length === 0 ? "انتخاب محدوده فعالیت الزامی است." : null;
  useEffect(() => {
    if (!toast) return;

    const timer = window.setTimeout(() => setToast(null), 3200);

    return () => window.clearTimeout(timer);
  }, [toast]);

  const showToast = (message: string, title = "خطا", variant: SnackbarVariant = "error") => {
    setToast({ message, title, variant });
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

      return true;
    } catch (error) {
      showToast(getApiErrorMessage(error, "ایجاد کسب و کار با خطا مواجه شد."));
      return false;
    }
  };

  return (
    <BusinessFormPage
      businessType="agency"
      fields={
        <AgencyFields
          agencyName={agencyName}
          agencyNameError={agencyNameError}
          neighborhoodsError={neighborhoodsError}
          selectedNeighborhoods={selectedNeighborhoods}
          setAgencyName={setAgencyName}
          setSelectedNeighborhoods={setSelectedNeighborhoods}
        />
      }
      isSubmitting={createAgencyMutation.isPending}
      onDismissToast={() => setToast(null)}
      onSubmit={handleSubmitAgency}
      toast={toast}
    />
  );
}
