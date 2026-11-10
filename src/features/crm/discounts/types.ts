import type { CrmDiscountServiceType } from "../api/crm-discount.service";

export type Notify = (message: string, tone?: "error" | "success") => void;
export type ViewProps = { notify: Notify; refreshNonce: number };

export type DiscountDraft = {
  code: string;
  discountPercent: string;
  services: CrmDiscountServiceType[];
  maxDiscountAmount: string;
  usageLimit: string;
  expireAt: string;
  description: string;
  isActive: boolean;
};

export const emptyDraft: DiscountDraft = {
  code: "",
  discountPercent: "",
  services: ["advertise", "package", "panel"],
  maxDiscountAmount: "",
  usageLimit: "",
  expireAt: "",
  description: "",
  isActive: true,
};

export const inputClass =
  "h-11 w-full rounded-xl border border-[#d7dce5] bg-white px-3 text-sm text-[#303030] outline-none focus:border-[#0048c4] focus:ring-2 focus:ring-[#0048c4]/10";

export const serviceLabels: Record<CrmDiscountServiceType, string> = {
  advertise: "ثبت و ارتقای آگهی",
  package: "بسته‌های اعتباری",
  panel: "اشتراک پنل",
};

export const serviceBadgeColors: Record<CrmDiscountServiceType, string> = {
  advertise: "bg-blue-50 text-blue-700 border-blue-200",
  package: "bg-amber-50 text-amber-700 border-amber-200",
  panel: "bg-purple-50 text-purple-700 border-purple-200",
};
