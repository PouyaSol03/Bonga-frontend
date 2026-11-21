import { useEffect, type ReactNode } from "react";
import { TopBarNavigationLayout } from "../../../../shared/layout/TopBarNavigationLayout";
import { TopBar } from "../../../../shared/components/TopBar";
import { ThemeToggleRow } from "../../../../shared/components/ThemeToggle";
import { useMyAgencyProfileQuery, useMyProfileQuery } from "../../api/account.hooks";
import {
  getActiveAuthRole,
  setStoredManagerPermissions,
  type AuthSession,
} from "../../../../shared/auth/auth-storage";
import {
  REAL_ESTATE_CONSULTANT,
  REAL_ESTATE_MANAGER,
} from "../../../../shared/constants/roles.constants";
import { getBusinessAccountHeader } from "../accountHeaderHelpers";
import { getBusinessAccountActions } from "../businessAccountActions";
import { useLogoutAccount } from "../useLogoutAccount";
import { AccountSection } from "./AccountSection";
import { AccountNotificationButton } from "./AccountNotificationButton";
import { AccountLogoutConfirmSheet } from "./AccountLogoutConfirmSheet";
import { BusinessAccountSkeleton } from "./AccountSkeletons";
import { AccountRoleSwitcher } from "./AccountRoleSwitcher";
import { AccountHeaderCard } from "./AccountHeaderCard";

export function IndependentConsultantAccountPage({
  authSession,
  businessSuccessSheet,
}: {
  authSession: AuthSession | null;
  businessSuccessSheet?: ReactNode;
}) {
  const activeRole = getActiveAuthRole(authSession);
  const isManagerRole = activeRole === REAL_ESTATE_MANAGER;
  const isConsultantRole = activeRole === REAL_ESTATE_CONSULTANT;
  const { data: profile, isLoading: isProfileLoading } = useMyProfileQuery({
    enabled: Boolean(authSession),
  });
  const { data: agencyProfile, isLoading: isAgencyProfileLoading } = useMyAgencyProfileQuery({
    enabled: Boolean(authSession) && (isManagerRole || isConsultantRole),
  });
  const {
    closeLogoutConfirm,
    confirmLogout,
    isLoggingOut,
    isLogoutConfirmOpen,
    openLogoutConfirm,
  } = useLogoutAccount();

  useEffect(() => {
    if (!agencyProfile) return;
    const membership = agencyProfile.membership;
    if (membership && (membership.role === "manager" || membership.role_id === 2)) {
      setStoredManagerPermissions(membership.permissions);
    } else if (membership && (membership.role === "owner" || membership.role_id === 0)) {
      setStoredManagerPermissions(null);
    }
  }, [agencyProfile]);

  const consultantActions = getBusinessAccountActions(activeRole, agencyProfile);
  const businessHeader = getBusinessAccountHeader(activeRole, profile, agencyProfile);
  const isBusinessAccountLoading =
    Boolean(authSession) &&
    ((!isManagerRole && isProfileLoading) || (isManagerRole && isAgencyProfileLoading));
  const accountOverlay = (
    <>
      {businessSuccessSheet}
      <AccountLogoutConfirmSheet
        isOpen={isLogoutConfirmOpen}
        isPending={isLoggingOut}
        onCancel={closeLogoutConfirm}
        onConfirm={confirmLogout}
      />
    </>
  );

  return (
    <TopBarNavigationLayout
      activeKey="account"
      contentClassName="flex flex-col gap-4 bg-surface-container"
      frameClassName="relative bg-surface-container text-on-surface [direction:rtl]"
      overlay={accountOverlay}
      topBar={<TopBar backTo="/home" startSlot={<AccountNotificationButton />} title="حساب من" />}
    >
      {isBusinessAccountLoading ? (
        <BusinessAccountSkeleton />
      ) : (
        <>
          <section className="bg-surface-container-lowest shrink-0 px-4 pt-3 pb-3.5 [direction:rtl]" aria-label="وضعیت و نقش حساب">
            <AccountRoleSwitcher
              authSession={authSession}
              profile={profile}
              agencyProfile={agencyProfile}
            />
            <div className="mt-3">
              <AccountHeaderCard
                avatarUrl={businessHeader.imageSrc}
                name={businessHeader.name}
                mobile={profile?.mobile ?? authSession?.mobile ?? ""}
              />
            </div>
          </section>

          <AccountSection actions={consultantActions} className="pt-0.5" spacedDividers />
          <section className="bg-surface-container-lowest px-4 py-1">
            <ThemeToggleRow />
          </section>
          <AccountSection
            actions={[
              { icon: "trash", label: "حذف کسب و کار", tone: "danger", to: "/account/delete-user" },
              {
                icon: "log_out",
                label: isLoggingOut ? "در حال خروج..." : "خروج از حساب کاربری",
                onClick: openLogoutConfirm,
              },
            ]}
          />
        </>
      )}
    </TopBarNavigationLayout>
  );
}
