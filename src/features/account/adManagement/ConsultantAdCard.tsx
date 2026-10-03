import React from "react";
import type { ConsultantAd } from "./adManagementData";
import type { AdvertisementItem } from "../../advertisements/api/advertisement.service";
import { ManagementAdCard } from "./cards/ManagementAdCard";
import type { ManagementAdMetrics, ManagementAdRoleType } from "./cards/types";

export type ConsultantAdCardProps = {
  ad: ConsultantAd;
  sourceAd?: AdvertisementItem | Record<string, unknown>;
  roleType?: ManagementAdRoleType;
  publisherName?: string;
  roleLabel?: string;
  metrics?: ManagementAdMetrics;
  statusKey?: string;
  statusLabel?: string;
  showStatusBadge?: boolean;
  state?: unknown;
  to?: string;
  deskTo?: string;
  previewTo?: string;
  editTo?: string;
  analyticsTo?: string;
  onDeleteIncomplete?: (event: React.MouseEvent) => void;
  className?: string;
  headerMeta?: React.ReactNode;
};

export function ConsultantAdCard({
  ad,
  sourceAd,
  roleType,
  publisherName,
  roleLabel,
  metrics,
  statusKey,
  statusLabel,
  showStatusBadge = true,
  state,
  to,
  deskTo,
  previewTo,
  editTo,
  analyticsTo,
  onDeleteIncomplete,
  className,
  headerMeta,
}: ConsultantAdCardProps) {
  return (
    <ManagementAdCard
      ad={ad}
      analyticsTo={analyticsTo}
      className={className}
      deskTo={deskTo}
      editTo={editTo}
      headerMeta={headerMeta}
      metrics={metrics}
      onDeleteIncomplete={onDeleteIncomplete}
      previewTo={previewTo}
      publisherName={publisherName}
      roleLabel={roleLabel}
      roleType={roleType}
      showStatusBadge={showStatusBadge}
      sourceAd={sourceAd}
      state={state}
      statusKey={statusKey}
      statusLabel={statusLabel}
      to={to}
    />
  );
}
