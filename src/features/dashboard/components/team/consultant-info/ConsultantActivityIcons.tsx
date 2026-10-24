import React from "react";
import LinearTag from "../../../../../shared/icons/LinearTag";
import LinearClock from "../../../../../shared/icons/LinearClock";
import LinearViewOn from "../../../../../shared/icons/LinearViewOn";
import LinearBubbleChat from "../../../../../shared/icons/LinearBubbleChat";
import type { ActivityFilterType } from "./types";

const ActivityAdIcon: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div
    className={`bg-primary/10 text-primary flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${className}`}
  >
    <LinearTag className="h-5 w-5" />
  </div>
);

const ActivityFollowupIcon: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div
    className={`bg-warning/10 text-warning flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${className}`}
  >
    <LinearClock className="h-5 w-5" />
  </div>
);

const ActivityVisitIcon: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div
    className={`bg-success/10 text-success flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${className}`}
  >
    <LinearViewOn className="h-5 w-5" />
  </div>
);

const ActivityResponseIcon: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div
    className={`bg-tertiary/10 text-tertiary flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${className}`}
  >
    <LinearBubbleChat className="h-5 w-5" />
  </div>
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
