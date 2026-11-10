import type { CrmRecord } from "../api/crm.service";
import type { CrmRoutePageProps, EditorState, ConfirmState } from "../CrmLayout";

export type ConsultantFilters = {
  agencyId: string;
  agencyOnly: boolean;
  search: string;
  status: string;
};

export type CrmConsultantsModalsProps = {
  confirm: ConfirmState | null;
  editor: EditorState | null;
  isPending: boolean;
  notify: CrmRoutePageProps["notify"];
  onCloseConfirm: () => void;
  onCloseEditor: () => void;
};

export type CrmConsultantsTableProps = {
  agencyNames: Map<string, string>;
  consultants: CrmRecord[];
  isActionPending: boolean;
  isLoading: boolean;
  onEdit: (consultant: CrmRecord) => void;
  onRequestStatusChange: (consultant: CrmRecord, status: "accept" | "reject") => void;
};

export type CrmConsultantsFiltersProps = {
  agencies: CrmRecord[];
  agencyIdFilter: string;
  agencyOnly: boolean;
  onAgencyIdFilterChange: (id: string) => void;
  onAgencyOnlyChange: (enabled: boolean) => void;
  onClear: () => void;
  onSearchChange: (search: string) => void;
  onStatusFilterChange: (status: string) => void;
  search: string;
  statusFilter: string;
};
