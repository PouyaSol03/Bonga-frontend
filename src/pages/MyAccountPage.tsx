import { useEffect, useState, type ComponentType, type ReactNode, type SVGProps } from "react";

import { TopBarNavigationLayout } from "../app/TopBarNavigationLayout";
import { BottomSheet } from "../components/BottomSheet";
import { TopBar } from "../components/TopBar";
import { RouteLink } from "../routes/RouteLink";
import { DASHBOARD_PATH } from "../routes/routes";
import { useMyProfileQuery } from "../hooks/account.hooks";
import { useLogoutMutation } from "../hooks/auth.hooks";
import { useNotificationUnreadCountQuery } from "../hooks/notification.hooks";
import { formatMobileForDisplay } from "../services/auth.service";
import type { UserProfile } from "../services/account.service";

import {
  authSessionChangedEventName,
  getActiveAuthRole,
  getStoredAuthSession,
  setStoredActiveRole,
  storeLoginRedirectPath,
  type AuthRoleSlug,
  type AuthSession,
} from "../auth/auth-storage";
import {
  INDEPENDENT_CONSULTANT,
  REAL_ESTATE_CONSULTANT,
  REAL_ESTATE_MANAGER,
  USER,
} from "../constants/roles.constants";
import LinearRealestate from "../components/(icons)/LinearRealestate";
import LinearSupport from "../components/(icons)/LinearSupport";
import LinearBuilding from "../components/(icons)/LinearBuilding";
import Dashboard from "../components/(icons)/Dashboard";
import LinearUserConfirmation from "../components/(icons)/LinearUserConfirmation";
import LinearLegal from "../components/(icons)/LinearLegal";
import LinearLogin from "../components/(icons)/LinearLogin";
import LinearDocument from "../components/(icons)/LinearDocument";
import LinearAdd from "../components/(icons)/LinearAdd";
import LinearRanking from "../components/(icons)/LinearRanking";
import LinearDelete from "../components/(icons)/LinearDelete";
import LinearUserSolid from "../components/(icons)/LinearUserSolid";
import LinearWalletAdd from "../components/(icons)/LinearWalletAdd";
import LinearNotification from "../components/(icons)/LinearNotification";
import LinearComment from "../components/(icons)/LinearComment";
import LinearArrowLeft1 from "../components/(icons)/LinearArrowLeft1";
import LinearTag from "../components/(icons)/LinearTag";
import LinearRequest from "../components/(icons)/LinearRequest";
import LinearEditUser from "../components/(icons)/LinearEditUser";
import LinearViewOn from "../components/(icons)/LinearViewOn";
import LinearBookmarkSolid from "../components/(icons)/LinearBookmarkSolid";
import LinearWallet2 from "../components/(icons)/LinearWallet2";
import LinearSetting2 from "../components/(icons)/LinearSetting2";
import LinearInformation from "../components/(icons)/LinearInformation";
import LinearLogout from "../components/(icons)/LinearLogout";

const MANAGE_ADS_PATH = "/account/manage-ads";

type AccountAction = {
  activeRole?: AuthRoleSlug;
  icon: AccountIconName;
  label: string;
  onClick?: () => void;
  requiresAuth?: boolean;
  to?: string;
};

type AccountIconName =
  | "agency"
  | "headphone"
  | "bookmark"
  | "building"
  | "dashboard"
  | "eye"
  | "identity"
  | "info"
  | "legal"
  | "lock"
  | "log_out"
  | "message"
  | "note"
  | "plus"
  | "ranking"
  | "request"
  | "setting"
  | "tag"
  | "team"
  | "trash"
  | "user"
  | "wallet"
  | "wallet-add";

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

