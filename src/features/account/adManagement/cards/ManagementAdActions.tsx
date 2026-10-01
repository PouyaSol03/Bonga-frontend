import React from "react";
import { RouteLink } from "../../../../shared/navigation/RouteLink";
import LinearArrowLeft1 from "../../../../shared/icons/LinearArrowLeft1";
import LinearPreview from "../../../../shared/icons/LinearPreview";
import LinearEdit2 from "../../../../shared/icons/LinearEdit2";
import LinearAnalytics from "../../../../shared/icons/LinearAnalytics";
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
    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#CCCCCC]/60 bg-white text-[#4D4D4D] shadow-sm transition hover:bg-gray-50 active:scale-95 no-underline";

  return (
    <div className="flex items-center justify-between gap-3 pt-3 [direction:rtl]">
      {/* Primary Action Button: میزکار آگهی */}
      {onDeskClick ? (
        <button
          className="flex h-10 items-center justify-center gap-1.5 rounded-[10px] bg-[#0048C4] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#003bb0] active:scale-95 cursor-pointer border-none"
          onClick={onDeskClick}
          type="button"
        >
          <span>میزکار آگهی</span>
          <LinearArrowLeft1 className="h-4 w-4" />
        </button>
      ) : (
        <RouteLink
          className="flex h-10 items-center justify-center gap-1.5 rounded-[10px] bg-[#0048C4] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#003bb0] active:scale-95 no-underline"
          state={state}
          to={effectiveDeskPath}
        >
          <span>میزکار آگهی</span>
          <LinearArrowLeft1 className="h-4 w-4" />
        </RouteLink>
      )}

      {/* Secondary Circular Actions */}
      <div className="flex items-center gap-2 [direction:ltr]">
        {/* Preview */}
        {onPreviewClick ? (
          <button
            aria-label="پیش‌نمایش آگهی"
            className={iconBtnClass}
            onClick={onPreviewClick}
            type="button"
          >
            <LinearPreview className="h-5 w-5" />
          </button>
        ) : (
          <RouteLink
            aria-label="پیش‌نمایش آگهی"
            className={iconBtnClass}
            to={effectivePreviewPath}
          >
            <LinearPreview className="h-5 w-5" />
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
