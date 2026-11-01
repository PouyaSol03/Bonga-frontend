import { useEffect, type ReactNode } from "react";
import { TopBarNavigationLayout } from "../../../../shared/layout/TopBarNavigationLayout";
import { TopBar } from "../../../../shared/components/TopBar";
import { Typography } from "../../../../shared/ui/Typography";
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
import { getAccountSwitchActions } from "../accountSwitchActions";
import { useLogoutAccount } from "../useLogoutAccount";
import { AccountProfileAvatar } from "./AccountProfileAvatar";
import { AccountSection } from "./AccountSection";
import { AccountNotificationButton } from "./AccountNotificationButton";
import { AccountLogoutConfirmSheet } from "./AccountLogoutConfirmSheet";
import { BusinessAccountSkeleton } from "./AccountSkeletons";
import { Divider } from "./AccountMenuRow";

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
  const accountSwitchActions = getAccountSwitchActions(
    authSession,
    activeRole,
    profile,
    agencyProfile,
  );
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
          <section
            className="bg-surface-container-lowest shrink-0"
            aria-label={businessHeader.ariaLabel}
          >
            <div className="flex h-[128px] min-h-[128px] items-center gap-4 px-4 [direction:rtl]">
              <AccountProfileAvatar
                avatarUrl={businessHeader.imageSrc}
                className="h-[72px] w-[72px]"
                iconClassName="h-8 w-8 text-outline"
                label={businessHeader.name}
              />
              <div className="min-w-0 flex-1 text-right">
                <Typography
                  as="p"
                  variant="body"
                  size="medium"
                  weight="medium"
                  className="m-0 truncate text-sm leading-5 font-semibold"
                  style={{ color: businessHeader.color }}
                >
                  {businessHeader.name}
                </Typography>
                <Typography
                  as="p"
                  variant="body"
                  size="medium"
                  weight="medium"
                  className="text-outline m-0 mt-2 text-sm leading-5 font-medium"
                >
                  {businessHeader.subtitle}
                </Typography>
              </div>
            </div>

            {accountSwitchActions.length > 0 ? <Divider /> : null}
            <AccountSection actions={accountSwitchActions} spacedDividers />
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
