import type { AdCardData } from "../../advertisements/components/AdCard";

export type AgencyAssignedDeletedVariant =
  | "deal_confirmation"
  | "user_stopped"
  | "recovery_expired";

export type AgencyAssignedUserAdViewProps = {
  ad?: Record<string, unknown>;
  card: AdCardData;
  statusKey: string;
  adId?: string | number;
  backTo?: string;
  backState?: Record<string, unknown>;
  onRefetch?: () => Promise<unknown> | void;
  initialCancelAssignmentOpen?: boolean;
  initialRepostChoiceOpen?: boolean;
  deletedVariant?: AgencyAssignedDeletedVariant;
  onNavigateToStopPublish?: () => void;
  onNavigateToDealResult?: () => void;
};
