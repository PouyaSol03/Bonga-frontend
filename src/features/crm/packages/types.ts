import type { CrmPackageKind, CrmPackagePayload, CrmRecord } from "../api/crm.service";

export type { CrmPackageKind, CrmPackagePayload, CrmRecord };

export type Notify = (message: string, tone?: "error" | "success") => void;

export type ViewProps = {
  notify: Notify;
  refreshNonce: number;
};

export interface PackageDraft {
  adCredit: string;
  discountPercent: string;
  durationDays: string;
  isActive: boolean;
  kind: CrmPackageKind;
  realPrice: string;
  renewCredit: string;
  slug: string;
  sortOrder: string;
  specialCredit: string;
  title: string;
}

export const emptyDraft: PackageDraft = {
  adCredit: "",
  discountPercent: "",
  durationDays: "",
  isActive: true,
  kind: "panel_subscription",
  realPrice: "",
  renewCredit: "",
  slug: "",
  sortOrder: "",
  specialCredit: "",
  title: "",
};