const accountIconMap: Record<AccountIconName, IconComponent> = {
  agency: LinearRealestate,
  headphone: LinearSupport,
  bookmark: LinearBookmarkSolid,
  building: LinearBuilding,
  dashboard: Dashboard,
  eye: LinearViewOn,
  identity: LinearUserConfirmation,
  info: LinearInformation,
  legal: LinearLegal,
  lock: LinearLogin,
  log_out: LinearLogout,
  message: LinearComment,
  note: LinearDocument,
  plus: LinearAdd,
  ranking: LinearRanking,
  request: LinearRequest,
  setting: LinearSetting2,
  tag: LinearTag,
  team: LinearEditUser,
  trash: LinearDelete,
  user: LinearUserSolid,
  wallet: LinearWallet2,
  "wallet-add": LinearWalletAdd,
};

const userBusinessActions: AccountAction[] = [
  { icon: "plus", label: "ایجاد کسب و کار", to: "/account/business/create" },
];

const loggedOutBusinessActions: AccountAction[] = [
  { icon: "plus", label: "ایجاد کسب و کار", requiresAuth: true, to: "/account/business/create" },
];

const primaryActions: AccountAction[] = [
  { icon: "identity", label: "تایید هویت", to: "/account/identity" },
  { icon: "user", label: "مشخصات من", to: "/account/profile" },
  { icon: "tag", label: "آگهی‌های من", to: "/account/my-ads" },
  { icon: "request", label: "مدیریت درخواست", to: "/account/requests" },
  { icon: "bookmark", label: "نشان‌ها", to: "/account/bookmarks" },
  { icon: "eye", label: "بازدیدهای اخیر", to: "/account/recent-views" },
  { icon: "note", label: "یادداشت‌ها", to: "/account/notes" },
  { icon: "wallet", label: "کیف پول", to: "/account/wallet" },
];

const loggedOutPrimaryActions: AccountAction[] = [
  { icon: "identity", label: "تایید هویت", requiresAuth: true, to: "/account/identity" },
  { icon: "user", label: "مشخصات من", requiresAuth: true, to: "/account/profile" },
  { icon: "tag", label: "آگهی‌های من", requiresAuth: true, to: "/account/my-ads" },
  { icon: "bookmark", label: "نشان‌ها", requiresAuth: true, to: "/account/bookmarks" },
  { icon: "note", label: "یادداشت‌ها", requiresAuth: true, to: "/account/notes" },
  { icon: "wallet", label: "کیف پول", requiresAuth: true, to: "/account/wallet" },
];

const secondaryActions: AccountAction[] = [
  { icon: "setting", label: "تنظیمات", to: "/account/about" },
  { icon: "info", label: "درباره ما", to: "/account/about" },
  { icon: "legal", label: "ضوابط و قوانین", to: "/account/about" },
  { icon: "headphone", label: "پشتیبانی", to: "/account/about" },
];

const loggedOutSecondaryActions: AccountAction[] = [
  { icon: "setting", label: "تنظیمات", requiresAuth: true, to: "/account/about" },
];

export function MyAccountPage() {
  const [authSession, setAuthSession] = useState(() => getStoredAuthSession());
  const activeRole = getActiveAuthRole(authSession);
  const [isBusinessSuccessOpen, setIsBusinessSuccessOpen] = useState(() =>
    new URLSearchParams(window.location.search).get("businessSuccess") === "1",
  );

  useEffect(() => {
    function syncAuthSession() {
      setAuthSession(getStoredAuthSession());
    }

    window.addEventListener(authSessionChangedEventName, syncAuthSession);
    window.addEventListener("storage", syncAuthSession);

    return () => {
      window.removeEventListener(authSessionChangedEventName, syncAuthSession);
      window.removeEventListener("storage", syncAuthSession);
    };
  }, []);
  const businessSuccessSheet = (
    <AccountBusinessSuccessSheet
      isOpen={isBusinessSuccessOpen}
      onClose={() => {
        setIsBusinessSuccessOpen(false);
        clearBusinessSuccessQuery();
      }}
    />
  );

  if (authSession && isBusinessAccount(activeRole)) {
    return <IndependentConsultantAccountPage businessSuccessSheet={businessSuccessSheet} />;
  }

  return <StandardAccountPage authSession={authSession} businessSuccessSheet={businessSuccessSheet} />;
}

