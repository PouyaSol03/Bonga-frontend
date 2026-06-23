import { TopBarNavigationLayout } from "../app/TopBarNavigationLayout";
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
  { icon: "plus", label: "ایجاد کسب و کار", requiresAuth: true, to: "/new-ad/category" },
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

  if (authSession && accountType === "independent-consultant") {
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
      hideTopBar
      topBar={<TopBar
        actions={[
          {
            icon: (
              <span className="relative grid h-6 w-6 place-items-center">
                <NotificationIcon className="h-6 w-6" />
                <span
                  aria-hidden="true"
                  className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-[#ef1f1f] ring-2 ring-[#f0f0f0]"
                />
              </span>
            ),
            id: "notifications",
            label: "اعلان‌ها",
            to: "/notifications",
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
            icon: "log_out",
            label: isLoggingOut ? "در حال خروج..." : "خروج از حساب کاربری",
            onClick: handleLogout,
          },
        ]}
      />
    </TopBarNavigationLayout>
  );
}

function StandardAccountPage({ authSession }: { authSession: AuthSession | null }) {
  const isLoggedIn = authSession !== null;
  const { data: profile } = useMyProfileQuery({ enabled: isLoggedIn });
  const { isLoggingOut, handleLogout } = useLogoutAccount();
  const accountHeader = getAccountHeader(profile);
  const displayMobile = profile?.mobile ?? authSession?.mobile ?? "";

  return (
    <TopBarNavigationLayout
      activeKey="account"
      contentClassName="bg-[#f0f0f0] pb-4"
      frameClassName="bg-[#f0f0f0] text-[#1a1a1a] [direction:rtl]"
      hideTopBar
      topBar={<TopBar showBack={false} title="حساب من" />}
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

      <AccountSection actions={isLoggedIn ? businessActions : loggedOutBusinessActions} />

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
  color,
}: {
  className?: string;
  name: AccountIconName;
  color?: string
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
      {name === "building" ? (
        <>
          <path xmlns="http://www.w3.org/2000/svg" d="M8.4 21V9.3C8.4 8.80295 8.80295 8.4 9.3 8.4H15.6C16.0971 8.4 16.5 8.80295 16.5 9.3V21M11.55 12.0016H13.35M11.55 14.7008H13.35M11.55 17.4016L13.35 17.4M3.9 20.9947V12.8947C3.9 12.3977 4.30295 11.9947 4.8 11.9947H8.4M21 20.9895L3 21M12.9 8.37306V3L20.1 5.75523V21" stroke="#4D4D4D" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
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
