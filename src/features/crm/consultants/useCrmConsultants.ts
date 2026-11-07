import { useState, useMemo } from "react";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { useDebouncedValue } from "../../../shared/hooks/useDebouncedValue";
import { getApiErrorMessage } from "../../../shared/api/api";
import {
  createCrmConsultant,
  listCrmAgents,
  type CrmConsultantStatus,
  listCrmAgencies,
  type CrmRecord,
  type CrmConsultantPayload,
  updateCrmConsultant,
  getCrmRecordId,
} from "../api/crm.service";
import {
  fullName,
  readText,
  useQueryErrorToast,
  type ConfirmState,
  type CrmRoutePageProps,
  type EditorState,
} from "../CrmLayout";
import { buildConsultantEditorState, filterConsultants } from "./consultantHelpers";
import type { ConsultantFilters } from "./types";

export function useCrmConsultants({ notify, refreshNonce }: CrmRoutePageProps) {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search.trim(), 350);
  const [statusFilter, setStatusFilter] = useState("");
  const [agencyOnly, setAgencyOnly] = useState(false);
  const [agencyIdFilter, setAgencyIdFilter] = useState("");
  const [editor, setEditor] = useState<EditorState | null>(null);
  const [confirm, setConfirm] = useState<ConfirmState | null>(null);

  const appliedFilters: ConsultantFilters = useMemo(
    () => ({
      agencyId: agencyOnly ? agencyIdFilter : "",
      agencyOnly,
      search: debouncedSearch,
      status: statusFilter,
    }),
    [agencyIdFilter, agencyOnly, debouncedSearch, statusFilter],
  );

  const usersQuery = useQuery({
    queryFn: () =>
      listCrmAgents({
        agencyId: appliedFilters.agencyId || undefined,
        page: 1,
        perPage: 100,
        search: appliedFilters.search || undefined,
        status:
          appliedFilters.status === "" ? undefined : (appliedFilters.status as CrmConsultantStatus),
        type: appliedFilters.agencyOnly ? "dependent" : undefined,
      }),
    queryKey: [
      "crm",
      "consultants",
      "agents",
      appliedFilters.search,
      appliedFilters.status,
      appliedFilters.agencyOnly,
      appliedFilters.agencyId,
      refreshNonce,
    ],
  });

  const agenciesQuery = useQuery({
    queryFn: () => listCrmAgencies(),
    queryKey: ["crm", "consultants", "agencies", refreshNonce],
  });

  useQueryErrorToast([usersQuery.error, agenciesQuery.error], notify);

  const saveMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string | null; payload: CrmConsultantPayload }) =>
      id ? updateCrmConsultant(id, payload) : createCrmConsultant(payload),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["crm", "consultants"] }),
        queryClient.invalidateQueries({ queryKey: ["crm", "users"] }),
        queryClient.invalidateQueries({ queryKey: ["crm", "overview", "users"] }),
      ]);
      notify("اطلاعات مشاور ذخیره شد.");
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({
      consultant,
      status,
    }: {
      consultant: CrmRecord;
      status: Exclude<CrmConsultantStatus, "pending">;
    }) => {
      const id = getCrmRecordId(consultant);
      return updateCrmConsultant(id, { status });
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["crm", "consultants"] }),
        queryClient.invalidateQueries({ queryKey: ["crm", "users"] }),
      ]);
      notify("وضعیت مشاور تغییر کرد.");
    },
    onError: (error) => {
      notify(getApiErrorMessage(error, "تغییر وضعیت مشاور ناموفق بود."), "error");
    },
  });

  const agencies = agenciesQuery.data ?? [];
  const agencyNames = useMemo<Map<string, string>>(
    () =>
      new Map<string, string>(
        agencies.map((agency) => [
          getCrmRecordId(agency),
          readText(agency, ["name", "title"], "آژانس بدون نام"),
        ]),
      ),
    [agencies],
  );

  const consultants = useMemo(
    () => filterConsultants(usersQuery.data ?? [], appliedFilters, agencyNames),
    [agencyNames, appliedFilters, usersQuery.data],
  );

  const openConsultantEditor = (consultant: CrmRecord = {}) => {
    setEditor(
      buildConsultantEditorState(consultant, agencies, async (id, payload) => {
        await saveMutation.mutateAsync({ id, payload });
      }),
    );
  };

  const handleRequestStatusChange = (consultant: CrmRecord, status: "accept" | "reject") => {
    const isAccept = status === "accept";
    setConfirm({
      body: `آیا از ${isAccept ? "تأیید" : "رد درخواست"} مشاور «${fullName(consultant)}» اطمینان دارید؟ به کاربر اعلان ارسال خواهد شد.`,
      confirmLabel: isAccept ? "تایید مشاور" : "رد درخواست",
      onConfirm: async () => {
        await statusMutation.mutateAsync({ consultant, status });
      },
      title: isAccept ? "تایید مشاور" : "رد مشاور",
    });
  };

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("");
    setAgencyOnly(false);
    setAgencyIdFilter("");
  };

  return {
    agencies,
    agencyIdFilter,
    agencyNames,
    agencyOnly,
    clearFilters,
    confirm,
    consultants,
    editor,
    handleRequestStatusChange,
    isActionPending: saveMutation.isPending || statusMutation.isPending,
    isLoading: usersQuery.isLoading || agenciesQuery.isLoading,
    openConsultantEditor,
    saveMutation,
    search,
    setAgencyIdFilter,
    setAgencyOnly,
    setConfirm,
    setEditor,
    setSearch,
    setStatusFilter,
    statusFilter,
  };
}
