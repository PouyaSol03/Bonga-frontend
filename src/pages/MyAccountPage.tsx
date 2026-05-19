import { PageFrame } from "../app/PageFrame";
import { BottomNavigation } from "../components/BottomNavigation";
import { RouteLink } from "../routes/RouteLink";

type AccountAction = {
  icon: AccountIconName;
  label: string;
  to?: string;
};

type AccountIconName =
  | "agency"
  | "article"
  | "bookmark"
  | "building"
  | "eye"
  | "identity"
  | "info"
  | "legal"
  | "lock"
  | "note"
  | "plus"
  | "request"
  | "setting"
  | "tag"
  | "user"
  | "wallet";

const businessActions: AccountAction[] = [
  { icon: "user", label: "مشاور مستقل" },
  { icon: "building", label: "مشاور آژانس جلیلیان" },
];

const loggedOutBusinessActions: AccountAction[] = [
  { icon: "plus", label: "ایجاد کسب و کار" },
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
  { icon: "setting", label: "تنظیمات" },
  { icon: "info", label: "درباره ما", to: "/account/about" },
  { icon: "legal", label: "ضوابط و قوانین" },
  { icon: "article", label: "مقالات تخصصی املاک" },
];

const loggedOutSecondaryActions: AccountAction[] = [
  { icon: "setting", label: "تنظیمات" },
];

export function MyAccountPage() {
  const isLoggedInUnverified = getAccountState() === "logged-in-unverified";

  return (
    <PageFrame
      className="flex min-h-0 flex-col overflow-hidden bg-[#f0f0f0] text-[#1a1a1a] [direction:rtl]"
      variant="flush"
    >
      <header className="sticky top-0 z-10 h-14 shrink-0 bg-[#f0f0f0]">
        <div className="flex h-full items-center px-4">
          <h1 className="m-0 flex-1 text-right text-base font-semibold leading-6 text-[#1a1a1a]">
            حساب من
          </h1>
        </div>
      </header>

      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-[#f0f0f0] pb-4">
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
                0915 521 4062
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
      </main>

      <BottomNavigation activeKey="account" />
    </PageFrame>
  );
}

function getAccountState() {
  const historyState = window.history.state as { accountState?: string; state?: string } | null;

  if (
    historyState?.state === "new" ||
    historyState?.accountState === "logged-in-unverified" ||
    window.sessionStorage.getItem("bonga-account-state") === "logged-in-unverified"
  ) {
    return "logged-in-unverified";
  }

  return "logged-out";
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

function AccountSection({ actions }: { actions: AccountAction[] }) {
  return (
    <section className="bg-white" aria-label="گزینه‌های حساب">
      {actions.map((action, index) => (
        <AccountMenuRow
          action={action}
          hasDivider={index < actions.length - 1}
          key={action.label}
        />
      ))}
    </section>
  );
}

function AccountMenuRow({
  action,
  hasDivider = false,
}: {
  action: AccountAction;
  hasDivider?: boolean;
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
          type="button"
        >
          {content}
        </button>
      )}
      {hasDivider ? <Divider /> : null}
    </>
  );
}

function Divider() {
  return <div className="mx-4 h-px bg-[#cccccc]" aria-hidden="true" />;
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
    </svg>
  );
}
