import React from "react";
import { RouteLink } from "../../../../shared/navigation/RouteLink";
import LinearImage from "../../../../shared/icons/LinearImage";
import { Typography } from "../../../../shared/ui/Typography";
import { ManagementAdStatusBadge } from "./ManagementAdStatusBadge";
import type { ManagementAdCardProps } from "./types";

type Props = Pick<
  ManagementAdCardProps,
  | "ad"
  | "sourceAd"
  | "roleType"
  | "publisherName"
  | "roleLabel"
  | "statusKey"
  | "statusLabel"
  | "showStatusBadge"
  | "to"
  | "state"
>;

function resolveRoleSubtitle(
  roleType?: Props["roleType"],
  publisherName?: string,
  roleLabel?: string,
  adPublisher?: string,
  adAgency?: string,
) {
  const name =
    publisherName?.trim() ||
    adPublisher?.trim() ||
    adAgency?.trim() ||
    (roleType === "agency" ? "آژانس املاک" : "مشاور");

  const role =
    roleLabel?.trim() ||
    (roleType === "agency"
      ? "آژانس"
      : roleType === "agent"
        ? "مشاور مستقل"
        : "مشاور");

  return { name, role };
}

export const ManagementAdHeader: React.FC<Props> = ({
  ad,
  sourceAd,
  roleType,
  publisherName,
  roleLabel,
  statusKey,
  statusLabel,
  showStatusBadge = true,
  to,
  state,
}) => {
  const { name, role } = resolveRoleSubtitle(
    roleType,
    publisherName,
    roleLabel,
    ad.agency,
  );

  const titleNode = (
    <Typography
      as="h3"
      variant="title"
      size="small"
      weight="semibold"
      className="truncate text-[13px] font-bold text-on-surface leading-tight text-right m-0"
    >
      {ad.title}
    </Typography>
  );

  return (
    <div className="flex items-center gap-3 [direction:rtl]">
      <div className="relative h-20 w-[120px] shrink-0 overflow-hidden rounded-[8px] bg-surface-container">
        {ad.imageUrl ? (
          <img
            alt={ad.title}
            className="h-full w-full object-cover"
            loading="lazy"
            src={ad.imageUrl}
            onError={(e) => {
              e.currentTarget.style.display = "none";
              const parent = e.currentTarget.parentElement;
              if (parent && !parent.querySelector(".fallback-svg")) {
                const fallback = document.createElement("div");
                fallback.className = "flex h-full w-full items-center justify-center text-on-surface-var fallback-svg";
                fallback.innerHTML = `<svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>`;
                parent.appendChild(fallback);
              }
            }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-on-surface-var">
            <LinearImage className="h-6 w-6" />
          </div>
        )}
      </div>

      <div className="flex h-20 flex-1 min-w-0 flex-col justify-between py-0.5">
        {showStatusBadge ? (
          <div className="flex justify-start">
            <ManagementAdStatusBadge
              label={statusLabel}
              source={sourceAd}
              statusKey={statusKey}
            />
          </div>
        ) : <div />}

        <div className="min-w-0">
          {to ? (
            <RouteLink className="block min-w-0 no-underline" state={state} to={to}>
              {titleNode}
            </RouteLink>
          ) : (
            titleNode
          )}
        </div>

        <div className="flex items-center gap-1.5 text-xs text-on-surface-var">
          <Typography
            as="span"
            variant="label"
            size="small"
            weight="medium"
            className="truncate max-w-[130px] font-medium text-on-surface text-xs"
          >
            {name}
          </Typography>
          <span className="h-2 w-px bg-outline-variant" />
          <Typography
            as="span"
            variant="label"
            size="small"
            weight="medium"
            className="shrink-0 text-on-surface-var text-xs"
          >
            {role}
          </Typography>
        </div>
      </div>
    </div>
  );
};
