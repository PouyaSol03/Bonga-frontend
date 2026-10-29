export type WalletPayment = Record<string, unknown> & {
  created_at?: string;
  id?: string;
  price?: number | string;
  ref_id?: number | string | null;
  status?: number | string;
};

export type WalletResult = {
  credit: number | string;
};

export type WalletPaymentsResult = {
  page: number;
  perPage: number;
  payments: WalletPayment[];
  total: number;
};

export type PaymentHistoryMetadata = {
  package_kind?: string;
  package_scope?: string;
  package_title?: string;
  title?: string;
  kind?: string;
  [key: string]: unknown;
};

export type PaymentHistoryItem = {
  id: number | string;
  _id: number | string;
  status: "registered" | "paid" | "failed" | "unknown";
  status_code: number;
  payment_type: "gateway" | "wallet" | "unknown";
  payment_type_code: number;
  payment_for: "advertise" | "wallet_charge" | "package" | "advertise_checkout" | "unknown";
  payment_for_code: number;
  price: number;
  ref_code: string | number | null;
  created_at: string;
  package_id?: number | string | null;
  metadata?: PaymentHistoryMetadata | null;
};

export type AccountCreditHistoryPage = {
  data: PaymentHistoryItem[];
  hasNextPage: boolean;
  page: number;
  perPage: number;
  total: number;
};

export type ChargeWalletPayload = {
  price: number;
};

export type ChargeWalletResult = {
  authority?: string;
  paymentId?: string;
  paymentUrl: string;
};

export type PaymentCallbackPayload = {
  Authority: string;
  Status: string;
};

export type PaymentCallbackResult = {
  redirectUrl: string;
  success: boolean;
};
