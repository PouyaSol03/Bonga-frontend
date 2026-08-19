import { useMemo } from "react";

import { getStoredAuthSession } from "../../../shared/auth/auth-storage";
import { useMyAgencyProfileQuery } from "../../account/api/account.hooks";

export type PublisherOptionId =
  | "personal"
  | "independent-consultant"
  | "agency-manager"
  | "agency-consultant";

export type PublisherOption = {
  description: string;
  icon: "user" | "building" | "agency";
  id: PublisherOptionId;
  senderRole:
    | "user"
    | "real_estate_manager"
    | "real_estate_consultant"
    | "independent_consultant";
  title: string;
};

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
  const canPublishAsAgency = availableRoles.has("real_estate_manager");
  const canPublishAsAgencyConsultant = availableRoles.has("real_estate_consultant");
  const { data: agencyProfile } = useMyAgencyProfileQuery({
    enabled: enabled && (canPublishAsAgency || canPublishAsAgencyConsultant),
  });
  const agencyName = agencyProfile?.name?.trim() ?? "";

  return useMemo<PublisherOption[]>(() => {
    const options: PublisherOption[] = [
      {
        id: "personal",
        title: "شخصی",
        description: "انتشار به عنوان کاربر",
        icon: "user",
        senderRole: "user",
      },
    ];

    if (canPublishAsIndependent) {
      options.push({
        id: "independent-consultant",
        title: "مشاور مستقل",
        description: "انتشار در صفحه مشاور مستقل",
        icon: "building",
        senderRole: "independent_consultant",
      });
    }

    if (canPublishAsAgency) {
      options.push({
        id: "agency-manager",
        title: agencyName || "آژانس",
        description: agencyName
          ? `انتشار به نام آژانس ${agencyName}`
          : "انتشار به نام آژانس",
        icon: "agency",
        senderRole: "real_estate_manager",
      });
    }

    if (canPublishAsAgencyConsultant) {
      options.push({
        id: "agency-consultant",
        title: "مشاور آژانس",
        description: agencyName
          ? `انتشار به عنوان مشاور ${agencyName}`
          : "انتشار به عنوان مشاور آژانس",
        icon: "building",
        senderRole: "real_estate_consultant",
      });
    }

    return options;
  }, [agencyName, canPublishAsAgency, canPublishAsAgencyConsultant, canPublishAsIndependent]);
}
