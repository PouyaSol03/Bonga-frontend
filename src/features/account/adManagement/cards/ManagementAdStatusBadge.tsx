import React from "react";
import { Typography } from "../../../../shared/ui/Typography";
import { getMyAdStatusInfo, myAdStatusConfig, type MyAdStatusKey } from "../../myAdsStatus";

type Props = {
  statusKey?: MyAdStatusKey | string;
  label?: string;
  source?: unknown;
  className?: string;
};

export const ManagementAdStatusBadge: React.FC<Props> = ({
  statusKey,
  label,
  source,
  className = "",
}) => {
  const statusInfo = source ? getMyAdStatusInfo(source) : undefined;
  const key = (statusKey || statusInfo?.key || "published") as MyAdStatusKey;
  const displayLabel = label || statusInfo?.label || "منتشر شده";
  const badgeClass = myAdStatusConfig[key]?.badgeClassName || "bg-surface-container text-outline";

  return (
    <Typography
      as="span"
      variant="label"
      size="small"
      weight="medium"
      className={`inline-flex h-7 items-center justify-center rounded-[8px] px-3 text-[12px] font-normal leading-none shrink-0 ${badgeClass} ${className}`}
    >
      {displayLabel}
    </Typography>
  );
};
