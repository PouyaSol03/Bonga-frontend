import { useState, type ReactNode } from "react";

import { TopBarNavigationLayout } from "../app/TopBarNavigationLayout";
import { BottomSheet } from "../components/BottomSheet";
import { TopBar } from "../components/TopBar";
import { RouteLink } from "../routes/RouteLink";
import { useMyProfileQuery } from "../hooks/account.hooks";
import { useLogoutMutation } from "../hooks/auth.hooks";
import { formatMobileForDisplay } from "../services/auth.service";
import type { UserProfile } from "../services/account.service";
import NotificationIcon from "../assets/icons/NotificationIcon";
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
    { icon: "ranking", label: "شناساها و رتبه", to: "/dashboard/ranking" },
    { icon: "building", label: "صفحه آژانس", to: "/dashboard/agency" },
    { icon: "tag", label: "مدیریت آگهی‌ها", to: "/dashboard/ads" },
    { icon: "request", label: "مدیریت درخواست‌ها", to: "/dashboard/requests" },
    { icon: "team", label: "مدیریت مشاورین", to: "/dashboard/team" },
    { icon: "wallet", label: "افزایش اعتبار", to: "/dashboard/payments" },
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
              <AccountIcon name="user" color="#CCCCCC" className="h-8 w-8" />
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
      contentClassName="px-3 pb-4 pt-7"
      heightClassName="h-[246px]"
      isOpen={isOpen}
      onClose={onClose}
      panelPaddingClassName="pt-3"
      showHeader={false}
      showHeaderDivider={false}
      zIndexClassName="z-[100]"
    >
      <div className="text-center">
        <img
          alt="ثبت موفق حساب"
          className="mx-auto h-[78px] w-[78px]"
          src="/figma/account/business-success.svg"
        />
        <h2 className="m-0 mt-3 text-sm font-semibold leading-5 text-[#11A366]">
          حساب شما با موفقیت ثبت شد
        </h2>
        <div className="mx-auto mt-2 max-w-[318px] space-y-1 text-right text-xs font-normal leading-5 text-[#4d4d4d]">
          <p className="m-0 flex gap-2">
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#11A366]" />
            <span>برای دسترسی کامل به امکانات سامانه ابتدا اعتبار زمانی پنل خود را فعال کنید.</span>
          </p>
          <p className="m-0 flex gap-2">
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#11A366]" />
            <span>سپس یکی از بسته‌های اعتباری را خریداری کنید.</span>
          </p>
        </div>
        <button
          className="mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-[#0048c4] px-4 text-sm font-semibold leading-5 text-white"
          onClick={() => navigateTo("/account/credit/panel")}
          type="button"
        >
          <span>افزایش اعتبار</span>
          <AccountIcon className="h-5 w-5 shrink-0 text-white" name="wallet-add" />
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
      <div>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M11.3628 1.875C11.9134 1.875 12.4061 2.20708 12.6193 2.71077L13.377 4.50033H16.6663C17.0115 4.50033 17.2913 4.78015 17.2913 5.12533C17.2912 5.47035 17.0114 5.75033 16.6663 5.75033H16.1439L15.5229 16.1279C15.4562 17.243 14.5408 18.125 13.4201 18.125H6.57926C5.45854 18.125 4.54315 17.243 4.4764 16.1279L3.85547 5.75033H3.33301C2.98794 5.75033 2.70818 5.47035 2.70801 5.12533C2.70801 4.78015 2.98783 4.50033 3.33301 4.50033H6.6224L7.38005 2.71077C7.59331 2.20717 8.0858 1.875 8.63656 1.875H11.3628ZM5.72477 16.0531C5.75281 16.5214 6.13321 16.875 6.57926 16.875H13.4201C13.8662 16.875 14.2465 16.5214 14.2746 16.0531L14.8914 5.75033H5.10791L5.72477 16.0531ZM7.52246 13.3748V8.87533C7.52246 8.53027 7.80245 8.25052 8.14746 8.25033C8.49264 8.25033 8.77246 8.53015 8.77246 8.87533V13.3748C8.77246 13.72 8.49264 13.9998 8.14746 13.9998C7.80245 13.9996 7.52246 13.7199 7.52246 13.3748ZM11.2269 13.3748V8.87533C11.2269 8.53015 11.5067 8.25033 11.8519 8.25033C12.1969 8.25052 12.4769 8.53027 12.4769 8.87533V13.3748C12.4769 13.7199 12.1969 13.9996 11.8519 13.9998C11.5067 13.9998 11.2269 13.72 11.2269 13.3748ZM8.63656 3.125C8.59475 3.125 8.551 3.15044 8.53076 3.19824L7.97982 4.50033H12.0195L11.4686 3.19824C11.4484 3.15058 11.4046 3.125 11.3628 3.125H8.63656Z" fill="#C11004" />
        </svg>
      </div>
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
  return (
    <span className={`grid place-items-center ${className}`} aria-hidden="true">
      <img
        alt=""
        className="h-[9.5px] w-[5.5px]"
        src="/figma/account/arrow-left.svg"
      />
    </span>
  );
}

