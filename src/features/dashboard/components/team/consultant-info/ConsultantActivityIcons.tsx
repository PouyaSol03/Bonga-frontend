import React from "react";
import LinearTag from "../../../../../shared/icons/LinearTag";
import LinearClock from "../../../../../shared/icons/LinearClock";
import LinearViewOn from "../../../../../shared/icons/LinearViewOn";
import LinearBubbleChat from "../../../../../shared/icons/LinearBubbleChat";
import LinearArrowDown1 from "../../../../../shared/icons/LinearArrowDown1";
import LinearArrowLeft1 from "../../../../../shared/icons/LinearArrowLeft1";
import type { ActivityFilterType } from "./types";

export const ActivityAdIcon: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div
    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary ${className}`}
  >
    <LinearTag className="h-5 w-5" />
  </div>
);

export const ActivityFollowupIcon: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div
    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-warning/10 text-warning ${className}`}
  >
    <LinearClock className="h-5 w-5" />
  </div>
);

export const ActivityVisitIcon: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div
    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-success/10 text-success ${className}`}
  >
    <LinearViewOn className="h-5 w-5" />
  </div>
);

export const ActivityResponseIcon: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div
    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-tertiary/10 text-tertiary ${className}`}
  >
    <LinearBubbleChat className="h-5 w-5" />
  </div>
);

export const ChevronDownSmIcon: React.FC<{ className?: string }> = ({ className = "h-4 w-4 text-on-surface-var" }) => (
  <LinearArrowDown1 className={className} />
);

export const ChevronRightSmIcon: React.FC<{ className?: string }> = ({ className = "h-4 w-4 text-primary" }) => (
  <LinearArrowLeft1 className={className} />
);

export const ActivityItemIcon: React.FC<{ type: ActivityFilterType }> = ({ type }) => {
  switch (type) {
    case "ad":
      return <ActivityAdIcon />;
    case "followup":
      return <ActivityFollowupIcon />;
    case "visit":
      return <ActivityVisitIcon />;
    case "response":
      return <ActivityResponseIcon />;
    default:
      return <ActivityAdIcon />;
  }
};
