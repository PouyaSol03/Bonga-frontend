export type RequestManagementTab = "received" | "requests" | "results";
export type RequestFilterId = "all" | string;

export type RequestManagementViewProps = {
  backTo: string;
  showReceivedTab?: boolean;
  variant?: "account" | "default";
};

export type RequestTabItem = {
  id: RequestManagementTab;
  label: string;
};

export type RequestToast = {
  message: string;
  title: string;
  variant: "error" | "success" | "info" | "warning";
};

export const receivedRequestsGuideStorageKey = "bonga-received-requests-guide-dismissed";
