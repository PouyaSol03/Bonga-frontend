import React from "react";
import { Link } from "react-router";
import LinearArrowLeft1 from "../../../../shared/icons/LinearArrowLeft1";
import LinearEdit2 from "../../../../shared/icons/LinearEdit2";
import LinearAnalytics from "../../../../shared/icons/LinearAnalytics";
import LinearDelete from "../../../../shared/icons/LinearDelete";
import { LinearMonitorCheck } from "../../../../shared/icons/LinearMonitorCheck";
import { Typography } from "../../../../shared/ui/Typography";
import {
  adManagementPaths,
  getAdEditPath,
  getAdPreviewPath,
  getAdStatePath,
} from "../adManagementData";
import { getMyAdStatusInfo } from "../../myAdsStatus";
import type { ManagementAdCardProps } from "./types";

type Props = Pick<
  ManagementAdCardProps,
  | "ad"
  | "sourceAd"
  | "statusKey"
  | "state"
  | "to"
  | "deskTo"
  | "previewTo"
  | "editTo"
  | "analyticsTo"
  | "onDeskClick"
  | "onPreviewClick"
  | "onEditClick"
  | "onAnalyticsClick"
  | "onDeleteIncomplete"
>;

export const ManagementAdActions: React.FC<Props> = ({
  ad,
  sourceAd,
  statusKey,
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
  onDeleteIncomplete,
}) => {
  const resolvedStatusKey = statusKey || (sourceAd ? getMyAdStatusInfo(sourceAd)?.key : undefined);
  const isIncomplete = resolvedStatusKey === "incomplete" || ad.status === "نیمه کاره";

  const effectiveDeskPath = deskTo || to || getAdStatePath(ad.id);
  const effectivePreviewPath = previewTo || getAdPreviewPath(ad.id);
  const effectiveEditPath = editTo || getAdEditPath(ad.id, adManagementPaths.root);
  const effectiveAnalyticsPath = analyticsTo || `${getAdStatePath(ad.id)}?businessTab=performance`;

  const deskState = state && typeof state === "object" ? { ...state } : { ad: sourceAd, card: ad };
  const analyticsState =
    state && typeof state === "object"
      ? { ...state, activeBusinessTab: "performance" as const }
      : { ad: sourceAd, card: ad, statisticsAd: ad, activeBusinessTab: "performance" as const };

  const iconBtnClass =
    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-transparent text-on-surface transition active:scale-95 no-underline cursor-pointer border-none";

  return (
    <div className="flex items-center justify-between pt-4 [direction:rtl]">
      {/* Main button: ad workspace */}
      {onDeskClick ? (
        <button
          className="bg-primary text-on-primary flex h-10 w-[136px] cursor-pointer items-center justify-between rounded-[10px] border-none px-4 text-xs font-semibold shadow-sm transition active:scale-95"
          onClick={onDeskClick}
          type="button"
        >
          <Typography
            as="span"
            variant="label"
            size="small"
            weight="semibold"
            className="text-on-primary text-xs font-semibold"
          >
            میزکار آگهی
          </Typography>
          <LinearArrowLeft1 className="h-4 w-4" />
        </button>
      ) : (
        <Link
          className="bg-primary text-on-primary flex h-10 w-[136px] items-center justify-between rounded-[10px] px-4 text-xs font-semibold no-underline shadow-sm transition active:scale-95"
          state={deskState}
          to={effectiveDeskPath}
        >
          <Typography
            as="span"
            variant="label"
            size="small"
            weight="semibold"
            className="text-on-primary text-xs font-semibold"
          >
            میزکار آگهی
          </Typography>
          <LinearArrowLeft1 className="h-4 w-4" />
        </Link>
      )}

      {/* Secondary Circular Actions */}
      <div className="flex items-center gap-6 [direction:rtl]">
        {/* Performance analytics */}
        {onAnalyticsClick ? (
          <button
            aria-label="عملکرد و آمار آگهی"
            className={iconBtnClass}
            onClick={onAnalyticsClick}
            type="button"
          >
            <LinearAnalytics className="h-5 w-5" />
          </button>
        ) : (
          <Link
            aria-label="عملکرد و آمار آگهی"
            className={iconBtnClass}
            state={analyticsState}
            to={effectiveAnalyticsPath}
          >
            <LinearAnalytics className="h-5 w-5" />
          </Link>
        )}

        {/* Edit ad */}
        {onEditClick ? (
          <button
            aria-label="ویرایش آگهی"
            className={iconBtnClass}
            onClick={onEditClick}
            type="button"
          >
            <LinearEdit2 className="h-5 w-5" />
          </button>
        ) : (
          <Link
            aria-label="ویرایش آگهی"
            className={iconBtnClass}
            state={{ returnTo: "/account/manage-ads" }}
            to={effectiveEditPath}
          >
            <LinearEdit2 className="h-5 w-5" />
          </Link>
        )}

        {/* Ad preview or Delete incomplete */}
        {isIncomplete ? (
          <button
            aria-label="حذف آگهی نیمه کاره"
            className={iconBtnClass}
            onClick={onDeleteIncomplete}
            type="button"
          >
            <LinearDelete className="h-5 w-5" />
          </button>
        ) : onPreviewClick ? (
          <button
            aria-label="پیش‌نمایش آگهی"
            className={iconBtnClass}
            onClick={onPreviewClick}
            type="button"
          >
            <LinearMonitorCheck className="h-5 w-5" />
          </button>
        ) : (
          <Link aria-label="پیش‌نمایش آگهی" className={iconBtnClass} to={effectivePreviewPath}>
            <LinearMonitorCheck className="h-5 w-5" />
          </Link>
        )}
      </div>
    </div>
  );
};