function isBusinessAccount(role: string | null) {
  return (
    role === REAL_ESTATE_MANAGER ||
    role === REAL_ESTATE_CONSULTANT ||
    role === INDEPENDENT_CONSULTANT
  );
}

function IndependentConsultantAccountPage({ businessSuccessSheet }: { businessSuccessSheet?: ReactNode }) {
  const authSession = getStoredAuthSession();
  const { isLoggingOut, handleLogout } = useLogoutAccount();
  const activeRole = getActiveAuthRole(authSession);
  const consultantActions = getBusinessAccountActions(activeRole);
  const accountSwitchActions = getAccountSwitchActions(authSession, activeRole);
  const businessHeader = getBusinessAccountHeader(activeRole);

  return (
    <TopBarNavigationLayout
      activeKey="account"
      contentClassName="flex flex-col gap-4 bg-[#f0f0f0]"
      frameClassName="relative bg-[#f0f0f0] text-[#1a1a1a] [direction:rtl]"
      overlay={businessSuccessSheet}
      topBar={<TopBar
        backTo="/home"
        startSlot={<AccountNotificationButton />}
        title="حساب من"
      />}
    >

      <section className="shrink-0 bg-white pt-4" aria-label={businessHeader.ariaLabel}>
        <button
          className="flex w-full items-center gap-4 px-4 text-right"
          onClick={() => {
            setStoredActiveRole(USER);
            navigateTo("/account");
          }}
          type="button"
        >
          <img
            alt={businessHeader.name}
            className="h-[72px] w-[72px] shrink-0 rounded-full object-cover"
            src={businessHeader.imageSrc}
          />
          <div className="min-w-0 flex-1 text-right">
            <p className="m-0 truncate text-base font-semibold leading-6 text-[#1a1a1a]">
              {businessHeader.name}
            </p>
            <p className="m-0 mt-2 text-sm font-medium leading-5 text-[#808080]">
              {businessHeader.subtitle}
            </p>
          </div>
        </button>

        <DangerAccountRow
          action={{ icon: "trash", label: "حذف کسب و کار", to: "/account/delete-user" }}
        />
        <AccountSection actions={accountSwitchActions} spacedDividers />
      </section>

      <AccountSection
        actions={consultantActions}
        className=" pt-0.5"
        spacedDividers
      />
      <AccountSection
        actions={[
          {
            icon: "log_out",
            label: isLoggingOut ? "در حال خروج..." : "خروج از حساب کاربری",
            onClick: handleLogout,
          },
        ]}
      />
    </TopBarNavigationLayout>
  );
}

function getBusinessAccountHeader(role?: string | null) {
  if (role === REAL_ESTATE_MANAGER) {
    return {
      ariaLabel: "اطلاعات آژانس",
      imageSrc: "/figma/account/consultant-profile.png",
      name: "املاک جلیلیان",
      subtitle: "آژانس املاک",
    };
  }

  if (role === REAL_ESTATE_CONSULTANT) {
    return {
      ariaLabel: "اطلاعات مشاور آژانس",
      imageSrc: "/figma/account/consultant-profile.png",
      name: "مشاور آژانس جلیلیان",
      subtitle: "مشاور آژانس",
    };
  }

  return {
    ariaLabel: "اطلاعات مشاور",
    imageSrc: "/figma/account/consultant-profile.png",
    name: "ناصر اشرفی",
    subtitle: "مشاور مستقل",
  };
}