const accountIconAssetMap: Partial<Record<AccountIconName, string>> = {
  bookmark: "/figma/account/bookmark.svg",
  identity: "/figma/account/identity.svg",
  lock: "/figma/account/lock.svg",
  message: "/figma/account/nav-chat.svg",
  note: "/figma/account/note.svg",
  plus: "/figma/account/add.svg",
  ranking: "/icons/ranking.svg",
  setting: "/figma/account/setting.svg",
  tag: "/figma/account/tag.svg",
  user: "/figma/account/user.svg",
  wallet: "/figma/account/wallet.svg",
};

function FigmaAccountIcon({
  className = "",
  src,
}: {
  className?: string;
  src: string;
}) {
  return <img alt="" aria-hidden="true" className={className} src={src} />;
}

function AccountNotificationButton() {
  return (
    <RouteLink
      aria-label="اعلان‌ها"
      className="relative grid h-10 w-10 place-items-center rounded-full text-[#1a1a1a] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#0048c440]"
      to="/notifications"
    >
      <NotificationIcon />
      <span
        aria-hidden="true"
        className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-[#ef1f1f] ring-2 ring-white"
      />
    </RouteLink>
  );
}

function TrashIcon() {
  return (
    <path
      d="M232.863 215.875C233.413 215.875 233.906 216.207 234.119 216.711L234.877 218.5H238.166C238.512 218.5 238.791 218.78 238.791 219.125C238.791 219.47 238.511 219.75 238.166 219.75H237.644L237.023 230.128C236.956 231.243 236.041 232.125 234.92 232.125H228.079C226.959 232.125 226.043 231.243 225.976 230.128L225.355 219.75H224.833C224.488 219.75 224.208 219.47 224.208 219.125C224.208 218.78 224.488 218.5 224.833 218.5H228.122L228.88 216.711C229.093 216.207 229.586 215.875 230.137 215.875H232.863ZM227.225 230.053C227.253 230.521 227.633 230.875 228.079 230.875H234.92C235.366 230.875 235.747 230.521 235.775 230.053L236.391 219.75H226.608L227.225 230.053ZM229.022 227.375V222.875C229.022 222.53 229.302 222.251 229.647 222.25C229.993 222.25 230.272 222.53 230.272 222.875V227.375C230.272 227.72 229.993 228 229.647 228C229.302 228 229.022 227.72 229.022 227.375ZM232.727 227.375V222.875C232.727 222.53 233.007 222.25 233.352 222.25C233.697 222.251 233.977 222.53 233.977 222.875V227.375C233.977 227.72 233.697 228 233.352 228C233.007 228 232.727 227.72 232.727 227.375ZM230.137 217.125C230.095 217.125 230.051 217.15 230.031 217.198L229.48 218.5H233.52L232.969 217.198C232.948 217.151 232.905 217.125 232.863 217.125H230.137Z"
      fill="currentColor"
      transform="translate(-219 -212)"
    />
  );
}

function AccountIcon({
  className = "",
  name,
  color,
}: {
  className?: string;
  name: AccountIconName;
  color?: string
}) {
  const assetSrc = color ? undefined : accountIconAssetMap[name];

  if (assetSrc) {
    return <FigmaAccountIcon className={className} src={assetSrc} />;
  }

  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      {name === "agency" ? (
        <>
          <path d="M4 21V6l8-3 8 3v15" />
          <path d="M9 21v-6h6v6" />
          <path d="M8 8h.01M12 8h.01M16 8h.01M8 12h.01M16 12h.01" />
        </>
      ) : null}
      {name === "headphone" ? (
        <>
          <path xmlns="http://www.w3.org/2000/svg" d="M5 9C5 5.68629 8.13401 3 12 3C15.866 3 19 5.68629 19 9M19 17V19C19 20.1046 18.1046 21 17 21H12M4.10496 9.59854L2.4458 10.7032C2.16731 10.8886 2 11.201 2 11.5356V14.4644C2 14.799 2.16731 15.1114 2.4458 15.2968L4.10496 16.4015C4.66094 16.7716 5.37255 16.8158 5.97002 16.5172C6.60124 16.2017 7 15.5566 7 14.851V11.149C7 10.4434 6.60124 9.7983 5.97002 9.48283C5.37255 9.18422 4.66094 9.22837 4.10496 9.59854ZM18.03 9.48283C18.6274 9.18422 19.3391 9.22837 19.895 9.59854L21.5542 10.7032C21.8327 10.8886 22 11.201 22 11.5356V14.4644C22 14.799 21.8327 15.1114 21.5542 15.2968L19.895 16.4015C19.3391 16.7716 18.6274 16.8158 18.03 16.5172C17.3988 16.2017 17 15.5566 17 14.851V11.149C17 10.4434 17.3988 9.7983 18.03 9.48283Z" stroke="#4D4D4D" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </>
      ) : null}
      {name === "bookmark" ?
        <>
          <path xmlns="http://www.w3.org/2000/svg" d="M12 17L19 21V5C19 4 18 3 17 3H7C6 3 5 4 5 5V21L12 17Z" stroke="#4D4D4D" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </>
        : null}
      {name === "trash" ? <TrashIcon /> : null}
      {name === "team" ? (
        <g>
          <path d="M15.25 19C15.25 16.6528 13.3472 14.75 11 14.75H7C4.6528 14.75 2.75 16.6528 2.75 19V20.25H15.25V19ZM19.5264 5.41797C19.8209 5.17766 20.2557 5.19512 20.5303 5.46973L22.5303 7.46973C22.8232 7.76262 22.8232 8.23738 22.5303 8.53027L18.5303 12.5303C18.3896 12.6709 18.1989 12.75 18 12.75H16C15.5858 12.75 15.25 12.4142 15.25 12V10C15.25 9.80109 15.3291 9.61038 15.4697 9.46973L19.4697 5.46973L19.5264 5.41797ZM12.25 7C12.25 5.20508 10.7949 3.75 9 3.75C7.20507 3.75 5.75 5.20507 5.75 7C5.75 8.79493 7.20507 10.25 9 10.25C10.7949 10.25 12.25 8.79492 12.25 7ZM16.75 10.3105V11.25H17.6895L20.9395 8L20 7.06055L16.75 10.3105ZM16.75 21C16.75 21.4142 16.4142 21.75 16 21.75H2C1.58579 21.75 1.25 21.4142 1.25 21V19C1.25 15.8244 3.82436 13.25 7 13.25H11C14.1756 13.25 16.75 15.8244 16.75 19V21ZM13.75 7C13.75 9.62336 11.6233 11.75 9 11.75C6.37665 11.75 4.25 9.62335 4.25 7C4.25 4.37665 6.37665 2.25 9 2.25C11.6233 2.25 13.75 4.37664 13.75 7Z" fill="#4D4D4D" stroke="none" />
        </g>
      ) : null}
      {name === "building" ? (
        <g>
          <path d="M13.1328 17.4004C13.1328 17.3488 13.0788 17.2501 12.9414 17.25H11.0586C10.9212 17.2501 10.8672 17.3488 10.8672 17.4004V20.25H13.1328V17.4004ZM13.4121 12.1504C13.8262 12.1506 14.1621 12.4863 14.1621 12.9004C14.1619 13.3143 13.826 13.6502 13.4121 13.6504H10.5879C10.174 13.6502 9.8381 13.3143 9.83789 12.9004C9.83789 12.4863 10.1738 12.1506 10.5879 12.1504H13.4121ZM13.4121 8.54981C13.8261 8.54999 14.162 8.8858 14.1621 9.29981C14.1621 9.71391 13.8262 10.0496 13.4121 10.0498H10.5879C10.1738 10.0496 9.83789 9.71391 9.83789 9.29981C9.838 8.8858 10.1739 8.54999 10.5879 8.54981H13.4121ZM14.6328 20.25H17.3672L17.3574 6.43848L17.3506 6.40039C17.3361 6.35964 17.2975 6.31363 17.2217 6.29492L6.87891 3.75684C6.8065 3.73907 6.7404 3.75712 6.69336 3.792C6.64749 3.82611 6.63284 3.8649 6.63281 3.90039L5.13281 3.89942C5.13354 2.78251 6.21137 2.0493 7.23633 2.30078L17.5791 4.83789C18.3098 5.0173 18.8571 5.66093 18.8574 6.4375L18.8672 20.25H20C20.4142 20.25 20.75 20.5858 20.75 21C20.75 21.4142 20.4142 21.75 20 21.75H4C3.58579 21.75 3.25 21.4142 3.25 21C3.25 20.5858 3.58579 20.25 4 20.25H5.13281V3.89942L5.88281 3.90039H6.63281V20.25H9.36719V17.4004C9.36719 16.4579 10.1567 15.7501 11.0586 15.75H12.9414C13.8434 15.7501 14.6328 16.4579 14.6328 17.4004V20.25Z" fill="#4D4D4D" stroke="none" />
        </g>
      ) : null}
      {name === "dashboard" ? (
        <g>
          <path d="M9.75 16.5C9.75 16.3619 9.63809 16.25 9.5 16.25H4C3.86192 16.25 3.75 16.3619 3.75 16.5V20C3.75 20.1381 3.86192 20.25 4 20.25H9.5C9.63809 20.25 9.75 20.1381 9.75 20V16.5ZM20.25 12.5C20.25 12.3619 20.1381 12.25 20 12.25H14.5C14.3619 12.25 14.25 12.3619 14.25 12.5V20C14.25 20.1381 14.3619 20.25 14.5 20.25H20C20.1381 20.25 20.25 20.1381 20.25 20V12.5ZM9.75 4C9.75 3.86192 9.63808 3.75 9.5 3.75H4C3.86193 3.75 3.75 3.86193 3.75 4V11.5C3.75 11.6381 3.86192 11.75 4 11.75H9.5C9.63809 11.75 9.75 11.6381 9.75 11.5V4ZM20.25 4C20.25 3.86192 20.1381 3.75 20 3.75H14.5C14.3619 3.75 14.25 3.86192 14.25 4V7.5C14.25 7.63808 14.3619 7.75 14.5 7.75H20C20.1381 7.75 20.25 7.63808 20.25 7.5V4ZM11.25 20C11.25 20.9665 10.4665 21.75 9.5 21.75H4C3.03352 21.75 2.25 20.9665 2.25 20V16.5C2.25 15.5335 3.03352 14.75 4 14.75H9.5C10.4665 14.75 11.25 15.5335 11.25 16.5V20ZM21.75 20C21.75 20.9665 20.9665 21.75 20 21.75H14.5C13.5335 21.75 12.75 20.9665 12.75 20V12.5C12.75 11.5335 13.5335 10.75 14.5 10.75H20C20.9665 10.75 21.75 11.5335 21.75 12.5V20ZM11.25 11.5C11.25 12.4665 10.4665 13.25 9.5 13.25H4C3.03352 13.25 2.25 12.4665 2.25 11.5V4C2.25 3.03351 3.03351 2.25 4 2.25H9.5C10.4665 2.25 11.25 3.03352 11.25 4V11.5ZM21.75 7.5C21.75 8.46648 20.9665 9.25 20 9.25H14.5C13.5335 9.25 12.75 8.46648 12.75 7.5V4C12.75 3.03352 13.5335 2.25 14.5 2.25H20C20.9665 2.25 21.75 3.03352 21.75 4V7.5Z" fill="#4D4D4D" stroke="none" />
        </g>
      ) : null}
      {name === "eye" ? (
        <>
          <path d="M2.5 12s3.5-6.5 9.5-6.5 9.5 6.5 9.5 6.5-3.5 6.5-9.5 6.5S2.5 12 2.5 12Z" />
          <circle cx="12" cy="12" r="2.75" />
        </>
      ) : null}
      {name === "identity" ? (
        <>
          <rect height="14" rx="2" width="18" x="3" y="5" />
          <path d="M8.5 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM5.5 16a3 3 0 0 1 6 0M14 9h4M14 13h4M14 16h3" />
        </>
      ) : null}
      {name === "info" ? (
        <>
          <path d="M12 17v-6" />
          <path d="M12 7.5h.01" />
          <rect height="18" rx="2" width="14" x="5" y="3" />
        </>
      ) : null}
      {name === "legal" ? (
        <>
          <path xmlns="http://www.w3.org/2000/svg" d="M11.5 10.5005L8.5 13.5M8.5 18H15.5M3 5V19C3 20.6569 4.34315 22 6 22H18C19.6569 22 21 20.6569 21 19V5C21 3.34315 19.6569 2 18 2H6C4.34315 2 3 3.34315 3 5ZM12.0002 6.00012L16.0005 10.0005L13.5004 12.5006L9.5 8.5003L12.0002 6.00012Z" stroke="#4D4D4D" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </>
      ) : null}
      {name === "lock" ? (
        <>
          <rect height="11" rx="2" width="14" x="5" y="10" />
          <path d="M8 10V7a4 4 0 0 1 8 0v3" />
        </>
      ) : null}
      {name === "log_out" ? (
        <>
          <path xmlns="http://www.w3.org/2000/svg" d="M6.66667 7.05002C5.03 8.53319 4 10.501 4 12.9C4 17.3735 7.58172 21 12 21C16.4183 21 20 17.3735 20 12.9C20 10.501 18.97 8.53319 17.3333 7.05002M9.77778 5.25001L12 3L14.2222 5.25001M12 12V3.5479" stroke="#4D4D4D" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </>
      ) : null}
      {name === "note" ? (
        <>
          <path d="M7 3v3M12 3v3M17 3v3" />
          <path d="M6.5 4.5h11A2.5 2.5 0 0 1 20 7v11.5A2.5 2.5 0 0 1 17.5 21h-11A2.5 2.5 0 0 1 4 18.5V7a2.5 2.5 0 0 1 2.5-2.5Z" />
          <path d="M8 10h8M8 14h5" />
        </>
      ) : null}
      {name === "plus" ? <path d="M12 5v14M5 12h14" /> : null}
      {name === "ranking" ? (
        <>
          <path d="m12 3 1.55 3.13 3.45.5-2.5 2.43.59 3.44L12 10.88 8.91 12.5l.59-3.44L7 6.63l3.45-.5L12 3Z" />
          <path d="M4 21v-5h5v5M9.5 21v-7h5v7M15 21v-4h5v4M3 21h18" />
        </>
      ) : null}
      {name === "request" ? (
        <>
          <path xmlns="http://www.w3.org/2000/svg" d="M21 15V6C21 4.89543 20.1046 4 19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H11M7 9L17 9M7 13H12M7 17H7.01M21 19.5H15M16.5 22L14 19.5L16.5 17" stroke="#4D4D4D" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </>
      ) : null}
      {name === "setting" ? (
        <>
          <path d="M12 15.25a3.25 3.25 0 1 0 0-6.5 3.25 3.25 0 0 0 0 6.5Z" />
          <path d="M19.4 13.5a7.7 7.7 0 0 0 .05-3l2-1.55-2-3.45-2.45 1a7.4 7.4 0 0 0-2.6-1.5L14 2.4h-4l-.4 2.6A7.4 7.4 0 0 0 7 6.5l-2.45-1-2 3.45 2 1.55a7.7 7.7 0 0 0 .05 3l-2.05 1.55 2 3.45L7 17.5a7.4 7.4 0 0 0 2.6 1.5l.4 2.6h4l.4-2.6a7.4 7.4 0 0 0 2.6-1.5l2.45 1 2-3.45-2.05-1.55Z" />
        </>
      ) : null}
      {name === "tag" ? (
        <>
          <path xmlns="http://www.w3.org/2000/svg" d="M7.83617 13.3498L10.6529 16.1664M17.712 7.69446C17.712 6.91665 17.0814 6.28612 16.3037 6.28612C15.5259 6.28612 14.8953 6.91665 14.8953 7.69446C14.8953 8.47226 15.5259 9.10279 16.3037 9.10279C17.0814 9.10279 17.712 8.47226 17.712 7.69446ZM10.2833 20.45L3.54999 13.7167C2.81668 12.9834 2.81667 11.7944 3.54999 11.0611L11.0611 3.54999C11.4133 3.19783 11.8909 3 12.3889 3H21V11.6111C21 12.1091 20.8022 12.5867 20.45 12.9389L12.9389 20.45C12.2056 21.1833 11.0166 21.1833 10.2833 20.45Z" stroke="#4D4D4D" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </>
      ) : null}
      {name === "user" ? (
        <>
          <path d="M13 14H11C7.13401 14 4 17.134 4 21H20C20 17.134 16.866 14 13 14Z" stroke={color ? color : '#4D4D4D'} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke={color ? color : '#4D4D4D'} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </>
      ) : null}
      {name === "wallet" ? (
        <>
          <path d="M4 7.5h13.25A2.75 2.75 0 0 1 20 10.25v7A2.75 2.75 0 0 1 17.25 20H6.75A2.75 2.75 0 0 1 4 17.25V6.75A2.75 2.75 0 0 1 6.75 4h8.75A1.5 1.5 0 0 1 17 5.5v2" />
          <path d="M15 12.25h5v4h-5a2 2 0 0 1 0-4Z" />
          <path d="M17 14.25h.01" />
        </>
      ) : null}
      {name === "wallet-add" ? (
        <>
          <path d="M5 8a2.5 2.5 0 0 1 2.5-2.5H19v14H7.5A2.5 2.5 0 0 1 5 17V8Z" />
          <path d="M17 12.5h3.5v4H17a2 2 0 0 1 0-4ZM3.5 12h7M7 8.5v7" />
        </>
      ) : null}
    </svg>
  );
}
