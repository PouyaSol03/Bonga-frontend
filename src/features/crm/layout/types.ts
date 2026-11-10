export type CrmSection =
  | "advertises"
  | "users"
  | "consultants"
  | "agencies"
  | "categories"
  | "locations"
  | "forms"
  | "packages"
  | "payments"
  | "costs"
  | "reports"
  | "requests"
  | "propertyRequests"
  | "support"
  | "discounts"
  | "feedback";

export type ToastState = {
  id: number;
  message: string;
  tone: "error" | "success";
};

export type CrmRoutePageProps = {
  notify: (message: string, tone?: ToastState["tone"]) => void;
  refreshNonce: number;
};

export type ModalField = {
  label: string;
  name: string;
  options?: Array<{ label: string; value: string }>;
  placeholder?: string;
  type?:
    | "checklist"
    | "email"
    | "geofence"
    | "map-point"
    | "neighborhood-multi"
    | "number"
    | "select"
    | "sub-neighborhoods"
    | "textarea"
    | "text";
  value?: unknown;
};

export type EditorState = {
  fields: ModalField[];
  onSubmit: (values: Record<string, string>) => Promise<void>;
  title: string;
};

export type ConfirmState = {
  body: string;
  confirmLabel?: string;
  onConfirm: (promptValue?: string) => Promise<void>;
  prompt?: {
    label: string;
    placeholder?: string;
    required?: boolean;
  };
  title: string;
};
export type CrmSubNeighborhoodDraft = {
  geofence: unknown;
  id: string;
  name: string;
};
export type IconName =
  | "account"
  | "ads"
  | "arrow"
  | "building"
  | "category"
  | "check"
  | "close"
  | "desktop"
  | "empty"
  | "filter"
  | "form"
  | "home"
  | "location"
  | "plus"
  | "refresh"
  | "save"
  | "search"
  | "users"
  | "warning"
  | "wallet"
  | "payment"
  | "reports"
  | "requests"
  | "settings"
  | "support";
