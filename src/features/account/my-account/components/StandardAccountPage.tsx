import type { ReactNode } from "react";
import { TopBarNavigationLayout } from "../../../../shared/layout/TopBarNavigationLayout";
import { TopBar } from "../../../../shared/components/TopBar";
import { ThemeToggleRow } from "../../../../shared/components/ThemeToggle";
import {
  isUserIdentityVerified,
} from "../../api/account.service";
import { useMyAgencyProfileQuery, useMyProfileQuery } from "../../api/account.hooks";
import {
  getActiveAuthRole,
  type AuthSession,
} from "../../../../shared/auth/auth-storage";
import {
  REAL_ESTATE_CONSULTANT,
  REAL_ESTATE_MANAGER,
} from "../../../../shared/constants/roles.constants";
import {
  loggedOutBusinessActions,
  loggedOutPrimaryActions,
  primaryActions,
  secondaryActions,
} from "../actionConfigs";
import { getAccountHeader } from "../accountHeaderHelpers";
import { getCreatedBusinessActions } from "../accountSwitchActions";
import { useLogoutAccount } from "../useLogoutAccount";
import { AccountSection } from "./AccountSection";
import { AccountNotificationButton } from "./AccountNotificationButton";
import { AccountLogoutConfirmSheet } from "./AccountLogoutConfirmSheet";
import { LoggedOutAccountHeader } from "./LoggedOutAccountHeader";
import { StandardAccountSkeleton } from "./AccountSkeletons";
import { AccountRoleSwitcher } from "./AccountRoleSwitcher";
import { AccountHeaderCard } from "./AccountHeaderCard";

export function StandardAccountPage({
  authSession,
  businessSuccessSheet,
}: {
  authSession: AuthSession | null;
  businessSuccessSheet?: ReactNode;
}) {
  const isLoggedIn = authSession !== null;
  const hasManagerRole = Boolean(
    authSession?.roles.some((role) => role.slug === REAL_ESTATE_MANAGER),
  );
  const hasConsultantRole = Boolean(
    authSession?.roles.some((role) => role.slug === REAL_ESTATE_CONSULTANT),
  );
  const activeRole = getActiveAuthRole(authSession);
  const { data: profile, isLoading: isProfileLoading } = useMyProfileQuery({ enabled: isLoggedIn });
  const { data: agencyProfile, isLoading: isAgencyProfileLoading } = useMyAgencyProfileQuery({
    enabled: isLoggedIn && (hasManagerRole || hasConsultantRole),
  });
  const {
    closeLogoutConfirm,
    confirmLogout,
    isLoggingOut,
    isLogoutConfirmOpen,
    openLogoutConfirm,
  } = useLogoutAccount();
  const accountHeader = getAccountHeader(profile);
  const displayMobile = profile?.mobile ?? authSession?.mobile ?? "";
  const isAccountLoading =
    isLoggedIn && (isProfileLoading || (hasManagerRole && isAgencyProfileLoading));
  const businessActions = isLoggedIn
    ? getCreatedBusinessActions(authSession, profile, agencyProfile, activeRole)
    : loggedOutBusinessActions;
  const primaryAccountActions = isUserIdentityVerified(profile)
    ? primaryActions.map((action) =>
        action.to === "/account/identity" ? { ...action, label: "مدیریت سیم‌کارت" } : action,
      )
    : primaryActions;
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
  const accountTopBar = isLoggedIn ? (
    <TopBar backTo="/home" startSlot={<AccountNotificationButton />} title="حساب من" />
  ) : (
    <TopBar centerClassName="px-0" contentClassName="px-4" showBack={false} title="حساب من" />
  );

  return (
    <TopBarNavigationLayout
      activeKey="account"
      contentClassName="bg-surface-container pb-4"
      frameClassName="relative bg-surface-container text-on-surface [direction:rtl]"
      overlay={accountOverlay}
      topBar={accountTopBar}
    >
      {isAccountLoading ? (
        <StandardAccountSkeleton />
      ) : (
        <>
          {isLoggedIn ? (
            <section className="bg-surface-container-lowest flex shrink-0 flex-col gap-3 px-4 pt-3 pb-3.5 [direction:rtl]" aria-label="وضعیت و نقش حساب">
              <AccountRoleSwitcher
                authSession={authSession}
                profile={profile}
                agencyProfile={agencyProfile}
              />
              <AccountHeaderCard
                avatarUrl={accountHeader.avatarUrl}
                name={accountHeader.label}
                mobile={displayMobile}
              />
            </section>
          ) : (
            <LoggedOutAccountHeader />
          )}

          {businessActions.length > 0 ? (
            <>
              <AccountSection actions={businessActions} />
              <div className="bg-surface-container h-4" />
            </>
          ) : (
            <div className="bg-surface-container h-4" />
          )}

          <AccountSection actions={isLoggedIn ? primaryAccountActions : loggedOutPrimaryActions} />

          <div className="bg-surface-container h-4" />

          <AccountSection actions={secondaryActions} />

          <div className="bg-surface-container h-4" />

          <section className="bg-surface-container-lowest px-4 py-1">
            <ThemeToggleRow />
          </section>

          {isLoggedIn ? (
            <>
              <div className="bg-surface-container h-4" />
              <AccountSection
                actions={[
                  {
                    icon: "log_out",
                    label: isLoggingOut ? "در حال خروج..." : "خروج از حساب",
                    onClick: openLogoutConfirm,
                  },
                ]}
              />
            </>
          ) : null}
        </>
      )}
    </TopBarNavigationLayout>
  );
}
