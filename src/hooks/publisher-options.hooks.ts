import { useMemo } from "react";

import { getStoredAuthSession } from "../auth/auth-storage";
import { useMyAgencyProfileQuery } from "./account.hooks";

export type PublisherOptionId =
  | "personal"
  | "independent-consultant"
  | "jaliliyan-agency";

export type PublisherOption = {
  description: string;
  icon: "user" | "building" | "agency";
  id: PublisherOptionId;
  senderRole: string;
  title: string;
};

const basePublisherOptions: PublisherOption[] = [
  {
    id: "personal",
    title: "آگهی شخصی",
    description: "انتشار در آگهی های شخصی",
    icon: "user",
    senderRole: "user",
  },
  {
    id: "independent-consultant",
    title: "مشاور مستقل",
    description: "انتشار آگهی در صفحه مشاور مستقل",
    icon: "building",
    senderRole: "independent_consultant",
  },
  {
    id: "jaliliyan-agency",
    title: "مشاور آژانس",
    description: "انتشار آگهی در صفحه مشاور آژانس",
    icon: "agency",
    senderRole: "real_estate_consultant",
  },
];

export function usePublisherOptions(enabled = true) {
  const session = getStoredAuthSession();
  const availableRoles = useMemo(
    () =>
      new Set<string>(
        [
          session?.activeRole,
          session?.role,
          ...(session?.roles ?? []).map((role) => role.slug),
        ].filter(Boolean) as string[],
      ),
    [session],
  );
  const canPublishAsIndependent = availableRoles.has("independent_consultant");
  const canPublishAsAgency =
    availableRoles.has("real_estate_consultant") ||
    availableRoles.has("real_estate_manager");
  const agencySenderRole = availableRoles.has("real_estate_consultant")
    ? "real_estate_consultant"
    : "real_estate_manager";
  const { data: agencyProfile } = useMyAgencyProfileQuery({
    enabled: enabled && canPublishAsAgency,
  });
  const agencyName = agencyProfile?.name?.trim() ?? "";

  return useMemo(
    () =>
      basePublisherOptions
        .filter((option) => {
          if (option.id === "personal") return true;
          if (option.id === "independent-consultant") {
            return canPublishAsIndependent;
          }
          if (option.id === "jaliliyan-agency") return canPublishAsAgency;

          return false;
        })
        .map((option) => {
          if (option.id !== "jaliliyan-agency") return option;

          return {
            ...option,
            description: agencyName
              ? `انتشار آگهی در صفحه مشاور آژانس ${agencyName}`
              : option.description,
            senderRole: agencySenderRole,
            title: agencyName ? `مشاور آژانس ${agencyName}` : option.title,
          };
        }),
    [agencyName, agencySenderRole, canPublishAsAgency, canPublishAsIndependent],
  );
}
