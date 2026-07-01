import { useState, type ComponentType, type ReactNode, type SVGProps } from "react";

import { TopBarNavigationLayout } from "../app/TopBarNavigationLayout";
import { BottomSheet } from "../components/BottomSheet";
import { TopBar } from "../components/TopBar";
import { RouteLink } from "../routes/RouteLink";
import { useMyProfileQuery } from "../hooks/account.hooks";
import { useLogoutMutation } from "../hooks/auth.hooks";
import { formatMobileForDisplay } from "../services/auth.service";
import type { UserProfile } from "../services/account.service";

import {
  getStoredAuthSession,
  storeLoginRedirectPath,
  type AuthSession,
} from "../auth/auth-storage";
import {
  INDEPENDENT_CONSULTANT,
  REAL_ESTATE_CONSULTANT,
  REAL_ESTATE_MANAGER,
} from "../constants/roles.constants";
import { currentAccountUserType } from "./account/accountUserType";
import LinearRealestate from "../components/(icons)/LinearRealestate";
import LinearSupport from "../components/(icons)/LinearSupport";
import LinearFavourite from "../components/(icons)/LinearFavourite";
import LinearBuilding from "../components/(icons)/LinearBuilding";
import Dashboard from "../components/(icons)/Dashboard";
import LinearPreview from "../components/(icons)/LinearPreview";
import LinearUserConfirmation from "../components/(icons)/LinearUserConfirmation";
import LinearAbout from "../components/(icons)/LinearAbout";
import LinearLegal from "../components/(icons)/LinearLegal";
import LinearLogin from "../components/(icons)/LinearLogin";
import LinearDocument from "../components/(icons)/LinearDocument";
import LinearAdd from "../components/(icons)/LinearAdd";
import LinearRanking from "../components/(icons)/LinearRanking";
import LinearSettingBuilding from "../components/(icons)/LinearSettingBuilding";
import LinearDelete from "../components/(icons)/LinearDelete";
import LinearUserSolid from "../components/(icons)/LinearUserSolid";
import LinearWallet from "../components/(icons)/LinearWallet";
import LinearWalletAdd from "../components/(icons)/LinearWalletAdd";
import LinearNotification from "../components/(icons)/LinearNotification";
import LinearCheckmark from "../components/(icons)/LinearCheckmark";
import LinearComment from "../components/(icons)/LinearComment";
import LinearArrowLeft1 from "../components/(icons)/LinearArrowLeft1";
import LinearTag from "../components/(icons)/LinearTag";
import LinearRequest from "../components/(icons)/LinearRequest";
import LinearEditUser from "../components/(icons)/LinearEditUser";

type AccountAction = {
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
  bookmark: LinearFavourite,
  building: LinearBuilding,
  dashboard: Dashboard,
  eye: LinearPreview,
  identity: LinearUserConfirmation,
  info: LinearAbout,
  legal: LinearLegal,
  lock: LinearLogin,
  log_out: LinearLogin,
  message: LinearComment,
  note: LinearDocument,
  plus: LinearAdd,
  ranking: LinearRanking,
  request: LinearRequest,
  setting: LinearSettingBuilding,
  tag: LinearTag,
  team: LinearEditUser,
  trash: LinearDelete,
  user: LinearUserSolid,
  wallet: LinearWallet,
  "wallet-add": LinearWalletAdd,
};

const businessActions: AccountAction[] = [
  { icon: "user", label: "مشاور مستقل", to: "/account/dashboard" },
  { icon: "building", label: "مشاور آژانس جلیلیان", to: "/account/dashboard" },
];

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
  const authSession = getStoredAuthSession();
  const accountType = authSession?.accountType ?? currentAccountUserType;
  const [isBusinessSuccessOpen, setIsBusinessSuccessOpen] = useState(() =>
    new URLSearchParams(window.location.search).get("businessSuccess") === "1",
  );
  const businessSuccessSheet = (
    <AccountBusinessSuccessSheet
      isOpen={isBusinessSuccessOpen}
      onClose={() => {
        setIsBusinessSuccessOpen(false);
        clearBusinessSuccessQuery();
      }}
    />
  );

  if (authSession && isBusinessAccount(authSession, accountType)) {
    return <IndependentConsultantAccountPage businessSuccessSheet={businessSuccessSheet} />;
  }

  return <StandardAccountPage authSession={authSession} businessSuccessSheet={businessSuccessSheet} />;
}

function isBusinessAccount(authSession: AuthSession, accountType: string) {
  return (
    authSession.role === REAL_ESTATE_MANAGER ||
    authSession.role === REAL_ESTATE_CONSULTANT ||
    authSession.role === INDEPENDENT_CONSULTANT ||
    accountType === "agency-consultant" ||
    accountType === "independent-consultant"
  );
}