function getBusinessAccountActions(role?: string | null): AccountAction[] {
  const managerActions: AccountAction[] = [
    { icon: "dashboard", label: "داشبورد", to: DASHBOARD_PATH },
    { icon: "ranking", label: "نشان ها و رتبه", to: `${DASHBOARD_PATH}/ranking` },
    { icon: "building", label: "صفحه آژانس", to: `${DASHBOARD_PATH}/agency` },
    { icon: "tag", label: "مدیریت آگهی‌ها", to: MANAGE_ADS_PATH },
    { icon: "request", label: "مدیریت درخواست‌ها", to: `${DASHBOARD_PATH}/requests` },
    { icon: "team", label: "مدیریت مشاورین", to: `${DASHBOARD_PATH}/team` },
    { icon: "wallet-add", label: "افزایش اعتبار", to: `${DASHBOARD_PATH}/payments` },
    { icon: "message", label: "پیام‌ها", to: `${DASHBOARD_PATH}/messages` },
  ];

  if (role === REAL_ESTATE_MANAGER) {
    return managerActions;
  }

  if (role === REAL_ESTATE_CONSULTANT) {
    return [
      { icon: "dashboard", label: "داشبورد", to: DASHBOARD_PATH },
      { icon: "ranking", label: "شناساها و رتبه", to: `${DASHBOARD_PATH}/ranking` },
      { icon: "building", label: "صفحه آژانس", to: `${DASHBOARD_PATH}/agency` },
      { icon: "tag", label: "مدیریت آگهی‌ها", to: MANAGE_ADS_PATH },
      { icon: "wallet", label: "افزایش اعتبار", to: `${DASHBOARD_PATH}/payments` },
      { icon: "message", label: "پیام‌ها", to: `${DASHBOARD_PATH}/messages` },
    ];
  }

  if (role === INDEPENDENT_CONSULTANT) {
    return [
      { icon: "dashboard", label: "داشبورد", to: DASHBOARD_PATH },
      { icon: "ranking", label: "شناساها و رتبه", to: `${DASHBOARD_PATH}/ranking` },
      { icon: "building", label: "صفحه مشاور", to: `${DASHBOARD_PATH}/agency` },
      { icon: "tag", label: "مدیریت آگهی‌ها", to: MANAGE_ADS_PATH },
      { icon: "request", label: "مدیریت درخواست‌ها", to: `${DASHBOARD_PATH}/requests` },
      { icon: "wallet", label: "افزایش اعتبار", to: `${DASHBOARD_PATH}/payments` },
      { icon: "message", label: "پیام‌ها", to: `${DASHBOARD_PATH}/messages` },
    ];
  }

  return managerActions;
}

function getAccountSwitchActions(
  authSession: AuthSession | null,
  activeRole?: string | null,
): AccountAction[] {
  if (!authSession) return [];

  const actions: AccountAction[] = [];

  if (authSession.roles.some((role) => role.slug === USER)) {
    actions.push({
      activeRole: USER,
      icon: "user",
      label: "ناصر اشرفی",
      to: "/account",
    });
  }

  if (authSession.roles.some((role) => role.slug === REAL_ESTATE_MANAGER)) {
    actions.push({
      activeRole: REAL_ESTATE_MANAGER,
      icon: "agency",
      label: "املاک جلیلیان",
      to: "/account",
    });
  }

  if (authSession.roles.some((role) => role.slug === REAL_ESTATE_CONSULTANT)) {
    actions.push({
      activeRole: REAL_ESTATE_CONSULTANT,
      icon: "building",
      label: "مشاور آژانس جلیلیان",
      to: "/account",
    });
  }

  if (authSession.roles.some((role) => role.slug === INDEPENDENT_CONSULTANT)) {
    actions.push({
      activeRole: INDEPENDENT_CONSULTANT,
      icon: "user",
      label: "مشاور مستقل",
      to: "/account",
    });
  }

  return actions.filter((action) => action.activeRole !== activeRole);
}

function getCreatedBusinessActions(authSession: AuthSession | null) {
  if (!authSession) return userBusinessActions;

  const actions = getAccountSwitchActions(authSession, USER);

  if (actions.length > 0) return actions;

  return userBusinessActions;
}

