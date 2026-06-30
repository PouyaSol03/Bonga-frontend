import { useState } from "react";

import { PageFrame } from "../../app/PageFrame";
import { TopBar } from "../../components/TopBar";

function navigateTo(path: string) {
  window.history.pushState({}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

function ConfirmCheckIcon({ checked }: { checked: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`grid h-[18px] w-[18px] shrink-0 place-items-center rounded-[4px] border ${checked ? "border-[#0048C4] bg-[#0048C4]" : "border-[#808080] bg-white"
        }`}
    >
      {checked ? (
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 20 20">
          <path
            d="M4.5 10.2l3.4 3.4 7.6-8"
            stroke="white"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
          />
        </svg>
      ) : null}
    </span>
  );
}

export function AccountDeleteUserPage() {
  const [isConfirmed, setIsConfirmed] = useState(false);

  return (
    <PageFrame
      className="relative flex min-h-0 flex-col overflow-hidden bg-[#f0f0f0] text-[#1a1a1a] [direction:rtl]"
      variant="flush"
    >
      <TopBar backTo="/account" title="حذف حساب کاربری" />

      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-white pb-[92px] pt-6">
        <section className="px-4 text-right">
          <h1 className="m-0 text-base font-medium leading-6 text-[#1a1a1a]">
            آیا از حذف این کسب‌وکار مطمئن هستید؟
          </h1>
          <p className="m-0 mt-4 text-sm font-normal mb-2.5 text-[#4d4d4d]">
            برای حذف این کسب و کار همه موارد زیر را به دقت مطالعه کنید:
          </p>

          <div className="rounded-2xl border border-[#808080] bg-[#80808014] p-4">
            <p className="m-0 text-sm text-[#1A1A1A]">
              با حذف کسب‌وکار، تمامی اطلاعات، آگهی‌ها، مشاوران، فایل‌ها، یادداشت‌ها و سایر داده‌های مرتبط با این کسب‌وکار به‌صورت دائمی حذف خواهند شد و امکان بازیابی آن‌ها وجود نخواهد داشت.
            </p>
          </div>

          <button
            className="mt-4 flex w-full items-center gap-3 text-right !text-sm font-medium leading-6 text-[#1a1a1a]"
            onClick={() => setIsConfirmed((value) => !value)}
            type="button"
          >
            <ConfirmCheckIcon checked={isConfirmed} />
            <span>تمامی موارد فوق را تایید میکنم</span>
          </button>
        </section>
      </main>

      <footer className="absolute inset-x-0 bottom-0 z-20 bg-white px-4 pb-[max(0.875rem,env(safe-area-inset-bottom,0px))] pt-3 shadow-[0_-4px_16px_rgba(26,26,26,0.08)]">
        <div className="grid grid-cols-2 gap-4" dir="ltr">
          <button
            className="inline-flex h-10 items-center justify-center rounded-[10px] border border-[#C11004] bg-white px-4 text-sm font-semibold leading-5 text-[#C11004] disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!isConfirmed}
            onClick={() => navigateTo("/login/phone")}
            type="button"
          >
            تایید حذف
          </button>
          <button
            className="inline-flex h-10 items-center justify-center rounded-[10px] border border-[#CCCCCC] bg-white px-4 text-sm font-semibold leading-5 text-[#1a1a1a]"
            onClick={() => navigateTo("/account")}
            type="button"
          >
            انصراف
          </button>
        </div>
      </footer>
    </PageFrame>
  );
}
