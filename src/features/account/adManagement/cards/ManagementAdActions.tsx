import React from "react";
import { RouteLink } from "../../../../shared/navigation/RouteLink";
import LinearArrowLeft1 from "../../../../shared/icons/LinearArrowLeft1";
import LinearEdit2 from "../../../../shared/icons/LinearEdit2";
import LinearAnalytics from "../../../../shared/icons/LinearAnalytics";
import { LinearMonitorCheck } from "../../../../shared/icons/LinearMonitorCheck";
import { getAdEditPath, getAdStatePath, adManagementPaths } from "../adManagementData";
import type { ManagementAdCardProps } from "./types";

type Props = Pick<
  ManagementAdCardProps,
  | "ad"
  | "sourceAd"
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
>;

export const ManagementAdActions: React.FC<Props> = ({
  ad,
  sourceAd,
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
}) => {
  const effectiveDeskPath = deskTo || to || getAdStatePath(ad.id);
  const effectivePreviewPath = previewTo || `/ads/${ad.id}`;
  const effectiveEditPath = editTo || getAdEditPath(ad.id);
  const effectiveAnalyticsPath =
    analyticsTo || adManagementPaths.statisticsDetails || "/account/ad-management/statistics";

  const analyticsState = { ad: sourceAd, statisticsAd: ad };

  const iconBtnClass =
    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-transparent text-[#1A1A1A] transition hover:bg-neutral-100 active:scale-95 no-underline cursor-pointer border-none";

  return (
    <div className="flex items-center justify-between pt-4 [direction:rtl]">
      {/* Primary Action Button: میزکار آگهی */}
      {onDeskClick ? (
        <button
          className="flex h-10 w-[136px] items-center justify-between rounded-[10px] bg-[#0048C4] px-4 text-xs font-semibold text-white shadow-sm transition hover:bg-[#003bb0] active:scale-95 cursor-pointer border-none"
          onClick={onDeskClick}
          type="button"
        >
          <span>میزکار آگهی</span>
          <LinearArrowLeft1 className="h-4 w-4" />
        </button>
      ) : (
        <RouteLink
          className="flex h-10 w-[136px] items-center justify-between rounded-[10px] bg-[#0048C4] px-4 text-xs font-semibold text-white shadow-sm transition hover:bg-[#003bb0] active:scale-95 no-underline"
          state={state}
          to={effectiveDeskPath}
        >
          <span>میزکار آگهی</span>
          <LinearArrowLeft1 className="h-4 w-4" />
        </RouteLink>
      )}

      {/* Secondary Circular Actions */}
      <div className="flex items-center gap-6 [direction:ltr]">
        {/* Preview / Monitor Check */}
        {onPreviewClick ? (
          <button
            aria-label="پیش‌نمایش آگهی"
            className={iconBtnClass}
            onClick={onPreviewClick}
            type="button"
          >
            <LinearMonitorCheck className="h-5 w-5" />
          </button>
        ) : (
          <RouteLink
            aria-label="پیش‌نمایش آگهی"
            className={iconBtnClass}
            to={effectivePreviewPath}
          >
            <LinearMonitorCheck className="h-5 w-5" />
          </RouteLink>
        )}

        {/* Edit */}
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
          <RouteLink
            aria-label="ویرایش آگهی"
            className={iconBtnClass}
            state={{ returnTo: "/account/manage-ads" }}
            to={effectiveEditPath}
          >
            <LinearEdit2 className="h-5 w-5" />
          </RouteLink>
        )}

        {/* Analytics */}
        {onAnalyticsClick ? (
          <button
            aria-label="آمار آگهی"
            className={iconBtnClass}
            onClick={onAnalyticsClick}
            type="button"
          >
            <LinearAnalytics className="h-5 w-5" />
          </button>
        ) : (
          <RouteLink
            aria-label="آمار آگهی"
            className={iconBtnClass}
            state={analyticsState}
            to={effectiveAnalyticsPath}
          >
            <LinearAnalytics className="h-5 w-5" />
          </RouteLink>
        )}
      </div>
    </div>
  );
};
