export type CrmPaymentsViewProps = {
  notify: (message: string, tone?: "error" | "success") => void;
  refreshNonce: number;
};

export type PaymentStatus = "failed" | "pending" | "success" | "unknown";
export type PaymentMethod = "gateway" | "wallet" | "unknown";

export type PaymentFilterDraft = {
  status: string;
  paymentFor: string;
  paymentType: string;
  fromDate: string;
  toDate: string;
};

export const inputClassName =
  "h-10 w-full rounded-xl border border-[#cccccc] bg-white px-3 text-sm font-medium text-[#303030] outline-none transition placeholder:text-[#999999] focus:border-[#0048c4] focus:ring-2 focus:ring-[#0048c4]/10";

export const emptyDraft: PaymentFilterDraft = {
  status: "",
  paymentFor: "",
  paymentType: "",
  fromDate: "",
  toDate: "",
};
