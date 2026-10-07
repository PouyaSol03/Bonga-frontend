export type PackageKind = "panel_subscription" | "credit_bundle";

export type PackageItem = {
  ad_credit: number;
  created_at: string;
  discount_percent: number;
  duration_days: number;
  final_price: number;
  id: string;
  is_active: boolean;
  kind: PackageKind;
  real_price: number;
  renew_credit: number;
  slug: string;
  sort_order: number;
  special_credit: number;
  title: string;
  updated_at: string;
};

export type PackagesApiResponse = {
  list?: PackageItem[];
  status?: boolean;
};

export type PackagePaymentType = 0 | 1;
export type PackagePaymentScope = "agency" | "agent" | "independent-consultant";

export type PackagePaymentPayload = {
  discountCode?: string;
  packageId: string | number;
  paymentType: PackagePaymentType;
  role?: string;
  scope?: PackagePaymentScope;
};

export type PackagePaymentResult = {
  authority?: string;
  paid?: boolean;
  paymentId?: number | string;
  paymentType: PackagePaymentType;
  paymentUrl?: string;
  scope: PackagePaymentScope;
};

export type PackageQueryParams = {
  role?: string;
  scope?: PackagePaymentScope;
};

export type AgentEntitlements = {
  adCreditBalance: number;
  panelDaysRemaining: number;
  panelExpiresAt: string | null;
  renewCreditBalance: number;
  specialCreditBalance: number;
};

export type AgentEntitlementLedgerItem = Record<string, unknown>;

export type AgentEntitlementLedgerPage = {
  data: AgentEntitlementLedgerItem[];
  hasNextPage: boolean;
  page: number;
  perPage: number;
  total: number;
};
