import { useState } from "react";
import { TopBarNavigationLayout } from "../app/TopBarNavigationLayout";
import { TopBar } from "../components/TopBar";
import { RouteLink } from "../routes/RouteLink";
import { logout } from "../api/api-client";
import {
  formatMobileForDisplay,
  getStoredAuthSession,
  type AuthSession,
} from "../api/api-client";
import { currentAccountUserType } from "./account/accountUserType";

type AccountAction = {
  icon: AccountIconName;
  label: string;
  onClick?: () => void;
  to?: string;
};

type AccountIconName =
  | "agency"
  | "article"
  | "bookmark"
  | "building"
  | "dashboard"
  | "eye"
  | "identity"
  | "info"
  | "legal"
  | "lock"
  | "note"
  | "plus"
  | "ranking"
  | "request"
  | "setting"
  | "tag"
  | "user"
  | "wallet"
  | "wallet-add";

const businessActions: AccountAction[] = [
  { icon: "user", label: "مشاور مستقل", to: "/account/dashboard" },
  { icon: "building", label: "مشاور آژانس جلیلیان", to: "/account/dashboard" },
];

const loggedOutBusinessActions: AccountAction[] = [
  { icon: "plus", label: "ایجاد کسب و کار", to: "/new-ad" },
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
  { icon: "identity", label: "تایید هویت", to: "/account/identity" },
  { icon: "user", label: "مشخصات من", to: "/account/profile" },
  { icon: "tag", label: "آگهی‌های من", to: "/account/my-ads/empty" },
  { icon: "bookmark", label: "نشان‌ها", to: "/account/bookmarks" },
  { icon: "note", label: "یادداشت‌ها", to: "/account/notes" },
  { icon: "wallet", label: "کیف پول", to: "/account/wallet" },
];

const secondaryActions: AccountAction[] = [
  { icon: "setting", label: "تنظیمات", to: "/account/about" },
  { icon: "info", label: "درباره ما", to: "/account/about" },
  { icon: "legal", label: "ضوابط و قوانین", to: "/account/about" },
  { icon: "article", label: "مقالات تخصصی املاک", to: "/account/about" },
];

const loggedOutSecondaryActions: AccountAction[] = [
  { icon: "setting", label: "تنظیمات", to: "/account/about" },
];

export function MyAccountPage() {
  const authSession = getStoredAuthSession();
  const accountType = authSession?.accountType ?? currentAccountUserType;

  if (accountType === "independent-consultant") {
    return <IndependentConsultantAccountPage />;
  }

  return <StandardAccountPage authSession={authSession} />;
}

function IndependentConsultantAccountPage() {
  const { isLoggingOut, handleLogout } = useLogoutAccount();
  const businessActions: AccountAction[] = [
    { icon: "user", label: "ناصر اشرفی", to: "/account/profile" },
    { icon: "agency", label: "املاک جلیلیان", to: "/account/dashboard" },
  ];
  const consultantActions: AccountAction[] = [
    { icon: "dashboard", label: "داشبورد", to: "/account/dashboard" },
    { icon: "ranking", label: "نشان‌ها و رتبه", to: "/account/ranking" },
    { icon: "building", label: "صفحه مشاور", to: "/account/profile" },
    { icon: "tag", label: "مدیریت آگهی‌ها", to: "/account/ad-management" },
    { icon: "request", label: "مدیریت درخواست", to: "/account/requests" },
    { icon: "wallet-add", label: "افزایش اعتبار", to: "/account/credit/panel" },
  ];

  return (
    <TopBarNavigationLayout
      activeKey="account"
      contentClassName="flex flex-col gap-4 bg-[#f0f0f0]"
      frameClassName="bg-[#f0f0f0] text-[#1a1a1a] [direction:rtl]"
      topBar={<TopBar
        actions={[
          {
            icon: <NotificationIcon className="h-6 w-6" />,
            id: "notifications",
            label: "اعلان‌ها",
            to: "/chat",
          },
        ]}
        backTo="/home"
        title="حساب من"
      />}
    >

      <section className="shrink-0 bg-white pb-1 pt-2" aria-label="اطلاعات مشاور">
        <div className="flex h-[104px] items-center gap-4 px-4">
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

        <Divider spaced />
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
            icon: "lock",
            label: isLoggingOut ? "در حال خروج..." : "خروج از حساب",
            onClick: handleLogout,
          },
        ]}
      />
    </TopBarNavigationLayout>
  );
}

