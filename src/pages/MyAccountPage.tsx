import { PageFrame } from "../app/PageFrame";
import { BottomNavigation } from "../components/BottomNavigation";
import { RouteLink } from "../routes/RouteLink";

type AccountAction = {
  label: string;
  icon: string;
};

const accountActions: AccountAction[] = [
  {
    label: "تایید هویت",
    icon: "/figma/account/identity.svg",
  },
  {
    label: "مشخصات من",
    icon: "/figma/account/user.svg",
  },
  {
    label: "آگهی‌های من",
    icon: "/figma/account/tag.svg",
  },
  {
    label: "نشان‌ها",
    icon: "/figma/account/bookmark.svg",
  },
  {
    label: "یادداشت‌ها",
    icon: "/figma/account/note.svg",
  },
  {
    label: "کیف پول",
    icon: "/figma/account/wallet.svg",
  },
  {
    label: "تنظیمات",
    icon: "/figma/account/setting.svg",
  },
];

export function MyAccountPage() {
  return (
    <PageFrame
      className="flex min-h-0 flex-col overflow-hidden bg-[#f5f5f5] text-[#1a1a1a]"
      variant="flush"
    >
      <header className="sticky top-0 z-10 shrink-0 bg-[#f0f0f0]">
        <div className="flex min-h-14 items-center justify-start py-1 pl-1 pr-4">
          <h1 className="m-0 flex-1 text-right text-base font-semibold leading-6 text-[#1a1a1a]">
            حساب من
          </h1>
        </div>
      </header>

      <main className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto overflow-x-hidden bg-[#f5f5f5]">
        <section
          className="flex w-full flex-col gap-0.5 bg-white pt-4 pb-0.5"
          aria-label="ورود"
        >
          <RouteLink
            className="mx-4 mt-2 mb-3 flex min-h-14 items-center gap-2 rounded-xl border border-[#0048c4] bg-white p-4 text-[#0048c4] focus-visible:outline-3 focus-visible:outline-offset-[-3px] focus-visible:outline-[#0048c440]"
            to="/login/phone"
          >
            <img
              className="block w-5 h-6 shrink-0 object-contain"
              src="/figma/account/lock.svg"
              alt=""
              aria-hidden="true"
            />
            <span className="min-w-0 flex-1 text-right text-base font-medium leading-6">
              ورود به حساب کاربری
            </span>
            <img
              className="block w-2 h-3 shrink-0 object-contain"
              src="/figma/account/arrow-left-primary.svg"
              alt=""
              aria-hidden="true"
            />
          </RouteLink>
          <p className="m-0 px-4 pb-3 text-right text-sm font-normal leading-5 text-[#4d4d4d]">
            برای استفاده از تمام امکانات وارد حساب کاربری خود شوید.
          </p>
          <Divider />
          <AccountMenuRow
            icon="/figma/account/add.svg"
            label="ایجاد کسب و کار"
          />
        </section>

        <section
          className="w-full flex-1 bg-white pt-0.5"
          aria-label="گزینه‌های حساب"
        >
          {accountActions.map((action, index) => (
            <AccountMenuRow
              hasDivider={index < accountActions.length - 1}
              icon={action.icon}
              key={action.label}
              label={action.label}
            />
          ))}
        </section>
      </main>

      <BottomNavigation activeKey="account" />
    </PageFrame>
  );
}

function AccountMenuRow({
  hasDivider = false,
  icon,
  label,
}: {
  hasDivider?: boolean;
  icon: string;
  label: string;
}) {
  return (
    <>
      <button
        className="flex min-h-[60px] w-full cursor-pointer items-center justify-start gap-2 bg-white p-4 text-[#1a1a1a] focus-visible:outline-3 focus-visible:outline-offset-[-3px] focus-visible:outline-[#0048c440]"
        type="button"
      >
        <img
          className="block w-5 h-5 shrink-0 object-contain"
          src={icon}
          alt=""
          aria-hidden="true"
        />
        <span className="min-w-0 flex-1 text-right text-base font-medium leading-6 text-[#1a1a1a]">
          {label}
        </span>
        <img
          className="block w-2 h-3 shrink-0 object-contain"
          src="/figma/account/arrow-left.svg"
          alt=""
          aria-hidden="true"
        />
      </button>
      {hasDivider ? <Divider /> : null}
    </>
  );
}

function Divider() {
  return (
    <img
      className="mx-4 block h-px w-[calc(100%-32px)] object-fill"
      src="/figma/account/divider.svg"
      alt=""
      aria-hidden="true"
    />
  );
}
