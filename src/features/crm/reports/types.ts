import LinearAdvertisiment from "../../../shared/icons/LinearAdvertisiment";
import LinearUserAccount from "../../../shared/icons/LinearUserAccount";
import type { CrmReportKind, CrmReportListResult } from "../api/crm.service";

export type CrmReportsViewProps = {
  notify: (message: string, tone?: "error" | "success") => void;
  refreshNonce: number;
};

export type ReportQueryState = {
  data?: CrmReportListResult;
  isError: boolean;
  isFetching: boolean;
  isLoading: boolean;
  refetch: () => Promise<unknown>;
};

export type ReportStatusTone = "danger" | "info" | "neutral" | "success" | "warning";

export const PAGE_SIZE = 20;

export const tabs: Array<{
  description: string;
  icon: typeof LinearAdvertisiment;
  id: CrmReportKind;
  label: string;
}> = [
  {
    id: "advertise",
    label: "گزارش آگهی‌ها",
    description: "گزارش‌هایی که از صفحه جزئیات آگهی ثبت شده‌اند",
    icon: LinearAdvertisiment,
  },
  {
    id: "user",
    label: "گزارش کاربران",
    description: "گزارش‌هایی که از گفت‌وگو برای کاربر مقابل ثبت شده‌اند",
    icon: LinearUserAccount,
  },
];

export const statusPresentation: Record<ReportStatusTone, string> = {
  danger: "bg-[#fff0f1] text-[#c6283a]",
  info: "bg-[#eaf1ff] text-[#0048c4]",
  neutral: "bg-[#f1f2f4] text-[#667085]",
  success: "bg-[#e9f8f0] text-[#087a4b]",
  warning: "bg-[#fff7df] text-[#936200]",
};
