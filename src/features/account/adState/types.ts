import type { AdCardData } from "../../advertisements/components/AdCard";

export type AssignedDeletedVariant = "deal_confirmation" | "recovery_expired" | "user_stopped";

export type AssignedAdVariant =
  | "archived"
  | "deal-confirmation"
  | "published"
  | "recovery-expired"
  | "user-stopped"
  | "waiting-agency"
  | "waiting-repost";

export type AssignedAdFlow =
  | "cancel-assignment"
  | "deal-result"
  | "details"
  | "stop-publish";

export type AssignedAdPrimaryAction =
  | "cancel-assignment"
  | "none"
  | "repost"
  | "restore"
  | "stop-publish"
  | "submit-result";

export type TimelineTone = "danger" | "neutral" | "primary" | "success" | "warning";

export type AssignedAdTimelineItem = {
  accent?: string;
  accentTone?: TimelineTone;
  after?: string;
  before: string;
  time: string;
};

export type AssignedAdStateModel = {
  agencyName: string;
  badgeLabel: string;
  card: AdCardData;
  category: string;
  expiresAt: string;
  primaryAction: AssignedAdPrimaryAction;
  publishedAt: string;
  timeline: AssignedAdTimelineItem[];
  variant: AssignedAdVariant;
};

export type BuildAssignedAdStateModelInput = {
  ad?: Record<string, unknown>;
  card: AdCardData;
  deletedVariant?: AssignedDeletedVariant;
  statusKey: string;
};