function IndependentConsultantAccountPage({ businessSuccessSheet }: { businessSuccessSheet?: ReactNode }) {
  const authSession = getStoredAuthSession();
  const { isLoggingOut, handleLogout } = useLogoutAccount();
  const isManager = authSession?.role === REAL_ESTATE_MANAGER;
  const consultantActions = getBusinessAccountActions(authSession?.role);
  const businessActions: AccountAction[] = [
    { icon: "user", label: "ناصر اشرفی", to: "/account/profile" },
    { icon: "agency", label: "املاک جلیلیان", to: "/account/dashboard" },
  ];

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

      <section className="shrink-0 bg-white pt-4" aria-label="اطلاعات مشاور">
        <div className="flex items-center gap-4 px-4">
          <img
            alt="ناصر اشرفی"
            className="h-[72px] w-[72px] shrink-0 rounded-full object-cover"
            src="/figma/account/consultant-profile.png"
          />
          <div className="min-w-0 flex-1 text-right">
            <p className="m-0 truncate text-base font-semibold leading-6 text-[#1a1a1a]">
              ناصر اشرفی
            </p>
            <p className="m-0 mt-2 text-sm font-medium leading-5 text-[#808080]">
              مشاور مستقل
            </p>
          </div>
        </div>

        {isManager ? (
          <DangerAccountRow
            action={{ icon: "trash", label: "حذف کسب و کار", to: "/account/delete-user" }}
          />
        ) : (
          <Divider spaced />
        )}
        <AccountSection actions={businessActions} spacedDividers />
      </section>

      <AccountSection
        actions={consultantActions}
        className="min-h-0 flex-1 pt-0.5"
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

function getBusinessAccountActions(role?: string | null): AccountAction[] {
  const managerActions: AccountAction[] = [
    { icon: "dashboard", label: "داشبورد", to: "/account/dashboard" },
    { icon: "ranking", label: "نشان ها و رتبه", to: "/dashboard/ranking" },
    { icon: "building", label: "صفحه آژانس", to: "/dashboard/agency" },
    { icon: "tag", label: "مدیریت آگهی‌ها", to: "/dashboard/ads" },
    { icon: "request", label: "مدیریت درخواست‌ها", to: "/dashboard/requests" },
    { icon: "team", label: "مدیریت مشاورین", to: "/dashboard/team" },
    { icon: "wallet-add", label: "افزایش اعتبار", to: "/dashboard/payments" },
    { icon: "message", label: "پیام‌ها", to: "/dashboard/messages" },
  ];

  if (role === REAL_ESTATE_MANAGER) {
    return managerActions;
  }

  if (role === REAL_ESTATE_CONSULTANT) {
    return [
      { icon: "dashboard", label: "داشبورد", to: "/account/dashboard" },
      { icon: "ranking", label: "شناساها و رتبه", to: "/dashboard/ranking" },
      { icon: "building", label: "صفحه آژانس", to: "/dashboard/agency" },
      { icon: "tag", label: "مدیریت آگهی‌ها", to: "/dashboard/ads" },
      { icon: "wallet", label: "افزایش اعتبار", to: "/dashboard/payments" },
      { icon: "message", label: "پیام‌ها", to: "/dashboard/messages" },
    ];
  }

  if (role === INDEPENDENT_CONSULTANT) {
    return [
      { icon: "dashboard", label: "داشبورد", to: "/account/dashboard" },
      { icon: "ranking", label: "شناساها و رتبه", to: "/dashboard/ranking" },
      { icon: "building", label: "صفحه مشاور", to: "/dashboard/agency" },
      { icon: "tag", label: "مدیریت آگهی‌ها", to: "/dashboard/ads" },
      { icon: "request", label: "مدیریت درخواست‌ها", to: "/dashboard/requests" },
      { icon: "wallet", label: "افزایش اعتبار", to: "/dashboard/payments" },
      { icon: "message", label: "پیام‌ها", to: "/dashboard/messages" },
    ];
  }

  return managerActions;
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
  const accountType = authSession?.accountType ?? currentAccountUserType;
  const hasCreatedBusiness = isLoggedIn && accountType !== "user";
  const accountHeader = getAccountHeader(profile);
  const displayMobile = profile?.mobile ?? authSession?.mobile ?? "";

  return (
    <TopBarNavigationLayout
      activeKey="account"
      contentClassName="bg-[#f0f0f0] pb-4"
      frameClassName="relative bg-[#f0f0f0] text-[#1a1a1a] [direction:rtl]"
      overlay={businessSuccessSheet}
      topBar={<TopBar showBack={false} startSlot={<AccountNotificationButton />} title="حساب من" />}
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

      <AccountSection actions={isLoggedIn && authSession?.role === "user" && !hasCreatedBusiness ? userBusinessActions : isLoggedIn ? businessActions : loggedOutBusinessActions} />

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
            if (!action.requiresAuth || getStoredAuthSession()) return;

            event.preventDefault();
            storeLoginRedirectPath(action.to ?? "/account");
            navigateTo("/login/phone");
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
  return (
    <RouteLink
      aria-label="اعلان‌ها"
      className="relative grid h-10 w-10 place-items-center rounded-full text-[#1a1a1a] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#0048c440]"
      to="/notifications"
    >
      <LinearNotification className="h-6 w-6" />
      <span
        aria-hidden="true"
        className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-[#ef1f1f] ring-2 ring-white"
      />
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