function StandardAccountPage({
  authSession,
  businessSuccessSheet,
}: {
  authSession: AuthSession | null;
  businessSuccessSheet?: ReactNode;
}) {
  const isLoggedIn = authSession !== null;
  const { data: profile } = useMyProfileQuery({ enabled: isLoggedIn });
  const { isLoggingOut, handleLogout } = useLogoutAccount();
  const accountHeader = getAccountHeader(profile);
  const displayMobile = profile?.mobile ?? authSession?.mobile ?? "";

  return (
    <TopBarNavigationLayout
      activeKey="account"
      contentClassName="bg-[#f0f0f0] pb-4"
      frameClassName="relative bg-[#f0f0f0] text-[#1a1a1a] [direction:rtl]"
      overlay={businessSuccessSheet}
      topBar={<TopBar backTo="/home" startSlot={<AccountNotificationButton />} title="حساب من" />}
    >
      {isLoggedIn ? (
        <section className="bg-white" aria-label="وضعیت حساب">
          <div className="flex h-32 items-center gap-4 px-4 [direction:rtl]">
            <div className="grid p-5 shrink-0 place-items-center rounded-full bg-[#e0e0e0] text-[#808080]">
              <AccountIcon name="user" className="h-8 w-8 text-[#cccccc]" />
            </div>

            <div className="min-w-0 flex-1 text-right">
              <p
                className="m-0 truncate text-sm font-semibold leading-5"
                style={{ color: accountHeader.color }}
              >
                {accountHeader.label}
              </p>
              <p className="m-0 mt-2 text-sm font-medium leading-5 text-[#808080] [direction:ltr]">
                {formatMobileForDisplay(displayMobile)}
              </p>
            </div>
          </div>
          <Divider />
        </section>
      ) : (
        <LoggedOutAccountHeader />
      )}

      <AccountSection actions={isLoggedIn ? getCreatedBusinessActions(authSession) : loggedOutBusinessActions} />

      <div className="h-4 bg-[#f0f0f0]" />

      <AccountSection actions={isLoggedIn ? primaryActions : loggedOutPrimaryActions} />

      <div className="h-4 bg-[#f0f0f0]" />

      <AccountSection actions={isLoggedIn ? secondaryActions : loggedOutSecondaryActions} />

      {isLoggedIn ? (
        <>
          <div className="h-4 bg-[#f0f0f0]" />
          <AccountSection
            actions={[
              {
                icon: "log_out",
                label: isLoggingOut ? "در حال خروج..." : "خروج از حساب",
                onClick: handleLogout,
              },
            ]}
          />
        </>
      ) : null}
    </TopBarNavigationLayout>
  );
}

function clearBusinessSuccessQuery() {
  const url = new URL(window.location.href);
  if (!url.searchParams.has("businessSuccess")) return;

  url.searchParams.delete("businessSuccess");
  window.history.replaceState(window.history.state ?? {}, "", `${url.pathname}${url.search}${url.hash}`);
}