function StandardAccountPage({ authSession }: { authSession: AuthSession | null }) {
  const isLoggedInUnverified = authSession !== null;
  const { isLoggingOut, handleLogout } = useLogoutAccount();

  return (
    <TopBarNavigationLayout
      activeKey="account"
      contentClassName="bg-[#f0f0f0] pb-4"
      frameClassName="bg-[#f0f0f0] text-[#1a1a1a] [direction:rtl]"
      topBar={<TopBar showBack={false} title="حساب من" />}
    >
      {isLoggedInUnverified ? (
        <section className="bg-white" aria-label="وضعیت حساب">
          <div className="flex h-32 items-center gap-4 px-4 [direction:rtl]">
            <div className="grid h-[72px] w-[72px] shrink-0 place-items-center rounded-full bg-[#e0e0e0] text-[#808080]">
              <AccountIcon name="user" className="h-8 w-8" />
            </div>

            <div className="min-w-0 flex-1 text-right">
              <p className="m-0 text-sm font-semibold leading-5 text-[#0048c4]">
                احراز هویت نشده
              </p>
              <p className="m-0 mt-2 text-sm font-medium leading-5 text-[#808080] [direction:ltr]">
                {formatMobileForDisplay(authSession?.mobile ?? "")}
              </p>
            </div>
          </div>
          <Divider />
        </section>
        ) : (
          <LoggedOutAccountHeader />
        )}

        <AccountSection actions={isLoggedInUnverified ? businessActions : loggedOutBusinessActions} />

        <div className="h-4 bg-[#f0f0f0]" />

        <AccountSection actions={isLoggedInUnverified ? primaryActions : loggedOutPrimaryActions} />

        <div className="h-4 bg-[#f0f0f0]" />

        <AccountSection actions={isLoggedInUnverified ? secondaryActions : loggedOutSecondaryActions} />

        {isLoggedInUnverified ? (
          <>
            <div className="h-4 bg-[#f0f0f0]" />
            <AccountSection
              actions={[
                {
                  icon: "lock",
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

function navigateTo(path: string) {
  window.history.pushState({}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

function useLogoutAccount() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = () => {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);
    logout().finally(() => {
      setIsLoggingOut(false);
      navigateTo("/login/phone");
    });
  };

  return { handleLogout, isLoggingOut };
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

function Divider({ spaced = false }: { spaced?: boolean }) {
  return (
    <div className={spaced ? "py-0.5" : ""} aria-hidden="true">
      <div className="mx-4 h-px bg-[#cccccc]" />
    </div>
  );
}

function ChevronLeftIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="m15 6-6 6 6 6" />
    </svg>
  );
}

function NotificationIcon({ className = "" }: { className?: string }) {
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
      <path d="M17.5 10a5.5 5.5 0 0 0-11 0v3.5l-1.5 2h14l-1.5-2V10Z" />
      <path d="M9.75 18a2.35 2.35 0 0 0 4.5 0" />
    </svg>
  );
}

function AccountIcon({
  className = "",
  name,
}: {
  className?: string;
  name: AccountIconName;
}) {
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
      {name === "article" ? (
        <>
          <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v18H6.5A2.5 2.5 0 0 1 4 18.5v-13Z" />
          <path d="M8 7h8M8 11h8M8 15h5" />
        </>
      ) : null}
      {name === "bookmark" ? <path d="M7 4h10v16l-5-3-5 3V4Z" /> : null}
      {name === "building" ? (
        <>
          <path d="M4 21V5l10 3v13" />
          <path d="M14 12h6v9" />
          <path d="M8 9h2M8 13h2M8 17h2M17 16h.01" />
        </>
      ) : null}
      {name === "dashboard" ? (
        <>
          <rect height="8" rx="1" width="8" x="3" y="3" />
          <rect height="8" rx="1" width="8" x="13" y="3" />
          <rect height="8" rx="1" width="8" x="3" y="13" />
          <rect height="8" rx="1" width="8" x="13" y="13" />
        </>
      ) : null}
      {name === "eye" ? (
        <>
          <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
          <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
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
          <path d="M12 3v18M6 7h12" />
          <path d="M6 7 3.5 13h5L6 7ZM18 7l-2.5 6h5L18 7Z" />
          <path d="M8 21h8" />
        </>
      ) : null}
      {name === "lock" ? (
        <>
          <rect height="11" rx="2" width="14" x="5" y="10" />
          <path d="M8 10V7a4 4 0 0 1 8 0v3" />
        </>
      ) : null}
      {name === "note" ? (
        <>
          <rect height="16" rx="2" width="14" x="5" y="4" />
          <path d="M9 3v3M15 3v3M8.5 10h7M8.5 14h5" />
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
          <path d="M6 3h10l3 3v15H6V3Z" />
          <path d="M16 3v4h4M9 11h6M9 15h4M17 17l2 2 3-4" />
        </>
      ) : null}
      {name === "setting" ? (
        <>
          <path d="M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Z" />
          <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2.05 2.05 0 0 1-2.9 2.9l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1.03 1.56V21a2.05 2.05 0 0 1-4.1 0v-.09a1.7 1.7 0 0 0-1.11-1.56 1.7 1.7 0 0 0-1.87.34l-.06.06a2.05 2.05 0 0 1-2.9-2.9l.06-.06A1.7 1.7 0 0 0 4.3 15a1.7 1.7 0 0 0-1.56-1.03h-.09a2.05 2.05 0 0 1 0-4.1h.09A1.7 1.7 0 0 0 4.3 8.74a1.7 1.7 0 0 0-.34-1.87L3.9 6.8a2.05 2.05 0 0 1 2.9-2.9l.06.06A1.7 1.7 0 0 0 8.73 4.3h.08a1.7 1.7 0 0 0 1.03-1.56v-.09a2.05 2.05 0 0 1 4.1 0v.09a1.7 1.7 0 0 0 1.03 1.56 1.7 1.7 0 0 0 1.87-.34l.06-.06a2.05 2.05 0 0 1 2.9 2.9l-.06.06a1.7 1.7 0 0 0-.34 1.87v.08a1.7 1.7 0 0 0 1.56 1.03h.09a2.05 2.05 0 0 1 0 4.1h-.09A1.7 1.7 0 0 0 19.4 15Z" />
        </>
      ) : null}
      {name === "tag" ? (
        <>
          <path d="M20 13 13 20 4 11V4h7l9 9Z" />
          <path d="M8.5 8.5h.01" />
        </>
      ) : null}
      {name === "user" ? (
        <>
          <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
          <path d="M4.5 21a7.5 7.5 0 0 1 15 0" />
        </>
      ) : null}
      {name === "wallet" ? (
        <>
          <path d="M4 7.5A2.5 2.5 0 0 1 6.5 5H19v14H6.5A2.5 2.5 0 0 1 4 16.5v-9Z" />
          <path d="M17 12h3v4h-3a2 2 0 0 1 0-4Z" />
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
