import type { AdCardData } from "../../advertisements/components/AdCard";
import "../../advertisements/components/AdCard.css";
import { type ViewAdBusinessTabKey } from "../../advertisements/view/components/ViewAdBusinessTabs";
import { type AgencyAssignedDeletedVariant } from "../components/AgencyAssignedUserAdView";
import { type MyAdStatusKey } from "../myAdsStatus";

export type MyAdRouteState = {
  ad?: Record<string, unknown>;
  card?: AdCardData;
  status?: MyAdStatusKey | string;
  tab?: string;
  activeBusinessTab?: ViewAdBusinessTabKey;
  editReturnTo?: string;
  isEditMode?: boolean;
  returnTo?: string;
  isAssigned?: boolean;
  deletedVariant?: AgencyAssignedDeletedVariant;
  initialStopPublishOpen?: boolean;
  initialCancelAssignmentOpen?: boolean;
  initialDealResultOpen?: boolean;
};

export type StateActionKey =
  | "call"
  | "chat"
  | "delete"
  | "edit"
  | "history"
  | "payment"
  | "preview"
  | "result"
  | "stats"
  | "stop_publish"
  | "upgrade";

export type StateAction = {
  icon: StateActionKey;
  label: string;
  onClick?: () => void;
  to?: string;
};

export type AccountMyAdStatePageProps = {
  ad?: Record<string, unknown>;
  card?: AdCardData;
  status?: MyAdStatusKey | string;
  activeBusinessTab?: ViewAdBusinessTabKey;
  role?: string;
  backTo?: string;
  onBack?: () => void;
  isAssigned?: boolean;
  deletedVariant?: AgencyAssignedDeletedVariant;
  initialStopPublishOpen?: boolean;
  initialCancelAssignmentOpen?: boolean;
  initialDealResultOpen?: boolean;
};

export type ManagerPublisher = {
  id: string;
  image?: string;
  name: string;
  type: "agency" | "consultant";
};
