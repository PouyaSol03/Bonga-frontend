import { useEffect, useMemo, useState } from "react";
import { useReducedMotion } from "motion/react";
import {
  useAssignPanelSupportRequestMutation,
  usePanelSupportRequestsQuery,
  useUpdatePanelSupportRequestStatusMutation,
} from "../../support/api/support.hooks";
import type { PanelSupportRequestStatus } from "../../support/api/panel-support.service";
import type { CrmRoutePageProps } from "../CrmLayout";
import { mapRequest, normalizeSearch } from "./supportHelpers";
import type { StatusFilter } from "./types";
import { useCrmSupportChat } from "./useCrmSupportChat";

export function useCrmSupportRequests({ notify, refreshNonce }: CrmRoutePageProps) {
  const prefersReducedMotion = Boolean(useReducedMotion());
  const [activeFilter, setActiveFilter] = useState<StatusFilter>("all");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("");
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRequestId, setSelectedRequestId] = useState("");
  const [assignUserId, setAssignUserId] = useState("");

  const filters = useMemo(
    () => ({
      category: category.trim() || undefined,
      page,
      perPage: 20,
      priority: priority || undefined,
      status: activeFilter === "all" ? undefined : activeFilter,
    }),
    [activeFilter, category, page, priority],
  );

  const requestsQuery = usePanelSupportRequestsQuery(filters);
  const assignMutation = useAssignPanelSupportRequestMutation();
  const statusMutation = useUpdatePanelSupportRequestStatusMutation();

  const requests = useMemo(
    () => (requestsQuery.data?.data ?? []).map(mapRequest).filter((request) => request.id),
    [requestsQuery.data?.data],
  );

  const filteredRequests = useMemo(() => {
    const search = normalizeSearch(searchQuery);
    if (!search) return requests;

    return requests.filter((request) =>
      [
        request.title,
        request.category,
        request.requestNumber,
        request.customerName,
        request.customerMobile,
        request.description,
      ]
        .join(" ")
        .toLocaleLowerCase("fa-IR")
        .includes(search),
    );
  }, [requests, searchQuery]);

  useEffect(() => {
    void requestsQuery.refetch();
  }, [refreshNonce]);

  useEffect(() => {
    if (selectedRequestId && filteredRequests.some((request) => request.id === selectedRequestId)) {
      return;
    }
    setSelectedRequestId(filteredRequests[0]?.id ?? "");
  }, [filteredRequests, selectedRequestId]);

  const selectedRequest = filteredRequests.find((request) => request.id === selectedRequestId);

  useEffect(() => {
    setAssignUserId(selectedRequest?.assignedSupportId ?? "");
  }, [selectedRequest?.assignedSupportId, selectedRequest?.id]);

  const changeStatus = (status: PanelSupportRequestStatus) => {
    if (!selectedRequest || status === selectedRequest.status) return;
    statusMutation.mutate(
      { requestId: selectedRequest.id, status },
      {
        onError: () => notify("تغییر وضعیت درخواست انجام نشد.", "error"),
        onSuccess: () => {
          notify("وضعیت درخواست بروزرسانی شد.");
          void requestsQuery.refetch();
        },
      },
    );
  };

  const assignRequest = () => {
    if (!selectedRequest) return;
    const supportUserId = Number(assignUserId);
    if (!Number.isInteger(supportUserId) || supportUserId <= 0) {
      notify("شناسه عددی کارشناس پشتیبانی را وارد کنید.", "error");
      return;
    }

    assignMutation.mutate(
      { requestId: selectedRequest.id, supportUserId },
      {
        onError: () => notify("تخصیص درخواست انجام نشد.", "error"),
        onSuccess: () => {
          notify("درخواست به کارشناس تخصیص داده شد.");
          void requestsQuery.refetch();
        },
      },
    );
  };

  const chat = useCrmSupportChat({
    changeStatus,
    notify,
    prefersReducedMotion,
    refetchRequests: () => void requestsQuery.refetch(),
    selectedRequest,
  });

  const total = requestsQuery.data?.total ?? requests.length;
  const perPage = requestsQuery.data?.perPage ?? 20;
  const hasNextPage = page * perPage < total;
  const counts = {
    all: activeFilter === "all" ? total : requests.length,
    open: requests.filter((request) => request.status === "open").length,
    reviewing: requests.filter((request) => request.status === "reviewing").length,
    closed: requests.filter((request) => request.status === "closed").length,
  };

  return {
    activeFilter,
    assignRequest,
    assignUserId,
    category,
    changeStatus,
    chat,
    counts,
    filteredRequests,
    hasNextPage,
    isAssignPending: assignMutation.isPending,
    isStatusPending: statusMutation.isPending,
    page,
    prefersReducedMotion,
    priority,
    requestsQuery,
    searchQuery,
    selectedRequest,
    selectedRequestId,
    setActiveFilter,
    setAssignUserId,
    setCategory,
    setPage,
    setPriority,
    setSearchQuery,
    setSelectedRequestId,
  };
}
