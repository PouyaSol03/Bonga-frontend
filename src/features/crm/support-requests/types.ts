import type { PanelSupportRequestStatus } from "../../support/api/panel-support.service";

export type StatusFilter = "all" | PanelSupportRequestStatus;

export type CrmSupportRequest = {
  assignedSupportId: string;
  attachmentName?: string;
  category: string;
  createdAt: string;
  customerMobile: string;
  customerName: string;
  description: string;
  id: string;
  priority: string;
  requestNumber: string;
  status: PanelSupportRequestStatus;
  threadId: string;
  title: string;
};

export const filterOptions: Array<{ id: StatusFilter; label: string }> = [
  { id: "all", label: "همه" },
  { id: "open", label: "باز" },
  { id: "reviewing", label: "در حال بررسی" },
  { id: "closed", label: "بسته شده" },
];

export const priorityOptions = [
  { label: "همه اولویت‌ها", value: "" },
  { label: "عادی", value: "normal" },
  { label: "مهم", value: "important" },
  { label: "فوری", value: "urgent" },
];

export const statusPresentation: Record<
  PanelSupportRequestStatus,
  { className: string; label: string }
> = {
  open: { className: "bg-[#e6f8ef] text-[#079455]", label: "باز" },
  reviewing: { className: "bg-[#eaf1ff] text-[#0048c4]", label: "در حال بررسی" },
  closed: { className: "bg-[#f1f1f1] text-[#808080]", label: "بسته شده" },
};
