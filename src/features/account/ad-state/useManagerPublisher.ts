import { useMemo, useState } from "react";
import { readText } from "../../../shared/lib/textUtils";
import { useChangeAgencyAdvertiseConsultantMutation } from "../../advertisements/api/agency-advertise-assignment.hooks";
import "../../advertisements/components/AdCard.css";
import { useAgencyConsultantsQuery } from "../../agencies/api/agency.hooks";
import { readEntityId } from "../ad-state/adModel";
import type { ManagerPublisher } from "../ad-state/types";
import { useMyAgencyProfileQuery } from "../api/account.hooks";

export function useManagerPublisher(
  ad: Record<string, unknown> | undefined,
  isIndependentConsultant: boolean,
) {
  const agencyQuery = useMyAgencyProfileQuery({ enabled: !isIndependentConsultant });
  const consultantsQuery = useAgencyConsultantsQuery({
    enabled: !isIndependentConsultant,
    page: 1,
    perPage: 100,
  });
  const publisherOptions = useMemo<ManagerPublisher[]>(() => {
    const options: ManagerPublisher[] = [];
    const agency = agencyQuery.data;
    const agencyId = readEntityId(agency);
    const agencyName = readText(agency?.name);

    if (agencyId && agencyName) {
      options.push({
        id: `agency:${agencyId}`,
        image: readText(agency?.logo ?? agency?.img) || undefined,
        name: agencyName,
        type: "agency",
      });
    }

    for (const consultant of consultantsQuery.data?.data ?? []) {
      const consultantIdentifier = consultant.agentId ?? consultant.userId;
      options.push({
        id: `consultant:${consultantIdentifier}`,
        image: consultant.avatar,
        name: consultant.name || `مشاور شماره ${consultantIdentifier}`,
        type: "consultant",
      });
    }

    return options;
  }, [agencyQuery.data, consultantsQuery.data]);
  const changeConsultantMutation = useChangeAgencyAdvertiseConsultantMutation();
  const publisherType = String(ad?.publisher_type ?? ad?.owner_type ?? "").toLowerCase();
  const publisherAgentId =
    ad?.publisher_agent_id ??
    ad?.assigned_consultant_id ??
    ad?.assignedConsultantId ??
    ad?.consultant_id ??
    ad?.consultantId;
  const publisherAgencyId = ad?.publisher_agency_id ?? ad?.agency_id ?? ad?.agencyId;
  const rawConsultantId = publisherType === "agency" ? undefined : publisherAgentId;
  const assignedConsultantId =
    typeof rawConsultantId === "object"
      ? readEntityId(rawConsultantId)
      : rawConsultantId
        ? String(rawConsultantId)
        : undefined;
  const resolvedAgencyId =
    typeof publisherAgencyId === "object"
      ? readEntityId(publisherAgencyId)
      : publisherAgencyId
        ? String(publisherAgencyId)
        : undefined;

  const [publisherId, setPublisherId] = useState(() => {
    if (publisherType === "agency" && resolvedAgencyId) return `agency:${resolvedAgencyId}`;
    if (assignedConsultantId) return `consultant:${assignedConsultantId}`;
    if (publisherType === "agency")
      return publisherOptions.find((o) => o.type === "agency")?.id ?? "";
    return "";
  });
  const publisher = useMemo(() => {
    if (publisherId) {
      const found = publisherOptions.find((option) => option.id === publisherId);
      if (found) return found;
    }
    if (publisherType === "agency") {
      if (resolvedAgencyId) {
        const agencyOption = publisherOptions.find(
          (option) => option.id === `agency:${resolvedAgencyId}`,
        );
        if (agencyOption) return agencyOption;
      }
      const agencyFallback = publisherOptions.find((option) => option.type === "agency");
      if (agencyFallback) return agencyFallback;
    }
    if (assignedConsultantId) {
      const consultant = (consultantsQuery.data?.data ?? []).find(
        (c) =>
          String(c.agentId) === String(assignedConsultantId) ||
          String(c.userId) === String(assignedConsultantId),
      );
      if (consultant) {
        const id = consultant.agentId ?? consultant.userId;
        const opt = publisherOptions.find((option) => option.id === `consultant:${id}`);
        if (opt) return opt;
      }
      const directOpt = publisherOptions.find(
        (option) => option.id === `consultant:${assignedConsultantId}`,
      );
      if (directOpt) return directOpt;
    }
    return publisherOptions[0];
  }, [
    publisherId,
    publisherType,
    resolvedAgencyId,
    assignedConsultantId,
    publisherOptions,
    consultantsQuery.data?.data,
  ]);
  return { publisherOptions, publisherId, setPublisherId, publisher, changeConsultantMutation };
}
