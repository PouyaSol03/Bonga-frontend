import { useMemo } from "react";
import { useFormContext } from "react-hook-form";

import { useMyAgencyProfileQuery } from "../../../account/api/account.hooks";
import { useAgencyConsultantsQuery } from "../../../agencies/api/agency.hooks";
import {
  AgencyPublisherPickerPage,
  type AgencyPublisherOption,
} from "../../components/AgencyPublisherPickerPage";
import type { NewAdFormValues } from "../types";

export function PublisherSelectionStep({
  onBack,
  onConfirm,
}: {
  onBack: () => void;
  onConfirm: (publisher: AgencyPublisherOption) => void;
}) {
  const { watch } = useFormContext<NewAdFormValues>();
  const consultantId = watch("consultantId");
  const publisherName = watch("publisherName");
  const agencyQuery = useMyAgencyProfileQuery();
  const consultantsQuery = useAgencyConsultantsQuery({ page: 1, perPage: 100 });

  const options = useMemo<AgencyPublisherOption[]>(() => {
    const next: AgencyPublisherOption[] = [];
    const agency = agencyQuery.data;
    const agencyId = String(agency?.id ?? agency?._id ?? "").trim();
    const agencyName = String(agency?.name ?? "").trim();

    if (agencyId && agencyName) {
      next.push({
        id: `agency:${agencyId}`,
        image: String(agency?.logo ?? agency?.img ?? "").trim() || undefined,
        name: agencyName,
        type: "agency",
      });
    }

    for (const consultant of consultantsQuery.data?.data ?? []) {
      if (!consultant.isActive) continue;

      next.push({
        id: `consultant:${consultant.userId}`,
        image: consultant.avatar?.trim() || undefined,
        name: consultant.name?.trim() || `مشاور شماره ${consultant.userId}`,
        type: "consultant",
      });
    }

    return next;
  }, [agencyQuery.data, consultantsQuery.data]);

  const selectedPublisher = useMemo(() => {
    if (consultantId) {
      const consultant = options.find(
        (option) => option.id === `consultant:${String(consultantId).trim()}`,
      );
      if (consultant) return consultant;
    }

    const agency = options.find((option) => option.type === "agency");
    if (agency) return agency;

    if (publisherName.trim()) {
      return options.find((option) => option.name === publisherName.trim());
    }

    return options[0];
  }, [consultantId, options, publisherName]);

  return (
    <AgencyPublisherPickerPage
      confirmLabel="انتقال"
      isLoading={agencyQuery.isLoading || consultantsQuery.isLoading}
      onBack={onBack}
      onConfirm={onConfirm}
      options={options}
      selectedPublisher={selectedPublisher}
      title="تغییر منتشرکننده"
    />
  );
}
