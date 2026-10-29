import type { ReactNode } from "react";
import { TopBarNavigationLayout } from "../../../../shared/layout/TopBarNavigationLayout";
import { TopBar } from "../../../../shared/components/TopBar";
import { Typography } from "../../../../shared/ui/Typography";
import { ThemeToggleRow } from "../../../../shared/components/ThemeToggle";
import { formatMobileForDisplay } from "../../../auth/api/auth.service";
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
import { AccountProfileAvatar } from "./AccountProfileAvatar";
import { AccountSection } from "./AccountSection";
import { AccountNotificationButton } from "./AccountNotificationButton";
import { AccountLogoutConfirmSheet } from "./AccountLogoutConfirmSheet";
import { LoggedOutAccountHeader } from "./LoggedOutAccountHeader";
import { StandardAccountSkeleton } from "./AccountSkeletons";
import { Divider } from "./AccountMenuRow";

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
            <section className="bg-surface-container-lowest shrink-0" aria-label="وضعیت حساب">
              <div className="flex h-[128px] min-h-[128px] items-center gap-4 px-4 [direction:rtl]">
                <AccountProfileAvatar
                  avatarUrl={accountHeader.avatarUrl}
                  className="h-[72px] w-[72px]"
                  iconClassName="h-8 w-8 text-outline"
                  label={accountHeader.label}
                />

                <div className="min-w-0 flex-1 text-right">
                  <Typography
                    as="p"
                    variant="body"
                    size="medium"
                    weight="medium"
                    className="m-0 truncate text-sm leading-5 font-semibold"
                    style={{ color: accountHeader.color }}
                  >
                    {accountHeader.label}
                  </Typography>
                  <Typography
                    as="p"
                    variant="body"
                    size="medium"
                    weight="medium"
                    className="text-outline m-0 mt-2 text-sm leading-5 font-medium [direction:ltr]"
                  >
                    {formatMobileForDisplay(displayMobile)}
                  </Typography>
                </div>
              </div>
              <Divider />
            </section>
          ) : (
            <LoggedOutAccountHeader />
          )}

          <AccountSection
            actions={
              isLoggedIn
                ? getCreatedBusinessActions(authSession, profile, agencyProfile, activeRole)
                : loggedOutBusinessActions
            }
          />

          <div className="bg-surface-container h-4" />

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
