import type { MouseEvent, ReactNode } from "react";
import type { AdCardData } from "../../../advertisements/components/AdCard";
import type { AdvertisementItem } from "../../../advertisements/api/advertisement.service";
import type { MyAdStatusKey } from "../../myAdsStatus";

export type ManagementAdRoleType = "agency" | "agent" | "agent_in_agency";

export type ManagementAdMetrics = {
  views?: number | string;
  impressions?: number | string;
  calls?: number | string;
  chats?: number | string;
};

export type ManagementAdCardProps = {
  ad: AdCardData;
  sourceAd?: AdvertisementItem | Record<string, unknown>;
  roleType?: ManagementAdRoleType;
  publisherName?: string;
  roleLabel?: string;
  metrics?: ManagementAdMetrics;
  statusKey?: MyAdStatusKey | string;
  statusLabel?: string;
  showStatusBadge?: boolean;
  state?: unknown;
  to?: string;
  deskTo?: string;
  previewTo?: string;
  editTo?: string;
  analyticsTo?: string;
  onDeskClick?: (event: MouseEvent) => void;
  onPreviewClick?: (event: MouseEvent) => void;
  onEditClick?: (event: MouseEvent) => void;
  onAnalyticsClick?: (event: MouseEvent) => void;
  onDeleteIncomplete?: (event: MouseEvent) => void;
  className?: string;
  headerMeta?: ReactNode;
};