function AccountBusinessSuccessSheet({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <BottomSheet
      ariaLabel="ثبت موفق حساب"
      className="rounded-t-[20px]"
      contentClassName="px-3 pb-8"
      heightClassName="h-[346px]"
      isOpen={isOpen}
      onClose={onClose}
      panelPaddingClassName="pt-3"
      showHeader={false}
      showHeaderDivider={false}
      zIndexClassName="z-[999]"
    >
      <div className="text-center px-4">
        <div className="mx-auto grid h-[132px] w-[132px] place-items-center rounded-full">
          <img src="/vectors/States.svg" alt="" />
        </div>
        <h2 className="m-0 mt-2 text-sm font-semibold leading-5 text-[#11A366]">
          حساب شما با موفقیت ثبت شد
        </h2>
        <div className="flex flex-col gap-2.5 mt-2 space-y-1 text-right text-sm font-normal leading-5 text-[#4d4d4d]">
          <p className="m-0 flex gap-2">
            <span className="mt-2 h-1.25 w-1.25 shrink-0 rounded-full bg-[#11A366]" />
            <span>برای دسترسی کامل به امکانات سامانه ابتدا اعتبار زمانی پنل خود را فعال کنید.</span>
          </p>
          <p className="m-0 flex gap-2">
            <span className="mt-2 h-1.25 w-1.25 shrink-0 rounded-full bg-[#11A366]" />
            <span>سپس یکی از بسته‌های اعتباری را خریداری کنید.</span>
          </p>
        </div>
        <button
          className="mt-4 inline-flex h-10 rounded-xl w-full items-center justify-center gap-2 bg-[#0048c4] px-4 text-sm font-semibold leading-5 text-white"
          onClick={() => navigateTo("/account/credit/panel")}
          type="button"
        >
          <LinearWalletAdd color="white" className="w-5 h-5 text-white"/>
          <span>افزایش اعتبار</span>
        </button>
      </div>
    </BottomSheet>
  );
}

function getAccountHeader(profile?: UserProfile) {
  const fullName = [profile?.name, profile?.family]
    .map((value) => value?.trim())
    .filter(Boolean)
    .join(" ");
  const isAuthorized = Number(profile?.authorized ?? 0) === 1;

  if (!isAuthorized) {
    return { color: "#C11004", label: "احراز هویت نشده" };
  }

  return {
    color: "#0048C4",
    label: fullName || "کاربر شناسا",
  };
}

