import {
  getActiveAuthRole,
  setStoredActiveRole,
  getStoredAuthSession,
  type AuthSession,
} from "../../../../shared/auth/auth-storage";
import {
  INDEPENDENT_CONSULTANT,
  REAL_ESTATE_CONSULTANT,
  REAL_ESTATE_MANAGER,
  USER,
} from "../../../../shared/constants/roles.constants";
import { Chip } from "../../../../shared/ui/Chip";
import type { MyAgencyProfile, UserProfile } from "../../api/account.service";

interface AccountRoleSwitcherProps {
  authSession: AuthSession | null;
  profile?: UserProfile;
  agencyProfile?: MyAgencyProfile;
}

export function AccountRoleSwitcher({
  authSession,
  profile,
  agencyProfile,
}: AccountRoleSwitcherProps) {
  if (!authSession) return null;

  const activeRole = getActiveAuthRole(authSession) ?? USER;
  const isPersonalActive = activeRole === USER || !activeRole;
  const isIndependentActive = activeRole === INDEPENDENT_CONSULTANT;
  const isAgencyActive =
    activeRole === REAL_ESTATE_CONSULTANT || activeRole === REAL_ESTATE_MANAGER;

  // Determine which roles this user actually has
  const hasPersonal = true; // Every user in the system has a personal account

  const hasIndependent = Boolean(
    activeRole === INDEPENDENT_CONSULTANT ||
      authSession.roles.some((r) => r.slug === INDEPENDENT_CONSULTANT) ||
      profile?.accounts?.some(
        (acc) =>
          acc.context === "independent-consultant" ||
          acc.role_slug === "independent_consultant" ||
          (acc.type === "agent" && !acc.agency_id && !acc.agency),
      ),
  );

  const hasAgency = Boolean(
    activeRole === REAL_ESTATE_CONSULTANT ||
      activeRole === REAL_ESTATE_MANAGER ||
      authSession.roles.some(
        (r) => r.slug === REAL_ESTATE_CONSULTANT || r.slug === REAL_ESTATE_MANAGER,
      ) ||
      profile?.accounts?.some(
        (acc) =>
          acc.context === "agency" ||
          acc.context === "agency-consultant" ||
          acc.role_slug === "real_estate_manager" ||
          acc.role_slug === "real_estate_consultant" ||
          (acc.type === "agent" && Boolean(acc.agency_id || acc.agency)) ||
          acc.type === "agency",
      ) ||
      Boolean(
        profile?.agency_id &&
          (profile?.agency_status === "approved" ||
            profile?.agency_status === 1 ||
            profile?.agency_status === "1"),
      ) ||
      Boolean(agencyProfile?.id),
  );

  type RoleChip = {
    key: "personal" | "independent" | "agency";
    label: string;
    isActive: boolean;
    onSelect: () => void;
  };

  const chips: RoleChip[] = [];

  // In RTL, the first element rendered is on the rightmost side
  // 1. شخصی (Personal)
  if (hasPersonal) {
    chips.push({
      key: "personal",
      label: "شخصی",
      isActive: isPersonalActive,
      onSelect: () => setStoredActiveRole(USER),
    });
  }

  // 2. مشاور مستقل (Independent Consultant)
  if (hasIndependent) {
    chips.push({
      key: "independent",
      label: "مشاور مستقل",
      isActive: isIndependentActive,
      onSelect: () => setStoredActiveRole(INDEPENDENT_CONSULTANT),
    });
  }

  // 3. آژانس (Agency Manager) / مشاور آژانس (Agency Consultant)
  if (hasAgency) {
    const isManager =
      activeRole === REAL_ESTATE_MANAGER ||
      authSession.roles.some((r) => r.slug === REAL_ESTATE_MANAGER) ||
      profile?.accounts?.some(
        (acc) =>
          acc.context === "agency" ||
          acc.role_slug === "real_estate_manager" ||
          acc.type === "agency",
      ) ||
      Boolean(agencyProfile?.id);

    chips.push({
      key: "agency",
      label: isManager ? "آژانس" : "مشاور آژانس",
      isActive: isAgencyActive,
      onSelect: () => {
        const session = getStoredAuthSession();
        const managerSelected =
          session?.roles.some((r) => r.slug === REAL_ESTATE_MANAGER) ||
          profile?.accounts?.some(
            (acc) =>
              acc.context === "agency" ||
              acc.role_slug === "real_estate_manager" ||
              acc.type === "agency",
          );
        setStoredActiveRole(managerSelected ? REAL_ESTATE_MANAGER : REAL_ESTATE_CONSULTANT);
      },
    });
  }

  // If the user has only 1 role (or none), do not render the role switcher
  if (chips.length <= 1) {
    return null;
  }

  const getChipClass = (isActive: boolean) =>
    `h-11 justify-center rounded-[14px] text-sm transition-all duration-150 select-none ${
      chips.length > 1 ? "flex-1" : "min-w-[120px] px-6"
    } ${
      isActive
        ? "border-[1.8px] border-[#0B49B0] bg-[#D6E2F8] text-[#0B49B0] font-bold shadow-xs hover:border-[#0B49B0] hover:bg-[#D6E2F8]"
        : "border border-[#CCCCCC] bg-white text-[#575757] font-medium hover:border-[#999999] hover:bg-white"
    }`;

  return (
    <div className="flex items-center gap-2.5 [direction:rtl] w-full" aria-label="انتخاب نقش کاربری">
      {chips.map((chip) => (
        <Chip
          key={chip.key}
          type="button"
          selected={chip.isActive}
          onClick={chip.onSelect}
          className={getChipClass(chip.isActive)}
        >
          {chip.label}
        </Chip>
      ))}
    </div>
  );
}
