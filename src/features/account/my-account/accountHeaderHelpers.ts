import { getApiAssetUrl } from "../../../shared/api/api";
import {
  isUserIdentityVerified,
  type MyAgencyProfile,
  type UserProfile,
} from "../api/account.service";
import {
  INDEPENDENT_CONSULTANT,
  REAL_ESTATE_CONSULTANT,
  REAL_ESTATE_MANAGER,
} from "../../../shared/constants/roles.constants";

export function isBusinessAccount(role: string | null) {
  return (
    role === REAL_ESTATE_MANAGER ||
    role === REAL_ESTATE_CONSULTANT ||
    role === INDEPENDENT_CONSULTANT
  );
}

export function getProfileDisplayName(profile?: UserProfile) {
  return [profile?.name, profile?.family]
    .map((value) => value?.trim())
    .filter(Boolean)
    .join(" ");
}

export function getAgencyDisplayName(agencyProfile?: MyAgencyProfile) {
  return agencyProfile?.name?.trim() || "آژانس املاک";
}

export function getAgencyAvatarUrl(agencyProfile?: MyAgencyProfile) {
  const agencyImage = agencyProfile?.logo || agencyProfile?.img;
  return agencyImage ? getApiAssetUrl(agencyImage) : "";
}

export function getAccountHeader(profile?: UserProfile) {
  const fullName = getProfileDisplayName(profile);
  const isIdentityVerified = isUserIdentityVerified(profile);
  const avatarUrl = profile?.avatar ? getApiAssetUrl(profile.avatar) : "";

  if (!isIdentityVerified) {
    return { avatarUrl, color: "var(--error)", label: "احراز هویت نشده" };
  }

  return {
    avatarUrl,
    color: "var(--primary)",
    label: fullName || "کاربر شناسا",
  };
}

export function getBusinessAccountHeader(
  role?: string | null,
  profile?: UserProfile,
  agencyProfile?: MyAgencyProfile,
) {
  const accountHeader = getAccountHeader(profile);
  const agencyName = getAgencyDisplayName(agencyProfile);
  const agencyAvatarUrl = getAgencyAvatarUrl(agencyProfile);

  if (role === REAL_ESTATE_MANAGER) {
    return {
      ariaLabel: "اطلاعات آژانس",
      color: "var(--primary)",
      imageSrc: agencyAvatarUrl,
      name: agencyName,
      subtitle: "آژانس املاک",
    };
  }

  if (role === REAL_ESTATE_CONSULTANT) {
    const consultantAccount = profile?.accounts?.find(
      (acc) =>
        acc.context === "agency-consultant" ||
        acc.role_slug === "real_estate_consultant" ||
        (acc.type === "agent" && Boolean(acc.agency_id || acc.agency)),
    );
    const agencyTitle =
      consultantAccount?.agency?.name?.trim() || agencyProfile?.name?.trim() || agencyName;

    return {
      ariaLabel: "اطلاعات مشاور آژانس",
      color: accountHeader.color,
      imageSrc: accountHeader.avatarUrl,
      name: consultantAccount?.name || accountHeader.label,
      subtitle: agencyTitle ? `مشاور آژانس ${agencyTitle}` : "مشاور آژانس",
    };
  }

  return {
    ariaLabel: "اطلاعات مشاور",
    color: accountHeader.color,
    imageSrc: accountHeader.avatarUrl,
    name: accountHeader.label,
    subtitle: "مشاور مستقل",
  };
}