function navigateTo(path: string) {
  window.history.pushState({}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

function useLogoutAccount() {
  const logoutMutation = useLogoutMutation();

  const handleLogout = () => {
    if (logoutMutation.isPending) {
      return;
    }

    logoutMutation.mutate(undefined, {
      onSettled: () => {
        navigateTo("/login/phone");
      },
    });
  };

  return { handleLogout, isLoggingOut: logoutMutation.isPending };
}

function LoggedOutAccountHeader() {
  return (
    <section className="bg-white pt-4" aria-label="ورود به حساب">
      <div className="px-4 pb-2 pt-2">
        <RouteLink
          className="flex h-14 w-full items-center gap-2 rounded-xl border border-[#0048c4] px-4 text-[#0048c4] [direction:ltr] focus-visible:outline-3 focus-visible:outline-offset-[-3px] focus-visible:outline-[#0048c440]"
          to="/login/phone"
        >
          <ChevronLeftIcon className="h-6 w-6 shrink-0" />
          <span className="min-w-0 flex-1 truncate text-right text-base font-medium leading-6 [direction:rtl]">
            ورود به حساب کاربری
          </span>
          <AccountIcon className="h-6 w-6 shrink-0" name="lock" />
        </RouteLink>

        <p className="m-0 mt-4 text-right text-sm font-normal leading-5 text-[#4d4d4d]">
          برای استفاده از تمام امکانات وارد حساب کاربری خود شوید.
        </p>
      </div>
      <Divider />
    </section>
  );
}

function AccountSection({
  actions,
  className = "",
  spacedDividers = false,
}: {
  actions: AccountAction[];
  className?: string;
  spacedDividers?: boolean;
}) {
  return (
    <section className={`bg-white ${className}`} aria-label="گزینه‌های حساب">
      {actions.map((action, index) => (
        <AccountMenuRow
          action={action}
          hasDivider={index < actions.length - 1}
          key={action.label}
          spacedDivider={spacedDividers}
        />
      ))}
    </section>
  );
}

function AccountMenuRow({
  action,
  hasDivider = false,
  spacedDivider = false,
}: {
  action: AccountAction;
  hasDivider?: boolean;
  spacedDivider?: boolean;
}) {
  const content = (
    <>
      <ChevronLeftIcon className="h-6 w-6 shrink-0 text-[#4d4d4d]" />
      <span className="min-w-0 flex-1 truncate text-right text-base font-medium leading-6 [direction:rtl]">
        {action.label}
      </span>
      <AccountIcon className="h-6 w-6 shrink-0 text-[#4d4d4d]" name={action.icon} />
    </>
  );

  return (
    <>
      {action.to ? (
        <RouteLink
          className="flex h-14 w-full cursor-pointer items-center gap-2 bg-white px-4 text-[#1a1a1a] [direction:ltr] focus-visible:outline-3 focus-visible:outline-offset-[-3px] focus-visible:outline-[#0048c440]"
          onClick={(event) => {
            if (action.requiresAuth && !getStoredAuthSession()) {
              event.preventDefault();
              storeLoginRedirectPath(action.to ?? "/account");
              navigateTo("/login/phone");
              return;
            }

            if (action.activeRole) {
              setStoredActiveRole(action.activeRole);
            }

            action.onClick?.();
          }}
          to={action.to}
        >
          {content}
        </RouteLink>
      ) : (
        <button
          className="flex h-14 w-full cursor-pointer items-center gap-2 bg-white px-4 text-[#1a1a1a] [direction:ltr] focus-visible:outline-3 focus-visible:outline-offset-[-3px] focus-visible:outline-[#0048c440]"
          onClick={action.onClick}
          type="button"
        >
          {content}
        </button>
      )}
      {hasDivider ? <Divider spaced={spacedDivider} /> : null}
    </>
  );
}

function DangerAccountRow({ action }: { action: AccountAction }) {
  const content = (
    <div className="flex justify-center items-center gap-2 w-full">
      <span className="truncate text-sm font-semibold leading-5 [direction:rtl]">
        {action.label}
      </span>
      <AccountIcon className="h-5 w-5 shrink-0 text-[#C11004]" name={action.icon} />
    </div>
  );

  if (action.to) {
    return (
      <RouteLink
        className="mx-4 my-4 flex py-2.5 cursor-pointer items-center gap-2 rounded-[10px] border border-[#C11004] bg-white px-4 text-[#C11004] [direction:ltr] focus-visible:outline-3 focus-visible:outline-offset-[-3px] focus-visible:outline-[#c1100440]"
        to={action.to}
      >
        {content}
      </RouteLink>
    );
  }

  return (
    <button
      className="mx-4 mb-3 mt-2 flex h-10 w-[calc(100%-2rem)] cursor-pointer items-center gap-2 rounded-[10px] border border-[#C11004] bg-white px-4 text-[#C11004] [direction:ltr] focus-visible:outline-3 focus-visible:outline-offset-[-3px] focus-visible:outline-[#c1100440]"
      onClick={action.onClick}
      type="button"
    >
      {content}
    </button>
  );
}

function Divider({ spaced = false }: { spaced?: boolean }) {
  return (
    <div className={spaced ? "py-0.5" : ""} aria-hidden="true">
      <div className="mx-4 h-px bg-[#cccccc]" />
    </div>
  );
}

function ChevronLeftIcon({ className = "" }: { className?: string }) {
  return <LinearArrowLeft1 aria-hidden="true" className={className} />;
}

function AccountNotificationButton() {
  const { data: unreadNotificationsCount = 0 } = useNotificationUnreadCountQuery({
    enabled: Boolean(getStoredAuthSession()),
  });

  return (
    <RouteLink
      aria-label="اعلان‌ها"
      className="relative grid h-10 w-10 place-items-center rounded-full text-[#1a1a1a] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#0048c440]"
      to="/notifications"
    >
      <LinearNotification className="h-6 w-6" />
      {unreadNotificationsCount > 0 ? (
        <span
          aria-hidden="true"
          className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-[#ef1f1f] ring-2 ring-white"
        />
      ) : null}
    </RouteLink>
  );
}

function AccountIcon({
  className = "",
  name,
}: {
  className?: string;
  name: AccountIconName;
}) {
  const Icon = accountIconMap[name];

  return <Icon aria-hidden="true" className={className} />;
}
