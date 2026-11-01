import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { useAgencyConsultantsQuery } from "../../../agencies/api/agency.hooks";
import {
  getAdManagementRouteState,
  getAdPaymentPath,
  markAgencyAllocationCheckout,
  type ConsultantAd,
} from "../adManagementData";
import type { AgencyAdvertiseAssignmentDto } from "../../../advertisements/api/agency-advertise-assignment.service";
import type {
  IndependentConsultantAdAllocationReviewPageProps,
  PublisherType,
  SelectableConsultant,
} from "./types";
import { extractAdvertiserPhone } from "./allocationHelpers";

export function useAdAllocationState(
  props?: IndependentConsultantAdAllocationReviewPageProps,
  ad?: ConsultantAd,
  assignment?: AgencyAdvertiseAssignmentDto,
) {
  const navigate = useNavigate();
  const routeState = getAdManagementRouteState();

  const [publisher, setPublisher] = useState<PublisherType>(
    props?.initialPublisherType ??
      (routeState.publisherType === "consultant" ? "consultant" : undefined) ??
      (assignment?.targetType === "consultant" ? "consultant" : "agency"),
  );
  const [assignedConsultant, setAssignedConsultant] = useState<SelectableConsultant | null>(
    props?.initialAssignedConsultant ?? null,
  );
  const [isConsultantPickerOpen, setIsConsultantPickerOpen] = useState(
    props?.initialConsultantPickerOpen ?? false,
  );

  const consultantsQuery = useAgencyConsultantsQuery({
    enabled: !props?.mockConsultants && (isConsultantPickerOpen || publisher === "consultant"),
    page: 1,
    perPage: 100,
  });

  const mockConsultants = props?.mockConsultants;
  const selectableConsultants = useMemo(
    () =>
      mockConsultants ??
      (consultantsQuery.data?.data ?? []).map((consultant) => {
        const id = String(consultant.agentId ?? consultant.userId);
        return {
          avatarSrc: consultant.avatar,
          id,
          name: consultant.name || `مشاور شماره ${id}`,
        };
      }),
    [mockConsultants, consultantsQuery.data],
  );

  const initialConsultantId = String(routeState.consultantId ?? assignment?.consultantId ?? "");
  const assignmentId = routeState.assignmentId ?? assignment?.id;

  const primaryActionLabel =
    publisher === "consultant"
      ? assignedConsultant
        ? "پرداخت"
        : "انتخاب مشاور"
      : "ادامه و پرداخت";

  const advertiserPhone = extractAdvertiserPhone(ad, assignment);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (assignedConsultant || !initialConsultantId) return;

      const currentConsultant = selectableConsultants.find(
        (consultant) => consultant.id === initialConsultantId,
      );

      if (currentConsultant) {
        setAssignedConsultant(currentConsultant);
        setPublisher("consultant");
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [assignedConsultant, initialConsultantId, selectableConsultants]);

  function navigateToPayment(consultant = assignedConsultant) {
    if (!ad) return;
    markAgencyAllocationCheckout(ad.id);
    navigate(getAdPaymentPath(ad.id), {
      state: {
        ad,
        assignment,
        assignmentId: assignment?.id,
        consultantAssignmentSelected: publisher === "consultant" && Boolean(consultant),
        consultantChanged: publisher === "consultant" && Boolean(consultant),
        consultantId: publisher === "consultant" ? consultant?.id : undefined,
        paymentFlow: "agency-allocation",
        publisherType: publisher,
        tab: "status",
      },
    });
  }

  function handlePrimaryAction() {
    if (publisher === "consultant" && !assignedConsultant) {
      setIsConsultantPickerOpen(true);
      return;
    }

    navigateToPayment();
  }

  return {
    advertiserPhone,
    assignedConsultant,
    assignmentId,
    consultantsQuery,
    handlePrimaryAction,
    isConsultantPickerOpen,
    navigateToPayment,
    primaryActionLabel,
    publisher,
    selectableConsultants,
    setAssignedConsultant,
    setIsConsultantPickerOpen,
    setPublisher,
  };
}
