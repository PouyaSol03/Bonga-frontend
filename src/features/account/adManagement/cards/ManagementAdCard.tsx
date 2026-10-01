import React from "react";
import { ManagementAdHeader } from "./ManagementAdHeader";
import { ManagementAdMetrics } from "./ManagementAdMetrics";
import { ManagementAdActions } from "./ManagementAdActions";
import type { ManagementAdCardProps } from "./types";

export const ManagementAdCard: React.FC<ManagementAdCardProps> = ({
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
  onDeskClick,
  onPreviewClick,
  onEditClick,
  onAnalyticsClick,
  className = "",
  headerMeta,
}) => {
  return (
    <article
      className={`w-full overflow-hidden rounded-xl bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.06)] border border-gray-100 [direction:rtl] ${className}`}
    >
      {/* Optional Top Meta (e.g. countdown for assigned ads) */}
      {headerMeta ? <div className="mb-3">{headerMeta}</div> : null}

      {/* Card Header (Thumbnail, Title, Badge, Name/Role) */}
      <ManagementAdHeader
        ad={ad}
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

      {/* Metrics Row (Views, Impressions, Calls, Chats) */}
      <ManagementAdMetrics
        metrics={metrics}
        sourceAd={sourceAd as Record<string, unknown> | undefined}
      />

      {/* Horizontal Divider */}
      <div className="h-px w-full bg-[#CCCCCC]/60" />

      {/* Actions (Ad Desk button, Preview, Edit, Analytics) */}
      <ManagementAdActions
        ad={ad}
        analyticsTo={analyticsTo}
        deskTo={deskTo}
        editTo={editTo}
        onAnalyticsClick={onAnalyticsClick}
        onDeskClick={onDeskClick}
        onEditClick={onEditClick}
        onPreviewClick={onPreviewClick}
        previewTo={previewTo}
        sourceAd={sourceAd}
        state={state}
        to={to}
      />
    </article>
  );
};
